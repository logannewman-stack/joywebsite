"""Step 2 of 2: trace the pen path of the Dr. Joy signature.

The opening curtain draws the wordmark the way a pen writes it. This script finds the
centreline of every stroke (a skeleton of the artwork), strings the pieces together in
handwriting order, measures the stroke's half-width along the way, sets the pen's pace,
and writes the packed result to src/components/chrome/signature-data.ts. The browser turns
that into small clipped pieces of the artwork that appear in order (signature.ts).

  node scripts/signature/raster.mjs public/brand/dr-joy-rdh-wordmark-cream.svg /tmp/script3.png
  python3 scripts/signature/trace.py /tmp/script3.png src/components/chrome/signature-data.ts

Needs numpy, pillow, scikit-image, scipy and networkx (not project dependencies; install them
anywhere). The stroke order below (DR, JOY) names edges of the skeleton graph of THIS artwork.
If the wordmark file ever changes, run with --graph out.png to see the new edge numbers and
rewrite the two lists; nothing else needs to change.

The same artwork is also held in src/app/styles/chrome.css as a data URI (the ink the pieces
show); --uri prints it for a changed file.
"""
import sys, json, re
import numpy as np
from PIL import Image, ImageDraw
from skimage.morphology import skeletonize
from scipy.ndimage import distance_transform_edt
import networkx as nx

SC = 3.0                    # raster pixels per SVG unit
VBX, VBY, VBW, VBH = 172, 133.2, 1357.2, 441.8   # the wordmark's cropped viewBox
STEP = 5.0                  # units between samples of the pen path
MARGIN = 2.2                # units added to the stroke's half-width, so the ink is fully covered
HMAX = 12.0                 # half-width (units) of the heaviest downstroke: the pen slows there

# Handwriting order. (edge, where it starts, kind): start is a node number, or for a loop that
# leaves and returns to one node a direction ('right', or 'steep' for the heavy downstroke).
# kind 'd' is drawn; 'r' is a stretch already inked that the pen passes over again (it takes no
# time); 'b' is a small side branch (a terminal, the top of a bowl) inked as the pen passes.
DR = [(37, 23, 'd'), (13, 19, 'd'), (14, 5, 'b'), (15, 5, 'd'), (10, 12, 'd'), (12, 4, 'd'), (11, 18, 'r'), (10, 4, 'r'),
      (4, 12, 'd'), (3, 1, 'd'), (6, 'right', 'd'), (3, 2, 'r'), (5, 1, 'd'), (19, 7, 'b'), (20, 7, 'd')]
JOY = [(24, 35, 'd'), (22, 9, 'd'), (38, 'steep', 'd'), (22, 22, 'r'), (23, 9, 'd'), (36, 17, 'd'), (1, 16, 'd'), (0, 0, 'd'),
       (9, 20, 'd'), (8, 3, 'd'), (7, 3, 'b'), (21, 8, 'b'), (2, 8, 'd'), (0, 0, 'r'), (32, 20, 'd'), (33, 14, 'b'),
       (29, 14, 'd'), (30, 13, 'b'), (31, 13, 'd'), (35, 21, 'd'), (34, 'steep', 'd'), (35, 15, 'r'), (18, 21, 'd'), (17, 6, 'd'), (16, 6, 'b')]
# When each part is written, as fractions of the writing time.
WINDOW = {'dr': (0.0, 0.405), 'joy': (0.485, 0.965)}
# The two dots are dabbed in: centre x, centre y, radius (units, from the file's own dots), time.
DOTS = [[747 + 6.5 - VBX, 410 + 7 - VBY, 9.5, 0.432], [879 + 9.5 - VBX, 279 + 9.5 - VBY, 12.5, 0.975]]
# The capitals R, D, H rise in while the last flourish passes above them: x, y, w, h (units), time.
CAPS = [[x - VBX - 3, y - VBY - 3, w + 6, h + 6, round(0.80 + 0.045 * i, 3)]
        for i, (x, y, w, h) in enumerate([(1222, 391, 67, 82), (1300, 391, 75, 82), (1387, 392, 75, 82)])]


def graph(im):
    """skeleton -> nodes (stroke ends and junctions) and edges (pixel chains between them)"""
    sk = skeletonize(im)
    ys, xs = np.nonzero(sk)
    pts = set(zip(ys.tolist(), xs.tolist()))
    n8 = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]
    def nbrs(p): return [(p[0] + dy, p[1] + dx) for dy, dx in n8 if (p[0] + dy, p[1] + dx) in pts]
    deg = {p: len(nbrs(p)) for p in pts}
    G = nx.Graph()
    for p in pts:
        for q in nbrs(p): G.add_edge(p, q)
    junc = {p for p in pts if deg[p] >= 3}; ends = {p for p in pts if deg[p] == 1}
    node_of, nodes = {}, []
    for c in (set(c) for c in nx.connected_components(G.subgraph(junc))):
        nodes.append(dict(kind='J', y=sum(p[0] for p in c) / len(c), x=sum(p[1] for p in c) / len(c), px=c))
        for p in c: node_of[p] = len(nodes) - 1
    for p in ends:
        nodes.append(dict(kind='E', y=p[0], x=p[1], px={p})); node_of[p] = len(nodes) - 1
    edges, seen = [], set()
    for nid, nd in enumerate(nodes):
        for p in nd['px']:
            for q in nbrs(p):
                if q in nd['px']: continue
                if q in node_of:
                    key = (min(p, q), max(p, q))
                    if key in seen: continue
                    seen.add(key); edges.append(dict(a=nid, b=node_of[q], path=[p, q])); continue
                if (p, q) in seen: continue
                path = [p, q]; prev, cur = p, q
                while True:
                    nxt = [r for r in nbrs(cur) if r != prev and r not in path[-3:]]
                    nn = [r for r in nxt if r in node_of]
                    if nn: path.append(nn[0]); break
                    if not nxt: break
                    nxt.sort(key=lambda r: abs(r[0] - cur[0]) + abs(r[1] - cur[1]))
                    prev, cur = cur, nxt[0]; path.append(cur)
                seen.add((p, q)); seen.add((path[-1], path[-2]))
                edges.append(dict(a=nid, b=node_of.get(path[-1], -1), path=path))
    return nodes, edges


def draw_graph(im, nodes, edges, out):
    import colorsys
    vis = Image.fromarray((im * 60).astype(np.uint8)).convert('RGB'); d = ImageDraw.Draw(vis)
    for i, e in enumerate(edges):
        col = tuple(int(c * 255) for c in colorsys.hsv_to_rgb((i * 0.137) % 1, 0.9, 1))
        for (y, x) in e['path']: d.rectangle([x - 1, y - 1, x + 1, y + 1], fill=col)
        my, mx = e['path'][len(e['path']) // 2]; d.text((mx + 6, my - 10), str(i), fill=col)
    for n, nd in enumerate(nodes):
        d.ellipse([nd['x'] - 6, nd['y'] - 6, nd['x'] + 6, nd['y'] + 6], outline=(255, 255, 255) if nd['kind'] == 'J' else (255, 60, 60), width=2)
        d.text((nd['x'] - 18, nd['y'] + 6), f'n{n}', fill=(255, 255, 255))
    vis.save(out)


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    src, out = args[0], args[1]
    im = np.array(Image.open(src).convert('L')) > 127
    dist = distance_transform_edt(im)
    nodes, edges = graph(im)
    if '--graph' in sys.argv:
        draw_graph(im, nodes, edges, sys.argv[sys.argv.index('--graph') + 1])

    def oriented(i, start=None, hint=None):
        e = edges[i]; p = list(e['path'])
        if e['a'] == e['b'] or hint:
            n = min(90, len(p) // 3)
            d = np.array(p[n], float) - np.array(p[0], float)        # (dy, dx) going forwards
            r = np.array(p[-1 - n], float) - np.array(p[-1], float)  # going backwards
            if hint == 'steep':
                return p if d[0] / (abs(d[1]) + 1e-6) > r[0] / (abs(r[1]) + 1e-6) else p[::-1]
            ok = {'down': d[0] > r[0], 'up': d[0] < r[0], 'right': d[1] > r[1], 'left': d[1] < r[1]}[hint]
            return p if ok else p[::-1]
        if e['a'] == start: return p
        if e['b'] == start: return p[::-1]
        raise SystemExit(f'edge {i} does not touch node {start}')

    def smooth(a, k):
        if len(a) < 3: return a
        k = min(k, (len(a) - 1) // 2 * 2 + 1)
        if k < 3: return a
        pad = k // 2
        ap = np.concatenate([np.repeat(a[:1], pad, 0), a, np.repeat(a[-1:], pad, 0)])
        return np.stack([np.convolve(ap[:, c], np.ones(k) / k, mode='valid') for c in range(a.shape[1])], 1)

    def polyline(pix):
        """pixel chain -> smoothed (x, y, half-width) in raster pixels"""
        a = np.array([(x, y, dist[y, x]) for y, x in pix], float)
        xy = smooth(a[:, :2], 9); xy[0], xy[-1] = a[0, :2], a[-1, :2]
        r = a[:, 2]; k = 7; pad = k // 2
        rp = np.concatenate([np.repeat(r[:1], pad), r, np.repeat(r[-1:], pad)])
        rmax = np.array([rp[i:i + k].max() for i in range(len(r))])
        return np.column_stack([xy, np.maximum(smooth(rmax[:, None], 9)[:, 0], rmax * 0.9)])

    def resample(P):
        seg = np.hypot(np.diff(P[:, 0]), np.diff(P[:, 1])); s = np.concatenate([[0], np.cumsum(seg)])
        if s[-1] < 1e-6: return P[:1].copy()
        t = np.linspace(0, s[-1], max(1, int(round(s[-1] / STEP))) + 1)
        return np.column_stack([np.interp(t, s, P[:, c]) for c in range(3)])

    def extend(P, at_start, at_end):
        """lengthen a path past its ends by its half-width, so round terminals are covered"""
        P = P.copy()
        if at_start and len(P) > 1:
            d = P[0, :2] - P[min(3, len(P) - 1), :2]; e = P[0].copy(); e[:2] += d / (np.hypot(*d) or 1) * (P[0, 2] + MARGIN); P = np.vstack([e, P])
        if at_end and len(P) > 1:
            d = P[-1, :2] - P[max(-4, -len(P)), :2]; e = P[-1].copy(); e[:2] += d / (np.hypot(*d) or 1) * (P[-1, 2] + MARGIN); P = np.vstack([P, e])
        return P

    def weights(Q):   # time a stretch takes: its length, slower where the stroke is heavy
        seg = np.hypot(np.diff(Q[:, 0]), np.diff(Q[:, 1]))
        return seg * (0.70 + 0.60 * np.minimum(1, (Q[:-1, 2] + Q[1:, 2]) / 2 / HMAX))

    def ease(u):      # the pen starts and stops gently
        return 0.82 * u + 0.18 * (u * u * (3 - 2 * u))

    lines, total = [], 0.0
    for name, ops in (('dr', DR), ('joy', JOY)):
        runs, cur, branches, drawn = [], [], [], 0
        for (i, st, kind) in ops:
            pix = oriented(i, st if isinstance(st, int) else None, st if isinstance(st, str) else None)
            if kind == 'b': branches.append((drawn, pix))
            elif kind == 'r':
                if cur: runs.append(cur); cur = []
            else: cur = cur + pix; drawn += len(pix)
        if cur: runs.append(cur)
        Q = []
        for pix in runs:
            q = resample(extend(polyline(pix) / SC, True, True)); q[:, 2] += MARGIN; Q.append(q)
        t0, t1 = WINDOW[name]
        ws = [weights(q) for q in Q]; wtot = sum(w.sum() for w in ws)
        total += sum(np.hypot(np.diff(q[:, 0]), np.diff(q[:, 1])).sum() for q in Q)
        acc, pix_acc, pix_map = 0.0, 0, []
        for q, w, pix in zip(Q, ws, runs):
            cum = np.concatenate([[0], np.cumsum(w)]) + acc
            T = t0 + (t1 - t0) * ease(cum / wtot)
            lines.append(np.column_stack([q, T]))
            pix_map.append((pix_acc, pix_acc + len(pix), T[0], T[-1])); acc = cum[-1]; pix_acc += len(pix)
        for at, pix in branches:
            q = resample(extend(polyline(pix) / SC, False, True)); q[:, 2] += MARGIN
            if len(q) < 2: continue
            tb = pix_map[-1][3]
            for (a, e, ta, te) in pix_map:
                if a <= at <= e: tb = ta + (te - ta) * ((at - a) / max(1, e - a)); break
            cum = np.concatenate([[0], np.cumsum(weights(q))])
            lines.append(np.column_stack([q, tb + (t1 - t0) * (cum / wtot)]))

    # pack: x, y in half units and time in 1/10000, as steps from the point before; one character each
    def ch(v):
        assert 0 <= v <= 89, v
        c = 35 + v
        if c >= 60: c += 1      # no '<'
        if c >= 92: c += 1      # no backslash
        return chr(c)
    packed = []
    for L in lines:
        x0, y0, t0 = round(L[0][0] * 2), round(L[0][1] * 2), round(L[0][3] * 1e4)
        x, y, t, s = x0, y0, t0, ''
        for p in L:
            nx_, ny_, nt = round(p[0] * 2), round(p[1] * 2), round(p[3] * 1e4)
            dt = max(0, nt - t)
            s += ch(nx_ - x + 44) + ch(ny_ - y + 44) + ch(round(p[2] * 4)) + ch(dt)
            x, y, t = nx_, ny_, t + dt
        packed.append([x0, y0, t0, s])
    data = dict(w=VBW, h=VBH, lines=packed, dots=[[round(v, 1) for v in d[:3]] + [d[3]] for d in DOTS],
                caps=[[round(v, 1) for v in c[:4]] + [c[4]] for c in CAPS])
    js = json.dumps(data, separators=(',', ':'))
    assert '<' not in js
    open(out, 'w').write(
        '/*\n * The pen path of the Dr. Joy signature: generated by scripts/signature/trace.py, do not edit by hand.\n'
        ' * lines: [x, y, time, steps]; x and y are in half units of the wordmark\'s viewBox, time in 1/10000 of the\n'
        ' * writing; steps holds four characters per point (step in x, step in y, half-width in quarter units,\n'
        ' * step in time). dots: [centre x, centre y, radius, time]. caps: [x, y, width, height, time].\n */\n'
        f'export const SIGNATURE_DATA = {json.dumps(js)};\n')
    print('pen path:', round(total), 'units in', len(packed), 'lines,', sum(len(p[3]) // 4 for p in packed), 'points,', len(js), 'bytes')

    # check: do the pieces the browser will make cover every inked pixel?
    cov = Image.new('L', (im.shape[1], im.shape[0]), 0); dr = ImageDraw.Draw(cov)
    for L in lines:
        P = np.asarray(L); n = len(P)
        d = np.zeros((n, 2)); d[1:-1] = P[2:, :2] - P[:-2, :2]; d[0] = P[1, :2] - P[0, :2]; d[-1] = P[-1, :2] - P[-2, :2]
        ln = np.hypot(d[:, 0], d[:, 1]); ln[ln == 0] = 1; nx_, ny_ = -d[:, 1] / ln, d[:, 0] / ln
        for i in range(0, n - 1, 3):
            idx = list(range(i, min(n - 1, i + 3) + 1))
            poly = [(P[k, 0] + nx_[k] * P[k, 2], P[k, 1] + ny_[k] * P[k, 2]) for k in idx] + [(P[k, 0] - nx_[k] * P[k, 2], P[k, 1] - ny_[k] * P[k, 2]) for k in reversed(idx)]
            dr.polygon([(x * SC, y * SC) for x, y in poly], fill=255)
    for cx, cy, r, _ in DOTS: dr.ellipse([(cx - r) * SC, (cy - r) * SC, (cx + r) * SC, (cy + r) * SC], fill=255)
    miss = im & ~(np.array(cov) > 0)
    print(f'ink not covered by the pieces: {100 * miss.sum() / im.sum():.3f}% (the whole artwork is laid over them at the end)')


def uri(svg_path):
    svg = open(svg_path).read()
    vb = re.search(r'viewBox="([^"]*)"', svg).group(1)
    fill = re.search(r'\.st1\s*{\s*fill:\s*(#[0-9a-fA-F]+)', svg).group(1)
    paths = ''.join('<path d="%s"/>' % re.sub(r'\s+', ' ', d).strip() for d in re.findall(r'<path[^>]* d="([^"]*)"', svg))
    mini = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" fill="{fill}">{paths}</svg>'
    print('data:image/svg+xml,' + mini.replace('%', '%25').replace('#', '%23').replace('"', "'").replace('<', '%3C').replace('>', '%3E'))


if __name__ == '__main__':
    if '--uri' in sys.argv: uri(sys.argv[sys.argv.index('--uri') + 1])
    else: main()
