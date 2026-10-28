# 07 — E se a tua inteligência dobrasse todos os dias?

Vídeo longo para YouTube, num nicho novo: **animação de stickman**. 16:9, 1920×1080, 30 fps, **8:00**, narrado em português.

## Estilo (das referências enviadas)

- **Stickman:** cabeça redonda grande, olhos ovais com pupila em crescente e traço preto grosso, como na folha "25 Stick Figure Poses".
  O motor (`stick.js`) tem 29 poses: andar, correr, apontar, sentar, pensar, ler, telefone, apresentar, confuso, ouvir, braços cruzados, celebrar, levantar, empurrar, vénia, etc.
- **Expressões:** 21 expressões da folha "35 Expression Exercise", com pálpebras, sobrancelhas, boca, suor, lágrimas, estrelas e zzz.
  Os personagens piscam os olhos e respiram.
- **Animação:** 2D simples de storyboard. O traço "ferve" a 8 imagens por segundo, como desenho à mão, e as poses passam de uma para a outra com suavidade.
  A câmara aproxima-se devagar em cada frase.
- **Fundos:** 9 cenários desenhados a traço, gerados no MCP da Pollinations (`flux.1-schnell`): quarto, sala de aula, biblioteca, laboratório, rua, estúdio de TV, sala do governo, hospital e telhado.
  Os fundos de papel, espaço e cosmos são desenhados em código.
- **Estrutura visual:**
  - um cartão "DIA X / QI" no início de cada dia, com o QI a contar;
  - um HUD com o dia e o QI;
  - a cabeça do herói cresce com o QI e ganha uma aura a partir do dia 10.

## Roteiro (estrutura viral)

1. **Gancho (0–30 s):** "E se a tua inteligência dobrasse todos os dias? No dia 1, mais do que o Einstein. No dia 30, já não serias humano."
   Abre um loop: "Se te dessem um botão, carregavas? No fim vais perceber porque importa."
2. **Escalada, dia a dia:** dias 0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20, 25 e 30. Cada dia traz um ganho e um custo (solidão, medo das pessoas, o corpo a falhar).
3. **Clímax:** o dia 30 tem mais de 100 mil milhões de pontos de QI, mais do que os ~86 mil milhões de neurónios do cérebro. O herói sente saudades do dia 0.
4. **Viragem:** "Isto não vai acontecer. Mas existe uma versão real." O botão do início volta.
5. **Lição:** 1,01³⁶⁵ ≈ 37,8 e 0,99³⁶⁵ ≈ 0,03.
6. **CTA:** like, subscrever e "o que farias no dia 1?", para gerar comentários.

Factos: o QI do Einstein nunca foi medido (~160 é uma estimativa, e isso está escrito no ecrã). O cérebro tem ~2% do peso do corpo e gasta ~20% da energia. Há cerca de 86 mil milhões de neurónios.

## Narração

- Piper `pt_BR-faber-medium`, local e gratuito. Foi a voz portuguesa mais clara nos testes; a pt_PT trocava palavras.
- O texto está em português de Portugal (`narration/lines.txt`, 87 frases). Verifiquei-o frase a frase com o Whisper e reescrevi as que soavam mal.
- Como a voz tem sotaque do Brasil, podes **gravar a tua voz** por cima: `narration/script.txt` tem o texto por cena e `timeline.json` os tempos de cada frase.

## Som

Música lo-fi sintetizada (82 BPM), com o ambiente a mudar por secção: curioso, quente, solitário, tenso e maravilhado. Tem ducking por baixo da voz.
Os efeitos vêm do pacote `sound-packs/paper-cutout` e da skill: folhear nos cartões, "pop" em cada frase, ding nas ideias e toques de telefone.

## Título e tags (YouTube)

- **Título:** E Se a Tua Inteligência Dobrasse Todos os Dias?
- **Alternativa:** O Que Acontece Se Ficares 2x Mais Inteligente Por Dia Durante 30 Dias
- **Hashtags:** #esse #curiosidades #stickman #inteligencia #animacao
- **Tags:** e se, inteligência, qi, einstein, animação stickman, curiosidades, desenvolvimento pessoal, 1% melhor por dia, juros compostos, cérebro
