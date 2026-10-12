#!/usr/bin/env python3
"""Extract a white-background Wan clip to deterministic RGB PNG frames.

This is not a matte or subject segmentation step. It normalizes only near-neutral
highlight pixels to literal white so a generated white plate merges with #FFFFFF.
"""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
from pathlib import Path

import cv2
import numpy as np


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--frames-dir", required=True)
    parser.add_argument("--report", required=True)
    parser.add_argument("--width", type=int, default=1664)
    parser.add_argument("--height", type=int, default=928)
    parser.add_argument("--fps", type=int, default=30)
    parser.add_argument("--white-floor", type=int, default=198)
    parser.add_argument("--neutral-range", type=int, default=20)
    parser.add_argument("--border", type=int, default=8)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    source_label = args.input
    frames_label = args.frames_dir
    source = Path(args.input).resolve()
    frames_dir = Path(args.frames_dir).resolve()
    report_path = Path(args.report).resolve()
    if not source.is_file():
        raise FileNotFoundError(source)
    if args.fps <= 0 or args.width <= 0 or args.height <= 0:
        raise ValueError("fps, width, and height must be positive")
    if not 0 <= args.white_floor <= 255:
        raise ValueError("white-floor must be in 0..255")
    if args.neutral_range < 0:
        raise ValueError("neutral-range must be non-negative")

    ffmpeg = shutil.which("ffmpeg")
    if ffmpeg is None:
        raise RuntimeError("ffmpeg is required")

    frames_dir.mkdir(parents=True, exist_ok=True)
    for old in frames_dir.glob("*.png"):
        old.unlink()
    subprocess.run(
        [
            ffmpeg,
            "-y",
            "-v",
            "error",
            "-i",
            str(source),
            "-vf",
            f"fps={args.fps},scale={args.width}:{args.height}:flags=lanczos",
            "-start_number",
            "0",
            str(frames_dir / "%06d.png"),
        ],
        check=True,
    )

    frames = sorted(frames_dir.glob("*.png"))
    expected = args.fps * 5
    changed = 0
    pixels = 0
    bad_corners = 0
    border = max(0, min(args.border, args.width // 4, args.height // 4))
    for frame_path in frames:
        encoded = np.fromfile(frame_path, dtype=np.uint8)
        image = cv2.imdecode(encoded, cv2.IMREAD_COLOR)
        if image is None:
            raise RuntimeError(f"Unreadable frame: {frame_path}")
        maximum = image.max(axis=2)
        minimum = image.min(axis=2)
        neutral_highlight = (minimum >= args.white_floor) & (
            maximum.astype(np.int16) - minimum.astype(np.int16) <= args.neutral_range
        )
        changed += int(neutral_highlight.sum())
        pixels += int(neutral_highlight.size)
        image[neutral_highlight] = 255
        if border:
            image[:border, :] = 255
            image[-border:, :] = 255
            image[:, :border] = 255
            image[:, -border:] = 255
        corners = (image[0, 0], image[0, -1], image[-1, 0], image[-1, -1])
        bad_corners += sum(1 for pixel in corners if not np.all(pixel == 255))
        success, png = cv2.imencode(".png", image, [cv2.IMWRITE_PNG_COMPRESSION, 3])
        if not success:
            raise RuntimeError(f"Could not write frame: {frame_path}")
        png.tofile(frame_path)

    report = {
        "input": source_label,
        "framesDir": frames_label,
        "width": args.width,
        "height": args.height,
        "fps": args.fps,
        "frames": len(frames),
        "expectedFrames": expected,
        "format": "RGB PNG; no alpha and no chroma key",
        "whiteFloor": args.white_floor,
        "neutralRange": args.neutral_range,
        "borderPixelsForcedWhite": border,
        "normalizedPixelPercent": round(100 * changed / max(1, pixels), 4),
        "badCornerSamples": bad_corners,
        "ok": len(frames) == expected and bad_corners == 0,
    }
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    if not report["ok"]:
        raise SystemExit(f"White-background frame QA failed: {report_path}")
    print(f"Wrote {len(frames)} white-background RGB frames to {frames_dir}")
    print(f"Report: {report_path}")


if __name__ == "__main__":
    main()
