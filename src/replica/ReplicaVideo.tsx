import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {CaptionTrack, ReplicaLayerRenderer, ReplicaSceneTransition} from './visuals';
import {JectContinuousStage} from './JectContinuousStage';
import {GenericContinuousStage} from './GenericContinuousStage';
import {REPLICA_CANVAS, REPLICA_THEME} from './theme';
import type {ContinuousStageDefinition, ReplicaBackgroundMusicDefinition} from './projectTypes';
import type {ReplicaScene, ReplicaStoryboard} from './types';

export type ReplicaAudioManifestEntry = {
  src: string;
  duration: number;
  /** Input/profile fingerprints prevent stale scene audio from being reused after an edit. */
  textHash?: string;
  profileHash?: string;
  generatedAt?: string;
};

export type ReplicaAudioManifest = Record<string, ReplicaAudioManifestEntry>;

export type ReplicaVideoProps = {
  storyboard: ReplicaStoryboard;
  audioManifest: ReplicaAudioManifest;
  backgroundMusic: ReplicaBackgroundMusicDefinition;
  visualRenderer?: 'default' | 'continuous' | 'ject-continuous';
  continuousStage?: ContinuousStageDefinition;
};

const FPS = REPLICA_CANVAS.fps;
const sceneStartFrame = (scene: ReplicaScene) => Math.round(scene.start * FPS);
const sceneFrames = (scene: ReplicaScene) =>
  Math.max(1, Math.round((scene.start + scene.duration) * FPS) - sceneStartFrame(scene));

const narrationPlaybackDuration = (
  scene: ReplicaScene,
  storyboard: ReplicaStoryboard,
  audioManifest: ReplicaAudioManifest,
) => {
  const audio = audioManifest[scene.id];
  if (!audio) return 0;
  const isFinalScene = Math.abs(scene.start + scene.duration - storyboard.duration) < 0.001;
  const targetDuration = Math.max(
    1 / FPS,
    scene.duration - (isFinalScene ? storyboard.fadeToBlackSec : 0),
  );
  const playbackRate = audio.duration > 0 ? Math.max(1, audio.duration / targetDuration) : 1;
  return audio.duration > 0 ? audio.duration / playbackRate : targetDuration;
};

export const BackgroundMusic: React.FC<{
  storyboard: ReplicaStoryboard;
  audioManifest: ReplicaAudioManifest;
  music: ReplicaBackgroundMusicDefinition;
}> = ({storyboard, audioManifest, music}) => {
  const totalFrames = Math.round(storyboard.duration * FPS);
  const narrationWindows = storyboard.scenes.flatMap((scene) => {
    const duration = narrationPlaybackDuration(scene, storyboard, audioManifest);
    return duration > 0 ? [{start: scene.start, end: scene.start + duration}] : [];
  });

  return (
    <Audio
      name="Series background music"
      src={staticFile(music.src)}
      loop={music.loop}
      loopVolumeCurveBehavior="extend"
      volume={(frame) => {
        const time = frame / FPS;
        const fadeIn =
          music.fadeInSec <= 0
            ? 1
            : interpolate(time, [0, music.fadeInSec], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });
        const fadeOutStart = Math.max(0, storyboard.duration - music.fadeOutSec);
        const fadeOut =
          music.fadeOutSec <= 0
            ? 1
            : interpolate(time, [fadeOutStart, storyboard.duration], [1, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });

        let speechAwareLevel = music.volume;
        for (const window of narrationWindows) {
          if (time >= window.start && time <= window.end) {
            speechAwareLevel = Math.min(speechAwareLevel, music.duckedVolume);
            continue;
          }
          if (time < window.start && time >= window.start - music.duckAttackSec) {
            speechAwareLevel = Math.min(
              speechAwareLevel,
              interpolate(
                time,
                [window.start - music.duckAttackSec, window.start],
                [music.volume, music.duckedVolume],
                {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
              ),
            );
          }
          if (time > window.end && time <= window.end + music.duckReleaseSec) {
            speechAwareLevel = Math.min(
              speechAwareLevel,
              interpolate(
                time,
                [window.end, window.end + music.duckReleaseSec],
                [music.duckedVolume, music.volume],
                {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
              ),
            );
          }
        }

        return speechAwareLevel * Math.min(fadeIn, fadeOut);
      }}
    />
  );
};

export const SceneNarration: React.FC<{
  scene: ReplicaScene;
  storyboard: ReplicaStoryboard;
  audioManifest: ReplicaAudioManifest;
}> = ({scene, storyboard, audioManifest}) => {
  const audio = audioManifest[scene.id];
  if (!audio) return null;

  const isFinalScene = Math.abs(scene.start + scene.duration - storyboard.duration) < 0.001;
  const targetDuration = Math.max(
    1 / FPS,
    scene.duration - (isFinalScene ? storyboard.fadeToBlackSec : 0),
  );
  const playbackRate = audio.duration > 0 ? Math.max(1, audio.duration / targetDuration) : 1;
  const playbackDuration = audio.duration > 0 ? audio.duration / playbackRate : targetDuration;
  const durationInFrames = Math.max(2, Math.round(playbackDuration * FPS));

  return (
    <Audio
      src={staticFile(audio.src)}
      playbackRate={playbackRate}
      volume={(frame) => {
        const lastFrame = durationInFrames - 1;
        const fadeFrames = Math.max(
          1,
          Math.min(Math.round(FPS * 0.03), Math.floor(lastFrame / 2)),
        );
        return interpolate(
          frame,
          [0, fadeFrames, lastFrame - fadeFrames, lastFrame],
          [0, 1, 1, 0],
          {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
        );
      }}
    />
  );
};

export const SceneSfx: React.FC<{scene: ReplicaScene}> = ({scene}) => (
  <>
    {(scene.sfx ?? []).map((cue, index) => (
      <Sequence
        key={`${scene.id}-${cue.name}-${cue.at}-${index}`}
        from={Math.max(0, Math.round(cue.at * FPS))}
        durationInFrames={Math.min(sceneFrames(scene), Math.round(FPS * 1.2))}
      >
        <Audio
          src={staticFile(`assets/sfx/${cue.name}.mp3`)}
          volume={Math.min(cue.volume ?? 0.32, 0.34)}
        />
      </Sequence>
    ))}
  </>
);

const ReplicaSceneView: React.FC<{
  scene: ReplicaScene;
  storyboard: ReplicaStoryboard;
  audioManifest: ReplicaAudioManifest;
}> = ({scene, storyboard, audioManifest}) => (
  <AbsoluteFill style={{backgroundColor: REPLICA_THEME.background}}>
    <SceneNarration scene={scene} storyboard={storyboard} audioManifest={audioManifest} />
    <SceneSfx scene={scene} />
    <ReplicaSceneTransition scene={scene}>
      <ReplicaLayerRenderer layers={scene.layers} sceneDuration={scene.duration} />
      <CaptionTrack cues={scene.captions} />
    </ReplicaSceneTransition>
  </AbsoluteFill>
);

const ContinuousSceneTrack: React.FC<{
  scene: ReplicaScene;
  storyboard: ReplicaStoryboard;
  audioManifest: ReplicaAudioManifest;
}> = ({scene, storyboard, audioManifest}) => (
  <AbsoluteFill>
    <SceneNarration scene={scene} storyboard={storyboard} audioManifest={audioManifest} />
    <SceneSfx scene={scene} />
    <CaptionTrack cues={scene.captions} />
  </AbsoluteFill>
);

const FadeToBlack: React.FC<{storyboard: ReplicaStoryboard}> = ({storyboard}) => {
  const frame = useCurrentFrame();
  const fadeFrames = Math.round(storyboard.fadeToBlackSec * FPS);
  const totalFrames = Math.round(storyboard.duration * FPS);
  const endOpacity = Math.min(1, Math.max(0, storyboard.fadeEndOpacity ?? 1));
  if (fadeFrames <= 0 || endOpacity <= 0) return null;
  const opacity = interpolate(
    frame,
    [totalFrames - fadeFrames, totalFrames - 1],
    [0, endOpacity],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  return <AbsoluteFill style={{backgroundColor: '#000000', opacity, zIndex: 1000}} />;
};

export const ReplicaVideo: React.FC<ReplicaVideoProps> = ({
  storyboard,
  audioManifest,
  backgroundMusic,
  visualRenderer = 'default',
  continuousStage,
}) => (
  <AbsoluteFill
    style={{
      backgroundColor: REPLICA_THEME.background,
      color: REPLICA_THEME.primary,
      fontFamily: REPLICA_THEME.fontFamily,
      letterSpacing: 0,
      overflow: 'hidden',
    }}
  >
    <BackgroundMusic
      storyboard={storyboard}
      audioManifest={audioManifest}
      music={backgroundMusic}
    />
    {visualRenderer === 'ject-continuous' ? <JectContinuousStage /> : null}
    {visualRenderer === 'continuous' && continuousStage ? (
      <GenericContinuousStage storyboard={storyboard} definition={continuousStage} />
    ) : null}
    {storyboard.scenes.map((scene) => (
      <Sequence key={scene.id} from={sceneStartFrame(scene)} durationInFrames={sceneFrames(scene)} name={scene.id}>
        {visualRenderer === 'ject-continuous' || visualRenderer === 'continuous' ? (
          <ContinuousSceneTrack scene={scene} storyboard={storyboard} audioManifest={audioManifest} />
        ) : (
          <ReplicaSceneView scene={scene} storyboard={storyboard} audioManifest={audioManifest} />
        )}
      </Sequence>
    ))}
    <FadeToBlack storyboard={storyboard} />
  </AbsoluteFill>
);

export const getReplicaDurationFrames = (storyboard: ReplicaStoryboard) =>
  Math.round(storyboard.duration * FPS);
