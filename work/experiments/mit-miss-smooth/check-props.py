from pathlib import Path
import json
base=Path('work/experiments/mit-miss-smooth')
p=json.loads((base/'props.json').read_text(encoding='utf-8'))
old=json.loads(Path('work/experiments/mit-miss-keyposes/props.json').read_text(encoding='utf-8'))
assert p['audioManifest']==old['audioManifest'] and p['backgroundMusic']==old['backgroundMusic']
assert p['storyboard']['duration']==old['storyboard']['duration']==122.1
word_frames=0
for scene,previous in zip(p['storyboard']['scenes'],old['storyboard']['scenes']):
    assert all(scene[k]==previous[k] for k in ['id','start','duration','narration','captions'])
    assert [l for l in scene['layers'] if l['kind']=='image']==[l for l in previous['layers'] if l['kind']=='image']
    assert [l['runs'] for l in scene['layers'] if l['kind']=='text']==[l['runs'] for l in previous['layers'] if l['kind']=='text']
    poses=[l for l in scene['layers'] if '-pose-' in l['id']]
    if poses:
        for f in range(round(scene['duration']*30)):
            assert sum(round(l['from']*30)<=f<round((l['from']+l['duration'])*30) for l in poses)==1
            word_frames+=1
    else:
        first=scene['layers'][0]
        assert first['from']==0 and first['enter']=='none'
    for l in scene['layers']:
        assert l['from']>=0 and l['duration']>0 and l['from']+l['duration']<=scene['duration']+0.001
assert word_frames==2256
report={'wordSceneFrames':word_frames,'exclusivePoseCoverage':True,'audioCaptionsTextAssetsUnchanged':True,'firstHeadingsVisible':True}
(base/'props-check.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(report)
