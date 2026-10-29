// Renderiza o vídeo quadro a quadro no Chromium headless e monta o MP4 com ffmpeg.
//
//   node tools/render.mjs                      vídeo completo -> out/zinho-azar-dobra.mp4
//   node tools/render.mjs --preview 3,40.5     só PNGs desses instantes -> out/preview/
//   node tools/render.mjs --from 60 --to 70    só um trecho
//   opções: --w 1920 --h 1080 --fps 30 --workers 4
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile, rename } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

// o Playwright pode estar instalado globalmente (NODE_PATH), que só o require() resolve
const { chromium } = createRequire(import.meta.url)('playwright');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const W = +arg('w', 1920), H = +arg('h', 1080), FPS = +arg('fps', 30), WORKERS = +arg('workers', 4);
const OUT = path.join(ROOT, 'out');

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json' };
function serve() {
  return new Promise((res) => {
    const srv = createServer(async (req, rsp) => {
      const p = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
      if (!p.startsWith(ROOT) || !existsSync(p)) { rsp.writeHead(404); return rsp.end(); }
      rsp.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' });
      rsp.end(await readFile(p));
    }).listen(0, '127.0.0.1', () => res(srv));
  });
}

async function openPage(browser, port, tl) {
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  page.on('pageerror', (e) => console.error('[page]', e.message));
  page.on('console', (m) => { if (m.type() === 'error') console.error('[console]', m.text()); });
  await page.goto(`http://127.0.0.1:${port}/web/index.html?w=${W}&h=${H}`);
  await page.waitForFunction(() => window.__loaded === true, null, { timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate((t) => window.__setup(t), tl);
  return page;
}

function ffmpeg(args) {
  const p = spawn('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => p.on('close', (c) => (c ? rej(new Error('ffmpeg ' + c)) : res())));
  return { stdin: p.stdin, done };
}

async function main() {
  const tl = JSON.parse(await readFile(path.join(ROOT, 'build/timeline.json'), 'utf8'));
  await mkdir(OUT, { recursive: true });
  const srv = await serve();
  const port = srv.address().port;
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });

  const preview = arg('preview');
  if (preview) {
    const dir = path.join(OUT, 'preview'); await mkdir(dir, { recursive: true });
    const page = await openPage(browser, port, tl);
    for (const t of preview.split(',').map(Number)) {
      await page.evaluate((x) => window.__render(x), t);
      await page.screenshot({ path: path.join(dir, `t${t.toFixed(2)}.png`) });
      console.log('preview', t);
    }
    await browser.close(); srv.close(); return;
  }

  const from = +arg('from', 0), to = Math.min(+arg('to', tl.total), tl.total);
  const f0 = Math.round(from * FPS), f1 = Math.round(to * FPS);
  // Cada quadro vai para out/frames/NNNNN.jpg; os que já existem são saltados,
  // por isso um render interrompido retoma de onde parou.
  const frameDir = path.join(OUT, 'frames'); await mkdir(frameDir, { recursive: true });
  const framePath = (f) => path.join(frameDir, String(f).padStart(5, '0') + '.jpg');
  const todo = [];
  for (let f = f0; f < f1; f++) if (!existsSync(framePath(f))) todo.push(f);
  const n = todo.length, per = Math.ceil(n / WORKERS);
  console.log(`${f1 - f0 - n} quadros já feitos, faltam ${n}`);
  const t0 = Date.now();
  let doneFrames = 0;
  const jobs = [];
  for (let w = 0; w < WORKERS; w++) {
    const mine = todo.slice(w * per, (w + 1) * per);
    if (!mine.length) continue;
    jobs.push((async () => {
      const page = await openPage(browser, port, tl);
      for (const f of mine) {
        await page.evaluate((x) => window.__render(x), f / FPS);
        const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
        await writeFile(framePath(f) + '.tmp', buf);
        await rename(framePath(f) + '.tmp', framePath(f));
        if (++doneFrames % 150 === 0) {
          const el = (Date.now() - t0) / 1000;
          console.log(`${doneFrames}/${n} quadros  ${(doneFrames / el).toFixed(1)} q/s  ETA ${((n - doneFrames) / (doneFrames / el) / 60).toFixed(1)} min`);
        }
      }
      await page.close();
    })());
  }
  await Promise.all(jobs);
  await browser.close(); srv.close();
  const name = arg('out', from === 0 && to === tl.total ? 'zinho-azar-dobra.mp4' : `trecho_${from}-${to}.mp4`);
  const out = path.join(OUT, name);
  const ff = ffmpeg(['-framerate', String(FPS), '-start_number', String(f0), '-i', path.join(frameDir, '%05d.jpg'),
    '-ss', String(from), '-t', String(to - from), '-i', path.join(ROOT, 'build/mix.wav'),
    '-map', '0:v', '-map', '1:a', '-frames:v', String(f1 - f0), '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', '48000', '-movflags', '+faststart', '-shortest', out]);
  ff.stdin.end(); await ff.done;
  console.log(`pronto: ${out}  (${((Date.now() - t0) / 60000).toFixed(1)} min)`);
}
main().catch((e) => { console.error(e); process.exit(1); });
