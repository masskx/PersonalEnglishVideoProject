from pathlib import Path
import json

from PIL import Image, ImageDraw, ImageOps

from build_role_locked_assets import accepted_role, canvas, role_on


ROOT = Path(__file__).resolve().parents[3]
PUBLIC_OUT = ROOT / "public/assets/replica/duc-duct-keyposes"
ARCHIVE_OUT = ROOT / "assets/replica/duc-duct-keyposes"
REVIEW_OUT = ROOT / "work/duc-duct-keypose-review"
W, H = 2048, 1152

BLACK = "#111111"
ORANGE = "#F47B20"
RED = "#EF3C3C"
BLUE = "#B8E9E8"
YELLOW = "#FFC928"


def outlined_line(draw, points, width=30, fill=ORANGE):
    draw.line(points, fill=BLACK, width=width + 12, joint="curve")
    draw.line(points, fill=fill, width=width, joint="curve")


def outlined_rect(draw, box, fill="white", radius=14, width=12):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=BLACK, width=width)


def dot(draw, cx, cy, radius=34, fill="white"):
    draw.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), fill=fill, outline=BLACK, width=10)


def card(draw, box, fill="white", accent=True):
    outlined_rect(draw, box, fill=fill, radius=12, width=12)
    x1, y1, x2, y2 = box
    if accent:
        draw.line((x1 + 28, y1 + 42, x2 - 28, y1 + 42), fill=ORANGE, width=10)
        draw.line((x1 + 28, y1 + 78, x2 - 75, y1 + 78), fill=BLACK, width=8)


def group_circle(draw, box, fill="white"):
    draw.ellipse(box, fill=fill, outline=BLACK, width=12)


def flag(draw, x, y, color=RED):
    draw.line((x, y, x, y + 115), fill=BLACK, width=10)
    draw.ellipse((x - 8, y - 8, x + 8, y + 8), fill=BLACK)
    draw.polygon([(x, y + 8), (x + 105, y + 28), (x + 105, y + 75), (x, y + 62)], fill=color, outline=BLACK)


def base(role):
    scene = canvas()
    role_on(scene, role, x=205, y=175)
    return scene


def conduct_before(role):
    scene = base(role)
    d = ImageDraw.Draw(scene)
    dot(d, 990, 430)
    dot(d, 1210, 650)
    dot(d, 1430, 850)
    return scene


def conduct_change(role):
    scene = base(role)
    d = ImageDraw.Draw(scene)
    outlined_line(d, [(930, 430), (1140, 520)], width=24)
    outlined_line(d, [(930, 650), (1140, 630)], width=24)
    outlined_line(d, [(930, 850), (1140, 740)], width=24)
    dot(d, 930, 430)
    dot(d, 930, 650)
    dot(d, 930, 850)
    group_circle(d, (1180, 500, 1500, 820), fill="white")
    return scene


def conduct_result(role):
    scene = base(role)
    d = ImageDraw.Draw(scene)
    group_circle(d, (1110, 370, 1510, 770), fill=BLUE)
    dot(d, 1220, 510, radius=28)
    dot(d, 1390, 510, radius=28)
    dot(d, 1305, 675, radius=28)
    flag(d, 1570, 435)
    return scene


def induce_before(role):
    scene = base(role)
    d = ImageDraw.Draw(scene)
    outlined_rect(d, (1220, 320, 1650, 850), fill="white", radius=8, width=14)
    d.rectangle((1300, 400, 1600, 850), fill=BLUE, outline=BLACK, width=10)
    d.ellipse((1530, 610, 1560, 640), fill=BLACK)
    card(d, (970, 610, 1130, 735), fill="white", accent=False)
    return scene


def induce_change(role):
    scene = base(role)
    d = ImageDraw.Draw(scene)
    outlined_rect(d, (1220, 320, 1650, 850), fill="white", radius=8, width=14)
    d.rectangle((1300, 400, 1600, 850), fill=BLUE, outline=BLACK, width=10)
    d.ellipse((1530, 610, 1560, 640), fill=BLACK)
    card(d, (1235, 610, 1395, 735), fill=ORANGE, accent=False)
    outlined_line(d, [(1030, 675), (1190, 675)], width=22)
    return scene


def induce_result(role):
    scene = base(role)
    d = ImageDraw.Draw(scene)
    outlined_rect(d, (1220, 320, 1650, 850), fill="white", radius=8, width=14)
    d.rectangle((1300, 400, 1600, 850), fill=BLUE, outline=BLACK, width=10)
    d.ellipse((1530, 610, 1560, 640), fill=BLACK)
    card(d, (1430, 610, 1590, 735), fill=ORANGE, accent=False)
    return scene


def draw_stack(d, count, x=1230, bottom=820):
    for index in range(count):
        y = bottom - (index + 1) * 105
        outlined_rect(d, (x, y, x + 260, y + 92), fill=ORANGE if index % 2 == 0 else YELLOW, radius=12, width=12)


def reduce_before(role):
    scene = base(role)
    d = ImageDraw.Draw(scene)
    draw_stack(d, 4)
    outlined_rect(d, (1170, 830, 1570, 905), fill="white", radius=10, width=12)
    return scene


def reduce_change(role):
    scene = base(role)
    d = ImageDraw.Draw(scene)
    draw_stack(d, 2, bottom=820)
    outlined_rect(d, (1170, 830, 1570, 905), fill="white", radius=10, width=12)
    outlined_line(d, [(1030, 760), (1150, 760)], width=20)
    return scene


def reduce_result(role):
    scene = base(role)
    d = ImageDraw.Draw(scene)
    draw_stack(d, 1, bottom=820)
    outlined_rect(d, (1170, 830, 1570, 905), fill="white", radius=10, width=12)
    flag(d, 1660, 610, color=ORANGE)
    return scene


def produce_before(role):
    scene = base(role)
    d = ImageDraw.Draw(scene)
    outlined_rect(d, (1150, 570, 1640, 830), fill="white", radius=24, width=14)
    d.line((1200, 600, 1590, 600), fill=BLACK, width=14)
    return scene


def produce_change(role):
    scene = base(role)
    d = ImageDraw.Draw(scene)
    outlined_rect(d, (1150, 570, 1640, 830), fill="white", radius=24, width=14)
    d.line((1200, 600, 1590, 600), fill=BLACK, width=14)
    outlined_rect(d, (1260, 430, 1430, 600), fill=ORANGE, radius=12, width=12)
    return scene


def produce_result(role):
    scene = base(role)
    d = ImageDraw.Draw(scene)
    outlined_rect(d, (1150, 570, 1640, 830), fill="white", radius=24, width=14)
    d.line((1200, 600, 1590, 600), fill=BLACK, width=14)
    outlined_rect(d, (1260, 430, 1430, 600), fill=ORANGE, radius=12, width=12)
    outlined_rect(d, (1460, 430, 1630, 600), fill=YELLOW, radius=12, width=12)
    outlined_rect(d, (1360, 650, 1530, 820), fill=BLUE, radius=12, width=12)
    return scene


def introduce_before(role):
    scene = base(role)
    d = ImageDraw.Draw(scene)
    group_circle(d, (1350, 345, 1710, 705), fill=YELLOW)
    card(d, (1040, 505, 1210, 640), fill="white")
    return scene


def introduce_change(role):
    scene = base(role)
    d = ImageDraw.Draw(scene)
    group_circle(d, (1350, 345, 1710, 705), fill=YELLOW)
    card(d, (1280, 505, 1450, 640), fill="white")
    outlined_line(d, [(1150, 570), (1250, 570)], width=20)
    return scene


def introduce_result(role):
    scene = base(role)
    d = ImageDraw.Draw(scene)
    group_circle(d, (1350, 345, 1710, 705), fill=YELLOW)
    card(d, (1445, 505, 1615, 640), fill=ORANGE)
    return scene


def deduce_before(role):
    scene = base(role)
    d = ImageDraw.Draw(scene)
    card(d, (980, 350, 1230, 505))
    card(d, (1350, 350, 1600, 505))
    card(d, (1150, 700, 1400, 855))
    return scene


def deduce_change(role):
    scene = base(role)
    d = ImageDraw.Draw(scene)
    card(d, (1040, 350, 1290, 505))
    card(d, (1040, 560, 1290, 715))
    card(d, (1040, 770, 1290, 925))
    outlined_line(d, [(1330, 430), (1450, 430), (1450, 640), (1330, 640)], width=18)
    return scene


def deduce_result(role):
    scene = base(role)
    d = ImageDraw.Draw(scene)
    card(d, (1120, 480, 1500, 735), fill=YELLOW)
    flag(d, 1580, 455)
    return scene


POSES = {
    "conduct": (conduct_before, conduct_change, conduct_result),
    "induce": (induce_before, induce_change, induce_result),
    "reduce": (reduce_before, reduce_change, reduce_result),
    "produce": (produce_before, produce_change, produce_result),
    "introduce": (introduce_before, introduce_change, introduce_result),
    "deduce": (deduce_before, deduce_change, deduce_result),
}


def write_image(image, path):
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path)


def make_contact_sheet(images):
    thumb_w, thumb_h = 520, 293
    sheet = Image.new("RGB", (thumb_w * 3, (thumb_h + 42) * len(images)), "white")
    draw = ImageDraw.Draw(sheet)
    for row, (name, states) in enumerate(images.items()):
        for col, state in enumerate(states):
            img = Image.new("RGBA", state.size, "white")
            img.alpha_composite(state)
            img = ImageOps.contain(img.convert("RGB"), (thumb_w, thumb_h))
            x = col * thumb_w
            y = row * (thumb_h + 42)
            sheet.paste(img, (x, y))
            draw.text((x + 12, y + thumb_h + 8), f"{name} · {col + 1}", fill=BLACK)
    return sheet


def main():
    PUBLIC_OUT.mkdir(parents=True, exist_ok=True)
    ARCHIVE_OUT.mkdir(parents=True, exist_ok=True)
    REVIEW_OUT.mkdir(parents=True, exist_ok=True)
    role = accepted_role()
    rendered = {}
    for word, builders in POSES.items():
        rendered[word] = []
        for index, builder in enumerate(builders, start=1):
            image = builder(role)
            rendered[word].append(image)
            filename = f"{word}-{['before', 'change', 'result'][index - 1]}.png"
            write_image(image, PUBLIC_OUT / filename)
            write_image(image, ARCHIVE_OUT / filename)
            preview = Image.new("RGBA", image.size, "white")
            preview.alpha_composite(image)
            preview.convert("RGB").save(REVIEW_OUT / filename.replace(".png", ".jpg"), quality=95)
    make_contact_sheet(rendered).save(REVIEW_OUT / "contact-sheet.jpg", quality=95)
    role.save(REVIEW_OUT / "accepted-xiaohei-role-master.png")
    qa = []
    for path in sorted(PUBLIC_OUT.glob("*.png")):
        image = Image.open(path).convert("RGBA")
        alpha = image.getchannel("A")
        pixels = list(alpha.getdata())
        visible = sum(value > 8 for value in pixels) / len(pixels)
        corners = [alpha.getpixel(point) for point in [(0, 0), (W - 1, 0), (0, H - 1), (W - 1, H - 1)]]
        if image.size != (W, H) or max(corners) > 8 or not 0.015 <= visible <= 0.65:
            raise RuntimeError(f"keypose QA failed: {path.name}, size={image.size}, corners={corners}, coverage={visible:.4f}")
        qa.append({"file": path.name, "size": list(image.size), "mode": image.mode, "cornerAlpha": corners, "visibleCoverage": round(visible, 6), "status": "passed"})
    (REVIEW_OUT / "keypose-qa.json").write_text(json.dumps({"source": str(ROOT / "public/assets/replica/mit-miss/00_send_hook.png"), "count": len(qa), "assets": qa}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
