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
    parser = argparse.ArgumentParser(description="Build a white-background before/change/result key-pose contact sheet.")
    parser.add_argument("--plan", required=True)
    parser.add_argument("--out", required=True)
    args = parser.parse_args()

    plan_path = Path(args.plan)
    plan = json.loads(plan_path.read_text(encoding="utf-8"))
    root = plan_path.resolve().parents[1]
    asset_dir = root / plan["assetDir"]
    output = Path(args.out)
    output.parent.mkdir(parents=True, exist_ok=True)

    cell_w, image_h, header_h = 560, 315, 54
    margin, gap = 18, 14
    row_h = image_h + header_h + 32 + gap
    width = margin * 2 + cell_w * 3 + gap * 2
    height = margin * 2 + row_h * len(plan["shots"])
    sheet = Image.new("RGB", (width, height), "white")
    draw = ImageDraw.Draw(sheet)
    heading = font(26)
    caption = font(18)
    subcaption = font(14)

    for row, shot in enumerate(plan["shots"]):
        top = margin + row * row_h
        for column, state in enumerate(("before", "change", "result")):
            left = margin + column * (cell_w + gap)
            draw.text((left + 2, top), f"{shot['word']} · {state}", fill=(4, 31, 160), font=heading)
            draw.text((left + 2, top + 31), shot["meaning"], fill=(70, 70, 70), font=subcaption)
            image_path = asset_dir / f"{shot['id']}-{state}.png"
            with Image.open(image_path) as source:
                rgba = source.convert("RGBA")
                rgba.thumbnail((cell_w - 16, image_h - 12), Image.Resampling.LANCZOS)
                x = left + (cell_w - rgba.width) // 2
                y = top + header_h + (image_h - rgba.height) // 2
                sheet.paste(rgba, (x, y), rgba)
            draw.rectangle((left, top + header_h, left + cell_w, top + header_h + image_h), outline=(225, 228, 234), width=2)
        action = shot["visualAction"]
        draw.text((margin + 2, top + header_h + image_h + 2), action, fill=(80, 80, 80), font=caption)

    sheet.save(output, format="PNG", optimize=True)
    mobile = output.with_name(f"{output.stem}-mobile{output.suffix}")
    scaled = sheet.resize((width // 2, height // 2), Image.Resampling.LANCZOS)
    scaled.save(mobile, format="PNG", optimize=True)
    print(f"Saved {output} ({sheet.width}x{sheet.height})")
    print(f"Saved {mobile} ({scaled.width}x{scaled.height})")


if __name__ == "__main__":
    main()
