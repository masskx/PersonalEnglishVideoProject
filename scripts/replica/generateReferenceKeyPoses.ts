import {config as loadDotenv} from 'dotenv';
import {existsSync, mkdirSync, readFileSync, statSync, writeFileSync} from 'node:fs';
import {homedir} from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {verifyPressReplicaAsset} from './assetVerifier';
import {editOpenAICompatibleImage} from './imageRelayClient';
import {normalizeImageSource} from './imageSourceNormalizer';

loadDotenv();

type PoseState = {
  id: string;
  source?: string;
  prompt?: string;
  /** Generate this state from the shot reference even if a source file is also recorded. */
  editFromReference?: boolean;
};

type PoseShot = {
  id: string;
  reference: string;
  purpose: string;
  states: PoseState[];
};

type ReferenceEditPlan = {
  schemaVersion: 1;
  id: string;
  model?: string;
  size?: string;
  quality?: string;
  sourceDir: string;
  assetDir: string;
  contactSheet?: string;
  negativePrompt?: string;
  shots: PoseShot[];
};

const args=process.argv.slice(2);
const planArg=args.find(arg=>arg.startsWith('--plan='))?.slice('--plan='.length);
if(!planArg)throw new Error('Missing --plan=<reference-edit-plan.json>.');
const generate=args.includes('--generate');
const force=args.includes('--force');
const concurrencyArg=args.find(arg=>arg.startsWith('--concurrency='))?.slice('--concurrency='.length);
const concurrencyValue=concurrencyArg===undefined?2:Number(concurrencyArg);
if(!Number.isInteger(concurrencyValue)||concurrencyValue<1||concurrencyValue>4){
  throw new Error('--concurrency must be an integer from 1 to 4.');
}
const concurrency=concurrencyValue;
const onlyArg=args.find(arg=>arg.startsWith('--only='))?.slice('--only='.length);
const selected=onlyArg?new Set(onlyArg.split(',').map(value=>value.trim()).filter(Boolean)):null;
const poseArg=args.find(arg=>arg.startsWith('--pose='))?.slice('--pose='.length);

const repoRoot=process.cwd();
const planPath=path.resolve(repoRoot,planArg);
const plan=JSON.parse(readFileSync(planPath,'utf8')) as ReferenceEditPlan;
if(plan.schemaVersion!==1)throw new Error(`Unsupported reference-edit plan schema: ${plan.schemaVersion}`);

const sourceDir=path.resolve(repoRoot,plan.sourceDir);
const assetDir=path.resolve(repoRoot,plan.assetDir);
mkdirSync(sourceDir,{recursive:true});
mkdirSync(assetDir,{recursive:true});

const apiKey=process.env.OPENAI_API_KEY;
if(generate&&!apiKey)throw new Error('Missing OPENAI_API_KEY in the project .env.');
const baseUrl=(process.env.OPENAI_BASE_URL??'https://api.openai.com/v1').replace(/\/+$/,'');
const model=process.env.OPENAI_IMAGE_EDIT_MODEL??plan.model??'gpt-image-2.5-sunburst';
const size=process.env.OPENAI_IMAGE_EDIT_SIZE??plan.size??'1536x864';
const quality=process.env.OPENAI_IMAGE_EDIT_QUALITY??plan.quality??'high';
const bundledFfmpeg=path.resolve(repoRoot,'node_modules','@remotion','compositor-win32-x64-msvc','ffmpeg.exe');
const bundledFfprobe=path.resolve(repoRoot,'node_modules','@remotion','compositor-win32-x64-msvc','ffprobe.exe');
const ffmpeg=process.env.FFMPEG_PATH??(existsSync(bundledFfmpeg)?bundledFfmpeg:'ffmpeg');
const ffprobe=process.env.FFPROBE_PATH??(existsSync(bundledFfprobe)?bundledFfprobe:'ffprobe');
const bundledPython=path.resolve(homedir(),'.cache','codex-runtimes','codex-primary-runtime','dependencies','python','python.exe');
const python=process.env.PYTHON??(existsSync(bundledPython)?bundledPython:'python');
const matteScript=path.resolve(repoRoot,'scripts','replica','removeGeneratedPlate.py');
const referencePlateScript=path.resolve(repoRoot,'scripts','replica','prepareReferencePlate.py');
const preparedReferenceDir=path.resolve(sourceDir,'references');
mkdirSync(preparedReferenceDir,{recursive:true});

const relative=(file:string)=>path.relative(repoRoot,file).replace(/\\/g,'/');
const sleep=(ms:number)=>new Promise(resolve=>setTimeout(resolve,ms));
const editWithRetry=async(options:Parameters<typeof editOpenAICompatibleImage>[0])=>{
  let lastError:unknown;
  for(let attempt=1;attempt<=4;attempt+=1){
    try{return await editOpenAICompatibleImage(options);}catch(error){
      lastError=error;
      const message=error instanceof Error?error.message:String(error);
      const retryable=/HTTP (?:0|429|5\d{2})|network failure|timed.?out|curl failed|connection reset/i.test(message);
      if(!retryable||attempt===4)throw error;
      console.warn(`Image edit request failed; retry ${attempt}/3 in ${attempt*2}s (${message.split('\n')[0]}).`);
      await sleep(attempt*2000);
    }
  }
  throw lastError;
};
const prepareReference=(source:string,shotId:string)=>{
  const output=path.resolve(preparedReferenceDir,`${shotId}.png`);
  if(!force&&existsSync(output)&&statSync(output).size>0)return output;
  const result=spawnSync(python,[referencePlateScript,'--input',source,'--out',output],{
    cwd:repoRoot,encoding:'utf8',windowsHide:true,env:{...process.env,PYTHONUTF8:'1'},
  });
  if(result.error||result.status!==0||!existsSync(output)){
    throw new Error(`Reference preparation failed for ${relative(source)}: ${result.error?.message??result.stderr}`);
  }
  return output;
};
const makeAlpha=(source:string,output:string)=>{
  const normalized=normalizeImageSource({input:source,ffmpeg,ffprobe});
  const result=spawnSync(python,[matteScript,'--input',normalized,'--out',output,'--force'],{
    cwd:repoRoot,encoding:'utf8',windowsHide:true,env:{...process.env,PYTHONUTF8:'1'},
  });
  if(result.error||result.status!==0)throw new Error(`Plate removal failed for ${relative(source)}: ${result.error?.message??result.stderr}`);
  const verification=verifyPressReplicaAsset(output);
  if(!verification.ok)throw new Error(`Asset QA failed for ${relative(output)}: ${verification.errors.join('; ')}`);
  return verification;
};

const report:{
  generatedAt:string;
  plan:string;
  model:string;
  size:string;
  quality:string;
  items:Array<Record<string,unknown>>;
}={generatedAt:new Date().toISOString(),plan:relative(planPath),model,size,quality,items:[]};

console.log(`Reference-edit plan: ${plan.id}`);
console.log(`Model: ${model}; size=${size}; quality=${quality}; mode=${generate?'generate':'dry-run'}; concurrency=${concurrency}`);

const shots=plan.shots.filter((shot)=>!selected||selected.has(shot.id));
for(const shot of shots){
  const referencePath=path.resolve(repoRoot,shot.reference);
  if(!existsSync(referencePath))throw new Error(`Missing reference image: ${relative(referencePath)}`);
}
const preparedReferences=new Map<string,string>();
if(generate){
  for(const shot of shots){
    const referencePath=path.resolve(repoRoot,shot.reference);
    preparedReferences.set(shot.id,prepareReference(referencePath,shot.id));
  }
}
const jobs=shots.flatMap((shot)=>shot.states
  .filter((state)=>!poseArg||state.id===poseArg)
  .map((state)=>({shot,state})));

const processJob=async({shot,state}:{shot:PoseShot;state:PoseState})=>{
  const basename=`${shot.id}-${state.id}`;
  const rawPath=path.resolve(sourceDir,`${basename}-source.png`);
  const alphaPath=path.resolve(assetDir,`${basename}.png`);
  if(!force&&existsSync(alphaPath)&&statSync(alphaPath).size>0){
    const verification=verifyPressReplicaAsset(alphaPath);
    if(verification.ok){
      console.log(`Skipped verified ${relative(alphaPath)}.`);
      report.items.push({shot:shot.id,state:state.id,status:'reused',source:relative(rawPath),alpha:relative(alphaPath),verification});
      return;
    }
  }

  if(!generate){
    console.log(`[${shot.id}/${state.id}] ${state.editFromReference||!state.source?'edit reference':'copy accepted source'}: ${shot.purpose}`);
    return;
  }

  let bytes:Buffer;
  let origin:'accepted-source'|'reference-edit';
  if(state.source&&!state.editFromReference){
    bytes=readFileSync(path.resolve(repoRoot,state.source));
    origin='accepted-source';
  }else{
    if(!state.prompt)throw new Error(`${shot.id}/${state.id} needs source or prompt.`);
    if(!apiKey)throw new Error('Missing OPENAI_API_KEY in the project .env.');
    const prompt=[
      'Edit the attached reference image. Preserve the exact accepted Xiaohei identities, camera, framing, main prop design, black-filled bodies, white dot eyes, hand-drawn line weight, white background and restrained orange palette.',
      'Change only the body positions and named local semantic objects required for this single moment. One instant, not a collage. Xiaohei must perform the key action.',
      state.prompt,
      plan.negativePrompt?`Do not include: ${plan.negativePrompt}`:'',
    ].filter(Boolean).join('\n');
    console.log(`Editing ${shot.id}/${state.id} through ${model}...`);
    bytes=await editWithRetry({baseUrl,apiKey,model,prompt,imagePath:preparedReferences.get(shot.id)!,size,quality});
    origin='reference-edit';
  }
  writeFileSync(rawPath,bytes);
  const verification=makeAlpha(rawPath,alphaPath);
  report.items.push({shot:shot.id,state:state.id,status:'generated',origin,source:relative(rawPath),alpha:relative(alphaPath),verification});
  console.log(`Accepted ${relative(alphaPath)}.`);
};

if(!generate){
  for(const job of jobs)await processJob(job);
}else{
  let cursor=0;
  const workers=Array.from({length:Math.min(concurrency,jobs.length)},async()=>{
    while(cursor<jobs.length){
      const index=cursor++;
      await processJob(jobs[index]);
    }
  });
  const workerResults=await Promise.allSettled(workers);
  const failures=workerResults.filter((result):result is PromiseRejectedResult=>result.status==='rejected');
  if(failures.length)throw new AggregateError(failures.map(result=>result.reason),`${failures.length} image edit worker(s) failed; other requests were allowed to finish.`);
}

if(generate){
  report.items.sort((a,b)=>String(a.shot).localeCompare(String(b.shot))||String(a.state).localeCompare(String(b.state)));
  writeFileSync(path.resolve(sourceDir,'reference-edit-report.json'),`${JSON.stringify(report,null,2)}\n`,'utf8');
  console.log(`Report: ${relative(path.resolve(sourceDir,'reference-edit-report.json'))}`);
  if(plan.contactSheet){
    const contactSheetScript=path.resolve(repoRoot,'scripts','replica','buildKeyposeContactSheet.py');
    const contactSheet=path.resolve(repoRoot,plan.contactSheet);
    const result=spawnSync(python,[contactSheetScript,'--plan',planPath,'--out',contactSheet],{
      cwd:repoRoot,encoding:'utf8',windowsHide:true,env:{...process.env,PYTHONUTF8:'1'},
    });
    if(result.error||result.status!==0||!existsSync(contactSheet)){
      throw new Error(`Key-pose contact sheet failed: ${result.error?.message??result.stderr}`);
    }
    console.log(`White-background review sheet: ${relative(contactSheet)}.`);
  }
}
