# 01 — E se envelhecer nunca foi o problema?

Recriação, em português, do vídeo de referência "aging": colagem editorial carmim, recortes em meio-tom, serif condensada.
9:16, 1080×1920, 30 fps, 28,8 s, áudio a −14 LUFS.

- `aging.html`: o vídeo inteiro. `seek(t)` desenha qualquer frame; abre no browser para ver e percorrer a linha do tempo, com som.
- `render.mjs`: render da skill `explainer-high-energy` (Playwright + ffmpeg), com o loudnorm a −14 LUFS.
  `node render.mjs aging.html out.mp4 30 4 4` (precisa de `playwright` em `node_modules`).
- `assets/`: imagens geradas na Pollinations (z-image), com o fundo verde removido por `key.py`; os fades e o meio-tom são feitos por `prep.py`.
- `sfx.js`: efeitos CC0 da skill `sound-effects`, embutidos. A música é sintetizada em `buildAudio`.
- O beat sheet está no topo do script, em `aging.html`.
