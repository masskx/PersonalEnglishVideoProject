import {existsSync} from 'node:fs';
import path from 'node:path';

/**
 * 渲染环境的唯一来源：浏览器与 ffmpeg/ffprobe 路径。所有渲染脚本都从这里取，不再各自写死 Windows 路径。
 * 顺序：环境变量 → 本机常见安装位置 → null（交给 Remotion 自带的 headless shell）。
 */
const candidates = [
  process.env.REMOTION_BROWSER_EXECUTABLE,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
];

export const browserExecutable: string | null = candidates.find((candidate): candidate is string => Boolean(candidate && existsSync(candidate))) ?? null;

/** CLI form for `npx remotion …`; empty when Remotion should use its own browser. */
export const browserCliArgs = (): string[] => {
  if (!browserExecutable) return [];
  return [`--browser-executable=${process.platform === 'win32' ? `"${browserExecutable}"` : browserExecutable}`];
};

const compositorDir = path.resolve('node_modules/@remotion/compositor-win32-x64-msvc');
const bundled = (name: string) => {
  const file = path.join(compositorDir, `${name}.exe`);
  return process.platform === 'win32' && existsSync(file) ? file : undefined;
};

// 联系图需要 fps/tile 等完整滤镜；Remotion 的精简版只作未安装系统版时的后备。
const onPath = (name: string) => (process.env.PATH ?? process.env.Path ?? '')
  .split(path.delimiter)
  .some((directory) => existsSync(path.join(directory.replace(/^"|"$/g, ''),
    process.platform === 'win32' ? `${name}.exe` : name)));
export const ffmpegPath = process.env.FFMPEG_PATH ?? (onPath('ffmpeg') ? 'ffmpeg' : bundled('ffmpeg')) ?? 'ffmpeg';
export const ffprobePath = process.env.FFPROBE_PATH ?? (onPath('ffprobe') ? 'ffprobe' : bundled('ffprobe')) ?? 'ffprobe';
