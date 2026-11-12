// Renderiza os exemplos do visual "bonecos de blocos": node tools/blocky-demo.mjs  -> out/exemplo-blocos-1.jpg e -2.jpg
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const { chromium } = createRequire(import.meta.url)('playwright');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const W = 1080, H = 1920;
const srv = createServer(async (q, r) => {
  const p = path.join(ROOT, decodeURIComponent(new URL(q.url, 'http://x').pathname));
  if (!existsSync(p)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'Content-Type': p.endsWith('.js') ? 'text/javascript' : 'text/html' }); r.end(await readFile(p));
}).listen(0, async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  for (const cena of (process.argv[2] || '1,2').split(',')) {
    const page = await b.newPage({ viewport: { width: W, height: H } });
    page.on('pageerror', (e) => console.error('erro:', e.message));
    await page.goto(`http://127.0.0.1:${srv.address().port}/web/blocky-demo.html?cena=${cena}&w=${W}&h=${H}`);
    await page.waitForFunction(() => window.__done === true, null, { timeout: 180000 });
    const out = path.join(ROOT, `out/exemplo-blocos-${cena}.jpg`);
    await page.screenshot({ path: out, type: 'jpeg', quality: 93 });
    console.log(out); await page.close();
  }
  await b.close(); srv.close();
});
