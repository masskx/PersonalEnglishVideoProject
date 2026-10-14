import {config as loadDotenv} from 'dotenv';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {getReplicaProject} from '../../src/replica/projects/registry';
import {verifyPressReplicaAsset} from './assetVerifier';
import {generateOpenAICompatibleImage} from './imageRelayClient';
import {normalizeImageSource} from './imageSourceNormalizer';

loadDotenv();
if (process.env.REPLICA_IMAGE_ENV_FILE) {
  loadDotenv({path: process.env.REPLICA_IMAGE_ENV_FILE, override: false});
}

const repoRoot = process.cwd();
const project = getReplicaProject('mit-miss');
const shot = project.illustrations.find((item) => item.id === '00_send_hook');
if (!shot) throw new Error('mit-miss hook illustration prompt is missing.');

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) throw new Error('Missing OPENAI_API_KEY for the Images2 relay.');

const baseUrl = (process.env.OPENAI_BASE_URL ?? 'https://api.openai.com/v1').replace(/\/+$/, '');
const model = process.env.OPENAI_IMAGE_MODEL ?? 'gpt-image-2';
const size = process.env.OPENAI_IMAGE_SIZE ?? '2048x1152';
const quality = process.env.OPENAI_IMAGE_QUALITY ?? 'high';
const outputDir = path.resolve(repoRoot, 'work', 'experiments', 'images2-relay-test');
const sourcePath = path.join(outputDir, '00_send_hook-source.png');
const alphaPath = path.join(outputDir, '00_send_hook-alpha.png');
const reportPath = path.join(outputDir, 'report.json');
const reuseSource = process.argv.includes('--reuse-source');
const chromaScript = path.resolve(repoRoot, 'scripts', 'replica', 'removeGeneratedPlate.py');
const bundledFfmpeg = path.resolve(repoRoot, 'node_modules', '@remotion', 'compositor-win32-x64-msvc', 'ffmpeg.exe');
const bundledFfprobe = path.resolve(repoRoot, 'node_modules', '@remotion', 'compositor-win32-x64-msvc', 'ffprobe.exe');
const ffmpeg = process.env.FFMPEG_PATH ?? (process.platform==='win32'&&existsSync(bundledFfmpeg) ? bundledFfmpeg : 'ffmpeg');
const ffprobe = process.env.FFPROBE_PATH ?? (process.platform==='win32'&&existsSync(bundledFfprobe) ? bundledFfprobe : 'ffprobe');

console.log(`Calling Images2 relay: ${model}, ${size}, quality=${quality}`);
const bytes = reuseSource && existsSync(sourcePath)
  ? readFileSync(sourcePath)
  : await generateOpenAICompatibleImage({
      baseUrl,
      apiKey,
      model,
      prompt: `${shot.prompt}\n\nDo not include: ${project.image.negativePrompt}`,
      size,
      quality,
    });
console.log(`${reuseSource ? 'Reusing' : 'Received'} Images2 image (${bytes.length} bytes).`);

mkdirSync(outputDir, {recursive: true});
writeFileSync(sourcePath, bytes);
const sourceForMatte = normalizeImageSource({input: sourcePath, ffmpeg, ffprobe});
const python = process.env.PYTHON ?? 'python';
const matte = spawnSync(
  python,
  [chromaScript, '--input', sourceForMatte, '--out', alphaPath, '--force'],
  {cwd: repoRoot, encoding: 'utf8', windowsHide: true},
);
if (matte.error || matte.status !== 0) {
  throw new Error(`Images2 test去绿失败：${matte.error?.message ?? matte.stderr}`);
}

const verification = existsSync(alphaPath)
  ? verifyPressReplicaAsset(alphaPath)
  : {ok: false, errors: ['Alpha output was not created.']};
const report = {
  generatedAt: new Date().toISOString(),
  provider: 'openai-compatible-relay',
  model,
  size,
  quality,
  promptId: shot.id,
  source: path.relative(repoRoot, sourcePath).replace(/\\/g, '/'),
  alpha: path.relative(repoRoot, alphaPath).replace(/\\/g, '/'),
  verification,
};
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

console.log('Images2 test response: image received');
console.log(`Source: ${report.source}`);
console.log(`Alpha: ${report.alpha}`);
console.log(`QA: ${verification.ok ? 'PASS' : 'FAIL'}`);
if (verification.metrics) {
  console.log(
    `Metrics: ${verification.metrics.width}x${verification.metrics.height}, ` +
      `coverage ${(verification.metrics.subjectCoverage * 100).toFixed(2)}%, ` +
      `green ${(verification.metrics.greenResidualRatio * 100).toFixed(3)}%`,
  );
}
if (!verification.ok) {
  console.error(verification.errors.join('\n'));
  process.exit(1);
}
