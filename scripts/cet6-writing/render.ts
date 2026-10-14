import {existsSync,mkdirSync,renameSync,writeFileSync} from 'node:fs';
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {getCompositions,renderMedia,renderStill} from '@remotion/renderer';
import timeline from '../../src/cet6-writing/timeline.json';
import {CET6_WRITING_ID} from '../../src/cet6-writing/lesson';
import {browserExecutable} from '../replica/renderEnv';

const slug=CET6_WRITING_ID;
const base=`outputs/${slug}`;mkdirSync(`${base}/review/stills`,{recursive:true});
const serveUrl=await bundle({entryPoint:path.resolve('src/index.ts'),publicDir:path.resolve(`work/render-staging/${slug}-public`)});
const compositions=await getCompositions(serveUrl,{browserExecutable});
const composition=compositions.find(c=>c.id==='Cet6WritingConcession')!;
if(process.argv.includes('--video')){
  let last=-1;const pending=`${base}/video.pending.mp4`;
  await renderMedia({serveUrl,composition,outputLocation:pending,codec:'h264',crf:18,pixelFormat:'yuv420p',audioCodec:'aac',audioBitrate:'192k',imageFormat:'jpeg',concurrency:4,browserExecutable,onProgress:p=>{const n=Math.floor(p.progress*10);if(n!==last){console.log(`Render ${n*10}%`);last=n;}}});
  const final=`${base}/${slug}.mp4`;if(existsSync(final)){mkdirSync(`work/render-history/${slug}`,{recursive:true});renameSync(final,`work/render-history/${slug}/${Date.now()}.mp4`);}renameSync(pending,final);console.log(final);
}else{
  const practice=timeline.cues.find(c=>c.id==='practice')!;
  const frames=[0,45,...timeline.cues.map(c=>c.from+Math.min(40,c.frames-1)),practice.from+practice.audioFrames+25,timeline.totalFrames-1];
  for(const frame of [...new Set(frames)])await renderStill({serveUrl,composition,output:`${base}/review/stills/frame-${String(frame).padStart(5,'0')}.png`,frame,imageFormat:'png',browserExecutable});
  for(const [id,file] of [['Cet6WritingCover','cover.png'],['Cet6WritingLandscapeCover','cover-landscape.png']])await renderStill({serveUrl,composition:compositions.find(c=>c.id===id)!,output:`${base}/${file}`,imageFormat:'png',browserExecutable});
  writeFileSync(`${base}/review/still-frames.json`,JSON.stringify([...new Set(frames)]));console.log('Rendered review stills and two covers.');
}
