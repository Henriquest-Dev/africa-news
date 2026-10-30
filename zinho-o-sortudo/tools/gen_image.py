"""Gera imagens com a API do Gemini (modelos de imagem), com imagens de referência opcionais.

    python3 tools/gen_image.py "prompt" --ref ref1.png --ref ref2.jpg --aspect 16:9 --out out/x.png [--model ...]

Lê GEMINI_API_KEY do ambiente. Tenta os modelos por ordem até um responder com imagem.
"""
import argparse, base64, json, mimetypes, os, sys, time, urllib.error, urllib.request

MODELS = ['gemini-2.5-flash-image', 'gemini-3.1-flash-image', 'gemini-3.1-flash-image-preview', 'gemini-3-pro-image']


def generate(prompt, refs=(), aspect='16:9', models=MODELS):
    key = os.environ['GEMINI_API_KEY']
    parts = []
    for r in refs:
        mime = mimetypes.guess_type(r)[0] or 'image/png'
        parts.append({'inlineData': {'mimeType': mime, 'data': base64.b64encode(open(r, 'rb').read()).decode()}})
    parts.append({'text': prompt})
    body = json.dumps({'contents': [{'parts': parts}],
                       'generationConfig': {'responseModalities': ['IMAGE', 'TEXT'], 'imageConfig': {'aspectRatio': aspect}}}).encode()
    last = None
    for model in models:
        for attempt in range(3):
            req = urllib.request.Request(f'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent', data=body,
                                         headers={'x-goog-api-key': key, 'Content-Type': 'application/json'})
            try:
                d = json.load(urllib.request.urlopen(req, timeout=300))
                for p in d['candidates'][0]['content']['parts']:
                    if 'inlineData' in p:
                        return base64.b64decode(p['inlineData']['data']), model
                last = f'{model}: sem imagem na resposta'
                break
            except urllib.error.HTTPError as e:
                msg = e.read().decode('utf-8', 'ignore')
                last = f'{model}: HTTP {e.code} {msg[:300]}'
                if e.code == 429 and 'PerDay' not in msg and attempt < 2:
                    time.sleep(20 * (attempt + 1)); continue
                break
            except (KeyError, IndexError) as e:
                last = f'{model}: resposta inesperada ({e})'
                break
        print(f'  {last}', file=sys.stderr)
    raise RuntimeError(last)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('prompt'); ap.add_argument('--ref', action='append', default=[])
    ap.add_argument('--aspect', default='16:9'); ap.add_argument('--out', required=True); ap.add_argument('--model')
    a = ap.parse_args()
    img, model = generate(a.prompt, a.ref, a.aspect, [a.model] if a.model else MODELS)
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    open(a.out, 'wb').write(img)
    print(f'{a.out}  ({model})')


if __name__ == '__main__':
    main()
