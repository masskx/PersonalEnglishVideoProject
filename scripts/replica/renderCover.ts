import {existsSync, mkdirSync} from 'node:fs';
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {getReplicaProject} from '../../src/replica/projects/registry';
import {resolveDeliveryPaths} from './deliveryPaths';
import {prepareRenderPublicDir} from './prepareRenderPublicDir';

const args = process.argv.slice(2);
const projectArg = args.find((arg) => arg.startsWith('--project='))?.slice('--project='.length);
if (!projectArg) throw new Error('Missing --project=<slug>.');

const project = getReplicaProject(projectArg);
const delivery = resolveDeliveryPaths(project);
if (!project.cover) throw new Error(`Project ${project.slug} has no cover configuration.`);

const orientationArg =
  args.find((arg) => arg.startsWith('--orientation='))?.slice('--orientation='.length) ?? 'both';
if (!['vertical', 'landscape', 'both'].includes(orientationArg)) {
  throw new Error('--orientation must be vertical, landscape, or both.');
}
const outputArg = args.find((arg) => arg.startsWith('--output='))?.slice('--output='.length);
const landscapeOutputArg = args
  .find((arg) => arg.startsWith('--landscape-output='))
  ?.slice('--landscape-output='.length);
const publicDirArg = args.find((arg) => arg.startsWith('--public-dir='))?.slice('--public-dir='.length);
const publicDir = publicDirArg
  ? path.resolve(process.cwd(), publicDirArg)
  : prepareRenderPublicDir(project, path.resolve('work', 'render-staging', `${project.slug}-public`)).directory;
const verticalOutput = path.resolve(
  process.cwd(),
  outputArg ?? delivery.cover,
);
const landscapeOutput = path.resolve(
  process.cwd(),
  landscapeOutputArg ?? delivery.landscapeCover,
);

const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const inputProps = {cover: project.cover};
const serveUrl = await bundle({
  entryPoint: path.resolve(process.cwd(), 'src/index.ts'),
  publicDir,
  enableCaching: true,
  onProgress: (progress) => {
    if (progress === 1) console.log('Cover bundle ready.');
  },
});
const renderOne = async ({id, output}: {id: string; output: string}) => {
  mkdirSync(path.dirname(output), {recursive: true});
  const composition = await selectComposition({
    serveUrl,
    id,
    inputProps,
    browserExecutable: chrome,
  });
  await renderStill({
    serveUrl,
    composition,
    inputProps,
    output,
    imageFormat: 'png',
    overwrite: true,
    browserExecutable: chrome,
  });
  if (!existsSync(output)) throw new Error(`Cover render completed without output: ${output}.`);
  console.log(`Rendered ${project.slug} ${id}: ${path.relative(process.cwd(), output)}.`);
};

if (orientationArg === 'vertical' || orientationArg === 'both') {
  await renderOne({id: 'RootWordCover', output: verticalOutput});
}
if (orientationArg === 'landscape' || orientationArg === 'both') {
  await renderOne({id: 'RootWordLandscapeCover', output: landscapeOutput});
}
