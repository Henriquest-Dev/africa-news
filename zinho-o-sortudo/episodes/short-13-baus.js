// Short de ESCOLHA (~35 s, vertical): "Escolhe um baú: 1, 2 ou 3" — os três baús do Seu Juca na praça.
// Mesmo formato do vídeo das portas (o que mais cresceu): texto grande no 1.º quadro, comentário no 3.º plano,
// corte a cada ~2 s e final em loop (último plano = enquadramento do primeiro). Usa a praça com as peças do lobby.
const P = (o) => ({ style2: true, cap: true, pad: -0.15, set: 'praca', tod: 'day', capY: '37%', ...o });
const CH = (o = {}) => ({ chests: { ...o } });
const WIDE = { pos: [0, 2.3, 16], look: [0, 1.2, 5.2], pos2: [0, 2.0, 12.5], look2: [0, 1.1, 5.2], fov: 60 };
const chestCam = (n) => ({ pos: [(n - 2) * 1.9 * 0.5, 1.6, 9.0], look: [(n - 2) * 1.9, 0.8, 5.2], pos2: [(n - 2) * 1.9 * 0.8, 1.4, 7.6], look2: [(n - 2) * 1.9, 0.8, 5.2], fov: 54 });

export default [
  // ── GANCHO ──
  P({ who: 'NAR', text: 'O Seu Juca deixou três baús na praça. Escolhe um.', hq: true, blocky: true, min: 2.4,
    music: 'file:assets/music/fundo.mp3', musicGain: 0.2, duck: 0.6, voiceSpeed: 1.04, lead: 0.0, tail: 0.15,
    cam: WIDE, actors: {}, fx: CH(), card: { t: 'ESCOLHE UM BAÚ', s: '1 · 2 · 3', at: 0, top: true }, sfx: [['sparkle', 0.05]] }),
  P({ who: 'JUCA', text: 'Só pode um, hein! E sem trocar!', min: 1.6,
    cam: { at: 'juca', d: 3.0, yaw: 20, h: 0.15, push: 0.3, fov: 52 },
    actors: { juca: { p: [3.2, 6.6], r: -20, a: 'point', e: 'smug' } }, fx: CH() }),
  P({ who: 'NAR', text: 'Comenta o seu número antes de abrir.', min: 1.8,
    cam: { pos: [-5.5, 1.7, 11], look: [-0.5, 1.0, 5.2], pos2: [5.5, 1.7, 11], look2: [0.5, 1.0, 5.2], fov: 54 },
    actors: {}, fx: CH(), card: { t: '1 · 2 · 3', s: 'comenta antes de abrir', at: 0.05, top: true }, sfx: [['ding', 0.4, 0.5]] }),

  // ── BAÚ 1: a espada ──
  P({ who: 'NAR', text: 'Baú um.', min: 1.3, cam: chestCam(1), actors: {}, fx: CH({ open: 1, at: 0.15 }), sfx: [['sparkle', 0.2], ['whoosh', 0.25]] }),
  P({ who: 'NAR', text: 'A espada de cristal do avô do Zinho.', min: 1.9,
    cam: { at: 'zinho', d: 3.4, yaw: 25, h: 0.25, push: 0.35, fov: 54 },
    actors: { zinho: { p: [-1.5, 6.9], r: 10, a: 'swordup', e: 'happy', prop: 'sword' } }, fx: CH({ opened: [1] }), sfx: [['sparkle', 0.4]] }),
  P({ who: 'ZINHO', text: 'Agora eu sou o herói do bairro!', min: 1.7,
    cam: { at: 'zinho', d: 3.0, yaw: -20, h: 0.15, push: 0.3, fov: 52 },
    actors: { zinho: { p: [-1.5, 6.9], r: 10, a: 'slash', e: 'smug', prop: 'sword' } }, fx: CH({ opened: [1] }), sfx: [['whoosh', 0.3], ['whoosh', 0.75]] }),

  // ── BAÚ 2: o Sorriso ──
  P({ who: 'NAR', text: 'Baú dois.', min: 1.3, cam: chestCam(2), actors: {}, fx: CH({ opened: [1], open: 2, at: 0.15 }), sfx: [['sparkle', 0.2], ['whoosh', 0.25]] }),
  P({ who: 'NAR', text: 'O Sorriso. Sim, aquele da porta proibida.', min: 2.2, shake: 0.03,
    cam: { at: 'sorriso', d: 4.0, yaw: 10, h: 0.2, push: 0.35, fov: 54 },
    actors: { sorriso: { p: [0, 7.0], r: 0, a: 'creep', e: 'happy' } }, fx: CH({ opened: [1, 2] }), sfx: [['boom', 0.15]] }),
  P({ who: 'SORRISO', text: 'Oi.', min: 1.2,
    cam: { at: 'sorriso', d: 2.6, yaw: -5, h: 0.05, push: 0.2, fov: 50 },
    actors: { sorriso: { p: [0, 7.0], r: 0, a: 'wave', e: 'happy' } }, fx: CH({ opened: [1, 2] }) }),

  // ── BAÚ 3: o chinelo… e quem vem com ele ──
  P({ who: 'NAR', text: 'Baú três.', min: 1.3, cam: chestCam(3), actors: {}, fx: CH({ opened: [1, 2], open: 3, at: 0.15 }), sfx: [['sparkle', 0.2], ['whoosh', 0.25]] }),
  P({ who: 'NAR', text: 'Um chinelo. E junto com ele veio a Dona Neide.', min: 2.2,
    cam: { at: 'mae', d: 3.6, yaw: 20, h: 0.2, push: 0.35, fov: 54 },
    actors: { mae: { p: [1.5, 6.9], r: -10, a: 'threat', e: 'angry', prop: 'chinelo' } }, fx: CH({ opened: [1, 2, 3] }), sfx: [['bonk', 0.7]] }),
  P({ who: 'MAE', text: 'Quem deixou a louça suja?!', min: 1.6, shake: 0.03,
    cam: { at: 'mae', d: 2.7, yaw: -10, h: 0.1, push: 0.3, fov: 50 },
    actors: { mae: { p: [1.5, 6.9], r: -10, a: 'threat', e: 'angry', prop: 'chinelo' } }, fx: CH({ opened: [1, 2, 3] }) }),

  // ── VIRADA + LOOP ──
  P({ who: 'NAR', text: 'E quem não escolheu nenhum? Leva os três.', min: 2.6, shake: 0.02,
    cam: { pos: [-3, 1.8, 17], look: [1, 1.2, 9], pos2: [-2, 1.7, 15.5], look2: [1, 1.2, 9], fov: 56 },
    actors: { zinho: { p: [3.5, 9.5], to: [-1.5, 12.5], a: 'run', e: 'shock', prop: 'sword' }, mae: { p: [6.5, 7.8], to: [2.4, 10.8], a: 'run', e: 'angry', prop: 'chinelo' }, sorriso: { p: [8.5, 6.8], to: [5.6, 9.0], a: 'walk', e: 'happy' } },
    fx: CH({ opened: [1, 2, 3] }), sfx: [['whoosh', 0.2], ['bonk', 0.8]] }),
  P({ who: 'NAR', text: 'Então escolhe bem. Volta e escolhe um baú.', min: 2.4, tail: 0.05,
    cam: { pos: WIDE.pos2, look: WIDE.look2, pos2: WIDE.pos, look2: WIDE.look, fov: 52 },
    actors: {}, fx: CH(), sfx: [['whoosh', 0.85]] }),
];

export const meta = {
  kind: 'short',
  title: 'Escolhe um baú: 1, 2 ou 3 🎁 (sem trocar!)',
  description: 'O Seu Juca deixou três baús na praça. Escolhe um e comenta o seu número antes de abrir 👇 Sem trocar!\n\n#escolhaumbau #escolha #animação #zinhoosortudo #shorts\n\nAnimação original feita com ajuda de IA (vozes e produção).',
  tags: ['escolhe um baú', 'escolha um baú', 'escolha 1 2 ou 3', 'escolha uma caixa', 'qual você escolhe', 'escolhas', 'baú do tesouro', 'animação', 'animação de blocos', 'animação estilo roblox', 'animação engraçada', 'história animada', 'zinho o sortudo', 'choose a chest', 'shorts'],
  categoryId: '1',
};
