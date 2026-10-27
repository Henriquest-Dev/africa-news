import sys, numpy as np
from PIL import Image, ImageDraw
A = sys.argv[1]
def fade_bottom(n, frac=.28, desat=0.0):
    im = Image.open(f'{A}/{n}.png').convert('RGBA'); a = np.asarray(im).astype(np.float32)
    h = a.shape[0]; y = np.arange(h)[:, None]; f = np.clip((h - y) / (h * frac), 0, 1)
    a[..., 3] *= f
    if desat:
        g = a[..., :3].mean(-1, keepdims=True); a[..., :3] = a[..., :3] * (1 - desat) + g * desat
    Image.fromarray(a.astype(np.uint8)).save(f'{A}/{n}_f.png')
fade_bottom('old_woman', .22, .35); fade_bottom('young', .3); fade_bottom('woman_smile', .3); fade_bottom('scream', .2)
# halftone do grito
im = Image.open(f'{A}/scream.png').convert('RGBA'); W, H = im.size
g = np.asarray(im.convert('L')).astype(np.float32) / 255; al = np.asarray(im)[..., 3]
out = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(out); c = 7
for y in range(0, H, c):
    for x in range(0, W, c):
        if al[min(H-1, y + c//2), min(W-1, x + c//2)] < 128: continue
        v = g[y:y+c, x:x+c].mean(); r = (1 - v) * c * .75
        d.rectangle([x, y, x + c, y + c], fill=(236, 226, 210, 255))
        if r > .4: d.ellipse([x + c/2 - r, y + c/2 - r, x + c/2 + r, y + c/2 + r], fill=(20, 12, 12, 255))
out.save(f'{A}/scream_ht.png')
# grelhas para coordenadas
for n in ['old_woman', 'microscope']:
    im = Image.open(f'{A}/{n}.png').convert('RGBA'); bg = Image.new('RGBA', im.size, (120, 20, 25, 255)); bg.alpha_composite(im); d = ImageDraw.Draw(bg)
    for x in range(0, im.width, 50): d.line([x, 0, x, im.height], fill=(255, 255, 0, 120)); d.text((x + 2, 2), str(x), fill=(255, 255, 0, 255))
    for y in range(0, im.height, 50): d.line([0, y, im.width, y], fill=(0, 255, 255, 120)); d.text((2, y + 2), str(y), fill=(0, 255, 255, 255))
    bg.convert('RGB').save(f'{A}/../grid_{n}.png')
for n in ['old_woman_f','young_f','woman_smile_f','skull','cosmetics','man','scream_ht','piggy','coin','microscope','heart']:
    im = Image.open(f'{A}/{n}.png'); print(n, im.size)
