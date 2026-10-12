import 'dotenv/config';
import {copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {buildResolvedTimeline, applyResolvedTimelineToStoryboard} from '../../src/meme-vocab/timeline';
import {applyTimelineToAssetManifest} from '../../src/meme-vocab/assets';
import {DEFAULT_MEME_VOCAB_CONFIG_PATH} from '../../src/meme-vocab/paths';
import {probeAudioDuration, runFfmpeg, synthesizeDashscope} from '../../src/tts/dashscope';
import type {MemeVocabAudioTiming, MemeVocabAudioTimingSegment, MemeVocabVideoConfig} from '../../src/meme-vocab/types';

const repoRoot = process.cwd();
// The bundled Remotion ffmpeg intentionally omits silenceremove. Use an explicitly
// configured full ffmpeg for trimming; the rest of the pipeline still uses ffprobe metadata.
process.env.FFMPEG_PATH = process.env.MEME_VOCAB_FFMPEG_PATH ?? process.env.FFMPEG_PATH ?? 'ffmpeg';
const runBundledFfmpeg = (args: string[]) => {
  const previous = process.env.FFMPEG_PATH;
  process.env.FFMPEG_PATH = path.resolve(repoRoot, 'node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe');
  try {
    return runFfmpeg(args, repoRoot);
  } finally {
    process.env.FFMPEG_PATH = previous;
  }
};
const args = process.argv.slice(2);
const arg = (name: string) => args.find((value) => value.startsWith(`--${name}=`))?.slice(name.length + 3);
const configPath = path.resolve(repoRoot, arg('config') ?? DEFAULT_MEME_VOCAB_CONFIG_PATH);
if (!existsSync(configPath)) throw new Error(`Config is missing: ${configPath}. Run npm run meme:vocab:generate first.`);

const config = JSON.parse(readFileSync(configPath, 'utf8')) as MemeVocabVideoConfig;
const outputDir = path.resolve(repoRoot, config.input.outputDirectory);
const outputAudioDir = path.join(outputDir, 'audio');
const publicAudioDir = path.resolve(repoRoot, 'public/assets/audio/meme-vocab', config.input.targetWord);
mkdirSync(outputAudioDir, {recursive: true});
mkdirSync(publicAudioDir, {recursive: true});

const model = process.env.MEME_VOCAB_TTS_MODEL ?? config.tts.model;
const voice = process.env.MEME_VOCAB_TTS_VOICE ?? config.tts.voice;
const rate = Number(process.env.MEME_VOCAB_TTS_RATE ?? config.tts.rate);
const pitch = Number(process.env.MEME_VOCAB_TTS_PITCH ?? config.tts.pitch);
const volume = Number(process.env.MEME_VOCAB_TTS_VOLUME ?? config.tts.volume);
if (![rate, pitch, volume].every(Number.isFinite)) throw new Error('MEME_VOCAB_TTS_RATE/PITCH/VOLUME must be numeric.');

const sceneLabel = (index: number) => `${String(index + 1).padStart(2, '0')}-${['hook', 'story', 'word-reveal', 'example', 'quiz'][index]}`;
const relativePublic = (filePath: string) => path.relative(path.resolve(repoRoot, 'public'), filePath).replace(/\\/g, '/');
const relativeOutput = (filePath: string) => path.relative(outputDir, filePath).replace(/\\/g, '/');
const speechUnits = (text: string) => {
  const chinese = (text.match(/[\u3400-\u9fff]/g) ?? []).length;
  const englishWords = (text.match(/[A-Za-z]+(?:'[A-Za-z]+)?/g) ?? []).length;
  return chinese + englishWords;
};

const measureSilence = (filePath: string, duration: number) => {
  const result = runFfmpeg(['-v', 'info', '-i', filePath, '-af', 'silencedetect=noise=-45dB:d=0.03', '-vn', '-f', 'null', '-'], repoRoot);
  const log = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
  const starts = [...log.matchAll(/silence_start:\s*([0-9.]+)/g)].map((match) => Number(match[1]));
  const ends = [...log.matchAll(/silence_end:\s*([0-9.]+)/g)].map((match) => Number(match[1]));
  const leadingSilence = starts[0] !== undefined && starts[0] <= 0.02 ? (ends[0] ?? 0) : 0;
  const lastStart = starts.at(-1);
  const trailingSilence = lastStart !== undefined && duration - lastStart >= 0.03 ? duration - lastStart : 0;
  return {leadingSilence: Number(leadingSilence.toFixed(3)), trailingSilence: Number(trailingSilence.toFixed(3))};
};

const makeFailedTiming = (error: string, segments: MemeVocabAudioTimingSegment[], compressionAttempts: MemeVocabAudioTiming['compressionAttempts'] = []): MemeVocabAudioTiming => ({
  provider: 'dashscope',
  status: 'failed',
  audioDirectory: relativeOutput(outputAudioDir),
  narrationPath: '',
  narrationOutputPath: '',
  segments,
  totalDuration: 0,
  compressionAttempts,
  error,
});

const writeFailure = (error: string, segments: MemeVocabAudioTimingSegment[], compressionAttempts: MemeVocabAudioTiming['compressionAttempts'] = []) => {
  const failedTiming = makeFailedTiming(error, segments, compressionAttempts);
  const failedConfig = {...config, audioTiming: failedTiming};
  writeFileSync(path.join(outputDir, 'audio-timing.json'), `${JSON.stringify(failedTiming, null, 2)}\n`, 'utf8');
  writeFileSync(configPath, `${JSON.stringify(failedConfig, null, 2)}\n`, 'utf8');
  if (compressionAttempts.length > 0) {
    writeFileSync(path.join(outputDir, 'tts-failure-report.md'), `# TTS compression failure\n\n${error}\n\n## Word Reveal attempts\n\n${compressionAttempts.map((attempt) => `- Attempt ${attempt.attempt}: ${attempt.duration.toFixed(3)}s — ${attempt.text}`).join('\n')}\n`, 'utf8');
  }
};

const main = async () => {
  const segments: MemeVocabAudioTimingSegment[] = [];
  const generateSegment = async (index: number, text: string): Promise<MemeVocabAudioTimingSegment> => {
    const scene = config.storyboard.scenes[index];
    const id = sceneLabel(index);
    const sourcePath = path.join(outputAudioDir, `${id}.source.mp3`);
    const rawPath = path.join(outputAudioDir, `${id}.raw.wav`);
    const outputPath = path.join(outputAudioDir, `${id}.wav`);
    const publicPath = path.join(publicAudioDir, `${id}.wav`);
    console.log(`Generating ${id} with ${model}/${voice}: ${text}`);
    const bytes = await synthesizeDashscope(text, {model, voice, rate, pitch, volume, format: 'mp3'});
    writeFileSync(sourcePath, bytes);
    runFfmpeg(['-y', '-i', sourcePath, '-ar', '44100', '-ac', '2', '-c:a', 'pcm_s16le', rawPath], repoRoot);
    rmSync(sourcePath, {force: true});
    const rawDuration = probeAudioDuration(rawPath, repoRoot);
    const silence = measureSilence(rawPath, rawDuration);
    runFfmpeg(['-y', '-i', rawPath, '-af', 'silenceremove=start_periods=1:start_duration=0.03:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_duration=0.03:start_threshold=-45dB,areverse', '-ar', '44100', '-ac', '2', '-c:a', 'pcm_s16le', publicPath], repoRoot);
    copyFileSync(publicPath, outputPath);
    rmSync(rawPath, {force: true});
    const duration = probeAudioDuration(publicPath, repoRoot);
    return {
      segmentId: id,
      sceneId: scene.sceneId,
      text,
      audioPath: relativePublic(publicPath),
      outputAudioPath: relativeOutput(outputPath),
      startTime: 0,
      duration: Number(duration.toFixed(3)),
      endTime: Number(duration.toFixed(3)),
      leadingSilence: silence.leadingSilence,
      trailingSilence: silence.trailingSilence,
      speakingRate: Number((speechUnits(text) / duration).toFixed(2)),
      status: 'resolved',
    };
  };

  for (const [index, scene] of config.storyboard.scenes.entries()) {
    segments.push(await generateSegment(index, scene.ttsText));
  }

  const wordRevealIndex = config.storyboard.scenes.findIndex((scene) => scene.sceneType === 'word_reveal');
  const wordRevealScene = config.storyboard.scenes[wordRevealIndex];
  const compressionTexts = wordRevealScene && wordRevealIndex >= 0 ? [
    wordRevealScene.ttsText,
    `${config.input.targetWord}，意思是打断。inter 是插入，rupt 是打破，这是记忆联想。`,
    `${config.input.targetWord}，打断。记忆：inter 插入，rupt 打破。`,
  ] : [];
  const compressionAttempts: NonNullable<MemeVocabAudioTiming['compressionAttempts']> = [];
  if (wordRevealIndex >= 0 && segments[wordRevealIndex]) {
    compressionAttempts.push({attempt: 0, text: compressionTexts[0], duration: segments[wordRevealIndex].duration});
    let attempt = 1;
    while (segments[wordRevealIndex].duration > 5.5 && attempt < compressionTexts.length) {
      segments[wordRevealIndex] = await generateSegment(wordRevealIndex, compressionTexts[attempt]);
      compressionAttempts.push({attempt, text: compressionTexts[attempt], duration: segments[wordRevealIndex].duration});
      attempt += 1;
    }
    if (segments[wordRevealIndex].duration > 6) {
      const message = `Word Reveal remains ${segments[wordRevealIndex].duration.toFixed(3)}s after two compression attempts; hard limit is 6s. Rendering stopped.`;
      writeFailure(message, segments, compressionAttempts);
      throw new Error(message);
    }
  }

  const ttsStoryboard = {
    ...config.storyboard,
    scenes: config.storyboard.scenes.map((scene, index) => ({
      ...scene,
      ...(index === wordRevealIndex && segments[index] ? {ttsText: segments[index].text} : {}),
    })),
  };
  const resolvedTimeline = buildResolvedTimeline(ttsStoryboard, segments);
  const resolvedSegments = segments.map((segment) => {
    const scene = resolvedTimeline.scenes.find((candidate) => candidate.sceneId === segment.sceneId)!;
    return {...segment, startTime: scene.startTime, endTime: Number((scene.startTime + segment.duration).toFixed(3))};
  });

  const publicNarration = path.join(publicAudioDir, 'narration.wav');
  const outputNarration = path.join(outputAudioDir, 'narration.wav');
  const ffmpegArgs = ['-y'];
  resolvedSegments.forEach((segment) => ffmpegArgs.push('-i', path.resolve(repoRoot, 'public', segment.audioPath)));
  const delayed = resolvedSegments.map((segment, index) => {
    const delayMs = Math.round((resolvedTimeline.scenes.find((scene) => scene.sceneId === segment.sceneId)!.startFrame / 30) * 1000);
    return `[${index}:a]adelay=${delayMs}|${delayMs}[a${index}]`;
  });
  const labels = resolvedSegments.map((_, index) => `[a${index}]`).join('');
  const timelineSilence = `anullsrc=r=44100:cl=stereo,atrim=duration=${resolvedTimeline.duration.toFixed(3)}[bed]`;
  ffmpegArgs.push('-filter_complex', `${delayed.join(';')};${timelineSilence};${labels}[bed]amix=inputs=${resolvedSegments.length + 1}:duration=longest:dropout_transition=0[out]`, '-map', '[out]', '-ar', '44100', '-ac', '2', '-c:a', 'pcm_s16le', publicNarration);
  runBundledFfmpeg(ffmpegArgs);
  copyFileSync(publicNarration, outputNarration);

  const audioTiming: MemeVocabAudioTiming = {
    provider: 'dashscope',
    status: 'resolved',
    audioDirectory: relativeOutput(outputAudioDir),
    narrationPath: relativePublic(publicNarration),
    narrationOutputPath: relativeOutput(outputNarration),
    segments: resolvedSegments,
    totalDuration: probeAudioDuration(publicNarration, repoRoot),
    compressionAttempts,
  };
  const resolvedStoryboard = applyResolvedTimelineToStoryboard(ttsStoryboard, resolvedTimeline);
  const assets = applyTimelineToAssetManifest(config.assets, resolvedStoryboard, resolvedTimeline);
  const nextConfig: MemeVocabVideoConfig = {
    ...config,
    storyboard: resolvedStoryboard,
    resolvedTimeline,
    audioTiming,
    assets,
    tts: {...config.tts, model, voice, rate, pitch, volume},
  };
  writeFileSync(path.join(outputDir, 'audio-timing.json'), `${JSON.stringify(audioTiming, null, 2)}\n`, 'utf8');
  writeFileSync(path.join(outputDir, 'assets-manifest.json'), `${JSON.stringify(assets, null, 2)}\n`, 'utf8');
  writeFileSync(path.join(outputDir, 'storyboard.json'), `${JSON.stringify({
    ...resolvedStoryboard,
    estimatedTimeline: config.estimatedTimeline,
    resolvedTimeline,
  }, null, 2)}\n`, 'utf8');
  writeFileSync(configPath, `${JSON.stringify(nextConfig, null, 2)}\n`, 'utf8');
  console.log(`Resolved TTS timeline: ${resolvedTimeline.duration.toFixed(3)}s / ${resolvedTimeline.totalFrames} frames.`);
  console.log(`Narration: ${relativeOutput(outputNarration)}; segments: ${resolvedSegments.map((segment) => `${segment.segmentId}=${segment.duration.toFixed(3)}s`).join(', ')}`);
};

const failedPlaceholders = config.storyboard.scenes.map((scene, index) => ({
  segmentId: sceneLabel(index),
  sceneId: scene.sceneId,
  text: scene.ttsText,
  audioPath: '',
  outputAudioPath: '',
  startTime: 0,
  duration: 0,
  endTime: 0,
  leadingSilence: 0,
  trailingSilence: 0,
  speakingRate: 0,
  status: 'failed' as const,
}));

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  writeFailure(message, failedPlaceholders);
  console.error(`TTS FAILED: ${message}`);
  process.exitCode = 1;
});
