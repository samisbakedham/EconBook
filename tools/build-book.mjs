#!/usr/bin/env node
// Builds the trade edition: a 6 x 9 print interior PDF, an EPUB 3, a cover,
// and the combined Markdown that Leanpub and pandoc consume.
//
//   node tools/build-book.mjs
//
// Requires Google Chrome (or CHROME_PATH). If poppler's `pdfunite` is present
// the front matter is printed without folios, as a book should be; without it
// the interior is produced in a single pass and folios run throughout.

import { mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { loadBook, ROOT } from './lib/book.mjs';
import { renderBlocks, openingParagraph, escapeHtml, smarten } from './lib/md.mjs';
import { embeddedFontCss } from './lib/fonts.mjs';
import { bookCss } from './lib/print-css.mjs';
import { launchChrome, htmlToPdf, htmlToPng } from './lib/chrome.mjs';
import { recto, countPages } from './lib/paginate.mjs';
import { coverHtml } from './lib/cover.mjs';
import { buildEpub } from './lib/epub.mjs';

const run = promisify(execFile);
const OUT = path.join(ROOT, 'build', 'book');

const ROMAN = { 1: 'One', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five', 6: 'Six',
  7: 'Seven', 8: 'Eight', 9: 'Nine', 10: 'Ten', 11: 'Eleven', 12: 'Twelve' };

export const EPIGRAPHS = [
  {
    text: 'We do not discount later enjoyments in comparison with earlier ones, a practice which is ethically indefensible and arises merely from the weakness of the imagination.',
    cite: 'F. P. Ramsey, 1928',
  },
  {
    text: 'A new scientific truth does not triumph by convincing its opponents.',
    cite: 'Max Planck, 1949',
  },
];

/* ------------------------------------------------------------------ pages */

function frontMatterHtml(book, cssHref) {
  const { meta, parts, notes } = book;
  const year = meta.year;

  const contentsRows = (list) =>
    list
      .map(
        (part) => `
      <p class="part-line">Part ${part.n} &middot; ${escapeHtml(part.title)}</p>
      <ol>${part.items
        .map((c) => `<li><span class="n">${c.n}</span><span class="t">${escapeHtml(c.title)}</span></li>`)
        .join('')}</ol>`
      )
      .join('');

  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>${escapeHtml(meta.title)}</title><link rel="stylesheet" href="${cssHref}"></head><body>

<section class="page"><div class="plate center"><p class="halftitle">${escapeHtml(meta.title)}</p></div></section>
<section class="page"></section>

<section class="page titlepage"><div class="plate center">
  <h1>Terminal<br>Value</h1>
  <div class="rule"></div>
  <p class="sub">${escapeHtml(meta.subtitle)}</p>
  <p class="author">${escapeHtml(meta.author)}</p>
  <p class="imprint">First edition</p>
</div></section>

<section class="page"><div class="plate end copyright">
  <p class="title-line">${escapeHtml(meta.title)}: ${escapeHtml(meta.subtitle)}</p>
  <p>Copyright &copy; ${year} ${escapeHtml(meta.author)}. All rights reserved.</p>
  <p>First edition. Set in Fraunces and Newsreader.</p>
  <p>The manuscript, the notes and the build tooling that produced this volume are public at ${escapeHtml(meta.repo)}. Corrections are welcome and will be recorded rather than quietly applied.</p>
  <p>This is a complete draft. Of the factual claims in this book, fifty one have been checked against sources and twenty have not. Every claim carries its verification status in the notes at the back.</p>
  <p>Nothing here is investment advice.</p>
</div></section>

<section class="page"><div class="plate center"><div class="epigraph">
  ${EPIGRAPHS.map((e) => `<blockquote><p>${smarten(escapeHtml(e.text))}</p><cite>${escapeHtml(e.cite)}</cite></blockquote>`).join('\n')}
</div></div></section>
<section class="page"></section>

<section class="page contents">
  <h2>Contents</h2>
  ${contentsRows(parts.slice(0, 2))}
</section>

<section class="page contents">
  ${contentsRows(parts.slice(2))}
  <p class="part-line">Back matter</p>
  <ol><li><span class="n"></span><span class="t">${escapeHtml(notes.title)}</span></li></ol>
</section>

<section class="page frontnote">
  <h2>On the state of this text</h2>
  <p>This book argues that mortality is load bearing economic infrastructure. It performs five functions that nothing else performs, and radical life extension removes all five at once.</p>
  <p>It is a complete draft rather than a finished book, and it is published in that condition on purpose. Fifty one of its factual claims have been checked against sources. Twenty have not, and each is marked. Six items are the author's own calculation or argument rather than a reported finding, and are flagged as such where they appear.</p>
  <p>Seven claims were found wrong or overstated during verification and were corrected. They are recorded in the notes rather than quietly fixed, because a reader is entitled to know which way an author's errors run.</p>
  <p>Two load bearing items remain unsourced and should be read by someone who knows the literature: the treatment of transversality conditions in Chapter 1, and the claim in Chapter 12 that perpetual foundations reliably fail in one of two directions.</p>
  <p>If you find an error, the notes are where to look first, and the author would like to hear about it.</p>
</section>
<section class="page"></section>

</body></html>`;
}

/** The body as an ordered list of sections, each of which opens on a recto. */
function bodySections(book) {
  const { parts, notes, meta } = book;
  const out = [];

  const chapterSection = (c) => `
<section class="chapter">
  <header>
    <p class="num">Chapter ${ROMAN[c.n] || c.n}</p>
    <h2>${escapeHtml(c.title)}</h2>
    <div class="flourish"></div>
  </header>
  ${renderBlocks(c.blocks, { shift: 1, firstParagraph: openingParagraph })}
</section>`;

  for (const p of parts) {
    out.push(`
<section class="part"><div class="inner">
  <p class="num">Part ${p.n}</p>
  <h2>${escapeHtml(p.title)}</h2>
  <p class="blurb">${smarten(escapeHtml(p.blurb))}</p>
</div></section>`);
    for (const c of p.items) out.push(chapterSection(c));
  }

  out.push(`
<section class="chapter notes">
  <header>
    <p class="num">Back matter</p>
    <h2>Notes</h2>
    <div class="flourish"></div>
  </header>
  ${renderBlocks(notes.blocks, { shift: 1 })}
</section>`);

  out.push(`
<section class="colophon"><div class="plate center">
  <p class="mark">&#167;</p>
  <p>Set in Fraunces and Newsreader.<br>Composed from Markdown by a build script, not by hand.</p>
  <p>${escapeHtml(meta.repo)}</p>
</div></section>`);

  return out;
}

const bodyWrap = (title, cssHref) => (inner) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>${escapeHtml(title)}</title><link rel="stylesheet" href="${cssHref}"></head><body>
${inner}
</body></html>`;

/* ---------------------------------------------------------------- markdown */

async function combinedMarkdown(book) {
  const { meta, parts, notes } = book;
  const out = [
    '---',
    `title: "${meta.title}: ${meta.subtitle}"`,
    `author: "${meta.author}"`,
    `date: "${meta.year}"`,
    'lang: en-GB',
    '---',
    '',
    `# ${meta.title}`,
    '',
    `### ${meta.subtitle}`,
    '',
    `**${meta.author}**`,
    '',
  ];

  for (const e of EPIGRAPHS) out.push(`> ${e.text}`, '>', `> *${e.cite}*`, '');

  for (const part of parts) {
    out.push(`\n\\newpage\n`, `# Part ${part.n}. ${part.title}`, '', `*${part.blurb}*`, '');
    for (const c of part.items) {
      const raw = await readFile(path.join(ROOT, 'manuscript', c.file), 'utf8');
      out.push('\n\\newpage\n', raw.replace(/^# Chapter (\d+)\s*\n/, '').trimEnd(), '');
    }
  }
  out.push('\n\\newpage\n', (await readFile(path.join(ROOT, 'manuscript', notes.file), 'utf8')).trimEnd(), '');
  return out.join('\n');
}

/* ------------------------------------------------------------------- main */

async function haveTool(name) {
  try { await run('which', [name]); return true; } catch { return false; }
}

async function main() {
  const book = await loadBook();
  await mkdir(OUT, { recursive: true });
  const tmp = await mkdtemp(path.join(tmpdir(), 'tv-book-'));

  // The typefaces go to a file rather than inline: Chrome caches them across
  // the many measuring passes below, which turns a slow build into a quick one.
  const fontCss = await embeddedFontCss();
  await writeFile(path.join(tmp, 'print.css'), fontCss + '\n' + bookCss());
  const cssHref = 'file://' + path.join(tmp, 'print.css');

  const md = await combinedMarkdown(book);
  await writeFile(path.join(OUT, 'terminal-value.md'), md);
  console.log(`  terminal-value.md                ${md.split(/\s+/).length.toLocaleString()} words`);

  const browser = await launchChrome();
  try {
    const cover = await htmlToPng(browser, coverHtml({ meta: book.meta, fontCss }), {
      tmpHtmlPath: path.join(tmp, 'cover.html'), width: 1800, height: 2700,
    });
    await writeFile(path.join(OUT, 'terminal-value-cover.png'), cover);
    console.log('  terminal-value-cover.png         1800 x 2700 (300 dpi at 6 x 9)');

    const folio = `<div style="width:100%;margin:0 0.68in;font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:8px;letter-spacing:.12em;color:#8a8780;text-align:center"><span class="pageNumber"></span></div>`;

    const front = await htmlToPdf(browser, frontMatterHtml(book, cssHref), {
      tmpHtmlPath: path.join(tmp, 'front.html'),
    });
    const frontPages = countPages(front);
    if (frontPages % 2) {
      console.warn(`  ! front matter is ${frontPages} pages (odd); Part I will open on a verso`);
    }

    process.stdout.write('  laying out body ');
    const sections = bodySections(book);
    let renders = 0;
    const { html: bodyDoc, pads, pages: bodyPages } = await recto({
      sections,
      wrap: bodyWrap(book.meta.title, cssHref),
      render: async (html) => {
        renders++;
        process.stdout.write('.');
        return htmlToPdf(browser, html, {
          tmpHtmlPath: path.join(tmp, `measure.html`), footer: folio, header: '<span></span>',
        });
      },
      startsOnRecto: frontPages % 2 === 0,
    });
    process.stdout.write(`  ${renders} passes, ${pads} blank leaves inserted\n`);

    const body = await htmlToPdf(browser, bodyDoc, {
      tmpHtmlPath: path.join(tmp, 'body.html'), footer: folio, header: '<span></span>',
    });

    const interior = path.join(OUT, 'terminal-value-interior-6x9.pdf');
    if (await haveTool('pdfunite')) {
      const a = path.join(tmp, 'a.pdf'), b = path.join(tmp, 'b.pdf');
      await writeFile(a, front); await writeFile(b, body);
      await run('pdfunite', [a, b, interior]);
      const size = (await readFile(interior)).length;
      console.log(`  terminal-value-interior-6x9.pdf  ${frontPages + countPages(body)} pages (${frontPages} unnumbered front matter)  ${(size / 1e6).toFixed(1)} MB`);
    } else {
      await writeFile(interior, body);
      await writeFile(path.join(OUT, 'terminal-value-frontmatter.pdf'), front);
      console.log('  ! pdfunite not found: front matter and body written as separate PDFs.');
      console.log('    brew install poppler   to get one merged interior.');
    }

    await buildEpub({ book, out: path.join(OUT, 'terminal-value.epub'), cover });
    console.log('  terminal-value.epub              EPUB 3, embedded fonts and cover');
  } finally {
    await browser.close();
    await rm(tmp, { recursive: true, force: true });
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
