from __future__ import annotations

import argparse
import json
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
    parser = argparse.ArgumentParser(description="Pair decoded MP4 frames around every planned Xiaohei key-pose cut.")
    parser.add_argument("--plan", required=True)
    parser.add_argument("--frames-dir", required=True)
    parser.add_argument("--out", required=True)
    args = parser.parse_args()

    plan_path = Path(args.plan)
    plan = json.loads(plan_path.read_text(encoding="utf-8"))
    frames_dir = Path(args.frames_dir)
    output = Path(args.out)
    output.parent.mkdir(parents=True, exist_ok=True)
    cell_w, image_h, header_h = 600, 338, 46
    margin, gap = 20, 18
    columns, pairs = 2, []
    for shot in plan["shots"]:
        for state in shot["states"][1:]:
            before = next(frames_dir.glob(f"*_{shot['word']}-{state['id']}-before_f*.png"), None)
            after = next(frames_dir.glob(f"*_{shot['word']}-{state['id']}-after_f*.png"), None)
            if before is None or after is None:
                raise FileNotFoundError(f"Missing encoded cut frames for {shot['word']}/{state['id']}.")
            pairs.append((shot, state, before, after))

    pair_w = cell_w * 2 + gap
    row_h = header_h + image_h + 40
    rows = (len(pairs) + columns - 1) // columns
    sheet = Image.new("RGB", (margin * 2 + columns * pair_w + (columns - 1) * gap, margin * 2 + rows * row_h), "white")
    draw = ImageDraw.Draw(sheet)
    heading, label = font(23), font(16)
    for index, (shot, state, before, after) in enumerate(pairs):
        row, column = divmod(index, columns)
        left, top = margin + column * (pair_w + gap), margin + row * row_h
        draw.text((left, top), f"{shot['word']}  ·  {state['id']} cut", fill=(4, 31, 160), font=heading)
        for side, source, dx in (("before", before, 0), ("after", after, cell_w + gap)):
            draw.text((left + dx, top + 28), f"MP4 frame {source.stem.rsplit('_f', 1)[-1]} · {side}", fill=(70, 70, 70), font=label)
            with Image.open(source) as image:
                image = image.convert("RGB")
                image.thumbnail((cell_w, image_h), Image.Resampling.LANCZOS)
                x = left + dx + (cell_w - image.width) // 2
                y = top + header_h + (image_h - image.height) // 2
                sheet.paste(image, (x, y))
            draw.rectangle((left + dx, top + header_h, left + dx + cell_w, top + header_h + image_h), outline=(225, 228, 234), width=2)

    sheet.save(output, format="PNG", optimize=True)
    mobile = output.with_name(f"{output.stem}-mobile{output.suffix}")
    scaled = sheet.resize((sheet.width // 2, sheet.height // 2), Image.Resampling.LANCZOS)
    scaled.save(mobile, format="PNG", optimize=True)
    print(f"Saved {output} ({sheet.width}x{sheet.height})")
    print(f"Saved {mobile} ({scaled.width}x{scaled.height})")


if __name__ == "__main__":
    main()
