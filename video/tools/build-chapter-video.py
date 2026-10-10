#!/usr/bin/env python3
"""Assemble a chapter opening video from generated clips (see video/docs/chapter-videos.md).

Usage: python3 video/tools/build-chapter-video.py <chapter> [--raw /workspace/chapter-video/<chapter>]
Needs Python 3 + Pillow + ffmpeg. Local tool only; not part of ./build.sh.
Reads video/data/chapter-videos/<chapter>.json, expects <raw>/<chapter>-NN.mp4 clips,
writes video/viewer/assets/chapter-videos/<chapter>.{mp4,webm} + poster .{jpg,webp}.
"""
import json, os, subprocess, sys, glob, argparse
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
W, H, FPS = 1280, 720, 24
PAPER = (0xec, 0xea, 0xe4); INK = (0x14, 0x14, 0x14)
XF = 0.7  # crossfade seconds

def font(sz, bold=True):
    pats = ['/usr/share/fonts/**/NotoSerifCJK-Bold.ttc' if bold else '/usr/share/fonts/**/NotoSerifCJK-Regular.ttc',
            '/System/Library/Fonts/STHeiti Medium.ttc', '/Library/Fonts/Kaiti.ttc']
    for p in pats:
        g = glob.glob(p, recursive=True)
        if g: return ImageFont.truetype(g[0], sz, index=0)
    raise SystemExit('no CJK serif font found')

def paper_bg(assets):
    bg = Image.new('RGB', (W, H), PAPER)
    st = os.path.join(assets, 'paper-ink-stains.jpg')
    if os.path.exists(st):
        s = Image.open(st).convert('RGB').resize((W, H), Image.LANCZOS)
        bg = Image.blend(bg, s, 0.35)
    return bg

def title_card(path, zh, seal, assets):
    im = paper_bg(assets); d = ImageDraw.Draw(im)
    f = font(210); tw = d.textlength(zh, font=f)
    x, y = (W - tw) / 2 - 40, H / 2 - 150
    d.text((x, y), zh, font=f, fill=INK)
    # brush stroke underline
    d.polygon([(x - 10, y + 300), (x + tw * .5, y + 290), (x + tw + 10, y + 296), (x + tw - 30, y + 310), (x + 10, y + 314)], fill=INK)
    # vermilion seal (texture if present)
    sz = 96; sx, sy = int(x + tw + 30), int(y + 40)
    sp = os.path.join(assets, 'vermilion-seal-fill.jpg')
    sealim = Image.open(sp).convert('RGB').resize((sz, sz), Image.LANCZOS) if os.path.exists(sp) else Image.new('RGB', (sz, sz), (0xb3, 0x24, 0x1c))
    m = Image.new('L', (sz, sz), 0); ImageDraw.Draw(m).polygon([(3, 6), (sz - 4, 1), (sz - 1, sz - 6), (6, sz - 1)], fill=255)
    im.paste(sealim, (sx, sy), m)
    fs = font(36); ds = ImageDraw.Draw(im)
    for i, ch in enumerate(seal[:2]): ds.text((sx + sz / 2 - 18, sy + 8 + i * 42), ch, font=fs, fill=PAPER)
    im.save(path)

def caption(path, zh):
    f = font(40); tw = ImageDraw.Draw(Image.new('L', (1, 1))).textlength(zh, font=f)
    x, y = (W - tw) / 2, H - 132
    # straight-alpha layers: solid colour + mask, so blur never drags black into the halo
    hm = Image.new('L', (W, H), 0); ImageDraw.Draw(hm).text((x, y), zh, font=f, fill=255, stroke_width=12, stroke_fill=255)
    hm = hm.filter(ImageFilter.GaussianBlur(9)).point(lambda v: min(255, int(v * 1.6)))
    tm = Image.new('L', (W, H), 0); ImageDraw.Draw(tm).text((x, y), zh, font=f, fill=255)
    halo = Image.new('RGBA', (W, H), PAPER + (0,)); halo.putalpha(hm.point(lambda v: int(v * .9)))
    text = Image.new('RGBA', (W, H), INK + (0,)); text.putalpha(tm)
    Image.alpha_composite(halo, text).save(path)

def run(cmd):
    print('+', ' '.join(cmd[:6]), '…'); subprocess.run(cmd, check=True)

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('chapter'); ap.add_argument('--raw'); ap.add_argument('--crf', default='26')
    a = ap.parse_args(); ch = a.chapter
    raw = a.raw or f'/workspace/chapter-video/{ch}'
    spec = json.load(open(os.path.join(ROOT, 'video/data/chapter-videos', ch + '.json')))
    assets = os.path.join(ROOT, 'video/viewer/assets'); out = os.path.join(assets, 'chapter-videos'); os.makedirs(out, exist_ok=True)
    tmp = os.path.join(raw, 'build'); os.makedirs(tmp, exist_ok=True)
    tc = spec.get('titleCard', {}); tdur = tc.get('durationSec', 3); hold = spec.get('closingHoldSec', 3)
    title_card(f'{tmp}/title.png', tc.get('zh', spec['title']['zh']), tc.get('seal', '开卷'), assets)
    # per-shot: scale/crop to 1280x720, burn caption with fade in/out
    parts = []
    tpng = f'{tmp}/title.mp4'
    run(['ffmpeg', '-y', '-loglevel', 'error', '-loop', '1', '-t', str(tdur + XF), '-i', f'{tmp}/title.png', '-vf', f'fps={FPS},format=yuv420p,fade=in:st=0:d=0.6:color=0xeceae4', '-c:v', 'libx264', '-crf', '16', tpng])
    parts.append((tpng, tdur + XF))
    for s in spec['shots']:
        n = s['n']; clip = os.path.join(raw, s['clip']); cap = f'{tmp}/cap-{n:02d}.png'; caption(cap, s['zh'])
        dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', clip]).decode().strip())
        last = n == len(spec['shots'])
        vf = (f'[0:v]fps={FPS},scale=-2:{H}:flags=lanczos,crop={W}:{H},unsharp=5:5:0.6:5:5:0.0,setsar=1'
              + (f',tpad=stop_mode=clone:stop_duration={hold}' if last else '') + '[v];'
              f'[1:v]format=rgba,fade=in:st=0.5:d=0.6:alpha=1,fade=out:st={dur - 1.0:.2f}:d=0.6:alpha=1[c];'
              '[v][c]overlay=0:0:shortest=0' + (f',fade=out:st={dur + hold - 1.2:.2f}:d=1.2:color=0xeceae4' if last else '') + ',format=yuv420p[o]')
        o = f'{tmp}/shot-{n:02d}.mp4'
        run(['ffmpeg', '-y', '-loglevel', 'error', '-i', clip, '-loop', '1', '-t', str(dur + (hold if last else 0)), '-i', cap,
             '-filter_complex', vf, '-map', '[o]', '-an', '-t', str(dur + (hold if last else 0)), '-c:v', 'libx264', '-crf', '16', o])
        parts.append((o, dur + (hold if last else 0)))
    # crossfade chain
    inputs = []; [inputs.extend(['-i', p]) for p, _ in parts]
    fc = []; prev = '[0:v]'; off = 0.0
    for i in range(1, len(parts)):
        off += parts[i - 1][1] - XF
        lab = f'[x{i}]'; fc.append(f'{prev}[{i}:v]xfade=transition=fade:duration={XF}:offset={off:.3f}{lab}'); prev = lab
    total = off + parts[-1][1]
    mp4 = os.path.join(out, ch + '.mp4')
    run(['ffmpeg', '-y', '-loglevel', 'error', *inputs, '-filter_complex', ';'.join(fc), '-map', prev, '-an',
         '-c:v', 'libx264', '-preset', 'slow', '-crf', a.crf, '-pix_fmt', 'yuv420p', '-movflags', '+faststart', mp4])
    run(['ffmpeg', '-y', '-loglevel', 'error', '-i', mp4, '-an', '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '46', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '4', os.path.join(out, ch + '.webm')])
    # poster: middle of shot 1 region after title
    # poster: first shot before its caption fades in, so player controls never sit on burned text
    run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', '0.3', '-i', f'{tmp}/shot-01.mp4', '-frames:v', '1', f'{tmp}/poster.png'])
    pim = Image.open(f'{tmp}/poster.png').convert('RGB')
    pim.save(os.path.join(out, ch + '-poster.jpg'), quality=82, optimize=True, progressive=True)
    pim.save(os.path.join(out, ch + '-poster.webp'), quality=78, method=6)
    dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp4]).decode().strip())
    # mark shots done, record output
    for sh in spec['shots']: sh['status'] = 'done'
    spec['output'] = {'mp4': f'video/viewer/assets/chapter-videos/{ch}.mp4', 'webm': f'video/viewer/assets/chapter-videos/{ch}.webm',
                      'poster': f'video/viewer/assets/chapter-videos/{ch}-poster.jpg', 'durationSec': round(dur, 2),
                      'crossfadeSec': XF, 'status': 'done'}
    jp = os.path.join(ROOT, 'video/data/chapter-videos', ch + '.json')
    open(jp, 'w').write(json.dumps(spec, ensure_ascii=False, indent=1) + '\n')
    write_manifest(out)
    print('total', round(dur, 2), 's', os.path.getsize(mp4), 'bytes')

def write_manifest(out):
    # index.json + index.js (script-tag manifest so file:// works without fetch)
    man = {}
    for jp in sorted(glob.glob(os.path.join(ROOT, 'video/data/chapter-videos', '*.json'))):
        sp = json.load(open(jp)); o = sp.get('output') or {}
        if o.get('status') != 'done': continue
        c = sp['chapter']; ent = {'title': sp['title'], 'mp4': f'assets/chapter-videos/{c}.mp4', 'poster': f'assets/chapter-videos/{c}-poster.jpg',
             'posterWebp': f'assets/chapter-videos/{c}-poster.webp', 'durationSec': o['durationSec'], 'shots': len(sp['shots'])}
        if os.path.exists(os.path.join(out, c + '.webm')): ent['webm'] = f'assets/chapter-videos/{c}.webm'
        man[c] = ent
    body = json.dumps({'version': 1, 'chapters': man}, ensure_ascii=False, indent=1)
    open(os.path.join(out, 'index.json'), 'w').write(body + '\n')
    open(os.path.join(out, 'index.js'), 'w').write('// generated by video/tools/build-chapter-video.py; mirrors index.json for file:// (no fetch)\nwindow.CHAPTER_VIDEOS = ' + body + ';\n')

if __name__ == '__main__': main()
