import {config as loadDotenv} from 'dotenv';
import {existsSync, mkdirSync, renameSync, statSync, writeFileSync} from 'node:fs';
import {homedir} from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {getReplicaProject} from '../../src/replica/projects/registry';
import {verifyPressReplicaAsset} from './assetVerifier';
import {generateOpenAICompatibleImage} from './imageRelayClient';
import {normalizeImageSource} from './imageSourceNormalizer';

// Credentials live in this repository's gitignored .env. REPLICA_IMAGE_ENV_FILE remains a
// backwards-compatible escape hatch for old machines, but the current project no longer needs it.
loadDotenv();
if (process.env.REPLICA_IMAGE_ENV_FILE) {
  loadDotenv({path: process.env.REPLICA_IMAGE_ENV_FILE, override: false});
}

const args = process.argv.slice(2);
const projectArg = args.find((arg) => arg.startsWith('--project='))?.slice('--project='.length);
if (!projectArg) throw new Error('Missing --project=<slug>.');
const project = getReplicaProject(projectArg);
const generate = args.includes('--generate');
const force = args.includes('--force');
const reprocess = args.includes('--reprocess');
const onlyArg = args.find((arg) => arg.startsWith('--only='))?.slice('--only='.length);
const selected = onlyArg
  ? new Set(onlyArg.split(',').map((value) => value.trim()).filter(Boolean))
  : null;
const shots = project.illustrations.filter(
  (shot) => !selected || selected.has(shot.id) || selected.has(shot.filename),
);
if (shots.length === 0) throw new Error('No illustration prompts matched --only.');

const repoRoot = process.cwd();
const greenDir = path.resolve(repoRoot, project.paths.greenSourceDir);
const alphaDir = path.resolve(repoRoot, project.paths.alphaAssetDir);
const chromaScript =
  process.env.REPLICA_CHROMA_KEY_SCRIPT ??
  path.resolve(repoRoot, 'scripts', 'replica', 'removeGeneratedPlate.py');
const bundledPython = path.resolve(
  homedir(),
  '.cache',
  'codex-runtimes',
  'codex-primary-runtime',
  'dependencies',
  'python',
  'python.exe',
);
const python = process.env.PYTHON ?? (existsSync(bundledPython) ? bundledPython : 'python');
const bundledFfmpeg = path.resolve(
  repoRoot,
  'node_modules',
  '@remotion',
  'compositor-win32-x64-msvc',
  'ffmpeg.exe',
);
const ffmpeg =
  process.env.FFMPEG_PATH ??
  (process.platform === 'win32' && existsSync(bundledFfmpeg) ? bundledFfmpeg : 'ffmpeg');
const bundledFfprobe = path.resolve(
  repoRoot,
  'node_modules',
  '@remotion',
  'compositor-win32-x64-msvc',
  process.platform === 'win32' ? 'ffprobe.exe' : 'ffprobe',
);
const ffprobe = process.env.FFPROBE_PATH ?? (existsSync(bundledFfprobe) ? bundledFfprobe : 'ffprobe');
const sourceExtensions = ['.png', '.jpg', '.webp'] as const;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const relative = (filePath: string) => path.relative(repoRoot, filePath).replace(/\\/g, '/');
const greenCandidates = (filename: string) => {
  const basename = filename.replace(/\.png$/i, '');
  return sourceExtensions.map((extension) => path.resolve(greenDir, `${basename}${extension}`));
};
const existingGreen = (filename: string) =>
  greenCandidates(filename).find((candidate) => existsSync(candidate) && statSync(candidate).size > 0);

const imageExtension = (bytes: Buffer): (typeof sourceExtensions)[number] => {
  if (bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    return '.png';
  }
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return '.jpg';
  }
  if (
    bytes.length >= 12 &&
    bytes.toString('ascii', 0, 4) === 'RIFF' &&
    bytes.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return '.webp';
  }
  throw new Error('Image API returned an unsupported image format.');
};

const fetchWithRetry = async (url: string, init?: RequestInit, attempts = 5) => {
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
    await sleep(1800 * attempt);
  }
  throw lastError;
};

const downloadImage = async (url: string) => {
  const response = await fetchWithRetry(url);
  if (!response.ok) throw new Error(`Image download failed: HTTP ${response.status}.`);
  return Buffer.from(await response.arrayBuffer());
};

const imageProvider = (process.env.REPLICA_IMAGE_PROVIDER ?? 'huoshan').trim().toLowerCase();

const parseJson = (body: string, status: number) => {
  try {
    return JSON.parse(body);
  } catch {
    throw new Error(`Image generation returned non-JSON: HTTP ${status}\n${body.slice(0, 1000)}`);
  }
};

const generateHuoshanImage = async (prompt: string) => {
  const apiKey = process.env.HUOSHAN_API_KEY;
  if (!apiKey) throw new Error('Missing HUOSHAN_API_KEY in .env.');
  const endpoint =
    process.env.HUOSHAN_ARK_IMAGE_ENDPOINT ??
    process.env.HUOSHAN_IMAGE_ENDPOINT ??
    'https://ark.cn-beijing.volces.com/api/v3/images/generations';
  const response = await fetchWithRetry(endpoint, {
    method: 'POST',
    headers: {Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json'},
    body: JSON.stringify({
      model: process.env.HUOSHAN_IMAGE_MODEL ?? project.image.model,
      prompt,
      negative_prompt: project.image.negativePrompt,
      size: process.env.HUOSHAN_IMAGE_SIZE ?? project.image.size,
      response_format: 'url',
      watermark: false,
      sequential_image_generation: 'disabled',
    }),
  });
  const body = await response.text();
  const payload = parseJson(body, response.status);
  if (!response.ok) {
    throw new Error(`Image generation failed: HTTP ${response.status}\n${JSON.stringify(payload)}`);
  }
  if (payload.data?.[0]?.b64_json) return Buffer.from(payload.data[0].b64_json, 'base64');
  if (payload.data?.[0]?.url) return downloadImage(payload.data[0].url);
  throw new Error(`Image response has no image data: ${JSON.stringify(payload)}`);
};

const generateOpenAIImage = async (prompt: string) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('Missing OPENAI_API_KEY for the OpenAI-compatible image relay.');

  const baseUrl = (process.env.OPENAI_BASE_URL ?? 'https://api.openai.com/v1').replace(/\/+$/, '');
  const model = process.env.OPENAI_IMAGE_MODEL ?? 'gpt-image-2';
  const size = process.env.OPENAI_IMAGE_SIZE ?? (project.image.size === '2K' ? '2048x1152' : '1024x576');
  const quality = process.env.OPENAI_IMAGE_QUALITY ?? (project.image.size === '2K' ? 'high' : 'medium');
  return generateOpenAICompatibleImage({
    baseUrl,
    apiKey,
    model,
    prompt: `${prompt}\n\nDo not include: ${project.image.negativePrompt}`,
    size,
    quality,
  });
};

const generateImage = async (prompt: string) => {
  if (imageProvider === 'openai' || imageProvider === 'images2' || imageProvider === 'openai-compatible') {
    return generateOpenAIImage(prompt);
  }
  if (imageProvider === 'huoshan' || imageProvider === 'seedream' || imageProvider === 'doubao') {
    return generateHuoshanImage(prompt);
  }
  throw new Error(`Unsupported REPLICA_IMAGE_PROVIDER=${imageProvider}. Use huoshan or openai.`);
};

const removeChroma = (input: string, output: string) => {
  if (!existsSync(chromaScript)) throw new Error(`Chroma helper not found: ${chromaScript}.`);
  const result = spawnSync(
    python,
    [
      chromaScript,
      '--input',
      input,
      '--out',
      output,
      '--force',
    ],
    {cwd: repoRoot, encoding: 'utf8', windowsHide: true},
  );
  if (result.error || result.status !== 0) {
    throw new Error(`Plate removal failed for ${relative(input)}:\n${result.error?.message ?? result.stderr}`);
  }
};

// Generated subjects occasionally fill too much of the canvas. Scale the complete RGBA image
// down on a transparent pad so the visual metaphor remains readable and passes the coverage gate.
const fitAlphaToCanvas = (alphaPath: string) => {
  const temporary = `${alphaPath}.fit.png`;
  const result = spawnSync(
    ffmpeg,
    [
      '-hide_banner',
      '-loglevel',
      'error',
      '-y',
      '-i',
      alphaPath,
      '-vf',
      'scale=iw*0.82:ih*0.82:flags=lanczos,pad=ceil(iw/0.82/2)*2:ceil(ih/0.82/2)*2:(ow-iw)/2:(oh-ih)/2:color=black@0',
      '-frames:v',
      '1',
      '-c:v',
      'png',
      '-pix_fmt',
      'rgba',
      temporary,
    ],
    {cwd: repoRoot, encoding: 'utf8', windowsHide: true},
  );
  if (result.error || result.status !== 0) {
    throw new Error(`Alpha fit failed for ${relative(alphaPath)}:\n${result.error?.message ?? result.stderr}`);
  }
  renameSync(temporary, alphaPath);
};

if (!generate) {
  console.log(`Project: ${project.slug}`);
  console.log(`Mode: dry-run (no API request or file write)`);
  const model = imageProvider === 'openai' || imageProvider === 'images2' || imageProvider === 'openai-compatible'
    ? process.env.OPENAI_IMAGE_MODEL ?? 'gpt-image-2'
    : process.env.HUOSHAN_IMAGE_MODEL ?? project.image.model;
  const size = imageProvider === 'openai' || imageProvider === 'images2' || imageProvider === 'openai-compatible'
    ? process.env.OPENAI_IMAGE_SIZE ?? (project.image.size === '2K' ? '2048x1152' : '1024x576')
    : process.env.HUOSHAN_IMAGE_SIZE ?? project.image.size;
  console.log(`Image provider: ${imageProvider}`);
  console.log(`Model: ${model}, size: ${size}`);
  console.log(`Green sources: ${project.paths.greenSourceDir}`);
  console.log(`Alpha outputs: ${project.paths.alphaAssetDir}`);
  for (const shot of shots) {
    console.log(`\n[${shot.id}] ${shot.filename} - ${shot.purpose}\n${shot.prompt}`);
  }
  process.exit(0);
}

mkdirSync(greenDir, {recursive: true});
mkdirSync(alphaDir, {recursive: true});
for (const shot of shots) {
  const alphaPath = path.resolve(alphaDir, shot.filename);
  if (!force && !reprocess && existsSync(alphaPath) && statSync(alphaPath).size > 0) {
    const verification = verifyPressReplicaAsset(alphaPath);
    if (verification.ok) {
      console.log(`Skipped verified ${relative(alphaPath)}.`);
      continue;
    }
    throw new Error(
      `Existing ${relative(alphaPath)} failed QA (${verification.errors.join('; ')}). Use --force.`,
    );
  }

  let greenPath = !force ? existingGreen(shot.filename) : undefined;
  if (!greenPath) {
    console.log(`Generating ${shot.id} through ${imageProvider}...`);
    const bytes = await generateImage(shot.prompt);
    const extension = imageExtension(bytes);
    greenPath = path.resolve(greenDir, shot.filename.replace(/\.png$/i, extension));
    writeFileSync(greenPath, bytes);
    console.log(`Saved ${relative(greenPath)} (${bytes.length} bytes).`);
  } else {
    console.log(`Using existing green source ${relative(greenPath)}.`);
  }

  const sourceForMatte = normalizeImageSource({input: greenPath, ffmpeg, ffprobe});
  removeChroma(sourceForMatte, alphaPath);
  let verification = verifyPressReplicaAsset(alphaPath);
  // Only shrink an oversized subject. A tiny/empty cutout must be regenerated, not
  // padded again; shrinking it would make the failure strictly worse and can trigger
  // the Windows ffmpeg pad parser on an unnecessary retry.
  if (!verification.ok && verification.errors.some((error) => error.includes('subject coverage') && error.includes('too large'))) {
    fitAlphaToCanvas(alphaPath);
    verification = verifyPressReplicaAsset(alphaPath);
  }
  if (!verification.ok) {
    throw new Error(`QA failed for ${relative(alphaPath)}: ${verification.errors.join('; ')}.`);
  }
  const metrics = verification.metrics!;
  console.log(
    `Verified ${relative(alphaPath)}: ${metrics.width}x${metrics.height}, ` +
      `coverage ${(metrics.subjectCoverage * 100).toFixed(2)}%, ` +
      `green ${(metrics.greenResidualRatio * 100).toFixed(3)}%.`,
  );
}

console.log(`Completed ${shots.length} ${project.slug} illustration assets.`);
