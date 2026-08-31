// EPUB 3 writer. Reflowable, with a navigation document, an NCX for older
// readers, embedded typefaces and the same cover as the print edition.
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { zip } from './zip.mjs';
import { renderBlocks, escapeHtml, smarten } from './md.mjs';

const FONT_DIR = fileURLToPath(new URL('../../web/assets/fonts/', import.meta.url));
const FONT_FILES = [
  'fraunces-latin-normal-300-900.woff2',
  'fraunces-latin-italic-300-900.woff2',
  'newsreader-latin-normal-200-700.woff2',
  'newsreader-latin-italic-200-700.woff2',
  'ibm-plex-mono-latin-normal-400.woff2',
];

const ROMAN = { 1: 'One', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five', 6: 'Six',
  7: 'Seven', 8: 'Eight', 9: 'Nine', 10: 'Ten', 11: 'Eleven', 12: 'Twelve' };

const CSS = `
@font-face{font-family:'Fraunces';font-style:normal;font-weight:300 900;src:url(../fonts/fraunces-latin-normal-300-900.woff2) format('woff2');}
@font-face{font-family:'Fraunces';font-style:italic;font-weight:300 900;src:url(../fonts/fraunces-latin-italic-300-900.woff2) format('woff2');}
@font-face{font-family:'Newsreader';font-style:normal;font-weight:200 700;src:url(../fonts/newsreader-latin-normal-200-700.woff2) format('woff2');}
@font-face{font-family:'Newsreader';font-style:italic;font-weight:200 700;src:url(../fonts/newsreader-latin-italic-200-700.woff2) format('woff2');}
@font-face{font-family:'Plex Mono';font-style:normal;font-weight:400;src:url(../fonts/ibm-plex-mono-latin-normal-400.woff2) format('woff2');}

html,body{margin:0;padding:0}
body{font-family:'Newsreader',Georgia,serif;line-height:1.6;padding:0 1em;
  widows:2;orphans:2;hyphens:auto;-webkit-hyphens:auto;text-align:justify}
p{margin:0;text-indent:1.15em}
p.opener,h1+p,h2+p,h3+p,hr+p,p.first{text-indent:0}
h1,h2,h3{font-family:'Fraunces',Georgia,serif;font-weight:400;line-height:1.15;
  text-align:left;page-break-after:avoid;-webkit-hyphens:none;hyphens:none}
h1{font-size:1.85em;margin:.2em 0 .4em}
h2{font-size:1.5em;margin:1.4em 0 .5em}
h3{font-size:1.06em;font-weight:500;margin:1.6em 0 .6em}
hr{border:0;height:1.6em;margin:.4em 0;text-align:center;page-break-after:avoid}
hr:after{content:'\\00A7';display:block;color:#8a8780;font-size:.85em}
.kicker{font-family:'Plex Mono',monospace;font-size:.68em;letter-spacing:.24em;
  text-transform:uppercase;color:#7a776f;text-indent:0;margin:0 0 .5em;text-align:left}
.center{text-align:center}
.rule{border:0;height:1px;background:#c9c5bc;width:40%;margin:1.4em auto}
.rule:after{content:none}
.dropcap{float:left;font-family:'Fraunces',Georgia,serif;font-size:3.1em;
  line-height:.82;padding:.04em .1em 0 0}
.lead{font-variant-caps:all-small-caps;letter-spacing:.05em}
blockquote{margin:0 0 1.4em;font-style:italic;text-align:left}
blockquote p{text-indent:0}
cite{display:block;margin-top:.5em;font-style:normal;font-family:'Plex Mono',monospace;
  font-size:.68em;letter-spacing:.16em;text-transform:uppercase;color:#7a776f}
ol.notes-list{font-size:.92em;text-align:left;padding-left:1.4em}
ol.notes-list li{margin-bottom:.6em}
nav ol{list-style:none;padding-left:0}
nav li{margin:.32em 0}
.part-title{font-family:'Fraunces',Georgia,serif;font-size:2em;margin:.3em 0 .6em}
.part-blurb{font-style:italic;color:#55555e;text-indent:0;text-align:left}
.cover-page{margin:0;padding:0;text-align:center}
.cover-page img{max-width:100%;height:auto}
.title-main{font-size:2.6em;line-height:1;margin:.1em 0}
.title-sub{font-style:italic;font-size:1.1em;color:#55555e;text-indent:0;margin:1em 0}
.title-author{font-family:'Plex Mono',monospace;font-size:.8em;letter-spacing:.22em;
  text-transform:uppercase;text-indent:0;margin-top:2em}
.copyright p{font-size:.82em;text-indent:0;margin:0 0 .8em;text-align:left;color:#55555e}
`;

const doc = (title, body, { cls = '' } = {}) => `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en" xml:lang="en">
<head><meta charset="utf-8"/><title>${escapeHtml(title)}</title>
<link rel="stylesheet" type="text/css" href="../css/book.css"/></head>
<body${cls ? ` class="${cls}"` : ''}>
${body}
</body></html>`;

function opener(html) {
  const m = html.match(/^([A-Za-z“‘])(.*)$/s);
  if (!m) return `<p class="opener">${html}</p>`;
  const words = m[2].split(' ');
  return `<p class="opener"><span class="dropcap">${m[1]}</span><span class="lead">${words.slice(0, 4).join(' ')}</span> ${words.slice(4).join(' ')}</p>`;
}

export async function buildEpub({ book, out, cover, epigraphs }) {
  const { meta, parts, notes, chapters } = book;
  const EP = epigraphs || (await import('../build-book.mjs')).EPIGRAPHS;

  const uid = 'urn:uuid:' + createHash('sha1')
    .update(`${meta.title}|${meta.author}|${meta.year}`)
    .digest('hex')
    .replace(/^(.{8})(.{4})(.{4})(.{4})(.{12}).*$/, '$1-$2-$3-$4-$5');

  const files = [{ name: 'mimetype', data: 'application/epub+zip', store: true }];

  files.push({
    name: 'META-INF/container.xml',
    data: `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles><rootfile full-path="OEBPS/package.opf" media-type="application/oebps-package+xml"/></rootfiles>
</container>`,
  });

  files.push({ name: 'OEBPS/css/book.css', data: CSS });
  for (const f of FONT_FILES) {
    files.push({ name: `OEBPS/fonts/${f}`, data: await readFile(path.join(FONT_DIR, f)) });
  }
  if (cover) files.push({ name: 'OEBPS/images/cover.png', data: cover });

  /* ---- documents ---- */
  const spine = [];
  const push = (id, name, title, body, opts) => {
    files.push({ name: `OEBPS/${name}`, data: doc(title, body, opts) });
    spine.push({ id, href: name, title });
  };

  if (cover) {
    push('cover', 'text/cover.xhtml', 'Cover',
      `<section epub:type="cover" class="cover-page"><img src="../images/cover.png" alt="${escapeHtml(meta.title)}"/></section>`);
  }

  push('titlepage', 'text/titlepage.xhtml', 'Title page', `<section epub:type="titlepage" class="center">
  <h1 class="title-main">Terminal Value</h1>
  <hr class="rule"/>
  <p class="title-sub">${escapeHtml(meta.subtitle)}</p>
  <p class="title-author">${escapeHtml(meta.author)}</p>
</section>`);

  push('copyright', 'text/copyright.xhtml', 'Copyright', `<section epub:type="copyright-page" class="copyright">
  <p><strong>${escapeHtml(meta.title)}: ${escapeHtml(meta.subtitle)}</strong></p>
  <p>Copyright © ${meta.year} ${escapeHtml(meta.author)}. All rights reserved.</p>
  <p>First edition. Set in Fraunces and Newsreader.</p>
  <p>The manuscript, the notes and the build tooling that produced this file are public at ${escapeHtml(meta.repo)}. Corrections are welcome and will be recorded rather than quietly applied.</p>
  <p>This is a complete draft. Fifty one of its factual claims have been checked against sources and twenty have not. Every claim carries its verification status in the notes at the back.</p>
  <p>Nothing here is investment advice.</p>
</section>`);

  push('epigraph', 'text/epigraph.xhtml', 'Epigraph', `<section epub:type="epigraph">
${EP.map((e) => `<blockquote><p>${smarten(escapeHtml(e.text))}</p><cite>${escapeHtml(e.cite)}</cite></blockquote>`).join('\n')}
</section>`);

  for (const part of parts) {
    const pid = `part${part.n.toLowerCase()}`;
    push(pid, `text/${pid}.xhtml`, `Part ${part.n}. ${part.title}`, `<section epub:type="part" class="center">
  <p class="kicker center">Part ${part.n}</p>
  <h1 class="part-title">${escapeHtml(part.title)}</h1>
  <p class="part-blurb">${smarten(escapeHtml(part.blurb))}</p>
</section>`);

    for (const c of part.items) {
      const id = `ch${String(c.n).padStart(2, '0')}`;
      push(id, `text/${id}.xhtml`, `${c.n}. ${c.title}`, `<section epub:type="chapter">
  <p class="kicker">Chapter ${ROMAN[c.n] || c.n}</p>
  <h1>${escapeHtml(c.title)}</h1>
  ${renderBlocks(c.blocks, { shift: 1, firstParagraph: opener })}
</section>`);
    }
  }

  push('notes', 'text/notes.xhtml', 'Notes', `<section epub:type="endnotes">
  <p class="kicker">Back matter</p>
  <h1>Notes</h1>
  ${renderBlocks(notes.blocks, { shift: 1 })}
</section>`);

  /* ---- navigation ---- */
  const navItems = [];
  navItems.push(`<li><a href="titlepage.xhtml">Title page</a></li>`);
  for (const part of parts) {
    const inner = part.items
      .map((c) => `<li><a href="ch${String(c.n).padStart(2, '0')}.xhtml">${c.n}. ${escapeHtml(c.title)}</a></li>`)
      .join('\n');
    navItems.push(`<li><a href="part${part.n.toLowerCase()}.xhtml">Part ${part.n}. ${escapeHtml(part.title)}</a><ol>\n${inner}\n</ol></li>`);
  }
  navItems.push(`<li><a href="notes.xhtml">Notes</a></li>`);

  files.push({
    name: 'OEBPS/text/nav.xhtml',
    data: doc('Contents', `<nav epub:type="toc" id="toc"><h1>Contents</h1><ol>
${navItems.join('\n')}
</ol></nav>
<nav epub:type="landmarks" hidden="hidden"><ol>
  <li><a epub:type="toc" href="nav.xhtml">Contents</a></li>
  <li><a epub:type="bodymatter" href="ch01.xhtml">Begin reading</a></li>
</ol></nav>`),
  });

  let playOrder = 0;
  const ncxPoints = spine
    .filter((s) => s.id !== 'cover')
    .map((s) => `<navPoint id="np-${s.id}" playOrder="${++playOrder}">
  <navLabel><text>${escapeHtml(s.title)}</text></navLabel><content src="${s.href.replace('text/', 'text/')}"/></navPoint>`)
    .join('\n');

  files.push({
    name: 'OEBPS/toc.ncx',
    data: `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
<head><meta name="dtb:uid" content="${uid}"/></head>
<docTitle><text>${escapeHtml(meta.title)}</text></docTitle>
<navMap>
${ncxPoints}
</navMap></ncx>`,
  });

  /* ---- package ---- */
  const manifest = [
    `<item id="nav" href="text/nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>`,
    `<item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>`,
    `<item id="css" href="css/book.css" media-type="text/css"/>`,
    ...FONT_FILES.map((f, i) => `<item id="font${i}" href="fonts/${f}" media-type="font/woff2"/>`),
    cover ? `<item id="cover-image" href="images/cover.png" media-type="image/png" properties="cover-image"/>` : '',
    ...spine.map((s) => `<item id="${s.id}" href="${s.href}" media-type="application/xhtml+xml"/>`),
  ].filter(Boolean).join('\n    ');

  files.push({
    name: 'OEBPS/package.opf',
    data: `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="pub-id" xml:lang="en">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="pub-id">${uid}</dc:identifier>
    <dc:title id="t">${escapeHtml(meta.title)}: ${escapeHtml(meta.subtitle)}</dc:title>
    <dc:creator id="a">${escapeHtml(meta.author)}</dc:creator>
    <dc:language>en</dc:language>
    <dc:date>${meta.year}-01-01</dc:date>
    <dc:description>${escapeHtml(meta.description)}</dc:description>
    <dc:subject>Economics</dc:subject>
    <dc:subject>Longevity</dc:subject>
    <dc:subject>Institutional design</dc:subject>
    <meta property="dcterms:modified">${new Date().toISOString().replace(/\.\d+Z$/, 'Z')}</meta>
    <meta property="title-type" refines="#t">expanded</meta>
    <meta property="file-as" refines="#a">Safahi, Samuel</meta>
  </metadata>
  <manifest>
    ${manifest}
  </manifest>
  <spine toc="ncx">
    ${spine.map((s) => `<itemref idref="${s.id}"/>`).join('\n    ')}
    <itemref idref="nav" linear="no"/>
  </spine>
</package>`,
  });

  await writeFile(out, zip(files));
  return { entries: files.length, chapters: chapters.length };
}
