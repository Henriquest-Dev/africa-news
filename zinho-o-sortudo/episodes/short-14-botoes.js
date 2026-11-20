// Short de ESCOLHA (~35 s, vertical): "Aperta um botão: vermelho, azul ou verde" — cada botão muda o bairro.
// Formato que mais cresce no canal (portas: ~3 mil views e 16 comentários): texto grande no 1.º quadro, comentário no
// 3.º plano, corte a cada ~2 s, final em loop. Praça com as peças do lobby, dinossauro, chuva de moedas e o gigante.
const P = (o) => ({ style2: true, cap: true, pad: -0.15, set: 'praca', tod: 'day', capY: '37%', ...o });
const B = (o = {}) => ({ buttons: { ...o } });
const WIDE = { pos: [0, 2.3, 16], look: [0, 1.3, 5.2], pos2: [0, 2.0, 12.5], look2: [0, 1.2, 5.2], fov: 60 };
const btnCam = (n) => ({ pos: [(n - 2) * 1.9 * 0.5, 2.3, 8.6], look: [(n - 2) * 1.9, 1.1, 5.2], pos2: [(n - 2) * 1.9 * 0.8, 2.0, 7.4], look2: [(n - 2) * 1.9, 1.1, 5.2], fov: 54 });

export default [
  // ── GANCHO ──
  P({ who: 'NAR', text: 'Três botões apareceram na praça. Aperta um.', hq: true, blocky: true, min: 2.4,
    music: 'file:assets/music/fundo.mp3', musicGain: 0.2, duck: 0.6, voiceSpeed: 0.94, lead: 0.0, tail: 0.15,
    cam: WIDE, actors: {}, fx: B(), card: { t: 'APERTA UM BOTÃO', s: 'vermelho · azul · verde', at: 0, top: true }, sfx: [['ding', 0.05, 0.5]] }),
  P({ who: 'ZINHO', text: 'Cada um muda o bairro inteiro!', min: 1.6,
    cam: { at: 'zinho', d: 3.0, yaw: 20, h: 0.15, push: 0.3, fov: 52 },
    actors: { zinho: { p: [3.0, 6.4], r: -25, a: 'point', e: 'happy' } }, fx: B() }),
  P({ who: 'NAR', text: 'Comenta a cor antes de apertar.', min: 1.8,
    cam: { pos: [-5.5, 1.9, 11], look: [-0.5, 1.1, 5.2], pos2: [5.5, 1.9, 11], look2: [0.5, 1.1, 5.2], fov: 54 },
    actors: {}, fx: B(), card: { t: 'VERMELHO, AZUL OU VERDE?', s: 'comenta antes de apertar', at: 0.05, top: true }, sfx: [['ding', 0.4, 0.5]] }),

  // ── VERMELHO: o dinossauro ──
  P({ who: 'NAR', text: 'Vermelho.', min: 1.2, cam: btnCam(1), actors: {}, fx: B({ press: 1, at: 0.2 }), sfx: [['bonk', 0.22]] }),
  P({ who: 'NAR', text: 'Um dinossauro aparece no meio da praça.', min: 2.0, shake: 0.03,
    cam: { pos: [2, 1.5, 11], look: [-6, 2.6, 2], pos2: [1.4, 1.4, 9.6], look2: [-6, 2.8, 2], fov: 58 },
    actors: {}, fx: { dino: { p: [-6.5, 1.5], r: 70, s: 0.9, a: 'roar', ru: 0.25 } }, sfx: [['boom', 0.25]] }),
  P({ who: 'NAR', text: 'Mas ele só queria pão da Dona Rosa.', min: 2.0,
    cam: { pos: [-4.2, 2.6, -3.6], look: [-12.2, 1.8, -12.2], pos2: [-4.8, 2.5, -4.4], look2: [-12.2, 1.8, -12.2], fov: 60 },
    actors: { rosa: { p: [-8.6, -11.2], r: -60, a: 'hold', e: 'shock', prop: 'bread' } }, fx: { dino: { p: [-11.0, -9.8], r: 60, s: 0.8, a: 'chew' } }, sfx: [['ding', 0.7, 0.5]] }),

  // ── AZUL: chuva de dinheiro ──
  P({ who: 'NAR', text: 'Azul.', min: 1.2, cam: btnCam(2), actors: {}, fx: B({ pressed: [1], press: 2, at: 0.2 }), sfx: [['bonk', 0.22]] }),
  P({ who: 'NAR', text: 'Começa a chover dinheiro.', min: 1.8,
    cam: { at: 'zinho', d: 4.0, yaw: 15, h: 0.3, push: 0.3, fov: 56 },
    actors: { zinho: { p: [0, 8.2], r: 0, a: 'cheer', e: 'happy' } }, fx: { coins: true }, sfx: [['sparkle', 0.2], ['ding', 0.5, 0.5]] }),
  P({ who: 'NAR', text: 'Só que a Dona Neide pegou tudo pra pagar a conta de luz.', min: 2.6,
    cam: { pos: [1.2, 1.6, 12.4], look: [0, 1.2, 8.2], pos2: [0.8, 1.5, 11.4], look2: [0, 1.2, 8.2], fov: 56 },
    actors: { zinho: { p: [0.7, 8.4], r: -20, a: 'headdown', e: 'sad' }, mae: { p: [-0.8, 8.0], r: 20, a: 'hold', e: 'smug', prop: 'goldbar' } }, fx: { coins: true } }),
  P({ who: 'MAE', text: 'Obrigada, filho!', min: 1.3,
    cam: { at: 'mae', d: 3.8, yaw: 10, h: 0.3, push: 0.3, fov: 54 },
    actors: { mae: { p: [-0.8, 8.0], r: 0, a: 'wave', e: 'happy' } }, fx: { coins: true } }),

  // ── VERDE: o gigante vem tomar café ──
  P({ who: 'NAR', text: 'Verde.', min: 1.2, cam: btnCam(3), actors: {}, fx: B({ pressed: [1, 2], press: 3, at: 0.2 }), sfx: [['bonk', 0.22]] }),
  P({ who: 'NAR', text: 'E o gigante de pedra veio tomar café com o bairro.', min: 2.4, shake: 0.02,
    cam: { pos: [3.0, 1.3, 10], look: [4, 9, -34], pos2: [3.0, 1.3, 8.8], look2: [4, 10.5, -34], fov: 66 },
    actors: { juca: { p: [2.2, 7.0], r: 200, a: 'hold', e: 'happy', prop: 'cup' } }, fx: { giant: { p: [4, -34], r: 0, s: 0.5, up: -0.3, bow: 0.15 } }, sfx: [['thud', 0.2], ['thud', 0.5]] }),

  // ── VIRADA + LOOP ──
  P({ who: 'NAR', text: 'E se apertar os três ao mesmo tempo?', min: 2.0, shake: 0.03,
    cam: { pos: [0, 1.8, 10.5], look: [0, 1.1, 5.2], pos2: [0, 1.6, 9.0], look2: [0, 1.1, 5.2], fov: 56 },
    actors: { zinho: { p: [2.6, 7.0], r: 20, a: 'shock', e: 'shock' } }, fx: { ...B({ pressed: [1, 2, 3] }), coins: true }, sfx: [['bonk', 0.3], ['boom', 0.6]] }),
  P({ who: 'NAR', text: 'Melhor não. Volta e aperta um botão só.', min: 2.4, tail: 0.05,
    cam: { pos: WIDE.pos2, look: WIDE.look2, pos2: WIDE.pos, look2: WIDE.look, fov: 60 },
    actors: {}, fx: B(), sfx: [['whoosh', 0.85]] }),
];

export const meta = {
  kind: 'short',
  title: 'Aperta um botão: vermelho, azul ou verde 🔴🔵🟢',
  description: 'Três botões apareceram na praça do Zinho. Cada um muda o bairro inteiro. Comenta a sua cor antes de ver 👇\n\n#escolha #apertaumbotao #animação #zinhoosortudo #shorts\n\nAnimação original feita com ajuda de IA (vozes e produção).',
  tags: ['aperta um botão', 'escolha um botão', 'qual botão você aperta', 'vermelho azul ou verde', 'escolha 1 2 ou 3', 'escolhas', 'animação', 'animação de blocos', 'animação estilo roblox', 'animação engraçada', 'história animada', 'zinho o sortudo', 'press a button', 'shorts'],
  categoryId: '1',
};
