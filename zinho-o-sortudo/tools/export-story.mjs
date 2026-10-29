// Exporta o roteiro de um episódio para JSON (lido pelos scripts Python).
//   node tools/export-story.mjs episodes/02-ouro.js
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const file = process.argv[2] || 'episodes/01-azar.js';
const { default: story } = await import(pathToFileURL(path.resolve(file)).href);
mkdirSync(new URL('../build/', import.meta.url), { recursive: true });
writeFileSync(new URL('../build/story.json', import.meta.url), JSON.stringify(story, null, 1));
writeFileSync(new URL('../build/episode.txt', import.meta.url), path.basename(file, '.js'));
const words = story.reduce((n, s) => n + s.text.split(/\s+/).length, 0);
console.log(`${path.basename(file)}: ${story.length} planos, ${words} palavras`);
