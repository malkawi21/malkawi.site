/**
 * i18n.js — translation loader and DOM binder.
 *
 * Bindings supported on any element:
 *   data-i18n="a.b.c"                 -> textContent
 *   data-i18n-html="a.b.c"            -> innerHTML (only for keys we author)
 *   data-i18n-attr="aria-label:a.b"   -> one or more attributes, comma separated
 *
 * Components that render their own markup listen for the `i18n:changed`
 * event rather than being re-queried here, which keeps translation and
 * rendering decoupled.
 */

const SUPPORTED = ['en', 'ar'];
const FALLBACK = 'en';
const STORAGE_KEY = 'mm.lang';

/** Arabic display face, fetched only when Arabic is actually selected. */
const AR_FONT = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap';

let dict = {};
let lang = FALLBACK;

/** Safe deep lookup: "projects.items.ppc.title" -> string | undefined */
export function t(path, fallback = '') {
  const value = path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), dict);
  return value == null ? fallback : value;
}

/** Array-valued key, always returns an array so callers can `.map()` freely. */
export function tList(path) {
  const value = t(path, null);
  return Array.isArray(value) ? value : [];
}

export const currentLang = () => lang;
export const isRTL = () => lang === 'ar';

/** Resolve the initial language: saved choice > browser preference > en. */
export function preferredLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED.includes(saved)) return saved;
  } catch {
    /* storage blocked (private mode) — fall through to browser preference */
  }
  const nav = (navigator.language || '').slice(0, 2).toLowerCase();
  return SUPPORTED.includes(nav) ? nav : FALLBACK;
}

function ensureArabicFont() {
  if (document.getElementById('ar-font')) return;
  const link = document.createElement('link');
  link.id = 'ar-font';
  link.rel = 'stylesheet';
  link.href = AR_FONT;
  document.head.append(link);
}

/** Apply every data-i18n binding currently in the document. */
export function applyBindings(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    const value = t(el.dataset.i18n, null);
    if (value == null) return;
    if (el.tagName === 'TITLE') document.title = value;
    else el.textContent = value;
  });

  root.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const value = t(el.dataset.i18nHtml, null);
    if (value != null) el.innerHTML = value;
  });

  root.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    el.dataset.i18nAttr.split(',').forEach((pair) => {
      const [attr, key] = pair.split(':').map((s) => s.trim());
      const value = t(key, null);
      if (attr && value != null) el.setAttribute(attr, value);
    });
  });

  // Keep the document description in sync for crawlers that run JS.
  const desc = t('meta.description', null);
  if (desc) {
    document.querySelector('meta[name="description"]')?.setAttribute('content', desc);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', desc);
  }
}

/**
 * Load a language and repaint the document.
 * @returns {Promise<string>} the language actually applied
 */
export async function setLanguage(next) {
  const target = SUPPORTED.includes(next) ? next : FALLBACK;

  const res = await fetch(`lang/${target}.json`, { cache: 'default' });
  if (!res.ok) throw new Error(`i18n: cannot load "${target}" (${res.status})`);

  dict = await res.json();
  lang = target;

  try {
    localStorage.setItem(STORAGE_KEY, target);
  } catch {
    /* non-fatal: the choice simply will not persist */
  }

  const html = document.documentElement;
  html.lang = target;
  html.dir = target === 'ar' ? 'rtl' : 'ltr';
  if (target === 'ar') ensureArabicFont();

  applyBindings();
  document.dispatchEvent(new CustomEvent('i18n:changed', { detail: { lang: target } }));

  return target;
}

export { SUPPORTED, FALLBACK };
