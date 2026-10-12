import {existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';

export const normalizeImageSource = ({
  input,
  ffmpeg,
  ffprobe,
}: {
  input: string;
  ffmpeg: string;
  ffprobe: string;
}) => {
  const probe = spawnSync(
    ffprobe,
    ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0:s=x', input],
    {encoding: 'utf8', windowsHide: true},
  );
  if (probe.error || probe.status !== 0) {
    throw new Error(`Image source probe failed: ${probe.error?.message ?? probe.stderr}`);
  }
  const match = probe.stdout.trim().match(/^(\d+)x(\d+)$/);
  if (!match) throw new Error(`Image source dimensions are unreadable: ${probe.stdout.trim()}`);
  const width = Number(match[1]);
  const height = Number(match[2]);
  if (width >= 1920 && height >= 1080) return input;

  const normalized = `${input}.normalized.png`;
  const result = spawnSync(
    ffmpeg,
    [
      '-hide_banner',
      '-loglevel',
      'error',
      '-y',
      '-i',
      input,
      '-vf',
      // The relay currently returns 16:9 images (1672x941), so a direct
      // resize is sufficient and avoids ffmpeg misparsing pad expressions.
      'scale=2048:1152:flags=lanczos',
      '-frames:v',
      '1',
      '-c:v',
      'png',
      '-pix_fmt',
      'rgba',
      normalized,
    ],
    {encoding: 'utf8', windowsHide: true},
  );
  if (result.error || result.status !== 0 || !existsSync(normalized)) {
    throw new Error(`Image source normalization failed: ${result.error?.message ?? result.stderr}`);
  }
  return normalized;
};
