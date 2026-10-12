import 'dotenv/config';
import {existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync, renameSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {mitMissProject as project} from '../../src/replica/projects/mitMiss';

const args=process.argv.slice(2);
const base=args.find(arg=>arg.startsWith('--out-dir='))?.slice('--out-dir='.length)??'work/experiments/mit-miss-keyposes';
const assetSet=args.find(arg=>arg.startsWith('--asset-set='))?.slice('--asset-set='.length)??'mit-miss-keyposes';
const poseNames=(args.find(arg=>arg.startsWith('--pose-names='))?.slice('--pose-names='.length)??'1,2,3').split(',');
if(poseNames.length!==3||poseNames.some(name=>!name.trim()))throw new Error('--pose-names must contain exactly three comma-separated names.');
const assets=`public/assets/replica/${assetSet}`;
mkdirSync(base,{recursive:true}); mkdirSync(assets,{recursive:true});
const plans = [
 ['submit','A small worker below a high desk holds an orange envelope. A supervisor at the desk waits.', 'The lower worker stretches both arms upward, handing the same orange envelope to the supervisor.', 'The supervisor now holds the SAME ORANGE ENVELOPE above the desk, not white paper. The lower worker has EMPTY lowered hands, no envelope below.'],
 ['transmit','Two small workers stand apart with two simple radio terminals; the left worker holds an orange message capsule.', 'The left worker inserts the orange capsule into the left terminal, the right worker reaches toward the receiving terminal.', 'The right worker holds the orange capsule received at the right terminal; the left worker has empty hands.'],
 ['emit','A small worker grips a closed nozzle attached to a simple gas tank; no gas is outside.', 'The worker turns the valve, a small orange puff emerges at the nozzle mouth.', 'The worker holds the open valve; three orange gas puffs are clearly outside the nozzle.'],
 ['admit','A small worker waits LEFT of a closed doorway at the center. A second worker stands RIGHT of the doorway with a hand on its handle. Only the two workers and the door, no capsule.', 'The worker on the RIGHT opens the door wide. The visitor moves from LEFT to CENTER and stands halfway through the doorway. Only the two workers and doorway, no capsule.', 'Move the visitor from the LEFT to the RIGHT side of the doorway. BOTH workers now stand together on the RIGHT side. The LEFT side is EMPTY. The door remains open in the center. Remove any capsule.'],
 ['permit','A small worker holding a small orange pass waits before a lowered barrier; a gatekeeper holds the barrier lever.', 'The worker presents the orange pass, the gatekeeper lifts the barrier.', 'The worker carrying the pass stands beyond the raised barrier, the gatekeeper holds the lever.'],
 ['commit','A small worker holds an orange capsule with both hands before an empty commitment slot box.', 'The worker pushes the capsule deeply into the slot with both hands.', 'The capsule is secured inside the slot with a closed latch; the worker releases it with empty hands.'],
 ['dismiss','A leader and two small workers stand together beside an open doorway.', 'The leader extends a hand toward the exit; the two workers turn and take a step toward the doorway.', 'The two workers are outside the doorway and separate in different directions; the leader remains inside.'],
 ['mission','A small worker receives an orange task envelope from a dispatcher; a simple distant flag marks a destination.', 'The worker grips the envelope and takes a deliberate first step away from the dispatcher toward the flag.', 'The worker has arrived at the flag carrying the same envelope; the dispatcher remains behind.'],
];
const generate=args.includes('--generate');
const only=args.find(arg=>arg.startsWith('--only='))?.slice(7).split(',');
const regenerate=args.includes('--regenerate');
const selectedPose=Number(args.find(arg=>arg.startsWith('--pose='))?.slice(7) ?? 0);
const endpoint=process.env.HUOSHAN_ARK_IMAGE_ENDPOINT ?? process.env.HUOSHAN_IMAGE_ENDPOINT ?? 'https://ark.cn-beijing.volces.com/api/v3/images/generations';
const evidence=[];
for (const [word,...poses] of plans) {
 if(only && !only.includes(word)) continue;
 const reference=project.illustrations.find(s=>s.id.includes(word) || s.filename.includes(word));
 if(!reference) throw Error(`Missing reference ${word}`);
 const ref=readFileSync(`${project.paths.alphaAssetDir}/${reference.filename}`);
 for(let i=0;i<poses.length;i++) {
  if(selectedPose && selectedPose!==i+1) continue;
  const name=`${word}-${poseNames[i]}.png`; const output=`${assets}/${name}`;
  const prompt=`${i===0?'Draw a new scene in the character style described below.':'Edit the attached image. Preserve EXACTLY the same camera, framing, character sizes, character identities, object designs and background. Change only the arms and positions necessary for the requested action. Do not zoom or crop.'} Requested single state: ${poses[i]} One instant, NOT a collage. Minimal wobbly black pen lines. Solid black bean creatures, white dot eyes, thin limbs, deadpan. Orange meaningful object. Entire subject within central 65% of 16:9 canvas, all limbs visible with generous padding. Background MUST be solid RGB(0,255,0) green, NOT yellow. No text, letters, hatching, shadows, ground line, arrows, motion trails, frames or decoration.`;
  evidence.push({word,pose:i+1,prompt,src:output.replace('public/','')});
  if(!generate || (existsSync(output) && !regenerate)) continue;
  if(existsSync(output)) {mkdirSync(`${base}/rejected`,{recursive:true});copyFileSync(output,`${base}/rejected/${Date.now()}-${name}`);}
  console.log(`Generating ${name}`);
  const poseReference=i>0?readFileSync(`${assets}/${word}-${poseNames[0]}.png`):ref;
  writeFileSync(`${base}/${word}-${i+1}-prompt.txt`,prompt);
  const response=await fetch(endpoint,{method:'POST',headers:{Authorization:`Bearer ${process.env.HUOSHAN_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({model:project.image.model,prompt,image:i>0?`data:image/png;base64,${poseReference.toString('base64')}`:undefined,size:'2K',response_format:'b64_json',watermark:false,sequential_image_generation:'disabled'})});
  if(!response.ok) throw Error(`Seedream HTTP ${response.status}`);
  const payload=await response.json() as {data:{url?:string;b64_json?:string}[]};
  const item=payload.data[0];
  const bytes=item.b64_json?Buffer.from(item.b64_json,'base64'):Buffer.from(await (await fetch(item.url!)).arrayBuffer());
  const source=`${base}/${word}-${i+1}-source.png`; writeFileSync(source,bytes);
  const pending=`${output}.pending.png`;
  const result=spawnSync(process.env.PYTHON ?? 'D:/miniconda/python.exe',['scripts/replica/removeGeneratedPlate.py','--input',source,'--out',pending,'--force'],{encoding:'utf8',windowsHide:true,env:{...process.env,PYTHONUTF8:'1'}});
  if(result.status!==0) throw Error(result.stderr);
  renameSync(pending,output);
 }
}
writeFileSync(`${base}/generation-plan.json`,JSON.stringify(evidence,null,2));
const storyboard=structuredClone(project.storyboard);
// Caption phrase boundaries provide an explicit first-pass beat map, not word-level ASR.
const beatMap:Record<string,{cuts:number[];trigger:string}>={
 submit:{cuts:[0,3.13,5.27],trigger:'把文件递到上级手里 → 正式送交'},
 transmit:{cuts:[0,2.03,5.13],trigger:'从这一端 → 送到另一端'},
 emit:{cuts:[0,4.13,6.13],trigger:'光、热、声音或气体 → 从源头送出来'},
 admit:{cuts:[0,1.17,3.47],trigger:'把一个人送进门里 → 允许他进入'},
 permit:{cuts:[0,1.97,4.4],trigger:'送过关卡 → 不再拦住'},
 commit:{cuts:[0,3.13,6.67],trigger:'正式交给一件事 → 不能反悔的卡槽'},
 dismiss:{cuts:[0,4.23,6.6],trigger:'把人从面前送走 → 让大家散开'},
 mission:{cuts:[0,4.3,6.5],trigger:'被派出去 → 完成的任务'},
};
for(const scene of storyboard.scenes){
 scene.transitionOut={type:'none',duration:0};
 scene.sfx=[]; // Old mechanical impacts no longer describe these poses.
 scene.layers=scene.layers.map(layer=>({...layer,enter:'fade' as const,enterDuration:0.12,exit:'none' as const}));
 const word=plans.find(([word])=>scene.id.startsWith(`${word}-`))?.[0];
 if(!word) {
  scene.layers=scene.layers.map((layer,index)=>({...layer,duration:scene.duration-layer.from,...(index===0?{from:0,duration:scene.duration,enter:'none' as const}:{})}));
  continue;
 }
 const art=scene.layers.find(l=>l.kind==='image');
 if(!art || art.kind!=='image') throw Error('Missing image layer');
 scene.layers=scene.layers.filter(l=>l.kind!=='image');
 // Every word uses the same stable art box; the old alternating coordinates overlapped text.
 const cuts=beatMap[word].cuts.map(at=>Math.round(at*30)/30);
 scene.layers=scene.layers.map(l=>l.id.endsWith('-meaning')?{...l,from:cuts[2],duration:scene.duration-cuts[2]}:l);
 for(const [i,at] of cuts.entries()) scene.layers.push({...art,id:`${word}-pose-${i+1}`,src:`assets/replica/${assetSet}/${word}-${poseNames[i]}.png`,from:at,duration:(cuts[i+1]??scene.duration)-at,x:950,y:160,width:900,height:650,enter:'none',exit:'none',opacity:1});
}
writeFileSync(`${base}/beat-map.json`,JSON.stringify({basis:'Existing caption phrases; not forced-alignment or a completed human listening review',words:beatMap},null,2));
writeFileSync(`${base}/props.json`,JSON.stringify({storyboard,audioManifest:project.audioManifest,backgroundMusic:project.backgroundMusic,visualRenderer:'default'},null,2));
for(const file of ['cover.png','cover-landscape.png','publish-copy.md']) if(existsSync(`outputs/mit-miss/${file}`)) copyFileSync(`outputs/mit-miss/${file}`,`${base}/${file}`);
console.log(`Prepared ${base}/props.json (${generate?'generated':'plan only'})`);
