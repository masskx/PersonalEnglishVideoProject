import {copyFileSync, existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import growth from '../../planning/growth-promotion.json';
import {getReplicaProject, replicaProjects} from '../../src/replica/projects/registry';
import {buildXhsDeck, xhsCardSequence} from '../../src/replica/xhs/xhsCardData';
import {methodCardSequence, methodDeckArt, type MethodDeck} from '../../src/replica/xhs/methodDeck';
import {findMethodDeck, methodDecks} from '../../src/replica/xhs/methodDecks';
import {buildMethodNote, buildXhsNote} from '../../src/replica/xhs/xhsNote';
import {prepareRenderPublicDir} from './prepareRenderPublicDir';
import {resolveDeliveryPaths} from './deliveryPaths';

/**
 * 小红书图文笔记：npm run xhs:cards -- --project=<slug>（或 --all）
 * 词根期（如 ten-tain）出词卡；四六级方法期（如 cet4-translation-main-clause）出方法卡。
 * 输出 <交付目录>/xiaohongshu/：01-cover.png …、xhs-note.md（标题、正文、话题）、contact-sheet.jpg。
 * 只复用本期已有插图与讲稿，不调用生图或配音接口。
 */
const args = process.argv.slice(2);
const arg = (name: string) => args.find((value) => value.startsWith(`--${name}=`))?.slice(name.length + 3);

type Job = {
  slug: string;
  outDir: string;
  compositionId: 'XhsCard' | 'XhsMethodCard';
  cards: Array<{name: string; props: Record<string, unknown>}>;
  note: string;
  /** Copies only this episode's referenced art into an isolated public directory. */
  stagePublic: (directory: string) => void;
};

const xhs = growth.xiaohongshu;
const shared = {saveCta: xhs.saveCta, followCta: xhs.followCta, commentPrompt: xhs.commentPrompt};

const rootWordJob = (slug: string): Job => {
  const project = getReplicaProject(slug);
  const deck = buildXhsDeck(project, growth.series.name);
  const cards = xhsCardSequence(deck);
  return {
    slug: project.slug,
    outDir: path.join(resolveDeliveryPaths(project).directory, 'xiaohongshu'),
    compositionId: 'XhsCard',
    cards: cards.map((card, index) => ({
      name: card.kind === 'word' ? `word-${deck.words[card.index].word}` : card.kind,
      props: {deck, card, page: index + 1, total: cards.length, ...shared},
    })),
    note: buildXhsNote(deck),
    stagePublic: (directory) => void prepareRenderPublicDir(project, directory),
  };
};

const methodJob = (deck: MethodDeck): Job => {
  const cards = methodCardSequence(deck);
  return {
    slug: deck.slug,
    outDir: path.resolve(deck.deliveryDir, 'xiaohongshu'),
    compositionId: 'XhsMethodCard',
    cards: cards.map((card, index) => ({
      name: card.kind === 'step' ? `step-${card.index + 1}` : card.kind,
      props: {deck, card, page: index + 1, total: cards.length, ...shared, followCta: xhs.cetFollowCta ?? xhs.followCta},
    })),
    note: buildMethodNote(deck),
    stagePublic: (directory) => {
      for (const art of methodDeckArt(deck)) {
        const source = path.resolve('public', art);
        if (!existsSync(source)) throw new Error(`Missing art for ${deck.slug}: public/${art} (run git lfs pull)`);
        mkdirSync(path.dirname(path.join(directory, art)), {recursive: true});
        copyFileSync(source, path.join(directory, art));
      }
    },
  };
};

const jobFor = (slug: string): Job => {
  const method = findMethodDeck(slug);
  return method ? methodJob(method) : rootWordJob(slug);
};

const jobs: Job[] = args.includes('--all')
  ? [...replicaProjects.filter((project) => project.cover).map((project) => rootWordJob(project.slug)), ...methodDecks.map(methodJob)]
  : [jobFor(arg('project') ?? (() => { throw new Error('Missing --project=<slug> or --all.'); })())];

const windowsChrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const linuxHeadless = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const browserExecutable =
  process.env.REMOTION_BROWSER_EXECUTABLE ??
  (process.platform === 'win32' && existsSync(windowsChrome) ? windowsChrome : existsSync(linuxHeadless) ? linuxHeadless : null);
const compositorDir = path.resolve('node_modules/@remotion/compositor-win32-x64-msvc');
const ffmpeg =
  process.env.FFMPEG_PATH ??
  (process.platform === 'win32' && existsSync(path.join(compositorDir, 'ffmpeg.exe')) ? path.join(compositorDir, 'ffmpeg.exe') : 'ffmpeg');

/** Tiled overview of every card. Uses a concat list instead of -pattern_type glob, which Windows ffmpeg lacks. */
const contactSheet = (files: string[], output: string, stage: string) => {
  const list = path.join(stage, 'cards.txt');
  writeFileSync(list, files.map((file) => `file '${file.replace(/\\/g, '/').replace(/'/g, "'\\''")}'`).join('\n'), 'utf8');
  const columns = Math.min(7, files.length);
  const result = spawnSync(ffmpeg, ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list,
    '-vf', `scale=270:-1,tile=${columns}x${Math.ceil(files.length / columns)}:padding=6:color=0xdddddd`, '-frames:v', '1', output], {encoding: 'utf8'});
  if (result.status !== 0) console.warn(`Contact sheet skipped: ${result.stderr}`);
};

for (const job of jobs) {
  mkdirSync(job.outDir, {recursive: true});
  for (const file of readdirSync(job.outDir)) if (/^\d\d-.*\.png$/.test(file)) rmSync(path.join(job.outDir, file));

  const stageRoot = path.resolve('work', 'render-staging');
  mkdirSync(stageRoot, {recursive: true});
  const stage = mkdtempSync(path.join(stageRoot, `${job.slug}-xhs-`));
  const publicDir = path.join(stage, 'public');
  mkdirSync(publicDir, {recursive: true});
  job.stagePublic(publicDir);
  const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), publicDir});

  const files: string[] = [];
  for (const [index, card] of job.cards.entries()) {
    const output = path.join(job.outDir, `${String(index + 1).padStart(2, '0')}-${card.name}.png`);
    const composition = await selectComposition({serveUrl, id: job.compositionId, inputProps: card.props, browserExecutable});
    await renderStill({composition, serveUrl, output, inputProps: card.props, browserExecutable, imageFormat: 'png'});
    files.push(output);
  }
  writeFileSync(path.join(job.outDir, 'xhs-note.md'), job.note, 'utf8');
  contactSheet(files, path.join(job.outDir, 'contact-sheet.jpg'), stage);
  rmSync(stage, {recursive: true, force: true});
  console.log(`${job.slug}: ${files.length} 张小红书卡片 → ${path.relative(process.cwd(), job.outDir)}`);
}
