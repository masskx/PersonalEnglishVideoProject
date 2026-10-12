from pathlib import Path
import shutil, subprocess, json, time
base=Path('outputs/cet4-writing-paragraph-v2')
video=base/'cet4-writing-paragraph.mp4';mixed=base/'mix.pending.mp4'
ffmpeg=shutil.which('ffmpeg');ffprobe=shutil.which('ffprobe')
subprocess.run([ffmpeg,'-v','error','-y','-i',str(video),'-i',str(base/'corrected-audio.wav'),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-ar','48000','-ac','2','-movflags','+faststart',str(mixed)],check=True)
v=json.loads(subprocess.check_output([ffprobe,'-v','error','-select_streams','v:0','-count_frames','-show_entries','stream=nb_read_frames','-of','json',str(mixed)]))['streams'][0]
expected=json.loads(Path('src/cet-writing/timeline.json').read_text(encoding='utf-8'))['totalFrames']
assert int(v['nb_read_frames'])==expected
def digest(file):return subprocess.check_output([ffmpeg,'-v','error','-i',str(file),'-map','0:v:0','-c:v','copy','-f','hash','-hash','sha256','-']).decode().strip()
assert digest(video)==digest(mixed)
history=base/'render-history';history.mkdir(exist_ok=True)
video.rename(history/f'before-voice-headroom-{time.time_ns()}.mp4');mixed.rename(video)
(base/'audio-mix-fix.json').write_text(json.dumps({'voiceGain':0.72,'musicGain':0.045,'videoPacketsUnchanged':True,'frames':expected},indent=2),encoding='utf-8')
print('Replaced audio with headroom; video packets and frame count unchanged.')
