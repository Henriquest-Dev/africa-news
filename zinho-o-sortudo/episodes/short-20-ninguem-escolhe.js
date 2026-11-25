// Short (~45 s, vertical) — formato HISTÓRIA TRISTE/EMOCIONAL (pedido do dono, 23/11).
// Frase-resumo: "Na praça, o Beto e o Enzo escolhem times; ninguém escolhe o Zinho e ele senta sozinho com o Bolinha;
// mas o Enzo lembra que o Zinho foi o único que o chamou no aniversário e escolhe-o para o time dele."
// Um só lugar (a praça). Liga ao Short 19 (Rico vs Pobre no aniversário). Final em loop.

const H = (o) => ({ style2: true, cap: true, pad: -0.15, set: 'praca', tod: 'dusk', capY: '37%', ...o });
// capitães virados para sul (+z), fila de crianças à frente deles virada para norte
const CAP = { beto: { p: [-1.1, 4.6], r: 0, a: 'idle', e: 'neutral' }, enzo: { p: [1.2, 4.6], r: 0, a: 'idle', e: 'smug' } };
const LINE = { lia: { p: [-2.4, 7.6], r: 180, a: 'idle', e: 'neutral' }, kaka: { p: [-0.8, 7.6], r: 180, a: 'idle', e: 'neutral' },
  dudu: { p: [0.8, 7.6], r: 180, a: 'idle', e: 'neutral' }, zinho: { p: [2.4, 7.6], r: 180, a: 'idle', e: 'happy' } };
const ZS = [4.6, 9.8];                                     // onde o Zinho se senta sozinho

export default [
  // ── GANCHO ──
  H({ who: 'NAR', text: 'Todo dia tinha time na praça. E todo dia sobrava o Zinho.', hq: true, blocky: true, min: 2.8,
    music: 'file:assets/music/fundo.mp3', musicGain: 0.16, duck: 0.6, voiceSpeed: 1.05, lead: 0.0, tail: 0.15,
    cam: { at: 'zinho', d: 3.2, yaw: 10, h: 0.25, push: 0.35, fov: 52 },
    actors: { zinho: { p: ZS, r: 200, a: 'sitfloor', e: 'sad' } }, fx: { dog: { p: [5.5, 9.4], r: -60, s: 1.1 } },
    card: { t: 'NINGUÉM ESCOLHEU O ZINHO…', s: '', at: 0, top: true } }),
  H({ who: 'NAR', text: 'Comenta: você já foi o último a ser escolhido? Sim ou não.', min: 2.4,
    cam: { pos: [-5.6, 2.6, 9.6], look: [0.4, 1.2, 6.2], pos2: [-4.8, 2.4, 9.0], look2: [0.4, 1.2, 6.2], fov: 58 },
    actors: { ...CAP, ...LINE }, card: { t: 'JÁ FOI O ÚLTIMO?', s: 'sim ou não', at: 0.05, top: true }, sfx: [['ding', 0.4, 0.5]] }),

  // ── A ESCOLHA ──
  H({ who: 'BETO', text: 'Eu escolho a Lia.', min: 1.4,
    cam: { at: 'beto', d: 2.6, yaw: 15, h: 0.15, push: 0.3, fov: 50 },
    actors: { ...CAP, beto: { ...CAP.beto, a: 'point' }, ...LINE } }),
  H({ who: 'ENZO', text: 'Eu fico com a Kaká.', min: 1.4,
    cam: { at: 'enzo', d: 2.6, yaw: -15, h: 0.15, push: 0.3, fov: 50 },
    actors: { ...CAP, enzo: { ...CAP.enzo, a: 'point' }, ...LINE, lia: { p: [-1.6, 5.0], r: 0, a: 'idle', e: 'happy' } } }),
  H({ who: 'BETO', text: 'Dudu!', min: 1.1,
    cam: { pos: [-0.2, 1.7, 4.0], look: [1.4, 1.4, 7.6], pos2: [0.1, 1.7, 4.4], look2: [1.4, 1.4, 7.6], fov: 56 },
    actors: { ...CAP, beto: { ...CAP.beto, a: 'point' }, dudu: { p: [0.8, 7.6], r: 180, a: 'cheer', e: 'happy' }, zinho: { p: [2.4, 7.6], r: 180, a: 'idle', e: 'worried' } } }),
  H({ who: 'NAR', text: 'Sobrou um.', min: 1.4,
    cam: { at: 'zinho', d: 2.3, yaw: 0, h: 0.1, push: 0.3, fov: 50 },
    actors: { zinho: { p: [2.4, 7.6], r: 180, a: 'idle', e: 'worried' } } }),
  H({ who: 'BETO', text: 'Foi mal, Zinho. Os times já tão completos.', min: 2,
    cam: { at: 'beto', d: 3.0, yaw: 25, h: 0.2, push: 0.3, fov: 52 },
    actors: { beto: { p: [-1.1, 4.6], r: 30, a: 'shrug', e: 'worried' }, enzo: { p: [1.2, 4.6], r: 20, a: 'idle', e: 'flat' },
      lia: { p: [-1.6, 5.0], r: 30, a: 'idle', e: 'neutral' }, kaka: { p: [1.8, 5.2], r: 20, a: 'idle', e: 'neutral' }, zinho: { p: [2.4, 7.6], r: 200, a: 'headdown', e: 'sad' } } }),

  // ── SOZINHO ──
  H({ who: 'NAR', text: 'O Zinho sentou longe. Sozinho. De novo.', min: 2.2,
    cam: { pos: [3.0, 1.2, 6.4], look: [4.6, 0.8, 9.8], pos2: [3.3, 1.1, 7.0], look2: [4.6, 0.8, 9.8], fov: 54 },
    actors: { zinho: { p: ZS, r: 200, a: 'sitfloor', e: 'sad' } } }),
  H({ who: 'NAR', text: 'Só o Bolinha veio sentar do lado dele.', min: 2,
    cam: { pos: [4.0, 1.0, 6.8], look: [5.0, 0.7, 9.6], pos2: [4.2, 1.0, 7.3], look2: [5.0, 0.7, 9.6], fov: 54 },
    actors: { zinho: { p: ZS, r: 200, a: 'sitfloor', e: 'sad' } }, fx: { dog: { p: [5.5, 9.4], r: -60, wag: true, s: 1.1 } } }),
  H({ who: 'ZINHO', text: 'Pelo menos você me escolhe, né, Bolinha?', min: 2,
    cam: { at: 'zinho', d: 2.2, yaw: 20, h: 0.05, push: 0.25, fov: 50 },
    actors: { zinho: { p: ZS, r: 200, a: 'sitfloor', e: 'sad' } }, fx: { dog: { p: [5.5, 9.4], r: -60, wag: true, s: 1.1 } } }),

  // ── A VIRADA ──
  H({ who: 'NAR', text: 'Mas alguém tava olhando.', min: 1.5,
    cam: { at: 'enzo', d: 2.4, yaw: 30, h: 0.1, push: 0.35, fov: 50 },
    actors: { enzo: { p: [1.2, 4.6], r: 60, a: 'idle', e: 'sad' } } }),
  H({ who: 'ENZO', text: 'Beto, no meu time ainda tem lugar.', min: 1.8,
    cam: { at: 'enzo', d: 2.8, yaw: -20, h: 0.15, push: 0.3, fov: 52 },
    actors: { enzo: { p: [1.2, 4.6], r: 300, a: 'point', e: 'neutral' }, beto: { p: [-1.1, 4.6], r: 90, a: 'shock', e: 'shock' } } }),
  H({ who: 'BETO', text: 'Pro Zinho?!', min: 1.2,
    cam: { at: 'beto', d: 2.3, yaw: 10, h: 0.1, push: 0.35, fov: 50 },
    actors: { beto: { p: [-1.1, 4.6], r: 90, a: 'shock', e: 'shock' } } }),
  H({ who: 'ENZO', text: 'Ele foi o único que me chamou quando ninguém ficou na minha festa.', min: 3,
    cam: { at: 'enzo', d: 2.4, yaw: 5, h: 0.1, push: 0.25, fov: 50 },
    actors: { enzo: { p: [1.2, 4.6], r: 40, a: 'talk', e: 'sad' } } }),
  H({ who: 'ENZO', text: 'Vem, Zinho. Você é o primeiro.', min: 2,
    cam: { pos: [1.6, 1.5, 7.4], look: [4.0, 1.0, 9.0], pos2: [1.9, 1.5, 7.6], look2: [4.0, 1.0, 9.0], fov: 60 },
    actors: { enzo: { p: [3.4, 8.2], r: 60, a: 'reach', e: 'happy' }, zinho: { p: ZS, r: 240, a: 'sitfloor', e: 'shock' } }, fx: { dog: { p: [5.5, 9.4], r: -60, wag: true, s: 1.1 } } }),
  H({ who: 'NAR', text: 'Pela primeira vez, o Zinho foi escolhido primeiro.', min: 2.4,
    cam: { pos: [6.2, 2.3, 7.4], look: [0.6, 1.3, 6.2], pos2: [5.6, 2.2, 7.0], look2: [0.6, 1.3, 6.2], fov: 58 },
    actors: { zinho: { p: [1.6, 6.0], r: 90, a: 'cheer', e: 'happy' }, enzo: { p: [0.6, 5.6], r: 90, a: 'cheer', e: 'happy' }, kaka: { p: [1.4, 4.6], r: 60, a: 'cheer', e: 'happy' },
      beto: { p: [-1.6, 5.4], r: 90, a: 'cheer', e: 'happy' }, lia: { p: [-1.2, 6.6], r: 90, a: 'cheer', e: 'happy' }, dudu: { p: [-2.4, 6.0], r: 90, a: 'cheer', e: 'happy' } },
    fx: { dog: { p: [2.6, 7.0], r: -90, wag: true, s: 1.1 } }, sfx: [['sparkle', 0.3], ['ding', 0.5, 0.5]] }),

  // ── LOOP ──
  H({ who: 'NAR', text: 'Mas antes disso, todo dia tinha time na praça. E todo dia sobrava o Zinho.', min: 3, tail: 0.05,
    cam: { at: 'zinho', d: 3.2, yaw: 10, h: 0.25, push: 0.35, fov: 52 },
    actors: { zinho: { p: ZS, r: 200, a: 'sitfloor', e: 'sad' } }, fx: { dog: { p: [5.5, 9.4], r: -60, s: 1.1 } } }),
];

export const meta = {
  kind: 'short',
  title: 'Ninguém escolheu o Zinho… 😢',
  description: 'Todo dia tinha time na praça, e todo dia sobrava o Zinho. Até que alguém lembrou quem foi o único que ficou do lado dele. Você já foi o último a ser escolhido? Comenta sim ou não 👇\n\n#historiatriste #roblox #animação #zinhoosortudo #shorts\n\nAnimação original feita com ajuda de IA (vozes e produção).',
  tags: ['história triste', 'historia triste roblox', 'ninguém me escolheu', 'último a ser escolhido', 'animação roblox', 'animação estilo roblox', 'história roblox', 'história emocionante', 'animação de blocos', 'zinho o sortudo', 'shorts'],
  categoryId: '1',
};
