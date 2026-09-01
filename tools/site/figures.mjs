// Every figure on the site is server rendered SVG. Nothing here depends on
// JavaScript to appear; the scripts only animate what is already drawn, and
// the two interactive figures degrade to their default reading.

/* ------------------------------------------------------------- helpers -- */

const fmt = (n, d = 2) => Number(n.toFixed(d)).toString();

/** Linear scale from a data domain to pixel range. */
const scale = ([d0, d1], [r0, r1]) => (v) => r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);

/** A polyline through points, optionally smoothed with a Catmull-Rom pass. */
function line(points, { smooth = true } = {}) {
  if (points.length < 2) return '';
  if (!smooth) return points.map(([x, y], i) => `${i ? 'L' : 'M'}${fmt(x)} ${fmt(y)}`).join(' ');

  let d = `M${fmt(points[0][0])} ${fmt(points[0][1])}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${fmt(c1[0])} ${fmt(c1[1])} ${fmt(c2[0])} ${fmt(c2[1])} ${fmt(p2[0])} ${fmt(p2[1])}`;
  }
  return d;
}

/** Rough path length, so the draw-on animation lands at the right speed. */
function pathLength(points) {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
  }
  return Math.ceil(total * 1.12);
}

const svg = (w, h, inner, extra = '') =>
  `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img" ${extra}>${inner}</svg>`;

function gridY(values, y, x0, x1, label = (v) => v) {
  return values
    .map(
      (v) =>
        `<line class="grid-line" x1="${x0}" y1="${fmt(y(v))}" x2="${x1}" y2="${fmt(y(v))}"/>` +
        `<text x="${x0 - 8}" y="${fmt(y(v) + 3)}" text-anchor="end">${label(v)}</text>`
    )
    .join('');
}

function ticksX(values, x, yPos, label = (v) => v) {
  return values
    .map((v) => `<text x="${fmt(x(v))}" y="${yPos}" text-anchor="middle">${label(v)}</text>`)
    .join('');
}

/* ------------------------------------------------------------ hero art -- */

/**
 * The book in one image: the present value of a future year, discounted at a
 * normal rate, and the same series at a rate near zero.
 */
export function heroArt({ bars = 76 } = {}) {
  let decaying = '';
  let flat = '';
  for (let i = 0; i < bars; i++) {
    const t = i / (bars - 1);
    const w = 100 / bars;
    const x = i * w;
    const hi = Math.exp(-4.4 * t);
    const lo = Math.exp(-0.1 * t);
    const delay = fmt(0.3 + t * 1.4, 3);
    flat += `<rect class="fade-in" style="--d:${delay}s" x="${fmt(x + w * 0.28)}" y="${fmt((1 - lo) * 100)}" width="${fmt(w * 0.16)}" height="${fmt(lo * 100)}" fill="url(#heroGhost)"/>`;
    decaying += `<rect class="fade-in" style="--d:${delay}s" x="${fmt(x)}" y="${fmt((1 - hi) * 100)}" width="${fmt(w * 0.44)}" height="${fmt(hi * 100)}" fill="url(#heroFade)"/>`;
  }

  return `<svg class="hero-art is-in" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
  <defs>
    <linearGradient id="heroFade" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="var(--amber)" stop-opacity=".10"/>
      <stop offset="1" stop-color="var(--amber)" stop-opacity=".95"/>
    </linearGradient>
    <linearGradient id="heroGhost" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="var(--paper)" stop-opacity=".015"/>
      <stop offset="1" stop-color="var(--paper)" stop-opacity=".14"/>
    </linearGradient>
  </defs>
  ${flat}${decaying}
</svg>`;
}

/* ------------------------------------------------- 1. the flat ceiling -- */

export function figCeiling() {
  const W = 640, H = 300, m = { t: 24, r: 96, b: 34, l: 34 };
  const x = scale([1840, 2025], [m.l, W - m.r]);
  const y = scale([30, 132], [H - m.b, m.t]);

  const birth = [[1841, 41], [1870, 41], [1900, 48], [1920, 56], [1940, 64],
    [1960, 71], [1980, 74], [2000, 78], [2020, 81]].map(([a, b]) => [x(a), y(b)]);
  const atFive = [[1841, 60], [1870, 61], [1900, 65], [1920, 69], [1940, 72],
    [1960, 75], [1980, 77], [2000, 80], [2020, 82]].map(([a, b]) => [x(a), y(b)]);

  const ceiling = y(122);

  return svg(W, H, `
  <title>Life expectancy has climbed. The ceiling has not moved.</title>
  ${gridY([40, 60, 80, 100, 120], y, m.l, W - m.r, (v) => v)}
  <line class="axis-line" x1="${m.l}" y1="${H - m.b}" x2="${W - m.r}" y2="${H - m.b}"/>
  ${ticksX([1850, 1900, 1950, 2000], x, H - m.b + 17)}

  <line x1="${m.l}" y1="${fmt(ceiling)}" x2="${W - m.r + 8}" y2="${fmt(ceiling)}"
        stroke="var(--clay)" stroke-width="1.5" stroke-dasharray="5 5"/>
  <text x="${W - m.r + 14}" y="${fmt(ceiling - 4)}" fill="var(--clay)">The ceiling</text>
  <text x="${W - m.r + 14}" y="${fmt(ceiling + 9)}" fill="var(--clay)">122 years</text>
  <text x="${W - m.r + 14}" y="${fmt(ceiling + 22)}">unmoved</text>
  <text x="${W - m.r + 14}" y="${fmt(ceiling + 34)}">since 1997</text>

  <path class="series series-2 draw" style="--len:${pathLength(atFive)}" d="${line(atFive)}"/>
  <path class="series draw" style="--len:${pathLength(birth)}" d="${line(birth)}"/>

  <g class="fade-in" style="--d:1.25s">
    <text x="${fmt(x(1848))}" y="${fmt(y(61) - 11)}" fill="var(--slate)">from age five</text>
    <text x="${fmt(x(1848))}" y="${fmt(y(41) + 18)}" fill="var(--amber)">at birth</text>
    <circle class="marker" cx="${fmt(x(2020))}" cy="${fmt(y(81))}" r="3.5"/>
    <circle class="marker" cx="${fmt(x(2020))}" cy="${fmt(y(82))}" r="3.5" fill="var(--slate)"/>
    <text x="${W - m.r + 14}" y="${fmt(y(81) + 4)}">81 and 82</text>
  </g>
`);
}

/* --------------------------------------------- 2. the perpetuity curve -- */

export function figPerpetuity() {
  const W = 640, H = 300, m = { t: 24, r: 22, b: 40, l: 56 };
  const x = scale([0, 10], [m.l, W - m.r]);
  const y = scale([0, 200], [H - m.b, m.t]);
  const value = (r) => 1 / (r / 100); // thousands, for a 1,000 a year coupon

  const pts = [];
  for (let r = 0.5; r <= 10.001; r += 0.05) pts.push([x(r), y(Math.min(value(r), 220))]);

  return svg(W, H, `
  <title>The value of a perpetuity as the discount rate falls toward zero.</title>
  ${gridY([0, 50, 100, 150, 200], y, m.l, W - m.r, (v) => (v ? `${v}k` : '0'))}
  <line class="axis-line" x1="${m.l}" y1="${H - m.b}" x2="${W - m.r}" y2="${H - m.b}"/>
  ${ticksX([1, 2, 4, 6, 8, 10], x, H - m.b + 18, (v) => `${v}%`)}
  <text x="${(m.l + W - m.r) / 2}" y="${H - 6}" text-anchor="middle">discount rate</text>

  <path class="series draw" style="--len:${pathLength(pts)}" d="${line(pts, { smooth: false })}"/>
  <g id="perp-marker" class="fade-in" style="--d:1.2s">
    <line id="perp-drop" x1="${fmt(x(5))}" y1="${fmt(y(20))}" x2="${fmt(x(5))}" y2="${H - m.b}"
          stroke="var(--amber)" stroke-width="1" stroke-dasharray="2 3" opacity=".55"/>
    <circle id="perp-dot" class="marker" cx="${fmt(x(5))}" cy="${fmt(y(20))}" r="4.5"/>
  </g>
`, 'id="perp-chart" ' +
   `data-x0="${m.l}" data-x1="${W - m.r}" data-y0="${H - m.b}" data-y1="${m.t}"`);
}

/* --------------------------------------------------- 3. r-star decline -- */

export function figRstar() {
  const W = 640, H = 280, m = { t: 22, r: 22, b: 36, l: 40 };
  const x = scale([1990, 2024], [m.l, W - m.r]);
  const y = scale([0, 3], [H - m.b, m.t]);

  const raw = [[1990, 2.6], [1994, 2.5], [1998, 2.4], [2002, 2.2], [2006, 2.3],
    [2008, 1.7], [2010, 0.7], [2013, 0.5], [2016, 0.5], [2019, 0.5], [2021, 0.4], [2024, 0.8]];
  const pts = raw.map(([a, b]) => [x(a), y(b)]);
  const area = `${line(pts)} L${fmt(x(2024))} ${H - m.b} L${fmt(x(1990))} ${H - m.b} Z`;

  return svg(W, H, `
  <title>Estimates of the natural real rate of interest, 1990 to 2024.</title>
  <defs><linearGradient id="rstarFill" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="var(--amber)" stop-opacity=".22"/>
    <stop offset="1" stop-color="var(--amber)" stop-opacity="0"/>
  </linearGradient></defs>
  ${gridY([0, 1, 2, 3], y, m.l, W - m.r, (v) => `${v}%`)}
  <path class="fade-in" style="--d:.9s" d="${area}" fill="url(#rstarFill)"/>
  <path class="series draw" style="--len:${pathLength(pts)}" d="${line(pts)}"/>
  <line class="axis-line" x1="${m.l}" y1="${H - m.b}" x2="${W - m.r}" y2="${H - m.b}"/>
  ${ticksX([1990, 2000, 2010, 2020], x, H - m.b + 17)}
  <g class="fade-in" style="--d:1.4s">
    <line x1="${fmt(x(2010))}" y1="${fmt(y(0.7))}" x2="${fmt(x(2010))}" y2="${m.t + 6}"
          stroke="var(--hair-strong)" stroke-width="1"/>
    <text x="${fmt(x(2010) + 7)}" y="${m.t + 12}">forty years of drift</text>
  </g>
`);
}

/* ---------------------------------------------------- 4. compounding ---- */

export function figCompounding() {
  const W = 640, H = 300, m = { t: 26, r: 92, b: 36, l: 46 };
  const x = scale([0, 200], [m.l, W - m.r]);
  const y = scale([0, Math.log10(20000)], [H - m.b, m.t]);
  const f = (t) => Math.pow(1.05, t);

  const pts = [];
  for (let t = 0; t <= 200; t += 4) pts.push([x(t), y(Math.log10(Math.max(f(t), 1)))]);

  const mark = (t, label, dy = -10) => `
    <line x1="${fmt(x(t))}" y1="${fmt(y(Math.log10(f(t))))}" x2="${fmt(x(t))}" y2="${H - m.b}"
          stroke="var(--hair-strong)" stroke-width="1" stroke-dasharray="2 3"/>
    <circle class="marker" cx="${fmt(x(t))}" cy="${fmt(y(Math.log10(f(t))))}" r="3.5"/>
    <text x="${fmt(x(t) + 8)}" y="${fmt(y(Math.log10(f(t))) + dy)}" fill="var(--paper)">${label}</text>`;

  return svg(W, H, `
  <title>One dollar at five percent real, over two hundred years. Log scale.</title>
  ${gridY([0, 1, 2, 3, 4], y, m.l, W - m.r, (v) => (v === 0 ? '1x' : `${Math.pow(10, v).toLocaleString()}x`))}
  <line class="axis-line" x1="${m.l}" y1="${H - m.b}" x2="${W - m.r}" y2="${H - m.b}"/>
  ${ticksX([0, 50, 100, 150, 200], x, H - m.b + 17, (v) => `${v}y`)}
  <path class="series draw" style="--len:${pathLength(pts)}" d="${line(pts, { smooth: false })}"/>
  <g class="fade-in" style="--d:1.2s">${mark(30, '4.3x  a career', 18)}</g>
  <g class="fade-in" style="--d:1.5s">${mark(200, '17,000x', 4)}</g>
`);
}

/* ------------------------------------------------ 5. funeral principle -- */

export function figFuneral() {
  const cols = 34, total = 452;
  const rows = Math.ceil(total / cols);
  const W = 640, H = 240;
  const gapX = 17.3, gapY = 15, x0 = 24, y0 = 22;
  const star = 6 * cols + 16;

  let dots = '';
  for (let i = 0; i < total; i++) {
    const c = i % cols, r = Math.floor(i / cols);
    const cx = x0 + c * gapX;
    const cy = y0 + r * gapY;
    const isStar = i === star;
    dots += `<circle class="fade-in" style="--d:${fmt(0.2 + (i / total) * 0.8, 3)}s" cx="${fmt(cx)}" cy="${fmt(cy)}" r="${isStar ? 5 : 2.4}" fill="${isStar ? 'var(--amber)' : 'var(--paper)'}" opacity="${isStar ? 1 : 0.24}"/>`;
    if (isStar) {
      dots += `<circle class="fade-in" style="--d:1.1s" cx="${fmt(cx)}" cy="${fmt(cy)}" r="11" fill="none" stroke="var(--amber)" stroke-width="1" opacity=".6"/>`;
    }
  }

  return svg(W, H, `
  <title>Four hundred and fifty two elite life scientists who died while still active.</title>
  ${dots}
  <text class="fade-in" style="--d:1.3s" x="${x0}" y="${y0 + rows * gapY + 22}">452 sudden exits &#183; one field each</text>
`);
}

/** The measured consequence: what each group's publishing does afterward. */
export function figOutsiders() {
  const W = 640, H = 200;
  const xa = 210, xb = 430;

  const slope = (y1, y2, label, value, color, delay) => `
    <g class="fade-in" style="--d:${delay}s">
      <line x1="${xa}" y1="${y1}" x2="${xb}" y2="${y2}" stroke="${color}" stroke-width="2"/>
      <circle cx="${xa}" cy="${y1}" r="4" fill="${color}"/>
      <circle cx="${xb}" cy="${y2}" r="4" fill="${color}"/>
      <text x="${xa - 14}" y="${y1 + 4}" text-anchor="end" fill="var(--paper)">${label}</text>
      <text x="${xb + 14}" y="${y2 + 4}" fill="${color}">${value}</text>
    </g>`;

  return svg(W, H, `
  <title>Publication flow before and after a star scientist dies.</title>
  <line x1="${xa}" y1="34" x2="${xa}" y2="150" stroke="var(--hair)" stroke-width="1"/>
  <line x1="${xb}" y1="34" x2="${xb}" y2="150" stroke="var(--hair)" stroke-width="1"/>
  <text x="${xa}" y="170" text-anchor="middle">while they held the field</text>
  <text x="${xb}" y="170" text-anchor="middle">after the death</text>

  ${slope(58, 118, 'Their collaborators', 'publish less', 'var(--clay)', 0.35)}
  ${slope(126, 66, 'Everyone else', '+8.6%', 'var(--amber)', 0.6)}

  <text class="fade-in" style="--d:1.1s" x="20" y="${H - 8}">and the new work is disproportionately highly cited</text>
`);
}

/* --------------------------------------------------------- 6. ruin ----- */

export function figRuin() {
  const W = 640, H = 290, m = { t: 24, r: 96, b: 36, l: 42 };
  const x = scale([0, 4000], [m.l, W - m.r]);
  const y = scale([0, 1], [H - m.b, m.t]);
  const p = 1 / 2000;

  const pts = [];
  for (let t = 0; t <= 4000; t += 40) pts.push([x(t), y(Math.pow(1 - p, t))]);
  const half = Math.log(0.5) / Math.log(1 - p);

  return svg(W, H, `
  <title>Survival with aging cured and only background accident risk remaining.</title>
  ${gridY([0, 0.25, 0.5, 0.75, 1], y, m.l, W - m.r, (v) => `${v * 100}%`)}
  <line class="axis-line" x1="${m.l}" y1="${H - m.b}" x2="${W - m.r}" y2="${H - m.b}"/>
  ${ticksX([0, 1000, 2000, 3000, 4000], x, H - m.b + 17, (v) => (v ? `${v / 1000}k` : '0'))}
  <text x="${(m.l + W - m.r) / 2}" y="${H - 5}" text-anchor="middle">years</text>

  <path class="series draw" style="--len:${pathLength(pts)}" d="${line(pts, { smooth: false })}"/>
  <g class="fade-in" style="--d:1.2s">
    <line x1="${m.l}" y1="${fmt(y(0.5))}" x2="${fmt(x(half))}" y2="${fmt(y(0.5))}"
          stroke="var(--clay)" stroke-width="1" stroke-dasharray="3 4"/>
    <line x1="${fmt(x(half))}" y1="${fmt(y(0.5))}" x2="${fmt(x(half))}" y2="${H - m.b}"
          stroke="var(--clay)" stroke-width="1" stroke-dasharray="3 4"/>
    <circle cx="${fmt(x(half))}" cy="${fmt(y(0.5))}" r="4" fill="var(--clay)"/>
    <text x="${W - m.r + 10}" y="${fmt(y(0.62))}" fill="var(--clay)">half gone by</text>
    <text x="${W - m.r + 10}" y="${fmt(y(0.62) + 13)}" fill="var(--clay)">year ${Math.round(half).toLocaleString()}</text>
    <text x="${W - m.r + 10}" y="${fmt(y(0.2))}">one in 2,000</text>
    <text x="${W - m.r + 10}" y="${fmt(y(0.2) + 13)}">per year, forever</text>
  </g>
`);
}

/* ------------------------------------------------------ 7. vacancy ----- */

export function figVacancy() {
  const W = 640, H = 266;
  const seats = ['Chair', 'Director', 'Senior', 'Associate', 'Junior', 'Entering'];
  const boxW = 132, boxH = 26, gapY = 36, x0 = 60;

  let out = '';
  seats.forEach((s, i) => {
    const yPos = 22 + i * gapY;
    const isTop = i === 0;
    out += `
    <g class="fade-in" style="--d:${fmt(0.15 + i * 0.13, 3)}s">
      <rect x="${x0}" y="${yPos}" width="${boxW}" height="${boxH}" rx="2"
            fill="${isTop ? 'none' : 'var(--amber)'}" fill-opacity="${isTop ? 0 : 0.1}"
            stroke="${isTop ? 'var(--clay)' : 'var(--hair-strong)'}"
            stroke-width="1" ${isTop ? 'stroke-dasharray="4 4"' : ''}/>
      <text x="${x0 + 12}" y="${yPos + 17}" fill="${isTop ? 'var(--clay)' : 'var(--paper)'}"
            text-anchor="start">${s}</text>
    </g>`;
    if (i < seats.length - 1) {
      const ay = yPos + boxH + 4;
      out += `<g class="fade-in" style="--d:${fmt(0.3 + i * 0.13, 3)}s">
        <path d="M${x0 + boxW + 26} ${ay + gapY - boxH - 8} L${x0 + boxW + 26} ${ay - 2}"
              stroke="var(--amber)" stroke-width="1.4"/>
        <path d="M${x0 + boxW + 26} ${ay - 2} l-4 6 l8 0 z" fill="var(--amber)"/>
      </g>`;
    }
  });

  return svg(W, H, `
  <title>A vacancy chain: one exit at the top moves everyone below it.</title>
  ${out}
  <text class="fade-in" style="--d:.2s" x="${x0 + boxW + 46}" y="38" fill="var(--clay)">one exit</text>
  <text class="fade-in" style="--d:1.2s" x="${x0 + boxW + 46}" y="${22 + 5 * 36 + 17}">six moves</text>
  <text class="fade-in" style="--d:1.4s" x="${x0}" y="${H - 12}">no exit, no chain, and nothing below it moves at all</text>
`);
}

export function figNih() {
  const W = 640, H = 220, m = { t: 30, r: 30, b: 42, l: 46 };
  const y = scale([0, 20], [H - m.b, m.t]);
  const bars = [
    { label: '1983', v: 18, x: 150 },
    { label: '2010', v: 3, x: 360 },
  ];

  const rects = bars
    .map(
      (b, i) => `
    <g>
      <rect class="grow" style="--d:${0.2 + i * 0.25}s" x="${b.x}" y="${fmt(y(b.v))}" width="86"
            height="${fmt(H - m.b - y(b.v))}" fill="${i ? 'var(--clay)' : 'var(--amber)'}" opacity=".85"/>
      <text class="val fade-in" style="--d:${0.7 + i * 0.25}s" x="${b.x + 43}" y="${fmt(y(b.v) - 10)}"
            text-anchor="middle">${b.v}%</text>
      <text x="${b.x + 43}" y="${H - m.b + 18}" text-anchor="middle">${b.label}</text>
    </g>`
    )
    .join('');

  return svg(W, H, `
  <title>Share of NIH principal investigators aged 36 or under.</title>
  ${gridY([0, 5, 10, 15, 20], y, m.l, W - m.r, (v) => `${v}%`)}
  <line class="axis-line" x1="${m.l}" y1="${H - m.b}" x2="${W - m.r}" y2="${H - m.b}"/>
  ${rects}
  <text x="${m.l}" y="${H - 8}">principal investigators aged 36 or under</text>
`);
}

/* ---------------------------------------------------- 8. forkable ------ */

export function figFork() {
  const W = 640, H = 230;
  const node = (cx, cy, r, fill, opacity = 1, cls = '', delay = 0) =>
    `<circle class="${cls}" style="--d:${delay}s" cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" opacity="${opacity}"/>`;

  const branchY = [50, 92, 134, 176];
  let branches = '';
  branchY.forEach((yPos, i) => {
    const kept = i === 1;
    const d = fmt(0.4 + i * 0.12, 3);
    branches += `
    <path class="fade-in" style="--d:${d}s" d="M150 113 C210 113 210 ${yPos} 268 ${yPos}"
          fill="none" stroke="${kept ? 'var(--amber)' : 'var(--hair-strong)'}" stroke-width="1.4"/>
    ${node(276, yPos, 7, kept ? 'var(--amber)' : 'var(--paper)', kept ? 1 : 0.32, 'fade-in', 0.6 + i * 0.12)}`;

    if (kept) {
      branches += `<path class="fade-in" style="--d:1.15s" d="M284 ${yPos} L470 ${yPos}"
        fill="none" stroke="var(--amber)" stroke-width="1.4"/>
        ${node(478, yPos, 8, 'var(--amber)', 1, 'fade-in', 1.3)}
        <text class="fade-in" style="--d:1.45s" x="496" y="${yPos + 4}" fill="var(--amber)">kept</text>`;
    } else {
      branches += `
      <g class="fade-in" style="--d:${1 + i * 0.1}s">
        <line x1="269" y1="${yPos - 9}" x2="285" y2="${yPos + 9}" stroke="var(--clay)" stroke-width="1.4"/>
        <line x1="285" y1="${yPos - 9}" x2="269" y2="${yPos + 9}" stroke="var(--clay)" stroke-width="1.4"/>
        <text x="300" y="${yPos + 4}" fill="var(--clay)">ended</text>
      </g>`;
    }
  });

  return svg(W, H, `
  <title>An agent forked four ways: one kept, three ended, at no ceremony.</title>
  ${node(142, 113, 9, 'var(--paper)', 0.9, 'fade-in', 0.1)}
  <text class="fade-in" style="--d:.15s" x="60" y="117" text-anchor="start">one agent</text>
  ${branches}
  <text class="fade-in" style="--d:1.6s" x="60" y="${H - 12}">lifespan is a setting in a configuration file</text>
`);
}

export function figTwoClasses() {
  const W = 640, H = 250;
  const col = (x0, title, color, rows, delay) => `
    <g class="fade-in" style="--d:${delay}s">
      <rect x="${x0}" y="26" width="270" height="192" rx="3" fill="${color}" fill-opacity=".07"
            stroke="${color}" stroke-opacity=".45" stroke-width="1"/>
      <text x="${x0 + 18}" y="52" fill="${color}">${title}</text>
      <line x1="${x0 + 18}" y1="64" x2="${x0 + 252}" y2="64" stroke="${color}" stroke-opacity=".3"/>
      ${rows
        .map(
          (r, i) =>
            `<text x="${x0 + 18}" y="${90 + i * 26}" fill="var(--paper)" opacity=".82"
                   style="text-transform:none;font-size:11px">${r}</text>`
        )
        .join('')}
    </g>`;

  return svg(W, H, `
  <title>Two populations, and how the properties of mortality get divided between them.</title>
  ${col(20, 'The permanent class', 'var(--amber)',
    ['Holds the capital', 'Holds the senior positions', 'Discounts at nearly zero',
     'Cannot afford any risk', 'Does not turn over'], 0.2)}
  ${col(350, 'The mortal class', 'var(--slate)',
    ['Does the work', 'Takes the risk', 'Horizon set by its operator',
     'Copied when useful, ended when not', 'Turns over by design'], 0.45)}
`);
}

/* -------------------------------------------------------- 9. Venice ---- */

export function figSerrata() {
  const W = 640, H = 200, m = { l: 46, r: 46 };
  const x = scale([1020, 1830], [m.l, W - m.r]);
  const axis = 92;

  const event = (year, label, sub, up, color, delay) => {
    const px = x(year);
    const dir = up ? -1 : 1;
    return `<g class="fade-in" style="--d:${delay}s">
      <line x1="${fmt(px)}" y1="${axis}" x2="${fmt(px)}" y2="${fmt(axis + dir * 30)}"
            stroke="${color}" stroke-width="1"/>
      <circle cx="${fmt(px)}" cy="${axis}" r="4" fill="${color}"/>
      <text x="${fmt(px)}" y="${fmt(axis + dir * 42)}" text-anchor="middle" fill="${color}">${year}</text>
      <text x="${fmt(px)}" y="${fmt(axis + dir * 56)}" text-anchor="middle" fill="var(--paper)" opacity=".85">${label}</text>
      <text x="${fmt(px)}" y="${fmt(axis + dir * 70)}" text-anchor="middle">${sub}</text>
    </g>`;
  };

  // The colleganza has no single date in the record, so it is drawn as the era
  // it was, not as a year the book never claims.
  const eraA = x(1050), eraB = x(1290);
  const era = `<g class="fade-in" style="--d:.2s">
    <path d="M${fmt(eraA)} ${axis - 16} L${fmt(eraA)} ${axis - 26} L${fmt(eraB)} ${axis - 26} L${fmt(eraB)} ${axis - 16}"
          fill="none" stroke="var(--amber)" stroke-width="1" opacity=".7"/>
    <text x="${fmt((eraA + eraB) / 2)}" y="${axis - 36}" text-anchor="middle" fill="var(--amber)">the colleganza</text>
    <text x="${fmt((eraA + eraB) / 2)}" y="${axis - 50}" text-anchor="middle">courage into equity, any notary could write one</text>
  </g>`;

  return svg(W, H, `
  <title>Venice: mobility, then the closing, then five hundred years of nothing.</title>
  <line class="axis-line" x1="${m.l}" y1="${axis}" x2="${W - m.r}" y2="${axis}"/>
  <rect class="grow" style="--d:.55s;transform-origin:center" x="${fmt(x(1297))}" y="${axis - 3}"
        width="${fmt(x(1797) - x(1297))}" height="6" fill="var(--clay)" opacity=".32"/>
  ${era}
  ${event(1297, 'La Serrata', 'the council closes', false, 'var(--clay)', 0.55)}
  ${event(1797, 'Napoleon', 'no resistance left', false, 'var(--paper-faint)', 0.95)}
  <text class="fade-in" style="--d:1.25s" x="${fmt((x(1297) + x(1797)) / 2)}" y="${axis + 94}"
        text-anchor="middle" fill="var(--clay)">five centuries, rich and beautiful, nothing further happens</text>
`);
}

/* ------------------------------------------------ 10. terminal value --- */

export function figTerminalValue() {
  const W = 640, H = 210;
  const x0 = 60, barW = 500, barY = 74, barH = 54;
  const forecast = 0.25;

  return svg(W, H, `
  <title>Where the value of an enterprise actually sits.</title>
  <g class="fade-in" style="--d:.2s">
    <rect x="${x0}" y="${barY}" width="${fmt(barW * forecast)}" height="${barH}"
          fill="var(--paper)" opacity=".22"/>
    <text x="${fmt(x0 + (barW * forecast) / 2)}" y="${barY - 12}" text-anchor="middle">25%</text>
    <text x="${fmt(x0 + (barW * forecast) / 2)}" y="${barY + barH + 20}" text-anchor="middle">five years you</text>
    <text x="${fmt(x0 + (barW * forecast) / 2)}" y="${barY + barH + 33}" text-anchor="middle">argue about</text>
  </g>
  <g class="fade-in" style="--d:.5s">
    <rect x="${fmt(x0 + barW * forecast)}" y="${barY}" width="${fmt(barW * (1 - forecast))}"
          height="${barH}" fill="var(--amber)" opacity=".85"/>
    <text x="${fmt(x0 + barW * forecast + (barW * (1 - forecast)) / 2)}" y="${barY - 12}"
          text-anchor="middle" fill="var(--amber)">75% or more</text>
    <text x="${fmt(x0 + barW * forecast + (barW * (1 - forecast)) / 2)}" y="${barY + barH + 20}"
          text-anchor="middle" fill="var(--amber)">everything after, bundled into one number</text>
    <text x="${fmt(x0 + barW * forecast + (barW * (1 - forecast)) / 2)}" y="${barY + barH + 33}"
          text-anchor="middle" fill="var(--amber)">by a formula about forever</text>
  </g>
  <text class="fade-in" style="--d:.9s" x="${x0}" y="${H - 14}">terminal value</text>
`);
}

/* ------------------------------------------------- card glyphs (five) -- */

const glyph = (inner) =>
  `<svg viewBox="0 0 120 52" aria-hidden="true" preserveAspectRatio="xMinYMid meet">${inner}</svg>`;

export const jobGlyphs = {
  // A decaying curve flattening out.
  rate: glyph(`<path d="M4 6 C24 6 30 44 116 46" fill="none" stroke="var(--amber)" stroke-width="1.5"/>
    <path d="M4 20 C40 20 56 40 116 42" fill="none" stroke="var(--paper)" stroke-opacity=".25" stroke-width="1.2" stroke-dasharray="3 3"/>`),
  // A block splitting into smaller blocks.
  capital: glyph(`<rect x="4" y="10" width="30" height="32" fill="var(--amber)" fill-opacity=".8"/>
    <path d="M40 26 L58 26" stroke="var(--paper)" stroke-opacity=".4" stroke-width="1"/>
    <rect x="64" y="10" width="14" height="14" fill="var(--amber)" fill-opacity=".55"/>
    <rect x="82" y="10" width="14" height="14" fill="var(--amber)" fill-opacity=".55"/>
    <rect x="64" y="28" width="14" height="14" fill="var(--amber)" fill-opacity=".55"/>
    <rect x="82" y="28" width="14" height="14" fill="var(--amber)" fill-opacity=".55"/>`),
  // A ring of authority opening.
  ideas: glyph(`<circle cx="26" cy="26" r="16" fill="none" stroke="var(--amber)" stroke-width="1.5"/>
    <circle cx="26" cy="26" r="4" fill="var(--amber)"/>
    <circle cx="86" cy="26" r="16" fill="none" stroke="var(--paper)" stroke-opacity=".3" stroke-width="1.5" stroke-dasharray="4 4"/>
    <circle cx="72" cy="16" r="3" fill="var(--slate)"/><circle cx="98" cy="20" r="3" fill="var(--slate)"/>
    <circle cx="90" cy="38" r="3" fill="var(--slate)"/>`),
  // A survival curve running to zero.
  risk: glyph(`<path d="M4 8 C36 8 44 46 116 47" fill="none" stroke="var(--amber)" stroke-width="1.5"/>
    <line x1="4" y1="47" x2="116" y2="47" stroke="var(--paper)" stroke-opacity=".2"/>
    <circle cx="60" cy="30" r="3" fill="var(--clay)"/>`),
  // A chain of seats, the top one empty.
  vacancy: glyph(`<rect x="4" y="6" width="34" height="12" fill="none" stroke="var(--clay)" stroke-dasharray="3 3"/>
    <rect x="4" y="22" width="34" height="12" fill="var(--amber)" fill-opacity=".7"/>
    <rect x="4" y="38" width="34" height="12" fill="var(--amber)" fill-opacity=".4"/>
    <path d="M52 44 L52 14" stroke="var(--amber)" stroke-width="1.4"/>
    <path d="M52 12 l-4 6 l8 0 z" fill="var(--amber)"/>
    <text x="66" y="30" fill="var(--paper)" opacity=".35" font-family="monospace" font-size="9">up</text>`),
};

/* ------------------------------------------- the beam under the floor -- */

export function figBeams() {
  const W = 640, H = 250;
  const labels = ['the price\nof time', 'capital\nturnover', 'idea\nturnover', 'the price\nof risk', 'vacancy'];
  const colW = 96, gap = 24, x0 = 42, top = 66, bottom = 176;

  const cols = labels
    .map((label, i) => {
      const cx = x0 + i * (colW + gap) + colW / 2;
      const lines = label.split('\n');
      return `<g class="fade-in" style="--d:${fmt(0.35 + i * 0.12, 3)}s">
      <rect class="beam" x="${fmt(cx - 13)}" y="${top}" width="26" height="${bottom - top}"/>
      ${lines
        .map((l, j) => `<text x="${fmt(cx)}" y="${bottom + 22 + j * 13}" text-anchor="middle">${l}</text>`)
        .join('')}
    </g>`;
    })
    .join('');

  return svg(W, H, `
  <title>Five columns under one slab, and no redundancy in any of them.</title>
  <g class="fade-in" style="--d:.15s">
    <rect class="slab" x="26" y="40" width="${W - 52}" height="18"/>
    <text x="32" y="30">everything built on top</text>
  </g>
  ${cols}
  <g class="fade-in" style="--d:1.1s">
    <line x1="26" y1="${bottom}" x2="${W - 26}" y2="${bottom}" stroke="var(--hair-strong)"/>
    <text x="32" y="${H - 8}" fill="var(--clay)">mortality, doing all five at once, by accident</text>
  </g>
`);
}

/* ------------------------------------------- 11. the dating question ---- */

/**
 * Two curves and the gap between them. The book declines to give a date, and
 * the honest reason is visible here: the biology and the proof of the biology
 * are separated by however long the claimed lifespan is.
 */
export function figWhen() {
  const W = 640, H = 320, m = { t: 24, r: 118, b: 42, l: 42 };
  const x = scale([2025, 2300], [m.l, W - m.r]);
  const y = scale([0, 1], [H - m.b, m.t]);

  // P(aging brought under medical control by year t). Asymptote below one:
  // "never" stays on the table.
  const control = [[2025, 0], [2040, 0.02], [2060, 0.08], [2080, 0.16], [2100, 0.25],
    [2130, 0.36], [2160, 0.47], [2200, 0.57], [2250, 0.64], [2300, 0.68]];
  // P(a 150 year healthy lifespan actually demonstrated by year t).
  const shown = [[2025, 0], [2100, 0.004], [2150, 0.02], [2175, 0.06], [2200, 0.14],
    [2230, 0.22], [2260, 0.32], [2300, 0.42]];

  const pc = control.map(([a, b]) => [x(a), y(b)]);
  const ps = shown.map(([a, b]) => [x(a), y(b)]);

  const gap = `${line(pc)} L${fmt(x(2300))} ${fmt(y(0.42))} ${line([...ps].reverse()).replace('M', 'L')} Z`;

  return svg(W, H, `
  <title>Estimated probability that aging is brought under control, and that a long healthy life is actually demonstrated.</title>
  <defs><linearGradient id="whenGap" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="var(--amber)" stop-opacity=".16"/>
    <stop offset="1" stop-color="var(--amber)" stop-opacity=".03"/>
  </linearGradient></defs>

  ${gridY([0, 0.25, 0.5, 0.75, 1], y, m.l, W - m.r, (v) => `${Math.round(v * 100)}%`)}
  <line class="axis-line" x1="${m.l}" y1="${H - m.b}" x2="${W - m.r}" y2="${H - m.b}"/>
  ${ticksX([2050, 2100, 2150, 2200, 2250, 2300], x, H - m.b + 17)}

  <path class="fade-in" style="--d:1.1s" d="${gap}" fill="url(#whenGap)"/>
  <path class="series draw" style="--len:${pathLength(pc)}" d="${line(pc)}"/>
  <path class="series series-2 draw" style="--len:${pathLength(ps)}" d="${line(ps)}"/>

  <g class="fade-in" style="--d:1.4s">
    <text x="${W - m.r + 10}" y="${fmt(y(0.62))}" fill="var(--amber)">aging brought</text>
    <text x="${W - m.r + 10}" y="${fmt(y(0.62) + 12)}" fill="var(--amber)">under control</text>
    <text x="${W - m.r + 10}" y="${fmt(y(0.34))}" fill="var(--slate)">150 healthy years</text>
    <text x="${W - m.r + 10}" y="${fmt(y(0.34) + 12)}" fill="var(--slate)">demonstrated</text>
    <text x="${fmt(x(2150))}" y="${fmt(y(0.72))}">the gap is the proof</text>
    <text x="${fmt(x(2150))}" y="${fmt(y(0.72) + 12)}">and it cannot be closed</text>
  </g>
`);
}

/** The milestones, with the honest width of each guess. */
export function figMilestones() {
  const W = 640, H = 262;
  const LABEL = 316;                       // room for the longest row label
  const x = scale([2025, 2300], [LABEL, W - 24]);

  const rows = [
    ['A drug slows aging in a human trial', 2038, 2065, 2048],
    ['Aging recognised as a treatable indication', 2055, 2100, 2072],
    ['Calment&#8217;s 122 years is beaten', 2060, 2140, 2090],
    ['150 healthy years, demonstrated', 2175, 2300, 2215],
    ['Aging removed as a cause of death', 2200, 2300, 2260],
  ];

  return svg(W, H, `
  <title>Milestone estimates, with the range each guess spans.</title>
  ${ticksX([2050, 2100, 2150, 2200, 2250], x, 22)}
  <line class="grid-line" x1="${LABEL}" y1="30" x2="${W - 24}" y2="30"/>
  ${rows.map(([label, lo, hi, mid], i) => {
    const yy = 62 + i * 36;
    return `<g class="fade-in" style="--d:${fmt(0.2 + i * 0.14, 3)}s">
      <text x="6" y="${yy + 4}" fill="var(--paper)" style="text-transform:none;font-size:11px">${label}</text>
      <line x1="${fmt(x(lo))}" y1="${yy}" x2="${fmt(x(hi))}" y2="${yy}" stroke="var(--amber)" stroke-width="5" stroke-opacity=".24" stroke-linecap="round"/>
      <circle cx="${fmt(x(mid))}" cy="${yy}" r="4.5" fill="var(--amber)"/>
      <text x="${fmt(x(mid))}" y="${yy - 12}" text-anchor="middle" fill="var(--amber)">${mid}</text>
    </g>`;
  }).join('')}
  <text class="fade-in" style="--d:1s" x="6" y="${H - 10}">bars are where the guess sits, not a confidence interval anyone computed</text>
`);
}
