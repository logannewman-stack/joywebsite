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

Usage:
  grade_photos.py IN.jpg OUT.jpg [--mask MASK.png] [--bg-sat 0.35] [--stage 0.45]
The input is never modified. Output is a progressive sRGB JPEG without metadata.
"""
import argparse

import numpy as np
from PIL import Image


def grade(im, mask=None, bg_sat=None, stage=0.45, global_sat=0.92, black=0.03):
    im = im.convert("RGB")
    hsv = np.asarray(im.convert("HSV")).astype(np.float32) / 255.0
    h, s, v = hsv[..., 0] * 360.0, hsv[..., 1], hsv[..., 2]

    # 1. Stage light: desaturate violet/blue only.
    w = np.clip(1.0 - np.abs(h - 262.0) / 58.0, 0.0, 1.0) ** 0.7
    s = s * (1.0 - stage * w)
    v = np.clip(v * (1.0 + 0.04 * w), 0.0, 1.0)

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
    a = ap.parse_args()
    im = Image.open(a.src)
    mask = Image.open(a.mask) if a.mask else None
    out = grade(im, mask=mask, bg_sat=a.bg_sat, stage=a.stage)
    out.save(a.dst, "JPEG", quality=86, optimize=True, progressive=True, subsampling="4:2:0")


if __name__ == "__main__":
    main()
