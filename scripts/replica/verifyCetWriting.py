from pathlib import Path
import argparse, json, subprocess, shutil, re
import numpy as np

parser=argparse.ArgumentParser();parser.add_argument('--source-only',action='store_true');args=parser.parse_args()
base=Path('outputs/cet4-writing-paragraph-v2');timeline=json.loads(Path('src/cet-writing/timeline.json').read_text(encoding='utf-8'))
ffmpeg=shutil.which('ffmpeg');ffprobe=shutil.which('ffprobe');assert ffmpeg and ffprobe
rate=16000;spoken=np.zeros(round(timeline['totalFrames']/30*rate),dtype=np.float32)
cursor=0; sources=[]
def probe(file):return json.loads(subprocess.check_output([ffprobe,'-v','error','-show_streams','-show_format','-of','json',str(file)]))
for c in timeline['cues']:
    assert c['from']==cursor and c['frames']>=c['audioFrames']>0
    cursor+=c['frames']
    file=Path('public')/c['src'];info=probe(file);seconds=float(info['format']['duration'])
    assert abs(seconds-c['seconds'])<0.03 and abs(c['audioFrames']/30-seconds)<1/30+0.001
    audio=np.frombuffer(subprocess.check_output([ffmpeg,'-v','error','-i',str(file),'-f','f32le','-ac','1','-ar',str(rate),'-']),dtype=np.float32)
    assert np.isfinite(audio).all() and len(audio)>0
    start=round(c['from']/30*rate);spoken[start:start+len(audio)]=audio[:len(spoken)-start]
    sources.append({'id':c['id'],'seconds':seconds,'peakDbfs':float(20*np.log10(max(1e-10,float(np.max(np.abs(audio))))))})
assert cursor==timeline['totalFrames']
# 20ms RMS blocks on the scheduled narration, independent of the music bed.
block=320;padded=np.pad(spoken,(0,(-len(spoken))%block));rms=np.sqrt(np.mean(padded.reshape(-1,block)**2,axis=1));quiet=rms<10**(-45/20)
gaps=[];start=None
for i,q in enumerate(list(quiet)+[False]):
    if q and start is None:start=i
    if not q and start is not None:
        if (i-start)*0.02>=1.2:gaps.append({'start':round(start*0.02,2),'end':round(i*0.02,2)})
        start=None
practice=next(c for c in timeline['cues'] if c['id']=='practice')
allowed=[(practice['from']/30+practice['seconds']-0.6,(practice['from']+practice['frames'])/30+0.5)]
unexpected=[g for g in gaps if not any(a<=g['start'] and g['end']<=b for a,b in allowed)]
report={'frames':cursor,'duration':cursor/30,'sources':sources,'scheduledNarrationLongGaps':gaps,'intentionalPracticeWindow':allowed,'unexpectedGaps':unexpected,'sourceCheckPass':not unexpected}
if not args.source_only:
    file=base/'cet4-writing-paragraph.mp4';info=probe(file);video=next(s for s in info['streams'] if s['codec_type']=='video');audio=next(s for s in info['streams'] if s['codec_type']=='audio')
    assert video['width']==1920 and video['height']==1080 and video['r_frame_rate']==video['avg_frame_rate']=='30/1'
    assert int(video['nb_frames'])==cursor and abs(float(video['duration'])-cursor/30)<0.04
    assert audio['codec_name']=='aac' and audio['sample_rate']=='48000' and audio['channels']==2
    check=subprocess.run([ffmpeg,'-hide_banner','-i',str(file),'-af','volumedetect','-f','null','-'],capture_output=True,text=True,check=True)
    peak=float(re.search(r'max_volume: ([\-\d.]+) dB',check.stderr).group(1));assert peak<=-1,peak
    report.update({'video':video,'audio':audio,'fullDecodePass':True,'mixPeakDbfs':peak})
    frames={0,cursor-1}
    for c in timeline['cues']:
        frames.update(max(0,min(cursor-1,c['from']+d)) for d in [-1,0,3,10,25])
    frames.add(practice['from']+practice['audioFrames']+15)
    frames=sorted(frames);expr='+'.join(f'eq(n,{f})' for f in frames).replace(',',r'\,')
    subprocess.run([ffmpeg,'-v','error','-y','-i',str(file),'-vf',f'select={expr}','-fps_mode','vfr','-q:v','2',str(base/'review/encoded-%03d.jpg')],check=True)
    (base/'review/encoded-index.json').write_text(json.dumps(frames),encoding='utf-8')
    report['encodedReviewFrames']=len(frames)
(base/('source-check.json' if args.source_only else 'render-report.json')).write_text(json.dumps(report,indent=2),encoding='utf-8')
assert not unexpected,unexpected
print(json.dumps({k:v for k,v in report.items() if k not in ['sources','video','audio']},ensure_ascii=False))
