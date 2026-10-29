// Exporta o roteiro de um episódio para JSON (lido pelos scripts Python).
//   node tools/export-story.mjs episodes/02-ouro.js
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const file = process.argv[2] || 'episodes/01-azar.js';
const { default: story } = await import(pathToFileURL(path.resolve(file)).href);
// cada episódio tem a sua pasta de trabalho: build/<episódio>/
const ep = path.basename(file, '.js');
mkdirSync(new URL(`../build/${ep}/`, import.meta.url), { recursive: true });
writeFileSync(new URL(`../build/${ep}/story.json`, import.meta.url), JSON.stringify(story, null, 1));
writeFileSync(new URL('../build/current.txt', import.meta.url), ep);
const words = story.reduce((n, s) => n + s.text.split(/\s+/).length, 0);
console.log(`${path.basename(file)}: ${story.length} planos, ${words} palavras`);
