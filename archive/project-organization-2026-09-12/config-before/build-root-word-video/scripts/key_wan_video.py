from __future__ import annotations

import argparse
import json
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
    _, labels = cv2.connectedComponents(green, connectivity=8)
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
    foreground_u8 = foreground.astype(np.uint8) * 255
    contours, _ = cv2.findContours(
        foreground_u8, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
    )
    filled = foreground_u8.copy()
    frame_area = frame.shape[0] * frame.shape[1]
    for contour in contours:
        _, _, width, height = cv2.boundingRect(contour)
        if cv2.contourArea(contour) >= 18 and width * height <= frame_area * 0.18:
            cv2.drawContours(filled, [contour], -1, 255, thickness=cv2.FILLED)

    alpha = cv2.morphologyEx(filled, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))
    alpha = cv2.GaussianBlur(alpha, (0, 0), 0.65)
    alpha[alpha < 10] = 0
    alpha[alpha > 245] = 255

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
    cleaned[enclosed_green] = (245, 245, 245)
    b, g, r = cv2.split(cleaned)
    spill = (alpha > 0) & (
        g.astype(np.int16) > np.maximum(r, b).astype(np.int16) + 8
    )
    g[spill] = np.maximum(r, b)[spill]
    rgba = cv2.cvtColor(cv2.merge((b, g, r)), cv2.COLOR_BGR2BGRA)
    rgba[:, :, 3] = alpha
    return rgba, {
        "visibleCoverage": float(np.count_nonzero(alpha > 8) / alpha.size),
        "softAlphaCoverage": float(
            np.count_nonzero((alpha > 8) & (alpha < 247)) / alpha.size
        ),
        "enclosedGreenCoverage": float(np.count_nonzero(enclosed_green) / alpha.size),
    }


def upscale_premultiplied(rgba: np.ndarray, scale: int) -> np.ndarray:
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
    g[spill] = np.maximum(r, b)[spill]
    return np.dstack(
        (cv2.merge((b, g, r)), np.round(alpha_up * 255).astype(np.uint8))
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--frames-dir", required=True)
    parser.add_argument("--report")
    parser.add_argument("--output-scale", type=int, default=2)
    parser.add_argument(
        "--frames-only",
        action="store_true",
        help="Compatibility flag; this script always emits a PNG sequence.",
    )
    args = parser.parse_args()

    source = Path(args.input).resolve()
    frames_dir = Path(args.frames_dir).resolve()
    report = (
        Path(args.report).resolve()
        if args.report
        else frames_dir.with_suffix(".matte.json")
    )
    frames_dir.mkdir(parents=True, exist_ok=True)
    report.parent.mkdir(parents=True, exist_ok=True)
    capture = cv2.VideoCapture(str(source))
    if not capture.isOpened():
        raise RuntimeError(f"Unable to decode {source}")
    fps = capture.get(cv2.CAP_PROP_FPS)
    width = int(capture.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(capture.get(cv2.CAP_PROP_FRAME_HEIGHT))
    expected = int(capture.get(cv2.CAP_PROP_FRAME_COUNT))
    metrics: list[dict[str, float]] = []
    index = 0
    while True:
        ok, frame = capture.read()
        if not ok:
            break
        rgba, frame_metrics = key_frame(frame)
        if args.output_scale > 1:
            rgba = upscale_premultiplied(rgba, args.output_scale)
        encoded_ok, encoded = cv2.imencode(".png", rgba)
        if not encoded_ok:
            raise RuntimeError(f"Unable to encode frame {index}")
        encoded.tofile(str(frames_dir / f"{index:06d}.png"))
        metrics.append(frame_metrics)
        index += 1
    capture.release()
    if index == 0:
        raise RuntimeError("No frames decoded")
    summary = {
        "input": str(source),
        "framesDir": str(frames_dir),
        "sourceWidth": width,
        "sourceHeight": height,
        "outputWidth": width * args.output_scale,
        "outputHeight": height * args.output_scale,
        "fps": fps,
        "frames": index,
        "expectedFrames": expected,
        "duration": index / fps,
        "visibleCoverage": {
            "min": min(item["visibleCoverage"] for item in metrics),
            "max": max(item["visibleCoverage"] for item in metrics),
            "mean": float(np.mean([item["visibleCoverage"] for item in metrics])),
        },
        "softAlphaCoverage": {
            "max": max(item["softAlphaCoverage"] for item in metrics),
            "mean": float(np.mean([item["softAlphaCoverage"] for item in metrics])),
        },
        "ok": bool(
            index == expected
            and abs(fps - 30) < 0.01
            and 0.002
            <= np.mean([item["visibleCoverage"] for item in metrics])
            <= 0.65
        ),
    }
    report.write_text(
        json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"Keyed {index} frames to {frames_dir}")
    print(f"Report: {report}")
    if not summary["ok"]:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
