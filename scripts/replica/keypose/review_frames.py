from pathlib import Path
from PIL import Image, ImageDraw
import json, subprocess, shutil, argparse

parser=argparse.ArgumentParser()
parser.add_argument('--base',default='work/experiments/mit-miss-keyposes')
parser.add_argument('--motion',action='store_true')
args=parser.parse_args()
base=Path(args.base); review=base/'review'; review.mkdir(exist_ok=True)
props=json.loads((base/'props.json').read_text(encoding='utf-8'))
ffmpeg=shutil.which('ffmpeg')
if not ffmpeg: raise RuntimeError('Full FFmpeg with the select filter is required; Remotion bundled FFmpeg lacks it.')
frames={0,3662}; words=[]
for scene in props['storyboard']['scenes']:
    start=round(scene['start']*30)
    if args.motion:
        for layer in scene['layers']:
            if layer['kind']=='text':
                for d in [5,10,18]:
                    f=start+round(layer['from']*30)+d
                    if f<round((scene['start']+scene['duration'])*30): frames.add(f)
    for d in [-3,-1,0,1,3]:
        if 0<=start+d<3663: frames.add(start+d)
    poses=[p for p in scene['layers'] if '-pose-' in p['id']]
    centers=[]
    for p in poses:
        cut=start+round(p['from']*30)
        for d in [-1,0,1]:
            if 0<=cut+d<3663: frames.add(cut+d)
        mid=cut+min(25,round(p['duration']*15)); frames.add(mid); centers.append(mid)
    if centers: words.append((scene['id'],centers))
frames=sorted(frames)
expr='+'.join(f'eq(n,{f})' for f in frames)
subprocess.run([str(ffmpeg),'-hide_banner','-loglevel','error','-y','-i',str(base/(base.name+'.mp4')),'-vf',f'select={expr.replace(",", chr(92)+",")}','-vsync','0','-q:v','2',str(review/'frame-%03d.jpg')],check=True)
index={f:review/f'frame-{i+1:03}.jpg' for i,f in enumerate(frames)}
def sheet(items,path,columns=3):
    width=640; height=382
    canvas=Image.new('RGB',(columns*width,((len(items)+columns-1)//columns)*height),'white'); draw=ImageDraw.Draw(canvas)
    for i,(label,p) in enumerate(items):
        im=Image.open(p).convert('RGB'); im.thumbnail((width,360))
        x=(i%columns)*width; y=(i//columns)*height
        draw.text((x+8,y+4),label,fill='black'); canvas.paste(im,(x,y+22))
    canvas.save(path)
for page in range(2):
    items=[(f'{word} / pose {i+1} / {f/30:.2f}s',index[f]) for word,poses in words[page*4:page*4+4] for i,f in enumerate(poses)]
    sheet(items,review/f'words-{page+1}.jpg')
for page in range((len(frames)+11)//12):
    subset=frames[page*12:page*12+12]
    sheet([(f'frame {f} / {f/30:.3f}s',index[f]) for f in subset],review/f'cuts-{page+1:02}.jpg',4)
compare=[poses[-1] for _,poses in words]
expr='+'.join(f'eq(n,{f})' for f in compare)
subprocess.run([str(ffmpeg),'-hide_banner','-loglevel','error','-y','-i','outputs/mit-miss/mit-miss.mp4','-vf',f'select={expr.replace(",", chr(92)+",")}','-vsync','0','-q:v','2',str(review/'original-%02d.jpg')],check=True)
for page in range(2):
    items=[]
    for i in range(page*4,page*4+4):
        items.extend([(words[i][0]+' / ORIGINAL',review/f'original-{i+1:02}.jpg'),(words[i][0]+' / KEY POSES',index[compare[i]])])
    sheet(items,review/f'comparison-{page+1}.jpg',2)
(review/'frame-index.json').write_text(json.dumps({str(f):str(p) for f,p in index.items()},indent=2),encoding='utf-8')
print(f'Extracted {len(frames)} encoded-video frames including every pose cut and scene boundary; two comparison sheets.')
