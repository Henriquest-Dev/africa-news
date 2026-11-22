// Short (~35 s, vertical) — "portas + reviravolta" (o formato que está a ganhar: portas 3,2 mil; portas+Sorriso 1,9 mil em 10 h).
// "Escolhe uma porta. Uma delas realiza um desejo." Porta 3 = o desejo, e o Sorriso nega. Final em loop.

const DOORS = { deco: 'doors', top: '#0b1030', bot: '#1f3a70', floor: '#121a30', line: '#ffd23f', cube: '#5aa8ff', stars: true };
const P = (o) => ({ style2: true, cap: true, pad: -0.15, set: 'domain', tod: 'night', capY: '37%', domain: DOORS, ...o });
const D = (o) => ({ style2: true, cap: true, pad: -0.15, set: 'praca', tod: 'day', capY: '37%', ...o });
const H = (o) => ({ style2: true, cap: true, pad: -0.15, set: 'praca', tod: 'horror', capY: '37%', ...o });
const doorCam = (n) => ({ pos: [(n - 2) * 3.1 * 0.6, 1.9, 1.6], look: [(n - 2) * 3.1, 1.9, -5], pos2: [(n - 2) * 3.1 * 0.85, 1.9, -1.2], look2: [(n - 2) * 3.1, 1.9, -5], fov: 56 });

export default [
  // ── GANCHO ──
  P({ who: 'NAR', text: 'Escolhe uma porta. Uma delas realiza um desejo.', hq: true, blocky: true, min: 2.4,
    music: 'file:assets/music/fundo.mp3', musicGain: 0.2, duck: 0.6, voiceSpeed: 1.12, lead: 0.0, tail: 0.15,
    cam: { pos: [0, 2.3, 10], look: [0, 2.2, -5], pos2: [0, 2.1, 6.5], look2: [0, 2.1, -5], fov: 60 },
    actors: {}, card: { t: 'UMA REALIZA UM DESEJO', s: 'porta 1 · 2 · 3', at: 0, top: true }, sfx: [['sparkle', 0.05]] }),
  P({ who: 'NAR', text: 'Comenta o seu número antes de abrir.', min: 1.8,
    cam: { pos: [-4.5, 1.8, 2.5], look: [-1, 2, -5], pos2: [4.5, 1.8, 2.5], look2: [1, 2, -5], fov: 60 },
    actors: {}, card: { t: '1 · 2 · 3', s: 'comenta antes de abrir', at: 0.05, top: true }, sfx: [['ding', 0.4, 0.5]] }),
  P({ who: 'ZINHO', text: 'Eu já sei o que eu vou pedir.', min: 1.6,
    cam: { at: 'zinho', d: 3.0, yaw: 20, h: 0.15, push: 0.3, fov: 52 },
    actors: { zinho: { p: [0, -1.4], r: 0, a: 'point', e: 'smug' } } }),

  // ── PORTA 1: sorvete infinito ──
  P({ who: 'NAR', text: 'Porta um.', min: 1.3, domain: { ...DOORS, open: 1, at: 0.25 }, cam: doorCam(1), actors: {}, sfx: [['whoosh', 0.3]] }),
  D({ who: 'NAR', text: 'Sorvete de graça. Pra sempre.', min: 1.8,
    cam: { at: 'zinho', d: 4.0, yaw: -25, h: 0.35, push: 0.3, fov: 56 },
    actors: { zinho: { p: [4.5, -12.6], r: 0, a: 'hold', e: 'happy', prop: 'icecream' }, kaka: { p: [5.9, -12.9], r: -25, a: 'cheer', e: 'happy' } },
    sfx: [['ding', 0.3, 0.5]] }),
  D({ who: 'ZINHO', text: 'Ai, minha cabeça congelou!', min: 1.5, shake: 0.03,
    cam: { at: 'zinho', d: 2.4, yaw: 10, h: 0.1, push: 0.35, fov: 50 },
    actors: { zinho: { p: [4.5, -12.6], r: 0, a: 'shock', e: 'shock', prop: 'icecream' } }, sfx: [['bonk', 0.3]] }),

  // ── PORTA 2: a espada de cristal ──
  P({ who: 'NAR', text: 'Porta dois.', min: 1.3, domain: { ...DOORS, opened: [1], open: 2, at: 0.25 }, cam: doorCam(2), actors: {}, sfx: [['whoosh', 0.3]] }),
  D({ who: 'NAR', text: 'A espada de cristal. O herói do bairro.', min: 2,
    cam: { at: 'zinho', d: 3.6, yaw: -15, h: 0.35, push: 0.3, fov: 54 },
    actors: { zinho: { p: [0.2, 7.0], r: 0, a: 'swordup', e: 'happy', prop: 'sword' }, lia: { p: [-1.5, 6.0], r: 10, a: 'cheer', e: 'happy' }, dudu: { p: [1.9, 6.0], r: -10, a: 'cheer', e: 'happy' } },
    sfx: [['sparkle', 0.2], ['clang', 0.6]] }),
  D({ who: 'LIA', text: 'Zinho! Zinho! Zinho!', min: 1.4,
    cam: { pos: [0.6, 1.5, 12.0], look: [0.1, 1.7, 6.6], pos2: [0.3, 1.5, 10.8], look2: [0.1, 1.7, 6.6], fov: 58 },
    actors: { zinho: { p: [0.2, 7.0], r: 0, a: 'swordup', e: 'happy', prop: 'sword' }, lia: { p: [-1.5, 6.0], r: 10, a: 'cheer', e: 'happy' }, dudu: { p: [1.9, 6.0], r: -10, a: 'cheer', e: 'happy' } } }),

  // ── PORTA 3: o desejo… negado ──
  P({ who: 'NAR', text: 'Porta três. O desejo.', min: 1.5, domain: { ...DOORS, opened: [1, 2], open: 3, at: 0.25 }, cam: doorCam(3), actors: {}, sfx: [['sparkle', 0.3]] }),
  H({ who: 'ZINHO', text: 'Eu desejo que o Sorriso suma pra sempre!', min: 2.2,
    cam: { pos: [3.4, 1.7, 8.2], look: [1.2, 1.6, 4.4], pos2: [3.0, 1.6, 7.4], look2: [1.2, 1.6, 4.4], fov: 56 },
    actors: { zinho: { p: [1.2, 4.4], r: 30, a: 'point', e: 'angry' } } }),
  H({ who: 'NAR', text: 'E a luz da praça apagou.', min: 1.6,
    cam: { pos: [3.4, 1.7, 8.2], look: [1.2, 1.6, 4.4], pos2: [3.8, 1.8, 9.0], look2: [1.2, 1.6, 4.4], fov: 56 },
    actors: { zinho: { p: [1.2, 4.4], r: 30, a: 'shock', e: 'worried' } }, fx: { blackout: 0.4 }, sfx: [['powerdown', 0.35]] }),
  H({ who: 'NAR', text: 'Do lado da fonte, alguma coisa sorriu.', min: 2, shake: 0.02,
    cam: { pos: [-1.6, 1.8, 5.2], look: [-6.0, 2.4, -1.0], pos2: [-2.4, 1.8, 4.0], look2: [-6.0, 2.6, -1.0], fov: 52 },
    actors: { sorriso: { p: [-6.0, -1.0], r: 34, a: 'creep', e: 'happy' } }, sfx: [['boom', 0.4]] }),
  H({ who: 'SORRISO', text: 'Desejo negado.', min: 1.5, shake: 0.03,
    cam: { at: 'sorriso', d: 3.0, yaw: 8, h: 0.1, push: 0.45, fov: 52 },
    actors: { sorriso: { p: [-5.4, 0.0], r: 34, a: 'creep', e: 'happy' } }, sfx: [['thud', 0.3]] }),

  // ── LOOP ──
  P({ who: 'NAR', text: 'Quer outro desejo? Então volta e escolhe outra porta.', min: 2.4, tail: 0.05,
    cam: { pos: [0, 2.1, 6.5], look: [0, 2.1, -5], pos2: [0, 2.3, 10], look2: [0, 2.2, -5], fov: 60 },
    actors: {}, sfx: [['whoosh', 0.85]] }),
];

export const meta = {
  kind: 'short',
  title: 'Escolhe uma porta… uma delas realiza um desejo 🚪✨',
  description: 'Escolhe uma porta e comenta o seu número antes de abrir 👇 Uma delas realiza um desejo… mas o Sorriso tá de olho.\n\n#escolhaumaporta #escolha #desejo #animação #zinhoosortudo #shorts\n\nAnimação original feita com ajuda de IA (vozes e produção).',
  tags: ['escolhe uma porta', 'escolha uma porta', 'escolha 1 2 ou 3', 'qual porta você escolhe', 'escolhas', 'desejo', 'animação estilo roblox', 'animação de blocos', 'história animada', 'zinho o sortudo', 'choose a door', 'shorts'],
  categoryId: '1',
};
