// Short (~45 s, vertical) — formato NOOB VS PRO VS HACKER (pedido do dono, 23/11).
// Frase-resumo: "Na prova surpresa, o noob (Zinho) não estudou, o pro (Beto) estudou a noite toda e o hacker (Dudu)
// apaga a luz da escola para trocar a prova dele pela do Beto; a professora apanha o Dudu com a lanterna e o Zinho
// tira dez chutando tudo na letra C."
// Um só lugar (a sala de aula). Cartões NOOB / PRO / HACKER no topo. Final em loop.

const C = (o) => ({ style2: true, cap: true, pad: -0.15, set: 'classroom', tod: 'indoor', capY: '37%', board: 'PROVA SURPRESA', ...o });
const D = (o) => C({ tod: 'dark', ...o });                       // luz apagada
const NOOB = { t: 'NOOB', s: '', at: 0, top: true }, PRO = { t: 'PRO', s: '', at: 0, top: true }, HACK = { t: 'HACKER', s: '', at: 0, top: true };
const Z = [0, 1.5], B = [2.5, -0.8], DU = [-2.5, -0.8];
const sit = (p, e = 'neutral', extra = {}) => ({ p, r: 180, a: 'sit', e, ...extra });
const CLASS = { zinho: sit(Z), beto: sit(B), dudu: sit(DU), lia: sit([-2.5, 1.5]), kaka: sit([2.5, 1.5]) };

export default [
  // ── GANCHO ──
  C({ who: 'NAR', text: 'Prova surpresa. Um noob, um pro e um hacker.', hq: true, blocky: true, min: 2.4,
    music: 'file:assets/music/fundo.mp3', musicGain: 0.2, duck: 0.6, voiceSpeed: 1.1, lead: 0.0, tail: 0.15,
    cam: { pos: [-0.9, 2.2, -1.8], look: [0, 1.0, 1.5], pos2: [-0.5, 2.0, -1.0], look2: [0, 1.0, 1.5], fov: 62 },
    actors: { ...CLASS, zinho: sit(Z, 'shock'), prof: { p: [0, -3.6], r: 0, a: 'point', e: 'smug' } },
    card: { t: 'NOOB VS PRO VS HACKER', s: 'na prova surpresa', at: 0, top: true }, sfx: [['ding', 0.05, 0.5]] }),
  C({ who: 'NAR', text: 'Comenta: você é noob, pro ou hacker?', min: 2,
    cam: { pos: [2.6, 2.2, -2.8], look: [-0.4, 1.0, 1.0], pos2: [2.0, 2.1, -2.3], look2: [-0.4, 1.0, 1.0], fov: 64 },
    actors: { ...CLASS }, card: { t: 'NOOB, PRO OU HACKER?', s: 'comenta', at: 0.05, top: true }, sfx: [['ding', 0.4, 0.5]] }),
  C({ who: 'PROF', text: 'Guardem tudo. Vale nota!', min: 1.5,
    cam: { at: 'prof', d: 2.8, yaw: 10, h: 0.15, push: 0.35, fov: 52 },
    actors: { prof: { p: [0, -3.6], r: 0, a: 'point', e: 'angry' } }, sfx: [['thud', 0.3]] }),

  // ── OS TRÊS ──
  C({ who: 'ZINHO', text: 'Prova? Hoje?! Eu nem sei qual é a matéria.', min: 2, card: NOOB,
    cam: { at: 'zinho', d: 2.2, yaw: -20, h: 0.3, push: 0.3, fov: 50 },
    actors: { zinho: sit(Z, 'shock') }, fx: { paper: 1 } }),
  C({ who: 'BETO', text: 'Fácil. Eu estudei a noite inteira.', min: 1.7, card: PRO,
    cam: { at: 'beto', d: 2.2, yaw: 20, h: 0.3, push: 0.3, fov: 50 },
    actors: { beto: sit(B, 'smug') } }),
  C({ who: 'DUDU', text: 'Estudar? Eu tenho um plano.', min: 1.7, card: HACK,
    cam: { at: 'dudu', d: 2.2, yaw: -20, h: 0.3, push: 0.35, fov: 50 },
    actors: { dudu: sit(DU, 'smug', { prop: 'phone' }) } }),

  // ── A PROVA ──
  C({ who: 'NAR', text: 'O noob escreveu o próprio nome… errado.', min: 1.9, card: NOOB,
    cam: { at: 'zinho', d: 2.0, yaw: 30, h: 0.45, push: 0.3, fov: 52 },
    actors: { zinho: sit(Z, 'worried') }, fx: { paper: 1 }, sfx: [['bonk', 0.6]] }),
  C({ who: 'NAR', text: 'O pro terminou em dois minutos.', min: 1.6, card: PRO,
    cam: { at: 'beto', d: 2.6, yaw: -25, h: 0.25, push: 0.3, fov: 52 },
    actors: { beto: sit(B, 'smug') }, sfx: [['ding', 0.6, 0.5]] }),
  C({ who: 'NAR', text: 'E o hacker apagou a luz da escola inteira.', min: 2, card: HACK,
    cam: { at: 'dudu', d: 2.6, yaw: 25, h: 0.25, push: 0.4, fov: 52 },
    actors: { dudu: sit(DU, 'smug', { prop: 'phone' }) }, fx: { blackout: 0.55 }, sfx: [['powerdown', 0.55]] }),

  // ── NO ESCURO ──
  D({ who: 'DUDU', text: 'Agora é só trocar a minha prova pela do Beto.', min: 2,
    cam: { pos: [3.4, 1.7, 1.0], look: [-0.2, 1.1, 0.1], pos2: [3.0, 1.7, 0.8], look2: [0.2, 1.1, 0.0], fov: 58 },
    actors: { dudu: { p: [-1.4, 0.6], to: [1.3, -0.5], a: 'creep', e: 'smug' }, beto: sit(B, 'worried') }, sfx: [['whoosh', 0.3]] }),
  D({ who: 'NAR', text: 'Só que a professora tinha uma lanterna.', min: 1.8, shake: 0.02,
    cam: { at: 'prof', d: 2.6, yaw: -15, h: 0.1, push: 0.4, fov: 52 },
    actors: { prof: { p: [0, -2.6], r: 20, a: 'hold', e: 'angry', prop: 'torch' } }, sfx: [['thud', 0.4]] }),
  D({ who: 'PROF', text: 'Dudu! Pra diretoria. Agora!', min: 1.6, shake: 0.03,
    cam: { pos: [4.6, 1.7, -3.0], look: [0.5, 1.1, -1.1], pos2: [4.1, 1.7, -2.7], look2: [0.5, 1.1, -1.1], fov: 70 },
    actors: { dudu: { p: [1.3, -0.5], r: 130, a: 'shock', e: 'shock', prop: 'phone' }, prof: { p: [-0.4, -1.8], r: 53, a: 'point', e: 'angry', prop: 'torch' }, beto: sit(B, 'shock') },
    card: { t: 'HACKER: PEGO', s: '', at: 0.3, top: true }, sfx: [['bonk', 0.35]] }),

  // ── A VIRADA ──
  C({ who: 'NAR', text: 'A luz voltou. E o noob ainda tava na questão um.', min: 2.2, card: NOOB,
    cam: { at: 'zinho', d: 2.4, yaw: 15, h: 0.25, push: 0.3, fov: 50 },
    actors: { zinho: sit(Z, 'tired') }, fx: { paper: 1 } }),
  C({ who: 'ZINHO', text: 'Vou chutar tudo. Letra C.', min: 1.6,
    cam: { at: 'zinho', d: 2.0, yaw: -10, h: 0.2, push: 0.35, fov: 48 },
    actors: { zinho: sit(Z, 'closed') }, fx: { paper: 1 }, sfx: [['whoosh', 0.5]] }),
  C({ who: 'PROF', text: 'Zinho… você tirou dez.', min: 1.7, board: 'ZINHO: 10',
    cam: { at: 'prof', d: 3.2, yaw: 15, h: 0.2, push: 0.3, fov: 56 },
    actors: { prof: { p: [0, -3.6], r: 0, a: 'shock', e: 'shock' } }, sfx: [['sparkle', 0.3], ['ding', 0.5, 0.5]] }),
  C({ who: 'BETO', text: 'Dez?! Eu estudei e tirei nove!', min: 1.7, board: 'ZINHO: 10',
    cam: { at: 'beto', d: 2.3, yaw: 15, h: 0.2, push: 0.4, fov: 50 },
    actors: { beto: { p: [2.5, -0.4], r: 200, a: 'angry', e: 'angry' } }, sfx: [['thud', 0.2]] }),
  C({ who: 'ZINHO', text: 'Não é noob, Beto. É sorte.', min: 1.8, board: 'ZINHO: 10',
    cam: { pos: [0.5, 1.8, -1.4], look: [0, 1.3, 1.7], pos2: [0.4, 1.7, -0.9], look2: [0, 1.3, 1.7], fov: 58 },
    actors: { zinho: { p: [0, 1.9], r: 180, a: 'cheer', e: 'smug' }, lia: sit([-2.5, 1.5], 'happy'), kaka: sit([2.5, 1.5], 'happy') },
    card: { t: 'NOOB: 10', s: '', at: 0.2, top: true }, sfx: [['sparkle', 0.3]] }),

  // ── LOOP ──
  C({ who: 'NAR', text: 'E aí? Prova surpresa: você é noob, pro ou hacker?', min: 2.4, tail: 0.05,
    cam: { pos: [-0.5, 2.0, -1.0], look: [0, 1.0, 1.5], pos2: [-0.9, 2.2, -1.8], look2: [0, 1.0, 1.5], fov: 62 },
    actors: { ...CLASS, prof: { p: [0, -3.6], r: 0, a: 'point', e: 'smug' } },
    card: { t: 'NOOB VS PRO VS HACKER', s: 'qual é você?', at: 0.3, top: true } }),
];

export const meta = {
  kind: 'short',
  title: 'Noob vs Pro vs Hacker na prova surpresa 📝😱',
  description: 'Prova surpresa na escola: o noob não estudou, o pro estudou a noite toda e o hacker tem um plano… Quem tira a melhor nota? Comenta: você é noob, pro ou hacker? 👇\n\n#noobvsprovshacker #roblox #animação #zinhoosortudo #shorts\n\nAnimação original feita com ajuda de IA (vozes e produção).',
  tags: ['noob vs pro vs hacker', 'noob vs pro', 'noob pro hacker', 'prova surpresa', 'escola', 'animação roblox', 'animação estilo roblox', 'história roblox', 'animação de blocos', 'zinho o sortudo', 'shorts'],
  categoryId: '1',
};
