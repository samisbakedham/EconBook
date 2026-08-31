// Blink does not implement `break-before: right`, so chapter and part openers
// land on whichever side the flow happens to reach. This measures the real
// pagination and inserts blank leaves so every opener falls on a recto.
//
// The measurement is exact rather than iterative: padding inserted before
// section k cannot change where sections 1..k-1 fell, so a single forward pass
// over prefixes of the document settles every decision.

export async function recto({ sections, wrap, render, startsOnRecto = true, log = () => {} }) {
  const pads = new Array(sections.length).fill(false);
  let pages = 0;

  for (let k = 0; k < sections.length; k++) {
    const html = wrap(sections.slice(0, k + 1).map((s, i) => (pads[i] ? PAD + s : s)).join('\n'));
    pages = countPages(await render(html));

    if (k + 1 < sections.length) {
      // The next section starts on page `pages + 1`; that is a recto when the
      // running count is even (given the front matter also ends on a verso).
      const nextIsRecto = startsOnRecto ? pages % 2 === 0 : pages % 2 === 1;
      pads[k + 1] = !nextIsRecto;
    }
    log(k, pages);
  }

  const html = wrap(sections.map((s, i) => (pads[i] ? PAD + s : s)).join('\n'));
  return { html, pads: pads.filter(Boolean).length, pages };
}

export const PAD = '<div class="pagepad"></div>';

export function countPages(pdf) {
  return (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
}
