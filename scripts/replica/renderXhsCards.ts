import {existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import growth from '../../planning/growth-promotion.json';
import {getReplicaProject, replicaProjects} from '../../src/replica/projects/registry';
import type {ReplicaProjectDefinition} from '../../src/replica/projectTypes';
import {buildXhsDeck, xhsCardSequence} from '../../src/replica/xhs/xhsCardData';
import {buildXhsNote} from '../../src/replica/xhs/xhsNote';
import type {XhsCardProps} from '../../src/replica/xhs/XhsCard';
import {prepareRenderPublicDir} from './prepareRenderPublicDir';
import {resolveDeliveryPaths} from './deliveryPaths';

/**
 * 小红书图文笔记：npm run xhs:cards -- --project=<slug>（或 --all）
 * 输出 <交付目录>/xiaohongshu/：01-cover.png … 、xhs-note.md（标题、正文、话题）、contact-sheet.jpg。
 * 只复用本期已有插图与讲稿，不调用生图或配音接口。
 */
const args = process.argv.slice(2);
const arg = (name: string) => args.find((value) => value.startsWith(`--${name}=`))?.slice(name.length + 3);
const projects: ReplicaProjectDefinition[] = args.includes('--all')
  ? replicaProjects.filter((project) => project.cover)
  : [getReplicaProject(arg('project') ?? (() => { throw new Error('Missing --project=<slug> or --all.'); })())];

const windowsChrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const linuxHeadless = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const browserExecutable =
  process.env.REMOTION_BROWSER_EXECUTABLE ??
  (process.platform === 'win32' && existsSync(windowsChrome) ? windowsChrome : existsSync(linuxHeadless) ? linuxHeadless : null);
const compositorDir = path.resolve('node_modules/@remotion/compositor-win32-x64-msvc');
const ffmpeg =
  process.env.FFMPEG_PATH ??
  (process.platform === 'win32' && existsSync(path.join(compositorDir, 'ffmpeg.exe')) ? path.join(compositorDir, 'ffmpeg.exe') : 'ffmpeg');
const xhs = growth.xiaohongshu;


for (const project of projects) {
  const deck = buildXhsDeck(project, growth.series.name);
  const cards = xhsCardSequence(deck);
  const outDir = path.join(resolveDeliveryPaths(project).directory, 'xiaohongshu');
  mkdirSync(outDir, {recursive: true});
  for (const file of readdirSync(outDir)) if (/^\d\d-.*\.png$/.test(file)) rmSync(path.join(outDir, file));

  // Isolated public dir with only this episode's referenced art (project rule), bundled per project.
  const stageRoot = path.resolve('work', 'render-staging');
  mkdirSync(stageRoot, {recursive: true});
  const stage = mkdtempSync(path.join(stageRoot, `${project.slug}-xhs-`));
  const prepared = prepareRenderPublicDir(project, path.join(stage, 'public'));
  const projectServeUrl = await bundle({entryPoint: path.resolve('src/index.ts'), publicDir: prepared.directory});

  for (const [index, card] of cards.entries()) {
    const inputProps: XhsCardProps = {deck, card, page: index + 1, total: cards.length, saveCta: xhs.saveCta, followCta: xhs.followCta, commentPrompt: xhs.commentPrompt};
    const composition = await selectComposition({serveUrl: projectServeUrl, id: 'XhsCard', inputProps, browserExecutable});
    const name = card.kind === 'word' ? `word-${deck.words[card.index].word}` : card.kind;
    await renderStill({composition, serveUrl: projectServeUrl, output: path.join(outDir, `${String(index + 1).padStart(2, '0')}-${name}.png`), inputProps, browserExecutable, imageFormat: 'png'});
  }
  writeFileSync(path.join(outDir, 'xhs-note.md'), buildXhsNote(deck), 'utf8');
  const sheet = spawnSync(ffmpeg, ['-v', 'error', '-y', '-pattern_type', 'glob', '-i', path.join(outDir, '[0-9][0-9]-*.png'),
    '-vf', `scale=270:-1,tile=${Math.min(7, cards.length)}x${Math.ceil(cards.length / 7)}:padding=6:color=0xdddddd`, '-frames:v', '1', path.join(outDir, 'contact-sheet.jpg')], {encoding: 'utf8'});
  if (sheet.status !== 0) console.warn(`Contact sheet skipped: ${sheet.stderr}`);
  rmSync(stage, {recursive: true, force: true});
  console.log(`${project.slug}: ${cards.length} 张小红书卡片 → ${path.relative(process.cwd(), outDir)}`);
}
