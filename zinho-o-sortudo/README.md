# Zinho, o Sortudo — gerador de episódios animados

Pipeline que transforma um roteiro (`episodes/*.js`) num vídeo 3D animado em 1080p, no estilo
"E se X dobrasse todo dia?": personagens low-poly com contorno preto, contador de dias no canto,
carimbos "DIA N", narração e vozes diferentes para cada personagem.

Episódios (em `episodes/`):
- `01-azar.js` — "E se o seu AZAR dobrasse todo dia?" (~5:17)
- `02-ouro.js` — "E se tudo que você tocasse virasse ouro?" (~4:49)
- `03-ultimo.js` — "E se você fosse a última pessoa do mundo?" (10:00, versão cinematográfica)

## Como gerar

```bash
npm install                      # three.js
pip install edge-tts numpy scipy # vozes gratuitas + mixagem
node tools/export-story.mjs episodes/02-ouro.js  # escolhe o episódio -> build/story.json
npm run tts                      # vozes -> build/voices/*.wav + build/lines.json
npm run audio                    # linha do tempo + trilha + efeitos -> build/timeline.json, build/mix.wav
npm run render                   # vídeo -> out/zinho-<episódio>.mp4
```

Pré-visualizar quadros soltos (segundos): `node tools/render.mjs --preview 10,95.5,270`
Renderizar só um trecho: `node tools/render.mjs --from 60 --to 75`

Precisa de Node 18+, Python 3, ffmpeg e Playwright com Chromium.

## Vozes

`tools/tts.py` escolhe o provedor automaticamente:

- **OpenRouter** (`openai/gpt-audio-mini`) quando `OPENROUTER_API_KEY` tem saldo
  (o OpenRouter exige pelo menos US$ 0,50 de saldo para gerar áudio). Cada personagem tem uma voz
  própria (`ash`, `verse`, `echo`, `shimmer`, `coral`, `onyx`, `sage`) e uma instrução de interpretação.
- **Edge TTS** (vozes neurais pt-BR da Microsoft, grátis) caso contrário. Os personagens
  diferenciam-se por voz base, velocidade e tom.

A chave lê-se da variável de ambiente ou de um ficheiro `.env` (ignorado pelo git):

```
OPENROUTER_API_KEY=sk-or-...
```

Forçar um provedor: `python3 tools/tts.py --provider openrouter --force`.

## Personagens

| Personagem | Visual | Voz |
|---|---|---|
| **Zinho** | pele negra, camisa azul, jaqueta de couro preta, tênis brancos | jovem, confiante |
| Dona Neide (mãe) | vestido amarelo, turbante laranja, brincos dourados | brava e carinhosa |
| Beto | moletom roxo, óculos, cabelo espetado | ansioso |
| Lia | camiseta rosa, rabo de cavalo, caderno azul | inteligente |
| Seu Juca | colete verde, boina, bigode branco, bengala | senhor rabugento |
| Professora | vestido verde-água, óculos vermelhos | animada |

## Fazer um novo episódio

Crie um ficheiro em `episodes/` (copie um existente): cada entrada é um plano com a fala (`who`, `text`), o cenário (`set`, `tod`),
o contador (`hud`), a câmera (`cam`), os atores com posição/ação/expressão (`actors`), efeitos (`fx`)
e sons (`sfx`). A duração de cada plano ajusta-se sozinha ao tamanho da fala.

Cenários: `street` (rua com padaria, campinho, terreno baldio, ponto de ônibus), `kitchen`,
`bedroom`, `classroom`. Ações: `idle talk walk run wave cheer shock angry hold point shrug kick
kickfall trip sit sitfloor sitbed lie headdown hug reach`. Expressões: `neutral happy smug worried angry shock
flat closed sad`.

Música e efeitos sonoros são sintetizados em `tools/build_audio.py` (sem samples de terceiros).
