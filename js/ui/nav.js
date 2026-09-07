/**
 * nav.js — sticky header, mobile drawer, scroll-spy, back-to-top.
 *
 * Scroll-spy uses IntersectionObserver against the section elements rather
 * than a scroll listener, so there is no per-frame work while scrolling.
 */

export function initNav() {
  const header = document.querySelector('.header');
  const burger = document.querySelector('.nav__burger');
  const drawer = document.querySelector('.nav__links');
  const links = [...document.querySelectorAll('.nav__link[href^="#"]')];
  const toTop = document.querySelector('.to-top');

  /* --- header background + back-to-top visibility --------------------- */

  const sentinel = document.createElement('div');
  sentinel.setAttribute('aria-hidden', 'true');
  sentinel.style.cssText = 'position:absolute;top:0;height:1px;width:1px;';
  document.body.prepend(sentinel);

  new IntersectionObserver(
    ([entry]) => header?.classList.toggle('is-stuck', !entry.isIntersecting),
    { rootMargin: '-8px 0px 0px 0px' }
  ).observe(sentinel);

  if (toTop) {
    const farDown = document.createElement('div');
    farDown.setAttribute('aria-hidden', 'true');
    farDown.style.cssText = 'position:absolute;top:90vh;height:1px;width:1px;';
    document.body.prepend(farDown);
    new IntersectionObserver(([e]) => toTop.classList.toggle('is-shown', !e.isIntersecting)).observe(farDown);

    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.querySelector('.brand')?.focus?.();
    });
  }

  /* --- mobile drawer --------------------------------------------------- */

  const setDrawer = (open) => {
    burger?.setAttribute('aria-expanded', String(open));
    drawer?.classList.toggle('is-open', open);
    document.body.classList.toggle('is-locked', open);
  };

  burger?.addEventListener('click', () => {
    setDrawer(burger.getAttribute('aria-expanded') !== 'true');
  });

  drawer?.addEventListener('click', (e) => {
    if (e.target.closest('a')) setDrawer(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && burger?.getAttribute('aria-expanded') === 'true') {
      setDrawer(false);
      burger.focus();
    }
  });

  // Reset the drawer when the viewport grows past the breakpoint, otherwise
  // body scroll can stay locked after a rotation.
  const wide = window.matchMedia('(min-width: 1081px)');
  wide.addEventListener('change', (e) => e.matches && setDrawer(false));

  /* --- scroll-spy ------------------------------------------------------ */

  const sections = links
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if (!sections.length) return;

  const active = new Set();

  const paint = () => {
    // Document order wins, so a short section overlapping the band never
    // steals the highlight from the long one the reader is actually in.
    const current = sections.find((s) => active.has(s.id));
    links.forEach((a) =>
      a.classList.toggle('is-active', !!current && a.getAttribute('href') === `#${current.id}`)
    );
  };

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) active.add(entry.target.id);
        else active.delete(entry.target.id);
      });
      paint();
    },
    {
      // A 10%-tall band across the middle of the viewport: a section is
      // "current" when it sits in the reader's focal area, not merely when
      // any part of it appears on screen.
      rootMargin: '-45% 0px -45% 0px',
      threshold: 0,
    }
  );

  sections.forEach((s) => spy.observe(s));
}
