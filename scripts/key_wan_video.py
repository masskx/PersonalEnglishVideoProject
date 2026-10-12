from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import tempfile
from pathlib import Path

import cv2
import numpy as np


def boundary_connected_green(frame: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    b, g, r = cv2.split(frame)
    green = (
        (g.astype(np.int16) - np.maximum(r, b).astype(np.int16) > 32)
        & (g > 85)
        & (g > r * 1.16)
        & (g > b * 1.12)
    ).astype(np.uint8)
    green = cv2.morphologyEx(green, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))

    count, labels = cv2.connectedComponents(green, connectivity=8)
    border_labels = np.unique(
        np.concatenate((labels[0], labels[-1], labels[:, 0], labels[:, -1]))
    )
    border_labels = border_labels[border_labels != 0]
    background = np.isin(labels, border_labels)
    enclosed_green = (green == 1) & ~background
    return background, enclosed_green


def key_frame(frame: np.ndarray) -> tuple[np.ndarray, dict[str, float]]:
    background, enclosed_green = boundary_connected_green(frame)
    foreground = ~background

    # Fill enclosed props whose pale interior was shifted toward green by the generator. Restrict
    # this to compact contours so limbs and separated motion marks stay thin.
    foreground_u8 = foreground.astype(np.uint8) * 255
    contours, _ = cv2.findContours(foreground_u8, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    filled_foreground = foreground_u8.copy()
    frame_area = frame.shape[0] * frame.shape[1]
    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        contour_area = cv2.contourArea(contour)
        if contour_area >= 18 and w * h <= frame_area * 0.18:
            cv2.drawContours(filled_foreground, [contour], -1, 255, thickness=cv2.FILLED)

    # Remove tiny isolated background flecks while preserving thin limbs and white eyes.
    alpha = filled_foreground
    alpha = cv2.morphologyEx(alpha, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))
    alpha = cv2.GaussianBlur(alpha, (0, 0), 0.65)
    alpha[alpha < 10] = 0
    alpha[alpha > 245] = 255

    # Preserve Xiaohei's 1–2 px black limbs. Chroma compression can tint their antialiased edge
    # green enough to join the plate mask even though the line still reads as black to the eye.
    # A restrained one-pixel ink support mask reconnects those limbs without growing pale props.
    dark_ink = np.max(frame, axis=2) < 112
    dark_ink = cv2.dilate(
        dark_ink.astype(np.uint8),
        cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2, 2)),
        iterations=1,
    )
    ink_alpha = cv2.GaussianBlur(dark_ink * 255, (0, 0), 0.55)
    ink_alpha[ink_alpha < 4] = 0
    ink_alpha[ink_alpha > 248] = 255
    alpha = np.maximum(alpha, ink_alpha)

    cleaned = frame.copy()
    # Wan often turns white interior details green. Enclosed green cannot be connected to the
    # outer plate, so restore it to white instead of punching a hole through eyes or props.
    cleaned[enclosed_green] = (245, 245, 245)

    b, g, r = cv2.split(cleaned)
    # Despill the full visible alpha fringe, not only the hard foreground mask. Gaussian alpha
    # creates a soft outer ring whose RGB still comes from the green plate; leaving it untouched
    # produces a cyan/green halo after compositing on white.
    spill = (alpha > 0) & (
        g.astype(np.int16) > np.maximum(r, b).astype(np.int16) + 8
    )
    neutral = np.maximum(r, b)
    g[spill] = neutral[spill]
    cleaned = cv2.merge((b, g, r))

    rgba = cv2.cvtColor(cleaned, cv2.COLOR_BGR2BGRA)
    rgba[:, :, 3] = alpha
    metrics = {
        "visibleCoverage": float(np.count_nonzero(alpha > 8) / alpha.size),
        "softAlphaCoverage": float(np.count_nonzero((alpha > 8) & (alpha < 247)) / alpha.size),
        "enclosedGreenCoverage": float(np.count_nonzero(enclosed_green) / alpha.size),
    }
    return rgba, metrics


def upscale_rgba_premultiplied(rgba: np.ndarray, scale: int) -> np.ndarray:
    height, width = rgba.shape[:2]
    target = (width * scale, height * scale)
    alpha = rgba[:, :, 3].astype(np.float32) / 255.0
    premultiplied = rgba[:, :, :3].astype(np.float32) * alpha[:, :, None]
    alpha_up = cv2.resize(alpha, target, interpolation=cv2.INTER_LANCZOS4)
    premultiplied_up = cv2.resize(
        premultiplied, target, interpolation=cv2.INTER_LANCZOS4
    )
    alpha_up = np.clip(alpha_up, 0.0, 1.0)
    alpha_up = cv2.GaussianBlur(alpha_up, (0, 0), 1.25)
    alpha_up = np.clip(alpha_up, 0.0, 1.0)
    color_up = np.zeros_like(premultiplied_up)
    visible = alpha_up > 1e-4
    color_up[visible] = premultiplied_up[visible] / alpha_up[visible, None]
    color_up = np.clip(color_up, 0, 255).astype(np.uint8)

    b, g, r = cv2.split(color_up)
    spill = (alpha_up > 0) & (
        g.astype(np.int16) > np.maximum(r, b).astype(np.int16) + 8
    )
    neutral = np.maximum(r, b)
    g[spill] = neutral[spill]
    color_up = cv2.merge((b, g, r))
    return np.dstack((color_up, np.round(alpha_up * 255).astype(np.uint8)))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output")
    parser.add_argument("--report")
    parser.add_argument("--frames-dir")
    parser.add_argument("--frames-only", action="store_true")
    parser.add_argument("--output-scale", type=int, default=1)
    parser.add_argument("--ffmpeg", default="ffmpeg")
    args = parser.parse_args()

    source = Path(args.input).resolve()
    if not args.output and not args.frames_only:
        parser.error("--output is required unless --frames-only is set")
    output = Path(args.output).resolve() if args.output else None
    report = (
        Path(args.report).resolve()
        if args.report
        else (output.with_suffix(".report.json") if output else Path("wan-frames.report.json").resolve())
    )
    if output:
        output.parent.mkdir(parents=True, exist_ok=True)
    report.parent.mkdir(parents=True, exist_ok=True)

    capture = cv2.VideoCapture(str(source))
    if not capture.isOpened():
        raise RuntimeError(f"Unable to decode {source}")
    fps = capture.get(cv2.CAP_PROP_FPS)
    width = int(capture.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(capture.get(cv2.CAP_PROP_FRAME_HEIGHT))
    expected_frames = int(capture.get(cv2.CAP_PROP_FRAME_COUNT))

    persistent_frames_dir = Path(args.frames_dir).resolve() if args.frames_dir else None
    temp_dir = persistent_frames_dir or Path(tempfile.mkdtemp(prefix="wan-key-"))
    temp_dir.mkdir(parents=True, exist_ok=True)
    frame_metrics: list[dict[str, float]] = []
    try:
        index = 0
        while True:
            ok, frame = capture.read()
            if not ok:
                break
            rgba, metrics = key_frame(frame)
            if args.output_scale > 1:
                rgba = upscale_rgba_premultiplied(rgba, args.output_scale)
            frame_path = temp_dir / f"{index:06d}.png"
            encoded_ok, encoded_png = cv2.imencode(".png", rgba)
            if not encoded_ok:
                raise RuntimeError(f"Unable to write {frame_path}")
            encoded_png.tofile(str(frame_path))
            frame_metrics.append(metrics)
            index += 1
        capture.release()
        if index == 0:
            raise RuntimeError("No frames decoded")

        if not args.frames_only:
            command = [
                args.ffmpeg,
                "-y",
                "-framerate",
                f"{fps:g}",
                "-i",
                str(temp_dir / "%06d.png"),
                "-an",
                "-c:v",
                "libvpx-vp9",
                "-pix_fmt",
                "yuva420p",
                "-lossless",
                "1",
                "-row-mt",
                "1",
                "-auto-alt-ref",
                "0",
                str(output),
            ]
            result = subprocess.run(command, capture_output=True, text=True, encoding="utf-8")
            if result.returncode != 0:
                raise RuntimeError(result.stderr)

        summary = {
            "input": str(source),
            "output": str(output) if output else None,
            "framesDir": str(persistent_frames_dir) if persistent_frames_dir else None,
            "width": width,
            "height": height,
            "fps": fps,
            "frames": index,
            "expectedFrames": expected_frames,
            "duration": index / fps,
            "visibleCoverage": {
                "min": min(item["visibleCoverage"] for item in frame_metrics),
                "max": max(item["visibleCoverage"] for item in frame_metrics),
                "mean": float(np.mean([item["visibleCoverage"] for item in frame_metrics])),
            },
            "softAlphaCoverage": {
                "max": max(item["softAlphaCoverage"] for item in frame_metrics),
                "mean": float(np.mean([item["softAlphaCoverage"] for item in frame_metrics])),
            },
            "enclosedGreenCoverage": {
                "max": max(item["enclosedGreenCoverage"] for item in frame_metrics),
                "mean": float(np.mean([item["enclosedGreenCoverage"] for item in frame_metrics])),
            },
            "ok": bool(index == expected_frames and 0.002 <= np.mean(
                [item["visibleCoverage"] for item in frame_metrics]
            ) <= 0.65),
        }
        report.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"Keyed {index} frames to {persistent_frames_dir or output}")
        print(f"Report: {report}")
    finally:
        capture.release()
        if persistent_frames_dir is None:
            shutil.rmtree(temp_dir, ignore_errors=True)


if __name__ == "__main__":
    main()
