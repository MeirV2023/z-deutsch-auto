#!/usr/bin/env python3
"""
Add expressive Russian gamer narration + dramatic Cold-Open to VOCANOVA Shorts.

Reads the clean 1080x1920 60fps master videos (videos/short*_clean.mp4),
prepends a dynamic slow-expression Cold-Open ("Я учу немецкий... ИГРАЯ" ->
"И вот — как именно!"), synthesizes expressive Russian neural speech via
edge-tts (ru-RU-SvetlanaNeural), applies sidechain ducking over the original
SFX + Gemini 3.8 TTS German word pronunciations, composites crisp Pillow RGBA
overlays + bottom progress bar, and encodes *_voiced.mp4 in videos/.
"""

import argparse
import asyncio
import json
import re
import shutil
import subprocess
import time
import wave
from pathlib import Path

import edge_tts
import imageio_ffmpeg
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT_DIR = Path(__file__).resolve().parent.parent
VIDEOS_DIR = ROOT_DIR / "videos"
PREVIEWS_DIR = VIDEOS_DIR / "previews"

OUT_W = 1080
OUT_H = 1920
TARGET_FPS = 60
SAMPLE_RATE = 48000

DEFAULT_VOICE = "ru-RU-SvetlanaNeural"
FONT_BOLD_PATH = r"C:\Windows\Fonts\segoeuib.ttf"
FONT_REG_PATH = r"C:\Windows\Fonts\segoeui.ttf"


def run_ffmpeg(args: list[str], desc: str, capture_stderr: bool = False) -> str:
    """Execute bundled FFmpeg executable and raise loudly on failure."""
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    cmd = [ffmpeg, "-y", "-hide_banner", *args]
    res = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")
    if res.returncode != 0:
        raise RuntimeError(f"FFmpeg failed ({desc}):\n{res.stderr}\n{res.stdout}")
    return res.stderr if capture_stderr else ""


def probe_video_duration(mp4_path: Path) -> float:
    """Read exact duration in seconds from FFmpeg stderr header."""
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    res = subprocess.run(
        [ffmpeg, "-hide_banner", "-i", str(mp4_path)],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    m = re.search(r"Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)", res.stderr)
    if not m:
        raise RuntimeError(f"Could not parse Duration from {mp4_path}:\n{res.stderr}")
    hrs, mins, secs = int(m.group(1)), int(m.group(2)), float(m.group(3))
    return hrs * 3600.0 + mins * 60.0 + secs


def measure_wav_duration(wav_path: Path) -> float:
    """Return exact WAV duration in seconds."""
    with wave.open(str(wav_path), "rb") as wf:
        return wf.getnframes() / float(wf.getframerate())


def atempo_chain(factor: float) -> str:
    """Build valid chained FFmpeg atempo filters for arbitrary factor."""
    parts = []
    f = float(factor)
    while f < 0.5:
        parts.append("atempo=0.5")
        f /= 0.5
    while f > 2.0:
        parts.append("atempo=2.0")
        f /= 2.0
    parts.append(f"atempo={f:.5f}")
    return ",".join(parts)


async def synth_phrase_to_wav(
    text: str,
    voice: str,
    rate: str,
    pitch: str,
    raw_mp3: Path,
    wav_path: Path,
    retries: int = 5,
) -> float:
    """Synthesize phrase with edge-tts, trim edge silence, and convert to 48kHz stereo WAV."""
    last_err = None
    for attempt in range(1, retries + 1):
        try:
            comm = edge_tts.Communicate(text, voice=voice, rate=rate, pitch=pitch)
            await comm.save(str(raw_mp3))
            if raw_mp3.exists() and raw_mp3.stat().st_size > 500:
                break
        except Exception as err:
            last_err = err
            await asyncio.sleep(0.7 * attempt)
    else:
        raise RuntimeError(
            f"edge-tts failed after {retries} attempts for '{text}' ({voice}): {last_err}"
        )

    run_ffmpeg(
        [
            "-loglevel", "warning",
            "-i", str(raw_mp3),
            "-af", (
                "silenceremove=start_periods=1:start_silence=0.04:start_threshold=-45dB,"
                "areverse,"
                "silenceremove=start_periods=1:start_silence=0.04:start_threshold=-45dB,"
                "areverse,"
                f"aresample={SAMPLE_RATE},aformat=channel_layouts=stereo"
            ),
            "-ar", str(SAMPLE_RATE),
            "-ac", "2",
            str(wav_path),
        ],
        f"trim wav {wav_path.name}",
    )
    return measure_wav_duration(wav_path)


def speedup_wav(src_wav: Path, dst_wav: Path, factor: float) -> float:
    """Gently speed up a WAV clip via FFmpeg atempo and return new duration."""
    run_ffmpeg(
        [
            "-loglevel", "warning",
            "-i", str(src_wav),
            "-af", f"{atempo_chain(factor)},aresample={SAMPLE_RATE},aformat=channel_layouts=stereo",
            "-ar", str(SAMPLE_RATE),
            "-ac", "2",
            str(dst_wav),
        ],
        f"atempo {dst_wav.name}",
    )
    return measure_wav_duration(dst_wav)


def _fit_font(
    draw: ImageDraw.ImageDraw,
    text: str,
    font_path: str,
    max_size: int,
    min_size: int,
    max_width: int,
) -> ImageFont.FreeTypeFont:
    size = max_size
    while size > min_size:
        font = ImageFont.truetype(font_path, size)
        bbox = draw.textbbox((0, 0), text, font=font)
        if (bbox[2] - bbox[0]) <= max_width:
            return font
        size -= 2
    return ImageFont.truetype(font_path, min_size)


def _draw_bolt(draw: ImageDraw.ImageDraw, cx: int, cy: int, scale: float, fill: tuple):
    pts = [
        (cx + 3 * scale, cy - 15 * scale),
        (cx - 10 * scale, cy + 2 * scale),
        (cx - 1 * scale, cy + 2 * scale),
        (cx - 5 * scale, cy + 16 * scale),
        (cx + 10 * scale, cy - 2 * scale),
        (cx + 1 * scale, cy - 2 * scale),
    ]
    draw.polygon(pts, fill=fill)


def _draw_diamond(draw: ImageDraw.ImageDraw, cx: int, cy: int, r: float, fill: tuple):
    pts = [(cx, cy - r), (cx + r, cy), (cx, cy + r), (cx - r, cy)]
    draw.polygon(pts, fill=fill)


def render_cold_open_card1(out_path: Path) -> None:
    """Render dramatic Cold-Open Card 1: 'Я учу немецкий...' + 'ИГРАЯ'."""
    img = Image.new("RGBA", (OUT_W, OUT_H), (0, 0, 0, 0))
    glow = Image.new("RGBA", (OUT_W, OUT_H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)

    x0, x1 = 56, OUT_W - 56
    y0, y1 = 740, 1085
    gd.rounded_rectangle(
        [x0 - 5, y0 - 5, x1 + 5, y1 + 5],
        radius=36,
        outline=(56, 189, 248, 190),
        width=8,
    )
    glow = glow.filter(ImageFilter.GaussianBlur(14))
    img = Image.alpha_composite(img, glow)

    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle(
        [x0, y0, x1, y1],
        radius=34,
        fill=(6, 14, 32, 232),
        outline=(56, 189, 248, 240),
        width=3,
    )

    f_top = _fit_font(draw, "Я учу немецкий...", FONT_BOLD_PATH, 54, 34, (x1 - x0) - 80)
    f_big = _fit_font(draw, "ИГРАЯ", FONT_BOLD_PATH, 92, 56, (x1 - x0) - 120)

    top_txt = "Я учу немецкий..."
    tb = draw.textbbox((0, 0), top_txt, font=f_top)
    tw = tb[2] - tb[0]
    tx = (OUT_W - tw) // 2
    ty = y0 + 52
    draw.text((tx + 2, ty + 3), top_txt, font=f_top, fill=(0, 0, 0, 190))
    draw.text((tx, ty), top_txt, font=f_top, fill=(224, 242, 254, 255))

    big_txt = "ИГРАЯ"
    bb = draw.textbbox((0, 0), big_txt, font=f_big)
    bw = bb[2] - bb[0]
    bx = (OUT_W - bw) // 2
    by = y0 + 148
    _draw_bolt(draw, bx - 44, by + 56, 1.5, (250, 204, 21, 255))
    _draw_bolt(draw, bx + bw + 44, by + 56, 1.5, (250, 204, 21, 255))
    draw.text((bx + 3, by + 4), big_txt, font=f_big, fill=(0, 0, 0, 200))
    draw.text((bx, by), big_txt, font=f_big, fill=(254, 240, 138, 255))

    img.save(out_path)


def render_cold_open_card2(out_path: Path) -> None:
    """Render dramatic Cold-Open Card 2: 'И ВОТ КАК ИМЕННО...'."""
    img = Image.new("RGBA", (OUT_W, OUT_H), (0, 0, 0, 0))
    glow = Image.new("RGBA", (OUT_W, OUT_H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)

    x0, x1 = 68, OUT_W - 68
    y0, y1 = 815, 1025
    gd.rounded_rectangle(
        [x0 - 5, y0 - 5, x1 + 5, y1 + 5],
        radius=34,
        outline=(52, 211, 153, 190),
        width=8,
    )
    glow = glow.filter(ImageFilter.GaussianBlur(14))
    img = Image.alpha_composite(img, glow)

    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle(
        [x0, y0, x1, y1],
        radius=32,
        fill=(5, 16, 32, 236),
        outline=(52, 211, 153, 245),
        width=3,
    )

    txt = "И ВОТ КАК ИМЕННО..."
    f_main = _fit_font(draw, txt, FONT_BOLD_PATH, 58, 36, (x1 - x0) - 120)
    bb = draw.textbbox((0, 0), txt, font=f_main)
    tw, th = bb[2] - bb[0], bb[3] - bb[1]
    tx = (OUT_W - tw) // 2
    ty = y0 + ((y1 - y0) - th) // 2 - bb[1]

    _draw_diamond(draw, tx - 32, y0 + (y1 - y0) // 2, 12, (34, 211, 238, 255))
    _draw_diamond(draw, tx + tw + 32, y0 + (y1 - y0) // 2, 12, (52, 211, 153, 255))
    draw.text((tx + 2, ty + 3), txt, font=f_main, fill=(0, 0, 0, 195))
    draw.text((tx, ty), txt, font=f_main, fill=(110, 231, 183, 255))

    img.save(out_path)


def render_feature_pill(
    out_path: Path,
    text: str,
    accent_rgb: tuple[int, int, int] = (34, 211, 238),
    y_top: int = 1010,
) -> None:
    """Render sleek single-line cosmic glass pill in safe screen zone."""
    img = Image.new("RGBA", (OUT_W, OUT_H), (0, 0, 0, 0))
    tmp_d = ImageDraw.Draw(img)
    f_txt = _fit_font(tmp_d, text, FONT_BOLD_PATH, 31, 22, OUT_W - 180)
    bbox = tmp_d.textbbox((0, 0), text, font=f_txt)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]

    pad_left = 64
    pad_right = 36
    pill_w = min(OUT_W - 56, tw + pad_left + pad_right)
    pill_h = 84
    x0 = (OUT_W - pill_w) // 2
    x1 = x0 + pill_w
    y0 = y_top
    y1 = y0 + pill_h

    glow = Image.new("RGBA", (OUT_W, OUT_H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.rounded_rectangle(
        [x0 - 2, y0 - 2, x1 + 2, y1 + 2],
        radius=42,
        outline=(*accent_rgb, 155),
        width=5,
    )
    glow = glow.filter(ImageFilter.GaussianBlur(8))
    img = Image.alpha_composite(img, glow)

    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle(
        [x0, y0, x1, y1],
        radius=42,
        fill=(6, 15, 34, 222),
        outline=(*accent_rgb, 240),
        width=3,
    )

    _draw_diamond(draw, x0 + 34, y0 + pill_h // 2, 10, (*accent_rgb, 255))
    tx = x0 + pad_left
    ty = y0 + (pill_h - th) // 2 - bbox[1]
    draw.text((tx + 2, ty + 2), text, font=f_txt, fill=(0, 0, 0, 175))
    draw.text((tx, ty), text, font=f_txt, fill=(248, 250, 252, 255))

    img.save(out_path)


def render_cta_card(
    out_path: Path,
    brand_line: str,
    cta_line: str,
    y_top: int = 960,
) -> None:
    """Render lower-center cosmic CTA card above keyboard."""
    img = Image.new("RGBA", (OUT_W, OUT_H), (0, 0, 0, 0))
    glow = Image.new("RGBA", (OUT_W, OUT_H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)

    x0, x1 = 56, OUT_W - 56
    y0, y1 = y_top, y_top + 178
    gd.rounded_rectangle(
        [x0 - 4, y0 - 4, x1 + 4, y1 + 4],
        radius=32,
        outline=(52, 211, 153, 185),
        width=6,
    )
    glow = glow.filter(ImageFilter.GaussianBlur(12))
    img = Image.alpha_composite(img, glow)

    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle(
        [x0, y0, x1, y1],
        radius=30,
        fill=(5, 14, 30, 236),
        outline=(52, 211, 153, 245),
        width=3,
    )

    f_brand = ImageFont.truetype(FONT_BOLD_PATH, 54)
    f_cta = _fit_font(draw, cta_line, FONT_REG_PATH, 30, 21, (x1 - x0) - 56)

    b_box = draw.textbbox((0, 0), brand_line, font=f_brand)
    bw = b_box[2] - b_box[0]
    bx = (OUT_W - bw) // 2
    by = y0 + 24

    _draw_diamond(draw, bx - 30, by + 32, 11, (34, 211, 238, 255))
    _draw_diamond(draw, bx + bw + 30, by + 32, 11, (52, 211, 153, 255))
    draw.text((bx + 2, by + 3), brand_line, font=f_brand, fill=(0, 0, 0, 180))
    draw.text((bx, by), brand_line, font=f_brand, fill=(110, 231, 183, 255))

    c_box = draw.textbbox((0, 0), cta_line, font=f_cta)
    cw = c_box[2] - c_box[0]
    cx = (OUT_W - cw) // 2
    cy = y0 + 104
    draw.text((cx + 2, cy + 2), cta_line, font=f_cta, fill=(0, 0, 0, 175))
    draw.text((cx, cy), cta_line, font=f_cta, fill=(241, 245, 249, 255))

    img.save(out_path)


def schedule_clips(clips: list[dict], total_dur: float) -> list[dict]:
    """Schedule narration clips without overlaps, applying gentle atempo if tight."""
    def run_schedule(items: list[dict]) -> list[dict]:
        out = []
        prev_end = 0.0
        for item in items:
            start = max(item["planned_start"], prev_end + 0.16) if prev_end > 0 else item["planned_start"]
            end = start + item["dur"]
            out.append({**item, "start": round(start, 3), "end": round(end, 3)})
            prev_end = end
        return out

    scheduled = run_schedule(clips)
    limit_end = total_dur - 0.15
    if scheduled[-1]["end"] <= limit_end:
        return scheduled

    # Gently speed up non-hook gameplay clips up to 1.12x if last line overflows
    for factor in (1.05, 1.09, 1.12):
        adjusted = []
        for idx, item in enumerate(clips):
            if item.get("is_hook"):
                adjusted.append(item)
            else:
                fast_wav = item["wav"].with_name(item["wav"].stem + "_fast.wav")
                new_dur = speedup_wav(item["wav"], fast_wav, factor)
                adjusted.append({**item, "wav": fast_wav, "dur": new_dur})
        scheduled = run_schedule(adjusted)
        if scheduled[-1]["end"] <= limit_end:
            print(f"  [Scheduler] Fitted narration cleanly using gentle atempo={factor}x")
            return scheduled

    raise RuntimeError(
        f"Narration overflow: ends at {scheduled[-1]['end']:.2f}s > limit {limit_end:.2f}s"
    )


def detect_audio_levels(mp4_path: Path) -> dict:
    """Measure output loudness and peak using FFmpeg volumedetect."""
    stderr = run_ffmpeg(
        ["-loglevel", "info", "-i", str(mp4_path), "-af", "volumedetect", "-f", "null", "NUL"],
        f"volumedetect {mp4_path.name}",
        capture_stderr=True,
    )
    mean_m = re.search(r"mean_volume:\s*([-\d.]+)\s*dB", stderr)
    max_m = re.search(r"max_volume:\s*([-\d.]+)\s*dB", stderr)
    dur = probe_video_duration(mp4_path)
    return {
        "file": mp4_path.name,
        "size_mb": round(mp4_path.stat().st_size / (1024 * 1024), 2),
        "duration_s": round(dur, 3),
        "mean_volume_db": float(mean_m.group(1)) if mean_m else None,
        "max_volume_db": float(max_m.group(1)) if max_m else None,
    }


def extract_voiced_previews(
    mp4_path: Path,
    prefix: str,
    cold_open_dur: float,
    total_dur: float,
) -> list[Path]:
    """Extract 4 representative keyframes: Cold-Open 1, Cold-Open 2, Battle, CTA."""
    PREVIEWS_DIR.mkdir(parents=True, exist_ok=True)
    timestamps = [
        min(1.0, max(0.3, cold_open_dur * 0.25)),
        max(0.5, cold_open_dur - 0.65),
        min(total_dur - 4.0, cold_open_dur + (total_dur - cold_open_dur) * 0.45),
        max(1.0, total_dur - 1.1),
    ]
    paths = []
    for idx, t_pos in enumerate(timestamps, start=1):
        out_png = PREVIEWS_DIR / f"{prefix}_f{idx}.png"
        run_ffmpeg(
            ["-loglevel", "warning", "-ss", f"{t_pos:.3f}", "-i", str(mp4_path), "-frames:v", "1", str(out_png)],
            f"preview {out_png.name}",
        )
        paths.append(out_png)
    return paths


async def build_voiced_short(
    clean_mp4: Path,
    out_mp4: Path,
    preview_prefix: str,
    voice: str,
    gameplay_lines: list[dict],
    overlay_specs: list[dict],
    tmp_dir: Path,
    with_overlays: bool = True,
) -> dict:
    """Synthesize Russian narration, prepend dramatic Cold-Open, duck audio, and render MP4."""
    if not clean_mp4.is_file():
        raise FileNotFoundError(f"Master clean video not found: {clean_mp4}")

    master_dur = probe_video_duration(clean_mp4)
    tts_dir = tmp_dir / "tts"
    tts_dir.mkdir(parents=True, exist_ok=True)

    # 1. Synthesize dramatic Cold-Open beats dynamically
    cold_specs = [
        {"id": "co_1a", "text": "Я учу немецкий...", "rate": "-22%", "pitch": "-4Hz"},
        {"id": "co_1b", "text": "играя.", "rate": "-24%", "pitch": "-2Hz"},
        {"id": "co_2", "text": "И вот — как именно!", "rate": "-6%", "pitch": "+4Hz"},
    ]
    cold_durs = {}
    cold_wavs = {}
    for spec in cold_specs:
        mp3_p = tts_dir / f"{spec['id']}.mp3"
        wav_p = tts_dir / f"{spec['id']}.wav"
        dur = await synth_phrase_to_wav(
            spec["text"], voice, spec["rate"], spec["pitch"], mp3_p, wav_p
        )
        cold_durs[spec["id"]] = dur
        cold_wavs[spec["id"]] = wav_p
        await asyncio.sleep(0.25)

    t_1a = 0.12
    t_1b = t_1a + cold_durs["co_1a"] + 0.22
    t_2 = t_1b + cold_durs["co_1b"] + 0.30
    cold_open_dur = round(t_2 + cold_durs["co_2"] + 0.20, 3)
    total_dur = round(cold_open_dur + master_dur, 3)

    all_clips = [
        {
            "id": "co_1a",
            "text": "Я учу немецкий...",
            "wav": cold_wavs["co_1a"],
            "dur": cold_durs["co_1a"],
            "planned_start": t_1a,
            "is_hook": True,
        },
        {
            "id": "co_1b",
            "text": "играя.",
            "wav": cold_wavs["co_1b"],
            "dur": cold_durs["co_1b"],
            "planned_start": t_1b,
            "is_hook": True,
        },
        {
            "id": "co_2",
            "text": "И вот — как именно!",
            "wav": cold_wavs["co_2"],
            "dur": cold_durs["co_2"],
            "planned_start": t_2,
            "is_hook": True,
        },
    ]

    # 2. Synthesize gameplay narration lines
    for idx, line in enumerate(gameplay_lines, start=1):
        cid = f"line_{idx:02d}"
        mp3_p = tts_dir / f"{cid}.mp3"
        wav_p = tts_dir / f"{cid}.wav"
        dur = await synth_phrase_to_wav(
            line["text"], voice, line["rate"], line["pitch"], mp3_p, wav_p
        )
        all_clips.append(
            {
                "id": cid,
                "text": line["text"],
                "wav": wav_p,
                "dur": dur,
                "planned_start": cold_open_dur + line["offset"],
                "is_hook": False,
            }
        )
        await asyncio.sleep(0.25)

    scheduled = schedule_clips(all_clips, total_dur)
    print(f"  [Timeline] cold_open={cold_open_dur:.3f}s, master={master_dur:.3f}s, total={total_dur:.3f}s")
    for s in scheduled:
        print(f"    {s['start']:6.2f}s -> {s['end']:6.2f}s ({s['dur']:.2f}s) | {s['text']}")

    # 3. Render overlay PNGs
    ov_dir = tmp_dir / "overlays"
    ov_dir.mkdir(parents=True, exist_ok=True)
    overlays: list[tuple[Path, float, float]] = []

    if with_overlays:
        co1_png = ov_dir / "co_card1.png"
        co2_png = ov_dir / "co_card2.png"
        render_cold_open_card1(co1_png)
        render_cold_open_card2(co2_png)
        co1_end = max(1.8, t_2 - 0.06)
        overlays.append((co1_png, 0.0, co1_end))
        overlays.append((co2_png, max(co1_end - 0.02, t_2 - 0.06), cold_open_dur))

        cta_start = max(cold_open_dur + 4.0, total_dur - 2.65)
        for idx, ov in enumerate(overlay_specs, start=1):
            ov_path = ov_dir / f"pill_{idx:02d}.png"
            if ov["kind"] == "cta":
                render_cta_card(ov_path, ov["brand"], ov["text"], y_top=ov.get("y_top", 960))
                s_t = cta_start
                e_t = total_dur
            else:
                render_feature_pill(
                    ov_path,
                    ov["text"],
                    accent_rgb=ov.get("accent", (34, 211, 238)),
                    y_top=ov.get("y_top", 1010),
                )
                s_t = cold_open_dur + ov["start_offset"]
                e_t = min(cta_start - 0.15, cold_open_dur + ov["end_offset"])
            if e_t - s_t >= 0.7:
                overlays.append((ov_path, round(s_t, 3), round(e_t, 3)))

    # 4. Build unified FFmpeg filtergraph (Cold-Open + Sidechain Ducking + Overlays + Progress Bar)
    inputs = ["-i", str(clean_mp4)]
    for clip in scheduled:
        inputs.extend(["-i", str(clip["wav"])])
    ov_input_start = 1 + len(scheduled)
    for ov_path, _, _ in overlays:
        inputs.extend(["-loop", "1", "-t", f"{total_dur:.3f}", "-i", str(ov_path)])

    co_ambience_tempo = atempo_chain(1.8 / cold_open_dur)
    f_parts = [
        (
            f"[0:v]trim=start=0:end=1.8,setpts=({cold_open_dur:.5f}/1.8)*(PTS-STARTPTS),"
            f"fps={TARGET_FPS},trim=duration={cold_open_dur:.5f},setpts=PTS-STARTPTS,"
            f"gblur=sigma=3.5,eq=brightness=-0.12:contrast=1.08,format=yuv420p,setsar=1[co_v]"
        ),
        f"[0:v]fps={TARGET_FPS},format=yuv420p,setsar=1[main_v]",
        (
            f"[0:a]atrim=start=0:end=1.8,asetpts=PTS-STARTPTS,{co_ambience_tempo},"
            f"apad=whole_dur={cold_open_dur:.5f},atrim=0:{cold_open_dur:.5f},"
            f"aresample={SAMPLE_RATE},aformat=channel_layouts=stereo,"
            f"volume=0.22,afade=t=in:st=0:d=1.0[co_a]"
        ),
        f"[0:a]aresample={SAMPLE_RATE},aformat=channel_layouts=stereo[main_a]",
        "[co_v][co_a][main_v][main_a]concat=n=2:v=1:a=1[base_v][game_a]",
    ]

    # Voice narration bus
    vo_labels = []
    for idx, clip in enumerate(scheduled, start=1):
        delay_ms = int(round(clip["start"] * 1000))
        lbl = f"vo{idx}"
        f_parts.append(
            f"[{idx}:a]aresample={SAMPLE_RATE},aformat=channel_layouts=stereo,"
            f"adelay={delay_ms}:all=1[{lbl}]"
        )
        vo_labels.append(f"[{lbl}]")

    f_parts.append(
        "".join(vo_labels)
        + f"amix=inputs={len(scheduled)}:duration=longest:normalize=0,"
        + f"apad=whole_dur={total_dur:.5f},atrim=0:{total_dur:.5f},"
        + "highpass=f=85,acompressor=threshold=-18dB:ratio=3:attack=10:release=120,"
        + "volume=1.35,alimiter=limit=0.95[vo_raw]"
    )
    f_parts.append("[vo_raw]asplit=2[vo_sc][vo_mix]")
    f_parts.append(
        "[game_a][vo_sc]sidechaincompress=threshold=0.018:ratio=6:attack=25:release=320:makeup=1[game_ducked]"
    )
    f_parts.append(
        "[game_ducked][vo_mix]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.96[aout]"
    )

    # Visual overlays + bottom progress bar
    last_v = "base_v"
    for idx, (_, s_t, e_t) in enumerate(overlays):
        in_idx = ov_input_start + idx
        ov_l = f"ovf{idx}"
        out_l = f"vx{idx}"
        fade_out_st = max(s_t, e_t - 0.20)
        f_parts.append(
            f"[{in_idx}:v]format=rgba,"
            f"fade=t=in:st={s_t:.3f}:d=0.20:alpha=1,"
            f"fade=t=out:st={fade_out_st:.3f}:d=0.20:alpha=1[{ov_l}];"
            f"[{last_v}][{ov_l}]overlay=0:0:eof_action=pass:enable='between(t,{s_t:.3f},{e_t:.3f})'[{out_l}]"
        )
        last_v = out_l

    if with_overlays:
        f_parts.append(
            f"color=c=0x22d3ee:s={OUT_W}x8:r={TARGET_FPS}:d={total_dur:.3f}[bar];"
            f"[{last_v}][bar]overlay=x='-W+(W*t/{total_dur:.3f})':y=H-8:shortest=1,format=yuv420p[vout]"
        )
    else:
        f_parts.append(f"[{last_v}]format=yuv420p[vout]")

    run_ffmpeg(
        [
            "-loglevel", "warning",
            *inputs,
            "-filter_complex", ";".join(f_parts),
            "-map", "[vout]",
            "-map", "[aout]",
            "-c:v", "libx264",
            "-crf", "17",
            "-preset", "medium",
            "-pix_fmt", "yuv420p",
            "-c:a", "aac",
            "-b:a", "192k",
            "-ar", str(SAMPLE_RATE),
            "-ac", "2",
            "-t", f"{total_dur:.3f}",
            "-movflags", "+faststart",
            str(out_mp4),
        ],
        f"render {out_mp4.name}",
    )

    audio_info = detect_audio_levels(out_mp4)
    previews = extract_voiced_previews(out_mp4, preview_prefix, cold_open_dur, total_dur)
    return {
        "output": str(out_mp4),
        "cold_open_dur": cold_open_dur,
        "total_dur": total_dur,
        "audio": audio_info,
        "previews": [str(p) for p in previews],
    }


async def main_async(voice: str, only: str, with_overlays: bool):
    tmp_root = VIDEOS_DIR / "_tmp_vo"
    if tmp_root.exists():
        shutil.rmtree(tmp_root)
    tmp_root.mkdir(parents=True, exist_ok=True)

    results = []
    try:
        if only in ("all", "short1"):
            print("\n=== VOICING SHORT 1: Fast Hook (DE -> RU) ===")
            s1_lines = [
                {
                    "offset": 0.15,
                    "rate": "+12%",
                    "pitch": "+3Hz",
                    "text": "Вау, смотри: печатаешь слово — и сбиваешь лазером!",
                },
                {
                    "offset": 3.45,
                    "rate": "+14%",
                    "pitch": "+4Hz",
                    "text": "Ого, тут ещё и оружие менять можно! Рельсотрон — мощь!",
                },
                {
                    "offset": 7.30,
                    "rate": "+14%",
                    "pitch": "+4Hz",
                    "text": "Ракеты, а теперь молнии теслы — вообще огонь!",
                },
                {
                    "offset": 11.30,
                    "rate": "+12%",
                    "pitch": "+2Hz",
                    "text": "Сразу перевод и озвучка! А неон-синт ещё и музыкой бьёт!",
                },
                {
                    "offset": 17.00,
                    "rate": "+14%",
                    "pitch": "+5Hz",
                    "text": "И на финал — супер-импульс! Бабах — вот это кайф!",
                },
            ]
            s1_overlays = [
                {
                    "kind": "pill",
                    "text": "Печатаешь слово -> сбиваешь лазером!",
                    "start_offset": 0.15,
                    "end_offset": 3.55,
                    "accent": (34, 211, 238),
                    "y_top": 1010,
                },
                {
                    "kind": "pill",
                    "text": "Выбор оружия: Рельсотрон · Ракеты · Тесла",
                    "start_offset": 3.70,
                    "end_offset": 10.60,
                    "accent": (251, 146, 60),
                    "y_top": 1010,
                },
                {
                    "kind": "pill",
                    "text": "Мгновенный перевод + озвучка Gemini AI",
                    "start_offset": 10.80,
                    "end_offset": 17.90,
                    "accent": (232, 121, 249),
                    "y_top": 1010,
                },
                {
                    "kind": "cta",
                    "brand": "VOCANOVA",
                    "text": "Учи языки, играя в космосе · Бесплатно в браузере",
                    "y_top": 960,
                },
            ]
            results.append(
                await build_voiced_short(
                    VIDEOS_DIR / "short1_hook_de_ru_clean.mp4",
                    VIDEOS_DIR / "short1_hook_de_ru_voiced.mp4",
                    "voiced1",
                    voice,
                    s1_lines,
                    s1_overlays,
                    tmp_root / "s1",
                    with_overlays=with_overlays,
                )
            )

        if only in ("all", "short2"):
            print("\n=== VOICING SHORT 2: Full Overview (DE -> RU) ===")
            s2_lines = [
                {
                    "offset": 0.20,
                    "rate": "+10%",
                    "pitch": "+2Hz",
                    "text": "Вместо скучных карточек — космический шутер прямо в браузере.",
                },
                {
                    "offset": 4.10,
                    "rate": "+12%",
                    "pitch": "+3Hz",
                    "text": "Восемь языков в обе стороны, скорость и шесть пушек!",
                },
                {
                    "offset": 9.20,
                    "rate": "+10%",
                    "pitch": "+3Hz",
                    "text": "Готовые курсы B1, а ещё можно загрузить свою колоду из Анки!",
                },
                {
                    "offset": 15.60,
                    "rate": "+14%",
                    "pitch": "+4Hz",
                    "text": "Погнали в бой! Смотри, грави-волна откидывает все слова назад!",
                },
                {
                    "offset": 20.00,
                    "rate": "+14%",
                    "pitch": "+3Hz",
                    "text": "Беру рельсотрон — бах! — и сразу перевод с озвучкой носителя.",
                },
                {
                    "offset": 24.60,
                    "rate": "+14%",
                    "pitch": "+4Hz",
                    "text": "Ракеты, потом молнии теслы — реально затягивает, никакой зубрёжки!",
                },
                {
                    "offset": 29.60,
                    "rate": "+12%",
                    "pitch": "+3Hz",
                    "text": "А неон-синт играет нотами на каждую букву!",
                },
                {
                    "offset": 33.10,
                    "rate": "+12%",
                    "pitch": "+4Hz",
                    "text": "И финальный супер-залп! Это Воканова — попробуй сам!",
                },
            ]
            s2_overlays = [
                {
                    "kind": "pill",
                    "text": "Космический тренажёр вместо скучных карточек",
                    "start_offset": 0.10,
                    "end_offset": 3.85,
                    "accent": (34, 211, 238),
                    "y_top": 1520,
                },
                {
                    "kind": "pill",
                    "text": "8 языков в обе стороны · Профиль и арсенал",
                    "start_offset": 4.10,
                    "end_offset": 8.20,
                    "accent": (56, 189, 248),
                    "y_top": 140,
                },
                {
                    "kind": "pill",
                    "text": "Готовые курсы B1 + импорт колод Anki (.apkg)",
                    "start_offset": 8.60,
                    "end_offset": 15.00,
                    "accent": (251, 191, 36),
                    "y_top": 160,
                },
                {
                    "kind": "pill",
                    "text": "6 видов оружия · Грави-волна и Рельсотрон",
                    "start_offset": 15.40,
                    "end_offset": 24.20,
                    "accent": (251, 146, 60),
                    "y_top": 1010,
                },
                {
                    "kind": "pill",
                    "text": "Ракеты, Тесла и музыкальный Неон-Синт",
                    "start_offset": 24.50,
                    "end_offset": 34.50,
                    "accent": (232, 121, 249),
                    "y_top": 1010,
                },
                {
                    "kind": "cta",
                    "brand": "VOCANOVA",
                    "text": "DE · EN · ES · 8 языков · Играй в браузере",
                    "y_top": 960,
                },
            ]
            results.append(
                await build_voiced_short(
                    VIDEOS_DIR / "short2_overview_de_ru_clean.mp4",
                    VIDEOS_DIR / "short2_overview_de_ru_voiced.mp4",
                    "voiced2",
                    voice,
                    s2_lines,
                    s2_overlays,
                    tmp_root / "s2",
                    with_overlays=with_overlays,
                )
            )
    finally:
        if tmp_root.exists():
            shutil.rmtree(tmp_root, ignore_errors=True)

    print("\n=== VOICED SHORTS SUMMARY ===")
    print(json.dumps(results, ensure_ascii=False, indent=2))
    return results


def main():
    parser = argparse.ArgumentParser(description="Add Russian gamer narration + Cold-Open to VOCANOVA Shorts")
    parser.add_argument("--voice", default=DEFAULT_VOICE, help="edge-tts neural voice name")
    parser.add_argument("--only", choices=("all", "short1", "short2"), default="all")
    parser.add_argument("--no-overlays", action="store_true", help="Skip graphic overlays and progress bar")
    args = parser.parse_args()
    asyncio.run(main_async(args.voice, args.only, not args.no_overlays))


if __name__ == "__main__":
    main()
