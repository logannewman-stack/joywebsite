"""Black-and-white twin of a color portrait (the srcBw files).

Usage: npm run photos:bw -- public/photos/<name>-g.jpg public/photos/<name>-bw.jpg

Red/green-weighted channel mix keeps skin luminous and textured; a gentle
S-curve adds depth without crushing the black suit; blacks are lifted a touch
so dark fabric keeps separation from dark backgrounds."""
import sys
import numpy as np
from PIL import Image
def to_bw(src, dst, mix=(0.42, 0.46, 0.12), black=10, contrast=0.18):
    im = Image.open(src).convert("RGB")
    a = np.asarray(im).astype(np.float32) / 255.0
    l = a[..., 0] * mix[0] + a[..., 1] * mix[1] + a[..., 2] * mix[2]
    # gentle S-curve around mid grey
    l = l + contrast * (l - 0.5) * (1 - np.abs(2 * l - 1))
    l = np.clip(l, 0, 1)
    # lift blacks so black fabric keeps detail
    lo = black / 255.0
    l = lo + l * (1 - lo)
    out = Image.fromarray((l * 255 + 0.5).astype(np.uint8), "L")
    out.save(dst, quality=88, optimize=True, progressive=True)
if __name__ == "__main__":
    to_bw(sys.argv[1], sys.argv[2])
