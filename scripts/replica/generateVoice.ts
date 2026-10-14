import 'dotenv/config';
import {createHash} from 'node:crypto';
import {existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {getReplicaProject} from '../../src/replica/projects/registry';
import type {ReplicaAudioManifest} from '../../src/replica/ReplicaVideo';

const repoRoot = process.cwd();
const args = process.argv.slice(2);
const projectArg = args.find((arg) => arg.startsWith('--project='))?.slice('--project='.length);
if (!projectArg) throw new Error('Missing --project=<slug>.');

const project = getReplicaProject(projectArg);
const generate = args.includes('--generate');
const force = args.includes('--force');
const concurrencyArg = args.find((arg) => arg.startsWith('--concurrency='))?.slice('--concurrency='.length);
const concurrencyValue = concurrencyArg === undefined ? 2 : Number(concurrencyArg);
if (!Number.isInteger(concurrencyValue) || concurrencyValue < 1 || concurrencyValue > 4) {
  throw new Error('--concurrency must be an integer from 1 to 4.');
}
const concurrency = concurrencyValue;
const allowInstructionFallback = args.includes('--allow-instruction-fallback');
const selectedScene = args.find((arg) => arg.startsWith('--scene='))?.slice('--scene='.length);
const manifestPath = path.resolve(repoRoot, project.paths.audioManifestFile);
const publicDir = path.resolve(repoRoot, project.paths.publicAudioDir);

const slugEnv = project.slug.toUpperCase().replace(/[^A-Z0-9]/g, '_');
const envValue = (name: string) =>
  process.env[`${slugEnv}_REPLICA_TTS_${name}`] ?? process.env[`REPLICA_TTS_${name}`];
const numericSetting = (name: string, fallback: number, min: number, max: number) => {
  const raw = envValue(name);
  const value = raw === undefined ? fallback : Number(raw);
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new Error(`${name} must be between ${min} and ${max}, got ${raw ?? value}.`);
  }
  return value;
};

const model = envValue('MODEL') ?? project.tts.model;
const voice = envValue('VOICE') ?? project.tts.voice;
const naturalDelivery = envValue('NATURAL') !== '0';
const defaultRate = naturalDelivery ? Math.min(project.tts.rate, 1.08) : project.tts.rate;
const rate = numericSetting('RATE', defaultRate, 0.5, 2);
const pitch = numericSetting('PITCH', project.tts.pitch, 0.5, 2);
const volume = numericSetting('VOLUME', project.tts.volume, 0, 100);
const instructionText =
  envValue('INSTRUCTION_TEXT') ??
  project.tts.instruction ??
  (naturalDelivery
    ? '像真人老师讲短视频：自然、亲切，有轻微停顿和重点强调；不要播音腔，不要机械平读。'
    : undefined);
const instructionEnabled =
  envValue('INSTRUCTION') === undefined
    ? project.tts.useInstruction || naturalDelivery
    : envValue('INSTRUCTION') !== '0';

const providerInstructionLength = (value: string) =>
  [...value].reduce((length, character) => length + (/\p{Script=Han}/u.test(character) ? 2 : 1), 0);
if (instructionEnabled && instructionText && providerInstructionLength(instructionText) > 100) {
  throw new Error('CosyVoice instruction exceeds its documented 100-character weighted limit.');
}
if (instructionEnabled && model === 'cosyvoice-v3-flash' && voice.startsWith('longanhuan')) {
  const emotions = '(?:neutral|fearful|angry|sad|surprised|happy|disgusted)';
  const scenarios = '(?:闲聊对话|比赛解说|深夜电台广播|剧情解说|诗歌朗诵|科普知识推广|产品推广|脱口秀表演)';
  const supported = new RegExp(`^(?:你说话的情感是${emotions}|你正在进行${scenarios}，你说话的情感是${emotions})。$`);
  if (!instructionText || !supported.test(instructionText)) {
    throw new Error(
      'longanhuan CosyVoice instruction must follow a documented Chinese emotion or scenario+emotion format. See the project TTS profile.',
    );
  }
}

const resolveFfprobe = () => {
  const configured = process.env.FFPROBE_PATH;
  if (configured && existsSync(configured)) return configured;
  const executable = process.platform === 'win32' ? 'ffprobe.exe' : 'ffprobe';
  const bundled = path.resolve(
    repoRoot,
    'node_modules',
    '@remotion',
    'compositor-win32-x64-msvc',
    executable,
  );
  return existsSync(bundled) ? bundled : executable;
};

const probeDuration = (filePath: string) => {
  const result = spawnSync(
    resolveFfprobe(),
    ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', filePath],
    {encoding: 'utf8', windowsHide: true},
  );
  if (result.error || result.status !== 0) {
    throw new Error(`ffprobe failed for ${filePath}: ${result.error?.message ?? result.stderr}`);
  }
  const duration = Number(result.stdout.trim());
  if (!Number.isFinite(duration) || duration <= 0) {
    throw new Error(`Invalid duration for ${filePath}: ${result.stdout.trim()}`);
  }
  return duration;
};

const readManifest = (): ReplicaAudioManifest => {
  if (!existsSync(manifestPath)) return {};
  return JSON.parse(readFileSync(manifestPath, 'utf8')) as ReplicaAudioManifest;
};

const writeManifest = (manifest: ReplicaAudioManifest) => {
  mkdirSync(path.dirname(manifestPath), {recursive: true});
  const temporary = `${manifestPath}.tmp`;
  writeFileSync(temporary, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  rmSync(manifestPath, {force: true});
  renameSync(temporary, manifestPath);
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const fetchWithRetry = async (url: string, init?: RequestInit, attempts = 4) => {
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, init);
      if (response.status < 500 && response.status !== 429) return response;
      lastError = new Error(`HTTP ${response.status}`);
      if (attempt === attempts) return response;
    } catch (error) {
      lastError = error;
    }
    await sleep(1200 * attempt);
  }
  throw lastError;
};

const synthesizeOnce = async (text: string, includeInstruction: boolean) => {
  const apiKey = process.env.DASHSCOPE_API_KEY;
  if (!apiKey) throw new Error('Missing DASHSCOPE_API_KEY in .env.');
  const endpoint =
    process.env.DASHSCOPE_TTS_ENDPOINT ??
    'https://dashscope.aliyuncs.com/api/v1/services/audio/tts/SpeechSynthesizer';

  const response = await fetchWithRetry(endpoint, {
    method: 'POST',
    headers: {Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json'},
    body: JSON.stringify({
      model,
      input: {
        text,
        voice,
        format: 'mp3',
        sample_rate: 44100,
        rate,
        pitch,
        volume,
        language_hints: ['zh'],
        ...(includeInstruction && instructionText
          ? {instruction: instructionText}
          : {}),
      },
    }),
  });

  const body = await response.text();
  let payload: any;
  try {
    payload = JSON.parse(body);
  } catch {
    throw new Error(`DashScope returned non-JSON: HTTP ${response.status}\n${body.slice(0, 1000)}`);
  }
  if (!response.ok) {
    throw new Error(`DashScope TTS failed: HTTP ${response.status}\n${JSON.stringify(payload)}`);
  }

  const audioData = payload.output?.audio?.data;
  if (audioData) return Buffer.from(audioData, 'base64');
  const audioUrl = payload.output?.audio?.url;
  if (!audioUrl) throw new Error(`DashScope response has no audio: ${JSON.stringify(payload)}`);
  // DashScope returns a plain-http OSS link; the same object is served over https, which proxied
  // (cloud) networks require.
  const audioResponse = await fetchWithRetry(audioUrl.replace(/^http:\/\//, 'https://'));
  if (!audioResponse.ok) throw new Error(`Audio download failed: HTTP ${audioResponse.status}`);
  return Buffer.from(await audioResponse.arrayBuffer());
};

const synthesize = async (text: string) => {
  if (!instructionEnabled || !instructionText) return synthesizeOnce(text, false);
  try {
    return await synthesizeOnce(text, true);
  } catch (error) {
    if (!allowInstructionFallback) {
      throw new Error(
        `TTS instruction failed and fallback is disabled. Fix the instruction or explicitly pass --allow-instruction-fallback. ${error instanceof Error ? error.message.replace(/\s+/g, ' ') : String(error)}`,
      );
    }
    console.warn(
      `TTS instruction failed; explicit fallback requested, retrying without it (${error instanceof Error ? error.message.split('\n')[0] : String(error)}).`,
    );
    return synthesizeOnce(text, false);
  }
};

const targetDuration = (scene: (typeof project.storyboard.scenes)[number]) => {
  const isFinal = Math.abs(scene.start + scene.duration - project.storyboard.duration) < 0.001;
  return Math.max(
    1 / 30,
    scene.duration - (isFinal ? project.storyboard.fadeToBlackSec : 0),
  );
};

const scenes = project.storyboard.scenes.filter(
  (scene) => !selectedScene || scene.id === selectedScene,
);
if (selectedScene && scenes.length === 0) throw new Error(`Unknown scene: ${selectedScene}.`);

console.table(
  scenes.map((scene) => ({
    id: scene.id,
    targetSec: Number(targetDuration(scene).toFixed(3)),
    narrationChars: scene.narration.length,
    output: `${project.paths.publicAudioDir}/${scene.id}.mp3`,
  })),
);
console.log(
  `Project ${project.slug}: ${project.storyboard.duration.toFixed(3)}s, ` +
    `model=${model}, voice=${voice}, rate=${rate}, naturalDelivery=${naturalDelivery}, concurrency=${concurrency}, ` +
    `instruction=${instructionEnabled ? 'strict' : 'off'}.`,
);

if (!generate) {
  console.log('Dry run only. Re-run with --generate to call DashScope.');
  process.exit(0);
}

mkdirSync(publicDir, {recursive: true});
const manifest = readManifest();
const profileHash = createHash('sha256').update(JSON.stringify({
  model,
  voice,
  rate,
  pitch,
  volume,
  instructionEnabled,
  instructionText: instructionEnabled ? instructionText : null,
})).digest('hex');

const generateScene = async (scene: (typeof scenes)[number]) => {
  const publicPath = path.resolve(publicDir, `${scene.id}.mp3`);
  const publicTemporary = `${publicPath}.tmp`;
  const textHash = createHash('sha256').update(scene.narration).digest('hex');

  if (
    !force &&
    existsSync(publicPath) &&
    manifest[scene.id]?.textHash === textHash &&
    manifest[scene.id]?.profileHash === profileHash
  ) {
    const duration = probeDuration(publicPath);
    console.log(`Skipped unchanged ${scene.id} (${duration.toFixed(3)}s).`);
    return;
  }

  if (existsSync(publicPath) && !force) {
    console.log(`Refreshing stale audio ${scene.id}; its script or TTS profile changed.`);
  }
  const bytes = await synthesize(scene.narration);
  writeFileSync(publicTemporary, bytes);
  const duration = probeDuration(publicTemporary);
  rmSync(publicPath, {force: true});
  renameSync(publicTemporary, publicPath);

  const requiredRate = duration / targetDuration(scene);
  manifest[scene.id] = {
    src: path.relative(path.resolve(repoRoot, 'public'), publicPath).replace(/\\/g, '/'),
    duration: Number(duration.toFixed(3)),
    textHash,
    profileHash,
    generatedAt: new Date().toISOString(),
  };
  writeManifest(manifest);
  console.log(
    `Generated ${scene.id}: ${duration.toFixed(3)}s -> ${targetDuration(scene).toFixed(3)}s ` +
      `(required playbackRate ${Math.max(1, requiredRate).toFixed(3)}).`,
  );
};

let cursor = 0;
const workers = Array.from({length: Math.min(concurrency, scenes.length)}, async () => {
  while (cursor < scenes.length) {
    const index = cursor++;
    await generateScene(scenes[index]);
  }
});
const workerResults = await Promise.allSettled(workers);
const failures = workerResults.filter((result): result is PromiseRejectedResult => result.status === 'rejected');
if (failures.length) {
  throw new AggregateError(failures.map((result) => result.reason), `${failures.length} TTS worker(s) failed; completed requests were allowed to finish.`);
}

console.log(`Manifest written: ${path.relative(repoRoot, manifestPath)}.`);
