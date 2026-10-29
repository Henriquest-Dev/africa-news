// Exporta o roteiro para JSON (lido pelos scripts Python).
import { writeFileSync, mkdirSync } from 'node:fs';
import story from '../story.js';

mkdirSync(new URL('../build/', import.meta.url), { recursive: true });
writeFileSync(new URL('../build/story.json', import.meta.url), JSON.stringify(story, null, 1));
const words = story.reduce((n, s) => n + s.text.split(/\s+/).length, 0);
console.log(`${story.length} planos, ${words} palavras`);
