import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {inflateSync} from 'node:zlib';
import {buildMemeVocabConfig} from '../../src/meme-vocab/config';
import {defaultMemeVocabInput} from '../../src/meme-vocab/content';
import type {MemeVocabVideoConfig} from '../../src/meme-vocab/types';
import {DEFAULT_MEME_VOCAB_CONFIG_PATH} from '../../src/meme-vocab/paths';

const arg = (name: string) => process.argv.slice(2).find((value) => value.startsWith(`--${name}=`))?.slice(name.length + 3);
const configPath = path.resolve(process.cwd(), arg('config') ?? DEFAULT_MEME_VOCAB_CONFIG_PATH);
const config: MemeVocabVideoConfig = existsSync(configPath)
  ? JSON.parse(readFileSync(configPath, 'utf8')) as MemeVocabVideoConfig
  : buildMemeVocabConfig(defaultMemeVocabInput());
const videoPath = arg('video') ? path.resolve(process.cwd(), arg('video')!) : undefined;
const errors: string[] = [];
const warnings: string[] = [];
const passedChecks: string[] = [];
const scenes = config.storyboard.scenes;
const last = scenes.at(-1);
const resolvedTimeline = config.resolvedTimeline;
const finalDuration = resolvedTimeline?.duration ?? config.storyboard.duration;

const check = (condition: boolean, error: string, passed: string) => {
  if (condition) errors.push(error);
  else passedChecks.push(passed);
};

const paeth = (a: number, b: number, c: number) => {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
};

const averagePngLuma = (png: Buffer) => {
  if (png.length < 33 || png.readUInt32BE(0) !== 0x89504e47) return undefined;
  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const idat: Buffer[] = [];
  while (offset + 12 <= png.length) {
    const length = png.readUInt32BE(offset);
    const type = png.toString('ascii', offset + 4, offset + 8);
    const data = png.subarray(offset + 8, offset + 8 + length);
    offset += 12 + length;
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
    } else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
  }
  const channels = ({0: 1, 2: 3, 4: 2, 6: 4} as Record<number, number>)[colorType];
  if (!width || !height || bitDepth !== 8 || !channels) return undefined;
  const decoded = inflateSync(Buffer.concat(idat));
  const rowBytes = width * channels;
  const rows: Buffer[] = [];
  let cursor = 0;
  for (let y = 0; y < height; y++) {
    const filter = decoded[cursor++];
    const row = Buffer.from(decoded.subarray(cursor, cursor + rowBytes));
    cursor += rowBytes;
    const previous = rows[y - 1];
    for (let x = 0; x < rowBytes; x++) {
      const left = x >= channels ? row[x - channels] : 0;
      const up = previous?.[x] ?? 0;
      const upLeft = previous && x >= channels ? previous[x - channels] : 0;
      if (filter === 1) row[x] = (row[x] + left) & 255;
      else if (filter === 2) row[x] = (row[x] + up) & 255;
      else if (filter === 3) row[x] = (row[x] + Math.floor((left + up) / 2)) & 255;
      else if (filter === 4) row[x] = (row[x] + paeth(left, up, upLeft)) & 255;
    }
    rows.push(row);
  }
  let total = 0;
  let count = 0;
  for (const row of rows) {
    for (let x = 0; x < width; x++) {
      const index = x * channels;
      const r = row[index];
      const g = channels >= 3 ? row[index + 1] : r;
      const b = channels >= 3 ? row[index + 2] : r;
      total += 0.2126 * r + 0.7152 * g + 0.0722 * b;
      count++;
    }
  }
  return total / count;
};

check(finalDuration < 15 || finalDuration > 28, `duration ${finalDuration}s is outside 15-28s`, 'duration 15-28s');
check(!resolvedTimeline || resolvedTimeline.scenes[0]?.startFrame !== 0, 'Hook does not start at frame 0', 'Hook starts at frame 0');
check(scenes.some((scene) => scene.estimatedDuration > 3 && scene.cameraMotion === 'still'), 'a still visual lasts more than 3 seconds', 'no still visual exceeds 3 seconds');
check(scenes.some((scene) => scene.displayText.join('').length > 70), 'single-screen text exceeds the 70-character heuristic', 'single-screen text heuristic');

const reveal = scenes.find((scene) => scene.sceneType === 'word_reveal');
check(!reveal || !reveal.displayText.includes(config.input.targetWord) || !reveal.displayText.includes(config.input.phonetic) || !reveal.displayText.includes(config.input.accurateMeaning), 'word, phonetic and meaning are not all present in Word Reveal', 'word, phonetic and meaning consistency');
check(!last?.quizQuestion || !last.quizAnswer, 'ending quiz question or answer is missing', 'ending interaction question');
const beforeQuiz = scenes.filter((scene) => scene.sceneType !== 'quiz_cta').map((scene) => `${scene.narration} ${scene.displayText.join(' ')}`).join(' ');
check(Boolean(last?.quizAnswer && beforeQuiz.toLocaleLowerCase().includes(last.quizAnswer.toLocaleLowerCase())), 'quiz answer appears before the quiz scene', 'quiz answer gating');
check(config.storyboard.width !== 1080 || config.storyboard.height !== 1920, 'canvas is not 1080x1920', '1080x1920 vertical canvas');
const sceneProportions = resolvedTimeline?.scenes.map((timelineScene) => ({
  sceneId: timelineScene.sceneId,
  duration: timelineScene.duration,
  proportion: Number((timelineScene.duration / Math.max(finalDuration, 0.001)).toFixed(4)),
})) ?? [];
const wordRevealTimeline = resolvedTimeline?.scenes.find((timelineScene) => scenes.find((scene) => scene.sceneId === timelineScene.sceneId)?.sceneType === 'word_reveal');
if (wordRevealTimeline && wordRevealTimeline.duration > 5.5) warnings.push(`Word Reveal scene is ${wordRevealTimeline.duration.toFixed(3)}s; target is 3.5-5.5s`);
if (wordRevealTimeline && wordRevealTimeline.duration > 6) errors.push(`Word Reveal scene is ${wordRevealTimeline.duration.toFixed(3)}s and exceeds the 6s hard limit`);
if (wordRevealTimeline && wordRevealTimeline.duration / Math.max(finalDuration, 0.001) > 0.3) warnings.push(`Word Reveal knowledge segment occupies ${(wordRevealTimeline.duration / finalDuration * 100).toFixed(1)}% of the video`);
if (config.assets.pendingGeneration.length > 0) warnings.push(`placeholder assets require replacement: ${config.assets.pendingGeneration.join(', ')}`);
check(!config.input.exampleSentence.trim(), 'example sentence is empty', 'example sentence exists');
check(!existsSync(path.resolve(process.cwd(), 'public', config.backgroundMusic.src)), `background music is missing: public/${config.backgroundMusic.src}`, 'background music path');
if (!config.audioTiming || config.audioTiming.status !== 'resolved') {
  errors.push('TTS failed or audio-timing.json is not resolved; rendering must stop');
} else if (!resolvedTimeline || resolvedTimeline.source !== 'tts-resolved') {
  errors.push('resolvedTimeline is missing or is not TTS-resolved');
} else {
  const audioByScene = new Map(config.audioTiming.segments.map((segment) => [segment.sceneId, segment]));
  const wordRevealAudioForDuration = config.audioTiming.segments.find((segment) => scenes.find((scene) => scene.sceneId === segment.sceneId)?.sceneType === 'word_reveal');
  if (wordRevealAudioForDuration && wordRevealAudioForDuration.duration > 6) errors.push(`Word Reveal TTS is ${wordRevealAudioForDuration.duration.toFixed(3)}s and exceeds the 6s hard limit`);
  else if (wordRevealAudioForDuration && wordRevealAudioForDuration.duration > 5.5) warnings.push(`Word Reveal TTS is ${wordRevealAudioForDuration.duration.toFixed(3)}s; target is 4-5.5s`);
  for (const scene of scenes) {
    const segment = audioByScene.get(scene.sceneId);
    if (!segment) errors.push(`missing TTS segment for scene ${scene.sceneId}`);
    else if (segment.status !== 'resolved') errors.push(`TTS segment failed for scene ${scene.sceneId}`);
    else {
      const audioPath = path.resolve(process.cwd(), 'public', segment.audioPath);
      if (!existsSync(audioPath)) errors.push(`audio file is missing: public/${segment.audioPath}`);
      else {
        const fileProbe = spawnSync(process.env.FFPROBE_PATH ?? path.resolve(process.cwd(), 'node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe'), ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', audioPath], {encoding: 'utf8', windowsHide: true});
        if (fileProbe.status !== 0 || Number(fileProbe.stdout.trim()) <= 0) errors.push(`audio file cannot be read: public/${segment.audioPath}`);
      }
      if (segment.leadingSilence > 0.8 || segment.trailingSilence > 0.8) errors.push(`unexpected silence over 0.8s in ${segment.segmentId}`);
      if (segment.speakingRate > 8) warnings.push(`speaking rate is fast in ${segment.segmentId}: ${segment.speakingRate} units/s`);
    }
  }
  const sortedSegments = [...config.audioTiming.segments].sort((a, b) => a.startTime - b.startTime);
  sortedSegments.slice(0, -1).forEach((segment, index) => {
    const gap = sortedSegments[index + 1].startTime - segment.endTime;
    if (gap > 0.8) errors.push(`unexpected audio gap ${gap.toFixed(2)}s after ${segment.segmentId}`);
  });
  const durationDeltaFrames = Math.abs(config.audioTiming.totalDuration * config.resolvedTimeline.fps - config.resolvedTimeline.totalFrames);
  if (durationDeltaFrames > 2) errors.push(`narration/composition duration differs by ${durationDeltaFrames.toFixed(2)} frames`);
  else passedChecks.push('narration/composition duration within 2 frames');
  const wordScene = resolvedTimeline.scenes.find((timelineScene) => scenes.find((scene) => scene.sceneId === timelineScene.sceneId)?.sceneType === 'word_reveal');
  const wordAudio = wordScene ? audioByScene.get(wordScene.sceneId) : undefined;
  if (wordScene && wordAudio && wordScene.revealTimingFrames.wordStartFrame < wordScene.startFrame + Math.round(wordAudio.leadingSilence * resolvedTimeline.fps)) errors.push('core word reveal occurs before its TTS segment begins');
  else passedChecks.push('core word reveal is not earlier than TTS start');
}
if (!videoPath) warnings.push('no rendered video supplied; black-frame, silence and decode checks are pending');

if (videoPath) {
  if (!existsSync(videoPath)) errors.push(`rendered video is missing: ${videoPath}`);
  else {
    const ffprobe = process.env.FFPROBE_PATH ?? path.resolve(process.cwd(), 'node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe');
    const probe = spawnSync(ffprobe, ['-v', 'error', '-show_entries', 'stream=codec_type,width,height,r_frame_rate:format=duration', '-of', 'json', videoPath], {encoding: 'utf8', windowsHide: true});
    if (probe.status !== 0) errors.push('ffprobe failed for rendered video');
    else {
      const metadata = JSON.parse(probe.stdout) as {streams?: Array<Record<string, string>>; format?: {duration?: string}};
      const video = metadata.streams?.find((stream) => stream.codec_type === 'video');
      const audio = metadata.streams?.find((stream) => stream.codec_type === 'audio');
      if (!video) errors.push('rendered video stream is missing');
      else passedChecks.push('rendered video stream');
      if (!audio) errors.push('rendered audio stream is missing');
      else passedChecks.push('rendered audio stream');
      if (video && (video.width !== '1080' || video.height !== '1920')) warnings.push(`render is low-resolution draft: ${video.width}x${video.height}`);
      check(Number(metadata.format?.duration ?? 0) > finalDuration + 0.2, 'audio/video duration exceeds resolved timeline', 'audio/video duration bound');
      if (resolvedTimeline && metadata.format?.duration) {
        const mediaDeltaFrames = Math.abs(Number(metadata.format.duration) * resolvedTimeline.fps - resolvedTimeline.totalFrames);
        if (mediaDeltaFrames > 2) errors.push(`media/composition duration differs by ${mediaDeltaFrames.toFixed(2)} frames`);
        else passedChecks.push('media/composition duration within 2 frames');
      }

      const ffmpeg = process.env.FFMPEG_PATH ?? path.resolve(process.cwd(), 'node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe');
      if (existsSync(ffmpeg)) {
        const silence = spawnSync(ffmpeg, ['-v', 'info', '-i', videoPath, '-af', 'silencedetect=noise=-50dB:d=1.5', '-vn', '-f', 'null', '-'], {encoding: 'utf8', windowsHide: true});
        const silenceDurations = [...`${silence.stdout ?? ''}\n${silence.stderr ?? ''}`.matchAll(/silence_duration:\s*([0-9.]+)/g)].map((match) => Number(match[1]));
        if (silence.status !== 0) warnings.push('ffmpeg silence detection could not complete');
        else if (silenceDurations.some((duration) => duration >= 1.5)) errors.push(`continuous silence detected: ${Math.max(...silenceDurations).toFixed(2)}s`);
        else passedChecks.push('no continuous silence >= 1.5s');

        const sampleTimes = Array.from({length: Math.ceil(finalDuration / 2)}, (_, index) => index * 2);
        const lumaSamples = sampleTimes.map((time) => {
          const frame = spawnSync(ffmpeg, ['-v', 'error', '-ss', String(time), '-i', videoPath, '-frames:v', '1', '-f', 'image2pipe', '-c:v', 'png', '-'], {encoding: null, windowsHide: true});
          return frame.status === 0 ? averagePngLuma(frame.stdout) : undefined;
        });
        if (lumaSamples.some((value) => value === undefined)) warnings.push('black-frame sampling could not complete for every sample');
        else if (lumaSamples.some((value) => (value ?? 255) < 3)) errors.push('near-black frame sample detected');
        else passedChecks.push('sampled black-frame scan');
      } else warnings.push('ffmpeg is unavailable; black-frame and silence checks are pending');
    }
  }
}

const status = errors.length > 0 ? 'FAIL' : warnings.length > 0 ? 'PASS_WITH_WARNINGS' : 'PASS';
const report = {
  status,
  mode: config.mode,
  targetWord: config.input.targetWord,
  duration: finalDuration,
  sceneProportions,
  errors,
  warnings,
  passedChecks,
  manualChecklist: [
    '[ ] Replace every PLACEHOLDER ASSET with the intended Jimeng image',
    '[ ] Generate and listen to TTS voiceover against the storyboard',
    '[ ] Review subtitle size, lower Douyin UI occlusion, and first 2 seconds on a phone',
    '[ ] Human-check the interrupt/disrupt meaning boundary and naturalness of the example sentence',
  ],
};
const reportDir = arg('report-dir') ? path.resolve(process.cwd(), arg('report-dir')!) : path.dirname(configPath);
mkdirSync(reportDir, {recursive: true});
const out = path.join(reportDir, 'qa-report.md');
const markdown = `# meme_vocab_short QA\n\nStatus: **${status}**\n\n- Word: ${config.input.targetWord}\n- Duration: ${finalDuration}s\n- Errors: ${errors.length}\n- Warnings: ${warnings.length}\n\n## Scene proportions\n\n${sceneProportions.map((scene) => `- ${scene.sceneId}: ${scene.duration.toFixed(3)}s (${(scene.proportion * 100).toFixed(1)}%)`).join('\n')}\n\n## Automatic checks\n${[...errors.map((item) => `- FAIL: ${item}`), ...warnings.map((item) => `- WARN: ${item}`), ...passedChecks.map((item) => `- PASS: ${item}`)].join('\n')}\n\n## Manual checklist\n${report.manualChecklist.map((item) => `- ${item}`).join('\n')}\n`;
writeFileSync(out, markdown, 'utf8');
writeFileSync(path.join(reportDir, 'qa-report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(`${status}: ${path.relative(process.cwd(), out)}`);
if (errors.length > 0) process.exit(1);
