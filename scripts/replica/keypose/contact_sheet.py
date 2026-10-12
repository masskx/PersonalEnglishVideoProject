from pathlib import Path
from PIL import Image, ImageDraw

root=Path('public/assets/replica/mit-miss-keyposes')
words=['submit','transmit','emit','admit','permit','commit','dismiss','mission']
sheet=Image.new('RGB',(1440,8*295),'white')
draw=ImageDraw.Draw(sheet)
for row,word in enumerate(words):
    for i in range(3):
        p=root/f'{word}-{i+1}.png'
        if not p.exists(): continue
        im=Image.open(p).convert('RGBA'); im.thumbnail((470,260))
        sheet.paste(im,(480*i+(480-im.width)//2,row*295+25),im)
        draw.text((480*i+10,row*295+5),f'{word} / {i+1}',fill='black')
sheet.save('work/experiments/mit-miss-keyposes/pose-contact-sheet.jpg')
