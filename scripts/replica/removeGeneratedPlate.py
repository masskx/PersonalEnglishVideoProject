from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageFilter


def clamp(value: float) -> int:
    return max(0, min(255, round(value)))


def smoothstep(value: float) -> float:
    value = max(0.0, min(1.0, value))
    return value * value * (3.0 - 2.0 * value)


def remove_plate(source: Path, output: Path) -> None:
    image = Image.open(source).convert("RGBA")
    pixels = image.load()
    width, height = image.size
    safe_x = round(width * 0.07)
    safe_y = round(height * 0.07)

    for y in range(height):
        for x in range(width):
            red, green, blue, alpha = pixels[x, y]
            if alpha == 0:
                continue

            # Prompts reserve a clean outer band. Clearing it removes model-added paper rims,
            # frame strokes, corner marks, and tiny signatures without touching valid subjects.
            if x < safe_x or x >= width - safe_x or y < safe_y or y >= height - safe_y:
                pixels[x, y] = (0, 0, 0, 0)
                continue

            # Generated plates are often textured rather than literal #00FF00. Color dominance
            # is stable across those brush variations and does not affect black/blue/orange art.
            dominance = green - max(red, blue)
            if green >= 48 and dominance >= 20:
                pixels[x, y] = (0, 0, 0, 0)
                continue
            if green >= 48 and dominance > 6:
                remaining = 1.0 - smoothstep((dominance - 6.0) / 14.0)
                output_alpha = clamp(alpha * remaining)
                if output_alpha <= 8:
                    pixels[x, y] = (0, 0, 0, 0)
                    continue
                # Despill partially transparent edges before they meet the white canvas.
                green = min(green, max(red, blue))
                pixels[x, y] = (red, green, blue, output_alpha)
                continue

            # Seedream occasionally wraps a green plate in a white paper rim. White foreground
            # fills can be transparent because the final Remotion canvas is exactly white.
            if min(red, green, blue) >= 236 and max(red, green, blue) - min(red, green, blue) <= 24:
                pixels[x, y] = (0, 0, 0, 0)

    alpha = image.getchannel("A").filter(ImageFilter.MinFilter(3))
    image.putalpha(alpha)
    output.parent.mkdir(parents=True, exist_ok=True)
    image.save(output, format="PNG", optimize=True)


def main() -> None:
    parser = argparse.ArgumentParser(description="Remove textured generated green plates and white rims.")
    parser.add_argument("--input", required=True)
    parser.add_argument("--out", required=True)
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()

    source = Path(args.input)
    output = Path(args.out)
    if not source.exists():
        raise FileNotFoundError(source)
    if output.exists() and not args.force:
        raise FileExistsError(f"{output} already exists; use --force")
    remove_plate(source, output)


if __name__ == "__main__":
    main()
