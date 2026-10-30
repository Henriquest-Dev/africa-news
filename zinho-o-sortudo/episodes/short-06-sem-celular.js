// Short vertical (~55 s) — "E se o celular nunca tivesse sido inventado?"
// Fatos: primeira ligação de um celular de mão em 1973 (Martin Cooper, Nova York); o orelhão brasileiro foi
// desenhado pela arquiteta Chu Ming Silveira no começo dos anos 70. Render: --w 1080 --h 1920

const S = (o) => ({ style2: true, cap: true, pad: -0.15, ...o });
const B = (d, v) => ['caos', d, v, 'TÉDIO'];
const ORE = [3.2, -5.0, 0];

export default [
  // ── GANCHO ──
  S({ who: 'ZINHO', text: 'Acordei num mundo onde o celular nunca foi inventado. E em dez minutos eu já tava perdido.', set: 'bedroom', tod: 'indoor',
    music: 'quirky', musicGain: 0.12, duck: 0.72, voiceSpeed: 1.25, lead: 0.03, tail: 0.08,
    cam: { at: 'zinho', d: 2.2, yaw: 30, h: 0.3, push: 0.3, fov: 52 },
    actors: { zinho: { p: [-2, -1.6], a: 'sitbed', e: 'shock' } }, sfx: [['whoosh', 0.02, 0.6]] }),

  S({ who: 'NAR', text: 'Sem celular, o despertador era isso aqui. E ele não tinha botão de soneca.', set: 'bedroom', tod: 'indoor', hud: B(1, '20%'), stamp: '6:00',
    cam: { pos: [0.8, 2.3, -1.2], look: [1, 2.4, -3.5], pos2: [0.9, 2.35, -2.0], look2: [1, 2.4, -3.5], fov: 55 },
    actors: { zinho: { p: [-2, -1.6], a: 'lie', e: 'closed' } }, fx: { clock: [5.98, 6.0], alarm: 0.3 }, sfx: [['stamp', 0.02], ['alarm', 0.3, 1.2]] }),

  // ── O MAPA ──
  S({ who: 'NAR', text: 'Pra ir na casa do Beto, nada de GPS. Era mapa de papel. Daqueles que nunca dobram de volta.', set: 'street', tod: 'day', hud: B(1, '40%'), stamp: 'SEM GPS',
    cam: { at: 'zinho', d: 2.2, yaw: 15, h: 0.15, push: 0.2, fov: 52 },
    actors: { zinho: { p: [-6, -4], r: 30, a: 'hold', e: 'worried', prop: 'notebook' } }, sfx: [['stamp', 0.02]] }),
  S({ who: 'ZINHO', text: 'Esse mapa tá de cabeça pra baixo. Ou eu tô?', set: 'street', tod: 'day', hud: B(1, '50%'), min: 1.4,
    cam: { at: 'zinho', d: 1.7, yaw: -20, h: 0.05, push: 0.15, fov: 50 },
    actors: { zinho: { p: [-6, -4], r: 30, a: 'shrug', e: 'flat', prop: 'notebook' } } }),

  // ── O ORELHÃO ──
  S({ who: 'NAR', text: 'Pra ligar, só no orelhão. E o orelhão tem história: foi desenhado por uma arquiteta brasileira, a Chu Ming Silveira, no começo dos anos setenta.', set: 'street', tod: 'day', hud: B(1, '50%'),
    cam: { pos: [6.0, 1.7, -2.0], look: [3.2, 1.4, -4.7], pos2: [5.4, 1.6, -2.4], look2: [3.2, 1.4, -4.7], fov: 55 },
    actors: { zinho: { p: [3.2, -4.2], r: 180, a: 'hold', e: 'neutral', prop: 'phone' } }, fx: { orelhao: ORE }, card: { t: 'FATO REAL', s: 'Orelhão: Chu Ming Silveira, anos 1970', at: 0.35 } }),
  S({ who: 'ZINHO', text: 'Alô, Beto? Beto?! Acabou a ficha!', set: 'street', tod: 'day', hud: B(1, '70%'), min: 1.6,
    cam: { pos: [1.4, 1.6, -2.6], look: [3.2, 1.5, -4.6], pos2: [1.7, 1.6, -2.9], look2: [3.2, 1.5, -4.6], fov: 52 },
    actors: { zinho: { p: [3.2, -4.2], r: 180, a: 'angry', e: 'angry', prop: 'phone' } }, fx: { orelhao: ORE }, sfx: [['bonk', 0.8]] }),

  // ── PERGUNTA ──
  S({ who: 'NAR', text: 'E você? Aguentaria um dia inteiro sem celular? Responde sim ou não.', set: 'street', tod: 'day', hud: B(1, '70%'),
    cam: { at: 'zinho', d: 2.0, yaw: 0, h: 0.1, push: 0.2, fov: 50 },
    actors: { zinho: { p: [0, -4], r: 0, a: 'point', e: 'happy' } }, sfx: [['ding', 0.85, 0.5]] }),

  // ── A CASA DO BETO ──
  S({ who: 'NAR', text: 'Então ele fez o que se fazia antigamente: foi a pé até a casa do amigo e bateu palma no portão.', set: 'street', tod: 'day', hud: B(1, '90%'),
    cam: { pos: [3, 3.0, 5.4], look: [8, 1.2, 5], pos2: [2, 2.8, 5.0], look2: [9, 1.2, 5.6], fov: 55 },
    actors: { zinho: { p: [4, 4.6], to: [9.4, 5.4], a: 'walk', e: 'neutral' } }, sfx: [['snap', 0.8], ['snap', 0.86], ['snap', 0.92]] }),
  S({ who: 'BETO', text: 'Zinho?! Você veio até aqui só pra conversar? Que coisa mais antiga!', set: 'street', tod: 'day', hud: B(1, '20%'),
    cam: { at: 'beto', d: 2.3, yaw: -30, h: 0.1, push: 0.12, fov: 52 },
    actors: { zinho: { p: [9.4, 5.4], look: 'beto', a: 'idle', e: 'flat' }, beto: { p: [10.6, 6.2], look: 'zinho', a: 'shock', e: 'happy' } } }),
  S({ who: 'NAR', text: 'Eles ficaram três horas jogando bola. Ninguém olhou pra tela. Porque não tinha tela.', set: 'street', tod: 'dusk', hud: B(1, '0%'), hudIn: 0.4, music: 'happy',
    cam: { pos: [20.5, 2.2, 17.5], look: [26, 1, 12], pos2: [21.5, 2, 17], look2: [28, 1, 12], fov: 55 },
    actors: { zinho: { p: [23, 12], r: 90, a: 'kick', e: 'happy' }, beto: { p: [27, 13], r: -90, a: 'cheer', e: 'happy' } }, sfx: [['kick', 0.3], ['cheer', 0.6, 0.5]] }),

  // ── FATO + FINAL ──
  S({ who: 'NAR', text: 'Na vida real, a primeira ligação de um celular de mão foi em mil novecentos e setenta e três, em Nova York. E pesava mais de um quilo.', set: 'bedroom', tod: 'indoorNight', hud: B(1, '0%'), music: 'wonder',
    cam: { at: 'zinho', d: 2.4, yaw: 30, h: 0.2, push: 0.15, fov: 52 },
    actors: { zinho: { p: [-2, -1.6], a: 'sitbed', e: 'happy' } }, card: { t: 'FATO REAL', s: '1973: a primeira ligação de um celular de mão', at: 0.2 } }),
  S({ who: 'NAR', text: 'Comenta SIM ou NÃO: você aguentaria?', set: 'street', tod: 'dusk', hud: B(1, '0%'), min: 2.6,
    cam: { pos: [0.8, 1.6, 0.6], look: [0.8, 1.3, -4.4], fov: 56 },
    actors: { zinho: { p: [0, -4], r: 0, a: 'wave', e: 'happy' }, beto: { p: [1.5, -4.4], r: -15, a: 'wave', e: 'happy' } },
    endcard: 'comment', endcardText: 'Comenta “SIM” ou “NÃO” ↓' }),
];

export const meta = {
  kind: 'short',
  title: 'Acordei num mundo SEM celular 📵 e se ele nunca tivesse sido inventado? #shorts',
  description: 'Sem GPS, sem mensagem, sem soneca. O Zinho acordou num mundo onde o celular nunca existiu, e teve que usar mapa de papel e orelhão. ☎️\n\nVocê aguentaria um dia sem celular? Comenta SIM ou NÃO 👇\n\n#zinhoosortudo #ese #semcelular #orelhão #shorts\n\nAnimação original feita com ajuda de IA (vozes e produção).',
  tags: ['zinho o sortudo', 'e se', 'e se o celular não existisse', 'sem celular', 'orelhão', 'nostalgia', 'curiosidades', 'animação 3d', 'shorts'],
  categoryId: '1',
};
