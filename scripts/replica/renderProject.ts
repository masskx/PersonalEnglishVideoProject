import {existsSync, mkdirSync, mkdtempSync} from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {getReplicaProject} from '../../src/replica/projects/registry';
import {resolveDeliveryPaths} from './deliveryPaths';
import {promoteDelivery} from './promoteDelivery';
import {prepareRenderPublicDir} from './prepareRenderPublicDir';
import {browserCliArgs} from './renderEnv';

const args = process.argv.slice(2);
const projectArg = args.find((arg) => arg.startsWith('--project='))?.slice('--project='.length);
if (!projectArg) throw new Error('Missing --project=<slug>.');
const project = getReplicaProject(projectArg);
const delivery = resolveDeliveryPaths(project);
const draft = args.includes('--draft');
const qualityArg = args.find((arg) => arg.startsWith('--quality='))?.slice('--quality='.length);
const highQuality = qualityArg === 'hq';
const backgroundMusicPath = path.resolve(process.cwd(), 'public', project.backgroundMusic.src);
if (!existsSync(backgroundMusicPath)) {
  throw new Error(
    `Background music is required for every render but is missing: ${backgroundMusicPath}. ` +
      'Generate the track using docs/BACKGROUND_MUSIC_PROMPTS.md and save it with this exact filename.',
  );
}
const outputArg = args.find((arg) => arg.startsWith('--output='))?.slice('--output='.length);
const publicDirArg = args.find((arg) => arg.startsWith('--public-dir='))?.slice('--public-dir='.length);
const finalOutput = path.resolve(
  process.cwd(),
  outputArg ??
    (draft ? delivery.draftVideo : delivery.video),
);
if (args.includes('--plan')) {
  console.log(JSON.stringify({project: project.slug, draft, output: finalOutput,
    staging: draft ? null : 'work/render-staging/', previousVersions: draft ? null : `work/delivery-backups/${project.slug}/`,
    generation: false}, null, 2));
  process.exit(0);
}
const stageRoot = path.resolve('work', 'render-staging');
if (!draft) mkdirSync(stageRoot, {recursive: true});
const stage = draft ? undefined : mkdtempSync(path.join(stageRoot, `${project.slug}-`));
mkdirSync(stageRoot, {recursive: true});
const preparedPublic = publicDirArg
  ? null
  : prepareRenderPublicDir(
      project,
      path.join(stage ?? mkdtempSync(path.join(stageRoot, `${project.slug}-assets-`)), 'public'),
    );
const publicDir = preparedPublic?.directory ?? path.resolve(process.cwd(), publicDirArg!);
if (preparedPublic) {
  console.log(
    `Prepared ${preparedPublic.copiedFiles} files (${(preparedPublic.copiedBytes / 1024 / 1024).toFixed(1)} MB) ` +
      `in the isolated public directory for ${project.slug}.`,
  );
}
const output = draft ? finalOutput : path.join(stage!, path.basename(finalOutput));
mkdirSync(path.dirname(output), {recursive: true});

const run = (command: string, commandArgs: string[]) => {
  const executable =
    process.platform === 'win32' && command === 'npm'
      ? 'npm.cmd'
      : process.platform === 'win32' && command === 'npx'
        ? 'npx.cmd'
        : command;
  const result = spawnSync(executable, commandArgs, {
    cwd: process.cwd(),
    stdio: 'inherit',
    windowsHide: true,
    shell: process.platform === 'win32',
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${executable} ${commandArgs.join(' ')} failed with exit ${result.status}.`);
  }
};

run('npm', ['run', 'typecheck']);
run('npm', ['run', 'replica:validate', '--', `--project=${project.slug}`]);
if (project.illustrations.length > 0) {
  run('npm', ['run', 'replica:assets:verify', '--', `--project=${project.slug}`]);
}

const renderArgs = [
  'remotion',
  'render',
  'src/index.ts',
  project.compositionId,
  output,
  '--codec=h264',
  `--crf=${draft ? 28 : highQuality ? 15 : 18}`,
  '--pixel-format=yuv420p',
  '--audio-codec=aac',
  '--audio-bitrate=192k',
  `--concurrency=${draft ? 4 : highQuality ? 2 : 2}`,
  ...browserCliArgs(),
];
if (draft) renderArgs.push('--scale=0.5');
renderArgs.push(`--public-dir=${publicDir}`);
run('npx', renderArgs);

if (!existsSync(output)) throw new Error(`Render completed without output: ${output}.`);
console.log(`Rendered ${project.slug}: ${path.relative(process.cwd(), output)}.`);

if (!draft) {
  const deliveryDir = path.dirname(output);
  const verticalCover = path.join(deliveryDir, 'cover.png');
  const landscapeCover = path.join(deliveryDir, 'cover-landscape.png');
  const publishCopy = path.join(deliveryDir, 'publish-copy.md');
  const coverArgs = [
    'run',
    'replica:cover',
    '--',
    `--project=${project.slug}`,
    '--orientation=both',
    `--output=${verticalCover}`,
    `--landscape-output=${landscapeCover}`,
  ];
  coverArgs.push(`--public-dir=${publicDir}`);
  run('npm', coverArgs);
  run('npm', [
    'run',
    'replica:cover:verify',
    '--',
    `--project=${project.slug}`,
    '--orientation=both',
    `--input=${verticalCover}`,
    `--landscape-input=${landscapeCover}`,
  ]);
  run('npm', [
    'run',
    'replica:copy',
    '--',
    `--project=${project.slug}`,
    `--output=${publishCopy}`,
  ]);
  run('npm', ['run', 'replica:render:verify', '--', `--project=${project.slug}`, `--input=${output}`]);
  const backup = promoteDelivery(deliveryDir, path.dirname(finalOutput), [
    path.basename(finalOutput), 'cover.png', 'cover-landscape.png', 'publish-copy.md', 'douyin-copy.md',
    'render-report.json', 'cover-report.json', 'cover-landscape-report.json',
  ], path.resolve('work', 'delivery-backups', project.slug));
  console.log(`Delivery package ready: ${path.relative(process.cwd(), path.dirname(finalOutput))}. Previous files: ${path.relative(process.cwd(), backup)}.`);
  run('npm', ['run', 'replica:full-preview', '--', `--project=${project.slug}`, `--input=${finalOutput}`]);
}
