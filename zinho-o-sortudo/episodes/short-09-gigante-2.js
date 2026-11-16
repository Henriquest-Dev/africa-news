// História (~90 s, vertical) no visual de bonecos de blocos — parte 2 de "Nesse bairro, um gigante de pedra acorda toda noite".
// Quem joga as pedras? Um gigante criança, de olhos azuis, que brinca de bola com o pai. Gancho da parte 3: a mãe acordou.
// Trilha: ficheiro do dono do canal em assets/music/fundo.mp3 (fora do repositório). Render: node tools/render.mjs --w 1080 --h 1920

const S = (o) => ({ style2: true, cap: true, pad: -0.15, set: 'street', tod: 'night', ...o });
const W = (o) => S({ set: 'wild', ...o });
const GP = [8, -24];                       // o gigante do bairro (pai)
const KP = [5, -26], KID = { p: KP, s: 0.26, eye: '#39c8ff' };   // o gigante criança, atrás do morro
const SKY = { pos: [5.5, 1.3, 2.4], look: [8, 13.5, -22], fov: 70 };

export default [
  // ── GANCHO: a pergunta da parte 1 ──
  S({ who: 'NAR', text: 'Nesse bairro, um gigante de pedra segura as pedras que caem do céu. Mas quem é que joga?', hq: true, blocky: true,
    music: 'file:assets/music/fundo.mp3', musicGain: 0.2, duck: 0.6, voiceSpeed: 1.08, lead: 0.05, tail: 0.55, shake: 0.02,
    cam: { ...SKY, pos2: [5.5, 1.3, 1], look2: [9.5, 17, -22] },
    actors: {}, fx: { giant: { p: GP, r: -8, raise: 1, up: 1, rock: 0.45 }, meteorGlow: 0.15 }, sfx: [['whoosh', 0.1, 0.8], ['boom', 0.45]] }),
  S({ who: 'NAR', text: 'O Zinho passou três noites olhando pro céu. E percebeu: todas vinham do mesmo lado. De trás do morro.',
    cam: { at: 'zinho', d: 4.6, yaw: 20, h: 0.2, push: 0.25, fov: 52 },
    actors: { zinho: { p: [0, -4], r: 0, a: 'point', e: 'worried' } }, sfx: [['sparkle', 0.55]] }),
  S({ who: 'ZINHO', text: 'Seu Juca, o que tem atrás do morro?', tod: 'dusk', min: 1.6,
    cam: { at: 'zinho', d: 4.3, yaw: -30, h: 0.15, push: 0.15, fov: 50 },
    actors: { zinho: { p: [-0.2, -4.2], look: 'juca', a: 'point', e: 'neutral' }, juca: { p: [1.6, -4.4], look: 'zinho', a: 'idle', e: 'worried' } } }),
  S({ who: 'JUCA', text: 'Ninguém sabe. Quem foi lá, nunca contou.', tod: 'dusk', min: 1.8,
    cam: { at: 'juca', d: 3.2, yaw: -15, h: 0.1, push: 0.15, fov: 50 },
    actors: { juca: { p: [1.6, -4.4], look: 'zinho', a: 'shrug', e: 'worried' } } }),

  // ── A VIAGEM ──
  S({ who: 'NAR', text: 'Era tudo que o Zinho precisava ouvir. Pegou a espada do avô e foi.',
    cam: { at: 'zinho', d: 3.9, yaw: 25, h: 0.25, push: 0.3, fov: 54 },
    actors: { zinho: { p: [3, -3.6], r: 30, a: 'swordup', e: 'smug', prop: 'sword' } }, sfx: [['sparkle', 0.5], ['whoosh', 0.55]] }),
  S({ who: 'NAR', text: 'Só deixou um bilhete: volto antes do poste acender.', set: 'bedroom', tod: 'indoorNight', min: 2.2,
    cam: { pos: [-0.6, 1.6, 1.6], look: [-2, 0.9, -1.6], pos2: [-0.9, 1.5, 1.0], look2: [-2, 0.9, -1.6], fov: 50 },
    actors: {}, card: { t: 'BILHETE', s: '“volto antes do poste acender. — Zinho”', at: 0.2 } }),
  W({ who: 'NAR', text: 'Andou a noite inteira. Passou pelas pedras. Passou pela caverna. Até o chão começar a tremer.', shake: 0.03,
    cam: { pos: [3.2, 1.3, 4.2], look: [0, 1.2, 0], pos2: [2.6, 1.3, 3.6], look2: [0, 1.2, 0], fov: 56 },
    actors: { zinho: { p: [0, 0], r: 40, a: 'walk', e: 'worried', prop: 'sword' } }, sfx: [['thud', 0.7], ['thud', 0.88]] }),
  W({ who: 'NAR', text: 'Pergunta rápida: você continuava, ou voltava correndo? Responde aí.',
    cam: { at: 'zinho', d: 4.4, yaw: 15, h: 0.15, push: 0.2, fov: 50 },
    actors: { zinho: { p: [0, 0], r: 0, a: 'swordup', e: 'worried', prop: 'sword' } }, sfx: [['ding', 0.85, 0.5]] }),

  // ── O OUTRO GIGANTE ──
  W({ who: 'NAR', text: 'E então ele viu. Outro gigante. Só que esse tinha olhos azuis.', shake: 0.02,
    cam: { pos: [3, 1.2, 6], look: [5, 7, -26], pos2: [3.4, 1.2, 3], look2: [5, 9, -26], fov: 62 },
    actors: {}, fx: { giant: { ...KID, r: 0, up: 0.3 } }, sfx: [['boom', 0.35]] }),
  W({ who: 'NAR', text: 'Ele pegou uma pedra, mirou no bairro… e jogou.', min: 2.8,
    cam: { pos: [3.4, 1.2, 3], look: [5.5, 10, -26], fov: 66 },
    actors: {}, fx: { giant: { ...KID, r: 0, raise: [0.2, 1], up: 0.8, throw: 0.6 } }, sfx: [['whoosh', 0.6, 0.9]] }),
  W({ who: 'ZINHO', text: 'Ei! Para de jogar pedra na minha casa!', min: 1.8,
    cam: { pos: [3.6, 1.0, -1.6], look: [4.6, 5.5, -22], fov: 66 },
    actors: { zinho: { p: [4.4, -5.2], r: 180, a: 'slash', e: 'angry', prop: 'sword' } }, fx: { giant: { ...KID, r: 0, up: 0.4 } } }),
  W({ who: 'NAR', text: 'O gigante olhou pra baixo. E, de perto, o Zinho reparou: aquele gigante era pequeno. Era uma criança.',
    cam: { pos: [4.2, 3.2, -8], look: [5, 10.2, -26], pos2: [4.4, 3.8, -11], look2: [5, 10.2, -26], fov: 50 },
    actors: {}, fx: { giant: { ...KID, r: 0, up: -1.0, bow: 0.12 } }, sfx: [['sparkle', 0.6]] }),

  // ── A VIRADA ──
  W({ who: 'NAR', text: 'Ele não estava atacando o bairro. Estava jogando bola com o pai.',
    cam: { pos: [3.4, 1.4, 3], look: [5.2, 8.5, -26], pos2: [3.0, 1.4, 3.4], look2: [5.2, 9, -26], fov: 68 },
    actors: {}, fx: { giant: { ...KID, r: 0, raise: 0.9, up: 0.5, held: true } }, card: { t: 'A VERDADE', s: 'era só uma brincadeira de pai e filho.', at: 0.45 } }),
  S({ who: 'NAR', text: 'Toda noite o filho joga. Toda noite o pai pega. Faz anos que os dois brincam assim, de longe.',
    cam: { pos: [5.5, 1.3, 1], look: [9.5, 17, -22], pos2: [5.2, 1.3, 1.6], look2: [9.5, 16, -22], fov: 70 },
    actors: {}, fx: { giant: { p: GP, r: -8, raise: 1, up: 1, rock: 0.55 }, meteorGlow: 0.4 }, sfx: [['whoosh', 0.2, 0.8], ['boom', 0.55]] }),
  S({ who: 'NAR', text: 'Por isso o gigante nunca olhava pra baixo. Ele estava olhando o filho.',
    cam: { pos: [6, 6, -2], look: [8, 20.5, -22], pos2: [6.6, 7, -6], look2: [8, 20.5, -22], fov: 50 },
    actors: {}, fx: { giant: { p: GP, r: -8, up: 0.9, raise: 1, held: true } } }),
  W({ who: 'ZINHO', text: 'Então o nosso medo todo… era uma brincadeira?', min: 1.8,
    cam: { at: 'zinho', d: 4.4, yaw: 15, h: 0.15, push: 0.2, fov: 50 },
    actors: { zinho: { p: [0, 0], r: 0, a: 'shrug', e: 'happy', prop: 'sword' } } }),

  // ── FINAL + GANCHO DA PARTE 3 ──
  W({ who: 'NAR', text: 'O Zinho ia voltar pra casa rindo. Mas o chão tremeu de novo. Bem mais forte.', shake: 0.06,
    cam: { at: 'zinho', d: 4.5, yaw: -20, h: 0.15, push: 0.25, fov: 52 },
    actors: { zinho: { p: [0, 0], r: 0, a: 'shock', e: 'shock', prop: 'sword' } }, sfx: [['boom', 0.5], ['thud', 0.62], ['boom', 0.8]] }),
  W({ who: 'NAR', text: 'Atrás do gigante criança, dois olhos roxos se abriram. Do tamanho de uma montanha.', shake: 0.04,
    cam: { pos: [3, 1.3, 8], look: [6, 30, -80], pos2: [3, 1.3, 6], look2: [6, 38, -80], fov: 66 },
    actors: {}, fx: { giant: { p: [6, -80], s: 1.25, eye: '#c04dff', r: 0, up: -0.5 } }, sfx: [['boom', 0.3]] }),
  W({ who: 'NAR', text: 'A mãe tinha acordado. E ela não parecia querer brincar. Comenta MÃE pra ver a parte três.', min: 3.4, shake: 0.03,
    cam: { pos: [1.6, 1.0, 5.4], look: [5, 26, -80], pos2: [1.6, 1.0, 4.8], look2: [5, 30, -80], fov: 70 },
    actors: { zinho: { p: [2.4, 1.2], r: 180, a: 'guard', e: 'shock', prop: 'sword' } }, fx: { giant: { p: [6, -80], to: [6, -70], s: 1.25, eye: '#c04dff', r: 0, up: -0.7 } },
    sfx: [['thud', 0.3], ['thud', 0.6]], endcard: 'comment', endcardText: 'Comenta “MÃE” ↓' }),
];

export const meta = {
  kind: 'short',
  title: 'Nesse bairro, alguém joga pedras no gigante toda noite 🗿 (parte 2) - animação',
  description: 'O gigante de pedra segura as pedras que caem do céu. O Zinho foi atrás do morro descobrir quem joga. 🗿⚔️\n\nE agora, o que a mãe vai fazer? Comenta MÃE pra ver a parte 3 👇\n\nParte 1: https://youtu.be/rZTkD5NtyIU\n\n#animação #história #nessemundo #gigante #zinhoosortudo #shorts\n\nAnimação original feita com ajuda de IA (vozes e produção).',
  tags: ['animação', 'animação de blocos', 'animação estilo roblox', 'história animada', 'história engraçada', 'nesse mundo', 'nessa cidade', 'gigante', 'gigante de pedra', 'mistério', 'parte 2', 'zinho o sortudo', 'animation', 'funny animation story', 'animation story', 'shorts'],
  categoryId: '1',
};
