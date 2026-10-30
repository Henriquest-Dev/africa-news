"""Gera uma imagem com a API da Pollinations (modelo grátis por defeito), só para thumbnails.

    python3 tools/pollinations_image.py "prompt" --out out/x.jpg [--w 768 --h 1280] [--seed 7] [--model ...]

Lê IMG_API_KEY do ambiente (chave sk_ da Pollinations; nunca no repositório).
"""
import argparse, os, sys, time, urllib.error, urllib.parse, urllib.request

FREE = 'community/scriptsnsenses-sys/flux-2-dev-free'
ZIMAGE = 'tongyi-mai/z-image-turbo'
# Zinho dos vídeos (render 3D), para o modelo manter o personagem fiel
REF = 'https://raw.githubusercontent.com/Henriquest-Dev/africa-news/ccr-bc6bfae5-9kc9et/zinho-o-sortudo/assets/zinho-referencia.jpg'

# aparência fixa do Zinho e estilo do nicho, repetidos em todos os pedidos para o personagem sair igual
ZINHO = ('Zinho, a chibi cartoon boy with dark brown skin, a very big perfectly round head, short black hair with a few chunky spiky tufts on top, '
         'small round ears, big glossy solid black oval eyes with a single white shine dot (no white around the eyes), thick dark eyebrows, '
         'round pink blush cheeks, small mouth, wearing an open glossy black leather jacket over a bright royal blue t-shirt, '
         'dark navy blue pants and white sneakers, small body about the same height as his head')
STYLE = ('2D flat vector cartoon illustration, thick clean black outlines, simple cel shading, vibrant saturated colors, '
         'chibi proportions with oversized head, expressive face, YouTube thumbnail style, character centered and fully visible, no text, no letters, no watermark')


def generate(prompt, w=768, h=1280, seed=None, model=FREE, ref=None):
    url = f'https://gen.pollinations.ai/image/{urllib.parse.quote(prompt)}?' + urllib.parse.urlencode(
        {k: v for k, v in {'model': model, 'width': w, 'height': h, 'seed': seed, 'nologo': 'true', 'image': ref}.items() if v is not None})
    last = None
    for attempt in range(4):
        req = urllib.request.Request(url, headers={'Authorization': f"Bearer {os.environ['IMG_API_KEY']}"})
        try:
            r = urllib.request.urlopen(req, timeout=300)
            data = r.read()
            if not r.headers.get('Content-Type', '').startswith('image/'):
                raise RuntimeError(f'resposta sem imagem: {data[:200]!r}')
            return data
        except urllib.error.HTTPError as e:
            last = f'HTTP {e.code} {e.read()[:300]!r}'
            if e.code in (429, 500, 502, 503, 504):
                time.sleep(12 * (attempt + 1)); continue
            break
        except (urllib.error.URLError, TimeoutError, RuntimeError) as e:
            last = str(e); time.sleep(8)
    raise RuntimeError(last)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('prompt'); ap.add_argument('--out', required=True)
    ap.add_argument('--w', type=int, default=768); ap.add_argument('--h', type=int, default=1280)
    ap.add_argument('--seed', type=int); ap.add_argument('--model', default=FREE)
    ap.add_argument('--ref', default=REF, help='URL pública de uma imagem de referência do Zinho ("" para nenhuma)')
    ap.add_argument('--raw', action='store_true', help='não acrescenta a descrição do Zinho e do estilo')
    a = ap.parse_args()
    prompt = a.prompt if a.raw else (f'{STYLE}. Main character: {ZINHO}' + ('. Draw the boy from the reference image as a 2D cartoon, keeping exactly his face, eyes, hair, skin color and clothes' if a.ref else '') + f'. Scene: {a.prompt}')
    data = generate(prompt, a.w, a.h, a.seed, a.model, a.ref or None)
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    open(a.out, 'wb').write(data)
    print(a.out)


if __name__ == '__main__':
    main()
