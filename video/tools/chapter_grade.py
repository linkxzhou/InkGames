"""Palette-lock colour grade for generated chapter clips (art-style.md palette).

Every pixel is mapped onto the ink -> paper grey ramp (#141414 -> #eceae4) by luminance,
except hues near vermilion #b3241c, which are re-tinted to vermilion. Saturated orange is pulled
to vermilion, pale orange / yellow and every other hue (blue skies, green, gold glow) go to grey.
Per-shot options (shot["grade"] in the chapter JSON):
  redScale: 0..1   multiply the vermilion weight (soften large red areas)
  redMaskBelow: [y0, y1]  fade vermilion out between normalised heights y0..y1 (e.g. red streaks on sand)
Needs numpy + ffmpeg. Frames are piped as raw RGB, so nothing touches disk but the output clip.
"""
import subprocess, json, os
import numpy as np

INK = np.array([0x14, 0x14, 0x14], np.float32) / 255
PAPER = np.array([0xec, 0xea, 0xe4], np.float32) / 255
VERM = np.array([0xb3, 0x24, 0x1c], np.float32) / 255
VERM_HUE = 3.0  # degrees

def smooth(x, a, b):
    t = np.clip((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)

def grade_frame(f, opts, ymask=None):
    x = f.astype(np.float32) / 255
    r, g, b = x[..., 0], x[..., 1], x[..., 2]
    mx = x.max(-1); mn = x.min(-1); c = mx - mn
    s = np.where(mx > 1e-4, c / np.maximum(mx, 1e-4), 0)
    # hue in degrees
    h = np.zeros_like(mx); cc = np.maximum(c, 1e-6)
    h = np.where(mx == r, (60 * ((g - b) / cc)) % 360, h)
    h = np.where(mx == g, 60 * ((b - r) / cc) + 120, h)
    h = np.where(mx == b, 60 * ((r - g) / cc) + 240, h)
    d = np.abs(((h - VERM_HUE) + 180) % 360 - 180)
    w_red = (1 - smooth(d, 14, 30)) * smooth(s, 0.18, 0.38)
    # saturated orange (20–45°) -> vermilion; pale orange / yellow -> grey
    w_or = (smooth(h, 14, 22) * (1 - smooth(h, 38, 48))) * smooth(s, 0.5, 0.75) * smooth(mx, 0.35, 0.55)
    w = np.maximum(w_red, 0.85 * w_or) * opts.get('redScale', 1.0)
    if ymask is not None: w = w * ymask[:, None]
    Y = 0.2126 * r + 0.7152 * g + 0.0722 * b
    t = np.clip((Y - 0.035) / (0.93 - 0.035), 0, 1)[..., None]
    grey = INK + (PAPER - INK) * t
    vshade = VERM * np.minimum(1, mx / 0.70)[..., None]
    redc = PAPER + (vshade - PAPER) * np.clip(s / 0.72, 0, 1)[..., None]
    out = grey * (1 - w[..., None]) + redc * w[..., None]
    return (np.clip(out, 0, 1) * 255 + 0.5).astype(np.uint8)

def probe(src):
    j = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,r_frame_rate', '-of', 'json', src]))
    st = j['streams'][0]; return st['width'], st['height'], st['r_frame_rate']

def grade_clip(src, dst, opts=None):
    opts = opts or {}
    stamp = dst + '.grade.json'; key = json.dumps([os.path.getmtime(src), opts, 2])
    if os.path.exists(dst) and os.path.exists(stamp) and open(stamp).read() == key: return dst
    W, H, fr = probe(src)
    ymask = None
    if opts.get('redMaskBelow'):
        y0, y1 = opts['redMaskBelow']; yy = np.arange(H) / H; ymask = (1 - smooth(yy, y0, y1)).astype(np.float32)
    dec = subprocess.Popen(['ffmpeg', '-loglevel', 'error', '-i', src, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
    enc = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', fr, '-i', '-',
                            '-c:v', 'libx264', '-crf', '14', '-preset', 'fast', '-pix_fmt', 'yuv420p', dst], stdin=subprocess.PIPE)
    n = W * H * 3
    while True:
        buf = dec.stdout.read(n)
        if len(buf) < n: break
        enc.stdin.write(grade_frame(np.frombuffer(buf, np.uint8).reshape(H, W, 3), opts, ymask).tobytes())
    enc.stdin.close(); enc.wait(); dec.wait()
    if enc.returncode: raise SystemExit('grade encode failed: ' + src)
    open(stamp, 'w').write(key); return dst
