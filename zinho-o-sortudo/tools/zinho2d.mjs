// Zinho em 2D (vetor SVG), estilo cartoon plano com contorno grosso, para thumbnails.
// Exporta zinho(opções) -> string SVG <g> e cenários/efeitos simples. Usado por tools/thumb2d.mjs.
//   pose: idle | cheer | head (mãos na cabeça) | hold (mãos à frente) | point | shrug | sit
//   expr: happy | shock | sad | smug | worried | tired | angry | cry
//   prop: goldbar | phone | radio | bread | sandwich | none ; gold: mãos de ouro

const OL = '#17110d', W = 7;
const C = { skin: '#6b4024', skinD: '#55321c', hair: '#151110', shirt: '#2f7df6', shirtD: '#1f5fc4', jacket: '#1d1d22', jacketL: '#3a3a44',
  jeans: '#27396b', shoe: '#f4f4f4', gold: '#ffc21a', goldD: '#d38b00', goldL: '#fff2a8' };
const s = (o) => Object.entries(o).map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())}="${v}"`).join(' ');
const path = (d, fill, o = {}) => `<path d="${d}" ${s({ fill, stroke: OL, strokeWidth: W, strokeLinejoin: 'round', strokeLinecap: 'round', ...o })}/>`;
const circ = (cx, cy, r, fill, o = {}) => `<circle ${s({ cx, cy, r, fill, stroke: OL, strokeWidth: W, ...o })}/>`;
const ell = (cx, cy, rx, ry, fill, o = {}) => `<ellipse ${s({ cx, cy, rx, ry, fill, stroke: OL, strokeWidth: W, ...o })}/>`;

// braço: do ombro (x0,y0) até a mão (x1,y1), manga do casaco + mão redonda
function arm(x0, y0, x1, y1, gold, prop) {
  const hand = gold ? C.gold : C.skin;
  let out = `<line ${s({ x1: x0, y1: y0, x2: x1, y2: y1, stroke: OL, strokeWidth: 46, strokeLinecap: 'round' })}/>`
    + `<line ${s({ x1: x0, y1: y0, x2: x1, y2: y1, stroke: C.jacket, strokeWidth: 32, strokeLinecap: 'round' })}/>`
    + `<line ${s({ x1: x0 + 4, y1: y0 + 6, x2: (x0 + x1) / 2 + 4, y2: (y0 + y1) / 2 + 6, stroke: C.jacketL, strokeWidth: 6, strokeLinecap: 'round', opacity: 0.8 })}/>`;
  out += circ(x1, y1, 22, hand);
  if (gold) out += `<circle cx="${x1 - 7}" cy="${y1 - 8}" r="6" fill="${C.goldL}"/>`;
  return out;
}

function face(expr) {
  const ex = { happy: 0, shock: 0, sad: 0, smug: 0, worried: 0, tired: 0, angry: 0, cry: 0, ...{} };
  const big = expr === 'shock' ? 1.18 : 1;
  let o = '';
  // olhos
  for (const sd of [-1, 1]) {
    const cx = sd * 44, cy = -2;
    if (expr === 'tired') {
      o += ell(cx, cy, 26, 30, '#fff');
      o += `<path d="M${cx - 33} ${cy - 2} L${cx + 33} ${cy - 2} L${cx + 33} ${cy - 40} L${cx - 33} ${cy - 40} Z" fill="${C.skin}"/><path d="M${cx - 29} ${cy - 2} L${cx + 29} ${cy - 2}" stroke="${OL}" stroke-width="${W}" stroke-linecap="round"/>`;
      o += `<circle cx="${cx + sd * 2}" cy="${cy + 8}" r="11" fill="${OL}"/>`;
      o += `<path d="M${cx - 22} ${cy + 36} Q${cx} ${cy + 46} ${cx + 22} ${cy + 36}" fill="none" stroke="#3b2414" stroke-width="5" stroke-linecap="round" opacity=".8"/>`;
    } else if (expr === 'smug') {
      o += ell(cx, cy + 4, 26, 22, '#fff');
      o += `<path d="M${cx - 33} ${cy + 1} L${cx + 33} ${cy + 1} L${cx + 33} ${cy - 26} L${cx - 33} ${cy - 26} Z" fill="${C.skin}"/><path d="M${cx - 27} ${cy + 1} L${cx + 27} ${cy + 1}" stroke="${OL}" stroke-width="${W}" stroke-linecap="round"/>`;
      o += `<circle cx="${cx + 6}" cy="${cy + 10}" r="11" fill="${OL}"/>`;
    } else {
      o += ell(cx, cy, 27 * big, 32 * big, '#fff');
      const pr = expr === 'shock' ? 9 : 15, px = cx + (expr === 'shock' ? 0 : sd * -3), py = cy + (expr === 'sad' || expr === 'cry' ? 8 : 4);
      o += `<circle cx="${px}" cy="${py}" r="${pr}" fill="${OL}"/><circle cx="${px - pr * 0.35}" cy="${py - pr * 0.4}" r="${pr * 0.35}" fill="#fff"/>`;
    }
  }
  // sobrancelhas
  const brow = { happy: [-8, 0], shock: [-22, 0], sad: [-10, 14], cry: [-10, 14], worried: [-14, 14], smug: [-4, -10], tired: [-6, 6], angry: [-2, -16] }[expr] || [-8, 0];
  for (const sd of [-1, 1]) {
    const y = -48 + brow[0], tilt = brow[1] * sd;
    o += `<path d="M${sd * 22} ${y - tilt / 2} L${sd * 66} ${y + tilt / 2}" stroke="${OL}" stroke-width="13" stroke-linecap="round"/>`;
  }
  // bochechas
  for (const sd of [-1, 1]) o += `<ellipse cx="${sd * 74}" cy="44" rx="17" ry="10" fill="#e0646a" opacity=".55"/>`;
  // boca
  const M = {
    happy: `<path d="M-34 52 Q0 92 34 52 Z" fill="#7a1f1f" stroke="${OL}" stroke-width="${W}" stroke-linejoin="round"/><path d="M-16 72 Q0 84 16 72 Q0 66 -16 72Z" fill="#ff7b88"/>`,
    shock: `<ellipse cx="0" cy="70" rx="20" ry="26" fill="#7a1f1f" stroke="${OL}" stroke-width="${W}"/><ellipse cx="0" cy="84" rx="12" ry="8" fill="#ff7b88"/>`,
    sad: `<path d="M-26 78 Q0 56 26 78" fill="none" stroke="${OL}" stroke-width="9" stroke-linecap="round"/>`,
    cry: `<path d="M-28 82 Q0 52 28 82 Z" fill="#7a1f1f" stroke="${OL}" stroke-width="${W}" stroke-linejoin="round"/>`,
    worried: `<path d="M-24 72 Q-12 64 0 72 Q12 80 24 72" fill="none" stroke="${OL}" stroke-width="8" stroke-linecap="round"/>`,
    smug: `<path d="M-22 66 Q10 84 32 58" fill="none" stroke="${OL}" stroke-width="9" stroke-linecap="round"/>`,
    tired: `<path d="M-20 74 L20 72" stroke="${OL}" stroke-width="8" stroke-linecap="round"/>`,
    angry: `<path d="M-26 80 Q0 60 26 80 Z" fill="#7a1f1f" stroke="${OL}" stroke-width="${W}" stroke-linejoin="round"/>`,
  };
  o += M[expr] || M.happy;
  if (['shock', 'worried'].includes(expr)) o += `<path d="M96 -54 Q112 -30 104 -14 Q92 -6 86 -20 Q84 -36 96 -54Z" fill="#7fd3ff" stroke="${OL}" stroke-width="4"/>`;
  if (['sad', 'cry'].includes(expr)) for (const sd of expr === 'cry' ? [-1, 1] : [1]) o += `<path d="M${sd * 46} 28 Q${sd * 58} 54 ${sd * 50} 70 Q${sd * 40} 76 ${sd * 36} 62 Q${sd * 36} 46 ${sd * 46} 28Z" fill="#7fd3ff" stroke="${OL}" stroke-width="4"/>`;
  return o;
}

function prop(name, x, y) {
  switch (name) {
    case 'goldbar': return `<g transform="translate(${x} ${y})">${path('M-46 -6 L-30 -30 L34 -30 L50 -6 L50 14 L-46 14 Z', C.gold)}<path d="M-46 -6 L50 -6" stroke="${OL}" stroke-width="5"/><path d="M-24 -24 L22 -24" stroke="${C.goldL}" stroke-width="6" stroke-linecap="round"/></g>`;
    case 'phone': return `<g transform="translate(${x} ${y}) rotate(-12)">${path('M-22 -40 h44 a8 8 0 0 1 8 8 v70 a8 8 0 0 1 -8 8 h-44 a8 8 0 0 1 -8 -8 v-70 a8 8 0 0 1 8 -8z', '#26262e')}<rect x="-20" y="-30" width="40" height="58" rx="4" fill="#8fd6ff"/></g>`;
    case 'radio': return `<g transform="translate(${x} ${y})">${path('M-50 -26 h100 v58 h-100 z', '#8a8f99')}${circ(-22, 3, 16, '#3a3d44')}<rect x="8" y="-14" width="32" height="12" fill="#ffd23f" stroke="${OL}" stroke-width="4"/><line x1="40" y1="-26" x2="62" y2="-80" stroke="${OL}" stroke-width="6" stroke-linecap="round"/></g>`;
    case 'bread': return `<g transform="translate(${x} ${y})">${path('M-52 10 Q-56 -30 -20 -34 Q0 -46 20 -34 Q56 -30 52 10 Z', '#e0a35a')}<path d="M-24 -26 l8 14 M0 -32 l8 14 M22 -26 l8 14" stroke="#b9772f" stroke-width="5" stroke-linecap="round"/></g>`;
    default: return '';
  }
}

// personagem completo; origem nos pés, altura ~540 com s=1
export function zinho({ x = 0, y = 0, sc = 1, pose = 'idle', expr = 'happy', prop: pr = 'none', gold = false, flip = false } = {}) {
  let back = '', front = '';
  const sh = { l: [-70, -238], r: [70, -238] };
  const hands = {
    idle: [[-96, -110], [96, -110]], cheer: [[-152, -520], [152, -520]], head: [[-126, -404], [126, -404]],
    hold: [[-46, -170], [46, -170]], point: [[-96, -110], [150, -300]], shrug: [[-150, -230], [150, -230]], sit: [[-90, -150], [90, -150]],
  }[pose] || [[-96, -110], [96, -110]];
  // pernas e ténis
  const legs = pose === 'sit'
    ? path('M-56 -96 h112 v40 h-112z', C.jeans) + path('M-70 -30 q0 -26 30 -26 h30 v26z', C.shoe) + path('M70 -30 q0 -26 -30 -26 h-30 v26z', C.shoe)
    : path('M-58 -112 L-56 -26 L-12 -26 L-8 -112 Z', C.jeans) + path('M58 -112 L56 -26 L12 -26 L8 -112 Z', C.jeans)
      + path('M-72 0 Q-74 -34 -34 -34 L-6 -34 L-6 0 Z', C.shoe) + path('M72 0 Q74 -34 34 -34 L6 -34 L6 0 Z', C.shoe);
  // tronco: camiseta azul + casaco de couro aberto
  const torso = path('M-78 -250 Q-86 -160 -66 -104 L66 -104 Q86 -160 78 -250 Q0 -276 -78 -250 Z', C.jacket)
    + path('M-26 -258 L26 -258 L30 -108 L-30 -108 Z', C.shirt)
    + `<path d="M-26 -256 L-10 -206 L-36 -196" fill="none" stroke="${C.jacketL}" stroke-width="7" stroke-linecap="round"/><path d="M26 -256 L10 -206 L36 -196" fill="none" stroke="${C.jacketL}" stroke-width="7" stroke-linecap="round"/>`
    + `<path d="M-60 -230 Q-66 -180 -58 -130" fill="none" stroke="${C.jacketL}" stroke-width="6" stroke-linecap="round" opacity=".7"/>`;
  const armsBack = pose === 'cheer';
  const armsSvg = arm(sh.l[0], sh.l[1], hands[0][0], hands[0][1], gold) + arm(sh.r[0], sh.r[1], hands[1][0], hands[1][1], gold);
  // cabeça
  let head = `<g transform="translate(0 -390)">`;
  head += circ(-118, 10, 26, C.skin) + circ(118, 10, 26, C.skin);
  head += ell(0, 0, 124, 118, C.skin);
  // cabelo curto com torcidinhas
  head += path('M-114 -30 Q-122 -118 -30 -132 Q0 -136 30 -132 Q122 -118 114 -30 Q104 -58 84 -66 Q60 -86 0 -86 Q-60 -86 -84 -66 Q-104 -58 -114 -30 Z', C.hair);
  for (let r = 0; r < 3; r++) for (let i = 0; i < 7 - r; i++) { const a = Math.PI * (0.2 + (i + r * 0.5) * (0.6 / (6 - r))), rr = 100 - r * 26;
    const hy = -Math.sin(a) * rr - 14; if (hy > -96) continue;
    head += `<path d="M${-Math.cos(a) * rr - 7} ${hy} q7 -12 14 0" fill="none" stroke="#3a302c" stroke-width="4" stroke-linecap="round"/>`; }
  head += face(expr) + `</g>`;
  const propSvg = pr !== 'none' ? prop(pr, (hands[0][0] + hands[1][0]) / 2, Math.min(hands[0][1], hands[1][1]) - 14) : '';
  const body = legs + (armsBack ? armsSvg : '') + torso + head + (armsBack ? '' : (pose === 'hold' ? propSvg : '') + armsSvg) + (pose !== 'hold' ? propSvg : '');
  return `<g transform="translate(${x} ${y}) scale(${flip ? -sc : sc} ${sc})">${back}${body}${front}</g>`;
}

// ── cenários planos (painel w x h) ──
export function bg(kind, w, h) {
  const r = (x, y, ww, hh, f, o = '') => `<rect x="${x}" y="${y}" width="${ww}" height="${hh}" fill="${f}" ${o}/>`;
  const out = [];
  if (kind === 'room' || kind === 'roomNight') {
    const night = kind === 'roomNight';
    out.push(r(0, 0, w, h, night ? '#2b3a78' : '#7fb8e8'), r(0, h * 0.68, w, h * 0.32, night ? '#5a3f2e' : '#c98b52'));
    out.push(`<rect x="${w * 0.58}" y="${h * 0.14}" width="${w * 0.3}" height="${h * 0.24}" fill="${night ? '#0b1238' : '#d8f1ff'}" stroke="#fff" stroke-width="10"/>`);
    if (night) out.push(`<circle cx="${w * 0.8}" cy="${h * 0.2}" r="14" fill="#fff6c8"/>`);
  } else if (kind === 'kitchen') {
    out.push(r(0, 0, w, h, '#f3d9a4'), r(0, h * 0.5, w, h * 0.18, '#e7e2d6'), r(0, h * 0.5, w, 14, '#9aa3ad'));
    for (let i = 0; i < 8; i++) for (let j = 0; j < 4; j++) out.push(r(i * w / 6, h * 0.68 + j * h * 0.08, w / 12, h * 0.08, '#36b6a5', `opacity="${(i + j) % 2 ? 1 : 0}"`));
    out.push(r(0, h * 0.68, w, h * 0.32, '#e9f7f3', 'opacity=".4"'));
  } else if (kind === 'street' || kind === 'streetDusk' || kind === 'streetNight') {
    const sky = { street: ['#6cc4ff', '#bfe8ff'], streetDusk: ['#5b4aa8', '#ff9f6b'], streetNight: ['#0a1440', '#22336e'] }[kind];
    out.push(`<defs><linearGradient id="sk${kind}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient></defs>`, r(0, 0, w, h, `url(#sk${kind})`));
    const hs = [['#f2c14e', 0.62], ['#f4a7a0', 0.5], ['#9fd3e6', 0.58], ['#a8e0b5', 0.46]];
    hs.forEach(([c, hh], i) => { const x = -30 + i * w * 0.32; out.push(`<rect x="${x}" y="${h * (0.66 - hh * 0.5)}" width="${w * 0.34}" height="${h * hh * 0.5 + 4}" fill="${c}" stroke="${OL}" stroke-width="6"/>`, `<path d="M${x - 8} ${h * (0.66 - hh * 0.5)} L${x + w * 0.17} ${h * (0.66 - hh * 0.5) - 50} L${x + w * 0.34 + 8} ${h * (0.66 - hh * 0.5)} Z" fill="#d9483b" stroke="${OL}" stroke-width="6" stroke-linejoin="round"/>`, `<rect x="${x + w * 0.1}" y="${h * (0.66 - hh * 0.5) + 30}" width="${w * 0.12}" height="${w * 0.1}" fill="#dff3ff" stroke="${OL}" stroke-width="5"/>`); });
    out.push(r(0, h * 0.66, w, h * 0.08, '#e8dfcc'), r(0, h * 0.74, w, h * 0.26, '#8d929a'), `<rect x="${w * 0.42}" y="${h * 0.86}" width="${w * 0.16}" height="10" fill="#f4d03f"/>`);
    if (kind === 'streetNight') for (let i = 0; i < 40; i++) out.push(`<circle cx="${(i * 97) % w}" cy="${(i * 53) % (h * 0.4)}" r="${1.5 + (i % 3)}" fill="#fff" opacity=".9"/>`);
    if (kind === 'streetNight') out.push(r(0, 0, w, h, '#061033', 'opacity=".35"'));
  } else if (kind === 'classroom') {
    out.push(r(0, 0, w, h, '#f6e7c1'), `<rect x="${w * 0.1}" y="${h * 0.1}" width="${w * 0.8}" height="${h * 0.3}" fill="#2f5d46" stroke="#8b5a2b" stroke-width="14"/>`, r(0, h * 0.7, w, h * 0.3, '#c98b52'));
  }
  return out.join('');
}

// ── efeitos ──
export function fx(kind, w, h, o = {}) {
  const out = [];
  if (kind === 'rays') { // linhas de impacto radiais
    const cx = o.x ?? w / 2, cy = o.y ?? h * 0.45;
    for (let i = 0; i < 28; i++) { const a = i / 28 * Math.PI * 2, r0 = 170, r1 = 900; out.push(`<path d="M${cx + Math.cos(a) * r0} ${cy + Math.sin(a) * r0} L${cx + Math.cos(a + 0.05) * r1} ${cy + Math.sin(a + 0.05) * r1} L${cx + Math.cos(a - 0.05) * r1} ${cy + Math.sin(a - 0.05) * r1} Z" fill="${o.color || '#fff'}" opacity="${o.op ?? 0.35}"/>`); }
  } else if (kind === 'sparkles') {
    for (let i = 0; i < (o.n || 8); i++) { const x = (o.x ?? w / 2) + Math.cos(i * 2.4) * (60 + (i * 37) % 120), y = (o.y ?? h / 2) + Math.sin(i * 2.4) * (60 + (i * 53) % 110), r = 10 + (i % 3) * 6;
      out.push(`<path d="M${x} ${y - r} Q${x} ${y} ${x + r} ${y} Q${x} ${y} ${x} ${y + r} Q${x} ${y} ${x - r} ${y} Q${x} ${y} ${x} ${y - r}Z" fill="${o.color || '#fff6a8'}" stroke="${OL}" stroke-width="3"/>`); }
  } else if (kind === 'goldpile') { // pilha de barras
    const bx = o.x ?? w / 2, by = o.y ?? h * 0.9, n = o.rows || 4;
    for (let row = 0; row < n; row++) for (let i = 0; i < n - row; i++) { const x = bx + (i - (n - row - 1) / 2) * 92, y = by - row * 44;
      out.push(`<g transform="translate(${x} ${y})">${path('M-46 -6 L-32 -40 L32 -40 L46 -6 L46 4 L-46 4 Z', C.gold)}<path d="M-22 -32 L20 -32" stroke="${C.goldL}" stroke-width="6" stroke-linecap="round"/></g>`); }
  } else if (kind === 'goldtree') {
    const x = o.x ?? w * 0.7, y = o.y ?? h * 0.7;
    out.push(path(`M${x - 22} ${y} L${x - 14} ${y - 180} L${x + 14} ${y - 180} L${x + 22} ${y} Z`, C.goldD), circ(x, y - 260, 120, C.gold), circ(x - 90, y - 200, 80, C.gold), circ(x + 90, y - 200, 80, C.gold),
      `<circle cx="${x - 40}" cy="${y - 300}" r="26" fill="${C.goldL}"/>`);
  } else if (kind === 'animals') { // gato preto e cachorro simples
    const x = o.x ?? w * 0.25, y = o.y ?? h * 0.92;
    out.push(ell(x, y - 40, 44, 34, '#1b1b1f'), circ(x + 40, y - 80, 30, '#1b1b1f'), path(`M${x + 20} ${y - 104} l8 -26 l14 20z`, '#1b1b1f'), path(`M${x + 50} ${y - 106} l10 -24 l10 24z`, '#1b1b1f'),
      `<circle cx="${x + 32}" cy="${y - 84}" r="7" fill="#ffd23f"/><circle cx="${x + 52}" cy="${y - 84}" r="7" fill="#ffd23f"/>`, `<path d="M${x - 44} ${y - 40} q-40 -10 -30 -60" fill="none" stroke="${OL}" stroke-width="16" stroke-linecap="round"/><path d="M${x - 44} ${y - 40} q-40 -10 -30 -60" fill="none" stroke="#1b1b1f" stroke-width="8" stroke-linecap="round"/>`);
    const dx = o.dx ?? w * 0.78;
    out.push(ell(dx, y - 46, 54, 36, '#c8742f'), circ(dx - 50, y - 90, 34, '#c8742f'), ell(dx - 72, y - 96, 14, 26, '#8a4a1c'), ell(dx - 26, y - 104, 14, 26, '#8a4a1c'),
      `<circle cx="${dx - 60}" cy="${y - 94}" r="6" fill="${OL}"/><circle cx="${dx - 38}" cy="${y - 94}" r="6" fill="${OL}"/><ellipse cx="${dx - 50}" cy="${y - 78}" rx="9" ry="6" fill="${OL}"/>`,
      ...[-30, 30].map((k) => path(`M${dx + k - 10} ${y - 20} v20 h20 v-20z`, '#c8742f')));
  } else if (kind === 'fire') {
    const x = o.x ?? w * 0.75, y = o.y ?? h * 0.95;
    out.push(`<ellipse cx="${x}" cy="${y - 60}" rx="160" ry="120" fill="#ff9a3c" opacity=".25"/>`, path(`M${x - 50} ${y} L${x + 50} ${y - 16} M${x - 50} ${y - 16} L${x + 50} ${y}`, 'none', { strokeWidth: 14, stroke: '#6d4428' }),
      path(`M${x - 46} ${y - 12} Q${x - 60} ${y - 80} ${x - 10} ${y - 150} Q${x} ${y - 100} ${x + 18} ${y - 120} Q${x + 60} ${y - 70} ${x + 46} ${y - 12} Z`, '#ff7a1a'), path(`M${x - 20} ${y - 14} Q${x - 26} ${y - 60} ${x} ${y - 96} Q${x + 30} ${y - 56} ${x + 20} ${y - 14} Z`, '#ffd23f', { strokeWidth: 0 }));
  } else if (kind === 'cars') { // carros abandonados
    for (const [x, c] of [[o.x ?? w * 0.2, '#e74c3c'], [o.x2 ?? w * 0.85, '#3d6fd8']]) { const y = h * 0.88;
      out.push(path(`M${x - 80} ${y} v-40 q0 -12 12 -12 h24 l20 -28 h56 l22 28 h18 q12 0 12 12 v40z`, c), circ(x - 46, y + 4, 18, '#26262e'), circ(x + 46, y + 4, 18, '#26262e'), `<path d="M${x - 20} ${y - 76} l18 0 l14 22 h-32z" fill="#bfe6f7"/>`); }
  }
  return out.join('');
}
