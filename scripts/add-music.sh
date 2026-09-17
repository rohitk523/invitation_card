#!/usr/bin/env bash
# Lay a song under a reel.
#
#   ./scripts/add-music.sh <video> <song> [start] [out] [orig-vol]
#
#   start     where in the song to begin, e.g. 45 or 1:12   (default 0)
#   out       output path                                   (default <video>-music.mp4)
#   orig-vol  0 = drop the reel's own audio (default)
#             0.15 = keep it faint under the song, 1 = full
#
# Video is stream-copied, so this is fast and lossless.

set -euo pipefail

VIDEO=${1:?usage: add-music.sh <video> <song> [start] [out] [orig-vol]}
SONG=${2:?need a song file}
START=${3:-0}
OUT=${4:-"${VIDEO%.*}-music.mp4"}
ORIG_VOL=${5:-0}

FADE_IN=0.8
FADE_OUT=2.0
TARGET_LUFS=-14        # what Instagram / WhatsApp normalise to anyway

DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$VIDEO")
FADE_OUT_AT=$(echo "$DUR - $FADE_OUT" | bc -l)

echo "video    : $VIDEO (${DUR}s)"
echo "song     : $SONG from ${START}"
echo "orig aud : ${ORIG_VOL}"
echo "output   : $OUT"

SONG_CHAIN="[1:a]atrim=0:${DUR},asetpts=N/SR/TB,\
afade=t=in:st=0:d=${FADE_IN},\
afade=t=out:st=${FADE_OUT_AT}:d=${FADE_OUT}[song]"

if [ "$ORIG_VOL" = "0" ]; then
  FILTER="${SONG_CHAIN};[song]loudnorm=I=${TARGET_LUFS}:TP=-1.5:LRA=11[aout]"
else
  # keep the reel's own sound faint underneath, and duck it when the song is loud
  FILTER="${SONG_CHAIN};\
[0:a]atrim=0:${DUR},asetpts=N/SR/TB,volume=${ORIG_VOL}[orig];\
[orig][song]sidechaincompress=threshold=0.05:ratio=6:attack=20:release=400[ducked];\
[ducked][song]amix=inputs=2:duration=first:dropout_transition=0:normalize=0[mix];\
[mix]loudnorm=I=${TARGET_LUFS}:TP=-1.5:LRA=11[aout]"
fi

ffmpeg -hide_banner -loglevel warning -stats -y \
  -i "$VIDEO" \
  -ss "$START" -i "$SONG" \
  -filter_complex "$FILTER" \
  -map 0:v -map "[aout]" \
  -c:v copy -c:a aac -b:a 256k -ar 48000 -ac 2 \
  -movflags +faststart -shortest \
  "$OUT"

echo
echo "done -> $OUT"
ls -lh "$OUT" | awk '{print "         " $5}'
