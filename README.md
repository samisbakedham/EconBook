# Terminal Value

### What Death Was Doing for the Economy, and What Happens When We Stop It

A short book arguing that mortality is load bearing economic infrastructure. It performs five functions that nothing else performs, and radical life extension removes all five at once.

## Status

Complete draft. Verification pass done, continuity pass done. Twelve chapters plus notes, about 27,800 words of body text, roughly 105 printed pages.

| # | Chapter | Words |
|---|---------|-------|
| | [Outline](manuscript/00-outline.md) | 2,480 |
| 1 | [The Boundary Condition](manuscript/01-the-boundary-condition.md) | 1,841 |
| 2 | [Assume a Longer Life](manuscript/02-assume-a-longer-life.md) | 2,438 |
| 3 | [The Price of Time](manuscript/03-the-price-of-time.md) | 2,788 |
| 4 | [The Estate](manuscript/04-the-estate.md) | 2,209 |
| 5 | [The Funeral Principle](manuscript/05-the-funeral-principle.md) | 2,047 |
| 6 | [Nobody Goes to Space](manuscript/06-nobody-goes-to-space.md) | 3,048 |
| 7 | [Vacancy](manuscript/07-vacancy.md) | 2,304 |
| 8 | [The Forkable Worker](manuscript/08-the-forkable-worker.md) | 2,192 |
| 9 | [The Mortal Class](manuscript/09-the-mortal-class.md) | 1,891 |
| 10 | [The Serrata](manuscript/10-the-serrata.md) | 2,181 |
| 11 | [Reinventing the Funeral](manuscript/11-reinventing-the-funeral.md) | 2,774 |
| 12 | [Terminal Value](manuscript/12-terminal-value.md) | 2,134 |
| | [Notes](manuscript/13-notes.md) | 4,588 |

## Verification

56 claims verified against sources. 22 still unverified and individually marked. 4 items flagged as the author's own calculation or argument rather than a reported finding.

Seven claims were found wrong or overstated and corrected. They are recorded in the notes rather than quietly fixed:

- **Chapter 2 claimed the rise in life expectancy since 1850 was "almost entirely a story about children." False.** Mortality fell at every age. A five-year-old in 1841 England could expect to reach sixty; today, eighty-two. Rewritten around what actually did not move, which is the ceiling.
- **The partial reprogramming result was overstated.** Ocampo's thirty percent lifespan extension was in a progeria disease model, not normal aged mice.
- **Chapter 3's r-star figures were wrong** and have been replaced with actual estimates.
- **The consols were not Napoleonic.** The debt redeemed in 2015 traces to Churchill in 1927 and back to the South Sea Bubble, which is accurate and better.
- **Venice did not ban the colleganza outright.** Softened to what the record shows.
- **Mars light lag is 3 to 22 minutes one way**, not 4 to 24.
- **The Cologne Cathedral stoppage was four centuries**, not three.

A NASA early-flight risk figure could not be confirmed and was removed. The effects of ending mandatory faculty retirement are genuinely disputed, and Chapters 5 and 7 now say so.

The two load bearing items previously flagged as unsourced are now sourced. Chapter 1 uses Blanchard and Fischer for the no-Ponzi-game condition and Kamihigashi for the transversality condition, kept distinct. Chapter 12 sources the two observed directions in Rosenwald and Higgins. The claim that there is no third outcome remains the author's reading, not a general law.

## Style rules

- No dashes anywhere. Enforced across the manuscript.
- Short sentences. Every abstract claim followed within a paragraph by something concrete.
- First person no more than twice per chapter, only at the point of an analytical claim, never autobiographical.
- Technical material in the notes, not in the body. No equations in the text.

## Publishing

The manuscript is the single source of truth. Everything below is generated from
it, so the editions cannot drift apart.

```
npm run build:all
```

That produces, in `build/`:

| Output | What it is |
|---|---|
| `book/terminal-value-interior-6x9.pdf` | Print interior. 6 x 9 trim, parts, drop capitals, chapters on rectos, unnumbered front matter, notes at the back. |
| `book/terminal-value.epub` | EPUB 3, reflowable, typefaces and cover embedded. |
| `book/terminal-value-cover.png` | Cover at 1800 x 2700, which is 300 dpi at 6 x 9. |
| `book/terminal-value.md` | One combined Markdown file, for Leanpub or pandoc. |
| `ssrn/terminal-value-ssrn.pdf` | The working paper. US Letter, abstract, numbered sections, JEL codes. |
| `ssrn/abstract.txt`, `ssrn/submission.md` | Paste ready metadata for the SSRN form. |

The individual steps are `npm run build:book`, `npm run build:ssrn` and
`npm run build` (the website). The book and paper need Google Chrome, which is
used headless to typeset the PDFs; set `CHROME_PATH` if it is somewhere unusual.
`pdfunite` from poppler is optional and produces a single interior file with the
front matter unnumbered. Nothing here needs pandoc or LaTeX, and there are no npm
dependencies.

The verification counts printed in the front matter, the paper and the website
are read out of the "Verification status" section of `manuscript/13-notes.md` at
build time. Update that section and every edition follows.

### The website

`web/` is a static site built from the manuscript by `tools/build-web.mjs`, and
it is what deploys to Vercel. `vercel.json` points the project at it, so a push
rebuilds the chapter pages from `manuscript/` automatically.

```
npm run dev      # http://localhost:4321, with Vercel's clean URLs
```

Never edit `web/chapters/` or `web/index.html` by hand; both are wiped on every
build. Page copy lives in `tools/site/pages.mjs` and the figures in
`tools/site/figures.mjs`. The downloads the site offers are copied from `build/`
into `web/downloads/` and committed, because Vercel's build image has no browser
to regenerate them with.

### GitHub Pages

The older site in `docs/` is generated separately by `build-site.sh` and is still
live at https://samisbakedham.github.io/EconBook/, served from `/docs` on `main`.
It reads the same manuscript.

```
./build-site.sh
```

The outline is working material and is deliberately excluded from both sites.
