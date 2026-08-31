/* Terminal Value: progressive enhancement only. Every figure and every word
   is already in the HTML; this file animates, themes, and wires the two
   interactive charts. */

(() => {
  'use strict';

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* ------------------------------------------------------------- theme -- */

  const root = document.documentElement;
  const STORE = 'tv-theme';

  const setTheme = (t) => {
    root.dataset.theme = t;
    try { localStorage.setItem(STORE, t); } catch { /* private mode */ }
  };

  $$('.theme-toggle').forEach((btn) =>
    btn.addEventListener('click', () => {
      setTheme(root.dataset.theme === 'light' ? 'dark' : 'light');
    })
  );

  /* ------------------------------------------------------------ reveal -- */

  const revealables = $$('[data-reveal]');
  if (reduced || !('IntersectionObserver' in window)) {
    revealables.forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
    );
    revealables.forEach((el) => io.observe(el));
  }

  /* --------------------------------------------------------- nav state -- */

  const nav = $('.nav');
  const progress = $('.progress');
  const article = $('.prose');

  const onScroll = () => {
    if (nav) nav.classList.toggle('is-stuck', window.scrollY > 12);
    if (progress && article) {
      const start = article.offsetTop;
      const span = article.offsetHeight - window.innerHeight * 0.55;
      const pct = Math.min(1, Math.max(0, (window.scrollY - start + window.innerHeight * 0.3) / span));
      progress.style.width = `${pct * 100}%`;
    }
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --------------------------------------------- 1. the perpetuity dial -- */

  const perpInput = $('#perp-rate');
  if (perpInput) {
    const chart = $('#perp-chart');
    const dot = $('#perp-dot');
    const drop = $('#perp-drop');
    const outValue = $('#perp-value');
    const outRate = $('#perp-rate-out');
    const note = $('#perp-note');

    const x0 = +chart.dataset.x0, x1 = +chart.dataset.x1;
    const y0 = +chart.dataset.y0, y1 = +chart.dataset.y1;

    const money = new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD', maximumFractionDigits: 0,
    });

    const notes = [
      [0.6, 'No one has any idea what this is worth. Neither does the formula.'],
      [1.5, 'Every permanent thing on earth reprices, and nobody voted for it.'],
      [3, 'The last few basis points matter more than everything before them.'],
      [12, 'Ordinary. This is the world valuation was designed for.'],
    ];

    const paint = () => {
      const r = +perpInput.value / 100; // slider carries basis points x 10
      const value = 1000 / (r / 100);
      const px = x0 + (r / 10) * (x1 - x0);
      const py = y0 + (Math.min(value / 1000, 200) / 200) * (y1 - y0);

      dot.setAttribute('cx', px.toFixed(2));
      dot.setAttribute('cy', py.toFixed(2));
      drop.setAttribute('x1', px.toFixed(2));
      drop.setAttribute('x2', px.toFixed(2));
      drop.setAttribute('y1', py.toFixed(2));

      outRate.textContent = `${r.toFixed(2)}%`;
      outValue.textContent = value >= 1e6
        ? `${money.format(Math.round(value / 1e6))}m`.replace('$', '$')
        : money.format(Math.round(value / 1000) * 1000);
      note.textContent = (notes.find(([lim]) => r <= lim) || notes[notes.length - 1])[1];
    };

    perpInput.addEventListener('input', paint);
    paint();
  }

  /* ------------------------------------------ 2. the price of a launch -- */

  const riskInput = $('#risk-odds');
  const yearsInput = $('#risk-years');
  if (riskInput && yearsInput) {
    const outOdds = $('#risk-odds-out');
    const outYears = $('#risk-years-out');
    const outLost = $('#risk-lost');
    const outPrice = $('#risk-price');
    const outVerdict = $('#risk-verdict');
    const bar = $('#risk-bar');

    const money = new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD', maximumFractionDigits: 0,
    });
    const PER_YEAR = 300000; // a life-year, at the figure used in Chapter 6

    const paint = () => {
      // Sliders are logarithmic so the interesting range stays reachable.
      const odds = Math.round(Math.pow(10, +riskInput.value / 100)); // 1 in N
      const years = Math.round(Math.pow(10, +yearsInput.value / 100));
      const lost = years / odds;
      const price = lost * PER_YEAR;

      outOdds.textContent = `1 in ${odds.toLocaleString()}`;
      outYears.textContent = `${years.toLocaleString()} years`;
      outLost.textContent = lost < 0.01
        ? `${(lost * 365).toFixed(1)} days`
        : `${lost.toFixed(2)} years`;
      outPrice.textContent = price >= 1e6
        ? `$${(price / 1e6).toFixed(1)}m`
        : money.format(Math.round(price / 100) * 100);

      const pct = Math.min(100, (Math.log10(Math.max(price, 100)) / 7) * 100);
      bar.style.width = `${pct}%`;

      outVerdict.textContent =
        price < 5e3 ? 'A deal people take happily. This is Apollo.'
        : price < 1e5 ? 'Payable, but now it is a line in a budget.'
        : price < 1e6 ? 'The underwriter starts asking questions.'
        : 'Unwritable. The programme dies of insurance, not of physics.';
    };

    riskInput.addEventListener('input', paint);
    yearsInput.addEventListener('input', paint);
    paint();
  }

  /* ------------------------------------------------------ count-up nums -- */

  if (!reduced && 'IntersectionObserver' in window) {
    const counters = $$('[data-count]');
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target;
          io.unobserve(el);
          const target = +el.dataset.count;
          const dur = 1100;
          const start = performance.now();
          const tick = (now) => {
            const t = Math.min(1, (now - start) / dur);
            const eased = 1 - Math.pow(1 - t, 3);
            el.textContent = Math.round(target * eased).toLocaleString();
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => io.observe(el));
  }
})();
