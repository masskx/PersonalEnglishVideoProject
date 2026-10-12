import {existsSync, mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync} from 'node:fs';
import path from 'node:path';
import {homedir} from 'node:os';
import {spawnSync} from 'node:child_process';
import {getReplicaProject} from '../../src/replica/projects/registry';
import {resolveDeliveryPaths} from './deliveryPaths';

const repoRoot = process.cwd();
const args = process.argv.slice(2);
const projectArg = args.find((arg) => arg.startsWith('--project='))?.slice('--project='.length);
if (!projectArg) throw new Error('Missing --project=<slug>.');
const project = getReplicaProject(projectArg);
if (!project.keyposePlan) throw new Error(`${project.slug} has no keyposePlan.`);
const inputArg = args.find((arg) => arg.startsWith('--input='))?.slice('--input='.length);
const outputArg = args.find((arg) => arg.startsWith('--output-dir='))?.slice('--output-dir='.length);
const input = path.resolve(repoRoot, inputArg ?? resolveDeliveryPaths(project, repoRoot).video);
if (!existsSync(input)) throw new Error(`Final MP4 is missing: ${input}`);

const plan = JSON.parse(readFileSync(path.resolve(repoRoot, project.keyposePlan), 'utf8')) as {
  shots: Array<{word: string; sceneId: string; states: Array<{id: string}>}>;
};
const fps = 30;
const transitions = plan.shots.flatMap((shot) => {
  const scene = project.storyboard.scenes.find((item) => item.id === shot.sceneId);
  if (!scene) throw new Error(`Key-pose plan references missing scene ${shot.sceneId}.`);
  return shot.states.slice(1).map((state) => {
    const layer = scene.layers.find(
      (item) => item.kind === 'image' && item.id === `${scene.id}-${state.id}`,
    );
    if (!layer) throw new Error(`Key-pose layer is missing: ${scene.id}-${state.id}.`);
    return {
      word: shot.word,
      state: state.id,
      cutFrame: Math.round(scene.start * fps) + Math.round(layer.from * fps),
    };
  });
});
const samples = transitions.flatMap((transition) => [
  {...transition, side: 'before', frame: transition.cutFrame - 1},
  {...transition, side: 'after', frame: transition.cutFrame},
]);
if (!samples.length) throw new Error('No key-pose transitions found in the plan.');

const outputDir = path.resolve(
  repoRoot,
  outputArg ?? path.join(resolveDeliveryPaths(project, repoRoot).reviewStills, 'keypose-cuts-encoded'),
);
mkdirSync(outputDir, {recursive: true});
const tempDir = mkdtempSync(path.join(outputDir, '.extract-'));
const ffmpegCandidates = [process.env.FFMPEG_PATH, 'ffmpeg'].filter((value): value is string => Boolean(value));
const ffmpeg = ffmpegCandidates.find((candidate) => {
  const filters = spawnSync(candidate, ['-hide_banner', '-filters'], {
    encoding: 'utf8', windowsHide: true, maxBuffer: 8 * 1024 * 1024,
  });
  return !filters.error && filters.status === 0 && /\bselect\b/.test(`${filters.stdout}\n${filters.stderr}`);
});
if (!ffmpeg) throw new Error('A full FFmpeg build with the select filter is required; set FFMPEG_PATH.');
const selects = samples.map((sample) => `eq(n\\,${sample.frame})`).join('+');
const pattern = path.join(tempDir, 'frame-%03d.png');
const extract = spawnSync(
  ffmpeg,
  ['-hide_banner', '-loglevel', 'error', '-i', input, '-vf', `select='${selects}'`, '-vsync', '0', pattern],
  {encoding: 'utf8', windowsHide: true, maxBuffer: 4 * 1024 * 1024},
);
if (extract.error || extract.status !== 0) {
  rmSync(tempDir, {recursive: true, force: true});
  throw new Error(`Could not extract encoded key-pose cuts: ${extract.error?.message ?? extract.stderr}`);
}

try {
  samples.forEach((sample, index) => {
    const source = path.join(tempDir, `frame-${String(index + 1).padStart(3, '0')}.png`);
    if (!existsSync(source)) throw new Error(`MP4 did not yield selected frame ${sample.frame}.`);
    const target = path.join(
      outputDir,
      `${String(index + 1).padStart(2, '0')}_${sample.word}-${sample.state}-${sample.side}_f${sample.frame}.png`,
    );
    if (existsSync(target)) rmSync(target, {force: true});
    renameSync(source, target);
  });
} finally {
  rmSync(tempDir, {recursive: true, force: true});
}

const python = process.env.PYTHON ?? path.resolve(
  homedir(),
  '.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe',
);
const sheetScript = path.resolve(repoRoot, 'scripts/replica/buildEncodedKeyposeCutSheet.py');
const sheetPath = path.join(outputDir, 'contact-sheet.png');
const sheet = spawnSync(
  existsSync(python) ? python : 'python',
  [sheetScript, '--plan', path.resolve(repoRoot, project.keyposePlan), '--frames-dir', outputDir, '--out', sheetPath],
  {encoding: 'utf8', windowsHide: true, env: {...process.env, PYTHONUTF8: '1'}, maxBuffer: 4 * 1024 * 1024},
);
if (sheet.error || sheet.status !== 0 || !existsSync(sheetPath)) {
  throw new Error(`Could not build key-pose cut contact sheet: ${sheet.error?.message ?? sheet.stderr}`);
}
console.log(`Extracted ${samples.length} encoded cut frames from ${path.relative(repoRoot, input)}.`);
console.log(`Contact sheet: ${path.relative(repoRoot, sheetPath)}.`);
