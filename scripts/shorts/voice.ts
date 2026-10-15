import 'dotenv/config';
import {createHash} from 'node:crypto';
import {existsSync, mkdirSync, readdirSync, renameSync, rmSync, writeFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {probeAudioDuration} from '../../src/tts/dashscope';
import {ffmpegPath} from '../replica/renderEnv';
import {bearerHeaders} from '../../src/proxyCredentials';
import {findShort, shortLibrary} from '../../src/shorts/library';
import type {ShortBeat, ShortTimeline, TimedShortBeat} from '../../src/shorts/types';

/**
 * 短视频配音：npm run shorts:voice -- --short=<id>|--all [--generate]
 * - 每个节拍一段音频，按文本 + 音色指纹缓存；改稿后自动重配，旧音频由 --prune 清掉。
 * - 想用自己的声音：把录音放到 public/assets/audio/shorts/<id>/recorded/<节拍id>.mp3（或 .wav），自动替代 AI 配音。
 * 不带 --generate 时只列出缺少的配音，不花钱。
 */
const args = process.argv.slice(2);
const generate = args.includes('--generate');
const prune = args.includes('--prune');
const only = args.find((arg) => arg.startsWith('--short='))?.slice('--short='.length);
const shorts = args.includes('--all') ? shortLibrary : [findShort(only ?? (() => { throw new Error('Missing --short=<id> or --all'); })())];

const voice = {model: 'cosyvoice-v3-flash', voice: 'longanhuan', rate: 1.12, pitch: 1, volume: 70, instruction: '你正在进行科普知识推广，你说话的情感是happy。'};
const FPS = 30;

const synthesize = async (text: string, rate: number) => {
  const apiKey = process.env.DASHSCOPE_API_KEY;
  if (!apiKey) throw new Error('Missing DASHSCOPE_API_KEY.');
  const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/audio/tts/SpeechSynthesizer', {
    method: 'POST',
    headers: {...bearerHeaders(apiKey), 'Content-Type': 'application/json'},
    body: JSON.stringify({model: voice.model, input: {text, voice: voice.voice, format: 'mp3', sample_rate: 44100, rate, pitch: voice.pitch, volume: voice.volume, language_hints: ['zh'], instruction: voice.instruction}}),
  });
  const payload = await response.json() as {output?: {audio?: {data?: string; url?: string}}};
  if (!response.ok) throw new Error(`DashScope TTS failed: HTTP ${response.status} ${JSON.stringify(payload).slice(0, 300)}`);
  const audio = payload.output?.audio;
  if (audio?.data) return Buffer.from(audio.data, 'base64');
  if (!audio?.url) throw new Error('DashScope response has no audio.');
  // The OSS link is plain http; proxied cloud networks need https.
  const download = await fetch(audio.url.replace(/^http:\/\//, 'https://'));
  if (!download.ok) throw new Error(`Audio download failed: HTTP ${download.status}`);
  return Buffer.from(await download.arrayBuffer());
};

let missing = 0;
for (const short of shorts) {
  const dir = `public/assets/audio/shorts/${short.id}`;
  mkdirSync(dir, {recursive: true});
  const audioFor = async (beat: ShortBeat) => {
    for (const ext of ['mp3', 'wav']) {
      const recorded = `${dir}/recorded/${beat.id}.${ext}`;
      if (existsSync(recorded)) return recorded;
    }
    const rate = beat.english ? 1.04 : voice.rate;
    const hash = createHash('sha256').update(JSON.stringify({text: beat.voice, ...voice, rate})).digest('hex').slice(0, 12);
    const file = `${dir}/${beat.id}-${hash}.mp3`;
    if (!existsSync(file)) {
      if (!generate) { console.log(`Needs voice: ${short.id}/${beat.id}`); missing += 1; return null; }
      console.log(`Generating ${short.id}/${beat.id}`);
      const bytes = await synthesize(beat.voice, rate);
      writeFileSync(`${file}.tmp`, bytes);
      renameSync(`${file}.tmp`, file);
    }
    if ((short.version ?? 2) < 2) return file;
    // v2: cut leading/trailing silence (TTS adds ~0.3 s) so the first word lands on frame 0. Local ffmpeg, no API call.
    const trimmed = file.replace(/\.mp3$/, '.trim.mp3');
    if (!existsSync(trimmed)) {
      const strip = 'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.03';
      const result = spawnSync(ffmpegPath, ['-v', 'error', '-y', '-i', file, '-af', `${strip},areverse,${strip},areverse`, '-c:a', 'libmp3lame', '-q:a', '2', trimmed]);
      if (result.status !== 0) throw new Error(`ffmpeg trim failed for ${file}: ${result.stderr}`);
    }
    return trimmed;
  };
  const beats = [short.hook, ...short.body];
  let frame = 0;
  const timed: TimedShortBeat[] = [];
  for (const beat of beats) {
    const file = await audioFor(beat);
    if (!file) continue;
    const audioFrames = Math.ceil(probeAudioDuration(file) * FPS);
    // Tight pacing: a short breath between beats; the test beat waits for the countdown.
    const frames = audioFrames + Math.round((beat.pause ?? 0.25) * FPS);
    timed.push({...beat, from: frame, frames, audioFrames, src: file.replace(/^public\//, '')});
    frame += frames;
  }
  if (timed.length !== beats.length) continue;
  timed[timed.length - 1].frames += 20;
  frame += 20;
  const timeline: ShortTimeline = {shortId: short.id, fps: FPS, totalFrames: frame, beats: timed};
  writeFileSync(`src/shorts/timelines/${short.id}.json`, `${JSON.stringify(timeline, null, 2)}\n`);
  console.log(`${short.id}: ${timed.length} beats, ${(frame / FPS).toFixed(1)}s`);
  if (prune) {
    // 删除本条不再引用的 AI 配音（改稿后的旧版本），录音目录不动。
    const used = new Set(timed.flatMap((beat) => { const name = beat.src.split('/').pop()!; return [name, name.replace(/\.trim\.mp3$/, '.mp3')]; }));
    for (const name of readdirSync(dir)) if (name.endsWith('.mp3') && !used.has(name)) { rmSync(`${dir}/${name}`); console.log(`Pruned ${dir}/${name}`); }
  }
}
if (missing) console.log(`${missing} voice clip(s) missing. Run with --generate.`);
