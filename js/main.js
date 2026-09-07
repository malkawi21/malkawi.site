/**
 * main.js — application entry point.
 *
 * Boot order matters: translations must resolve before any renderer runs,
 * because every component reads its copy from the dictionary.
 */

import { setLanguage, preferredLang, currentLang, t } from './i18n.js';
import { renderAll } from './ui/sections.js';
import { initNav } from './ui/nav.js';
import { initReveal, observeReveals, initSpotlight, initCounters } from './ui/motion.js';
import { initLightbox } from './ui/lightbox.js';
import { initProjects } from './ui/projects.js';
import { initArchitecture } from './ui/architecture.js';
import { initForm } from './ui/form.js';

function syncLangToggle() {
  const btn = document.getElementById('lang-toggle');
  if (!btn) return;
  const next = currentLang() === 'ar' ? 'en' : 'ar';
  btn.textContent = next.toUpperCase();
  btn.setAttribute('aria-label', t('language.switchLabel'));
  btn.dataset.next = next;
}

function initLangToggle() {
  const btn = document.getElementById('lang-toggle');
  btn?.addEventListener('click', async () => {
    btn.disabled = true;
    try {
      await setLanguage(btn.dataset.next || 'ar');
    } catch (err) {
      console.error(err);
    } finally {
      btn.disabled = false;
    }
  });
}

function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = String(new Date().getFullYear());
}

async function boot() {
  // 1. Copy first — nothing can render without it.
  try {
    await setLanguage(preferredLang());
  } catch (err) {
    console.error('Falling back to English:', err);
    await setLanguage('en').catch(() => {});
  }

  // 2. Data-driven markup.
  renderAll();
  initProjects();
  initArchitecture();

  // 3. Behaviour and motion, once the DOM they observe exists.
  initNav();
  initReveal();
  initSpotlight();
  initCounters();
  initLightbox();
  initForm();
  initLangToggle();
  initYear();
  syncLangToggle();

  document.body.classList.add('is-ready');
}

// Re-render on language change: sections rebuild their own markup, then the
// reveal observer and counters are re-attached to the fresh nodes.
document.addEventListener('i18n:changed', () => {
  if (!document.body.classList.contains('is-ready')) return;
  renderAll();
  observeReveals();
  initCounters();
  syncLangToggle();
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
