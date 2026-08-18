# Terminal Value

### What Death Was Doing for the Economy, and What Happens When We Stop It

A short book arguing that mortality is load bearing economic infrastructure. It performs five functions that nothing else performs, and radical life extension removes all five at once.

## Status

Complete draft. Verification pass done, continuity pass done. Twelve chapters plus notes, about 27,800 words of body text, roughly 105 printed pages.

| # | Chapter | Words |
|---|---------|-------|
| | [Outline](manuscript/00-outline.md) | 2,480 |
| 1 | [The Boundary Condition](manuscript/01-the-boundary-condition.md) | 1,845 |
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
| 12 | [Terminal Value](manuscript/12-terminal-value.md) | 2,132 |
| | [Notes](manuscript/13-notes.md) | 4,256 |

## Verification

51 claims verified against sources. 20 still unverified and individually marked. 6 items flagged as the author's own calculation or argument rather than a reported finding.

Seven claims were found wrong or overstated and corrected. They are recorded in the notes rather than quietly fixed:

- **Chapter 2 claimed the rise in life expectancy since 1850 was "almost entirely a story about children." False.** Mortality fell at every age. A five-year-old in 1841 England could expect to reach sixty; today, eighty-two. Rewritten around what actually did not move, which is the ceiling.
- **The partial reprogramming result was overstated.** Ocampo's thirty percent lifespan extension was in a progeria disease model, not normal aged mice.
- **Chapter 3's r-star figures were wrong** and have been replaced with actual estimates.
- **The consols were not Napoleonic.** The debt redeemed in 2015 traces to Churchill in 1927 and back to the South Sea Bubble, which is accurate and better.
- **Venice did not ban the colleganza outright.** Softened to what the record shows.
- **Mars light lag is 3 to 22 minutes one way**, not 4 to 24.
- **The Cologne Cathedral stoppage was four centuries**, not three.

A NASA early-flight risk figure could not be confirmed and was removed. The effects of ending mandatory faculty retirement are genuinely disputed, and Chapters 5 and 7 now say so.

Two load bearing items remain unsourced and should be read by someone who knows the literature: the treatment of transversality conditions in Chapter 1, and the claim in Chapter 12 that perpetual foundations reliably fail in one of two directions.

## Style rules

- No dashes anywhere. Enforced across the manuscript.
- Short sentences. Every abstract claim followed within a paragraph by something concrete.
- First person no more than twice per chapter, only at the point of an analytical claim, never autobiographical.
- Technical material in the notes, not in the body. No equations in the text.

## Publishing

The site in `docs/` is generated from `manuscript/` by `build-site.sh`. The manuscript is the source of truth; never edit `docs/chapters/` by hand, it gets wiped on every rebuild.

```
./build-site.sh
```

To publish on GitHub Pages: make the repository public, then in Settings → Pages set Source to "Deploy from a branch", branch `main`, folder `/docs`. The site appears at `https://samisbakedham.github.io/EconBook/` within a couple of minutes.

The outline is working material and is deliberately excluded from the published site.
