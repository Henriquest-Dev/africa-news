// Short vertical (1080x1920, ~60 s) — "E se você tivesse que sobreviver 7 dias na Idade da Pedra?"
// Feito para retenção: gancho com promessa aberta, contador de FOME sempre subindo, cortes rápidos,
// pergunta ao público no meio, virada com um objeto moderno e pedido de comentário com palavra-chave.
// Render: node tools/render.mjs --w 1080 --h 1920

const S = (o) => ({ style2: true, cap: true, pad: -0.05, ...o });
const F = (d, v) => ['fome', d, v];

export default [
  // ── GANCHO (0–4 s): promessa aberta ──
  S({ who: 'ZINHO', text: 'Eu tive que sobreviver sete dias na Idade da Pedra. E no dia sete... eu quase não voltei.', set: 'wild', tod: 'preDusk',
    music: 'tribal', musicGain: 0.12, duck: 0.72, voiceSpeed: 1.15, lead: 0.04, tail: 0.1,
    cam: { at: 'zinho', d: 2.4, yaw: 8, h: 0.15, push: 0.3, fov: 52 },
    actors: { zinho: { p: [0, 0], r: 0, a: 'talk', e: 'worried', prop: 'spear' } }, fx: { mammoth: { p: [-6, -13], r: 160 } }, sfx: [['whoosh', 0.02, 0.6], ['nature', 0, 0.6]] }),

  // ── DIA 1 ──
  S({ who: 'NAR', text: 'Dia um. Sem celular, sem comida. Só uma lança e um vizinho de quarenta mil anos.', set: 'wild', tod: 'preDay', hud: F(1, '20%'), stamp: 'DIA 1',
    cam: { pos: [3.5, 1.6, 5], look: [0, 1.3, 0], pos2: [2.6, 1.5, 4.0], look2: [0, 1.3, 0], fov: 55 },
    actors: { zinho: { p: [-0.7, 0], r: 30, a: 'idle', e: 'neutral', prop: 'spear' }, ugo: { p: [0.9, -0.3], look: 'zinho', a: 'idle', e: 'flat', prop: 'spear' } }, sfx: [['stamp', 0.02], ['nature', 0, 0.6]] }),
  S({ who: 'UGO', text: 'Ugh. Você. Fraco.', set: 'wild', tod: 'preDay', hud: F(1, '20%'), min: 1.6,
    cam: { at: 'ugo', d: 2.5, yaw: -35, h: 0.1, push: 0.15, fov: 52 },
    actors: { zinho: { p: [-0.7, 0], look: 'ugo', a: 'idle', e: 'shock', prop: 'spear' }, ugo: { p: [0.9, -0.3], look: 'zinho', a: 'point', e: 'flat', prop: 'spear' } }, sfx: [['nature', 0, 0.6]] }),
  S({ who: 'ZINHO', text: 'Valeu, Ugo. Também te amo.', set: 'wild', tod: 'preDay', hud: F(1, '20%'), min: 1.6,
    cam: { at: 'zinho', d: 2.4, yaw: 35, h: 0.1, push: 0.12, fov: 52 },
    actors: { zinho: { p: [-0.7, 0], look: 'ugo', a: 'shrug', e: 'flat', prop: 'spear' }, ugo: { p: [0.9, -0.3], look: 'zinho', a: 'idle', e: 'flat', prop: 'spear' } }, sfx: [['nature', 0, 0.6]] }),

  // ── DIA 2 ──
  S({ who: 'NAR', text: 'Dia dois. Primeira lição: fogo não vem de isqueiro.', set: 'cave', tod: 'cave', hud: F(2, '45%'), stamp: 'DIA 2',
    cam: { at: 'zinho', d: 2.4, yaw: 20, h: 0.4, push: 0.2, fov: 52 },
    actors: { zinho: { p: [0, 0.4], r: 0, a: 'sitfloor', e: 'angry', prop: 'spear' } }, fx: { smokeHands: true }, sfx: [['stamp', 0.02], ['snap', 0.6], ['snap', 0.8]] }),
  S({ who: 'NAR', text: 'Duas horas esfregando graveto. E quem acendeu... foi a Kika. Em dez segundos.', set: 'cave', tod: 'cave', hud: F(2, '45%'),
    cam: { pos: [2.2, 1.4, 3.2], look: [0, 0.8, 0], pos2: [1.8, 1.3, 2.6], look2: [0, 0.8, 0], fov: 55 },
    actors: { zinho: { p: [-0.9, 0.7], r: 60, a: 'sitfloor', e: 'flat' }, kika: { p: [1.0, -0.4], look: 'zinho', a: 'cheer', e: 'smug' } }, fx: { fire: [0, 0], fireIn: 0.62 }, sfx: [['fire', 0.62, 0.5], ['sparkle', 0.62, 0.6], ['ding', 0.66, 0.5]] }),

  // ── DIA 3 ──
  S({ who: 'NAR', text: 'Dia três. A fome bateu forte.', set: 'cave', tod: 'cave', hud: F(3, '70%'), stamp: 'DIA 3',
    cam: { at: 'zinho', d: 2.0, yaw: 10, h: 0.05, push: 0.25, fov: 52 },
    actors: { zinho: { p: [0, 0.4], r: 0, a: 'idle', e: 'sad' } }, fx: { fire: [0.6, -0.8] }, sfx: [['stamp', 0.02], ['fire', 0, 0.4]] }),
  S({ who: 'ZINHO', text: 'Eu daria tudo por um pão de queijo.', set: 'cave', tod: 'cave', hud: F(3, '70%'), min: 2,
    cam: { at: 'zinho', d: 2.3, yaw: 35, h: 0.1, fov: 52 },
    actors: { zinho: { p: [0, 0.4], look: 'ugo', a: 'talk', e: 'sad' }, ugo: { p: [1.6, -0.2], look: 'zinho', a: 'idle', e: 'neutral' } }, fx: { fire: [0.6, -0.8] }, sfx: [['fire', 0, 0.4]] }),
  S({ who: 'UGO', text: 'Pão... de... quê?', set: 'cave', tod: 'cave', hud: F(3, '70%'), min: 1.8,
    cam: { at: 'ugo', d: 2.3, yaw: -35, h: 0.1, push: 0.15, fov: 52 },
    actors: { zinho: { p: [0, 0.4], look: 'ugo', a: 'idle', e: 'flat' }, ugo: { p: [1.6, -0.2], look: 'zinho', a: 'shrug', e: 'shock' } }, fx: { fire: [0.6, -0.8] }, sfx: [['fire', 0, 0.4]] }),

  // ── PERGUNTA AO PÚBLICO ──
  S({ who: 'NAR', text: 'O cardápio era frutinha, raiz... e às vezes, inseto. Você comeria? Responde aí.', set: 'cave', tod: 'cave', hud: F(4, '80%'),
    cam: { at: 'zinho', d: 1.9, yaw: 0, h: 0.15, push: 0.2, fov: 50 },
    actors: { zinho: { p: [0, 0.4], r: 0, a: 'hold', e: 'shock', prop: 'berries' } }, fx: { fire: [0.6, -0.8] }, sfx: [['fire', 0, 0.4], ['ding', 0.85, 0.5]] }),
  S({ who: 'ZINHO', text: 'Inseto?! Eu passo.', set: 'cave', tod: 'cave', hud: F(4, '80%'), min: 1.6,
    cam: { at: 'zinho', d: 1.7, yaw: -10, h: 0.05, fov: 52 },
    actors: { zinho: { p: [0, 0.4], r: 0, a: 'shock', e: 'shock', prop: 'berries' } }, fx: { fire: [0.6, -0.8] }, sfx: [['fire', 0, 0.4]] }),

  // ── DIA 5: O MAMUTE ──
  S({ who: 'NAR', text: 'Dia cinco. A tribo achou comida pra um mês inteiro.', set: 'wild', tod: 'preDay', hud: F(5, '90%'), stamp: 'DIA 5', music: 'tribalChase',
    cam: { pos: [0.9, 1.0, 2.6], look: [0, 3.4, -9], pos2: [0.7, 0.9, 2.1], look2: [0, 3.8, -9], fov: 60 },
    actors: { zinho: { p: [0, 0], r: 180, a: 'shock', e: 'shock', prop: 'spear' }, ugo: { p: [-1.6, 0.6], r: 170, a: 'idle', e: 'angry', prop: 'spear' }, kika: { p: [1.6, 0.8], r: 190, a: 'idle', e: 'neutral' } },
    fx: { mammoth: { p: [0, -9], r: 0, a: 'roar', ru: 0.45 } }, sfx: [['stamp', 0.02], ['boom', 0.45], ['nature', 0, 0.5]] }),
  S({ who: 'NAR', text: 'Um mamute. E a regra da tribo era clara: ninguém caça sozinho.', set: 'wild', tod: 'preDay', hud: F(5, '90%'),
    cam: { pos: [7, 2.4, 6], look: [0, 1.2, -3], pos2: [5, 2.2, 4.6], look2: [0, 1.4, -3.5], fov: 55 },
    actors: { zinho: { p: [-1.8, -2], look: 'ugo', a: 'idle', e: 'worried', prop: 'spear' }, ugo: { p: [1.6, -2.4], r: 200, a: 'point', e: 'angry', prop: 'spear' }, kika: { p: [0, -1], r: 180, a: 'idle', e: 'angry', prop: 'spear' } },
    fx: { mammoth: { p: [0, -8.5], r: 0 } }, sfx: [['nature', 0, 0.5]] }),

  // ── DIA 6: TUDO ERRADO ──
  S({ who: 'NAR', text: 'Dia seis. O plano deu errado. Muito errado.', set: 'wild', tod: 'preDay', hud: F(6, '95%'), stamp: 'DIA 6', shake: 0.06,
    cam: { pos: [0.4, 1.3, 9], look: [0, 1.8, -3], pos2: [0.4, 1.3, 10.5], look2: [0, 1.8, -2], fov: 55 },
    actors: { zinho: { p: [0, -2.5], to: [0.2, 6.5], a: 'run', e: 'shock', prop: 'spear' }, ugo: { p: [-1.3, -3.2], to: [-1.8, 6], a: 'run', e: 'shock', prop: 'spear' }, kika: { p: [1.3, -3.6], to: [2.0, 5.6], a: 'run', e: 'shock' } },
    fx: { mammoth: { p: [0, -12], to: [0, -1.5], a: 'charge', t0: 0.3, t1: 1 } }, sfx: [['stamp', 0.02], ['rumble', 0, 0.9], ['boom', 0.35]] }),

  // ── DIA 7: CLÍMAX E VIRADA ──
  S({ who: 'NAR', text: 'Dia sete. O Zinho ficou encurralado. Na frente, seis toneladas de mamute. Atrás, uma parede de pedra.', set: 'wild', tod: 'preDusk', hud: F(7, '99%'), stamp: 'DIA 7', music: 'none', shake: 0.03,
    cam: { pos: [4.2, 1.6, -5.2], look: [-11, 1.6, -13], pos2: [3.4, 1.5, -6.0], look2: [-11, 1.7, -13.5], fov: 55 },
    actors: { zinho: { p: [-11.2, -14.6], r: 40, a: 'shock', e: 'shock' } }, fx: { mammoth: { p: [-3.5, -8.5], to: [-6.8, -10.8], a: 'walk', r: -125 } }, sfx: [['stamp', 0.02], ['rumble', 0, 0.8]] }),
  S({ who: 'ZINHO', text: 'Pera... eu ainda tenho uma coisa.', set: 'wild', tod: 'preDusk', hud: F(7, '99%'), min: 2,
    cam: { at: 'zinho', d: 2.0, yaw: 0, h: 0.0, push: 0.2, fov: 52 },
    actors: { zinho: { p: [-11.2, -14.6], r: 40, a: 'hold', e: 'smug', prop: 'phone' } }, sfx: [['rumble', 0, 0.6]] }),
  S({ who: 'NAR', text: 'O celular. Com dez por cento de bateria.', set: 'wild', tod: 'preDusk', hud: F(7, '99%'), min: 2.6,
    cam: { at: 'zinho', d: 1.4, yaw: 15, h: -0.15, push: 0.15, fov: 50 },
    actors: { zinho: { p: [-11.2, -14.6], r: 40, a: 'hold', e: 'smug', prop: 'phone' } }, fx: { phoneLight: 0.55 }, sfx: [['ding', 0.55]] }),
  S({ who: 'NAR', text: 'Ele colocou o alarme no volume máximo.', set: 'wild', tod: 'preDusk', hud: F(7, '99%'), min: 3, shake: 0.05,
    cam: { pos: [-1.6, 2.6, -5.4], look: [-7.8, 2.4, -11.6], pos2: [-2.4, 2.4, -6.4], look2: [-8.4, 2.4, -12.2], fov: 56 },
    actors: { zinho: { p: [-11.2, -14.6], r: 40, a: 'hold', e: 'angry', prop: 'phone' } }, fx: { phoneLight: 0, wave: 0.15, mammoth: { p: [-6.8, -10.8], to: [6, -2], a: 'charge', t0: 0.35, t1: 1 } },
    sfx: [['alarm', 0.15, 1.2], ['boom', 0.35], ['rumble', 0.35, 0.8]] }),
  S({ who: 'NAR', text: 'Seis toneladas. Fugindo de um despertador.', set: 'wild', tod: 'preDusk', hud: F(7, '99%'), music: 'tribal',
    cam: { pos: [0, 2.0, 8], look: [3, 2.4, -2], pos2: [0, 2.4, 9.5], look2: [8, 2.6, -1], fov: 55 },
    actors: {}, fx: { mammoth: { p: [-2, -6], to: [16, 6], a: 'charge' } }, sfx: [['rumble', 0, 0.6], ['cheer', 0.6, 0.5]] }),

  // ── FINAL + PEDIDO DE COMENTÁRIO ──
  S({ who: 'UGO', text: 'Você. Forte.', set: 'wild', tod: 'preDusk', hud: F(7, '0%'), hudIn: 0.4, min: 2.2,
    cam: { at: 'ugo', d: 2.5, yaw: -30, h: 0.1, push: 0.12, fov: 52 },
    actors: { zinho: { p: [-0.7, 0], look: 'ugo', a: 'idle', e: 'happy', prop: 'phone' }, ugo: { p: [0.9, -0.3], look: 'zinho', a: 'cheer', e: 'happy', prop: 'berries' } }, sfx: [['ding', 0.4]] }),
  S({ who: 'ZINHO', text: 'Eu sei, Ugo. Eu sei.', set: 'wild', tod: 'preDusk', hud: F(7, '0%'), min: 1.8,
    cam: { at: 'zinho', d: 2.2, yaw: 30, h: 0.1, push: 0.15, fov: 52 },
    actors: { zinho: { p: [-0.7, 0], look: 'ugo', a: 'cheer', e: 'smug', prop: 'phone' }, ugo: { p: [0.9, -0.3], look: 'zinho', a: 'idle', e: 'happy' } }, sfx: [['cheer', 0.3, 0.4]] }),
  S({ who: 'NAR', text: 'Quer a parte dois? Comenta Ugo, que a tribo volta.', set: 'wild', tod: 'preDusk', hud: F(7, '0%'), min: 3.6,
    cam: { pos: [0, 2.0, 6.4], look: [0, 1.6, -2], fov: 56 },
    actors: { zinho: { p: [0, 0], r: 0, a: 'wave', e: 'happy', prop: 'phone' }, ugo: { p: [-1.5, -0.4], r: 15, a: 'cheer', e: 'happy', prop: 'spear' }, kika: { p: [1.5, -0.3], r: -15, a: 'wave', e: 'happy' } },
    endcard: 'comment', endcardText: 'Comenta “UGO” ↓' }),
];
