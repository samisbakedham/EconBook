// Headless Chrome over the DevTools Protocol, with no npm dependencies.
// Node 22+ ships a global WebSocket, which is all a print job needs.
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const CANDIDATES = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);

function findChrome() {
  const found = CANDIDATES.find((p) => existsSync(p));
  if (!found) {
    throw new Error(
      'No Chrome or Chromium found. Set CHROME_PATH to a browser binary and re-run.'
    );
  }
  return found;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

class Session {
  constructor(ws, sessionId) {
    this.ws = ws;
    this.sessionId = sessionId;
  }
  send(method, params = {}) {
    return this.ws.call(method, params, this.sessionId);
  }
  once(event) {
    return this.ws.once(event, this.sessionId);
  }
}

class Connection {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.waiters = [];
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id != null && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        msg.error ? reject(new Error(`${msg.error.message} (${msg.error.code})`)) : resolve(msg.result);
        return;
      }
      if (msg.method) {
        for (const w of [...this.waiters]) {
          if (w.event === msg.method && (!w.sessionId || w.sessionId === msg.sessionId)) {
            this.waiters.splice(this.waiters.indexOf(w), 1);
            w.resolve(msg.params);
          }
        }
      }
    });
  }
  call(method, params = {}, sessionId) {
    const id = ++this.id;
    const payload = { id, method, params };
    if (sessionId) payload.sessionId = sessionId;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify(payload));
    });
  }
  once(event, sessionId) {
    return new Promise((resolve) => this.waiters.push({ event, sessionId, resolve }));
  }
}

export async function launchChrome() {
  const bin = findChrome();
  const userDataDir = await mkdtemp(path.join(tmpdir(), 'tv-chrome-'));
  const child = spawn(
    bin,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
      '--disable-background-networking',
      '--hide-scrollbars',
      '--allow-file-access-from-files',
      '--force-color-profile=srgb',
      '--font-render-hinting=none',
      `--user-data-dir=${userDataDir}`,
      '--remote-debugging-port=0',
      'about:blank',
    ],
    { stdio: ['ignore', 'ignore', 'pipe'] }
  );

  const portFile = path.join(userDataDir, 'DevToolsActivePort');
  let port = null;
  for (let i = 0; i < 200 && port === null; i++) {
    await sleep(50);
    try {
      const text = await readFile(portFile, 'utf8');
      const first = text.split('\n')[0].trim();
      if (first) port = Number(first);
    } catch { /* not written yet */ }
  }
  if (!port) {
    child.kill();
    throw new Error('Chrome did not report a debugging port.');
  }

  const version = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json();
  const socket = new WebSocket(version.webSocketDebuggerUrl, { maxPayload: 512 * 1024 * 1024 });
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });
  const conn = new Connection(socket);

  return {
    conn,
    async newPage() {
      const { targetId } = await conn.call('Target.createTarget', { url: 'about:blank' });
      const { sessionId } = await conn.call('Target.attachToTarget', { targetId, flatten: true });
      const page = new Session(conn, sessionId);
      await page.send('Page.enable');
      return page;
    },
    async close() {
      try { await conn.call('Browser.close'); } catch { /* already gone */ }
      socket.close();
      // Wait for the process to actually exit; Chrome is still flushing its
      // profile directory until then, and removing it early races.
      await new Promise((resolve) => {
        if (child.exitCode !== null) return resolve();
        const timer = setTimeout(() => { child.kill('SIGKILL'); resolve(); }, 4000);
        child.once('exit', () => { clearTimeout(timer); resolve(); });
      });
      await rm(userDataDir, { recursive: true, force: true }).catch(() => {});
    },
  };
}

async function loadInto(page, html, tmpHtmlPath) {
  await writeFile(tmpHtmlPath, html);
  const loaded = page.once('Page.loadEventFired');
  await page.send('Page.navigate', { url: 'file://' + tmpHtmlPath });
  await loaded;
  // Give webfonts and layout a beat to settle before measuring pages.
  await page.send('Runtime.evaluate', {
    expression: 'document.fonts ? document.fonts.ready.then(() => true) : true',
    awaitPromise: true,
  });
  await sleep(350);
}

/**
 * Renders an HTML string to PDF. Page size comes from the document's own
 * @page rule so the print CSS stays the single place trim size is defined.
 */
export async function htmlToPdf(browser, html, { tmpHtmlPath, header, footer, margin }) {
  const page = await browser.newPage();
  await loadInto(page, html, tmpHtmlPath);

  const opts = {
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: Boolean(header || footer),
    headerTemplate: header || '<span></span>',
    footerTemplate: footer || '<span></span>',
  };
  if (margin) Object.assign(opts, margin);

  const { data } = await page.send('Page.printToPDF', opts);
  await browser.conn.call('Target.closeTarget', { targetId: (await page.send('Page.getFrameTree')).frameTree.frame.id }).catch(() => {});
  return Buffer.from(data, 'base64');
}

/** Renders an HTML string to a PNG at a fixed pixel size. Used for the cover. */
export async function htmlToPng(browser, html, { tmpHtmlPath, width, height, scale = 1 }) {
  const page = await browser.newPage();
  await page.send('Emulation.setDeviceMetricsOverride', {
    width, height, deviceScaleFactor: scale, mobile: false,
  });
  await loadInto(page, html, tmpHtmlPath);
  const { data } = await page.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false,
  });
  return Buffer.from(data, 'base64');
}
