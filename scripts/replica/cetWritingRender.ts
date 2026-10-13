import {mkdirSync, existsSync, renameSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {getCompositions, renderStill, renderMedia} from '@remotion/renderer';
import timeline from '../../src/cet-writing/timeline.json';
import {browserExecutable} from './renderEnv';

const base='outputs/cet4-writing-paragraph-v2';
mkdirSync(`${base}/review`,{recursive:true});
const serveUrl=await bundle({entryPoint:path.resolve('src/index.ts'),publicDir:path.resolve(`${base}/public`)});
const compositions=await getCompositions(serveUrl,{browserExecutable});
const composition=compositions.find(c=>c.id==='Cet4WritingParagraph')!;
if(process.argv.includes('--boundaries')){
  const patches=timeline.cues.filter((c,i)=>['task','reason','example','paragraph','practice','answer'].includes(c.panel)&&(i===0||timeline.cues[i-1].panel!==c.panel));
  for(const c of patches){
    await renderMedia({serveUrl,composition,outputLocation:`${base}/review/anchor-${c.from}.mp4`,codec:'h264',crf:18,pixelFormat:'yuv420p',muted:true,frameRange:[c.from,c.from+15],concurrency:4,browserExecutable});
  }
  writeFileSync(`${base}/review/anchor-patches.json`,JSON.stringify(patches.map(c=>({from:c.from,frames:16}))));
  console.log(`Rendered ${patches.length} first-heading patches.`);
} else if(process.argv.includes('--audio')){
  await renderMedia({serveUrl,composition,outputLocation:`${base}/corrected-audio.wav`,codec:'wav',browserExecutable,concurrency:4});
  console.log('Rendered corrected audio-only mix.');
} else if(process.argv.includes('--video')){
  let last=-1;
  await renderMedia({serveUrl,composition,outputLocation:`${base}/video.pending.mp4`,codec:'h264',crf:18,pixelFormat:'yuv420p',audioCodec:'aac',audioBitrate:'192k',imageFormat:'jpeg',concurrency:4,browserExecutable,onProgress:p=>{const n=Math.floor(p.progress*10);if(n!==last){console.log(`Render ${n*10}%`);last=n;}}});
  const final=`${base}/cet4-writing-paragraph.mp4`;
  if(existsSync(final)){mkdirSync(`${base}/render-history`,{recursive:true});renameSync(final,`${base}/render-history/${Date.now()}.mp4`);}
  renameSync(`${base}/video.pending.mp4`,final);console.log(final);
} else {
  const frames=[0,45,...timeline.cues.map(c=>c.from+Math.min(25,c.frames-1)),timeline.cues.find(c=>c.id==='practice')!.from+timeline.cues.find(c=>c.id==='practice')!.audioFrames+15,timeline.totalFrames-1];
  for(const frame of frames){
    await renderStill({serveUrl,composition,output:`${base}/review/frame-${String(frame).padStart(5,'0')}.png`,frame,imageFormat:'png',browserExecutable});
  }
  for(const [id,file] of [['Cet4WritingCover','cover.png'],['Cet4WritingLandscapeCover','cover-landscape.png']]){
    await renderStill({serveUrl,composition:compositions.find(c=>c.id===id)!,output:`${base}/${file}`,imageFormat:'png',browserExecutable});
  }
  writeFileSync(`${base}/review/still-frames.json`,JSON.stringify(frames));
  console.log(`Rendered ${frames.length} review stills and both covers.`);
}
