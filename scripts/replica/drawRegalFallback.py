from __future__ import annotations

import random
from pathlib import Path

from PIL import Image, ImageDraw


WIDTH, HEIGHT = 2848, 1600
INK = (10, 14, 20, 255)
BLUE = (195, 235, 248, 255)
BLUE_DARK = (4, 31, 160, 255)
ORANGE = (232, 88, 16, 255)
WHITE = (255, 255, 255, 255)


def wobble(points: list[tuple[int, int]], amount: int = 5, seed: int = 0) -> list[tuple[int, int]]:
    rng = random.Random(seed)
    return [(x + rng.randint(-amount, amount), y + rng.randint(-amount, amount)) for x, y in points]


def line(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]], width: int = 18, seed: int = 0) -> None:
    draw.line(wobble(points, 5, seed), fill=INK, width=width, joint='curve')
    draw.line(wobble(points, 2, seed + 101), fill=INK, width=max(4, width // 3), joint='curve')


def ellipse(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], fill, outline=INK, width: int = 18) -> None:
    draw.ellipse(box, fill=fill, outline=outline, width=width)


def main() -> None:
    image = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)

    body = [
        (460, 1050), (505, 850), (710, 775), (955, 520), (1740, 505),
        (2020, 770), (2295, 835), (2385, 1025), (2305, 1120), (520, 1120),
    ]
    draw.polygon(body, fill=BLUE)
    line(draw, body + [body[0]], 22, 7)

    # Cabin and windows: deliberately sparse, logo-free and slightly uneven.
    cabin = [(930, 770), (1060, 555), (1690, 548), (1920, 770)]
    draw.polygon(cabin, fill=WHITE)
    line(draw, cabin + [cabin[0]], 18, 12)
    line(draw, [(1390, 560), (1390, 772)], 16, 15)
    line(draw, [(1920, 770), (1975, 1050)], 14, 17)
    line(draw, [(680, 930), (2180, 930)], 10, 19)

    # Xiaohei is the active driver: flat black bean, white dot eyes, thin limbs.
    draw.ellipse((1100, 535, 1355, 805), fill=INK)
    draw.ellipse((1148, 630, 1395, 910), fill=INK)
    ellipse(draw, (1168, 625, 1200, 657), WHITE, WHITE, 1)
    ellipse(draw, (1233, 625, 1265, 657), WHITE, WHITE, 1)
    line(draw, [(1225, 780), (1105, 850), (1015, 840)], 24, 23)
    line(draw, [(1250, 790), (1320, 850), (1410, 845)], 24, 29)
    ellipse(draw, (955, 785, 1090, 920), (0, 0, 0, 0), INK, 18)

    # Two complete wheels, with imperfect concentric ink rings.
    for center_x, seed in ((820, 31), (1990, 41)):
        ellipse(draw, (center_x - 175, 955, center_x + 175, 1305), INK, INK, 12)
        ellipse(draw, (center_x - 112, 1018, center_x + 112, 1242), WHITE, INK, 18)
        ellipse(draw, (center_x - 42, 1088, center_x + 42, 1172), BLUE_DARK, INK, 10)
        line(draw, [(center_x - 82, 1130), (center_x + 82, 1130)], 9, seed)
        line(draw, [(center_x, 1048), (center_x, 1212)], 9, seed + 1)

    # Restrained lights and motion ticks; no badge, grille pattern, plate, or text.
    draw.rounded_rectangle((490, 890, 555, 985), radius=18, fill=ORANGE, outline=INK, width=10)
    draw.rounded_rectangle((2260, 900, 2328, 994), radius=18, fill=ORANGE, outline=INK, width=10)
    line(draw, [(640, 820), (805, 790)], 10, 51)
    line(draw, [(2160, 790), (2240, 820)], 10, 57)
    line(draw, [(405, 905), (330, 875)], 12, 61)
    line(draw, [(410, 965), (300, 965)], 12, 63)

    output = Path(__file__).resolve().parents[2] / 'public' / 'assets' / 'replica' / 'reg' / '08_buick_regal.png'
    output.parent.mkdir(parents=True, exist_ok=True)
    image.save(output, 'PNG', optimize=True)


if __name__ == '__main__':
    main()
