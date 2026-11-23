#!/usr/bin/env python3
"""
Automated Z-LINGO / VOCANOVA Vertical Shorts Recorder (1080x1920 @ 60fps CFR).

Records real browser gameplay against the deployed app with live Web Audio
capture (SoundEngine SFX + Gemini 3.8 TTS pronunciation) and produces both
clean (Reddit-ready) and edited (Shorts/Reels overlays + progress bar + CTA)
H.264/AAC MP4 files in videos/.
"""

import argparse
import asyncio
import base64
import datetime
import json
import math
import os
import random
import shutil
import struct
import subprocess
import sys
import time
import wave
from pathlib import Path

import imageio_ffmpeg
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from playwright.async_api import async_playwright

ROOT_DIR = Path(__file__).resolve().parent.parent
VIDEOS_DIR = ROOT_DIR / "videos"
PREVIEWS_DIR = VIDEOS_DIR / "previews"

DEFAULT_URL = "https://z-deutsch-auto.vercel.app"
VIEWPORT_W = 540
VIEWPORT_H = 960
DPR = 2
OUT_W = VIEWPORT_W * DPR  # 1080
OUT_H = VIEWPORT_H * DPR  # 1920
TARGET_FPS = 60

FONT_BOLD_PATH = r"C:\Windows\Fonts\segoeuib.ttf"
FONT_REG_PATH = r"C:\Windows\Fonts\segoeui.ttf"

BRIDGE_SEPARATORS = set("- '/.,،!?؟…;:()״׳")


def build_init_script() -> str:
    """Return JS injected before page scripts: seed state + WebAudio tap."""
    today = datetime.date.today().isoformat()
    learned = [f"de:seed_{i}" for i in range(75)]
    save_v2 = {
        "nativeLang": "ru",
        "targetLang": "de",
        "ttsEnabled": True,
        "ttsModel": "gemini-3.8-flash-lite-tts",
        "ttsVoice": "Kore",
        "weaponId": "plasma",
        "speedPresetIndex": 2,
        "speedMult": 0.75,
        "activeCourseId": "de-b1-reisen-verkehr",
        "activeModuleIndex": 0,
        "activeLessonIndex": 0,
        "highScore": 14850,
        "typeWithArticle": False,
    }
    daily_progress = {
        "lastActiveDate": today,
        "streakDays": 7,
        "bestStreakDays": 7,
        "todayDate": today,
        "todayWords": ["de:w1", "de:w2", "de:w3", "de:w4", "de:w5", "de:w6"],
    }

    return f"""
(() => {{
  try {{
    localStorage.clear();
    localStorage.setItem('zdeutsch_save_v2', {json.dumps(json.dumps(save_v2))});
    localStorage.setItem('zlingo_learned_words_v1', {json.dumps(json.dumps(learned))});
    localStorage.setItem('zlingo_daily_progress_v1', {json.dumps(json.dumps(daily_progress))});
  }} catch (_) {{}}

  const OrigAudioContext = window.AudioContext || window.webkitAudioContext;
  if (!OrigAudioContext) return;
  const origConnect = AudioNode.prototype.connect;

  window.__recActive = false;
  window.__recChunks = [];
  window.__recSampleRate = 48000;
  window.__recSharedCtx = null;
  window.__recTap = null;
  window.__recProc = null;
  window.__recSilentSink = null;

  function ensureRecorderAudio() {{
    if (window.__recSharedCtx) return window.__recSharedCtx;
    let ctx;
    try {{
      ctx = new OrigAudioContext({{ sampleRate: 48000 }});
    }} catch (_) {{
      ctx = new OrigAudioContext();
    }}
    window.__recSharedCtx = ctx;
    window.__recSampleRate = ctx.sampleRate || 48000;

    const tap = ctx.createGain();
    tap.gain.value = 1.0;

    const proc = ctx.createScriptProcessor(2048, 2, 2);
    const silentSink = ctx.createGain();
    silentSink.gain.value = 0.0;

    window.__recTap = tap;
    window.__recProc = proc;
    window.__recSilentSink = silentSink;

    proc.onaudioprocess = (ev) => {{
      if (!window.__recActive) return;
      const inBuf = ev.inputBuffer;
      const ch0 = inBuf.getChannelData(0);
      const ch1 = inBuf.numberOfChannels > 1 ? inBuf.getChannelData(1) : ch0;
      const len = ch0.length;
      const pcm = new Int16Array(len * 2);
      for (let i = 0; i < len; i++) {{
        let l = ch0[i];
        let r = ch1[i];
        if (l > 1) l = 1; else if (l < -1) l = -1;
        if (r > 1) r = 1; else if (r < -1) r = -1;
        pcm[i * 2] = l < 0 ? (l * 32768) | 0 : (l * 32767) | 0;
        pcm[i * 2 + 1] = r < 0 ? (r * 32768) | 0 : (r * 32767) | 0;
      }}
      window.__recChunks.push(pcm);
    }};

    origConnect.call(tap, proc);
    origConnect.call(proc, silentSink);
    origConnect.call(silentSink, ctx.destination);
    return ctx;
  }}

  AudioNode.prototype.connect = function(dest) {{
    const res = origConnect.apply(this, arguments);
    try {{
      const ctx = window.__recSharedCtx;
      if (
        ctx &&
        dest === ctx.destination &&
        this !== window.__recSilentSink &&
        this !== window.__recProc &&
        this !== window.__recTap
      ) {{
        origConnect.call(this, window.__recTap);
      }}
    }} catch (_) {{}}
    return res;
  }};

  function PatchedAudioContext() {{
    return ensureRecorderAudio();
  }}
  PatchedAudioContext.prototype = OrigAudioContext.prototype;
  window.AudioContext = PatchedAudioContext;
  if (window.webkitAudioContext) {{
    window.webkitAudioContext = PatchedAudioContext;
  }}

  window.__ensureRecAudio = ensureRecorderAudio;

  window.__recStart = async () => {{
    const ctx = ensureRecorderAudio();
    if (ctx.state === 'suspended') {{
      await ctx.resume();
    }}
    window.__recChunks = [];
    window.__recActive = true;
    return Date.now() / 1000.0;
  }};

  window.__recStop = () => {{
    window.__recActive = false;
    const endEpoch = Date.now() / 1000.0;
    const chunks = window.__recChunks || [];
    let totalShorts = 0;
    for (const c of chunks) totalShorts += c.length;
    const merged = new Int16Array(totalShorts);
    let offset = 0;
    for (const c of chunks) {{
      merged.set(c, offset);
      offset += c.length;
    }}
    window.__recMergedBytes = new Uint8Array(merged.buffer);
    window.__recChunks = [];
    return {{
      sampleRate: window.__recSampleRate || 48000,
      byteLength: window.__recMergedBytes.byteLength,
      endEpoch,
    }};
  }};

  window.__recReadSlice = (start, length) => {{
    const buf = window.__recMergedBytes;
    if (!buf) return '';
    const slice = buf.subarray(start, Math.min(buf.byteLength, start + length));
    let bin = '';
    const step = 0x8000;
    for (let i = 0; i < slice.length; i += step) {{
      bin += String.fromCharCode.apply(null, slice.subarray(i, i + step));
    }}
    return btoa(bin);
  }};
}})();
"""


async def prewarm_tts(page) -> dict:
    """Wait for app initialization and pre-fetch Gemini 3.8 TTS audio for Lesson 1."""
    await page.evaluate("() => document.fonts ? document.fonts.ready : Promise.resolve()")
    await page.wait_for_function(
        """async () => {
            const { state } = await import('/src/state/store.js');
            return Boolean(state && state.activeCourseId);
        }""",
        timeout=20000,
    )

    stats = await page.evaluate(
        """async () => {
            window.__ensureRecAudio();
            const storeMod = await import('/src/state/store.js');
            const catMod = await import('/src/domain/catalog-service.js');
            const ttsMod = await import('/src/services/tts-service.js');
            const physMod = await import('/src/engine/arena-physics.js');
            window.__recStore = storeMod;
            window.__recPhysics = physMod;

            const sel = catMod.getActiveSelection();
            const pool = sel.course && sel.mod && sel.lesson
              ? catMod.resolveLessonBaseWords(sel.course, sel.mod, sel.lesson, storeMod.state.activeLessonIndex)
              : [];

            let cached = 0;
            const missing = [];
            const sleep = (ms) => new Promise(r => setTimeout(r, ms));
            const texts = pool.map(e => (e.withArticle || e.word || '').trim()).filter(Boolean);
            for (let i = 0; i < texts.length; i += 2) {
                const batch = texts.slice(i, i + 2);
                const results = await Promise.all(
                    batch.map(txt => ttsMod.ttsManager.getOrFetchAudioBuffer(txt, 'de'))
                );
                results.forEach((buf, idx) => {
                    if (buf) cached++;
                    else missing.push(batch[idx]);
                });
                if (i + 2 < texts.length) await sleep(350);
            }
            if (missing.length > 0) {
                await sleep(1500);
                for (const txt of missing) {
                    const buf = await ttsMod.ttsManager.getOrFetchAudioBuffer(txt, 'de');
                    if (buf) cached++;
                    await sleep(350);
                }
            }
            return {
                courseId: storeMod.state.activeCourseId,
                ttsModel: ttsMod.ttsManager.model,
                totalWords: texts.length,
                cachedCount: cached,
                serverAvailable: ttsMod.ttsManager.serverAvailable,
            };
        }"""
    )
    print(f"[TTS Prewarm] {stats}")
    if stats["cachedCount"] < 12:
        raise RuntimeError(
            f"Gemini TTS prewarm failed: only {stats['cachedCount']}/{stats['totalWords']} decoded"
        )
    return stats


async def pull_wav_audio(page, wav_path: Path) -> tuple[float, float, float, float]:
    """Stop WebAudio capture, stream PCM from browser, write WAV, return stats."""
    meta = await page.evaluate("() => window.__recStop()")
    sample_rate = int(meta["sampleRate"])
    byte_len = int(meta["byteLength"])
    end_epoch = float(meta["endEpoch"])

    raw_pcm = bytearray()
    chunk_size = 512 * 1024
    for offset in range(0, byte_len, chunk_size):
        b64 = await page.evaluate(
            f"() => window.__recReadSlice({offset}, {chunk_size})"
        )
        if b64:
            raw_pcm.extend(base64.b64decode(b64))

    await page.evaluate("() => { window.__recMergedBytes = null; }")

    with wave.open(str(wav_path), "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(bytes(raw_pcm))

    num_samples = len(raw_pcm) // 2
    if num_samples == 0:
        return 0.0, 0.0, 0.0, end_epoch

    samples = struct.unpack(f"<{num_samples}h", raw_pcm)
    sum_sq = 0.0
    peak_i = 0
    for s in samples:
        a = abs(s)
        if a > peak_i:
            peak_i = a
        fn = s / 32768.0
        sum_sq += fn * fn

    rms = math.sqrt(sum_sq / num_samples)
    peak = peak_i / 32768.0
    audio_dur = (num_samples / 2) / sample_rate
    return audio_dur, rms, peak, end_epoch


class ScreencastRecorder:
    """Captures exact-timestamped JPEG frames via CDP Page.startScreencast."""

    def __init__(self, cdp, frames_dir: Path):
        self.cdp = cdp
        self.frames_dir = frames_dir
        self.active = False
        self.start_epoch = 0.0
        self.frames: list[tuple[float, Path]] = []
        self._counter = 0
        self._handler_bound = False

    def bind(self):
        if self._handler_bound:
            return
        self._handler_bound = True

        def on_frame(ev):
            asyncio.create_task(
                self.cdp.send("Page.screencastFrameAck", {"sessionId": ev["sessionId"]})
            )
            if not self.active:
                return
            meta = ev.get("metadata") or {}
            ts = float(meta.get("timestamp") or time.time())
            if ts < self.start_epoch - 0.05:
                return
            self._counter += 1
            fpath = self.frames_dir / f"frame_{self._counter:06d}.jpg"
            fpath.write_bytes(base64.b64decode(ev["data"]))
            self.frames.append((ts, fpath))

        self.cdp.on("Page.screencastFrame", on_frame)

    async def start_cdp_stream(self):
        self.bind()
        await self.cdp.send(
            "Page.startScreencast",
            {
                "format": "jpeg",
                "quality": 94,
                "maxWidth": OUT_W,
                "maxHeight": OUT_H,
                "everyNthFrame": 1,
            },
        )

    def begin_capture(self, start_epoch: float):
        self.frames = []
        self._counter = 0
        self.start_epoch = start_epoch
        self.active = True

    def end_capture(self):
        self.active = False

    async def stop_cdp_stream(self):
        self.active = False
        try:
            await self.cdp.send("Page.stopScreencast")
        except Exception:
            pass


async def get_battle_snapshot(page) -> dict:
    """Inspect live gameplay state inside the browser."""
    return await page.evaluate(
        """() => {
            const st = window.__recStore.state;
            const phys = window.__recPhysics;
            const words = (st.activeWords || []).map(w => ({
                id: w.id,
                text: w.text,
                typedCount: w.typedCount,
                y: w.y,
                baseChars: Array.from(w.text).map(c => phys.mapTargetCharToBaseKey(c)),
            }));
            return {
                screenMode: st.screenMode,
                running: st.running,
                paused: st.paused,
                gameOver: st.gameOver,
                weaponId: st.weaponId,
                wordsDestroyed: st.wordsDestroyedInLevel,
                queueLen: st.wordQueue.length,
                empCharges: st.empCharges,
                lockedWordId: st.lockedWordId,
                activeWords: words,
            };
        }"""
    )


async def play_human_battle(
    page,
    weapon_schedule: list[str],
    target_words_to_type: int,
    max_elapsed_sec: float,
    rec_start_epoch: float,
    trigger_emp: bool = True,
) -> dict:
    """Type falling German words with human cadence, weapon swaps, and EMP finale."""
    words_completed = 0
    emp_fired = False
    rng = random.Random(42)

    snap = await get_battle_snapshot(page)
    prev_destroyed = snap["wordsDestroyed"]
    active_weapon_key = None

    while True:
        elapsed = time.time() - rec_start_epoch
        if elapsed >= max_elapsed_sec:
            break

        snap = await get_battle_snapshot(page)
        if not snap["running"] or snap["gameOver"]:
            break

        if snap["wordsDestroyed"] > prev_destroyed:
            words_completed += snap["wordsDestroyed"] - prev_destroyed
            prev_destroyed = snap["wordsDestroyed"]
            # Hold so full Gemini 3.8 German voice plays cleanly & Russian translation shines
            await asyncio.sleep(rng.uniform(1.16, 1.30))
            continue

        if words_completed >= target_words_to_type:
            if trigger_emp and not emp_fired and snap["empCharges"] > 0:
                wait_deadline = min(rec_start_epoch + max_elapsed_sec, time.time() + 2.6)
                while time.time() < wait_deadline:
                    snap = await get_battle_snapshot(page)
                    if len(snap["activeWords"]) >= 2:
                        break
                    await asyncio.sleep(0.08)
                await page.keyboard.press("Enter")
                emp_fired = True
                await asyncio.sleep(1.85)
            break

        if not snap["activeWords"]:
            await asyncio.sleep(0.05)
            continue

        # Switch weapon right before locking onto a new word
        desired_key = weapon_schedule[min(words_completed, len(weapon_schedule) - 1)]
        if snap["lockedWordId"] is None and desired_key != active_weapon_key:
            await page.keyboard.press(desired_key)
            active_weapon_key = desired_key
            await asyncio.sleep(0.16)
            snap = await get_battle_snapshot(page)
            if not snap["activeWords"]:
                await asyncio.sleep(0.05)
                continue

        # Pick locked word or lowest active word on screen
        target = None
        if snap["lockedWordId"] is not None:
            for w in snap["activeWords"]:
                if w["id"] == snap["lockedWordId"]:
                    target = w
                    break
        if target is None:
            target = max(snap["activeWords"], key=lambda w: w["y"])

        idx = target["typedCount"]
        txt = target["text"]
        while idx < len(txt) and txt[idx] in BRIDGE_SEPARATORS:
            idx += 1

        if idx >= len(txt):
            await asyncio.sleep(0.04)
            continue

        key_char = target["baseChars"][idx]
        if not key_char:
            await asyncio.sleep(0.04)
            continue

        await page.keyboard.press(key_char)
        # Slightly brisker cadence on long compound German words so pacing stays punchy
        delay = rng.uniform(0.072, 0.102) if len(txt) > 13 else rng.uniform(0.088, 0.125)
        await asyncio.sleep(delay)

    final_snap = await get_battle_snapshot(page)
    return {
        "wordsDestroyed": final_snap["wordsDestroyed"],
        "empFired": emp_fired,
        "elapsed": time.time() - rec_start_epoch,
    }


async def smooth_scroll_el(page, selector: str, target_top: int, duration_sec: float):
    """Smoothly interpolate scrollTop of an element over duration_sec."""
    steps = max(8, int(duration_sec / 0.03))
    start_top = await page.evaluate(
        "(sel) => { const el = document.querySelector(sel); return el ? el.scrollTop : 0; }",
        selector,
    )
    for i in range(1, steps + 1):
        t = i / steps
        eased = t * t * (3 - 2 * t)
        val = start_top + (target_top - start_top) * eased
        await page.evaluate(
            "([sel, y]) => { const el = document.querySelector(sel); if (el) el.scrollTop = y; }",
            [selector, val],
        )
        await asyncio.sleep(duration_sec / steps)


def write_concat_file(
    frames: list[tuple[float, Path]],
    start_epoch: float,
    end_epoch: float,
    concat_path: Path,
) -> tuple[float, float]:
    """Generate FFmpeg concat file from exact CDP frame timestamps."""
    if not frames:
        raise RuntimeError("No screencast frames were captured!")

    valid = [(max(0.0, ts - start_epoch), p) for ts, p in frames]
    total_target = max(0.5, end_epoch - start_epoch)

    lines = ["ffconcat version 1.0"]
    video_dur = 0.0
    for i, (t_rel, p) in enumerate(valid):
        if i + 1 < len(valid):
            dt = valid[i + 1][0] - t_rel
        else:
            dt = max(0.033, total_target - t_rel)
        dt = max(0.008, min(10.0, dt))
        video_dur += dt
        posix_p = p.resolve().as_posix().replace("'", "'\\''")
        lines.append(f"file '{posix_p}'")
        lines.append(f"duration {dt:.6f}")

    # FFmpeg concat demuxer requires repeating the final file entry
    last_posix = valid[-1][1].resolve().as_posix().replace("'", "'\\''")
    lines.append(f"file '{last_posix}'")

    concat_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    avg_fps = len(valid) / max(0.1, video_dur)
    return video_dur, avg_fps


def run_ffmpeg(args: list[str], desc: str):
    """Run bundled FFmpeg and fail loudly on non-zero exit."""
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    cmd = [ffmpeg, "-y", "-hide_banner", "-loglevel", "warning", *args]
    res = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")
    if res.returncode != 0:
        raise RuntimeError(f"FFmpeg failed ({desc}):\n{res.stderr}\n{res.stdout}")


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


def _fit_font(draw: ImageDraw.ImageDraw, text: str, font_path: str, max_size: int, min_size: int, max_width: int) -> ImageFont.FreeTypeFont:
    """Choose largest font size <= max_size that fits within max_width."""
    size = max_size
    while size > min_size:
        font = ImageFont.truetype(font_path, size)
        bbox = draw.textbbox((0, 0), text, font=font)
        if (bbox[2] - bbox[0]) <= max_width:
            return font
        size -= 2
    return ImageFont.truetype(font_path, min_size)


def render_hook_card(
    out_path: Path,
    title_line: str,
    sub_line: str,
    y_top: int = 204,
) -> None:
    """Render bold cosmic glass Hook Card (strictly vector accents, zero emoji glyphs)."""
    img = Image.new("RGBA", (OUT_W, OUT_H), (0, 0, 0, 0))
    glow = Image.new("RGBA", (OUT_W, OUT_H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)

    box_x0, box_x1 = 44, OUT_W - 44
    box_y0, box_y1 = y_top, y_top + 164
    gd.rounded_rectangle(
        [box_x0 - 4, box_y0 - 4, box_x1 + 4, box_y1 + 4],
        radius=30,
        outline=(34, 211, 238, 170),
        width=6,
    )
    glow = glow.filter(ImageFilter.GaussianBlur(10))
    img = Image.alpha_composite(img, glow)

    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle(
        [box_x0, box_y0, box_x1, box_y1],
        radius=28,
        fill=(6, 15, 34, 224),
        outline=(56, 189, 248, 235),
        width=3,
    )

    inner_w = (box_x1 - box_x0) - 92
    f_title = _fit_font(draw, title_line, FONT_BOLD_PATH, 46, 30, inner_w)
    f_sub = _fit_font(draw, sub_line, FONT_REG_PATH, 31, 22, (box_x1 - box_x0) - 56)

    t_bbox = draw.textbbox((0, 0), title_line, font=f_title)
    t_w = t_bbox[2] - t_bbox[0]
    tx = (OUT_W - t_w) // 2 + 16
    ty = box_y0 + 26

    _draw_bolt(draw, tx - 30, ty + 28, 1.15, (250, 204, 21, 255))
    draw.text((tx + 2, ty + 3), title_line, font=f_title, fill=(0, 0, 0, 180))
    draw.text((tx, ty), title_line, font=f_title, fill=(254, 240, 138, 255))

    s_bbox = draw.textbbox((0, 0), sub_line, font=f_sub)
    s_w = s_bbox[2] - s_bbox[0]
    sx = (OUT_W - s_w) // 2
    sy = box_y0 + 96
    draw.text((sx + 2, sy + 2), sub_line, font=f_sub, fill=(0, 0, 0, 170))
    draw.text((sx, sy), sub_line, font=f_sub, fill=(224, 242, 254, 255))

    img.save(out_path)


def render_feature_pill(
    out_path: Path,
    text: str,
    accent_rgb: tuple[int, int, int] = (34, 211, 238),
    y_top: int = 212,
) -> None:
    """Render sleek single-line cosmic glass pill in top safe-zone."""
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
        outline=(*accent_rgb, 150),
        width=5,
    )
    glow = glow.filter(ImageFilter.GaussianBlur(8))
    img = Image.alpha_composite(img, glow)

    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle(
        [x0, y0, x1, y1],
        radius=42,
        fill=(6, 15, 34, 216),
        outline=(*accent_rgb, 235),
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
    y_top: int = 1040,
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
        outline=(52, 211, 153, 180),
        width=6,
    )
    glow = glow.filter(ImageFilter.GaussianBlur(12))
    img = Image.alpha_composite(img, glow)

    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle(
        [x0, y0, x1, y1],
        radius=30,
        fill=(5, 14, 30, 232),
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


def encode_clean_video(
    concat_path: Path,
    wav_path: Path,
    out_clean_mp4: Path,
    dur: float,
) -> None:
    """Encode 1080x1920 60fps CFR clean MP4 with normalized stereo audio."""
    run_ffmpeg(
        [
            "-safe", "0",
            "-f", "concat",
            "-i", str(concat_path),
            "-i", str(wav_path),
            "-vf", f"fps={TARGET_FPS},scale={OUT_W}:{OUT_H}:flags=lanczos,format=yuv420p",
            "-af", "dynaudnorm=f=150:g=15:p=0.92,alimiter=limit=0.95",
            "-c:v", "libx264",
            "-crf", "17",
            "-preset", "medium",
            "-pix_fmt", "yuv420p",
            "-c:a", "aac",
            "-b:a", "192k",
            "-ar", "48000",
            "-ac", "2",
            "-t", f"{dur:.3f}",
            "-movflags", "+faststart",
            str(out_clean_mp4),
        ],
        f"encode clean {out_clean_mp4.name}",
    )


def composite_edited_video(
    clean_mp4: Path,
    out_edited_mp4: Path,
    overlays: list[tuple[Path, float, float]],
    dur: float,
) -> None:
    """Composite transparent PNG callouts + animated bottom neon progress bar."""
    inputs = ["-i", str(clean_mp4)]
    for ov_path, _, _ in overlays:
        inputs.extend(["-loop", "1", "-t", f"{dur:.3f}", "-i", str(ov_path)])

    filter_parts = []
    last_label = "0:v"
    for idx, (_, start_t, end_t) in enumerate(overlays, start=1):
        end_clamped = min(dur, end_t)
        fade_out_st = max(start_t, end_clamped - 0.22)
        ov_f = f"ov{idx}"
        out_l = f"v{idx}"
        filter_parts.append(
            f"[{idx}:v]format=rgba,"
            f"fade=t=in:st={start_t:.3f}:d=0.22:alpha=1,"
            f"fade=t=out:st={fade_out_st:.3f}:d=0.22:alpha=1[{ov_f}];"
            f"[{last_label}][{ov_f}]overlay=0:0:eof_action=pass:enable='between(t,{start_t:.3f},{end_clamped:.3f})'[{out_l}]"
        )
        last_label = out_l

    # Add glowing cyan progress bar at bottom edge (8px tall)
    filter_parts.append(
        f"color=c=0x22d3ee:s={OUT_W}x8:r={TARGET_FPS}:d={dur:.3f}[bar];"
        f"[{last_label}][bar]overlay=x='-W+(W*t/{dur:.3f})':y=H-8:shortest=1,format=yuv420p[vout]"
    )

    run_ffmpeg(
        [
            *inputs,
            "-filter_complex", ";".join(filter_parts),
            "-map", "[vout]",
            "-map", "0:a",
            "-c:v", "libx264",
            "-crf", "17",
            "-preset", "medium",
            "-pix_fmt", "yuv420p",
            "-c:a", "copy",
            "-movflags", "+faststart",
            str(out_edited_mp4),
        ],
        f"composite edited {out_edited_mp4.name}",
    )


def extract_preview_frames(mp4_path: Path, prefix: str, dur: float) -> list[Path]:
    """Extract 4 representative keyframes for visual inspection."""
    PREVIEWS_DIR.mkdir(parents=True, exist_ok=True)
    fracs = [0.06, 0.31, 0.62, 0.93]
    out_paths = []
    for idx, fr in enumerate(fracs, start=1):
        t_pos = max(0.2, min(max(0.3, dur - 0.3), dur * fr))
        out_png = PREVIEWS_DIR / f"{prefix}_f{idx}.png"
        run_ffmpeg(
            ["-ss", f"{t_pos:.3f}", "-i", str(mp4_path), "-frames:v", "1", str(out_png)],
            f"preview {out_png.name}",
        )
        out_paths.append(out_png)
    return out_paths


def probe_media_info(mp4_path: Path) -> dict:
    """Inspect encoded MP4 stream summary using FFmpeg stderr output."""
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    res = subprocess.run(
        [ffmpeg, "-hide_banner", "-i", str(mp4_path)],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    return {"file": mp4_path.name, "size_mb": round(mp4_path.stat().st_size / (1024 * 1024), 2), "info": res.stderr}


async def run_scenario_1(page, base_url: str, tmp_dir: Path) -> dict:
    """Scenario 1: Fast Hook (20-23s) - pure combat + 5 weapons + EMP + Gemini TTS."""
    print("\n=== SCENARIO 1: Fast Hook (DE -> RU) ===")
    tts_ok_hits = 0

    def on_resp(resp):
        nonlocal tts_ok_hits
        if "/api/tts" in resp.url and resp.status == 200:
            tts_ok_hits += 1

    page.on("response", on_resp)
    await page.goto(base_url, wait_until="domcontentloaded", timeout=30000)
    await prewarm_tts(page)

    cdp = await page.context.new_cdp_session(page)
    rec = ScreencastRecorder(cdp, tmp_dir)
    await rec.start_cdp_stream()

    # Pre-launch battle BEFORE recording starts so frame 1 is already active space combat!
    await page.click("#btnArcadeLaunch")
    await page.wait_for_function(
        """() => {
            const st = window.__recStore.state;
            return st.screenMode === 'play' && st.running && st.activeWords.length >= 2 &&
                   st.activeWords.some(w => w.y > 140) && st.warpTimer <= 0.08;
        }""",
        timeout=15000,
    )

    start_epoch = await page.evaluate("() => window.__recStart()")
    rec.begin_capture(start_epoch)

    # Cycle 5 distinct weapons across 7 words, then EMP wave finale
    weapon_schedule = ["1", "3", "3", "4", "5", "5", "6"]
    battle_stats = await play_human_battle(
        page,
        weapon_schedule=weapon_schedule,
        target_words_to_type=7,
        max_elapsed_sec=21.5,
        rec_start_epoch=start_epoch,
        trigger_emp=True,
    )

    rec.end_capture()
    await rec.stop_cdp_stream()

    wav_path = tmp_dir / "audio.wav"
    audio_dur, rms, peak, end_epoch = await pull_wav_audio(page, wav_path)

    concat_path = tmp_dir / "frames.txt"
    video_dur, avg_fps = write_concat_file(rec.frames, start_epoch, end_epoch, concat_path)

    dur = min(video_dur, audio_dur)
    clean_mp4 = VIDEOS_DIR / "short1_hook_de_ru_clean.mp4"
    edited_mp4 = VIDEOS_DIR / "short1_hook_de_ru_edited.mp4"

    encode_clean_video(concat_path, wav_path, clean_mp4, dur)

    ov_dir = tmp_dir / "overlays"
    ov_dir.mkdir(parents=True, exist_ok=True)
    render_hook_card(
        ov_dir / "ov1.png",
        "КАК Я ИГРАЯ УЧУ НЕМЕЦКИЙ",
        "Стреляю по словам в космосе · DE -> RU",
        y_top=940,
    )
    render_feature_pill(
        ov_dir / "ov2.png",
        "Взрыв слова = перевод + озвучка Gemini AI",
        accent_rgb=(34, 211, 238),
        y_top=1010,
    )
    render_feature_pill(
        ov_dir / "ov3.png",
        "6 видов оружия: Рельсотрон · Ракеты · Тесла",
        accent_rgb=(251, 146, 60),
        y_top=1010,
    )
    render_feature_pill(
        ov_dir / "ov4.png",
        "Готовые курсы B1 и свои колоды Anki (.apkg)",
        accent_rgb=(167, 139, 250),
        y_top=1010,
    )
    render_cta_card(
        ov_dir / "ov5.png",
        "VOCANOVA",
        "Учи языки, играя в космосе · Бесплатно в браузере",
        y_top=960,
    )

    cta_start = max(14.5, dur - 2.6)
    overlays = [
        (ov_dir / "ov1.png", 0.0, min(4.2, cta_start - 0.5)),
        (ov_dir / "ov2.png", 4.5, min(8.8, cta_start - 0.4)),
        (ov_dir / "ov3.png", 9.1, min(13.5, cta_start - 0.3)),
        (ov_dir / "ov4.png", 13.8, cta_start - 0.15),
        (ov_dir / "ov5.png", cta_start, dur),
    ]
    overlays = [(p, s, e) for p, s, e in overlays if e - s >= 0.8]

    composite_edited_video(clean_mp4, edited_mp4, overlays, dur)
    previews = extract_preview_frames(edited_mp4, "short1", dur)

    diag = {
        "scenario": "short1_hook_de_ru",
        "frames": len(rec.frames),
        "avg_fps": round(avg_fps, 2),
        "video_dur": round(video_dur, 3),
        "audio_dur": round(audio_dur, 3),
        "drift_sec": round(abs(video_dur - audio_dur), 3),
        "audio_rms": round(rms, 4),
        "audio_peak": round(peak, 4),
        "tts_200_responses": tts_ok_hits,
        "battle": battle_stats,
        "previews": [str(p) for p in previews],
    }
    print(f"[Scenario 1 Diagnostics] {json.dumps(diag, ensure_ascii=False)}")
    if rms < 0.004:
        raise RuntimeError(f"Scenario 1 audio RMS too low: {rms:.5f}")
    return diag


async def run_scenario_2(page, base_url: str, tmp_dir: Path) -> dict:
    """Scenario 2: Full Overview (38-42s) - Home, Languages/Arsenal, Decks & Anki, Full Battle."""
    print("\n=== SCENARIO 2: Full Overview (DE -> RU) ===")
    tts_ok_hits = 0

    def on_resp(resp):
        nonlocal tts_ok_hits
        if "/api/tts" in resp.url and resp.status == 200:
            tts_ok_hits += 1

    page.on("response", on_resp)
    await page.goto(base_url, wait_until="domcontentloaded", timeout=30000)
    await prewarm_tts(page)

    cdp = await page.context.new_cdp_session(page)
    rec = ScreencastRecorder(cdp, tmp_dir)
    await rec.start_cdp_stream()

    start_epoch = await page.evaluate("() => window.__recStart()")
    rec.begin_capture(start_epoch)

    # Phase 1 (0.0s - 4.2s): Home Dashboard showcase + smooth scroll to live preview & topics
    await asyncio.sleep(1.5)
    await smooth_scroll_el(page, "#arcadeTitleScreen", 250, 0.9)
    await asyncio.sleep(0.9)
    await smooth_scroll_el(page, "#arcadeTitleScreen", 0, 0.7)

    # Phase 2 (4.2s - 8.8s): Open Profile & Settings (8 languages + 6 weapons + Gemini TTS)
    await page.click("#btnHomeSettings")
    await asyncio.sleep(1.5)
    await smooth_scroll_el(page, "#gameSettingsDialogBody", 340, 1.3)
    await asyncio.sleep(1.1)
    await page.click("#btnCloseGameSettings")
    await asyncio.sleep(0.35)

    # Phase 3 (8.8s - 15.6s): Open My Decks + Anki (.apkg) Import modal
    await page.click("#btnMobNavDecks")
    await asyncio.sleep(2.1)
    await page.click("#btnDecksImportAnki")
    await asyncio.sleep(2.9)
    await page.click("#btnCloseCustom")
    await asyncio.sleep(0.35)

    # Phase 4 (15.6s - ~40s): Launch live battle cycling ALL 6 weapons + EMP finale
    await page.click("#btnMobNavPlay")
    await page.wait_for_function(
        """() => {
            const st = window.__recStore.state;
            return st.screenMode === 'play' && st.running && st.activeWords.length >= 1;
        }""",
        timeout=15000,
    )

    battle_start_elapsed = time.time() - start_epoch
    weapon_schedule = ["1", "2", "3", "4", "5", "5", "6", "6"]
    battle_stats = await play_human_battle(
        page,
        weapon_schedule=weapon_schedule,
        target_words_to_type=8,
        max_elapsed_sec=min(41.5, battle_start_elapsed + 24.0),
        rec_start_epoch=start_epoch,
        trigger_emp=True,
    )

    rec.end_capture()
    await rec.stop_cdp_stream()

    wav_path = tmp_dir / "audio.wav"
    audio_dur, rms, peak, end_epoch = await pull_wav_audio(page, wav_path)

    concat_path = tmp_dir / "frames.txt"
    video_dur, avg_fps = write_concat_file(rec.frames, start_epoch, end_epoch, concat_path)

    dur = min(video_dur, audio_dur)
    clean_mp4 = VIDEOS_DIR / "short2_overview_de_ru_clean.mp4"
    edited_mp4 = VIDEOS_DIR / "short2_overview_de_ru_edited.mp4"

    encode_clean_video(concat_path, wav_path, clean_mp4, dur)

    ov_dir = tmp_dir / "overlays"
    ov_dir.mkdir(parents=True, exist_ok=True)
    render_hook_card(
        ov_dir / "ov1.png",
        "КАК Я ИГРАЯ УЧУ НЕМЕЦКИЙ",
        "Космический тренажёр вместо скучных карточек",
        y_top=1490,
    )
    render_feature_pill(
        ov_dir / "ov2.png",
        "8 языков в обе стороны · Профиль и арсенал",
        accent_rgb=(56, 189, 248),
        y_top=140,
    )
    render_feature_pill(
        ov_dir / "ov3.png",
        "Готовые курсы B1 + импорт колод Anki (.apkg)",
        accent_rgb=(251, 191, 36),
        y_top=160,
    )
    render_feature_pill(
        ov_dir / "ov4.png",
        "Печатай слово — слушай носителя (Gemini 3.8 TTS)",
        accent_rgb=(34, 211, 238),
        y_top=1010,
    )
    render_feature_pill(
        ov_dir / "ov5.png",
        "Прокачивай 6 видов космического оружия",
        accent_rgb=(251, 146, 60),
        y_top=1010,
    )
    render_feature_pill(
        ov_dir / "ov6.png",
        "Неон-Синт + сокрушительная EMP-волна!",
        accent_rgb=(232, 121, 249),
        y_top=1010,
    )
    render_cta_card(
        ov_dir / "ov7.png",
        "VOCANOVA",
        "DE · EN · ES · 8 языков · Играй в браузере",
        y_top=960,
    )

    cta_start = max(30.0, dur - 2.8)
    b_start = round(battle_start_elapsed, 2)
    b_mid1 = min(cta_start - 0.5, b_start + 7.5)
    b_mid2 = min(cta_start - 0.3, b_mid1 + 7.5)

    overlays = [
        (ov_dir / "ov1.png", 0.0, 4.0),
        (ov_dir / "ov2.png", 4.3, 8.6),
        (ov_dir / "ov3.png", 8.9, 15.2),
        (ov_dir / "ov4.png", max(15.6, b_start), b_mid1 - 0.25),
        (ov_dir / "ov5.png", b_mid1, b_mid2 - 0.25),
        (ov_dir / "ov6.png", b_mid2, cta_start - 0.2),
        (ov_dir / "ov7.png", cta_start, dur),
    ]
    overlays = [(p, s, e) for p, s, e in overlays if e - s >= 0.8]

    composite_edited_video(clean_mp4, edited_mp4, overlays, dur)
    previews = extract_preview_frames(edited_mp4, "short2", dur)

    diag = {
        "scenario": "short2_overview_de_ru",
        "frames": len(rec.frames),
        "avg_fps": round(avg_fps, 2),
        "video_dur": round(video_dur, 3),
        "audio_dur": round(audio_dur, 3),
        "drift_sec": round(abs(video_dur - audio_dur), 3),
        "audio_rms": round(rms, 4),
        "audio_peak": round(peak, 4),
        "tts_200_responses": tts_ok_hits,
        "battle": battle_stats,
        "previews": [str(p) for p in previews],
    }
    print(f"[Scenario 2 Diagnostics] {json.dumps(diag, ensure_ascii=False)}")
    if rms < 0.004:
        raise RuntimeError(f"Scenario 2 audio RMS too low: {rms:.5f}")
    return diag


async def main_async(url: str, only: str):
    VIDEOS_DIR.mkdir(parents=True, exist_ok=True)
    tmp_root = VIDEOS_DIR / "_tmp_capture"
    if tmp_root.exists():
        shutil.rmtree(tmp_root)
    tmp_root.mkdir(parents=True, exist_ok=True)

    init_js = build_init_script()
    results = []

    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(
                channel="chrome",
                headless=True,
                args=[
                    "--autoplay-policy=no-user-gesture-required",
                    "--mute-audio",
                    "--disable-renderer-backgrounding",
                    "--disable-background-timer-throttling",
                ],
            )
            try:
                if only in ("all", "short1"):
                    ctx1 = await browser.new_context(
                        viewport={"width": VIEWPORT_W, "height": VIEWPORT_H},
                        device_scale_factor=DPR,
                        locale="ru-RU",
                    )
                    await ctx1.add_init_script(init_js)
                    page1 = await ctx1.new_page()
                    t1 = tmp_root / "s1"
                    t1.mkdir(parents=True, exist_ok=True)
                    results.append(await run_scenario_1(page1, url, t1))
                    await ctx1.close()

                if only in ("all", "short2"):
                    ctx2 = await browser.new_context(
                        viewport={"width": VIEWPORT_W, "height": VIEWPORT_H},
                        device_scale_factor=DPR,
                        locale="ru-RU",
                    )
                    await ctx2.add_init_script(init_js)
                    page2 = await ctx2.new_page()
                    t2 = tmp_root / "s2"
                    t2.mkdir(parents=True, exist_ok=True)
                    results.append(await run_scenario_2(page2, url, t2))
                    await ctx2.close()
            finally:
                await browser.close()
    finally:
        if tmp_root.exists():
            shutil.rmtree(tmp_root, ignore_errors=True)

    print("\n=== ENCODED VIDEOS VERIFICATION ===")
    for mp4 in sorted(VIDEOS_DIR.glob("*.mp4")):
        info = probe_media_info(mp4)
        print(f"FILE: {info['file']} ({info['size_mb']} MB)")
        for line in info["info"].splitlines():
            if any(k in line for k in ("Duration:", "Stream #0:")):
                print(" ", line.strip())

    return results


def main():
    parser = argparse.ArgumentParser(description="Record VOCANOVA vertical Shorts videos")
    parser.add_argument("--url", default=DEFAULT_URL, help="App URL to record")
    parser.add_argument(
        "--only",
        choices=("all", "short1", "short2"),
        default="all",
        help="Which scenario(s) to record",
    )
    args = parser.parse_args()
    asyncio.run(main_async(args.url, args.only))


if __name__ == "__main__":
    main()
