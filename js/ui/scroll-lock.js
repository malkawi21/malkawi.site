/**
 * scroll-lock.js — page scroll lock, derived rather than counted.
 *
 * The site can have two dialogs open at once (a project detail view with a
 * screenshot lightbox on top of it). Tracking the lock with add/remove calls
 * from each of them drifts: whichever closes last has to know whether the
 * other is still open, and one wrong guess leaves the page permanently
 * unscrollable.
 *
 * So the lock is not stored, it is computed — the body is locked if and only
 * if some dialog is currently open. Every open and close just re-derives it.
 */

export function syncScrollLock() {
  document.body.classList.toggle('is-locked', !!document.querySelector('dialog[open]'));
}
