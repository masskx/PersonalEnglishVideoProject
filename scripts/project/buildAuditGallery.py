"""Build small visual indexes from existing deliveries; never render or generate new art."""
from pathlib import Path
import io
import json
import subprocess
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'docs/project-audit'
FFMPEG = ROOT / 'node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe'
FONT = ImageFont.truetype('C:/Windows/Fonts/msyh.ttc', 20)
SMALL = ImageFont.truetype('C:/Windows/Fonts/msyh.ttc', 16)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    covers = sorted((ROOT / 'outputs').glob('*/cover.png'))
    sheet = Image.new('RGB', (5 * 238, ((len(covers) + 4) // 5) * 326 + 60), '#edf1f5')
    draw = ImageDraw.Draw(sheet)
    draw.text((16, 14), '现有系列封面 · 文件快照（不代表已验收或已发布）', font=FONT, fill='#182c51')
    for index, cover in enumerate(covers):
        x, y = (index % 5) * 238 + 10, (index // 5) * 326 + 58
        with Image.open(cover) as source:
            sheet.paste(ImageOps.contain(source.convert('RGB'), (216, 288)), (x, y))
        draw.text((x, y + 289), cover.parent.name, font=SMALL, fill='#182c51')
    sheet.save(OUT / 'covers-overview.jpg', quality=88)

    samples = [('press', [1.5, 22, 60, 130]), ('flect-flex发了', [1.5, 22, 50, 87]),
               ('rupt发了', [1.5, 23, 54, 92]), ('mit-miss', [1.5, 23, 54, 92])]
    frames = Image.new('RGB', (4 * 392, len(samples) * 264 + 56), '#edf1f5')
    d = ImageDraw.Draw(frames)
    d.text((12, 12), '当前 MP4 抽帧 · 开头与逐词章节抽样（非完整视听验收）', font=FONT, fill='#182c51')
    evidence = []
    for row, (folder, times) in enumerate(samples):
        slug = folder.removesuffix('发了')
        video = ROOT / 'outputs' / folder / f'{slug}.mp4'
        for col, timestamp in enumerate(times):
            result = subprocess.run([str(FFMPEG), '-v', 'error', '-ss', str(timestamp), '-i', str(video),
                                     '-frames:v', '1', '-vf', 'scale=384:216', '-f', 'image2pipe',
                                     '-c:v', 'png', '-'], capture_output=True, check=True,
                                    creationflags=subprocess.CREATE_NO_WINDOW)
            x, y = col * 392 + 4, row * 264 + 55
            with Image.open(io.BytesIO(result.stdout)) as frame:
                frames.paste(frame.convert('RGB'), (x, y))
            d.text((x, y + 221), f'{slug}  /  {timestamp}s', font=SMALL, fill='#182c51')
            evidence.append({'video': video.relative_to(ROOT).as_posix(), 'second': timestamp})
    frames.save(OUT / 'template-samples.jpg', quality=90)
    (OUT / 'visual-index.json').write_text(json.dumps({
        'covers': [p.relative_to(ROOT).as_posix() for p in covers], 'samples': evidence,
        'scope': 'Existing-file thumbnails and sampled decoded frames only; no full watch or audio review.'
    }, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'Indexed {len(covers)} covers and {len(evidence)} current-video frames in {OUT}')


if __name__ == '__main__':
    main()
