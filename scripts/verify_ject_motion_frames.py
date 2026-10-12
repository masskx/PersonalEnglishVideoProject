from __future__ import annotations

import json
from pathlib import Path

import cv2
import numpy as np


ROOT = Path("public/assets/replica/ject-motion/frames")
OUTPUT = Path("outputs/ject-wan-motion/png-sequence-qa.json")
EXPECTED = ("hook", "direction", "project", "inject", "object", "subject")


def read_rgba(path: Path) -> np.ndarray:
    encoded = np.fromfile(str(path), dtype=np.uint8)
    image = cv2.imdecode(encoded, cv2.IMREAD_UNCHANGED)
    if image is None or image.ndim != 3 or image.shape[2] != 4:
        raise RuntimeError(f"{path} is not a readable RGBA PNG")
    return image


def verify_sequence(name: str) -> dict[str, object]:
    directory = ROOT / name
    paths = sorted(directory.glob("*.png"))
    if len(paths) != 150:
        raise RuntimeError(f"{name}: expected 150 PNG frames, found {len(paths)}")

    coverage: list[float] = []
    green_spill: list[float] = []
    frame_delta: list[float] = []
    dimensions: set[tuple[int, int]] = set()
    previous: np.ndarray | None = None

    for path in paths:
        rgba = read_rgba(path)
        height, width = rgba.shape[:2]
        dimensions.add((width, height))
        b, g, r, alpha = cv2.split(rgba)
        visible = alpha > 8
        coverage.append(float(np.count_nonzero(visible) / visible.size))

        # Count only chroma-key-like green, not intentional pale cyan props.
        spill = (
            visible
            & (g > 105)
            & (g.astype(np.float32) > r.astype(np.float32) * 1.35)
            & (g.astype(np.float32) > b.astype(np.float32) * 1.16)
        )
        green_spill.append(float(np.count_nonzero(spill) / max(1, np.count_nonzero(visible))))

        if previous is not None:
            frame_delta.append(float(np.mean(cv2.absdiff(rgba, previous))))
        previous = rgba

    empty_frames = sum(value < 0.0015 for value in coverage)
    frozen_steps = sum(value < 0.01 for value in frame_delta)
    result = {
        "frames": len(paths),
        "dimensions": [list(item) for item in sorted(dimensions)],
        "visibleCoverage": {
            "min": min(coverage),
            "max": max(coverage),
            "mean": float(np.mean(coverage)),
        },
        "foregroundGreenSpill": {
            "max": max(green_spill),
            "mean": float(np.mean(green_spill)),
        },
        "frameDelta": {
            "min": min(frame_delta),
            "median": float(np.median(frame_delta)),
            "p95": float(np.percentile(frame_delta, 95)),
        },
        "emptyFrames": empty_frames,
        "nearFrozenSteps": frozen_steps,
    }
    result["ok"] = bool(
        dimensions == {(1664, 928)}
        and empty_frames == 0
        and max(green_spill) <= 0.012
        and len(frame_delta) - frozen_steps >= 90
    )
    return result


def main() -> None:
    sequences = {name: verify_sequence(name) for name in EXPECTED}
    report = {
        "root": str(ROOT.resolve()),
        "sequences": sequences,
        "ok": all(bool(item["ok"]) for item in sequences.values()),
    }
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    if not report["ok"]:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
