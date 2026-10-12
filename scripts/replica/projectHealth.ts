import {existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {replicaProjects} from '../../src/replica/projects/registry';
import {resolveDeliveryPaths} from './deliveryPaths';

const root = process.cwd();
const errors: string[] = [];
const notes: string[] = [];
const checked = new Set<string>();
const requireFile = (file: string) => {
  if (checked.has(file)) return;
  checked.add(file);
  if (!existsSync(file) || !statSync(file).isFile() || statSync(file).size === 0) errors.push(`Missing/empty file: ${path.relative(root, file)}`);
};
const runtimeFile = (file: string) => requireFile(path.resolve(root, 'public', file));
const persistentWorkflowFiles = [
  'AGENTS.md',
  'docs/当前制作基准.md',
  'docs/新会话制作入口.md',
  'docs/选题与自动制作规则.md',
  'planning/production-defaults.json',
  '.agents/skills/make-xiaohei-english-video/SKILL.md',
  '.agents/skills/build-root-word-video/SKILL.md',
];
for (const file of persistentWorkflowFiles) requireFile(path.resolve(root, file));
try {
  const defaults = JSON.parse(readFileSync(path.join(root, 'planning/production-defaults.json'), 'utf8')) as {
    schemaVersion?: number;
    requestDecision?: {concreteTopic?: string; columnOnly?: string};
    currentProductionBaseline?: string;
    currentAcceptedSample?: string;
    visualReferenceSample?: string;
    visualBaseline?: {reference?: string; reviewVideo?: string; fullCanvasSvgOverlay?: boolean};
    delivery?: {autoPublish?: boolean; required?: string[]};
  };
  if (defaults.schemaVersion !== 1) errors.push('Unsupported production-defaults schemaVersion.');
  if (defaults.currentProductionBaseline !== 'docs/当前制作基准.md') errors.push('Production defaults must point to the current production baseline.');
  if (!defaults.requestDecision?.concreteTopic || !defaults.requestDecision?.columnOnly) errors.push('Production request decision rules are incomplete.');
  if (defaults.visualBaseline?.fullCanvasSvgOverlay !== false) errors.push('Production defaults must keep full-canvas SVG overlays disabled.');
  if (defaults.delivery?.autoPublish !== false) errors.push('Production defaults must not auto-publish.');
  for (const file of [defaults.visualBaseline?.reference, defaults.visualBaseline?.reviewVideo].filter((value): value is string => Boolean(value))) {
    requireFile(path.resolve(root, file));
  }
  for (const file of [defaults.currentProductionBaseline, defaults.currentAcceptedSample, defaults.visualReferenceSample].filter((value): value is string => Boolean(value))) {
    requireFile(path.resolve(root, file));
  }
  for (const required of ['video', 'coverPortrait', 'coverLandscape', 'publishCopy', 'workbenchRefresh']) {
    if (!defaults.delivery?.required?.includes(required)) errors.push(`Production defaults missing required delivery: ${required}`);
  }
} catch (error) {
  errors.push(`Invalid planning/production-defaults.json: ${String(error)}`);
}
let conflicts = 0;
let pending = 0;
const dynamicDirectories = new Set<string>();
for (const project of replicaProjects) {
  try {
    const delivery = resolveDeliveryPaths(project, root);
    for (const file of [delivery.video, delivery.cover, delivery.landscapeCover, delivery.publishCopy, delivery.release, delivery.contentQa]) requireFile(file);
    if (existsSync(path.join(delivery.directory, 'draft.mp4'))) errors.push(`Draft is in the delivery folder: ${project.slug}`);
    if (existsSync(delivery.release)) {
      const release = JSON.parse(readFileSync(delivery.release, 'utf8'));
      if ((release.status === 'published') !== (delivery.directory === delivery.publishedDirectory)) conflicts++;
    }
    if (!existsSync(delivery.contentQa) || /待核对|待人工核对|\[ \]/.test(readFileSync(delivery.contentQa, 'utf8'))) pending++;
    runtimeFile(project.backgroundMusic.src);
    for (const audio of Object.values(project.audioManifest)) runtimeFile(audio.src);
    for (const illustration of project.illustrations) requireFile(path.resolve(root, project.paths.alphaAssetDir, illustration.filename));
    for (const scene of project.storyboard.scenes) {
      for (const layer of scene.layers) if (layer.kind === 'image') runtimeFile(layer.src);
      for (const cue of scene.sfx ?? []) runtimeFile(`assets/sfx/${cue.name}.mp3`);
    }
    for (const directory of Object.values(project.continuousStage?.dynamicAssets ?? {})) dynamicDirectories.add(directory);
  } catch (error) { errors.push(`${project.slug}: ${String(error)}`); }
}
// The specialized JECT stage owns six directories outside generic project dynamicAssets.
const jectSource = readFileSync(path.join(root, 'src/replica/JectContinuousStage.tsx'), 'utf8');
for (const match of jectSource.matchAll(/['"](assets\/replica\/ject-motion\/frames\/[^'"]+)['"]/g)) dynamicDirectories.add(match[1]);
for (const directory of dynamicDirectories) {
  for (let frame = 0; frame < 150; frame++) runtimeFile(`${directory}/${String(frame).padStart(6, '0')}.png`);
}
const history = JSON.parse(readFileSync(path.join(root, 'planning/topic-history.json'), 'utf8')) as {
  topics: Array<{latestDelivery?: string; versions?: Array<{directory?: string}>}>;
};
const historyDeliveries = history.topics.flatMap((topic) => [
  topic.latestDelivery,
  ...(topic.versions ?? []).map((version) => version.directory),
]).filter((value): value is string => Boolean(value?.startsWith('outputs/')))
  .map((value) => path.basename(value));
const known = new Set([...replicaProjects.flatMap((p) => [p.slug, `${p.slug}发了`]), ...historyDeliveries]);
for (const entry of readdirSync(path.join(root, 'outputs'), {withFileTypes: true})) {
  if (entry.isDirectory() && !known.has(entry.name)) notes.push(`Unregistered delivery directory: outputs/${entry.name}`);
}
if (conflicts) notes.push(`${conflicts} publication records disagree with folder labels; factual confirmation remains pending.`);
if (pending) notes.push(`${pending} episodes have pending content review; file completeness is not content approval.`);
const report = {generatedAt: new Date().toISOString(), status: errors.length ? 'FAIL' : notes.length ? 'PASS_WITH_NOTES' : 'PASS',
  projectCount: replicaProjects.length, filesChecked: checked.size, dynamicDirectories: dynamicDirectories.size, errors, notes,
  scope: 'Existence, nonempty files, output layout and runtime paths. Does not render, generate, decode all media, or approve teaching content.'};
const output = path.join(root, 'docs/project-organization/health.json');
mkdirSync(path.dirname(output), {recursive: true});
writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(`${report.status}: ${report.projectCount} projects, ${report.filesChecked} files, ${report.dynamicDirectories} motion directories.`);
for (const note of notes) console.log(`NOTE: ${note}`);
for (const error of errors) console.error(`ERROR: ${error}`);
if (errors.length) process.exitCode = 1;
