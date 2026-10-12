import 'dotenv/config';
import {createHash} from 'node:crypto';
import {existsSync,mkdirSync,renameSync,writeFileSync} from 'node:fs';
import {synthesizeDashscope,probeAudioDuration} from '../../src/tts/dashscope';
import {CET_TRANSLATION_ID,translationCues,type TimedTranslationCue} from '../../src/cet-translation/lesson';

const generate=process.argv.includes('--generate');
const audioDir=`public/assets/audio/${CET_TRANSLATION_ID}`;
const output='outputs/cet4-translation-main-clause';
mkdirSync(audioDir,{recursive:true});mkdirSync(output,{recursive:true});
const voice={model:'cosyvoice-v3-flash',voice:'longanhuan',rate:1.1,pitch:1,volume:68,format:'mp3' as const};
let frame=0;const cues:TimedTranslationCue[]=[];
for(const cue of translationCues){
 const settings={...voice,rate:cue.english?1.02:voice.rate};
 const hash=createHash('sha256').update(JSON.stringify({text:cue.voice,settings})).digest('hex').slice(0,12);
 const filename=`${cue.id}-${hash}.mp3`,file=`${audioDir}/${filename}`;
 if(!existsSync(file)){
   if(!generate){console.log(`Needs voice: ${cue.id}`);continue;}
   console.log(`Generating ${cue.id}`);
   const audio=await synthesizeDashscope(cue.voice,settings);writeFileSync(`${file}.tmp`,audio);renameSync(`${file}.tmp`,file);
 }
 const seconds=probeAudioDuration(file),audioFrames=Math.ceil(seconds*30),frames=audioFrames+Math.round((cue.pauseAfter??0.18)*30);
 cues.push({...cue,from:frame,frames,audioFrames,src:`assets/audio/${CET_TRANSLATION_ID}/${filename}`,seconds});frame+=frames;
}
if(cues.length!==translationCues.length)throw Error('Missing audio. Run with --generate.');
cues[cues.length-1].frames+=18;frame+=18;
const timeline={fps:30,totalFrames:frame,cues};
writeFileSync('src/cet-translation/timeline.json',JSON.stringify(timeline,null,2));
writeFileSync(`${output}/voice-report.json`,JSON.stringify({provider:'DashScope',voice,englishRate:1.02,timeline,alignment:'Cue boundaries measured with ffprobe; narration is not playback accelerated.'},null,2));
console.log(`Prepared ${cues.length} cues, ${frame} frames, ${(frame/30).toFixed(2)}s`);
