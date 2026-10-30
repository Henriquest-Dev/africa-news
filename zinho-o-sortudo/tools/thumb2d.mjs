// Thumbnail 2D em painéis com o Zinho em vetor (grátis, sem IA): fundo plano + efeitos + Zinho + rótulo enorme no topo.
//   node tools/thumb2d.mjs automation/thumbs2d/02-ouro.json [--out out/thumb-02-ouro.jpg]
//   node tools/thumb2d.mjs --sheet [--out assets/zinho2d/folha.png]    (folha de poses e expressões)
// Painel: { "label": "60 KG", "bg": "street", "fx": [["goldpile", {"x": 300}]],
//           "zinho": { "pose": "cheer", "expr": "happy", "prop": "none", "gold": true, "x": 0, "sc": 1 } }
// fundos: room roomNight kitchen classroom street streetDusk streetNight; efeitos: rays sparkles goldpile goldtree animals fire cars
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { zinho, bg, fx } from './zinho2d.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const W = 1280, H = 720, GAP = 8;

function panelSvg(p, w, h) {
  const z = p.zinho || {};
  const sc = z.sc ?? 1;
  const ch = zinho({ ...z, x: w / 2 + (z.x ?? 0), y: h - 16 + (z.y ?? 0), sc });
  const under = (p.fx || []).filter(([k, o]) => !(o && o.front)).map(([k, o]) => fx(k, w, h, o || {})).join('');
  const over = (p.fx || []).filter(([k, o]) => o && o.front).map(([k, o]) => fx(k, w, h, o || {})).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${bg(p.bg || 'room', w, h)}${under}${ch}${over}</svg>`;
}

const css = (n) => `body{margin:0;background:#fff;display:flex;gap:${GAP}px;width:${W}px;height:${H}px;overflow:hidden}
 .p{position:relative;overflow:hidden;height:${H}px} .p svg{display:block}
 .l{position:absolute;top:14px;left:0;right:0;text-align:center;font:900 ${n > 2 ? 108 : 136}px/1 Inter,sans-serif;color:#fff;-webkit-text-stroke:16px #111;
   paint-order:stroke fill;letter-spacing:-3px;transform:scaleX(.84);transform-origin:center top;text-shadow:0 8px 0 #111;white-space:nowrap}
 .l.a{color:#ffd23f}`;

async function shoot(html, out, w = W, h = H) {
  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: w, height: h } });
  await page.setContent(html);
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (const l of document.querySelectorAll('.l')) { const sp = l.firstChild; let s = parseFloat(getComputedStyle(l).fontSize); while (sp.offsetWidth * 0.84 > l.parentElement.clientWidth - 20 && s > 40) { s -= 4; l.style.fontSize = s + 'px'; } }
  });
  await page.screenshot({ path: out, type: out.endsWith('.png') ? 'png' : 'jpeg', ...(out.endsWith('.png') ? {} : { quality: 92 }) });
  await b.close();
  console.log(out);
}

if (process.argv.includes('--sheet')) {
  const poses = [['idle', 'happy'], ['cheer', 'happy'], ['head', 'shock'], ['hold', 'smug', 'goldbar'], ['point', 'angry'], ['shrug', 'worried'], ['idle', 'sad'], ['idle', 'tired'], ['hold', 'cry', 'radio'], ['cheer', 'happy', 'none', true]];
  const cw = 300, chh = 600;
  const cells = poses.map(([pose, expr, pr = 'none', gold = false]) => `<div style="width:${cw}px;height:${chh}px;background:#fff"><svg width="${cw}" height="${chh}">${zinho({ x: cw / 2, y: chh - 20, sc: 0.98, pose, expr, prop: pr, gold })}</svg><div style="text-align:center;font:700 22px Inter">${pose} · ${expr}</div></div>`).join('');
  await shoot(`<body style="margin:0;display:flex;flex-wrap:wrap;width:${cw * 5}px;background:#fff">${cells}</body>`, arg('out', 'assets/zinho2d/folha.png'), cw * 5, (chh + 30) * 2);
} else {
  const file = process.argv[2];
  const spec = JSON.parse(readFileSync(file, 'utf8'));
  const n = spec.length, pw = Math.round((W - GAP * (n - 1)) / n);
  const html = `<!doctype html><html><head><style>${css(n)}</style></head><body>${spec.map((p) => `<div class="p" style="width:${pw}px">${panelSvg(p, pw, H)}<div class="l${p.accent ? ' a' : ''}"><span>${p.label}</span></div></div>`).join('')}</body></html>`;
  await shoot(html, arg('out', `out/thumb-${path.basename(file, '.json')}.jpg`));
}
