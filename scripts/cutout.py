"""Removes the background from a portrait, for photographs set straight on black or white.

Usage:  python3 -I scripts/cutout.py <model.onnx> <photo.jpg> <cutout.png>

The matte comes from BiRefNet (portrait weights). Its edge is then refined to
the full-resolution photograph with a guided filter, and the colours along
the edge are cleaned of the old background (blur-fusion foreground
estimation), so hair and thin jewellery stay and no halo shows on black.

Needs onnxruntime, opencv-python-headless and NumPy (not project
dependencies), and the model file (about 930 MB, not kept in the repository):
https://github.com/danielgatis/rembg/releases/download/v0.0.0/BiRefNet-portrait-epoch_150.onnx

Start from the graded photograph (a `-g.jpg` file) so the cut-out matches the
set. Afterwards crop the PNG to the figure, leaving the frame's foot as the
cut-out's foot, and save it to public/photos as WebP with its transparency
(quality about 92). Give the photo slot `treatment: "cutout"` and its frame
the cut-out's own proportions. Check the result on the colour it will stand
on before using it: hair edge, earrings, hands."""
import sys
import numpy as np, cv2, onnxruntime as ort
model, src, dst = sys.argv[1:4]
img = cv2.imread(src, cv2.IMREAD_COLOR)[:, :, ::-1].astype(np.float32) / 255.0  # RGB 0..1
h, w = img.shape[:2]
x = cv2.resize(img, (1024, 1024), interpolation=cv2.INTER_AREA)
x = (x - np.array([0.485, 0.456, 0.406], np.float32)) / np.array([0.229, 0.224, 0.225], np.float32)
x = x.transpose(2, 0, 1)[None].astype(np.float32)
so = ort.SessionOptions(); so.intra_op_num_threads = 4
sess = ort.InferenceSession(model, so, providers=["CPUExecutionProvider"])
out = sess.run(None, {sess.get_inputs()[0].name: x})[-1]
m = 1.0 / (1.0 + np.exp(-out[0, 0]))
m = (m - m.min()) / (m.max() - m.min() + 1e-8)
a = cv2.resize(m, (w, h), interpolation=cv2.INTER_LINEAR).astype(np.float32)

def guided(I, p, r, eps):
    box = lambda v: cv2.boxFilter(v, -1, (2 * r + 1, 2 * r + 1))
    mI, mp = box(I), box(p)
    cov = box(I * p) - mI * mp; var = box(I * I) - mI * mI
    A = cov / (var + eps); B = mp - A * mI
    return box(A) * I + box(B)

# Refine only the uncertain band, guided by the photograph's own edges (each colour channel, averaged).
band = ((a > 0.02) & (a < 0.98)).astype(np.float32)
band = cv2.dilate(band, np.ones((9, 9), np.uint8))
ref = np.mean([guided(img[:, :, c], a, 6, 1e-4) for c in range(3)], axis=0)
a = np.clip(np.where(band > 0, ref, a), 0, 1)
a = np.clip((a - 0.04) / 0.92, 0, 1)  # close near-zero haze and near-one pinholes

def fuse(I, F, B, a, r):
    k = (2 * r + 1, 2 * r + 1); a3 = a[:, :, None]
    ba = cv2.blur(a, k)[:, :, None]
    bF = cv2.blur(F * a3, k) / (ba + 1e-5)
    bB = cv2.blur(B * (1 - a3), k) / ((1 - ba) + 1e-5)
    F2 = np.clip(bF + a3 * (I - a3 * bF - (1 - a3) * bB), 0, 1)
    return F2, bB
F, B = fuse(img, img, img, a, 45)
F, _ = fuse(img, F, B, a, 4)
rgba = np.dstack([F[:, :, ::-1], a[:, :, None]])  # BGRA
cv2.imwrite(dst, np.round(rgba * 255).astype(np.uint8))
print(dst, w, h, 'alpha mean', float(a.mean()))
