from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Flatten a reference image onto a white 16:9 RGB plate."
    )
    parser.add_argument("--input", required=True)
    parser.add_argument("--out", required=True)
    args = parser.parse_args()

    source = Path(args.input)
    output = Path(args.out)
    output.parent.mkdir(parents=True, exist_ok=True)

    with Image.open(source) as image:
        rgba = image.convert("RGBA").resize((1536, 864), Image.Resampling.LANCZOS)
        plate = Image.new("RGBA", rgba.size, (255, 255, 255, 255))
        plate.alpha_composite(rgba)
        plate.convert("RGB").save(output, format="PNG", optimize=True)


if __name__ == "__main__":
    main()
