from pathlib import Path
import subprocess, shutil, json, time

base=Path('work/experiments/mit-miss-smooth')
original=base/'mit-miss-smooth.mp4'
patched=base/'joined.mp4'
ffmpeg=shutil.which('ffmpeg'); ffprobe=shutil.which('ffprobe')
filters='[0:v]trim=start_frame=0:end_frame=270,setpts=PTS-STARTPTS[h];[1:v]setpts=PTS-STARTPTS[a];[0:v]trim=start_frame=606:end_frame=2862,setpts=PTS-STARTPTS[m];[2:v]setpts=PTS-STARTPTS[t];[h][a][m][t]concat=n=4:v=1:a=0[v]'
subprocess.run([ffmpeg,'-hide_banner','-loglevel','error','-y','-i',str(original),'-i',str(base/'map-fix.mp4'),'-i',str(base/'tail-fix.mp4'),'-filter_complex',filters,'-map','[v]','-map','0:a:0','-c:v','libx264','-crf','18','-preset','fast','-pix_fmt','yuv420p','-r','30','-fps_mode','cfr','-c:a','copy','-movflags','+faststart',str(patched)],check=True)
v=json.loads(subprocess.check_output([ffprobe,'-v','error','-count_frames','-select_streams','v:0','-show_entries','stream=nb_read_frames,width,height,r_frame_rate,avg_frame_rate','-of','json',str(patched)]))['streams'][0]
assert v['nb_read_frames']=='3663' and v['width']==1920 and v['height']==1080 and v['r_frame_rate']==v['avg_frame_rate']=='30/1'
def audio_hash(file):
    return subprocess.check_output([ffmpeg,'-v','error','-i',str(file),'-map','0:a:0','-c:a','copy','-f','hash','-hash','sha256','-']).decode().strip()
assert audio_hash(original)==audio_hash(patched)
history=base/'render-history';history.mkdir(exist_ok=True)
shutil.move(original,history/f'before-anchor-fix-{time.time_ns()}.mp4')
shutil.move(patched,original)
(base/'boundary-fix.json').write_text(json.dumps({'video':v,'audioPacketsUnchanged':True,'replacementFrameRanges':[[270,605],[2862,3662]],'reason':'Immediately readable non-word headings; persistent heading through text-only scene exits.'},indent=2),encoding='utf-8')
print('Joined fixed sections; 3663 frames and unchanged AAC packets.')
