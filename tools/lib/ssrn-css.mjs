// Working paper styling. Conventional single column on US Letter, because the
// readership that finds a paper on SSRN expects a paper, not a book.
export const ssrnCss = `
@page { size: 8.5in 11in; margin: 0.92in 1.05in 0.8in 1.05in; }

:root { --ink: #101014; --soft: #4a4a52; --rule: #c8c4bb; }

* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }

body {
  margin: 0;
  font-family: 'Newsreader', 'Times New Roman', serif;
  font-optical-sizing: auto;
  font-size: 11.4pt;
  line-height: 1.48;
  color: var(--ink);
  text-align: justify;
  hyphens: auto;
  -webkit-hyphens: auto;
  orphans: 2;
  widows: 2;
}

p { margin: 0 0 0.62em; }
em { font-style: italic; }
strong { font-weight: 600; }

/* ---- title page ---- */

.titleblock { text-align: center; margin-bottom: 1.15em; }
.titleblock h1 {
  font-family: 'Newsreader', 'Times New Roman', serif;
  font-weight: 600;
  font-size: 18pt;
  line-height: 1.2;
  letter-spacing: -0.005em;
  margin: 0 0 0.55em;
}
.titleblock .sub {
  font-size: 12.4pt;
  font-style: italic;
  color: var(--soft);
  margin: 0 0 1.1em;
  line-height: 1.35;
}
.titleblock .author { font-size: 12pt; margin: 0 0 0.3em; }
.titleblock .affil { font-size: 10pt; color: var(--soft); margin: 0 0 0.15em; }
.titleblock .date {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 8.4pt; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--soft); margin-top: 0.85em;
}

.abstract {
  margin: 0 0.22in 1.05em;
  font-size: 9.6pt;
  line-height: 1.38;
}
.abstract h2 {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 8.2pt; font-weight: 500; letter-spacing: 0.22em;
  text-transform: uppercase; text-align: center; color: var(--soft);
  margin: 0 0 0.7em;
}
.abstract p { margin: 0 0 0.55em; }

.meta {
  margin: 0 0.22in;
  font-size: 9.2pt;
  line-height: 1.42;
  text-align: left;
  color: var(--soft);
}
.meta p { margin: 0 0 0.32em; }
.meta .label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 8pt; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink);
}
.meta code {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9pt; color: var(--ink);
}

.rulewide { border: 0; border-top: 1px solid var(--rule); margin: 1.1em 0 0; }

/* ---- body ---- */

.partline {
  page-break-before: always; break-before: page;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 8.6pt; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--soft); text-align: left;
  border-bottom: 1px solid var(--rule);
  padding-bottom: 0.5em; margin: 0 0 1.5em;
  page-break-after: avoid;
}

h2.section {
  font-size: 13.5pt;
  font-weight: 600;
  line-height: 1.25;
  margin: 1.9em 0 0.7em;
  text-align: left;
  page-break-after: avoid; break-after: avoid;
  -webkit-hyphens: none; hyphens: none;
}
h2.section .n { color: var(--soft); font-weight: 400; margin-right: 0.45em; }
.partline + h2.section { margin-top: 0; }

h3 {
  font-size: 11.4pt;
  font-weight: 600;
  line-height: 1.3;
  margin: 1.5em 0 0.45em;
  text-align: left;
  page-break-after: avoid; break-after: avoid;
  -webkit-hyphens: none; hyphens: none;
}
h3 .n { color: var(--soft); font-weight: 400; margin-right: 0.4em; }

hr { border: 0; height: 1.1em; margin: 0; }

/* ---- notes ---- */

.notes { page-break-before: always; break-before: page; }
.notes h2 { font-size: 13.5pt; font-weight: 600; margin: 0 0 0.5em; text-align: left; }
.notes > p { font-size: 10pt; color: var(--soft); }
.notes h3 {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 8.6pt; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--soft); margin: 1.5em 0 0.5em;
}
.notes-list {
  margin: 0 0 0.9em; padding-left: 1.5em;
  font-size: 9.6pt; line-height: 1.4; text-align: left;
}
.notes-list li { margin-bottom: 0.4em; }
`;
