// Short vertical (~55 s) — "E se você vivesse um dia no Egito Antigo?"
// Fatos: a Grande Pirâmide tem ~4.500 anos e cerca de 2,3 milhões de blocos; foi erguida por trabalhadores
// pagos (sobretudo em comida); os blocos iam em trenós e molhar a areia diminuía o atrito; foi a construção
// humana mais alta do mundo por cerca de 3.800 anos. Render: --w 1080 --h 1920

const S = (o) => ({ style2: true, cap: true, pad: -0.15, ...o });
const E = (d, v) => ['caos', d, v, 'CANSAÇO'];

export default [
  // ── GANCHO ──
  S({ who: 'ZINHO', text: 'Eu acordei há quatro mil e quinhentos anos. No Egito. E me deram o pior emprego do mundo.', set: 'egypt', tod: 'desert',
    music: 'mystery', musicGain: 0.12, duck: 0.72, voiceSpeed: 1.25, lead: 0.03, tail: 0.08,
    cam: { at: 'zinho', d: 2.6, yaw: 15, h: 0.2, push: 0.3, fov: 54 },
    actors: { zinho: { p: [0, 2], r: 0, a: 'talk', e: 'shock' } }, sfx: [['whoosh', 0.02, 0.6]] }),

  S({ who: 'NAR', text: 'Na frente dele, uma pirâmide pela metade. E um trabalhador chamado Nefer.', set: 'egypt', tod: 'desert', hud: E(1, '10%'), stamp: 'EGITO, 2560 a.C.',
    cam: { pos: [3.5, 1.4, 7], look: [0, 4, -18], pos2: [3.0, 1.3, 6.2], look2: [0, 5, -18], fov: 60 },
    actors: { zinho: { p: [0, 2], r: 180, a: 'shock', e: 'shock' }, nefer: { p: [1.6, 1.4], look: 'zinho', a: 'wave', e: 'happy' } }, sfx: [['stamp', 0.02]] }),
  S({ who: 'NEFER', text: 'Você é o novo? Ótimo. Pega a corda.', set: 'egypt', tod: 'desert', hud: E(1, '20%'), min: 1.5,
    cam: { at: 'nefer', d: 2.4, yaw: -30, h: 0.1, push: 0.15, fov: 52 },
    actors: { zinho: { p: [0, 2], look: 'nefer', a: 'idle', e: 'worried' }, nefer: { p: [1.6, 1.4], look: 'zinho', a: 'point', e: 'happy' } } }),

  // ── O BLOCO ──
  S({ who: 'NAR', text: 'Cada bloco pesava, em média, umas duas toneladas e meia. E a pirâmide tinha mais de dois milhões deles.', set: 'egypt', tod: 'desert', hud: E(1, '60%'), shake: 0.02,
    cam: { pos: [4.6, 1.9, 2.8], look: [1.2, 0.9, -1.6], pos2: [4.0, 1.8, 2.2], look2: [1.2, 0.9, -1.6], fov: 58 },
    actors: { zinho: { p: [1.0, -0.6], r: 180, a: 'angry', e: 'angry' }, nefer: { p: [2.0, -0.4], r: 180, a: 'angry', e: 'neutral' } }, card: { t: '2,3 MILHÕES', s: 'de blocos na Grande Pirâmide', at: 0.45 }, sfx: [['thud', 0.4]] }),
  S({ who: 'ZINHO', text: 'Não mexe nem um centímetro! Isso é impossível!', set: 'egypt', tod: 'desert', hud: E(1, '90%'), min: 1.5,
    cam: { at: 'zinho', d: 2.0, yaw: 30, h: 0.1, push: 0.15, fov: 52 },
    actors: { zinho: { p: [1.0, -0.6], r: 180, a: 'angry', e: 'angry' } } }),

  // ── O TRUQUE ──
  S({ who: 'NEFER', text: 'Calma. Primeiro, molha a areia.', set: 'egypt', tod: 'desert', hud: E(1, '90%'), min: 1.4,
    cam: { at: 'nefer', d: 2.6, yaw: 55, h: 0.1, push: 0.12, fov: 52 },
    actors: { zinho: { p: [1.0, -0.6], look: 'nefer', a: 'idle', e: 'flat' }, nefer: { p: [2.0, -0.4], look: 'zinho', a: 'hold', e: 'smug', prop: 'cup' } }, sfx: [['rain', 0.4, 0.3]] }),
  S({ who: 'NAR', text: 'E funciona. Areia molhada diminui o atrito, e o trenó desliza bem mais fácil. Cientistas testaram isso de verdade.', set: 'egypt', tod: 'desert', hud: E(1, '40%'), music: 'wonder',
    cam: { pos: [4.6, 1.9, 2.8], look: [1.2, 0.9, -1.6], pos2: [4.0, 1.8, 2.2], look2: [1.2, 0.9, -1.6], fov: 58 },
    actors: { zinho: { p: [1.0, -0.6], r: 180, a: 'cheer', e: 'happy' }, nefer: { p: [2.0, -0.4], r: 180, a: 'cheer', e: 'happy' } }, card: { t: 'FATO REAL', s: 'Areia molhada reduz o atrito do trenó', at: 0.3 }, sfx: [['sparkle', 0.3]] }),
  S({ who: 'ZINHO', text: 'Isso não é magia. Isso é física!', set: 'egypt', tod: 'desert', hud: E(1, '40%'), min: 1.4,
    cam: { at: 'zinho', d: 1.9, yaw: 10, h: 0.05, push: 0.15, fov: 50 },
    actors: { zinho: { p: [1.0, -0.6], r: 160, a: 'point', e: 'happy' } } }),

  // ── PERGUNTA ──
  S({ who: 'NAR', text: 'Pergunta: você acha que as pirâmides foram feitas por escravos? Responde aí antes de ver o final.', set: 'egypt', tod: 'desert', hud: E(1, '50%'), music: 'mystery',
    cam: { at: 'zinho', d: 2.2, yaw: 0, h: 0.15, push: 0.2, fov: 52 },
    actors: { zinho: { p: [0, 2], r: 0, a: 'shrug', e: 'worried' } }, sfx: [['ding', 0.85, 0.5]] }),

  // ── O PAGAMENTO ──
  S({ who: 'NAR', text: 'Pois é: segundo os arqueólogos, quem construiu as pirâmides foram trabalhadores pagos. E o salário vinha em comida.', set: 'egypt', tod: 'dusk', hud: E(1, '70%'), music: 'happy',
    cam: { at: 'nefer', d: 2.6, yaw: 30, h: 0.15, push: 0.15, fov: 52 },
    actors: { zinho: { p: [-0.8, 1.2], look: 'nefer', a: 'idle', e: 'shock' }, nefer: { p: [0.8, 1.0], look: 'zinho', a: 'hold', e: 'happy', prop: 'bread' } }, card: { t: 'FATO REAL', s: 'Trabalhadores pagos, sobretudo em comida', at: 0.35 } }),
  S({ who: 'NEFER', text: 'Seu pagamento de hoje. Dez pães.', set: 'egypt', tod: 'dusk', hud: E(1, '70%'), min: 1.4,
    cam: { at: 'nefer', d: 2.0, yaw: 35, h: 0.1, push: 0.12, fov: 50 },
    actors: { zinho: { p: [-0.8, 1.2], look: 'nefer', a: 'idle', e: 'flat' }, nefer: { p: [0.8, 1.0], look: 'zinho', a: 'reach', e: 'happy', prop: 'bread' } } }),
  S({ who: 'ZINHO', text: 'Doze horas de trabalho... por pão. É, igualzinho a hoje.', set: 'egypt', tod: 'dusk', hud: E(1, '100%'), min: 1.6,
    cam: { at: 'zinho', d: 1.8, yaw: 20, h: 0.05, push: 0.15, fov: 50 },
    actors: { zinho: { p: [-0.8, 1.2], look: 'nefer', a: 'hold', e: 'smug', prop: 'bread' } } }),

  // ── FINAL ──
  S({ who: 'NAR', text: 'A Grande Pirâmide foi a construção mais alta do mundo por uns três mil e oitocentos anos. Comenta PIRÂMIDE se você aguentaria um dia lá.', set: 'egypt', tod: 'dusk', hud: E(1, '100%'), min: 2.6, music: 'wonder',
    cam: { pos: [0.2, 1.5, 7.6], look: [0.1, 2.2, 0], fov: 60 },
    actors: { zinho: { p: [-0.6, 3.4], r: 0, a: 'wave', e: 'happy', prop: 'bread' }, nefer: { p: [0.9, 3.1], r: -10, a: 'wave', e: 'happy' } },
    endcard: 'comment', endcardText: 'Comenta “PIRÂMIDE” ↓' }),
];

export const meta = {
  kind: 'short',
  title: 'Trabalhei 1 dia construindo uma pirâmide 🏜️ e o salário foi pão #shorts',
  description: 'O Zinho acordou no Egito Antigo e foi direto puxar bloco de pedra na Grande Pirâmide. Descubra o truque da areia molhada e quem construiu as pirâmides de verdade. 🏺\n\nVocê aguentaria um dia lá? Comenta PIRÂMIDE 👇\n\n#zinhoosortudo #ese #egito #piramides #shorts\n\nAnimação original feita com ajuda de IA (vozes e produção).',
  tags: ['zinho o sortudo', 'e se', 'egito antigo', 'pirâmides', 'como construíram as pirâmides', 'história', 'curiosidades', 'animação 3d', 'shorts'],
  categoryId: '1',
};
