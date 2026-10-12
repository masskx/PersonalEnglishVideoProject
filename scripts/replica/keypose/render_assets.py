from pathlib import Path
import json, shutil
from PIL import Image

base=Path('work/experiments/mit-miss-keyposes')
props=json.loads((base/'props.json').read_text(encoding='utf-8'))
paths={props['backgroundMusic']['src']}
paths.update(a['src'] for a in props['audioManifest'].values())
paths.update(l['src'] for s in props['storyboard']['scenes'] for l in s['layers'] if l['kind']=='image')
for rel in paths:
    src=Path('public')/rel
    if not src.exists(): continue
    dst=base/'public'/rel
    dst.parent.mkdir(parents=True,exist_ok=True)
    if src.suffix=='.png':
        im=Image.open(src); im.thumbnail((1600,900)); im.save(dst)
    else: shutil.copy2(src,dst)
print(f'Prepared isolated render public directory: {len(paths)} referenced assets')
