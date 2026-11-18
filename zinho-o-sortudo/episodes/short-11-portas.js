// Short (~40 s, vertical, bonecos de blocos) — formato de ESCOLHA: "Escolhe uma porta: 1, 2 ou 3".
// Regras novas (análise de 18/11): imagem forte e texto grande no 1.º quadro, corte a cada ~2 s, câmara sempre a mexer,
// pedido de comentário de uma palavra logo no início, e final em loop (a última frase leva de volta à primeira).

const DOORS = { deco: 'doors', top: '#120a26', bot: '#3b2370', floor: '#1a1430', line: '#ffd23f', cube: '#ff7ab8', stars: true };
const P = (o) => ({ style2: true, cap: true, pad: -0.15, set: 'domain', tod: 'night', capY: '37%', domain: DOORS, ...o });
const S = (o) => ({ style2: true, cap: true, pad: -0.15, set: 'street', tod: 'night', capY: '37%', ...o });
const K = (o) => ({ style2: true, cap: true, pad: -0.15, set: 'kitchen', tod: 'indoor', capY: '37%', ...o });
const doorCam = (n) => ({ pos: [(n - 2) * 3.1 * 0.6, 1.9, 1.6], look: [(n - 2) * 3.1, 1.9, -5], pos2: [(n - 2) * 3.1 * 0.85, 1.9, -1.2], look2: [(n - 2) * 3.1, 1.9, -5], fov: 56 });

export default [
  // ── GANCHO (1.º quadro já mostra as 3 portas e a promessa) ──
  P({ who: 'NAR', text: 'Escolhe uma porta. Um, dois ou três.', hq: true, blocky: true, min: 2.2,
    music: 'file:assets/music/fundo.mp3', musicGain: 0.2, duck: 0.6, voiceSpeed: 1.12, lead: 0.0, tail: 0.15,
    cam: { pos: [0, 2.3, 10], look: [0, 2.2, -5], pos2: [0, 2.1, 6.5], look2: [0, 2.1, -5], fov: 60 },
    actors: {}, card: { t: 'ESCOLHE UMA PORTA', s: '1 · 2 · 3', at: 0, top: true }, sfx: [['whoosh', 0.02]] }),
  P({ who: 'ZINHO', text: 'E não vale trocar depois, hein!', min: 1.5,
    cam: { at: 'zinho', d: 3.0, yaw: 20, h: 0.15, push: 0.3, fov: 52 },
    actors: { zinho: { p: [0, -1.4], r: 0, a: 'point', e: 'smug' } } }),
  P({ who: 'NAR', text: 'Comenta o seu número antes de abrir.', min: 1.8,
    cam: { pos: [-4.5, 1.8, 2.5], look: [-1, 2, -5], pos2: [4.5, 1.8, 2.5], look2: [1, 2, -5], fov: 60 },
    actors: {}, card: { t: '1 · 2 · 3', s: 'comenta antes de abrir', at: 0.05, top: true }, sfx: [['ding', 0.4, 0.5]] }),

  // ── PORTA 1: a mãe com o chinelo ──
  P({ who: 'NAR', text: 'Porta um.', min: 1.3, domain: { ...DOORS, open: 1, at: 0.25 }, cam: doorCam(1), actors: {}, sfx: [['whoosh', 0.3]] }),
  K({ who: 'MAE', text: 'Quem deixou essa louça suja?!', min: 1.6, shake: 0.04,
    cam: { at: 'mae', d: 2.9, yaw: -15, h: 0.2, push: 0.35, fov: 52 },
    actors: { mae: { p: [0, -1.2], r: 0, a: 'threat', e: 'angry', prop: 'chinelo' } }, sfx: [['bonk', 0.5]] }),
  K({ who: 'NAR', text: 'Você ganhou a mãe do Zinho. De chinelo na mão.', min: 2,
    cam: { pos: [0.4, 1.5, 3.0], look: [-0.2, 1.3, -1.4], pos2: [0.2, 1.4, 2.2], look2: [-0.2, 1.3, -1.4], fov: 60 },
    actors: { mae: { p: [-0.2, -1.6], r: 10, a: 'threat', e: 'angry', prop: 'chinelo' } } }),

  // ── PORTA 2: o gigante de pedra ──
  P({ who: 'NAR', text: 'Porta dois.', min: 1.3, domain: { ...DOORS, opened: [1], open: 2, at: 0.25 }, cam: doorCam(2), actors: {}, sfx: [['whoosh', 0.3]] }),
  S({ who: 'NAR', text: 'O gigante de pedra.', min: 1.6, shake: 0.04,
    cam: { pos: [5.5, 1.2, 2.2], look: [8, 13, -22], pos2: [5.5, 1.2, 1.2], look2: [8, 14.5, -22], fov: 70 },
    actors: {}, fx: { giant: { p: [8, -24], r: -8, up: -0.6 } }, sfx: [['boom', 0.15]] }),
  S({ who: 'NAR', text: 'Mas ele não quer te pegar. Ele só quer um abraço.', min: 2.2,
    cam: { pos: [4.2, 1.4, -2.2], look: [9.4, 6.0, -13.5], pos2: [4.8, 1.4, -3.4], look2: [9.4, 6.5, -13.5], fov: 62 },
    actors: { zinho: { p: [8.6, -10.4], r: 160, a: 'hug', e: 'happy' } }, fx: { giant: { p: [10.2, -14.5], s: 0.34, r: -20, up: -1.1, bow: 0.3, raise: 0.25 } }, sfx: [['sparkle', 0.6]] }),

  // ── PORTA 3: pão infinito… com letra miúda ──
  P({ who: 'NAR', text: 'Porta três.', min: 1.3, domain: { ...DOORS, opened: [1, 2], open: 3, at: 0.25 }, cam: doorCam(3), actors: {}, sfx: [['whoosh', 0.3]] }),
  S({ who: 'NAR', text: 'Pão quentinho da padaria. Infinito.', tod: 'day', min: 1.8,
    cam: { at: 'zinho', d: 3.0, yaw: 15, h: 0.15, push: 0.3, fov: 52 },
    actors: { zinho: { p: [0, -4], r: 0, a: 'hold', e: 'happy', prop: 'bread' }, lia: { p: [1.5, -4.4], r: -20, a: 'cheer', e: 'happy' } }, sfx: [['ding', 0.4, 0.5]] }),
  S({ who: 'NAR', text: 'Parece a melhor, né? Só que tinha letra miúda.', tod: 'day', min: 2,
    cam: { at: 'zinho', d: 2.4, yaw: -10, h: 0.1, push: 0.25, fov: 48 },
    actors: { zinho: { p: [0, -4], r: 0, a: 'shock', e: 'shock', prop: 'bread' } }, card: { t: 'LETRA MIÚDA', s: 'leia antes de escolher', at: 0.45, top: true } }),
  K({ who: 'NAR', text: 'Quem escolhe a três lava a louça da casa inteira.', min: 2.2,
    cam: { pos: [2.4, 1.5, 2.4], look: [0, 1.2, -1.2], pos2: [1.6, 1.4, 1.6], look2: [0, 1.2, -1.2], fov: 56 },
    actors: { zinho: { p: [0.6, -1.2], r: 200, a: 'headdown', e: 'sad' }, mae: { p: [-1.1, -1.6], r: 30, a: 'threat', e: 'smug', prop: 'chinelo' } }, sfx: [['bonk', 0.7]] }),
  K({ who: 'MAE', text: 'E eu tô de olho.', min: 1.4,
    cam: { at: 'mae', d: 2.6, yaw: 10, h: 0.15, push: 0.3, fov: 50 },
    actors: { mae: { p: [-1.1, -1.6], r: 0, a: 'threat', e: 'smug', prop: 'chinelo' } } }),

  // ── LOOP: volta para o começo ──
  P({ who: 'NAR', text: 'Não gostou? Então volta e escolhe outra porta.', min: 2.2, tail: 0.05,
    cam: { pos: [0, 2.1, 6.5], look: [0, 2.1, -5], pos2: [0, 2.3, 10], look2: [0, 2.2, -5], fov: 60 },
    actors: {}, sfx: [['whoosh', 0.85]] }),
];

export const meta = {
  kind: 'short',
  title: 'Escolhe uma porta: 1, 2 ou 3 🚪 (sem trocar!)',
  description: 'Escolhe uma porta e comenta o seu número antes de abrir 👇 Sem trocar depois!\n\n#escolhaumaporta #escolha #animação #zinhoosortudo #shorts\n\nAnimação original feita com ajuda de IA (vozes e produção).',
  tags: ['escolhe uma porta', 'escolha uma porta', 'escolha 1 2 ou 3', 'escolha sua porta', 'qual porta você escolhe', 'escolhas', 'animação', 'animação de blocos', 'animação estilo roblox', 'animação engraçada', 'história animada', 'zinho o sortudo', 'choose a door', 'shorts'],
  categoryId: '1',
};
