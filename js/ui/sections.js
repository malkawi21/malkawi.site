/**
 * sections.js — renderers for the data-driven sections.
 *
 * Each function reads structure from js/data/site.js and prose from the
 * active translation dictionary, so switching language re-renders content
 * without any duplicated markup in index.html.
 */

import { icon } from '../icons.js';
import { t, tList } from '../i18n.js';
import {
  SIGNAL_CHAIN, METRICS, LAYERS, CAPABILITIES,
  SKILL_GROUPS, INFRA_OPS, CHANNELS,
} from '../data/site.js';

/** Escape text destined for innerHTML. All prose passes through here. */
export const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const chips = (list, cls = 'chip') =>
  list.map((tech) => `<span class="${cls}">${esc(tech)}</span>`).join('');

const mount = (id, html) => {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
  return el;
};

/* -------------------------------------------------------------------------
   Hero: signal chain
   ------------------------------------------------------------------------- */

export function renderChain() {
  const nodes = SIGNAL_CHAIN.map((n, i) => {
    const link =
      i < SIGNAL_CHAIN.length - 1
        ? `<div class="chain__link" style="--d:${(i * 0.42).toFixed(2)}s"></div>`
        : '';

    return `
      <div class="chain__node${n.out ? ' chain__node--out' : ''}">
        <span class="chain__icon">${icon(n.icon)}</span>
        <div>
          <div class="chain__name">${esc(t(`chain.${n.id}.name`))}</div>
          <div class="chain__meta">${esc(t(`chain.${n.id}.meta`))}</div>
        </div>
        <span class="chain__proto">${esc(n.proto)}</span>
      </div>${link}`;
  }).join('');

  mount(
    'signal-chain',
    `<div class="chain__head">
       <span class="chain__title">${esc(t('chain.title'))}</span>
       <span class="status"><span class="status__dot"></span><span>${esc(t('chain.live'))}</span></span>
     </div>
     <div class="chain__list">${nodes}</div>
     <div class="chain__foot">
       <span>${esc(t('chain.footLeft'))}</span>
       <span>${esc(t('chain.footRight'))}</span>
     </div>`
  );
}

/* -------------------------------------------------------------------------
   Hero: metrics
   ------------------------------------------------------------------------- */

export function renderMetrics() {
  mount(
    'metrics',
    METRICS.map((m) => {
      const value = m.countable
        ? `<span data-count="${m.value}">0</span><span class="unit">${m.suffix || ''}</span>`
        : esc(m.raw ?? m.value);

      return `
        <div class="metric">
          <div class="metric__value">${value}</div>
          <div class="metric__label">${esc(t(`metrics.${m.id}`))}</div>
        </div>`;
    }).join('')
  );
}

/* -------------------------------------------------------------------------
   Engineering ecosystem — layered rack
   ------------------------------------------------------------------------- */

export function renderLayers() {
  mount(
    'stack-rack',
    LAYERS.map(
      (l, i) => `
      <article class="layer" style="--layer-color:${l.color}" data-reveal>
        <div class="layer__rail">
          <span class="layer__index">${String(i + 1).padStart(2, '0')}</span>
          <span class="layer__spine"></span>
        </div>
        <div>
          <h3 class="layer__title">${esc(t(`layers.${l.id}.title`))}</h3>
          <p class="layer__role">${esc(t(`layers.${l.id}.role`))}</p>
          <div class="chip-row">${chips(l.tech)}</div>
        </div>
      </article>`
    ).join('')
  );
}

/* -------------------------------------------------------------------------
   What I Build
   ------------------------------------------------------------------------- */

export function renderCapabilities() {
  mount(
    'capabilities',
    CAPABILITIES.map(
      (c) => `
      <article class="card" data-reveal>
        <div class="card__body fcard">
          <span class="fcard__icon">${icon(c.icon)}</span>
          <h3 class="fcard__title">${esc(t(`capabilities.${c.id}.title`))}</h3>
          <p class="fcard__text">${esc(t(`capabilities.${c.id}.text`))}</p>
        </div>
      </article>`
    ).join('')
  );
}

/* -------------------------------------------------------------------------
   Skill groups
   ------------------------------------------------------------------------- */

export function renderSkills() {
  mount(
    'skills',
    SKILL_GROUPS.map(
      (g) => `
      <section class="panel skillgroup" style="--g-color:${g.color}" data-reveal>
        <header class="skillgroup__head">
          <span class="skillgroup__icon">${icon(g.icon)}</span>
          <h3 class="skillgroup__title">${esc(t(`skills.groups.${g.id}`))}</h3>
        </header>
        <div class="chip-row">${chips(g.items)}</div>
      </section>`
    ).join('')
  );
}

/* -------------------------------------------------------------------------
   Infrastructure operations
   ------------------------------------------------------------------------- */

export function renderInfraOps() {
  mount(
    'infra-ops',
    INFRA_OPS.map(
      (o) => `
      <div class="op">
        <span class="op__icon">${icon(o.icon)}</span>
        <div>
          <div class="op__name">${esc(t(`infra.ops.${o.id}`))}</div>
          <div class="op__meta">${esc(o.meta)}</div>
        </div>
        <span class="op__state">${esc(t('infra.stateLabel'))}</span>
      </div>`
    ).join('')
  );
}

/* -------------------------------------------------------------------------
   Contact channels
   ------------------------------------------------------------------------- */

export function renderChannels() {
  mount(
    'channels',
    CHANNELS.map((c) => {
      const label = esc(t(`contact.channels.${c.id}.label`));
      const value = esc(c.valueKey ? t(c.valueKey) : c.value);
      const inner = `
        <span class="channel__icon">${icon(c.icon)}</span>
        <div>
          <div class="channel__k">${label}</div>
          <div class="channel__v">${value}</div>
        </div>
        ${c.static ? '<span></span>' : `<span class="channel__go">${icon('arrowRight')}</span>`}`;

      if (c.static) {
        return `<div class="channel" style="--ch:${c.color}">${inner}</div>`;
      }

      const rel = c.external ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a class="channel" style="--ch:${c.color}" href="${esc(c.href)}"${rel}>${inner}</a>`;
    }).join('')
  );
}

/* -------------------------------------------------------------------------
   Experience — one entry today, but rendered from a list so adding a role
   is a data change rather than a markup change.
   ------------------------------------------------------------------------- */

export function renderExperience() {
  const bullets = (key, cls = '') =>
    `<ul class="ticks ${cls}">${tList(key).map((b) => `<li>${esc(b)}</li>`).join('')}</ul>`;

  mount(
    'experience-body',
    `<div class="tl-item__head">
       <h3>${esc(t('experience.role'))}</h3>
       <span class="tl-item__period">${esc(t('experience.period'))}</span>
     </div>
     <p class="tl-item__org">${esc(t('experience.company'))}</p>
     <div class="xp__cols">
       <div>
         <div class="xp__colhead">${icon('server')}<span>${esc(t('experience.groups.systems'))}</span></div>
         ${bullets('experience.systems')}
       </div>
       <div>
         <div class="xp__colhead xp__colhead--energy">${icon('network')}<span>${esc(t('experience.groups.integration'))}</span></div>
         ${bullets('experience.integration', 'ticks--energy')}
       </div>
     </div>
     <div style="margin-top:1.4rem">
       <div class="xp__colhead">${icon('terminal')}<span>${esc(t('experience.groups.platform'))}</span></div>
       ${bullets('experience.platform')}
     </div>`
  );
}

/** Render everything that depends on the translation dictionary. */
export function renderAll() {
  renderChain();
  renderMetrics();
  renderLayers();
  renderCapabilities();
  renderSkills();
  renderInfraOps();
  renderChannels();
  renderExperience();
}
