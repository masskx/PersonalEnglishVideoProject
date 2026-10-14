import {existsSync} from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {bearerHeaders} from '../proxyCredentials';

export type DashscopeTtsOptions = {
  apiKey?: string;
  endpoint?: string;
  model: string;
  voice: string;
  rate: number;
  pitch: number;
  volume: number;
  format?: 'mp3' | 'wav';
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithRetry = async (url: string, init?: RequestInit, attempts = 4) => {
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, init);
      if (response.status < 500 && response.status !== 429) return response;
      lastError = new Error(`HTTP ${response.status}`);
      if (attempt === attempts) return response;
    } catch (error) {
      lastError = error;
    }
    await sleep(1200 * attempt);
  }
  throw lastError;
};

export const synthesizeDashscope = async (text: string, options: DashscopeTtsOptions) => {
  const apiKey = options.apiKey ?? process.env.DASHSCOPE_API_KEY;
  if (!apiKey) throw new Error('Missing DASHSCOPE_API_KEY in .env.');
  const endpoint = options.endpoint ?? process.env.DASHSCOPE_TTS_ENDPOINT ?? 'https://dashscope.aliyuncs.com/api/v1/services/audio/tts/SpeechSynthesizer';
  const response = await fetchWithRetry(endpoint, {
    method: 'POST',
    headers: {...bearerHeaders(apiKey), 'Content-Type': 'application/json'},
    body: JSON.stringify({
      model: options.model,
      input: {
        text,
        voice: options.voice,
        format: options.format ?? 'mp3',
        sample_rate: 44100,
        rate: options.rate,
        pitch: options.pitch,
        volume: options.volume,
        language_hints: ['zh'],
      },
    }),
  });
  const body = await response.text();
  let payload: any;
  try {
    payload = JSON.parse(body);
  } catch {
    throw new Error(`DashScope returned non-JSON: HTTP ${response.status}\n${body.slice(0, 1000)}`);
  }
  if (!response.ok) throw new Error(`DashScope TTS failed: HTTP ${response.status}\n${JSON.stringify(payload)}`);
  const audioData = payload.output?.audio?.data;
  if (audioData) return Buffer.from(audioData, 'base64');
  const audioUrl = payload.output?.audio?.url;
  if (!audioUrl) throw new Error(`DashScope response has no audio: ${JSON.stringify(payload)}`);
  // DashScope returns a plain-http OSS link; the same object is served over https, which proxied
  // (cloud) networks require.
  const audioResponse = await fetchWithRetry(audioUrl.replace(/^http:\/\//, 'https://'));
  if (!audioResponse.ok) throw new Error(`Audio download failed: HTTP ${audioResponse.status}`);
  return Buffer.from(await audioResponse.arrayBuffer());
};

export const resolveFfprobe = (repoRoot = process.cwd()) => {
  const configured = process.env.FFPROBE_PATH;
  if (configured && existsSync(configured)) return configured;
  const executable = process.platform === 'win32' ? 'ffprobe.exe' : 'ffprobe';
  const bundled = path.resolve(repoRoot, 'node_modules/@remotion/compositor-win32-x64-msvc', executable);
  return existsSync(bundled) ? bundled : executable;
};

export const resolveFfmpeg = (repoRoot = process.cwd()) => {
  const configured = process.env.FFMPEG_PATH;
  if (configured) return configured;
  const executable = process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg';
  const bundled = path.resolve(repoRoot, 'node_modules/@remotion/compositor-win32-x64-msvc', executable);
  return existsSync(bundled) ? bundled : executable;
};

export const probeAudioDuration = (filePath: string, repoRoot = process.cwd()) => {
  const result = spawnSync(resolveFfprobe(repoRoot), ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', filePath], {encoding: 'utf8', windowsHide: true});
  if (result.error || result.status !== 0) throw new Error(`ffprobe failed for ${filePath}: ${result.error?.message ?? result.stderr}`);
  const duration = Number(result.stdout.trim());
  if (!Number.isFinite(duration) || duration <= 0) throw new Error(`Invalid audio duration for ${filePath}: ${result.stdout.trim()}`);
  return duration;
};

export const runFfmpeg = (args: string[], repoRoot = process.cwd()) => {
  const result = spawnSync(resolveFfmpeg(repoRoot), args, {encoding: 'utf8', windowsHide: true});
  if (result.error || result.status !== 0) throw new Error(`ffmpeg failed: ${result.error?.message ?? result.stderr}`);
  return result;
};
