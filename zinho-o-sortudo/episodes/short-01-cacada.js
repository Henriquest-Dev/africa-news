// Short vertical (1080x1920, ~30 s) — "E se você tivesse que caçar com os homens das cavernas?"
// Estilo 2: cores mais vivas (correção de cor), luz de contorno, rubor, squash & stretch e legendas palavra a palavra.
// Render: node tools/render.mjs --w 1080 --h 1920

const S = (o) => ({ style2: true, cap: true, pad: -0.1, ...o });

export default [
  S({ who: 'ZINHO', text: 'E se você tivesse que caçar com os homens das cavernas?', set: 'wild', tod: 'preDay', music: 'quirky', min: 2.9,
    cam: { at: 'zinho', d: 2.8, yaw: 12, h: 0.25, push: 0.25, fov: 52 },
    actors: { zinho: { p: [0, 0], r: 8, a: 'talk', e: 'shock', prop: 'spear' } }, fx: { mammoth: { p: [7, -16], r: 200 } }, sfx: [['whoosh', 0.02, 0.6]] }),
  S({ who: 'NAR', text: 'Quarenta mil anos atrás, não existia mercado.', set: 'cave', tod: 'cave', stamp: '40.000 ANOS ATRÁS', min: 2.9,
    cam: { pos: [0, 2.0, 4.6], look: [0, 1.4, -2.5], pos2: [0, 1.8, 3.6], look2: [0, 1.5, -2.5], fov: 58 },
    actors: { ugo: { p: [-1.3, 0.4], r: 40, a: 'idle', e: 'neutral', prop: 'spear' }, kika: { p: [1.4, 0.2], r: -40, a: 'idle', e: 'happy' }, neo: { p: [0.2, -1.5], r: 0, a: 'talk', e: 'happy' } },
    fx: { fire: [0, -0.2] }, sfx: [['stamp', 0.02], ['fire', 0, 0.5]] }),
  S({ who: 'UGO', text: 'Ugh! Hoje... caçar!', set: 'cave', tod: 'cave', min: 1.9,
    cam: { at: 'ugo', d: 2.9, yaw: -35, h: 0.15, push: 0.15, fov: 52 },
    actors: { ugo: { p: [-0.7, 0.6], look: 'zinho', a: 'point', e: 'angry', prop: 'spear' }, zinho: { p: [1.1, 1.7], look: 'ugo', a: 'idle', e: 'shock' } },
    fx: { fire: [0, -0.6] }, sfx: [['fire', 0, 0.5]] }),
  S({ who: 'NAR', text: 'Eles caçavam em grupo, escondidos no capim.', set: 'wild', tod: 'preDay', min: 2.4,
    cam: { pos: [6, 1.2, 8], look: [-3, 1.0, 2.2], pos2: [5, 1.2, 7], look2: [-2, 1.0, 1.4], fov: 55 },
    actors: { ugo: { p: [-5, 4.5], to: [-0.8, 0.4], a: 'walk', e: 'angry', prop: 'spear' }, zinho: { p: [-6.2, 5.3], to: [-2.0, 1.3], a: 'walk', e: 'worried', prop: 'spear' }, neo: { p: [-7.4, 6.2], to: [-3.2, 2.2], a: 'walk', e: 'neutral', prop: 'spear' } } }),
  S({ who: 'ZINHO', text: 'Pessoal... isso é um elefante peludo?!', set: 'wild', tod: 'preDay', min: 2.0,
    cam: { pos: [0.9, 1.0, 2.6], look: [0, 3.4, -9], pos2: [0.7, 0.9, 2.2], look2: [0, 3.8, -9], fov: 60 },
    actors: { zinho: { p: [0, 0], r: 180, a: 'shock', e: 'shock', prop: 'spear' }, ugo: { p: [-1.6, 0.6], r: 170, a: 'idle', e: 'shock', prop: 'spear' } },
    fx: { mammoth: { p: [0, -9], r: 0 } } }),
  S({ who: 'NAR', text: 'Um mamute. Seis toneladas.', set: 'wild', tod: 'preDay', min: 2.2, shake: 0.04,
    cam: { pos: [2.6, 2.4, -2.6], look: [0, 3.4, -8.2], pos2: [2.2, 2.6, -3.4], look2: [0, 3.6, -8.2], fov: 55 },
    actors: {}, fx: { mammoth: { p: [0, -9], r: 0, a: 'roar', ru: 0.15 } }, sfx: [['boom', 0.15], ['rumble', 0.15, 0.6]] }),
  S({ who: 'NAR', text: 'A lança tinha ponta de pedra. E o plano B... era correr.', set: 'wild', tod: 'preDay', music: 'chase', min: 3.0, shake: 0.06,
    cam: { pos: [0.4, 1.3, 9], look: [0, 1.8, -3], pos2: [0.4, 1.3, 10.5], look2: [0, 1.8, -2], fov: 55 },
    actors: { zinho: { p: [0, -2.5], to: [0.2, 6.5], a: 'run', e: 'shock', prop: 'spear' }, ugo: { p: [-1.3, -3.2], to: [-1.8, 6], a: 'run', e: 'shock', prop: 'spear' }, neo: { p: [1.3, -3.6], to: [2.0, 5.6], a: 'run', e: 'shock' } },
    fx: { mammoth: { p: [0, -12], to: [0, -1.5], a: 'charge', t0: 0.35, t1: 1 } }, sfx: [['rumble', 0, 0.9], ['boom', 0.4]] }),
  S({ who: 'ZINHO', text: 'Esse plano é péssimo!', set: 'wild', tod: 'preDay', min: 1.9, shake: 0.08,
    cam: { at: 'zinho', d: 2.6, yaw: 0, h: 0.1, fov: 58, track: true },
    actors: { zinho: { p: [0, 0], to: [0, 7], a: 'run', e: 'shock' } }, fx: { mammoth: { p: [0, -7], to: [0, 0.5], a: 'charge' } }, sfx: [['rumble', 0, 0.9]] }),
  S({ who: 'NAR', text: 'No fim, o jantar foi... frutinha.', set: 'cave', tod: 'cave', music: 'quirky', min: 2.6,
    cam: { at: 'zinho', d: 2.2, yaw: 15, h: 0.15, push: 0.2, fov: 52 },
    actors: { zinho: { p: [0.8, 0.6], r: -30, a: 'hold', e: 'flat', prop: 'berries' }, ugo: { p: [-0.9, 0.3], r: 40, a: 'hold', e: 'happy', prop: 'berries' } },
    fx: { fire: [0, -0.8] }, sfx: [['fire', 0, 0.5], ['ding', 0.75, 0.5]] }),
  S({ who: 'NAR', text: 'E você? Sobreviveria? Comenta!', set: 'wild', tod: 'preDusk', min: 2.9,
    cam: { pos: [0, 2.0, 6.4], look: [0, 1.6, -2], fov: 56 },
    actors: { zinho: { p: [0, 0], r: 0, a: 'wave', e: 'happy', prop: 'berries' }, ugo: { p: [-1.5, -0.4], r: 15, a: 'cheer', e: 'happy', prop: 'spear' }, kika: { p: [1.5, -0.3], r: -15, a: 'wave', e: 'happy' } },
    fx: { mammoth: { p: [5, -10], r: -30 } }, endcard: 'comment', endcardText: 'Você sobreviveria? ↓' }),
];
