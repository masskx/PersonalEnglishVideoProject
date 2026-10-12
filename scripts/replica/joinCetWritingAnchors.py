from pathlib import Path
import json, subprocess, shutil, time
base=Path('work/experiments/cet4-writing-paragraph')
patches=json.loads((base/'review/anchor-patches.json').read_text())
total=json.loads(Path('src/cet-writing/timeline.json').read_text(encoding='utf-8'))['totalFrames']
original=base/'cet4-writing-paragraph.mp4';fixed=base/'anchors.pending.mp4'
ffmpeg=shutil.which('ffmpeg');ffprobe=shutil.which('ffprobe')
cmd=[ffmpeg,'-v','error','-y','-i',str(original)]
for p in patches:cmd+=['-i',str(base/f'review/anchor-{p["from"]}.mp4')]
filters=[];labels=[];cursor=0
for i,p in enumerate(patches):
    label=f'o{i}';filters.append(f'[0:v]trim=start_frame={cursor}:end_frame={p["from"]},setpts=PTS-STARTPTS[{label}]');labels.append(f'[{label}]')
    label=f'p{i}';filters.append(f'[{i+1}:v]setpts=PTS-STARTPTS[{label}]');labels.append(f'[{label}]');cursor=p['from']+p['frames']
filters.append(f'[0:v]trim=start_frame={cursor}:end_frame={total},setpts=PTS-STARTPTS[last]');labels.append('[last]')
filters.append(''.join(labels)+f'concat=n={len(labels)}:v=1:a=0[v]')
cmd+=['-filter_complex',';'.join(filters),'-map','[v]','-map','0:a:0','-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-r','30','-fps_mode','cfr','-c:a','copy','-movflags','+faststart',str(fixed)]
subprocess.run(cmd,check=True)
v=json.loads(subprocess.check_output([ffprobe,'-v','error','-select_streams','v:0','-count_frames','-show_entries','stream=nb_read_frames','-of','json',str(fixed)]))['streams'][0];assert int(v['nb_read_frames'])==total
def digest(file):return subprocess.check_output([ffmpeg,'-v','error','-i',str(file),'-map','0:a:0','-c:a','copy','-f','hash','-hash','sha256','-']).decode().strip()
assert digest(original)==digest(fixed)
history=base/'render-history';history.mkdir(exist_ok=True);original.rename(history/f'before-heading-fix-{time.time_ns()}.mp4');fixed.rename(original)
(base/'heading-fix.json').write_text(json.dumps({'patches':patches,'audioPacketsUnchanged':True,'frames':total},indent=2),encoding='utf-8')
print('Patched first headings; original audio unchanged.')
