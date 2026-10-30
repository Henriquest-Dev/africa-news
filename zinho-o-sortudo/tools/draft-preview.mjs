// Pré-visualização rápida de um episódio ANTES das vozes: durações estimadas pelo número de palavras.
//   node tools/draft-preview.mjs episodes/short-05-dino.js [--w 1080 --h 1920] [--at 0.6]
// Gera out/preview/draft-<episódio>.jpg (folha de contacto com um quadro por plano). Não mexe em build/current.txt.
import { mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const file = process.argv[2], at = +arg('at', 0.6), w = arg('w', '1080'), h = arg('h', '1920');
const ep = path.basename(file, '.js'), draft = 'draft-' + ep;
const story = (await import(path.resolve(file))).default;
let t = 0;
const shots = story.map((s) => { const dur = Math.max(s.min ?? 1.5, s.text.split(/\s+/).length * 0.36 + 0.4); const o = { ...s, start: t, dur, vstart: t, vdur: dur, env: [] }; t += dur; return o; });
mkdirSync(`build/${draft}`, { recursive: true });
writeFileSync(`build/${draft}/timeline.json`, JSON.stringify({ fps: 30, total: t, shots }));
const cur = readFileSync('build/current.txt', 'utf8');
writeFileSync('build/current.txt', draft);
try {
  const times = shots.map((s) => (s.start + s.dur * at).toFixed(2));
  execFileSync('node', ['tools/render.mjs', '--preview', times.join(','), '--w', w, '--h', h], { stdio: 'ignore' });
  const ins = times.flatMap((x) => ['-i', `out/preview/t${x}.png`]);
  const cols = Math.min(6, times.length), rows = Math.ceil(times.length / cols), n = rows * cols;
  const pad = Array.from({ length: n - times.length }, () => ['-f', 'lavfi', '-i', `color=black:s=${w}x${h}`]).flat();
  const fc = Array.from({ length: rows }, (_, r) => Array.from({ length: cols }, (_, c) => `[${r * cols + c}:v]`).join('') + `hstack=${cols}[r${r}]`).join(';')
    + ';' + Array.from({ length: rows }, (_, r) => `[r${r}]`).join('') + (rows > 1 ? `vstack=${rows}` : 'null') + `,scale=${cols * 300}:-1`;
  const out = `out/preview/${draft}.jpg`;
  execFileSync('ffmpeg', ['-v', 'error', '-y', ...ins, ...pad, '-filter_complex', fc, '-frames:v', '1', out]);
  console.log(out);
} finally { writeFileSync('build/current.txt', cur); rmSync(`build/${draft}`, { recursive: true, force: true }); }
