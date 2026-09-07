/**
 * lightbox.js — full-size screenshot viewer.
 *
 * Replaces GLightbox (~40 KB) with the ~100 lines this site actually needs:
 * open, prev/next, keyboard control, focus restore, swipe.
 *
 * It is a <dialog> opened with showModal(), not a z-indexed overlay. That
 * matters: the project detail view is itself a modal <dialog>, and elements
 * promoted to the browser's top layer paint above everything regardless of
 * z-index. Two dialogs stack in the order they were opened, so a lightbox
 * launched from inside the project modal lands on top of it — which a
 * z-index:200 div can never do.
 *
 * Any element carrying `data-zoom="<src>"` opens the viewer; elements sharing
 * a `data-gallery="<id>"` navigate as one set.
 */

import { syncScrollLock } from './scroll-lock.js';

let root;
let imgEl;
let capEl;
let posEl;
let items = [];
let index = 0;
let lastFocus = null;

const svg = (d) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" ` +
  `stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;

function build() {
  root = document.createElement('dialog');
  root.className = 'lightbox';
  root.setAttribute('aria-label', 'Screenshot viewer');
  root.innerHTML = `
    <button class="lightbox__x" type="button" data-lb="close" aria-label="Close">
      ${svg('M5 5l14 14M19 5 5 19')}
    </button>
    <img class="lightbox__img" alt="" />
    <div class="lightbox__bar">
      <button class="lightbox__nav" type="button" data-lb="prev" aria-label="Previous">
        ${svg('m15 5-7 7 7 7')}
      </button>
      <span class="lightbox__caption"></span>
      <span class="lightbox__pos mono"></span>
      <button class="lightbox__nav" type="button" data-lb="next" aria-label="Next">
        ${svg('m9 5 7 7-7 7')}
      </button>
    </div>`;

  document.body.append(root);
  imgEl = root.querySelector('.lightbox__img');
  capEl = root.querySelector('.lightbox__caption');
  posEl = root.querySelector('.lightbox__pos');

  root.addEventListener('click', (e) => {
    const action = e.target.closest('[data-lb]')?.dataset.lb;
    if (action === 'close') close();
    else if (action === 'prev') step(-1);
    else if (action === 'next') step(1);
    // Clicking the backdrop area (anything that is not the image or the bar)
    // dismisses the viewer.
    else if (!e.target.closest('.lightbox__img, .lightbox__bar')) close();
  });

  root.addEventListener('keydown', (e) => {
    const rtl = document.documentElement.dir === 'rtl';
    if (e.key === 'ArrowRight') { e.preventDefault(); step(rtl ? -1 : 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); step(rtl ? 1 : -1); }
    else if (e.key === 'Escape') {
      // Handle Escape ourselves rather than letting the dialog's native close
      // request do it: some builds close the dialog without ever dispatching
      // a `close` event, which would skip teardown entirely.
      e.preventDefault();
      close();
    }
  });

  // Kept as a belt-and-braces path for the same reason: teardown() is
  // idempotent, so it is harmless where the event does fire.
  root.addEventListener('close', teardown);

  // Swipe between shots on touch devices.
  let startX = null;
  root.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  root.addEventListener('touchend', (e) => {
    if (startX == null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 55) step(dx < 0 ? 1 : -1);
    startX = null;
  }, { passive: true });
}

/** Idempotent teardown — safe to run from close() and from a `close` event. */
function teardown() {
  if (!root) return;
  imgEl.removeAttribute('src');
  syncScrollLock();
  lastFocus?.focus?.();
  lastFocus = null;
}

function show() {
  const item = items[index];
  if (!item) return;
  imgEl.src = item.src;
  imgEl.alt = item.alt || '';
  capEl.textContent = item.alt || '';
  posEl.textContent = items.length > 1 ? `${index + 1}/${items.length}` : '';
  root.querySelectorAll('.lightbox__nav').forEach((b) => { b.hidden = items.length < 2; });
}

function step(delta) {
  if (items.length < 2) return;
  index = (index + delta + items.length) % items.length;
  show();
}

export function open(list, startIndex = 0) {
  if (!list.length) return;
  if (!root) build();

  items = list;
  index = Math.max(0, Math.min(startIndex, list.length - 1));
  lastFocus = document.activeElement;

  show();
  root.showModal();
  syncScrollLock();
  root.querySelector('.lightbox__x').focus();
}

export function close() {
  if (!root?.open) return;
  root.close();
  teardown();
}

/**
 * Delegate clicks for every `data-zoom` trigger in the document, including
 * ones rendered later. Called once at startup.
 */
export function initLightbox() {
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-zoom]');
    if (!trigger) return;
    e.preventDefault();
    e.stopPropagation();

    // Gallery members are looked up within the open modal when the trigger
    // lives inside one, so a card thumbnail never joins a detail-view gallery.
    const gallery = trigger.dataset.gallery;
    const scope = trigger.closest('dialog.modal[open]') || document;
    const group = gallery
      ? [...scope.querySelectorAll(`[data-gallery="${CSS.escape(gallery)}"]`)]
      : [trigger];

    open(
      group.map((el) => ({ src: el.dataset.zoom, alt: el.dataset.caption || '' })),
      group.indexOf(trigger)
    );
  });
}
