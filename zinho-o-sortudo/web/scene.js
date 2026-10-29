// Motor de animação de "Zinho, o Sortudo" — Three.js, renderizado quadro a quadro pelo tools/render.mjs.
// Tudo é determinístico: __render(t) desenha exatamente o instante t (s) da linha do tempo.
import * as THREE from 'three';

const qs = new URLSearchParams(location.search);
const RW = +(qs.get('w') || 1280), RH = +(qs.get('h') || 720);

// ───────────────────────── utilidades ─────────────────────────
const D2R = Math.PI / 180;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, k) => a + (b - a) * k;
const smooth = (k) => { k = clamp(k); return k * k * (3 - 2 * k); };
const easeOut = (k) => 1 - Math.pow(1 - clamp(k), 3);
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const pulse = (u, a, b) => (u < a || u > b ? 0 : Math.sin(Math.PI * (u - a) / (b - a)));

// ───────────────────────── renderer ─────────────────────────
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(RW, RH, false);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.getElementById('stage').prepend(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(42, RW / RH, 0.1, 600);

// ───────────────────────── materiais toon + contorno ─────────────────────────
const gradMap = (() => {
  const t = new THREE.DataTexture(new Uint8Array([105, 105, 105, 255, 165, 165, 165, 255, 220, 220, 220, 255, 255, 255, 255, 255]), 4, 1);
  t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t;
})();
const matCache = new Map();
function M(color, o = {}) {
  const key = color + JSON.stringify(o);
  if (!matCache.has(key)) matCache.set(key, new THREE.MeshToonMaterial({ color, gradientMap: gradMap, ...o }));
  return matCache.get(key);
}
const OUTLINE = new THREE.MeshBasicMaterial({ color: 0x16161c, side: THREE.BackSide });
function outline(m, t = 0.025) {
  const g = m.geometry;
  if (!g.boundingBox) g.computeBoundingBox();
  const s = V(), c = V();
  g.boundingBox.getSize(s); g.boundingBox.getCenter(c);
  const k = (size, scl) => (size < 1e-4 ? 1 : (size + 2 * t / Math.abs(scl)) / size);
  const o = new THREE.Mesh(g, OUTLINE);
  o.scale.set(k(s.x, m.scale.x), k(s.y, m.scale.y), k(s.z, m.scale.z));
  o.position.set(c.x * (1 - o.scale.x), c.y * (1 - o.scale.y), c.z * (1 - o.scale.z));
  o.castShadow = false; o.receiveShadow = false;
  m.add(o);
  return o;
}
function mk(geo, mat, { p, r, s, ol = 0.025, cast = true, recv = true, parent } = {}) {
  const m = new THREE.Mesh(geo, mat);
  if (p) m.position.set(...p);
  if (r) m.rotation.set(...r);
  if (s !== undefined) (typeof s === 'number' ? m.scale.setScalar(s) : m.scale.set(...s));
  m.castShadow = cast; m.receiveShadow = recv;
  if (ol) outline(m, ol);
  if (parent) parent.add(m);
  return m;
}
const G = {
  box: (x, y, z) => new THREE.BoxGeometry(x, y, z),
  cyl: (a, b, h, n = 14) => new THREE.CylinderGeometry(a, b, h, n),
  sph: (r, w = 20, h = 14) => new THREE.SphereGeometry(r, w, h),
  ico: (r, d = 0) => new THREE.IcosahedronGeometry(r, d),
  cap: (r, l) => new THREE.CapsuleGeometry(r, l, 6, 16),
};
function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d');
  draw(g, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  t.userData = { c, g };
  return t;
}
function glowTex(color) {
  return canvasTex(128, 128, (g) => {
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, color); gr.addColorStop(0.35, color.replace('1)', '0.45)')); gr.addColorStop(1, color.replace('1)', '0)'));
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  });
}
function sprite(tex, scale, opacity = 1) {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity, fog: false }));
  s.scale.setScalar(scale);
  return s;
}

// ───────────────────────── céu, luzes ─────────────────────────
const skyU = { top: { value: new THREE.Color() }, bot: { value: new THREE.Color() } };
const sky = new THREE.Mesh(new THREE.SphereGeometry(400, 32, 16), new THREE.ShaderMaterial({
  uniforms: skyU, side: THREE.BackSide, depthWrite: false, fog: false,
  vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: 'uniform vec3 top; uniform vec3 bot; varying vec3 vP; void main(){ float h = clamp(vP.y * 1.5 + 0.06, 0.0, 1.0); gl_FragColor = vec4(mix(bot, top, pow(h, 0.75)), 1.0);\n#include <colorspace_fragment>\n}',
}));
sky.renderOrder = -10;
scene.add(sky);

const stars = (() => {
  const n = 900, pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const th = hash(i) * Math.PI * 2, ph = Math.acos(hash(i + 0.37) * 0.95);
    pos.set([Math.sin(ph) * Math.cos(th) * 380, Math.cos(ph) * 380, Math.sin(ph) * Math.sin(th) * 380], i * 3);
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const p = new THREE.Points(g, new THREE.PointsMaterial({ color: '#ffffff', size: 3.2, sizeAttenuation: false, fog: false, transparent: true, opacity: 0.9 }));
  p.renderOrder = -9; scene.add(p); return p;
})();
const hemi = new THREE.HemisphereLight(0xffffff, 0x888888, 1);
const sun = new THREE.DirectionalLight(0xffffff, 2);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14, near: 1, far: 90 });
sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.03;
scene.add(hemi, sun, sun.target);
const fxLight = new THREE.PointLight(0xffaa55, 0, 80, 1.2);
const fxLight2 = new THREE.PointLight(0xff2020, 0, 14, 1.5);
// luz de preenchimento presa à câmara: mantém os rostos legíveis (sobretudo pele escura à noite)
const fill = new THREE.PointLight(0xffffff, 0.4, 0, 0);
const rim = new THREE.DirectionalLight(0xfff1d6, 0);
scene.add(fxLight, fxLight2, fill, rim, rim.target);
scene.fog = new THREE.Fog(0xffffff, 40, 160);

const TOD = {
  day:   { top: '#56aef0', bot: '#f6e8ca', hs: '#e8f4ff', hg: '#a4976e', hi: 1.35, sc: '#fff2dc', si: 2.5, dir: [-12, 22, 14], fog: '#e8e6d8', fogN: 50, fogF: 190, lamps: 0, win: 0 , fill: 0.25 },
  dusk:  { top: '#4b4d96', bot: '#ffab76', hs: '#ffd9bb', hg: '#6a5869', hi: 1.05, sc: '#ffb070', si: 2.1, dir: [-26, 11, 9], fog: '#d6957f', fogN: 35, fogF: 150, lamps: 1, win: 0.6 , fill: 0.45 },
  night: { top: '#081236', bot: '#26386a', hs: '#6074b8', hg: '#22222e', hi: 0.85, sc: '#a2b7ff', si: 0.9, dir: [10, 25, 10], fog: '#1c2749', fogN: 25, fogF: 120, lamps: 1, win: 1 , fill: 0.7 },
  storm: { top: '#242a36', bot: '#5a616f', hs: '#9da6b8', hg: '#393940', hi: 1.0, sc: '#c9d3ea', si: 0.85, dir: [-8, 25, 12], fog: '#4b515d', fogN: 20, fogF: 110, lamps: 1, win: 0.8 , fill: 0.6 },
  indoor: { top: '#8fd0f7', bot: '#fbeacb', hs: '#fff4e2', hg: '#9c8466', hi: 1.45, sc: '#fff0d6', si: 1.7, dir: [-6, 9, 7], fog: null, lamps: 0, win: 0 , fill: 0.3 },
  fog:   { top: '#8d969f', bot: '#c9ccc8', hs: '#d6dbe0', hg: '#7d7a6e', hi: 1.25, sc: '#e6e9ee', si: 0.7, dir: [-10, 20, 12], fog: '#bfc3c2', fogN: 6, fogF: 42, lamps: 0, win: 0, fill: 0.35 },
  dawn:  { top: '#6c7fc4', bot: '#ffc490', hs: '#ffe1c4', hg: '#7a6a62', hi: 1.15, sc: '#ffc48a', si: 2.0, dir: [30, 9, -6], fog: '#f1c6a6', fogN: 40, fogF: 170, lamps: 0, win: 0, fill: 0.35 },
  preDay:  { top: '#1e9bff', bot: '#ffe0a3', hs: '#e6f6ff', hg: '#b08a4e', hi: 1.5, sc: '#fff1d0', si: 2.8, dir: [-14, 20, 12], fog: '#f6dfb0', fogN: 35, fogF: 150, lamps: 0, win: 0, fill: 0.3 },
  preDusk: { top: '#4a2fa8', bot: '#ff7a3d', hs: '#ffd0b0', hg: '#6a4a5a', hi: 1.15, sc: '#ff9a5a', si: 2.4, dir: [-25, 9, 8], fog: '#e88a6a', fogN: 30, fogF: 130, lamps: 0, win: 0, fill: 0.45 },
  cave:    { top: '#1a0f0a', bot: '#2a1a10', hs: '#7f93c8', hg: '#2a2030', hi: 0.95, sc: '#ffb070', si: 0.45, dir: [4, 8, 6], fog: null, lamps: 0, win: 0, fill: 0.55 },
  indoorNight: { top: '#0b1638', bot: '#1f2f5a', hs: '#6a7cb8', hg: '#2a2430', hi: 0.8, sc: '#8fa8ff', si: 0.8, dir: [-4, 8, 6], fog: null, lamps: 1, win: 1 , fill: 0.75 },
};

// ───────────────────────── materiais partilhados ─────────────────────────
const winMat = new THREE.MeshToonMaterial({ color: '#a9d8ef', gradientMap: gradMap, emissive: '#ffcf70', emissiveIntensity: 0 });
const lampMat = new THREE.MeshBasicMaterial({ color: '#fff3b8' });
const glassMat = new THREE.MeshToonMaterial({ color: '#bfe6f7', gradientMap: gradMap, emissive: '#bfe6f7', emissiveIntensity: 0.25 });
const lampGlowTex = glowTex('rgba(255,225,140,1)');
const lampGlows = [];

// ───────────────────────── cenário: rua ─────────────────────────
const sets = {};
function makeSign(text, w, h, bg = '#c0392b', fg = '#fff') {
  const tex = canvasTex(512, Math.round(512 * h / w), (g, W, H) => {
    g.fillStyle = bg; g.fillRect(0, 0, W, H);
    g.fillStyle = fg; g.font = `900 ${Math.round(H * 0.62)}px Inter, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(text, W / 2, H / 2 + 4);
  });
  return new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex }));
}
function windowAt(parent, x, y, z, w = 1.2, h = 1.05) {
  mk(G.box(w + 0.22, h + 0.22, 0.1), M('#fbfbf4'), { p: [x, y, z], parent, ol: 0.02 });
  mk(G.box(w, h, 0.14), winMat, { p: [x, y, z], parent, ol: 0, cast: false });
  mk(G.box(0.07, h, 0.16), M('#fbfbf4'), { p: [x, y, z], parent, ol: 0 });
}
function house(parent, x, z, w, h, color, o = {}) {
  const d = o.d || 5;
  const g = new THREE.Group();
  g.position.set(x, 0, z); g.rotation.y = z < 0 ? 0 : Math.PI;
  parent.add(g);
  mk(G.box(w, h, d), M(color), { p: [0, h / 2, 0], parent: g, ol: 0.045 });
  const rh = 1.7, sh = new THREE.Shape();
  sh.moveTo(-d / 2 - 0.4, 0); sh.lineTo(d / 2 + 0.4, 0); sh.lineTo(0, rh); sh.closePath();
  const rg = new THREE.ExtrudeGeometry(sh, { depth: w + 0.5, bevelEnabled: false });
  rg.translate(0, 0, -(w + 0.5) / 2); rg.rotateY(Math.PI / 2);
  mk(rg, M(o.roof || '#c8553d'), { p: [0, h, 0], parent: g, ol: 0.045 });
  const dx = o.doorX ?? -w * 0.24;
  mk(G.box(1.1, 2.0, 0.14), M(o.door || '#7a4a2a'), { p: [dx, 1.0, d / 2 + 0.04], parent: g, ol: 0.03 });
  mk(G.sph(0.06, 8, 6), M('#e8c35a'), { p: [dx + 0.35, 1.0, d / 2 + 0.14], parent: g, ol: 0 });
  windowAt(g, w * 0.22, 1.75, d / 2 + 0.03);
  if (h > 4.5) { windowAt(g, -w * 0.22, 4.1, d / 2 + 0.03); windowAt(g, w * 0.22, 4.1, d / 2 + 0.03); }
  if (o.sign) {
    const s = makeSign(o.sign, 3.6, 0.8, o.signBg, o.signFg);
    s.position.set(0, h - 0.6, d / 2 + 0.08); g.add(s);
  }
  if (o.awning) {
    const aw = canvasTex(256, 64, (gg) => { for (let i = 0; i < 8; i++) { gg.fillStyle = i % 2 ? '#fff' : '#e74c3c'; gg.fillRect(i * 32, 0, 32, 64); } });
    const a = mk(G.box(w * 0.8, 0.12, 1.0), new THREE.MeshToonMaterial({ map: aw, gradientMap: gradMap }), { p: [0, 2.65, d / 2 + 0.5], r: [0.25, 0, 0], parent: g, ol: 0.02 });
    a.castShadow = true;
  }
  return g;
}
function tree(parent, x, z, s = 1, seed = 1) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(s); parent.add(g);
  mk(G.cyl(0.18, 0.26, 1.8, 8), M('#7b5234'), { p: [0, 0.9, 0], parent: g, ol: 0.03 });
  const greens = ['#3f9e4a', '#4cb35a', '#358a40'];
  mk(G.ico(1.35, 0), M(greens[seed % 3], { flatShading: true }), { p: [0, 2.6, 0], r: [seed, seed * 2, 0], parent: g, ol: 0.04 });
  mk(G.ico(0.95, 0), M(greens[(seed + 1) % 3], { flatShading: true }), { p: [0.6, 3.3, 0.2], r: [seed * 3, 0, seed], parent: g, ol: 0.035 });
  return g;
}
function lampPost(parent, x, z) {
  const g = new THREE.Group(); g.position.set(x, 0, z); parent.add(g);
  const side = z < 0 ? 1 : -1;
  mk(G.cyl(0.07, 0.09, 4.4, 8), M('#5b6470'), { p: [0, 2.2, 0], parent: g, ol: 0.02 });
  mk(G.box(0.08, 0.08, 1.2), M('#5b6470'), { p: [0, 4.35, side * 0.55], parent: g, ol: 0.02 });
  mk(G.box(0.45, 0.16, 0.5), M('#4a515c'), { p: [0, 4.3, side * 1.1], parent: g, ol: 0.02 });
  mk(G.box(0.34, 0.06, 0.38), lampMat, { p: [0, 4.2, side * 1.1], parent: g, ol: 0, cast: false });
  const gl = sprite(lampGlowTex, 3.2, 0.9); gl.position.set(x, 4.0, z + side * 1.1); parent.add(gl); lampGlows.push(gl);
}
function car(parent, x, z, color, rot = 0) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rot; parent.add(g);
  mk(G.box(3.6, 0.8, 1.7), M(color), { p: [0, 0.75, 0], parent: g, ol: 0.035 });
  mk(G.box(2.0, 0.65, 1.5), M(color), { p: [-0.2, 1.45, 0], parent: g, ol: 0.035 });
  mk(G.box(2.02, 0.45, 1.52), M('#2b3440'), { p: [-0.2, 1.47, 0], parent: g, ol: 0 });
  for (const [wx, wz] of [[1.15, 0.85], [-1.15, 0.85], [1.15, -0.85], [-1.15, -0.85]])
    mk(G.cyl(0.36, 0.36, 0.25, 12), M('#222'), { p: [wx, 0.36, wz], r: [Math.PI / 2, 0, 0], parent: g, ol: 0.02 });
  const lights = [];
  for (const lz of [0.55, -0.55]) {
    lights.push(mk(G.box(0.06, 0.18, 0.3), new THREE.MeshBasicMaterial({ color: '#ffe9a8' }), { p: [1.82, 0.85, lz], parent: g, ol: 0 }));
    lights.push(mk(G.box(0.06, 0.18, 0.3), new THREE.MeshBasicMaterial({ color: '#c0392b' }), { p: [-1.82, 0.85, lz], parent: g, ol: 0 }));
  }
  g.userData.lights = lights;
  return g;
}

const street = new THREE.Group(); sets.street = street; scene.add(street);
const ST = {}; // objetos da rua usados por efeitos
{
  mk(G.box(500, 0.1, 500), M('#86c96b'), { p: [0, -0.05, 0], parent: street, ol: 0, cast: false });
  mk(G.box(170, 0.06, 6), M('#8d929a'), { p: [0, 0.02, 0], parent: street, ol: 0, cast: false });
  for (const sz of [-4.1, 4.1]) {
    mk(G.box(170, 0.12, 2.2), M('#ddd5c4'), { p: [0, 0.06, sz], parent: street, ol: 0, cast: false });
    mk(G.box(170, 0.14, 0.14), M('#b9b1a2'), { p: [0, 0.07, sz > 0 ? 3.0 : -3.0], parent: street, ol: 0, cast: false });
  }
  for (let x = -84; x < 84; x += 4) mk(G.box(1.6, 0.02, 0.14), M('#f4d03f'), { p: [x, 0.06, 0], parent: street, ol: 0, cast: false });

  // casas norte (fachada para +z)
  house(street, -36, -9, 6, 3.4, '#c9b3e6');
  house(street, -27, -9, 6, 5.6, '#a8e0b5', { roof: '#b8483a' });
  house(street, -18, -9, 7, 3.8, '#f5deb3', { sign: 'PADARIA', awning: true, door: '#a0522d', doorX: 2.2 });
  house(street, -9, -9, 6, 3.4, '#f4a7a0');
  house(street, 0, -9, 7, 3.7, '#f2c14e', { door: '#2d6ff0', roof: '#b9472f' });
  house(street, 19, -9, 6, 5.6, '#9fd3e6');
  house(street, 28, -9, 6, 3.4, '#f0a35e');
  house(street, 37, -9, 6, 3.4, '#c9b3e6');
  house(street, -45, -9, 6, 5.6, '#f2c14e');
  house(street, 46, -9, 6, 5.6, '#a8e0b5');
  // casas sul (fachada para -z)
  house(street, -36, 9, 6, 3.4, '#f0a35e');
  house(street, -27, 9, 6, 5.6, '#f2c14e');
  house(street, -18, 9, 6, 3.4, '#9fd3e6');
  house(street, -9, 9, 6, 3.4, '#a8e0b5');
  house(street, 0, 9, 6, 5.6, '#f4a7a0');
  house(street, 10, 9, 5, 3.4, '#b8d98a', { door: '#6d4c41', roof: '#8e3b2e' });
  house(street, 40, 9, 6, 3.4, '#c9b3e6');
  house(street, -45, 9, 6, 3.4, '#a8e0b5');

  // terreno baldio (onde cai o meteoro)
  mk(G.box(7.5, 0.06, 5.6), M('#a87c55'), { p: [10, 0.03, -9.2], parent: street, ol: 0, cast: false });
  for (let i = 0; i < 26; i++) {
    const wx = 10 + (hash(i) - 0.5) * 7, wz = -9.2 + (hash(i + 50) - 0.5) * 5.2;
    mk(new THREE.ConeGeometry(0.12, 0.45, 5), M('#5c9c3c', { flatShading: true }), { p: [wx, 0.22, wz], parent: street, ol: 0.012 });
  }
  const sign = makeSign('TERRENO', 1.4, 0.5, '#f5f0e1', '#333'); sign.position.set(12.6, 1.3, -6.75); street.add(sign);
  mk(G.box(0.08, 1.4, 0.08), M('#7b5234'), { p: [12.6, 0.7, -6.8], parent: street, ol: 0.015 });

  // casa do Seu Juca — janela no lado leste (x = 12.5)
  ST.jucaWin = new THREE.Group(); ST.jucaWin.position.set(12.56, 1.75, 9); street.add(ST.jucaWin);
  mk(G.box(0.1, 1.3, 1.5), M('#fbfbf4'), { parent: ST.jucaWin, ol: 0.02 });
  ST.jucaGlass = mk(G.box(0.14, 1.05, 1.25), glassMat, { parent: ST.jucaWin, ol: 0, cast: false });
  ST.jucaBroken = new THREE.Group(); ST.jucaWin.add(ST.jucaBroken);
  for (let i = 0; i < 4; i++) {
    const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(0.45, 0); sh.lineTo(0, 0.38 + 0.1 * i); sh.closePath();
    const m = new THREE.Mesh(new THREE.ShapeGeometry(sh), new THREE.MeshToonMaterial({ color: '#bfe6f7', gradientMap: gradMap, side: THREE.DoubleSide }));
    m.rotation.y = Math.PI / 2; m.position.set(0.08, i < 2 ? -0.52 : 0.52, i % 2 ? -0.62 : 0.62);
    m.rotation.z = i < 2 ? 0 : Math.PI; if (i % 2) m.scale.x = -1;
    ST.jucaBroken.add(m);
  }
  ST.jucaBoards = new THREE.Group(); ST.jucaWin.add(ST.jucaBoards);
  for (const rz of [0.6, -0.6]) mk(G.box(0.08, 0.2, 1.7), M('#a0703f'), { p: [0.1, 0, 0], r: [rz, 0, 0], parent: ST.jucaBoards, ol: 0.015 });

  // campinho
  mk(G.box(19, 0.05, 13), M('#97d679'), { p: [25, 0.025, 13], parent: street, ol: 0, cast: false });
  for (const [x, z, w, d] of [[25, 6.6, 18.4, 0.1], [25, 19.4, 18.4, 0.1], [15.8, 13, 0.1, 12.8], [34.2, 13, 0.1, 12.8], [25, 13, 0.1, 12.8]])
    mk(G.box(w, 0.02, d), M('#ffffff'), { p: [x, 0.06, z], parent: street, ol: 0, cast: false });
  const gx = 32.6;
  for (const pz of [11.2, 14.8]) mk(G.cyl(0.07, 0.07, 2.1, 10), M('#ffffff'), { p: [gx, 1.05, pz], parent: street, ol: 0.02 });
  mk(G.cyl(0.07, 0.07, 3.75, 10), M('#ffffff'), { p: [gx, 2.1, 13], r: [Math.PI / 2, 0, 0], parent: street, ol: 0.02 });
  const netTex = canvasTex(256, 256, (g) => { g.strokeStyle = 'rgba(255,255,255,0.9)'; g.lineWidth = 3; for (let i = 0; i <= 256; i += 21) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 256); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(256, i); g.stroke(); } });
  const netMat = new THREE.MeshBasicMaterial({ map: netTex, transparent: true, side: THREE.DoubleSide, depthWrite: false });
  ST.net = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.1, 6, 4), netMat); ST.net.rotation.y = -Math.PI / 2; ST.net.position.set(gx + 1.0, 1.05, 13); street.add(ST.net);
  for (const pz of [11.2, 14.8]) { const s = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 2.1), netMat); s.position.set(gx + 0.5, 1.05, pz); street.add(s); }

  // ponto de ônibus
  mk(G.box(3.2, 0.12, 1.3), M('#34495e'), { p: [-5, 2.5, 5.4], parent: street, ol: 0.02 });
  mk(G.box(3.2, 1.9, 0.06), new THREE.MeshToonMaterial({ color: '#9fd3e6', gradientMap: gradMap, transparent: true, opacity: 0.6 }), { p: [-5, 1.3, 6.0], parent: street, ol: 0.015 });
  for (const px of [-6.5, -3.5]) mk(G.box(0.1, 2.5, 0.1), M('#34495e'), { p: [px, 1.25, 5.9], parent: street, ol: 0.015 });
  mk(G.box(2.2, 0.1, 0.45), M('#a0703f'), { p: [-5, 0.55, 5.6], parent: street, ol: 0.015 });
  const bs = makeSign('ÔNIBUS', 1.0, 0.4, '#2d6ff0'); bs.position.set(-7.2, 2.6, 4.2); street.add(bs);
  mk(G.cyl(0.04, 0.04, 2.6, 6), M('#5b6470'), { p: [-7.2, 1.3, 4.25], parent: street, ol: 0.012 });

  // árvores, postes, carros, colinas
  for (const [x, z, s, k] of [[-31.5, -7.6, 1, 1], [-22.5, -7.8, 0.9, 2], [-4.2, -7.6, 0.85, 3], [23.5, -7.6, 1, 5], [32.5, -7.6, 0.9, 6],
    [-31.5, 7.6, 0.9, 7], [-22.5, 7.8, 1, 8], [-4.6, 7.8, 0.8, 9], [5.0, 7.6, 1, 10], [15, 21, 1.2, 11], [30, 22, 1.3, 12], [36.5, 7.6, 1, 13],
    [-40, -16, 1.4, 14], [-20, -16, 1.5, 15], [2, -17, 1.4, 16], [16, -15, 1.6, 17], [34, -16, 1.4, 18], [-30, 16, 1.5, 19], [-8, 17, 1.4, 20], [8, 17, 1.6, 21]])
    (ST.trees ||= []).push(tree(street, x, z, s, k));
  for (const [x, z] of [[-30, -3.4], [-6.3, -3.4], [16, -3.4], [32, -3.4], [-20, 3.4], [6, 3.4], [22, 3.4]]) lampPost(street, x, z);
  ST.car1 = car(street, -28, -1.8, '#e74c3c');
  ST.car2 = car(street, -38, 1.8, '#3498db', Math.PI);
  for (const [x, z, r, c] of [[-70, -70, 30, '#7fbf68'], [10, -90, 40, '#73b35f'], [80, -70, 32, '#7fbf68'], [-80, 70, 30, '#73b35f'], [60, 85, 36, '#7fbf68']])
    mk(G.ico(r, 1), M(c, { flatShading: true }), { p: [x, -r * 0.55, z], parent: street, ol: 0, cast: false });

  // escada (dia 0)
  ST.ladder = new THREE.Group(); ST.ladder.position.set(-16, 0.12, -3.5); ST.ladder.rotation.x = -0.6; street.add(ST.ladder);
  for (const lx of [-0.3, 0.3]) mk(G.box(0.08, 5.2, 0.08), M('#c9a227'), { p: [lx, 2.6, 0], parent: ST.ladder, ol: 0.015 });
  for (let y = 0.4; y < 5; y += 0.45) mk(G.box(0.6, 0.05, 0.06), M('#c9a227'), { p: [0, y, 0], parent: ST.ladder, ol: 0.01 });
}
// ───────────────────────── cenário: pré-história ─────────────────────────
const wild = new THREE.Group(); sets.wild = wild; scene.add(wild);
const WL = {};
{
  mk(G.box(500, 0.1, 500), M('#8ccf4a'), { p: [0, -0.05, 0], parent: wild, ol: 0, cast: false });
  for (let i = 0; i < 40; i++) {
    const x = (hash(i * 1.7) - 0.5) * 120, z = -20 - hash(i * 2.3) * 60;
    mk(G.ico(4 + hash(i) * 6, 0), M(['#7a8a96', '#8c7a6a', '#6f7f8c'][i % 3], { flatShading: true }), { p: [x, 0, z], s: [1, 0.7 + hash(i + 1), 1], parent: wild, ol: 0.05, cast: false });
  }
  for (const [x, z, r, c] of [[-60, -110, 45, '#5b6fa0'], [20, -130, 55, '#6a78a8'], [90, -110, 40, '#5b6fa0']]) mk(new THREE.ConeGeometry(r, r * 1.3, 7), M(c, { flatShading: true }), { p: [x, r * 0.55, z], parent: wild, ol: 0, cast: false });
  for (let i = 0; i < 26; i++) {
    const x = (hash(i * 5.1) - 0.5) * 90, z = (hash(i * 6.7) - 0.5) * 70;
    if (Math.abs(x) < 9 && Math.abs(z) < 9) continue;
    const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(0.9 + hash(i) * 0.8); wild.add(g);
    mk(G.cyl(0.2, 0.3, 1.6, 7), M('#6d4c41'), { p: [0, 0.8, 0], parent: g, ol: 0.03 });
    for (let k = 0; k < 3; k++) mk(new THREE.ConeGeometry(1.4 - k * 0.35, 1.6, 7), M(['#2e8b57', '#3aa86a', '#2a7a4c'][k], { flatShading: true }), { p: [0, 2.0 + k * 0.9, 0], parent: g, ol: 0.03 });
  }
  WL.grass = [];
  for (let i = 0; i < 260; i++) {
    const x = (hash(i * 9.3) - 0.5) * 40, z = (hash(i * 4.9) - 0.5) * 40;
    const gr = mk(new THREE.ConeGeometry(0.12, 0.9 + hash(i) * 0.7, 4), M(['#6fbf3a', '#9bd84a', '#4fa83a'][i % 3], { flatShading: true }), { p: [x, 0.4, z], ol: 0, cast: false, parent: wild });
    gr.userData.h = hash(i + 3); WL.grass.push(gr);
  }
  for (let i = 0; i < 18; i++) mk(G.ico(0.4 + hash(i) * 0.6, 0), M('#9aa5ad', { flatShading: true }), { p: [(hash(i * 8.1) - 0.5) * 30, 0.15, (hash(i * 3.3) - 0.5) * 30], parent: wild, ol: 0.02 });
  // entrada da caverna ao fundo
  mk(G.ico(7, 1), M('#7d7368', { flatShading: true }), { p: [-14, 0, -18], s: [1.4, 0.9, 1], parent: wild, ol: 0.05 });
  mk(G.sph(2.6, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), M('#1a120c'), { p: [-12.5, 0, -12.4], s: [1, 1.1, 0.4], parent: wild, ol: 0 });
}
const cave = new THREE.Group(); sets.cave = cave; scene.add(cave);
{
  mk(G.cyl(9, 9, 0.1, 24), M('#6b5644'), { p: [0, -0.05, 0], parent: cave, ol: 0, cast: false });
  mk(G.ico(9, 1), new THREE.MeshToonMaterial({ color: '#7a6250', gradientMap: gradMap, flatShading: true, side: THREE.BackSide }), { s: [1, 0.55, 1], parent: cave, ol: 0, cast: false });
  const paint = canvasTex(1024, 512, (g, W, H) => {
    g.clearRect(0, 0, W, H); g.fillStyle = 'rgba(150,40,20,0.85)'; g.strokeStyle = 'rgba(150,40,20,0.85)'; g.lineWidth = 10; g.lineCap = 'round';
    for (let i = 0; i < 7; i++) { const x = 80 + i * 60, y = 120 + (i % 2) * 40; g.beginPath(); g.ellipse(x, y, 18, 24, 0, 0, 7); g.fill(); for (let f = 0; f < 5; f++) { g.beginPath(); g.moveTo(x - 12 + f * 6, y - 16); g.lineTo(x - 16 + f * 8, y - 46); g.stroke(); } }
    g.fillStyle = 'rgba(40,25,15,0.85)'; g.beginPath(); g.ellipse(700, 260, 150, 90, 0, 0, 7); g.fill();
    g.fillRect(590, 300, 26, 110); g.fillRect(650, 310, 26, 100); g.fillRect(740, 310, 26, 100); g.fillRect(800, 300, 26, 110);
    g.lineWidth = 16; g.beginPath(); g.moveTo(830, 220); g.quadraticCurveTo(900, 260, 880, 380); g.stroke();
    g.lineWidth = 8; g.strokeStyle = 'rgba(240,230,210,0.9)'; g.beginPath(); g.arc(860, 300, 50, 0.2, 1.8); g.stroke();
    g.strokeStyle = 'rgba(40,25,15,0.85)'; for (let i = 0; i < 4; i++) { const x = 380 + i * 70; g.beginPath(); g.moveTo(x, 470); g.lineTo(x, 400); g.lineTo(x - 18, 430); g.moveTo(x, 400); g.lineTo(x + 18, 430); g.moveTo(x, 440); g.lineTo(x - 15, 480); g.moveTo(x, 440); g.lineTo(x + 15, 480); g.stroke(); g.beginPath(); g.arc(x, 388, 12, 0, 7); g.stroke(); g.beginPath(); g.moveTo(x + 18, 430); g.lineTo(x + 60, 380); g.stroke(); }
  });
  const pm = new THREE.Mesh(new THREE.PlaneGeometry(7, 3.5), new THREE.MeshBasicMaterial({ map: paint, transparent: true, depthWrite: false }));
  pm.position.set(0, 2.2, -6.6); pm.rotation.x = 0.25; cave.add(pm);
  for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2; mk(G.ico(0.4 + hash(i) * 0.5, 0), M('#5d4a3a', { flatShading: true }), { p: [Math.cos(a) * 6.5, 0.2, Math.sin(a) * 6.5], parent: cave, ol: 0.02 }); }
  for (let i = 0; i < 10; i++) mk(new THREE.ConeGeometry(0.25, 1.2 + hash(i), 5), M('#6b5644', { flatShading: true }), { p: [(hash(i * 2.1) - 0.5) * 10, 4.4, (hash(i * 3.7) - 0.5) * 8], r: [Math.PI, 0, 0], parent: cave, ol: 0.015 });
}

const groundY = (set, x, z) => (set === 'street' && Math.abs(z) > 3.0 && Math.abs(z) < 5.2 ? 0.12 : 0);

// ───────────────────────── cenário: cozinha ─────────────────────────
const kitchen = new THREE.Group(); sets.kitchen = kitchen; scene.add(kitchen);
const KT = {};
{
  const tile = canvasTex(256, 256, (g) => { for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { g.fillStyle = (i + j) % 2 ? '#e9f2ef' : '#4fb0a6'; g.fillRect(i * 64, j * 64, 64, 64); } });
  tile.wrapS = tile.wrapT = THREE.RepeatWrapping; tile.repeat.set(5, 4.5);
  mk(G.box(10, 0.1, 9), new THREE.MeshToonMaterial({ map: tile, gradientMap: gradMap }), { p: [0, -0.05, 0.5], parent: kitchen, ol: 0, cast: false });
  mk(G.box(10, 4.2, 0.2), M('#f3d9a4'), { p: [0, 2.1, -3.6], parent: kitchen, ol: 0, cast: false });
  mk(G.box(0.2, 4.2, 9), M('#efcf94'), { p: [-5, 2.1, 0.5], parent: kitchen, ol: 0, cast: false });
  mk(G.box(0.2, 4.2, 9), M('#efcf94'), { p: [5, 2.1, 0.5], parent: kitchen, ol: 0, cast: false });
  mk(G.box(5.2, 0.95, 0.8), M('#f1ebe0'), { p: [-2.3, 0.475, -3.1], parent: kitchen, ol: 0.025 });
  mk(G.box(5.3, 0.08, 0.86), M('#5b6b80'), { p: [-2.3, 0.99, -3.1], parent: kitchen, ol: 0.02 });
  for (let i = 0; i < 4; i++) mk(G.box(1.2, 0.8, 0.04), M('#f8f4ec'), { p: [-4.25 + i * 1.3, 0.48, -2.69], parent: kitchen, ol: 0.012 });
  mk(G.box(4.6, 0.9, 0.5), M('#f8f4ec'), { p: [-2.3, 2.7, -3.25], parent: kitchen, ol: 0.025 });
  mk(G.box(0.9, 0.04, 0.5), M('#9aa4ae'), { p: [-3.0, 1.04, -3.1], parent: kitchen, ol: 0.01 });
  mk(G.cyl(0.03, 0.03, 0.4), M('#c0c6cc'), { p: [-3.0, 1.2, -3.4], parent: kitchen, ol: 0.01 });
  for (let i = 0; i < 6; i++) mk(G.cyl(0.24, 0.2, 0.05, 16), M(i % 2 ? '#ffffff' : '#d6eaf8'), { p: [-1.8 + (i % 2) * 0.03, 1.06 + i * 0.055, -3.0], parent: kitchen, ol: 0.01 });
  for (let i = 0; i < 3; i++) mk(G.cyl(0.09, 0.07, 0.2, 10), M('#e67e22'), { p: [-1.1 + i * 0.25, 1.12, -3.15], parent: kitchen, ol: 0.01 });
  // geladeira com porta articulada
  for (const k of ['fridge', 'table']) { KT[k] = new THREE.Group(); kitchen.add(KT[k]); }
  mk(G.box(1.1, 2.1, 0.9), M('#dfe7ee'), { p: [2.6, 1.05, -3.0], parent: KT.fridge, ol: 0.03 });
  mk(G.box(0.95, 1.9, 0.05), M('#f6f2e8'), { p: [2.6, 1.05, -2.56], parent: kitchen, ol: 0, cast: false });
  for (let i = 0; i < 3; i++) mk(G.box(0.9, 0.03, 0.6), M('#c8d6e0'), { p: [2.6, 0.5 + i * 0.5, -2.8], parent: kitchen, ol: 0 });
  for (let i = 0; i < 4; i++) mk(G.cyl(0.07, 0.06, 0.14, 10), M(i % 2 ? '#ff7aa8' : '#f9e79f'), { p: [2.3 + i * 0.2, 1.1, -2.75], parent: kitchen, ol: 0.008 });
  KT.door = new THREE.Group(); KT.door.position.set(3.15, 1.05, -2.53); KT.fridge.add(KT.door);
  KT.doorMesh = mk(G.box(1.1, 2.06, 0.1), M('#e8eef3'), { p: [-0.55, 0, 0.05], parent: KT.door, ol: 0.03 });
  mk(G.box(0.06, 0.6, 0.08), M('#9aa4ae'), { p: [-0.98, 0.25, 0.13], parent: KT.door, ol: 0.01 });
  // janela, mesa, relógio
  mk(G.box(0.12, 1.3, 1.6), M('#fbfbf4'), { p: [-4.88, 2.1, -0.5], parent: kitchen, ol: 0.02 });
  mk(G.box(0.14, 1.05, 1.35), M('#9fd8f5', { emissive: '#9fd8f5', emissiveIntensity: 0.5 }), { p: [-4.86, 2.1, -0.5], parent: kitchen, ol: 0 });
  mk(G.cyl(0.9, 0.9, 0.08, 24), M('#c98b55'), { p: [-2.9, 0.8, 1.8], parent: KT.table, ol: 0.025 });
  mk(G.cyl(0.08, 0.12, 0.8, 8), M('#8d5a32'), { p: [-2.9, 0.4, 1.8], parent: KT.table, ol: 0.015 });
  for (let i = 0; i < 3; i++) mk(G.sph(0.11, 10, 8), M(['#e74c3c', '#f1c40f', '#e67e22'][i]), { p: [-3.0 + i * 0.18, 0.93, 1.75], parent: KT.table, ol: 0.01 });
  mk(G.cyl(0.38, 0.38, 0.06, 24), M('#ffffff'), { p: [0.9, 2.85, -3.47], r: [Math.PI / 2, 0, 0], parent: kitchen, ol: 0.02 });
  mk(G.box(0.03, 0.22, 0.02), M('#222'), { p: [0.9, 2.93, -3.42], parent: kitchen, ol: 0 });
  mk(G.box(0.16, 0.03, 0.02), M('#222'), { p: [0.97, 2.85, -3.42], parent: kitchen, ol: 0 });
}

// ───────────────────────── cenário: quarto ─────────────────────────
const bedroom = new THREE.Group(); sets.bedroom = bedroom; scene.add(bedroom);
const BR = {};
{
  const wood = canvasTex(256, 256, (g) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#c99566' : '#bd895a'; g.fillRect(0, i * 32, 256, 32); g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(0, i * 32, 256, 2); } });
  wood.wrapS = wood.wrapT = THREE.RepeatWrapping; wood.repeat.set(3, 3);
  mk(G.box(8, 0.1, 9), new THREE.MeshToonMaterial({ map: wood, gradientMap: gradMap }), { p: [0, -0.05, 0.5], parent: bedroom, ol: 0, cast: false });
  mk(G.box(8, 4, 0.2), M('#7da7d9'), { p: [0, 2, -3.6], parent: bedroom, ol: 0, cast: false });
  mk(G.box(0.2, 4, 9), M('#6f9bd0'), { p: [-3.9, 2, 0.5], parent: bedroom, ol: 0, cast: false });
  mk(G.box(0.2, 4, 9), M('#6f9bd0'), { p: [3.9, 2, 0.5], parent: bedroom, ol: 0, cast: false });
  for (const k of ['bed', 'alarm', 'desk', 'lamp']) { BR[k] = new THREE.Group(); bedroom.add(BR[k]); }
  mk(G.box(1.7, 0.38, 2.75), M('#8d5a32'), { p: [-2, 0.24, -2.0], parent: BR.bed, ol: 0.025 });
  mk(G.box(1.55, 0.2, 2.6), M('#f6f6f6'), { p: [-2, 0.52, -2.0], parent: BR.bed, ol: 0.02 });
  mk(G.box(1.62, 0.1, 1.6), M('#e67e22'), { p: [-2, 0.64, -1.35], parent: BR.bed, ol: 0.02 });
  mk(G.box(0.9, 0.18, 0.45), M('#ffffff'), { p: [-2, 0.7, -3.05], parent: BR.bed, ol: 0.015 });
  mk(G.box(1.75, 1.15, 0.12), M('#8d5a32'), { p: [-2, 0.75, -3.4], parent: BR.bed, ol: 0.025 });
  mk(G.box(0.6, 0.6, 0.5), M('#a8744a'), { p: [-0.75, 0.3, -3.1], parent: bedroom, ol: 0.02 });
  BR.digital = canvasTex(256, 128, () => {});
  BR.digitalMesh = mk(G.box(0.4, 0.2, 0.15), new THREE.MeshBasicMaterial({ map: BR.digital }), { p: [-0.75, 0.71, -3.0], parent: BR.alarm, ol: 0.01 });
  // relógio de parede
  BR.clock = new THREE.Group(); BR.clock.position.set(1, 2.4, -3.47); bedroom.add(BR.clock);
  mk(G.cyl(0.48, 0.48, 0.07, 32), M('#fdfdf6'), { r: [Math.PI / 2, 0, 0], parent: BR.clock, ol: 0.035 });
  for (let i = 0; i < 12; i++) mk(G.box(0.03, 0.08, 0.02), M('#333'), { p: [Math.sin(i * Math.PI / 6) * 0.39, Math.cos(i * Math.PI / 6) * 0.39, 0.045], r: [0, 0, -i * Math.PI / 6], parent: BR.clock, ol: 0 });
  BR.hourHand = new THREE.Group(); BR.minHand = new THREE.Group(); BR.hourHand.position.z = BR.minHand.position.z = 0.06;
  mk(G.box(0.045, 0.24, 0.02), M('#222'), { p: [0, 0.11, 0], parent: BR.hourHand, ol: 0 });
  mk(G.box(0.03, 0.36, 0.02), M('#c0392b'), { p: [0, 0.17, 0.01], parent: BR.minHand, ol: 0 });
  BR.clock.add(BR.hourHand, BR.minHand);
  // janela
  mk(G.box(1.5, 1.3, 0.1), M('#fbfbf4'), { p: [2.3, 2.1, -3.47], parent: bedroom, ol: 0.02 });
  BR.glass = new THREE.MeshBasicMaterial({ color: '#16264f' });
  mk(G.box(1.3, 1.1, 0.12), BR.glass, { p: [2.3, 2.1, -3.47], parent: bedroom, ol: 0 });
  BR.moon = mk(G.cyl(0.15, 0.15, 0.02, 20), new THREE.MeshBasicMaterial({ color: '#fff7d1' }), { p: [2.6, 2.35, -3.39], r: [Math.PI / 2, 0, 0], parent: bedroom, ol: 0 });
  mk(G.box(0.07, 1.1, 0.14), M('#fbfbf4'), { p: [2.3, 2.1, -3.45], parent: bedroom, ol: 0 });
  // mesa, pôster, tapete
  mk(G.box(1.5, 0.08, 0.7), M('#d4a373'), { p: [2.4, 0.8, -3.0], parent: BR.desk, ol: 0.02 });
  for (const lx of [1.75, 3.05]) mk(G.box(0.08, 0.8, 0.6), M('#b5835a'), { p: [lx, 0.4, -3.0], parent: BR.desk, ol: 0.015 });
  mk(new THREE.SphereGeometry(0.2, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), M('#ffe9a8'), { p: [3.0, 1.3, -3.1], parent: BR.lamp, ol: 0.012 });
  mk(G.cyl(0.06, 0.12, 0.45, 8), M('#2d6ff0'), { p: [3.0, 1.05, -3.1], parent: BR.lamp, ol: 0.012 });
  const poster = canvasTex(256, 360, (g, W, H) => { g.fillStyle = '#2d6ff0'; g.fillRect(0, 0, W, H); g.fillStyle = '#ffd23f'; g.font = '900 90px Inter'; g.textAlign = 'center'; g.fillText('GOL!', W / 2, 140); g.beginPath(); g.arc(W / 2, 250, 60, 0, 7); g.fillStyle = '#fff'; g.fill(); });
  const p = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.25), new THREE.MeshToonMaterial({ map: poster, gradientMap: gradMap }));
  p.position.set(-3.78, 2.2, 0.4); p.rotation.y = Math.PI / 2; bedroom.add(p);
  mk(G.cyl(1.2, 1.2, 0.02, 32), M('#e84a5f'), { p: [0.4, 0.01, 0.2], parent: bedroom, ol: 0, cast: false });
}

// ───────────────────────── cenário: sala de aula ─────────────────────────
const classroom = new THREE.Group(); sets.classroom = classroom; scene.add(classroom);
const CL = {};
{
  mk(G.box(14, 0.1, 13), M('#cfc6b6'), { p: [0, -0.05, 0], parent: classroom, ol: 0, cast: false });
  mk(G.box(14, 4.4, 0.2), M('#ebe1c6'), { p: [0, 2.2, -5.1], parent: classroom, ol: 0, cast: false });
  mk(G.box(0.2, 4.4, 13), M('#e3d7b8'), { p: [-6.1, 2.2, 0], parent: classroom, ol: 0, cast: false });
  mk(G.box(0.2, 4.4, 13), M('#e3d7b8'), { p: [6.1, 2.2, 0], parent: classroom, ol: 0, cast: false });
  for (const wz of [-2.5, 1.5]) {
    mk(G.box(0.12, 1.6, 2.2), M('#fbfbf4'), { p: [-6.0, 2.3, wz], parent: classroom, ol: 0.02 });
    mk(G.box(0.14, 1.35, 1.95), M('#9fd8f5', { emissive: '#9fd8f5', emissiveIntensity: 0.5 }), { p: [-5.98, 2.3, wz], parent: classroom, ol: 0 });
  }
  CL.board = canvasTex(1024, 340, () => {});
  mk(G.box(6.4, 2.3, 0.12), M('#6b4a2e'), { p: [0, 2.3, -4.97], parent: classroom, ol: 0.03 });
  CL.boardMesh = new THREE.Mesh(new THREE.PlaneGeometry(6.1, 2.05), new THREE.MeshToonMaterial({ map: CL.board, gradientMap: gradMap }));
  CL.boardMesh.position.set(0, 2.3, -4.9); classroom.add(CL.boardMesh);
  mk(G.box(1.8, 0.9, 0.8), M('#a0703f'), { p: [2.8, 0.45, -3.9], parent: classroom, ol: 0.025 });
  mk(G.sph(0.14, 10, 8), M('#e74c3c'), { p: [3.2, 1.03, -3.9], parent: classroom, ol: 0.012 });
  const desk = (x, z) => {
    mk(G.box(1.15, 0.06, 0.7), M('#d4a373'), { p: [x, 0.78, z - 0.72], parent: classroom, ol: 0.018 });
    for (const [dx, dz] of [[-0.5, -0.3], [0.5, -0.3], [-0.5, 0.3], [0.5, 0.3]]) mk(G.box(0.05, 0.76, 0.05), M('#7f8c8d'), { p: [x + dx, 0.38, z - 0.72 + dz], parent: classroom, ol: 0 });
    mk(G.box(0.62, 0.06, 0.6), M('#2980b9'), { p: [x, 0.44, z + 0.05], parent: classroom, ol: 0.015 });
    mk(G.box(0.62, 0.6, 0.06), M('#2980b9'), { p: [x, 0.78, z + 0.37], parent: classroom, ol: 0.015 });
    for (const [dx, dz] of [[-0.26, -0.2], [0.26, -0.2], [-0.26, 0.3], [0.26, 0.3]]) mk(G.box(0.04, 0.44, 0.04), M('#7f8c8d'), { p: [x + dx, 0.22, z + dz], parent: classroom, ol: 0 });
  };
  for (const [x, z] of [[0, 1.5], [-2.5, -0.8], [2.5, -0.8], [-2.5, 1.5], [2.5, 1.5], [-2.5, 3.8], [0, 3.8], [2.5, 3.8]]) desk(x, z);
  CL.paper = new THREE.Group(); classroom.add(CL.paper);
  const paperTex = canvasTex(128, 170, (g, W, H) => { g.fillStyle = '#fff'; g.fillRect(0, 0, W, H); g.fillStyle = '#c0392b'; g.font = '900 22px Inter'; g.fillText('PROVA', 10, 28); g.fillStyle = '#9aa'; for (let y = 50; y < H; y += 16) g.fillRect(10, y, W - 20, 3); });
  mk(G.box(0.34, 0.01, 0.46), new THREE.MeshToonMaterial({ map: paperTex, gradientMap: gradMap }), { parent: CL.paper, ol: 0.008 });
}
function drawBoard(text) {
  const { g, c } = CL.board.userData;
  g.fillStyle = '#2f5d46'; g.fillRect(0, 0, c.width, c.height);
  g.fillStyle = 'rgba(255,255,255,0.08)'; for (let i = 0; i < 30; i++) g.fillRect(hash(i) * 1000, hash(i + 9) * 330, 120, 4);
  g.fillStyle = '#f6f6ee'; g.font = '800 78px Inter'; g.textAlign = 'center'; g.textBaseline = 'middle';
  const txt = text || '2 + 2 = 4';
  let fs = 78; g.font = `800 ${fs}px Inter`;
  while (g.measureText(txt).width > c.width * 0.9 && fs > 30) { fs -= 4; g.font = `800 ${fs}px Inter`; }
  g.fillText(txt, c.width / 2, c.height / 2 - 20);
  g.font = '600 40px Inter'; const sub = !text ? 'x² + y² = r²' : text === 'PROVA SURPRESA' ? '(boa sorte)' : '';
  if (sub) g.fillText(sub, c.width / 2, c.height / 2 + 80);
  CL.board.needsUpdate = true;
}

// ───────────────────────── ouro ─────────────────────────
const GOLD = new THREE.MeshPhongMaterial({ color: '#f2bd2c', specular: '#fff3b0', shininess: 90, emissive: '#6b4700', emissiveIntensity: 0.55 });
const goldables = {};
function regGold(name, ...objs) {
  goldables[name] = objs;
  for (const obj of objs) obj.traverse((o) => { if (o.isMesh && o.material !== OUTLINE && o.material !== GOLD) o.userData.mat0 = o.material; });
}
function setGold(name, on) {
  for (const obj of goldables[name] || []) obj.traverse((o) => { if (o.userData.mat0) o.material = on ? GOLD : o.userData.mat0; });
}

// ───────────────────────── personagens ─────────────────────────
const CHARS = {
  zinho: { skin: '#5b3a26', shirt: '#2d6ff0', jacket: '#18181c', pants: '#2c3550', shoes: '#f4f4f4', hair: 'short', hairColor: '#121212' },
  mae:   { skin: '#4a2e1f', shirt: '#f2b632', dress: '#f2b632', pants: '#4a2e1f', shoes: '#8a3b2a', hair: 'wrap', hairColor: '#d9542a', earrings: true },
  beto:  { skin: '#c08a5c', shirt: '#7b4bc4', pants: '#3a3a40', shoes: '#e74c3c', hair: 'messy', hairColor: '#3b2414', glasses: '#222' },
  lia:   { skin: '#f1c9a5', shirt: '#ff7aa8', pants: '#2f4f8f', shoes: '#ffffff', hair: 'ponytail', hairColor: '#5a3420' },
  juca:  { skin: '#d8a47f', shirt: '#ece4cf', vest: '#4d6b4a', pants: '#6b5444', shoes: '#3b2a1e', hair: 'old', hairColor: '#f2f2f2', hat: '#6c6c6c', mustache: true, cane: true, hunch: 0.14, scale: 0.94 },
  prof:  { skin: '#8d5a3c', shirt: '#2aa198', dress: '#2aa198', pants: '#8d5a3c', shoes: '#34495e', hair: 'bob', hairColor: '#2b1a10', glasses: '#d23c3c' },
  kid1:  { skin: '#a8704a', shirt: '#f39c12', pants: '#34495e', shoes: '#ecf0f1', hair: 'afro', hairColor: '#1a1a1a', scale: 0.92 },
  kid2:  { skin: '#e8b98f', shirt: '#27ae60', pants: '#2c3e50', shoes: '#ecf0f1', hair: 'ponytail', hairColor: '#e0b44a', scale: 0.92 },
  // tribo de neandertais (Short da caçada)
  ugo:   { skin: '#b9825a', shirt: '#9a6a3a', tunic: '#9a6a3a', pants: '#b9825a', shoes: '#6d4c41', hair: 'cave', hairColor: '#3b2414', beard: '#3b2414', unibrow: true, scale: 1.08 },
  kika:  { skin: '#c68e62', shirt: '#b5793f', tunic: '#b5793f', pants: '#c68e62', shoes: '#6d4c41', hair: 'cavebun', hairColor: '#4a2c1a', scale: 0.98 },
  neo:   { skin: '#a8714c', shirt: '#7f5a36', tunic: '#7f5a36', pants: '#a8714c', shoes: '#5d4037', hair: 'cave', hairColor: '#24160d', beard: '#24160d', unibrow: true, scale: 0.94 },
};
const HEAD_R = 0.46;
function onHead(head, obj, dir, r = HEAD_R) {
  const v = V(...dir).normalize();
  obj.position.copy(v.multiplyScalar(r));
  obj.lookAt(obj.position.clone().multiplyScalar(2));
  head.add(obj);
  return obj;
}
function makeChar(name, cfg, seed) {
  const root = new THREE.Group(); root.name = name;
  const body = new THREE.Group(); root.add(body); body.scale.setScalar(cfg.scale || 1);
  const hips = new THREE.Group(); hips.position.y = 0.5; body.add(hips);
  const legs = [-1, 1].map((sd) => {
    const p = new THREE.Group(); p.position.set(sd * 0.13, 0.02, 0); hips.add(p);
    mk(G.cyl(0.095, 0.085, 0.42, 10), M(cfg.pants), { p: [0, -0.21, 0], parent: p, ol: 0.02 });
    const shoe = G.sph(1, 12, 8); shoe.scale(0.11, 0.08, 0.17);
    mk(shoe, M(cfg.shoes), { p: [0, -0.44, 0.04], parent: p, ol: 0.02 });
    return p;
  });
  const torso = new THREE.Group(); hips.add(torso);
  if (cfg.jacket) {
    mk(G.cap(0.27, 0.26), new THREE.MeshPhongMaterial({ color: cfg.jacket, shininess: 70, specular: '#555a66' }), { p: [0, 0.38, 0], parent: torso, ol: 0.025 });
    mk(new THREE.CylinderGeometry(0.274, 0.274, 0.42, 18, 1, true, -0.42, 0.84), M(cfg.shirt, { side: THREE.DoubleSide }), { p: [0, 0.4, 0], parent: torso, ol: 0 });
    mk(new THREE.TorusGeometry(0.17, 0.05, 6, 16), new THREE.MeshPhongMaterial({ color: cfg.jacket, shininess: 70 }), { p: [0, 0.68, 0], r: [Math.PI / 2, 0, 0], parent: torso, ol: 0.012 });
    for (const sx of [-0.1, 0.1]) mk(G.box(0.025, 0.4, 0.02), M('#9aa0a8'), { p: [sx * 1.15, 0.4, 0.262], parent: torso, ol: 0 });
  } else {
    mk(G.cap(0.27, 0.26), M(cfg.shirt), { p: [0, 0.38, 0], parent: torso, ol: 0.025 });
  }
  if (cfg.vest) mk(new THREE.CylinderGeometry(0.278, 0.29, 0.42, 18, 1, true, 0.5, 2 * Math.PI - 1.0), M(cfg.vest, { side: THREE.DoubleSide }), { p: [0, 0.38, 0], parent: torso, ol: 0 });
  if (cfg.dress) mk(G.cyl(0.27, 0.42, 0.5, 16), M(cfg.dress), { p: [0, 0.02, 0], parent: torso, ol: 0.025 });
  if (cfg.tunic) {
    // túnica de pele com manchas
    const fur = canvasTex(256, 256, (g) => { g.fillStyle = cfg.tunic; g.fillRect(0, 0, 256, 256); g.fillStyle = 'rgba(60,35,15,0.55)'; for (let i = 0; i < 26; i++) { g.beginPath(); g.ellipse(hash(i + seed) * 256, hash(i * 3 + seed) * 256, 10 + hash(i) * 10, 7 + hash(i + 2) * 6, hash(i) * 3, 0, 7); g.fill(); } });
    const fm = new THREE.MeshToonMaterial({ map: fur, gradientMap: gradMap });
    mk(G.cyl(0.29, 0.36, 0.5, 9), fm, { p: [0, 0.12, 0], parent: torso, ol: 0.022 });
    mk(G.box(0.12, 0.62, 0.08), fm, { p: [0.12, 0.5, 0.22], r: [0, 0, -0.6], parent: torso, ol: 0.012 });
  }
  const sleeve = cfg.jacket ? new THREE.MeshPhongMaterial({ color: cfg.jacket, shininess: 70, specular: '#555a66' }) : M(cfg.vest ? cfg.shirt : cfg.shirt);
  const arms = [-1, 1].map((sd) => {
    const p = new THREE.Group(); p.position.set(sd * 0.3, 0.6, 0); torso.add(p);
    mk(G.cyl(0.072, 0.066, 0.4, 10), sleeve, { p: [0, -0.2, 0], parent: p, ol: 0.02 });
    const hand = new THREE.Group(); hand.position.y = -0.43; p.add(hand);
    mk(G.sph(0.085, 12, 10), M(cfg.skin), { parent: hand, ol: 0.018 });
    return { pivot: p, hand };
  });
  // cabeça
  const head = new THREE.Group(); head.position.set(0, 1.05, 0); torso.add(head);
  mk(G.sph(HEAD_R, 28, 20), M(cfg.skin), { parent: head, ol: 0.028 });
  for (const sd of [-1, 1]) mk(G.sph(0.085, 10, 8), M(cfg.skin), { p: [sd * 0.45, -0.02, 0], s: [0.6, 1, 1], parent: head, ol: 0.015 });
  const face = {};
  const eyeGeo = G.sph(1, 14, 10), hlGeo = G.sph(1, 8, 6);
  for (const [k, sd] of [['L', -1], ['R', 1]]) {
    const piv = onHead(head, new THREE.Group(), [sd * 0.33, 0.1, 0.94], HEAD_R - 0.01);
    const eye = new THREE.Mesh(eyeGeo, new THREE.MeshBasicMaterial({ color: '#141418' })); eye.scale.set(0.072, 0.1, 0.04);
    const hl = new THREE.Mesh(hlGeo, new THREE.MeshBasicMaterial({ color: '#ffffff' })); hl.scale.set(0.022, 0.026, 0.01); hl.position.set(-0.022, 0.035, 0.035);
    piv.add(eye); piv.add(hl);
    face['eye' + k] = eye; face['hl' + k] = hl;
    const bp = onHead(head, new THREE.Group(), [sd * 0.34, 0.37, 0.87], HEAD_R + 0.005);
    const brow = new THREE.Mesh(G.box(0.15, 0.032, 0.03), new THREE.MeshBasicMaterial({ color: cfg.hair === 'old' ? '#dddddd' : '#1a1410' }));
    bp.add(brow); face['brow' + k] = brow; face['bp' + k] = bp;
  }
  const mp = onHead(head, new THREE.Group(), [0, -0.33, 0.94], HEAD_R - 0.005);
  const lineMat = new THREE.MeshBasicMaterial({ color: '#1b1214' });
  face.smile = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.017, 6, 18, Math.PI), lineMat); face.smile.rotation.z = Math.PI; face.smile.position.y = 0.05;
  face.frown = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.017, 6, 18, Math.PI), lineMat); face.frown.position.y = -0.04;
  face.line = new THREE.Mesh(G.box(0.14, 0.026, 0.02), lineMat);
  face.open = new THREE.Group();
  const om = new THREE.Mesh(G.sph(1, 16, 10), new THREE.MeshBasicMaterial({ color: '#3a0d12' })); om.scale.set(0.1, 0.1, 0.03); face.open.add(om);
  const tongue = new THREE.Mesh(G.sph(1, 12, 8), new THREE.MeshBasicMaterial({ color: '#e0626e' })); tongue.scale.set(0.06, 0.035, 0.02); tongue.position.set(0, -0.05, 0.012); face.open.add(tongue);
  face.openInner = om; face.tongue = tongue;
  mp.add(face.smile, face.frown, face.line, face.open);
  face.tear = onHead(head, new THREE.Group(), [0.36, -0.08, 0.93], HEAD_R + 0.015);
  { const tm = new THREE.Mesh(G.sph(1, 10, 8), new THREE.MeshBasicMaterial({ color: '#8fd3ff' })); tm.scale.set(0.03, 0.05, 0.02); face.tear.add(tm); }
  face.sweat = onHead(head, new THREE.Group(), [0.72, 0.42, 0.55], HEAD_R + 0.02);
  const sw = new THREE.Mesh(G.sph(1, 10, 8), new THREE.MeshBasicMaterial({ color: '#8fd3ff' })); sw.scale.set(0.045, 0.07, 0.03); face.sweat.add(sw);
  if (cfg.beard) { const bg = G.ico(0.3, 1); bg.scale(1.05, 0.75, 0.55); mk(bg, M(cfg.beard, { flatShading: true }), { p: [0, -0.3, 0.2], parent: head, ol: 0.018 }); }
  if (cfg.unibrow) { face.browL.scale.x = 1.5; face.browR.scale.x = 1.5; face.browL.scale.y = face.browR.scale.y = 1.6; }
  // rubor nas bochechas (só nos planos com estilo 2)
  face.blush = [-1, 1].map((sd) => { const b = new THREE.Mesh(G.sph(1, 12, 8), new THREE.MeshBasicMaterial({ color: '#ff6f7d', transparent: true, opacity: 0.45 })); b.scale.set(0.08, 0.045, 0.02); onHead(head, new THREE.Group(), [sd * 0.5, -0.16, 0.85], HEAD_R + 0.005).add(b); return b; });
  if (cfg.mustache) for (const sd of [-1, 1]) {
    const m = new THREE.Mesh(G.sph(1, 10, 8), M('#f4f4f4')); m.scale.set(0.11, 0.05, 0.05); m.rotation.z = sd * 0.25;
    onHead(head, new THREE.Group(), [sd * 0.12, -0.18, 0.97], HEAD_R + 0.01).add(m);
  }
  if (cfg.glasses) {
    const gm = new THREE.MeshBasicMaterial({ color: cfg.glasses });
    for (const sd of [-1, 1]) onHead(head, new THREE.Group(), [sd * 0.33, 0.1, 0.94], HEAD_R + 0.04).add(new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.018, 6, 20), gm));
    onHead(head, new THREE.Group(), [0, 0.13, 0.99], HEAD_R + 0.05).add(new THREE.Mesh(G.box(0.14, 0.02, 0.02), gm));
  }
  if (cfg.earrings) for (const sd of [-1, 1]) mk(new THREE.TorusGeometry(0.05, 0.012, 6, 12), M('#f1c40f'), { p: [sd * 0.46, -0.16, 0.02], r: [0, Math.PI / 2, 0], parent: head, ol: 0 });
  // cabelos
  const hm = M(cfg.hairColor, { flatShading: true });
  const capGeo = (r, tl, ps = 0, pl = Math.PI * 2, ts = 0) => new THREE.SphereGeometry(r, 18, 10, ps, pl, ts, tl);
  switch (cfg.hair) {
    case 'short':
      mk(capGeo(HEAD_R * 1.045, 1.05), hm, { r: [-0.28, 0, 0], parent: head, ol: 0.02 });
      for (let i = 0; i < 9; i++) mk(G.ico(0.09, 0), hm, { p: [Math.sin(i * 0.7) * 0.22, 0.42, Math.cos(i * 1.3) * 0.2 - 0.05], parent: head, ol: 0 });
      break;
    case 'wrap':
      mk(capGeo(HEAD_R * 1.07, 1.25), M(cfg.hairColor), { r: [-0.3, 0, 0], parent: head, ol: 0.022 });
      mk(G.sph(0.2, 12, 10), M(cfg.hairColor), { p: [0, 0.48, -0.2], parent: head, ol: 0.02 });
      mk(new THREE.TorusGeometry(HEAD_R * 1.03, 0.045, 6, 28), M('#f4d03f'), { p: [0, 0.2, -0.04], r: [Math.PI / 2 - 0.35, 0, 0], parent: head, ol: 0 });
      break;
    case 'messy':
      mk(capGeo(HEAD_R * 1.05, 1.15), hm, { r: [-0.25, 0, 0], parent: head, ol: 0.02 });
      for (let i = 0; i < 7; i++) mk(new THREE.ConeGeometry(0.1, 0.22, 5), hm, { p: [(i - 3) * 0.1, 0.46 + hash(i) * 0.04, 0.1 - hash(i + 4) * 0.25], r: [-0.4 + hash(i) * 0.3, 0, (i - 3) * 0.15], parent: head, ol: 0.012 });
      break;
    case 'ponytail':
      mk(capGeo(HEAD_R * 1.05, 1.3), hm, { r: [-0.35, 0, 0], parent: head, ol: 0.02 });
      { const pt = G.sph(1, 12, 10); pt.scale(0.15, 0.32, 0.15); mk(pt, hm, { p: [0, 0.05, -0.55], r: [-0.5, 0, 0], parent: head, ol: 0.02 }); }
      mk(new THREE.TorusGeometry(0.08, 0.03, 6, 12), M('#ff4d6d'), { p: [0, 0.27, -0.43], r: [1.0, 0, 0], parent: head, ol: 0 });
      break;
    case 'bob':
      mk(capGeo(HEAD_R * 1.07, 1.75, Math.PI / 2 + 0.95, Math.PI * 2 - 1.9), hm, { parent: head, ol: 0.02 });
      mk(capGeo(HEAD_R * 1.06, 0.75), hm, { r: [-0.15, 0, 0], parent: head, ol: 0 });
      break;
    case 'cave': case 'cavebun':
      mk(G.ico(HEAD_R * 1.1, 1), hm, { p: [0, 0.16, -0.1], s: [1.05, 0.8, 1], parent: head, ol: 0.02 });
      for (let i = 0; i < 6; i++) mk(G.ico(0.13, 0), hm, { p: [Math.sin(i * 1.1) * 0.36, 0.38 + hash(i) * 0.1, Math.cos(i * 1.1) * 0.25 - 0.12], parent: head, ol: 0.01 });
      if (cfg.hair === 'cavebun') mk(G.ico(0.2, 1), hm, { p: [0, 0.52, -0.25], parent: head, ol: 0.015 });
      break;
    case 'afro':
      mk(G.ico(HEAD_R * 1.12, 1), hm, { p: [0, 0.2, -0.08], s: [1, 0.85, 1], parent: head, ol: 0.02 });
      break;
    case 'old':
      mk(new THREE.SphereGeometry(HEAD_R * 1.04, 18, 6, Math.PI, Math.PI, 1.25, 0.6), M(cfg.hairColor), { parent: head, ol: 0.015 });
      if (cfg.hat) {
        mk(G.cyl(HEAD_R * 0.98, HEAD_R * 1.02, 0.22, 20), M(cfg.hat), { p: [0, 0.36, -0.02], r: [-0.12, 0, 0], parent: head, ol: 0.02 });
        mk(G.box(0.55, 0.04, 0.3), M(cfg.hat), { p: [0, 0.3, 0.42], r: [0.1, 0, 0], parent: head, ol: 0.015 });
      }
      break;
  }
  // adereços
  const props = {};
  if (cfg.cane) {
    props.cane = new THREE.Group(); arms[1].hand.add(props.cane);
    mk(G.cyl(0.03, 0.03, 0.95, 8), M('#6d4c41'), { p: [0, -0.42, 0.06], parent: props.cane, ol: 0.012 });
    mk(new THREE.TorusGeometry(0.07, 0.03, 6, 10, Math.PI), M('#6d4c41'), { p: [0, 0.04, 0.0], r: [0, Math.PI / 2, 0], parent: props.cane, ol: 0.01 });
  }
  props.bread = new THREE.Group(); arms[0].hand.add(props.bread);
  mk(G.box(0.26, 0.3, 0.16), M('#d9b07a'), { p: [0, -0.18, 0.04], parent: props.bread, ol: 0.012 });
  for (const bx of [-0.05, 0.05]) mk(G.cap(0.04, 0.22), M('#c98b3a'), { p: [bx, 0.03, 0.04], r: [0, 0, bx * 3], parent: props.bread, ol: 0.01 });
  props.notebook = new THREE.Group(); arms[1].hand.add(props.notebook);
  mk(G.box(0.36, 0.46, 0.04), M('#3498db'), { p: [-0.16, 0.05, 0.1], r: [0.3, 0, 0], parent: props.notebook, ol: 0.012 });
  props.phone = new THREE.Group(); arms[1].hand.add(props.phone);
  mk(G.box(0.1, 0.18, 0.02), M('#1d1d1d'), { p: [0, 0.06, 0.08], r: [0.4, 0, 0], parent: props.phone, ol: 0.008 });
  props.sandwich = new THREE.Group(); arms[1].hand.add(props.sandwich);
  mk(G.box(0.22, 0.09, 0.16), M('#e0a458'), { p: [0, 0.07, 0.1], parent: props.sandwich, ol: 0.01 });
  mk(G.box(0.24, 0.03, 0.18), M('#7cb342'), { p: [0, 0.07, 0.1], parent: props.sandwich, ol: 0 });
  props.cup = new THREE.Group(); arms[1].hand.add(props.cup);
  mk(G.cyl(0.07, 0.055, 0.18, 12), new THREE.MeshToonMaterial({ color: '#bfe6f7', gradientMap: gradMap, transparent: true, opacity: 0.75 }), { p: [0, 0.1, 0.08], parent: props.cup, ol: 0.008 });
  props.goldbar = new THREE.Group(); arms[1].hand.add(props.goldbar);
  mk(G.box(0.3, 0.1, 0.14), GOLD, { p: [-0.12, 0.08, 0.1], parent: props.goldbar, ol: 0.01 });
  props.spear = new THREE.Group(); arms[1].hand.add(props.spear);
  mk(G.cyl(0.025, 0.03, 1.9, 6), M('#8d6e4a'), { p: [0, 0.35, 0.04], parent: props.spear, ol: 0.01 });
  mk(new THREE.ConeGeometry(0.06, 0.22, 4), M('#7b8794', { flatShading: true }), { p: [0, 1.38, 0.04], parent: props.spear, ol: 0.01 });
  mk(G.cyl(0.035, 0.035, 0.08, 6), M('#5d4037'), { p: [0, 1.25, 0.04], parent: props.spear, ol: 0 });
  props.berries = new THREE.Group(); arms[1].hand.add(props.berries);
  for (let i = 0; i < 5; i++) mk(G.sph(0.035, 8, 6), M(i % 2 ? '#c2185b' : '#7b1fa2'), { p: [Math.sin(i * 1.3) * 0.05, 0.06 + (i % 2) * 0.03, 0.08 + Math.cos(i * 1.3) * 0.04], parent: props.berries, ol: 0.005 });
  props.radio = new THREE.Group(); arms[1].hand.add(props.radio);
  mk(G.box(0.26, 0.16, 0.1), M('#3d4a5c'), { p: [0, 0.08, 0.1], parent: props.radio, ol: 0.01 });
  mk(G.cyl(0.04, 0.04, 0.02, 12), M('#c0c6cc'), { p: [0.06, 0.08, 0.16], r: [Math.PI / 2, 0, 0], parent: props.radio, ol: 0 });
  mk(G.cyl(0.008, 0.008, 0.3, 4), M('#222'), { p: [-0.08, 0.3, 0.1], parent: props.radio, ol: 0 });
  props.icecream = new THREE.Group(); arms[1].hand.add(props.icecream);
  mk(new THREE.ConeGeometry(0.07, 0.2, 10), M('#d9a066'), { p: [0, 0.06, 0.08], r: [Math.PI, 0, 0], parent: props.icecream, ol: 0.008 });
  mk(G.sph(0.08, 12, 10), M('#ff9ad5'), { p: [0, 0.2, 0.08], parent: props.icecream, ol: 0.008 });
  mk(G.sph(0.07, 12, 10), M('#8fd3ff'), { p: [0, 0.31, 0.08], parent: props.icecream, ol: 0.008 });
  props.torch = new THREE.Group(); arms[1].hand.add(props.torch);
  mk(G.cyl(0.035, 0.03, 0.22, 10), M('#f1c40f'), { p: [0, 0.04, 0.1], r: [Math.PI / 2, 0, 0], parent: props.torch, ol: 0.008 });
  props.cake = new THREE.Group(); arms[1].hand.add(props.cake);
  mk(G.cyl(0.24, 0.24, 0.18, 18), M('#fbe3ec'), { p: [-0.18, -0.1, 0.22], parent: props.cake, ol: 0.012 });
  mk(G.cyl(0.25, 0.25, 0.05, 18), M('#e84a5f'), { p: [-0.18, -0.02, 0.22], parent: props.cake, ol: 0 });
  mk(G.cyl(0.015, 0.015, 0.12, 6), M('#5dade2'), { p: [-0.18, 0.08, 0.22], parent: props.cake, ol: 0 });
  mk(G.sph(0.03, 8, 6), new THREE.MeshBasicMaterial({ color: '#ffcc33' }), { p: [-0.18, 0.16, 0.22], parent: props.cake, ol: 0 });
  for (const k of Object.keys(props)) props[k].visible = k === 'cane';
  // sem receber sombra: rostos limpos, sem manchas de shadow-map
  root.traverse((o) => { if (o.isMesh) { o.castShadow = o.material !== OUTLINE; o.receiveShadow = false; } });
  return { name, cfg, root, body, hips, torso, legs, arms, head, face, props, seed };
}
const chars = {};
Object.entries(CHARS).forEach(([n, cfg], i) => { chars[n] = makeChar(n, cfg, i * 1.37 + 0.4); scene.add(chars[n].root); });
const WHO = { ZINHO: 'zinho', MAE: 'mae', BETO: 'beto', LIA: 'lia', JUCA: 'juca', PROF: 'prof', UGO: 'ugo' };

const EXPR = {
  neutral: { eye: 1, lid: 1, brow: [0, 0], by: 0, mouth: 'smile', ms: 0.55 },
  happy:   { eye: 1, lid: 1, brow: [0.12, -0.12], by: 0.025, mouth: 'smile', ms: 1 },
  smug:    { eye: 1, lid: 0.62, brow: [-0.12, -0.25], by: 0, byR: 0.05, mouth: 'smirk', ms: 0.85 },
  worried: { eye: 1.05, lid: 1, brow: [0.42, -0.42], by: 0.02, mouth: 'frown', ms: 0.75, sweat: 1 },
  angry:   { eye: 0.95, lid: 0.78, brow: [-0.5, 0.5], by: -0.03, mouth: 'frown', ms: 1 },
  shock:   { eye: 1.35, lid: 1, brow: [0.15, -0.15], by: 0.07, mouth: 'O', ms: 1, sweat: 1 },
  flat:    { eye: 1, lid: 0.48, brow: [0, 0], by: -0.03, mouth: 'line', ms: 1 },
  closed:  { eye: 1, lid: 0.1, brow: [0.05, -0.05], by: -0.01, mouth: 'line', ms: 0.8 },
  sad:     { eye: 1, lid: 0.75, brow: [0.45, -0.45], by: 0.0, mouth: 'frown', ms: 0.85, tear: 1 },
};
function setFace(c, eName, amp, t, wink) {
  const e = EXPR[eName] || EXPR.neutral, f = c.face;
  const period = 3.1 + (c.seed % 1.3);
  const blink = ((t + c.seed * 1.7) % period) < 0.12 ? 0.1 : 1;
  for (const k of ['L', 'R']) {
    let lid = e.lid * blink;
    if (k === 'R' && wink) lid = 0.1;
    f['eye' + k].scale.set(0.072 * e.eye, 0.1 * e.eye * lid, 0.04);
    f['hl' + k].visible = lid > 0.4;
    f['hl' + k].scale.set(0.022 * e.eye, 0.026 * e.eye, 0.01);
  }
  f.browL.rotation.z = e.brow[0]; f.browR.rotation.z = e.brow[1];
  f.browL.position.y = e.by; f.browR.position.y = e.by + (e.byR || 0);
  f.smile.visible = f.frown.visible = f.line.visible = f.open.visible = false;
  if (amp > 0.06) {
    f.open.visible = true;
    f.openInner.scale.set(0.085 + 0.02 * amp, 0.025 + 0.085 * amp, 0.03);
    f.tongue.position.y = -0.03 - 0.03 * amp;
  } else if (e.mouth === 'O') {
    f.open.visible = true; f.openInner.scale.set(0.065, 0.085, 0.03); f.tongue.position.y = -0.055;
  } else if (e.mouth === 'smirk') {
    f.smile.visible = true; f.smile.scale.set(0.8, 0.6, 1); f.smile.rotation.z = Math.PI + 0.3; f.smile.position.x = 0.04;
  } else {
    f[e.mouth].visible = true;
    f[e.mouth].scale.set(e.ms, e.mouth === 'smile' ? e.ms : 1, 1);
    f.smile.rotation.z = Math.PI; f.smile.position.x = 0;
  }
  f.sweat.visible = !!e.sweat;
  f.tear.visible = !!e.tear;
  if (e.tear) f.tear.children[0].position.y = -((t * 0.3 + c.seed) % 1) * 0.12;
  if (e.sweat) f.sweat.children[0].position.y = -((t * 0.25 + c.seed) % 1) * 0.08;
}

// ───────────────────────── poses / ações ─────────────────────────
function pose(c, a, k) {
  const { t, lt, u, amp, talking, walkPhase, moving } = k;
  const L = c.legs, A = c.arms;
  c.root.rotation.x = 0; c.root.rotation.z = 0;
  c.body.position.y = 0;
  c.hips.position.y = 0.5; c.hips.rotation.set(0, 0, 0);
  c.torso.rotation.set(c.cfg.hunch || 0, 0, 0);
  L[0].rotation.set(0, 0, 0); L[1].rotation.set(0, 0, 0);
  A[0].pivot.rotation.set(0, 0, -0.13); A[1].pivot.rotation.set(0, 0, 0.13);
  c.head.rotation.set(Math.sin(t * 0.7 + c.seed * 2) * 0.025, Math.sin(t * 0.5 + c.seed) * 0.05, Math.sin(t * 0.9 + c.seed) * 0.03);
  c.hips.position.y += Math.sin(t * 2.2 + c.seed) * 0.01;

  const fall = (dirSign, a0, a1) => {
    const f = smooth((u - a0) / (a1 - a0));
    c.root.rotation.x = dirSign * 1.45 * f;
    c.body.position.y = 0.26 * f;
    return f;
  };
  switch (a) {
    case 'walk': case 'run': break;
    case 'talk': {
      const g = 0.5 + 0.5 * Math.sin(t * 3.1 + c.seed);
      A[1].pivot.rotation.x = -0.45 - 0.45 * g * (0.4 + amp);
      A[1].pivot.rotation.z = 0.35;
      A[0].pivot.rotation.x = -0.15 - 0.2 * (0.5 + 0.5 * Math.sin(t * 2.3));
      break;
    }
    case 'wave':
      A[1].pivot.rotation.z = 2.55 + Math.sin(t * 9 + c.seed) * 0.35; A[1].pivot.rotation.x = -0.15;
      break;
    case 'cheer':
      A[0].pivot.rotation.z = -2.6 - Math.sin(t * 8) * 0.2; A[1].pivot.rotation.z = 2.6 + Math.sin(t * 8) * 0.2;
      c.hips.position.y += Math.abs(Math.sin(t * 6 + c.seed)) * 0.16;
      break;
    case 'shock':
      A[0].pivot.rotation.set(-0.7, 0, -1.25 + Math.sin(t * 30) * 0.04); A[1].pivot.rotation.set(-0.7, 0, 1.25 + Math.sin(t * 31) * 0.04);
      c.hips.position.y += lt < 0.45 ? Math.sin(Math.PI * lt / 0.45) * 0.22 : 0;
      c.head.rotation.x -= 0.12;
      break;
    case 'angry':
      A[0].pivot.rotation.set(-0.35 + Math.sin(t * 24) * 0.12, 0, -0.45); A[1].pivot.rotation.set(-0.35 + Math.sin(t * 25 + 1) * 0.12, 0, 0.45);
      c.torso.rotation.x += 0.12;
      c.hips.position.y += Math.max(0, Math.sin(t * 7)) * 0.06;
      break;
    case 'hold':
      A[0].pivot.rotation.set(-1.15, 0, 0.32); A[1].pivot.rotation.set(-1.15, 0, -0.32);
      break;
    case 'point':
      A[1].pivot.rotation.set(-1.5 + Math.sin(t * 10) * 0.08, 0, 0.1);
      A[0].pivot.rotation.set(0, 0, -0.5); c.torso.rotation.x += 0.06;
      break;
    case 'shrug':
      A[0].pivot.rotation.set(-0.5, 0, -0.95); A[1].pivot.rotation.set(-0.5, 0, 0.95);
      c.head.rotation.z += 0.15 * Math.sin(t * 2);
      break;
    case 'kick': {
      const kk = pulse(u, 0.12, 0.38);
      L[1].rotation.x = -1.4 * kk + 0.35 * pulse(u, 0.02, 0.16);
      A[0].pivot.rotation.z = -0.13 - 0.7 * kk; A[1].pivot.rotation.z = 0.13 + 0.7 * kk;
      break;
    }
    case 'kickfall': {
      const kk = pulse(u, 0.08, 0.3);
      L[1].rotation.x = -1.4 * kk;
      A[0].pivot.rotation.z = -0.13 - 0.7 * kk; A[1].pivot.rotation.z = 0.13 + 0.7 * kk;
      const f = fall(-1, 0.62, 0.72);
      if (f > 0) { A[0].pivot.rotation.z = -1.8 * f; A[1].pivot.rotation.z = 1.8 * f; L[0].rotation.x = -0.5 * f; L[1].rotation.x = -0.9 * f; }
      break;
    }
    case 'trip': {
      const f = fall(1, 0.45, 0.62);
      A[0].pivot.rotation.x = -2.7 * f; A[1].pivot.rotation.x = -2.7 * f;
      L[0].rotation.x = 0.5 * f; L[1].rotation.x = 0.3 * f;
      break;
    }
    case 'sitfloor':
      c.hips.position.y = 0.2; L[0].rotation.x = L[1].rotation.x = -1.45; L[0].rotation.z = -0.15; L[1].rotation.z = 0.15;
      c.torso.rotation.x = -0.18;
      A[0].pivot.rotation.set(0.6, 0, -0.35); A[1].pivot.rotation.set(0.6, 0, 0.35);
      break;
    case 'sit': case 'headdown':
      c.hips.position.y = 0.48; L[0].rotation.x = L[1].rotation.x = -1.45;
      A[0].pivot.rotation.set(-1.0, 0, 0.15); A[1].pivot.rotation.set(-1.0, 0, -0.15);
      if (a === 'headdown') { c.torso.rotation.x = 0.35; c.head.rotation.x = 0.45; A[0].pivot.rotation.x = A[1].pivot.rotation.x = -1.45; }
      break;
    case 'lie':
      c.root.rotation.x = -Math.PI / 2;
      break;
    case 'hug':
      A[0].pivot.rotation.set(-1.35, 0, 0.75); A[1].pivot.rotation.set(-1.35, 0, -0.75);
      break;
    case 'reach':
      A[1].pivot.rotation.set(-1.45, 0, 0.05); A[0].pivot.rotation.set(-0.2, 0, -0.15);
      c.torso.rotation.x += 0.08;
      break;
    case 'sitbed':
      c.hips.position.y = 0.12; L[0].rotation.x = L[1].rotation.x = -1.5;
      A[0].pivot.rotation.set(-0.5, 0, -0.1); A[1].pivot.rotation.set(-0.5, 0, 0.1);
      break;
  }
  if (moving && (a === 'walk' || a === 'run' || a === 'trip' || a === 'cheer' || a === 'hold')) {
    const run = a === 'run';
    const s = Math.sin(walkPhase), amp2 = run ? 1.0 : 0.55;
    if (a !== 'trip' || u < 0.45) {
      L[0].rotation.x = s * amp2; L[1].rotation.x = -s * amp2;
      if (a === 'walk' || a === 'run' || a === 'trip') { A[0].pivot.rotation.x = -s * amp2 * 0.85; A[1].pivot.rotation.x = s * amp2 * 0.85; }
      c.hips.position.y += Math.abs(Math.cos(walkPhase)) * (run ? 0.1 : 0.045);
      if (run) { c.torso.rotation.x += 0.22; A[0].pivot.rotation.z = -0.3; A[1].pivot.rotation.z = 0.3; }
    }
  }
  // estilo 2: squash & stretch e cabeça com atraso — movimento mais elástico
  c.body.scale.setScalar(c.cfg.scale || 1);
  if (k.style2) {
    let st = Math.sin(t * 2.2 + c.seed) * 0.015;
    if (moving && (a === 'walk' || a === 'run')) { st = Math.cos(walkPhase * 2) * (a === 'run' ? 0.07 : 0.035); c.head.rotation.x += -Math.sin(walkPhase * 2) * 0.06; }
    if (a === 'cheer' || a === 'shock') st = Math.cos(t * 12 + c.seed) * 0.06;
    if (talking) st += amp * 0.025;
    const sc = c.cfg.scale || 1;
    c.body.scale.set(sc / Math.sqrt(1 + st), sc * (1 + st), sc / Math.sqrt(1 + st));
  }
  if (talking) {
    c.head.rotation.x += -amp * 0.07 + Math.sin(t * 6.5) * amp * 0.05;
    c.head.rotation.y += Math.sin(t * 1.9 + c.seed) * 0.07;
  }
}

// ───────────────────────── efeitos ─────────────────────────
const FX = {};
{
  // bola
  FX.ball = mk(G.ico(0.14, 1), M('#ffffff', { flatShading: true }), { parent: street, ol: 0.015 });
  for (let i = 0; i < 6; i++) {
    const d = V(hash(i) - 0.5, hash(i + 3) - 0.5, hash(i + 7) - 0.5).normalize();
    const pp = new THREE.Mesh(G.sph(0.045, 6, 4), M('#222')); pp.position.copy(d.multiplyScalar(0.125)); FX.ball.add(pp);
  }
  // figurinha dourada
  const cardTex = canvasTex(256, 360, (g, W, H) => {
    const gr = g.createLinearGradient(0, 0, W, H); gr.addColorStop(0, '#fff3a0'); gr.addColorStop(0.5, '#f1c40f'); gr.addColorStop(1, '#e67e22');
    g.fillStyle = gr; g.fillRect(0, 0, W, H); g.strokeStyle = '#fff'; g.lineWidth = 12; g.strokeRect(14, 14, W - 28, H - 28);
    g.fillStyle = '#fff'; g.font = '900 150px DejaVu Sans'; g.textAlign = 'center'; g.fillText('★', W / 2, 220);
    g.font = '900 46px Inter'; g.fillStyle = '#7a3e00'; g.fillText('RARA', W / 2, 310);
  });
  FX.card = mk(G.box(0.34, 0.48, 0.01), new THREE.MeshBasicMaterial({ map: cardTex }), { ol: 0.01 });
  scene.add(FX.card);
  const starTex = canvasTex(64, 64, (g) => { g.fillStyle = '#fff'; g.translate(32, 32); g.beginPath(); for (let i = 0; i < 8; i++) { const r = i % 2 ? 6 : 30; g.lineTo(Math.sin(i * Math.PI / 4) * r, Math.cos(i * Math.PI / 4) * r); } g.fill(); });
  FX.sparkles = [];
  for (let i = 0; i < 16; i++) { const s = sprite(starTex, 0.3); s.material.color.set('#fff6b0'); scene.add(s); FX.sparkles.push(s); }
  // chuva (linhas)
  const mkRain = (n) => {
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 6), 3));
    const l = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: '#cfe4ff', transparent: true, opacity: 0.75 }));
    l.frustumCulled = false; scene.add(l); l.userData.n = n; return l;
  };
  FX.rainAll = mkRain(2500); FX.rainCloud = mkRain(260);
  // nuvenzinha
  FX.cloud = new THREE.Group(); scene.add(FX.cloud);
  FX.cloudMat = M('#f4f6fa', { flatShading: true });
  for (const [x, y, z, r] of [[0, 0, 0, 0.55], [0.5, -0.05, 0.1, 0.42], [-0.5, -0.05, 0, 0.44], [0.2, 0.25, -0.1, 0.4], [-0.25, 0.2, 0.15, 0.38], [0.85, -0.12, -0.05, 0.3], [-0.85, -0.1, 0.05, 0.3]])
    mk(G.ico(r, 1), FX.cloudMat, { p: [x, y, z], parent: FX.cloud, ol: 0.02 });
  FX.bolt = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial({ color: '#fffbe0', side: THREE.DoubleSide }));
  FX.bolt.frustumCulled = false; scene.add(FX.bolt);
  // ônibus
  FX.bus = new THREE.Group(); street.add(FX.bus);
  mk(G.box(9, 2.6, 2.5), M('#2e86de'), { p: [0, 1.6, 0], parent: FX.bus, ol: 0.04 });
  mk(G.box(9.02, 0.3, 2.52), M('#ffffff'), { p: [0, 1.0, 0], parent: FX.bus, ol: 0 });
  mk(G.box(8.2, 0.9, 2.54), M('#1f2d3d'), { p: [-0.2, 2.2, 0], parent: FX.bus, ol: 0 });
  for (const wx of [3, -3]) for (const wz of [1.2, -1.2]) mk(G.cyl(0.5, 0.5, 0.3, 12), M('#222'), { p: [wx, 0.5, wz], r: [Math.PI / 2, 0, 0], parent: FX.bus, ol: 0.02 });
  // gato preto
  FX.cat = new THREE.Group(); street.add(FX.cat);
  const catM = M('#1d1d22');
  { const b = G.sph(1, 12, 10); b.scale(0.16, 0.14, 0.3); mk(b, catM, { p: [0, 0.32, 0], parent: FX.cat, ol: 0.015 }); }
  FX.catHead = mk(G.sph(0.14, 12, 10), catM, { p: [0, 0.48, 0.3], parent: FX.cat, ol: 0.015 });
  for (const sd of [-1, 1]) {
    mk(new THREE.ConeGeometry(0.05, 0.12, 4), catM, { p: [sd * 0.07, 0.6, 0.29], parent: FX.cat, ol: 0.01 });
    mk(G.sph(0.03, 8, 6), new THREE.MeshBasicMaterial({ color: '#f7dc6f' }), { p: [sd * 0.055, 0.5, 0.425], parent: FX.cat, ol: 0 });
  }
  FX.catLegs = [];
  for (const [lx, lz] of [[-0.08, 0.18], [0.08, 0.18], [-0.08, -0.18], [0.08, -0.18]]) {
    const p = new THREE.Group(); p.position.set(lx, 0.25, lz); FX.cat.add(p);
    mk(G.cyl(0.03, 0.03, 0.25, 6), catM, { p: [0, -0.12, 0], parent: p, ol: 0.008 }); FX.catLegs.push(p);
  }
  FX.catTail = new THREE.Group(); FX.catTail.position.set(0, 0.38, -0.28); FX.cat.add(FX.catTail);
  mk(G.cyl(0.025, 0.03, 0.4, 6), catM, { p: [0, 0.18, -0.05], r: [-0.4, 0, 0], parent: FX.catTail, ol: 0.008 });
  // espelho + cacos
  FX.mirror = new THREE.Group();
  mk(G.box(0.85, 1.15, 0.06), M('#8d5a32'), { parent: FX.mirror, ol: 0.02 });
  FX.mirrorGlass = mk(G.box(0.7, 1.0, 0.07), new THREE.MeshToonMaterial({ color: '#d9eef7', gradientMap: gradMap, emissive: '#d9eef7', emissiveIntensity: 0.35 }), { parent: FX.mirror, ol: 0 });
  FX.shards = [];
  for (let i = 0; i < 16; i++) {
    const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(0.08 + hash(i) * 0.12, 0.02); sh.lineTo(0.03, 0.1 + hash(i + 1) * 0.12); sh.closePath();
    const m = new THREE.Mesh(new THREE.ShapeGeometry(sh), new THREE.MeshToonMaterial({ color: '#cfeaf7', gradientMap: gradMap, emissive: '#cfeaf7', emissiveIntensity: 0.4, side: THREE.DoubleSide }));
    street.add(m); FX.shards.push(m);
  }
  // cachorros
  FX.dogs = [0, 1, 2].map((i) => {
    const g = new THREE.Group(); street.add(g);
    const col = ['#a0522d', '#f5f5f5', '#3b3b3b'][i], m = M(col);
    { const b = G.sph(1, 12, 10); b.scale(0.22, 0.2, 0.4); mk(b, m, { p: [0, 0.5, 0], parent: g, ol: 0.018 }); }
    const head = new THREE.Group(); head.position.set(0, 0.72, 0.38); g.add(head);
    mk(G.sph(0.2, 12, 10), m, { parent: head, ol: 0.018 });
    mk(G.box(0.16, 0.13, 0.2), m, { p: [0, -0.05, 0.2], parent: head, ol: 0.012 });
    mk(G.sph(0.045, 8, 6), M('#111'), { p: [0, 0.0, 0.31], parent: head, ol: 0 });
    for (const sd of [-1, 1]) {
      mk(G.box(0.07, 0.18, 0.12), M(i === 1 ? '#8d6e63' : '#2b1d14'), { p: [sd * 0.17, 0.02, -0.02], r: [0, 0, sd * 0.3], parent: head, ol: 0.01 });
      mk(G.sph(0.03, 8, 6), new THREE.MeshBasicMaterial({ color: '#111' }), { p: [sd * 0.08, 0.07, 0.17], parent: head, ol: 0 });
    }
    const legs = [];
    for (const [lx, lz] of [[-0.12, 0.25], [0.12, 0.25], [-0.12, -0.25], [0.12, -0.25]]) {
      const p = new THREE.Group(); p.position.set(lx, 0.42, lz); g.add(p);
      mk(G.cyl(0.05, 0.045, 0.4, 6), m, { p: [0, -0.2, 0], parent: p, ol: 0.01 }); legs.push(p);
    }
    const tail = new THREE.Group(); tail.position.set(0, 0.6, -0.38); g.add(tail);
    mk(G.cyl(0.03, 0.04, 0.3, 6), m, { p: [0, 0.12, -0.05], r: [-0.6, 0, 0], parent: tail, ol: 0.01 });
    g.scale.setScalar(0.9 + i * 0.12);
    return { g, legs, head, tail };
  });
  // meteoro
  FX.meteor = new THREE.Group(); scene.add(FX.meteor);
  mk(G.ico(1.4, 1), new THREE.MeshBasicMaterial({ color: '#ffd28a', fog: false }), { parent: FX.meteor, ol: 0 });
  FX.meteorGlow = sprite(glowTex('rgba(255,150,60,1)'), 30); FX.meteor.add(FX.meteorGlow);
  FX.trail = [];
  const trailTex = glowTex('rgba(255,120,40,1)');
  for (let i = 0; i < 18; i++) { const s = sprite(trailTex, 18 - i * 0.8, 0.85 - i * 0.04); scene.add(s); FX.trail.push(s); }
  // cratera + cristal
  FX.crater = new THREE.Group(); FX.crater.position.set(10, 0, -9.5); street.add(FX.crater);
  mk(new THREE.TorusGeometry(1.7, 0.35, 8, 20), M('#5d4330', { flatShading: true }), { r: [Math.PI / 2, 0, 0], s: [1, 1, 0.6], parent: FX.crater, ol: 0.03 });
  mk(G.cyl(1.6, 1.6, 0.05, 24), M('#2e2219'), { p: [0, 0.07, 0], parent: FX.crater, ol: 0, cast: false });
  for (let i = 0; i < 9; i++) mk(G.ico(0.18 + hash(i) * 0.2, 0), M('#6b4f3a', { flatShading: true }), { p: [Math.sin(i * 0.7) * 2.3, 0.15, Math.cos(i * 0.7) * 2.3], parent: FX.crater, ol: 0.015 });
  FX.crystal = new THREE.Group(); FX.crystal.position.y = 0.6; FX.crater.add(FX.crystal);
  const crys = new THREE.OctahedronGeometry(0.55, 0); crys.scale(1, 1.5, 1);
  mk(crys, new THREE.MeshBasicMaterial({ color: '#7ef9ff' }), { parent: FX.crystal, ol: 0.03 });
  mk(new THREE.OctahedronGeometry(0.3, 0), new THREE.MeshBasicMaterial({ color: '#c39bff' }), { p: [0.5, -0.25, 0.2], r: [0.3, 0, 0.6], parent: FX.crystal, ol: 0.02 });
  FX.crystalGlow = sprite(glowTex('rgba(120,250,255,1)'), 5); FX.crystal.add(FX.crystalGlow);
  FX.smoke = [];
  for (let i = 0; i < 14; i++) { const s = mk(G.ico(1, 1), new THREE.MeshToonMaterial({ color: '#9a9a9a', gradientMap: gradMap, transparent: true, opacity: 0.8, flatShading: true }), { parent: street, ol: 0, cast: false }); FX.smoke.push(s); }
  FX.debris = [];
  for (let i = 0; i < 14; i++) FX.debris.push(mk(G.ico(0.15 + hash(i + 40) * 0.15, 0), M('#4a3628', { flatShading: true }), { parent: street, ol: 0.01 }));
  // moedas
  FX.coins = [];
  for (let i = 0; i < 40; i++) FX.coins.push(mk(G.cyl(0.14, 0.14, 0.03, 16), M('#f5c518', { emissive: '#7a5a00', emissiveIntensity: 0.4 }), { ol: 0.01 }));
  FX.coins.forEach((c) => scene.add(c));
  // faíscas
  FX.sparks = [];
  for (let i = 0; i < 24; i++) { const s = new THREE.Mesh(G.box(0.04, 0.04, 0.12), new THREE.MeshBasicMaterial({ color: i % 2 ? '#fff176' : '#ffb300' })); scene.add(s); FX.sparks.push(s); }
  FX.dust = [];
  for (let i = 0; i < 6; i++) { const s = mk(G.ico(0.3, 1), new THREE.MeshToonMaterial({ color: '#d8cdb8', gradientMap: gradMap, transparent: true, opacity: 0.8 }), { ol: 0, cast: false }); scene.add(s); FX.dust.push(s); }
}
// objetos que podem virar ouro
regGold('alarm', BR.alarm); regGold('desk', BR.desk); regGold('lamp', BR.lamp); regGold('clock', BR.clock); regGold('bed', BR.bed);
regGold('fridge', KT.fridge); regGold('table', KT.table); regGold('tree', ST.trees[2]); regGold('ball', FX.ball);
regGold('hands', chars.zinho.arms[0].hand.children[0], chars.zinho.arms[1].hand.children[0]);
for (const k of ['sandwich', 'cup', 'cake', 'phone']) regGold(k, chars.zinho.props[k]);
// pilha de barras de ouro
FX.pile = new THREE.Group(); scene.add(FX.pile);
{
  let i = 0;
  for (let layer = 0; layer < 4; layer++) for (let r = 0; r < 4 - layer; r++) for (let c = 0; c < 2; c++) {
    if (i >= 20) break;
    const b = mk(G.box(0.5, 0.16, 0.24), GOLD, { p: [(r - (3 - layer) / 2) * 0.52, 0.08 + layer * 0.17, (c - 0.5) * 0.27], parent: FX.pile, ol: 0.012 });
    b.userData.i = i++;
  }
}
const _box = new THREE.Box3();
FX.wave = new THREE.Mesh(new THREE.TorusGeometry(1, 0.06, 8, 48), new THREE.MeshBasicMaterial({ color: '#bfe8ff', transparent: true, depthWrite: false }));
scene.add(FX.wave);

// ── mundo abandonado: mato que cresce, fogueira, letras na rua, pratos, marcas na parede ──
FX.weeds = [];
for (let i = 0; i < 160; i++) {
  const x = (hash(i * 3.1) - 0.5) * 70, z = (hash(i * 7.7) - 0.5) * 11;
  const big = hash(i + 0.5) > 0.7;
  const w = mk(big ? G.ico(0.5, 0) : new THREE.ConeGeometry(0.16, 0.7, 5), M(['#4f8f3a', '#5ea544', '#3f7a32'][i % 3], { flatShading: true }), { p: [x, 0, z], ol: big ? 0.015 : 0.01, cast: false });
  w.userData.base = [x, z, big ? 0.35 : 0.3, hash(i + 9)];
  street.add(w); FX.weeds.push(w);
}
FX.fire = new THREE.Group(); scene.add(FX.fire);
for (let i = 0; i < 6; i++) mk(G.cyl(0.05, 0.05, 0.7, 6), M('#6d4c41'), { p: [0, 0.08, 0], r: [Math.PI / 2, i * 0.52, 0], parent: FX.fire, ol: 0.01 });
FX.flames = [0, 1, 2].map((i) => mk(new THREE.ConeGeometry(0.22 - i * 0.05, 0.7 - i * 0.12, 7), new THREE.MeshBasicMaterial({ color: ['#ff7a1a', '#ffb31a', '#fff3a0'][i] }), { p: [0, 0.35, 0], parent: FX.fire, ol: 0 }));
FX.fireGlow = sprite(glowTex('rgba(255,140,40,1)'), 3.5); FX.fireGlow.position.y = 0.5; FX.fire.add(FX.fireGlow);
FX.roadText = new THREE.Mesh(new THREE.PlaneGeometry(12, 3.1), new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false }));
FX.roadText.rotation.x = -Math.PI / 2; FX.roadText.position.set(-1.3, 0.07, 0); street.add(FX.roadText);
let lastRoadText = null;
function drawRoadText(t) {
  const tex = canvasTex(1400, 360, (g, W, H) => { g.clearRect(0, 0, W, H); g.fillStyle = 'rgba(255,255,255,0.92)'; g.font = '900 250px Inter'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, W / 2, H / 2 + 10); });
  FX.roadText.material.map?.dispose(); FX.roadText.material.map = tex; FX.roadText.material.needsUpdate = true;
}
FX.plates = [];
for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; FX.plates.push(mk(G.cyl(0.17, 0.14, 0.03, 16), M('#ffffff'), { p: [-2.9 + Math.cos(a) * 0.6, 0.86, 1.8 + Math.sin(a) * 0.6], parent: kitchen, ol: 0.008 })); }
FX.tally = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.0), new THREE.MeshBasicMaterial({ transparent: true }));
FX.tally.position.set(-3.78, 1.9, -1.6); FX.tally.rotation.y = Math.PI / 2; bedroom.add(FX.tally);
let lastTally = -1;
function drawTally(n) {
  const tex = canvasTex(480, 300, (g) => {
    g.clearRect(0, 0, 480, 300); g.strokeStyle = 'rgba(30,30,40,0.85)'; g.lineWidth = 6; g.lineCap = 'round';
    for (let i = 0; i < n; i++) {
      const grp = Math.floor(i / 5), k = i % 5, gx = 20 + (grp % 8) * 56, gy = 20 + Math.floor(grp / 8) * 70;
      g.beginPath();
      if (k < 4) { g.moveTo(gx + k * 10, gy); g.lineTo(gx + k * 10 + 2, gy + 50); } else { g.moveTo(gx - 6, gy + 40); g.lineTo(gx + 40, gy + 8); }
      g.stroke();
    }
  });
  FX.tally.material.map?.dispose(); FX.tally.material.map = tex; FX.tally.material.needsUpdate = true;
}

// mamute (desenho original, low-poly)
FX.mam = new THREE.Group(); scene.add(FX.mam);
{
  const fur = M('#8a5a34', { flatShading: true }), dark = M('#6d4428', { flatShading: true });
  const body = G.ico(1.6, 1); body.scale(1.0, 0.95, 1.45); mk(body, fur, { p: [0, 2.6, 0], parent: FX.mam, ol: 0.05 });
  const hump = G.ico(1.0, 1); hump.scale(1, 0.8, 1); mk(hump, dark, { p: [0, 3.6, 0.6], parent: FX.mam, ol: 0.04 });
  FX.mamHead = new THREE.Group(); FX.mamHead.position.set(0, 3.1, 2.1); FX.mam.add(FX.mamHead);
  mk(G.ico(0.95, 1), fur, { parent: FX.mamHead, ol: 0.04 });
  for (const sd of [-1, 1]) {
    mk(G.ico(0.5, 0), dark, { p: [sd * 0.85, 0.05, -0.15], s: [0.4, 1, 0.8], parent: FX.mamHead, ol: 0.02 });
    mk(G.sph(0.09, 10, 8), new THREE.MeshBasicMaterial({ color: '#111' }), { p: [sd * 0.45, 0.25, 0.75], parent: FX.mamHead, ol: 0 });
    mk(G.sph(0.03, 6, 4), new THREE.MeshBasicMaterial({ color: '#fff' }), { p: [sd * 0.45 - 0.02, 0.29, 0.83], parent: FX.mamHead, ol: 0 });
    const tusk = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.09, 8, 16, Math.PI * 0.9), M('#f6efe0'));
    tusk.position.set(sd * 0.42, -0.65, 0.35); tusk.rotation.set(0, sd * 0.4 - Math.PI / 2, Math.PI); outline(tusk, 0.015); FX.mamHead.add(tusk);
  }
  FX.trunk = [];
  let parent = FX.mamHead, y = -0.55;
  for (let i = 0; i < 6; i++) {
    const seg = new THREE.Group(); seg.position.set(0, i === 0 ? y : -0.32, i === 0 ? 0.65 : 0); parent.add(seg);
    mk(G.cyl(0.24 - i * 0.025, 0.22 - i * 0.025, 0.36, 8), fur, { p: [0, -0.16, 0], parent: seg, ol: 0.015 });
    FX.trunk.push(seg); parent = seg;
  }
  FX.mamLegs = [];
  for (const [lx, lz] of [[-0.8, 1.1], [0.8, 1.1], [-0.8, -1.2], [0.8, -1.2]]) {
    const p = new THREE.Group(); p.position.set(lx, 2.0, lz); FX.mam.add(p);
    mk(G.cyl(0.42, 0.38, 2.0, 8), fur, { p: [0, -1.0, 0], parent: p, ol: 0.03 });
    mk(G.cyl(0.42, 0.44, 0.2, 8), M('#4e342e'), { p: [0, -1.95, 0], parent: p, ol: 0.015 });
    FX.mamLegs.push(p);
  }
  FX.mamTail = new THREE.Group(); FX.mamTail.position.set(0, 2.8, -2.25); FX.mam.add(FX.mamTail);
  mk(G.cyl(0.06, 0.1, 0.8, 6), dark, { p: [0, -0.4, 0], parent: FX.mamTail, ol: 0.01 });
}

function hideFx() {
  FX.mam.visible = false; FX.wave.visible = false;
  FX.weeds.forEach((w) => { w.visible = false; });
  FX.fire.visible = false; FX.roadText.visible = false; FX.tally.visible = false;
  FX.plates.forEach((p) => { p.visible = false; });
  ST.car1.position.set(-28, 0, -1.8); ST.car1.rotation.set(0, 0, 0);
  FX.pile.visible = false;
  ST.car2.position.set(-38, 0, 1.8);
  FX.ball.visible = FX.card.visible = FX.cloud.visible = FX.bolt.visible = FX.bus.visible = FX.cat.visible = false;
  FX.mirror.visible = FX.meteor.visible = FX.crater.visible = false;
  FX.rainAll.visible = FX.rainCloud.visible = false;
  ST.ladder.visible = false; ST.net.position.x = 33.6;
  for (const arr of [FX.sparkles, FX.trail, FX.smoke, FX.debris, FX.coins, FX.sparks, FX.shards, FX.dust]) arr.forEach((o) => { o.visible = false; });
  FX.dogs.forEach((d) => { d.g.visible = false; });
  CL.paper.visible = false;
  KT.door.rotation.set(0, 0, 0); KT.door.position.set(3.15, 1.05, -2.53);
  fxLight.intensity = 0; fxLight2.intensity = 0;
}
function updateRain(line, center, radius, height, t, opacity, square = true) {
  const n = line.userData.n, a = line.geometry.attributes.position.array;
  for (let i = 0; i < n; i++) {
    let x, z;
    if (square) { x = center.x + (hash(i) - 0.5) * 2 * radius; z = center.z + (hash(i + 0.5) - 0.5) * 2 * radius; }
    else { const r = Math.sqrt(hash(i)) * radius, th = hash(i + 0.3) * 6.283; x = center.x + Math.cos(th) * r; z = center.z + Math.sin(th) * r; }
    const y = center.y - ((t * 9 + hash(i + 0.7) * height) % height);
    a.set([x, y, z, x - 0.03, y - 0.45, z], i * 6);
  }
  line.geometry.attributes.position.needsUpdate = true;
  line.material.opacity = opacity;
  line.visible = true;
}
function boltGeometry(from, to, seed) {
  const pts = [];
  const n = 9;
  for (let i = 0; i <= n; i++) {
    const p = from.clone().lerp(to, i / n);
    if (i > 0 && i < n) { p.x += (hash(seed + i) - 0.5) * 0.9; p.z += (hash(seed + i + 20) - 0.5) * 0.5; }
    pts.push(p);
  }
  const pos = [];
  const w = 0.09;
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[i + 1];
    pos.push(a.x - w, a.y, a.z, a.x + w, a.y, a.z, b.x + w, b.y, b.z, a.x - w, a.y, a.z, b.x + w, b.y, b.z, b.x - w, b.y, b.z);
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  return g;
}
function meteorPos(p) {
  const S = V(85, 75, -170), E = V(10, 0.6, -9.5);
  const k = Math.pow(clamp(p), 2.3);
  const m = S.clone().lerp(E, k);
  m.y += Math.sin(k * Math.PI) * 6;
  return m;
}

// ───────────────────────── overlays HTML ─────────────────────────
const $ = (id) => document.getElementById(id);
const ICON = {
  fome: '<svg viewBox="0 0 24 24"><path fill="#ff9a3c" d="M15.5 2a6.5 6.5 0 0 0-6.2 8.5L3.6 16.2a2.2 2.2 0 1 0 1.9 3.8 2.2 2.2 0 1 0 3.8 1.9l5.7-5.7A6.5 6.5 0 1 0 15.5 2z"/><circle cx="15.5" cy="8.5" r="2" fill="#ffd2a6"/></svg>',
  pessoas: '<svg viewBox="0 0 24 24"><circle cx="12" cy="7" r="4" fill="#e8e8f0"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8z" fill="#e8e8f0"/></svg>',
  ouro: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#ffd23f" stroke="#a87400" stroke-width="2"/><text x="12" y="16.5" text-anchor="middle" font-size="12" font-weight="900" fill="#a87400" font-family="Inter">$</text></svg>',
  azar: '<svg viewBox="0 0 24 24"><path fill="#fff" d="M3 2.5l4.5 5h9L21 2.5V13a9 9 0 0 1-18 0z"/><ellipse cx="8.7" cy="12.5" rx="1.6" ry="2" fill="#ff4d4d"/><ellipse cx="15.3" cy="12.5" rx="1.6" ry="2" fill="#ff4d4d"/><path d="M10.5 16.5h3l-1.5 1.5z" fill="#ff8a8a"/></svg>',
  sorte: '<svg viewBox="0 0 24 24"><path fill="#5dff8a" d="M12 1.8l3.1 6.6 7.1.8-5.3 4.9 1.5 7.1L12 17.6l-6.4 3.6 1.5-7.1L1.8 9.2l7.1-.8z"/></svg>',
};
const fmtMult = (n) => n.toLocaleString('pt-BR');

// ───────────────────────── linha do tempo ─────────────────────────
let TL = null;
function shotAt(T) {
  const s = TL.shots;
  let lo = 0, hi = s.length - 1;
  while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (s[mid].start <= T) lo = mid; else hi = mid - 1; }
  return lo;
}
let lastBoard = null, lastHudKey = null, lastDigital = null;

function applyTod(name, flash = 0) {
  const d = TOD[name];
  skyU.top.value.set(d.top); skyU.bot.value.set(d.bot);
  hemi.color.set(d.hs); hemi.groundColor.set(d.hg); hemi.intensity = d.hi + flash * 2.5;
  sun.color.set(d.sc); sun.intensity = d.si + flash * 2;
  fill.intensity = d.fill;
  if (d.fog) { scene.fog.color.set(d.fog); scene.fog.near = d.fogN; scene.fog.far = d.fogF; } else { scene.fog.near = 1000; scene.fog.far = 2000; }
  return d;
}

function render(T) {
  const idx = shotAt(T), shot = TL.shots[idx], prev = TL.shots[idx - 1];
  const lt = T - shot.start, u = clamp(lt / shot.dur);
  const fx = shot.fx || {};
  const fr = Math.floor((T - shot.vstart) * TL.fps);
  const amp = fr >= 0 && fr < shot.env.length ? shot.env[fr] : 0;
  const speaker = WHO[shot.who];

  // cenário
  for (const [k, g] of Object.entries(sets)) g.visible = k === shot.set;
  hideFx();

  let impactShakeExtra = 0;
  // relâmpagos
  let flash = 0;
  const bolts = fx.cloud?.bolts || [];
  for (const b of bolts) { const dt = lt - b * shot.dur; if (dt >= 0 && dt < 0.35) flash = Math.max(flash, (dt < 0.08 ? 1 : 0.4) * (1 - dt / 0.35)); }
  const tod = applyTod(shot.tod, flash);
  if (shot.set === 'bedroom') { BR.glass.color.set(tod.lamps ? '#16264f' : '#9fd8f5'); BR.moon.visible = !!tod.lamps; }

  // luzes da rua (apagão)
  let lamps = tod.lamps;
  if (fx.blackout !== undefined) {
    const dt = lt - fx.blackout * shot.dur;
    lamps = dt < 0 ? 1 : dt < 0.5 ? (hash(Math.floor(dt * 20)) > 0.5 ? 1 : 0) : 0;
  }
  lampMat.color.set(lamps ? '#fff3b8' : '#5b6068');
  lampGlows.forEach((g) => { g.visible = !!lamps && shot.set === 'street'; });
  winMat.emissiveIntensity = tod.win * (lamps ? 1 : 0.05);

  // atores: posição
  const pos = {};
  for (const [n, c] of Object.entries(chars)) c.root.visible = false;
  const actors = shot.actors || {};
  const moveK = (spec) => {
    if (!spec.to) return 0;
    const end = spec.a === 'trip' ? 0.45 : 1;
    return clamp(u / end);
  };
  for (const [n, s] of Object.entries(actors)) {
    const k = moveK(s);
    pos[n] = s.to ? [lerp(s.p[0], s.to[0], k), lerp(s.p[1], s.to[1], k)] : s.p;
  }
  for (const [n, s] of Object.entries(actors)) {
    const c = chars[n]; if (!c) continue;
    c.root.visible = true;
    const k = moveK(s);
    let [x, z] = pos[n];
    let ry = 0;
    const moving = !!s.to && k > 0 && k < 1;
    if (s.r !== undefined) ry = s.r * D2R;
    else if (s.look && pos[s.look]) ry = Math.atan2(pos[s.look][0] - x, pos[s.look][1] - z);
    else if (s.to) ry = Math.atan2(s.to[0] - s.p[0], s.to[1] - s.p[1]);
    let y = groundY(shot.set, x, z);
    if (s.a === 'lie') { y = 0.9; z += 0.6; }
    if (s.a === 'sitbed') { y = 0.6; z -= 0.9; }
    c.root.position.set(x, y, z);
    c.root.rotation.set(0, ry, 0);
    const dist = s.to ? Math.hypot(s.to[0] - s.p[0], s.to[1] - s.p[1]) * k : 0;
    const talking = speaker === n;
    pose(c, s.a || 'idle', { t: T, lt, u, amp: talking ? amp : 0, talking, walkPhase: dist * (s.a === 'run' ? 3.2 : 4.2), moving, style2: !!shot.style2 });
    c.root.rotation.y = ry;
    setFace(c, s.e || 'neutral', talking ? amp : 0, T, shot.wink !== undefined && u > shot.wink && n === 'zinho');
    for (const [pk, pm] of Object.entries(c.props)) pm.visible = pk === 'cane' ? true : s.prop === pk;
  }
  scene.updateMatrixWorld();
  const headOf = (n) => chars[n].head.getWorldPosition(V());
  const handOf = (n, i = 1) => chars[n].arms[i].hand.getWorldPosition(V());

  // ─── efeitos ───
  if (fx.ladder) ST.ladder.visible = true;
  ST.jucaGlass.visible = true; ST.jucaBroken.visible = false; ST.jucaBoards.visible = false;
  const day = shot.hud ? shot.hud[1] : -1;
  if (fx.windowBroken || (shot.set === 'street' && shot.hud && shot.hud[0] === 'azar' && day >= 4 && !fx.windowBreak)) {
    ST.jucaGlass.visible = false; ST.jucaBroken.visible = true; ST.jucaBoards.visible = day >= 5;
  }
  if (fx.ball) {
    FX.ball.visible = true;
    let p;
    if (fx.ball === 'goal') {
      const a = 0.25, b = 0.45;
      if (u < a) p = V(23.35, 0.14, 12.15);
      else if (u < b) { const k = (u - a) / (b - a); p = V(lerp(23.35, 33.1, k), 0.14 + Math.sin(k * Math.PI) * 1.1 + k * 0.6, lerp(12.15, 12.7, k)); }
      else { const k = clamp((u - b) / 0.15); p = V(33.1 + 0.3 * k, lerp(0.74, 0.14, easeOut(k)), 12.7); ST.net.position.x = 33.6 + 0.25 * pulse(u, b, b + 0.2); }
      if (u > b) for (let i = 0; i < 8; i++) { const s = FX.sparkles[i]; s.visible = true; const k = (u - b) * 3 + hash(i) * 0.3; s.position.set(33 + Math.sin(i) * k, 1.2 + k * hash(i + 2), 12.7 + Math.cos(i * 2) * k); s.material.opacity = clamp(1 - k); }
    } else if (fx.ball === 'post') {
      const k1 = [0.18, 0.42], k2 = [0.42, 0.62];
      if (u < k1[0]) p = V(23.35, 0.14, 12.15);
      else if (u < k1[1]) { const k = (u - k1[0]) / (k1[1] - k1[0]); p = V(lerp(23.35, 32.45, k), 0.14 + Math.sin(k * Math.PI) * 0.9 + k * 0.8, lerp(12.15, 14.7, k)); }
      else if (u < k2[1]) { const k = (u - k2[0]) / (k2[1] - k2[0]); p = V(lerp(32.45, 23.2, k), 0.94 + Math.sin(k * Math.PI) * 1.2 + k * 0.6, lerp(14.7, 12.0, k)); }
      else { const k = clamp((u - k2[1]) / 0.3); p = V(lerp(23.2, 20.5, k), 1.54 + Math.sin(k * Math.PI) * 1.4 - k * 1.4, lerp(12, 10.5, k)); }
    } else if (fx.ball === 'stuck') {
      p = V(23.35, 0.14, 12.15);
    } else {
      const k = clamp(u / 0.55);
      p = V(lerp(21, 12.7, k), 3.5 + Math.sin(k * Math.PI) * 1.5 - k * 1.8, lerp(12, 9, k));
      if (u > 0.55) FX.ball.visible = false;
    }
    FX.ball.position.copy(p); FX.ball.rotation.set(T * 9, T * 5, 0);
  }
  if (fx.windowBreak !== undefined) {
    const dt = lt - fx.windowBreak * shot.dur;
    if (dt > 0) {
      ST.jucaGlass.visible = false; ST.jucaBroken.visible = true;
      FX.shards.forEach((s, i) => {
        s.visible = true;
        const vx = 0.5 + hash(i) * 1.5, vy = 1 + hash(i + 3) * 2, vz = (hash(i + 5) - 0.5) * 2.5;
        const tt = Math.min(dt, 1.2);
        s.position.set(12.6 + vx * tt, Math.max(0.03, 1.75 + vy * tt - 4.9 * tt * tt), 9 + vz * tt);
        s.rotation.set(tt * 8 * hash(i + 1), tt * 6, 0);
      });
    }
  }
  if (fx.card) {
    const h = handOf('zinho', 1), h2 = handOf('zinho', 0);
    FX.card.visible = true;
    FX.card.position.set((h.x + h2.x) / 2, (h.y + h2.y) / 2 + 0.25 + Math.sin(T * 2) * 0.03, (h.z + h2.z) / 2 + 0.1);
    FX.card.rotation.set(0, chars.zinho.root.rotation.y + Math.sin(T * 1.5) * 0.25, 0);
    FX.sparkles.forEach((s, i) => {
      s.visible = true; const a = T * 1.5 + i * 0.8;
      s.position.copy(FX.card.position).add(V(Math.cos(a) * 0.45, Math.sin(a * 1.3) * 0.4, Math.sin(a) * 0.2));
      const tw = 0.5 + 0.5 * Math.sin(T * 9 + i * 2); s.scale.setScalar(0.08 + 0.18 * tw); s.material.opacity = tw;
    });
  }
  if (fx.rainAll !== undefined) {
    const k = clamp((u - fx.rainAll) / 0.08);
    if (k > 0) {
      const c = camera.position.clone();
      updateRain(FX.rainAll, V(chars.zinho.root.position.x, 12, chars.zinho.root.position.z + 3), 14, 14, T, 0.7 * k);
      applyTod('day'); hemi.intensity *= 1 - 0.35 * k; sun.intensity *= 1 - 0.6 * k;
      skyU.top.value.lerp(new THREE.Color('#6d7685'), k); skyU.bot.value.lerp(new THREE.Color('#aab0ba'), k);
    }
  }
  if (fx.cloud) {
    const cl = fx.cloud, from = cl.from ?? 0;
    const k = smooth((u - from) / 0.15);
    if (k > 0) {
      FX.cloud.visible = true;
      const hp = headOf('zinho');
      const sz = cl.size * (0.4 + 0.6 * k);
      FX.cloud.scale.setScalar(sz);
      const lift = 1.25 + sz * 0.45 + (1 - k) * 3;
      FX.cloud.position.set(hp.x + Math.sin(T * 0.8) * 0.05, hp.y + lift + Math.sin(T * 1.7) * 0.06, hp.z);
      FX.cloudMat.color.set(cl.storm ? '#5d6470' : '#f4f6fa');
      if (cl.rain !== false && (cl.rain || cl.storm) && k > 0.6) updateRain(FX.rainCloud, V(hp.x, hp.y + lift - 0.2 * sz, hp.z), 0.55 * sz, hp.y + lift - 0.25, T, 0.85, false);
      for (const b of bolts) {
        const dt = lt - b * shot.dur;
        if (dt >= 0 && dt < 0.18) {
          FX.bolt.visible = true;
          const tgt = V(hp.x + (hash(b * 10) - 0.5) * 3 + 1.4, 0, hp.z + (hash(b * 20) - 0.5) * 2);
          FX.bolt.geometry.dispose(); FX.bolt.geometry = boltGeometry(V(hp.x, hp.y + lift - 0.3, hp.z), tgt, b * 100);
          fxLight.color.set('#dfe8ff'); fxLight.intensity = 40; fxLight.position.copy(tgt).add(V(0, 1.5, 0));
        }
      }
      if (cl.thunder !== undefined && u > cl.thunder) FX.cloudMat.color.set(Math.floor(T * 14) % 2 ? '#6d7480' : '#f4f6fa');
    }
  }
  if (fx.bus) {
    const k = clamp((u - 0.15) / 0.55);
    FX.bus.visible = k > 0 && k < 1;
    FX.bus.position.set(lerp(-45, 45, k), 0, -1.5);
  }
  if (fx.dust) FX.dust.forEach((d, i) => {
    const k = clamp(u * 1.6 - i * 0.08); if (k <= 0 || k >= 1) return;
    d.visible = true; d.position.set(-3.5 + i * 0.5, 0.25 + k * 0.4, 2.8 + hash(i) * 1.2); d.scale.setScalar(0.4 + k * 1.2); d.material.opacity = 0.7 * (1 - k);
  });
  if (fx.cat) {
    const [a, b] = fx.cat, k = clamp((u - 0.12) / 0.7);
    FX.cat.visible = true;
    FX.cat.position.set(lerp(a[0], b[0], k), groundY('street', 0, lerp(a[1], b[1], k)), lerp(a[1], b[1], k));
    FX.cat.rotation.y = k < 1 ? Math.atan2(b[0] - a[0], b[1] - a[1]) : Math.atan2(camera.position.x - FX.cat.position.x, camera.position.z - FX.cat.position.z);
    const moving = k > 0 && k < 1;
    FX.catLegs.forEach((l, i) => { l.rotation.x = moving ? Math.sin(T * 12 + (i % 2 ? Math.PI : 0) + (i > 1 ? Math.PI / 2 : 0)) * 0.5 : 0; });
    FX.catTail.rotation.z = Math.sin(T * 3) * 0.4;
  }
  if (fx.mirror !== undefined) {
    const juca = chars.juca;
    juca.root.add(FX.mirror); FX.mirror.position.set(0, 1.0, 0.5); FX.mirror.visible = true;
    const dt = lt - fx.mirror * shot.dur;
    FX.mirrorGlass.visible = dt < 0;
    if (dt >= 0) {
      scene.updateMatrixWorld();
      const c0 = FX.mirror.getWorldPosition(V());
      FX.shards.forEach((s, i) => {
        s.visible = true;
        const vx = (hash(i) - 0.5) * 2.4, vy = hash(i + 3) * 2.5, vz = (hash(i + 5) - 0.5) * 2.4;
        const tt = Math.min(dt, 1.0);
        s.position.set(c0.x + vx * tt, Math.max(0.15, c0.y + (hash(i + 9) - 0.5) * 0.8 + vy * tt - 4.9 * tt * tt), c0.z + vz * tt);
        s.rotation.set(tt * 9 * hash(i + 1), tt * 7, tt * 3);
      });
    }
  } else if (FX.mirror.parent) FX.mirror.parent.remove(FX.mirror);
  if (fx.shards) FX.shards.forEach((s, i) => {
    s.visible = true;
    s.position.set(-11.6 + (hash(i) - 0.5) * 2.4, 0.14, -5.3 + (hash(i + 5) - 0.5) * 1.6);
    s.rotation.set(-Math.PI / 2, 0, hash(i + 2) * 6);
  });
  if (fx.paper !== undefined) {
    CL.paper.visible = true;
    const k = smooth((u - (fx.paper - 0.2)) / 0.2);
    const from = handOf('prof', 1), to = V(0, 0.83, 0.85);
    CL.paper.position.copy(from.lerp(to, k)); CL.paper.position.y += Math.sin(k * Math.PI) * 0.4;
    CL.paper.rotation.set(0, (1 - k) * 4, 0);
  }
  if (fx.dogs) {
    const zp = chars.zinho.root.position;
    FX.dogs.forEach((d, i) => {
      d.g.visible = true;
      if (fx.dogs.idle) {
        d.g.position.set(-20.5 + i * 0.3, 0, -1.4 + i * 1.5);
        d.g.rotation.y = Math.atan2(zp.x - d.g.position.x, zp.z - d.g.position.z);
        d.legs.forEach((l) => { l.rotation.x = 0; });
        d.head.position.y = 0.72 + Math.abs(Math.sin(T * 8 + i)) * 0.04;
        d.tail.rotation.z = Math.sin(T * 10 + i) * 0.4;
      } else {
        const sp = actors.zinho; const dir = V(sp.to[0] - sp.p[0], 0, sp.to[1] - sp.p[1]).normalize();
        const back = 1.7 + i * 1.1 + Math.sin(T * 3 + i) * 0.2;
        d.g.position.set(zp.x - dir.x * back + dir.z * (i - 1) * 0.7, Math.abs(Math.sin(T * 14 + i)) * 0.12, zp.z - dir.z * back - dir.x * (i - 1) * 0.7);
        d.g.rotation.y = Math.atan2(dir.x, dir.z);
        d.legs.forEach((l, j) => { l.rotation.x = Math.sin(T * 16 + (j % 2) * Math.PI + (j > 1 ? 1.2 : 0)) * 0.9; });
        d.tail.rotation.z = Math.sin(T * 14 + i) * 0.5;
      }
    });
  }
  if (fx.alarm !== undefined && lt > fx.alarm * shot.dur) {
    const on = Math.floor(T * 4) % 2 === 0;
    ST.car2.userData.lights.forEach((l, i) => { l.material.color.set(on ? (i % 2 ? '#ff3b3b' : '#ffd36b') : '#555'); });
    fxLight2.position.set(-3, 3.2, -5.6); // alarme da casa vizinha
    fxLight2.intensity = on ? 30 : 0;
  } else ST.car2.userData.lights.forEach((l, i) => { l.material.color.set(i % 2 ? '#c0392b' : '#ffe9a8'); });
  if (fx.meteor) {
    const p = lerp(fx.meteor[0], fx.meteor[1], u);
    if (p < 0.985) {
      const m = meteorPos(p);
      FX.meteor.visible = true; FX.meteor.position.copy(m);
      FX.meteor.rotation.set(T * 2, T * 3, 0);
      FX.meteorGlow.scale.setScalar(26 + Math.sin(T * 20) * 2);
      FX.trail.forEach((s, i) => { s.visible = true; s.position.copy(meteorPos(Math.max(0, p - (i + 1) * 0.012))); });
      fxLight.color.set('#ff9a4a'); fxLight.position.copy(m); fxLight.intensity = 30 + 600 * Math.pow(p, 4); fxLight.distance = 200;
      skyU.bot.value.lerp(new THREE.Color('#ff8a50'), 0.5 * Math.pow(p, 2));
    }
  }
  if (fx.meteorGlow !== undefined) {
    const v = fx.meteorGlow + u * 0.15;
    fxLight.color.set('#ff9440'); fxLight.position.set(2, 6, -12); fxLight.distance = 60;
    fxLight.intensity = (120 + Math.sin(T * 25) * 15) * v;
    skyU.top.value.lerp(new THREE.Color('#ff7a3a'), 0.5 * v); skyU.bot.value.lerp(new THREE.Color('#ffb070'), 0.6 * v);
  }
  let impactShake = 0, flashOv = flash * 0.25;
  if (fx.impact !== undefined) {
    const dt = lt - fx.impact * shot.dur;
    if (dt >= 0) {
      FX.crater.visible = true;
      flashOv = Math.max(flashOv, clamp(1 - dt / 0.9));
      impactShake = clamp(1 - dt / 2.2) * 0.6;
      FX.smoke.forEach((s, i) => {
        s.visible = true; const k = clamp(dt / 4 + hash(i) * 0.1);
        const a = hash(i + 4) * 6.28;
        s.position.set(10 + Math.cos(a) * k * 4, 0.6 + k * (3 + hash(i) * 4), -9.5 + Math.sin(a) * k * 3);
        s.scale.setScalar(0.6 + k * 2.4); s.material.opacity = 0.85 * (1 - k * 0.7);
      });
      FX.debris.forEach((d, i) => {
        d.visible = true; const tt = Math.min(dt, 1.6), a = hash(i) * 6.28, v = 3 + hash(i + 1) * 5;
        d.position.set(10 + Math.cos(a) * v * tt * 0.6, Math.max(0.12, 0.5 + (6 + hash(i + 2) * 5) * tt - 4.9 * tt * tt), -9.5 + Math.sin(a) * v * tt * 0.6);
        d.rotation.set(tt * 5, tt * 4, 0);
      });
      fxLight.color.set('#ffb36b'); fxLight.position.set(10, 3, -9.5); fxLight.intensity = 400 * clamp(1 - dt / 1.5) + 40; fxLight.distance = 60;
    }
  }
  if (fx.crater) {
    FX.crater.visible = true;
    FX.crystal.rotation.y = T * 0.6; FX.crystal.position.y = 0.6 + Math.sin(T * 2) * 0.05;
    FX.crystalGlow.scale.setScalar(4.5 + Math.sin(T * 4) * 0.6);
    fxLight.color.set('#7ef9ff'); fxLight.position.set(10, 1.5, -9.5); fxLight.intensity = 5 + Math.sin(T * 4) * 1; fxLight.distance = 14;
    FX.sparkles.forEach((s, i) => {
      s.visible = true; const a = T * 0.8 + i * 0.9;
      s.position.set(10 + Math.cos(a) * (0.8 + hash(i)), 0.8 + ((T * 0.4 + hash(i)) % 1) * 2, -9.5 + Math.sin(a) * (0.8 + hash(i)));
      const tw = 0.5 + 0.5 * Math.sin(T * 7 + i * 2); s.scale.setScalar(0.1 + 0.2 * tw); s.material.opacity = tw;
    });
  }
  if (fx.smoke) FX.smoke.forEach((s, i) => {
    s.visible = true; const k = ((T * 0.08 + hash(i)) % 1);
    s.position.set(10 + Math.sin(i * 2.1) * 1.5, 0.5 + k * 5, -9.8 + Math.cos(i * 1.7) * 1.2);
    s.scale.setScalar(0.5 + k * 1.6); s.material.opacity = 0.55 * (1 - k);
  });
  if (fx.fridge !== undefined || fx.fridgeOpen) {
    const k = fx.fridgeOpen ? 1 : smooth((u - (fx.fridge - 0.12)) / 0.12);
    const fallK = fx.fridgeOpen ? 1 : smooth((u - fx.fridge) / 0.08);
    KT.door.rotation.y = -1.4 * k * (1 - fallK);
    if (fallK > 0) {
      KT.door.position.set(lerp(3.15, 3.1, fallK), lerp(1.05, 0.1, fallK), lerp(-2.53, -1.4, fallK));
      KT.door.rotation.x = -Math.PI / 2 * fallK;
    }
  }
  if (fx.sparks) for (const su of fx.sparks) {
    const dt = lt - su * shot.dur;
    if (dt >= 0 && dt < 0.5) {
      const h = handOf('zinho', 1);
      FX.sparks.forEach((s, i) => {
        s.visible = true; const v = V(hash(i) - 0.5, hash(i + 1) * 0.8, hash(i + 2) - 0.5).multiplyScalar(4);
        s.position.copy(h).addScaledVector(v, dt); s.position.y -= 3 * dt * dt; s.lookAt(s.position.clone().add(v));
      });
      fxLight.color.set('#fff2a0'); fxLight.position.copy(h); fxLight.intensity = 20 * (1 - dt / 0.5); fxLight.distance = 8;
    }
  }
  if (fx.coins) FX.coins.forEach((c, i) => {
    c.visible = true;
    const hp = chars.zinho.root.position;
    const y = 7 - ((T * 1.6 + hash(i) * 8) % 8);
    c.position.set(hp.x + (hash(i + 1) - 0.5) * 9, y, hp.z + (hash(i + 2) - 0.5) * 4 + 0.5);
    c.rotation.set(T * 3 + i, T * 2, Math.PI / 2);
  });
  if (fx.clock) {
    const h = lerp(fx.clock[0], fx.clock[1], smooth(u / 0.8));
    BR.minHand.rotation.z = -(h % 1) * Math.PI * 2;
    BR.hourHand.rotation.z = -((h % 12) / 12) * Math.PI * 2;
    const hh = Math.floor(h) % 24, mm = Math.floor((h % 1) * 60 + 1e-6);
    const txt = String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0');
    if (txt !== lastDigital) {
      lastDigital = txt;
      const { g, c } = BR.digital.userData;
      g.fillStyle = '#111'; g.fillRect(0, 0, c.width, c.height);
      g.fillStyle = '#ff3030'; g.font = '700 92px JetBrains Mono, monospace'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(txt, c.width / 2, c.height / 2 + 4); BR.digital.needsUpdate = true;
    }
  } else {
    BR.minHand.rotation.z = -Math.PI * 0.3; BR.hourHand.rotation.z = -Math.PI * 0.7;
  }
  if (shot.set === 'classroom' && shot.board !== lastBoard) { lastBoard = shot.board; drawBoard(shot.board); }

  // ─── Short: mamute, capim, estilo ───
  if (fx.mammoth) {
    const m = fx.mammoth, k = m.to ? smooth((u - (m.t0 ?? 0)) / ((m.t1 ?? 1) - (m.t0 ?? 0))) : 0;
    const x = m.to ? lerp(m.p[0], m.to[0], k) : m.p[0], z = m.to ? lerp(m.p[1], m.to[1], k) : m.p[1];
    FX.mam.visible = true; FX.mam.position.set(x, 0, z);
    FX.mam.rotation.y = (m.r ?? (m.to ? Math.atan2(m.to[0] - m.p[0], m.to[1] - m.p[1]) / D2R : 0)) * D2R;
    const moving = m.to && k > 0 && k < 1, sp = m.a === 'charge' ? 9 : 4;
    FX.mamLegs.forEach((l, i) => { l.rotation.x = moving ? Math.sin(T * sp + (i === 0 || i === 3 ? 0 : Math.PI)) * (m.a === 'charge' ? 0.55 : 0.3) : 0; });
    FX.mam.position.y = moving ? Math.abs(Math.sin(T * sp)) * (m.a === 'charge' ? 0.25 : 0.08) : 0;
    const roar = m.a === 'roar' ? pulse(u, m.ru ?? 0.2, (m.ru ?? 0.2) + 0.6) : 0;
    FX.mamHead.rotation.x = -0.35 * roar + Math.sin(T * 1.3) * 0.04;
    FX.trunk.forEach((sg, i) => { sg.rotation.x = -roar * 0.45 + Math.sin(T * 2 + i * 0.6) * 0.12 * (1 - roar) + 0.08; sg.rotation.z = Math.sin(T * 1.4 + i) * 0.05; });
    FX.mamTail.rotation.z = Math.sin(T * 3) * 0.3;
    if (roar > 0.3) impactShakeExtra = Math.max(impactShakeExtra, 0.12 * roar);
  }
  if (fx.smokeHands) FX.dust.forEach((d, i) => {
    const h = handOf('zinho', i % 2), k = ((T * 0.9 + i / 6) % 1);
    d.visible = true; d.position.copy(h).add(V(Math.sin(i * 2) * 0.1, 0.1 + k * 0.9, 0.1)); d.scale.setScalar(0.12 + k * 0.35); d.material.opacity = 0.6 * (1 - k);
  });
  if (fx.mammoth && fx.mammoth.a === 'charge' && FX.mam.visible) FX.smoke.forEach((sm, i) => {
    const k = ((T * 1.2 + i / FX.smoke.length) % 1), leg = FX.mamLegs[i % 4].getWorldPosition(V());
    sm.visible = true; sm.position.set(leg.x + (hash(i) - 0.5) * 1.2, 0.3 + k * 1.4, leg.z - k * 1.5 * Math.cos(FX.mam.rotation.y));
    sm.scale.setScalar(0.4 + k * 1.2); sm.material.opacity = 0.55 * (1 - k); sm.material.color.set('#d9c29a');
  });
  if (fx.wave !== undefined && lt >= fx.wave * shot.dur) {
    const h = handOf('zinho', 1), dt = lt - fx.wave * shot.dur, k = (dt % 0.7) / 0.7;
    FX.wave.visible = true; FX.wave.position.copy(h); FX.wave.scale.setScalar(0.3 + k * 6); FX.wave.material.opacity = 0.8 * (1 - k);
    FX.wave.lookAt(camera.position);
  }
  if (shot.set === 'wild') WL.grass.forEach((g) => { g.rotation.z = Math.sin(T * 1.6 + g.userData.h * 9) * 0.12; g.rotation.x = Math.cos(T * 1.2 + g.userData.h * 7) * 0.06; });
  for (const c of Object.values(chars)) c.face.blush.forEach((b) => { b.visible = !!shot.style2 && c.root.visible; });

  // ─── mundo vazio ───
  stars.visible = shot.set === 'street' && (shot.tod === 'night');
  if (fx.overgrow) FX.weeds.forEach((w) => {
    const [x, z, s0, h] = w.userData.base;
    const lv = clamp(fx.overgrow * 1.3 - h * 0.3);
    if (lv <= 0.02) return;
    if (Math.abs(x + 1.7) < 2.2 && z < -4.2) return;
    w.visible = true; w.scale.setScalar(s0 + lv * (0.45 + 0.55 * h)); w.position.set(x, groundY('street', x, z) + 0.15 * lv, z);
    w.rotation.z = Math.sin(T * 1.3 + h * 10) * 0.05;
  });
  if (fx.abandoned) {
    ST.car1.position.set(6.5, 0, 0.9); ST.car1.rotation.y = 0.35;
    ST.car2.position.set(-9, 0, -0.8); ST.car2.rotation.y = Math.PI - 0.5;
    FX.bus.visible = true; FX.bus.position.set(-22, 0, -1.4); FX.bus.rotation.y = 0.12;
  } else { ST.car2.rotation.y = Math.PI; FX.bus.rotation.y = 0; }
  if (fx.fire) {
    FX.fire.visible = true; FX.fire.position.set(fx.fire[0], groundY(shot.set, fx.fire[0], fx.fire[1]), fx.fire[1]);
    const ign = fx.fireIn !== undefined ? smooth((u - fx.fireIn) / 0.12) : 1;
    FX.flames.forEach((f, i) => { f.visible = ign > 0.01; f.scale.set(ign, ign * (0.8 + 0.35 * Math.abs(Math.sin(T * (7 + i * 3) + i))), ign); f.rotation.y = T * (1 + i); });
    FX.fireGlow.visible = ign > 0.01;
    if (fx.fireIn !== undefined && u > fx.fireIn && u < fx.fireIn + 0.2) FX.sparks.forEach((sp, i) => {
      const dt = (u - fx.fireIn) * shot.dur; sp.visible = true;
      const v = V(hash(i) - 0.5, 0.8 + hash(i + 1), hash(i + 2) - 0.5).multiplyScalar(2.4);
      sp.position.set(fx.fire[0] + v.x * dt, 0.3 + v.y * dt - 2 * dt * dt, fx.fire[1] + v.z * dt);
    });
    FX.fireGlow.scale.setScalar(3.2 + Math.sin(T * 11) * 0.3);
    fxLight2.color.set('#ff9a40'); fxLight2.position.set(fx.fire[0], 0.9, fx.fire[1]); fxLight2.intensity = ign * (4 + Math.sin(T * 13) * 0.8 + Math.sin(T * 7.3) * 0.6); fxLight2.distance = 9;
  }
  if (fx.roadText) { FX.roadText.visible = true; if (fx.roadText !== lastRoadText) { lastRoadText = fx.roadText; drawRoadText(fx.roadText); } FX.roadText.material.opacity = clamp(fx.roadIn !== undefined ? (u - fx.roadIn) / 0.25 : 1); }
  if (fx.plates) FX.plates.forEach((p, i) => { p.visible = i < fx.plates; });
  if (fx.tally !== undefined) { FX.tally.visible = true; const n = Array.isArray(fx.tally) ? Math.round(lerp(fx.tally[0], fx.tally[1], smooth(u / 0.8))) : fx.tally; if (n !== lastTally) { lastTally = n; drawTally(n); } }
  if (fx.catAt || fx.catFollow) {
    FX.cat.visible = true;
    const zr = chars.zinho.root;
    let px, pz, ry, moving = false;
    if (fx.catAt) { [px, pz] = fx.catAt; ry = (fx.catAt[2] ?? 0) * D2R; }
    else {
      const a = zr.rotation.y, sp = actors.zinho || {};
      px = zr.position.x + Math.sin(a + 1.9) * 0.75; pz = zr.position.z + Math.cos(a + 1.9) * 0.75; ry = a;
      moving = !!sp.to && u > 0 && u < 1;
    }
    FX.cat.position.set(px, groundY(shot.set, px, pz), pz); FX.cat.rotation.y = ry;
    FX.catLegs.forEach((l, i) => { l.rotation.x = moving ? Math.sin(T * 12 + (i % 2 ? Math.PI : 0) + (i > 1 ? Math.PI / 2 : 0)) * 0.5 : 0; });
    FX.catTail.rotation.z = Math.sin(T * 2.5) * 0.45;
  }
  if (fx.dogsFollow) {
    const zr = chars.zinho.root, sp = actors.zinho || {}, moving = !!sp.to && u > 0 && u < 1;
    FX.dogs.forEach((d, i) => {
      d.g.visible = true;
      const a = zr.rotation.y + Math.PI + (i - 1) * 0.6, r = 1.6 + i * 0.35;
      d.g.position.set(zr.position.x + Math.sin(a) * r, moving ? Math.abs(Math.sin(T * 10 + i)) * 0.06 : 0, zr.position.z + Math.cos(a) * r);
      d.g.rotation.y = zr.rotation.y + (moving ? 0 : (i - 1) * 0.5);
      d.legs.forEach((l, j) => { l.rotation.x = moving ? Math.sin(T * 10 + (j % 2) * Math.PI + (j > 1 ? 1.2 : 0)) * 0.6 : 0; });
      d.tail.rotation.z = Math.sin(T * 9 + i) * 0.5;
      d.head.position.y = 0.72;
    });
  }

  // ─── ouro ───
  for (const k of Object.keys(goldables)) setGold(k, false);
  if (fx.gold) {
    let si = 0;
    for (const [k, gu] of Object.entries(fx.gold)) {
      const dt = lt - gu * shot.dur;
      if (dt < 0) continue;
      setGold(k, true);
      if (gu > 0 && dt < 0.9) {
        scene.updateMatrixWorld();
        _box.setFromObject(goldables[k][0]); const ctr = _box.getCenter(V()), size = _box.getSize(V()).length();
        for (let j = 0; j < 8 && si < FX.sparkles.length; j++, si++) {
          const sp = FX.sparkles[si]; sp.visible = true;
          const a = j * 0.785 + T, r = (0.3 + dt * 1.2) * Math.max(0.5, size * 0.4);
          sp.position.set(ctr.x + Math.cos(a) * r, ctr.y + Math.sin(a * 1.7) * r * 0.6, ctr.z + Math.sin(a) * r * 0.5);
          sp.scale.setScalar(0.25 * (1 - dt / 0.9) + 0.05); sp.material.opacity = 1 - dt / 0.9;
        }
        fxLight.color.set('#ffd36b'); fxLight.position.copy(ctr).add(V(0, 0.5, 0.6)); fxLight.intensity = 6 * (1 - dt / 0.9); fxLight.distance = 4;
      }
    }
  }
  if (fx.sparkleHands) FX.sparkles.forEach((sp, i) => {
    if (i % 2) return;
    const h = handOf('zinho', (i >> 1) % 2); sp.visible = true; const a = T * 2 + i;
    sp.position.copy(h).add(V(Math.cos(a) * 0.18, Math.sin(a * 1.3) * 0.18, Math.sin(a) * 0.12));
    const tw = 0.5 + 0.5 * Math.sin(T * 8 + i); sp.scale.setScalar(0.04 + 0.1 * tw); sp.material.opacity = tw;
  });
  if (fx.star) {
    const k = (u - fx.star[0]) / (fx.star[1] - fx.star[0]);
    if (k > 0 && k < 1) {
      const A = V(160, 42, -90), B = V(160, 26, 70), at = (x) => A.clone().lerp(B, clamp(x));
      FX.meteor.visible = true; FX.meteor.position.copy(at(k)); FX.meteor.scale.setScalar(0.5);
      FX.meteorGlow.scale.setScalar(18);
      FX.trail.forEach((sp, i) => { sp.visible = true; sp.position.copy(at(k - (i + 1) * 0.012)); });
    }
  } else FX.meteor.scale.setScalar(1);
  if (fx.goldpile) {
    const [n, gx, gz, where] = fx.goldpile;
    FX.pile.visible = true; FX.pile.position.set(gx, where ? 0 : groundY(shot.set, gx, gz), gz);
    FX.pile.children.forEach((b) => { b.visible = b.userData.i < n; });
  }
  if (fx.stalker) {
    ST.car2.position.set(4.5, 0, 1.8);
    ST.car2.userData.lights.forEach((l, i) => { l.material.color.set(i % 2 ? '#c0392b' : '#fff6c8'); });
  }
  if (fx.phoneLight !== undefined && lt >= fx.phoneLight * shot.dur) {
    // tela do celular acesa: luz branca forte na mão do Zinho
    const h = handOf('zinho', 1), dt = lt - fx.phoneLight * shot.dur;
    fxLight.color.set('#e8f4ff'); fxLight.position.copy(h).add(V(0, 0.2, 0.3)); fxLight.distance = 6;
    fxLight.intensity = (dt < 0.15 ? 40 : 14) + Math.sin(T * 30) * 2;
    FX.sparkles.slice(0, 6).forEach((sp, i) => { sp.visible = true; const a = T * 3 + i; sp.position.copy(h).add(V(Math.cos(a) * 0.15, 0.12 + Math.sin(a * 1.5) * 0.1, 0.12)); sp.scale.setScalar(0.06 + 0.05 * Math.sin(T * 9 + i)); });
  }
  if (fx.flashAt !== undefined) { const dt = lt - fx.flashAt * shot.dur; if (dt >= 0) flashOv = Math.max(flashOv, clamp(1 - dt / 1.2)); }

  // ─── câmara ───
  const c = shot.cam;
  let cp, look;
  if (c.pos) {
    const k = smooth(u);
    cp = V(...c.pos).lerp(V(...(c.pos2 || c.pos)), k);
    look = V(...c.look).lerp(V(...(c.look2 || c.look)), k);
  } else {
    const tgt = headOf(c.at);
    const a = chars[c.at].root.rotation.y + (c.yaw || 0) * D2R;
    const d = c.d * (1 - (c.push || 0) * smooth(u));
    cp = V(tgt.x + Math.sin(a) * d, tgt.y + (c.h || 0), tgt.z + Math.cos(a) * d);
    look = tgt.clone(); look.y -= 0.22 * Math.min(1, d / 2.5);
  }
  cp.x += Math.sin(T * 0.7) * 0.025; cp.y += Math.sin(T * 0.9 + 1) * 0.02;
  let shake = (shot.shake || 0) + impactShake + impactShakeExtra;
  if (shake) { cp.x += (hash(Math.floor(T * 30)) - 0.5) * shake; cp.y += (hash(Math.floor(T * 30) + 7) - 0.5) * shake; }
  camera.position.copy(cp); camera.lookAt(look);
  camera.fov = c.fov || 42; camera.updateProjectionMatrix();
  sky.position.copy(camera.position);
  stars.position.copy(camera.position);
  for (const w of FX.weeds) if (w.visible && w.position.distanceTo(camera.position) < 1.8) w.visible = false;
  fill.position.copy(camera.position);
  // estilo 2: luz de contorno por trás do assunto + correção de cor
  if (shot.style2) {
    rim.intensity = shot.tod === 'cave' ? 1.6 : 1.3; rim.color.set(shot.tod === 'cave' ? '#ffa860' : '#fff1d6');
    rim.target.position.copy(look); rim.position.copy(look).add(look.clone().sub(camera.position).setY(0).normalize().multiplyScalar(10)).add(V(0, 6, 0));
    renderer.domElement.style.filter = 'saturate(1.32) contrast(1.08) brightness(1.03)';
  } else { rim.intensity = 0; renderer.domElement.style.filter = 'none'; }
  // sombra segue o foco
  const dir = V(...tod.dir).normalize();
  sun.target.position.copy(look); sun.position.copy(look).addScaledVector(dir, 40);

  // ─── overlays ───
  const hud = $('hud');
  const showHud = shot.hud && (shot.hudIn === undefined || u >= shot.hudIn);
  hud.style.display = showHud ? 'flex' : 'none';
  if (showHud) {
    const [mode, d, mult] = shot.hud;
    const key = shot.hud.join('|');
    if (key !== lastHudKey) {
      lastHudKey = key;
      hud.className = 'ov ' + mode;
      hud.querySelector('.icon').innerHTML = ICON[mode];
      hud.querySelector('.day').textContent = 'DIA ' + d;
      hud.querySelector('.val').textContent = mode === 'fome' ? 'FOME ' + mult : mode === 'pessoas' ? 'PESSOAS NO MUNDO: ' + mult : mode === 'ouro' ? 'OURO ' + mult : (mode === 'azar' ? 'AZAR x' : 'SORTE x') + fmtMult(mult);
    }
    const changed = !prev || !prev.hud || prev.hud.join('|') !== key || shot.hudIn !== undefined;
    const t0 = shot.hudIn !== undefined ? shot.hudIn * shot.dur : 0;
    const k = changed ? clamp((lt - t0) / 0.6) : 1;
    const sc = 1 + 0.35 * Math.sin(Math.PI * k) * (1 - k);
    hud.style.transform = `scale(${sc})`;
    hud.style.filter = changed && k < 0.5 && Math.floor(T * 30) % 2 ? 'hue-rotate(90deg) brightness(1.6)' : 'none';
  }
  $('lb').style.display = shot.letterbox ? 'block' : 'none';
  let fade = 0;
  if (shot.fadeIn) fade = Math.max(fade, 1 - clamp(lt / shot.fadeIn));
  if (shot.fadeOut) fade = Math.max(fade, clamp((lt - (shot.dur - shot.fadeOut)) / shot.fadeOut));
  if (shot.black) fade = 1;
  $('fade').style.opacity = fade;
  const card = $('card');
  if (shot.card) {
    card.style.display = 'flex';
    if (card.dataset.k !== shot.card.t) { card.innerHTML = `<div class="ct">${shot.card.t}</div>${shot.card.s ? `<div class="cs">${shot.card.s}</div>` : ''}`; card.dataset.k = shot.card.t; }
    const a0 = shot.card.at ?? 0.08, k = clamp((u - a0) / 0.15) * (1 - clamp((u - 0.88) / 0.1));
    card.style.opacity = k; card.style.transform = `translateY(${(1 - k) * 2}vh) scale(${1 + 0.04 * u})`;
  } else card.style.display = 'none';
  const st = $('stamp');
  if (shot.stamp && lt < 1.8) {
    st.style.display = 'block';
    if (st.textContent !== shot.stamp) {
      // ajusta o tamanho para caber sempre na largura do ecrã (formato vertical incluído)
      st.textContent = shot.stamp; st.style.fontSize = ''; st.style.transform = 'none';
      const max = innerWidth * 0.9; let fs = parseFloat(getComputedStyle(st).fontSize);
      while (st.scrollWidth > max && fs > 12) { fs *= 0.92; st.style.fontSize = fs + 'px'; }
    }
    st.className = 'ov' + (/13|10/.test(shot.stamp) ? ' red' : '');
    const sc = lt < 0.18 ? lerp(2.6, 1, easeOut(lt / 0.18)) : 1 + 0.015 * Math.sin(lt * 8);
    st.style.opacity = lt > 1.45 ? 1 - (lt - 1.45) / 0.35 : 1;
    st.style.transform = `translate(-50%, -50%) scale(${sc}) rotate(-4deg)`;
  } else st.style.display = 'none';
  const cap = $('cap');
  if (shot.cap && !shot.endcard) {
    const words = shot.text.replace(/\.\.\./g, '…').split(/\s+/).filter(Boolean);
    const k = clamp((T - shot.vstart) / Math.max(0.3, shot.vdur));
    const cur = Math.min(words.length - 1, Math.floor(k * words.length));
    const vis = T < shot.vstart ? 0 : cur + 1;
    cap.style.display = vis ? 'block' : 'none';
    const st = Math.max(0, cur - (cur % 4)), chunk = words.slice(st, Math.min(words.length, st + 4));
    cap.innerHTML = chunk.map((w, i) => `<span class="${st + i === cur ? 'on' : ''}" style="opacity:${st + i <= cur ? 1 : 0.0}">${w}</span>`).join(' ');
    const pop = st + 0 === cur ? 1 + 0.12 * (1 - clamp(((T - shot.vstart) - cur / words.length * shot.vdur) / 0.12)) : 1;
    cap.style.transform = `translateX(-50%) scale(${pop})`;
  } else cap.style.display = 'none';
  const calc = $('calc');
  if (fx.calc) {
    const n = fx.calc.length, show = Math.min(n, Math.floor(u * (n + 1) * 1.05) + 1);
    calc.innerHTML = fx.calc.slice(0, show).map((s, i) => `<span style="color:${i === n - 1 && show === n ? '#ff4d4d' : '#fff'}">${s}</span>`).join('<span>→</span>');
  } else calc.innerHTML = '';
  $('flash').style.opacity = flashOv;
  const ec = $('endcard');
  if (shot.endcard) {
    ec.style.display = 'flex';
    const html = shot.endcard === 'comment'
      ? `<div class="logo">ZINHO, O <b>SORTUDO</b></div><div class="bubble">${shot.endcardText || 'Comenta “PARTE 2” ↓'}</div>`
      : '<div class="logo">ZINHO, O <b>SORTUDO</b></div><div class="sub">INSCREVA-SE<span class="bell">🔔</span></div>';
    if (ec.dataset.k !== shot.endcard) { ec.innerHTML = html; ec.dataset.k = shot.endcard; }
    const k = easeOut(lt / 0.4);
    ec.style.transform = `translateY(${(1 - k) * 30}vh) scale(${1 + 0.03 * Math.sin(T * 4)})`;
  } else ec.style.display = 'none';

  renderer.render(scene, camera);
}

window.__setup = (tl) => { TL = tl; drawBoard(null); window.__ready = true; return TL.shots.length; };
window.__render = (t) => { render(t); return true; };
window.__loaded = true;
