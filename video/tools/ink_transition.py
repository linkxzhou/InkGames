"""Ink-bleed transitions for chapter opening videos (used by build-chapter-video.py).

The outgoing shot dissolves into spreading ink that then clears to reveal the next shot:
a procedural field F(x, y) = directional sweep (from the left, from the right, or a blot growing
from a point) + fractal noise + fine paper grain. Two thresholds run across F with a small lag:
the leading one lays down a translucent ink wash with a darker bleeding rim over shot A, the
trailing one wipes the ink away to reveal shot B. Edges are feathered and roughened by the grain,
so the front looks like ink soaking along paper fibres. Everything is numpy, seeded per transition,
so a rebuild gives the same frames. `fade` gives the old linear crossfade on the same timeline.
"""
import numpy as np
from PIL import Image

INK = np.array([0x14, 0x14, 0x14], np.float32)

def _smooth(x):
    x = np.clip(x, 0, 1); return x * x * (3 - 2 * x)

def _up(a, w, h):
    return np.asarray(Image.fromarray(a.astype(np.float32), mode='F').resize((w, h), Image.BICUBIC))

def fractal_noise(w, h, rng, base=4, octaves=6, persistence=0.55):
    out = np.zeros((h, w), np.float32); amp = 1.0; tot = 0.0
    for o in range(octaves):
        gw = max(2, int(base * 2 ** o * w / h)); gh = max(2, int(base * 2 ** o))
        out += amp * _up(rng.random((gh, gw)), w, h); tot += amp; amp *= persistence
    out /= tot
    return (out - out.min()) / max(1e-6, out.max() - out.min())

def paper_grain(w, h, rng):
    """Fibrous high-frequency grain: anisotropic noise stretched along a random fibre angle."""
    g = rng.standard_normal((h // 2, w // 2)).astype(np.float32)
    im = Image.fromarray(g, mode='F').resize((w * 2, h // 2), Image.BILINEAR).resize((w, h), Image.BILINEAR)
    g = np.asarray(im); g = g + 0.6 * rng.standard_normal((h, w)).astype(np.float32)
    return g / (np.std(g) + 1e-6)

class Ink:
    def __init__(self, w, h, seed, kind='left', center=None, lag=0.22, feather=0.035):
        rng = np.random.default_rng(seed)
        y, x = np.mgrid[0:h, 0:w].astype(np.float32); x /= w; y /= h
        if kind == 'left': d = x + 0.18 * (y - 0.5) ** 2
        elif kind == 'right': d = (1 - x) + 0.18 * (y - 0.5) ** 2
        else:
            cx, cy = center or (0.5, 0.5)
            d = np.sqrt(((x - cx) * w / h) ** 2 + (y - cy) ** 2)
        d = (d - d.min()) / (d.max() - d.min())
        n = fractal_noise(w, h, rng)
        f = 0.62 * d + 0.38 * n
        self.F = ((f - f.min()) / (f.max() - f.min())).astype(np.float32)
        self.grain = paper_grain(w, h, rng)
        self.tex = fractal_noise(w, h, rng, base=10, octaves=4, persistence=0.6)  # wash density
        self.lag, self.fe = lag, feather

    def alpha(self, p):
        """Returns (reveal, ink_alpha) for eased progress p in 0..1."""
        F = self.F + 0.012 * self.grain  # fibres roughen the edges
        lag, fe = self.lag, self.fe
        th2 = p * (1 + lag + 2 * fe) - lag - fe; th1 = th2 + lag
        ink = _smooth((th1 + fe - F) / (2 * fe))
        rev = _smooth((th2 + fe * 1.6 - F) / (3.2 * fe))
        rim = np.exp(-((F - th1 + 0.4 * fe) / (1.2 * fe)) ** 2)
        wash = 0.62 + 0.3 * self.tex + 0.04 * self.grain
        a = np.clip(ink * (1 - rev) * wash + 0.28 * rim * (1 - rev), 0, 0.93)
        return rev, a

    def frame(self, A, B, t):
        p = _smooth(t)
        rev, a = self.alpha(p)
        base = A.astype(np.float32) * (1 - rev[..., None]) + B.astype(np.float32) * rev[..., None]
        out = base * (1 - a[..., None]) + INK * a[..., None]
        return np.clip(out + 0.5, 0, 255).astype(np.uint8)

def fade_frame(A, B, t):
    return np.clip(A.astype(np.float32) * (1 - t) + B.astype(np.float32) * t + 0.5, 0, 255).astype(np.uint8)

KINDS = ['left', 'right', 'blot']

def make(i, w, h, seed=11, kind=None):
    """Transition number i (0 = title card -> shot 1): the title opens with a blot from the centre,
    then sweeps alternate left / right with an occasional blot from a random point."""
    rng = np.random.default_rng(seed * 1000 + i)
    if kind is None: kind = 'blot' if i == 0 else ['left', 'right', 'blot'][(i - 1) % 3]
    ctr = (0.5, 0.45) if i == 0 else (float(rng.uniform(.25, .75)), float(rng.uniform(.3, .7)))
    return Ink(w, h, seed * 1000 + i, kind, ctr)
