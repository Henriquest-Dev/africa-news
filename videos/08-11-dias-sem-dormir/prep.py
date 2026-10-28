import sys, glob, os, numpy as np
from PIL import Image
K = sys.argv[1]; os.makedirs(f'{K}/frames', exist_ok=True)
PAPER = (250, 248, 242)
def bars(a):
    g = a.mean(-1); dark = g < 40
    top = 0
    while top < a.shape[0] // 2 and dark[top].mean() > .97: top += 1
    bot = a.shape[0]
    while bot > a.shape[0] // 2 and dark[bot - 1].mean() > .97: bot -= 1
    lef = 0
    while lef < a.shape[1] // 2 and dark[:, lef].mean() > .97: lef += 1
    rig = a.shape[1]
    while rig > a.shape[1] // 2 and dark[:, rig - 1].mean() > .97: rig -= 1
    return top, bot, lef, rig
for fa in sorted(glob.glob(f'{K}/img/s*a.jpg')):
    fb = fa.replace('a.jpg', 'b.jpg')
    if not os.path.exists(fb): continue
    A = np.asarray(Image.open(fa).convert('RGB')).astype(np.int16); B = np.asarray(Image.open(fb).convert('RGB').resize((A.shape[1], A.shape[0]))).astype(np.int16)
    out = []
    for X in (A, B):
        t, b, l, r = bars(X); X = X[t:b, l:r].copy()
        hh = X.shape[0]; e = max(4, int(hh * .05))
        for y in list(range(e)) + list(range(hh - e, hh)):
            if (X[y].mean(-1) < 225).mean() > .5: X[max(0, y - 2):y + 3] = 250
        out.append(X)
    # caixa comum de conteúdo (pixels não-brancos) nas duas poses
    h = min(o.shape[0] for o in out); w = min(o.shape[1] for o in out); out = [o[:h, :w] for o in out]
    ink = np.zeros((h, w), bool)
    for o in out: ink |= o.mean(-1) < 200
    ys, xs = np.nonzero(ink)
    if len(xs) == 0: y0, y1, x0, x1 = 0, h, 0, w
    else: y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    pad = 30; y0, x0 = max(0, y0 - pad), max(0, x0 - pad); y1, x1 = min(h, y1 + pad), min(w, x1 + pad)
    cw, ch = x1 - x0, y1 - y0; s = min(1640 / cw, 900 / ch, 2.4)
    for o, suf in zip(out, 'ab'):
        crop = Image.fromarray(np.clip(o[y0:y1, x0:x1], 0, 255).astype(np.uint8))
        # branco -> cor de papel
        arr = np.asarray(crop).astype(np.float32); wh = arr.mean(-1, keepdims=True) / 255
        arr = arr * (1 - wh ** 6) + np.array(PAPER) * (wh ** 6)
        crop = Image.fromarray(arr.astype(np.uint8)).resize((int(cw * s), int(ch * s)), Image.LANCZOS)
        cv = Image.new('RGB', (1920, 1080), PAPER); cv.paste(crop, ((1920 - crop.width) // 2, 70 + (940 - crop.height) // 2))
        cv.save(f"{K}/frames/{os.path.basename(fa)[:3]}{suf}.jpg", quality=88)
print('ok', len(glob.glob(f'{K}/frames/*.jpg')))
