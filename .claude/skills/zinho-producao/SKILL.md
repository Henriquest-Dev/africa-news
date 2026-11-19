---
name: zinho-producao
description: Produzir Shorts do canal "Zinho, o Sortudo" (animação 3D estilo Roblox) — roteiro viral, cenários, personagens, assets do dono do canal, render e upload. Usar sempre que a tarefa for criar, rever ou publicar um vídeo do Zinho.
---

# Produção do Zinho — o que o motor sabe fazer

Manual completo: `zinho-o-sortudo/automation/PLAYBOOK.md` (calendário, segredos, passos, limites). Este ficheiro é o
resumo de **tudo o que existe para usar**, para cada vídeo aproveitar o universo inteiro e não repetir sempre o mesmo.

## Regras virais (aprovadas em 18/11/2026)
- 30–55 s. 1.º quadro = imagem mais forte + `card: { t, s, at: 0, top: true }` com a promessa.
- Corte a cada ~2 s, câmara sempre a mexer (`pos`→`pos2`, `push`). Legendas com `capY: '37%'`.
- Pedido de comentário de uma palavra até ao 3.º plano.
- Final em loop: última frase leva à primeira; último plano termina no enquadramento do primeiro; sem cartão final.
- Formatos que funcionam: **escolha** (portas/caixas/botões 1-2-3), **"seu mês define…"**, **gancho de duplo sentido**,
  **terror curto em loop** (porta proibida). Repetir o formato que estiver a ganhar.
- 1.º plano sempre com `hq: true, blocky: true` e música `music: 'file:assets/music/fundo.mp3'`, `musicGain: 0.2–0.24`.

## Personagens (WHO → nome no motor)
- **Noob R6** (`body: 'r6'`, braços em duas partes): `ZINHO` (casaco preto, camisa azul), `BETO` (roxo, óculos),
  `DUDU` (laranja, cabelo castanho).
- **R15** (corpo liso do dono do canal): `MAE` (Dona Neide, vestido amarelo, lenço), `LIA` (rosa, rabo de cavalo),
  `JUCA` (Seu Juca, colete, bengala), `PROF` (professora), `ROSA` (padeira), `TONHO` (mercadinho), `KAKA` (amiga),
  `UGO` (homem das cavernas), `NAR` (narrador, sem corpo).
- **Criatura**: `SORRISO` (`sorriso`) — alta, escura, braços compridos, olhos brancos inclinados, sorriso com dentes.
- Todas as vozes estão em `tools/tts.py` (Gemini com quota grátis; `--provider edge` quando acabar).
- Personagem novo: acrescentar em `CHARS` (`web/scene.js`) com `skin/shirt/jacket/dress/vest/pants/shoes/hair/...`
  e `body: 'r6'` se for Noob; registar em `WHO` e nas tabelas de voz.

## Poses (`a:`) — todas com cotovelos animados
`idle talk wave cheer shock angry hold point shrug reach hug sign threat swordup slash guard kick kickfall trip
sit sitfloor sitbed headdown lie walk run creep`. Expressões (`e:`): `neutral happy smug worried angry shock flat
closed tired sad`. Adereços (`prop:`): `sword` (espada de cristal), `chinelo`, `bread`, `phone`, `cup`, `cake`,
`sandwich`, `icecream`, `torch`, `spear`, `radio`, `goldbar`, `notebook`, `berries`, `cane`.
Andar/correr: `p: [x, z], to: [x, z], a: 'walk'|'run'`.

## Cenários (`set:`)
- `praca` — **cidade do Zinho**: fonte de três andares em (0,0), lojas a norte (PADARIA DA ROSA, ESCOLA, SORVETERIA,
  MERCADINHO DO TONHO, z≈-17) e a sul (LAN HOUSE, z≈17), postes de lanterna nos 4 caminhos, bancos, baú do tesouro
  em (6.8, -9.4), **três baús numerados** para vídeos de escolha em (-1.9|0|1.9, 5.2) (`fx.chests = { open: n, at, opened: [n…] }`,
  modelo `episodes/short-13-baus.js`), portal de pedra em (0, 31), portal "BAIRRO DO ZINHO" em x=-30, riacho com ponte curva e cercas em
  x=33, **porta proibida** em (-22, -12) (`fx.door = { chains: 0–3, open: 0..1|[de,até], knock: true }`).
  Exemplos de câmara: `episodes/teste-praca.js`, `episodes/short-12-porta-proibida.js`.
- `street` — rua das casas (casa amarela do Zinho em x=0, z=-9), árvores e penhascos atrás.
- `wild` — campo/floresta: fogueira em (-5,-7), baú em (7,-14), rochas, fetos, erva, penhascos.
- `kitchen`, `bedroom`, `classroom`, `cave`, `egypt` — interiores e temas antigos.
- `domain` — palco vazio com `domain.deco`: `doors` (3 portas numeradas, `open`/`opened`), `void temple volcano
  hands beach shadow swords slot court moon sphere womb`.
- Horas (`tod:`): `day dusk night dawn indoor indoorNight horror` (terror: nevoeiro, postes a piscar).

## Efeitos úteis (`fx:`)
`giant` (gigante de pedra: `p, to, s, r, raise, up, bow, rock, held, throw, eye`), `blackout` (apagão),
`door` (porta proibida), `meteorGlow`, `card` (texto grande), `shake`, `sfx: [['boom'|'thud'|'whoosh'|'clang'|
'ding'|'bonk'|'sparkle'|'powerdown', t]]`.

## Assets do dono do canal (em `assets/models/`, fora do git)
- `r15.obj` (corpo R15), `noob.glb` (referência do Noob), `sword.obj` + `sword_diffuse.png`.
- Forest Pack: `trees.fbx`, `rocks.fbx`, `cliffs.fbx` (pintados por altura).
- Lobby: `lobby/*.glb` — `lamp chest portal rock fountain tree pine fence bridge bench campfire hedge fern pebbles grass`
  (escala ~0.3; já espalhados na praça, rua e campo por `loadModels()` em `web/scene.js`).
- Se faltar a pasta, o motor cai para os modelos próprios. **Nunca usar** o busto de pessoa real
  (`Davidbaszucki…fbx`). O `.rbxl` do Chest Simulator só serve se o dono o exportar como OBJ no Roblox Studio.

## Fluxo
`node tools/export-story.mjs episodes/<ep>.js && python3 tools/tts.py && python3 tools/build_audio.py`, folha de
pré-visualização (`node tools/render.mjs --w 540 --h 960 --preview t1,t2,…`), corrigir câmaras, render final em
segundo plano com limite de 2 h, `tools/youtube_upload.py … --publish-at`, post da comunidade, `topics.json`, commit.
