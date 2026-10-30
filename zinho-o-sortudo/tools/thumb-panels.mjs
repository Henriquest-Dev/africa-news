// Thumbnail em painéis lado a lado (estilo "antes → depois"): cada painel é um quadro do episódio com um
// número/rótulo enorme no topo, a mostrar a escalada (ex.: 0,5 KG | 60 KG | 1 TONELADA). Sem título por cima.
//   node tools/thumb-panels.mjs --scene automation/thumbs/02-ouro.json     (planos montados para a thumb; recomendado)
//   node tools/thumb-panels.mjs --ep 02-ouro --panels "39.4:0,5 KG|89:60 KG|210@1.2:1 TONELADA" [--out out/x.jpg]
// Cada painel: <segundo>[@zoom][^deslocamento-x em %]:<rótulo>. Saída padrão: out/thumb-<ep>.jpg (1280x720).
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const { chromium } = createRequire(import.meta.url)('playwright');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const W = 1280, H = 720, GAP = 6;

const scene = arg('scene');
const ep = arg('ep') || (scene ? path.basename(scene, '.json') : (await readFile(path.join(ROOT, 'build/current.txt'), 'utf8')).trim());
let tl, panels;
if (scene) {
  // modo cena: cada painel é um plano montado só para a thumb (cenário, câmara, atores, efeitos)
  const spec = JSON.parse(await readFile(path.resolve(ROOT, scene), 'utf8'));
  tl = { fps: 30, total: spec.length * 2, shots: spec.map((p, i) => ({ who: 'NAR', text: '', ...p.shot, start: i * 2, dur: 2, vstart: i * 2, vdur: 2, env: [] })) };
  panels = spec.map((p, i) => ({ t: i * 2 + 1.9, zoom: p.zoom ?? 1, shift: p.shift ?? 0, label: p.label }));
} else {
tl = JSON.parse(await readFile(path.join(ROOT, 'build', ep, 'timeline.json'), 'utf8'));
panels = arg('panels').split('|').map((p) => {
  const i = p.indexOf(':'), spec = p.slice(0, i), label = p.slice(i + 1);
  const [, t, z, sx] = spec.match(/^([\d.]+)(?:@([\d.]+))?(?:\^(-?[\d.]+))?$/);
  return { t: +t, zoom: z ? +z : 1, shift: sx ? +sx : 0, label };
});
}
const pw = Math.round((W - GAP * (panels.length - 1)) / panels.length);

const srv = createServer(async (q, r) => {
  const p = path.join(ROOT, decodeURIComponent(new URL(q.url, 'http://x').pathname));
  if (!existsSync(p)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'Content-Type': p.endsWith('.js') ? 'text/javascript' : 'text/html' }); r.end(await readFile(p));
}).listen(0, async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const shots = [];
  for (const pn of panels) {
    const page = await b.newPage({ viewport: { width: pw, height: H } });
    await page.goto(`http://127.0.0.1:${srv.address().port}/web/index.html?w=${pw}&h=${H}`);
    await page.waitForFunction(() => window.__loaded === true);
    await page.evaluate((t) => window.__setup(t), tl);
    await page.evaluate((t) => window.__render(t), pn.t);
    await page.evaluate(([z, sx]) => {
      for (const id of ['cap', 'lb', 'card', 'endcard', 'stamp', 'calc', 'fade', 'hud']) { const e = document.getElementById(id); if (e) e.style.display = 'none'; }
      const c = document.querySelector('#stage canvas'); c.style.transformOrigin = 'center'; c.style.transform = `translateX(${sx}%) scale(${z})`;
      // cores mais vivas, como nas thumbs do nicho
      c.style.filter = 'saturate(1.35) contrast(1.08) brightness(1.05)';
    }, [pn.zoom, pn.shift]);
    shots.push((await page.screenshot({ type: 'png' })).toString('base64'));
    await page.close();
  }
  const page = await b.newPage({ viewport: { width: W, height: H } });
  await page.setContent(`<!doctype html><html><head><style>
    body { margin: 0; width: ${W}px; height: ${H}px; background: #fff; display: flex; gap: ${GAP}px; overflow: hidden; }
    .p { position: relative; width: ${pw}px; height: ${H}px; overflow: hidden; }
    .p img { display: block; width: 100%; height: 100%; }
    .p::after { content: ''; position: absolute; inset: 0 0 auto 0; height: 34%; background: linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,0)); }
    .l { position: absolute; z-index: 2; top: 16px; left: 0; right: 0; text-align: center; font: 900 ${panels.length > 2 ? 104 : 132}px/0.95 'Inter', sans-serif;
         color: #fff; -webkit-text-stroke: 16px #111; paint-order: stroke fill; letter-spacing: -3px; transform: scaleX(0.84); transform-origin: center top;
         text-shadow: 0 8px 0 #111; white-space: nowrap; }
  </style></head><body>${panels.map((pn, i) => `<div class="p"><img src="data:image/png;base64,${shots[i]}"><div class="l"><span>${pn.label}</span></div></div>`).join('')}</body></html>`);
  await page.evaluate(async () => {
    await document.fonts.ready;
    // encolhe o rótulo até caber no painel
    for (const l of document.querySelectorAll('.l')) { const sp = l.firstChild; let s = parseFloat(getComputedStyle(l).fontSize); while (sp.offsetWidth * 0.84 > l.parentElement.clientWidth - 20 && s > 40) { s -= 4; l.style.fontSize = s + 'px'; } }
  });
  const out = path.resolve(ROOT, arg('out', `out/thumb-${ep}.jpg`));
  await page.screenshot({ path: out, type: 'jpeg', quality: 92 });
  console.log(out);
  await b.close(); srv.close();
});
