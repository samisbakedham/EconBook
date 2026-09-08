// The cover art, drawn as HTML/SVG and rasterised by headless Chrome.
// The graphic is the book's argument: the present value of a future year,
// decaying steeply at a normal discount rate, then refusing to decay at all.

const bars = (count, rate, { amber }) => {
  let out = '';
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const h = Math.exp(-rate * t * 60);
    const y = 1 - h;
    out += `<rect x="${(i * (100 / count)).toFixed(3)}" y="${(y * 100).toFixed(3)}" width="${(100 / count) * 0.42}" height="${(h * 100).toFixed(3)}" fill="${amber}" />`;
  }
  return out;
};

export function coverHtml({ meta, fontCss, width = 1800, height = 2700 }) {
  const INK = '#0a0b0e';
  const PAPER = '#efe9dd';
  const AMBER = '#d99b3f';

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><style>
${fontCss}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${width}px;height:${height}px;background:${INK};overflow:hidden}
.cover{position:relative;width:${width}px;height:${height}px;color:${PAPER};
  font-family:'Newsreader',Georgia,serif;display:flex;flex-direction:column}
.glow{position:absolute;inset:0;background:
  radial-gradient(120% 62% at 50% 104%, rgba(217,155,63,.30), transparent 62%),
  radial-gradient(90% 48% at 50% -8%, rgba(217,155,63,.10), transparent 60%)}
.grain{position:absolute;inset:0;opacity:.055;mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E")}
.rule{height:1px;background:rgba(239,233,221,.26)}
.top{position:relative;padding:${height * 0.075}px ${width * 0.105}px 0;text-align:center}
.kicker{font-family:'IBM Plex Mono',monospace;font-size:${width * 0.0175}px;
  letter-spacing:.42em;text-transform:uppercase;color:rgba(239,233,221,.55)}
h1{font-family:'Fraunces',Georgia,serif;font-variation-settings:'SOFT' 24,'WONK' 1;
  font-weight:400;font-size:${width * 0.148}px;line-height:.92;letter-spacing:-.022em;
  margin:${height * 0.038}px 0 0}
h1 em{display:block;font-style:normal;color:${AMBER}}
.sub{font-style:italic;font-size:${width * 0.0335}px;line-height:1.34;
  color:rgba(239,233,221,.74);max-width:${width * 0.66}px;margin:${height * 0.033}px auto 0}
.art{position:relative;flex:1;margin:${height * 0.045}px ${width * 0.105}px 0;min-height:0}
.art svg{position:absolute;inset:0;width:100%;height:100%}
.axis{font-family:'IBM Plex Mono',monospace;font-size:${width * 0.0145}px;
  letter-spacing:.24em;text-transform:uppercase;color:rgba(239,233,221,.42);
  display:flex;justify-content:space-between;position:absolute;left:0;right:0;bottom:${height * -0.03}px}
.bottom{position:relative;padding:0 ${width * 0.105}px ${height * 0.062}px;text-align:center}
.author{font-family:'IBM Plex Mono',monospace;font-size:${width * 0.0225}px;
  letter-spacing:.3em;text-transform:uppercase;margin-top:${height * 0.05}px}
</style></head>
<body><div class="cover">
  <div class="glow"></div>
  <div class="top">
    <div class="kicker">An essay in five removals</div>
    <h1>Terminal<em>Value</em></h1>
    <div class="sub">${meta.subtitle}</div>
  </div>

  <div class="art">
    <svg viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id="fade" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stop-color="${AMBER}" stop-opacity=".18"/>
          <stop offset="1" stop-color="${AMBER}" stop-opacity=".95"/>
        </linearGradient>
      </defs>
      <g opacity=".9">${bars(56, 0.075, { amber: 'url(#fade)' })}</g>
      <g opacity=".22">${bars(56, 0.002, { amber: PAPER })}</g>
      <line x1="0" y1="100" x2="100" y2="100" stroke="rgba(239,233,221,.3)" stroke-width=".35" vector-effect="non-scaling-stroke"/>
    </svg>
    <div class="axis"><span>today</span><span>sixty years out</span></div>
  </div>

  <div class="bottom">
    <div class="author">${meta.author}</div>
  </div>
  <div class="grain"></div>
</div></body></html>`;
}

/**
 * A print ready KDP wrap: back cover, spine and front on one sheet.
 * Spine width is a function of the page count, so this can only be built
 * after the interior exists.
 *
 * KDP geometry for a 6 x 9 paperback: 0.125in bleed on all four outer edges,
 * and a 2 x 1.2in clear zone at the lower right of the back cover where the
 * barcode is printed.
 */
export function coverWrapHtml({ meta, fontCss, pages, paper = 'cream', dpi = 300 }) {
  const PPI = paper === 'white' ? 0.002252 : 0.0025;   // inches of spine per page
  const spine = pages * PPI;
  const bleed = 0.125;
  const W = (6 + spine + 6 + bleed * 2) * dpi;
  const H = (9 + bleed * 2) * dpi;
  const px = (inches) => inches * dpi;

  const INK = '#0a0b0e';
  const PAPER = '#efe9dd';
  const AMBER = '#d99b3f';

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><style>
${fontCss}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;background:${INK};overflow:hidden}
.wrap{position:relative;width:${W}px;height:${H}px;display:flex;color:${PAPER};
  font-family:'Newsreader',Georgia,serif}
.glow{position:absolute;inset:0;pointer-events:none;background:
  radial-gradient(58% 60% at 82% 104%, rgba(217,155,63,.26), transparent 62%),
  radial-gradient(52% 48% at 16% -6%, rgba(217,155,63,.09), transparent 60%)}
.grain{position:absolute;inset:0;opacity:.05;mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E")}

.panel{position:relative;height:100%}
.back{width:${px(6 + bleed)}px;padding:${px(bleed + 0.72)}px ${px(0.62)}px ${px(bleed + 0.55)}px ${px(bleed + 0.62)}px;
  display:flex;flex-direction:column}
.spine{width:${px(spine)}px;display:flex;align-items:center;justify-content:center;
  border-left:1px solid rgba(239,233,221,.10);border-right:1px solid rgba(239,233,221,.10)}
.front{width:${px(6 + bleed)}px;padding:${px(bleed + 0.8)}px ${px(bleed + 0.62)}px ${px(bleed + 0.62)}px ${px(0.62)}px;
  display:flex;flex-direction:column;text-align:center}
.front .art{position:relative;flex:1;min-height:0;margin:${px(0.4)}px 0 ${px(0.5)}px}
.front .art svg{position:absolute;inset:0;width:100%;height:100%}
.front .axis{position:absolute;left:0;right:0;bottom:${px(-0.24)}px;display:flex;
  justify-content:space-between;font-family:'IBM Plex Mono',monospace;
  font-size:${px(0.085)}px;letter-spacing:.22em;text-transform:uppercase;
  color:rgba(239,233,221,.42)}

.kicker{font-family:'IBM Plex Mono',monospace;font-size:${px(0.105)}px;
  letter-spacing:.34em;text-transform:uppercase;color:rgba(239,233,221,.55)}
h1{font-family:'Fraunces',Georgia,serif;font-variation-settings:'SOFT' 24,'WONK' 1;
  font-weight:400;font-size:${px(0.86)}px;line-height:.92;letter-spacing:-.022em;margin-top:${px(0.24)}px}
h1 em{display:block;font-style:normal;color:${AMBER}}
.sub{font-style:italic;font-size:${px(0.2)}px;line-height:1.34;
  color:rgba(239,233,221,.76);margin-top:${px(0.22)}px}
.author{font-family:'IBM Plex Mono',monospace;font-size:${px(0.135)}px;
  letter-spacing:.3em;text-transform:uppercase;margin-top:auto}

.blurb{font-size:${px(0.145)}px;line-height:1.55;color:rgba(239,233,221,.88)}
.blurb p{margin-bottom:${px(0.17)}px}
.blurb .lead{font-size:${px(0.18)}px;color:${PAPER}}
.rule{height:1px;background:rgba(239,233,221,.22);margin:${px(0.26)}px 0}
.quote{font-family:'Fraunces',Georgia,serif;font-variation-settings:'SOFT' 20,'WONK' 1;
  font-size:${px(0.235)}px;line-height:1.18;color:${AMBER}}
.imprint{font-family:'IBM Plex Mono',monospace;font-size:${px(0.085)}px;
  letter-spacing:.2em;text-transform:uppercase;color:rgba(239,233,221,.45);margin-top:${px(0.2)}px}
/* Barcode keep-clear zone, 2 x 1.2in at the lower right of the back panel. */
.barcode{position:absolute;right:${px(0.5)}px;bottom:${px(bleed + 0.32)}px;
  width:${px(2)}px;height:${px(1.2)}px;background:${PAPER};border-radius:2px}

.spine-text{font-family:'Fraunces',Georgia,serif;font-variation-settings:'SOFT' 16,'WONK' 1;
  font-size:${px(Math.min(0.3, spine * 0.62))}px;white-space:nowrap;
  transform:rotate(90deg);transform-origin:center;letter-spacing:.01em}
.spine-text .a{font-family:'IBM Plex Mono',monospace;font-size:${px(0.1)}px;
  letter-spacing:.24em;text-transform:uppercase;color:rgba(239,233,221,.6)}
</style></head>
<body><div class="wrap">
  <div class="glow"></div>

  <div class="panel back">
    <div class="blurb">
      <p class="lead">Economics treats death as a boundary condition and never inspects it.</p>
      <p>But death is quietly doing at least five jobs. It sets the discount rate. It turns over capital. It turns over ideas. It prices risk. And it creates vacancy.</p>
      <p>Each one is load bearing. None of them has a backup. Radical life extension removes all five at once, and the result is not utopia and not catastrophe but something stranger: a civilization that is wealthy, safe, static and permanently locked in.</p>
      <p>Meanwhile artificial agents arrive as the first economic actors with genuinely arbitrary lifespans, and the turnover function migrates from people to machines.</p>
    </div>
    <div class="rule"></div>
    <p class="quote">Longevity buys you Earth. The stars go to whoever is still willing to die.</p>
    <p class="imprint">${escapeAttr(meta.repo.replace(/^https:\/\//, ''))}</p>
    <div class="barcode"></div>
  </div>

  <div class="panel spine">
    <div class="spine-text">${escapeAttr(meta.title)} &nbsp;&nbsp;<span class="a">${escapeAttr(meta.author)}</span></div>
  </div>

  <div class="panel front">
    <div class="kicker">An essay in five removals</div>
    <h1>Terminal<em>Value</em></h1>
    <div class="sub">${escapeAttr(meta.subtitle)}</div>
    <div class="art">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs><linearGradient id="wrapFade" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stop-color="${AMBER}" stop-opacity=".18"/>
          <stop offset="1" stop-color="${AMBER}" stop-opacity=".95"/>
        </linearGradient></defs>
        <g opacity=".9">${bars(46, 0.075, { amber: 'url(#wrapFade)' })}</g>
        <g opacity=".2">${bars(46, 0.002, { amber: PAPER })}</g>
        <line x1="0" y1="100" x2="100" y2="100" stroke="rgba(239,233,221,.3)" stroke-width=".4" vector-effect="non-scaling-stroke"/>
      </svg>
      <div class="axis"><span>today</span><span>sixty years out</span></div>
    </div>
    <div class="author">${escapeAttr(meta.author)}</div>
  </div>

  <div class="grain"></div>
</div></body></html>`;
}

const escapeAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
