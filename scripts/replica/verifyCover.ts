import {existsSync, mkdirSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {inflateSync} from 'node:zlib';
import {getReplicaProject} from '../../src/replica/projects/registry';
import {resolveDeliveryPaths} from './deliveryPaths';

const repoRoot = process.cwd();
const args = process.argv.slice(2);
const projectArg = args.find((arg) => arg.startsWith('--project='))?.slice('--project='.length);
if (!projectArg) throw new Error('Missing --project=<slug>.');

const project = getReplicaProject(projectArg);
const delivery = resolveDeliveryPaths(project, repoRoot);
if (!project.cover) throw new Error(`Project ${project.slug} has no cover configuration.`);
const orientation =
  args.find((arg) => arg.startsWith('--orientation='))?.slice('--orientation='.length) ?? 'both';
if (!['vertical', 'landscape', 'both'].includes(orientation)) {
  throw new Error('--orientation must be vertical, landscape, or both.');
}
const inputArg = args.find((arg) => arg.startsWith('--input='))?.slice('--input='.length);
const landscapeInputArg = args
  .find((arg) => arg.startsWith('--landscape-input='))
  ?.slice('--landscape-input='.length);

const compositorDir = path.resolve(repoRoot, 'node_modules/@remotion/compositor-win32-x64-msvc');
const ffprobe =
  process.env.FFPROBE_PATH ??
  (process.platform === 'win32' && existsSync(path.join(compositorDir, 'ffprobe.exe'))
    ? path.join(compositorDir, 'ffprobe.exe')
    : 'ffprobe');
const ffmpeg =
  process.env.FFMPEG_PATH ??
  (process.platform === 'win32' && existsSync(path.join(compositorDir, 'ffmpeg.exe'))
    ? path.join(compositorDir, 'ffmpeg.exe')
    : 'ffmpeg');

const decodeFirstPngPixel = (file: Buffer) => {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (file.length < 33 || !file.subarray(0, 8).equals(signature)) {
    throw new Error('ffmpeg did not return a PNG frame');
  }
  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = -1;
  let colorType = -1;
  const idatChunks: Buffer[] = [];
  while (offset + 12 <= file.length) {
    const length = file.readUInt32BE(offset);
    const type = file.toString('ascii', offset + 4, offset + 8);
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    if (dataEnd + 4 > file.length) throw new Error(`truncated PNG ${type} chunk`);
    if (type === 'IHDR') {
      width = file.readUInt32BE(dataStart);
      height = file.readUInt32BE(dataStart + 4);
      bitDepth = file[dataStart + 8];
      colorType = file[dataStart + 9];
    } else if (type === 'IDAT') idatChunks.push(file.subarray(dataStart, dataEnd));
    else if (type === 'IEND') break;
    offset = dataEnd + 4;
  }
  if (width !== 1 || height !== 1 || bitDepth !== 8 || ![2, 6].includes(colorType)) {
    throw new Error(`unsupported PNG sample ${width}x${height}, depth ${bitDepth}, color type ${colorType}`);
  }
  const channels = colorType === 6 ? 4 : 3;
  const inflated = inflateSync(Buffer.concat(idatChunks));
  if (inflated.length !== channels + 1) throw new Error('unexpected PNG sample size');
  if (![0, 1, 2, 3, 4].includes(inflated[0])) throw new Error(`unsupported PNG filter ${inflated[0]}`);
  return [inflated[1], inflated[2], inflated[3]] as const;
};

const samplePixel = (input: string, x: number, y: number) => {
  const result = spawnSync(
    ffmpeg,
    ['-v', 'error', '-i', input, '-vf', `crop=1:1:${x}:${y},format=rgba`, '-frames:v', '1', '-c:v', 'png', '-f', 'image2pipe', 'pipe:1'],
    {windowsHide: true, encoding: null, maxBuffer: 1024 * 1024},
  );
  if (result.status !== 0 || !(result.stdout instanceof Buffer) || result.stdout.length < 33) {
    throw new Error(`Unable to sample cover pixel ${x},${y}: ${String(result.stderr)}`);
  }
  return decodeFirstPngPixel(result.stdout);
};

type CoverSpec = {
  label: 'vertical' | 'landscape';
  input: string;
  width: number;
  height: number;
  reportName: string;
};

const specs: CoverSpec[] = [];
if (orientation === 'vertical' || orientation === 'both') {
  specs.push({
    label: 'vertical',
    input: path.resolve(repoRoot, inputArg ?? delivery.cover),
    width: 1080,
    height: 1440,
    reportName: 'cover-report.json',
  });
}
if (orientation === 'landscape' || orientation === 'both') {
  specs.push({
    label: 'landscape',
    input: path.resolve(
      repoRoot,
      landscapeInputArg ?? delivery.landscapeCover,
    ),
    width: 1200,
    height: 900,
    reportName: 'cover-landscape-report.json',
  });
}

const metadataErrors: string[] = [];
const illustrationFile = path.resolve(repoRoot, 'public', project.cover.illustrationPath);
if (!existsSync(illustrationFile)) {
  metadataErrors.push(`cover illustration is missing: ${project.cover.illustrationPath}`);
}
if (project.cover.words.length < 3 || project.cover.words.length > 8) {
  metadataErrors.push(`cover word family must contain 3-8 words, got ${project.cover.words.length}`);
}
if (project.cover.wordHighlights && project.cover.wordHighlights.length !== project.cover.words.length) {
  metadataErrors.push(
    `cover wordHighlights must match words length, got ${project.cover.wordHighlights.length}/${project.cover.words.length}`,
  );
}
if (
  project.cover.illustrationScale !== undefined &&
  (project.cover.illustrationScale < 0.7 || project.cover.illustrationScale > 1.5)
) {
  metadataErrors.push(`cover illustrationScale must be 0.7-1.5, got ${project.cover.illustrationScale}`);
}
for (const [field, value] of Object.entries({
  seriesLabel: project.cover.seriesLabel,
  eyebrow: project.cover.eyebrow ?? '词根就是一个动作',
  root: project.cover.root,
  englishMeaning: project.cover.englishMeaning,
  chineseMeaning: project.cover.chineseMeaning,
  hook: project.cover.hook,
})) {
  if (!value.trim()) metadataErrors.push(`cover field ${field} is empty`);
}

const allErrors: string[] = [];
for (const spec of specs) {
  const errors = [...metadataErrors];
  if (!existsSync(spec.input)) {
    errors.push(`${spec.label} cover is missing: ${spec.input}`);
  }

  let stream:
    | {codec_name?: string; width?: number; height?: number; pix_fmt?: string}
    | undefined;
  if (existsSync(spec.input)) {
    const probe = spawnSync(
      ffprobe,
      ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=codec_name,width,height,pix_fmt', '-of', 'json', spec.input],
      {encoding: 'utf8', windowsHide: true},
    );
    if (probe.status !== 0) errors.push(`ffprobe failed: ${probe.stderr}`);
    else stream = JSON.parse(probe.stdout).streams?.[0];
    if (!stream) errors.push('cover has no decodable image stream');
  }

  if (stream?.codec_name !== 'png') errors.push(`expected PNG, got ${stream?.codec_name ?? 'unknown'}`);
  if (stream?.width !== spec.width || stream?.height !== spec.height) {
    errors.push(`expected ${spec.width}x${spec.height}, got ${stream?.width ?? 0}x${stream?.height ?? 0}`);
  }
  if (stream?.pix_fmt !== 'rgb24') {
    errors.push(`expected an opaque rgb24 canvas, got ${stream?.pix_fmt ?? 'unknown'}`);
  }

  const corners = stream
    ? [
        {x: 0, y: 0},
        {x: spec.width - 1, y: 0},
        {x: 0, y: spec.height - 1},
        {x: spec.width - 1, y: spec.height - 1},
      ].map(({x, y}) => ({x, y, rgb: samplePixel(spec.input, x, y)}))
    : [];
  for (const corner of corners) {
    if (corner.rgb.some((value) => value !== 255)) {
      errors.push(`corner ${corner.x},${corner.y} is RGB ${corner.rgb.join(',')}, expected 255,255,255`);
    }
  }

  const report = {
    project: project.slug,
    orientation: spec.label,
    input: path.relative(repoRoot, spec.input).replaceAll('\\', '/'),
    codec: stream?.codec_name,
    width: stream?.width,
    height: stream?.height,
    pixelFormat: stream?.pix_fmt,
    corners,
    wordCount: project.cover.words.length,
    words: project.cover.words,
    wordHighlights: project.cover.wordHighlights ?? null,
    illustration: project.cover.illustrationPath,
    ok: errors.length === 0,
    errors,
  };
  const reportPath = path.resolve(path.dirname(spec.input), spec.reportName);
  mkdirSync(path.dirname(reportPath), {recursive: true});
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  if (errors.length > 0) allErrors.push(...errors.map((error) => `${spec.label}: ${error}`));
  else {
    console.log(
      `Cover ${project.slug} ${spec.label} verified: ${spec.width}x${spec.height} opaque PNG, ` +
        `four white corners, ${project.cover.words.length} words.`,
    );
    console.log(`Report: ${path.relative(repoRoot, reportPath)}.`);
  }
}

if (allErrors.length > 0) {
  throw new Error(`Cover verification failed:\n- ${allErrors.join('\n- ')}`);
}
