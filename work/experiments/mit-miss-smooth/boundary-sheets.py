from pathlib import Path
from PIL import Image, ImageDraw
import json
base=Path('work/experiments/mit-miss-smooth')
index=json.loads((base/'review/frame-index.json').read_text(encoding='utf-8'))
scenes=json.loads((base/'props.json').read_text(encoding='utf-8'))['storyboard']['scenes']
for page in range(3):
    sheet=Image.new('RGB',(1920,4*382),'white');draw=ImageDraw.Draw(sheet)
    for row,scene in enumerate(scenes[page*4:page*4+4]):
        start=round(scene['start']*30)
        for col,delta in enumerate([-1,0,3]):
            f=max(0,start+delta);im=Image.open(index[str(f)]);im.thumbnail((640,360))
            x=col*640;y=row*382;draw.text((x+5,y+2),f'{scene["id"]} / frame {f}',fill='black');sheet.paste(im,(x,y+22))
    sheet.save(base/f'review/boundaries-{page+1}.jpg')
