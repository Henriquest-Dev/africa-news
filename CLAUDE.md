# Produção de vídeos — Africa News

Este repositório é o estúdio de produção dos nossos vídeos curtos (Reels/TikTok/Shorts, 9:16).

## Ferramentas

- **Skills de motion** em `.claude/skills/` (repositório `Barty-Bart/motion-graphics`, MIT):
  `motion-broll`, `explainer-high-energy`, `explainer-default`, `explainer-engaging`,
  `sound-effects`, `object-separation`. Cada vídeo é uma página HTML que desenha qualquer
  frame a partir de um tempo `t`, renderizada para MP4 com Playwright + ffmpeg.
  No ambiente cloud o Chromium já está instalado: não correr `playwright install`.
- **Imagens**: servidor MCP Pollinations (`.mcp.json`), autenticado com a variável de
  ambiente `POLLINATIONS_API_KEY`. Sem chave o servidor responde 401.
- Ficheiros de trabalho (frames, renders intermédios) vão para o scratchpad, não para o repo.

## Guia de estilo (tirado da análise frame a frame de 3 vídeos de referência)

### Formato e ritmo
- 720×1280 (renderizar a 1080×1920), 24–30 fps, 27–32 s no total.
- Um plano novo a cada **1–2 s**; a legenda muda a cada **0,4–0,8 s** (1 a 3 palavras de cada vez).
- Estrutura fixa: **gancho (0–3 s)** → contexto → **viragem** ("but…", "quickly sparked backlash")
  → revelação/tese → **CTA** nos últimos 4–6 s.
- Áudio: narração + música + SFX misturados a **≈ −14 LUFS** integrados.

### Os três registos visuais de referência

1. **Colagem editorial escura** (vídeo do "aging"): fundo carmim/bordô (#5a0f14 → #2a0508)
   com vinheta pesada; recortes de imagens em **meio-tom/halftone** P&B; acentos em vermelho vivo
   (linhas tracejadas, cruzes riscadas, círculos desenhados à mão); tipografia **serif condensada
   bold** (estilo Bebas/Abril/Playfair Display Black) em creme. Objetos-símbolo (moedas, mealheiro,
   microscópio, coração, cosméticos) entram a voar com motion blur.
2. **Diorama fotográfico cinematográfico** (vídeo do Nolan): cada frase tem uma cena gerada por IA
   (corredor, palco com troféu, fachada de cinema retro, mesa de trabalho) com profundidade de campo
   rasa e figurantes desfocados em primeiro plano; legenda em **serif itálica fina branca**
   (estilo Instrument Serif/Playfair Italic) no centro, sem caixa; balões de reação pequenos ("i hate it").
3. **Documentário de arquivo** (vídeo da Hedy Lamarr): textura de papel/scanlines de TV, grão,
   fotos de arquivo colorizadas, esquemas de patentes ao fundo; alterna ecrãs **só-tipografia**
   (serif itálica preta sobre papel cinza) com imagens; elementos de UI (cursor de texto,
   seleção azul, etiquetas "Wi-Fi/Bluetooth/GPS") como gráficos.

### Regras comuns às três
- **Uma ideia por ecrã**, centrada; o texto é parte da composição, não uma legenda por baixo.
- **Palavra-chave em destaque**: maior, outra cor (vermelho/amarelo) ou com efeito
  (seleção de texto, sublinhado à mão, círculo desenhado).
- **Câmara sempre em movimento**: push-in lento (≈ 3–5 % por segundo) em cada imagem parada,
  pequenas derivas laterais; nada fica estático.
- **Transições com significado** em vez de cortes secos:
  - *wipe orgânico*: uma faixa curva (vermelha) atravessa o rosto e revela a imagem seguinte (~0,5 s);
  - *blur + mudança de grading*: desfoque rápido enquanto a cor passa de quente a fria (~0,3 s)
    para marcar a viragem emocional;
  - *objeto que transporta*: o objeto da cena A vira o objeto da cena B (torre desenhada →
    papel amarrotado → caixote do lixo);
  - *match cut* de forma/posição (rosto → rosto, torre → torre);
  - *glitch/RGB split* curto nos momentos de tensão.
- **Overlays de textura** por cima de tudo: grão, halftone, partículas/brilhos (✦), vinheta.
- **Palavra gigante como transição**: uma palavra-chave enorme ("story.") cobre o ecrã num frame
  de passagem.
- **CTA**: mockup de site num tablet/ecrã, barra de pesquisa a ser escrita, ou logótipo com
  o URL a aparecer letra a letra.

### Prompts de imagem (Pollinations)
Gerar em 9:16 e no mesmo estilo dentro de cada vídeo. Base de prompt por registo:
- Colagem: `halftone newspaper print cutout of <assunto>, black and white, high contrast,
  isolated on plain background, editorial collage`
- Diorama: `cinematic photo of <cena>, shallow depth of field, blurred people in foreground,
  soft film grain, 35mm, vertical composition`
- Arquivo: `colorized 1940s archival photograph of <assunto>, film grain, slight halftone`
