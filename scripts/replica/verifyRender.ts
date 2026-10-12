import 'dotenv/config';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
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
const outputArg = args.find((arg) => arg.startsWith('--input='))?.slice('--input='.length);
const input = path.resolve(repoRoot, outputArg ?? resolveDeliveryPaths(project, repoRoot).video);
if (!existsSync(input)) throw new Error(`Rendered video is missing: ${input}`);
const backgroundMusicPath = path.resolve(repoRoot, 'public', project.backgroundMusic.src);

const bundledCompositorDir = path.resolve(
  repoRoot,
  'node_modules/@remotion/compositor-win32-x64-msvc',
);
const bundledFfprobe = path.resolve(bundledCompositorDir, 'ffprobe.exe');
const bundledFfmpeg = path.resolve(bundledCompositorDir, 'ffmpeg.exe');
const ffprobe =
  process.env.FFPROBE_PATH ??
  (process.platform === 'win32' && existsSync(bundledFfprobe) ? bundledFfprobe : 'ffprobe');
const ffmpeg =
  process.env.FFMPEG_PATH ??
  (process.platform === 'win32' && existsSync(bundledFfmpeg) ? bundledFfmpeg : 'ffmpeg');
const errors: string[] = [];
if (!existsSync(backgroundMusicPath)) {
  errors.push(`Configured background music is missing: public/${project.backgroundMusic.src}.`);
}

const paethPredictor = (left: number, up: number, upperLeft: number) => {
  const prediction = left + up - upperLeft;
  const leftDistance = Math.abs(prediction - left);
  const upDistance = Math.abs(prediction - up);
  const upperLeftDistance = Math.abs(prediction - upperLeft);
  if (leftDistance <= upDistance && leftDistance <= upperLeftDistance) return left;
  if (upDistance <= upperLeftDistance) return up;
  return upperLeft;
};

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
  let interlace = -1;
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
      interlace = file[dataStart + 12];
    } else if (type === 'IDAT') {
      idatChunks.push(file.subarray(dataStart, dataEnd));
    } else if (type === 'IEND') {
      break;
    }
    offset = dataEnd + 4;
  }

  if (width !== 1 || height !== 1 || bitDepth !== 8 || ![2, 6].includes(colorType) || interlace !== 0) {
    throw new Error(`unsupported PNG sample ${width}x${height}, depth ${bitDepth}, color type ${colorType}`);
  }
  const bytesPerPixel = colorType === 6 ? 4 : 3;
  const inflated = inflateSync(Buffer.concat(idatChunks));
  if (inflated.length !== bytesPerPixel + 1) throw new Error('unexpected PNG sample size');
  const filter = inflated[0];
  const decoded = Buffer.alloc(bytesPerPixel);
  for (let index = 0; index < bytesPerPixel; index += 1) {
    const raw = inflated[index + 1];
    const left = index >= bytesPerPixel ? decoded[index - bytesPerPixel] : 0;
    let value: number;
    if (filter === 0) value = raw;
    else if (filter === 1) value = raw + left;
    else if (filter === 2) value = raw;
    else if (filter === 3) value = raw + Math.floor(left / 2);
    else if (filter === 4) value = raw + paethPredictor(left, 0, 0);
    else throw new Error(`unsupported PNG row filter ${filter}`);
    decoded[index] = value & 0xff;
  }
  return [decoded[0], decoded[1], decoded[2]] as const;
};

const probeResult = spawnSync(
  ffprobe,
  [
    '-v',
    'error',
    '-count_frames',
    '-show_entries',
    'format=duration,size,bit_rate:stream=index,codec_type,codec_name,width,height,pix_fmt,r_frame_rate,avg_frame_rate,nb_frames,nb_read_frames,sample_rate,channels,channel_layout,duration',
    '-of',
    'json',
    input,
  ],
  {encoding: 'utf8', windowsHide: true, maxBuffer: 4 * 1024 * 1024},
);
if (probeResult.error || probeResult.status !== 0) {
  throw new Error(`ffprobe failed: ${probeResult.error?.message ?? probeResult.stderr}`);
}

const metadata = JSON.parse(probeResult.stdout) as {
  streams: Array<Record<string, string | number>>;
  format: Record<string, string>;
};
const video = metadata.streams.find((stream) => stream.codec_type === 'video');
const audio = metadata.streams.find((stream) => stream.codec_type === 'audio');
if (!video) errors.push('Video stream is missing.');
if (!audio) errors.push('Audio stream is missing.');

const expectedFrames = Math.round(project.storyboard.duration * 30);
if (video) {
  if (video.codec_name !== 'h264') errors.push(`Video codec is ${video.codec_name}, expected h264.`);
  if (Number(video.width) !== 1920 || Number(video.height) !== 1080) {
    errors.push(`Dimensions are ${video.width}x${video.height}, expected 1920x1080.`);
  }
  if (!['yuv420p', 'yuvj420p'].includes(String(video.pix_fmt))) {
    errors.push(`Pixel format is ${video.pix_fmt}, expected yuv420p/yuvj420p.`);
  }
  if (video.r_frame_rate !== '30/1' || video.avg_frame_rate !== '30/1') {
    errors.push(`Frame rate is ${video.r_frame_rate} (${video.avg_frame_rate} average), expected 30/1 CFR.`);
  }
  const measuredFrames = Number(video.nb_read_frames ?? video.nb_frames);
  if (measuredFrames !== expectedFrames) {
    errors.push(`Video has ${measuredFrames} frames, expected ${expectedFrames}.`);
  }
}
if (audio) {
  if (audio.codec_name !== 'aac') errors.push(`Audio codec is ${audio.codec_name}, expected aac.`);
  if (Number(audio.channels) !== 2) errors.push(`Audio has ${audio.channels} channels, expected stereo.`);
  if (Number(audio.sample_rate) !== 48000) {
    errors.push(`Audio sample rate is ${audio.sample_rate}, expected 48000 Hz.`);
  }
}

const samplePixel = (frameIndex: number) => {
  const timestamp = Math.max(0, frameIndex / 30);
  const result = spawnSync(
    ffmpeg,
    [
      '-v',
      'error',
      '-ss',
      timestamp.toFixed(6),
      '-i',
      input,
      '-vf',
      'crop=1:1:10:10,format=rgba',
      '-frames:v',
      '1',
      '-c:v',
      'png',
      '-f',
      'image2pipe',
      'pipe:1',
    ],
    {encoding: null, windowsHide: true, maxBuffer: 1024 * 1024},
  );
  if (result.error || result.status !== 0 || result.stdout.length < 33) {
    errors.push(`Could not sample frame ${frameIndex}: ${result.error?.message ?? result.stderr.toString()}`);
    return null;
  }
  try {
    return decodeFirstPngPixel(result.stdout);
  } catch (error) {
    errors.push(`Could not decode frame ${frameIndex}: ${(error as Error).message}`);
    return null;
  }
};

const fadeFrames = Math.round(project.storyboard.fadeToBlackSec * 30);
const fadeStart = Math.max(0, expectedFrames - fadeFrames);
const lastFrame = expectedFrames - 1;
const sampleIndexes = Array.from(
  new Set([
    0,
    Math.max(0, fadeStart - 1),
    fadeFrames > 0 ? Math.floor((fadeStart + lastFrame) / 2) : lastFrame,
    lastFrame,
  ]),
);
const pixelSamples = sampleIndexes.map((frame) => ({frame, rgb: samplePixel(frame)}));
const tolerance = 4;
const first = pixelSamples.find((sample) => sample.frame === 0)?.rgb;
if (first && first.some((channel) => Math.abs(channel - 255) > tolerance)) {
  errors.push(`First-frame corner is RGB ${first.join(',')}, expected white.`);
}

const endOpacity = project.storyboard.fadeEndOpacity ?? 1;
for (const sample of pixelSamples) {
  if (!sample.rgb) continue;
  const progress =
    fadeFrames <= 0 || sample.frame < fadeStart
      ? 0
      : (sample.frame - fadeStart) / Math.max(1, lastFrame - fadeStart);
  const expected = Math.round(255 * (1 - endOpacity * progress));
  if (sample.rgb.some((channel) => Math.abs(channel - expected) > tolerance)) {
    errors.push(
      `Frame ${sample.frame} corner is RGB ${sample.rgb.join(',')}, expected about ${expected}.`,
    );
  }
}

const volumeResult = spawnSync(
  ffmpeg,
  [
    '-hide_banner',
    '-v',
    'error',
    '-i',
    input,
    '-vn',
    '-map',
    '0:a:0',
    '-c:a',
    'pcm_s16le',
    '-ar',
    '48000',
    '-ac',
    '2',
    '-f',
    'wav',
    'pipe:1',
  ],
  {encoding: null, windowsHide: true, maxBuffer: 128 * 1024 * 1024},
);
if (volumeResult.error || volumeResult.status !== 0) {
  errors.push(`Audio peak measurement failed: ${volumeResult.error?.message ?? volumeResult.stderr.toString()}`);
}
let maxVolumeDb: number | null = null;
if (!volumeResult.error && volumeResult.status === 0) {
  const dataOffset = volumeResult.stdout.indexOf(Buffer.from('data'));
  if (dataOffset < 0 || dataOffset + 8 >= volumeResult.stdout.length) {
    errors.push('Audio peak measurement failed: WAV data chunk is missing.');
  } else {
    let peak = 0;
    for (let offset = dataOffset + 8; offset + 1 < volumeResult.stdout.length; offset += 2) {
      peak = Math.max(peak, Math.abs(volumeResult.stdout.readInt16LE(offset)));
    }
    maxVolumeDb = peak > 0 ? 20 * Math.log10(peak / 32768) : null;
  }
}
if (maxVolumeDb !== null && maxVolumeDb > -1) {
  errors.push(`Audio max volume is ${maxVolumeDb.toFixed(2)} dBFS, expected <= -1 dBFS.`);
}

const decodeStream = (kind: 'video' | 'audio') => {
  const isVideo = kind === 'video';
  const result = spawnSync(
    ffmpeg,
    [
      '-hide_banner',
      '-v',
      'error',
      '-xerror',
      '-i',
      input,
      '-map',
      isVideo ? '0:v:0' : '0:a:0',
      isVideo ? '-c:v' : '-c:a',
      isVideo ? 'rawvideo' : 'pcm_s16le',
      '-f',
      'null',
      '-',
    ],
    {encoding: 'utf8', windowsHide: true, maxBuffer: 4 * 1024 * 1024},
  );
  if (result.error || result.status !== 0) {
    errors.push(
      `${kind} full decode failed: ${result.error?.message ?? result.stderr.trim()}`,
    );
    return false;
  }
  return true;
};

const fullDecode = {
  video: decodeStream('video'),
  audio: decodeStream('audio'),
};

const silenceConfig = project.quality?.audioSilence;
const longSilences: Array<{start: number; end: number; duration: number}> = [];
const unexplainedSilences: typeof longSilences = [];
const narrationCoverageGaps: typeof longSilences = [];
const unexplainedNarrationCoverageGaps: typeof longSilences = [];
if (silenceConfig) {
  const narrationWindows = [...project.storyboard.scenes]
    .sort((a, b) => a.start - b.start)
    .map((scene) => {
      const clip = project.audioManifest[scene.id];
      const isFinal = Math.abs(scene.start + scene.duration - project.storyboard.duration) <= 0.002;
      const targetDuration = Math.max(
        1 / 30,
        scene.duration - (isFinal ? project.storyboard.fadeToBlackSec : 0),
      );
      const playbackRate = clip ? Math.max(1, clip.duration / targetDuration) : 1;
      const playbackDuration = clip ? clip.duration / playbackRate : 0;
      return {start: scene.start, end: scene.start + playbackDuration};
    });
  for (let index = 0; index < narrationWindows.length; index += 1) {
    const current = narrationWindows[index];
    const nextStart = narrationWindows[index + 1]?.start ?? project.storyboard.duration;
    const duration = nextStart - current.end;
    if (duration >= silenceConfig.minimumDurationSec) {
      narrationCoverageGaps.push({start: current.end, end: nextStart, duration});
    }
  }
  for (const gap of narrationCoverageGaps) {
    const allowed = (silenceConfig.allowedWindows ?? []).some(
      (window) => gap.start >= window.start - 0.15 && gap.end <= window.end + 0.15,
    );
    if (!allowed) unexplainedNarrationCoverageGaps.push(gap);
  }
  for (const gap of unexplainedNarrationCoverageGaps) {
    errors.push(
      `Narration-only coverage gap ${gap.start.toFixed(3)}-${gap.end.toFixed(3)}s ` +
        `(${gap.duration.toFixed(3)}s) is hidden by background music. Repair the narration timing.`,
    );
  }

  const silenceResult = spawnSync(
    ffmpeg,
    [
      '-hide_banner',
      '-i',
      input,
      '-vn',
      '-af',
      `silencedetect=n=${silenceConfig.thresholdDb}dB:d=${silenceConfig.minimumDurationSec}`,
      '-f',
      'null',
      '-',
    ],
    {encoding: 'utf8', windowsHide: true, maxBuffer: 4 * 1024 * 1024},
  );
  if (silenceResult.error || silenceResult.status !== 0) {
    errors.push(
      `Audio silence scan failed: ${silenceResult.error?.message ?? silenceResult.stderr}`,
    );
  } else {
    const pattern =
      /silence_start:\s*([\d.]+)[\s\S]*?silence_end:\s*([\d.]+)\s*\|\s*silence_duration:\s*([\d.]+)/g;
    for (const match of silenceResult.stderr.matchAll(pattern)) {
      longSilences.push({
        start: Number(match[1]),
        end: Number(match[2]),
        duration: Number(match[3]),
      });
    }
    for (const silence of longSilences) {
      const allowed = (silenceConfig.allowedWindows ?? []).some(
        (window) => silence.start >= window.start - 0.15 && silence.end <= window.end + 0.15,
      );
      if (!allowed) unexplainedSilences.push(silence);
    }
    for (const silence of unexplainedSilences) {
      errors.push(
        `Unexplained audio silence ${silence.start.toFixed(3)}-${silence.end.toFixed(3)}s ` +
          `(${silence.duration.toFixed(3)}s) exceeds the ${silenceConfig.minimumDurationSec}s gate.`,
      );
    }
  }
}

const report = {
  project: project.slug,
  input: path.relative(repoRoot, input).replace(/\\/g, '/'),
  expectedFrames,
  metadata,
  pixelSamples,
  fade: {frames: fadeFrames, startFrame: fadeStart, endOpacity},
  maxVolumeDb,
  fullDecode,
  backgroundMusic: {
    ...project.backgroundMusic,
    source: path.relative(repoRoot, backgroundMusicPath).replace(/\\/g, '/'),
    sourceExists: existsSync(backgroundMusicPath),
  },
  silenceConfig,
  narrationCoverageGaps,
  unexplainedNarrationCoverageGaps,
  longSilences,
  unexplainedSilences,
  errors,
};
const reportPath = path.resolve(path.dirname(input), 'render-report.json');
mkdirSync(path.dirname(reportPath), {recursive: true});
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

if (errors.length > 0) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  console.error(`Report: ${path.relative(repoRoot, reportPath)}`);
  process.exit(1);
}
console.log(
  `Render ${project.slug} verified: ${expectedFrames} frames, ${pixelSamples.length} pixel samples, ` +
    `max volume ${maxVolumeDb === null ? 'silent' : `${maxVolumeDb.toFixed(2)} dBFS`}, ` +
    `${longSilences.length} allowed long-silence window(s).`,
);
console.log(`Report: ${path.relative(repoRoot, reportPath)}.`);
