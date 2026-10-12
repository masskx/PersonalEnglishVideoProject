from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[2]
ASSETS = ROOT / "public" / "assets" / "replica" / "mit-miss"
OUT = Path(__file__).resolve().parent / "sources"

FILES = [
    "00_send_hook.png",
    "01_submit_send_up.png",
    "02_transmit_send_across.png",
    "03_emit_send_out.png",
    "04_admit_send_in.png",
    "05_permit_send_through.png",
    "06_commit_send_over.png",
    "07_dismiss_send_away.png",
    "08_mission_sent_task.png",
]


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for filename in FILES:
        source = Image.open(ASSETS / filename).convert("RGBA")
        plate = Image.new("RGBA", source.size, (255, 255, 255, 255))
        plate.alpha_composite(source)
        plate.convert("RGB").save(OUT / filename, optimize=True)


if __name__ == "__main__":
    main()
