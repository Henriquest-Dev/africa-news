"""Gera a narração e as falas de cada personagem.

Provedores:
  openrouter  vozes neurais do modelo openai/gpt-audio(-mini) via OpenRouter
              (precisa de OPENROUTER_API_KEY com saldo; áudio exige >= US$0,50)
  edge        vozes neurais Microsoft (pt-BR), gratuitas — usado quando não há saldo

Uso:  python3 tools/tts.py [--provider auto|openrouter|edge] [--force]
Saída: build/voices/NNN.wav + build/lines.json (duração e envelope p/ lip-sync)
"""
import argparse, asyncio, base64, hashlib, json, os, subprocess, sys, wave
import urllib.request

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BUILD = os.path.join(ROOT, 'build')
VOICES_DIR = os.path.join(BUILD, 'voices')
FPS = 30
SR = 24000

# Uma voz diferente por personagem.
OPENROUTER_VOICES = {
    'NAR':   ('ash',     'Narrador de vídeo animado do YouTube: voz grave, ritmo envolvente, suspense e humor.'),
    'ZINHO': ('verse',   'Adolescente brasileiro confiante e engraçado, um pouco convencido.'),
    'BETO':  ('echo',    'Adolescente brasileiro ansioso e medroso, fala rápido.'),
    'LIA':   ('shimmer', 'Adolescente brasileira inteligente, fala clara e decidida.'),
    'MAE':   ('coral',   'Mãe brasileira carinhosa mas brava, tom de bronca.'),
    'JUCA':  ('onyx',    'Senhor idoso brasileiro rabugento, fala devagar.'),
    'PROF':  ('sage',    'Professora animada e um pouco irônica.'),
}
EDGE_VOICES = {  # voz, velocidade, tom
    'NAR':   ('pt-BR-AntonioNeural', '+12%', '-4Hz'),
    'ZINHO': ('pt-BR-AntonioNeural', '+16%', '+16Hz'),
    'BETO':  ('pt-BR-AntonioNeural', '+20%', '+34Hz'),
    'JUCA':  ('pt-BR-AntonioNeural', '-2%', '-28Hz'),
    'LIA':   ('pt-BR-ThalitaMultilingualNeural', '+12%', '+4Hz'),
    'MAE':   ('pt-BR-FranciscaNeural', '+12%', '-6Hz'),
    'PROF':  ('pt-BR-FranciscaNeural', '+14%', '+10Hz'),
}


def openrouter_key():
    key = os.environ.get('OPENROUTER_API_KEY', '').strip()
    if not key and os.path.exists(os.path.join(ROOT, '.env')):
        for line in open(os.path.join(ROOT, '.env')):
            if line.startswith('OPENROUTER_API_KEY='):
                key = line.split('=', 1)[1].strip()
    return key


def openrouter_has_credit(key):
    req = urllib.request.Request('https://openrouter.ai/api/v1/credits', headers={'Authorization': f'Bearer {key}'})
    try:
        d = json.load(urllib.request.urlopen(req, timeout=20))['data']
        return d['total_credits'] - d['total_usage'] >= 0.5
    except Exception as e:  # chaves sem permissão de leitura de créditos
        print('aviso: não consegui ler o saldo do OpenRouter:', e)
        return False


def tts_openrouter(key, who, text, out_wav, model='openai/gpt-audio-mini'):
    voice, style = OPENROUTER_VOICES[who]
    body = {
        'model': model, 'modalities': ['text', 'audio'], 'stream': True,
        'audio': {'voice': voice, 'format': 'pcm16'},
        'messages': [
            {'role': 'system', 'content': f'Você é um dublador. Personagem: {style} '
             'Leia EXATAMENTE o texto do usuário em português do Brasil, com emoção, sem acrescentar nem comentar nada.'},
            {'role': 'user', 'content': text},
        ],
    }
    req = urllib.request.Request('https://openrouter.ai/api/v1/chat/completions', data=json.dumps(body).encode(),
                                 headers={'Authorization': f'Bearer {key}', 'Content-Type': 'application/json'})
    pcm = bytearray()
    with urllib.request.urlopen(req, timeout=120) as r:
        for raw in r:
            line = raw.decode('utf-8', 'ignore').strip()
            if not line.startswith('data:') or line.endswith('[DONE]'):
                continue
            ev = json.loads(line[5:])
            if 'error' in ev:
                raise RuntimeError(ev['error'])
            for ch in ev.get('choices', []):
                audio = (ch.get('delta') or {}).get('audio') or {}
                if audio.get('data'):
                    pcm += base64.b64decode(audio['data'])
    if not pcm:
        raise RuntimeError('OpenRouter não devolveu áudio')
    with wave.open(out_wav, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(bytes(pcm))


def tts_edge(who, text, out_wav):
    import certifi
    # o proxy de saída usa um CA próprio; o edge-tts lê sempre o certifi
    bundle = os.environ.get('SSL_CERT_FILE') or '/root/.ccr/ca-bundle.crt'
    if os.path.exists(bundle):
        certifi.where = lambda: bundle
    import edge_tts
    voice, rate, pitch = EDGE_VOICES[who]
    mp3 = out_wav[:-4] + '.mp3'
    asyncio.run(edge_tts.Communicate(text, voice, rate=rate, pitch=pitch).save(mp3))
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', mp3, '-ac', '1', '-ar', str(SR), out_wav], check=True)
    os.remove(mp3)


def trim_and_envelope(path):
    with wave.open(path) as w:
        x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    # corta silêncio no início/fim
    a = np.abs(x)
    idx = np.where(a > 0.01)[0]
    if len(idx):
        x = x[max(0, idx[0] - int(0.03 * SR)): idx[-1] + int(0.08 * SR)]
    with wave.open(path, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())
    hop = SR // FPS
    n = int(np.ceil(len(x) / hop))
    rms = np.array([np.sqrt(np.mean(x[i * hop:(i + 1) * hop] ** 2) + 1e-9) for i in range(n)])
    ref = np.percentile(rms, 90) + 1e-6
    env = np.clip((rms / ref) ** 0.8, 0, 1)
    env = np.convolve(env, [0.25, 0.5, 0.25], mode='same')
    return len(x) / SR, [round(float(v), 3) for v in env]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--provider', default='auto', choices=['auto', 'openrouter', 'edge'])
    ap.add_argument('--force', action='store_true')
    args = ap.parse_args()

    story = json.load(open(os.path.join(BUILD, 'story.json')))
    os.makedirs(VOICES_DIR, exist_ok=True)

    provider = args.provider
    key = openrouter_key()
    if provider == 'auto':
        provider = 'openrouter' if key and openrouter_has_credit(key) else 'edge'
    print('provedor de voz:', provider)

    lines = []
    for i, shot in enumerate(story):
        who, text = shot['who'], shot['text']
        tag = hashlib.sha1(f'{provider}|{who}|{text}|{EDGE_VOICES[who]}|{OPENROUTER_VOICES[who]}'.encode()).hexdigest()[:10]
        out = os.path.join(VOICES_DIR, f'{i:03d}_{who}_{tag}.wav')
        if args.force or not os.path.exists(out):
            for attempt in range(4):
                try:
                    if provider == 'openrouter':
                        tts_openrouter(key, who, text, out)
                    else:
                        tts_edge(who, text, out)
                    break
                except Exception as e:
                    print(f'  falha ({e}); tentativa {attempt + 1}')
                    if attempt == 3:
                        raise
        dur, env = trim_and_envelope(out)
        print(f'{i:03d} {who:5s} {dur:5.2f}s  {text[:60]}')
        lines.append({'i': i, 'who': who, 'file': os.path.relpath(out, BUILD), 'dur': round(dur, 3), 'env': env})

    json.dump({'provider': provider, 'fps': FPS, 'lines': lines}, open(os.path.join(BUILD, 'lines.json'), 'w'))
    print('total falado: %.1fs' % sum(l['dur'] for l in lines))


if __name__ == '__main__':
    sys.exit(main())
