/**
 * motion.js — scroll reveal, mouse spotlight, count-up.
 *
 * Replaces the AOS library the old site pulled from a CDN. Everything here is
 * transform/opacity only and driven by IntersectionObserver, so nothing in
 * this file forces a layout or runs a scroll handler.
 */

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* -------------------------------------------------------------------------
   Scroll reveal
   ------------------------------------------------------------------------- */

let revealObserver = null;

export function initReveal() {
  if (reduced()) {
    document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'));
    return;
  }

  revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target); // reveal once, then stop watching
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  );

  observeReveals();
}

/** Register any [data-reveal] elements added after the initial paint. */
export function observeReveals(root = document) {
  const nodes = root.querySelectorAll('[data-reveal]:not(.is-visible)');
  if (!revealObserver) {
    nodes.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  nodes.forEach((el) => revealObserver.observe(el));
}

/** Stagger children of a container: sets --reveal-delay on each. */
export function stagger(container, step = 55, max = 8) {
  [...container.children].forEach((child, i) => {
    child.style.setProperty('--reveal-delay', `${Math.min(i, max) * step}ms`);
  });
}

/* -------------------------------------------------------------------------
   Mouse spotlight — writes --mx/--my on the hovered card.
   Delegated at the document level (one listener, not one per card) and
   throttled to the frame with rAF.
   ------------------------------------------------------------------------- */

export function initSpotlight(selector = '.card, .panel--lit') {
  if (window.matchMedia('(hover: none)').matches || reduced()) return;

  let frame = 0;
  let pending = null;

  document.addEventListener(
    'pointermove',
    (e) => {
      const target = e.target instanceof Element ? e.target.closest(selector) : null;
      if (!target) return;
      pending = { target, x: e.clientX, y: e.clientY };
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (!pending) return;
        const { target: el, x, y } = pending;
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${x - r.left}px`);
        el.style.setProperty('--my', `${y - r.top}px`);
      });
    },
    { passive: true }
  );
}

/* -------------------------------------------------------------------------
   Count-up — animates a number once it scrolls into view.
   ------------------------------------------------------------------------- */

const easeOut = (t) => 1 - Math.pow(1 - t, 3);

function countTo(el, target, duration = 1400) {
  const fmt = new Intl.NumberFormat(document.documentElement.lang || 'en');
  const start = performance.now();

  const tick = (now) => {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = fmt.format(Math.round(target * easeOut(p)));
    if (p < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

/**
 * @param {string} selector elements carrying data-count="<number>"
 */
export function initCounters(selector = '[data-count]') {
  const nodes = [...document.querySelectorAll(selector)];
  if (!nodes.length) return;

  const fmt = new Intl.NumberFormat(document.documentElement.lang || 'en');

  if (reduced()) {
    nodes.forEach((el) => {
      el.textContent = fmt.format(Number(el.dataset.count));
    });
    return;
  }

  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        countTo(entry.target, Number(entry.target.dataset.count));
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  nodes.forEach((el) => {
    el.textContent = '0';
    io.observe(el);
  });
}
