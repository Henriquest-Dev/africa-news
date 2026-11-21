// Short (~45 s, vertical) — formato de ESCOLHA (o melhor do canal: portas) + o Sorriso (terror curto).
// "Escolhe uma porta. Uma delas tem o Sorriso." Comentário de um número no 2.º plano, reviravolta na porta 3, final em loop.

const DOORS = { deco: 'doors', top: '#0d0718', bot: '#2a1747', floor: '#151024', line: '#b07cff', cube: '#9b4dff', stars: true };
const P = (o) => ({ style2: true, cap: true, pad: -0.15, set: 'domain', tod: 'night', capY: '37%', domain: DOORS, ...o });
const D = (o) => ({ style2: true, cap: true, pad: -0.15, set: 'praca', tod: 'day', capY: '37%', ...o });
const H = (o) => ({ style2: true, cap: true, pad: -0.15, set: 'praca', tod: 'horror', capY: '37%', ...o });
const B = (o) => ({ style2: true, cap: true, pad: -0.15, set: 'bedroom', tod: 'indoorNight', capY: '37%', ...o });
const doorCam = (n) => ({ pos: [(n - 2) * 3.1 * 0.6, 1.9, 1.6], look: [(n - 2) * 3.1, 1.9, -5], pos2: [(n - 2) * 3.1 * 0.85, 1.9, -1.2], look2: [(n - 2) * 3.1, 1.9, -5], fov: 56 });

export default [
  // ── GANCHO ──
  P({ who: 'NAR', text: 'Escolhe uma porta. Uma delas tem o Sorriso.', hq: true, blocky: true, min: 2.4,
    music: 'file:assets/music/fundo.mp3', musicGain: 0.2, duck: 0.6, voiceSpeed: 1.12, lead: 0.0, tail: 0.15,
    cam: { pos: [0, 2.3, 10], look: [0, 2.2, -5], pos2: [0, 2.1, 6.5], look2: [0, 2.1, -5], fov: 60 },
    actors: {}, card: { t: 'UMA TEM O SORRISO', s: 'porta 1 · 2 · 3', at: 0, top: true }, sfx: [['thud', 0.05]] }),
  P({ who: 'NAR', text: 'Comenta o seu número antes de abrir.', min: 1.8,
    cam: { pos: [-4.5, 1.8, 2.5], look: [-1, 2, -5], pos2: [4.5, 1.8, 2.5], look2: [1, 2, -5], fov: 60 },
    actors: {}, card: { t: '1 · 2 · 3', s: 'comenta antes de abrir', at: 0.05, top: true }, sfx: [['ding', 0.4, 0.5]] }),
  P({ who: 'ZINHO', text: 'Eu sou sortudo. Não tenho medo.', min: 1.6,
    cam: { at: 'zinho', d: 3.0, yaw: 20, h: 0.15, push: 0.3, fov: 52 },
    actors: { zinho: { p: [0, -1.4], r: 0, a: 'point', e: 'smug' } } }),

  // ── PORTA 1: festa surpresa ──
  P({ who: 'NAR', text: 'Porta um.', min: 1.3, domain: { ...DOORS, open: 1, at: 0.25 }, cam: doorCam(1), actors: {}, sfx: [['whoosh', 0.3]] }),
  D({ who: 'LIA', text: 'Surpresa!', min: 1.3,
    cam: { pos: [2.2, 1.6, 9.4], look: [0, 1.5, 6.2], pos2: [1.6, 1.5, 8.6], look2: [0, 1.5, 6.2], fov: 58 },
    actors: { lia: { p: [-1.3, 6.0], r: 20, a: 'cheer', e: 'happy' }, beto: { p: [0.2, 5.6], r: 0, a: 'cheer', e: 'happy' }, dudu: { p: [1.6, 6.1], r: -20, a: 'cheer', e: 'happy' } },
    sfx: [['sparkle', 0.2]] }),
  D({ who: 'NAR', text: 'Uma festa só pra você. Com bolo e tudo.', min: 2,
    cam: { at: 'zinho', d: 3.6, yaw: -20, h: 0.35, push: 0.3, fov: 54 },
    actors: { zinho: { p: [0.2, 7.6], r: 180, a: 'hold', e: 'happy', prop: 'cake' }, lia: { p: [-1.3, 6.0], r: 20, a: 'wave', e: 'happy' }, dudu: { p: [1.6, 6.1], r: -20, a: 'cheer', e: 'happy' } },
    sfx: [['ding', 0.3, 0.5]] }),

  // ── PORTA 2: o Sorriso ──
  P({ who: 'NAR', text: 'Porta dois.', min: 1.3, domain: { ...DOORS, opened: [1], open: 2, at: 0.25 }, cam: doorCam(2), actors: {}, sfx: [['whoosh', 0.3]] }),
  H({ who: 'NAR', text: 'A luz da praça apagou.', min: 1.6,
    cam: { pos: [3.4, 1.7, 8.2], look: [1.2, 1.6, 4.4], pos2: [3.0, 1.6, 7.4], look2: [1.2, 1.6, 4.4], fov: 56 },
    actors: { zinho: { p: [1.2, 4.4], r: 160, a: 'shock', e: 'worried' } }, fx: { blackout: 0.4 }, sfx: [['powerdown', 0.35]] }),
  H({ who: 'NAR', text: 'E do outro lado da fonte, alguma coisa sorriu.', min: 2.2, shake: 0.02,
    cam: { pos: [-1.6, 1.8, 5.2], look: [-6.0, 2.4, -1.0], pos2: [-2.4, 1.8, 4.0], look2: [-6.0, 2.6, -1.0], fov: 52 },
    actors: { sorriso: { p: [-6.0, -1.0], r: 34, a: 'creep', e: 'happy' } }, sfx: [['boom', 0.4]] }),
  H({ who: 'SORRISO', text: 'Achei você.', min: 1.5, shake: 0.03,
    cam: { at: 'sorriso', d: 3.0, yaw: 8, h: 0.1, push: 0.45, fov: 52 },
    actors: { sorriso: { p: [-5.4, 0.0], r: 34, a: 'creep', e: 'happy' } } }),

  // ── PORTA 3: vazia… ──
  P({ who: 'NAR', text: 'Porta três.', min: 1.3, domain: { ...DOORS, opened: [1, 2], open: 3, at: 0.25 }, cam: doorCam(3), actors: {}, sfx: [['whoosh', 0.3]] }),
  B({ who: 'NAR', text: 'Só o seu quarto. Quentinho. Seguro.', min: 2,
    cam: { at: 'zinho', d: 3.0, yaw: 25, h: 0.2, push: 0.3, fov: 54 },
    actors: { zinho: { p: [-2, -1.6], a: 'sitbed', e: 'happy' } } }),
  B({ who: 'ZINHO', text: 'Ufa. Eu disse que era sortudo.', min: 1.6,
    cam: { at: 'zinho', d: 2.3, yaw: -10, h: 0.1, push: 0.25, fov: 50 },
    actors: { zinho: { p: [-2, -1.6], a: 'sitbed', e: 'smug' } } }),
  B({ who: 'NAR', text: 'Só que a porta três nunca foi vazia.', min: 2, shake: 0.02,
    cam: { at: 'zinho', d: 4.4, yaw: 25, h: 0.7, push: 0.35, fov: 56 },
    actors: { zinho: { p: [-2, -1.6], a: 'sitbed', e: 'worried' }, sorriso: { p: [-1.0, -2.6], r: 30, a: 'creep', e: 'happy' } },
    sfx: [['thud', 0.5]] }),
  B({ who: 'SORRISO', text: 'Eu tava atrás de todas.', min: 1.8, shake: 0.03,
    cam: { at: 'sorriso', d: 3.0, yaw: -12, h: 0.1, push: 0.45, fov: 52 },
    actors: { zinho: { p: [-2, -1.6], a: 'shock', e: 'shock' }, sorriso: { p: [-1.0, -2.6], r: 30, a: 'creep', e: 'happy' } },
    sfx: [['boom', 0.3]] }),

  // ── LOOP ──
  P({ who: 'NAR', text: 'Acha que escapa? Então volta e escolhe outra porta.', min: 2.4, tail: 0.05,
    cam: { pos: [0, 2.1, 6.5], look: [0, 2.1, -5], pos2: [0, 2.3, 10], look2: [0, 2.2, -5], fov: 60 },
    actors: {}, sfx: [['whoosh', 0.85]] }),
];

export const meta = {
  kind: 'short',
  title: 'Escolhe uma porta… uma delas tem o Sorriso 🚪😈',
  description: 'Escolhe uma porta e comenta o seu número antes de abrir 👇 Uma delas tem o Sorriso…\n\n#escolhaumaporta #escolha #terror #animação #zinhoosortudo #shorts\n\nAnimação original feita com ajuda de IA (vozes e produção).',
  tags: ['escolhe uma porta', 'escolha uma porta', 'escolha 1 2 ou 3', 'qual porta você escolhe', 'escolhas', 'terror', 'animação de terror', 'animação estilo roblox', 'animação de blocos', 'história animada', 'zinho o sortudo', 'choose a door', 'shorts'],
  categoryId: '1',
};
