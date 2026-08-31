#!/usr/bin/env node
// Builds the SSRN working paper: one PDF, plus the paste-ready metadata the
// submission form asks for.
//
//   node tools/build-ssrn.mjs

import { mkdir, writeFile, rm, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { loadBook, ROOT } from './lib/book.mjs';
import { renderBlocks, escapeHtml, smarten, inlineMd } from './lib/md.mjs';
import { embeddedFontCss } from './lib/fonts.mjs';
import { ssrnCss } from './lib/ssrn-css.mjs';
import { launchChrome, htmlToPdf } from './lib/chrome.mjs';
import { countPages } from './lib/paginate.mjs';

const OUT = path.join(ROOT, 'build', 'ssrn');

export const submission = {
  affiliation: 'Independent',
  contact: 'samsafahi@gmail.com',
  keywords: [
    'longevity', 'discount rate', 'time preference', 'inheritance',
    'wealth concentration', 'creative destruction', 'value of statistical life',
    'artificial agents', 'institutional design', 'intergenerational equity',
  ],
  jel: [
    ['E43', 'Interest Rates: Determination, Term Structure, and Effects'],
    ['J11', 'Demographic Trends, Macroeconomic Effects of Population Change'],
    ['D31', 'Personal Income, Wealth, and Their Distributions'],
    ['J17', 'Value of Life; Forgone Income'],
    ['O33', 'Technological Change: Choices and Consequences; Diffusion Processes'],
    ['K11', 'Property Law'],
    ['D15', 'Intertemporal Household Choice; Life Cycle Models and Saving'],
  ],
  abstract: [
    'Economic models treat human mortality as a boundary condition rather than a variable. This is defensible as long as the parameter does not move, and for the entire history of the discipline it has not: while life expectancy at birth has roughly doubled since 1850, the maximum human lifespan has not measurably changed. This paper argues that mortality performs at least five distinct economic functions, that none of them has an institutional substitute, and that a sustained increase in healthy lifespan would remove all five simultaneously.',
    'The five functions are: (1) mortality supplies the hazard term in the effective discount rate, so that falling mortality mechanically compresses real rates and drives the present value of perpetual assets toward divergence; (2) inheritance constitutes the largest recurring redistribution in a market economy, interrupting the compounding that would otherwise make r > g a fixed point rather than a drift; (3) the vacation of positions of intellectual authority permits paradigm turnover, an effect measured empirically in the literature on the premature death of eminent scientists; (4) willingness to accept mortality risk scales with remaining life-years and with wealth, so that the risk premium demanded for frontier activity rises without bound as both increase; and (5) exit from positions generates the vacancy chains through which career mobility occurs.',
    'The paper further argues that artificial agents constitute the first economic actors with arbitrary, designer-specified lifespans, and that the turnover functions above may migrate to them, producing a permanent asset-holding human population alongside a mortal artificial workforce that bears risk and establishes presence on any frontier. Property doctrines that assign title on the basis of occupation, combined with communication latency that makes remote supervision physically impossible, suggest a principal-agent problem with historical precedent in the chartered trading companies.',
    'The paper concludes that institutions performing these five functions must be constructed deliberately, that each takes the form of converting a perpetual claim into a renewable term, and that the window for adopting them closes when the affected parties can identify their own position, since mortality is the mechanism that currently enforces something like a Rawlsian veil of ignorance in institutional design.',
  ],
};

/** Chapters become numbered sections; their subheads get n.m numbering. */
function sectionHtml(chapter) {
  let sub = 0;
  const parts = [`<h2 class="section" id="s${chapter.n}"><span class="n">${chapter.n}.</span>${escapeHtml(chapter.title)}</h2>`];

  for (const b of chapter.blocks) {
    if (b.type === 'heading' && b.level === 3) {
      sub += 1;
      parts.push(`<h3><span class="n">${chapter.n}.${sub}</span>${inlineMd(b.text)}</h3>`);
    } else {
      parts.push(renderBlocks([b], { shift: 1 }));
    }
  }
  return parts.join('\n');
}

function paperHtml(book, cssHref, { date }) {
  const { meta, parts, notes } = book;
  const s = submission;

  const body = parts
    .map(
      (p) =>
        `<p class="partline">Part ${p.n} &middot; ${escapeHtml(p.title)}</p>\n` +
        p.items.map(sectionHtml).join('\n')
    )
    .join('\n');

  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>${escapeHtml(meta.title)}</title><link rel="stylesheet" href="${cssHref}"></head><body>

<div class="titleblock">
  <h1>${escapeHtml(meta.title)}</h1>
  <p class="sub">${escapeHtml(meta.subtitle)}</p>
  <p class="author">${escapeHtml(meta.author)}</p>
  <p class="affil">${escapeHtml(s.affiliation)}</p>
  <p class="affil">${escapeHtml(s.contact)}</p>
  <p class="date">Working paper &middot; ${escapeHtml(date)}</p>
</div>

<div class="abstract">
  <h2>Abstract</h2>
  ${s.abstract.map((p) => `<p>${smarten(escapeHtml(p))}</p>`).join('\n  ')}
</div>

<div class="meta">
  <p><span class="label">Keywords</span> &nbsp;${s.keywords.map(escapeHtml).join(', ')}</p>
  <p><span class="label">JEL classification</span> &nbsp;${s.jel.map(([c]) => `<code>${c}</code>`).join(', ')}</p>
  <p><span class="label">Status</span> &nbsp;Complete draft. Fifty one claims verified against sources, twenty not; each is marked in the notes.</p>
  <p><span class="label">Source</span> &nbsp;${escapeHtml(meta.repo)}</p>
</div>

<hr class="rulewide">

${body}

<section class="notes">
  <h2>Notes</h2>
  <p>This paper carries its citations as endnotes grouped by section rather than as inline markers. Items marked <strong>[verified]</strong> have been checked against a source. Items marked <strong>[unverified]</strong> are written from memory and still need checking. Items marked <strong>[my calculation]</strong> are arithmetic performed by the author rather than a reported finding.</p>
  ${renderBlocks(notes.blocks.filter((b) => !(b.type === 'p' && b.text.startsWith('Items marked'))), { shift: 1 })}
</section>

</body></html>`;
}

function submissionNotes(book, pages) {
  const s = submission;
  return `# SSRN submission pack

Generated by \`tools/build-ssrn.mjs\`. Everything below is paste ready.

- **PDF to upload:** \`build/ssrn/terminal-value-ssrn.pdf\` (${pages} pages, US Letter)
- **Plain text abstract:** \`build/ssrn/abstract.txt\`

## Title

${book.meta.title}: ${book.meta.subtitle}

## Author

${book.meta.author}, ${s.affiliation}. ${s.contact}

## Abstract

${s.abstract.join('\n\n')}

## Keywords

${s.keywords.join(', ')}

## JEL classification codes

${s.jel.map(([c, t]) => `- **${c}** ${t}`).join('\n')}

## Before you submit

SSRN's readership checks citations, so the twenty open attributions in the notes
are the exposure. A reviewer in this audience will go straight to the treatment
of transversality conditions in Section 1, which is the load bearing claim that
is not yet sourced. The second is the claim in Section 12 that perpetual
foundations reliably fail in one of two directions.

Neither is likely to be wrong. Both are currently unsupported, and this is the
audience that will notice.
`;
}

async function main() {
  const book = await loadBook();
  await mkdir(OUT, { recursive: true });
  const tmp = await mkdtemp(path.join(tmpdir(), 'tv-ssrn-'));

  const date = new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  await writeFile(path.join(tmp, 'paper.css'), (await embeddedFontCss()) + '\n' + ssrnCss);
  const cssHref = 'file://' + path.join(tmp, 'paper.css');

  await writeFile(path.join(OUT, 'abstract.txt'), submission.abstract.join('\n\n') + '\n');

  const browser = await launchChrome();
  try {
    const pdf = await htmlToPdf(browser, paperHtml(book, cssHref, { date }), {
      tmpHtmlPath: path.join(tmp, 'paper.html'),
      header: '<span></span>',
      footer: `<div style="width:100%;margin:0 1.05in;font-family:'Newsreader',serif;font-size:9px;color:#666;text-align:center"><span class="pageNumber"></span></div>`,
    });
    const pages = countPages(pdf);
    await writeFile(path.join(OUT, 'terminal-value-ssrn.pdf'), pdf);
    await writeFile(path.join(OUT, 'submission.md'), submissionNotes(book, pages));

    console.log(`  terminal-value-ssrn.pdf   ${pages} pages, US Letter, ${(pdf.length / 1e6).toFixed(1)} MB`);
    console.log('  abstract.txt              plain text, for the submission form');
    console.log('  submission.md             title, keywords, JEL codes, and what to close out first');
  } finally {
    await browser.close();
    await rm(tmp, { recursive: true, force: true });
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
