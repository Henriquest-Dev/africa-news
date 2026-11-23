// Short (~40 s, vertical) — série "portas + Sorriso" (portas+Sorriso 2,1 mil; o título com medo ganha ao título "desejo").
// "Escolhe uma porta. Só uma NÃO tem o Sorriso." Cada porta é uma mini-recompensa (≤6 s), re-gancho antes da porta 3,
// reviravolta que fecha a curiosidade e final em loop (aprendizados de 23/11).

const DOORS = { deco: 'doors', top: '#0d0718', bot: '#2a1747', floor: '#151024', line: '#ff5a5a', cube: '#9b4dff', stars: true };
const P = (o) => ({ style2: true, cap: true, pad: -0.15, set: 'domain', tod: 'night', capY: '37%', domain: DOORS, ...o });
const K = (o) => ({ style2: true, cap: true, pad: -0.15, set: 'kitchen', tod: 'indoor', capY: '37%', ...o });
const C = (o) => ({ style2: true, cap: true, pad: -0.15, set: 'classroom', tod: 'indoor', capY: '37%', ...o });
const S = (o) => ({ style2: true, cap: true, pad: -0.15, set: 'street', tod: 'horror', capY: '37%', ...o });
const doorCam = (n) => ({ pos: [(n - 2) * 3.1 * 0.6, 1.9, 1.6], look: [(n - 2) * 3.1, 1.9, -5], pos2: [(n - 2) * 3.1 * 0.85, 1.9, -1.2], look2: [(n - 2) * 3.1, 1.9, -5], fov: 56 });
const KIDS = { lia: { p: [-2.5, -0.8], r: 180, a: 'sit', e: 'neutral' }, beto: { p: [2.5, -0.8], r: 180, a: 'sit', e: 'neutral' } };

export default [
  // ── GANCHO ──
  P({ who: 'NAR', text: 'Escolhe uma porta. Só uma não tem o Sorriso.', hq: true, blocky: true, min: 2.4,
    music: 'file:assets/music/fundo.mp3', musicGain: 0.2, duck: 0.6, voiceSpeed: 1.12, lead: 0.0, tail: 0.15,
    cam: { pos: [0, 2.3, 10], look: [0, 2.2, -5], pos2: [0, 2.1, 6.5], look2: [0, 2.1, -5], fov: 60 },
    actors: {}, card: { t: 'SÓ UMA NÃO TEM O SORRISO', s: 'porta 1 · 2 · 3', at: 0, top: true }, sfx: [['thud', 0.05]] }),
  P({ who: 'NAR', text: 'Comenta o seu número antes de abrir.', min: 1.8,
    cam: { pos: [-4.5, 1.8, 2.5], look: [-1, 2, -5], pos2: [4.5, 1.8, 2.5], look2: [1, 2, -5], fov: 60 },
    actors: {}, card: { t: '1 · 2 · 3', s: 'comenta antes de abrir', at: 0.05, top: true }, sfx: [['ding', 0.4, 0.5]] }),
  P({ who: 'ZINHO', text: 'Fácil. Eu vou na sorte.', min: 1.4,
    cam: { at: 'zinho', d: 3.0, yaw: 20, h: 0.15, push: 0.3, fov: 52 },
    actors: { zinho: { p: [0, -1.4], r: 0, a: 'point', e: 'smug' } } }),

  // ── PORTA 1: o Sorriso na cozinha… da Dona Neide ──
  P({ who: 'NAR', text: 'Porta um.', min: 1.2, domain: { ...DOORS, open: 1, at: 0.25 }, cam: doorCam(1), actors: {}, sfx: [['whoosh', 0.3]] }),
  K({ who: 'NAR', text: 'O Sorriso. Na cozinha da Dona Neide.', min: 1.8, shake: 0.02,
    cam: { pos: [0.6, 1.5, 3.2], look: [1.0, 1.6, -1.6], pos2: [0.6, 1.5, 2.4], look2: [1.0, 1.7, -1.6], fov: 60 },
    actors: { sorriso: { p: [1.0, -1.6], r: -10, a: 'creep', e: 'happy' } }, sfx: [['boom', 0.3]] }),
  K({ who: 'MAE', text: 'Quem sujou o meu chão?!', min: 1.5, shake: 0.04,
    cam: { at: 'mae', d: 2.9, yaw: -15, h: 0.2, push: 0.35, fov: 52 },
    actors: { mae: { p: [-1.1, -1.2], r: 20, a: 'threat', e: 'angry', prop: 'chinelo' } }, sfx: [['bonk', 0.5]] }),
  K({ who: 'NAR', text: 'Ele fugiu. Ninguém mexe com a mãe do Zinho.', min: 2,
    cam: { pos: [0.2, 1.7, 4.0], look: [0.2, 1.4, -1.3], pos2: [0.2, 1.6, 3.4], look2: [0.2, 1.4, -1.3], fov: 64 },
    actors: { mae: { p: [-0.9, -1.0], r: 40, a: 'threat', e: 'smug', prop: 'chinelo' }, sorriso: { p: [1.0, -1.6], to: [2.2, -1.0], r: 100, a: 'run', e: 'shock' } },
    sfx: [['whoosh', 0.3]] }),

  // ── PORTA 2: o aluno novo ──
  P({ who: 'NAR', text: 'Porta dois.', min: 1.2, domain: { ...DOORS, opened: [1], open: 2, at: 0.25 }, cam: doorCam(2), actors: {}, sfx: [['whoosh', 0.3]] }),
  C({ who: 'PROF', text: 'Turma, esse é o colega novo.', min: 1.8, board: 'BEM-VINDO!',
    cam: { pos: [0.6, 3.0, 4.8], look: [0.0, 1.6, -3.4], pos2: [0.5, 2.9, 3.9], look2: [0.0, 1.7, -3.4], fov: 56 },
    actors: { prof: { p: [-1.0, -3.6], r: 10, a: 'wave', e: 'happy' }, sorriso: { p: [1.0, -3.4], r: 0, a: 'idle', e: 'happy' }, zinho: { p: [0, 1.5], r: 180, a: 'sit', e: 'neutral' }, ...KIDS } }),
  C({ who: 'SORRISO', text: 'Posso sentar do lado do Zinho?', min: 1.8, board: 'BEM-VINDO!',
    cam: { pos: [0.7, 1.7, -1.4], look: [0, 1.2, 1.8], pos2: [0.6, 1.6, -0.8], look2: [0, 1.2, 1.8], fov: 56 },
    actors: { zinho: { p: [0, 1.5], r: 180, a: 'sit', e: 'shock' }, beto: { p: [2.2, 1.5], r: 180, a: 'sit', e: 'worried' } }, sfx: [['thud', 0.3]] }),

  // ── RE-GANCHO + PORTA 3 ──
  P({ who: 'NAR', text: 'Então a três é a segura. Né?', min: 1.6, domain: { ...DOORS, opened: [1, 2], open: 3, at: 0.4 }, cam: doorCam(3), actors: {}, sfx: [['whoosh', 0.45]] }),
  S({ who: 'NAR', text: 'Na três não tem nada. Só a sua rua, de noite.', min: 2.2,
    cam: { pos: [2.2, 0.9, 0.2], look: [0, 2.6, -4.6], pos2: [1.8, 0.9, -0.6], look2: [0, 2.6, -4.6], fov: 60 },
    actors: { zinho: { p: [0, -4], r: 20, a: 'idle', e: 'worried' } } }),
  S({ who: 'ZINHO', text: 'Viu? Eu falei que era sorte.', min: 1.6,
    cam: { at: 'zinho', d: 2.5, yaw: -10, h: 0.15, push: 0.25, fov: 50 },
    actors: { zinho: { p: [0, -4], r: 0, a: 'cheer', e: 'happy' } } }),
  S({ who: 'NAR', text: 'Só que o Sorriso não tava atrás de nenhuma porta.', min: 2.2, shake: 0.02,
    cam: { at: 'zinho', d: 4.4, yaw: 15, h: 0.6, push: 0.35, fov: 56 },
    actors: { zinho: { p: [0, -4], r: 0, a: 'idle', e: 'worried' }, sorriso: { p: [1.0, -5.4], r: -15, a: 'creep', e: 'happy' } }, sfx: [['thud', 0.6]] }),
  S({ who: 'SORRISO', text: 'Eu tava escolhendo junto com você.', min: 2, shake: 0.03,
    cam: { at: 'sorriso', d: 3.0, yaw: -10, h: 0.1, push: 0.45, fov: 52 },
    actors: { zinho: { p: [0, -4], r: 0, a: 'shock', e: 'shock' }, sorriso: { p: [1.0, -5.4], r: -15, a: 'creep', e: 'happy' } }, sfx: [['boom', 0.3]] }),

  // ── LOOP ──
  P({ who: 'NAR', text: 'Acha que escapa? Escolhe uma porta. Só uma não tem o Sorriso.', min: 2.6, tail: 0.05,
    cam: { pos: [0, 2.1, 6.5], look: [0, 2.1, -5], pos2: [0, 2.3, 10], look2: [0, 2.2, -5], fov: 60 },
    actors: {}, sfx: [['whoosh', 0.85]] }),
];

export const meta = {
  kind: 'short',
  title: 'Escolhe uma porta… só uma NÃO tem o Sorriso 🚪😈',
  description: 'Escolhe uma porta e comenta o seu número antes de abrir 👇 Só uma não tem o Sorriso…\n\n#escolhaumaporta #escolha #terror #animação #zinhoosortudo #shorts\n\nAnimação original feita com ajuda de IA (vozes e produção).',
  tags: ['escolhe uma porta', 'escolha uma porta', 'escolha 1 2 ou 3', 'qual porta você escolhe', 'escolhas', 'terror', 'animação de terror', 'animação estilo roblox', 'animação de blocos', 'história animada', 'zinho o sortudo', 'choose a door', 'shorts'],
  categoryId: '1',
};
