import {existsSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {getReplicaProject} from '../../src/replica/projects/registry';
import type {ReplicaAudioManifest} from '../../src/replica/ReplicaVideo';
import {checkWordVisualCoverage} from './wordVisualCoverage';
import {findEditorialStyleIssues} from './editorialStyle';

const EPSILON = 0.002;
const repoRoot = process.cwd();
const projectArg = process.argv
  .slice(2)
  .find((arg) => arg.startsWith('--project='))
  ?.slice('--project='.length);
if (!projectArg) throw new Error('Missing --project=<slug>.');

const project = getReplicaProject(projectArg);
const storyboard = project.storyboard;
const publicDir = path.resolve(repoRoot, 'public');
const errors: string[] = [];
const warnings: string[] = [];
const closeTo = (a: number, b: number) => Math.abs(a - b) <= EPSILON;

for (const issue of findEditorialStyleIssues(project)) {
  errors.push(`Editorial style: ${issue}`);
}

if (project.keyposePlan) {
  const coverage = checkWordVisualCoverage(project, repoRoot, {checkAssets: true, requireVisualReview: true});
  errors.push(...coverage.errors.map((error) => `Word visual coverage: ${error}`));
  if (!coverage.errors.length) console.log(`Word visual coverage: ${coverage.rows.length} scenes, three unique poses per word, visual review recorded.`);
} else if (project.cover?.seriesLabel === '小黑拆词根') {
  warnings.push('Legacy root-word project has no keyposePlan; semantic word-to-image coverage is not fail-closed.');
}

if (!project.cover) {
  errors.push('Every video project must define cover metadata.');
} else {
  const requiredOutputs = [
    ['outputVideo', project.paths.outputVideo, '.mp4'],
    ['outputCover', project.paths.outputCover, '.png'],
    ['outputLandscapeCover', project.paths.outputLandscapeCover, '.png'],
    ['outputDouyinCopy', project.paths.outputDouyinCopy, '.md'],
  ] as const;
  const videoDirectory = path.dirname(path.resolve(repoRoot, project.paths.outputVideo));
  for (const [label, configuredPath, extension] of requiredOutputs) {
    if (!configuredPath) {
      errors.push(`paths.${label} is required.`);
      continue;
    }
    if (path.extname(configuredPath).toLocaleLowerCase() !== extension) {
      errors.push(`paths.${label} must end in ${extension}.`);
    }
    if (path.dirname(path.resolve(repoRoot, configuredPath)) !== videoDirectory) {
      errors.push(`paths.${label} must be stored beside paths.outputVideo.`);
    }
  }
}

if (!Number.isFinite(storyboard.duration) || storyboard.duration <= 0) {
  errors.push(`Storyboard duration ${storyboard.duration} is invalid.`);
}
if (storyboard.fadeToBlackSec < 0 || storyboard.fadeToBlackSec > 1.5) {
  errors.push(`Final fade ${storyboard.fadeToBlackSec}s must be between 0 and 1.5s.`);
}
const fadeEndOpacity = storyboard.fadeEndOpacity ?? 1;
if (fadeEndOpacity < 0 || fadeEndOpacity > 1) {
  errors.push(`Final fade opacity ${fadeEndOpacity} must be between 0 and 1.`);
}

const scenes = [...storyboard.scenes].sort((a, b) => a.start - b.start);
if (scenes.length === 0) errors.push('Storyboard has no scenes.');
const seenSceneIds = new Set<string>();

scenes.forEach((scene, index) => {
  const end = scene.start + scene.duration;
  if (seenSceneIds.has(scene.id)) errors.push(`${scene.id}: duplicate scene id.`);
  seenSceneIds.add(scene.id);
  if (!scene.narration.trim()) errors.push(`${scene.id}: narration is empty.`);
  if (scene.duration <= 0) errors.push(`${scene.id}: duration must be positive.`);
  if (scene.start < 0 || end > storyboard.duration + EPSILON) {
    errors.push(`${scene.id}: scene range ${scene.start}-${end} is outside the composition.`);
  }

  if (index > 0) {
    const previous = scenes[index - 1];
    const previousEnd = previous.start + previous.duration;
    if (scene.start < previousEnd - EPSILON) {
      errors.push(`${scene.id}: overlaps ${previous.id} by ${(previousEnd - scene.start).toFixed(3)}s.`);
    } else if (scene.start > previousEnd + EPSILON) {
      errors.push(`${scene.id}: gap after ${previous.id} is ${(scene.start - previousEnd).toFixed(3)}s.`);
    }
  }

  const layerIds = new Set<string>();
  for (const layer of scene.layers) {
    if (layerIds.has(layer.id)) errors.push(`${scene.id}/${layer.id}: duplicate layer id.`);
    layerIds.add(layer.id);
    if (layer.from < 0 || layer.from > scene.duration) {
      errors.push(`${scene.id}/${layer.id}: layer start ${layer.from}s is outside scene.`);
    }
    if (layer.duration !== undefined && layer.duration <= 0) {
      errors.push(`${scene.id}/${layer.id}: layer duration must be positive.`);
    }
    if (layer.duration && layer.from + layer.duration > scene.duration + EPSILON) {
      errors.push(`${scene.id}/${layer.id}: layer ends outside scene.`);
    }
  }

  scene.captions.forEach((caption, captionIndex) => {
    if (caption.from < 0 || caption.to <= caption.from || caption.to > scene.duration + EPSILON) {
      errors.push(`${scene.id}/caption-${captionIndex}: invalid range ${caption.from}-${caption.to}.`);
    }
    if (!caption.text.trim()) errors.push(`${scene.id}/caption-${captionIndex}: empty text.`);
  });

  for (const cue of scene.sfx ?? []) {
    if (cue.at < 0 || cue.at >= scene.duration) {
      errors.push(`${scene.id}/${cue.name}: SFX cue ${cue.at}s is outside scene.`);
    }
  }
});

if (project.visualRenderer === 'continuous') {
  if (!project.continuousStage) {
    errors.push('Continuous visual renderer requires continuousStage metadata.');
  } else {
    for (const scene of scenes) {
      if (!project.continuousStage.sceneMotion[scene.id]) {
        errors.push(`${scene.id}: continuousStage sceneMotion is missing.`);
      }
    }
    for (const sceneId of Object.keys(project.continuousStage.sceneMotion)) {
      if (!seenSceneIds.has(sceneId)) {
        errors.push(`continuousStage contains unknown scene ${sceneId}.`);
      }
    }
  }
}

const finalScene = scenes.at(-1);
if (finalScene && !closeTo(finalScene.start + finalScene.duration, storyboard.duration)) {
  errors.push(
    `Final scene ends at ${(finalScene.start + finalScene.duration).toFixed(3)}s, ` +
      `expected ${storyboard.duration.toFixed(3)}s.`,
  );
}

const ffprobe = (() => {
  const configured = process.env.FFPROBE_PATH;
  if (configured && existsSync(configured)) return configured;
  const executable = process.platform === 'win32' ? 'ffprobe.exe' : 'ffprobe';
  const bundled = path.resolve(
    repoRoot,
    'node_modules',
    '@remotion',
    'compositor-win32-x64-msvc',
    executable,
  );
  return existsSync(bundled) ? bundled : executable;
})();

const ffmpeg = (() => {
  const configured = process.env.FFMPEG_PATH;
  if (configured && existsSync(configured)) return configured;
  return process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg';
})();

const probeDuration = (filePath: string, label: string) => {
  const result = spawnSync(
    ffprobe,
    ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', filePath],
    {encoding: 'utf8', windowsHide: true},
  );
  if (result.error || result.status !== 0) {
    errors.push(`${label}: audio is not decodable (${result.error?.message ?? result.stderr.trim()}).`);
    return null;
  }
  const duration = Number(result.stdout.trim());
  if (!Number.isFinite(duration) || duration <= 0) {
    errors.push(`${label}: invalid measured duration ${result.stdout.trim()}.`);
    return null;
  }
  return duration;
};

const probeMeanVolumeDb = (filePath: string) => {
  const sink = process.platform === 'win32' ? 'NUL' : '/dev/null';
  const result = spawnSync(
    ffmpeg,
    ['-hide_banner', '-i', filePath, '-af', 'volumedetect', '-f', 'null', sink],
    {encoding: 'utf8', windowsHide: true},
  );
  if (result.error || result.status !== 0) {
    warnings.push(`Background music loudness could not be measured: ${result.error?.message ?? result.stderr.trim()}.`);
    return null;
  }
  const match = result.stderr.match(/mean_volume:\s*(-?[\d.]+)\s*dB/i);
  return match ? Number(match[1]) : null;
};

const music = project.backgroundMusic;
const musicLevels = [
  ['volume', music.volume],
  ['duckedVolume', music.duckedVolume],
] as const;
for (const [label, value] of musicLevels) {
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    errors.push(`Background music ${label} ${value} must be between 0 and 1.`);
  }
}
if (music.duckedVolume > music.volume) {
  errors.push('Background music duckedVolume must not exceed volume.');
}
for (const [label, value] of [
  ['fadeInSec', music.fadeInSec],
  ['fadeOutSec', music.fadeOutSec],
  ['duckAttackSec', music.duckAttackSec],
  ['duckReleaseSec', music.duckReleaseSec],
] as const) {
  if (!Number.isFinite(value) || value < 0) {
    errors.push(`Background music ${label} ${value} must be zero or positive.`);
  }
}
const musicPath = path.resolve(publicDir, music.src);
const publicPrefix = `${publicDir}${path.sep}`.toLocaleLowerCase();
if (!musicPath.toLocaleLowerCase().startsWith(publicPrefix)) {
  errors.push(`Background music src escapes public/: ${music.src}.`);
} else if (!existsSync(musicPath)) {
  warnings.push(
    `Background music is not installed at public/${music.src}; rendering is intentionally blocked until it is added.`,
  );
} else {
  const duration = probeDuration(musicPath, 'Background music');
  if (duration !== null && duration < 30) {
    warnings.push(`Background music is only ${duration.toFixed(2)}s; a 180s seamless master is preferred.`);
  }
  const sourceMeanDb = probeMeanVolumeDb(musicPath);
  if (sourceMeanDb !== null && music.duckedVolume > 0) {
    const estimatedDuckedMeanDb = sourceMeanDb + 20 * Math.log10(music.duckedVolume);
    if (estimatedDuckedMeanDb < -43) {
      errors.push(
        `Background music is effectively inaudible during narration: estimated mean ` +
          `${estimatedDuckedMeanDb.toFixed(1)} dB. Normalize the source or raise duckedVolume.`,
      );
    } else if (estimatedDuckedMeanDb < -40) {
      warnings.push(
        `Background music may be too quiet on a phone speaker: estimated ducked mean ` +
          `${estimatedDuckedMeanDb.toFixed(1)} dB.`,
      );
    } else if (estimatedDuckedMeanDb > -30) {
      warnings.push(
        `Background music may mask narration: estimated ducked mean ${estimatedDuckedMeanDb.toFixed(1)} dB.`,
      );
    }
  }
}

const manifestPath = path.resolve(repoRoot, project.paths.audioManifestFile);
let manifest: ReplicaAudioManifest = {};
if (!existsSync(manifestPath)) {
  errors.push(`Audio manifest is missing: ${project.paths.audioManifestFile}.`);
} else {
  try {
    manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as ReplicaAudioManifest;
  } catch (error) {
    errors.push(`Audio manifest is invalid JSON (${error instanceof Error ? error.message : String(error)}).`);
  }
}

for (const manifestId of Object.keys(manifest)) {
  if (!seenSceneIds.has(manifestId)) errors.push(`Audio manifest contains unknown scene ${manifestId}.`);
}

for (const [index, scene] of scenes.entries()) {
  const audio = manifest[scene.id];
  if (!audio) {
    errors.push(`${scene.id}: audio manifest entry is missing.`);
    continue;
  }
  if (typeof audio.src !== 'string' || !audio.src.trim()) {
    errors.push(`${scene.id}: audio src is invalid.`);
    continue;
  }
  if (!Number.isFinite(audio.duration) || audio.duration <= 0) {
    errors.push(`${scene.id}: audio duration ${audio.duration} is invalid.`);
    continue;
  }

  const audioPath = path.resolve(publicDir, audio.src);
  const publicPrefix = `${publicDir}${path.sep}`.toLocaleLowerCase();
  if (!audioPath.toLocaleLowerCase().startsWith(publicPrefix)) {
    errors.push(`${scene.id}: audio src escapes public/: ${audio.src}.`);
    continue;
  }
  if (!existsSync(audioPath)) {
    errors.push(`${scene.id}: audio file is missing at ${audio.src}.`);
    continue;
  }
  const measuredDuration = probeDuration(audioPath, scene.id);
  if (measuredDuration !== null && Math.abs(measuredDuration - audio.duration) > 0.08) {
    errors.push(
      `${scene.id}: manifest duration ${audio.duration.toFixed(3)}s does not match ` +
        `measured ${measuredDuration.toFixed(3)}s.`,
    );
  }

  const isFinal = closeTo(scene.start + scene.duration, storyboard.duration);
  const targetDuration = scene.duration - (isFinal ? storyboard.fadeToBlackSec : 0);
  const maxPlaybackRate = project.quality?.maxPlaybackRate ?? 1.16;
  const warnPlaybackRate = project.quality?.warnPlaybackRate ?? Math.max(1, maxPlaybackRate - 0.04);
  const requiredRate = audio.duration / targetDuration;
  if (requiredRate > maxPlaybackRate + EPSILON) {
    errors.push(
      `${scene.id}: required playbackRate ${requiredRate.toFixed(3)} exceeds ${maxPlaybackRate.toFixed(3)}.`,
    );
  } else if (requiredRate > warnPlaybackRate) {
    warnings.push(`${scene.id}: playbackRate ${requiredRate.toFixed(3)} is near the upper limit.`);
  }
  const playbackRate = Math.max(1, requiredRate);
  const scheduledNarrationEnd = scene.start + audio.duration / playbackRate;
  const nextSceneStart = scenes[index + 1]?.start ?? storyboard.duration;
  const narrationGap = nextSceneStart - scheduledNarrationEnd;
  const minimumNarrationCoverage = project.quality?.audioSilence?.minimumDurationSec ?? 1.2;
  // 与成片 verifier 一致：只允许已记录且覆盖整个间隙的窄暂停窗口。
  const allowedNarrationPause = (project.quality?.audioSilence?.allowedWindows ?? []).some(
    (window) => Boolean(window.reason.trim()) &&
      scheduledNarrationEnd >= window.start - 0.15 && nextSceneStart <= window.end + 0.15,
  );
  if (narrationGap >= minimumNarrationCoverage - EPSILON && !allowedNarrationPause) {
    errors.push(
      `${scene.id}: narration ends ${narrationGap.toFixed(3)}s before the next scene; ` +
        `this exceeds the ${minimumNarrationCoverage.toFixed(3)}s coverage gate and would leave ` +
        'background music without narration. Extend the explanation or tighten the scene timing.',
    );
  }
}

const sfxNames = new Set(scenes.flatMap((scene) => (scene.sfx ?? []).map((cue) => cue.name)));
for (const name of sfxNames) {
  const sfxPath = path.resolve(publicDir, 'assets', 'sfx', `${name}.mp3`);
  if (!existsSync(sfxPath)) {
    errors.push(`SFX ${name}: file is missing.`);
  } else {
    probeDuration(sfxPath, `SFX ${name}`);
  }
}

for (const asset of project.illustrations) {
  const assetPath = path.resolve(repoRoot, project.paths.alphaAssetDir, asset.filename);
  if (!existsSync(assetPath)) errors.push(`Illustration ${asset.id}: file is missing.`);
}

for (const warning of warnings) console.warn(`WARN: ${warning}`);
if (errors.length > 0) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  process.exit(1);
}

console.log(
  `Replica ${project.slug} valid: ${scenes.length} scenes, ${storyboard.duration.toFixed(3)}s, ` +
    `${scenes.reduce((sum, scene) => sum + scene.layers.length, 0)} layers, ` +
    `${project.illustrations.length} illustrations.`,
);
