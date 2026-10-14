import 'dotenv/config';
import {createHash} from 'node:crypto';
import {existsSync, mkdirSync, renameSync, writeFileSync} from 'node:fs';
import {probeAudioDuration} from '../../src/tts/dashscope';
import {bearerHeaders} from '../../src/proxyCredentials';
import {findShort, shortLibrary} from '../../src/shorts/library';
import type {ShortBeat, ShortTimeline, ShortVariant, TimedShortBeat} from '../../src/shorts/types';

/**
 * 抖音短视频配音：npm run shorts:voice -- --short=<id>|--all [--generate]
 * - A/B 两个钩子各配一段，正文节拍共用同一份音频（按文本 + 音色指纹缓存）。
 * - 想用自己的声音：把录音放到 public/assets/audio/shorts/<id>/recorded/<节拍id>.mp3（或 .wav），自动替代 AI 配音。
 * 不带 --generate 时只列出缺少的配音，不花钱。
 */
const args = process.argv.slice(2);
const generate = args.includes('--generate');
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
    return file;
  };
  for (const variant of ['A', 'B'] as ShortVariant[]) {
    const beats = [short.hooks[variant], ...short.body];
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
    const timeline: ShortTimeline = {shortId: short.id, variant, fps: FPS, totalFrames: frame, beats: timed};
    writeFileSync(`src/shorts/timelines/${short.id}-${variant}.json`, `${JSON.stringify(timeline, null, 2)}\n`);
    console.log(`${short.id}-${variant}: ${timed.length} beats, ${(frame / FPS).toFixed(1)}s`);
  }
}
if (missing) console.log(`${missing} voice clip(s) missing. Run with --generate.`);
