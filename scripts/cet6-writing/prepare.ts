import {cpSync,existsSync,mkdirSync,writeFileSync} from 'node:fs';
import {CET6_WRITING_ID,writingArt} from '../../src/cet6-writing/lesson';
import timeline from '../../src/cet6-writing/timeline.json';

const slug=CET6_WRITING_ID;
const base=`outputs/${slug}`;mkdirSync(`${base}/review`,{recursive:true});
// Isolated render bundle lives in local work/ (gitignored), never in the delivery folder.
const bundleDir=`work/render-staging/${slug}-public`;mkdirSync(bundleDir,{recursive:true});
const paths=[...Object.values(writingArt),'assets/music/root-word-series-bgm.mp3',...timeline.cues.map(c=>c.src)];
for(const rel of paths){const src=`public/${rel}`,dest=`${bundleDir}/${rel}`;if(!existsSync(src))throw Error(`Missing ${src}`);mkdirSync(dest.slice(0,dest.lastIndexOf('/')),{recursive:true});cpSync(src,dest);}
writeFileSync(`${base}/asset-manifest.json`,`${JSON.stringify({project:slug,assets:paths,illustrations:Object.values(writingArt),generationMethod:'gpt-image-2 relay reference edit (planning/cet6-writing-concession-art.json)',referenceAnchor:'public/assets/replica/mit-miss/00_send_hook.png',runtimeSourceScan:'episode-local'},null,2)}\n`);
console.log(`Prepared ${paths.length} referenced assets in ${bundleDir}.`);
