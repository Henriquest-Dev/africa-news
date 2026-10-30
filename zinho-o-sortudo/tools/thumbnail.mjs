// Gera a thumbnail (1280x720 JPG) a partir de um quadro do episódio atual + título grande por cima.
//   node tools/thumbnail.mjs --t 12.5 --lines "E SE O SEU|AZAR|DOBRASSE?" [--accent 1] [--color #ff4040] [--badge "DIA 10"]
// --accent: índice da linha em destaque (cor --color). Saída: out/thumb-<episódio>.jpg
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const { chromium } = createRequire(import.meta.url)('playwright');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const W = 1280, H = 720;

const ep = (await readFile(path.join(ROOT, 'build/current.txt'), 'utf8')).trim();
const tl = JSON.parse(await readFile(path.join(ROOT, 'build', ep, 'timeline.json'), 'utf8'));
const lines = arg('lines', 'E SE...?').split('|');
const accent = +arg('accent', 1), color = arg('color', '#ff4040'), badge = arg('badge', '');

const overlay = `
<style>
 #th { position:absolute; inset:0; font-family: Inter, sans-serif; z-index: 10; }
 #th .shade { position:absolute; inset:0; background: linear-gradient(90deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,.15) 55%, rgba(0,0,0,0) 75%); }
 #th .t { position:absolute; left:40px; top:50%; transform: translateY(-50%) rotate(-3deg); max-width: 760px; }
 #th .l { font: 900 96px/0.98 Inter; color:#fff; -webkit-text-stroke: 12px #111; paint-order: stroke fill; text-shadow: 0 9px 0 #111; letter-spacing: -2px; }
 #th .l.a { font-size: 132px; color: ${color}; }
 #th .badge { position:absolute; right:36px; top:30px; font: 900 44px Inter; color:#111; background:#ffd23f; padding: 8px 22px; border: 6px solid #111; border-radius: 16px; transform: rotate(4deg); box-shadow: 0 6px 0 #111; }
</style>
<div id="th"><div class="shade"></div><div class="t">${lines.map((l, i) => `<div class="l ${i === accent ? 'a' : ''}">${l}</div>`).join('')}</div>
${badge ? `<div class="badge">${badge}</div>` : ''}</div>`;

const srv = createServer(async (q, r) => {
  const p = path.join(ROOT, decodeURIComponent(new URL(q.url, 'http://x').pathname));
  if (!existsSync(p)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'Content-Type': p.endsWith('.js') ? 'text/javascript' : 'text/html' }); r.end(await readFile(p));
}).listen(0, async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const page = await b.newPage({ viewport: { width: W, height: H } });
  await page.goto(`http://127.0.0.1:${srv.address().port}/web/index.html?w=${W}&h=${H}`);
  await page.waitForFunction(() => window.__loaded === true);
  await page.evaluate((t) => window.__setup(t), tl);
  await page.evaluate((t) => window.__render(t), +arg('t', 5));
  // a thumbnail não leva legendas, faixas de cinema nem cartões
  await page.evaluate((html) => {
    for (const id of ['cap', 'lb', 'card', 'endcard', 'stamp', 'calc', 'fade', 'hud']) document.getElementById(id).style.display = 'none';
    document.getElementById('stage').insertAdjacentHTML('beforeend', html);
  }, overlay);
  await page.evaluate(() => document.fonts.ready);
  const out = path.join(ROOT, 'out', `thumb-${ep}.jpg`);
  await page.screenshot({ path: out, type: 'jpeg', quality: 90 });
  console.log(out);
  await b.close(); srv.close();
});
