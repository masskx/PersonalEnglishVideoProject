from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[3]
REFERENCE = ROOT / "public/assets/replica/mit-miss/00_send_hook.png"
PUBLIC_OUT = ROOT / "public/assets/replica/duc-duct"
ARCHIVE_OUT = ROOT / "assets/replica/duc-duct"
ROLE_REVIEW = ROOT / "work/duc-duct-role-review"
W, H = 2048, 1152

BLACK = "#111111"
ORANGE = "#F47B20"
RED = "#EF3C3C"
BLUE = "#B8E9E8"
YELLOW = "#FFC928"


def accepted_role() -> Image.Image:
    source = Image.open(REFERENCE).convert("RGBA")
    # The accepted source places Xiaohei on the left and the unrelated prop on
    # the right. Crop only the character side, retaining its original pixels.
    role = source.crop((550, 150, 1500, 1450))
    bbox = role.getchannel("A").getbbox()
    if not bbox:
        raise RuntimeError("accepted Xiaohei reference has no visible alpha")
    role = role.crop(bbox)
    target_h = 820
    target_w = round(role.width * target_h / role.height)
    return role.resize((target_w, target_h), Image.Resampling.LANCZOS)


def canvas() -> Image.Image:
    return Image.new("RGBA", (W, H), (255, 255, 255, 0))


def outlined_line(draw: ImageDraw.ImageDraw, points, width=80, fill=ORANGE):
    draw.line(points, fill=BLACK, width=width + 20, joint="curve")
    draw.line(points, fill=fill, width=width, joint="curve")


def outlined_rect(draw: ImageDraw.ImageDraw, box, fill=ORANGE, radius=18, width=16):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=BLACK, width=width)


def role_on(scene: Image.Image, role: Image.Image, x=235, y=180):
    scene.alpha_composite(role, (x, y))


def draw_flag(draw: ImageDraw.ImageDraw, x, y):
    draw.line((x, y, x, y + 190), fill=BLACK, width=14)
    draw.ellipse((x - 11, y - 11, x + 11, y + 11), fill=BLACK)
    draw.polygon([(x, y + 12), (x + 170, y + 40), (x + 170, y + 125), (x, y + 105)], fill=RED, outline=BLACK)


def draw_hook(scene, role):
    d = ImageDraw.Draw(scene)
    outlined_line(d, [(620, 735), (930, 700), (1230, 660), (1490, 480), (1690, 390)], width=78)
    draw_flag(d, 1680, 270)
    role_on(scene, role)


def draw_conduct(scene, role):
    d = ImageDraw.Draw(scene)
    paths = [((860, 430), (1170, 520), (1530, 650)), ((860, 700), (1190, 680), (1530, 650)), ((860, 950), (1170, 820), (1530, 650))]
    for points in paths:
        outlined_line(d, points, width=48)
        for px, py in (points[0],):
            d.ellipse((px - 36, py - 36, px + 36, py + 36), fill="white", outline=BLACK, width=12)
    draw_flag(d, 1600, 470)
    role_on(scene, role)


def draw_induce(scene, role):
    d = ImageDraw.Draw(scene)
    outlined_rect(d, (1120, 285, 1655, 905), fill="white", radius=10, width=18)
    outlined_rect(d, (1170, 335, 1605, 905), fill=ORANGE, radius=8, width=14)
    d.rectangle((1270, 440, 1605, 905), fill="white", outline=BLACK, width=12)
    d.ellipse((1520, 650, 1550, 680), fill=BLACK)
    outlined_line(d, [(850, 720), (1050, 720), (1250, 720)], width=36)
    role_on(scene, role)


def draw_reduce(scene, role):
    d = ImageDraw.Draw(scene)
    for y in (410, 525, 640, 755):
        outlined_rect(d, (1250, y, 1570, y + 105), fill=ORANGE, radius=16, width=14)
    d.line((1200, 600, 1530, 600), fill=BLACK, width=30)
    d.line((1210, 600, 1430, 600), fill=ORANGE, width=16)
    draw_flag(d, 1730, 505)
    role_on(scene, role)


def draw_produce(scene, role):
    d = ImageDraw.Draw(scene)
    d.polygon([(1120, 540), (1740, 540), (1690, 875), (1190, 875)], fill=ORANGE, outline=BLACK)
    d.line((1160, 560, 1710, 560), fill=BLACK, width=16)
    d.line((1210, 520, 1150, 860), fill=BLACK, width=16)
    for cx in (1270, 1630):
        d.ellipse((cx - 78, 820, cx + 78, 976), fill=ORANGE, outline=BLACK, width=16)
        d.ellipse((cx - 20, 878, cx + 20, 918), fill=BLACK)
    d.ellipse((1290, 420, 1450, 580), fill=YELLOW, outline=BLACK, width=14)
    d.polygon([(1460, 555), (1565, 390), (1670, 555)], fill=RED, outline=BLACK)
    role_on(scene, role)


def draw_introduce(scene, role):
    d = ImageDraw.Draw(scene)
    d.ellipse((1200, 300, 1640, 740), fill=YELLOW, outline=BLACK, width=16)
    for a, b in [((1210, 520), (1030, 520)), ((1415, 305), (1415, 170)), ((1630, 520), (1780, 520))]:
        d.line((a, b), fill=ORANGE, width=34)
    outlined_rect(d, (1360, 680, 1605, 880), fill="white", radius=12, width=14)
    d.line((1395, 735, 1570, 735), fill=BLACK, width=10)
    d.line((1395, 790, 1535, 790), fill=ORANGE, width=10)
    role_on(scene, role)


def draw_deduce(scene, role):
    d = ImageDraw.Draw(scene)
    cards = [(1080, 300, 1350, 480), (1200, 490, 1470, 670), (1060, 715, 1330, 895)]
    for box in cards:
        outlined_rect(d, box, fill="white", radius=12, width=14)
        x1, y1, x2, y2 = box
        d.line((x1 + 45, y1 + 65, x2 - 45, y1 + 65), fill=ORANGE, width=12)
        d.line((x1 + 45, y1 + 115, x2 - 90, y1 + 115), fill=BLACK, width=10)
    outlined_line(d, [(1420, 400), (1540, 600), (1420, 805), (1710, 600)], width=34)
    draw_flag(d, 1710, 405)
    role_on(scene, role)


BUILDERS = {
    "00_lead_hook.png": draw_hook,
    "01_conduct_together.png": draw_conduct,
    "02_induce_in.png": draw_induce,
    "03_reduce_back.png": draw_reduce,
    "04_produce_forth.png": draw_produce,
    "05_introduce_inward.png": draw_introduce,
    "06_deduce_down.png": draw_deduce,
}


def main():
    PUBLIC_OUT.mkdir(parents=True, exist_ok=True)
    ARCHIVE_OUT.mkdir(parents=True, exist_ok=True)
    ROLE_REVIEW.mkdir(parents=True, exist_ok=True)
    role = accepted_role()
    for filename, builder in BUILDERS.items():
        scene = canvas()
        builder(scene, role)
        scene.save(PUBLIC_OUT / filename)
        scene.save(ARCHIVE_OUT / filename)
        preview = Image.new("RGBA", scene.size, "white")
        preview.alpha_composite(scene)
        preview.convert("RGB").save(ROLE_REVIEW / filename.replace(".png", "-role-locked-white.jpg"), quality=95)
    role.save(ROLE_REVIEW / "accepted-xiaohei-role-master.png")


if __name__ == "__main__":
    main()
