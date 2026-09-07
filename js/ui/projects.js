/**
 * projects.js — project grid, category filter, and the detail dialog.
 */

import { icon } from '../icons.js';
import { t, tList } from '../i18n.js';
import { PROJECTS, CATEGORIES, categoryColor, coverOf } from '../data/projects.js';
import { schematic } from './schematic.js';
import { esc } from './sections.js';
import { observeReveals } from './motion.js';
import { syncScrollLock } from './scroll-lock.js';

const CHIPS_ON_CARD = 4;
let filter = 'all';
let lastTrigger = null;

const visibleProjects = () =>
  filter === 'all' ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

/* -------------------------------------------------------------------------
   Filters
   ------------------------------------------------------------------------- */

/** Reflect the current filter on the existing buttons, without re-rendering. */
function markActiveFilter() {
  document.querySelectorAll('#project-filters .filter').forEach((btn) => {
    const on = btn.dataset.filter === filter;
    btn.classList.toggle('is-active', on);
    btn.setAttribute('aria-pressed', String(on));
  });
}

function renderFilters() {
  const box = document.getElementById('project-filters');
  if (!box) return;

  box.innerHTML = CATEGORIES.map((c) => {
    const n = c.id === 'all' ? PROJECTS.length : PROJECTS.filter((p) => p.category === c.id).length;
    if (!n) return '';
    return `
      <button class="filter${c.id === filter ? ' is-active' : ''}" type="button"
              data-filter="${c.id}" aria-pressed="${c.id === filter}">
        ${esc(t(`projects.filters.${c.id}`))}<span class="filter__n">${n}</span>
      </button>`;
  }).join('');
}

/* -------------------------------------------------------------------------
   Cards
   ------------------------------------------------------------------------- */

function cardVisual(p) {
  const cover = coverOf(p);
  const title = esc(t(`projects.items.${p.id}.title`));

  if (cover) {
    return `
      <div class="frame frame--shot">
        <span class="frame__tag">${esc(p.tag)}</span>
        <img src="${cover}" alt="${title}" loading="lazy" decoding="async">
        <button class="frame__zoom" type="button"
                data-zoom="${cover}" data-gallery="card-${p.id}" data-caption="${title}"
                aria-label="${esc(t('projects.enlarge'))}">${icon('expand')}</button>
      </div>`;
  }

  return `
    <div class="frame frame--sch">
      <span class="frame__tag">${esc(p.tag)}</span>
      ${schematic(p.schematic, categoryColor(p.category))}
    </div>`;
}

function card(p, i) {
  const shown = p.tech.slice(0, CHIPS_ON_CARD);
  const extra = p.tech.length - shown.length;

  return `
    <article class="card card--project project-item" data-reveal
             style="--cat:${categoryColor(p.category)}; --i:${Math.min(i, 8) * 45}ms">
      ${cardVisual(p)}
      <div class="card__body">
        <div class="card__eyebrow">
          <span>${esc(t(`projects.categories.${p.category}`))}</span>
          ${p.flagship ? `<span class="flag">${icon('spark')}${esc(t('projects.flagship'))}</span>` : ''}
        </div>
        <h3 class="card__title">${esc(t(`projects.items.${p.id}.title`))}</h3>
        <p class="card__text">${esc(t(`projects.items.${p.id}.tagline`))}</p>
        <div class="card__foot">
          <div class="chip-row">
            ${shown.map((x) => `<span class="chip">${esc(x)}</span>`).join('')}
            ${extra > 0 ? `<span class="chip">+${extra}</span>` : ''}
          </div>
          <button class="card__more" type="button" data-project="${p.id}">
            <span>${esc(t('projects.details'))}</span>${icon('arrowRight')}
          </button>
        </div>
      </div>
    </article>`;
}

function renderGrid() {
  const grid = document.getElementById('project-grid');
  if (!grid) return;

  const list = visibleProjects();
  grid.innerHTML = list.length
    ? list.map(card).join('')
    : `<p class="projects__empty">${esc(t('projects.empty'))}</p>`;

  observeReveals(grid);
}

/* -------------------------------------------------------------------------
   Detail dialog
   ------------------------------------------------------------------------- */

function block(labelKey, bodyHtml) {
  if (!bodyHtml) return '';
  return `<section class="pd__block"><h4>${esc(t(labelKey))}</h4>${bodyHtml}</section>`;
}

function listBlock(labelKey, items, cls = 'ticks') {
  if (!items.length) return '';
  return block(labelKey, `<ul class="${cls}">${items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`);
}

function pipeline(p) {
  if (!p.pipeline?.length) return '';
  const steps = p.pipeline
    .map(
      (step, i) =>
        `${i ? `<div class="pipe__arrow">${icon('arrowDown')}</div>` : ''}
         <div class="pipe__step"><span class="pipe__n">${i + 1}</span><span>${esc(step)}</span></div>`
    )
    .join('');
  return `<div class="pipe">${steps}</div>`;
}

function shots(p) {
  if (!p.shots?.length) return '';
  const captions = tList(`projects.items.${p.id}.shots`);
  const title = t(`projects.items.${p.id}.title`);

  const tiles = p.shots
    .map((src, i) => {
      const cap = esc(captions[i] || `${title} — ${i + 1}`);
      return `
        <button class="pd__shot" type="button"
                data-zoom="${src}" data-gallery="pd-${p.id}" data-caption="${cap}"
                aria-label="${cap}">
          <span class="frame frame--shot">
            <img src="${src}" alt="${cap}" loading="lazy" decoding="async">
          </span>
        </button>`;
    })
    .join('');

  return block('projects.detail.screenshots', `<div class="pd__shots">${tiles}</div>`);
}

function detailHtml(p) {
  const k = `projects.items.${p.id}`;

  return `
    <button class="modal__close" type="button" data-close aria-label="${esc(t('projects.close'))}">
      ${icon('close')}
    </button>

    <header class="pd__hero">
      <span class="kicker">${esc(t(`projects.categories.${p.category}`))}</span>
      <h2 id="pd-title">${esc(t(`${k}.title`))}</h2>
      <p class="pd__tagline">${esc(t(`${k}.tagline`))}</p>
      <div class="chip-row">${p.tech.map((x) => `<span class="chip">${esc(x)}</span>`).join('')}</div>
    </header>

    <div class="pd__body">
      <div class="pd__main">
        ${block('projects.detail.overview', `<p class="pd__p">${esc(t(`${k}.overview`))}</p>`)}
        ${block('projects.detail.problem', `<p class="pd__p">${esc(t(`${k}.problem`))}</p>`)}
        ${block('projects.detail.solution', `<p class="pd__p">${esc(t(`${k}.solution`))}</p>`)}
        ${listBlock('projects.detail.features', tList(`${k}.features`))}
        ${listBlock('projects.detail.challenges', tList(`${k}.challenges`))}
        ${shots(p)}
      </div>

      <aside class="pd__side">
        ${block('projects.detail.architecture', pipeline(p))}
        ${listBlock('projects.detail.role', tList(`${k}.role`))}
        ${listBlock('projects.detail.capabilities', tList(`${k}.capabilities`), 'ticks ticks--energy')}
      </aside>
    </div>`;
}

function openDetail(id, trigger) {
  const p = PROJECTS.find((x) => x.id === id);
  const dialog = document.getElementById('project-modal');
  if (!p || !dialog) return;

  lastTrigger = trigger || document.activeElement;

  const panel = dialog.querySelector('.modal__panel');
  panel.style.setProperty('--cat', categoryColor(p.category));
  panel.innerHTML = detailHtml(p);
  panel.scrollTop = 0;
  dialog.dataset.project = id;

  dialog.showModal();
  syncScrollLock();
  panel.querySelector('[data-close]')?.focus();
}

/**
 * Idempotent teardown. Kept separate from the `close` event because that
 * event is not dispatched by every browser build — closing has to run the
 * teardown itself rather than trusting the platform to announce it.
 */
function teardownDetail() {
  const dialog = document.getElementById('project-modal');
  if (!dialog) return;
  syncScrollLock();
  dialog.querySelector('.modal__panel').innerHTML = '';
  delete dialog.dataset.project;
  lastTrigger?.focus?.();
  lastTrigger = null;
}

function closeDetail() {
  const dialog = document.getElementById('project-modal');
  if (!dialog?.open) return;
  dialog.close();
  teardownDetail();
}

/* -------------------------------------------------------------------------
   Wiring
   ------------------------------------------------------------------------- */

export function initProjects() {
  renderFilters();
  renderGrid();

  const filters = document.getElementById('project-filters');
  filters?.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter');
    if (!btn || btn.dataset.filter === filter) return;
    filter = btn.dataset.filter;
    // Update the active state in place rather than re-rendering the bar:
    // replacing the buttons would destroy the one the user just activated
    // and drop keyboard focus back to the top of the document.
    markActiveFilter();
    renderGrid();
  });

  // One delegated handler covers the whole grid, including cards rendered
  // after a filter change or a language switch.
  document.getElementById('project-grid')?.addEventListener('click', (e) => {
    if (e.target.closest('[data-zoom]')) return; // the zoom button owns that click
    const cardEl = e.target.closest('.card--project');
    const btn = cardEl?.querySelector('[data-project]');
    if (btn) openDetail(btn.dataset.project, btn);
  });

  const dialog = document.getElementById('project-modal');
  dialog?.addEventListener('click', (e) => {
    // Clicking the backdrop (outside .modal__panel) dismisses the dialog.
    if (e.target.closest('[data-close]') || !e.target.closest('.modal__panel')) closeDetail();
  });

  // Escape is handled here rather than by the dialog's native close request,
  // for two reasons: the request can close the dialog without dispatching a
  // `close` event (skipping teardown), and it can reach this dialog while the
  // screenshot lightbox is stacked on top of it.
  dialog?.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    e.preventDefault();
    if (document.querySelector('dialog.lightbox[open]')) return; // lightbox owns it
    closeDetail();
  });

  // Belt-and-braces for builds that do dispatch it; teardown is idempotent.
  dialog?.addEventListener('close', teardownDetail);

  document.addEventListener('i18n:changed', () => {
    renderFilters();
    renderGrid();
    // Keep an open dialog in sync with the new language.
    const openId = dialog?.dataset.project;
    if (dialog?.open && openId) {
      const p = PROJECTS.find((x) => x.id === openId);
      if (p) dialog.querySelector('.modal__panel').innerHTML = detailHtml(p);
    }
  });
}
