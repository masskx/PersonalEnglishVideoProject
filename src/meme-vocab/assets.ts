import type {MemeVocabAssetManifest, MemeVocabInput, MemeVocabTimeline, ShortStoryboard} from './types';

export type AssetResolution = {
  path: string;
  status: 'available' | 'placeholder' | 'missing';
};

export type AssetResolver = (input: MemeVocabInput, assetId: string) => AssetResolution;

const toPublicAssetPath = (assetPath: string) => assetPath.replace(/\\/g, '/').replace(/^\.\//, '').replace(/^public\//, '');

// Keep this module browser-safe: Root.tsx is bundled by Remotion for Chrome.
// Node filesystem checks are injected by the generation script through AssetResolver.
export const placeholderAssetResolver: AssetResolver = (input) => ({
  path: toPublicAssetPath(`${input.assetDirectory}/placeholder.svg`),
  status: 'placeholder',
});

export const buildAssetManifest = (
  input: MemeVocabInput,
  storyboard: ShortStoryboard,
  resolveAsset: AssetResolver = placeholderAssetResolver,
): MemeVocabAssetManifest => {
  const assets = storyboard.scenes.map((scene) => {
    const resolved = resolveAsset(input, scene.imageAssetId);
    const startTime = scene.resolvedStartTime ?? scene.startTime;
    const endTime = scene.resolvedStartFrame !== undefined && scene.resolvedDurationInFrames !== undefined
      ? (scene.resolvedStartFrame + scene.resolvedDurationInFrames) / storyboard.fps
      : startTime + (scene.resolvedDuration ?? scene.estimatedDuration);
    return {
      assetId: scene.imageAssetId,
      path: toPublicAssetPath(resolved.path),
      status: resolved.status,
      purpose: `${scene.sceneType}：${scene.narration.slice(0, 24)}`,
      useTime: `${startTime.toFixed(3)}-${endTime.toFixed(3)}s`,
      cropFocus: scene.cropFocus,
      remotionMotion: scene.cameraMotion,
      replacementRequired: resolved.status !== 'available',
    };
  });
  return {
    assetDirectory: input.assetDirectory,
    assets,
    pendingGeneration: assets.filter((asset) => asset.replacementRequired).map((asset) => asset.assetId),
  };
};

// Preserve asset identity and readiness when TTS resolves the actual scene times.
export const applyTimelineToAssetManifest = (
  manifest: MemeVocabAssetManifest,
  storyboard: ShortStoryboard,
  timeline: MemeVocabTimeline,
): MemeVocabAssetManifest => ({
  ...manifest,
  assets: manifest.assets.map((asset) => {
    const scene = storyboard.scenes.find((candidate) => candidate.imageAssetId === asset.assetId);
    const timing = timeline.scenes.find((candidate) => candidate.sceneId === scene?.sceneId);
    if (!timing) throw new Error(`Asset ${asset.assetId} has no matching scene timeline.`);
    return {...asset, useTime: `${timing.startTime.toFixed(3)}-${timing.endTime.toFixed(3)}s`};
  }),
});
