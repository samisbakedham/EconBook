// Print interior styling for the 6 x 9 trade edition.
export const bookCss = ({ trim = '6in 9in' } = {}) => `
@page { size: ${trim}; margin: 0.72in 0.68in 0.62in 0.68in; }
@page :first { margin-top: 0.72in; }

:root {
  --ink: #16161a;
  --soft: #55555e;
  --rule: #c9c5bc;
}

* { box-sizing: border-box; }

html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }

body {
  margin: 0;
  font-family: 'Newsreader', Georgia, serif;
  font-optical-sizing: auto;
  font-size: 10.6pt;
  line-height: 1.52;
  color: var(--ink);
  text-align: justify;
  hyphens: auto;
  -webkit-hyphens: auto;
  orphans: 2;
  widows: 2;
}

p { margin: 0; text-indent: 1.2em; }
p.opener, h1 + p, h2 + p, h3 + p, hr + p, .no-indent { text-indent: 0; }
em { font-style: italic; }
strong { font-weight: 600; }

/* ---- structural pages ---------------------------------------------- */

.page { page-break-after: always; break-after: page; }
.recto { page-break-before: right; break-before: right; }
.blank { page-break-after: always; break-after: page; }

.plate {
  height: 7.6in;
  display: flex;
  flex-direction: column;
  text-align: center;
}
.plate.center { justify-content: center; }
.plate.end { justify-content: flex-end; }

.halftitle {
  font-family: 'Fraunces', Georgia, serif;
  font-weight: 400;
  font-size: 15pt;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  text-indent: 0;
  color: var(--soft);
}

.titlepage .rule {
  width: 2.2in; height: 1px; background: var(--rule);
  margin: 0.34in auto;
}
.titlepage h1 {
  font-family: 'Fraunces', Georgia, serif;
  font-variation-settings: 'SOFT' 20, 'WONK' 1;
  font-weight: 500;
  font-size: 40pt;
  line-height: 1.02;
  letter-spacing: -0.015em;
  margin: 0;
}
.titlepage .sub {
  font-family: 'Newsreader', Georgia, serif;
  font-style: italic;
  font-size: 12.5pt;
  line-height: 1.45;
  color: var(--soft);
  max-width: 3.6in;
  margin: 0 auto;
  text-indent: 0;
}
.titlepage .author {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9.5pt;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  margin-top: 0.5in;
  text-indent: 0;
}
.titlepage .imprint {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 7.5pt;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--soft);
  margin-top: 0.9in;
  text-indent: 0;
}

.copyright {
  font-size: 8.6pt;
  line-height: 1.5;
  text-align: left;
  color: var(--soft);
}
.copyright p { text-indent: 0; margin: 0 0 0.62em; }
.copyright .title-line { color: var(--ink); font-weight: 600; }

.epigraph { max-width: 3.5in; margin: 0 auto; text-align: left; }
.epigraph blockquote {
  margin: 0 0 0.42in;
  font-size: 11pt;
  font-style: italic;
  line-height: 1.5;
}
.epigraph blockquote p { text-indent: 0; }
.epigraph cite {
  display: block;
  margin-top: 0.1in;
  font-style: normal;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 7.6pt;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--soft);
}

/* ---- contents ------------------------------------------------------ */

.contents h2, .frontnote h2 {
  font-family: 'Fraunces', Georgia, serif;
  font-weight: 400;
  font-size: 12pt;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  text-align: center;
  margin: 0 0 0.42in;
}
.contents ol { list-style: none; margin: 0; padding: 0; }
.contents .part-line {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 7.6pt;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--soft);
  margin: 0.28in 0 0.11in;
  text-indent: 0;
}
.contents li {
  display: flex;
  align-items: baseline;
  gap: 0.5em;
  margin: 0 0 0.075in;
  font-size: 10.4pt;
}
.contents li .n {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 8pt;
  color: var(--soft);
  width: 1.5em;
  flex: none;
}
.contents li .t { font-style: italic; }

.frontnote { text-align: left; font-size: 9.6pt; line-height: 1.5; }
.frontnote p { text-indent: 0; margin: 0 0 0.75em; }

/* ---- part openers -------------------------------------------------- */

.part { page-break-before: right; break-before: right; page-break-after: always; }
.part .inner {
  height: 7.2in;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}
.part .num {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 8pt;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--soft);
  margin-bottom: 0.22in;
}
.part h2 {
  font-family: 'Fraunces', Georgia, serif;
  font-variation-settings: 'SOFT' 20, 'WONK' 1;
  font-weight: 400;
  font-size: 26pt;
  line-height: 1.1;
  margin: 0 0 0.3in;
}
.part .blurb {
  max-width: 3.3in;
  margin: 0 auto;
  font-style: italic;
  font-size: 10pt;
  line-height: 1.5;
  color: var(--soft);
  text-align: center;
  text-indent: 0;
}

/* ---- chapters ------------------------------------------------------ */

.chapter { page-break-before: right; break-before: right; }
.chapter header { margin-bottom: 0.42in; text-align: center; }
.chapter .num {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 8pt;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--soft);
  margin-bottom: 0.16in;
}
.chapter h2 {
  font-family: 'Fraunces', Georgia, serif;
  font-variation-settings: 'SOFT' 24, 'WONK' 1;
  font-weight: 400;
  font-size: 24pt;
  line-height: 1.12;
  margin: 0 0 0.2in;
}
.chapter header .flourish {
  width: 0.9in; height: 1px; background: var(--rule); margin: 0 auto;
}

h3 {
  font-family: 'Fraunces', Georgia, serif;
  font-weight: 500;
  font-size: 11pt;
  line-height: 1.3;
  margin: 1.35em 0 0.5em;
  text-align: left;
  page-break-after: avoid;
  break-after: avoid;
}

.dropcap {
  float: left;
  font-family: 'Fraunces', Georgia, serif;
  font-variation-settings: 'SOFT' 20, 'WONK' 1;
  font-weight: 400;
  font-size: 3.05em;
  line-height: 0.82;
  padding: 0.05em 0.08em 0 0;
  margin-right: 0.02em;
}
.opener .lead {
  font-variant-caps: all-small-caps;
  letter-spacing: 0.06em;
}

hr {
  border: 0;
  height: 0.34in;
  margin: 0.1in 0;
  text-align: center;
  page-break-after: avoid;
}
hr::after {
  content: '\\00A7';
  display: block;
  font-size: 9pt;
  color: var(--soft);
  line-height: 0.34in;
}

/* ---- notes --------------------------------------------------------- */

.notes { page-break-before: right; break-before: right; }
.notes .num { }
.notes h3 {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 8pt;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--soft);
  margin: 1.5em 0 0.55em;
  border-top: 1px solid var(--rule);
  padding-top: 0.55em;
}
.notes-list {
  margin: 0 0 0.2in;
  padding-left: 1.6em;
  font-size: 9pt;
  line-height: 1.45;
  text-align: left;
}
.notes-list li { margin-bottom: 0.42em; }
.notes p { font-size: 9pt; text-indent: 0; margin-bottom: 0.7em; text-align: left; }
.notes strong { font-weight: 600; }

.colophon {
  page-break-before: right;
  text-align: center;
  font-size: 8.6pt;
  color: var(--soft);
  line-height: 1.6;
}
.colophon p { text-indent: 0; margin: 0 0 0.7em; }
.pagepad { page-break-before: always; break-before: page; height: 1px; }

.colophon .mark {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 20pt;
  color: var(--rule);
  margin-bottom: 0.3in;
}
`;
