import React, {useMemo} from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import growth from '../../../planning/growth-promotion.json';
import {BackgroundMusic, SceneNarration, SceneSfx, type ReplicaAudioManifest} from '../ReplicaVideo';
import {LayerRenderer, ReplicaSceneTransition} from '../visuals';
import {smoothProgress} from '../smoothMotion';
import {REPLICA_THEME} from '../theme';
import type {ReplicaBackgroundMusicDefinition, ReplicaCoverDefinition} from '../projectTypes';
import type {ReplicaCaptionCue, ReplicaScene, ReplicaStoryboard} from '../types';
import {
  VERTICAL_CANVAS as C,
  estimateTextLines,
  planVerticalScene,
  verticalCaptionsForScene,
  type VerticalCut,
} from './verticalLayout';

export type VerticalReplicaVideoProps = {
  /** Already passed through buildVerticalStoryboard. */
  storyboard: ReplicaStoryboard;
  audioManifest: ReplicaAudioManifest;
  backgroundMusic: ReplicaBackgroundMusicDefinition;
  cover: ReplicaCoverDefinition;
  cut: VerticalCut;
  /** Review-card still: keep teaching content and branding, hide captions and calls to action. */
  hideOverlays?: boolean;
};

const FPS = C.fps;
const sceneStartFrame = (scene: ReplicaScene) => Math.round(scene.start * FPS);
const sceneFrames = (scene: ReplicaScene) =>
  Math.max(1, Math.round((scene.start + scene.duration) * FPS) - sceneStartFrame(scene));

export const fillTemplate = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));

const fitFontSize = (text: string, preferred: number, width: number, min = 36) => {
  let size = preferred;
  while (size > min && estimateTextLines([{text}], size, width) > 1) size -= 2;
  return size;
};

const BrandMark: React.FC<{label: string}> = ({label}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
    <div style={{width: 42, height: 52, borderRadius: '21px 21px 15px 15px', background: REPLICA_THEME.ink, position: 'relative', transform: 'rotate(-2deg)'}}>
      <span style={{position: 'absolute', width: 7, height: 7, borderRadius: 8, background: '#fff', left: 11, top: 18}} />
      <span style={{position: 'absolute', width: 7, height: 7, borderRadius: 8, background: '#fff', right: 11, top: 18}} />
    </div>
    <div style={{fontSize: 36, fontWeight: 850, color: REPLICA_THEME.primary}}>{label}</div>
  </div>
);

const Headline: React.FC<{cover: ReplicaCoverDefinition; opacity: number}> = ({cover, opacity}) => {
  const text = `${cover.root} = ${cover.chineseMeaning}`;
  const size = fitFontSize(text, 62, C.columnWidth);
  return (
    <div style={{position: 'absolute', left: C.columnLeft, top: C.headerTop + 82, width: C.columnWidth, fontSize: size, fontWeight: 880, lineHeight: 1.15, whiteSpace: 'nowrap', opacity}}>
      <span style={{color: REPLICA_THEME.accent}}>{cover.root}</span>
      <span style={{color: REPLICA_THEME.primary}}> = {cover.chineseMeaning}</span>
    </div>
  );
};

/** Latin words in captions are tinted series blue so learners can spot the English instantly. */
const CaptionLine: React.FC<{cue: ReplicaCaptionCue}> = ({cue}) => {
  const frame = useCurrentFrame();
  const from = Math.round(cue.from * FPS);
  const to = Math.round(cue.to * FPS);
  if (frame < from || frame >= to) return null;
  const enter = smoothProgress(frame, from, 6);
  const exit = 1 - smoothProgress(frame, to - 4, 4);
  const parts = cue.text.split(/([A-Za-z][A-Za-z0-9'’\- ]*[A-Za-z0-9]|[A-Za-z])/u);
  return (
    <div style={{position: 'absolute', left: C.columnLeft - 10, top: C.captionTop, width: C.columnWidth + 20, textAlign: 'center', zIndex: 900,
      fontSize: 54, fontWeight: 820, lineHeight: 1.3, color: REPLICA_THEME.ink, opacity: enter * exit, transform: `translateY(${8 * (1 - enter)}px)`}}>
      {parts.map((part, index) =>
        index % 2 === 1 ? <span key={index} style={{color: REPLICA_THEME.primary}}>{part}</span> : <span key={index}>{part}</span>,
      )}
    </div>
  );
};

const VerticalSceneVisuals: React.FC<{scene: ReplicaScene}> = ({scene}) => {
  const plan = useMemo(() => planVerticalScene(scene), [scene]);
  return (
    <ReplicaSceneTransition scene={scene}>
      {plan.placements.map((placement) => {
        if (placement.kind === 'scaled') {
          const width = placement.layer.width ?? (placement.layer.kind === 'table' ? 1500 : 900);
          const height = placement.layer.height ?? (placement.layer.kind === 'table' ? 430 : 520);
          return (
            <div key={placement.layer.id} style={{position: 'absolute', left: placement.x, top: placement.y, width, height, transform: `scale(${placement.scale})`, transformOrigin: '0 0'}}>
              <LayerRenderer layer={{...placement.layer, x: 0, y: 0}} sceneDuration={scene.duration} />
            </div>
          );
        }
        if (placement.kind === 'art') {
          // Clip to the art box so zoomed artwork never covers the text stack above it.
          return (
            <div key={placement.layer.id} style={{position: 'absolute', left: placement.x, top: placement.y, width: placement.width, height: placement.height, overflow: 'hidden'}}>
              <LayerRenderer sceneDuration={scene.duration} layer={{...placement.layer, x: 0, y: 0, width: placement.width, height: placement.height}} />
            </div>
          );
        }
        return <LayerRenderer key={placement.layer.id} layer={placement.layer} sceneDuration={scene.duration} />;
      })}
    </ReplicaSceneTransition>
  );
};

const EndCard: React.FC<{primary: string; secondary: string; startFrame: number}> = ({primary, secondary, startFrame}) => {
  const frame = useCurrentFrame();
  const enter = smoothProgress(frame, startFrame, 14);
  if (frame < startFrame) return null;
  return (
    <>
      <div style={{position: 'absolute', left: C.columnLeft, top: C.headerTop + 80, width: C.columnWidth, display: 'flex', justifyContent: 'center', zIndex: 970,
        opacity: enter, transform: `translateY(${12 * (1 - enter)}px)`}}>
        <div style={{background: REPLICA_THEME.accent, color: '#fff', borderRadius: 18, padding: '10px 30px', fontSize: fitFontSize(primary, 50, C.columnWidth - 60), fontWeight: 880, whiteSpace: 'nowrap'}}>
          {primary}
        </div>
      </div>
      <div style={{position: 'absolute', left: C.columnLeft, top: C.secondaryCtaTop, width: C.columnWidth, textAlign: 'center', zIndex: 970,
        fontSize: fitFontSize(secondary, 40, C.columnWidth), fontWeight: 800, color: REPLICA_THEME.primary, opacity: enter}}>
        {secondary}
      </div>
    </>
  );
};

export const VerticalReplicaVideo: React.FC<VerticalReplicaVideoProps> = ({storyboard, audioManifest, backgroundMusic, cover, cut, hideOverlays = false}) => {
  const frame = useCurrentFrame();
  const totalFrames = Math.round(storyboard.duration * FPS);
  const endCardFrames = Math.round(growth.vertical.endCardSeconds * FPS);
  const endCardStart = totalFrames - endCardFrames;
  const showFullEndCard = !hideOverlays && cut === 'full';
  const headlineOpacity = showFullEndCard
    ? interpolate(frame, [endCardStart, endCardStart + 8], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
    : 1;
  const series = growth.series.name;
  const captionsByScene = useMemo(
    () => new Map(storyboard.scenes.map((scene) => [scene.id, verticalCaptionsForScene(scene)])),
    [storyboard],
  );

  return (
    <AbsoluteFill style={{backgroundColor: REPLICA_THEME.background, color: REPLICA_THEME.primary, fontFamily: REPLICA_THEME.fontFamily, letterSpacing: 0, overflow: 'hidden'}}>
      <BackgroundMusic storyboard={storyboard} audioManifest={audioManifest} music={backgroundMusic} />
      {storyboard.scenes.map((scene) => {
        return (
          <Sequence key={scene.id} from={sceneStartFrame(scene)} durationInFrames={sceneFrames(scene)} name={scene.id}>
            <SceneNarration scene={scene} storyboard={storyboard} audioManifest={audioManifest} />
            <SceneSfx scene={scene} />
            <VerticalSceneVisuals scene={scene} />
            {!hideOverlays ? (captionsByScene.get(scene.id) ?? []).map((cue, index) => <CaptionLine key={`${scene.id}-${index}`} cue={cue} />) : null}
          </Sequence>
        );
      })}
      <div style={{position: 'absolute', left: C.columnLeft, top: C.headerTop, zIndex: 950}}>
        <BrandMark label={series} />
      </div>
      <Headline cover={cover} opacity={headlineOpacity} />
      {showFullEndCard ? (
        <EndCard
          startFrame={endCardStart}
          primary={fillTemplate(growth.cta.fullEndCard.primary, {series})}
          secondary={fillTemplate(growth.cta.fullEndCard.secondary, {series})}
        />
      ) : null}
    </AbsoluteFill>
  );
};
