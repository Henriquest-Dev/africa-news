# 08 — E se ficasses 11 dias sem dormir?

Stickman 16:9, 1920×1080, 30 fps, **5:00**, **sem narração**: a voz é gravada à parte no ElevenLabs.

## Imagens

Todas geradas com IA no MCP da Pollinations, no modelo **`community/scriptsnsenses-sys/flux-2-dev-free`** (gratuito, limite de 8 pedidos por minuto).
- **Pose A de cada cena:** gerada com as tuas folhas como referência (25 poses e 35 expressões). O modelo copia o traço, a cabeça redonda e as caras.
- **Pose B:** é uma *edição* da pose A. O cenário fica igual e só mudam a pose e a expressão.
- O vídeo alterna A e B (animação pose-a-pose). O traço "treme" a 8 imagens por segundo e a câmara entra devagar.
- 39 cenas × 2 = 78 desenhos. Estão em `frames/` (já em 16:9) e `desenhos-originais/` (como saíram do modelo).
- `gen_all.py` gera tudo outra vez a partir de `scenes.txt`, que tem o texto, a pose A e a pose B de cada cena.

## Narração (ElevenLabs)

- `narracao_elevenlabs.txt`: o texto todo, por capítulos. Os títulos entre [ ] são os cartões no ecrã e **não se leem**.
- `narracao_tempos.srt`: o momento em que cada frase deve começar no vídeo, calculado a 2,4 palavras por segundo.
- **Para sincronizar:**
  - gera a voz no ElevenLabs a um ritmo normal;
  - ou envia-me o áudio, que eu ajusto os tempos das cenas à tua voz (com o Whisper) e volto a renderizar.

## Factos

- **Randy Gardner,** 17 anos, San Diego, 1964, feira de ciências: cerca de 264 horas acordado (~11 dias).
- Acompanhado por amigos e por William Dement, investigador do sono da Universidade de Stanford.
- O sinal de trânsito confundido com uma pessoa e o "jogador de futebol americano" aparecem como "conta-se", porque são relatos.
- Depois do recorde dormiu ~14 horas. O Guinness já não regista recordes de privação de sono.
- 17–19 horas acordado ≈ reflexos de quem bebeu (Williamson & Feyer, 2000). Os adultos precisam de 7–9 horas de sono.

## YouTube

- **Título:** E Se Ficasses 11 Dias Sem Dormir?
- **Tags:** sem dormir, privação de sono, randy gardner, e se, curiosidades, stickman, animação, cérebro, sono
