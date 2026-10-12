from __future__ import annotations

import argparse
import json
import subprocess
from pathlib import Path

import numpy as np
from scipy.signal import find_peaks


def decode_audio(path: Path, seconds: int = 90, sample_rate: int = 22050) -> np.ndarray:
    command = [
        "ffmpeg", "-v", "error", "-i", str(path), "-t", str(seconds),
        "-ac", "1", "-ar", str(sample_rate), "-f", "f32le", "pipe:1",
    ]
    result = subprocess.run(command, check=True, stdout=subprocess.PIPE)
    return np.frombuffer(result.stdout, dtype=np.float32)


def estimate_bpm(samples: np.ndarray, sample_rate: int = 22050) -> tuple[float, float]:
    frame_size = 1024
    hop = 512
    if samples.size < frame_size * 4:
        return 0.0, 0.0
    frames = np.lib.stride_tricks.sliding_window_view(samples, frame_size)[::hop]
    spectra = np.abs(np.fft.rfft(frames * np.hanning(frame_size), axis=1))
    flux = np.maximum(0, np.diff(spectra, axis=0)).sum(axis=1)
    flux = np.convolve(flux, np.ones(4) / 4, mode="same")
    flux -= np.median(flux)
    flux = np.maximum(flux, 0)
    correlation = np.correlate(flux, flux, mode="full")[len(flux) - 1 :]
    envelope_rate = sample_rate / hop
    min_lag = max(1, int(envelope_rate * 60 / 140))
    max_lag = min(len(correlation) - 1, int(envelope_rate * 60 / 80))
    window = correlation[min_lag : max_lag + 1]
    if window.size == 0 or float(window.max()) <= 0:
        return 0.0, 0.0
    lag = min_lag + int(np.argmax(window))
    bpm = 60 * envelope_rate / lag
    confidence = float(window.max() / (np.median(window) + 1e-9))
    return round(float(bpm), 1), round(confidence, 2)


def analyze(path: Path) -> dict[str, float | str]:
    samples = decode_audio(path)
    frame_size = 2048
    hop = 1024
    frames = np.lib.stride_tricks.sliding_window_view(samples, frame_size)[::hop]
    rms = np.sqrt(np.mean(frames * frames, axis=1) + 1e-12)
    rms_db = 20 * np.log10(rms + 1e-12)
    peaks, _ = find_peaks(rms_db, distance=max(1, int(0.15 * 22050 / hop)), prominence=1.5)
    bpm, confidence = estimate_bpm(samples)
    return {
        "file": path.name,
        "estimatedBpm": bpm,
        "tempoConfidence": confidence,
        "medianRmsDb": round(float(np.median(rms_db)), 1),
        "p90RmsDb": round(float(np.percentile(rms_db, 90)), 1),
        "dynamicRangeDb": round(float(np.percentile(rms_db, 90) - np.percentile(rms_db, 10)), 1),
        "silenceFractionBelowMinus45Db": round(float(np.mean(rms_db < -45)), 4),
        "energyPeaksPerSecond": round(float(len(peaks) / (len(samples) / 22050)), 2),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("directory", type=Path)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    rows = [analyze(path) for path in sorted(args.directory.glob("*.mp3"))]
    rendered = json.dumps(rows, ensure_ascii=False, indent=2)
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(rendered + "\n", encoding="utf-8")
    print(rendered)


if __name__ == "__main__":
    main()
