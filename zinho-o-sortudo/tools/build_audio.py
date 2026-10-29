"""Monta a linha do tempo (duração de cada plano) e mixa vozes + trilha + efeitos.

Toda a música e efeitos são sintetizados aqui (sem samples de terceiros => sem problema de direitos).
Saída: build/timeline.json e build/mix.wav
"""
import json, os, wave

import numpy as np
from scipy.signal import butter, sosfilt, resample_poly

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BUILD = os.path.join(ROOT, 'build')
BUILD = os.path.join(BUILD, open(os.path.join(BUILD, 'current.txt')).read().strip())  # episódio atual
SR = 48000
LEAD, TAIL, STAMP_LEAD = 0.1, 0.25, 0.3


def rng(seed):
    return np.random.default_rng(seed)


def env_ad(n, a=0.005, d=None):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4))
    if d:
        e *= np.exp(-t / d)
    return e


def filt(x, kind, f):
    sos = butter(2, f, btype=kind, fs=SR, output='sos')
    return sosfilt(sos, x)


def tone(freqs_amps_decays, dur):
    t = np.arange(int(dur * SR)) / SR
    y = np.zeros_like(t)
    for f, a, d in freqs_amps_decays:
        y += a * np.sin(2 * np.pi * f * t) * np.exp(-t / d)
    return y * np.minimum(1, t / 0.004)


def noise(dur, seed=0):
    return rng(seed).standard_normal(int(dur * SR))


# ───────────────── instrumentos ─────────────────
def pluck(f, dur=0.6):
    return tone([(f * k, 1 / k ** 1.3, 0.35 / (1 + 0.6 * k)) for k in range(1, 9)], dur)


def marimba(f, dur=0.7):
    return tone([(f, 1, 0.28), (f * 4, 0.25, 0.05), (f * 10, 0.05, 0.02)], dur)


def bell(f, dur=1.2):
    return tone([(f, 1, 0.5), (f * 2.76, 0.4, 0.25), (f * 5.4, 0.2, 0.12)], dur)


def bass(f, dur=0.45):
    t = np.arange(int(dur * SR)) / SR
    y = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t)
    return y * np.minimum(1, t / 0.01) * np.exp(-t / 0.4) * np.minimum(1, (dur - t) / 0.03)


def pad(freqs, dur, att=0.6):
    t = np.arange(int(dur * SR)) / SR
    y = np.zeros_like(t)
    for f in freqs:
        for det in (0.997, 1.0, 1.003):
            for k in range(1, 7):
                y += np.sin(2 * np.pi * f * det * k * t + k) / (k * 1.4)
    e = np.minimum(1, t / att) * np.minimum(1, (dur - t) / att)
    return y * e / (len(freqs) * 6)


def kick(dur=0.35, f0=130, f1=45):
    t = np.arange(int(dur * SR)) / SR
    f = f1 + (f0 - f1) * np.exp(-t * 25)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)


def snare(dur=0.25, seed=1):
    n = filt(noise(dur, seed), 'bandpass', [1200, 6000]) * env_ad(int(dur * SR), 0.001, 0.06)
    return mixl(n, 0.4 * tone([(185, 1, 0.05)], dur))


def hat(dur=0.08, seed=2):
    return filt(noise(dur, seed), 'highpass', 7000) * env_ad(int(dur * SR), 0.001, 0.015)


def mixl(*parts):
    """Soma sinais de comprimentos diferentes."""
    y = np.zeros(max(len(p) for p in parts))
    for p in parts:
        y[:len(p)] += p
    return y


def add(buf, x, at, gain=1.0):
    i = int(at * SR)
    if i >= len(buf) or i + len(x) <= 0:
        return
    if i < 0:
        x, i = x[-i:], 0
    x = x[:len(buf) - i]
    buf[i:i + len(x)] += gain * x


def midi(n):
    return 440 * 2 ** ((n - 69) / 12)


# ───────────────── trilhas ─────────────────
MUSIC = {
    #          bpm  acordes (MIDI raiz + tipo)                     estilo
    'happy':   (112, [(60, 'M'), (67, 'M'), (69, 'm'), (65, 'M')], 'bouncy'),
    'quirky':  (104, [(62, 'm'), (67, 'M'), (60, 'M'), (69, 'm')], 'quirky'),
    'mystery': (76,  [(57, 'm'), (53, 'M'), (50, 'm'), (52, 'M')], 'mystery'),
    'chase':   (150, [(62, 'm'), (58, 'M'), (60, 'M'), (57, 'M')], 'chase'),
    'tense':   (92,  [(60, 'm'), (56, 'M'), (55, 'M'), (55, 'M')], 'tense'),
    'climax':  (126, [(57, 'm'), (53, 'M'), (55, 'M'), (52, 'M')], 'climax'),
    'wonder':  (70,  [(60, 'M'), (64, 'm'), (65, 'M'), (67, 'M')], 'wonder'),
    'sad':     (64,  [(57, 'm'), (53, 'M'), (60, 'M'), (55, 'M')], 'wonder'),
    'triumph': (116, [(60, 'M'), (65, 'M'), (67, 'M'), (60, 'M')], 'triumph'),
}


def chord(root, kind):
    return [root, root + (4 if kind == 'M' else 3), root + 7]


def render_music(name, dur, seed):
    out = np.zeros(int(dur * SR) + SR * 2)
    if name not in MUSIC:
        return out[:int(dur * SR)]
    bpm, prog, style = MUSIC[name]
    beat = 60 / bpm
    r = rng(seed)
    nbeats = int(dur / beat) + 1
    scale = [0, 2, 4, 7, 9, 12, 14, 16]
    mel = 0
    for b in range(nbeats):
        t = b * beat
        root, kind = prog[(b // 4) % len(prog)]
        notes = chord(root, kind)
        bar_pos = b % 4
        if style in ('bouncy', 'quirky', 'triumph'):
            add(out, bass(midi(root - 24), beat * 0.9), t, 0.55)
            for n in notes:
                add(out, pluck(midi(n), 0.4), t + beat / 2, 0.16)
            if bar_pos in (0, 2):
                add(out, kick(), t, 0.5)
            if style == 'triumph' and bar_pos in (1, 3):
                add(out, snare(), t, 0.25)
            add(out, hat(), t + beat / 2, 0.12)
            if style == 'quirky':
                if r.random() < 0.7:
                    mel = int(np.clip(mel + r.integers(-2, 3), 0, len(scale) - 1))
                    add(out, marimba(midi(root + 12 + scale[mel] - (root - prog[0][0]))), t, 0.32)
                if r.random() < 0.4:
                    add(out, marimba(midi(root + 19)), t + beat * 0.75, 0.18)
            else:
                for h in (0, 0.5):
                    if r.random() < 0.75:
                        mel = int(np.clip(mel + r.integers(-2, 3), 0, len(scale) - 1))
                        add(out, marimba(midi(72 + scale[mel])), t + h * beat, 0.26)
        elif style == 'mystery':
            if bar_pos == 0:
                add(out, pad([midi(n - 12) for n in notes], beat * 4.2, 1.0), t, 0.5)
                add(out, bass(midi(root - 24), beat * 3.5), t, 0.4)
            arp = notes[bar_pos % 3] + 12
            add(out, bell(midi(arp), 1.0), t + beat * 0.5, 0.1)
            add(out, hat(0.03), t, 0.06)
        elif style == 'chase':
            for s in range(4):
                n = notes[(s + b) % 3] + 12
                add(out, pluck(midi(n), 0.15), t + s * beat / 4, 0.14)
            add(out, bass(midi(root - 24), beat * 0.45), t, 0.55)
            add(out, bass(midi(root - 24), beat * 0.45), t + beat / 2, 0.4)
            add(out, kick() if bar_pos % 2 == 0 else snare(), t, 0.45 if bar_pos % 2 == 0 else 0.3)
            add(out, hat(), t + beat / 2, 0.15)
        elif style == 'tense':
            if bar_pos == 0:
                add(out, pad([midi(n - 12) for n in notes], beat * 4.2, 0.8), t, 0.55)
                add(out, kick(0.8, 80, 35), t, 0.7)
            for s in (0, 0.5):
                add(out, bass(midi(root - 24), beat * 0.4), t + s * beat, 0.45)
            add(out, hat(0.05), t + beat * 0.75, 0.08)
        elif style == 'climax':
            if bar_pos == 0:
                add(out, pad([midi(n) for n in notes] + [midi(root - 12)], beat * 4.2, 0.4), t, 0.6)
            add(out, kick(0.4, 110, 40), t, 0.7)
            if bar_pos in (1, 3):
                add(out, snare(0.3), t, 0.45)
            for s in (0, 0.25, 0.5, 0.75):
                add(out, bass(midi(root - 24), beat * 0.22), t + s * beat, 0.4)
                add(out, hat(), t + s * beat, 0.08)
        elif style == 'wonder':
            if bar_pos == 0:
                add(out, pad([midi(n) for n in notes], beat * 4.2, 1.2), t, 0.5)
            for s in (0, 0.5):
                add(out, bell(midi(notes[int(r.integers(0, 3))] + 24), 1.4), t + s * beat, 0.09)
    return out[:int(dur * SR)]


# ───────────────── efeitos ─────────────────
def sfx(name, dur_left, seed):
    r = rng(seed)
    if name == 'kick':
        return mixl(kick(0.25, 160, 60), 0.3 * filt(noise(0.05, seed), 'lowpass', 2000))
    if name == 'cheer':
        d = 1.8
        n = filt(noise(d, seed), 'bandpass', [400, 3000])
        t = np.arange(len(n)) / SR
        return n * (0.6 + 0.4 * np.sin(2 * np.pi * 6 * t + r.random())) * np.minimum(1, t / 0.15) * np.exp(-t / 0.9) * 0.5
    if name == 'sparkle':
        y = np.zeros(int(1.4 * SR))
        for k, n in enumerate([84, 88, 91, 96, 100]):
            add(y, bell(midi(n), 0.9), k * 0.07, 0.35)
        return y
    if name in ('rain', 'rumble', 'alarm', 'static', 'fire'):
        d = max(0.5, dur_left)
        t = np.arange(int(d * SR)) / SR
        fade = np.minimum(1, t / 0.3) * np.minimum(1, (d - t) / 0.3)
        if name == 'rain':
            return filt(noise(d, seed), 'bandpass', [900, 7000]) * fade * 0.35
        if name == 'static':
            n = filt(noise(d, seed), 'bandpass', [800, 6000])
            return n * fade * (0.5 + 0.5 * (rng(seed).random(len(t)) > 0.97)) * 0.35
        if name == 'fire':
            base = filt(noise(d, seed), 'lowpass', 500) * 0.6
            crack = filt(noise(d, seed + 1), 'highpass', 2000) * (rng(seed + 2).random(len(t)) > 0.9985) * 6
            return (base + filt(crack, 'lowpass', 6000)) * fade * 0.35
        if name == 'rumble':
            return filt(noise(d, seed), 'lowpass', 140) * fade * (0.4 + 0.6 * t / d) * 2.2
        sq = np.sign(np.sin(2 * np.pi * np.where((t * 4) % 1 < 0.5, 900, 1250) * t))
        return filt(sq, 'lowpass', 3000) * fade * 0.12
    if name == 'meow':
        d = 0.6
        t = np.arange(int(d * SR)) / SR
        f = 650 + 350 * np.sin(np.pi * t / d) + 15 * np.sin(2 * np.pi * 7 * t)
        ph = 2 * np.pi * np.cumsum(f) / SR
        y = np.sin(ph) + 0.5 * np.sin(2 * ph) + 0.25 * np.sin(3 * ph)
        return y * np.sin(np.pi * t / d) ** 0.7 * 0.35
    if name == 'crash':
        y = filt(noise(0.5, seed), 'highpass', 2500) * env_ad(int(0.5 * SR), 0.001, 0.08)
        for k in range(26):
            add(y, tone([(r.uniform(2200, 7000), 1, r.uniform(0.04, 0.2))], 0.5), r.uniform(0, 0.25), 0.12)
        return y * 0.8
    if name == 'stamp':
        return mixl(kick(0.6, 90, 38) * 0.9, 0.5 * filt(noise(0.12, seed), 'lowpass', 1800) * env_ad(int(0.12 * SR), 0.001, 0.03))
    if name == 'tick':
        return filt(noise(0.03, seed), 'bandpass', [2500, 5000]) * env_ad(int(0.03 * SR), 0.0005, 0.006) * 0.8
    if name == 'bell':
        return tone([(196, 1, 1.2), (392, 0.5, 0.8), (523, 0.35, 0.6), (784, 0.2, 0.4)], 2.4) * 0.5
    if name == 'glitch':
        d = 0.6
        y = np.zeros(int(d * SR))
        for k in range(10):
            seg = np.sign(np.sin(2 * np.pi * r.uniform(200, 1800) * np.arange(int(0.04 * SR)) / SR))
            add(y, seg, r.uniform(0, d - 0.05), 0.15)
        return y + 0.15 * filt(noise(d, seed), 'highpass', 3000) * env_ad(len(y), 0.001, 0.2)
    if name == 'boom':
        return mixl(kick(2.0, 70, 30) * 0.9, 0.5 * filt(noise(1.5, seed), 'lowpass', 300) * env_ad(int(1.5 * SR), 0.005, 0.5))
    if name == 'snap':
        return filt(noise(0.05, seed), 'highpass', 1500) * env_ad(int(0.05 * SR), 0.0005, 0.01)
    if name == 'thud':
        return mixl(kick(0.3, 100, 40), 0.3 * filt(noise(0.15, seed), 'lowpass', 500) * env_ad(int(0.15 * SR), 0.001, 0.04))
    if name == 'bus':
        d = 2.6
        t = np.arange(int(d * SR)) / SR
        f = 70 * (1.15 - 0.3 * t / d)
        eng = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR))
        y = filt(eng, 'lowpass', 350) + 0.6 * filt(noise(d, seed), 'lowpass', 600)
        return y * np.exp(-((t - 1.1) / 0.6) ** 2) * 0.6
    if name == 'whoosh':
        d = 0.6
        t = np.arange(int(d * SR)) / SR
        return filt(noise(d, seed), 'bandpass', [500, 4000]) * np.sin(np.pi * t / d) ** 2 * 0.6
    if name == 'clang':
        return tone([(520, 1, 0.6), (1370, 0.6, 0.4), (2390, 0.4, 0.3), (3800, 0.25, 0.2)], 1.4) * 0.45
    if name == 'bonk':
        d = 0.35
        t = np.arange(int(d * SR)) / SR
        f = 420 * np.exp(-t * 6)
        return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 10) + 0.5 * tone([(900, 1, 0.03)], d)) * 0.7
    if name == 'bark':
        y = np.zeros(int(0.5 * SR))
        for k in range(2):
            d = 0.16
            t = np.arange(int(d * SR)) / SR
            f = r.uniform(380, 520) * (1 - 0.4 * t / d)
            ph = 2 * np.pi * np.cumsum(f) / SR
            b = (np.sin(ph) + 0.6 * np.sign(np.sin(ph)) * 0.5) * np.sin(np.pi * t / d)
            b = filt(b + 0.4 * noise(d, seed + k), 'bandpass', [300, 2500])
            add(y, b, k * 0.22, 0.6)
        return y
    if name == 'thunder':
        d = 3.0
        t = np.arange(int(d * SR)) / SR
        crack = filt(noise(d, seed), 'highpass', 1500) * np.exp(-t / 0.06)
        roll = filt(noise(d, seed + 1), 'lowpass', 220) * np.exp(-t / 0.9) * (1 + 0.5 * np.sin(2 * np.pi * 3 * t))
        return (0.6 * crack + 2.0 * roll) * 0.6
    if name == 'zap':
        d = 0.45
        t = np.arange(int(d * SR)) / SR
        buzz = np.sign(np.sin(2 * np.pi * 120 * t)) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 37 * t)))
        return (filt(buzz, 'lowpass', 2500) * 0.3 + 0.4 * filt(noise(d, seed), 'highpass', 3000) * (r.random(len(t)) > 0.9)) * np.exp(-t / 0.2)
    if name == 'powerdown':
        d = 1.4
        t = np.arange(int(d * SR)) / SR
        f = 60 + 700 * np.exp(-t * 2.5)
        return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.7) * 0.35
    if name == 'impact':
        d = 3.5
        t = np.arange(int(d * SR)) / SR
        y = kick(d, 90, 28) * 1.2
        y += 1.5 * filt(noise(d, seed), 'lowpass', 400) * np.exp(-t / 0.9)
        y += 0.6 * filt(noise(d, seed + 1), 'highpass', 2000) * np.exp(-t / 0.08)
        return y * 0.8
    if name == 'ding':
        return bell(1568, 0.9) * 0.4
    raise KeyError(name)


def read_wav(path):
    with wave.open(path) as w:
        x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
        sr = w.getframerate()
    return resample_poly(x, SR // 1000, sr // 1000) if sr != SR else x


def main():
    story = json.load(open(os.path.join(BUILD, 'story.json')))
    lines = json.load(open(os.path.join(BUILD, 'lines.json')))['lines']

    # ── linha do tempo ──
    t = 0.0
    shots = []
    for s, l in zip(story, lines):
        lead = STAMP_LEAD if s.get('stamp') else LEAD
        dur = max(s.get('min', 0), lead + l['dur'] + TAIL + s.get('pad', 0))
        shots.append({**s, 'start': round(t, 3), 'dur': round(dur, 3), 'vstart': round(t + lead, 3), 'vdur': l['dur'], 'env': l['env']})
        t += dur
    total = t + 0.5
    json.dump({'fps': 30, 'total': round(total, 3), 'shots': shots}, open(os.path.join(BUILD, 'timeline.json'), 'w'))
    print('duração total: %d:%04.1f (%d planos)' % (total // 60, total % 60, len(shots)))

    n = int(total * SR) + SR
    voice = np.zeros(n); music = np.zeros(n); fx = np.zeros(n)

    for s, l in zip(shots, lines):
        v = read_wav(os.path.join(BUILD, l['file']))
        if s.get('radio'):  # voz saindo de um rádio
            v = filt(v, 'bandpass', [350, 3200]) * 1.6 + 0.02 * filt(noise(len(v) / SR, 7), 'highpass', 2000)
            v = np.tanh(v * 1.5) / 1.5
        add(voice, v, s['vstart'])

    # ── música por seções (com crossfade) ──
    sections, cur = [], None
    for s in shots:
        if s.get('music') and s['music'] != (cur and cur[0]):
            if cur:
                sections.append((cur[0], cur[1], s['start']))
            cur = (s['music'], s['start'])
    sections.append((cur[0], cur[1], total))
    for k, (name, a, b) in enumerate(sections):
        seg = render_music(name, b - a + 0.6, 100 + k)
        tt = np.arange(len(seg)) / SR
        seg *= np.minimum(1, tt / 0.25) * np.minimum(1, (len(seg) / SR - tt) / 0.6)
        add(music, seg, a)
        print(f'  trilha {name:8s} {a:6.1f}s → {b:6.1f}s')

    # ── efeitos ──
    for i, s in enumerate(shots):
        for k, ev in enumerate(s.get('sfx', [])):
            name, u = ev[0], ev[1]
            gain = ev[2] if len(ev) > 2 else 1.0
            at = s['start'] + u * s['dur']
            add(fx, sfx(name, s['start'] + s['dur'] - at, i * 31 + k), at, gain * 0.7)

    # ducking da música sob a voz
    win = int(0.25 * SR)
    # média móvel por soma acumulada (O(n)); a convolução direta era lentíssima em vídeos longos
    cs = np.concatenate([[0.0], np.cumsum(np.abs(voice))])
    lo = np.clip(np.arange(len(voice)) - win // 2, 0, len(voice)); hi = np.clip(lo + win, 0, len(voice))
    venv = (cs[hi] - cs[lo]) / win
    venv = np.clip(venv / (np.percentile(venv[venv > 1e-4], 80) + 1e-6), 0, 1)
    music *= 0.32 * (1 - 0.55 * venv)

    mix = voice * 1.0 + music + fx
    mix = np.tanh(mix * 1.1) / np.tanh(1.1)
    mix *= 0.95 / max(1e-6, np.max(np.abs(mix)))
    with wave.open(os.path.join(BUILD, 'mix.wav'), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((mix[:int(total * SR)] * 32767).astype(np.int16).tobytes())
    print('build/mix.wav ok')


if __name__ == '__main__':
    main()
