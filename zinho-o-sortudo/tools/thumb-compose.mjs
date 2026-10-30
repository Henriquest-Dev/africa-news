// Junta imagens já geradas em painéis lado a lado com o rótulo enorme no topo (estilo do nicho).
//   node tools/thumb-compose.mjs --panels "a.jpg:0,5 KG|b.jpg:60 KG|c.jpg:1000 KG" --out out/thumb-02-ouro.jpg [--accent 2]
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const { chromium } = createRequire(import.meta.url)('playwright');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const W = 1280, H = 720, GAP = 6;
const panels = arg('panels').split('|').map((p) => { const i = p.indexOf(':'); return { img: p.slice(0, i), label: p.slice(i + 1) }; });
const accent = arg('accent') === undefined ? -1 : +arg('accent');
const n = panels.length, pw = Math.round((W - GAP * (n - 1)) / n);
const mime = (f) => (f.endsWith('.png') ? 'image/png' : 'image/jpeg');
const html = `<!doctype html><html><head><style>
 body{margin:0;width:${W}px;height:${H}px;background:#fff;display:flex;gap:${GAP}px;overflow:hidden}
 .p{position:relative;width:${pw}px;height:${H}px;overflow:hidden}
 .p img{display:block;width:100%;height:100%;object-fit:cover;object-position:center 40%;filter:saturate(1.12) contrast(1.04)}
 .p::after{content:'';position:absolute;inset:0 0 auto 0;height:32%;background:linear-gradient(rgba(0,0,0,.35),rgba(0,0,0,0))}
 .l{position:absolute;z-index:2;top:14px;left:0;right:0;text-align:center;font:900 ${n > 2 ? 104 : 132}px/1 Inter,sans-serif;color:#fff;-webkit-text-stroke:16px #111;
   paint-order:stroke fill;letter-spacing:-3px;transform:scaleX(.84);transform-origin:center top;text-shadow:0 8px 0 #111;white-space:nowrap}
 .l.a{color:#ffd23f}
</style></head><body>${panels.map((p, i) => `<div class="p"><img src="data:${mime(p.img)};base64,${readFileSync(p.img).toString('base64')}"><div class="l${i === accent ? ' a' : ''}"><span>${p.label}</span></div></div>`).join('')}</body></html>`;
const b = await chromium.launch();
const page = await b.newPage({ viewport: { width: W, height: H } });
await page.setContent(html);
await page.evaluate(async () => {
  await document.fonts.ready;
  for (const l of document.querySelectorAll('.l')) { const sp = l.firstChild; let s = parseFloat(getComputedStyle(l).fontSize); while (sp.offsetWidth * 0.84 > l.parentElement.clientWidth - 20 && s > 40) { s -= 4; l.style.fontSize = s + 'px'; } }
});
const out = path.resolve(arg('out', 'out/thumb.jpg'));
await page.screenshot({ path: out, type: 'jpeg', quality: 92 });
console.log(out);
await b.close();
