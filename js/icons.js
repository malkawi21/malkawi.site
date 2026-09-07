/**
 * icons.js — inline SVG icon set.
 *
 * Replaces the 120 KB Bootstrap Icons webfont the old site loaded from a CDN.
 * Every glyph here is a 24x24 stroked path; they inherit `currentColor` and
 * are sized by CSS, so no icon ever causes a layout shift or a network round
 * trip. Add new icons as raw path data only — no <svg> wrapper.
 */

const PATHS = {
  cpu: '<rect x="8" y="8" width="8" height="8" rx="1"/><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"/>',
  radio: '<circle cx="12" cy="12" r="2"/><path d="M4.93 19.07a10 10 0 0 1 0-14.14M7.76 16.24a6 6 0 0 1 0-8.48M16.24 7.76a6 6 0 0 1 0 8.48M19.07 4.93a10 10 0 0 1 0 14.14"/>',
  gateway: '<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="6" rx="2"/><path d="M7 7.5h.01M7 17h.01"/><path d="M17 7.5h2M17 17h2"/>',
  server: '<rect x="3" y="4" width="18" height="6" rx="2"/><rect x="3" y="14" width="18" height="6" rx="2"/><path d="M7 7h.01M7 17h.01"/>',
  database: '<ellipse cx="12" cy="5.5" rx="8" ry="3.2"/><path d="M4 5.5v6c0 1.8 3.6 3.2 8 3.2s8-1.4 8-3.2v-6"/><path d="M4 11.5v6c0 1.8 3.6 3.2 8 3.2s8-1.4 8-3.2v-6"/>',
  cloud: '<path d="M17.5 19a4.5 4.5 0 0 0 .5-8.97 6 6 0 0 0-11.68 1.4A3.8 3.8 0 0 0 7 19z"/>',
  gauge: '<path d="M12 15l3.5-4"/><circle cx="12" cy="15" r="1.2"/><path d="M3.5 18a9.5 9.5 0 1 1 17 0"/><path d="M3.5 18h17"/>',
  monitor: '<rect x="2" y="3" width="20" height="13" rx="2"/><path d="M8 21h8M12 16v5"/><path d="M6 11l3-3 2.5 2.5L16 6"/>',
  layers: '<path d="M12 2.5 3 7l9 4.5L21 7z"/><path d="m3 12 9 4.5L21 12"/><path d="m3 17 9 4.5L21 17"/>',
  zap: '<path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  bell: '<path d="M18 8a6 6 0 1 0-12 0c0 6-2.5 7-2.5 7h17S18 14 18 8"/><path d="M13.7 20a2 2 0 0 1-3.4 0"/>',
  wrench: '<path d="M14.7 6.3a4.5 4.5 0 0 0 5.9 5.9l-8.3 8.3a2.5 2.5 0 0 1-3.6-3.5z"/><path d="m14.7 6.3 3.1-3.1a4.5 4.5 0 0 0-5.2 5.2"/>',
  code: '<path d="m8 6-6 6 6 6M16 6l6 6-6 6"/>',
  terminal: '<path d="m4 17 6-5-6-5M12 19h8"/>',
  network: '<rect x="9" y="2" width="6" height="5" rx="1"/><rect x="2" y="17" width="6" height="5" rx="1"/><rect x="16" y="17" width="6" height="5" rx="1"/><path d="M12 7v4M5 17v-2h14v2"/><path d="M12 11v4"/>',
  shield: '<path d="M12 2.5 4.5 5.5v6c0 4.5 3.1 8.6 7.5 10 4.4-1.4 7.5-5.5 7.5-10v-6z"/><path d="m9.2 12 2 2 3.6-3.8"/>',
  lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  globe: '<circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h19"/><path d="M12 2.5a15 15 0 0 1 0 19 15 15 0 0 1 0-19"/>',
  plug: '<path d="M9 2v6M15 2v6"/><path d="M6 8h12v3a6 6 0 0 1-12 0z"/><path d="M12 17v5"/>',
  activity: '<path d="M2.5 12h4l3-8 5 16 3-8h4"/>',
  briefcase: '<rect x="2.5" y="7" width="19" height="13" rx="2"/><path d="M8.5 7V5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2"/><path d="M2.5 12.5h19"/>',
  cap: '<path d="M12 3 1.5 8 12 13l10.5-5z"/><path d="M5.5 10.5V16c0 1.7 2.9 3 6.5 3s6.5-1.3 6.5-3v-5.5"/>',
  mail: '<rect x="2" y="4.5" width="20" height="15" rx="2"/><path d="m2.8 6 9.2 6.5L21.2 6"/>',
  phone: '<path d="M6.5 2.5h3l1.5 4-2 1.5a12 12 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17.5 17.5 0 0 1 4.5 4.7a2 2 0 0 1 2-2.2"/>',
  chat: '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.9 8.9 0 0 1-3.9-.9L3 20.5l1.5-5A8.4 8.4 0 0 1 12 3.1a8.4 8.4 0 0 1 9 8.4"/>',
  linkedin: '<rect x="2.5" y="2.5" width="19" height="19" rx="3"/><path d="M7 10v7M7 7v.01"/><path d="M11.5 17v-4a2.5 2.5 0 0 1 5 0v4"/><path d="M11.5 10v7"/>',
  pin: '<path d="M12 21.5s7-5.8 7-11a7 7 0 1 0-14 0c0 5.2 7 11 7 11"/><circle cx="12" cy="10.5" r="2.6"/>',
  download: '<path d="M12 3v12"/><path d="m7.5 10.5 4.5 4.5 4.5-4.5"/><path d="M4 20.5h16"/>',
  arrowRight: '<path d="M4 12h16"/><path d="m14 6 6 6-6 6"/>',
  arrowUp: '<path d="M12 20V4"/><path d="m6 10 6-6 6 6"/>',
  arrowDown: '<path d="M12 4v16"/><path d="m6 14 6 6 6-6"/>',
  chevronLeft: '<path d="m15 5-7 7 7 7"/>',
  chevronRight: '<path d="m9 5 7 7-7 7"/>',
  close: '<path d="M5 5l14 14M19 5 5 19"/>',
  expand: '<path d="M9 3H3v6M15 21h6v-6M21 9V3h-6M3 15v6h6"/>',
  check: '<path d="m4.5 12.5 5 5 10-11"/>',
  spark: '<path d="m12 2.5 2.2 6.3 6.3 2.2-6.3 2.2L12 19.5l-2.2-6.3L3.5 11l6.3-2.2z"/>',
  send: '<path d="M21.5 2.5 11 13"/><path d="M21.5 2.5 15 21.5l-4-8.5-8.5-4z"/>',
  clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 3v1"/><path d="M9 11h6M9 15h4"/>',
  sliders: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h10M18 18h2"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="16" cy="18" r="2"/>',
  refresh: '<path d="M20.5 11a8.5 8.5 0 0 0-14.8-4.4L2.5 9.5"/><path d="M3.5 13a8.5 8.5 0 0 0 14.8 4.4l3.2-2.9"/><path d="M2.5 4.5v5h5M21.5 19.5v-5h-5"/>',
  chip: '<rect x="6" y="6" width="12" height="12" rx="1.5"/><path d="M10 2v4M14 2v4M10 18v4M14 18v4M2 10h4M2 14h4M18 10h4M18 14h4"/>',
};

/**
 * @param {string} name  key from PATHS
 * @param {object} [opt] { cls, size, stroke }
 * @returns {string} SVG markup — aria-hidden, since every icon in this UI is
 *                   paired with a visible or screen-reader-only text label.
 */
export function icon(name, opt = {}) {
  const d = PATHS[name];
  if (!d) return '';
  const cls = opt.cls ? ` class="${opt.cls}"` : '';
  return (
    `<svg${cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" ` +
    `stroke-width="${opt.stroke || 1.75}" stroke-linecap="round" ` +
    `stroke-linejoin="round" aria-hidden="true" focusable="false">${d}</svg>`
  );
}

export const hasIcon = (name) => Object.hasOwn(PATHS, name);
