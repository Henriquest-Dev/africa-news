// História (~90 s, vertical) no visual de bonecos de blocos — "Nesse bairro, um gigante de pedra acorda toda noite".
// Formato: regra estranha do lugar no 1.º segundo, protagonista que desobedece, virada no fim e gancho para a parte 2.
// Trilha: ficheiro do dono do canal em assets/music/fundo.mp3 (fora do repositório). Render: node tools/render.mjs --w 1080 --h 1920

const S = (o) => ({ style2: true, cap: true, pad: -0.15, set: 'street', tod: 'night', ...o });
const GP = [8, -24];                       // onde o gigante fica (atrás das casas do lado norte)
const SKY = { pos: [5.5, 1.3, 2.4], look: [8, 13.5, -22], fov: 70 };

export default [
  // ── GANCHO: a regra do lugar ──
  S({ who: 'NAR', text: 'Nesse bairro, toda noite, um gigante de pedra acorda.', hq: true, blocky: true,
    music: 'file:assets/music/fundo.mp3', musicGain: 0.2, duck: 0.6, voiceSpeed: 1.08, lead: 0.05, tail: 0.55,
    cam: { pos: [5.5, 1.2, 2.6], look: [8.5, 12, -22], pos2: [5.5, 1.2, 1.4], look2: [8.5, 14, -22], fov: 70 },
    actors: {}, fx: { giant: { p: [18, -26], to: GP, r: -20 } }, shake: 0.02, sfx: [['boom', 0.05], ['thud', 0.5], ['thud', 0.9]] }),
  S({ who: 'NAR', text: 'E a regra é uma só: quando o poste acende, ninguém sai de casa.', tod: 'dusk',
    cam: { at: 'juca', d: 4.1, yaw: 25, h: 0.2, push: 0.2, fov: 54 },
    actors: { juca: { p: [1.6, -4.4], look: 'zinho', a: 'point', e: 'worried' }, zinho: { p: [-0.2, -4.2], look: 'juca', a: 'idle', e: 'neutral' } } }),
  S({ who: 'JUCA', text: 'Entra, menino! Ele já vem!', tod: 'dusk', min: 1.5,
    cam: { at: 'juca', d: 3.2, yaw: -15, h: 0.1, push: 0.15, fov: 50 },
    actors: { juca: { p: [1.6, -4.4], look: 'zinho', a: 'angry', e: 'shock' } } }),
  S({ who: 'NAR', text: 'Só que o Zinho era novo no bairro. E nunca foi de obedecer regra.', set: 'bedroom', tod: 'indoorNight',
    cam: { at: 'zinho', d: 3.3, yaw: 30, h: 0.25, push: 0.2, fov: 52 },
    actors: { zinho: { p: [-2, -1.6], a: 'sitbed', e: 'smug' } } }),

  // ── A PRIMEIRA NOITE ──
  S({ who: 'NAR', text: 'Naquela noite, ele olhou pela janela.', shake: 0.03,
    cam: { pos: [5.5, 1.3, 2.6], look: [3, 12, -22], pos2: [5.5, 1.3, 1.8], look2: [7, 12, -22], fov: 70 },
    actors: {}, fx: { giant: { p: [-8, -25], to: [6, -24], r: 60 } }, sfx: [['thud', 0.15], ['thud', 0.5], ['thud', 0.85]] }),
  S({ who: 'ZINHO', text: 'Ele é do tamanho de um prédio!', min: 1.5,
    cam: { at: 'zinho', d: 3.1, yaw: 15, h: 0.05, push: 0.25, fov: 50 },
    actors: { zinho: { p: [0, -4], r: 0, a: 'shock', e: 'shock' } } }),

  // ── A MANHÃ ──
  S({ who: 'NAR', text: 'De manhã, o bairro inteiro fingia que nada tinha acontecido.', tod: 'day',
    cam: { pos: [1.5, 1.7, 1.2], look: [0.6, 1.2, -4.4], pos2: [1.0, 1.65, 0.6], look2: [0.6, 1.2, -4.4], fov: 58 },
    actors: { lia: { p: [1.8, -4.4], r: -20, a: 'wave', e: 'happy' }, beto: { p: [-1.2, -4.6], r: 20, a: 'idle', e: 'happy' }, mae: { p: [3.4, -5.0], r: -30, a: 'idle', e: 'neutral' }, zinho: { p: [0.3, -3.9], r: 180, a: 'shrug', e: 'worried' } } }),
  S({ who: 'ZINHO', text: 'Gente, tem um gigante aqui e ninguém faz nada?!', tod: 'day', min: 1.6,
    cam: { at: 'zinho', d: 3.2, yaw: 20, h: 0.1, push: 0.15, fov: 50 },
    actors: { zinho: { p: [0.3, -3.9], look: 'lia', a: 'angry', e: 'angry' }, beto: { p: [-1.2, -4.6], look: 'zinho', a: 'idle', e: 'flat' } } }),
  S({ who: 'LIA', text: 'Faz anos que é assim. A gente só não olha.', tod: 'day', min: 1.6,
    cam: { at: 'lia', d: 3.2, yaw: -20, h: 0.1, push: 0.15, fov: 50 },
    actors: { lia: { p: [1.8, -4.4], look: 'zinho', a: 'shrug', e: 'flat' } } }),

  // ── A PISTA ──
  S({ who: 'NAR', text: 'Mas o Zinho olhou. E reparou numa coisa estranha: o gigante nunca olhava pra baixo. Só pra cima.',
    cam: { pos: [5.5, 1.3, 2.6], look: [8, 13, -22], pos2: [5.8, 1.3, -0.5], look2: [8, 16, -22], fov: 66 },
    actors: {}, fx: { giant: { p: GP, r: -8, up: 1 } }, sfx: [['sparkle', 0.45]] }),
  S({ who: 'NAR', text: 'Pergunta rápida: você ficava em casa, ou ia lá fora? Responde aí.', tod: 'day',
    cam: { at: 'zinho', d: 3.0, yaw: 0, h: 0.1, push: 0.2, fov: 50 },
    actors: { zinho: { p: [0, -4], r: 0, a: 'point', e: 'happy' } }, sfx: [['ding', 0.85, 0.5]] }),

  // ── O CONFRONTO ──
  S({ who: 'NAR', text: 'O Zinho foi lá fora. Com a única arma que tinha: a espada do avô, que brilhava no escuro.',
    cam: { at: 'zinho', d: 3.9, yaw: 25, h: 0.25, push: 0.3, fov: 54 },
    actors: { zinho: { p: [3, -3.6], r: 30, a: 'swordup', e: 'angry', prop: 'sword' } }, sfx: [['sparkle', 0.5], ['whoosh', 0.55]] }),
  S({ who: 'ZINHO', text: 'Ei, grandão! Esse bairro tem dono!', min: 1.6,
    cam: { pos: [5.2, 1.0, 1.6], look: [7.2, 8.5, -20], fov: 68 },
    actors: { zinho: { p: [5.9, -2.4], r: 170, a: 'slash', e: 'angry', prop: 'sword' } }, fx: { giant: { p: GP, r: -8, up: 1 } } }),
  S({ who: 'NAR', text: 'O gigante parou. Virou a cabeça devagar. E, pela primeira vez, olhou pra baixo.', shake: 0.02,
    cam: { pos: [6, 6, -2], look: [8, 20.5, -22], pos2: [6.6, 7, -6], look2: [8, 20.5, -22], fov: 50 },
    actors: {}, fx: { giant: { p: GP, r: -8, up: -1.1 } }, sfx: [['boom', 0.6]] }),
  S({ who: 'NAR', text: 'O Zinho correu e bateu com toda a força no pé dele.',
    cam: { pos: [6.0, 1.3, -3.4], look: [10, 2.2, -11], pos2: [6.6, 1.3, -4.2], look2: [10, 2.2, -11], fov: 60 },
    actors: { zinho: { p: [9.2, -8.2], r: 165, a: 'slash', e: 'angry', prop: 'sword' } }, fx: { giant: { p: [10.5, -14], r: -8, up: -1.1 } }, sfx: [['clang', 0.35], ['clang', 0.75]] }),
  S({ who: 'NAR', text: 'Nem arranhou.', min: 1.5,
    cam: { pos: [10.4, 1.5, -11.2], look: [9.2, 1.25, -8.2], pos2: [10.2, 1.5, -10.8], look2: [9.2, 1.25, -8.2], fov: 50 },
    actors: { zinho: { p: [9.2, -8.2], r: 165, a: 'guard', e: 'flat', prop: 'sword' } }, sfx: [['bonk', 0.2]] }),

  // ── A VIRADA ──
  S({ who: 'NAR', text: 'Foi aí que o céu ficou laranja. Uma pedra em chamas vinha caindo, direto em cima das casas.', music: 'file:assets/music/fundo.mp3', shake: 0.03,
    cam: { ...SKY, pos2: [5.5, 1.3, 1], look2: [9.5, 17, -22] },
    actors: {}, fx: { giant: { p: GP, r: -8, raise: [0, 1], up: 1 }, meteorGlow: 0.35 }, sfx: [['whoosh', 0.3, 0.8]] }),
  S({ who: 'NAR', text: 'O gigante levantou o braço… e pegou.', min: 2.4,
    cam: { pos: [5.5, 1.3, 1], look: [9.5, 17, -22], fov: 70 },
    actors: {}, fx: { giant: { p: GP, r: -8, raise: 1, up: 1, rock: 0.7 }, meteorGlow: 0.5 }, sfx: [['boom', 0.7], ['thud', 0.72]] }),
  S({ who: 'NAR', text: 'Toda noite cai uma pedra do céu naquele bairro. E toda noite, alguém segura.',
    cam: { pos: [4.6, 1.6, 2.7], look: [8.5, 13, -22], pos2: [4.2, 1.6, 2.7], look2: [8.8, 14, -22], fov: 74 },
    actors: {}, fx: { giant: { p: GP, r: -8, raise: 1, up: 0.6, held: true } }, card: { t: 'A VERDADE', s: 'ele não vigiava o bairro. Vigiava o céu.', at: 0.5 } }),
  S({ who: 'ZINHO', text: 'Então... você é o nosso telhado?', min: 1.6,
    cam: { pos: [10.0, 1.0, -11.0], look: [9.2, 1.5, -8.2], pos2: [9.8, 1.0, -10.6], look2: [9.2, 1.5, -8.2], fov: 52 },
    actors: { zinho: { p: [9.2, -8.2], r: 175, a: 'idle', e: 'shock', prop: 'sword' } } }),

  // ── FINAL + GANCHO DA PARTE 2 ──
  S({ who: 'NAR', text: 'No outro dia, o Zinho guardou a espada. E deixou doze pães na calçada. Gigante também sente fome.', tod: 'dusk',
    cam: { at: 'zinho', d: 3.5, yaw: 20, h: 0.15, push: 0.15, fov: 52 },
    actors: { zinho: { p: [0, -4], r: 0, a: 'hold', e: 'happy', prop: 'bread' }, juca: { p: [1.7, -4.5], look: 'zinho', a: 'idle', e: 'happy' } }, sfx: [['ding', 0.6, 0.5]] }),
  S({ who: 'NAR', text: 'Mas se ele segura as pedras... quem é que está jogando? Comenta GIGANTE pra ver a parte dois.', min: 3.2,
    cam: { pos: [5.5, 1.5, 2.7], look: [8, 12, -22], pos2: [5.5, 1.5, 2.2], look2: [8.2, 13.5, -22], fov: 70 },
    actors: { zinho: { p: [6.3, -1.2], r: 175, a: 'idle', e: 'neutral' } }, fx: { giant: { p: GP, r: -8, up: 1 } },
    endcard: 'comment', endcardText: 'Comenta “GIGANTE” ↓' }),
];

export const meta = {
  kind: 'short',
  title: 'Nesse bairro, um gigante de pedra acorda toda noite 🗿 - animação',
  description: 'Nesse bairro existe uma regra: quando o poste acende, ninguém sai de casa. O Zinho saiu. 🗿⚔️\n\nQuem é que está jogando as pedras? Comenta GIGANTE pra ver a parte 2 👇\n\n#animação #história #nessemundo #gigante #zinhoosortudo #shorts\n\nAnimação original feita com ajuda de IA (vozes e produção).',
  tags: ['animação', 'animação de blocos', 'animação estilo roblox', 'história animada', 'história engraçada', 'nesse mundo', 'nessa cidade', 'gigante', 'mistério', 'zinho o sortudo', 'história curta', 'animation', 'funny animation story', 'animation story', 'shorts'],
  categoryId: '1',
};
