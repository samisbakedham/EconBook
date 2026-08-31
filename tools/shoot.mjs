#!/usr/bin/env node
// Screenshots the local site at a set of scroll offsets. A build aid, not part
// of the site: it is how the figures get checked without eyeballing HTML.
//
//   node tools/shoot.mjs <url> <outDir> [offset ...]

import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { launchChrome } from './lib/chrome.mjs';

const [url, outDir, ...offsets] = process.argv.slice(2);
const stops = offsets.length ? offsets.map(Number) : [0];

const browser = await launchChrome();
const page = await browser.newPage();
await page.send('Emulation.setDeviceMetricsOverride', {
  width: 1280, height: 900, deviceScaleFactor: 1, mobile: false,
});

const loaded = page.once('Page.loadEventFired');
await page.send('Page.navigate', { url });
await loaded;
await page.send('Runtime.evaluate', {
  expression: 'document.fonts.ready.then(() => true)', awaitPromise: true,
});
// Settle the reveal animations so figures are captured in their final state.
await page.send('Runtime.evaluate', {
  expression: `document.documentElement.style.scrollBehavior='auto';
    document.querySelectorAll('[data-reveal]').forEach(e=>e.classList.add('is-in'));
    new Promise(r=>setTimeout(r,1800))`,
  awaitPromise: true,
});

await mkdir(outDir, { recursive: true });
for (const y of stops) {
  await page.send('Runtime.evaluate', { expression: `window.scrollTo(0, ${y})` });
  await new Promise((r) => setTimeout(r, 450));
  const { data } = await page.send('Page.captureScreenshot', { format: 'png' });
  const file = path.join(outDir, `y${String(y).padStart(5, '0')}.png`);
  await writeFile(file, Buffer.from(data, 'base64'));
  console.log(file);
}

await browser.close();
