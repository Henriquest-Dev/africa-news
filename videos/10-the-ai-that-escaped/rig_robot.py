import sys, json, numpy as np
from PIL import Image, ImageDraw, ImageFilter
A = sys.argv[1]
R = {
 'robot': dict(neck=(468,206), torso=[(330,0),(600,0),(600,240),(580,272),(580,952),(338,952),(338,272),(330,240)],
   L=dict(S=(350,300),E=(228,312),W=(104,304),T=(12,308)), Rr=dict(S=(580,296),E=(696,300),W=(824,276),T=(912,264))),
}
def segdist(P, a, b):
    a = np.array(a, float); b = np.array(b, float); ab = b - a; t = np.clip(((P - a) @ ab) / (ab @ ab), 0, 1)
    return np.linalg.norm(P - (a + t[..., None] * ab), axis=-1)
def disc(shape, c, r):
    yy, xx = np.mgrid[:shape[0], :shape[1]]; return (xx - c[0]) ** 2 + (yy - c[1]) ** 2 <= r * r
def poly(shape, pts):
    m = Image.new('L', (shape[1], shape[0]), 0); ImageDraw.Draw(m).polygon(pts, fill=255); return np.asarray(m) > 0
def keep_main(mask, seed):
    ys, xs = np.nonzero(mask)
    if not len(xs): return mask
    i = np.argmin((xs - seed[0]) ** 2 + (ys - seed[1]) ** 2)
    m = Image.fromarray((mask * 255).astype(np.uint8)).copy(); ImageDraw.floodfill(m, (int(xs[i]), int(ys[i])), 128)
    return np.asarray(m) == 128
def save(name, src, mask, border=6):
    al = Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(.6))
    edge = al.filter(ImageFilter.MaxFilter(border * 2 + 1)).filter(ImageFilter.GaussianBlur(1))
    out = Image.new('RGBA', al.size, (0, 0, 0, 0)); out.paste(Image.new('RGBA', al.size, (250, 245, 232, 255)), (0, 0), edge)
    fg = np.asarray(src).copy(); fg[..., 3] = np.asarray(al); out.alpha_composite(Image.fromarray(fg)); out.save(f'{A}/{name}.png', optimize=True)
meta = {}
for n, c in R.items():
    im = Image.open(f'{A}/{n}.png').convert('RGBA'); src = np.asarray(im); H, W = src.shape[:2]
    fig = src[..., 3] > 110
    yy, xx = np.mgrid[:H, :W]; P = np.dstack([xx, yy]).astype(float)
    tor = poly((H, W), c['torso']); headR = (yy < c['neck'][1]) & fig
    arm = fig & ~tor & ~headR
    pieces = {}
    for side, j in (('L', c['L']), ('R', c['Rr'])):
        half = (xx < c['neck'][0]) if side == 'L' else (xx >= c['neck'][0])
        a = arm & half
        du = segdist(P, j['S'], j['E']); df = np.minimum(segdist(P, j['E'], j['W']), segdist(P, j['W'], j['T']))
        up = a & (du <= df); fo = a & (df < du)
        rS = 34; rE = 30
        up = up | (fig & disc((H, W), j['S'], rS)) | (a & disc((H, W), j['E'], rE))       # ponta redonda no ombro e no cotovelo
        fo = fo | (a & disc((H, W), j['E'], rE))
        mid = lambda a, b: ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)
        pieces[f'up{side}'] = keep_main(up, mid(j['S'], j['E'])); pieces[f'fo{side}'] = keep_main(fo, mid(j['E'], j['W']))
    head = headR | (fig & disc((H, W), c['neck'], 30) & (yy < c['neck'][1] + 26))
    torso = keep_main(fig & ~arm & ~headR, (c['neck'][0], c['neck'][1] + 300))
    head = keep_main(head, (c['neck'][0], c['neck'][1] - 60))
    save(f'{n}_torso', src, torso); save(f'{n}_head', src, head)
    for k, m in pieces.items(): save(f'{n}_{k}', src, m)
    meta[n] = dict(size=[W, H], neck=c['neck'], L=c['L'], R=c['Rr'])
json.dump(meta, open(f'{A}/rigs.json', 'w')); print(json.dumps(meta))
