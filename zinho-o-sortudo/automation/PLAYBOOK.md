# Automação do canal "Zinho, o Sortudo"

Este ficheiro é o manual que cada sessão automática (tarefa agendada) segue. Meta semanal:
**4 vídeos longos (~5 min) + 6 Shorts (30–60 s)**, sem custos: só o Claude Code e a API do YouTube.

## Calendário de publicação (hora de Brasília; Maputo = +5 h)

| Dia | Longo (16h BRT = 19:00 UTC) | Short (12h BRT = 15:00 UTC) |
|---|---|---|
| Segunda | ✅ | ✅ |
| Terça | — | ✅ |
| Quarta | ✅ | ✅ |
| Quinta | — | ✅ |
| Sexta | ✅ | ✅ |
| Sábado | — | ✅ |
| Domingo | ✅ | — |

A sessão de produção corre todos os dias às 03:23 de Maputo (01:23 UTC) e prepara **o que publica nesse mesmo dia**
(upload privado com `publishAt`, ou seja, publicação agendada para as 15:00 UTC — Short — e 19:00 UTC — longo).

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
