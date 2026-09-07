/**
 * architecture.js — "From Field Device to Cloud".
 *
 * A stage spine on one side, a detail readout on the other. Stages are real
 * <button>s inside a tablist, so the whole walk-through is operable with
 * arrow keys and readable by a screen reader — not just a hover effect.
 */

import { icon } from '../icons.js';
import { t, tList } from '../i18n.js';
import { STAGES } from '../data/site.js';
import { esc } from './sections.js';

let active = 0;

function renderSpine() {
  const spine = document.getElementById('arch-spine');
  if (!spine) return;

  spine.innerHTML = STAGES.map((s, i) => {
    const wire =
      i < STAGES.length - 1
        ? `<div class="arch__wire" style="--d:${(i * 0.45).toFixed(2)}s" aria-hidden="true"></div>`
        : '';

    return `
      <button class="arch__stage${i === active ? ' is-active' : ''}"
              style="--stage-color:${s.color}"
              type="button" role="tab"
              id="stage-${s.id}"
              aria-selected="${i === active}"
              aria-controls="arch-detail"
              tabindex="${i === active ? '0' : '-1'}"
              data-index="${i}">
        <span class="arch__node">${icon(s.icon)}</span>
        <span>
          <span class="arch__name">${esc(t(`stages.${s.id}.name`))}</span>
          <span class="arch__sub">${esc(t(`stages.${s.id}.sub`))}</span>
        </span>
      </button>${wire}`;
  }).join('');
}

function renderDetail() {
  const box = document.getElementById('arch-detail');
  if (!box) return;

  const s = STAGES[active];
  const doing = tList(`stages.${s.id}.doing`);

  box.style.setProperty('--stage-color', s.color);
  box.innerHTML = `
    <div class="arch__detail-in">
      <span class="kicker kicker--plain" style="color:${s.color}">
        ${String(active + 1).padStart(2, '0')} / ${String(STAGES.length).padStart(2, '0')}
      </span>
      <h3>${esc(t(`stages.${s.id}.name`))}</h3>
      <p class="arch__detail-text">${esc(t(`stages.${s.id}.text`))}</p>

      <dl class="arch__io">
        <div><dt>${esc(t('architecture.inLabel'))}</dt><dd>${esc(t(`stages.${s.id}.in`))}</dd></div>
        <div><dt>${esc(t('architecture.outLabel'))}</dt><dd>${esc(t(`stages.${s.id}.out`))}</dd></div>
      </dl>

      <span class="arch__detail-label">${esc(t('architecture.doingLabel'))}</span>
      <ul class="ticks" style="margin-bottom:1.15rem">
        ${doing.map((d) => `<li>${esc(d)}</li>`).join('')}
      </ul>

      <span class="arch__detail-label">${esc(t('architecture.techLabel'))}</span>
      <div class="chip-row">
        ${s.tech.map((x) => `<span class="chip">${esc(x)}</span>`).join('')}
      </div>
    </div>`;
}

function select(index) {
  active = (index + STAGES.length) % STAGES.length;
  renderSpine();
  renderDetail();
}

export function initArchitecture() {
  const spine = document.getElementById('arch-spine');
  if (!spine) return;

  renderSpine();
  renderDetail();

  spine.addEventListener('click', (e) => {
    const btn = e.target.closest('.arch__stage');
    if (btn) select(Number(btn.dataset.index));
  });

  // Pointer hover switches stages too, but only on devices that truly hover —
  // otherwise a tap would fire hover then click and double-render.
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    spine.addEventListener('pointerover', (e) => {
      const btn = e.target.closest('.arch__stage');
      if (btn && Number(btn.dataset.index) !== active) select(Number(btn.dataset.index));
    });
  }

  spine.addEventListener('keydown', (e) => {
    const rtl = document.documentElement.dir === 'rtl';
    const back = rtl ? 'ArrowRight' : 'ArrowLeft';
    const fwd = rtl ? 'ArrowLeft' : 'ArrowRight';

    let next = null;
    if (e.key === 'ArrowDown' || e.key === fwd) next = active + 1;
    else if (e.key === 'ArrowUp' || e.key === back) next = active - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = STAGES.length - 1;
    if (next === null) return;

    e.preventDefault();
    select(next);
    document.getElementById(`stage-${STAGES[active].id}`)?.focus();
  });

  document.addEventListener('i18n:changed', () => {
    renderSpine();
    renderDetail();
  });
}
