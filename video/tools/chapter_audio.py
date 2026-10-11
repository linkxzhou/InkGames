"""Original procedural soundtrack for chapter opening videos (no samples, no copyrighted material).

Used by build-chapter-video.py. Needs numpy + ffmpeg; narration uses edge-tts (network) if available.
Everything is synthesised here from sine waves and filtered noise with a fixed random seed,
so a rebuild gives the same audio.
"""
import json, os, subprocess, shutil, re
import numpy as np

SR = 48000
PENTA = [146.83, 164.81, 185.00, 220.00, 246.94, 293.66, 329.63, 369.99, 440.00]  # D宫 pentatonic, D3–A4

# ---------------- primitives ----------------
def t_axis(sec): return np.arange(int(sec * SR)) / SR

def band(x, lo, hi):
    """Zero-phase FFT band-pass (lo/hi in Hz; None = open)."""
    n = len(x); X = np.fft.rfft(x); f = np.fft.rfftfreq(n, 1 / SR); m = np.ones_like(f)
    if lo: m *= 1 / (1 + (lo / np.maximum(f, 1e-3)) ** 4)
    if hi: m *= 1 / (1 + (f / hi) ** 4)
    return np.fft.irfft(X * m, n)

def norm(x, peak=1.0):
    p = np.max(np.abs(x)) or 1.0; return x / p * peak

def env_ad(n, a, d):
    """Attack (s) + exponential decay time-constant (s)."""
    t = np.arange(n) / SR; e = np.exp(-t / d); na = max(1, int(a * SR)); e[:na] *= np.linspace(0, 1, na); return e

def lfo(sec, rate, depth, rng, base=1.0):
    t = t_axis(sec); ph = rng.uniform(0, 2 * np.pi); return base + depth * np.sin(2 * np.pi * rate * t + ph)

def slow_noise_env(sec, rng, cps=0.3, lo=0.3, hi=1.0):
    """Smooth random envelope (cps = changes per second)."""
    k = max(2, int(sec * cps) + 2); pts = rng.uniform(lo, hi, k); xs = np.linspace(0, sec, k)
    return np.interp(t_axis(sec), xs, pts)

def reverb(x, sec=2.6, wet=0.28, rng=None):
    rng = rng or np.random.default_rng(7); n = int(sec * SR)
    ir = rng.standard_normal(n) * np.exp(-np.arange(n) / SR / (sec / 6.5)); ir = band(ir, 200, 6000); ir /= np.sqrt(np.sum(ir ** 2))
    L = len(x) + n; N = 1 << (L - 1).bit_length()
    y = np.fft.irfft(np.fft.rfft(x, N) * np.fft.rfft(ir, N), N)[:len(x)]
    return (1 - wet) * x + wet * y

def place(buf, sig, t0, gain=1.0):
    i = int(t0 * SR)
    if i >= len(buf): return
    j = min(len(buf), i + len(sig)); buf[max(0, i):j] += gain * sig[max(0, -i):j - i]

# ---------------- music bed ----------------
def pluck(freq, rng, sec=3.2, slide=False):
    """Guqin/guzheng-like plucked string: inharmonic decaying partials + soft attack noise."""
    t = t_axis(sec); y = np.zeros_like(t)
    f = freq * (1 - (0.03 if slide else 0) * (1 - np.exp(-t / 0.5)))  # 吟猱-like downward slide
    for k in range(1, 9):
        inh = k * np.sqrt(1 + 0.0004 * k * k)
        y += (1 / k ** 1.25) * np.sin(2 * np.pi * np.cumsum(f * inh) / SR + rng.uniform(0, 6.28)) * np.exp(-t / (1.9 / k ** 0.7))
    y += 0.25 * band(rng.standard_normal(len(t)), 800, 5000) * np.exp(-t / 0.012)
    return y * env_ad(len(t), 0.004, 10)

def drum(sec=2.6, f0=78, f1=42):
    t = t_axis(sec); f = f1 + (f0 - f1) * np.exp(-t / 0.18)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.7)
    y += 0.4 * band(np.random.default_rng(3).standard_normal(len(t)), 40, 400) * np.exp(-t / 0.08)
    return y

def music_bed(total, title_sec, rng):
    t = t_axis(total); bed = np.zeros_like(t)
    # drone: D2 + A2 + D3, slow breathing, plus a dark noise pad
    for f, a in ((73.42, 1.0), (110.0, 0.5), (146.83, 0.25)):
        bed += a * np.sin(2 * np.pi * f * t + rng.uniform(0, 6.28)) * lfo(total, 0.07 + rng.uniform(0, .05), 0.25, rng)
    bed += 0.6 * norm(band(rng.standard_normal(len(t)), 60, 300)) * slow_noise_env(total, rng, 0.2, .4, 1)
    fin = np.minimum(1, t / 2.5); fout = np.clip((total - t) / 3.0, 0, 1); bed *= fin * fout
    bed = norm(bed, 0.10)
    # sparse plucks after the title card
    notes = np.zeros_like(t); tt = title_sec + 0.8; last = 4
    while tt < total - 3.5:
        step = int(np.clip(last + rng.choice([-2, -1, 1, 2, 3]), 0, len(PENTA) - 1)); last = step
        p = pluck(PENTA[step], rng, slide=rng.random() < 0.3)
        place(notes, p, tt, 0.9 if rng.random() < 0.7 else 0.55)
        if rng.random() < 0.25: place(notes, pluck(PENTA[min(len(PENTA) - 1, step + 2)], rng), tt + 0.18, 0.4)  # grace note
        tt += rng.uniform(2.2, 4.6)
    notes = norm(reverb(notes, 3.2, 0.35, rng), 0.22)
    hit = np.zeros_like(t); place(hit, drum(), 0.25, 1.0); place(hit, drum(2.0, 70, 40), total - 3.2, 0.6)
    hit = norm(reverb(hit, 2.4, 0.3, rng), 0.35)
    return bed + notes + hit

# ---------------- ambience ----------------
def a_wind(sec, rng, lo=250, hi=1600):
    x = band(rng.standard_normal(int(sec * SR)), lo, hi)
    return norm(x) * slow_noise_env(sec, rng, 0.6, .25, 1)

def a_rumble(sec, rng):
    x = np.cumsum(rng.standard_normal(int(sec * SR))); x = band(x - np.mean(x), 18, 110)
    return norm(x) * slow_noise_env(sec, rng, 0.5, .4, 1)

def a_stone(sec, rng):
    y = np.zeros(int(sec * SR))
    for t0 in (0.6, 2.6, 4.4):
        s = sum(a * np.sin(2 * np.pi * f * t_axis(2.5)) * np.exp(-t_axis(2.5) / d) for f, a, d in ((196, 1, .9), (523, .6, .6), (911, .4, .4), (1430, .25, .25)))
        place(y, s, t0 + rng.uniform(-.1, .1), rng.uniform(.6, 1))
    return norm(reverb(y, 2.2, .4, rng))

def a_shimmer(sec, rng):
    t = t_axis(sec); y = sum(np.sin(2 * np.pi * f * t) * lfo(sec, rng.uniform(3, 6), .5, rng) for f in (1760, 2217, 2637, 3520))
    return norm(y) * np.clip(t / 2.0, 0, 1) * np.clip((sec - t) / 1.0, 0, 1)

def a_insects(sec, rng):
    y = np.zeros(int(sec * SR)); tt = rng.uniform(0, .5)
    while tt < sec - .3:
        n = int(rng.uniform(.08, .25) * SR); tc = np.arange(n) / SR; f = rng.uniform(4200, 5600)
        c = np.sin(2 * np.pi * f * tc) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * rng.uniform(28, 45) * tc))) * np.hanning(n)
        place(y, c, tt, rng.uniform(.3, 1)); tt += rng.uniform(.15, .7)
    return norm(y)

def a_grass(sec, rng):
    x = band(rng.standard_normal(int(sec * SR)), 1500, 7000)
    return norm(x * band(np.abs(rng.standard_normal(len(x))), None, 6) ** 1.5) * slow_noise_env(sec, rng, 1.2, .3, 1)

def a_water(sec, rng, rate=40):
    y = np.zeros(int(sec * SR)); tt = 0.0
    while tt < sec:
        n = int(rng.uniform(.01, .04) * SR); tc = np.arange(n) / SR; f0 = rng.uniform(500, 2200)
        place(y, np.sin(2 * np.pi * (f0 + 3000 * tc) * tc) * np.hanning(n), tt, rng.uniform(.2, 1)); tt += rng.exponential(1 / rate)
    return norm(y + 0.3 * norm(band(rng.standard_normal(len(y)), 300, 2500)))

def a_drums(sec, rng):
    y = np.zeros(int(sec * SR)); tt = 0.8
    while tt < sec - .5:
        place(y, band(drum(1.2, 90, 55), None, 600), tt, rng.uniform(.6, 1)); tt += rng.choice([.55, .55, 1.1])
    return norm(reverb(y, 2.8, .55, rng))

def a_horn(sec, rng):
    y = np.zeros(int(sec * SR)); n = int(2.6 * SR); tc = np.arange(n) / SR
    f = 110 * (1 + .004 * np.sin(2 * np.pi * 5 * tc)) * (0.97 + 0.03 * np.minimum(1, tc / .4))
    s = sum((1 / k) * np.sin(2 * np.pi * k * np.cumsum(f) / SR) for k in range(1, 9))
    s = band(s, 80, 1200) * np.minimum(1, tc / .5) * np.clip((2.6 - tc) / .8, 0, 1)
    place(y, s, min(1.8, sec - 2.8)); return norm(reverb(y, 3, .5, rng))

def a_waves(sec, rng):
    t = t_axis(sec); x = band(rng.standard_normal(len(t)), 150, 3000)
    sw = 0.25 + 0.75 * (0.5 + 0.5 * np.sin(2 * np.pi * t / 5.5 + rng.uniform(0, 6))) ** 2
    return norm(x * sw)

def a_ox(sec, rng):
    y = np.zeros(int(sec * SR)); n = int(1.8 * SR); tc = np.arange(n) / SR
    f = 125 - 35 * tc / 1.8; s = sum((1 / k ** .8) * np.sin(2 * np.pi * k * np.cumsum(f) / SR) for k in range(1, 12))
    s = band(s, 90, 900) * np.minimum(1, tc / .25) * np.clip((1.8 - tc) / .5, 0, 1)
    place(y, s, 1.6); return norm(reverb(y, 2, .35, rng))

def a_rushing(sec, rng):
    x = band(rng.standard_normal(int(sec * SR)), 120, 2500)
    return norm(0.7 * norm(x) + 0.5 * a_water(sec, rng, 120)) * slow_noise_env(sec, rng, .8, .7, 1)

def a_fire(sec, rng):
    """Crackling fire: low roar + random sharp crackles."""
    n = int(sec * SR); roar = norm(band(rng.standard_normal(n), 60, 700)) * slow_noise_env(sec, rng, 1.5, .5, 1)
    cr = np.zeros(n); tt = 0.0
    while tt < sec:
        k = int(rng.uniform(.002, .012) * SR); place(cr, rng.standard_normal(k) * np.exp(-np.arange(k) / (k / 4)), tt, rng.uniform(.2, 1)); tt += rng.exponential(1 / 14)
    return norm(0.7 * roar + 0.6 * norm(band(cr, 1200, 9000)))

def a_rain(sec, rng):
    n = int(sec * SR); hiss = norm(band(rng.standard_normal(n), 1500, 9000))
    drops = np.zeros(n); tt = 0.0
    while tt < sec:
        k = int(.006 * SR); place(drops, np.sin(2 * np.pi * rng.uniform(2000, 5000) * np.arange(k) / SR) * np.hanning(k), tt, rng.uniform(.1, .6)); tt += rng.exponential(1 / 80)
    return norm(hiss * slow_noise_env(sec, rng, .4, .7, 1) + 0.4 * drops)

def a_thunder(sec, rng):
    y = np.zeros(int(sec * SR))
    for t0 in sorted(rng.uniform(.3, max(.4, sec - 3), 2)):
        k = int(3 * SR); x = np.cumsum(rng.standard_normal(k)); x = band(x - x.mean(), 25, 400)
        e = np.exp(-np.arange(k) / SR / .9) * (1 - np.exp(-np.arange(k) / SR / .05)) * (0.6 + 0.4 * band(np.abs(rng.standard_normal(k)), None, 8))
        place(y, norm(x * e), t0, rng.uniform(.6, 1))
    return norm(reverb(y, 3, .4, rng))

def a_hooves(sec, rng):
    """Distant galloping hooves: groups of four soft thuds."""
    y = np.zeros(int(sec * SR)); tt = .2; per = rng.uniform(.42, .55)
    hit = lambda: band(rng.standard_normal(int(.05 * SR)), 80, 900) * np.exp(-np.arange(int(.05 * SR)) / (.012 * SR))
    while tt < sec - .2:
        for o in (0, .08, .17, .24): place(y, hit(), tt + o + rng.uniform(-.01, .01), rng.uniform(.5, 1))
        tt += per
    return norm(reverb(y, 1.2, .3, rng)) * slow_noise_env(sec, rng, .5, .6, 1)

def a_bell(sec, rng):
    """Sparse temple bell / bronze bianzhong strikes."""
    y = np.zeros(int(sec * SR)); f0 = rng.choice([220.0, 246.9, 293.7])
    for t0 in (0.4, sec * 0.55):
        t = t_axis(4.0); b = sum(a * np.sin(2 * np.pi * f0 * r * t) * np.exp(-t / d) for r, a, d in ((1, 1, 2.2), (2.76, .5, 1.2), (5.4, .3, .6), (8.9, .15, .3)))
        place(y, b, t0, rng.uniform(.7, 1))
    return norm(reverb(y, 3, .35, rng))

def a_oars(sec, rng):
    """Oar strokes: swish + splash in a slow rhythm, with a soft wooden creak."""
    y = np.zeros(int(sec * SR)); tt = .3
    while tt < sec - .6:
        k = int(.45 * SR); sw = band(rng.standard_normal(k), 300, 3000) * np.hanning(k)
        place(y, sw, tt, .8)
        c = int(.18 * SR); tc = np.arange(c) / SR; place(y, np.sin(2 * np.pi * (180 + 60 * tc / .18) * tc) * np.hanning(c) * .3, tt + .4)
        tt += rng.uniform(1.6, 2.1)
    return norm(y)

def a_birds(sec, rng):
    """Small birdsong chirps: short frequency-swept sine blips."""
    y = np.zeros(int(sec * SR)); tt = rng.uniform(.2, .8)
    while tt < sec - .4:
        for j in range(int(rng.integers(2, 5))):
            k = int(rng.uniform(.04, .1) * SR); tc = np.arange(k) / SR; f = rng.uniform(2500, 4500)
            place(y, np.sin(2 * np.pi * (f + rng.uniform(-1500, 1500) * tc / tc[-1]) * tc) * np.hanning(k), tt + j * .11, rng.uniform(.4, 1))
        tt += rng.uniform(.9, 2.2)
    return norm(reverb(y, 1.5, .3, rng))

def a_crowd(sec, rng):
    """Distant crowd murmur: many band-limited noise 'voices' with syllable-rate modulation."""
    n = int(sec * SR); y = np.zeros(n)
    for _ in range(10):
        f = rng.uniform(250, 900); v = band(rng.standard_normal(n), f * .7, f * 1.6)
        y += v * band(np.abs(rng.standard_normal(n)), None, rng.uniform(3, 6))
    return norm(band(y, 150, 2500))

def a_drip(sec, rng):
    y = np.zeros(int(sec * SR)); tt = rng.uniform(.2, .6)
    while tt < sec:
        k = int(.08 * SR); tc = np.arange(k) / SR; f = rng.uniform(900, 1700)
        place(y, np.sin(2 * np.pi * f * (1 + 2 * tc) * tc) * np.exp(-tc / .02), tt, rng.uniform(.5, 1)); tt += rng.uniform(.6, 1.6)
    return norm(reverb(y, 1.8, .45, rng))

AMB = {  # name -> (generator, level)
    'fire': (a_fire, .22), 'rain': (a_rain, .22), 'thunder': (a_thunder, .40), 'hooves': (a_hooves, .40),
    'bell': (a_bell, .22), 'oars': (a_oars, .32), 'birds': (a_birds, .10), 'crowd': (a_crowd, .16),
    'snow-wind': (lambda s, r: a_wind(s, r, 400, 2500), .26), 'drip': (a_drip, .16),
    'wind': (a_wind, .30), 'rumble': (a_rumble, .40), 'stone': (a_stone, .30), 'shimmer': (a_shimmer, .10),
    'marsh-wind': (lambda s, r: a_wind(s, r, 150, 900), .28), 'insects': (a_insects, .10),
    'grass': (a_grass, .22), 'water': (lambda s, r: a_water(s, r, 30), .14),
    'fog-wind': (lambda s, r: a_wind(s, r, 200, 1100), .26), 'war-drums': (a_drums, .14), 'horn': (a_horn, .22),
    'waves': (a_waves, .26), 'ox': (a_ox, .30), 'rushing-water': (a_rushing, .25),
}

def ambience_track(total, segs, rng, xf):
    """segs: (t0, dur, names) crossfading xf s around each boundary, or (t0, dur, names, xf_in, xf_out) per segment."""
    y = np.zeros(int(total * SR))
    for sg in segs:
        t0, dur, names = sg[:3]; xi, xo = (sg[3], sg[4]) if len(sg) > 3 else (xf, xf)
        L = dur + xi / 2 + xo / 2; seg = np.zeros(int(L * SR))
        for nm in names:
            g, lv = AMB[nm]; seg += lv * g(L, rng)[:len(seg)]
        ki, ko = int(xi * SR), int(xo * SR); e = np.ones(len(seg)); e[:ki] = np.linspace(0, 1, ki); e[len(seg) - ko:] = np.linspace(1, 0, ko)
        place(y, seg * e, t0 - xi / 2)
    return y

# ---------------- narration ----------------
# edge-tts speaking rate. -29% (2026-10-11) makes the lines about 1.3x as long as the earlier -8%, slowed at
# synthesis time so the voice stays natural (no time-stretching); build-chapter-video.py --narration-rate overrides it.
NARRATION_RATE = '-29%'

def tts_bin():
    for c in (os.environ.get('EDGE_TTS'), shutil.which('edge-tts'), '/workspace/.venv-audio/bin/edge-tts'):
        if c and os.path.exists(c): return c
    return None

def synth_lines(lines, cfg, tmp):
    """Returns list of mono float arrays (or None when TTS is unavailable)."""
    exe = tts_bin(); out = []
    if not exe: print('! edge-tts not found: music and ambience only'); return None
    for i, text in enumerate(lines, 1):
        mp3 = f'{tmp}/vo-{i:02d}.mp3'; wav = f'{tmp}/vo-{i:02d}.wav'
        try:
            if not os.path.exists(mp3) or open(mp3 + '.txt').read() != json.dumps([text, cfg], ensure_ascii=False):
                subprocess.run([exe, '--voice', cfg['voice'], f"--rate={cfg.get('rate', '+0%')}", f"--pitch={cfg.get('pitch', '+0Hz')}", '--text', text, '--write-media', mp3], check=True, timeout=90, capture_output=True)
                open(mp3 + '.txt', 'w').write(json.dumps([text, cfg], ensure_ascii=False))
        except Exception as e:
            print('! TTS failed (' + str(e)[:80] + '): music and ambience only'); return None
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', mp3, '-ac', '1', '-ar', str(SR), '-af', 'highpass=f=70,acompressor=threshold=-20dB:ratio=2.5:attack=5:release=120', wav], check=True)
        raw = subprocess.check_output(['ffmpeg', '-loglevel', 'error', '-i', wav, '-f', 'f32le', '-'])
        v = np.frombuffer(raw, np.float32).astype(np.float64)
        nz = np.nonzero(np.abs(v) > 1e-3)[0]; v = v[nz[0]:nz[-1] + 1] if len(nz) else v  # trim silence
        out.append(v)
    return out

def tts_durations(lines, cfg, tmp):
    vo = synth_lines(lines, cfg, tmp)
    return (vo, [len(v) / SR for v in vo]) if vo else (None, None)

# ---------------- mix ----------------
def mix(total, title_sec, shot_starts, shot_durs, spec, tmp, xf, vo=None, seed=1, amb_segs=None):
    """amb_segs (flow transitions): per shot (t0, dur, xf_in, xf_out) for its ambience, else shot start/length with xf."""
    rng = np.random.default_rng(seed)
    music = music_bed(total, title_sec, rng)
    segs = ([(t0, d, sh.get('ambience', []), xi, xo) for (t0, d, xi, xo), sh in zip(amb_segs, spec['shots'])] if amb_segs
            else [(s, d, sh.get('ambience', [])) for s, d, sh in zip(shot_starts, shot_durs, spec['shots'])])
    amb = ambience_track(total, segs, rng, xf)
    bed = music + amb
    voice = np.zeros(int(total * SR)); off = spec.get('audio', {}).get('narration', {}).get('offsetSec', 0.6)
    if vo:
        for s, v in zip(shot_starts, vo): place(voice, norm(v, 0.7), s + off)
        # ducking: smoothed voice envelope pulls the bed down ~9 dB, 150 ms attack / 500 ms release feel
        env = np.abs(voice); k = int(0.05 * SR); env = np.convolve(env, np.ones(k) / k, 'same')
        env = np.convolve((env > 0.01).astype(float), np.hanning(int(0.6 * SR)) / (np.sum(np.hanning(int(0.6 * SR))) / 1.0), 'same')
        bed *= 1 - 0.65 * np.clip(env, 0, 1)
    voice_st = np.stack([voice, voice], 1)
    # gentle stereo: decorrelate bed slightly (Haas 9 ms on the right)
    d = int(0.009 * SR); bedR = np.concatenate([np.zeros(d), bed[:-d]])
    st = voice_st + np.stack([bed, 0.85 * bed + 0.15 * bedR], 1)
    st = np.tanh(st * 1.1) / 1.1
    wav = f'{tmp}/mix.wav'; write_wav(wav, st)
    return wav

def write_wav(path, st):
    pcm = (np.clip(st, -1, 1) * 32767).astype('<i2')
    import wave
    with wave.open(path, 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())

def loudnorm(src, dst, target=-16.0):
    """Two-pass EBU R128 loudness normalisation to `target` LUFS, -1.5 dBTP."""
    p1 = subprocess.run(['ffmpeg', '-hide_banner', '-i', src, '-af', f'loudnorm=I={target}:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
    m = json.loads(re.findall(r'\{[^{}]*\}', p1)[-1])
    af = (f"loudnorm=I={target}:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
          f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true,aresample={SR}")
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', src, '-af', af, '-ar', str(SR), dst], check=True)

def measure(path):
    e = subprocess.run(['ffmpeg', '-hide_banner', '-i', path, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
    m = json.loads(re.findall(r'\{[^{}]*\}', e)[-1]); return float(m['input_i']), float(m['input_tp'])
