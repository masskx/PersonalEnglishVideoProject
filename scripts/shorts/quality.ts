import {renameSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {ffmpegPath} from '../replica/renderEnv';
import {PAPER_RGB} from '../../src/replica/theme';
import type {ShortTimeline} from '../../src/shorts/types';

/**
 * 短视频成片工艺（借鉴 awesome-ai-motion 公开工作流，见 docs/当前制作基准.md“动效与声音工艺”）：
 * - 音效按实测峰值对齐、统一电平；
 * - 成片两遍 loudnorm 到 -14 LUFS / 真峰值 -1.5 dBTP（抖音、小红书的常见响度），只动音频，视频流直接复制；
 * - 渲染后自动检查：每个节拍换场前后不允许出现“空白纸面”帧，并出一张换场联系图。
 */
const run = (args: string[], label: string) => {
  const result = spawnSync(ffmpegPath, args, {maxBuffer: 1 << 28});
  if (result.status !== 0) throw new Error(`${label} failed: ${result.stderr?.toString().slice(-600)}`);
  return result;
};

/** 读音效：返回峰值位置（秒）和峰值电平（dBFS）。 */
export const measurePeak = (file: string) => {
  const rate = 48000;
  const pcm = run(['-v', 'error', '-i', file, '-f', 's16le', '-ac', '1', '-ar', String(rate), '-'], `peak ${file}`).stdout as Buffer;
  let max = 0;
  let at = 0;
  for (let i = 0; i + 1 < pcm.length; i += 2) {
    const v = Math.abs(pcm.readInt16LE(i));
    if (v > max) { max = v; at = i / 2; }
  }
  return {seconds: at / rate, db: max ? 20 * Math.log10(max / 32768) : -Infinity};
};

/** 把音效复制到渲染暂存目录时统一峰值电平（原始素材的峰值在 -26 ～ -37 dBFS，按 0.35 音量几乎听不见）。 */
export const stageSfx = (source: string, target: string, peakDb = -6) => {
  const {seconds, db} = measurePeak(source);
  const gain = Number.isFinite(db) ? Math.min(30, peakDb - db) : 0;
  run(['-v', 'error', '-y', '-i', source, '-af', `volume=${gain.toFixed(2)}dB`, '-c:a', 'libmp3lame', '-q:a', '2', target], `stage ${source}`);
  return seconds;
};

/** 两遍 loudnorm：先测，再按实测值线性归一（视频流复制，不重编码）。返回归一后的积分响度与真峰值。 */
export const normalizeLoudness = (video: string, target = {I: -14, TP: -1.5, LRA: 11}) => {
  const filter = `loudnorm=I=${target.I}:TP=${target.TP}:LRA=${target.LRA}`;
  const first = run(['-hide_banner', '-nostats', '-i', video, '-af', `${filter}:print_format=json`, '-f', 'null', '-'], 'loudnorm pass 1').stderr.toString();
  const json = JSON.parse(first.slice(first.lastIndexOf('{'), first.lastIndexOf('}') + 1)) as Record<string, string>;
  const measured = `measured_I=${json.input_i}:measured_TP=${json.input_tp}:measured_LRA=${json.input_lra}:measured_thresh=${json.input_thresh}:offset=${json.target_offset}:linear=true`;
  const tmp = video.replace(/\.mp4$/, '.loudnorm.mp4');
  run(['-v', 'error', '-y', '-i', video, '-c:v', 'copy', '-af', `${filter}:${measured},aresample=48000`, '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', tmp], 'loudnorm pass 2');
  renameSync(tmp, video);
  return measureLoudness(video);
};

export const measureLoudness = (video: string) => {
  const out = run(['-hide_banner', '-nostats', '-i', video, '-af', 'ebur128=peak=true', '-f', 'null', '-'], 'ebur128').stderr.toString();
  const summary = out.slice(out.lastIndexOf('Summary:'));
  const pick = (re: RegExp) => Number(summary.match(re)?.[1]);
  return {integratedLufs: pick(/I:\s+(-?[\d.]+) LUFS/), truePeakDb: pick(/Peak:\s+(-?[\d.]+) dBFS/)};
};

/** 换场附近要检查的帧：每拍开始前 1 帧、开始 0/2/4/8 帧。 */
const transitionFrames = (timeline: ShortTimeline) => [...new Set(timeline.beats.flatMap((beat) =>
  [-1, 0, 2, 4, 8].map((d) => beat.from + d)).filter((f) => f >= 0 && f < timeline.totalFrames))].sort((a, b) => a - b);

/**
 * 空白帧闸门：抽出换场附近的帧，统计内容区（标题到字幕，y 280–1480）里“不是纸面”的像素比例。
 * 低于 4% 就是一帧几乎空白的纸（旧模板每次换拍都清屏，就是这种帧）。
 */
export const findBlankFrames = (video: string, timeline: ShortTimeline, minInk = 0.04) => {
  const frames = transitionFrames(timeline);
  const [w, h] = [108, 192];
  const select = frames.map((f) => `eq(n\\,${f})`).join('+');
  const raw = run(['-v', 'error', '-i', video, '-vf', `select='${select}',scale=${w}:${h}`, '-vsync', '0', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], 'blank-frame scan').stdout as Buffer;
  const size = w * h * 3;
  const [y0, y1] = [Math.round((280 / 1920) * h), Math.round((1480 / 1920) * h)];
  const blank: Array<{frame: number; ink: number}> = [];
  frames.forEach((frame, k) => {
    const image = raw.subarray(k * size, (k + 1) * size);
    if (image.length < size) return;
    let ink = 0;
    for (let y = y0; y < y1; y += 1) for (let x = 0; x < w; x += 1) {
      const i = (y * w + x) * 3;
      if (Math.abs(image[i] - PAPER_RGB[0]) + Math.abs(image[i + 1] - PAPER_RGB[1]) + Math.abs(image[i + 2] - PAPER_RGB[2]) > 60) ink += 1;
    }
    const share = ink / ((y1 - y0) * w);
    if (share < minInk) blank.push({frame, ink: +share.toFixed(3)});
  });
  return blank;
};

/** 换场联系图：每拍取 开始前 1 帧 / 第 4 帧 / 60% 处 / 结束前，按时间顺序每行 4 张（约一行一拍）。 */
export const beatSheet = (video: string, timeline: ShortTimeline, output: string) => {
  const rows = timeline.beats.map((beat) => [beat.from - 1, beat.from + 4, beat.from + Math.round(beat.frames * 0.6), beat.from + beat.frames - 2]
    .map((f) => Math.min(timeline.totalFrames - 1, Math.max(0, f))));
  const frames = rows.flat();
  const select = frames.map((f) => `eq(n\\,${f})`).join('+');
  // select 会合并重复帧号，所以按出现顺序补齐。
  const unique = [...new Set(frames)].sort((a, b) => a - b);
  run(['-v', 'error', '-y', '-i', video, '-vf', `select='${select}',scale=216:-1,tile=4x${Math.ceil(unique.length / 4)}:padding=4:color=0xcccccc`, '-vsync', '0', '-frames:v', '1', output], 'beat sheet');
};
