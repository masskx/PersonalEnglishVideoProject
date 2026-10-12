import {existsSync, mkdirSync, writeFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {getReplicaProject} from '../../src/replica/projects/registry';
import type {ReplicaImageLayer} from '../../src/replica/types';

const args = process.argv.slice(2);
const projectArg = args.find((arg) => arg.startsWith('--project='))?.slice(10);
if (!projectArg) throw new Error('Missing --project=<slug>.');
const project = getReplicaProject(projectArg);
const root = process.cwd();
// The Remotion-minimal ffmpeg build omits overlay; use the system full build for plate compositing.
const ffmpeg = process.env.FFMPEG_PATH ?? 'ffmpeg';

const workDir = path.resolve(root, 'work', 'wan-white', project.slug);
const inputsDir = path.join(workDir, 'inputs');
const tasksDir = path.join(workDir, 'tasks');
mkdirSync(inputsDir, {recursive: true});
mkdirSync(tasksDir, {recursive: true});

const candidates = project.storyboard.scenes.flatMap((scene) => {
  if (scene.id.includes('map') || scene.id === 'example-sentences' || scene.id === 'final-summary') return [];
  const image = scene.layers.find((layer): layer is ReplicaImageLayer => layer.kind === 'image');
  return image ? [{scene, image}] : [];
});

const entries = candidates.map(({scene, image}, index) => {
  const source = path.resolve(root, 'public', image.src);
  if (!existsSync(source)) throw new Error(`Static source missing for ${scene.id}: ${source}`);
  const input = path.join(inputsDir, `${scene.id}.png`);
  const result = spawnSync(
    ffmpeg,
    [
      '-y', '-v', 'error',
      '-f', 'lavfi', '-i', 'color=c=white:s=1664x928:r=1',
      '-i', source,
      '-filter_complex',
      '[1:v]scale=1450:800:force_original_aspect_ratio=decrease[art];[0:v][art]overlay=x=(W-w)/2:y=(H-h)/2:format=auto,format=rgb24',
      '-frames:v', '1', input,
    ],
    {encoding: 'utf8', windowsHide: true},
  );
  if (result.error || result.status !== 0 || !existsSync(input)) {
    throw new Error(`White plate failed for ${scene.id}: ${result.error?.message ?? result.stderr}`);
  }
  const filename = path.basename(image.src);
  const illustration = project.illustrations.find((item) => item.filename === filename);
  const action = (illustration?.subject ?? scene.narration)
    .replace(/[^.]*\b(?:chroma|flat-green|green plate|green background)\b[^.]*\./gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const prompt = [
    'Locked camera. One continuous natural five-second action at normal speed.',
    action,
    'The same single solid-black character actively performs the action with the same props.',
    'Preserve the exact character identity, two white dot eyes, thin complete limbs, prop count, composition, and sparse black hand-drawn line style.',
    'The background must remain perfectly uniform pure white from edge to edge for the entire clip.',
    'No floor, shadow, scenery, texture, gradient, border, panel, text, logo, extra character, extra limb, camera movement, cut, fade, morph, or object replacement.',
    'Begin with anticipation, complete one readable semantic action, then settle.',
  ].join(' ');
  return {
    id: scene.id,
    index,
    imageLayerId: image.id,
    source: path.relative(root, source).replaceAll('\\', '/'),
    input: path.relative(root, input).replaceAll('\\', '/'),
    taskManifest: path.relative(root, path.join(tasksDir, `${scene.id}.task.json`)).replaceAll('\\', '/'),
    framesDir: `public/assets/replica/${project.slug}-white-motion/frames/${scene.id}`,
    report: `work/wan-white/${project.slug}/reports/${scene.id}.white-report.json`,
    prompt,
  };
});

const plan = {
  schemaVersion: 1,
  project: project.slug,
  model: 'wan2.2-i2v-flash',
  resolution: '480P',
  durationSec: 5,
  fps: 30,
  estimatedCostCny: Number((entries.length * 0.5).toFixed(2)),
  entries,
};
const planPath = path.join(workDir, 'plan.json');
writeFileSync(planPath, `${JSON.stringify(plan, null, 2)}\n`, 'utf8');
console.log(`Prepared ${entries.length} white Wan inputs for ${project.slug}.`);
console.log(`Estimated list cost: CNY ${plan.estimatedCostCny.toFixed(2)}.`);
console.log(`Plan: ${path.relative(root, planPath)}.`);
