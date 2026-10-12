from __future__ import annotations

import argparse
import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


def font(size: int) -> ImageFont.ImageFont:
    for candidate in ("C:/Windows/Fonts/arial.ttf", "C:/Windows/Fonts/segoeui.ttf"):
        try:
            return ImageFont.truetype(candidate, size)
        except OSError:
            pass
    return ImageFont.load_default()


def main() -> None:
    parser = argparse.ArgumentParser(description="Build a labeled contact sheet of feed-size review stills.")
    parser.add_argument("--input-dir", required=True)
    parser.add_argument("--out", required=True)
    parser.add_argument("--columns", type=int, default=4)
    args = parser.parse_args()
    source_dir, output = Path(args.input_dir), Path(args.out)
    images = sorted(
        item for item in source_dir.iterdir()
        if item.suffix.lower() in {".jpg", ".jpeg", ".png"} and item.name != output.name
    )
    if not images:
        raise FileNotFoundError(f"No review stills found in {source_dir}.")
    cols = max(1, args.columns)
    cell_w, image_h, label_h = 370, 208, 28
    margin, gap = 18, 12
    rows = (len(images) + cols - 1) // cols
    canvas = Image.new(
        "RGB",
        (margin * 2 + cols * cell_w + (cols - 1) * gap,
         margin * 2 + rows * (image_h + label_h) + (rows - 1) * gap),
        "white",
    )
    draw, caption = ImageDraw.Draw(canvas), font(15)
    for index, file in enumerate(images):
        row, col = divmod(index, cols)
        x, y = margin + col * (cell_w + gap), margin + row * (image_h + label_h + gap)
        label = re.sub(r"_f\d+$", "", file.stem)
        draw.text((x, y), label, fill=(4, 31, 160), font=caption)
        with Image.open(file) as image:
            image = image.convert("RGB")
            image.thumbnail((cell_w, image_h), Image.Resampling.LANCZOS)
            canvas.paste(image, (x + (cell_w - image.width) // 2, y + label_h + (image_h - image.height) // 2))
        draw.rectangle((x, y + label_h, x + cell_w, y + label_h + image_h), outline=(225, 228, 234), width=1)
    output.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(output, format="JPEG", quality=92, optimize=True)
    print(f"Saved {output} ({canvas.width}x{canvas.height}, {len(images)} stills)")


if __name__ == "__main__":
    main()
