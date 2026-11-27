// Short (~42 s, vertical) — formato POBRE VS RICO (pedido do dono, 23/11).
// Frase-resumo: "Na hora do lanche, o rico Enzo tem salada de chef e chocolate de ouro e o pobre Zinho só tem pão com ovo;
// o Enzo prova a salada, acha que tem gosto de grama, sente o cheiro do pão e troca o chocolate de ouro por um pedaço."
// Um só lugar (a sala de aula, no recreio). Cartões RICO / POBRE alternados. Final em loop.

const C = (o) => ({ style2: true, cap: true, pad: -0.15, set: 'classroom', tod: 'indoor', capY: '37%', board: 'RECREIO', ...o });
const RICO = { t: 'RICO', s: '', at: 0, top: true }, POBRE = { t: 'POBRE', s: '', at: 0, top: true };
// os dois de pé à frente das carteiras, virados para o fundo da sala (+z); câmara do fundo vê o quadro atrás
const EZ = [0.6, -2.0], ZN = [-0.6, -2.0];
const en = (a, e, prop, r = -10) => ({ p: EZ, r, a, e, ...(prop ? { prop } : {}) });
const zi = (a, e, prop, r = 10) => ({ p: ZN, r, a, e, ...(prop ? { prop } : {}) });
const WIDE = { pos: [0, 1.6, 0.7], look: [0, 1.15, -2.0], pos2: [0, 1.55, 0.2], look2: [0, 1.15, -2.0], fov: 72 };

export default [
  // ── GANCHO ──
  C({ who: 'NAR', text: 'Rico contra pobre. Na hora do lanche.', hq: true, blocky: true, min: 2.2,
    music: 'file:assets/music/fundo.mp3', musicGain: 0.2, duck: 0.6, voiceSpeed: 1.1, lead: 0.0, tail: 0.15,
    cam: WIDE, actors: { enzo: en('hold', 'smug', 'sandwich'), zinho: zi('hold', 'happy', 'bread') },
    card: { t: 'RICO VS POBRE', s: 'na hora do lanche', at: 0, top: true }, sfx: [['ding', 0.05, 0.5]] }),
  C({ who: 'NAR', text: 'Comenta uma palavra: rico ou pobre?', min: 2,
    cam: { pos: [-2.2, 1.8, 0.4], look: [0.2, 1.3, -2.0], pos2: [-1.8, 1.7, -0.1], look2: [0.2, 1.3, -2.0], fov: 58 },
    actors: { enzo: en('point', 'smug', null, -25), zinho: zi('shrug', 'happy', null, 20) },
    card: { t: 'RICO OU POBRE?', s: 'comenta uma palavra', at: 0.05, top: true }, sfx: [['ding', 0.4, 0.5]] }),

  // ── OS LANCHES ──
  C({ who: 'ENZO', text: 'O meu lanche foi feito por um chef.', min: 1.7, card: RICO,
    cam: { at: 'enzo', d: 2.5, yaw: -20, h: 0.2, push: 0.3, fov: 52 },
    actors: { enzo: en('hold', 'smug', 'sandwich') } }),
  C({ who: 'ZINHO', text: 'O meu foi feito pela minha mãe. Pão com ovo.', min: 2, card: POBRE,
    cam: { at: 'zinho', d: 2.5, yaw: 20, h: 0.2, push: 0.3, fov: 52 },
    actors: { zinho: zi('hold', 'happy', 'bread') } }),
  C({ who: 'ENZO', text: 'E de sobremesa, chocolate de ouro.', min: 1.8, card: RICO,
    cam: { at: 'enzo', d: 2.2, yaw: 15, h: 0.1, push: 0.35, fov: 50 },
    actors: { enzo: en('hold', 'smug', 'goldbar') }, sfx: [['sparkle', 0.3]] }),
  C({ who: 'NAR', text: 'A sobremesa do pobre era… mais ovo.', min: 1.8, card: POBRE,
    cam: { at: 'zinho', d: 2.6, yaw: -15, h: 0.25, push: 0.3, fov: 52 },
    actors: { zinho: zi('shrug', 'happy', null) }, sfx: [['bonk', 0.55]] }),
  C({ who: 'ENZO', text: 'Pobre come pão. Rico come comida de chef.', min: 2,
    cam: { pos: [-3.2, 1.7, -0.5], look: [0.6, 1.3, -2.0], pos2: [-2.9, 1.7, -0.8], look2: [0.6, 1.3, -2.0], fov: 54 },
    actors: { enzo: en('point', 'smug', null, -60), zinho: zi('idle', 'flat', 'bread', 60) } }),

  // ── A VIRADA ──
  C({ who: 'NAR', text: 'Aí o rico provou o lanche de chef.', min: 1.7, card: RICO,
    cam: { at: 'enzo', d: 2.3, yaw: -10, h: 0.15, push: 0.3, fov: 50 },
    actors: { enzo: en('hold', 'neutral', 'sandwich') } }),
  C({ who: 'ENZO', text: 'Isso tem gosto de… grama!', min: 1.6, shake: 0.03,
    cam: { at: 'enzo', d: 1.9, yaw: 10, h: 0.1, push: 0.4, fov: 48 },
    actors: { enzo: en('shock', 'angry', 'sandwich') }, sfx: [['bonk', 0.3]] }),
  C({ who: 'NAR', text: 'E o cheiro do pão com ovo encheu a sala.', min: 2, card: POBRE,
    cam: { pos: [-0.2, 1.4, 0.3], look: [-0.9, 1.3, -2.0], pos2: [-0.4, 1.4, -0.3], look2: [-0.9, 1.3, -2.0], fov: 56 },
    actors: { zinho: zi('hold', 'happy', 'bread') }, sfx: [['sparkle', 0.3]] }),
  C({ who: 'ENZO', text: 'Zinho… me dá um pedaço?', min: 1.7,
    cam: { at: 'enzo', d: 2.4, yaw: -30, h: 0.15, push: 0.3, fov: 50 },
    actors: { enzo: en('reach', 'worried', null, -50), zinho: zi('hold', 'smug', 'bread', 50) } }),
  C({ who: 'ZINHO', text: 'Pão com ovo é caro, hein.', min: 1.6,
    cam: { at: 'zinho', d: 2.3, yaw: 30, h: 0.15, push: 0.3, fov: 50 },
    actors: { zinho: zi('hold', 'smug', 'bread', 50), enzo: en('idle', 'worried', null, -50) } }),
  C({ who: 'ENZO', text: 'Te dou o meu chocolate de ouro!', min: 1.7, card: RICO,
    cam: { at: 'enzo', d: 2.2, yaw: -20, h: 0.1, push: 0.35, fov: 50 },
    actors: { enzo: en('hold', 'worried', 'goldbar', -50) }, sfx: [['sparkle', 0.2]] }),
  C({ who: 'NAR', text: 'Negócio fechado.', min: 1.4,
    cam: WIDE, actors: { enzo: en('hold', 'happy', 'bread', -40), zinho: zi('hold', 'happy', 'goldbar', 40) }, sfx: [['ding', 0.3, 0.5]] }),
  C({ who: 'ENZO', text: 'É a melhor coisa que eu já comi!', min: 1.8,
    cam: { at: 'enzo', d: 2.2, yaw: 10, h: 0.1, push: 0.35, fov: 50 },
    actors: { enzo: en('cheer', 'happy', 'bread') } }),
  C({ who: 'NAR', text: 'E pela primeira vez, o pobre comeu sobremesa de rico.', min: 2.4, card: POBRE,
    cam: { at: 'zinho', d: 2.4, yaw: -15, h: 0.2, push: 0.3, fov: 52 },
    actors: { zinho: zi('hold', 'happy', 'goldbar') }, sfx: [['sparkle', 0.3]] }),

  // ── LOOP ──
  C({ who: 'NAR', text: 'E aí? Rico contra pobre na hora do lanche: qual é o seu time?', min: 2.6, tail: 0.05,
    cam: { pos: [0, 1.55, 0.2], look: [0, 1.15, -2.0], pos2: [0, 1.6, 0.7], look2: [0, 1.15, -2.0], fov: 72 },
    actors: { enzo: en('hold', 'smug', 'sandwich'), zinho: zi('hold', 'happy', 'bread') },
    card: { t: 'RICO VS POBRE', s: 'qual é o seu time?', at: 0.3, top: true } }),
];

export const meta = {
  kind: 'short',
  title: 'Rico vs Pobre na hora do lanche 🍔🍞',
  description: 'O rico tem lanche de chef e chocolate de ouro. O pobre tem pão com ovo. Quem ganha o recreio? Comenta uma palavra: rico ou pobre? 👇\n\n#ricovspobre #roblox #animação #zinhoosortudo #shorts\n\nAnimação original feita com ajuda de IA (vozes e produção).',
  tags: ['rico vs pobre', 'rico e pobre', 'pobre vs rico', 'lanche da escola', 'pão com ovo', 'animação roblox', 'animação estilo roblox', 'história roblox', 'animação de blocos', 'zinho o sortudo', 'rich vs poor', 'shorts'],
  categoryId: '1',
};
