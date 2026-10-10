#!/usr/bin/env python3
"""Assemble a chapter opening video from generated clips (see video/docs/chapter-videos.md).

Usage: python3 video/tools/build-chapter-video.py <chapter> [--raw /workspace/chapter-video/<chapter>]
Needs Python 3 + Pillow + numpy + ffmpeg (+ edge-tts for narration, network). Local tool only; not part of ./build.sh.
On the box: /workspace/.venv-audio/bin/python video/tools/build-chapter-video.py <chapter> [--raw DIR] [--out DIR] [--no-audio]
Audio (chapter_audio.py): edge-tts narration of each shot's `narration`, original procedural music bed and
per-shot ambience (`ambience`), narration ducking, -16 LUFS, AAC 160k stereo. Narration is synthesised slower
(--narration-rate, default chapter_audio.NARRATION_RATE = -29%), and each shot is lengthened to
offset + line + breath + transition by slowing its clip (minterpolate, at most --max-slow) and then holding the last frame.
Transitions (ink_transition.py): ink bleed by default (title -> shot 1, between shots, last shot -> blank paper);
--transition fade gives the old linear crossfade.
Reads video/data/chapter-videos/<chapter>.json, expects <raw>/<chapter>-NN.mp4 clips,
writes video/viewer/assets/chapter-videos/<chapter>.mp4 + poster .{jpg,webp}.
"""
import json, os, subprocess, sys, glob, argparse
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
W, H, FPS = 1280, 720, 24
PAPER = (0xec, 0xea, 0xe4); INK = (0x14, 0x14, 0x14)
XF = 0.7  # old linear crossfade seconds (--transition fade)
INK_SEC = 1.2  # ink-bleed transition seconds (default)
BREATH = 0.4  # pause after a narration line before the next transition
MAX_SLOW = 1.35  # longest clip slowdown used to fit a line; beyond it the last frame is held

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

def slow_clip(src, dst, factor, mode='mci'):
    """Stretch a clip by `factor` (>1 = slower) at synthesis time; mci = motion-compensated interpolation."""
    key = f'{src}|{factor:.4f}|{mode}'
    if os.path.exists(dst) and os.path.exists(dst + '.key') and open(dst + '.key').read() == key: return dst
    interp = {'mci': f',minterpolate=fps={FPS}:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1',
              'blend': f',minterpolate=fps={FPS}:mi_mode=blend'}.get(mode, f',fps={FPS}')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', src, '-vf', f'setpts={factor:.4f}*PTS{interp}', '-an',
                    '-c:v', 'libx264', '-crf', '14', '-pix_fmt', 'yuv420p', dst], check=True)
    open(dst + '.key', 'w').write(key)
    return dst

def read_frames(path, n):
    """Yield exactly n RGB frames from path (repeats the last frame if the file is a frame short)."""
    p = subprocess.Popen(['ffmpeg', '-loglevel', 'error', '-i', path, '-frames:v', str(n), '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
    sz = W * H * 3; last = None
    import numpy as np
    for _ in range(n):
        buf = p.stdout.read(sz)
        if len(buf) == sz: last = np.frombuffer(buf, np.uint8).reshape(H, W, 3)
        elif last is None: raise SystemExit('no frames in ' + path)
        yield last
    p.stdout.close(); p.wait()

def assemble(parts, T, kind, dst, crf, seed=11):
    """Concatenate parts [(path, seconds)] with T-second transitions (ink bleed or linear fade) in one encode.
    Returns the start time (s) of every part and the total length."""
    import ink_transition as IT
    nT = max(1, round(T * FPS)); ns = [round(L * FPS) for _, L in parts]
    enc = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                            '-c:v', 'libx264', '-preset', 'slow', '-crf', str(crf), '-pix_fmt', 'yuv420p', '-movflags', '+faststart', dst], stdin=subprocess.PIPE)
    tail = None; starts = []; pos = 0
    for i, ((path, _), n) in enumerate(zip(parts, ns)):
        last = i == len(parts) - 1; g = read_frames(path, n); starts.append(pos / FPS); used = 0
        if i > 0:
            tr = IT.make(i - 1, W, H, seed) if kind == 'ink' else None
            for k in range(nT):
                B = next(g); t = (k + 1) / (nT + 1)
                enc.stdin.write((tr.frame(tail[k], B, t) if tr else IT.fade_frame(tail[k], B, t)).tobytes())
            used = nT
        body = n - used - (0 if last else nT)
        for _ in range(body): enc.stdin.write(next(g).tobytes())
        if not last: tail = [next(g).copy() for _ in range(nT)]
        pos += n - nT
    enc.stdin.close(); enc.wait()
    if enc.returncode: raise SystemExit('encode failed')
    return starts, (sum(ns) - nT * (len(ns) - 1)) / FPS

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('chapter'); ap.add_argument('--raw', help='folder with <chapter>-NN.mp4 clips (default /workspace/chapter-video/<chapter>)')
    ap.add_argument('--crf', default='28'); ap.add_argument('--no-audio', action='store_true', help='silent video (no narration / music)')
    ap.add_argument('--out', help='write the video + poster here instead of video/viewer/assets/chapter-videos (test render; JSON and manifest untouched)')
    ap.add_argument('--max-shot', type=float, default=8.0, help='longest source clip used per shot, seconds')
    ap.add_argument('--no-grade', action='store_true', help='skip the palette-lock colour grade (chapter_grade.py)')
    ap.add_argument('--transition', choices=['ink', 'fade'], default='ink', help='ink-bleed transition (default) or the old linear crossfade')
    ap.add_argument('--transition-sec', type=float, help=f'transition length (default ink {INK_SEC} s, fade {XF} s)')
    ap.add_argument('--narration-rate', help='edge-tts rate, e.g. -29%% (default chapter_audio.NARRATION_RATE)')
    ap.add_argument('--breath', type=float, default=BREATH, help='pause after each narration line before the next transition, seconds')
    ap.add_argument('--max-slow', type=float, default=MAX_SLOW, help='largest clip slowdown used to fit narration; beyond it the last frame is held')
    ap.add_argument('--slow-mode', choices=['mci', 'blend', 'hold'], default='mci', help='how slowed clips get their in-between frames (minterpolate mci / blend, or plain hold)')
    a = ap.parse_args(); ch = a.chapter
    T = a.transition_sec or (INK_SEC if a.transition == 'ink' else XF)
    spec = json.load(open(os.path.join(ROOT, 'video/data/chapter-videos', ch + '.json')))
    raw = a.raw or spec.get('rawDir') or f'/workspace/chapter-video/{ch}'
    assets = os.path.join(ROOT, 'video/viewer/assets'); official = os.path.join(assets, 'chapter-videos')
    out = os.path.abspath(a.out) if a.out else official; os.makedirs(out, exist_ok=True); is_official = out == official
    tmp = os.path.join(raw, 'build'); os.makedirs(tmp, exist_ok=True)
    tc = spec.get('titleCard', {}); tdur = tc.get('durationSec', 3); hold = spec.get('closingHoldSec', 3)
    title_card(f'{tmp}/title.png', tc.get('zh', spec['title']['zh']), tc.get('seal', '开卷'), assets)
    paper_bg(assets).save(f'{tmp}/endcard.png')
    shots = spec['shots']; nshot = len(shots)
    # narration first: every shot is stretched to fit its line + a breath before the next transition
    vo = vlen = None; cfg = None
    if not a.no_audio:
        import chapter_audio as CA
        cfg = dict(spec.get('audio', {}).get('narration', {'voice': 'zh-CN-YunjianNeural'}))
        cfg['rate'] = a.narration_rate or CA.NARRATION_RATE
        vo, vlen = CA.tts_durations([sh.get('narration') or sh['zh'] for sh in shots], {k: cfg[k] for k in ('voice', 'rate', 'pitch') if k in cfg}, tmp)
    voff = spec.get('audio', {}).get('narration', {}).get('offsetSec', 0.6)
    parts = []
    tpng = f'{tmp}/title.mp4'
    run(['ffmpeg', '-y', '-loglevel', 'error', '-loop', '1', '-t', str(tdur + T), '-i', f'{tmp}/title.png', '-vf', f'fps={FPS},format=yuv420p,fade=in:st=0:d=0.6:color=0xeceae4', '-c:v', 'libx264', '-crf', '16', tpng])
    parts.append((tpng, tdur + T))
    # palette-lock grade (ink -> paper grey ramp + vermilion only), clips in parallel
    src = {sh['n']: os.path.join(raw, sh['clip']) for sh in shots}
    from concurrent.futures import ProcessPoolExecutor
    if not a.no_grade:
        import chapter_grade as CG
        with ProcessPoolExecutor(max_workers=min(4, os.cpu_count() or 2)) as ex:
            futs = {sh['n']: ex.submit(CG.grade_clip, src[sh['n']], f"{tmp}/graded-{sh['n']:02d}.mp4", sh.get('grade', {})) for sh in shots}
            src = {n: f.result() for n, f in futs.items()}
        print('  graded', len(src), 'clips')
    probe = lambda f, e: subprocess.check_output(['ffprobe', '-v', 'error'] + (['-select_streams', 'v:0'] if e.startswith('stream') else []) + ['-show_entries', e, '-of', 'csv=p=0', f]).decode().strip()
    # shot lengths: max(clip, offset + narration + breath + transition); fill by slowing the clip (<= max-slow), then hold
    plan = {}
    for k, sh in enumerate(shots):
        n = sh['n']; cd = min(a.max_shot, float(probe(src[n], 'format=duration'))); last = k == nshot - 1
        need = (voff + vlen[k] + a.breath + (0 if last else T)) if vlen else cd
        dur = max(cd, need); slow = 1.0 if a.slow_mode == 'hold' else min(a.max_slow, dur / cd)
        plan[n] = (cd, dur, slow)
        if dur > cd: print(f'  shot {n}: narration {vlen[k]:.2f}s -> shot {dur:.2f}s (clip x{slow:.2f} slower' + (f', hold {dur - cd * slow:.2f}s)' if dur - cd * slow > 0.01 else ')'))
    slowed = {}
    with ProcessPoolExecutor(max_workers=min(4, os.cpu_count() or 2)) as ex:
        futs = {n: ex.submit(slow_clip, src[n], f'{tmp}/slow-{n:02d}.mp4', slow, a.slow_mode) for n, (cd, dur, slow) in plan.items() if slow > 1.001}
        slowed = {n: f.result() for n, f in futs.items()}
    shot_durs = []
    for k, sh in enumerate(shots):
        n = sh['n']; cd, dur, slow = plan[n]; clip = slowed.get(n, src[n]); cap = f'{tmp}/cap-{n:02d}.png'; caption(cap, sh['zh'])
        last = k == nshot - 1; cs = cd * slow
        pad = max(0.0, dur - cs) + (hold if last else 0)
        sharp = ',unsharp=5:5:0.6:5:5:0.0' if int(probe(clip, 'stream=height')) < H else ''  # sharpen only when upscaling
        cin = 0.8 * T  # caption appears once the incoming transition has mostly cleared
        cout = (dur - 0.6) if last else (dur - T - 0.55)  # and is gone before the outgoing one starts
        vf = (f'[0:v]trim=0:{cs:.3f},setpts=PTS-STARTPTS,fps={FPS},scale=-2:{H}:flags=lanczos,crop={W}:{H}{sharp},setsar=1'
              + (f',tpad=stop_mode=clone:stop_duration={pad:.3f}' if pad > 0 else '') + '[v];'
              f'[1:v]format=rgba,fade=in:st={cin:.2f}:d=0.6:alpha=1,fade=out:st={cout:.2f}:d=0.5:alpha=1[c];'
              '[v][c]overlay=0:0:shortest=0,format=yuv420p[o]')
        o = f'{tmp}/shot-{n:02d}.mp4'; L = dur + (hold if last else 0)
        run(['ffmpeg', '-y', '-loglevel', 'error', '-i', clip, '-loop', '1', '-t', f'{L:.3f}', '-i', cap,
             '-filter_complex', vf, '-map', '[o]', '-an', '-t', f'{L:.3f}', '-c:v', 'libx264', '-crf', '16', o])
        parts.append((o, L)); shot_durs.append(dur); sh['durationSec'] = round(dur, 2)
        if slow > 1.001: sh['clipSlowdown'] = round(slow, 3)
        else: sh.pop('clipSlowdown', None)
    # closing: ink back into blank paper
    endc = f'{tmp}/endcard.mp4'; ENDC = T + 0.8
    run(['ffmpeg', '-y', '-loglevel', 'error', '-loop', '1', '-t', f'{ENDC:.3f}', '-i', f'{tmp}/endcard.png', '-vf', f'fps={FPS},format=yuv420p', '-c:v', 'libx264', '-crf', '16', endc])
    parts.append((endc, ENDC))
    mp4 = os.path.join(out, ch + '.mp4'); silent = f'{tmp}/{ch}-silent.mp4'
    print(f'+ assemble {len(parts)} parts, {a.transition} transitions {T:.2f}s …')
    pstarts, total = assemble(parts, T, a.transition, silent if not a.no_audio else mp4, a.crf)
    starts = pstarts[1:1 + nshot]
    loud = None
    if not a.no_audio:
        import chapter_audio as CA
        # the last shot also covers the closing hold
        sd = shot_durs[:-1] + [shot_durs[-1] + hold]
        mixwav = CA.mix(total, tdur, starts, sd, spec, tmp, T, vo)
        normwav = f'{tmp}/mix-norm.wav'; CA.loudnorm(mixwav, normwav, -16.0)
        run(['ffmpeg', '-y', '-loglevel', 'error', '-i', silent, '-i', normwav, '-map', '0:v', '-map', '1:a', '-c:v', 'copy',
             '-c:a', 'aac', '-b:a', '160k', '-ac', '2', '-ar', '48000', '-t', f'{total:.3f}', '-movflags', '+faststart', mp4])
        loud = CA.measure(mp4)
        print(f'  loudness {loud[0]:.1f} LUFS, true peak {loud[1]:.1f} dBTP, narration {"edge-tts " + cfg.get("voice", "") + " rate " + cfg["rate"] if vo else "none (TTS unavailable)"}'
              + (f', {sum(vlen):.1f}s spoken' if vlen else ''))
    # poster: first shot before its caption fades in, so player controls never sit on burned text
    run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', '0.3', '-i', f'{tmp}/shot-01.mp4', '-frames:v', '1', f'{tmp}/poster.png'])
    pim = Image.open(f'{tmp}/poster.png').convert('RGB')
    pim.save(os.path.join(out, ch + '-poster.jpg'), quality=82, optimize=True, progressive=True)
    pim.save(os.path.join(out, ch + '-poster.webp'), quality=78, method=6)
    dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp4]).decode().strip())
    print('total', round(dur, 2), 's', os.path.getsize(mp4), 'bytes ->', mp4)
    json.dump({'starts': [round(x, 3) for x in pstarts], 'transitionSec': T, 'transition': a.transition, 'total': total,
               'narrationSec': [round(x, 2) for x in vlen] if vlen else None}, open(f'{tmp}/timeline.json', 'w'), indent=1)
    if not is_official: return
    for sh in shots: sh['status'] = 'done'
    if vo: spec.setdefault('audio', {}).setdefault('narration', {})['rate'] = cfg['rate']
    spec['output'] = {'mp4': f'video/viewer/assets/chapter-videos/{ch}.mp4',
                      'poster': f'video/viewer/assets/chapter-videos/{ch}-poster.jpg', 'durationSec': round(dur, 2),
                      'transition': a.transition, 'transitionSec': T, 'audio': bool(loud), 'narration': bool(vo), 'status': 'done'}
    if a.transition == 'fade': spec['output']['crossfadeSec'] = T
    if vo: spec['output']['narrationRate'] = cfg['rate']; spec['output']['narrationSec'] = round(sum(vlen), 1)
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
