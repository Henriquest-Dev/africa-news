"""Gera uma imagem com a API da Pollinations (modelo grátis por defeito), só para thumbnails.

    python3 tools/pollinations_image.py "prompt" --out out/x.jpg [--w 768 --h 1280] [--seed 7] [--model ...]

Lê IMG_API_KEY do ambiente (chave sk_ da Pollinations; nunca no repositório).
"""
import argparse, os, sys, time, urllib.error, urllib.parse, urllib.request

FREE = 'community/scriptsnsenses-sys/flux-2-dev-free'

# aparência fixa do Zinho e estilo do nicho, repetidos em todos os pedidos para o personagem sair igual
ZINHO = ('Zinho, a cute Black boy with dark brown skin, a big round head, very short black hair with tiny curly twists close to the scalp (no dreadlocks), '
         'big round white eyes with clearly visible round black pupils and a white highlight, wearing an open black leather jacket over a bright blue t-shirt, '
         'dark blue jeans and white sneakers')
STYLE = ('2D flat vector cartoon illustration, thick clean black outlines, simple cel shading, vibrant saturated colors, '
         'chibi proportions with oversized head, expressive face, YouTube thumbnail style, character centered and fully visible, no text, no letters, no watermark')


def generate(prompt, w=768, h=1280, seed=None, model=FREE):
    url = f'https://gen.pollinations.ai/image/{urllib.parse.quote(prompt)}?' + urllib.parse.urlencode(
        {k: v for k, v in {'model': model, 'width': w, 'height': h, 'seed': seed, 'nologo': 'true'}.items() if v is not None})
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
    ap.add_argument('--raw', action='store_true', help='não acrescenta a descrição do Zinho e do estilo')
    a = ap.parse_args()
    prompt = a.prompt if a.raw else f'{STYLE}. Main character: {ZINHO}. Scene: {a.prompt}'
    data = generate(prompt, a.w, a.h, a.seed, a.model)
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    open(a.out, 'wb').write(data)
    print(a.out)


if __name__ == '__main__':
    main()
