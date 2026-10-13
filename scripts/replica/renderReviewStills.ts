import {mkdirSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {bundle} from '@remotion/bundler';
import {openBrowser, renderStill, selectComposition} from '@remotion/renderer';
import {getReplicaProject} from '../../src/replica/projects/registry';
import {resolveDeliveryPaths} from './deliveryPaths';
import {prepareRenderPublicDir} from './prepareRenderPublicDir';
import {browserExecutable} from './renderEnv';

const args = process.argv.slice(2);
const projectArg = args.find((arg) => arg.startsWith('--project='))?.slice('--project='.length);
if (!projectArg) throw new Error('Missing --project=<slug>.');
const project = getReplicaProject(projectArg);
const mode = args.find((arg) => arg.startsWith('--mode='))?.slice('--mode='.length) ?? 'midpoints';
const timestampsArg = args.find((arg) => arg.startsWith('--timestamps='))?.slice('--timestamps='.length);
const keyposeCuts = args.includes('--keypose-cuts');
const outputDirArg = args.find((arg) => arg.startsWith('--output-dir='))?.slice('--output-dir='.length);
const publicDirArg = args.find((arg) => arg.startsWith('--public-dir='))?.slice('--public-dir='.length);
const publicDir = publicDirArg
  ? path.resolve(process.cwd(), publicDirArg)
  : prepareRenderPublicDir(project, path.resolve('work', 'render-staging', `${project.slug}-public`)).directory;
const timestamps = timestampsArg
  ? timestampsArg.split(',').map((value) => Number(value.trim()))
  : null;
if (timestamps?.some((value) => !Number.isFinite(value) || value < 0)) {
  throw new Error('--timestamps must be a comma-separated list of non-negative seconds.');
}
if (!timestamps && mode !== 'midpoints' && mode !== 'boundaries' && mode !== 'mobile') {
  throw new Error('--mode must be midpoints, boundaries, or mobile.');
}

const fps = 30;
const reviewKind = keyposeCuts ? 'keypose-cuts' : timestamps ? 'timestamps' : mode;
const outputDir = path.resolve(outputDirArg ?? path.join(resolveDeliveryPaths(project).reviewStills, reviewKind));
mkdirSync(outputDir, {recursive: true});
const serveUrl = await bundle({
  entryPoint: path.resolve('src', 'index.ts'),
  publicDir,
  enableCaching: true,
  onProgress: () => undefined,
});
const browser = await openBrowser('chrome', {browserExecutable, logLevel: 'error'});
let sampleCount = 0;

try {
  const composition = await selectComposition({
    serveUrl,
    id: project.compositionId,
    browserExecutable,
    puppeteerInstance: browser,
    logLevel: 'error',
  });

  type ReviewSample = {id: string; seconds: number; index: number; frame?: number};
  let samples: ReviewSample[];
  if (keyposeCuts) {
    if (!project.keyposePlan) throw new Error(`${project.slug} has no keyposePlan for cut review.`);
    const plan = JSON.parse(readFileSync(path.resolve(project.keyposePlan), 'utf8')) as {
      shots: Array<{word: string; sceneId: string; states: Array<{id: string}>}>;
    };
    samples = plan.shots.flatMap((shot) => {
      const scene = project.storyboard.scenes.find((item) => item.id === shot.sceneId);
      if (!scene) throw new Error(`Key-pose review plan references missing scene ${shot.sceneId}.`);
      return shot.states.slice(1).flatMap((state) => {
        const layer = scene.layers.find(
          (item) => item.kind === 'image' && item.id === `${scene.id}-${state.id}`,
        );
        if (!layer) throw new Error(`Key-pose review layer is missing: ${scene.id}-${state.id}.`);
        const cutFrame = Math.round(scene.start * fps) + Math.round(layer.from * fps);
        return [-1, 0].map((offset) => {
          const frame = Math.min(
            project.storyboard.duration * fps - 1,
            Math.max(0, cutFrame + offset),
          );
          const side = offset < 0 ? 'before' : 'after';
          return {id: `${shot.word}-${state.id}-${side}`, frame, seconds: frame / fps, index: 0};
        });
      });
    }).map((sample, index) => ({...sample, index}));
  } else if (timestamps) {
    samples = timestamps.map((seconds, index) => ({id: `t${seconds.toFixed(3)}`, seconds, index}));
  } else {
    samples = project.storyboard.scenes.map((scene, index) => ({
        id: scene.id,
        seconds:
          mode === 'midpoints'
            ? scene.start + scene.duration * 0.55
            : mode === 'mobile'
              ? scene.start + scene.duration * 0.55
            : Math.max(scene.start, scene.start + scene.duration - 0.08),
        index,
      }));
  }
  sampleCount = samples.length;

  for (const sample of samples) {
    const {seconds, index} = sample;
    const frame = Math.min(
      composition.durationInFrames - 1,
      Math.max(0, sample.frame ?? Math.round(seconds * fps)),
    );
    const safeId = sample.id.replace(/[^a-zA-Z0-9_.-]+/g, '-');
    const filename = `${String(index + 1).padStart(2, '0')}_${safeId}_f${frame}.jpg`;
    await renderStill({
      serveUrl,
      composition,
      frame,
      output: path.resolve(outputDir, filename),
      imageFormat: 'jpeg',
      jpegQuality: 88,
      // 0.1875 renders 1920px at 360px, approximating feed-size phone legibility.
      scale: mode === 'mobile' ? 0.1875 : 0.5,
      overwrite: true,
      browserExecutable,
      puppeteerInstance: browser,
      logLevel: 'error',
    });
    console.log(`${filename}\t${seconds.toFixed(3)}s`);
  }
} finally {
  await browser.close({silent: true});
}

console.log(`Rendered ${sampleCount} ${reviewKind} stills to ${path.relative(process.cwd(), outputDir)}.`);
if (mode === 'mobile') {
  const sheetPath = path.join(outputDir, 'contact-sheet.jpg');
  const sheetScript = path.resolve('scripts/replica/buildMobileStillsSheet.py');
  const python = process.env.PYTHON ?? 'python';
  const sheet = spawnSync(
    python,
    [sheetScript, '--input-dir', outputDir, '--out', sheetPath],
    {encoding: 'utf8', windowsHide: true, env: {...process.env, PYTHONUTF8: '1'}, maxBuffer: 4 * 1024 * 1024},
  );
  if (sheet.error || sheet.status !== 0) {
    throw new Error(`Could not build mobile review contact sheet: ${sheet.error?.message ?? sheet.stderr}`);
  }
  console.log(sheet.stdout.trim());
}
