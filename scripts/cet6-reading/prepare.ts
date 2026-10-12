import {cpSync,existsSync,mkdirSync,writeFileSync} from 'node:fs';
import {readingArt} from '../../src/cet6-reading/lesson';
import timeline from '../../src/cet6-reading/timeline.json';

const slug='cet6-reading-location-paraphrase';
const base=`outputs/${slug}`;mkdirSync(`${base}/public`,{recursive:true});mkdirSync(`${base}/review`,{recursive:true});
const paths=[...Object.values(readingArt),'assets/music/root-word-series-bgm.mp3',...timeline.cues.map(c=>c.src)];
for(const rel of paths){const src=`public/${rel}`,dest=`${base}/public/${rel}`;if(!existsSync(src))throw Error(`Missing ${src}`);mkdirSync(dest.slice(0,dest.lastIndexOf('/')),{recursive:true});cpSync(src,dest);}
writeFileSync(`${base}/asset-manifest.json`,`${JSON.stringify({project:slug,assets:paths,illustrations:Object.values(readingArt),generationMethod:'built-in image_gen raster',referenceAnchor:'mit-miss / ten-tain',runtimeSourceScan:'episode-local'},null,2)}\n`);
console.log(`Prepared ${paths.length} referenced assets in isolated public bundle.`);
