import 'dotenv/config';
import {createHash} from 'node:crypto';
import {existsSync, mkdirSync, readFileSync, writeFileSync, renameSync} from 'node:fs';
import {synthesizeDashscope, probeAudioDuration} from '../../src/tts/dashscope';
import {writingCues, CET_WRITING_ID, type TimedWritingCue} from '../../src/cet-writing/lesson';

const generate = process.argv.includes('--generate');
const base = `public/assets/audio/${CET_WRITING_ID}`;
const reportDir = 'outputs/cet4-writing-paragraph-v2';
mkdirSync(base,{recursive:true}); mkdirSync(reportDir,{recursive:true});
const voice = {model:'cosyvoice-v3-flash',voice:'longanhuan',rate:1.08,pitch:1,volume:65,format:'mp3' as const};
let frame=0; const cues: TimedWritingCue[]=[];
for(const cue of writingCues){
  const settings={...voice,rate:cue.english?1:voice.rate};
  const hash=createHash('sha256').update(JSON.stringify({text:cue.voice,settings})).digest('hex').slice(0,12);
  const filename=`${cue.id}-${hash}.mp3`, file=`${base}/${filename}`;
  if(!existsSync(file)){
    if(!generate){console.log(`Needs voice: ${cue.id}`);continue;}
    console.log(`Generating ${cue.id}`);
    const audio=await synthesizeDashscope(cue.voice,settings);
    writeFileSync(`${file}.tmp`,audio);renameSync(`${file}.tmp`,file);
  }
  const seconds=probeAudioDuration(file);
  const audioFrames=Math.ceil(seconds*30);
  const frames=audioFrames+Math.round((cue.pauseAfter??0.14)*30);
  cues.push({...cue,from:frame,frames,audioFrames,src:`assets/audio/${CET_WRITING_ID}/${filename}`,seconds});
  frame+=frames;
}
if(cues.length!==writingCues.length) throw Error('Missing audio. Use --generate to synthesize new segments.');
// Give the closing message a short reading hold with continuous music.
cues[cues.length-1].frames+=15; frame+=15;
const timeline={fps:30,totalFrames:frame,cues};
writeFileSync('src/cet-writing/timeline.json',JSON.stringify(timeline,null,2));
writeFileSync(`${reportDir}/voice-report.json`,JSON.stringify({provider:'DashScope',voice,englishRate:1,timeline,alignment:'Cue boundaries from ffprobe; no word-level forced alignment; no playback speed-up.'},null,2));
console.log(`Prepared ${cues.length} cues, ${frame} frames, ${(frame/30).toFixed(2)}s`);
