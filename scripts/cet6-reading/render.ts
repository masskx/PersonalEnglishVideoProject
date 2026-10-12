import {existsSync,mkdirSync,renameSync,writeFileSync} from 'node:fs';
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {getCompositions,renderMedia,renderStill} from '@remotion/renderer';
import timeline from '../../src/cet6-reading/timeline.json';

const slug='cet6-reading-location-paraphrase';
const base=`outputs/${slug}`;mkdirSync(`${base}/review/stills`,{recursive:true});
const browserExecutable='C:/Program Files/Google/Chrome/Application/chrome.exe';
const serveUrl=await bundle({entryPoint:path.resolve('src/index.ts'),publicDir:path.resolve(`${base}/public`)});
const compositions=await getCompositions(serveUrl,{browserExecutable});
const composition=compositions.find(c=>c.id==='Cet6ReadingLocationParaphrase')!;
if(process.argv.includes('--video')){
  let last=-1;const pending=`${base}/video.pending.mp4`;
  await renderMedia({serveUrl,composition,outputLocation:pending,codec:'h264',crf:18,pixelFormat:'yuv420p',audioCodec:'aac',audioBitrate:'192k',imageFormat:'jpeg',concurrency:4,browserExecutable,onProgress:p=>{const n=Math.floor(p.progress*10);if(n!==last){console.log(`Render ${n*10}%`);last=n;}}});
  const final=`${base}/${slug}.mp4`;if(existsSync(final)){mkdirSync(`${base}/render-history`,{recursive:true});renameSync(final,`${base}/render-history/${Date.now()}.mp4`);}renameSync(pending,final);console.log(final);
}else{
  const frames=[0,45,...timeline.cues.map(c=>c.from+Math.min(28,c.frames-1)),timeline.cues.find(c=>c.id==='practice')!.from+timeline.cues.find(c=>c.id==='practice')!.audioFrames+25,timeline.totalFrames-1];
  for(const frame of [...new Set(frames)])await renderStill({serveUrl,composition,output:`${base}/review/stills/frame-${String(frame).padStart(5,'0')}.png`,frame,imageFormat:'png',browserExecutable});
  for(const [id,file] of [['Cet6ReadingCover','cover.png'],['Cet6ReadingLandscapeCover','cover-landscape.png']])await renderStill({serveUrl,composition:compositions.find(c=>c.id===id)!,output:`${base}/${file}`,imageFormat:'png',browserExecutable});
  writeFileSync(`${base}/review/still-frames.json`,JSON.stringify([...new Set(frames)]));console.log('Rendered review stills and two covers.');
}
