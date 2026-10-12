from pathlib import Path
import subprocess, shutil, json, time

base=Path('work/experiments/mit-miss-keyposes')
ffmpeg=shutil.which('ffmpeg'); ffprobe=shutil.which('ffprobe')
if not ffmpeg or not ffprobe: raise RuntimeError('Full ffmpeg / ffprobe required')
original=base/'mit-miss-keyposes.mp4'; patched=base/'boundary-fixed.mp4'
subprocess.run([ffmpeg,'-hide_banner','-loglevel','error','-y','-i',str(base/'head.mp4'),'-i',str(original),'-i',str(base/'tail.mp4'),'-filter_complex','[0:v]setpts=PTS-STARTPTS[h];[1:v]trim=start_frame=606:end_frame=2862,setpts=PTS-STARTPTS[m];[2:v]setpts=PTS-STARTPTS[t];[h][m][t]concat=n=3:v=1:a=0[v]','-map','[v]','-map','1:a:0','-c:v','libx264','-crf','18','-preset','fast','-pix_fmt','yuv420p','-r','30','-fps_mode','cfr','-c:a','copy','-movflags','+faststart',str(patched)],check=True)
metadata=json.loads(subprocess.check_output([ffprobe,'-v','error','-count_frames','-select_streams','v:0','-show_entries','stream=nb_read_frames,width,height,r_frame_rate,avg_frame_rate','-of','json',str(patched)]))
v=metadata['streams'][0]
assert v['nb_read_frames']=='3663' and v['width']==1920 and v['height']==1080 and v['r_frame_rate']==v['avg_frame_rate']=='30/1',metadata
def audio_hash(file):
 return subprocess.check_output([ffmpeg,'-v','error','-i',str(file),'-map','0:a:0','-c:a','copy','-f','hash','-hash','sha256','-']).decode().strip()
assert audio_hash(original)==audio_hash(patched),'Original audio packets changed'
history=base/'render-history'; history.mkdir(exist_ok=True)
shutil.move(original,history/f'before-boundary-fix-{time.time_ns()}.mp4')
shutil.move(patched,original)
(base/'boundary-fix.json').write_text(json.dumps({'video':v,'audioPacketsUnchanged':True,'replacementFrameRanges':[[0,605],[2862,3662]],'reason':'Hold non-word layers until scene end and make next heading visible on frame zero'},indent=2),encoding='utf-8')
print('Joined corrected boundaries: 3663 frames; original AAC packets unchanged.')
