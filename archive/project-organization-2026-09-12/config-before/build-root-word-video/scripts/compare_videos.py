#!/usr/bin/env python3
"""Extract timestamp-aligned reference/candidate frames and build a contact sheet."""

from __future__ import annotations

import argparse
import json
import math
import shutil
import subprocess
from pathlib import Path


def run(command: list[str]) -> subprocess.CompletedProcess[str]:
    return subprocess.run(command, check=True, text=True, capture_output=True)


def probe(path: Path) -> dict:
    payload = run([
        "ffprobe", "-v", "error", "-show_entries",
        "format=duration,size,bit_rate:stream=index,codec_type,codec_name,width,height,"
        "pix_fmt,r_frame_rate,avg_frame_rate,nb_frames,sample_rate,channels,channel_layout,duration",
        "-of", "json", str(path),
    ])
    return json.loads(payload.stdout)


def duration(metadata: dict) -> float:
    return float(metadata["format"]["duration"])


def parse_times(raw: str | None, count: int, usable_duration: float) -> list[float]:
    if raw:
        values = [float(value.strip()) for value in raw.split(",") if value.strip()]
        if not values:
            raise ValueError("--times did not contain a timestamp")
        return values
    if count < 2:
        return [0.0]
    last = max(0.0, usable_duration - (1 / 30))
    return [last * index / (count - 1) for index in range(count)]


def extract(source: Path, timestamp: float, output: Path) -> None:
    run([
        "ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(source),
        "-ss", f"{timestamp:.6f}", "-frames:v", "1", "-vf", "scale=480:270:flags=lanczos",
        "-c:v", "png", str(output),
    ])


def pair(left: Path, right: Path, output: Path) -> None:
    run([
        "ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(left), "-i", str(right),
        "-filter_complex", "[0:v][1:v]hstack=inputs=2", "-frames:v", "1", str(output),
    ])


def contact_sheet(pair_pattern: Path, output: Path, item_count: int) -> tuple[int, int]:
    columns = 2 if item_count > 1 else 1
    rows = math.ceil(item_count / columns)
    run([
        "ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-framerate", "1",
        "-i", str(pair_pattern), "-vf",
        f"tile={columns}x{rows}:padding=4:margin=4:color=white", "-frames:v", "1", str(output),
    ])
    return columns, rows


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--reference", required=True, type=Path)
    parser.add_argument("--candidate", required=True, type=Path)
    parser.add_argument("--out", required=True, type=Path)
    parser.add_argument("--times", help="Comma-separated absolute seconds shared by both videos")
    parser.add_argument("--count", type=int, default=12, help="Evenly spaced pairs when --times is omitted")
    args = parser.parse_args()

    if not shutil.which("ffmpeg") or not shutil.which("ffprobe"):
        raise SystemExit("ffmpeg and ffprobe must be available on PATH")
    for source in (args.reference, args.candidate):
        if not source.is_file():
            raise SystemExit(f"Video not found: {source}")

    args.out.mkdir(parents=True, exist_ok=True)
    reference_meta = probe(args.reference)
    candidate_meta = probe(args.candidate)
    usable = min(duration(reference_meta), duration(candidate_meta))
    times = parse_times(args.times, args.count, usable)
    if any(value < 0 or value >= usable for value in times):
        raise SystemExit(f"All timestamps must be in [0, {usable:.6f})")

    frame_dir = args.out / "frames"
    frame_dir.mkdir(exist_ok=True)
    index_lines = ["index\ttime_sec\treference\tcandidate\tpair"]
    for index, timestamp in enumerate(times, start=1):
        reference_frame = frame_dir / f"reference_{index:03d}.png"
        candidate_frame = frame_dir / f"candidate_{index:03d}.png"
        pair_frame = frame_dir / f"pair_{index:03d}.png"
        extract(args.reference, timestamp, reference_frame)
        extract(args.candidate, timestamp, candidate_frame)
        pair(reference_frame, candidate_frame, pair_frame)
        index_lines.append(
            f"{index}\t{timestamp:.6f}\t{reference_frame.name}\t{candidate_frame.name}\t{pair_frame.name}"
        )

    columns, rows = contact_sheet(frame_dir / "pair_%03d.png", args.out / "contact-sheet.png", len(times))
    report = {
        "reference": {"path": str(args.reference.resolve()), "probe": reference_meta},
        "candidate": {"path": str(args.candidate.resolve()), "probe": candidate_meta},
        "timestamps": times,
        "contact_sheet": {"columns": columns, "rows": rows, "file": "contact-sheet.png"},
    }
    (args.out / "comparison.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (args.out / "index.tsv").write_text("\n".join(index_lines) + "\n", encoding="utf-8")
    print(f"Wrote {len(times)} pairs and {args.out / 'contact-sheet.png'}")


if __name__ == "__main__":
    main()
