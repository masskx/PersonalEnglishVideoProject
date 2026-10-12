from __future__ import annotations

"""Create the ten/tain episode's clean mit/miss-style keypose cutouts.

The accepted mit/miss episode uses sparse, hand-drawn-looking objects, one clear
black Xiaohei action, and no baked text.  This script keeps that grammar stable
when an image provider is unavailable or returns a layout board instead of an
isolated pose.
"""

from pathlib import Path
from PIL import Image, ImageDraw
import math

W, H = 2048, 1152
ALPHA_DIR = Path("public/assets/replica/ten-tain-v3")
GREEN_DIR = Path("assets/green-screen/ten-tain-v3")
ALPHA_DIR.mkdir(parents=True, exist_ok=True)
GREEN_DIR.mkdir(parents=True, exist_ok=True)

BLACK = (9, 9, 9, 255)
ORANGE = (242, 105, 25, 255)
CYAN = (44, 184, 218, 255)
BLUE = (41, 105, 203, 255)
GRAY = (110, 112, 112, 255)
LIGHT = (232, 232, 228, 255)


def line(d, pts, fill=BLACK, width=10):
    d.line(pts, fill=fill, width=width, joint="curve")


def bean(d, x, y, s=1.0, pose="stand", flip=False):
    """A plain mit/miss-style Xiaohei cutout."""
    if flip:
        x = W - x
    bw, bh = int(180 * s), int(270 * s)
    body = (x - bw // 2, y - bh, x + bw // 2, y)
    d.rounded_rectangle(body, radius=int(76 * s), fill=BLACK)
    # tiny white dot eyes, deliberately high and quiet
    ey = y - int(218 * s)
    d.ellipse((x - int(42 * s), ey, x - int(18 * s), ey + int(24 * s)), fill="white")
    d.ellipse((x + int(18 * s), ey, x + int(42 * s), ey + int(24 * s)), fill="white")
    leg_y = y - int(8 * s)
    if pose in {"walk", "push", "reach", "away"}:
        line(d, [(x - int(30*s), leg_y), (x - int(72*s), y + int(70*s))], width=max(5, int(9*s)))
        line(d, [(x + int(28*s), leg_y), (x + int(76*s), y + int(54*s))], width=max(5, int(9*s)))
    else:
        line(d, [(x - int(30*s), leg_y), (x - int(36*s), y + int(70*s))], width=max(5, int(9*s)))
        line(d, [(x + int(30*s), leg_y), (x + int(36*s), y + int(70*s))], width=max(5, int(9*s)))
    arm_y = y - int(145*s)
    if pose == "reach":
        line(d, [(x + int(48*s), arm_y), (x + int(170*s), arm_y - int(8*s))], width=max(5, int(9*s)))
        line(d, [(x + int(48*s), arm_y + int(16*s)), (x + int(145*s), arm_y + int(62*s))], width=max(5, int(9*s)))
    elif pose == "push":
        line(d, [(x - int(55*s), arm_y), (x - int(150*s), arm_y - int(15*s))], width=max(5, int(9*s)))
        line(d, [(x + int(55*s), arm_y + int(18*s)), (x + int(150*s), arm_y + int(30*s))], width=max(5, int(9*s)))
    elif pose == "hold":
        line(d, [(x - int(52*s), arm_y), (x - int(120*s), arm_y - int(20*s))], width=max(5, int(9*s)))
        line(d, [(x + int(52*s), arm_y), (x + int(120*s), arm_y - int(20*s))], width=max(5, int(9*s)))
    elif pose == "away":
        line(d, [(x - int(48*s), arm_y), (x - int(125*s), arm_y + int(45*s))], width=max(5, int(9*s)))
        line(d, [(x + int(48*s), arm_y), (x + int(118*s), arm_y - int(25*s))], width=max(5, int(9*s)))
    else:
        line(d, [(x - int(52*s), arm_y), (x - int(112*s), arm_y + int(22*s))], width=max(5, int(9*s)))
        line(d, [(x + int(52*s), arm_y), (x + int(112*s), arm_y + int(22*s))], width=max(5, int(9*s)))


def rounded_box(d, box, fill, outline=BLACK, width=10, radius=24):
    d.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def token(d, x, y, r=42, fill=ORANGE):
    d.ellipse((x-r, y-r, x+r, y+r), fill=fill, outline=BLACK, width=8)


def tower(d, x, y, upright=True):
    if upright:
        d.rectangle((x-55, y-300, x+55, y), fill=ORANGE, outline=BLACK, width=8)
        d.rectangle((x-90, y-20, x+90, y+20), fill=GRAY, outline=BLACK, width=8)
        line(d, [(x-40,y-285),(x+40,y-15)], fill=LIGHT, width=8)
    else:
        pts=[(x-210,y-100),(x+130,y+20),(x+90,y+85),(x-250,y-35)]
        d.polygon(pts, fill=ORANGE, outline=BLACK)
        line(d, [(x-190,y-70),(x+100,y+35)], fill=LIGHT, width=8)


def scene(name, stage):
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    stage(d)
    # The Remotion word layout reserves a large 16:9 art cell.  Tighten the
    # transparent subject into that cell so the phone-size result has the same
    # visual weight as the accepted mit/miss cutouts.
    bbox = im.getbbox()
    if bbox:
        bw, bh = bbox[2] - bbox[0], bbox[3] - bbox[1]
        factor = min(2.25, 1250 / max(1, bw), 900 / max(1, bh))
        if factor > 1.01:
            crop = im.crop(bbox)
            crop = crop.resize((round(bw * factor), round(bh * factor)), Image.Resampling.LANCZOS)
            enlarged = Image.new("RGBA", (W, H), (0, 0, 0, 0))
            enlarged.paste(crop, ((W - crop.width) // 2, (H - crop.height) // 2), crop)
            im = enlarged
    im.save(ALPHA_DIR / f"{name}.png")
    bg = Image.new("RGB", (W, H), (0, 255, 0))
    bg.paste(im, mask=im.getchannel("A"))
    bg.save(GREEN_DIR / f"{name}.jpg", quality=96, subsampling=0)


def retain_before(d):
    bean(d, 760, 760, 1.05)
    rounded_box(d, (930, 480, 1310, 800), (255,255,255,255), width=10)
    line(d, [(960,560),(1280,560)], fill=ORANGE, width=14)
    token(d, 1080, 410, 34, ORANGE)

def retain_change(d):
    bean(d, 760, 760, 1.05, "reach")
    rounded_box(d, (940, 500, 1320, 800), (255,255,255,255), width=10)
    line(d, [(970,575),(1290,575)], fill=ORANGE, width=14)
    token(d, 1110, 565, 34, ORANGE)

def retain_result(d):
    bean(d, 920, 790, 1.05, "hold")
    rounded_box(d, (1100, 610, 1410, 820), ORANGE, outline=BLACK, width=10)
    line(d, [(1135,660),(1375,660)], fill=LIGHT, width=10)

def contain_before(d):
    bean(d, 730, 780, 1.0, "reach")
    rounded_box(d, (940, 590, 1360, 820), (255,255,255,255), width=10)
    for x,y in [(1010,520),(1120,500),(1230,530)]: rounded_box(d,(x-45,y-45,x+45,y+45),BLUE,width=8)

def contain_change(d):
    bean(d, 720, 780, 1.0, "reach")
    rounded_box(d, (960, 600, 1370, 820), (255,255,255,255), width=10)
    for x,y in [(1040,650),(1140,640),(1240,650)]: rounded_box(d,(x-45,y-45,x+45,y+45),BLUE,width=8)

def contain_result(d):
    bean(d, 820, 790, 1.0, "hold")
    rounded_box(d, (1010, 610, 1400, 830), ORANGE, width=10)
    for x in [1090,1190,1290]: rounded_box(d,(x-35,565,x+35,645),BLUE,width=8)

def maintain_before(d):
    bean(d, 690, 790, 1.0, "push")
    tower(d, 1080, 800, upright=False)

def maintain_change(d):
    bean(d, 700, 790, 1.0, "push")
    tower(d, 1110, 800, upright=True)
    rounded_box(d, (940, 720, 1060, 810), BLUE, width=8)

def maintain_result(d):
    bean(d, 1070, 790, 1.0, "hold")
    tower(d, 1110, 800, upright=True)

def obtain_before(d):
    bean(d, 720, 790, 1.0, "reach")
    token(d, 1190, 600, 62, ORANGE)
    d.rectangle((1100, 790, 1280, 825), fill=GRAY, outline=BLACK, width=8)

def obtain_change(d):
    bean(d, 820, 790, 1.0, "reach")
    token(d, 1030, 620, 62, ORANGE)
    d.rectangle((940, 790, 1120, 825), fill=GRAY, outline=BLACK, width=8)

def obtain_result(d):
    bean(d, 1080, 790, 1.0, "hold")
    token(d, 1205, 635, 60, ORANGE)

def detain_before(d):
    bean(d, 720, 790, 1.0, "walk")
    line(d, [(1000,500),(1000,820)], fill=ORANGE, width=20)
    line(d, [(1000,520),(1420,520)], fill=ORANGE, width=20)

def detain_change(d):
    bean(d, 920, 790, 1.0, "push")
    line(d, [(1000,620),(1000,820)], fill=ORANGE, width=20)
    line(d, [(1000,620),(1420,620)], fill=ORANGE, width=20)

def detain_result(d):
    bean(d, 1170, 790, 1.0, "stand")
    line(d, [(930,500),(930,820)], fill=ORANGE, width=20)
    line(d, [(930,500),(1400,500)], fill=ORANGE, width=20)
    token(d, 1060, 700, 34, ORANGE)

def sustain_before(d):
    bean(d, 800, 790, 1.0, "hold")
    line(d, [(560,600),(1340,600)], fill=ORANGE, width=24)
    rounded_box(d,(540,620,700,760),BLUE,width=8); rounded_box(d,(1260,620,1420,760),BLUE,width=8)

def sustain_change(d):
    bean(d, 960, 790, 1.0, "hold")
    line(d, [(580,520),(1400,520)], fill=ORANGE, width=24)
    rounded_box(d,(560,540,720,700),BLUE,width=8); rounded_box(d,(1260,540,1420,700),BLUE,width=8)

def sustain_result(d):
    bean(d, 1080, 790, 1.0, "hold")
    line(d, [(580,480),(1400,480)], fill=ORANGE, width=24)
    for x in [600,760,1240,1400]: rounded_box(d,(x-55,500,x+55,700),BLUE,width=8)

def entertain_before(d):
    bean(d, 880, 790, 1.0, "stand")
    d.arc((640,400,1220,930),180,360,fill=CYAN,width=28)
    token(d, 1010, 540, 42, ORANGE)

def entertain_change(d):
    bean(d, 960, 790, 1.0, "reach")
    d.arc((650,410,1230,930),180,360,fill=CYAN,width=28)
    token(d, 1110, 490, 42, ORANGE)

def entertain_result(d):
    bean(d, 1080, 790, 1.0, "hold")
    d.arc((650,410,1230,930),180,360,fill=CYAN,width=28)
    token(d, 1180, 640, 42, ORANGE)

def abstain_before(d):
    bean(d, 770, 790, 1.0, "stand")
    d.ellipse((1030,650,1230,780), fill=ORANGE, outline=BLACK, width=8)
    line(d, [(1070,700),(1190,700)], fill=LIGHT, width=12)

def abstain_change(d):
    bean(d, 800, 790, 1.0, "push")
    d.ellipse((1100,700,1300,830), fill=ORANGE, outline=BLACK, width=8)
    line(d, [(1140,750),(1260,750)], fill=LIGHT, width=12)

def abstain_result(d):
    bean(d, 1140, 790, 1.0, "away")
    d.ellipse((760,760,960,890), fill=ORANGE, outline=BLACK, width=8)
    line(d, [(800,810),(920,810)], fill=LIGHT, width=12)


SCENES = {
    "retain-before": retain_before, "retain-change": retain_change, "retain-result": retain_result,
    "contain-before": contain_before, "contain-change": contain_change, "contain-result": contain_result,
    "maintain-before": maintain_before, "maintain-change": maintain_change, "maintain-result": maintain_result,
    "obtain-before": obtain_before, "obtain-change": obtain_change, "obtain-result": obtain_result,
    "detain-before": detain_before, "detain-change": detain_change, "detain-result": detain_result,
    "sustain-before": sustain_before, "sustain-change": sustain_change, "sustain-result": sustain_result,
    "entertain-before": entertain_before, "entertain-change": entertain_change, "entertain-result": entertain_result,
    "abstain-before": abstain_before, "abstain-change": abstain_change, "abstain-result": abstain_result,
}

for name, fn in SCENES.items():
    scene(name, fn)
print(f"wrote {len(SCENES)} alpha + green keyposes")
