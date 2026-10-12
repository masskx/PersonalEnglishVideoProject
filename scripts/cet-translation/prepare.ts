import {cpSync,existsSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {translationArt} from '../../src/cet-translation/lesson';
import timeline from '../../src/cet-translation/timeline.json';

const base='outputs/cet4-translation-main-clause';mkdirSync(`${base}/public`,{recursive:true});mkdirSync(`${base}/review`,{recursive:true});
const paths=[...Object.values(translationArt),'assets/music/root-word-series-bgm.mp3',...timeline.cues.map(c=>c.src)];
for(const rel of paths){const src=`public/${rel}`,dest=`${base}/public/${rel}`;if(!existsSync(src))throw Error(`Missing ${src}`);mkdirSync(dest.slice(0,dest.lastIndexOf('/')),{recursive:true});cpSync(src,dest);}
writeFileSync(`${base}/asset-manifest.json`,JSON.stringify({assets:paths,illustrations:Object.values(translationArt),roleAnchor:'public/assets/replica/script-scrib/00_write_hook.png',whiteBackgroundReview:'4/4 accepted; rejected duplicate-character benefit candidate kept outside runtime assets.'},null,2));
console.log(`Prepared ${paths.length} referenced assets in isolated public bundle.`);
