import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {REPLICA_THEME} from '../replica/theme';
import {ExampleScene, HookScene, MemeImageScene, ProgressBar, QuizScene, SafeArea, WordRevealScene} from './components';
import type {MemeVocabShortProps, MemeVocabResolvedSceneTimeline, ShortStoryboardScene} from './types';

const fps = 30;
const sceneFrames = (scene: MemeVocabResolvedSceneTimeline) => scene.durationInFrames;

const SceneRenderer: React.FC<{scene: ShortStoryboardScene; timelineScene: MemeVocabResolvedSceneTimeline; config: MemeVocabShortProps['config']; asset: NonNullable<MemeVocabShortProps['config']['assets']['assets'][number]>}> = ({scene, timelineScene, config, asset}) => {
  const frame = useCurrentFrame();
  const durationInFrames = sceneFrames(timelineScene);
  const revealTimingFrames = {
    wordStartFrame: timelineScene.revealTimingFrames.wordStartFrame - timelineScene.startFrame,
    phoneticStartFrame: timelineScene.revealTimingFrames.phoneticStartFrame - timelineScene.startFrame,
    meaningStartFrame: timelineScene.revealTimingFrames.meaningStartFrame - timelineScene.startFrame,
    ...(timelineScene.revealTimingFrames.exampleStartFrame === undefined ? {} : {exampleStartFrame: timelineScene.revealTimingFrames.exampleStartFrame - timelineScene.startFrame}),
  };
  const props = {scene, asset, frame, durationInFrames, word: config.input.targetWord, revealTimingFrames};
  if (scene.sceneType === 'hook') return <HookScene {...props} />;
  if (scene.sceneType === 'meme_story') return <MemeImageScene {...props} />;
  if (scene.sceneType === 'word_reveal') return <WordRevealScene {...props} />;
  if (scene.sceneType === 'real_usage') return <ExampleScene {...props} />;
  return <QuizScene {...props} />;
};

const BackgroundMusic: React.FC<MemeVocabShortProps> = ({config}) => {
  const narrationWindows = config.audioTiming?.status === 'resolved'
    ? config.audioTiming.segments.map((segment) => ({start: segment.startTime, end: segment.endTime}))
    : [];
  return <Audio src={staticFile(config.backgroundMusic.src)} loop loopVolumeCurveBehavior="extend" volume={(frame) => {
    const time = frame / fps;
    const fadeIn = interpolate(time, [0, config.backgroundMusic.fadeInSec], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    const fadeOutStart = Math.max(0, config.storyboard.duration - config.backgroundMusic.fadeOutSec);
    const fadeOut = interpolate(time, [fadeOutStart, config.storyboard.duration], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    const speaking = narrationWindows.some((window) => time >= window.start && time <= window.end);
    const volume = speaking ? Math.min(config.backgroundMusic.volume, config.backgroundMusic.duckedVolume) : config.backgroundMusic.volume;
    return volume * Math.min(fadeIn, fadeOut);
  }} name="Meme vocab background music" />;
};

const NarrationAudio: React.FC<MemeVocabShortProps> = ({config}) => {
  if (!config.audioTiming || config.audioTiming.status !== 'resolved') return null;
  return <Audio src={staticFile(config.audioTiming.narrationPath)} name="Meme vocab resolved narration" />;
};

export const MemeVocabShortVideo: React.FC<MemeVocabShortProps> = ({config}) => {
  const frame = useCurrentFrame();
  const progress = frame / Math.max(1, config.resolvedTimeline.totalFrames - 1);
  const assetById = new Map(config.assets.assets.map((asset) => [asset.assetId, asset]));
  const sceneById = new Map(config.storyboard.scenes.map((scene) => [scene.sceneId, scene]));
  return <AbsoluteFill style={{background: REPLICA_THEME.background, color: REPLICA_THEME.primary, fontFamily: REPLICA_THEME.fontFamily, letterSpacing: 0, overflow: 'hidden'}}>
    <NarrationAudio config={config} />
    <BackgroundMusic config={config} />
    <ProgressBar progress={progress} />
    <SafeArea>
      {config.resolvedTimeline.scenes.map((timelineScene) => {
        const scene = sceneById.get(timelineScene.sceneId)!;
        const asset = assetById.get(scene.imageAssetId) ?? config.assets.assets[0]!;
        const durationInFrames = sceneFrames(timelineScene);
        return <Sequence key={scene.sceneId} from={timelineScene.startFrame} durationInFrames={durationInFrames} name={scene.sceneId}>
          <SceneRenderer scene={scene} timelineScene={timelineScene} config={config} asset={asset} />
        </Sequence>;
      })}
    </SafeArea>
  </AbsoluteFill>;
};
