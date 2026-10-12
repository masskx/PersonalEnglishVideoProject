from pathlib import Path
from PIL import Image
import json, shutil

base=Path('outputs/cet4-writing-paragraph-v2')
(base/'review').mkdir(parents=True,exist_ok=True)
asset=Path('public/assets/cet-writing/writer.png');asset.parent.mkdir(parents=True,exist_ok=True)
im=Image.open('public/assets/replica/script-scrib/00_write_hook.png').convert('RGBA')
im.thumbnail((1600,1000),Image.Resampling.LANCZOS);im.save(asset)
timeline=json.loads(Path('src/cet-writing/timeline.json').read_text(encoding='utf-8'))
paths=['assets/cet-writing/writer.png','assets/music/root-word-series-bgm.mp3']+[cue['src'] for cue in timeline['cues']]
for rel in paths:
    dest=base/'public'/rel;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(Path('public')/rel,dest)
(base/'asset-manifest.json').write_text(json.dumps({'writerSource':'public/assets/replica/script-scrib/00_write_hook.png','newImageGeneration':False,'assets':paths},indent=2),encoding='utf-8')
print(f'Prepared {len(paths)} assets; {timeline["totalFrames"]} frames / {timeline["totalFrames"]/30:.2f}s')
