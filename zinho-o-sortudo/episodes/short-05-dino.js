// Short vertical (~55 s) — "E se os dinossauros ainda existissem?"
// Fatos: extinção há ~66 milhões de anos (asteroide), humanos só há ~300 mil anos, T. rex com uma das
// mordidas mais fortes já estimadas e braços curtos, e as aves são dinossauros. Render: --w 1080 --h 1920

const S = (o) => ({ style2: true, cap: true, pad: -0.15, ...o });
const P = (d, v) => ['caos', d, v, 'PERIGO'];

export default [
  // ── GANCHO ──
  S({ who: 'ZINHO', text: 'Hoje um tiranossauro sentou no meu ponto de ônibus. E o pior: ele tava na minha frente na fila.', set: 'street', tod: 'day',
    music: 'chase', musicGain: 0.1, duck: 0.72, voiceSpeed: 1.25, lead: 0.03, tail: 0.08,
    cam: { pos: [1.6, 1.3, -2.2], look: [-5.4, 2.4, 4.0], pos2: [1.0, 1.25, -1.6], look2: [-5.4, 2.6, 4.0], fov: 60 },
    actors: { zinho: { p: [-3.8, 4.6], r: 210, a: 'talk', e: 'shock' } }, fx: { dino: { p: [-8.4, 3.4], r: 120, s: 0.9 } }, sfx: [['whoosh', 0.02, 0.6]] }),

  S({ who: 'NAR', text: 'E se os dinossauros nunca tivessem sido extintos?', set: 'street', tod: 'day', hud: P(1, '10%'), stamp: 'E SE...?',
    cam: { pos: [5, 3.2, -4.5], look: [-5.6, 2.4, 4.0], pos2: [4, 3.0, -3.8], look2: [-5.6, 2.6, 4.0], fov: 55 },
    actors: { zinho: { p: [-3.8, 4.6], r: 210, a: 'idle', e: 'worried' } }, fx: { dino: { p: [-8.4, 3.4], r: 120, s: 0.9 } }, sfx: [['stamp', 0.02]] }),

  // ── O RUGIDO ──
  S({ who: 'NAR', text: 'O Zinho só queria ir pra escola. Mas o T. rex achou que ele parecia um lanche.', set: 'street', tod: 'day', hud: P(1, '60%'),
    cam: { pos: [-1.2, 1.1, 1.4], look: [-8.0, 4.0, 3.6], pos2: [-1.5, 1.0, 1.6], look2: [-8.0, 4.4, 3.6], fov: 60 },
    actors: { zinho: { p: [-4.0, 4.4], r: 250, a: 'shock', e: 'shock' } }, fx: { dino: { p: [-8.4, 3.4], r: 100, s: 0.9, a: 'roar', ru: 0.55 } }, sfx: [['boom', 0.55], ['rumble', 0.55, 0.7]] }),
  S({ who: 'ZINHO', text: 'Calma, calma! Toma, um misto quente!', set: 'street', tod: 'day', hud: P(1, '80%'), min: 1.5,
    cam: { at: 'zinho', d: 2.2, yaw: 30, h: 0.1, push: 0.15, fov: 52 },
    actors: { zinho: { p: [-4.0, 4.4], r: 250, a: 'reach', e: 'worried', prop: 'sandwich' } } }),

  // ── OS BRACINHOS ──
  S({ who: 'NAR', text: 'Só que o T. rex tinha um probleminha. Os braços eram curtos demais pra alcançar o próprio lanche.', set: 'street', tod: 'day', hud: P(1, '50%'),
    cam: { pos: [-4.4, 3.4, 0.2], look: [-7.8, 3.0, 3.2], pos2: [-4.8, 3.6, 0.6], look2: [-7.8, 3.0, 3.2], fov: 55 },
    actors: { zinho: { p: [-4.0, 4.4], r: 250, a: 'reach', e: 'flat', prop: 'sandwich' } }, fx: { dino: { p: [-8.4, 3.4], r: 100, s: 0.9, a: 'chew' } }, sfx: [['bonk', 0.6]] }),

  // ── FATOS ──
  S({ who: 'NAR', text: 'Na vida real, a gente nunca se encontrou. Os dinossauros gigantes sumiram há sessenta e seis milhões de anos, depois que um asteroide caiu na Terra.', set: 'wild', tod: 'dusk', hud: P(2, '0%'), stamp: '66 MILHÕES DE ANOS', music: 'wonder',
    cam: { pos: [4, 2.2, 9], look: [0, 3, -2], pos2: [3.4, 2.0, 8], look2: [0, 3.2, -2], fov: 56 },
    actors: {}, fx: { dino: { p: [2, -5], to: [0, -1], a: 'walk', s: 1.1 }, meteor: [0.35, 0.95] }, sfx: [['stamp', 0.02], ['whoosh', 0.5], ['boom', 0.92]] }),
  S({ who: 'NAR', text: 'E os primeiros humanos como nós só apareceram há uns trezentos mil anos. Muito, muito depois.', set: 'wild', tod: 'preDay', hud: P(2, '0%'),
    cam: { at: 'zinho', d: 2.6, yaw: 20, h: 0.15, push: 0.15, fov: 52 },
    actors: { zinho: { p: [0, 0], r: 0, a: 'shrug', e: 'neutral' } }, card: { t: 'FATO REAL', s: 'Humanos e T. rex nunca viveram na mesma época', at: 0.2 }, sfx: [['nature', 0, 0.4]] }),

  // ── PERGUNTA ──
  S({ who: 'NAR', text: 'Se existisse um dinossauro de estimação, qual você teria? Responde aí.', set: 'street', tod: 'day', hud: P(2, '0%'), music: 'quirky',
    cam: { at: 'zinho', d: 2.0, yaw: 0, h: 0.1, push: 0.2, fov: 50 },
    actors: { zinho: { p: [0, -4], r: 0, a: 'point', e: 'happy' } }, sfx: [['ding', 0.8, 0.5]] }),

  // ── VIRADA ──
  S({ who: 'MAE', text: 'Zinho, para de falar de dinossauro e vem jantar. Tem frango.', set: 'kitchen', tod: 'indoorNight', hud: P(3, '0%'),
    cam: { at: 'mae', d: 2.5, yaw: -40, h: 0.1, push: 0.12, fov: 52 },
    actors: { zinho: { p: [-0.8, 0.4], look: 'mae', a: 'idle', e: 'flat' }, mae: { p: [1, 0.2], look: 'zinho', a: 'point', e: 'happy' } } }),
  S({ who: 'NAR', text: 'O que a Dona Neide não sabia: as aves são dinossauros. O frango no prato é parente do T. rex.', set: 'kitchen', tod: 'indoorNight', hud: P(3, '100%'), hudIn: 0.5, shake: 0.03,
    cam: { at: 'zinho', d: 2.0, yaw: 25, h: 0.1, push: 0.2, fov: 52 },
    actors: { zinho: { p: [-0.8, 0.4], look: 'mae', a: 'shock', e: 'shock' }, mae: { p: [1, 0.2], look: 'zinho', a: 'idle', e: 'neutral' } }, card: { t: 'FATO REAL', s: 'As aves são dinossauros', at: 0.35 }, sfx: [['boom', 0.5]] }),
  S({ who: 'ZINHO', text: 'Mãe... eu vou comer um dinossauro?', set: 'kitchen', tod: 'indoorNight', hud: P(3, '100%'), min: 1.5,
    cam: { at: 'zinho', d: 1.7, yaw: 10, h: 0.05, push: 0.15, fov: 50 },
    actors: { zinho: { p: [-0.8, 0.4], look: 'mae', a: 'idle', e: 'smug' } } }),

  S({ who: 'NAR', text: 'Comenta DINO se você já sabia disso.', set: 'street', tod: 'dusk', hud: P(3, '100%'), min: 2.6,
    cam: { pos: [1.4, 1.4, -2.0], look: [-5.4, 2.2, 4.0], fov: 60 },
    actors: { zinho: { p: [-3.8, 4.6], r: 210, a: 'wave', e: 'happy' } }, fx: { dino: { p: [-8.4, 3.4], r: 120, s: 0.9 } },
    endcard: 'comment', endcardText: 'Comenta “DINO” ↓' }),
];

export const meta = {
  kind: 'short',
  title: 'Um T. rex no meu ponto de ônibus 🦖 e se os dinossauros ainda existissem? #shorts',
  description: 'E se os dinossauros nunca tivessem sido extintos? O Zinho encontrou um T. rex no ponto de ônibus… e descobriu um fato sobre o jantar. 🍗🦖\n\nQual dinossauro você teria de estimação? Comenta DINO 👇\n\n#zinhoosortudo #ese #dinossauros #trex #shorts\n\nAnimação original feita com ajuda de IA (vozes e produção).',
  tags: ['zinho o sortudo', 'e se', 'dinossauros', 'e se os dinossauros ainda existissem', 't rex', 'tiranossauro', 'curiosidades', 'animação 3d', 'shorts'],
  categoryId: '1',
};
