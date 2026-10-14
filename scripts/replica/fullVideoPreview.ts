import {existsSync, mkdirSync, readdirSync, rmSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {getReplicaProject} from '../../src/replica/projects/registry';
import {REPLICA_CANVAS} from '../../src/replica/theme';
import type {ReplicaLayer, ReplicaTextLayer} from '../../src/replica/types';
import {resolveDeliveryPaths} from './deliveryPaths';

const repoRoot = process.cwd();
const args = process.argv.slice(2);
const projectArg = args.find((arg) => arg.startsWith('--project='))?.slice('--project='.length);
if (!projectArg) throw new Error('Missing --project=<slug>.');
let project: ReturnType<typeof getReplicaProject> | null = null;
try {
  project = getReplicaProject(projectArg);
} catch {
  // CET and other non-replica compositions use the same preview gate but do not live in the
  // root-word registry. Their delivery folder is still deterministic: outputs/<slug>/.
  if (!existsSync(path.join(repoRoot, 'outputs', projectArg, `${projectArg}.mp4`))) throw new Error(`Unknown project: ${projectArg}`);
}
const inputArg = args.find((arg) => arg.startsWith('--input='))?.slice('--input='.length);
const intervalArg = args.find((arg) => arg.startsWith('--interval='))?.slice('--interval='.length);
const interval = intervalArg ? Number(intervalArg) : 1;
if (!Number.isFinite(interval) || interval <= 0) throw new Error('--interval must be a positive number of seconds.');
const delivery = project
  ? resolveDeliveryPaths(project, repoRoot)
  : {video: path.join(repoRoot, 'outputs', projectArg, `${projectArg}.mp4`), review: path.join(repoRoot, 'outputs', projectArg, 'review')};
const input = path.resolve(repoRoot, inputArg ?? delivery.video);
if (!existsSync(input)) throw new Error(`Rendered video is missing: ${input}`);

const outputArg = args.find((arg) => arg.startsWith('--output-dir='))?.slice('--output-dir='.length);
const outputDir = path.resolve(repoRoot, outputArg ?? path.join(delivery.review, 'full-preview'));
const framesDir = path.join(outputDir, 'frames');
mkdirSync(outputDir, {recursive: true});
if (existsSync(framesDir)) rmSync(framesDir, {recursive: true, force: true});
mkdirSync(framesDir, {recursive: true});

// Use the full system build for contact-sheet filters; Remotion's bundled build is intentionally minimal.
const ffmpeg = process.env.FFMPEG_PATH ?? 'ffmpeg';
const ffprobe = process.env.FFPROBE_PATH ?? 'ffprobe';

const run = (command: string, commandArgs: string[], encoding: BufferEncoding | null = 'utf8') => {
  const result = spawnSync(command, commandArgs, {cwd: repoRoot, encoding, windowsHide: true, maxBuffer: 16 * 1024 * 1024});
  if (result.error || result.status !== 0) {
    const detail = encoding === null ? result.stderr?.toString() : result.stderr;
    throw new Error(`${command} failed: ${result.error?.message ?? detail}`);
  }
  return result;
};

const probe = run(ffprobe, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', input]);
const duration = Number(String(probe.stdout).trim()) || project?.storyboard.duration || 0;

// A one-second timeline makes short text flashes visible while remaining quick to open on a phone.
// The bundled Remotion FFmpeg build does not expose the modern fps filter, so sample by frame number.
const sampleEvery = Math.max(1, Math.round(interval * 30));
run(ffmpeg, [
  '-hide_banner', '-loglevel', 'error', '-y', '-i', input,
  '-vf', `select='not(mod(n\\,${sampleEvery}))',scale=480:-2:flags=lanczos`, '-vsync', '0',
  '-q:v', '3', path.join(framesDir, 'frame-%06d.jpg'),
]);

// Keep a small, playable whole-video file next to the contact sheets for continuous review.
run(ffmpeg, [
  '-hide_banner', '-loglevel', 'error', '-y', '-i', input,
  '-vf', 'scale=640:-2:flags=lanczos', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '28',
  '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', path.join(outputDir, 'full-preview.mp4'),
]);

const sheetScript = path.resolve(repoRoot, 'scripts/replica/buildFullPreviewSheet.py');
run(process.env.PYTHON ?? 'python', [
  sheetScript, '--input-dir', framesDir, '--out-dir', outputDir, '--interval', String(interval),
]);

const safe = {
  left: REPLICA_CANVAS.safeLeft,
  right: REPLICA_CANVAS.width - REPLICA_CANVAS.safeRight,
  top: REPLICA_CANVAS.safeTop,
  bottom: REPLICA_CANVAS.height - 72,
};
const canvas = {left: 0, top: 0, right: REPLICA_CANVAS.width, bottom: REPLICA_CANVAS.height};
const safeTolerance = 24;

const textContent = (layer: ReplicaTextLayer) => layer.runs.map((run) => run.text).join('');
const estimateTextBox = (layer: ReplicaTextLayer) => {
  const width = layer.width ?? layer.maxWidth ?? (REPLICA_CANVAS.width - layer.x);
  const fontSize = layer.fontSize;
  const lineHeight = layer.lineHeight ?? 1.25;
  const content = textContent(layer);
  const explicitLines = content.split(/\r?\n/);
  const lines = explicitLines.reduce((sum, line) => {
    if (layer.whiteSpace === 'nowrap') return sum + 1;
    let measured = 0;
    for (const character of line) measured += /[\u0000-\u00ff]/.test(character) ? fontSize * 0.56 : fontSize;
    return sum + Math.max(1, Math.ceil(measured / Math.max(1, width)));
  }, 0);
  return {x: layer.x, y: layer.y, width, height: Math.ceil(lines * fontSize * lineHeight + 6), lines, content};
};

type LayoutIssue = {
  scene: string;
  layer: string;
  kind: string;
  box: {x: number; y: number; width: number; height: number};
  message: string;
};
const issues: LayoutIssue[] = [];
const boxes: Array<LayoutIssue & {severity: 'warning' | 'error'}> = [];
for (const scene of project?.storyboard.scenes ?? []) {
  const scenePlan = project?.continuousStage?.scenePlans?.[scene.id];
  for (const layer of scene.layers) {
    const rawBox = layer.kind === 'text'
      ? estimateTextBox(layer)
      : {x: layer.x, y: layer.y, width: layer.width ?? 0, height: layer.height ?? 0};
    const layoutShift = scenePlan?.layout === 'text-right' && layer.kind === 'text' && layer.x < REPLICA_CANVAS.width / 2 ? 760 : 0;
    const box = {...rawBox, x: rawBox.x + layoutShift};
    if (!box.width || !box.height) continue;
    const leftOverflow = box.x < safe.left;
    const rightOverflow = box.x + box.width > safe.right;
    const topOverflow = box.y < safe.top;
    const bottomOverflow = box.y + box.height > safe.bottom;
    const canvasOverflow = box.x < canvas.left || box.y < canvas.top ||
      box.x + box.width > canvas.right || box.y + box.height > canvas.bottom;
    const severeSafeOverflow = box.x < safe.left - safeTolerance ||
      box.x + box.width > safe.right + safeTolerance ||
      box.y < safe.top - safeTolerance ||
      box.y + box.height > safe.bottom + safeTolerance;
    if (leftOverflow || rightOverflow || topOverflow || bottomOverflow || canvasOverflow) {
      const directions = [
        leftOverflow && 'left', rightOverflow && 'right', topOverflow && 'top', bottomOverflow && 'bottom',
      ].filter(Boolean).join(', ');
      const issue = {
        scene: scene.id,
        layer: layer.id,
        kind: layer.kind,
        box: {x: box.x, y: box.y, width: box.width, height: box.height},
        message: `content crosses ${directions} safe margin`,
      } satisfies LayoutIssue;
      issues.push(issue);
      boxes.push({
        ...issue,
        // Art may intentionally use the outer half of a teaching zone. Text is the
        // fail-closed case; canvas clipping is an error for either kind.
        severity: canvasOverflow || (layer.kind === 'text' && severeSafeOverflow) ? 'error' : 'warning',
      });
    }
  }
}

const frames = readdirSync(framesDir).filter((file) => file.endsWith('.jpg')).length;
const report = {
  project: projectArg,
  input: path.relative(repoRoot, input).replace(/\\/g, '/'),
  durationSeconds: duration,
  intervalSeconds: interval,
  sampledFrames: frames,
  previewVideo: path.relative(repoRoot, path.join(outputDir, 'full-preview.mp4')).replace(/\\/g, '/'),
  contactSheets: path.relative(repoRoot, outputDir).replace(/\\/g, '/') + '/full-preview-contact-*.jpg',
  safeArea: safe,
  layoutIssues: issues,
  layoutErrors: boxes.filter((item) => item.severity === 'error'),
  layoutWarnings: boxes.filter((item) => item.severity === 'warning'),
  manualReviewRequired: [
    '打开 full-preview.mp4 连续观看整片。',
    '逐页查看 full-preview-contact-*.jpg，重点看文字溢出、大片空白、图文失衡和关键帧切换。',
    '手机尺寸检查字幕和词义；发现问题后修订 storyboard，再重新渲染并重复本闸门。',
  ],
};
const reportPath = path.join(outputDir, 'full-preview-report.json');
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

if (boxes.some((issue) => issue.severity === 'error' && issue.kind === 'text')) {
  for (const issue of boxes.filter((item) => item.severity === 'error' && item.kind === 'text')) {
    console.error(`ERROR: ${issue.scene}/${issue.layer}: ${issue.message} (${JSON.stringify(issue.box)})`);
  }
  console.error(`Full-video preview report: ${path.relative(repoRoot, reportPath)}`);
  process.exit(1);
}
console.log(`Full-video preview ready: ${path.relative(repoRoot, path.join(outputDir, 'full-preview.mp4'))}`);
console.log(`Contact sheets: ${path.relative(repoRoot, outputDir)}/full-preview-contact-*.jpg (${frames} frames, ${interval}s interval).`);
console.log(`Layout gate passed; report: ${path.relative(repoRoot, reportPath)}.`);
