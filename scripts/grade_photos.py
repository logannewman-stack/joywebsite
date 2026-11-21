#!/usr/bin/env python3
"""One shared grade for the site's color photographs.

Keeps the photos colorful but makes them read as one curated set that sits with
the ivory and blush palette:
  1. Calms violet and blue stage light (hues around 262 degrees). Skin (0-50
     degrees) and white or black clothing are left alone.
  2. Optional: lowers the saturation of the background only, using a subject
     mask (white = subject), for warm wood walls behind portraits.
  3. Finish: 8% less global saturation, the black point lifted about 3%, and a
     gentle neutral-warm white balance (gains capped at +/-3%).

Two optional steps calm photos that the shared grade alone leaves loud: sunlit
foliage, neon-teal gloves, a chartreuse laptop. Both are off by default, so a
photo graded without them comes out exactly as before.
  --foliage S   A second hue band, the same form as the stage band, centred on
                green (125 degrees, +/-60): foliage, teal and chartreuse lose up
                to S of their saturation. 0.45 matches the stage band.
  --ceiling C   Brings the finished photo's mean saturation down to C (0.30 is
                the top of the set) with one factor, never below a third, on the
                saturated hues outside skin (0-50 degrees). Skin and lips are
                never touched, muted colors barely move, and soft out-of-focus
                edges follow their neighbours instead of keeping a bright fringe.
Calmed colors keep the luma the shared grade gives them, so neon turns muted
rather than pastel. The photos graded this way end in -v2-g.jpg.

Usage:
  grade_photos.py IN.jpg OUT.jpg [--mask MASK.png] [--bg-sat 0.35] [--stage 0.45]
                  [--foliage 0.45] [--ceiling 0.30]
Grade from the ungraded crop, never from a -g file, so no photo is graded twice.
The input is never modified. Output is a progressive sRGB JPEG without metadata.
"""
import argparse

import numpy as np
from PIL import Image, ImageFilter


def _warm(h, top, edge):
    """1 for warm hues from 350 up to `top` degrees, 0 from `top + edge` to 340, soft between."""
    return np.maximum(np.clip((top + edge - h) / edge, 0.0, 1.0), np.clip((h - 340.0) / 10.0, 0.0, 1.0))


def _spread(a, size):
    """A 0..1 map spread over about 1% of the long edge, so soft edges stay soft."""
    img = Image.fromarray((np.clip(a, 0.0, 1.0) * 255.0 + 0.5).astype(np.uint8), "L")
    return np.asarray(img.filter(ImageFilter.GaussianBlur(max(size) / 100.0))).astype(np.float32) / 255.0


def _mean_sat(im):
    return float(np.asarray(im.convert("HSV"))[..., 1].mean()) / 255.0


def _white_share(h):
    """k in luma(s, v) = v * (1 - s * k) for an HSV color of hue h (Rec. 709 weights)."""
    k = 0.0
    for n, weight in ((5.0, 0.2126), (3.0, 0.7152), (1.0, 0.0722)):
        x = (n + h / 60.0) % 6.0
        k = k + weight * np.clip(np.minimum(x, 4.0 - x), 0.0, 1.0)
    return k


def grade(im, mask=None, bg_sat=None, stage=0.45, global_sat=0.92, black=0.03, foliage=0.0, ceiling=None):
    im = im.convert("RGB")
    hsv = np.asarray(im.convert("HSV")).astype(np.float32) / 255.0
    h, s, v = hsv[..., 0] * 360.0, hsv[..., 1], hsv[..., 2]

    # 1. Stage light: desaturate violet/blue only.
    w = np.clip(1.0 - np.abs(h - 262.0) / 58.0, 0.0, 1.0) ** 0.7
    s = s * (1.0 - stage * w)
    v = np.clip(v * (1.0 + 0.04 * w), 0.0, 1.0)

    # 1b. Optional: foliage, teal and chartreuse, the same form as the stage band.
    calm = None  # what the optional steps take off; the lightness is kept below
    if foliage:
        w = np.clip(1.0 - np.abs(h - 125.0) / 60.0, 0.0, 1.0) ** 0.7
        calm = 1.0 - foliage * w
        s = s * calm

    # 2. Background-only desaturation toward a target mean saturation.
    if mask is not None and bg_sat is not None:
        m = np.asarray(mask.convert("L").resize(im.size, Image.LANCZOS)).astype(np.float32) / 255.0
        bg = 1.0 - m
        cur = float((s * bg).sum() / max(bg.sum(), 1.0))
        if cur > bg_sat:
            factor = bg_sat / cur
            s = s * (m + bg * factor)

    # 3a. Global saturation.
    s = s * global_sat

    if calm is None and ceiling is None:
        return _finish(h, s, v, black)

    # Optional steps. Calmed colors keep the luma the shared grade alone gives them,
    # so neon turns muted, not pastel.
    k = _white_share(h)
    ref = s if calm is None else s / np.maximum(calm, 1e-6)

    def finish(c):
        sc = s * c
        return _finish(h, sc, np.clip(v * (1.0 - ref * k) / (1.0 - sc * k), 0.0, 1.0), black)

    out = finish(1.0)
    if ceiling is not None and _mean_sat(out) > ceiling:
        # The ceiling calms hues outside skin (0-50 degrees), more so the more saturated
        # they are (muted colors are not what reads as loud), spread over a few pixels
        # so a soft out-of-focus edge follows its neighbours instead of keeping a bright
        # fringe. Skin and lip hues (350-35 degrees) are never touched. A bisection finds
        # the one factor that brings the finished photo's mean saturation to the ceiling.
        reach = _spread((1.0 - _warm(h, 50.0, 3.0)) * np.clip((s - 0.1) / 0.3, 0.0, 1.0), im.size)
        core = _warm(h, 35.0, 5.0)

        def at(f):
            return finish(np.maximum(1.0 - (1.0 - f) * reach, core))

        lo, hi = 1.0 / 3.0, 1.0
        out = at(lo)
        if _mean_sat(out) < ceiling:
            for _ in range(10):
                mid = (lo + hi) / 2.0
                trial = at(mid)
                if _mean_sat(trial) <= ceiling:
                    lo, out = mid, trial
                else:
                    hi = mid
    return out


def _finish(h, s, v, black):
    out = np.stack([h / 360.0, s, v], axis=-1)
    rgb = np.asarray(Image.fromarray((np.clip(out, 0, 1) * 255.0 + 0.5).astype(np.uint8), "HSV").convert("RGB")).astype(np.float32) / 255.0

    # 3b. Neutral-warm white balance from near-neutral midtones, gains capped.
    lum = rgb.mean(axis=-1)
    sat = rgb.max(axis=-1) - rgb.min(axis=-1)
    sel = (sat < 0.08) & (lum > 0.25) & (lum < 0.85)
    if sel.sum() > 500:
        mean = rgb[sel].mean(axis=0)
        target = mean.mean() * np.array([1.012, 1.0, 0.988], dtype=np.float32)  # slightly warm
        gains = np.clip(target / np.maximum(mean, 1e-4), 0.97, 1.03)
        rgb = rgb * gains

    # 3c. Lift the black point.
    rgb = black + rgb * (1.0 - black)
    return Image.fromarray((np.clip(rgb, 0, 1) * 255.0 + 0.5).astype(np.uint8), "RGB")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("dst")
    ap.add_argument("--mask")
    ap.add_argument("--bg-sat", type=float)
    ap.add_argument("--stage", type=float, default=0.45)
    ap.add_argument("--foliage", type=float, default=0.0)
    ap.add_argument("--ceiling", type=float)
    a = ap.parse_args()
    im = Image.open(a.src)
    mask = Image.open(a.mask) if a.mask else None
    out = grade(im, mask=mask, bg_sat=a.bg_sat, stage=a.stage, foliage=a.foliage, ceiling=a.ceiling)
    out.save(a.dst, "JPEG", quality=86, optimize=True, progressive=True, subsampling="4:2:0")


if __name__ == "__main__":
    main()
