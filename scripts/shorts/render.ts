import {copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {bundle} from '@remotion/bundler';
import {renderMedia, renderStill, selectComposition} from '@remotion/renderer';
import growth from '../../planning/growth-promotion.json';
import {findShort, shortLibrary} from '../../src/shorts/library';
import {SHORT_COVER_FORMATS, type ShortCoverFormat, type ShortCoverProps} from '../../src/shorts/ShortCover';
import type {ShortScript, ShortTimeline} from '../../src/shorts/types';
import {browserExecutable, ffmpegPath} from '../replica/renderEnv';

/**
 * 短视频渲染：npm run shorts:render -- --short=<id>|--all [--covers-only]
 * 一条视频一个文件夹 outputs/shorts/<id>/（发布后改名 <id>发了/）：
 *   <id>.mp4（1080×1920）、cover-douyin-vertical.png（9:16）、cover-douyin-landscape.png（4:3）、
 *   cover-xiaohongshu.png（3:4）、publish.md（抖音 + 小红书文案）、release.json（draft）、review/（联系图、时间报告）。
 */
const args = process.argv.slice(2);
const only = args.find((arg) => arg.startsWith('--short='))?.slice('--short='.length);
const coversOnly = args.includes('--covers-only');
const shorts = args.includes('--all') ? shortLibrary : [findShort(only ?? (() => { throw new Error('Missing --short=<id> or --all'); })())];
const cfg = growth.douyinShorts;

const shortDeliveryDir = (id: string) => {
  const published = path.resolve('outputs', 'shorts', `${id}发了`);
  return existsSync(published) ? published : path.resolve('outputs', 'shorts', id);
};

const publishCopy = (short: ShortScript, seconds: number) => `# ${short.topic}

- 视频：${short.id}.mp4（${seconds.toFixed(1)} 秒，1080×1920）——抖音、小红书发同一条
- 抖音竖封面：cover-douyin-vertical.png（9:16，电脑端裁成中间 3:4 也完整）
- 抖音横封面：cover-douyin-landscape.png（4:3）
- 小红书封面：cover-xiaohongshu.png（3:4）
- 钩子类型：${short.hookType}

## 抖音

**标题：** ${short.publish.title}

${short.publish.body}

${short.publish.tags.join(' ')}

**置顶评论：** ${short.publish.pinnedComment}

## 小红书

**标题：** ${short.publish.xhsTitle}

${short.publish.body}

${short.publish.tags.join(' ')}

**评论区第一条：** ${short.publish.pinnedComment}

## 发布后

打开 AI 生成内容声明。第二天把两个平台的数据发给 Claude（视频 ID：\`${short.id}\`，见 docs/DOUYIN-DATA-EN.md）。
`;

for (const short of shorts) {
  const timelineFile = `src/shorts/timelines/${short.id}.json`;
  if (!existsSync(timelineFile)) throw new Error(`Missing ${timelineFile}. Run npm run shorts:voice -- --short=${short.id} --generate first.`);
  const timeline = JSON.parse(readFileSync(timelineFile, 'utf8')) as ShortTimeline;
  const cover = short.cover ?? {headline: short.hook.headline, art: short.hook.art ?? short.hook.arts?.[0] ?? ''};
  if (!cover.art) throw new Error(`${short.id}: cover needs art (set hook.art or cover.art).`);
  // Isolated public dir: only this short's art, audio, music and SFX.
  const stage = path.resolve('work', 'render-staging', `short-${short.id}`);
  rmSync(stage, {recursive: true, force: true});
  const assets = new Set<string>([cover.art, 'assets/music/root-word-series-bgm.mp3', ...['hit', 'whoosh', 'pop', 'stamp'].map((name) => `assets/sfx/${name}.mp3`)]);
  for (const beat of timeline.beats) { assets.add(beat.src); for (const art of [beat.art, ...(beat.arts ?? [])]) if (art) assets.add(art); }
  for (const rel of assets) {
    const source = path.resolve('public', rel);
    if (!existsSync(source)) throw new Error(`Missing asset public/${rel} (run git lfs pull).`);
    mkdirSync(path.dirname(path.join(stage, rel)), {recursive: true});
    copyFileSync(source, path.join(stage, rel));
  }
  const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), publicDir: stage});
  const outDir = shortDeliveryDir(short.id);
  mkdirSync(path.join(outDir, 'review'), {recursive: true});
  const seconds = timeline.totalFrames / timeline.fps;

  for (const format of Object.keys(SHORT_COVER_FORMATS) as ShortCoverFormat[]) {
    const inputProps: ShortCoverProps = {format, headline: cover.headline, art: cover.art, series: cfg.series, category: short.category, ribbon: cfg.coverRibbon};
    const composition = await selectComposition({serveUrl, id: 'ShortCover', inputProps, browserExecutable});
    await renderStill({serveUrl, composition, inputProps, output: path.join(outDir, SHORT_COVER_FORMATS[format].file), frame: 0, imageFormat: 'png', browserExecutable});
  }
  if (!coversOnly) {
    const inputProps = {timeline, series: cfg.series, category: short.category};
    const composition = await selectComposition({serveUrl, id: 'DouyinShort', inputProps, browserExecutable});
    const video = path.join(outDir, `${short.id}.mp4`);
    await renderMedia({serveUrl, composition, inputProps, outputLocation: video, codec: 'h264', crf: 17, pixelFormat: 'yuv420p', audioCodec: 'aac', audioBitrate: '192k', imageFormat: 'jpeg', jpegQuality: 95, concurrency: 4, browserExecutable});
    spawnSync(ffmpegPath, ['-v', 'error', '-y', '-i', video, '-vf', 'fps=1/2,scale=216:-1,tile=10x2:padding=4:color=0xcccccc', '-frames:v', '1', path.join(outDir, 'review', 'contact-sheet.jpg')]);
    writeFileSync(path.join(outDir, 'review', 'report.json'), `${JSON.stringify({short: short.id, hookType: short.hookType, seconds, beats: timeline.beats.map((beat) => ({id: beat.id, kind: beat.kind, from: +(beat.from / 30).toFixed(2), seconds: +(beat.frames / 30).toFixed(2)}))}, null, 2)}\n`);
  }
  writeFileSync(path.join(outDir, 'publish.md'), publishCopy(short, seconds));
  const releaseFile = path.join(outDir, 'release.json');
  if (!existsSync(releaseFile)) writeFileSync(releaseFile, `${JSON.stringify({video: short.id, status: 'draft', platforms: {douyin: null, xiaohongshu: null}}, null, 2)}\n`);
  console.log(`${short.id}: ${seconds.toFixed(1)}s → ${path.relative(process.cwd(), outDir)}`);
  rmSync(stage, {recursive: true, force: true});
}
