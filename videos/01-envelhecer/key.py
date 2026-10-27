import sys, numpy as np
from PIL import Image, ImageFilter
src, dst = sys.argv[1], sys.argv[2]
im = np.asarray(Image.open(src).convert('RGB')).astype(np.float32)
r, g, b = im[..., 0], im[..., 1], im[..., 2]
d = g - np.maximum(r, b)                       # "greenness"
a = np.clip(1 - (d - 25) / 45, 0, 1)            # 25 -> opaque, 70 -> transparent
A = Image.fromarray((a * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
g2 = np.minimum(g, np.maximum(r, b) + 8)        # despill
out = np.dstack([r, g2, b, np.asarray(A, np.float32)]).astype(np.uint8)
o = Image.fromarray(out, 'RGBA'); o = o.crop(o.getbbox()); o.save(dst, optimize=True); print(dst, o.size)
