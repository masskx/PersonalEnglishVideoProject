import React, {type ReactNode} from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {REPLICA_THEME} from '../replica/theme';
import type {CameraMotion, MemeVocabAsset, MemeVocabRevealTimingFrames, ShortStoryboardScene} from './types';

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const enter = (frame: number, duration = 16) => interpolate(frame, [0, duration], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
const rise = (frame: number, duration = 16) => interpolate(enter(frame, duration), [0, 1], [34, 0]);

export const SafeArea: React.FC<{children?: ReactNode; showGuide?: boolean}> = ({children, showGuide = false}) => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    {showGuide ? <div style={{position: 'absolute', inset: '4% 7.5% 22%', border: '2px dashed rgba(4,31,160,.25)', borderRadius: 26}} /> : null}
    {children}
  </AbsoluteFill>
);

export const ProgressBar: React.FC<{progress: number}> = ({progress}) => (
  <div style={{position: 'absolute', top: 56, left: 78, right: 78, height: 10, borderRadius: 99, background: '#E7E9F4', overflow: 'hidden'}}>
    <div style={{height: '100%', width: `${clamp(progress) * 100}%`, background: REPLICA_THEME.accent, borderRadius: 99}} />
  </div>
);

export const ShakeEffect: React.FC<{children?: ReactNode; frame: number; strength?: number}> = ({children, frame, strength = 1}) => {
  const x = Math.sin(frame * 1.9) * 7 * strength * clamp((24 - frame) / 24);
  const y = Math.cos(frame * 2.3) * 4 * strength * clamp((24 - frame) / 24);
  return <div style={{transform: `translate(${x}px, ${y}px)`}}>{children}</div>;
};

export const PunchZoom: React.FC<{children?: ReactNode; frame: number; strength?: number}> = ({children, frame, strength = 1}) => {
  const scale = interpolate(spring({frame: Math.max(0, frame), fps: 30, durationInFrames: 20, config: {damping: 15, stiffness: 180, mass: .7}}), [0, 1], [1, 1.06 + strength * .025], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <div style={{transform: `scale(${scale})`, transformOrigin: '50% 50%'}}>{children}</div>;
};

export const KenBurnsImage: React.FC<{asset: MemeVocabAsset; frame: number; durationInFrames: number; motion: CameraMotion}> = ({asset, frame, durationInFrames, motion}) => {
  const p = enter(frame, Math.max(1, durationInFrames));
  const drift = interpolate(p, [0, 1], [0, 1]);
  const transforms: Record<CameraMotion, string> = {
    'push-in': `scale(${1 + drift * .09})`,
    'pan-left': `translateX(${-drift * 24}px) scale(1.04)`,
    'pan-right': `translateX(${drift * 24}px) scale(1.04)`,
    'local-zoom': `scale(${1.02 + drift * .13})`,
    shake: 'scale(1.04)',
    parallax: `translateY(${-drift * 16}px) scale(${1.04 + drift * .04})`,
    still: 'scale(1.02)',
  };
  const body = asset.status === 'available' ? (
    <Img src={staticFile(asset.path)} style={{width: '100%', height: '100%', objectFit: 'contain', transform: transforms[motion], transformOrigin: '50% 42%'}} />
  ) : (
    <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20, color: REPLICA_THEME.primary, border: `5px dashed ${REPLICA_THEME.accent}`, borderRadius: 36, background: '#FFF9F5'}}>
      <div style={{fontSize: 88, fontWeight: 900}}>?</div>
      <div style={{fontSize: 32, fontWeight: 900, color: REPLICA_THEME.accent}}>PLACEHOLDER ASSET</div>
      <div style={{fontSize: 24, color: REPLICA_THEME.muted, textAlign: 'center', padding: '0 38px'}}>待替换：{asset.assetId}</div>
    </div>
  );
  return motion === 'shake' ? <ShakeEffect frame={frame}>{body}</ShakeEffect> : body;
};

export const KineticCaption: React.FC<{text: string; frame: number; emphasize?: boolean; size?: number}> = ({text, frame, emphasize = false, size = 48}) => (
  <div style={{opacity: enter(frame, 12), transform: `translateY(${rise(frame, 12)}px)`, color: emphasize ? REPLICA_THEME.accent : REPLICA_THEME.primary, fontSize: size, lineHeight: 1.25, fontWeight: emphasize ? 900 : 750, textAlign: 'center', whiteSpace: 'pre-wrap'}}>{text}</div>
);

export const SubtitleLayer: React.FC<{text: string; frame: number}> = ({text, frame}) => (
  <div style={{position: 'absolute', left: 84, right: 84, bottom: 112, minHeight: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: enter(frame, 10), color: REPLICA_THEME.ink, fontSize: 30, lineHeight: 1.3, fontWeight: 600, textAlign: 'center', background: 'rgba(255,255,255,.88)', borderRadius: 18, padding: '10px 18px'}}>{text}</div>
);

type SceneVisualProps = {scene: ShortStoryboardScene; asset: MemeVocabAsset; frame: number; durationInFrames: number; word: string; revealTimingFrames?: MemeVocabRevealTimingFrames};

const SceneFrame: React.FC<{children?: ReactNode; scene: ShortStoryboardScene; asset: MemeVocabAsset; frame: number; durationInFrames: number; subtitleText?: string}> = ({children, scene, asset, frame, durationInFrames, subtitleText = scene.displayText.join(' · ')}) => (
  <AbsoluteFill style={{background: REPLICA_THEME.background, overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: 82, right: 82, top: 120, height: 1030}}>
      <KenBurnsImage asset={asset} frame={frame} durationInFrames={durationInFrames} motion={scene.cameraMotion} />
    </div>
    {children}
    {subtitleText ? <SubtitleLayer text={subtitleText} frame={frame} /> : null}
  </AbsoluteFill>
);

export const HookScene: React.FC<SceneVisualProps> = ({scene, asset, frame, durationInFrames}) => (
  <SceneFrame scene={scene} asset={asset} frame={frame} durationInFrames={durationInFrames}>
    <div style={{position: 'absolute', top: 170, left: 74, right: 74, display: 'flex', flexDirection: 'column', gap: 30, alignItems: 'center'}}>
      <KineticCaption text="老板的饼，先别吃" frame={frame} size={42} />
      <PunchZoom frame={frame}><KineticCaption text={scene.displayText[0]} frame={frame} emphasize size={64} /></PunchZoom>
    </div>
  </SceneFrame>
);

export const MemeImageScene: React.FC<SceneVisualProps> = ({scene, asset, frame, durationInFrames}) => (
  <SceneFrame scene={scene} asset={asset} frame={frame} durationInFrames={durationInFrames}>
    <div style={{position: 'absolute', top: 1210, left: 72, right: 72, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
      <KineticCaption text={scene.displayText[0]} frame={frame} />
      <KineticCaption text={scene.displayText[1] ?? ''} frame={frame - 8} emphasize size={62} />
    </div>
  </SceneFrame>
);

export const WordRevealScene: React.FC<SceneVisualProps> = ({scene, asset, frame, durationInFrames, word, revealTimingFrames}) => {
  const wordFrame = Math.max(0, frame - (revealTimingFrames?.wordStartFrame ?? Math.round(scene.revealTiming.word * 30)));
  const phoneticFrame = Math.max(0, frame - (revealTimingFrames?.phoneticStartFrame ?? Math.round(scene.revealTiming.phonetic * 30)));
  const meaningFrame = Math.max(0, frame - (revealTimingFrames?.meaningStartFrame ?? Math.round(scene.revealTiming.meaning * 30)));
  const wordStart = revealTimingFrames?.wordStartFrame ?? Math.round(scene.revealTiming.word * 30);
  return <SceneFrame scene={scene} asset={asset} frame={frame} durationInFrames={durationInFrames} subtitleText={frame >= wordStart ? scene.displayText[0] : ''}>
    <div style={{position: 'absolute', top: 1180, left: 62, right: 62, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
      <KineticCaption text={word} frame={wordFrame} emphasize size={108} />
      <KineticCaption text={scene.displayText[1]} frame={phoneticFrame} size={42} />
      <KineticCaption text={scene.displayText[2]} frame={meaningFrame} emphasize size={50} />
      <div style={{fontSize: 28, color: REPLICA_THEME.muted, fontWeight: 700}}>记忆联想：inter 插进中间，rupt 发生断裂</div>
    </div>
  </SceneFrame>;
};

export const ExampleScene: React.FC<SceneVisualProps> = ({scene, asset, frame, durationInFrames}) => (
  <SceneFrame scene={scene} asset={asset} frame={frame} durationInFrames={durationInFrames}>
    <div style={{position: 'absolute', top: 1190, left: 70, right: 70, display: 'flex', flexDirection: 'column', gap: 28, alignItems: 'center'}}>
      <KineticCaption text="Real usage" frame={frame} size={38} />
      <KineticCaption text={scene.displayText[0]} frame={frame} emphasize size={43} />
      <KineticCaption text={scene.displayText[1]} frame={Math.max(0, frame - 18)} size={42} />
    </div>
  </SceneFrame>
);

export const QuizScene: React.FC<SceneVisualProps> = ({scene, asset, frame, durationInFrames}) => (
  <SceneFrame scene={scene} asset={asset} frame={frame} durationInFrames={durationInFrames}>
    <div style={{position: 'absolute', top: 1190, left: 64, right: 64, display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center'}}>
      <KineticCaption text="评论区测试题" frame={frame} emphasize size={42} />
      <KineticCaption text={scene.quizQuestion ?? scene.displayText[0]} frame={Math.max(0, frame - 10)} size={42} />
      <div style={{display: 'flex', gap: 20, width: '100%'}}>
        {(scene.displayText[1] ?? 'A. interrupt   B. disrupt').split('   ').map((option) => <div key={option} style={{flex: 1, border: `4px solid ${REPLICA_THEME.primary}`, borderRadius: 22, padding: '18px 8px', fontSize: 34, fontWeight: 900, color: REPLICA_THEME.primary, textAlign: 'center'}}>{option}</div>)}
      </div>
      <div style={{fontSize: 28, fontWeight: 700, color: REPLICA_THEME.muted}}>只写答案，不提前看解析</div>
    </div>
  </SceneFrame>
);
