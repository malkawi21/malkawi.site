/**
 * schematic.js — generated architecture diagrams.
 *
 * Several systems here are internal industrial software whose interfaces are
 * not publishable. Rather than padding those cards with stock photography,
 * each one gets a topology diagram drawn from its own data: same 16:10 frame,
 * same visual language, project accent colour.
 *
 * Flow is animated with `stroke-dashoffset` on the traces (a CSS animation,
 * so the global prefers-reduced-motion rule switches it off) instead of SMIL,
 * which cannot be disabled from CSS.
 */

const VB = { w: 400, h: 250 };

const node = (x, y, w, h, label, opt = {}) => {
  const r = opt.round ? h / 2 : 7;
  return (
    `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="${r}" ` +
    `class="sch__node${opt.hot ? ' sch__node--hot' : ''}"/>` +
    (label
      ? `<text x="${x}" y="${y}" class="sch__label${opt.small ? ' sch__label--sm' : ''}">${label}</text>`
      : '')
  );
};

const dot = (x, y, r = 4, hot = false) =>
  `<circle cx="${x}" cy="${y}" r="${r}" class="sch__dot${hot ? ' sch__dot--hot' : ''}"/>`;

const trace = (d, delay = 0) =>
  `<path d="${d}" class="sch__trace" style="--d:${delay}s"/>`;

const wire = (d) => `<path d="${d}" class="sch__wire"/>`;

/* -------------------------------------------------------------------------
   Topologies
   ------------------------------------------------------------------------- */

/** Many sources funnelling into one platform, then fanning out to clients. */
function hub() {
  const ys = [58, 125, 192];
  const feed = ys
    .map((y, i) => wire(`M64 ${y} H120 Q140 ${y} 140 ${y + (125 - y) / 2} V125 H166`) + trace(`M64 ${y} H120 Q140 ${y} 140 ${y + (125 - y) / 2} V125 H166`, i * 0.5))
    .join('');

  const out = [92, 158]
    .map((y, i) => wire(`M234 125 H262 Q282 125 282 ${125 + (y - 125) / 2} V${y} H316`) + trace(`M234 125 H262 Q282 125 282 ${125 + (y - 125) / 2} V${y} H316`, 1.1 + i * 0.4))
    .join('');

  return (
    feed +
    out +
    ys.map((y) => node(40, y, 48, 26, '', { small: true })).join('') +
    ys.map((y) => dot(40, y, 3.5)).join('') +
    node(200, 125, 68, 62, 'API', { hot: true }) +
    node(348, 92, 62, 26, '') +
    node(348, 158, 62, 26, '') +
    dot(348, 92, 3.5, true) +
    dot(348, 158, 3.5, true)
  );
}

/** Linear acquisition pipeline climbing from field to cloud. */
function chain() {
  const pts = [
    [46, 206],
    [134, 168],
    [214, 126],
    [292, 84],
    [360, 46],
  ];

  let paths = '';
  for (let i = 0; i < pts.length - 1; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[i + 1];
    const mid = x1 + (x2 - x1) * 0.55;
    const d = `M${x1 + 22} ${y1} H${mid} V${y2} H${x2 - 22}`;
    paths += wire(d) + trace(d, i * 0.42);
  }

  return (
    paths +
    pts
      .map(([x, y], i) =>
        node(x, y, 44, 24, '', { hot: i === pts.length - 1, round: i === 0 })
      )
      .join('') +
    pts.map(([x, y], i) => dot(x, y, 3.4, i === pts.length - 1)).join('')
  );
}

/** Closed control loop: setpoint out, measurement back. */
function loop() {
  const fwd = 'M118 74 H282';
  const down = 'M312 96 V154';
  const back = 'M282 176 H118';
  const up = 'M88 154 V96';

  return (
    wire(fwd) + trace(fwd, 0) +
    wire(down) + trace(down, 0.4) +
    wire(back) + trace(back, 0.8) +
    wire(up) + trace(up, 1.2) +
    node(88, 74, 84, 44, 'CTRL', { hot: true }) +
    node(312, 74, 84, 44, 'PLANT') +
    node(312, 176, 84, 40, '') +
    node(88, 176, 84, 40, '') +
    dot(312, 176, 3.6) +
    dot(88, 176, 3.6) +
    `<text x="200" y="63" class="sch__cap">setpoint</text>` +
    `<text x="200" y="196" class="sch__cap">measurement</text>`
  );
}

/** Fan-out hierarchy: one engine, many consumers. */
function tree() {
  const root = [200, 48];
  const mid = [[122, 128], [278, 128]];
  const leaf = [[68, 208], [156, 208], [244, 208], [332, 208]];

  let paths = '';
  mid.forEach(([x, y], i) => {
    const d = `M200 ${root[1] + 22} V${(root[1] + y) / 2} H${x} V${y - 16}`;
    paths += wire(d) + trace(d, i * 0.35);
  });
  leaf.forEach(([x, y], i) => {
    const px = mid[i < 2 ? 0 : 1][0];
    const d = `M${px} ${mid[0][1] + 16} V${(mid[0][1] + y) / 2} H${x} V${y - 13}`;
    paths += wire(d) + trace(d, 0.7 + i * 0.25);
  });

  return (
    paths +
    node(root[0], root[1], 96, 44, 'ENGINE', { hot: true }) +
    mid.map(([x, y]) => node(x, y, 64, 32, '')).join('') +
    mid.map(([x, y]) => dot(x, y, 3.6)).join('') +
    leaf.map(([x, y]) => node(x, y, 52, 26, '', { round: true })).join('') +
    leaf.map(([x, y]) => dot(x, y, 3.2, true)).join('')
  );
}

const TOPOLOGIES = { hub, chain, loop, tree };

/**
 * @param {string} kind   one of hub | chain | loop | tree
 * @param {string} color  CSS colour (or var()) used as the diagram accent
 * @param {string} label  short mono caption rendered in the corner
 */
let uid = 0;

export function schematic(kind, color = 'var(--accent)', label = '') {
  const draw = TOPOLOGIES[kind] || chain;
  // Two projects can share a topology, so the pattern id must be unique per
  // instance — duplicate SVG ids are invalid and break re-renders on filter.
  const gid = `sg-${kind}-${++uid}`;

  return (
    `<svg class="sch" viewBox="0 0 ${VB.w} ${VB.h}" role="img" ` +
    `style="--sch:${color}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">` +
    `<defs><pattern id="${gid}" width="25" height="25" patternUnits="userSpaceOnUse">` +
    `<path d="M25 0H0V25" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.16"/>` +
    `</pattern></defs>` +
    `<rect width="${VB.w}" height="${VB.h}" fill="url(#${gid})" class="sch__grid"/>` +
    draw() +
    (label ? `<text x="14" y="234" class="sch__stamp">${label}</text>` : '') +
    `</svg>`
  );
}
