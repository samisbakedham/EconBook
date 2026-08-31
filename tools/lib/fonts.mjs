// Inlines the latin subsets as data URIs so print HTML is self-contained and
// Chrome embeds real outlines into the PDF rather than substituting.
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const DIR = fileURLToPath(new URL('../../web/assets/fonts/', import.meta.url));

const FACES = [
  ['Fraunces', 'fraunces-latin-normal-300-900.woff2', 'normal', '300 900'],
  ['Fraunces', 'fraunces-latin-italic-300-900.woff2', 'italic', '300 900'],
  ['Newsreader', 'newsreader-latin-normal-200-700.woff2', 'normal', '200 700'],
  ['Newsreader', 'newsreader-latin-italic-200-700.woff2', 'italic', '200 700'],
  ['IBM Plex Mono', 'ibm-plex-mono-latin-normal-400.woff2', 'normal', '400'],
  ['IBM Plex Mono', 'ibm-plex-mono-latin-normal-500.woff2', 'normal', '500'],
];

export async function embeddedFontCss() {
  const out = [];
  for (const [family, file, style, weight] of FACES) {
    const b64 = (await readFile(path.join(DIR, file))).toString('base64');
    out.push(
      `@font-face{font-family:'${family}';font-style:${style};font-weight:${weight};` +
      `src:url(data:font/woff2;base64,${b64}) format('woff2');}`
    );
  }
  return out.join('\n');
}
