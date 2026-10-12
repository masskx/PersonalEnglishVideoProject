import {existsSync, mkdirSync} from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {getReplicaProject} from '../../src/replica/projects/registry';
import {buildVerticalProps, verticalCompositionId} from '../../src/replica/vertical/verticalProjects';

/**
 * 竖屏版式快速抽查：一次打包，按场景中点和结尾各取一帧，拼成联系图。
 *   npm run vertical:stills -- --project=press,pon-pos
 * 输出 work/vertical-stills/<slug>.jpg（过程材料，不进入交付）。
 */
const projectsArg = process.argv.find((value) => value.startsWith('--project='))?.slice('--project='.length);
if (!projectsArg) throw new Error('Missing --project=<slug>[,<slug>].');
const windowsChrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const linuxHeadless = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const browserExecutable =
  process.env.REMOTION_BROWSER_EXECUTABLE ??
  (process.platform === 'win32' && existsSync(windowsChrome) ? windowsChrome : existsSync(linuxHeadless) ? linuxHeadless : null);
const ffmpeg = process.env.FFMPEG_PATH ?? 'ffmpeg';

const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), publicDir: path.resolve('public')});
for (const slug of projectsArg.split(',')) {
  const project = getReplicaProject(slug);
  const props = buildVerticalProps(project, 'full');
  const id = verticalCompositionId(project, 'full');
  const composition = await selectComposition({serveUrl, id, inputProps: props, browserExecutable});
  const outDir = path.resolve('work', 'vertical-stills', project.slug);
  mkdirSync(outDir, {recursive: true});
  const frames = props.storyboard.scenes.flatMap((scene) => [
    Math.round((scene.start + Math.min(scene.duration * 0.5, 4.6)) * 30),
    Math.round((scene.start + scene.duration - 0.5) * 30),
  ]);
  const files: string[] = [];
  for (const [index, frame] of frames.entries()) {
    const output = path.join(outDir, `${String(index).padStart(2, '0')}-${frame}.png`);
    await renderStill({composition, serveUrl, output, frame, inputProps: props, browserExecutable, scale: 0.4});
    files.push(output);
  }
  const sheet = path.resolve('work', 'vertical-stills', `${project.slug}.jpg`);
  const columns = Math.min(10, files.length);
  const result = spawnSync(ffmpeg, ['-v', 'error', '-y', '-pattern_type', 'glob', '-i', path.join(outDir, '*.png'),
    '-vf', `tile=${columns}x${Math.ceil(files.length / columns)}:padding=4:color=0xbbbbbb`, '-frames:v', '1', sheet], {encoding: 'utf8'});
  console.log(result.status === 0 ? `${project.slug}: ${files.length} stills → ${path.relative(process.cwd(), sheet)}` : result.stderr);
}
