#!/usr/bin/env python3
"""检查地图成图是否锁在黑白红色板里。

饱和度 > 0.25 的像素必须落在朱砂色相 ±12°，朱砂像素不超过 10%。
用法：python3 video/tools/check-image-palette.py <图片>...
"""
import colorsys
import sys
from pathlib import Path

import numpy as np
from PIL import Image


def check(path):
    im = Image.open(path).convert("RGB")
    arr = np.asarray(im)
    step = max(1, int(arr.shape[0] * arr.shape[1] / 80000) ** 0.5)
    sample = arr[::max(1, int(step)), ::max(1, int(step))].reshape(-1, 3)
    red = 0
    bad = 0
    for r, g, b in sample:
        h, s, v = colorsys.rgb_to_hsv(int(r) / 255, int(g) / 255, int(b) / 255)
        if s <= 0.25 or v <= 0.08:
            continue
        deg = h * 360
        # 朱砂 #b3241c 大约在 4°
        if min(abs(deg - 4), 360 - abs(deg - 4)) <= 12:
            red += 1
        else:
            bad += 1
    n = len(sample)
    msgs = []
    if bad:
        msgs.append(f"{path}: {bad} 个抽样像素饱和且不是朱砂")
    if n and red / n > 0.10:
        msgs.append(f"{path}: 朱砂像素 {red / n:.1%} 超过一成")
    return msgs


def main():
    paths = [Path(p) for p in sys.argv[1:]]
    if not paths:
        print("缺少图片路径", file=sys.stderr)
        return 2
    failed = []
    for p in paths:
        if not p.exists():
            failed.append(f"{p}: 文件不存在")
            continue
        failed.extend(check(p))
    if failed:
        print("\n".join(failed))
        return 1
    print(f"色板通过：{len(paths)} 张")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
