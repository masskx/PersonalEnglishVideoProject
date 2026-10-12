from pathlib import Path
import json,subprocess,shutil,re
import numpy as np

base=Path('outputs/cet4-translation-main-clause');timeline=json.loads(Path('src/cet-translation/timeline.json').read_text(encoding='utf-8'))
ffmpeg=shutil.which('ffmpeg');ffprobe=shutil.which('ffprobe');assert ffmpeg and ffprobe
video=base/'cet4-translation-main-clause.mp4'
info=json.loads(subprocess.check_output([ffprobe,'-v','error','-show_streams','-show_format','-of','json',str(video)]))
v=next(s for s in info['streams'] if s['codec_type']=='video');a=next(s for s in info['streams'] if s['codec_type']=='audio')
assert int(v['width'])==1920 and int(v['height'])==1080 and v['avg_frame_rate']=='30/1'
assert int(v['nb_frames'])==timeline['totalFrames']
assert a['codec_name']=='aac' and a['sample_rate']=='48000' and a['channels']==2
decode=subprocess.run([ffmpeg,'-v','error','-i',str(video),'-f','null','-'],capture_output=True,text=True);assert decode.returncode==0,decode.stderr
vol=subprocess.run([ffmpeg,'-hide_banner','-i',str(video),'-af','volumedetect','-f','null','-'],capture_output=True,text=True,check=True)
peak=float(re.search(r'max_volume: ([\-\d.]+) dB',vol.stderr).group(1));assert peak<=-1
audio=np.frombuffer(subprocess.check_output([ffmpeg,'-v','error','-i',str(video),'-f','f32le','-ac','1','-ar','16000','-']),dtype=np.float32)
block=320;p=np.pad(audio,(0,(-len(audio))%block));rms=np.sqrt(np.mean(p.reshape(-1,block)**2,axis=1));quiet=rms<10**(-45/20)
gaps=[];start=None
for i,q in enumerate(list(quiet)+[False]):
 if q and start is None:start=i
 if not q and start is not None:
  if (i-start)*.02>=1.3:gaps.append({'start':round(start*.02,2),'end':round(i*.02,2)})
  start=None
practice=next(c for c in timeline['cues'] if c['id']=='practice');allowed=(practice['from']/30+practice['seconds']-.5,(practice['from']+practice['frames'])/30+.5)
unexpected=[g for g in gaps if not (allowed[0]<=g['start'] and g['end']<=allowed[1])]
report={'durationSeconds':timeline['totalFrames']/30,'frames':timeline['totalFrames'],'video':{'width':1920,'height':1080,'fps':30,'codec':v['codec_name']},'audio':{'codec':a['codec_name'],'sampleRate':a['sample_rate'],'channels':a['channels'],'peakDbfs':peak},'fullDecodePass':True,'longSilenceWindows':gaps,'intentionalPracticeWindow':allowed,'unexpectedLongSilences':unexpected,'illustrationsReviewed':4,'coversPresent':(base/'cover.png').exists() and (base/'cover-landscape.png').exists()}
assert not unexpected,unexpected
(base/'render-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(report,ensure_ascii=False,indent=2))
