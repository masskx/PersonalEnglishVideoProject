import {existsSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import type {MemeVocabVideoConfig} from '../../src/meme-vocab/types';
import {DEFAULT_MEME_VOCAB_CONFIG_PATH} from '../../src/meme-vocab/paths';

const args = process.argv.slice(2);
const arg = (name: string) => args.find((value) => value.startsWith(`--${name}=`))?.slice(name.length + 3);
const configPath = path.resolve(process.cwd(), arg('config') ?? DEFAULT_MEME_VOCAB_CONFIG_PATH);
if (!existsSync(configPath)) throw new Error(`Config is missing: ${configPath}. Run npm run meme:vocab:generate first.`);
const config = JSON.parse(readFileSync(configPath, 'utf8')) as MemeVocabVideoConfig;
if (!config.audioTiming || config.audioTiming.status !== 'resolved' || config.resolvedTimeline.source !== 'tts-resolved') {
  throw new Error('TTS timing is not resolved. Run npm run meme:vocab:tts before rendering; failed TTS must not render as silent audio.');
}
const output = path.resolve(process.cwd(), arg('output') ?? path.join(path.dirname(configPath), 'final.mp4'));
const scale = Number(arg('scale') ?? '0.5');
const remotionPropsPath = path.join(path.dirname(configPath), '.remotion-props.json');
writeFileSync(remotionPropsPath, `${JSON.stringify({config}, null, 2)}\n`, 'utf8');
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const cli = process.platform === 'win32' ? 'npx.cmd' : 'npx';
try {
  const result = spawnSync(cli, ['remotion', 'render', 'src/index.ts', 'MemeVocabShort', output, `--props=${remotionPropsPath}`, '--codec=h264', '--audio-codec=aac', '--pixel-format=yuv420p', `--scale=${scale}`, `--browser-executable="${chrome}"`], {cwd: process.cwd(), stdio: 'inherit', shell: process.platform === 'win32', windowsHide: true});
  if (result.error || result.status !== 0) throw new Error(`Remotion render failed: ${result.error?.message ?? result.status}`);
  console.log(`Rendered ${path.relative(process.cwd(), output)} at scale ${scale} using resolvedTimeline metadata.`);
} finally {
  rmSync(remotionPropsPath, {force: true});
}
const qa = spawnSync(process.execPath, ['node_modules/tsx/dist/cli.mjs', 'scripts/meme-vocab/qa.ts', `--config=${configPath}`, `--video=${output}`], {cwd: process.cwd(), stdio: 'inherit', shell: false, windowsHide: true});
if (qa.status !== 0) process.exit(qa.status ?? 1);
