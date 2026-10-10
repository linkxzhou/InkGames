#!/usr/bin/env python3
"""Assemble a chapter opening video from generated clips (see video/docs/chapter-videos.md).

Usage: python3 video/tools/build-chapter-video.py <chapter> [--raw /workspace/chapter-video/<chapter>]
Needs Python 3 + Pillow + numpy + ffmpeg (+ edge-tts for narration, network). Local tool only; not part of ./build.sh.
On the box: /workspace/.venv-audio/bin/python video/tools/build-chapter-video.py <chapter> [--raw DIR] [--out DIR] [--no-audio]
Audio (chapter_audio.py): edge-tts narration of each shot's `narration`, original procedural music bed and
per-shot ambience (`ambience`), narration ducking, -16 LUFS, AAC 160k stereo.
Reads video/data/chapter-videos/<chapter>.json, expects <raw>/<chapter>-NN.mp4 clips,
writes video/viewer/assets/chapter-videos/<chapter>.mp4 + poster .{jpg,webp}.
"""
import json, os, subprocess, sys, glob, argparse
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
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
    ap = argparse.ArgumentParser()
    ap.add_argument('chapter'); ap.add_argument('--raw', help='folder with <chapter>-NN.mp4 clips (default /workspace/chapter-video/<chapter>)')
    ap.add_argument('--crf', default='28'); ap.add_argument('--no-audio', action='store_true', help='silent video (no narration / music)')
    ap.add_argument('--out', help='write the video + poster here instead of video/viewer/assets/chapter-videos (test render; JSON and manifest untouched)')
    ap.add_argument('--max-shot', type=float, default=8.0, help='longest clip used per shot, seconds')
    ap.add_argument('--no-grade', action='store_true', help='skip the palette-lock colour grade (chapter_grade.py)')
    a = ap.parse_args(); ch = a.chapter
    spec = json.load(open(os.path.join(ROOT, 'video/data/chapter-videos', ch + '.json')))
    raw = a.raw or spec.get('rawDir') or f'/workspace/chapter-video/{ch}'
    assets = os.path.join(ROOT, 'video/viewer/assets'); official = os.path.join(assets, 'chapter-videos')
    out = os.path.abspath(a.out) if a.out else official; os.makedirs(out, exist_ok=True); is_official = out == official
    tmp = os.path.join(raw, 'build'); os.makedirs(tmp, exist_ok=True)
    tc = spec.get('titleCard', {}); tdur = tc.get('durationSec', 3); hold = spec.get('closingHoldSec', 3)
    title_card(f'{tmp}/title.png', tc.get('zh', spec['title']['zh']), tc.get('seal', '开卷'), assets)
    shots = spec['shots']; nshot = len(shots)
    # narration first: a shot is held a little longer when its line would run past the next crossfade
    vo = vlen = None
    if not a.no_audio:
        import chapter_audio as CA
        cfg = spec.get('audio', {}).get('narration', {'voice': 'zh-CN-YunjianNeural'})
        vo, vlen = CA.tts_durations([sh.get('narration') or sh['zh'] for sh in shots], cfg, tmp)
    voff = spec.get('audio', {}).get('narration', {}).get('offsetSec', 0.6)
    parts = []
    tpng = f'{tmp}/title.mp4'
    run(['ffmpeg', '-y', '-loglevel', 'error', '-loop', '1', '-t', str(tdur + XF), '-i', f'{tmp}/title.png', '-vf', f'fps={FPS},format=yuv420p,fade=in:st=0:d=0.6:color=0xeceae4', '-c:v', 'libx264', '-crf', '16', tpng])
    parts.append((tpng, tdur + XF))
    shot_durs = []
    # palette-lock grade (ink -> paper grey ramp + vermilion only), clips in parallel
    src = {sh['n']: os.path.join(raw, sh['clip']) for sh in shots}
    if not a.no_grade:
        import chapter_grade as CG
        from concurrent.futures import ProcessPoolExecutor
        with ProcessPoolExecutor(max_workers=min(4, os.cpu_count() or 2)) as ex:
            futs = {sh['n']: ex.submit(CG.grade_clip, src[sh['n']], f"{tmp}/graded-{sh['n']:02d}.mp4", sh.get('grade', {})) for sh in shots}
            src = {n: f.result() for n, f in futs.items()}
        print('  graded', len(src), 'clips')
    for k, sh in enumerate(shots):
        n = sh['n']; clip = src[n]; cap = f'{tmp}/cap-{n:02d}.png'; caption(cap, sh['zh'])
        cd = min(a.max_shot, float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', clip]).decode().strip()))
        last = k == nshot - 1
        ext = 0.0
        if vlen:
            need = voff + vlen[k] + 0.3 + (0 if last else XF)  # line ends before the next crossfade starts
            if need > cd: ext = min(2.0, need - cd); print(f'  shot {n}: narration {vlen[k]:.2f}s, holding last frame +{ext:.2f}s')
        dur = cd + ext; pad = ext + (hold if last else 0)
        ch_ = int(subprocess.check_output(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=height', '-of', 'csv=p=0', clip]).decode().strip())
        sharp = ',unsharp=5:5:0.6:5:5:0.0' if ch_ < H else ''  # sharpen only when upscaling
        vf = (f'[0:v]trim=0:{cd:.3f},setpts=PTS-STARTPTS,fps={FPS},scale=-2:{H}:flags=lanczos,crop={W}:{H}{sharp},setsar=1'
              + (f',tpad=stop_mode=clone:stop_duration={pad:.3f}' if pad > 0 else '') + '[v];'
              f'[1:v]format=rgba,fade=in:st=0.5:d=0.6:alpha=1,fade=out:st={dur - 1.0:.2f}:d=0.6:alpha=1[c];'
              '[v][c]overlay=0:0:shortest=0' + (f',fade=out:st={dur + hold - 1.2:.2f}:d=1.2:color=0xeceae4' if last else '') + ',format=yuv420p[o]')
        o = f'{tmp}/shot-{n:02d}.mp4'; L = dur + (hold if last else 0)
        run(['ffmpeg', '-y', '-loglevel', 'error', '-i', clip, '-loop', '1', '-t', f'{L:.3f}', '-i', cap,
             '-filter_complex', vf, '-map', '[o]', '-an', '-t', f'{L:.3f}', '-c:v', 'libx264', '-crf', '16', o])
        parts.append((o, L)); shot_durs.append(dur); sh['durationSec'] = round(dur, 2)
    # crossfade chain
    inputs = []; [inputs.extend(['-i', p]) for p, _ in parts]
    fc = []; prev = '[0:v]'; off = 0.0; starts = []
    for i in range(1, len(parts)):
        off += parts[i - 1][1] - XF; starts.append(off)
        lab = f'[x{i}]'; fc.append(f'{prev}[{i}:v]xfade=transition=fade:duration={XF}:offset={off:.3f}{lab}'); prev = lab
    total = off + parts[-1][1]
    mp4 = os.path.join(out, ch + '.mp4'); silent = f'{tmp}/{ch}-silent.mp4'
    run(['ffmpeg', '-y', '-loglevel', 'error', *inputs, '-filter_complex', ';'.join(fc), '-map', prev, '-an',
         '-c:v', 'libx264', '-preset', 'slow', '-crf', a.crf, '-pix_fmt', 'yuv420p', '-movflags', '+faststart', silent if not a.no_audio else mp4])
    loud = None
    if not a.no_audio:
        import chapter_audio as CA
        # shots in the last part also cover the closing hold
        sd = shot_durs[:-1] + [shot_durs[-1] + hold]
        mixwav = CA.mix(total, tdur, starts, sd, spec, tmp, XF, vo)
        normwav = f'{tmp}/mix-norm.wav'; CA.loudnorm(mixwav, normwav, -16.0)
        run(['ffmpeg', '-y', '-loglevel', 'error', '-i', silent, '-i', normwav, '-map', '0:v', '-map', '1:a', '-c:v', 'copy',
             '-c:a', 'aac', '-b:a', '160k', '-ac', '2', '-ar', '48000', '-t', f'{total:.3f}', '-movflags', '+faststart', mp4])
        loud = CA.measure(mp4)
        print(f'  loudness {loud[0]:.1f} LUFS, true peak {loud[1]:.1f} dBTP, narration {"edge-tts " + spec.get("audio", {}).get("narration", {}).get("voice", "") if vo else "none (TTS unavailable)"}')
    # poster: first shot before its caption fades in, so player controls never sit on burned text
    run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', '0.3', '-i', f'{tmp}/shot-01.mp4', '-frames:v', '1', f'{tmp}/poster.png'])
    pim = Image.open(f'{tmp}/poster.png').convert('RGB')
    pim.save(os.path.join(out, ch + '-poster.jpg'), quality=82, optimize=True, progressive=True)
    pim.save(os.path.join(out, ch + '-poster.webp'), quality=78, method=6)
    dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp4]).decode().strip())
    print('total', round(dur, 2), 's', os.path.getsize(mp4), 'bytes ->', mp4)
    if not is_official: return
    for sh in shots: sh['status'] = 'done'
    spec['output'] = {'mp4': f'video/viewer/assets/chapter-videos/{ch}.mp4',
                      'poster': f'video/viewer/assets/chapter-videos/{ch}-poster.jpg', 'durationSec': round(dur, 2),
                      'crossfadeSec': XF, 'audio': bool(loud), 'narration': bool(vo), 'status': 'done'}
    if loud: spec['output']['loudnessLUFS'] = round(loud[0], 1)
    jp = os.path.join(ROOT, 'video/data/chapter-videos', ch + '.json')
    open(jp, 'w').write(json.dumps(spec, ensure_ascii=False, indent=1) + '\n')
    write_manifest(out)

def write_manifest(out):
    # index.json + index.js (script-tag manifest so file:// works without fetch)
    man = {}
    for jp in sorted(glob.glob(os.path.join(ROOT, 'video/data/chapter-videos', '*.json'))):
        sp = json.load(open(jp)); o = sp.get('output') or {}
        if o.get('status') != 'done': continue
        c = sp['chapter']; ent = {'title': sp['title'], 'mp4': f'assets/chapter-videos/{c}.mp4', 'poster': f'assets/chapter-videos/{c}-poster.jpg',
             'posterWebp': f'assets/chapter-videos/{c}-poster.webp', 'durationSec': o['durationSec'], 'shots': len(sp['shots'])}
        if o.get('audio'): ent['audio'] = True
        man[c] = ent
    body = json.dumps({'version': 1, 'chapters': man}, ensure_ascii=False, indent=1)
    open(os.path.join(out, 'index.json'), 'w').write(body + '\n')
    open(os.path.join(out, 'index.js'), 'w').write('// generated by video/tools/build-chapter-video.py; mirrors index.json for file:// (no fetch)\nwindow.CHAPTER_VIDEOS = ' + body + ';\n')

if __name__ == '__main__': main()
