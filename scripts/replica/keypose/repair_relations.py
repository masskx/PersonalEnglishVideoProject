"""Keep an accepted raster actor; compose discrete gate states without motion interpolation."""
from pathlib import Path
from PIL import Image, ImageDraw
import shutil

base=Path('work/experiments/mit-miss-keyposes')
out=Path('public/assets/replica/mit-miss-keyposes')
source=next((base/'rejected').glob('*-admit-1.png'))
im=Image.open(source).convert('RGBA')
w,h=im.size
actor=im.crop((int(w*.127),int(h*.344),int(w*.297),int(h*.922)))
actor.thumbnail((190,340))
# Preserve the already generated identity; door/gate geometry is fixed across all poses.
for word in ['admit','permit','dismiss','mission']:
 for i in range(3):
  canvas=Image.new('RGBA',(1600,900),(0,0,0,0)); d=ImageDraw.Draw(canvas)
  def line(points,fill='#191919',width=6): d.line(points,fill=fill,width=width,joint='curve')
  x=[300,660,965][i]; y=395
  if word=='admit':
   line([(742,744),(738,238),(992,241),(990,744)])
   if i==0:
    d.polygon([(748,247),(981,249),(981,743),(748,740)],fill='white',outline='#191919',width=5)
    d.ellipse((935,477,951,493),fill='#E85810')
   else:
    d.polygon([(990,246),(1080,294),(1076,791),(991,742)],fill='white',outline='#191919',width=5)
    d.ellipse((1047,508,1059,522),fill='#E85810')
   canvas.alpha_composite(actor,(1180,y))
   canvas.alpha_composite(actor,(x,y))
  elif word=='permit':
   canvas.alpha_composite(actor,(1180,y))
   # The gatekeeper stands beside the hinge; the visitor presents the same orange pass.
   line([(1009,496),(1012,739),(1068,739),(1071,496),(1009,496)])
   if i==0: line([(1040,490),(587,490)],fill='#E85810',width=15)
   else: line([(1040,490),(1040,247)],fill='#E85810',width=15)
   canvas.alpha_composite(actor,(x,y))
   d=ImageDraw.Draw(canvas)
   d.rectangle((x+actor.width-12,y+190,x+actor.width+32,y+242),fill='#E85810',outline='#191919',width=3)
  elif word=='dismiss':
   line([(1090,740),(1092,280),(1220,283),(1218,740)])
   canvas.alpha_composite(actor,(260,y))
   small=actor.copy(); small.thumbnail((145,270))
   positions=[(600,790),(900,1070),(1220,1400)][i]
   for px in positions: canvas.alpha_composite(small,(px,465))
   if i==1:
    line([(510,367),(970,367)],fill='#E85810',width=7)
    line([(944,350),(973,367),(944,384)],fill='#E85810',width=7)
  else:
   line([(1310,740),(1310,245)])
   d.polygon([(1310,247),(1415,277),(1310,307)],fill='#E85810')
   canvas.alpha_composite(actor,(270,y))
   px=[575,880,1190][i]
   canvas.alpha_composite(actor,(px,y))
   d=ImageDraw.Draw(canvas)
   bx=px+actor.width-10; by=y+185
   d.rectangle((bx,by,bx+65,by+47),fill='#E85810',outline='#191919',width=3)
   d.line([(bx,by),(bx+33,by+27),(bx+65,by)],fill='#191919',width=3)
  target=out/f'{word}-{i+1}.png'
  backup=base/'rejected'/f'model-relation-{word}-{i+1}.png'
  if not backup.exists(): shutil.copy2(target,backup)
  canvas.save(target)
(base/'relation-repair.txt').write_text('admit / permit / dismiss / mission: rejected generated triplets changed actor counts or failed the spatial relationship. Reused the accepted first-pass raster actor and composited three discrete, fixed-camera states with code-drawn door/barrier/direction/flag. No interpolation, image floating or Wan. Source: '+str(source),encoding='utf-8')
print('Rebuilt four chapters as stable discrete relationship states.')
