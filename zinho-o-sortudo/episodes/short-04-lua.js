// Short vertical (~50 s) — "E se a Lua sumisse?"
// Ciência curta e correta: marés mais fracas, noites mais escuras, corais que desovam guiados pela Lua cheia
// e o eixo da Terra menos estável ao longo de milhões de anos. Render: node tools/render.mjs --w 1080 --h 1920

const S = (o) => ({ style2: true, cap: true, pad: -0.15, ...o });
const LU = (d, v) => ['lua', d, v, 'LUA'];
const MOON = { at: [-70, 30, -3], r: 8 };

export default [
  // ── GANCHO ──
  S({ who: 'ZINHO', text: 'Ontem a Lua sumiu. Do nada. E o mundo começou a ficar estranho.', set: 'street', tod: 'night',
    music: 'mystery', musicGain: 0.12, duck: 0.72, voiceSpeed: 1.25, lead: 0.03, tail: 0.08,
    cam: { at: 'zinho', d: 2.4, yaw: 10, h: 0.1, push: 0.3, fov: 52 },
    actors: { zinho: { p: [0, -4], r: 160, a: 'talk', e: 'worried' } }, sfx: [['whoosh', 0.02, 0.6]] }),

  S({ who: 'NAR', text: 'Era uma noite normal. Lua cheia, bonita, lá em cima.', set: 'street', tod: 'night', hud: LU(1, '100%'),
    cam: { pos: [3, 0.9, -1.2], look: [-20, 7, -1.5], pos2: [2.6, 0.9, -1.2], look2: [-20, 8, -1.5], fov: 60 },
    actors: { zinho: { p: [-0.4, -2.2], r: -100, a: 'idle', e: 'happy' } }, fx: { moon: MOON } }),
  S({ who: 'NAR', text: 'Até que, em um piscar de olhos...', set: 'street', tod: 'night', hud: LU(1, '0%'), hudIn: 0.6, min: 2.0, shake: 0.03,
    cam: { pos: [2.6, 0.9, -1.2], look: [-20, 8, -1.5], fov: 60 },
    actors: { zinho: { p: [-0.4, -2.2], r: -100, a: 'shock', e: 'shock' } }, fx: { moon: { ...MOON, gone: 0.5 }, flashAt: 0.5 }, sfx: [['glitch', 0.5], ['boom', 0.55]] }),
  S({ who: 'ZINHO', text: 'Gente?! Cadê a Lua?!', set: 'street', tod: 'night', hud: LU(1, '0%'), min: 1.3,
    cam: { at: 'zinho', d: 1.8, yaw: -15, h: -0.1, push: 0.15, fov: 50 },
    actors: { zinho: { p: [-0.4, -2.2], r: -100, a: 'shock', e: 'shock' } } }),

  // ── NOITES ESCURAS ──
  S({ who: 'NAR', text: 'Primeiro: as noites ficariam bem mais escuras. Sem a luz da Lua, só as estrelas.', set: 'street', tod: 'night', hud: LU(1, '0%'), stamp: 'NOITE ESCURA',
    cam: { pos: [3, 2.4, 4], look: [0, 1.4, -4], pos2: [2.4, 2.2, 3.2], look2: [0, 1.4, -4], fov: 55 },
    actors: { zinho: { p: [0, -4], r: 160, a: 'idle', e: 'worried' } }, fx: { blackout: 0.15 }, sfx: [['stamp', 0.02], ['powerdown', 0.15]] }),
  S({ who: 'ZINHO', text: 'Ai! Quem botou esse poste aqui?', set: 'street', tod: 'night', hud: LU(1, '0%'), min: 1.4,
    cam: { pos: [2.6, 1.6, -1.4], look: [0, 0.8, -4.2], fov: 52 },
    actors: { zinho: { p: [0, -4], to: [0.3, -4.2], a: 'trip', e: 'shock' } }, fx: { blackout: 0 }, sfx: [['bonk', 0.4], ['thud', 0.7]] }),

  // ── MARÉS ──
  S({ who: 'NAR', text: 'Segundo: as marés. Quem puxa a maior parte delas é a Lua. Sem ela, só o Sol faria esse trabalho, e as marés ficariam com menos da metade do tamanho.', set: 'egypt', tod: 'dusk', hud: LU(2, '0%'), stamp: 'MARÉS',
    cam: { at: 'zinho', d: 3.2, yaw: 160, h: 0.6, push: 0.15, fov: 58 },
    actors: { zinho: { p: [0, 18], r: 0, a: 'idle', e: 'worried' } }, card: { t: 'MARÉS', s: 'menos da metade do tamanho, só com o Sol', at: 0.45 }, sfx: [['stamp', 0.02]] }),

  // ── CORAIS ──
  S({ who: 'NAR', text: 'Terceiro: muitos corais se reproduzem todos juntos, guiados pela luz da Lua cheia. Sem ela, eles perderiam o relógio.', set: 'wild', tod: 'night', hud: LU(3, '0%'), stamp: 'CORAIS',
    cam: { at: 'zinho', d: 2.6, yaw: 20, h: 0.2, push: 0.15, fov: 52 },
    actors: { zinho: { p: [0, 0], r: 0, a: 'shrug', e: 'sad' } }, card: { t: 'FATO REAL', s: 'Corais desovam guiados pela Lua cheia', at: 0.3 }, sfx: [['stamp', 0.02], ['nature', 0, 0.4]] }),

  // ── O EIXO ──
  S({ who: 'NAR', text: 'E o mais sério: a Lua ajuda a manter o eixo da Terra estável. Sem ela, ao longo de milhões de anos, a inclinação poderia variar muito mais e bagunçar as estações.', set: 'wild', tod: 'storm', hud: LU(4, '0%'), stamp: 'ESTAÇÕES', music: 'tense', shake: 0.02,
    cam: { at: 'zinho', d: 3.0, yaw: -25, h: 0.3, push: 0.2, fov: 55 },
    actors: { zinho: { p: [0, 0], r: 0, a: 'shock', e: 'shock' } }, fx: { cloud: { size: 3, storm: true, rain: true } }, sfx: [['stamp', 0.02], ['thunder', 0.4], ['rain', 0, 0.6]] }),

  // ── PERGUNTA ──
  S({ who: 'ZINHO', text: 'E tem mais. Lobisomem? Desempregado. Música romântica? Sem rima nenhuma.', set: 'street', tod: 'night', hud: LU(4, '0%'), music: 'quirky',
    cam: { at: 'zinho', d: 2.2, yaw: 20, h: 0.1, push: 0.15, fov: 52 },
    actors: { zinho: { p: [0, -4], r: 0, a: 'shrug', e: 'flat' } } }),
  S({ who: 'NAR', text: 'Você sentiria falta da Lua? Responde aí embaixo.', set: 'street', tod: 'night', hud: LU(4, '0%'),
    cam: { at: 'zinho', d: 1.9, yaw: 0, h: 0.1, push: 0.2, fov: 50 },
    actors: { zinho: { p: [0, -4], r: 0, a: 'point', e: 'happy' } }, sfx: [['ding', 0.8, 0.5]] }),

  // ── VIRADA ──
  S({ who: 'NAR', text: 'Calma. A Lua não vai sumir. Ela só se afasta da Terra uns quatro centímetros por ano. Dá tempo.', set: 'street', tod: 'night', hud: LU(5, '100%'), hudIn: 0.1, music: 'wonder',
    cam: { pos: [3, 0.9, -1.2], look: [-20, 7, -1.5], pos2: [3.4, 0.9, -1.2], look2: [-20, 6.5, -1.5], fov: 60 },
    actors: { zinho: { p: [-0.4, -2.2], r: -100, a: 'cheer', e: 'happy' } }, fx: { moon: MOON }, card: { t: 'FATO REAL', s: 'A Lua se afasta cerca de 3,8 cm por ano', at: 0.4 }, sfx: [['sparkle', 0.1]] }),
  S({ who: 'NAR', text: 'Comenta LUA se você aprendeu alguma coisa hoje.', set: 'street', tod: 'night', hud: LU(5, '100%'), min: 2.6,
    cam: { at: 'zinho', d: 3.2, yaw: 15, h: 0.2, push: 0.1, fov: 56 },
    actors: { zinho: { p: [0, -4], r: 0, a: 'wave', e: 'happy' } }, endcard: 'comment', endcardText: 'Comenta “LUA” ↓' }),
];

export const meta = {
  kind: 'short',
  title: 'E se a Lua sumisse hoje à noite? 🌙 #shorts',
  description: 'A Lua sumiu e o Zinho descobriu o quanto ela faz pela Terra: noites escuras, marés mais fracas, corais perdidos e estações bagunçadas. 🌍\n\nVocê sentiria falta da Lua? Comenta LUA 👇\n\n#zinhoosortudo #ese #lua #ciencia #shorts\n\nAnimação original feita com ajuda de IA (vozes e produção).',
  tags: ['zinho o sortudo', 'e se', 'e se a lua sumisse', 'lua', 'marés', 'astronomia', 'ciência', 'curiosidades', 'shorts'],
  categoryId: '1',
};
