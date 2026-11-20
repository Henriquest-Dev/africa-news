// Short (~60 s, vertical): "Nesse bairro, todo mundo tem um narrador" — inspirado no formato de um vídeo viral do nicho
// (cada pessoa tem um narrador fantasma que conta a vida dela em voz alta). História, falas e personagens próprios:
// o narrador do Zinho é o Sorriso, a voz maligna que fala mal dele… e no fim mostra outro lado.
const P = (o) => ({ style2: true, cap: true, pad: -0.15, set: 'praca', tod: 'day', capY: '37%', ...o });
// ponto atrás de alguém virado para r graus (fantasma a flutuar atrás, ligeiramente de lado)
const behind = (p, r, d = 0.9, side = 0.55) => { const a = r * Math.PI / 180; return [+(p[0] - Math.sin(a) * d + Math.cos(a) * side).toFixed(2), +(p[1] - Math.cos(a) * d - Math.sin(a) * side).toFixed(2)]; };
const LIA = [-1.6, 10.2], JUCA = [3.4, 8.6], CAO = [6.4, 10.6], ZP = [0.4, 8.8];

export default [
  // ── GANCHO: a Lia e a narradora dela ──
  P({ who: 'NAR', text: 'Nesse bairro, todo mundo tem um narrador.', hq: true, blocky: true, min: 2.4,
    music: 'file:assets/music/fundo.mp3', musicGain: 0.2, duck: 0.6, voiceSpeed: 1.05, lead: 0.0, tail: 0.2,
    cam: { pos: [-0.6, 1.8, 14.4], look: [-1.4, 1.7, 9.6], pos2: [-0.9, 1.7, 13.0], look2: [-1.4, 1.7, 9.6], fov: 54 },
    actors: { lia: { p: LIA, r: 10, a: 'idle', e: 'happy' }, vozlia: { p: behind(LIA, 10), r: 10, a: 'talk', e: 'happy' } },
    card: { t: 'TODO MUNDO TEM', s: 'um narrador', at: 0, top: true }, sfx: [['sparkle', 0.1]] }),
  P({ who: 'VOZLIA', text: 'A Lia acordou linda, cheirosa e pronta pra vencer.', min: 2.4,
    cam: { at: 'lia', d: 3.4, yaw: 20, h: 0.35, push: 0.3, fov: 54 },
    actors: { lia: { p: LIA, r: 10, a: 'wave', e: 'smug' }, vozlia: { p: behind(LIA, 10), r: 10, a: 'talk', e: 'happy' } } }),
  P({ who: 'NAR', text: 'Comenta: o seu narrador seria bonzinho ou malvado?', min: 2.4,
    cam: { pos: [-6, 2.2, 15], look: [0, 1.6, 8.6], pos2: [5, 2.2, 15], look2: [1, 1.6, 8.6], fov: 58 },
    actors: { lia: { p: LIA, r: 10, a: 'idle', e: 'happy' }, vozlia: { p: behind(LIA, 10), r: 10, a: 'idle', e: 'happy' }, juca: { p: JUCA, r: -10, a: 'idle', e: 'neutral' }, vozjuca: { p: behind(JUCA, -10), r: -10, a: 'idle', e: 'neutral' } },
    card: { t: 'BONZINHO OU MALVADO?', s: 'comenta o seu', at: 0.05, top: true }, sfx: [['ding', 0.4, 0.5]] }),

  // ── O SEU JUCA E O CACHORRO ──
  P({ who: 'VOZJUCA', text: 'O Seu Juca… deu… mais… um passo.', min: 2.6,
    cam: { at: 'juca', d: 3.6, yaw: -20, h: 0.35, push: 0.2, fov: 54 },
    actors: { juca: { p: JUCA, to: [3.3, 8.75], r: -10, a: 'walk', e: 'tired' }, vozjuca: { p: behind(JUCA, -10), r: -10, a: 'talk', e: 'closed' } } }),
  P({ who: 'NAR', text: 'Até o cachorro tem um.', min: 1.6,
    cam: { pos: [5.0, 1.3, 14.0], look: [6.5, 1.0, 10.4], fov: 54 },
    actors: { vozcao: { p: [7.0, 9.7], r: -10, a: 'talk', e: 'smug' } }, fx: { dog: { p: CAO, r: -30, wag: true } }, sfx: [['bark', 0.5]] }),
  P({ who: 'VOZCAO', text: 'O Bolinha fez xixi no poste. Um momento histórico.', min: 2.6,
    cam: { pos: [4.6, 1.4, 13.6], look: [6.6, 1.0, 10.4], pos2: [5.0, 1.3, 12.8], look2: [6.6, 1.0, 10.4], fov: 54 },
    actors: { vozcao: { p: [7.0, 9.7], r: -10, a: 'shrug', e: 'happy' } }, fx: { dog: { p: CAO, r: 90 } } }),

  // ── O NARRADOR DO ZINHO ──
  P({ who: 'NAR', text: 'Mas o narrador do Zinho…', min: 1.8, shake: 0.03,
    cam: { pos: [0.6, 1.8, 13.2], look: [0.4, 1.8, 8.4], pos2: [0.6, 1.8, 11.4], look2: [0.4, 1.9, 8.4], fov: 56 },
    actors: { zinho: { p: ZP, r: 0, a: 'idle', e: 'neutral' }, vozzinho: { p: behind(ZP, 0, 1.0, 0.2), r: 0, a: 'creep', e: 'happy' } },
    fx: { cloud: { size: 1.3, storm: true } }, sfx: [['thud', 0.3], ['boom', 0.6]] }),
  P({ who: 'VOZZINHO', text: 'O Zinho acordou atrasado. De novo. Que vergonha.', min: 2.6,
    cam: { pos: [1.6, 1.8, 12.6], look: [0.5, 1.8, 8.4], pos2: [1.3, 1.8, 11.8], look2: [0.5, 1.8, 8.4], fov: 54 },
    actors: { zinho: { p: ZP, r: 0, a: 'angry', e: 'angry' }, vozzinho: { p: behind(ZP, 0, 1.0, 0.2), r: 0, a: 'talk', e: 'happy' } }, fx: { cloud: { size: 1.3, storm: true } } }),
  P({ who: 'ZINHO', text: 'Ei! Para de falar mal de mim!', min: 1.6,
    cam: { pos: [3.6, 1.7, 9.8], look: [0.5, 1.8, 8.3], pos2: [3.0, 1.7, 9.4], look2: [0.5, 1.8, 8.3], fov: 56 },
    actors: { zinho: { p: ZP, r: 180, a: 'point', e: 'angry' }, vozzinho: { p: behind(ZP, 0, 1.0, 0.2), r: 0, a: 'shrug', e: 'happy' } }, fx: { cloud: { size: 1.3, storm: true } } }),
  P({ who: 'VOZZINHO', text: 'Agora ele tá gritando sozinho no meio da praça.', min: 2.6,
    cam: { pos: [3.6, 1.6, 13.4], look: [0.4, 1.4, 8.6], pos2: [3.0, 1.5, 12.4], look2: [0.4, 1.4, 8.6], fov: 58 },
    actors: { zinho: { p: ZP, r: 180, a: 'point', e: 'angry' }, vozzinho: { p: behind(ZP, 0, 1.0, 0.2), r: 0, a: 'idle', e: 'happy' }, rosa: { p: [2.6, 10.4], r: -120, a: 'shock', e: 'shock' }, tonho: { p: [-1.8, 10.8], r: 140, a: 'idle', e: 'flat' } },
    fx: { cloud: { size: 1.3, storm: true } } }),

  // ── NA ESCOLA ──
  P({ who: 'VOZZINHO', text: 'Na prova, o Zinho não sabia nada.', set: 'classroom', tod: 'indoor', min: 2.2,
    cam: { pos: [0.7, 1.7, -1.4], look: [0, 1.2, 1.8], pos2: [0.6, 1.6, -0.8], look2: [0, 1.2, 1.8], fov: 56 },
    actors: { zinho: { p: [0, 1.5], r: 180, a: 'sit', e: 'worried' }, beto: { p: [2.2, 1.5], r: 180, a: 'sit', e: 'neutral' }, vozzinho: { p: [0.3, 2.6], r: 180, a: 'talk', e: 'happy' } } }),
  P({ who: 'ZINHO', text: 'Eu estudei!', set: 'classroom', tod: 'indoor', min: 1.2,
    cam: { at: 'zinho', d: 2.6, yaw: 10, h: 0.2, push: 0.2, fov: 52 },
    actors: { zinho: { p: [0, 1.5], r: 180, a: 'sit', e: 'angry' }, vozzinho: { p: [0.3, 2.6], r: 180, a: 'idle', e: 'happy' } } }),
  P({ who: 'VOZZINHO', text: 'Mentira. Ele colou do Beto.', set: 'classroom', tod: 'indoor', min: 2.0, shake: 0.02,
    cam: { pos: [1.6, 1.6, -1.6], look: [1.1, 1.1, 1.8], fov: 56 },
    actors: { zinho: { p: [0, 1.5], r: 180, a: 'sit', e: 'shock' }, beto: { p: [2.2, 1.5], r: 180, a: 'sit', e: 'shock' }, vozzinho: { p: [0.3, 2.6], r: 180, a: 'shrug', e: 'happy' } }, sfx: [['bonk', 0.6]] }),

  // ── A VIRADA ──
  P({ who: 'VOZZINHO', text: 'À noite, o Zinho ficou triste. Achou que tudo dava errado pra ele.', set: 'bedroom', tod: 'indoorNight', min: 3.4,
    cam: { at: 'zinho', d: 3.4, yaw: 25, h: 0.4, push: 0.2, fov: 54 },
    actors: { zinho: { p: [-2, -1.6], a: 'sitbed', e: 'sad' }, vozzinho: { p: [-1.2, -2.4], r: 30, a: 'idle', e: 'closed' } } }),
  P({ who: 'VOZZINHO', text: 'Mas amanhã ele vai tentar de novo. E eu vou estar aqui, contando tudo.', set: 'bedroom', tod: 'indoorNight', min: 3.6,
    cam: { at: 'zinho', d: 2.9, yaw: -10, h: 0.35, push: 0.25, fov: 52 },
    actors: { zinho: { p: [-2, -1.6], a: 'sitbed', e: 'happy' }, vozzinho: { p: [-1.2, -2.4], r: 30, a: 'wave', e: 'happy' } }, sfx: [['sparkle', 0.7]] }),
  P({ who: 'NAR', text: 'Talvez o narrador dele não seja tão malvado assim. E o seu?', min: 3.0, tail: 0.05,
    cam: { pos: [-0.9, 1.7, 13.0], look: [-1.4, 1.7, 9.6], pos2: [-0.6, 1.8, 14.4], look2: [-1.4, 1.7, 9.6], fov: 54 },
    actors: { lia: { p: LIA, r: 10, a: 'idle', e: 'happy' }, vozlia: { p: behind(LIA, 10), r: 10, a: 'idle', e: 'happy' }, zinho: { p: [-1.2, 8.2], r: -20, a: 'wave', e: 'happy' }, vozzinho: { p: behind([-1.2, 8.2], -20, 1.0, -0.3), r: -20, a: 'wave', e: 'happy' } },
    endcard: 'comment', endcardText: 'Bonzinho ou malvado? ↓' }),
];

export const meta = {
  kind: 'short',
  title: 'Nesse bairro, todo mundo tem um narrador 🗣️ - animação',
  description: 'Todo mundo no bairro do Zinho tem um narrador que conta a vida em voz alta… mas o do Zinho é o Sorriso. 😈\n\nO seu narrador seria bonzinho ou malvado? Comenta 👇\n\n#animação #nessemundo #narrador #zinhoosortudo #shorts\n\nAnimação original feita com ajuda de IA (vozes e produção).',
  tags: ['nesse mundo', 'nesse bairro', 'todo mundo tem um narrador', 'narrador', 'voz interior', 'animação', 'animação de blocos', 'animação estilo roblox', 'animação roblox', 'história animada', 'história engraçada', 'zinho o sortudo', 'animation story', 'shorts'],
  categoryId: '1',
};
