// Short vertical (~55 s) — "E se um homem das cavernas aparecesse na sua cidade?"
// Parte 2 do Ugo (resposta ao "Comenta UGO" do Short dos 7 dias). Render: node tools/render.mjs --w 1080 --h 1920

const S = (o) => ({ style2: true, cap: true, pad: -0.15, ...o });
const C = (d, v) => ['caos', d, v, 'CAOS'];

export default [
  // ── GANCHO ──
  S({ who: 'ZINHO', text: 'Vocês pediram, e o Ugo veio. Pra minha rua. Em uma hora, ele quase acabou com o bairro.', set: 'street', tod: 'day',
    music: 'tribal', musicGain: 0.12, duck: 0.72, voiceSpeed: 1.25, lead: 0.03, tail: 0.08,
    cam: { at: 'zinho', d: 2.6, yaw: 12, h: 0.15, push: 0.3, fov: 52 },
    actors: { zinho: { p: [0, -4], r: 0, a: 'talk', e: 'worried' }, ugo: { p: [1.6, -4.6], r: -20, a: 'idle', e: 'neutral', prop: 'spear' } }, sfx: [['whoosh', 0.02, 0.6]] }),

  // ── O ÔNIBUS ──
  S({ who: 'NAR', text: 'Primeira parada: o ponto de ônibus.', set: 'street', tod: 'day', hud: C(1, '10%'), stamp: '9:00',
    cam: { pos: [-1.0, 1.6, -1.6], look: [-5, 1.4, 4.6], pos2: [-1.6, 1.5, -1.0], look2: [-5, 1.4, 4.6], fov: 55 },
    actors: { zinho: { p: [-4.2, 4.6], r: 180, a: 'idle', e: 'neutral' }, ugo: { p: [-5.8, 4.5], r: 180, a: 'idle', e: 'neutral', prop: 'spear' } }, sfx: [['stamp', 0.02]] }),
  S({ who: 'UGO', text: 'Mamute! Mamute amarelo!', set: 'street', tod: 'day', hud: C(1, '30%'), min: 1.6, shake: 0.03,
    cam: { at: 'ugo', d: 2.4, yaw: -25, h: 0.1, push: 0.2, fov: 52 },
    actors: { zinho: { p: [-4.2, 4.6], r: 180, a: 'shock', e: 'shock' }, ugo: { p: [-5.8, 4.5], r: 180, a: 'point', e: 'angry', prop: 'spear' } }, fx: { bus: true }, sfx: [['bus', 0.2]] }),
  S({ who: 'ZINHO', text: 'É o ônibus, Ugo! Abaixa essa lança!', set: 'street', tod: 'day', hud: C(1, '35%'), min: 1.4,
    cam: { at: 'zinho', d: 2.3, yaw: 30, h: 0.1, push: 0.15, fov: 52 },
    actors: { zinho: { p: [-4.2, 4.6], look: 'ugo', a: 'angry', e: 'shock' }, ugo: { p: [-5.8, 4.5], look: 'zinho', a: 'idle', e: 'angry', prop: 'spear' } } }),

  // ── A PADARIA ──
  S({ who: 'NAR', text: 'Segunda parada: a padaria. O Ugo nunca tinha visto pão.', set: 'street', tod: 'day', hud: C(1, '40%'), stamp: '9:20',
    cam: { at: 'ugo', d: 2.6, yaw: 20, h: 0.1, push: 0.2, fov: 52 },
    actors: { ugo: { p: [-17.4, -5.6], r: 10, a: 'hold', e: 'shock', prop: 'bread' }, zinho: { p: [-19, -5.2], look: 'ugo', a: 'idle', e: 'happy' } }, sfx: [['stamp', 0.02], ['sparkle', 0.5]] }),
  S({ who: 'UGO', text: 'Pedra... macia?', set: 'street', tod: 'day', hud: C(1, '40%'), min: 1.3,
    cam: { at: 'ugo', d: 2.4, yaw: -10, h: 0.05, push: 0.15, fov: 50 },
    actors: { ugo: { p: [-17.4, -5.6], r: 10, a: 'hold', e: 'shock', prop: 'bread' } } }),
  S({ who: 'NAR', text: 'Ele comeu doze. E pagou com uma pedra.', set: 'street', tod: 'day', hud: C(1, '55%'), min: 1.8,
    cam: { at: 'ugo', d: 2.5, yaw: 35, h: 0.15, push: 0.1, fov: 52 },
    actors: { ugo: { p: [-17.4, -5.6], r: 10, a: 'cheer', e: 'happy', prop: 'bread' }, zinho: { p: [-19, -5.2], look: 'ugo', a: 'idle', e: 'flat' } }, sfx: [['ding', 0.55]] }),

  // ── PERGUNTA ──
  S({ who: 'NAR', text: 'E você? O que mostraria primeiro pra um homem das cavernas? Responde aí.', set: 'street', tod: 'day', hud: C(1, '55%'),
    cam: { at: 'zinho', d: 2.0, yaw: 0, h: 0.15, push: 0.2, fov: 50 },
    actors: { zinho: { p: [-19, -5.2], r: 0, a: 'point', e: 'happy' } }, sfx: [['ding', 0.85, 0.5]] }),

  // ── A GELADEIRA ──
  S({ who: 'NAR', text: 'Terceira parada: a cozinha. E a geladeira.', set: 'kitchen', tod: 'indoor', hud: C(1, '60%'), stamp: '10:00',
    cam: { pos: [-0.5, 1.9, 2.2], look: [2.4, 1.1, -2.6], pos2: [0, 1.8, 1.6], look2: [2.8, 1.1, -2.6], fov: 58 },
    actors: { ugo: { p: [1.4, -1.4], to: [2.0, -1.8], a: 'walk', e: 'neutral' } }, fx: { fridgeOpen: true }, sfx: [['stamp', 0.02]] }),
  S({ who: 'UGO', text: 'Caverna fria! Ugo mora aqui agora.', set: 'kitchen', tod: 'indoor', hud: C(1, '70%'), min: 1.6,
    cam: { at: 'ugo', d: 2.6, yaw: 25, h: 0.1, push: 0.15, fov: 52 },
    actors: { ugo: { p: [2.0, -1.8], r: 150, a: 'cheer', e: 'happy' } }, fx: { fridgeOpen: true } }),

  // ── CURIOSIDADE REAL ──
  S({ who: 'NAR', text: 'Curiosidade real: os neandertais usavam fogo, faziam ferramentas e cuidavam dos feridos. Burro, o Ugo não era.', set: 'kitchen', tod: 'indoor', hud: C(1, '70%'),
    cam: { at: 'ugo', d: 2.8, yaw: 20, h: 0.2, push: 0.15, fov: 52 },
    actors: { ugo: { p: [0.2, 0.2], r: 10, a: 'idle', e: 'smug', prop: 'spear' } }, card: { t: 'FATO REAL', s: 'Neandertais: fogo, ferramentas e cuidado com os feridos', at: 0.1 }, sfx: [['ding', 0.1]] }),

  // ── A NOITE ──
  S({ who: 'NAR', text: 'Mas o pior foi de noite. O Ugo viu o poste acender e achou que era um sol preso.', set: 'street', tod: 'night', hud: C(1, '85%'), stamp: '19:00', music: 'tribalChase',
    cam: { at: 'ugo', d: 3.0, yaw: 25, h: 0.3, push: 0.2, fov: 55 },
    actors: { ugo: { p: [2, -4.6], r: 20, a: 'point', e: 'shock', prop: 'spear' }, zinho: { p: [0.4, -4.2], look: 'ugo', a: 'idle', e: 'worried' } }, sfx: [['stamp', 0.02]] }),
  S({ who: 'UGO', text: 'Sol preso! Ugo solta!', set: 'street', tod: 'night', hud: C(1, '99%'), min: 1.6, shake: 0.06,
    cam: { at: 'ugo', d: 2.8, yaw: -20, h: 0.1, push: 0.15, fov: 52 },
    actors: { ugo: { p: [2, -4.6], r: 20, a: 'angry', e: 'angry', prop: 'spear' } }, fx: { blackout: 0.65 }, sfx: [['clang', 0.5], ['powerdown', 0.65]] }),
  S({ who: 'ZINHO', text: 'Ugo! Você apagou o bairro inteiro!', set: 'street', tod: 'night', hud: C(1, '100%'), min: 1.4,
    cam: { at: 'zinho', d: 2.2, yaw: 25, h: 0.1, push: 0.15, fov: 52 },
    actors: { zinho: { p: [0.4, -4.2], look: 'ugo', a: 'shock', e: 'shock' }, ugo: { p: [2, -4.6], look: 'zinho', a: 'idle', e: 'smug', prop: 'spear' } }, fx: { blackout: 0 } }),
  S({ who: 'UGO', text: 'Agora sim. Noite certa.', set: 'street', tod: 'night', hud: C(1, '100%'), min: 1.4, music: 'tribal',
    cam: { at: 'ugo', d: 2.8, yaw: -30, h: 0.1, push: 0.12, fov: 52 },
    actors: { zinho: { p: [0.4, -4.2], look: 'ugo', a: 'idle', e: 'flat' }, ugo: { p: [2, -4.6], look: 'zinho', a: 'cheer', e: 'happy', prop: 'spear' } }, fx: { blackout: 0 } }),

  // ── PEDIDO DE COMENTÁRIO ──
  S({ who: 'NAR', text: 'Parte três? Comenta FOGO, que o Ugo volta.', set: 'street', tod: 'night', hud: C(1, '100%'), min: 2.6,
    cam: { pos: [1.2, 1.6, 0.8], look: [1.2, 1.3, -4.4], fov: 56 },
    actors: { zinho: { p: [0.4, -4.2], r: 0, a: 'wave', e: 'happy' }, ugo: { p: [2, -4.6], r: -15, a: 'wave', e: 'happy', prop: 'spear' } }, fx: { blackout: 0 },
    endcard: 'comment', endcardText: 'Comenta “FOGO” ↓' }),
];

export const meta = {
  kind: 'short',
  title: 'Trouxe um homem das cavernas pra cidade 🦴 e ele apagou o bairro #shorts',
  description: 'O Ugo saiu da Idade da Pedra e veio parar na rua do Zinho. Ônibus, pão, geladeira… e um poste. 😅\n\nO que você mostraria primeiro pra um homem das cavernas? Responde aí 👇\nQuer a parte três? Comenta FOGO!\n\n#zinhoosortudo #ese #homemdascavernas #shorts\n\nAnimação original feita com ajuda de IA (vozes e produção).',
  tags: ['zinho o sortudo', 'e se', 'homem das cavernas', 'neandertal', 'homem das cavernas na cidade', 'ugo', 'animação 3d', 'shorts', 'humor'],
  categoryId: '1',
};
