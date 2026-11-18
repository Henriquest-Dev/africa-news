# Automação do canal "Zinho, o Sortudo"

Este ficheiro é o manual que cada sessão automática (tarefa agendada) segue. Meta semanal:
**4 vídeos longos (~5 min) + 6 Shorts (30–60 s)**, sem custos: só o Claude Code e a API do YouTube.

## Calendário de publicação (ritmo atual, para poupar créditos)

**4 Shorts por semana: segunda, quarta, quinta e sábado, às 12h de Brasília (15:00 UTC).** Vídeos longos em pausa até o
dono do canal pedir para voltar. Cada Short: 30–55 s, regras na secção "Formato atual dos Shorts".

A sessão de produção corre segunda, quarta, quinta e sábado às 03:23 de Maputo (01:23 UTC) e prepara o Short desse dia
(upload privado com `publishAt` às 15:00 UTC).

## Formato atual dos Shorts (desde 18/11/2026, aprovado pelo dono do canal)

Análise de 18/11 (9 Shorts): os de ~55 s fizeram 2.200–3.300 views; os de ~1:30 ficaram em 1.200–1.700. O que
falhava: vídeos longos demais, 1.º quadro escuro/parado, um corte a cada ~6 s, formato a mudar toda a semana, poucos
vídeos e final sem loop. Regras novas (substituem as de 12/11 e as regras de duração/gancho mais abaixo):

- **Duração 30–55 s.** Nunca mais de 60 s.
- **1.º quadro = a imagem mais forte**, já em movimento, com texto grande no topo que diz a promessa
  (`card: { t, s, at: 0, top: true }` fica visível desde o 1.º quadro). Personagem grande no ecrã, cena clara.
- **Um corte a cada ~2 s** (15+ planos em 30–40 s), câmara sempre a mexer (`pos2`/`push`).
- **Pedido de comentário de uma palavra/número logo no início** (até ao 3.º plano), não só no fim.
- **Final em loop**: a última frase leva de volta à primeira, e o último plano termina no mesmo enquadramento do
  primeiro. Sem cartão final nos vídeos em loop.
- **Formatos que testamos agora** (manter o mesmo formato vários vídeos seguidos):
  1. **Escolha** ("Escolhe uma porta: 1, 2 ou 3") — modelo `episodes/short-11-portas.js`, cenário `set: 'domain'`
     com `domain.deco: 'doors'` (`open`, `opened`). Variações: caixas, botões, cartas, presentes, caminhos.
  2. **"Seu mês de nascimento define…"** — modelo `episodes/short-10-dominio-mes.js` (em versão curta: 6 meses
     por vídeo ou ritmo de ~2,5 s por mês).
  3. **Gancho de duplo sentido** (os 3 melhores do canal) — modelo `short-03-ugo-cidade.js`.
- **Visual de bonecos de blocos**: `hq: true, blocky: true` no 1.º plano; personagens do canal (Zinho, Dona Neide =
  `mae`, Beto, Lia, Seu Juca, `prof`, Ugo), gigante de pedra (`fx.giant`), espada, chinelo (`prop: 'chinelo'`,
  pose `threat`). Nada de modelos, logótipos ou personagens desenhados de terceiros (nomes de técnicas de anime
  podem ser citados, com aviso de vídeo de fã na descrição).
- **Proporções Roblox (R6)** desde 18/11: no modo `blocky` os personagens têm pernas do tamanho do tronco e cabeça pequena
  (`R6` em `web/scene.js`, medidas tiradas do rig Noob que o dono do canal mandou). Os grandes planos com `at:` mostram
  agora cabeça e tronco; para um rosto em grande, usar `d` 2.0–2.4.
- **Corpo R15** desde 18/11: com `assets/models/r15.obj` presente, todos os personagens em modo `blocky` usam o corpo R15
  (modelo sem textura do dono do canal) com as cores/roupas de cada um; sem o ficheiro, cai para os blocos R6.
- **Cenário `set: 'praca'`** (cidade do Zinho): praça redonda de pedra com fonte no centro (0,0), lojas a norte
  (z≈-17: PADARIA DA ROSA x-13, ESCOLA x-4.5, SORVETERIA x4.5, MERCADINHO DO TONHO x13) e a sul (z≈17, LAN HOUSE x4.5),
  bancos e postes à volta (raio ~9–12), portal "BAIRRO DO ZINHO" em x=-30, riacho e ponte de madeira em x=33,
  e a **porta proibida** (moldura escura, porta roxa a brilhar, correntes, placa "NÃO ABRA") em (-22, -12) — boa para
  histórias de mistério. Exemplo de câmaras em `episodes/teste-praca.js`.
- **NPCs do bairro** (com voz no `tts.py`): `ROSA` (Dona Rosa, padeira), `TONHO` (Seu Tonho, mercadinho), `DUDU` e `KAKA`
  (amigos do Zinho), além da turma de sempre (ZINHO, MAE, BETO, LIA, JUCA, PROF).
- **Modelos externos** em `assets/models/` (fora do git, dados pelo dono do canal): `sword.obj` + `sword_diffuse.png`
  (espada de cristal, substitui a espada de caixas) e Forest Pack (`trees.fbx`, `rocks.fbx`, `cliffs.fbx`) pintado por
  altura, espalhado na rua (atrás das casas e no horizonte) e no campo (`set: 'wild'`). Se a pasta faltar, o motor usa
  os modelos próprios. NÃO usar: o busto de pessoa real, o mapa .rbxl de outro jogo nem as peças do pacote pago dentro
  do Lobby.
- **Música**: `music: 'file:assets/music/fundo.mp3'`, `musicGain: 0.2`, `duck: 0.6` (ficheiro fora do repositório;
  se faltar, usar a música do motor e avisar). Voz: `voiceSpeed` 1.1–1.2.
- **Título** curto com a promessa e 1 emoji; tags descritivas do formato (ver `short-11-portas.js`), `categoryId: '1'`.
- **Câmaras**: ver sempre uma folha de quadros (`render --preview`) antes do render final; legenda com `capY: '37%'`
  para não tapar caras quando o personagem está em baixo.
- Render de ~40 s leva ~40 min; correr em segundo plano com limite de 2 h (retoma dos quadros guardados).

## Segredos (nunca no repositório)

Na sessão principal ficam em `ytenv.sh` na pasta de rascunho (scratchpad) da sessão — basta `. <scratchpad>/ytenv.sh`.
Em sessões novas, vêm das variáveis de ambiente da nuvem:

- `IMG_API_KEY` — imagens das thumbnails (Pollinations, modelo grátis)
- `GEMINI_API_KEY` — vozes Gemini (grátis: 10 pedidos/dia/modelo; o modo em lote gasta 1 pedido por personagem)
- `YT_CLIENT_ID`, `YT_CLIENT_SECRET`, `YT_REFRESH_TOKEN` — upload para o YouTube (ver "Configuração única")

Se faltar a chave do Gemini ou a quota acabar, `tools/tts.py` usa as vozes grátis da Microsoft.
Se faltarem as credenciais do YouTube, a sessão não renderiza (o contentor é temporário e o vídeo
perder-se-ia): faz commit só do roteiro e termina com um relatório a dizer o que falta configurar.

## Passos de cada sessão de produção

1. **Preparar o ambiente**: `cd zinho-o-sortudo && npm install && pip install edge-tts numpy scipy`.
2. **Ver o que publica hoje** (tabela acima, em UTC) e, para cada vídeo, escolher o primeiro tema
   `pendente` do tipo certo em `automation/topics.json`.
   Se um tema em `topics.json` tem `publish_at` para hoje (status `roteiro pronto`), usar esse roteiro (`episodio`) em vez
   de escrever outro: saltar o passo 3 e seguir do passo 4. Cada vídeo só é produzido e enviado no dia em que publica.
3. **Escrever o roteiro** em `episodes/<AAAA-MM-DD>-<slug>.js`, copiando a estrutura de um episódio existente
   (longo: `02-ouro.js`; Short: `short-02-7dias.js`) e exportando também `meta`:
   ```js
   export const meta = { kind: 'long' | 'short', title: '…', description: '…', tags: ['…', '…', '…'],
                         thumb: { t: 12.5, lines: 'E SE A SUA|ALTURA|DOBRASSE?', accent: 1, badge: 'DIA 10' } };
   ```
   Regras do roteiro:
   - **Gancho de duplo sentido** (pedido do dono do canal, é o que mais viraliza): 1.ª frase com uma palavra de duplo
     sentido do português do Brasil que depois se revela inocente (ex.: "o faraó me mostrou a cobra dele" → a cobra da
     coroa), e 2–3 piadas leves de duplo sentido ao longo do vídeo. Sem palavrão nem nada explícito. Palavra-chave
     de comentário ligada ao gancho. Renderizar com `hq: true` no 1.º plano (gráficos melhores).
   - **Original**: personagens do canal (Zinho, Dona Neide, Beto, Lia, Seu Juca, professora, Ugo, Kika, a gata Sombra),
     nunca personagens, músicas, letras ou textos de terceiros.
   - **Longo (~5 min, 55–70 planos)**: gancho nos primeiros 5 s, contador no canto (HUD) que escala, carimbos "DIA N",
     um gancho de retenção a meio ("espera até o dia…"), virada no fim e pergunta para os comentários.
   - **Short (30–60 s, vertical)**: `style2: true, cap: true` em todos os planos, gancho com promessa aberta no
     1.º segundo, cortes de 2–3 s, uma pergunta ao público e pedido de comentário com palavra-chave.
   - Factos (história, ciência) têm de estar corretos.
   - Variar temas e cenários; reutilizar cenários existentes e só criar novos em `web/scene.js` quando o tema exigir.
4. **Gerar**: `node tools/export-story.mjs episodes/<ficheiro>.js && python3 tools/tts.py && python3 tools/build_audio.py`.
   Ajustar duração (Short: `voiceSpeed`, `lead`, `tail`, `min`) até caber no alvo.
5. **Rever**: pré-visualizar um quadro a 60% de cada plano (`node tools/render.mjs --preview …`, Shorts com
   `--w 1080 --h 1920`), juntar numa folha de contacto com ffmpeg, olhar e corrigir câmaras dentro de paredes,
   cabeças a tapar caras, textos fora do ecrã.
6. **Renderizar**: longo `node tools/render.mjs --workers 4`; Short `node tools/render.mjs --w 1080 --h 1920 --workers 4`.
   O render é retomável: se a tarefa em segundo plano parar (limite de 2 h), voltar a lançar o mesmo comando.
7. **Thumbnail** (só longos), no estilo do canal de referência: 3 painéis lado a lado, cada um com um número/rótulo
   ENORME no topo: sempre o DIA (ex.: `DIA 1 | DIA 5 | DIA 10`), e cada painel mostra EXATAMENTE o acontecimento
   desse dia no roteiro (ler os carimbos `DIA N` do episódio e escolher 3 momentos visuais: começo, meio e clímax).
   Cada painel é uma imagem gerada pelo modelo GRÁTIS da Pollinations, com o render do Zinho dos vídeos como
   referência (assets/zinho-referencia.jpg), para o personagem 2D sair fiel (a descrição fixa do Zinho e do estilo já
   vai em todos os pedidos; o objeto/situação tem de ficar colado ao Zinho para não se perder no corte):
   `python3 tools/pollinations_image.py "<cena do painel>" --out out/thumbai/<ep>-a.jpg --seed <n>` (×3), depois
   `node tools/thumb-compose.mjs --panels "out/thumbai/<ep>-a.jpg:<rótulo>|…" --accent 2 --out out/thumb-<ep>.jpg`.
   Ver o resultado; se um painel não mostrar a situação, gerar de novo com outro seed. Precisa de IMG_API_KEY (ytenv.sh).
8. **Upload agendado**: `python3 tools/youtube_upload.py out/zinho-<ep>.mp4 build/<ep>/meta.json --thumb out/thumb-<ep>.jpg --publish-at <ISO UTC>`.
8b. **Post da comunidade** (todos os vídeos novos, longos e Shorts; nunca para os já publicados). A API do YouTube
   NÃO permite publicar posts na aba Comunidade, por isso o post é escrito aqui e entregue ao dono do canal no
   relatório, pronto a copiar, para ele publicar quando o vídeo estrear. Guardar em `out/post-<ep>.txt` com:
   - 1.ª linha: título chamativo, curto, com 1–2 emojis (ex.: "🦖 Um T. rex no ponto de ônibus?!");
   - 2–3 linhas de descrição chamativa, com curiosidade/pergunta que puxe comentário (sem spoiler do final);
   - linha de hashtags, TODAS em minúsculas e sem acentos/espaços (ex.: `#zinhoosortudo #ese #dinossauros #shorts`);
   - última linha: "▶️ Assiste aqui: https://youtu.be/<video_id>".
   Português do Brasil, original, nunca copiar textos de outros canais.
9. **Registar**: marcar o tema como `feito` em `topics.json` com `video_id`, fazer commit do episódio e do
   `topics.json` e push no ramo indicado pela sessão.
10. **Relatório final**: título, link, hora agendada e qualquer problema (quota, upload privado, etc.).

## Limites e cuidados

- Projetos da API do YouTube por auditar: os uploads ficam **privados** até a auditoria (formulário grátis
  "YouTube API Services – Audit and Quota Extension"). Até lá, o dono do canal publica à mão no YouTube Studio.
- Quota grátis do YouTube: 10 000 unidades/dia; cada upload + thumbnail custa ~1 650 → até 6 vídeos/dia.
- Thumbnails personalizadas exigem canal verificado por telefone.
- Marcar sempre como conteúdo sintético (`containsSyntheticMedia`, já feito pelo script).
- O YouTube desmonetiza conteúdo repetitivo/produzido em massa: cada vídeo precisa de história própria.
