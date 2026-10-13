#!/usr/bin/env python3
"""用 Natural Earth 几何加水墨素材合成 21 张朝代地图。

几何来自 video/data/maps/basemap 与 territory。素材在 video/data/maps/sprites。
不烘焙文字。不成 AI 风格化，所以不做河流遮罩 IoU。
"""
import json
from io import BytesIO
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
MAPS = ROOT / "data" / "maps"
OUT = ROOT / "viewer" / "assets" / "maps"
SPRITE = MAPS / "sprites"
SRC = Path("/opt/cursor/artifacts/assets")

W, H = 1600, 1000
PAPER = (0xEC, 0xEA, 0xE4, 255)
LAND = (0xD2, 0xD1, 0xCC, 255)
TERR = (0xA8, 0xA8, 0xA4, 88)
RIVER = (0x6E, 0x6E, 0x6C, 255)
INK = (0x14, 0x14, 0x14, 255)

# 手标的山、沙、泽，只作摆放，不是地形数据。
RANGES = [
    (108.6, 33.9, 0, 280),
    (113.6, 37.4, 1, 240),
    (110.2, 31.4, 2, 220),
    (118.0, 27.4, 3, 200),
    (103.2, 29.6, 4, 260),
    (116.4, 40.7, 5, 180),
    (87.2, 43.0, 6, 300),
    (82.0, 36.2, 7, 280),
]
DESERT = (84.5, 39.4)
MARSH = (112.8, 29.2)
WALL = {
    "qin": [(106.2, 37.6), (111.0, 38.8), (116.2, 40.4)],
    "xihan": [(104.5, 38.2), (110.2, 39.2), (116.8, 40.8)],
    "donghan": [(107.0, 37.8), (112.4, 39.4)],
    "sui": [(106.0, 37.5), (112.0, 39.6), (117.5, 40.6)],
    "tang": [(104.0, 38.0), (111.5, 39.5), (117.0, 40.7)],
    "ming": [(105.5, 37.4), (111.8, 39.2), (117.2, 40.5)],
    "qing": [(104.8, 38.0), (112.0, 39.6), (117.4, 40.6)],
}


def project(frame):
    lat0 = (frame["south"] + frame["north"]) / 2 * np.pi / 180
    cos = float(np.cos(lat0))
    west, east = frame["west"], frame["east"]
    south, north = frame["south"], frame["north"]
    w = (east - west) * cos
    h = north - south
    aspect = w / h
    if aspect > 1.6:
        pad = (w / 1.6 - h) / 2
        south -= pad
        north += pad
    else:
        pad = (h * 1.6 / cos - (east - west)) / 2
        west -= pad
        east += pad
    return west, east, south, north


def to_px(box, lon, lat, w=W, h=H):
    west, east, south, north = box
    x = (lon - west) / (east - west) * w
    y = (north - lat) / (north - south) * h
    return x, y


def pip(lon, lat, ring):
    inside = False
    j = len(ring) - 1
    for i, (xi, yi) in enumerate(ring):
        xj, yj = ring[j]
        if ((yi > lat) != (yj > lat)) and (lon < (xj - xi) * (lat - yi) / ((yj - yi) or 1e-9) + xi):
            inside = not inside
        j = i
    return inside


def on_land(lon, lat, rings):
    for ring in rings:
        xs = [p[0] for p in ring]
        ys = [p[1] for p in ring]
        if lon < min(xs) or lon > max(xs) or lat < min(ys) or lat > max(ys):
            continue
        if pip(lon, lat, ring):
            return True
    return False


def knockout(im):
    arr = np.asarray(im.convert("RGB"), dtype=np.float32)
    lum = 0.299 * arr[:, :, 0] + 0.587 * arr[:, :, 1] + 0.114 * arr[:, :, 2]
    paper = 236.0
    dist = np.clip(paper - lum, 0, None)
    lum2 = np.clip(paper - dist * 1.8, 0, 255)
    alpha = np.clip((228 - lum2) / (228 - 150) * 255.0, 0, 255).astype(np.uint8)
    # 去掉偏色，只留灰
    g = lum2.astype(np.uint8)
    rgba = np.dstack([g, g, g, alpha])
    out = Image.fromarray(rgba, "RGBA")
    bbox = out.getchannel("A").point(lambda a: 255 if a > 18 else 0).getbbox()
    if bbox:
        out = out.crop(bbox)
    return out


def fit(im, tw, th):
    im = im.copy()
    im.thumbnail((tw, th), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
    canvas.paste(im, ((tw - im.width) // 2, (th - im.height) // 2), im)
    return canvas


def procedural_wall(w, h, double=False):
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    m = max(6, int(min(w, h) * 0.16))
    width = max(4, w // 16)
    d.rectangle([m, m, w - m - 1, h - m - 1], outline=INK, width=width)
    if double:
        inset = m + width + 4
        d.rectangle([inset, inset, w - inset - 1, h - inset - 1], outline=INK, width=max(3, width - 2))
    gap = max(8, w // 10)
    mid_x, mid_y = w // 2, h // 2
    for box in (
        (mid_x - gap // 2, m - 2, mid_x + gap // 2, m + width + 2),
        (mid_x - gap // 2, h - m - width - 2, mid_x + gap // 2, h - m + 2),
        (m - 2, mid_y - gap // 2, m + width + 2, mid_y + gap // 2),
        (w - m - width - 2, mid_y - gap // 2, w - m + 2, mid_y + gap // 2),
    ):
        d.rectangle(box, fill=(0, 0, 0, 0))
    return im


def paper_tile():
    rng = np.random.default_rng(7)
    arr = np.full((320, 512, 4), 0, dtype=np.uint8)
    noise = rng.normal(0, 4, (320, 512))
    base = 236 + noise
    yy = np.linspace(0, 1, 320)[:, None]
    xx = np.linspace(0, 1, 512)[None, :]
    edge = np.clip(1 - np.minimum(np.minimum(xx, 1 - xx), np.minimum(yy, 1 - yy)) * 8, 0, 1)
    base = base - edge * 18
    g = np.clip(base, 180, 245).astype(np.uint8)
    arr[:, :, 0] = arr[:, :, 1] = arr[:, :, 2] = g
    arr[:, :, 3] = 255
    return Image.fromarray(arr, "RGBA")


def prepare_sprites():
    SPRITE.mkdir(parents=True, exist_ok=True)
    mounts = []
    for name in ("mountain-a.jpg", "mountain-b.jpg", "mountain-c.jpg", "mountain-d.jpg"):
        path = SRC / name
        if not path.exists():
            continue
        mounts.append(knockout(Image.open(path)))
    flips = [im.transpose(Image.Transpose.FLIP_LEFT_RIGHT) for im in mounts]
    for i, im in enumerate((mounts + flips)[:8]):
        fit(im, 512, 256).save(SPRITE / f"mountain-{i + 1:02d}.png")
    ridge = SRC / "ridge-long.jpg"
    if ridge.exists():
        base = knockout(Image.open(ridge))
        for i, gain in enumerate((1, 0.75, 0.55)):
            arr = np.asarray(base).astype(np.float32)
            arr[:, :, 3] *= gain
            fit(Image.fromarray(arr.astype(np.uint8), "RGBA"), 1024, 128).save(SPRITE / f"ridge-long-{i + 1:02d}.png")
    wave = SRC / "wave.jpg"
    if wave.exists():
        base = knockout(Image.open(wave))
        variants = [base, base.transpose(Image.Transpose.FLIP_LEFT_RIGHT), base.transpose(Image.Transpose.FLIP_TOP_BOTTOM), base.rotate(180, expand=True)]
        for i, im in enumerate(variants):
            fit(im, 256, 64).save(SPRITE / f"wave-{i + 1:02d}.png")
    for name, size in (("pass.jpg", (96, 96)), ("great-wall.jpg", (512, 64)), ("marsh.jpg", (256, 128)), ("desert.jpg", (256, 128))):
        path = SRC / name
        if not path.exists():
            continue
        dest = {
            "pass.jpg": "pass.png",
            "great-wall.jpg": "great-wall-seg.png",
            "marsh.jpg": "marsh.png",
            "desert.jpg": "desert-dots.png",
        }[name]
        fit(knockout(Image.open(path)), *size).save(SPRITE / dest)
    procedural_wall(128, 96).save(SPRITE / "city-wall.png")
    procedural_wall(160, 120, double=True).save(SPRITE / "capital-wall.png")
    paper_tile().resize((2048, 1280), Image.Resampling.BILINEAR).save(SPRITE / "paper-map.png")


def stamp(base, sprite, x, y, scale=1.0):
    if sprite is None:
        return
    sw, sh = sprite.size
    nw, nh = max(8, int(sw * scale)), max(8, int(sh * scale))
    im = sprite.resize((nw, nh), Image.Resampling.LANCZOS)
    ox, oy = int(x - nw / 2), int(y - nh / 2)
    if ox >= base.width or oy >= base.height or ox + nw <= 0 or oy + nh <= 0:
        return
    left, top = max(0, -ox), max(0, -oy)
    right, bottom = min(nw, base.width - ox), min(nh, base.height - oy)
    if right <= left or bottom <= top:
        return
    base.alpha_composite(im.crop((left, top, right, bottom)), (max(0, ox), max(0, oy)))


def load_sprite(name):
    path = SPRITE / name
    if not path.exists():
        return None
    return Image.open(path).convert("RGBA")


def render_one(ch, meta, frames, land, rivers, sprites):
    box = project(frames["frames"][meta["frame"]])
    paper = sprites["paper"].resize((W, H), Image.Resampling.BILINEAR)
    im = Image.new("RGBA", (W, H), PAPER)
    im.alpha_composite(paper)
    draw = ImageDraw.Draw(im)
    rings = land["rings"]
    for ring in rings:
        pts = [to_px(box, lon, lat) for lon, lat in ring]
        if len(pts) < 3:
            continue
        draw.polygon(pts, fill=LAND)
    # 海水浪纹：东南几个固定点，不在陆上才盖
    for lon, lat, name in ((123.2, 30.5, "wave-01.png"), (122.4, 24.5, "wave-02.png"), (114.5, 19.5, "wave-03.png"), (121.0, 36.8, "wave-04.png")):
        x, y = to_px(box, lon, lat)
        if not (40 < x < W - 40 and 40 < y < H - 40):
            continue
        if on_land(lon, lat, rings):
            continue
        stamp(im, sprites[name], x, y, 1.4)
    dlon, dlat = DESERT
    dx, dy = to_px(box, dlon, dlat)
    if 0 < dx < W and 0 < dy < H and on_land(dlon, dlat, rings):
        stamp(im, sprites["desert-dots.png"], dx, dy, 1.6)
    terr = json.loads((MAPS / "territory" / f"{ch}.json").read_text())
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    for part in terr["parts"]:
        pts = [to_px(box, lon, lat) for lon, lat in part["ring"]]
        od.polygon(pts, fill=TERR)
    im.alpha_composite(overlay)
    coasts, river_lines = [], []
    for ring in rings:
        pts = [to_px(box, lon, lat) for lon, lat in ring]
        if len(pts) < 3:
            continue
        if not any(-40 < x < W + 40 and -40 < y < H + 40 for x, y in pts):
            continue
        if pts[0] != pts[-1]:
            pts = pts + [pts[0]]
        coasts.append(pts)
    for river in rivers["lines"]:
        line = river["line"]
        if len(line) < 2:
            continue
        span = abs(line[0][0] - line[-1][0]) + abs(line[0][1] - line[-1][1])
        if not river.get("schematic") and span < 0.4 and len(line) < 4:
            continue
        river_lines.append([to_px(box, lon, lat) for lon, lat in line])
    for lon, lat, idx, px in RANGES:
        x, y = to_px(box, lon, lat)
        if not (80 < x < W - 80 and 40 < y < H - 40):
            continue
        if not on_land(lon, lat, rings):
            continue
        stamp(im, sprites[f"mountain-{idx + 1:02d}.png"], x, y, px / 512)
    mlon, mlat = MARSH
    mx, my = to_px(box, mlon, mlat)
    if 0 < mx < W and 0 < my < H and on_land(mlon, mlat, rings):
        stamp(im, sprites["marsh.png"], mx, my, 0.9)
    for lon, lat in WALL.get(ch, []):
        x, y = to_px(box, lon, lat)
        if 0 < x < W and 0 < y < H:
            stamp(im, sprites["great-wall-seg.png"], x, y, 0.42)
    # 都城只留一枚小城廓，名字仍由 HTML 标注。
    # 河岸和海岸在锁色板之后再描，避免 2px 线被抗锯齿吸进雾灰。
    return im.convert("RGB"), coasts, river_lines


PALETTE = np.array([
    (0x14, 0x14, 0x14), (0x3A, 0x3A, 0x3A), (0x6E, 0x6E, 0x6C),
    (0xA8, 0xA8, 0xA4), (0xD2, 0xD1, 0xCC), (0xEC, 0xEA, 0xE4),
], dtype=np.float32)


def snap_palette(im):
    arr = np.asarray(im.convert("RGB"), dtype=np.float32)
    lum = 0.299 * arr[:, :, 0] + 0.587 * arr[:, :, 1] + 0.114 * arr[:, :, 2]
    greys = 0.299 * PALETTE[:, 0] + 0.587 * PALETTE[:, 1] + 0.114 * PALETTE[:, 2]
    idx = np.abs(lum[:, :, None] - greys[None, None, :]).argmin(axis=2)
    return Image.fromarray(PALETTE[idx].astype(np.uint8), "RGB")


def hard_stroke(im, lines, color, width, sx, sy):
    if not lines:
        return im
    mask = Image.new("L", im.size, 0)
    draw = ImageDraw.Draw(mask)
    for line in lines:
        pts = [(x * sx, y * sy) for x, y in line]
        if len(pts) < 2:
            continue
        draw.line(pts, fill=255, width=width, joint="curve")
    raw = np.asarray(mask)
    hard = Image.fromarray(np.where(raw >= 96, 255, 0).astype(np.uint8), "L")
    solid = Image.new("RGB", im.size, color)
    im.paste(solid, mask=hard)
    return im


def save_budget(im, coasts, rivers, path, budget, size):
    im = snap_palette(im.resize(size, Image.Resampling.LANCZOS))
    sx, sy = size[0] / W, size[1] / H
    # 海岸墨线、河岸中灰，输出尺寸上保持 2px，不被缩放吃掉。
    im = hard_stroke(im, coasts, (0x14, 0x14, 0x14), 2, sx, sy)
    im = hard_stroke(im, rivers, (0x6E, 0x6E, 0x6C), 2, sx, sy)
    buf = BytesIO()
    im.save(buf, "WEBP", lossless=True, quality=100, method=6)
    blob = buf.getvalue()
    if len(blob) > budget:
        raise SystemExit(f"{path.name} {len(blob)} 超过 {budget}")
    path.write_bytes(blob)
    return len(blob)


def main():
    prepare_sprites()
    frames = json.loads((MAPS / "frames.json").read_text())
    land = json.loads((MAPS / "basemap" / "land.json").read_text())
    rivers = json.loads((MAPS / "basemap" / "rivers.json").read_text())
    sprites = {"paper": load_sprite("paper-map.png")}
    for i in range(1, 9):
        sprites[f"mountain-{i:02d}.png"] = load_sprite(f"mountain-{i:02d}.png")
    for name in ("wave-01.png", "wave-02.png", "wave-03.png", "wave-04.png", "desert-dots.png", "marsh.png", "great-wall-seg.png"):
        sprites[name] = load_sprite(name)
    OUT.mkdir(parents=True, exist_ok=True)
    for ch, meta in frames["chapters"].items():
        im, coasts, river_lines = render_one(ch, meta, frames, land, rivers, sprites)
        n = save_budget(im, coasts, river_lines, OUT / f"{ch}.webp", 160 * 1024, (1600, 1000))
        m = save_budget(im, coasts, river_lines, OUT / f"{ch}-m.webp", 60 * 1024, (800, 500))
        t = save_budget(im, coasts, river_lines, OUT / f"{ch}-t.webp", 25 * 1024, (320, 200))
        print(f"{ch} {n} {m} {t}")


if __name__ == "__main__":
    main()
