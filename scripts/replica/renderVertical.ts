import {existsSync, mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, writeFileSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {getReplicaProject, replicaProjects} from '../../src/replica/projects/registry';
import type {ReplicaProjectDefinition} from '../../src/replica/projectTypes';
import {buildVerticalProps, describeVerticalCut, reviewCardFrame, supportsTeaser, verticalCompositionId} from '../../src/replica/vertical/verticalProjects';
import type {VerticalCut} from '../../src/replica/vertical/verticalLayout';
import {prepareRenderPublicDir} from './prepareRenderPublicDir';
import {resolveDeliveryPaths} from './deliveryPaths';
import {browserCliArgs, ffmpegPath, ffprobePath} from './renderEnv';

/**
 * 抖音竖屏交付：完整版、预告短片和复习卡。复用横屏期的配音、插图与音乐，不重新生成素材。
 *   npm run vertical:render -- --project=ten-tain            完整版 + 预告 + 复习卡
 *   npm run vertical:render -- --project=ten-tain --cut=teaser
 *   npm run vertical:render -- --all                         全部已注册词根期
 *   npm run vertical:render -- --project=ten-tain --draft     半分辨率快速审片
 */
const args = process.argv.slice(2);
const arg = (name: string) => args.find((value) => value.startsWith(`--${name}=`))?.slice(name.length + 3);
const draft = args.includes('--draft');
const cutArg = (arg('cut') ?? 'both') as VerticalCut | 'both';
const repoRoot = process.cwd();

const projects: ReplicaProjectDefinition[] = args.includes('--all')
  ? replicaProjects.filter((project) => project.cover)
  : [getReplicaProject(arg('project') ?? (() => { throw new Error('Missing --project=<slug> or --all.'); })())];

const ffprobe = ffprobePath;
const ffmpeg = ffmpegPath;
const concurrency = Math.max(1, Math.min(4, os.cpus().length));

const run = (command: string, commandArgs: string[]) => {
  const executable = process.platform === 'win32' && command === 'npx' ? 'npx.cmd' : command;
  const result = spawnSync(executable, commandArgs, {cwd: repoRoot, stdio: 'inherit', windowsHide: true, shell: process.platform === 'win32'});
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${executable} ${commandArgs.join(' ')} failed with exit ${result.status}.`);
};

const browserArgs = browserCliArgs();

const probe = (file: string) => {
  const result = spawnSync(ffprobe, ['-v', 'error', '-show_entries', 'format=duration,bit_rate:stream=codec_type,codec_name,width,height', '-of', 'json', file], {encoding: 'utf8'});
  if (result.status !== 0) throw new Error(`ffprobe failed for ${file}: ${result.stderr}`);
  const data = JSON.parse(result.stdout) as {format: {duration: string; bit_rate: string}; streams: Array<{codec_type: string; codec_name: string; width?: number; height?: number}>};
  const video = data.streams.find((stream) => stream.codec_type === 'video');
  const audio = data.streams.find((stream) => stream.codec_type === 'audio');
  return {durationSec: Number(data.format.duration), bitRate: Number(data.format.bit_rate), width: video?.width, height: video?.height, videoCodec: video?.codec_name, audioCodec: audio?.codec_name};
};

/** One frame per two seconds, tiled, for whole-timeline layout review. */
const contactSheet = (video: string, output: string, durationSec: number) => {
  mkdirSync(path.dirname(output), {recursive: true});
  const rows = Math.max(1, Math.ceil(Math.ceil(durationSec / 2) / 10));
  const result = spawnSync(ffmpeg, ['-v', 'error', '-y', '-i', video, '-vf', `fps=1/2,scale=216:-1,tile=10x${rows}:padding=4:color=0xcccccc`, '-frames:v', '1', output], {encoding: 'utf8'});
  if (result.status !== 0) console.warn(`Contact sheet skipped: ${result.stderr}`);
};

for (const project of projects) {
  const cuts: VerticalCut[] = cutArg === 'both' ? (supportsTeaser(project) ? ['full', 'teaser'] : ['full']) : [cutArg];
  if (cuts.includes('teaser') && !supportsTeaser(project)) throw new Error(`${project.slug} has too few word chapters for a teaser.`);
  // Follows the existing delivery folder, including published “发了” folders.
  const outDir = path.join(resolveDeliveryPaths(project, repoRoot).directory, 'vertical');
  mkdirSync(outDir, {recursive: true});
  const stageRoot = path.resolve(repoRoot, 'work', 'render-staging');
  mkdirSync(stageRoot, {recursive: true});
  const stage = mkdtempSync(path.join(stageRoot, `${project.slug}-vertical-`));
  // 派生的预告尾卡也会新增 SFX；隔离包必须包含实际剪辑引用的全部素材。
  const derivedScenes = cuts.flatMap((cut) => buildVerticalProps(project, cut).storyboard.scenes);
  const prepared = prepareRenderPublicDir({...project, storyboard: {
    ...project.storyboard, scenes: [...project.storyboard.scenes, ...derivedScenes],
  }}, path.join(stage, 'public'));
  console.log(`Prepared ${prepared.copiedFiles} assets for ${project.slug} (vertical).`);
  const reportFile = path.join(outDir, `vertical-report${draft ? '-draft' : ''}.json`);
  const previousCuts = existsSync(reportFile)
    ? (JSON.parse(readFileSync(reportFile, 'utf8')).cuts ?? {}) : {};
  const report: Record<string, unknown> = {slug: project.slug, renderedAt: new Date().toISOString(), draft, cuts: {...previousCuts}};
  // 仅续跑失败的预告时，保留已经存在且尺寸/时长验证通过的完整版记录。
  if (!cuts.includes('full')) {
    const fullFile = path.join(outDir, `${project.slug}-vertical${draft ? '-draft' : ''}.mp4`);
    if (existsSync(fullFile)) {
      const media = probe(fullFile);
      const expected = describeVerticalCut(project, 'full');
      const width = draft ? 540 : 1080;
      if (media.width !== width || media.height !== width * 16 / 9 ||
          Math.abs(media.durationSec - expected.durationSec) > 0.25 || media.audioCodec !== 'aac') {
        throw new Error('Existing full vertical video failed validation; render --cut=full before resuming the teaser.');
      }
      (report.cuts as Record<string, unknown>).full = {
        file: path.relative(repoRoot, fullFile), ...expected, media,
        contactSheet: path.relative(repoRoot, path.join(outDir, 'review', `full-contact-sheet${draft ? '-draft' : ''}.jpg`)), errors: [],
      };
    }
  }

  for (const cut of cuts) {
    const file = path.join(outDir, `${project.slug}-${cut === 'full' ? 'vertical' : 'teaser'}${draft ? '-draft' : ''}.mp4`);
    run('npx', [
      'remotion', 'render', 'src/index.ts', verticalCompositionId(project, cut), file,
      '--codec=h264', `--crf=${draft ? 26 : 16}`, '--x264-preset=slow', '--jpeg-quality=95', '--pixel-format=yuv420p',
      '--audio-codec=aac', '--audio-bitrate=192k', `--concurrency=${concurrency}`,
      ...(draft ? ['--scale=0.5'] : []), ...browserArgs, `--public-dir=${prepared.directory}`,
    ]);
    const media = probe(file);
    const expected = describeVerticalCut(project, cut);
    const errors: string[] = [];
    const expectedWidth = draft ? 540 : 1080;
    if (media.width !== expectedWidth || media.height !== expectedWidth * (16 / 9)) errors.push(`unexpected size ${media.width}x${media.height}`);
    if (Math.abs(media.durationSec - expected.durationSec) > 0.25) errors.push(`duration ${media.durationSec}s != ${expected.durationSec}s`);
    if (media.audioCodec !== 'aac') errors.push('missing AAC audio');
    const sheet = path.join(outDir, 'review', `${cut}-contact-sheet${draft ? '-draft' : ''}.jpg`);
    contactSheet(file, sheet, media.durationSec);
    (report.cuts as Record<string, unknown>)[cut] = {file: path.relative(repoRoot, file), ...expected, media, contactSheet: path.relative(repoRoot, sheet), errors};
    if (errors.length) throw new Error(`${project.slug} ${cut}: ${errors.join('; ')}`);
    writeFileSync(reportFile, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(`${project.slug} ${cut}: ${media.durationSec.toFixed(1)}s ${media.width}x${media.height} → ${path.relative(repoRoot, file)}`);
  }

  if (!draft && !args.includes('--skip-card')) {
    // Save-worthy recap image: the final summary page without captions or calls to action.
    const card = path.join(outDir, 'review-card.png');
    const propsFile = path.join(stage, 'card-props.json');
    writeFileSync(propsFile, JSON.stringify({hideOverlays: true}));
    run('npx', ['remotion', 'still', 'src/index.ts', verticalCompositionId(project, 'full'), card,
      `--frame=${reviewCardFrame(buildVerticalProps(project, 'full'))}`, `--props=${propsFile}`, ...browserArgs, `--public-dir=${prepared.directory}`]);
    // Crop away the platform-overlay zone so the card reads as a standalone 1080×1200 image.
    const cropped = `${card}.crop.png`;
    const crop = spawnSync(ffmpeg, ['-v', 'error', '-y', '-i', card, '-vf', 'crop=1080:1200:0:170', cropped], {encoding: 'utf8'});
    if (crop.status === 0) {
      rmSync(card);
      renameSync(cropped, card);
    } else console.warn(`Review card crop skipped: ${crop.stderr}`);
    report.reviewCard = path.relative(repoRoot, card);
  }

  writeFileSync(path.join(outDir, `vertical-report${draft ? '-draft' : ''}.json`), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  rmSync(stage, {recursive: true, force: true});
}
