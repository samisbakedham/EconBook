#!/usr/bin/env node
// Local preview for web/. Mirrors Vercel's cleanUrls behaviour so links that
// work here work after deploy.
//
//   node tools/serve.mjs [port]

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const WEB = fileURLToPath(new URL('../web/', import.meta.url));
const port = Number(process.argv[2] || 4321);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.epub': 'application/epub+zip',
  '.md': 'text/markdown; charset=utf-8',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
};

const exists = (p) => stat(p).then((s) => s.isFile(), () => false);

createServer(async (req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const base = path.join(WEB, url.replace(/^\/+/, ''));

  const candidates = url.endsWith('/')
    ? [path.join(base, 'index.html')]
    : [base, `${base}.html`, path.join(base, 'index.html')];

  for (const file of candidates) {
    if (!file.startsWith(WEB) || !(await exists(file))) continue;
    const body = await readFile(file);
    res.writeHead(200, {
      'content-type': TYPES[path.extname(file)] || 'application/octet-stream',
      'cache-control': 'no-store',
    });
    return res.end(body);
  }

  res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
  res.end('<h1>404</h1>');
}).listen(port, () => console.log(`web/ on http://localhost:${port}`));
