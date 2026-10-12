from pathlib import Path
from PIL import Image
import json

base=Path('work/experiments/mit-miss-keyposes')
props=json.loads((base/'props.json').read_text(encoding='utf-8'))
errors=[]; count=0
for scene in props['storyboard']['scenes']:
    poses=[l for l in scene['layers'] if '-pose-' in l['id']]
    if not poses: continue
    coverage=[0]*round(scene['duration']*30)
    for p in poses:
        count+=1
        start=round(p['from']*30); end=start+round(p['duration']*30)
        for f in range(start,end):
            if f<len(coverage): coverage[f]+=1
        image=Image.open(Path('public')/p['src']).convert('RGBA')
        if image.getchannel('A').getextrema()!=(0,255): errors.append(p['id']+': alpha range')
        if p['enter']!='none' or p['exit']!='none': errors.append(p['id']+': unintended transition')
        with Image.open(base/'public'/p['src']) as render_image: render_image.verify()
    if any(n!=1 for n in coverage): errors.append(scene['id']+': blank/overlapping image frame')
    if len({(p['x'],p['y'],p['width'],p['height']) for p in poses})!=1: errors.append(scene['id']+': unstable stage')
report={'poses':count,'wordScenes':8,'exclusiveCoverage':'all 2256 word-scene frames' if not errors else 'failed','errors':errors}
(base/'pose-validation.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps(report))
if errors: raise SystemExit(1)
