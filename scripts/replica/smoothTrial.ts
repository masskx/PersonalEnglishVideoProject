import {existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync} from 'node:fs';
import type {ReplicaVideoProps} from '../../src/replica/ReplicaVideo';

const args=process.argv.slice(2);
const base = args.find(arg=>arg.startsWith('--out-dir='))?.slice('--out-dir='.length) ?? 'work/experiments/mit-miss-smooth';
const source = args.find(arg=>arg.startsWith('--source-dir='))?.slice('--source-dir='.length) ?? 'work/experiments/mit-miss-keyposes';
const videoName = args.find(arg=>arg.startsWith('--video-name='))?.slice('--video-name='.length) ?? 'mit-miss-smooth.mp4';
mkdirSync(base, {recursive: true});
const props = JSON.parse(readFileSync(`${source}/props.json`, 'utf8')) as ReplicaVideoProps;
for (const scene of props.storyboard.scenes) {
  for (const layer of scene.layers) {
    if (layer.kind === 'image') continue;
    // Complete reading holds up to the short, deliberate handoff at scene end.
    layer.duration = scene.duration - layer.from;
    layer.exit = 'smooth-out';
    layer.exitDuration = 0.33;
    layer.enterDuration = 0.53;
    layer.enter = 'smooth-rise';
    if (layer.kind !== 'text') continue;
    if (layer.id.endsWith('-word')) {
      layer.from = 0;
      layer.duration = scene.duration;
      layer.enter = 'none';
      layer.runMotion = 'assemble';
    } else if (layer.id.endsWith('-formula')) {
      layer.enter = 'smooth-slide';
    } else if (layer.id.endsWith('-meaning') || /^ex[123]$/.test(layer.id)) {
      layer.enter = 'smooth-reveal';
    }
    // Non-word pages need a legible heading on their first frame.
    if (layer.from === 0 && !layer.id.endsWith('-word')) layer.enter = 'none';
    if (layer.from === 0 && ['example-sentences', 'final-summary'].includes(scene.id)) layer.exit = 'none';
  }
}
writeFileSync(`${base}/props.json`, JSON.stringify(props, null, 2));
for (const name of ['cover.png', 'cover-landscape.png', 'publish-copy.md', 'beat-map.json']) {
  copyFileSync(`${source}/${name}`, `${base}/${name}`);
}
writeFileSync(`${base}/README.md`, `# mit-miss 流畅文字试验版

基于上一版 24 张静态关键姿态，保留原配音、字幕、背景音乐、122.1 秒时长与双封面。
词形分组轻微错峰归位；解释短距离滑入；释义与例句遮罩揭示；退出使用平滑曲线。
只模拟剪映常见动效的视觉原理，不对应某个商业预设的逐像素复刻。

准备：\`npx tsx scripts/replica/smoothTrial.ts\`（不调用生成接口）。
完整视频：\`${videoName}\`。对比入口：\`compare.html\`。
此处为试验交付，未替换 outputs 中的正式版本；发布前仍须人工完整观看和听审。
`);
console.log(`Prepared ${base}/props.json`);
const comparisonSource = `${source}/compare.html`;
if (!existsSync(comparisonSource)) {
  console.log(`Prepared ${base}/props.json (comparison page skipped)`);
  process.exit(0);
}
const comparison = readFileSync(comparisonSource, 'utf8')
  .replace('<title>', '<link rel="icon" href="data:,"><title>')
  .replace('两版使用同一配音和时长。', '三版使用同一配音和时长。')
  .replaceAll('关键姿态试验', '流畅文字试验')
  .replaceAll('关键姿态测试', '流畅文字版')
  .replaceAll('mit-miss-keyposes.mp4', videoName)
  .replace('看清准备、变化和结果。', '静态关键姿态配合词素归位、文字滑入、遮罩揭示和平滑退出。')
  .replace('href="pose-contact-sheet.jpg"', 'href="../mit-miss-keyposes/pose-contact-sheet.jpg"')
  .replace('<button id="original"', '<button id="poses" aria-pressed="false">上一版静态关键姿态</button><button id="original"')
  .replace("document.querySelector('#original').onclick", "document.querySelector('#poses').onclick=()=>version('poses','../mit-miss-keyposes/mit-miss-keyposes.mp4');\ndocument.querySelector('#original').onclick");
writeFileSync(`${base}/compare.html`, comparison);
