from __future__ import annotations

import argparse
import json
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


def font(size: int):
    for candidate in ("C:/Windows/Fonts/msyhbd.ttc", "C:/Windows/Fonts/msyh.ttc"):
        path = Path(candidate)
        if path.exists():
            return ImageFont.truetype(str(path), size)
    return ImageFont.load_default()


def main() -> None:
    parser = argparse.ArgumentParser(description="Build labeled full-video preview contact sheets.")
    parser.add_argument("--input-dir", required=True)
    parser.add_argument("--out-dir", required=True)
    parser.add_argument("--interval", type=float, default=1.0)
    parser.add_argument("--columns", type=int, default=4)
    parser.add_argument("--rows-per-sheet", type=int, default=6)
    args = parser.parse_args()

    source = Path(args.input_dir)
    output = Path(args.out_dir)
    files = sorted(source.glob("frame-*.jpg"))
    if not files:
        raise SystemExit(f"No sampled frames found under {source}")
    output.mkdir(parents=True, exist_ok=True)

    cell_w, cell_h = 520, 330
    label_h = 36
    cols = max(1, args.columns)
    per_sheet = cols * max(1, args.rows_per_sheet)
    label_font = font(20)
    border = (220, 224, 236)
    blue = (4, 31, 160)
    pages: list[str] = []

    for page_index in range(math.ceil(len(files) / per_sheet)):
        page_files = files[page_index * per_sheet : (page_index + 1) * per_sheet]
        rows = math.ceil(len(page_files) / cols)
        sheet = Image.new("RGB", (cols * cell_w, rows * cell_h), "white")
        draw = ImageDraw.Draw(sheet)
        for index, file in enumerate(page_files):
            col = index % cols
            row = index // cols
            x, y = col * cell_w, row * cell_h
            with Image.open(file) as image:
                image = image.convert("RGB")
                available_w = cell_w - 24
                available_h = cell_h - label_h - 18
                scale = min(available_w / image.width, available_h / image.height)
                size = (max(1, round(image.width * scale)), max(1, round(image.height * scale)))
                image = image.resize(size, Image.Resampling.LANCZOS)
                image_x = x + (cell_w - size[0]) // 2
                image_y = y + 8 + (available_h - size[1]) // 2
                sheet.paste(image, (image_x, image_y))
            draw.rectangle((x + 6, y + 6, x + cell_w - 7, y + cell_h - 7), outline=border, width=2)
            frame_number = int(file.stem.split("-")[1])
            seconds = max(0.0, (frame_number - 1) * args.interval)
            draw.text((x + 14, y + cell_h - label_h + 4), f"{seconds:06.1f}s", fill=blue, font=label_font)

        page = output / f"full-preview-contact-{page_index + 1:02d}.jpg"
        sheet.save(page, quality=92, optimize=True)
        pages.append(page.name)

    (output / "contact-sheets.json").write_text(
        json.dumps({"intervalSeconds": args.interval, "pages": pages}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Built {len(pages)} full-preview contact sheet(s) in {output}")


if __name__ == "__main__":
    main()
