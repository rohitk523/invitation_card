#!/usr/bin/env python3
"""
Find the best N-second window of a song to lay under a reel.

    ./scripts/find-hook.py <song> [window_seconds] [--top N]

Bollywood/pop structure: the chorus is the loudest sustained section and
usually arrives as a lift out of a quieter verse. So we score every candidate
start on two things -- how loud it stays across the whole window, and how
sharply energy rises going into it -- then snap the winner onto a beat so the
cut doesn't land mid-phrase.

Loudness comes from ffmpeg's ebur128 filter (momentary LUFS every 100ms);
no third-party packages needed.
"""

import re
import subprocess
import sys

FLOOR = -70.0          # treat anything below this as silence
STEP = 0.1             # ebur128 metadata interval
SILENCE_GUARD = 4.0    # don't let a window run into the outro fade
ENTRY_LOOKBACK = 6.0   # how far back to measure the lift into the chorus
ENTRY_LOOKAHEAD = 4.0
LIFT_WEIGHT = 1.4      # how much "it kicks in here" beats "it's loud here"
LIFT_CAP = 8.0
VOCAL_WEIGHT = 1.6     # the hook is the SUNG chorus, not just the loudest bar
LATE_WEIGHT = 6.0      # the final chorus is the climax -- prefer it
VOCAL_BAND = "highpass=f=300,lowpass=f=3400,"
DECAY_WEIGHT = 2.0     # punish windows whose tail dies into the outro
TAIL_FRAC = 0.3        # "tail" = last 30% of the window


def momentary_loudness(path, band=""):
    """[(t, dBFS)] every 100ms, smoothed to ~400ms like an EBU momentary window.

    Uses astats rather than ebur128 because this ffmpeg build only emits the
    ebur128 summary, not the per-frame lines.
    """
    proc = subprocess.run(
        ["ffmpeg", "-hide_banner", "-nostats", "-loglevel", "error",
         "-i", path, "-map", "0:a:0",
         "-af", band + "asetnsamples=n=4410,astats=metadata=1:reset=1,"
                "ametadata=print:key=lavfi.astats.Overall.RMS_level:file=-",
         "-f", "null", "-"],
        capture_output=True, text=True,
    )
    times, levels = [], []
    t = None
    for line in proc.stdout.splitlines():
        m = re.search(r"pts_time:([\d.]+)", line)
        if m:
            t = float(m.group(1))
            continue
        m = re.search(r"RMS_level=(-?[\d.]+|-?inf|nan)", line)
        if m and t is not None:
            raw = m.group(1)
            try:
                v = float(raw)
            except ValueError:
                v = FLOOR
            if v != v:          # nan
                v = FLOOR
            times.append(t)
            levels.append(max(v, FLOOR))
            t = None
    if not times:
        sys.exit(f"could not read loudness from {path}")

    # 400ms moving average -> approximates momentary loudness, kills jitter
    span = 4
    smoothed = []
    for i in range(len(levels)):
        lo = max(0, i - span // 2)
        hi = min(len(levels), i + span // 2 + 1)
        smoothed.append(sum(levels[lo:hi]) / (hi - lo))
    return list(zip(times, smoothed))


def duration(path):
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", path],
        capture_output=True, text=True, check=True,
    )
    return float(r.stdout.strip())


def mean(vals):
    return sum(vals) / len(vals) if vals else FLOOR


def window_mean(loud, t0, t1):
    return mean([v for t, v in loud if t0 <= t < t1])


def onset_strength(loud):
    """Positive frame-to-frame energy jumps -- a crude onset envelope."""
    return [(loud[i][0], max(0.0, loud[i][1] - loud[i - 1][1]))
            for i in range(1, len(loud))]


def estimate_period(onsets, lo=0.3, hi=1.0):
    """Autocorrelate the onset envelope to guess one beat period (60-200bpm)."""
    vals = [v for _, v in onsets]
    avg = mean(vals)
    centred = [v - avg for v in vals]
    best, best_score = None, 0.0
    for lag in range(round(lo / STEP), round(hi / STEP) + 1):
        n = len(centred) - lag
        score = sum(centred[i] * centred[i + lag]
                    for i in range(0, n, 3)) / max(n, 1)
        if score > best_score:
            best, best_score = lag * STEP, score
    return best


def snap_to_beat(onsets, target, period, radius=0.6):
    """Nudge the cut onto the strongest onset within +/- radius seconds."""
    near = [(t, v) for t, v in onsets if abs(t - target) <= radius]
    if not near:
        return target
    strongest = max(near, key=lambda tv: tv[1])
    return strongest[0] if strongest[1] > 0.5 else target


def fmt(t):
    return f"{int(t) // 60}:{t - 60 * (int(t) // 60):04.1f}"


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not args:
        sys.exit(__doc__)
    song = args[0]
    window = float(args[1]) if len(args) > 1 else 38.6
    top_n = 5
    if "--top" in sys.argv:
        top_n = int(sys.argv[sys.argv.index("--top") + 1])

    total = duration(song)
    if window >= total:
        sys.exit(f"song ({total:.1f}s) is shorter than the window ({window}s)")

    loud = momentary_loudness(song)
    vocal = momentary_loudness(song, VOCAL_BAND)
    onsets = onset_strength(loud)
    period = estimate_period(onsets)

    latest = total - window - SILENCE_GUARD
    if latest <= 0:
        latest = total - window

    scored = []
    for i in range(0, int(latest / 0.25) + 1):
        t = i * 0.25
        sustained = window_mean(loud, t, t + window)
        voc = window_mean(vocal, t, t + window)
        before = window_mean(loud, max(0.0, t - ENTRY_LOOKBACK), t)
        after = window_mean(loud, t, t + ENTRY_LOOKAHEAD)
        lift = min(max(after - before, 0.0), LIFT_CAP)
        late = (t / latest) if latest > 0 else 0.0

        # A cut that fades out under the picture feels like the song ran out.
        # Compare the window's tail against its body and penalise the drop.
        split = t + window * (1 - TAIL_FRAC)
        body = window_mean(loud, t, split)
        tail = window_mean(loud, split, t + window)
        decay = max(0.0, body - tail)

        score = (sustained
                 + VOCAL_WEIGHT * voc
                 + LIFT_WEIGHT * lift
                 + LATE_WEIGHT * late
                 - DECAY_WEIGHT * decay)
        scored.append((score, t, sustained, lift, voc, decay))

    scored.sort(reverse=True)

    # keep candidates that are meaningfully different cuts
    picks = []
    for s in scored:
        if all(abs(s[1] - p[1]) > window * 0.4 for p in picks):
            picks.append(s)
        if len(picks) == top_n:
            break

    print(f"song     : {song}")
    print(f"length   : {fmt(total)}  ({total:.1f}s)")
    print(f"window   : {window}s")
    if period:
        print(f"tempo    : ~{60 / period:.0f} bpm (beat every {period:.2f}s)")
    print()
    print(f"{'#':<3}{'start':<10}{'end':<10}{'loud':<10}{'vocal':<10}"
          f"{'lift-in':<10}{'decay':<9}score")
    print("-" * 69)
    for i, (score, t, sustained, lift, voc, decay) in enumerate(picks, 1):
        snapped = snap_to_beat(onsets, t, period) if period else t
        tag = "  <-- best" if i == 1 else ""
        print(f"{i:<3}{fmt(snapped):<10}{fmt(snapped + window):<10}"
              f"{sustained:>6.1f} dB  {voc:>6.1f} dB  {lift:>5.1f} dB "
              f"{decay:>5.1f} dB {score:7.1f}{tag}")

    best_t = snap_to_beat(onsets, picks[0][1], period) if period else picks[0][1]
    print()
    print(f"suggested start: {best_t:.2f}   ({fmt(best_t)})")


if __name__ == "__main__":
    main()
