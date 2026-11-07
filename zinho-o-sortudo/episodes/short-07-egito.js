// Short vertical (≤60 s) — "E se você vivesse um dia no Egito Antigo?" — versão com gancho de duplo sentido.
// Gancho: "o faraó me mostrou a cobra dele" → é a cobra da coroa (uraeus), fato real. Piadas de duplo sentido leves
// (sem palavrão nem nada explícito). Fatos: uraeus; blocos de ~2,5 t; areia molhada reduz o atrito do trenó (estudo de 2014);
// trabalhadores pagos, sobretudo em comida. Render em alta qualidade (hq): node tools/render.mjs --w 1080 --h 1920

const S = (o) => ({ style2: true, cap: true, pad: -0.18, ...o });
const E = (d, v) => ['caos', d, v, 'CANSAÇO'];

export default [
  // ── GANCHO (duplo sentido) ──
  S({ who: 'ZINHO', text: 'O faraó me chamou só pra me mostrar a cobra dele.', set: 'egypt', tod: 'desert', hq: true,
    music: 'mystery', musicGain: 0.12, duck: 0.72, voiceSpeed: 1.25, lead: 0.03, tail: 0.08, min: 1.6,
    cam: { at: 'zinho', d: 3.1, yaw: 15, h: 0.15, push: 0.35, fov: 52 },
    actors: { zinho: { p: [0, 2], r: 0, a: 'shock', e: 'shock' } }, sfx: [['whoosh', 0.02, 0.6], ['boom', 0.7]] }),
  S({ who: 'NAR', text: 'Calma. A cobra da coroa. Todo faraó usava uma na testa, chamada uraeus. Símbolo de proteção.', set: 'egypt', tod: 'desert', stamp: 'EGITO, 2560 a.C.',
    cam: { at: 'kha', d: 2.9, yaw: -10, h: 0.5, push: 0.2, fov: 48 },
    actors: { kha: { p: [-1.0, 2.4], r: 20, a: 'idle', e: 'smug' } }, card: { t: 'FATO REAL', s: 'A cobra na coroa do faraó se chama uraeus', at: 0.35 }, sfx: [['stamp', 0.02], ['sparkle', 0.4]] }),
  S({ who: 'KHA', text: 'Gostou? É de ouro. E é enorme.', set: 'egypt', tod: 'desert', min: 1.5,
    cam: { at: 'kha', d: 3.2, yaw: -35, h: 0.1, push: 0.15, fov: 50 },
    actors: { kha: { p: [-1.0, 2.4], look: 'zinho', a: 'point', e: 'smug' }, zinho: { p: [0.6, 2.0], look: 'kha', a: 'idle', e: 'flat' } } }),
  S({ who: 'ZINHO', text: 'Majestade, eu vim trabalhar. Não vim ver cobra.', set: 'egypt', tod: 'desert', min: 1.5,
    cam: { at: 'zinho', d: 3.0, yaw: 40, h: 0.1, push: 0.15, fov: 50 },
    actors: { kha: { p: [-1.0, 2.4], look: 'zinho', a: 'idle', e: 'smug' }, zinho: { p: [0.6, 2.0], look: 'kha', a: 'shrug', e: 'worried' } } }),

  // ── O TRABALHO ──
  S({ who: 'NAR', text: 'Primeiro emprego: puxar um bloco de duas toneladas e meia.', set: 'egypt', tod: 'desert', hud: E(1, '40%'), shake: 0.02,
    cam: { pos: [4.6, 1.9, 2.8], look: [1.2, 0.9, -1.6], pos2: [4.0, 1.8, 2.2], look2: [1.2, 0.9, -1.6], fov: 58 },
    actors: { zinho: { p: [1.0, -0.6], r: 180, a: 'angry', e: 'angry' }, nefer: { p: [2.0, -0.4], r: 180, a: 'angry', e: 'neutral' } }, sfx: [['thud', 0.4]] }),
  S({ who: 'NEFER', text: 'Novato, segura firme no pau e puxa com vontade.', set: 'egypt', tod: 'desert', hud: E(1, '60%'), min: 1.5,
    cam: { at: 'nefer', d: 3.4, yaw: 55, h: 0.1, push: 0.12, fov: 52 },
    actors: { zinho: { p: [1.0, -0.6], look: 'nefer', a: 'idle', e: 'neutral' }, nefer: { p: [2.0, -0.4], look: 'zinho', a: 'point', e: 'happy' } } }),
  S({ who: 'ZINHO', text: 'No quê?!', set: 'egypt', tod: 'desert', hud: E(1, '60%'), min: 1.2, shake: 0.03,
    cam: { at: 'zinho', d: 2.6, yaw: 20, h: 0.05, push: 0.25, fov: 48 },
    actors: { zinho: { p: [1.0, -0.6], look: 'nefer', a: 'shock', e: 'shock' } }, sfx: [['glitch', 0.1]] }),
  S({ who: 'NEFER', text: 'No pau da alavanca, menino! Que cabeça suja.', set: 'egypt', tod: 'desert', hud: E(1, '60%'), min: 1.6,
    cam: { at: 'nefer', d: 3.2, yaw: 45, h: 0.1, push: 0.12, fov: 52 },
    actors: { zinho: { p: [1.0, -0.6], look: 'nefer', a: 'idle', e: 'flat' }, nefer: { p: [2.0, -0.4], look: 'zinho', a: 'angry', e: 'angry', prop: 'spear' } } }),

  // ── O TRUQUE (fato real) ──
  S({ who: 'NAR', text: 'O segredo era molhar a areia. Molhada, ela tem menos atrito e o trenó escorrega fácil. Cientistas testaram.', set: 'egypt', tod: 'desert', hud: E(1, '30%'), music: 'wonder',
    cam: { pos: [4.6, 1.9, 2.8], look: [1.2, 0.9, -1.6], pos2: [4.0, 1.8, 2.2], look2: [1.2, 0.9, -1.6], fov: 58 },
    actors: { zinho: { p: [1.0, -0.6], r: 180, a: 'cheer', e: 'happy' }, nefer: { p: [2.0, -0.4], r: 180, a: 'hold', e: 'smug', prop: 'cup' } }, card: { t: 'FATO REAL', s: 'Areia molhada reduz o atrito do trenó', at: 0.3 }, sfx: [['rain', 0.15, 0.3], ['sparkle', 0.5]] }),
  S({ who: 'ZINHO', text: 'Então molhando, entra mais fácil?', set: 'egypt', tod: 'desert', hud: E(1, '30%'), min: 1.4,
    cam: { at: 'zinho', d: 2.8, yaw: 10, h: 0.05, push: 0.15, fov: 50 },
    actors: { zinho: { p: [1.0, -0.6], r: 160, a: 'point', e: 'smug' } } }),
  S({ who: 'NEFER', text: 'O bloco, Zinho. O bloco entra no lugar.', set: 'egypt', tod: 'desert', hud: E(1, '30%'), min: 1.5,
    cam: { at: 'nefer', d: 3.2, yaw: 50, h: 0.1, push: 0.12, fov: 52 },
    actors: { zinho: { p: [1.0, -0.6], look: 'nefer', a: 'idle', e: 'happy' }, nefer: { p: [2.0, -0.4], look: 'zinho', a: 'shrug', e: 'flat' } } }),

  // ── PAGAMENTO + PERGUNTA ──
  S({ who: 'NAR', text: 'E não, não eram escravos. Eram trabalhadores pagos. Com comida. Você trabalharia por pão?', set: 'egypt', tod: 'dusk', hud: E(1, '80%'), music: 'happy',
    cam: { at: 'nefer', d: 3.4, yaw: 30, h: 0.15, push: 0.15, fov: 52 },
    actors: { zinho: { p: [-0.8, 1.2], look: 'nefer', a: 'idle', e: 'shock' }, nefer: { p: [0.8, 1.0], look: 'zinho', a: 'hold', e: 'happy', prop: 'bread' } }, card: { t: 'FATO REAL', s: 'Trabalhadores pagos, sobretudo em comida', at: 0.3 }, sfx: [['ding', 0.9, 0.5]] }),
  S({ who: 'ZINHO', text: 'Doze horas segurando pau, por dez pães. Igualzinho a hoje.', set: 'egypt', tod: 'dusk', hud: E(1, '100%'), min: 1.6,
    cam: { at: 'zinho', d: 2.7, yaw: 20, h: 0.05, push: 0.15, fov: 50 },
    actors: { zinho: { p: [-0.8, 1.2], look: 'nefer', a: 'hold', e: 'smug', prop: 'bread' } } }),

  // ── FINAL ──
  S({ who: 'NAR', text: 'Comenta COBRA se você também pensou besteira no começo.', set: 'egypt', tod: 'dusk', hud: E(1, '100%'), min: 2.6, music: 'wonder',
    cam: { pos: [0.2, 1.5, 7.6], look: [0.1, 2.2, 0], fov: 60 },
    actors: { zinho: { p: [-1.0, 3.4], r: 0, a: 'wave', e: 'happy', prop: 'bread' }, kha: { p: [0.2, 3.0], r: 0, a: 'idle', e: 'smug' }, nefer: { p: [1.3, 3.2], r: -10, a: 'wave', e: 'happy' } },
    endcard: 'comment', endcardText: 'Comenta “COBRA” ↓' }),
];

export const meta = {
  kind: 'short',
  title: 'O faraó me mostrou a cobra dele 🐍😳 #shorts',
  description: 'O Zinho acordou no Egito Antigo… e o primeiro dia de trabalho foi cheio de mal-entendidos. 😳 No fim, você ainda aprende o truque real que ajudava a mover os blocos das pirâmides e quem construiu tudo de verdade. 🏺\n\nComenta COBRA se você também pensou besteira 👇\n\n#zinhoosortudo #ese #egito #faraó #shorts\n\nAnimação original feita com ajuda de IA (vozes e produção).',
  tags: ['zinho o sortudo', 'e se', 'egito antigo', 'faraó', 'pirâmides', 'humor', 'duplo sentido', 'curiosidades', 'animação 3d', 'shorts'],
  categoryId: '23',
};
