#!/usr/bin/env node
// Builds the static site into web/. No Chrome and no dependencies, so this is
// the command Vercel runs on deploy.
//
//   node tools/build-web.mjs

import { mkdir, writeFile, readdir, copyFile, rm, stat } from 'node:fs/promises';
import path from 'node:path';

import { loadBook, ROOT } from './lib/book.mjs';
import { homePage, contentsPage, chapterPage, notesPage, downloads } from './site/pages.mjs';

const WEB = path.join(ROOT, 'web');
const BUILD = path.join(ROOT, 'build');

const FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#08090c"/>
  <g fill="#e0a44a">
    <rect x="10" y="12" width="5" height="40"/>
    <rect x="20" y="26" width="5" height="26"/>
    <rect x="30" y="36" width="5" height="16"/>
    <rect x="40" y="43" width="5" height="9"/>
    <rect x="50" y="47" width="5" height="5"/>
  </g>
</svg>`;

const exists = (p) => stat(p).then(() => true, () => false);

async function copyDownloads() {
  const dest = path.join(WEB, 'downloads');
  await mkdir(dest, { recursive: true });

  let copied = 0;
  for (const dir of ['book', 'ssrn']) {
    const src = path.join(BUILD, dir);
    if (!(await exists(src))) continue;
    for (const file of await readdir(src)) {
      if (/\.(pdf|epub|md|png)$/.test(file)) {
        await copyFile(path.join(src, file), path.join(dest, file));
        copied++;
      }
    }
  }
  return copied;
}

function sitemap(book) {
  const urls = [
    '/', '/read', '/notes',
    ...book.chapters.map((c) => `/chapters/${c.slug}`),
  ];
  const today = new Date().toISOString().slice(0, 10);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${book.meta.siteUrl}${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>`;
}

async function main() {
  const book = await loadBook();

  await rm(path.join(WEB, 'chapters'), { recursive: true, force: true });
  await mkdir(path.join(WEB, 'chapters'), { recursive: true });

  await writeFile(path.join(WEB, 'index.html'), homePage(book));
  await writeFile(path.join(WEB, 'read.html'), contentsPage(book));
  await writeFile(path.join(WEB, 'notes.html'), notesPage(book));
  for (const c of book.chapters) {
    await writeFile(path.join(WEB, 'chapters', `${c.slug}.html`), chapterPage(book, c));
  }

  await writeFile(path.join(WEB, 'favicon.svg'), FAVICON);
  await writeFile(path.join(WEB, 'sitemap.xml'), sitemap(book));
  await writeFile(
    path.join(WEB, 'robots.txt'),
    `User-agent: *\nAllow: /\nSitemap: ${book.meta.siteUrl}/sitemap.xml\n`
  );

  const copied = await copyDownloads();

  console.log(`  index.html, read.html, notes.html`);
  console.log(`  chapters/           ${book.chapters.length} pages`);
  console.log(`  downloads/          ${copied} file${copied === 1 ? '' : 's'}${copied ? '' : ' (run build:book and build:ssrn first)'}`);
  console.log(`  sitemap.xml, robots.txt, favicon.svg`);

  const missing = [];
  for (const d of downloads) {
    if (!(await exists(path.join(WEB, d.href.replace(/^\//, ''))))) missing.push(d.href);
  }
  if (missing.length) console.warn(`  ! links with no file yet: ${missing.join(', ')}`);
}

main().catch((err) => { console.error(err); process.exit(1); });
