// Motor de stickman (estilo das referências: cabeça redonda grande, traço preto grosso, olhos ovais com pupila em crescente)
const NS = 'http://www.w3.org/2000/svg';
function S(tag, attrs = {}, parent) { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
const D2R = Math.PI / 180;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, k) => a + (b - a) * k;
const ease = x => (x = clamp(x), x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const easeOut = x => 1 - Math.pow(1 - clamp(x), 3);
const seg = (t, a, b) => clamp((t - a) / (b - a));
function spring(t, w = 14, z = 0.7) { if (t <= 0) return 0; if (z >= 1) return 1 - Math.exp(-w * t) * (1 + w * t); const wd = w * Math.sqrt(1 - z * z); return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + (z * w / wd) * Math.sin(wd * t)); }
// direção a partir de um ângulo (0 = para baixo, +90 = para a direita)
const dir = (a, L) => [Math.sin(a * D2R) * L, Math.cos(a * D2R) * L];

// ---------------- POSES (ângulos absolutos dos segmentos) ----------------
// aL/aR = braço esq./dir. [braço, antebraço]; lL/lR = perna [coxa, canela]; lean = inclinação do tronco; hy = descida da anca
const POSES = {
  stand:    { aL: [-12, -6], aR: [12, 6], lL: [-7, -3], lR: [7, 3] },
  wave:     { aL: [-12, -6], aR: [130, 165], lL: [-7, -3], lR: [7, 3] },
  point:    { aL: [-12, -6], aR: [92, 92], lL: [-7, -3], lR: [7, 3] },
  pointL:   { aL: [-92, -92], aR: [12, 6], lL: [-7, -3], lR: [7, 3] },
  raise:    { aL: [-12, -6], aR: [165, 178], lL: [-7, -3], lR: [7, 3] },
  think:    { aL: [-40, 35], aR: [28, -160], lL: [-7, -3], lR: [7, 3], head: 8 },
  read:     { aL: [-18, 145], aR: [18, -145], lL: [-7, -3], lR: [7, 3], head: 10 },
  phone:    { aL: [-12, -6], aR: [16, -150], lL: [-7, -3], lR: [7, 3], head: 12 },
  present:  { aL: [-12, -6], aR: [100, 115], lL: [-7, -3], lR: [7, 3] },
  presentL: { aL: [-100, -115], aR: [12, 6], lL: [-7, -3], lR: [7, 3] },
  confused: { aL: [-30, -10], aR: [150, -175], lL: [-7, -3], lR: [7, 3], head: -10 },
  listen:   { aL: [-12, -6], aR: [60, -177], lL: [-7, -3], lR: [7, 3], head: 12 },
  cross:    { aL: [-22, 78], aR: [22, -78], lL: [-7, -3], lR: [7, 3] },
  celebrate:{ aL: [-150, -165], aR: [150, 165], lL: [-14, -4], lR: [14, 4] },
  shrug:    { aL: [-55, -140], aR: [55, 140], lL: [-7, -3], lR: [7, 3], head: 6 },
  hips:     { aL: [-40, 35], aR: [40, -35], lL: [-10, -3], lR: [10, 3] },
  sad:      { aL: [-6, -2], aR: [6, 2], lL: [-5, -2], lR: [5, 2], lean: 0, head: 14, hy: 6 },
  scared:   { aL: [-60, -150], aR: [60, 150], lL: [-16, 6], lR: [16, -6], hy: 12 },
  sit:      { aL: [-14, 40], aR: [14, -40], lL: [82, 0], lR: [96, 6], hy: 78 },
  sitThink: { aL: [-14, 40], aR: [28, -160], lL: [82, 0], lR: [96, 6], hy: 78, head: 8 },
  sitRead:  { aL: [-18, 145], aR: [18, -145], lL: [82, 0], lR: [96, 6], hy: 78, head: 10 },
  sitWrite: { aL: [-14, 40], aR: [40, 100], lL: [82, 0], lR: [96, 6], hy: 78, head: 18 },
  sick:     { aL: [-10, 60], aR: [10, -60], lL: [-6, -2], lR: [6, 2], lean: 8, head: 16, hy: 8 },
  lift:     { aL: [-160, -175], aR: [160, 175], lL: [-22, 10], lR: [22, -10], hy: 18 },
  push:     { aL: [70, 90], aR: [80, 95], lL: [-30, -10], lR: [25, 10], lean: 25 },
  bow:      { aL: [-5, 0], aR: [5, 0], lL: [-6, -2], lR: [6, 2], lean: 45, head: 20 },
  talk:     { aL: [-25, -60], aR: [40, 120], lL: [-7, -3], lR: [7, 3] },
  write:    { aL: [-12, -6], aR: [120, 150], lL: [-7, -3], lR: [7, 3] },  // a escrever num quadro à direita
  writeL:   { aL: [-120, -150], aR: [12, 6], lL: [-7, -3], lR: [7, 3] },
};
const POSE_KEYS = ['aL', 'aR', 'lL', 'lR'];
function mixPose(a, b, k) {
  const o = {}; for (const key of POSE_KEYS) o[key] = [lerp(a[key][0], b[key][0], k), lerp(a[key][1], b[key][1], k)];
  for (const s of ['lean', 'head', 'hy']) o[s] = lerp(a[s] || 0, b[s] || 0, k); return o;
}
// ciclos procedurais
function walkPose(t, speed = 1, run = 0) {
  const p = t * 2 * Math.PI * (1.6 + run) * speed, s = Math.sin(p), c = Math.cos(p), sw = 26 + run * 22;
  return { aL: [-s * sw * .8 - 8, -s * sw * .5 - 20 * run], aR: [s * sw * .8 + 8, s * sw * .5 + 20 * run],
    lL: [s * sw, s * sw + Math.max(0, -c) * 40], lR: [-s * sw, -s * sw + Math.max(0, c) * 40], lean: run * 14, head: 0, hy: Math.abs(s) * -6 };
}

// ---------------- EXPRESSÕES (folha "35 Expression Exercise") ----------------
// lid: fração das pálpebras fechadas (0 aberto, 1 fechado); px/py: olhar; ps: tamanho da pupila; brow: [altura, ângulo] ou null
// mouth: tipo; extra: suor/lágrimas/estrelas/zzz
const EXPR = {
  calm:      { lid: 0, px: 4, py: 2, ps: 1, brow: null, mouth: 'line' },
  happy:     { lid: 0, px: 3, py: 0, ps: 1, brow: [-36, 0, 'arc'], mouth: 'smile' },
  sad:       { lid: .35, px: 0, py: 6, ps: 1, brow: [-32, -18], mouth: 'frown' },
  angry:     { lid: .3, px: 0, py: 2, ps: 1, brow: [-26, 22], mouth: 'teeth' },
  confused:  { lid: .15, px: -4, py: 0, ps: .9, brow: [-34, -10, 'one'], mouth: 'squiggle' },
  shocked:   { lid: 0, px: 0, py: 0, ps: .45, brow: [-44, 0, 'arc'], mouth: 'o' },
  nervous:   { lid: .1, px: 0, py: 0, ps: .55, brow: [-34, -14], mouth: 'wobble', extra: 'sweat' },
  tired:     { lid: .6, px: 0, py: 4, ps: 1, brow: null, mouth: 'line' },
  confident: { lid: .45, px: 5, py: 0, ps: 1, brow: [-28, 8], mouth: 'smirk' },
  excited:   { lid: 0, px: 0, py: -2, ps: .8, brow: [-40, 0, 'arc'], mouth: 'D', extra: 'stars' },
  pensive:   { lid: .2, px: -6, py: -8, ps: 1, brow: [-34, -6], mouth: 'small' },
  sick:      { lid: .55, px: 0, py: 6, ps: 1, brow: [-30, -16], mouth: 'wave', extra: 'sweat' },
  crying:    { lid: .55, px: 0, py: 4, ps: 1, brow: [-32, -20], mouth: 'frown', extra: 'tears' },
  scared:    { lid: 0, px: 0, py: 0, ps: .4, brow: [-42, -18], mouth: 'grimace', extra: 'sweat' },
  laughing:  { lid: 1, px: 0, py: 0, ps: 1, brow: [-38, 0, 'arc'], mouth: 'D', closed: 'happy' },
  bored:     { lid: .55, px: 6, py: 2, ps: 1, brow: null, mouth: 'flatside' },
  incredulous:{ lid: .5, px: 0, py: 0, ps: 1, brow: [-30, -8, 'one'], mouth: 'line' },
  sleep:     { lid: 1, px: 0, py: 0, ps: 1, brow: null, mouth: 'small', closed: 'line', extra: 'zzz' },
  serious:   { lid: .25, px: 0, py: 2, ps: 1, brow: [-28, 4], mouth: 'line' },
  smug:      { lid: .5, px: 6, py: 0, ps: 1, brow: [-30, 10, 'one'], mouth: 'smirk' },
  curious:   { lid: 0, px: 6, py: -6, ps: 1.05, brow: [-40, 0, 'arc'], mouth: 'small' },
};

let UID = 0;
// ---------------- PERSONAGEM ----------------
// opts: {acc: ['glasses','tie','hair','coat','bun','bald','hat','wild'], scale, stroke}
function makeStick(parent, opts = {}) {
  const id = ++UID, g = S('g', {}, parent), sw = opts.stroke || 9;
  const st = { stroke: '#111', 'stroke-width': sw, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none' };
  const body = S('path', st, g), limbs = ['aL', 'aR', 'lL', 'lR'].map(() => S('path', st, g));
  const coat = opts.acc?.includes('coat') ? S('path', { ...st, 'stroke-width': 5 }, g) : null;
  const tie = opts.acc?.includes('tie') ? S('path', { ...st, 'stroke-width': 5, fill: '#111' }, g) : null;
  const head = S('g', {}, g);
  const R = 52;
  S('circle', { cx: 0, cy: 0, r: R, fill: '#fffdf7', stroke: '#111', 'stroke-width': sw - 1 }, head);
  const acc = opts.acc || [];
  if (acc.includes('hair')) S('path', { ...st, 'stroke-width': 7, d: 'M-34 -38 l8 -18 l8 14 l8 -18 l8 14 l8 -18 l8 14 l8 -14' }, head);
  if (acc.includes('wild')) S('path', { ...st, 'stroke-width': 6, d: 'M-46 -24 q-20 -10 -8 -30 q-12 -18 10 -22 q4 -20 24 -8 q14 -16 26 2 q22 -6 18 16 q20 6 4 24' }, head);
  if (acc.includes('bun')) { S('circle', { cx: 0, cy: -62, r: 16, fill: '#111' }, head); }
  if (acc.includes('hat')) S('path', { stroke: '#111', 'stroke-width': 6, fill: '#111', d: 'M-50 -40 L50 -40 L40 -46 L32 -86 L-32 -86 L-40 -46 Z' }, head);
  // olhos
  const eyes = [-1, 1].map(s => {
    const cid = `ec${id}${s > 0 ? 'r' : 'l'}`, ex = s * 20, ey = -4;
    const cp = S('clipPath', { id: cid }, head); S('ellipse', { cx: ex, cy: ey, rx: 15, ry: 21 }, cp);
    const eg = S('g', {}, head);
    const white = S('ellipse', { cx: ex, cy: ey, rx: 15, ry: 21, fill: '#fff', stroke: '#111', 'stroke-width': 4 }, eg);
    const pg = S('g', { 'clip-path': `url(#${cid})` }, eg);
    const pupil = S('ellipse', { cx: ex, cy: ey, rx: 10, ry: 15, fill: '#111' }, pg);
    const lid = S('rect', { x: ex - 18, y: ey - 24, width: 36, height: 0, fill: '#fffdf7' }, pg);
    const lidLine = S('path', { stroke: '#111', 'stroke-width': 4, 'stroke-linecap': 'round', fill: 'none' }, eg);
    const closed = S('path', { stroke: '#111', 'stroke-width': 5, 'stroke-linecap': 'round', fill: 'none' }, head);
    const brow = S('path', { stroke: '#111', 'stroke-width': 5, 'stroke-linecap': 'round', fill: 'none' }, head);
    return { s, ex, ey, eg, white, pupil, lid, lidLine, closed, brow };
  });
  const mouth = S('path', { stroke: '#111', 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none' }, head);
  const extra = S('g', {}, head);
  if (acc.includes('glasses')) { S('circle', { cx: -20, cy: -4, r: 22, stroke: '#111', 'stroke-width': 4, fill: 'none' }, head); S('circle', { cx: 20, cy: -4, r: 22, stroke: '#111', 'stroke-width': 4, fill: 'none' }, head); }
  const hand = { L: S('g', {}, g), R: S('g', {}, g) };      // adereços presos às mãos
  return { g, body, limbs, head, eyes, mouth, extra, coat, tie, hand, R, opts, exprKey: null };
}

function setFace(c, e, t) {
  const blink = !e.closed && ((t * 1.0 + (c.opts.seed || 0)) % 3.7) < .12;
  for (const E of c.eyes) {
    const lid = blink ? 1 : e.lid;
    const showClosed = e.closed || lid >= .98;
    E.eg.setAttribute('display', showClosed ? 'none' : 'inline');
    E.pupil.setAttribute('cx', E.ex + e.px + E.s * 1); E.pupil.setAttribute('cy', E.ey + e.py); E.pupil.setAttribute('rx', 10 * e.ps); E.pupil.setAttribute('ry', 15 * e.ps);
    const lh = 42 * lid; E.lid.setAttribute('height', lh);
    E.lidLine.setAttribute('d', lid > .02 ? `M${E.ex - 14} ${E.ey - 21 + lh} L${E.ex + 14} ${E.ey - 21 + lh}` : '');
    E.closed.setAttribute('d', showClosed ? (e.closed === 'happy' ? `M${E.ex - 13} ${E.ey + 4} Q${E.ex} ${E.ey - 14} ${E.ex + 13} ${E.ey + 4}` : `M${E.ex - 13} ${E.ey + 2} L${E.ex + 13} ${E.ey + 2}`) : '');
    if (e.brow) { const [h, ang, type] = e.brow; if (type === 'one' && E.s < 0) { E.brow.setAttribute('d', `M${E.ex - 12} ${E.ey + h + 14} L${E.ex + 12} ${E.ey + h + 14}`); continue; }
      const a = ang * E.s * D2R, x0 = E.ex - 13, x1 = E.ex + 13, y = E.ey + h;
      E.brow.setAttribute('d', type === 'arc' ? `M${x0} ${y + 4} Q${E.ex} ${y - 8} ${x1} ${y + 4}` : `M${x0} ${y - Math.tan(a) * -13} L${x1} ${y + Math.tan(a) * -13}`);
    } else E.brow.setAttribute('d', '');
  }
  const M = { line: 'M-12 30 L12 30', smile: 'M-18 24 Q0 42 18 24', frown: 'M-16 38 Q0 24 16 38', teeth: 'M-18 28 L18 28 L16 40 L-16 40 Z M-8 28 L-8 40 M2 28 L2 40 M10 28 L10 40',
    squiggle: 'M-14 32 q5 -6 10 0 t10 0 t8 -2', o: 'M-9 24 Q-12 46 0 48 Q12 46 9 24 Q0 18 -9 24 Z', wobble: 'M-16 32 q4 -5 8 0 t8 0 t8 0 t8 0', smirk: 'M-12 32 Q4 34 16 24',
    D: 'M-20 22 L20 22 Q18 50 0 50 Q-18 50 -20 22 Z', small: 'M-5 32 L5 32', wave: 'M-16 32 q4 -6 8 0 t8 0 t8 0 t8 0', grimace: 'M-20 26 L20 26 L20 40 L-20 40 Z M-10 26 L-10 40 M0 26 L0 40 M10 26 L10 40 M-20 33 L20 33', flatside: 'M0 32 L16 30' };
  c.mouth.setAttribute('d', M[e.mouth] || M.line);
  c.mouth.setAttribute('fill', ['o', 'D'].includes(e.mouth) ? '#111' : 'none');
  if (c.exprKey !== e) {
    c.extra.innerHTML = ''; c.exprKey = e;
    if (e.extra === 'sweat') { S('path', { d: 'M52 -40 q8 14 0 20 q-8 -6 0 -20 Z', fill: '#bfe3ff', stroke: '#111', 'stroke-width': 3 }, c.extra); S('path', { d: 'M62 -12 q6 10 0 15 q-6 -5 0 -15 Z', fill: '#bfe3ff', stroke: '#111', 'stroke-width': 3 }, c.extra); }
    if (e.extra === 'tears') { S('path', { d: 'M-22 14 q-4 20 2 30 M22 14 q4 20 -2 30', stroke: '#6fb6ff', 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, c.extra); }
    if (e.extra === 'stars') { for (const [x, y] of [[-70, -50], [70, -60], [80, 10]]) S('path', { d: `M${x} ${y - 10} L${x + 3} ${y - 3} L${x + 10} ${y} L${x + 3} ${y + 3} L${x} ${y + 10} L${x - 3} ${y + 3} L${x - 10} ${y} L${x - 3} ${y - 3} Z`, fill: '#ffd23f', stroke: '#111', 'stroke-width': 3 }, c.extra); }
    if (e.extra === 'zzz') { const t1 = S('text', { x: 50, y: -50, 'font-family': 'Permanent Marker', 'font-size': 34, fill: '#111' }, c.extra); t1.textContent = 'z z Z'; }
  }
}

// desenha o personagem: x,y = pés; pose (objeto), expr (chave ou objeto), opts {s, rot, flip, t}
function drawStick(c, x, y, pose, expr, o = {}) {
  const s = o.s || 1, t = o.t || 0, flip = o.flip ? -1 : 1;
  const breathe = Math.sin(t * 2.2 + (c.opts.seed || 0)) * 2.5;
  const hip = [0, -(170 - (pose.hy || 0))], lean = (pose.lean || 0) * flip;
  const neck = [hip[0] + Math.sin(lean * D2R) * 150, hip[1] - Math.cos(lean * D2R) * 150 + breathe];
  const A = a => a * flip;
  const limb = (base, [a1, a2], L1, L2) => { const k = [base[0] + dir(A(a1), L1)[0], base[1] + dir(A(a1), L1)[1]]; const h = [k[0] + dir(A(a2), L2)[0], k[1] + dir(A(a2), L2)[1]]; return [base, k, h]; };
  const arms = { L: limb(neck, pose.aL, 72, 66), R: limb(neck, pose.aR, 72, 66) }, legs = { L: limb(hip, pose.lL, 86, 84), R: limb(hip, pose.lR, 86, 84) };
  const P = pts => 'M' + pts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L');
  c.body.setAttribute('d', P([hip, neck]));
  [arms.L, arms.R, legs.L, legs.R].forEach((pts, i) => c.limbs[i].setAttribute('d', P(pts)));
  if (c.coat) c.coat.setAttribute('d', `M${neck[0] - 26} ${neck[1] + 10} L${hip[0] - 34} ${hip[1] + 40} M${neck[0] + 26} ${neck[1] + 10} L${hip[0] + 34} ${hip[1] + 40}`);
  if (c.tie) c.tie.setAttribute('d', `M${neck[0]} ${neck[1] + 4} l-7 14 l7 34 l7 -34 Z`);
  const ht = (pose.head || 0) * flip + (o.headTilt || 0);
  const hc = [neck[0] + Math.sin((lean + ht * .3) * D2R) * 56, neck[1] - Math.cos((lean + ht * .3) * D2R) * 56];
  c.head.setAttribute('transform', `translate(${hc[0].toFixed(1)} ${hc[1].toFixed(1)}) rotate(${ht.toFixed(1)}) scale(${(o.headScale || 1).toFixed(3)})`);
  setFace(c, typeof expr === 'string' ? EXPR[expr] : expr, t);
  c.hand.L.setAttribute('transform', `translate(${arms.L[2][0].toFixed(1)} ${arms.L[2][1].toFixed(1)})`);
  c.hand.R.setAttribute('transform', `translate(${arms.R[2][0].toFixed(1)} ${arms.R[2][1].toFixed(1)})`);
  c.g.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(o.rot || 0).toFixed(2)}) scale(${s.toFixed(3)})`);
  c.g.setAttribute('opacity', o.op ?? 1); c.g.setAttribute('display', (o.op ?? 1) <= 0 ? 'none' : 'inline');
  c.handPos = { L: arms.L[2], R: arms.R[2], head: hc };
}
function hideStick(c) { c.g.setAttribute('display', 'none'); }

// ---------------- ADEREÇOS (doodles) ----------------
const INK = { stroke: '#111', 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none' };
const PROPS = {
  book:   g => { S('path', { ...INK, fill: '#fffdf7', d: 'M-50 -36 L0 -28 L50 -36 L50 30 L0 38 L-50 30 Z M0 -28 L0 38' }, g); S('path', { ...INK, 'stroke-width': 3, d: 'M-40 -18 L-10 -14 M-40 -4 L-10 0 M10 -14 L40 -18 M10 0 L40 -4' }, g); },
  phone:  g => { S('rect', { ...INK, fill: '#fffdf7', x: -20, y: -38, width: 40, height: 70, rx: 8 }, g); S('rect', { x: -12, y: -28, width: 24, height: 44, fill: '#9fd3ff' }, g); },
  cube:   g => { S('path', { ...INK, fill: '#fffdf7', d: 'M-30 -14 L0 -30 L30 -14 L30 22 L0 38 L-30 22 Z M-30 -14 L0 2 L30 -14 M0 2 L0 38' }, g); S('path', { ...INK, 'stroke-width': 3, d: 'M-20 -19 L10 -3 M-10 -24 L20 -8 M-30 -2 L0 14 M-30 10 L0 26 M10 -3 L10 33 M20 -8 L20 28' }, g); },
  bulb:   g => { S('path', { ...INK, fill: '#ffe066', d: 'M-26 -10 A30 30 0 1 1 26 -10 Q16 6 14 22 L-14 22 Q-16 6 -26 -10 Z' }, g); S('path', { ...INK, d: 'M-12 32 L12 32 M-8 42 L8 42 M-40 -60 L-50 -72 M40 -60 L50 -72 M0 -70 L0 -86' }, g); },
  bulbOff:g => { S('path', { ...INK, fill: '#fffdf7', d: 'M-26 -10 A30 30 0 1 1 26 -10 Q16 6 14 22 L-14 22 Q-16 6 -26 -10 Z' }, g); S('path', { ...INK, d: 'M-12 32 L12 32 M-8 42 L8 42' }, g); },
  key:    g => { S('circle', { ...INK, cx: -18, cy: 0, r: 14 }, g); S('path', { ...INK, d: 'M-4 0 L34 0 M24 0 L24 12 M32 0 L32 10' }, g); },
  button: g => { S('path', { ...INK, fill: '#fffdf7', d: 'M-70 30 L70 30 L60 0 L-60 0 Z' }, g); S('ellipse', { ...INK, fill: '#ff5a4f', cx: 0, cy: -2, rx: 46, ry: 18 }, g); },
  battery:g => { S('rect', { ...INK, fill: '#fffdf7', x: -60, y: -28, width: 110, height: 56, rx: 8 }, g); S('rect', { x: 50, y: -12, width: 12, height: 24, fill: '#111' }, g); S('rect', { x: -50, y: -18, width: 90, height: 36, fill: '#7ddc7a' }, g); },
  napkin: g => { S('path', { ...INK, fill: '#fffdf7', d: 'M-50 -40 L50 -44 L46 40 L-46 44 Z' }, g); S('path', { ...INK, 'stroke-width': 3, d: 'M-30 -20 q10 -10 20 0 t20 0 M-30 0 L20 0 M-30 18 L0 18 M10 18 L26 24' }, g); },
  calc:   g => { S('rect', { ...INK, fill: '#fffdf7', x: -36, y: -50, width: 72, height: 100, rx: 8 }, g); S('rect', { ...INK, 'stroke-width': 3, x: -26, y: -40, width: 52, height: 22 }, g); for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) S('rect', { x: -24 + i * 18, y: -10 + j * 18, width: 12, height: 12, fill: '#111' }, g); },
  therm:  g => { S('path', { ...INK, fill: '#fffdf7', d: 'M-8 -50 L-8 20 A16 16 0 1 0 8 20 L8 -50 A8 8 0 0 0 -8 -50 Z' }, g); S('path', { stroke: '#ff5a4f', 'stroke-width': 8, 'stroke-linecap': 'round', d: 'M0 28 L0 -40' }, g); },
  mic:    g => { S('path', { ...INK, d: 'M0 10 L0 60' }, g); S('rect', { ...INK, fill: '#111', x: -12, y: -30, width: 24, height: 40, rx: 12 }, g); },
  notebook:g => { S('rect', { ...INK, fill: '#fffdf7', x: -44, y: -54, width: 88, height: 108, rx: 4 }, g); S('path', { ...INK, 'stroke-width': 3, d: 'M-30 -30 L30 -30 M-30 -12 L30 -12 M-30 6 L20 6 M-30 24 L30 24' }, g); },
  sign:   (g, txt) => { S('path', { ...INK, d: 'M0 0 L0 -120' }, g); S('rect', { ...INK, fill: '#fffdf7', x: -110, y: -200, width: 220, height: 90 }, g); const tx = S('text', { x: 0, y: -140, 'text-anchor': 'middle', 'font-family': 'Permanent Marker', 'font-size': 46, fill: '#111' }, g); tx.textContent = txt; },
};
function prop(parent, name, arg) { const g = S('g', {}, parent); PROPS[name](g, arg); return g; }
