#!/usr/bin/env python3
"""把站点外壳生成图锁到色板、裁到规格尺寸并压进体积上限。

源图在 box 的生成目录（默认 /opt/cursor/artifacts/assets），不进仓库。
方印、竖印、时间轴节点由程序绘制：生成图里的印章字不能用。
透明底素材先在纸白上生成，再按亮度抠成 alpha。
"""
import argparse
from io import BytesIO
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

PAL = np.array([
    (0x14, 0x14, 0x14),
    (0x3A, 0x3A, 0x3A),
    (0x6E, 0x6E, 0x6C),
    (0xA8, 0xA8, 0xA4),
    (0xD2, 0xD1, 0xCC),
    (0xEC, 0xEA, 0xE4),
], dtype=np.float32)
RED = np.array([0xB3, 0x24, 0x1C], dtype=np.float32)
PAPER = (0xEC, 0xEA, 0xE4)
INK = (0x14, 0x14, 0x14)


def lock_palette(im, red_cap=0.10):
    arr = np.asarray(im.convert("RGB"), dtype=np.float32)
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    mx = np.maximum(np.maximum(r, g), b)
    mn = np.minimum(np.minimum(r, g), b)
    redish = (r > g + 18) & (r > b + 18) & ((mx - mn) > 28) & (r > 70)
    lum = 0.299 * r + 0.587 * g + 0.114 * b
    greys = 0.299 * PAL[:, 0] + 0.587 * PAL[:, 1] + 0.114 * PAL[:, 2]
    idx = np.abs(lum[:, :, None] - greys[None, None, :]).argmin(axis=2)
    out = PAL[idx]
    if redish.any():
        cap = int(red_cap * redish.size)
        score = np.where(redish, (r - g) + (r - b), -1)
        if int(redish.sum()) > cap and cap > 0:
            thresh = np.partition(score.ravel(), -cap)[-cap]
            redish = score >= thresh
        elif cap <= 0:
            redish = np.zeros_like(redish)
        out[redish] = RED
    return Image.fromarray(out.astype(np.uint8), "RGB")


def stretch_ink(im, gain=2.2):
    """把略深于纸白的像素再拉开，避免淡山脊、纸纤维被锁进纸白。"""
    arr = np.asarray(im.convert("RGB"), dtype=np.float32)
    lum = 0.299 * arr[:, :, 0] + 0.587 * arr[:, :, 1] + 0.114 * arr[:, :, 2]
    paper = 236.0
    dist = np.clip(paper - lum, 0, None)
    new_lum = np.clip(paper - dist * gain, 0, 255)
    scale = np.ones_like(lum)
    nz = lum > 1
    scale[nz] = new_lum[nz] / np.maximum(lum[nz], 1)
    return Image.fromarray(np.clip(arr * scale[:, :, None], 0, 255).astype(np.uint8), "RGB")


def blank_seal_glyphs(im):
    """印面里的字涂成朱砂，只留边缘残缺。生成图里的印章字不能进站点。"""
    arr = np.asarray(im.convert("RGB")).copy()
    r = arr[:, :, 0].astype(np.int16)
    g = arr[:, :, 1].astype(np.int16)
    b = arr[:, :, 2].astype(np.int16)
    red = (r > 150) & (g < 110) & (b < 110)
    if int(red.sum()) < 40:
        return im
    ys, xs = np.where(red)
    y0, y1, x0, x1 = int(ys.min()), int(ys.max()), int(xs.min()), int(xs.max())
    h, w = y1 - y0, x1 - x0
    if h < 10 or w < 10:
        return im
    if max(h, w) / max(1, min(h, w)) > 2.4:
        return im  # 细红边不是印面
    py, px = max(2, int(h * 0.12)), max(2, int(w * 0.12))
    yA, yB, xA, xB = y0 + py, y1 - py, x0 + px, x1 - px
    if yB <= yA or xB <= xA:
        return im
    arr[yA:yB, xA:xB] = np.array([179, 36, 28], dtype=np.uint8)
    return Image.fromarray(arr, "RGB")


def cover(im, tw, th, fx=0.5, fy=0.5):
    sw, sh = im.size
    scale = max(tw / sw, th / sh)
    nw, nh = max(tw, int(round(sw * scale))), max(th, int(round(sh * scale)))
    im = im.resize((nw, nh), Image.Resampling.LANCZOS)
    left = max(0, min(nw - tw, int(fx * nw) - tw // 2))
    top = max(0, min(nh - th, int(fy * nh) - th // 2))
    return im.crop((left, top, left + tw, top + th))


def knockout(im, hi=226, lo=170):
    arr = np.asarray(im.convert("RGB"), dtype=np.float32)
    lum = arr.mean(axis=2)
    alpha = np.clip((hi - lum) / (hi - lo) * 255.0, 0, 255).astype(np.uint8)
    rgba = np.dstack([arr.astype(np.uint8), alpha])
    return Image.fromarray(rgba, "RGBA")


def save_rgb(im, dest, budget):
    dest = Path(dest)
    webp = dest.with_suffix(".webp")
    jpg = dest.with_suffix(".jpg")
    blob = None
    for q in (80, 72, 64, 56, 48, 40, 32, 24, 18):
        buf = BytesIO()
        im.save(buf, "WEBP", quality=q, method=6)
        blob = buf.getvalue()
        if len(blob) <= budget:
            break
    webp.write_bytes(blob)
    jblob = None
    for q in (80, 70, 60, 50, 40, 32):
        buf = BytesIO()
        im.save(buf, "JPEG", quality=q, optimize=True, progressive=True)
        jblob = buf.getvalue()
        if len(jblob) <= budget:
            break
    jpg.write_bytes(jblob)
    return webp.stat().st_size, jpg.stat().st_size


def save_alpha(im, dest, budget):
    dest = Path(dest)
    webp = dest.with_suffix(".webp")
    png = dest.with_suffix(".png")
    blob = None
    for q in (80, 70, 60, 50, 40, 30):
        buf = BytesIO()
        im.save(buf, "WEBP", quality=q, method=6, lossless=False)
        blob = buf.getvalue()
        if len(blob) <= budget:
            break
    webp.write_bytes(blob)
    # 兜底 png：尽量小，预算给 webp；png 只保证能 file:// 打开
    qim = im.quantize(colors=32, method=Image.Quantize.FASTOCTREE)
    buf = BytesIO()
    qim.save(buf, "PNG", optimize=True)
    png.write_bytes(buf.getvalue())
    return webp.stat().st_size, png.stat().st_size


def chipped_seal(w, h, seed=3):
    rng = np.random.default_rng(seed)
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    m = max(4, int(min(w, h) * 0.06))
    pts = []
    steps = 28
    for i in range(steps):
        t = i / steps
        side = int(t * 4)
        u = (t * 4) - side
        j = int(rng.integers(-m, m + 1))
        if side == 0:
            pts.append((m + u * (w - 2 * m) + j * 0.3, m + j * 0.4))
        elif side == 1:
            pts.append((w - m + j * 0.4, m + u * (h - 2 * m) + j * 0.2))
        elif side == 2:
            pts.append((w - m - u * (w - 2 * m) + j * 0.2, h - m + j * 0.4))
        else:
            pts.append((m + j * 0.3, h - m - u * (h - 2 * m) + j * 0.2))
    draw.polygon(pts, fill=(*RED.astype(int).tolist(), 255))
    # 印泥不均匀：抹掉几个小缺口
    for _ in range(6):
        cx = int(rng.integers(0, w))
        cy = int(rng.integers(0, h))
        rw = int(rng.integers(m, m * 3))
        rh = int(rng.integers(m // 2, m * 2))
        if rng.random() < 0.5:
            cx = 0 if rng.random() < 0.5 else w
        else:
            cy = 0 if rng.random() < 0.5 else h
        draw.ellipse((cx - rw, cy - rh, cx + rw, cy + rh), fill=(0, 0, 0, 0))
    return img


def ink_dots():
    """192×64，三格：墨 / 墨 / 朱砂。只许 #141414、#eceae4、#b3241c，不画晕。"""
    img = Image.new("RGBA", (192, 64), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    colors = [(0x14, 0x14, 0x14, 255), (0x14, 0x14, 0x14, 255), (0xB3, 0x24, 0x1C, 255)]
    radii = [7, 9, 9]
    for i, (c, r) in enumerate(zip(colors, radii)):
        cx, cy = 32 + i * 64, 32
        draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=c)
    return img


def prep_photo(src, size, focus, out, budget, alpha=False, red_cap=0.10, faint=0.0, gain=1.0, wipe_seal=False):
    im = Image.open(src).convert("RGB")
    im = cover(im, *size, *focus)
    if gain != 1.0:
        im = stretch_ink(im, gain)
    im = lock_palette(im, red_cap=red_cap)
    if wipe_seal:
        im = blank_seal_glyphs(im)
    if faint:
        paper = Image.new("RGB", im.size, PAPER)
        im = Image.blend(im, paper, faint)
    if alpha:
        return save_alpha(knockout(im), out, budget)
    return save_rgb(im, out, budget)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", type=Path, default=Path("/opt/cursor/artifacts/assets"))
    ap.add_argument("--out", type=Path, default=Path("video/viewer/assets"))
    args = ap.parse_args()
    out = args.out
    out.mkdir(parents=True, exist_ok=True)
    src = args.src
    jobs = []

    def photo(name, file, size, focus, budget, **kw):
        sizes = prep_photo(src / file, size, focus, out / name, budget, **kw)
        jobs.append((name, size, budget, sizes))

    photo("hero-fenghuo-wide", "hero-fenghuo-wide.jpg", (2400, 1000), (0.72, 0.48), 220_000, red_cap=0.08)
    # 退役：hero-fenghuo-m、paper-fiber、fenghuo-hero、ink-blot-corner。不要再跑回写。
    # paper-ink-stains 留下，build-chapter-video.py 片头卡还在读。
    photo("pian-zhanchang", "pian-zhanchang.jpg", (800, 1000), (0.5, 0.55), 70_000, red_cap=0.08)
    photo("pian-zhiguo", "pian-zhiguo-blank.jpg", (800, 1000), (0.5, 0.45), 70_000, red_cap=0.09, wipe_seal=True)
    photo("pian-renwu", "pian-renwu.jpg", (800, 1000), (0.48, 0.45), 70_000, red_cap=0.06)
    photo("pian-dili", "pian-dili.jpg", (800, 1000), (0.5, 0.5), 70_000, red_cap=0.04)
    photo("banner-zhanchang", "banner-zhanchang.jpg", (2400, 600), (0.78, 0.55), 130_000, red_cap=0.08)
    photo("banner-zhiguo", "banner-zhiguo.jpg", (2400, 600), (0.72, 0.5), 130_000, red_cap=0.08, wipe_seal=True)
    photo("banner-renwu", "banner-renwu.jpg", (2400, 600), (0.75, 0.55), 130_000, red_cap=0.05)
    photo("banner-dili", "banner-dili.jpg", (2400, 600), (0.72, 0.62), 130_000, red_cap=0.04)
    photo("divider-brush", "divider-brush.jpg", (1200, 40), (0.5, 0.5), 12_000, alpha=True, red_cap=0.0)
    photo("divider-mountain", "divider-mountain.jpg", (2400, 120), (0.5, 0.55), 35_000, alpha=True, red_cap=0.0, gain=3.2)
    photo("btn-ink", "btn-ink.jpg", (480, 96), (0.5, 0.5), 12_000, alpha=True, red_cap=0.0)
    photo("timeline-rod", "timeline-rod.jpg", (2400, 24), (0.5, 0.5), 16_000, alpha=True, red_cap=0.0)
    photo("empty-ink-boat", "empty-ink-boat.jpg", (600, 360), (0.5, 0.55), 30_000, alpha=True, red_cap=0.02)
    photo("loading-ink-drop", "loading-ink-drop.jpg", (256, 256), (0.5, 0.5), 12_000, alpha=True, red_cap=0.0)
    photo("footer-mountains", "footer-mountains.jpg", (2400, 200), (0.5, 0.78), 40_000, alpha=True, red_cap=0.0, gain=2.6)

    sw, sp = save_alpha(chipped_seal(256, 256, 3), out / "seal-frame-square", 18_000)
    jobs.append(("seal-frame-square", (256, 256), 18_000, (sw, sp)))
    tw, tp = save_alpha(chipped_seal(128, 256, 9), out / "seal-frame-tall", 14_000)
    jobs.append(("seal-frame-tall", (128, 256), 14_000, (tw, tp)))
    nw, npng = save_alpha(ink_dots(), out / "timeline-node", 8_000)
    jobs.append(("timeline-node", (192, 64), 8_000, (nw, npng)))

    over = False
    for name, size, budget, (a, b) in jobs:
        flag = ""
        if a > budget:
            flag = " OVER webp"
            over = True
        print(f"{name:22} {size[0]}x{size[1]:4}  webp {a/1024:6.1f} KB  pair {b/1024:6.1f} KB  cap {budget/1024:.0f}{flag}")
    if over:
        raise SystemExit("webp over budget")


if __name__ == "__main__":
    main()
