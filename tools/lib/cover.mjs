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
