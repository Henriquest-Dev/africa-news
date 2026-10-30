"""Gera a narração e as falas de cada personagem.

Provedores:
  gemini      vozes neurais do Google Gemini (gemini-2.5-flash-preview-tts), chave GEMINI_API_KEY
  openrouter  vozes neurais do modelo openai/gpt-audio(-mini) via OpenRouter
              (precisa de OPENROUTER_API_KEY com saldo; áudio exige >= US$0,50)
  edge        vozes neurais Microsoft (pt-BR), gratuitas — usado quando não há saldo

Uso:  python3 tools/tts.py [--provider auto|gemini|openrouter|edge] [--force]
Saída: build/voices/NNN.wav + build/lines.json (duração e envelope p/ lip-sync)
"""
import argparse, asyncio, base64, hashlib, json, os, subprocess, sys, wave
import urllib.error, urllib.request

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BUILD = os.path.join(ROOT, 'build')
BUILD = os.path.join(BUILD, open(os.path.join(BUILD, 'current.txt')).read().strip())  # episódio atual
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
    'UGO':   ('onyx',    'Homem das cavernas, voz grave e rouca, fala curta e engraçada.'),
}
GEMINI_VOICES = {  # voz pré-definida do Gemini, direção de interpretação
    'NAR':   ('Charon',    'Narrador de vídeo animado do YouTube, voz grave e envolvente, ritmo ágil, com suspense e humor'),
    'ZINHO': ('Puck',      'Menino brasileiro de 13 anos, animado, expressivo e engraçado'),
    'BETO':  ('Fenrir',    'Adolescente brasileiro ansioso e medroso, fala rápido'),
    'LIA':   ('Leda',      'Menina brasileira inteligente e decidida'),
    'MAE':   ('Sulafat',   'Mãe brasileira carinhosa, mas brava quando precisa'),
    'JUCA':  ('Gacrux',    'Senhor idoso brasileiro rabugento, fala devagar'),
    'PROF':  ('Aoede',     'Professora animada e um pouco irônica'),
    'UGO':   ('Algenib',   'Homem das cavernas, voz grave e rouca, fala curta, engraçado'),
    'NEFER': ('Iapetus',   'Trabalhador do Egito Antigo, voz calma, sábia e simpática, um pouco divertida'),
}
EDGE_VOICES = {  # voz, velocidade, tom
    'NAR':   ('pt-BR-AntonioNeural', '+12%', '-4Hz'),
    'ZINHO': ('pt-BR-AntonioNeural', '+16%', '+16Hz'),
    'BETO':  ('pt-BR-AntonioNeural', '+20%', '+34Hz'),
    'JUCA':  ('pt-BR-AntonioNeural', '-2%', '-28Hz'),
    'LIA':   ('pt-BR-ThalitaMultilingualNeural', '+12%', '+4Hz'),
    'MAE':   ('pt-BR-FranciscaNeural', '+12%', '-6Hz'),
    'PROF':  ('pt-BR-FranciscaNeural', '+14%', '+10Hz'),
    'UGO':   ('pt-BR-AntonioNeural', '-6%', '-42Hz'),
    'NEFER': ('pt-BR-AntonioNeural', '-2%', '-15Hz'),
}


def env_key(name):
    key = os.environ.get(name, '').strip()
    env = os.path.join(ROOT, '.env')
    if not key and os.path.exists(env):
        for line in open(env):
            if line.startswith(name + '='):
                key = line.split('=', 1)[1].strip()
    return key


def tts_gemini(key, who, text, out_wav):
    import time
    voice, style = GEMINI_VOICES[who]
    prompt = f'Fale em português do Brasil. Personagem: {style}. Diga exatamente, com emoção, sem acrescentar nada: {text}'
    body = json.dumps({'contents': [{'parts': [{'text': prompt}]}],
                       'generationConfig': {'responseModalities': ['AUDIO'],
                                            'speechConfig': {'voiceConfig': {'prebuiltVoiceConfig': {'voiceName': voice}}}}}).encode()
    last = None
    # o 3.8 lê a instrução de interpretação em voz alta; o 2.5 interpreta-a e só fala o texto
    for model in ('gemini-2.5-flash-preview-tts', 'gemini-2.5-pro-preview-tts'):
        for attempt in range(5):
            req = urllib.request.Request(f'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent', data=body,
                                         headers={'x-goog-api-key': key, 'Content-Type': 'application/json'})
            try:
                d = json.load(urllib.request.urlopen(req, timeout=180))
                part = d['candidates'][0]['content']['parts'][0]['inlineData']
                raw = base64.b64decode(part['data'])
                if 'wav' in part['mimeType']:
                    open(out_wav + '.src.wav', 'wb').write(raw)
                    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', out_wav + '.src.wav', '-ac', '1', '-ar', str(SR), out_wav], check=True)
                    os.remove(out_wav + '.src.wav')
                else:  # PCM 16 bits cru (audio/L16;rate=24000)
                    rate = int(part['mimeType'].split('rate=')[1].split(';')[0]) if 'rate=' in part['mimeType'] else 24000
                    with wave.open(out_wav + '.src.wav', 'wb') as w:
                        w.setnchannels(1); w.setsampwidth(2); w.setframerate(rate); w.writeframes(raw)
                    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', out_wav + '.src.wav', '-ac', '1', '-ar', str(SR), out_wav], check=True)
                    os.remove(out_wav + '.src.wav')
                return
            except urllib.error.HTTPError as e:
                last = f'{model}: HTTP {e.code} {e.read()[:200]!r}'
                if e.code == 429:  # limite do plano gratuito: espera e tenta de novo
                    time.sleep(20 * (attempt + 1)); continue
                break
            except (KeyError, IndexError) as e:
                last = f'{model}: resposta sem áudio ({e})'; time.sleep(3)
    raise RuntimeError(last)


def gemini_request(key, prompt, voice):
    """Um pedido ao Gemini TTS; devolve (amostras float32, taxa)."""
    import io, time
    body = json.dumps({'contents': [{'parts': [{'text': prompt}]}],
                       'generationConfig': {'responseModalities': ['AUDIO'],
                                            'speechConfig': {'voiceConfig': {'prebuiltVoiceConfig': {'voiceName': voice}}}}}).encode()
    last = None
    for model in ('gemini-2.5-flash-preview-tts', 'gemini-2.5-pro-preview-tts'):
        for attempt in range(3):
            req = urllib.request.Request(f'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent', data=body,
                                         headers={'x-goog-api-key': key, 'Content-Type': 'application/json'})
            try:
                d = json.load(urllib.request.urlopen(req, timeout=300))
                part = d['candidates'][0]['content']['parts'][0]['inlineData']
                raw = base64.b64decode(part['data'])
                if 'wav' in part['mimeType']:
                    w = wave.open(io.BytesIO(raw)); rate = w.getframerate(); raw = w.readframes(w.getnframes())
                else:
                    rate = int(part['mimeType'].split('rate=')[1].split(';')[0]) if 'rate=' in part['mimeType'] else 24000
                return np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768, rate
            except urllib.error.HTTPError as e:
                msg = e.read().decode('utf-8', 'ignore')
                last = f'{model}: HTTP {e.code} {msg[:160]}'
                if e.code == 429 and 'PerDay' in msg:
                    break  # quota diária deste modelo esgotada: tenta o próximo
                if e.code == 429:
                    time.sleep(25 * (attempt + 1)); continue
                break
            except (KeyError, IndexError) as e:
                last = f'{model}: resposta sem áudio ({e})'; time.sleep(3)
    raise RuntimeError(last)


def split_on_silence(x, rate, n):
    """Corta um áudio com n frases nas n-1 pausas mais longas."""
    hop = int(rate * 0.02)
    rms = np.array([np.sqrt(np.mean(x[i:i + hop] ** 2) + 1e-12) for i in range(0, len(x) - hop, hop)])
    quiet = rms < max(0.01, np.percentile(rms, 30) * 0.6)
    gaps, i = [], 0
    while i < len(quiet):
        if quiet[i]:
            j = i
            while j < len(quiet) and quiet[j]:
                j += 1
            if j - i >= 12 and i > 0 and j < len(quiet):  # pausas de pelo menos 0,24 s, sem contar as pontas
                gaps.append((j - i, (i + j) // 2))
            i = j
        else:
            i += 1
    if len(gaps) < n - 1:
        return None
    cuts = sorted(c for _, c in sorted(gaps, reverse=True)[:n - 1])
    bounds = [0] + [c * hop for c in cuts] + [len(x)]
    return [x[bounds[k]:bounds[k + 1]] for k in range(n)]


def gemini_batch(key, items):
    """Gera todas as falas de um personagem num só pedido (poupa a quota diária) e corta nas pausas."""
    who = items[0][1]
    voice, style = GEMINI_VOICES[who]
    texts = [t for _, _, t, _ in items]
    prompt = (f'Fale em português do Brasil. Personagem: {style}. Leia as {len(texts)} falas abaixo, na ordem, com emoção, '
              'fazendo uma pausa longa de dois segundos entre uma fala e outra. Não leia nada além das falas.\n\n' + '\n\n'.join(texts))
    x, rate = gemini_request(key, prompt, voice)
    parts = split_on_silence(x, rate, len(texts))
    if parts is None:
        raise RuntimeError(f'não consegui separar as {len(texts)} falas de {who}')
    # confere se cada pedaço tem duração plausível para o número de palavras
    for (_, _, t, _), seg in zip(items, parts):
        sec, words = len(seg) / rate, len(t.split())
        if not (0.12 * words < sec < 1.2 * words + 1.5):
            raise RuntimeError(f'separação suspeita em {who}: {sec:.1f}s para {words} palavras')
    for (_, _, _, out), seg in zip(items, parts):
        tmp = out + '.src.wav'
        with wave.open(tmp, 'wb') as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(rate)
            w.writeframes((np.clip(seg, -1, 1) * 32767).astype(np.int16).tobytes())
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-ac', '1', '-ar', str(SR), out], check=True)
        os.remove(tmp)


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
    ap.add_argument('--provider', default='auto', choices=['auto', 'gemini', 'openrouter', 'edge'])
    ap.add_argument('--force', action='store_true')
    ap.add_argument('--per-line', action='store_true', help='Gemini: um pedido por fala (gasta mais quota)')
    args = ap.parse_args()

    story = json.load(open(os.path.join(BUILD, 'story.json')))
    os.makedirs(VOICES_DIR, exist_ok=True)

    provider = args.provider
    key = openrouter_key()
    gkey = env_key('GEMINI_API_KEY')
    if provider == 'auto':
        provider = 'gemini' if gkey else 'openrouter' if key and openrouter_has_credit(key) else 'edge'
    print('provedor de voz:', provider)

    # Gemini: um pedido por personagem com todas as falas que faltam (a quota grátis é de 10 pedidos/dia)
    if provider == 'gemini' and not args.per_line:
        todo = {}
        for i, shot in enumerate(story):
            who, text = shot['who'], shot['text']
            tag = hashlib.sha1(f'{provider}|{who}|{text}|{EDGE_VOICES[who]}|{OPENROUTER_VOICES[who]}|{GEMINI_VOICES[who]}'.encode()).hexdigest()[:10]
            out = os.path.join(VOICES_DIR, f'{i:03d}_{who}_{tag}.wav')
            if args.force or not os.path.exists(out):
                todo.setdefault(who, []).append((i, who, text, out))
        for who, items in todo.items():
            try:
                gemini_batch(gkey, items)
                print(f'  {who}: {len(items)} falas num só pedido')
            except Exception as e:
                print(f'  {who}: lote falhou ({e}); vai fala a fala')
        sys.stdout.flush()

    lines = []
    for i, shot in enumerate(story):
        who, text = shot['who'], shot['text']
        tag = hashlib.sha1(f'{provider}|{who}|{text}|{EDGE_VOICES[who]}|{OPENROUTER_VOICES[who]}|{GEMINI_VOICES[who]}'.encode()).hexdigest()[:10]
        out = os.path.join(VOICES_DIR, f'{i:03d}_{who}_{tag}.wav')
        if args.force or not os.path.exists(out):
            for attempt in range(4):
                try:
                    if provider == 'gemini':
                        tts_gemini(gkey, who, text, out)
                    elif provider == 'openrouter':
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
