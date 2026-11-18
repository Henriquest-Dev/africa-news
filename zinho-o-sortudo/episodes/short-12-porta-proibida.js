// Short de terror (~42 s, vertical, bonecos R6/R15): "Nunca abra a porta proibida".
// Regras virais: porta e texto grande no 1.º quadro, pedido de comentário no 2.º plano, corte a cada ~2–3 s,
// e final em loop (o último plano volta ao enquadramento do primeiro e a última frase leva à primeira).
// Porta proibida da praça em (-22, -12), rodada 0.6 rad: pt(d, lado, h) = ponto à frente dela.
const pt = (d, side = 0, h = 1.6) => [+(-22 + 0.565 * d + 0.825 * side).toFixed(2), h, +(-12 + 0.825 * d - 0.565 * side).toFixed(2)];
const xz = (d, side = 0) => { const q = pt(d, side); return [q[0], q[2]]; };
const DOOR = [-22, 2.45, -12];
const H = (o) => ({ style2: true, cap: true, pad: -0.15, set: 'praca', tod: 'horror', capY: '37%', ...o });
const IN = [-22.14, -12.21];                        // dentro da moldura (entre a porta e o vazio)

export default [
  // ── GANCHO ──
  H({ who: 'NAR', text: 'Nesse bairro tem uma porta que ninguém pode abrir.', hq: true, blocky: true, min: 2.6,
    music: 'file:assets/music/fundo.mp3', musicGain: 0.24, duck: 0.55, voiceSpeed: 1.1, lead: 0.0, tail: 0.15,
    cam: { pos: pt(7, 0, 2.0), look: DOOR, pos2: pt(4.2, 0, 2.2), look2: DOOR, fov: 58 },
    actors: {}, fx: { door: { chains: 3 } }, card: { t: 'NUNCA ABRA', s: 'a porta proibida', at: 0, top: true }, sfx: [['thud', 0.1]] }),
  H({ who: 'NAR', text: 'Comenta: você abria ou não abria?', min: 2,
    cam: { pos: pt(5, -3), look: DOOR, pos2: pt(5, 3), look2: DOOR, fov: 58 },
    actors: {}, fx: { door: { chains: 3 } }, card: { t: 'ABRE OU NÃO ABRE?', s: 'comenta antes de ver', at: 0.05, top: true }, sfx: [['ding', 0.5, 0.5]] }),
  H({ who: 'ZINHO', text: 'Relaxa, gente. É só uma porta.', min: 1.8,
    cam: { at: 'zinho', d: 3.0, yaw: 15, h: 0.2, push: 0.3, fov: 52 },
    actors: { zinho: { p: xz(1.8, 0), r: 50, a: 'shrug', e: 'smug' } }, fx: { door: { chains: 3 } } }),
  H({ who: 'NAR', text: 'Mas toda noite, às três da manhã, ela bate três vezes.', shake: 0.03,
    cam: { pos: pt(3.6, 1.4, 1.6), look: DOOR, pos2: pt(3.0, 1.2, 1.6), look2: DOOR, fov: 60 },
    actors: { zinho: { p: xz(1.8, 0), r: 214, a: 'idle', e: 'worried' } }, fx: { door: { chains: 3, knock: true } }, sfx: [['thud', 0.45], ['thud', 0.62], ['thud', 0.79]] }),
  H({ who: 'BETO', text: 'Zinho… ela tá batendo!', min: 1.6, shake: 0.03,
    cam: { at: 'beto', d: 2.8, yaw: -10, h: 0.15, push: 0.35, fov: 52 },
    actors: { beto: { p: xz(3.2, 1.0), r: 34, a: 'shock', e: 'shock' } }, fx: { door: { chains: 3, knock: true } } }),

  // ── AS CORRENTES ──
  H({ who: 'NAR', text: 'O Zinho tirou a primeira corrente.', min: 1.8,
    cam: { pos: pt(2.4, 2.0, 1.5), look: [-21.6, 1.8, -11.6], pos2: pt(2.0, 1.8, 1.5), look2: [-21.6, 1.8, -11.6], fov: 58 },
    actors: { zinho: { p: xz(0.95, 0), r: 214, a: 'reach', e: 'angry' } }, fx: { door: { chains: 2 } }, sfx: [['clang', 0.3]] }),
  H({ who: 'NAR', text: 'A segunda.', min: 1.2,
    cam: { pos: pt(2.4, -1.8, 1.4), look: [-21.6, 1.6, -11.6], fov: 58 },
    actors: { zinho: { p: xz(0.95, 0), r: 214, a: 'reach', e: 'angry' } }, fx: { door: { chains: 1 } }, sfx: [['clang', 0.2]] }),
  H({ who: 'NAR', text: 'E na terceira, a luz do bairro inteiro apagou.', min: 2.6,
    cam: { pos: [-4, 3.0, 2], look: [-20, 2.0, -11], pos2: [-5.5, 2.8, 0.5], look2: [-20, 2.0, -11], fov: 50 },
    actors: { zinho: { p: xz(0.95, 0), r: 214, a: 'reach', e: 'angry' }, beto: { p: xz(3.2, 1.0), r: 214, a: 'shock', e: 'shock' } },
    fx: { door: { chains: 0 }, blackout: 0.55 }, sfx: [['clang', 0.15], ['powerdown', 0.55]] }),

  // ── A COISA ──
  H({ who: 'NAR', text: 'A porta abriu sozinha.', min: 1.8, shake: 0.02,
    cam: { pos: pt(5.4, 2.6, 1.7), look: DOOR, pos2: pt(4.8, 2.3, 1.7), look2: DOOR, fov: 58 },
    actors: { zinho: { p: xz(2.6, -0.6), r: 214, a: 'shock', e: 'shock' }, beto: { p: xz(3.4, 0.9), r: 214, a: 'shock', e: 'shock' } },
    fx: { door: { chains: 0, open: [0, 1] }, blackout: 0 }, sfx: [['whoosh', 0.2, 0.7]] }),
  H({ who: 'NAR', text: 'E lá dentro, alguma coisa sorriu.', min: 2.2,
    cam: { pos: pt(3.4, 0, 2.3), look: [-22.1, 2.7, -12.2], pos2: pt(2.6, 0, 2.5), look2: [-22.1, 2.9, -12.2], fov: 56 },
    actors: { sorriso: { p: IN, r: 34, a: 'creep', e: 'happy' } }, fx: { door: { chains: 0, open: 1 }, blackout: 0 }, sfx: [['boom', 0.35]] }),
  H({ who: 'SORRISO', text: 'Quem me chamou?', min: 1.8, shake: 0.02,
    cam: { at: 'sorriso', d: 2.4, yaw: 5, h: 0.05, push: 0.4, fov: 50 },
    actors: { sorriso: { p: IN, r: 34, a: 'creep', e: 'happy' } }, fx: { door: { chains: 0, open: 1 }, blackout: 0 } }),

  // ── A FUGA ──
  H({ who: 'ZINHO', text: 'Corre, Beto!', min: 1.6, shake: 0.03,
    cam: { pos: [-11.5, 1.4, -3.6], look: [-17.5, 1.3, -8.4], pos2: [-10.5, 1.4, -2.8], look2: [-16, 1.3, -7.5], fov: 58 },
    actors: { zinho: { p: [-19.8, -9.6], to: [-12.6, -5.4], a: 'run', e: 'shock' }, beto: { p: [-20.8, -9.0], to: [-13.4, -4.6], a: 'run', e: 'shock' }, sorriso: { p: [-21.3, -11.0], to: [-18.6, -9.2], a: 'walk', e: 'happy' } },
    fx: { door: { chains: 0, open: 1 }, blackout: 0 }, sfx: [['whoosh', 0.1]] }),
  H({ who: 'NAR', text: 'Eles correram até a fonte e olharam pra trás.', min: 2.4,
    cam: { pos: [1.0, 2.0, -3.5], look: [-22, 2.2, -12], pos2: [0.6, 1.9, -3.7], look2: [-22, 2.3, -12], fov: 34 },
    actors: { zinho: { p: [-5.65, -6.7], r: 249, a: 'shock', e: 'shock' }, beto: { p: [-6.15, -5.4], r: 249, a: 'shock', e: 'shock' } },
    fx: { door: { chains: 3, open: 0 }, blackout: 0 } }),

  // ── LOOP ──
  H({ who: 'NAR', text: 'A porta estava fechada de novo. Com as três correntes. Esperando alguém abrir.', min: 3.4, tail: 0.05,
    cam: { pos: pt(4.2, 0, 2.2), look: DOOR, pos2: pt(7, 0, 2.0), look2: DOOR, fov: 58 },
    actors: {}, fx: { door: { chains: 3 } }, sfx: [['thud', 0.92]] }),
];

export const meta = {
  kind: 'short',
  title: 'Nunca abra a porta proibida do bairro 🚪😱',
  description: 'Toda noite, às três da manhã, ela bate três vezes. Você abria ou não abria? Comenta 👇\n\n#terror #portaproibida #historiadeterror #animação #zinhoosortudo #shorts\n\nAnimação original feita com ajuda de IA (vozes e produção).',
  tags: ['terror', 'história de terror', 'animação de terror', 'porta proibida', 'nunca abra essa porta', 'não abra a porta', 'história de terror animada', 'mistério', 'terror roblox', 'animação estilo roblox', 'animação de blocos', 'creepy', 'zinho o sortudo', 'shorts'],
  categoryId: '1',
};
