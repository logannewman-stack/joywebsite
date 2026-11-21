#!/usr/bin/env python3
"""Apply the shared color grade to every color photo the site references.

- Finds every "/photos/<name>.jpg" reference in src/ (excluding blur.json).
- Color = not a black-and-white twin ("-bw" in the name) and not already graded ("-g").
- Writes the graded copy as public/photos/<stem>-g.jpg, so image caches keyed by the URL
  can never serve the old version, then rewrites the references in src/.
- Prints the photos that are no longer referenced anywhere in src/, so they can be removed.

Usage: npm run photos:grade   (python3 scripts/apply_grade.py . [--dry-run])
Then run npm run photos:blur. Needs Python 3 with Pillow and NumPy.
"""
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from grade_photos import grade  # noqa: E402
from PIL import Image  # noqa: E402

repo = Path(sys.argv[1]).resolve()
dry = "--dry-run" in sys.argv
src = repo / "src"
photos = repo / "public" / "photos"
ref_re = re.compile(r"/photos/([A-Za-z0-9_.\-]+?\.jpe?g)")

files = [p for p in src.rglob("*") if p.suffix in (".ts", ".tsx", ".mjs", ".js") and p.name != "blur.json"]
dynamic = [str(p) for p in files if re.search(r"/photos/\$\{", p.read_text())]
if dynamic:
    print("WARNING: dynamic photo paths in", dynamic)

refs = set()
for p in files:
    refs.update(ref_re.findall(p.read_text()))

todo = sorted(r for r in refs if "-bw" not in r and not re.search(r"-g\.jpe?g$", r))
missing = [r for r in todo if not (photos / r).exists()]
if missing:
    sys.exit(f"missing files: {missing}")

mapping = {}
for name in todo:
    stem, ext = name.rsplit(".", 1)
    out = f"{stem}-g.{ext}"
    mapping[name] = out
    if not dry:
        im = Image.open(photos / name)
        icc = im.info.get("icc_profile")
        if icc and b"Display P3" in icc:
            print(f"WARNING: {name} is Display P3; convert to sRGB first")
        grade(im).save(photos / out, "JPEG", quality=86, optimize=True, progressive=True, subsampling="4:2:0")
    print(f"graded {name} -> {out}")

if not dry:
    for p in files:
        t = p.read_text()
        n = t
        for a, b in mapping.items():
            n = n.replace(f"/photos/{a}", f"/photos/{b}")
        if n != t:
            p.write_text(n)
            print("updated", p.relative_to(repo))

# Report photos that nothing references any more.
any_re = re.compile(r"/photos/([A-Za-z0-9_.\-]+?\.(?:jpe?g|png|webp|avif|svg))")
refs_after = set()
for p in files:
    refs_after.update(any_re.findall(p.read_text()))
readme = (repo / "README.md").read_text() if (repo / "README.md").exists() else ""
unused = sorted(f.name for f in photos.iterdir() if f.is_file() and f.name not in refs_after and f"/photos/{f.name}" not in readme)
print("UNREFERENCED:", " ".join(unused))
