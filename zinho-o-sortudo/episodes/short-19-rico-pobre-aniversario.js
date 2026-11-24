// Short (~45 s, vertical) — formato POBRE VS RICO (pedido do dono, 23/11).
// Frase-resumo: "O Enzo (rico) e o Zinho (pobre) fazem anos no mesmo dia; a festa gigante do Enzo tem regras chatas,
// a Kaká sente o cheiro do bolo de fubá da Dona Neide e todos vão para a casa do Zinho — e o Zinho chama o Enzo também."
// Dois lugares só: a festa do rico na praça e a cozinha do pobre. Cortes alternados com cartão RICO / POBRE.

const R = (o) => ({ style2: true, cap: true, pad: -0.15, set: 'praca', tod: 'day', capY: '37%', ...o });
const K = (o) => ({ style2: true, cap: true, pad: -0.15, set: 'kitchen', tod: 'indoor', capY: '37%', ...o });
const RICO = (at = 0) => ({ t: 'RICO', s: '', at, top: true });
const POBRE = (at = 0) => ({ t: 'POBRE', s: '', at, top: true });
// festa do Enzo: em frente à fonte, virada para sul
const EZ = [0.6, 6.2];
const GUESTS = { lia: { p: [-1.6, 7.8], r: 160, a: 'idle', e: 'neutral' }, beto: { p: [-0.4, 8.4], r: 175, a: 'idle', e: 'neutral' },
  dudu: { p: [1.8, 8.3], r: 190, a: 'idle', e: 'neutral' }, kaka: { p: [3.0, 7.6], r: 205, a: 'idle', e: 'neutral' } };
const g = (over) => Object.fromEntries(Object.entries(GUESTS).map(([k, v]) => [k, { ...v, ...(over[k] || over.all || {}) }]));

export default [
  // ── GANCHO ──
  R({ who: 'NAR', text: 'Rico contra pobre. No dia do aniversário.', hq: true, blocky: true, min: 2.2,
    music: 'file:assets/music/fundo.mp3', musicGain: 0.2, duck: 0.6, voiceSpeed: 1.1, lead: 0.0, tail: 0.15,
    cam: { at: 'enzo', d: 3.4, yaw: 15, h: 0.3, push: 0.35, fov: 54 },
    actors: { enzo: { p: EZ, r: 0, a: 'point', e: 'smug' } },
    card: { t: 'RICO VS POBRE', s: 'no aniversário', at: 0, top: true }, sfx: [['ding', 0.05, 0.5]] }),
  K({ who: 'NAR', text: 'Comenta: time rico ou time pobre?', min: 1.9,
    cam: { at: 'zinho', d: 3.2, yaw: -15, h: 0.25, push: 0.3, fov: 54 },
    actors: { zinho: { p: [0, -1.2], r: 0, a: 'shrug', e: 'happy' } },
    card: { t: 'TIME RICO OU POBRE?', s: 'comenta', at: 0.05, top: true }, sfx: [['ding', 0.4, 0.5]] }),

  // ── O BOLO ──
  R({ who: 'ENZO', text: 'O meu bolo tem sete andares.', min: 1.6, card: RICO(),
    cam: { at: 'enzo', d: 3.0, yaw: -45, h: 0.25, push: 0.3, fov: 52 },
    actors: { enzo: { p: EZ, r: 0, a: 'hold', e: 'smug', prop: 'cake' } } }),
  K({ who: 'ZINHO', text: 'O meu tem uma vela. E é de fubá.', min: 1.7, card: POBRE(),
    cam: { pos: [1.4, 1.5, 2.6], look: [-0.3, 1.3, -1.3], pos2: [1.0, 1.4, 2.0], look2: [-0.3, 1.3, -1.3], fov: 58 },
    actors: { zinho: { p: [0.3, -1.0], r: -15, a: 'hold', e: 'happy', prop: 'cake' }, mae: { p: [-1.1, -1.6], r: 20, a: 'idle', e: 'happy' } } }),

  // ── OS CONVIDADOS ──
  R({ who: 'NAR', text: 'O Enzo convidou o bairro inteiro.', min: 1.8, card: RICO(),
    cam: { pos: [4.6, 2.6, 13.2], look: [0.8, 1.4, 7.0], pos2: [3.6, 2.3, 11.6], look2: [0.8, 1.4, 7.0], fov: 56 },
    actors: { enzo: { p: EZ, r: 0, a: 'wave', e: 'smug' }, ...g({ all: { a: 'cheer', e: 'happy' } }) }, sfx: [['sparkle', 0.2]] }),
  K({ who: 'NAR', text: 'O Zinho convidou… o Bolinha.', min: 1.7, card: POBRE(),
    cam: { pos: [1.6, 1.0, 2.4], look: [0.2, 0.7, -0.8], pos2: [1.3, 1.0, 1.9], look2: [0.2, 0.7, -0.8], fov: 58 },
    actors: { zinho: { p: [-0.4, -1.2], r: 20, a: 'shrug', e: 'happy' } }, fx: { dog: { p: [0.7, -0.4], r: -30, wag: true, s: 1.2 } } }),

  // ── AS REGRAS DO RICO ──
  R({ who: 'ENZO', text: 'Regra um: ninguém toca no bolo.', min: 1.7, card: RICO(),
    cam: { at: 'enzo', d: 3.0, yaw: 10, h: 0.2, push: 0.3, fov: 52 },
    actors: { enzo: { p: EZ, r: 0, a: 'point', e: 'smug' }, ...g({}) } }),
  R({ who: 'ENZO', text: 'Regra dois: ninguém senta. Ninguém corre. Ninguém ri.', min: 2.2,
    cam: { pos: [0.6, 2.4, 2.4], look: [0.7, 1.3, 8.0], pos2: [0.6, 2.3, 3.0], look2: [0.7, 1.3, 8.0], fov: 74 },
    actors: { enzo: { p: EZ, r: 0, a: 'point', e: 'angry' }, ...g({ all: { e: 'worried' }, beto: { a: 'shock', e: 'shock' } }) } }),
  R({ who: 'LIA', text: 'Então a festa é só pra olhar?', min: 1.6,
    cam: { at: 'lia', d: 2.6, yaw: 20, h: 0.15, push: 0.3, fov: 50 },
    actors: { lia: { p: [-1.6, 7.8], r: 160, a: 'shrug', e: 'flat' } } }),

  // ── O CHEIRO ──
  R({ who: 'NAR', text: 'Aí a Kaká sentiu um cheiro no ar.', min: 1.7,
    cam: { at: 'kaka', d: 2.6, yaw: 0, h: 0.15, push: 0.3, fov: 50 },
    actors: { kaka: { p: [3.0, 7.6], r: 20, a: 'idle', e: 'happy' } }, sfx: [['sparkle', 0.3]] }),
  R({ who: 'KAKA', text: 'Isso é bolo de fubá da Dona Neide!', min: 1.7,
    cam: { at: 'kaka', d: 2.3, yaw: 10, h: 0.1, push: 0.35, fov: 50 },
    actors: { kaka: { p: [3.0, 7.6], r: 150, a: 'point', e: 'happy' } } }),
  R({ who: 'NAR', text: 'Em dez segundos, a festa do rico ficou vazia.', min: 2.2, card: RICO(),
    cam: { pos: [3.4, 1.9, 10.6], look: [0.6, 1.3, 6.6], pos2: [3.0, 1.8, 9.6], look2: [0.6, 1.3, 6.4], fov: 58 },
    actors: { enzo: { p: EZ, r: 0, a: 'shock', e: 'shock' },
      lia: { p: [-1.6, 7.8], to: [-4.5, 11.5], a: 'run', e: 'happy' }, beto: { p: [-0.4, 8.4], to: [-3.4, 12.2], a: 'run', e: 'happy' },
      dudu: { p: [1.8, 8.3], to: [-2.0, 12.6], a: 'run', e: 'happy' }, kaka: { p: [3.0, 7.6], to: [-0.8, 12.0], a: 'run', e: 'happy' } },
    sfx: [['whoosh', 0.25]] }),
  K({ who: 'NAR', text: 'E a casa do pobre ficou lotada.', min: 1.9, card: POBRE(),
    cam: { pos: [0.2, 1.8, 3.8], look: [0, 1.3, -1.2], pos2: [0.1, 1.7, 3.1], look2: [0, 1.3, -1.2], fov: 64 },
    actors: { zinho: { p: [0, -1.0], r: 0, a: 'cheer', e: 'happy' }, mae: { p: [-1.6, -1.6], r: 25, a: 'hold', e: 'happy', prop: 'cake' },
      lia: { p: [-1.0, 0.2], r: 10, a: 'cheer', e: 'happy' }, beto: { p: [1.1, 0.1], r: -10, a: 'cheer', e: 'happy' }, kaka: { p: [1.7, -1.3], r: -30, a: 'cheer', e: 'happy' } },
    sfx: [['sparkle', 0.3]] }),

  // ── O CORAÇÃO ──
  R({ who: 'ENZO', text: 'Ninguém nunca fica na minha festa.', min: 2,
    cam: { at: 'enzo', d: 2.4, yaw: 0, h: 0.1, push: 0.3, fov: 50 },
    actors: { enzo: { p: EZ, r: 0, a: 'headdown', e: 'sad' } } }),
  R({ who: 'ZINHO', text: 'Vem, Enzo. Tem bolo pra todo mundo.', min: 2,
    cam: { pos: [6.0, 1.7, 4.6], look: [1.1, 1.4, 6.9], pos2: [5.4, 1.7, 5.0], look2: [1.1, 1.4, 6.9], fov: 56 },
    actors: { enzo: { p: EZ, r: 30, a: 'idle', e: 'sad' }, zinho: { p: [1.6, 7.6], r: 210, a: 'reach', e: 'happy' } } }),
  K({ who: 'MAE', text: 'Parabéns pros dois!', min: 1.6,
    cam: { pos: [0.2, 1.8, 3.6], look: [0, 1.3, -1.2], pos2: [0.1, 1.7, 3.0], look2: [0, 1.3, -1.2], fov: 62 },
    actors: { zinho: { p: [-0.5, -1.0], r: 10, a: 'cheer', e: 'happy' }, enzo: { p: [0.6, -1.0], r: -10, a: 'cheer', e: 'happy' }, mae: { p: [-1.6, -1.6], r: 25, a: 'hold', e: 'happy', prop: 'cake' } },
    sfx: [['ding', 0.2, 0.5], ['sparkle', 0.4]] }),

  // ── LOOP ──
  R({ who: 'NAR', text: 'E aí? Rico contra pobre: qual é o seu time?', min: 2.2, tail: 0.05,
    cam: { at: 'enzo', d: 3.4, yaw: 15, h: 0.3, push: 0.35, fov: 54 },
    actors: { enzo: { p: EZ, r: 0, a: 'point', e: 'smug' } }, card: { t: 'RICO VS POBRE', s: 'qual é o seu time?', at: 0.3, top: true } }),
];

export const meta = {
  kind: 'short',
  title: 'Rico vs Pobre no aniversário 🎂💰',
  description: 'O Enzo tem um bolo de sete andares. O Zinho tem um bolo de fubá com uma vela. Quem fica com a melhor festa? Comenta: time rico ou time pobre? 👇\n\n#ricovspobre #roblox #animação #zinhoosortudo #shorts\n\nAnimação original feita com ajuda de IA (vozes e produção).',
  tags: ['rico vs pobre', 'rico e pobre', 'pobre vs rico', 'aniversário', 'animação roblox', 'animação estilo roblox', 'história roblox', 'animação de blocos', 'história animada', 'zinho o sortudo', 'rich vs poor', 'shorts'],
  categoryId: '1',
};
