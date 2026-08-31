// Page templates for the website. The manuscript supplies every chapter; the
// connective copy here is written against it and follows the same style rules
// as the book, including no dashes.

import { renderBlocks, escapeHtml, attr, smarten, openingParagraph } from '../lib/md.mjs';
import * as F from './figures.mjs';

const ROMAN = { 1: 'One', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five', 6: 'Six',
  7: 'Seven', 8: 'Eight', 9: 'Nine', 10: 'Ten', 11: 'Eleven', 12: 'Twelve' };

export const downloads = [
  {
    href: '/downloads/terminal-value-interior-6x9.pdf',
    fmt: 'PDF &middot; 6 x 9 interior',
    title: 'The print edition',
    note: 'Set for a trade paperback. Parts, drop capitals, chapters on rectos, notes at the back.',
  },
  {
    href: '/downloads/terminal-value.epub',
    fmt: 'EPUB 3',
    title: 'The ebook',
    note: 'Reflowable, with the typefaces and cover embedded. Reads on anything.',
  },
  {
    href: '/downloads/terminal-value-ssrn.pdf',
    fmt: 'PDF &middot; working paper',
    title: 'The working paper',
    note: 'The same argument in the form economists read: abstract, numbered sections, JEL codes.',
  },
  {
    href: '/downloads/terminal-value.md',
    fmt: 'Markdown',
    title: 'The source',
    note: 'One file, no formatting to fight. This is what everything else is built from.',
  },
];

/* ------------------------------------------------------------- chrome -- */

const navLinks = (current) => `
  <nav class="nav">
    <a class="nav-mark" href="/">Terminal <span class="v">Value</span></a>
    <div class="nav-links">
      <a href="/#argument" class="hide-sm"${current === 'home' ? ' aria-current="page"' : ''}>The argument</a>
      <a href="/read"${current === 'read' ? ' aria-current="page"' : ''}>Contents</a>
      <a href="/notes" class="hide-sm"${current === 'notes' ? ' aria-current="page"' : ''}>Notes</a>
      <a href="/#get">Get the book</a>
      <button class="theme-toggle" type="button" aria-label="Switch between light and dark">
        <svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z"/></svg>
        <svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4"/></svg>
      </button>
    </div>
  </nav>`;

const footer = (book) => `
  <footer class="foot">
    <div class="wrap foot-grid">
      <div>
        <h4>Terminal Value</h4>
        <p class="colophon">${escapeHtml(book.meta.subtitle)}<br>
        Twelve chapters and a set of notes, by ${escapeHtml(book.meta.author)}.
        Complete draft: ${book.verification.verified} claims checked against sources, ${book.verification.unverified} not, each one marked.</p>
      </div>
      <div>
        <h4>Read</h4>
        <ul>
          <li><a href="/read">Contents</a></li>
          <li><a href="/chapters/${book.chapters[0].slug}">Start at Chapter 1</a></li>
          <li><a href="/chapters/nobody-goes-to-space">Nobody Goes to Space</a></li>
          <li><a href="/notes">Notes and verification</a></li>
        </ul>
      </div>
      <div>
        <h4>Take it with you</h4>
        <ul>
          ${downloads.map((d) => `<li><a href="${d.href}">${d.title}</a></li>`).join('\n          ')}
          <li><a href="${attr(book.meta.repo)}">Source on GitHub</a></li>
        </ul>
      </div>
    </div>
  </footer>`;

/* ------------------------------------------------------------- layout -- */

export function layout({ book, title, description, path, body, current, extraHead = '' }) {
  const url = book.meta.siteUrl + path;
  const full = title === book.meta.title ? title : `${title} &middot; ${book.meta.title}`;

  return `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${full.replace(/&middot;/g, '·')}</title>
<meta name="description" content="${attr(description)}">
<meta name="author" content="${attr(book.meta.author)}">
<link rel="canonical" href="${attr(url)}">
<meta property="og:type" content="${path.startsWith('/chapters') ? 'article' : 'website'}">
<meta property="og:title" content="${attr(title)}">
<meta property="og:description" content="${attr(description)}">
<meta property="og:url" content="${attr(url)}">
<meta property="og:site_name" content="${attr(book.meta.title)}">
<meta property="og:image" content="${attr(book.meta.siteUrl)}/downloads/terminal-value-cover.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/assets/fonts/newsreader-latin-normal-200-700.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/fraunces-latin-normal-300-900.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/site.css">
<script>
  // Applied before first paint so the chosen theme never flashes.
  try { var t = localStorage.getItem('tv-theme'); if (t) document.documentElement.dataset.theme = t; } catch (e) {}
</script>
${extraHead}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${navLinks(current)}
<main id="main">
${body}
</main>
${footer(book)}
<script src="/assets/js/site.js" defer></script>
</body>
</html>`;
}

/* --------------------------------------------------------------- home -- */

const fig = ({ n, title, body, caption, source, id = '' }) => `
<figure class="fig" data-reveal ${id ? `id="${id}"` : ''}>
  <div class="fig-head">
    <p class="label">${n}</p>
    <h3>${title}</h3>
  </div>
  <div class="fig-body">${body}</div>
  ${caption ? `<figcaption>${caption}${source ? `<span class="src">${source}</span>` : ''}</figcaption>` : ''}
</figure>`;

const jobCard = (book, { n, slug, glyph, title, line }) => {
  const ch = book.chapters.find((c) => c.slug === slug);
  return `<a class="cell" href="/chapters/${slug}">
    <span class="job-n">Job ${n} &middot; Chapter ${ch.n}</span>
    <h3>${escapeHtml(title)}</h3>
    <p>${smarten(line)}</p>
    <span class="glyph">${glyph}</span>
  </a>`;
};

export function homePage(book) {
  const q = (n) => smarten(escapeHtml(book.chapters.find((c) => c.n === n).quote));

  const body = `
<section class="hero">
  <div class="hero-glow"></div>
  ${F.heroArt()}
  <div class="wrap hero-inner">
    <p class="label">An essay in five removals</p>
    <h1 class="display-xl">
      <span class="line">Terminal</span>
      <span class="line v">Value</span>
    </h1>
    <p class="hero-sub">${escapeHtml(book.meta.subtitle)}</p>
    <div class="hero-meta">
      <a class="btn btn-primary" href="#argument">Read the argument</a>
      <a class="btn" href="/read">All twelve chapters</a>
    </div>
    <p class="label" style="margin-top:2rem">${escapeHtml(book.meta.author)}
      <span class="dot">&middot;</span> ${book.chapters.length} chapters
      <span class="dot">&middot;</span> ${(Math.round(book.words / 100) * 100).toLocaleString()} words</p>
  </div>
</section>

<section class="band" id="argument">
  <div class="wrap">
    <div class="measure-wide center-x" style="text-align:center" data-reveal>
      <p class="label">The claim</p>
      <p class="pull" style="margin-top:1.6rem">Economics treats death as a boundary condition and <em>never inspects it</em>.</p>
    </div>

    <div class="split" style="margin-top:clamp(3rem,8vh,5rem)">
      <div class="measure stack" data-reveal>
        <p>Death is quietly doing at least five jobs. It sets the discount rate. It turns over capital. It turns over ideas. It prices risk. And it creates vacancy.</p>
        <p>Each one is load bearing. None of them has a backup. We have no institution standing by to redistribute capital if inheritance stops, no mechanism to rotate intellectual authority if the holders never vacate, and no procedure for opening a position that nobody has left.</p>
        <p>These functions were never designed, so they were never given redundancy. They emerged from a biological fact so reliable that nobody thought to ask what would happen if it changed.</p>
        <p class="dim"><strong>Radical life extension removes all five at once.</strong> The result is not utopia and not catastrophe but something stranger: a civilization that is wealthy, safe, static and permanently locked in.</p>
      </div>
      <div data-reveal style="--delay:.12s">
        ${fig({
          n: 'Figure 0',
          title: 'What the beam is holding up',
          body: F.figBeams(),
          caption: 'We are removing a beam. The beam was holding something up. Nobody has checked what.',
          source: 'Chapter 1, The Boundary Condition',
        })}
      </div>
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap split narrow-right" style="align-items:center">
    <div data-reveal>
      ${fig({
        n: 'Figure 1',
        title: 'The variable that has never varied',
        body: F.figCeiling(),
        caption: 'Adult life really was extended, and anyone who tells you the whole story is dead babies is skipping the evidence. What did not move is the ceiling. Jeanne Calment died in 1997 at 122. Nobody has come within three years of her since.',
        source: 'Shape indicative; endpoints as stated in Chapter 2',
      })}
    </div>
    <div class="measure stack" data-reveal style="--delay:.1s">
      <p class="label">Chapter 2 &middot; the premise</p>
      <h2 class="display-m">You cannot notice a variable that has never varied</h2>
      <p>Mortality has been the most stable input in all of economics. Population, technology, energy prices, institutions, trade, the money supply: all of it swings around, and every swing generates a literature.</p>
      <p>The human lifespan has not swung. You cannot run a regression on a constant. It has no variance to explain, so it falls out of the analysis, not through carelessness but because there is nothing there for the analysis to grip.</p>
      <p>The premise of this book is set as weakly as it can be set. Not immortality, not uploading, not any particular biotechnology. Only that healthy human lifespans eventually reach somewhere between 150 and 300 years.</p>
      <p class="dim">And the effects do not wait for that. Every one of the five jobs depends on mortality continuously rather than as a switch, which means the mild early version should already be visible. It is.</p>
    </div>
  </div>
</section>

<section class="band-sunken" id="jobs">
  <div class="wrap">
    <div class="measure-wide" data-reveal>
      <p class="label">Part II</p>
      <h2 class="display-l" style="margin-top:1rem">The five jobs</h2>
      <p class="lede" style="margin-top:1.4rem">One chapter each. Every one of them is a function nothing else performs, running right now, with mortality still fully intact.</p>
    </div>

    <div class="grid grid-5" style="margin-top:clamp(2.5rem,6vh,4rem)" data-reveal>
      ${jobCard(book, { n: 1, slug: 'the-price-of-time', glyph: F.jobGlyphs.rate, title: 'It sets the price of time', line: 'The discount rate contains a term for the chance you will not be there to collect. Lower the chance and the rate falls, with nobody deciding anything.' })}
      ${jobCard(book, { n: 2, slug: 'the-estate', glyph: F.jobGlyphs.capital, title: 'It turns over capital', line: 'Inheritance is the largest redistributive event in any market economy, and nobody legislated it. It is the only force that reliably breaks up a fortune.' })}
      ${jobCard(book, { n: 3, slug: 'the-funeral-principle', glyph: F.jobGlyphs.ideas, title: 'It turns over ideas', line: 'Fields change direction when the people who defined them stop occupying the chairs. This is not a slur on scientists. It is a measured effect.' })}
      ${jobCard(book, { n: 4, slug: 'nobody-goes-to-space', glyph: F.jobGlyphs.risk, title: 'It prices risk', line: 'How much danger you will accept depends on how much life you are wagering. This produces the strangest result in the book.' })}
      ${jobCard(book, { n: 5, slug: 'vacancy', glyph: F.jobGlyphs.vacancy, title: 'It creates openings', line: 'Careers are queues, and queues advance because people leave them. Every promotion in every hierarchy is somebody else’s exit.' })}
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap">
    <div class="measure" data-reveal>
      <p class="label">Job one &middot; Chapter 3</p>
      <h2 class="display-m" style="margin-top:1rem">The price of time</h2>
      <p style="margin-top:1.4rem">In 1648 a Dutch water authority issued a bond on goatskin to pay for dike repairs. Not for ten years. Not for a hundred. Forever. It still pays, and Yale owns one of the five known survivors.</p>
      <p>A perpetual bond has no maturity, which means the entire question of what it is worth reduces to a single number. Move the discount rate and watch what happens to every permanent thing there is.</p>
    </div>

    <div class="split" style="margin-top:clamp(2.5rem,6vh,4rem)">
      <div data-reveal>
        ${fig({
          id: 'perp',
          n: 'Interactive',
          title: 'What a perpetuity is worth',
          body: F.figPerpetuity() + `
  <div class="control">
    <div class="control-row">
      <label class="label" for="perp-rate">Discount rate <span id="perp-rate-out" class="amber">5.00%</span></label>
      <span class="control-out" id="perp-value">$20,000</span>
    </div>
    <input id="perp-rate" type="range" min="50" max="1000" step="1" value="500"
           aria-label="Discount rate, in hundredths of a percent">
    <p class="control-note" id="perp-note">Ordinary. This is the world valuation was designed for.</p>
  </div>`,
          caption: 'An asset paying $1,000 a year, forever. At ten percent it is worth ten thousand dollars. At one percent, a hundred thousand. At zero there is no answer. Not a very large answer. No answer.',
          source: 'Drag the rate. The formula is value = payment divided by rate',
        })}
      </div>
      <div class="stack" data-reveal style="--delay:.1s">
        ${fig({
          n: 'Figure 2',
          title: 'Forty years of drift nobody can fully explain',
          body: F.figRstar(),
          caption: 'Real rates across the developed world have been falling structurally, not cyclically. The decline preceded the 2008 crisis, survived it, and continued through wildly different policy regimes. Demographics appears in essentially every serious treatment.',
          source: 'Shape indicative, after Laubach and Williams; see the notes',
        })}
        <div class="measure stack">
          <p>I am not claiming that longevity explains the fall in real rates. I am claiming something weaker and harder to argue with: that a mainstream body of research finds longer lives push real rates down, that real rates have gone down over exactly the period in which healthy old age has been extending, and that essentially nobody has asked what happens if the input keeps moving.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap pull-block" data-reveal>
    <p class="pull measure-wide center-x">${q(3)}</p>
    <cite>Chapter 3 &middot; The Price of Time</cite>
  </div>
</section>

<section class="band">
  <div class="wrap split">
    <div class="measure stack" data-reveal>
      <p class="label">Job two &middot; Chapter 4</p>
      <h2 class="display-m">Seventeen thousand times</h2>
      <p>Capital earning five percent a year after inflation multiplies about four and a third times over a working career. That is the arithmetic of a successful life.</p>
      <p>Over two hundred years, the same five percent multiplies your money by about seventeen thousand. Not seventeen thousand dollars. Seventeen thousand times, in real terms, at an unremarkable rate of return, with no brilliance required at any point. Just continuity.</p>
      <p class="dim">The only reason we do not observe absurd outcomes is that nobody has ever had an extraordinary period. The compounding always gets cut. The owner dies, the estate splits, the tax lands.</p>
      <div class="stats" style="margin-top:2rem">
        <div class="stat">
          <span class="n"><span data-count="17000">17,000</span><span class="unit">x</span></span>
          <span class="k">five percent real, compounded for two hundred years</span>
        </div>
        <div class="stat">
          <span class="n">1983</span>
          <span class="k">the year South Dakota abolished the rule against perpetuities, and the race began</span>
        </div>
      </div>
    </div>
    <div data-reveal style="--delay:.1s">
      ${fig({
        n: 'Figure 3',
        title: 'One dollar, five percent real, two centuries',
        body: F.figCompounding(),
        caption: 'For four hundred years, common law jurisdictions maintained a rule whose only purpose was to force property back to the living. In about thirty years a significant part of the developed world took it apart in exchange for trust management fees. We disabled the anti permanence machinery first. The permanence is arriving second.',
        source: 'Log scale. Author’s calculation, Chapter 4',
      })}
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap split narrow-right">
    <div class="stack" data-reveal>
      ${fig({
        n: 'Figure 4',
        title: 'Four hundred and fifty two sudden exits',
        body: F.figFuneral(),
        caption: 'Elite life scientists who died prematurely while still active. An unexpected death is close to a natural experiment: it removes a person from a field without the gradual withdrawal that would otherwise muddy the picture.',
        source: 'Azoulay, Fons-Rosen and Graff Zivin, American Economic Review, 2019',
      })}
      ${fig({
        n: 'Figure 5',
        title: 'What happened to those fields afterward',
        body: F.figOutsiders(),
        caption: 'Researchers who had never worked with the deceased began publishing in the area at a higher rate, and it did not fade. Their papers drew on different prior work and were disproportionately highly cited. The ideas had been out there the whole time. What changed was that the position blocking them became vacant.',
        source: 'Same study',
      })}
    </div>
    <div class="measure stack" data-reveal style="--delay:.1s">
      <p class="label">Job three &middot; Chapter 5</p>
      <h2 class="display-m">The funeral principle</h2>
      <p>Max Planck wrote that a new scientific truth does not triumph by convincing its opponents. The line gets a laugh at conferences. Nobody treats it as what it is, which is a testable empirical claim about how knowledge propagates through a profession.</p>
      <p>It has been tested. The result is not funny.</p>
      <p>And the mechanism is not villainy. An eminent researcher sits on the grant panels, referees for the journals, advises on hiring, trains the next cohort and writes the review articles that define the open problems. Suppose they sincerely believe a line of inquiry is a dead end. They will rate that application slightly lower, in good faith, because they honestly think it is less promising.</p>
      <p class="dim">There is no bad actor to remove. There is only the ordinary operation of authority, and the track record was built in the old paradigm.</p>
    </div>
  </div>
</section>

<section class="band-sunken">
  <div class="wrap">
    <div class="measure" data-reveal>
      <p class="label">Job four &middot; Chapter 6</p>
      <h2 class="display-l" style="margin-top:1rem">Nobody goes to space</h2>
      <p class="lede" style="margin-top:1.4rem">In July 1969 a White House speechwriter drafted a eulogy for two men who would suffocate on the Moon while the planet listened. The speech went into a drawer. NASA lit the rocket anyway.</p>
    </div>

    <div class="split" style="margin-top:clamp(2.5rem,6vh,4rem)">
      <div class="measure stack" data-reveal>
        <p>The usual explanation is character. People were braver then. I want to offer one that is less flattering and more useful. <strong>They were cheaper.</strong> Not cheaper as people. Cheaper as assets.</p>
        <p>Think of a life as a stream of future years, the way a bond is a stream of payments. A seventy year old is a short bond. A healthy twenty five year old is something like a fifty year bond. Now cure aging, and the person in front of you is a perpetual bond.</p>
        <p>Every bit of what a perpetuity is worth lives in the chance that it gets interrupted. Armstrong was not braver than a person who will live a thousand years. He was shorter dated. He was betting forty expected years on a coin flip. The thousand year person is asked to bet a perpetuity on the same flip.</p>
        <p class="dim">Curing aging does not give you immortality. It converts immortality from a biology problem into a risk management problem, and the risk management version is harder. Biology is a finite opponent. Accidents are not.</p>
      </div>
      <div class="stack" data-reveal style="--delay:.1s">
        ${fig({
          n: 'Figure 6',
          title: 'What kills you when nothing else does',
          body: F.figRuin(),
          caption: 'Suppose the aging term goes to zero and only background accident risk is left, at roughly one in two thousand per year. Any number below one, raised to a high enough power, goes to zero. Over a long enough horizon ruin is not a risk. It is a certainty with a waiting time.',
          source: 'Author’s arithmetic, shown so you can see how thin it is',
        })}
        ${fig({
          id: 'launch',
          n: 'Interactive',
          title: 'The price of one launch',
          body: `
  <div class="control" style="border-top:0">
    <div class="control-row">
      <label class="label" for="risk-odds">Chance of dying on the trip <span id="risk-odds-out" class="amber">1 in 10,000</span></label>
    </div>
    <input id="risk-odds" type="range" min="190" max="500" step="1" value="400"
           aria-label="Chance of dying, as one in N">
    <div class="control-row" style="margin-top:.4rem">
      <label class="label" for="risk-years">Life you are wagering <span id="risk-years-out" class="amber">2,000 years</span></label>
    </div>
    <input id="risk-years" type="range" min="150" max="340" step="1" value="330"
           aria-label="Expected remaining life, in years">
    <div class="control-row" style="margin-top:.9rem;border-top:1px solid var(--hair);padding-top:.9rem">
      <span class="label">Expected life lost <span id="risk-lost" class="amber">0.20 years</span></span>
      <span class="control-out" id="risk-price">$60,000</span>
    </div>
    <div style="height:2px;background:var(--hair);overflow:hidden">
      <div id="risk-bar" style="height:2px;background:var(--amber);width:40%;transition:width .25s"></div>
    </div>
    <p class="control-note" id="risk-verdict">The underwriter starts asking questions.</p>
  </div>`,
          caption: 'The Shuttle lost two crews in a hundred and thirty five flights, about one in ninety. Be generous to the future and call it one in ten thousand. For someone with forty years left that is nothing. For someone with two thousand years left it is a fifth of a year of expected life, priced at a few hundred thousand dollars a year, per person, per launch, before anything else is counted.',
          source: 'Risk premium at $300,000 per life-year, per Chapter 6',
        })}
      </div>
    </div>

    <div class="wrap pull-block" style="padding-inline:0" data-reveal>
      <p class="pull measure-wide center-x">Every civilization rich enough to reach the stars is <em>too rich to go</em>.</p>
      <cite>Chapter 6 &middot; Nobody Goes to Space</cite>
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap split">
    <div class="measure stack" data-reveal>
      <p class="label">Job five &middot; Chapter 7</p>
      <h2 class="display-m">Vacancy</h2>
      <p>A hermit crab does not grow a shell. It finds one. When a large empty shell appears on a beach, the biggest crab that can use it moves in and abandons its old one, and the next crab down takes that, and so on. One object became available and a dozen animals improved their position.</p>
      <p>Harrison White proposed studying promotion the same way. Follow the vacancy rather than the person. The number of promotions in a system is not determined by how many talented people it contains. It is determined by how many openings appear, and openings come from exactly two sources: growth and exit.</p>
      <p>Retirement is not an independent institution. It is a derivative of mortality, and it evaporates for a person of two hundred in perfect health who is, by any measure we currently use, the most qualified person in the building.</p>
      <p class="dim">If the service rate goes to zero you do not have a slow queue. You have a queue that is not moving, and the waiting time is not long. It is undefined.</p>
    </div>
    <div class="stack" data-reveal style="--delay:.1s">
      ${fig({
        n: 'Figure 7',
        title: 'One exit, six moves',
        body: F.figVacancy(),
        caption: 'The person moves up and the vacancy moves down. They are the same event described from two directions.',
        source: 'After Harrison White, Chains of Opportunity, 1970',
      })}
      ${fig({
        n: 'Figure 8',
        title: 'From a fifth of the field to a twentieth',
        body: F.figNih(),
        caption: 'The share of principal investigators on major NIH grants who were thirty six or younger. Over the same period the average age at first independent grant rose from about thirty six to about forty two, and has sat there since. Not a slower ladder for the young. The young, as a category, mostly stopped appearing.',
        source: 'Chapter 7; several causes operate through the same channel',
      })}
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap">
    <div class="measure-wide center-x" style="text-align:center" data-reveal>
      <p class="label">Part III &middot; the counterparty</p>
      <h2 class="display-l" style="margin-top:1rem">The forkable worker</h2>
      <p class="lede" style="margin-top:1.4rem">At exactly the moment we are removing mortality from the people who own things, we are manufacturing a new class of economic actor whose lifespan is a setting in a configuration file.</p>
    </div>

    <div class="split" style="margin-top:clamp(2.5rem,6vh,4rem)">
      <div data-reveal>
        ${fig({
          n: 'Figure 9',
          title: 'Fork four ways, keep one',
          body: F.figFork(),
          caption: 'Nothing dramatic occurred. No ceremony attended the deletion of the three. Anyone who builds these systems does it several times a day without giving it a moment’s thought, and the vocabulary is aggressively mundane. You spawn an agent. You checkpoint it. You fork it. You kill it.',
          source: 'Chapter 8, The Forkable Worker',
        })}
      </div>
      <div class="measure stack" data-reveal style="--delay:.1s">
        <p>Every economic actor in history has had a lifespan that was given to it. For the first time we have made a participant whose mortality is a design parameter.</p>
        <p>And every job death has been doing can be performed deliberately on something forkable. Horizon is configured rather than felt. Holdings are wound up by a clause rather than by four hundred years of property law. A model is retired and replaced with one trained on newer material, which is a deployment rather than a delicate matter of persuading an eminent authority to update.</p>
        <p><strong>We are removing mortality from one side of the economy and inventing it on the other.</strong></p>
        <p class="dim">There is a hole in the middle of this and it is better to point at it than paper over it. All of the above assumes ending an agent stays cheap. Nobody knows whether that is true, the question is genuinely hard, and the economic pressure to answer it in the convenient direction is going to be immense.</p>
      </div>
    </div>

    <div style="margin-top:clamp(2.5rem,6vh,4rem)" data-reveal>
      ${fig({
        n: 'Figure 10',
        title: 'The asymmetry',
        body: F.figTwoClasses(),
        caption: 'Every property that death used to distribute across the whole population is now distributed between two populations. One gets permanence, ownership and safety. The other gets mortality, labour and risk. Nobody chose this. It is the natural result of two technologies arriving at the same time, each solving its own problem, neither aware of the other.',
        source: 'Chapters 8 and 9',
      })}
    </div>
  </div>
</section>

<section class="band-sunken">
  <div class="wrap">
    <div class="split">
      <div class="measure stack" data-reveal>
        <p class="label">Part IV &middot; Chapter 10</p>
        <h2 class="display-l">The Serrata</h2>
        <p style="margin-top:1.2rem">Before it froze, Venice had invented a machine for making poor men rich. The colleganza let a man with nothing but nerve take a ship to Constantinople, do the trading, survive the Mediterranean, and come home with a quarter of the profit. It converted courage into equity, and any notary in the city could write one.</p>
        <p>Then the families who had arrived stopped the door behind them. In 1297 the Great Council was closed to anyone whose family was not already inside it. Having sealed the political door, the new hereditary nobility went after the economic one, and the instrument that had carried them up fell away beneath them.</p>
        <p>Venice did not collapse. It lasted another five hundred years, stayed wealthy, stayed beautiful, kept its art and acquired more of it. It simply stopped mattering. When Napoleon ended the Republic in 1797 he met essentially no resistance, because there was nothing left with an interest in resisting.</p>
      </div>
      <div class="stack" data-reveal style="--delay:.1s">
        ${fig({
          n: 'Figure 11',
          title: 'Five centuries of nothing further happening',
          body: F.figSerrata(),
          caption: 'This is the right historical model, and it is not the apocalyptic one. The frozen world is a pleasant place to live if you are already inside it, which is exactly what makes it hard to argue against and easy to drift into.',
          source: 'Puga and Trefler on the Serrata; see the notes',
        })}
      </div>
    </div>

    <div class="measure-wide center-x stack" style="margin-top:clamp(3rem,7vh,4.5rem)" data-reveal>
      <p class="label">The honest column</p>
      <p>Nobody dies. Take a moment with that, because everything else is second order next to it. The single greatest source of human suffering across all of history is that people we love stop existing, and in this world that stops happening. It is safe. It is rich. It is patient, and a society that discounts the future at nearly zero will finally build the seawalls with two hundred year payback periods.</p>
      <p class="dim">What is missing is not a specific good thing. It is the category. The frozen world lacks the mechanism by which the arrangement of things could come to be different from how it currently is. The word for that is not decline. The word is closure.</p>
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap">
    <div class="measure-wide center-x" style="text-align:center" data-reveal>
      <p class="label">Part V &middot; Chapter 11</p>
      <h2 class="display-l" style="margin-top:1rem">Reinventing the funeral</h2>
      <p class="lede" style="margin-top:1.4rem">There is a correct order of operations for removing a load bearing wall. You shore it first. Then you place the beam. Then you take out the wall, and the building never knows anything occurred.</p>
    </div>

    <div class="measure center-x" style="margin-top:clamp(2rem,5vh,3rem)" data-reveal>
      <p>What death actually does, mechanically, is convert permanent claims into temporary ones. Your property, your position, your authority, your seat, all of it reverts. You held a lease and called it ownership, and the term was your life. So every replacement takes the same form.</p>
    </div>

    <div class="wrap pull-block" style="padding-inline:0" data-reveal>
      <p class="pull measure-wide center-x">Everything death used to take back by force, we will have to <em>take back by contract</em>.</p>
    </div>

    <div class="grid grid-3" data-reveal>
      ${[
        ['Pricing permanence', 'Stop selling permanent claims on scarce permanent things. Hong Kong already runs this way: every square metre is leased from the government, and the leases expiring in 2047 were extended by gazette notice rather than by anyone’s discretion. Tax the flow, not the stock.', 'Leasehold has a failure mode. As the term ends, the holder stops maintaining the property.'],
        ['Turning over capital', 'Restore the rule against perpetuities at a level that cannot be competed away, which means federally. The serious version is a self assessed tax on declared value, which replicates the one property of death that matters: it does not care who you are.', 'It is horrible for anything you love, and that intuition is correct rather than sentimental.'],
        ['Turning over ideas', 'Term the position, not the person. Fixed terms on the seat on the grant panel, the editorship, the chair of the review committee. An eminent scientist of two hundred stays eminent. They simply do not also decide which applications succeed, for the two hundredth consecutive year.', 'Rotation costs expertise. But we already pay that cost in full at every death, and involuntarily.'],
        ['Who may take a risk', 'This is the ugly one. A legal category for consented high risk activity is precisely how every exploitative labour arrangement in history described itself. The only fix is to actually pay the premium Chapter 6 calculates, denominated against the life expectancy of the person accepting it.', 'A society that will not pay that price does not get the frontier. That is a legitimate outcome, and better than getting it by not paying.'],
        ['Opening positions', 'Term limits as an economic instrument rather than a political one, attached to the seat rather than the sector. Leaving a board after twelve years does not bar you from working. It returns the position to circulation.', 'Forced churn advantages the already connected. A system that rotates badly still beats one with no mechanism at all.'],
        ['The defect in all of it', 'Each proposal has to be adopted by the people it constrains. That has always been solvable, for one reason: nobody knew which position they would end up in. Death is what puts the veil of ignorance there, and removing it lifts the veil permanently.', 'Everything here is easy to enact today and impossible to enact later. That is the whole argument.'],
      ].map(([h, p, objection]) => `
      <div class="cell">
        <h3>${escapeHtml(h)}</h3>
        <p>${smarten(p)}</p>
        <p style="color:var(--clay);font-size:.84rem;border-top:1px solid var(--hair);padding-top:.8rem;margin-top:.4rem">${smarten(objection)}</p>
      </div>`).join('')}
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap split narrow-right">
    <div data-reveal>
      ${fig({
        n: 'Figure 12',
        title: 'Where the value actually sits',
        body: F.figTerminalValue(),
        caption: 'In a standard five year forecast, the bundled residual commonly runs to about three quarters of enterprise value, and practitioners are taught to flag it above eighty percent because the valuation has stopped being about the business and become a bet on a formula. Most of what any durable thing is worth lies past the horizon of anyone’s competence to forecast.',
        source: 'Chapter 12, Terminal Value',
      })}
    </div>
    <div class="measure stack" data-reveal style="--delay:.1s">
      <p class="label">Chapter 12 &middot; the close</p>
      <h2 class="display-m">The people who built for strangers</h2>
      <p>Cologne Cathedral was begun in 1248 and finished in 1880. Every person who laid the first stones died without seeing a roof. Their children died. Their grandchildren died.</p>
      <p>We usually call that altruism, or vision. Look at it as an accountant and a colder explanation appears. If you are going to die, you cannot consume the future. It is not available to you at any price, which means the only relationship you can have with it is to give something to it.</p>
      <p><strong>Death converted the entire terminal value of civilization into a gift, because a gift was the only transaction available.</strong></p>
      <p class="dim">The pessimistic answer is not that the cathedral stops being built. It is that the cathedral stops being given. The forest is planted as a holding, by an owner who will harvest it personally in year two hundred.</p>
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap pull-block" data-reveal>
    <p class="pull measure-wide center-x">Longevity buys you Earth. The stars go to <em>whoever is still willing to die</em>.</p>
    <cite>Chapter 6, and again in Chapter 12</cite>
  </div>
</section>

<section class="band-sunken" id="get">
  <div class="wrap">
    <div class="split">
      <div class="measure stack" data-reveal>
        <p class="label">Take it with you</p>
        <h2 class="display-m">Four formats, one source</h2>
        <p>The manuscript is the single source of truth. The print interior, the ebook, the working paper and this site are all generated from it, so they never drift apart.</p>
        <p class="dim">This is a complete draft rather than a finished book, and it is published in that condition on purpose. ${book.verification.verified} of its claims have been checked against sources and ${book.verification.unverified} have not. The ones found wrong during verification were corrected and recorded rather than quietly fixed. All of it is there, claim by claim, in the <a href="/notes" style="color:var(--amber)">notes</a>.</p>
      </div>
      <div data-reveal style="--delay:.1s">
        <div class="dl">
          ${downloads.map((d) => `<a href="${d.href}" download>
            <span class="fmt">${d.fmt}</span>
            <h4>${escapeHtml(d.title)}</h4>
            <p>${smarten(d.note)}</p>
          </a>`).join('\n          ')}
        </div>
        <p style="margin-top:1.6rem"><a class="btn" href="/read">Or read it here, chapter by chapter
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></p>
      </div>
    </div>
  </div>
</section>`;

  return layout({
    book,
    title: book.meta.title,
    description: book.meta.description,
    path: '/',
    current: 'home',
    body,
  });
}

/* ----------------------------------------------------------- contents -- */

export function contentsPage(book) {
  const body = `
<section class="band" style="padding-top:8rem">
  <div class="wrap">
    <div class="measure-wide" data-reveal>
      <p class="label">Contents</p>
      <h1 class="display-l" style="margin-top:1rem">${escapeHtml(book.meta.title)}</h1>
      <p class="lede" style="margin-top:1.2rem">${escapeHtml(book.meta.subtitle)}</p>
      <p style="margin-top:1.6rem" class="dim">${book.chapters.length} chapters and a set of notes.
      About ${(Math.round(book.words / 100) * 100).toLocaleString()} words, roughly a hundred printed pages.</p>
    </div>

    <div style="margin-top:clamp(2.5rem,6vh,4rem)">
      ${book.parts.map((part, i) => `
      <div class="toc-part" data-reveal style="--delay:${(i * 0.06).toFixed(2)}s">
        <div class="part-meta">
          <p class="label">Part ${part.n}</p>
          <p style="font-family:var(--display);font-size:1.15rem;color:var(--paper);line-height:1.15;margin-bottom:.7rem">${escapeHtml(part.title)}</p>
          <p>${smarten(escapeHtml(part.blurb))}</p>
        </div>
        <div>
          ${part.items.map((c) => `
          <a class="toc-item" href="/chapters/${c.slug}">
            <span class="n">${c.n}</span>
            <span>
              <h3>${escapeHtml(c.title)}</h3>
              <p>${smarten(escapeHtml(c.blurb))}</p>
            </span>
          </a>`).join('')}
        </div>
      </div>`).join('')}

      <div class="toc-part" data-reveal>
        <div class="part-meta">
          <p class="label">Back matter</p>
        </div>
        <div>
          <a class="toc-item" href="/notes">
            <span class="n">&#167;</span>
            <span>
              <h3>Notes</h3>
              <p>Every claim with its verification status, including the ones found wrong during checking and corrected rather than quietly fixed.</p>
            </span>
          </a>
        </div>
      </div>
    </div>

    <div style="margin-top:clamp(3rem,7vh,4.5rem)" data-reveal>
      <p class="label" style="margin-bottom:1.2rem">Take it with you</p>
      <div class="dl">
        ${downloads.map((d) => `<a href="${d.href}" download>
          <span class="fmt">${d.fmt}</span>
          <h4>${escapeHtml(d.title)}</h4>
          <p>${smarten(d.note)}</p>
        </a>`).join('\n        ')}
      </div>
    </div>
  </div>
</section>`;

  return layout({
    book,
    title: 'Contents',
    description: `All twelve chapters of ${book.meta.title}, plus the notes.`,
    path: '/read',
    current: 'read',
    body,
  });
}

/* ------------------------------------------------------------ chapter -- */

function readerNav(item) {
  const link = (target, dir) => {
    if (!target) return '<span class="empty"></span>';
    const href = target.kind === 'notes' ? '/notes' : `/chapters/${target.slug}`;
    return `<a href="${href}">
      <span class="label">${dir}</span>
      <h4>${escapeHtml(target.title)}</h4>
    </a>`;
  };
  return `<nav class="reader-nav">${link(item.prev, 'Previous')}${link(item.next, 'Next')}</nav>`;
}

export function chapterPage(book, c) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: c.title,
    author: { '@type': 'Person', name: book.meta.author },
    isPartOf: { '@type': 'Book', name: book.meta.title },
    description: c.blurb,
    url: `${book.meta.siteUrl}/chapters/${c.slug}`,
  };

  const body = `
<div class="progress" aria-hidden="true"></div>
<article class="reader">
  <div class="wrap">
    <header class="reader-head" data-reveal>
      <p class="label">Chapter ${ROMAN[c.n] || c.n}</p>
      <h1>${escapeHtml(c.title)}</h1>
      <div class="flourish"></div>
    </header>

    <div class="prose">
      ${renderBlocks(c.blocks, { shift: 1, firstParagraph: openingParagraph })}
    </div>

    ${c.quote ? `<div class="reader-quote"><p class="pull">${smarten(escapeHtml(c.quote))}</p></div>` : ''}

    ${readerNav(c)}

    <p class="label" style="max-width:var(--measure-wide);margin:2rem auto 0;text-align:center">
      <a href="/read">All chapters</a> <span class="dot">&middot;</span>
      <a href="/notes">Notes for this chapter</a> <span class="dot">&middot;</span>
      <a href="/#get">Download the book</a>
    </p>
  </div>
</article>`;

  return layout({
    book,
    title: `${c.n}. ${c.title}`,
    description: c.blurb || c.excerpt.slice(0, 180),
    path: `/chapters/${c.slug}`,
    current: 'chapter',
    extraHead: `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
    body,
  });
}

/* -------------------------------------------------------------- notes -- */

export function notesPage(book) {
  const n = book.notes;
  const body = `
<div class="progress" aria-hidden="true"></div>
<article class="reader">
  <div class="wrap">
    <header class="reader-head" data-reveal>
      <p class="label">Back matter</p>
      <h1>Notes</h1>
      <div class="flourish"></div>
    </header>
    <div class="prose">
      ${renderBlocks(n.blocks, { shift: 1 })}
    </div>
    ${readerNav(n)}
  </div>
</article>`;

  return layout({
    book,
    title: 'Notes',
    description: 'Every claim in the book with its verification status, including the ones found wrong during checking and corrected rather than quietly fixed.',
    path: '/notes',
    current: 'notes',
    body,
  });
}
