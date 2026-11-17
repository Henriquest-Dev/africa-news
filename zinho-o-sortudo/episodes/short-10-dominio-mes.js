// Short (~80 s, vertical, bonecos de blocos): "Seu mês de nascimento define sua expansão de domínio".
// Lista as expansões de domínio mostradas em Jujutsu Kaisen, uma por mês. Visual 100% original (personagens do canal,
// cenários de blocos próprios); só os nomes das técnicas e dos donos são citados. Trilha: assets/music/fundo.mp3.

const D = (o) => ({ style2: true, cap: true, pad: -0.15, set: 'domain', tod: 'night', capY: '37%', ...o });
const C = (who, e = 'smug', yaw = 15) => {          // câmara afastada: personagem em baixo, cenário do domínio atrás
  const r = yaw * Math.PI / 180, P = (d, y) => [+(Math.sin(r) * d).toFixed(2), y, +(Math.cos(r) * d).toFixed(2)];
  return { cam: { pos: P(5.6, 1.5), look: [0, 2.7, -6], pos2: P(4.6, 1.4), look2: [0, 2.4, -6], fov: 60 } };
};
const one = (who, a = 'sign', e = 'smug', extra = {}) => ({ [who]: { p: [0, 0], r: 0, a, e, ...extra } });
const M = (mes, nome, dono) => ({ card: { t: mes, s: `${nome} · ${dono}`, at: 0.02, top: true } });

export default [
  // ── GANCHO ──
  D({ who: 'NAR', text: 'Seu mês de nascimento define a sua expansão de domínio. Guarda o seu mês e espera ele aparecer.', hq: true, blocky: true,
    music: 'file:assets/music/fundo.mp3', musicGain: 0.2, duck: 0.6, voiceSpeed: 1.2, lead: 0.05, tail: 0.35, shake: 0.02,
    domain: { top: '#05030f', bot: '#2a1a5e', floor: '#120f22', line: '#b48cff', cube: '#7cc8ff', stars: true },
    cam: { at: 'zinho', d: 6.6, yaw: 20, h: 0.7, push: 0.4, fov: 56 },
    actors: { zinho: { p: [0, 0], r: 0, a: 'sign', e: 'angry' } }, sfx: [['whoosh', 0.05], ['boom', 0.3]], card: { t: 'EXPANSÃO DE DOMÍNIO', s: 'qual é o seu mês?', at: 0.1, top: true } }),

  D({ who: 'NAR', text: 'Janeiro: Vazio Infinito, do Gojo. Quem entra recebe informação infinita e fica travado no lugar.',
    domain: { deco: 'void', top: '#000005', bot: '#0c1030', floor: '#06060c', line: '#9fd4ff', cube: '#d79bff', stars: true },
    ...C('zinho'), actors: one('zinho', 'sign', 'smug'), ...M('JANEIRO', 'Vazio Infinito', 'Gojo'), sfx: [['whoosh', 0.05], ['sparkle', 0.4]] }),
  D({ who: 'NAR', text: 'Fevereiro: Santuário Malevolente, o Fukuma Mizushi do Sukuna. Ele não precisa de barreira. Corta tudo em volta.',
    domain: { deco: 'temple', top: '#1a0000', bot: '#7a0d0d', floor: '#2a0808', line: '#ff3b2f', cube: '#ff6a3d', light: '#ffb0a0' },
    ...C('beto', 'angry', -15), actors: one('beto', 'sign', 'angry'), ...M('FEVEREIRO', 'Santuário Malevolente', 'Sukuna'), shake: 0.03, sfx: [['whoosh', 0.05], ['clang', 0.5], ['clang', 0.7]] }),
  D({ who: 'NAR', text: 'Março: Caixão da Montanha de Ferro, do Jogo. Um vulcão por dentro. Quem fica lá, derrete.',
    domain: { deco: 'volcano', top: '#2a0a00', bot: '#b8420f', floor: '#2b1a14', line: '#ff8a2a', cube: '#ffb03b', light: '#ffc08a' },
    ...C('juca', 'angry', 20), actors: one('juca', 'sign', 'angry'), ...M('MARÇO', 'Caixão da Montanha de Ferro', 'Jogo'), sfx: [['whoosh', 0.05], ['boom', 0.5]] }),
  D({ who: 'NAR', text: 'Abril: Autoencarnação da Perfeição, do Mahito. Ele toca direto na sua alma e muda a forma do seu corpo.',
    domain: { deco: 'hands', top: '#0a0a12', bot: '#3d4152', floor: '#1c1d26', line: '#c9d1e8', cube: '#8d94a8' },
    ...C('lia', 'smug', -20), actors: one('lia', 'sign', 'smug'), ...M('ABRIL', 'Autoencarnação da Perfeição', 'Mahito'), sfx: [['whoosh', 0.05], ['sparkle', 0.5]] }),
  D({ who: 'NAR', text: 'Maio: Horizonte da Skandha Cativante, do Dagon. Uma praia sem fim, cheia de peixes que não param de atacar.',
    domain: { deco: 'beach', top: '#3a9be8', bot: '#bfe9ff', floor: '#e9cf8d', line: '#ffffff', cube: '#4dd0e1', light: '#fff4d8', cubes: false },
    ...C('ugo', 'happy', 20), actors: one('ugo', 'sign', 'happy'), ...M('MAIO', 'Horizonte da Skandha Cativante', 'Dagon'), sfx: [['whoosh', 0.05], ['ding', 0.6, 0.5]] }),
  D({ who: 'NAR', text: 'Junho: Jardim das Sombras Quiméricas, do Megumi. O chão vira sombra, e de cada sombra sai um bicho seu.',
    domain: { deco: 'shadow', top: '#000000', bot: '#101425', floor: '#05050a', line: '#3b4a7a', cube: '#24306a', stars: true },
    ...C('zinho', 'angry', -15), actors: one('zinho', 'sign', 'angry'), ...M('JUNHO', 'Jardim das Sombras Quiméricas', 'Megumi'), sfx: [['whoosh', 0.05], ['thud', 0.5]] }),
  D({ who: 'NAR', text: 'Julho: Amor Verdadeiro Mútuo, do Yuta. Um campo cheio de espadas, e cada espada guarda uma técnica copiada.',
    domain: { deco: 'swords', top: '#0a1030', bot: '#4a5fb0', floor: '#1b2140', line: '#9fb4ff', cube: '#cfe8ff', light: '#dfe8ff' },
    ...C('beto', 'smug', 20), actors: one('beto', 'swordup', 'smug', { prop: 'sword' }), ...M('JULHO', 'Amor Verdadeiro Mútuo', 'Yuta'), sfx: [['whoosh', 0.05], ['sparkle', 0.4], ['clang', 0.6]] }),
  D({ who: 'NAR', text: 'Agosto: Aposta Mortal Ociosa, do Hakari. Se ele tirar o jackpot, fica praticamente imortal por quatro minutos e onze segundos.',
    domain: { deco: 'slot', top: '#1a0820', bot: '#5a1a6a', floor: '#2a1030', line: '#ffe14d', cube: '#ff3b6b', light: '#ffe8c0' },
    ...C('prof', 'happy', -20), actors: one('prof', 'cheer', 'happy'), ...M('AGOSTO', 'Aposta Mortal Ociosa', 'Hakari'), sfx: [['whoosh', 0.05], ['ding', 0.5], ['ding', 0.65], ['ding', 0.8]] }),
  D({ who: 'NAR', text: 'Setembro: Sentença Mortal, do Higuruma. Vira um tribunal. Se você for condenado, perde a sua técnica.',
    domain: { deco: 'court', top: '#0d0a06', bot: '#3d2c18', floor: '#22180e', line: '#d9b13b', cube: '#d9b13b', light: '#ffe2b0' },
    ...C('juca', 'flat', 15), actors: one('juca', 'point', 'flat'), ...M('SETEMBRO', 'Sentença Mortal', 'Higuruma'), sfx: [['whoosh', 0.05], ['bonk', 0.6]] }),
  D({ who: 'NAR', text: 'Outubro: Profusão do Ventre, do Kenjaku. Quase ninguém viu como ela funciona. Misteriosa, igual a quem nasce em outubro.',
    domain: { deco: 'womb', top: '#12000a', bot: '#5a0f2e', floor: '#1e0812', line: '#ff2d6b', cube: '#ff6b9b', light: '#ffc0d4' },
    ...C('mae', 'smug', -15), actors: one('mae', 'sign', 'smug'), ...M('OUTUBRO', 'Profusão do Ventre', 'Kenjaku'), sfx: [['whoosh', 0.05], ['thud', 0.5]] }),
  D({ who: 'NAR', text: 'Novembro: Palácio Lunar das Células do Tempo, do Naoya. Ele obriga cada célula do seu corpo a seguir o ritmo dele.',
    domain: { deco: 'moon', top: '#000814', bot: '#1d2c55', floor: '#0e1424', line: '#fff2c4', cube: '#9fb8ff', stars: true },
    ...C('lia', 'angry', 20), actors: one('lia', 'sign', 'angry'), ...M('NOVEMBRO', 'Palácio Lunar das Células do Tempo', 'Naoya'), sfx: [['whoosh', 0.05], ['sparkle', 0.5]] }),
  D({ who: 'NAR', text: 'Dezembro: Aflição Tripla, da Yorozu, a feiticeira apaixonada pelo Sukuna. A arma final dela é uma esfera perfeita.',
    domain: { deco: 'sphere', top: '#14061e', bot: '#4a1f66', floor: '#1c0f26', line: '#d79bff', cube: '#f2f6ff', light: '#efe0ff' },
    ...C('mae', 'happy', 15), actors: one('mae', 'sign', 'happy'), ...M('DEZEMBRO', 'Aflição Tripla', 'Yorozu'), sfx: [['whoosh', 0.05], ['sparkle', 0.5]] }),

  // ── FINAL ──
  D({ who: 'ZINHO', text: 'Eu sou de janeiro. Vazio Infinito, ninguém me segura!', min: 2.4,
    domain: { deco: 'void', top: '#000005', bot: '#0c1030', floor: '#06060c', line: '#9fd4ff', cube: '#d79bff', stars: true },
    cam: { at: 'zinho', d: 5.4, yaw: -10, h: 0.6, push: 0.2, fov: 54 }, actors: one('zinho', 'cheer', 'happy') }),
  D({ who: 'NAR', text: 'E o seu, qual foi? Comenta o seu mês e a sua expansão aqui embaixo.', min: 3.4,
    domain: { top: '#05030f', bot: '#2a1a5e', floor: '#120f22', line: '#b48cff', cube: '#7cc8ff', stars: true },
    cam: { at: 'zinho', d: 6.5, yaw: 0, h: 0.6, push: 0.15, fov: 56 },
    actors: { zinho: { p: [0, 0], r: 0, a: 'point', e: 'happy' }, lia: { p: [-1.6, -0.6], r: 15, a: 'wave', e: 'happy' }, beto: { p: [1.6, -0.6], r: -15, a: 'cheer', e: 'happy' } },
    endcard: 'comment', endcardText: 'Comenta o seu MÊS ↓' }),
];

export const meta = {
  kind: 'short',
  title: 'Seu mês de nascimento define sua expansão de domínio 🤞 (Jujutsu Kaisen) - animação',
  description: 'Qual é a sua expansão de domínio? Procura o seu mês de nascimento e comenta aqui embaixo 👇\n\nJaneiro: Vazio Infinito\nFevereiro: Santuário Malevolente\nMarço: Caixão da Montanha de Ferro\nAbril: Autoencarnação da Perfeição\nMaio: Horizonte da Skandha Cativante\nJunho: Jardim das Sombras Quiméricas\nJulho: Amor Verdadeiro Mútuo\nAgosto: Aposta Mortal Ociosa\nSetembro: Sentença Mortal\nOutubro: Profusão do Ventre\nNovembro: Palácio Lunar das Células do Tempo\nDezembro: Aflição Tripla\n\n#jujutsukaisen #expansaodedominio #seumes #animação #zinhoosortudo #shorts\n\nAnimação original de fã, feita com ajuda de IA (vozes e produção). Jujutsu Kaisen pertence a Gege Akutami / Shueisha; este vídeo não tem ligação oficial com a obra.',
  tags: ['jujutsu kaisen', 'expansão de domínio', 'domain expansion', 'seu mês de nascimento', 'seu mês define', 'mês de nascimento', 'vazio infinito', 'santuário malevolente', 'fukuma mizushi', 'gojo', 'sukuna', 'jjk', 'anime', 'animação', 'animação de blocos', 'zinho o sortudo', 'shorts'],
  categoryId: '1',
};
