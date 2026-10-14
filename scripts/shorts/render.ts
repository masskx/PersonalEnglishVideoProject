import {copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {bundle} from '@remotion/bundler';
import {renderMedia, renderStill, selectComposition} from '@remotion/renderer';
import growth from '../../planning/growth-promotion.json';
import {findShort, shortLibrary} from '../../src/shorts/library';
import type {ShortTimeline, ShortVariant} from '../../src/shorts/types';
import {browserExecutable, ffmpegPath} from '../replica/renderEnv';

/**
 * 抖音短视频渲染：npm run shorts:render -- --short=<id>|--all [--variant=A|B]
 * 输出 outputs/<来源期>/douyin-shorts/：<id>-<A|B>.mp4、封面首帧、发布文案（标题、正文、话题、置顶评论）、联系图。
 */
const args = process.argv.slice(2);
const only = args.find((arg) => arg.startsWith('--short='))?.slice('--short='.length);
const variantArg = args.find((arg) => arg.startsWith('--variant='))?.slice('--variant='.length) as ShortVariant | undefined;
const shorts = args.includes('--all') ? shortLibrary : [findShort(only ?? (() => { throw new Error('Missing --short=<id> or --all'); })())];
const cfg = growth.douyinShorts;

for (const short of shorts) {
  const variants: ShortVariant[] = variantArg ? [variantArg] : ['A', 'B'];
  const timelines = variants.map((variant) => {
    const file = `src/shorts/timelines/${short.id}-${variant}.json`;
    if (!existsSync(file)) throw new Error(`Missing ${file}. Run npm run shorts:voice -- --short=${short.id} --generate first.`);
    return JSON.parse(readFileSync(file, 'utf8')) as ShortTimeline;
  });
  // Isolated public dir: only this short's art, audio, music and SFX.
  const stage = path.resolve('work', 'render-staging', `short-${short.id}`);
  rmSync(stage, {recursive: true, force: true});
  const assets = new Set<string>(['assets/music/root-word-series-bgm.mp3', ...['hit', 'whoosh', 'pop', 'stamp'].map((name) => `assets/sfx/${name}.mp3`)]);
  for (const timeline of timelines) for (const beat of timeline.beats) { assets.add(beat.src); for (const art of [beat.art, ...(beat.arts ?? [])]) if (art) assets.add(art); }
  for (const rel of assets) {
    const source = path.resolve('public', rel);
    if (!existsSync(source)) throw new Error(`Missing asset public/${rel} (run git lfs pull).`);
    mkdirSync(path.dirname(path.join(stage, rel)), {recursive: true});
    copyFileSync(source, path.join(stage, rel));
  }
  const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), publicDir: stage});
  const outDir = path.resolve('outputs', short.episode, 'douyin-shorts');
  mkdirSync(outDir, {recursive: true});
  for (const timeline of timelines) {
    const name = `${short.id}-${timeline.variant}`;
    const inputProps = {timeline, series: cfg.series, topicLabel: cfg.topicLabel};
    const composition = await selectComposition({serveUrl, id: 'DouyinShort', inputProps, browserExecutable});
    const video = path.join(outDir, `${name}.mp4`);
    await renderMedia({serveUrl, composition, inputProps, outputLocation: video, codec: 'h264', crf: 17, pixelFormat: 'yuv420p', audioCodec: 'aac', audioBitrate: '192k', imageFormat: 'jpeg', jpegQuality: 95, concurrency: 4, browserExecutable});
    await renderStill({serveUrl, composition, inputProps, output: path.join(outDir, `${name}-cover.png`), frame: 0, imageFormat: 'png', browserExecutable});
    const sheet = path.join(outDir, `${name}-contact-sheet.jpg`);
    spawnSync(ffmpegPath, ['-v', 'error', '-y', '-i', video, '-vf', 'fps=1/2,scale=216:-1,tile=10x2:padding=4:color=0xcccccc', '-frames:v', '1', sheet]);
    const seconds = timeline.totalFrames / timeline.fps;
    writeFileSync(path.join(outDir, `${name}.md`), `# ${short.topic}（钩子 ${timeline.variant}）\n\n- 视频：${name}.mp4（${seconds.toFixed(1)} 秒，1080×1920）\n- 封面：${name}-cover.png（首帧）\n\n## 标题\n\n${short.publish.titles[timeline.variant]}\n\n## 正文\n\n${short.publish.body}\n\n${short.publish.tags.join(' ')}\n\n## 置顶评论\n\n${short.publish.pinnedComment}\n\n## 发布后记录\n\n把这条视频的 ID 记为 \`${name}\`，第二天把数据发给 Claude（见 docs/DOUYIN-DATA-EN.md）。\n`);
    writeFileSync(path.join(outDir, `${name}-report.json`), `${JSON.stringify({short: short.id, variant: timeline.variant, seconds, beats: timeline.beats.map((beat) => ({id: beat.id, kind: beat.kind, from: +(beat.from / 30).toFixed(2), seconds: +(beat.frames / 30).toFixed(2)}))}, null, 2)}\n`);
    console.log(`${name}: ${seconds.toFixed(1)}s → ${path.relative(process.cwd(), video)}`);
  }
  rmSync(stage, {recursive: true, force: true});
}
