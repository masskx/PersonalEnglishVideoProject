import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {
  clamp01,
  overshootSpring,
  smoothEntrance,
  smoothExit,
} from './continuousMotion';
import type {
  ContinuousScenePlan,
  ContinuousSceneMotion,
  ContinuousStageDefinition,
  SemanticAction,
} from './projectTypes';
import {REPLICA_CANVAS, REPLICA_THEME, SOFT_BLUE, highlighterStyle} from './theme';
import type {ReplicaLayer, ReplicaScene, ReplicaStoryboard, ReplicaTextLayer} from './types';
import {LayerRenderer} from './visuals';

const FPS = REPLICA_CANVAS.fps;
const OVERLAP_FRAMES = 12;
const MOTION_VECTORS: Readonly<Record<ContinuousSceneMotion, {x: number; y: number}>> = {
  left: {x: -1, y: 0},
  right: {x: 1, y: 0},
  up: {x: 0, y: -1},
  down: {x: 0, y: 1},
  in: {x: 0, y: 0},
  out: {x: 0, y: 0},
  press: {x: 0, y: 1},
  impact: {x: 0, y: 0},
  still: {x: 0, y: 0},
};
const ACTION_FRAME_CACHE = new WeakMap<ReplicaScene, number>();
const HOLD_FRAME_CACHE = new WeakMap<ReplicaScene, number>();

const clamped = (
  value: number,
  input: readonly number[],
  output: readonly number[],
) =>
  interpolate(value, input, output, {
    easing: Easing.bezier(0.22, 1, 0.36, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

const motionVector = (motion: ContinuousSceneMotion) => MOTION_VECTORS[motion];

const strongestActionFrame = (scene: ReplicaScene) => {
  const cached = ACTION_FRAME_CACHE.get(scene);
  if (cached !== undefined) return cached;
  const strongest = (scene.sfx ?? []).find((cue) =>
    cue.name === 'hit' || cue.name === 'press' || cue.name === 'stamp',
  );
  const secondary = (scene.sfx ?? []).find((cue) => cue.at >= 0.6 && cue.name !== 'whoosh');
  const result = Math.round((strongest?.at ?? secondary?.at ?? scene.duration * 0.42) * FPS);
  ACTION_FRAME_CACHE.set(scene, result);
  return result;
};

const layerEndFrame = (layer: ReplicaLayer, scene: ReplicaScene) => {
  const duration = layer.duration ?? Math.max(0, scene.duration - layer.from);
  return Math.round((layer.from + duration) * FPS);
};

const holdFrame = (scene: ReplicaScene) => {
  const cached = HOLD_FRAME_CACHE.get(scene);
  if (cached !== undefined) return cached;
  const latestVisible = Math.max(
    1,
    ...scene.layers.map((layer) =>
      layerEndFrame(layer, scene) - (layer.exit && layer.exit !== 'none' ? 9 : 2),
    ),
  );
  const result = Math.max(1, Math.min(Math.round(scene.duration * FPS) - 1, latestVisible));
  HOLD_FRAME_CACHE.set(scene, result);
  return result;
};

const semanticImageTransform = ({
  frame,
  actionFrame,
  motion,
  plan,
  index,
}: {
  frame: number;
  actionFrame: number;
  motion: ContinuousSceneMotion;
  plan?: ContinuousScenePlan;
  index: number;
}) => {
  if (plan) {
    const strength = plan.strength ?? 1;
    const pre = clamped(frame, [actionFrame - 18, actionFrame - 5], [0, 1]);
    const hit = clamped(frame, [actionFrame - 5, actionFrame + 4], [0, 1]);
    const settle = clamped(frame, [actionFrame + 4, actionFrame + 24], [0, 1]);
    const pulse = Math.max(0, 1 - Math.abs(frame - actionFrame) / 9);
    const travel = (hit - settle) * strength;
    const anticipation = pre * (1 - hit) * strength;
    let x = 0;
    let y = 0;
    let rotate = 0;
    let scaleX = plan.imageScale ?? 1;
    let scaleY = scaleX;

    switch (plan.action) {
      case 'focus':
        x = 20 * anticipation - 36 * travel;
        scaleX += 0.035 * hit - 0.018 * settle;
        scaleY = scaleX;
        break;
      case 'form-image':
        y += 24 * anticipation - 30 * travel;
        scaleX += 0.055 * hit - 0.025 * settle;
        scaleY = scaleX;
        break;
      case 'enter-view':
        x = 70 * anticipation - 92 * travel;
        scaleX += 0.018 * hit;
        scaleY = scaleX;
        break;
      case 'play':
        x = -34 * anticipation + 76 * travel;
        rotate = 1.4 * travel;
        break;
      case 'scan':
        x = -18 * anticipation + 36 * travel;
        scaleX += 0.025 * pulse;
        scaleY = scaleX;
        break;
      case 'present-proof':
        x = 84 * anticipation - 108 * travel;
        y += -12 * travel;
        scaleX += 0.03 * hit;
        scaleY = scaleX;
        break;
      case 'clarify':
        scaleX += 0.065 * hit - 0.03 * settle;
        scaleY = scaleX;
        y += 10 * anticipation - 16 * travel;
        break;
      case 'approach':
        x = -88 * anticipation + 112 * travel;
        scaleX += 0.045 * hit - 0.015 * settle;
        scaleY = scaleX;
        break;
      case 'revisit':
        x = 52 * anticipation - 104 * travel + 52 * settle;
        rotate = -2.2 * travel + 1.1 * settle;
        break;
      case 'compare':
      case 'cascade':
      case 'gather':
        scaleX += 0.018 * pulse;
        scaleY = scaleX;
        break;
    }
    return `translate3d(${x.toFixed(3)}px, ${y.toFixed(3)}px, 0) rotate(${rotate.toFixed(3)}deg) scale(${scaleX.toFixed(4)}, ${scaleY.toFixed(4)})`;
  }
  const vector = motionVector(motion);
  const anticipation = clamped(frame, [actionFrame - 14, actionFrame - 3], [0, 1]);
  const contact = clamped(frame, [actionFrame - 3, actionFrame + 3], [0, 1]);
  const settle = clamped(frame, [actionFrame + 3, actionFrame + 18], [0, 1]);
  const directionalAmount = -7 * anticipation + 14 * contact - 7 * settle;
  const impact = Math.max(0, 1 - Math.abs(frame - actionFrame) / 7);
  const x = vector.x * directionalAmount + (motion === 'impact' ? impact * 5 : 0);
  const y = vector.y * directionalAmount;
  const scaleX =
    motion === 'in'
      ? 0.985 + contact * 0.02 - settle * 0.005
      : motion === 'out'
        ? 1 + contact * 0.014 - settle * 0.014
        : motion === 'press' || motion === 'impact'
          ? 1 + impact * 0.012
          : 1;
  const scaleY = motion === 'press' || motion === 'impact' ? 1 - impact * 0.018 : 1;

  return `translate3d(${x.toFixed(3)}px, ${y.toFixed(3)}px, 0) scale(${scaleX.toFixed(4)}, ${scaleY.toFixed(4)})`;
};

const semanticTextTransform = ({
  frame,
  actionFrame,
  action,
  index,
  layer,
}: {
  frame: number;
  actionFrame: number;
  action: SemanticAction;
  index: number;
  layer: ReplicaTextLayer;
}) => {
  const isMeaning = /meaning|definition|result/i.test(layer.id);
  const isFormula = /formula|breakdown|prefix|suffix/i.test(layer.id);
  const staggered = actionFrame + Math.min(index, 4) * 2 + (isMeaning ? 5 : 0);
  const anticipate = clamped(frame, [staggered - 10, staggered - 3], [0, 1]);
  const snap = clamped(frame, [staggered - 3, staggered + 4], [0, 1]);
  const settle = clamped(frame, [staggered + 4, staggered + 18], [0, 1]);
  const impulse = Math.max(0, snap - settle);
  const release = clamped(frame, [staggered + 18, staggered + 28], [0, 1]);
  const rebound = Math.max(0, settle * (1 - release));
  const direction = index % 2 === 0 ? -1 : 1;
  const x = isFormula ? direction * (-8 * anticipate + 11 * impulse - 3 * rebound) : 0;
  const lift = impulse * (isMeaning ? 12 : action === 'cascade' ? 9 : 6) - rebound * 2;
  const scale = 1 + impulse * (isMeaning ? 0.035 : action === 'gather' ? 0.026 : 0.018) - rebound * 0.006;
  const rotate = isFormula ? direction * (-0.7 * anticipate + 0.9 * impulse - 0.2 * rebound) : 0;
  return `translate3d(${x.toFixed(3)}px, ${(-lift).toFixed(3)}px, 0) rotate(${rotate.toFixed(3)}deg) scale(${scale.toFixed(4)})`;
};

/**
 * A small, cause-and-effect response for legacy scenes without a typed plan.
 * It only exists around the scene's action beat; there is no idle floating,
 * breathing, wall-clock animation, or random jitter.
 */
const humanizedTextTransform = ({
  frame,
  actionFrame,
  motion,
  index,
}: {
  frame: number;
  actionFrame: number;
  motion: ContinuousSceneMotion;
  index: number;
}) => {
  const offset = Math.min(index, 3) * 2;
  const anticipation = clamped(frame, [actionFrame - 12 - offset, actionFrame - 4 - offset], [0, 1]);
  const contact = clamped(frame, [actionFrame - 4 - offset, actionFrame + 4 - offset], [0, 1]);
  const settle = clamped(frame, [actionFrame + 4 - offset, actionFrame + 16 - offset], [0, 1]);
  const beat = Math.max(0, contact - settle);
  const vector = motionVector(motion);
  const x = vector.x * (3.5 * anticipation - 4.5 * beat);
  const y = -2.5 * beat + 1.5 * settle;
  const rotate = vector.x * 0.22 * beat;
  const scale = 1 + 0.012 * beat;
  return `translate3d(${x.toFixed(3)}px, ${y.toFixed(3)}px, 0) rotate(${rotate.toFixed(3)}deg) scale(${scale.toFixed(4)})`;
};

const layoutTransform = (
  plan: ContinuousScenePlan | undefined,
  layer: ReplicaLayer,
) => {
  if (plan?.layout !== 'text-right') return '';
  // Newer storyboards already place their right-hand text at x≈980. Older
  // storyboards keep the text in the left zone and need the legacy shift.
  // Applying the shift twice sends the word/formula off the canvas.
  if (layer.kind === 'text' && layer.x < REPLICA_CANVAS.width / 2) {
    return 'translate3d(760px, 0, 0)';
  }
  return '';
};

const layerInSafeZone = (
  plan: ContinuousScenePlan | undefined,
  layer: ReplicaLayer,
): ReplicaLayer => {
  if (!plan?.wordBuild) return layer;
  if (layer.kind === 'image') {
    if (plan.layout === 'text-right') {
      return {...layer, x: 20, y: 70, width: 820, height: 720, fit: plan.imageFit ?? 'contain'};
    }
    return {...layer, x: 1030, y: 70, width: 850, height: 720, fit: plan.imageFit ?? 'contain'};
  }
  if (layer.kind !== 'text' || plan.wordBuild.layerId === layer.id) return layer;
  const isMeaning = /meaning|meaning-word|meaning-text/i.test(layer.id);
  const isFormula = /formula|breakdown/i.test(layer.id);
  if (!isMeaning && !isFormula) return layer;
  return {
    ...layer,
    y: layer.y + (isMeaning ? 58 : 18),
    width: Math.min(900, (layer.width ?? layer.maxWidth ?? 760) + 80),
    fontSize: Math.round((layer.fontSize ?? 42) * (isMeaning ? 1.1 : 1.06)),
  };
};

const dynamicLoopFrames = (frame: number) => {
  const phase = ((Math.floor(frame) % 135) + 135) % 135;
  if (phase < 120) return {primary: phase + 15, secondary: null as number | null, mix: 0};
  return {primary: phase + 15, secondary: phase - 120, mix: (phase - 119) / 15};
};

const DynamicImageLayer: React.FC<{
  layer: ReplicaLayer;
  asset: string;
  frame: number;
  sceneDuration: number;
  transform?: string;
}> = ({layer, asset, frame, sceneDuration, transform}) => {
  if (layer.kind !== 'image') return null;
  const from = Math.round(layer.from * FPS);
  const end = Math.round((layer.from + (layer.duration ?? sceneDuration - layer.from)) * FPS);
  if (frame < from || frame >= end) return null;
  const enter = smoothEntrance(frame, from, Math.round((layer.enterDuration ?? 0.4) * FPS));
  const exit = smoothExit(frame, end, Math.round((layer.exitDuration ?? 0.2) * FPS));
  const opacity = Math.min(enter, exit) * (layer.opacity ?? 1);
  const whiteBacked = asset.includes('-white-motion/');
  if (whiteBacked) {
    const local = ((Math.floor(frame - from) % 268) + 268) % 268;
    const index = local <= 134 ? local + 15 : 149 - (local - 134);
    return (
      <Img
        src={staticFile(`${asset}/${String(index).padStart(6, '0')}.png`)}
        style={{
          position: 'absolute', left: layer.x, top: layer.y, width: layer.width, height: layer.height,
          objectFit: layer.fit ?? 'contain', objectPosition: layer.objectPosition ?? '50% 50%',
          zIndex: layer.zIndex ?? 1, transform, transformOrigin: '50% 50%', opacity,
          // White-backed legacy frames: multiply drops the white plate onto the paper canvas.
          mixBlendMode: 'multiply',
        }}
      />
    );
  }
  const loop = dynamicLoopFrames(frame - from);
  const source = (index: number) => staticFile(`${asset}/${String(index).padStart(6, '0')}.png`);
  const style: React.CSSProperties = {
    position: 'absolute', left: layer.x, top: layer.y, width: layer.width, height: layer.height,
    objectFit: layer.fit ?? 'contain', objectPosition: layer.objectPosition ?? '50% 50%',
    zIndex: layer.zIndex ?? 1, transform, transformOrigin: '50% 50%',
  };
  return (
    <>
      <Img src={source(loop.primary)} style={{...style, opacity: opacity * (1 - loop.mix)}} />
      {loop.secondary === null ? null : (
        <Img src={source(loop.secondary)} style={{...style, opacity: opacity * loop.mix}} />
      )}
    </>
  );
};

const MorphWordBuild: React.FC<{
  layer: ReplicaTextLayer;
  plan: ContinuousScenePlan;
  frame: number;
}> = ({layer, plan, frame}) => {
  const build = plan.wordBuild!;
  const start = Math.round(build.at * FPS);
  const rootIn = overshootSpring(frame, start, FPS, 18);
  const affixIn = clamped(frame, [start + 4, start + 18], [0, 1]);
  const underline = clamped(frame, [start + 14, start + 28], [0, 1]);
  // Right-hand text in the newer storyboards already starts in the right zone;
  // only legacy left-zone layers need the compatibility shift.
  const shifted = plan.layout === 'text-right' && layer.x < REPLICA_CANVAS.width / 2;
  return (
    <div
      style={{
        position: 'absolute',
        left: layer.x + (shifted ? 760 : 0),
        top: layer.y,
        width: layer.width ?? layer.maxWidth,
        height: layer.height,
        zIndex: layer.zIndex ?? 1,
        fontFamily: REPLICA_THEME.fontFamily,
        fontSize: Math.round((layer.fontSize ?? 88) * 1.08),
        fontWeight: layer.fontWeight ?? 800,
        lineHeight: layer.lineHeight ?? 1.2,
        letterSpacing: 0,
        whiteSpace: 'nowrap',
        transformOrigin: '0 50%',
      }}
    >
      <div style={{display: 'inline-flex', alignItems: 'baseline'}}>
        {build.prefix ? (
          <span
            style={{
              color: REPLICA_THEME.primary,
              opacity: affixIn,
              transform: `translateX(${(-86 * (1 - affixIn)).toFixed(2)}px) rotate(${(-4 * (1 - affixIn)).toFixed(2)}deg)`,
            }}
          >
            {build.prefix}
          </span>
        ) : null}
        <span
          style={{
            color: REPLICA_THEME.accent,
            opacity: clamp01(rootIn),
            transform: `translateY(${(18 * (1 - rootIn)).toFixed(2)}px) scale(${(0.72 + rootIn * 0.28).toFixed(4)})`,
            transformOrigin: '50% 75%',
            ...highlighterStyle(underline),
          }}
        >
          {build.root}
        </span>
        {build.suffix ? (
          <span
            style={{
              color: REPLICA_THEME.primary,
              opacity: affixIn,
              transform: `translateX(${(92 * (1 - affixIn)).toFixed(2)}px) rotate(${(4 * (1 - affixIn)).toFixed(2)}deg)`,
            }}
          >
            {build.suffix}
          </span>
        ) : null}
      </div>
    </div>
  );
};

/** 纸面配色：词页插图区的浅蓝圆角底板（与小红书词卡相同），位置与 layerInSafeZone 的插图框一致。 */
const ArtPanel: React.FC<{layout?: ContinuousScenePlan['layout']}> = ({layout}) => {
  const box = layout === 'text-right' ? {left: 20, top: 70, width: 820, height: 720} : {left: 1030, top: 70, width: 850, height: 720};
  return <div style={{position: 'absolute', ...box, borderRadius: 40, backgroundColor: SOFT_BLUE, zIndex: 0}} />;
};

const SemanticOverlay: React.FC<{
  frame: number;
  actionFrame: number;
  plan: ContinuousScenePlan;
}> = ({frame, actionFrame, plan}) => {
  const draw = clamped(frame, [actionFrame - 14, actionFrame + 8], [0, 1]);
  const fade = clamped(frame, [actionFrame + 24, actionFrame + 48], [1, 0]);
  const opacity = draw * fade * 0.9;
  if (opacity <= 0 || !['focus', 'scan', 'clarify'].includes(plan.action)) return null;
  const isFocus = ['focus', 'scan', 'clarify'].includes(plan.action);
  return (
    <svg
      viewBox="0 0 1920 1080"
      style={{position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 660, opacity, pointerEvents: 'none'}}
    >
      {isFocus ? (
        <g transform={plan.layout === 'text-right' ? 'translate(-1000 0)' : undefined}>
          <path d="M1288 366 L1288 326 L1328 326 M1582 326 L1622 326 L1622 366 M1288 474 L1288 514 L1328 514 M1582 514 L1622 514 L1622 474" fill="none" stroke={REPLICA_THEME.accent} strokeWidth={7} strokeLinecap="round" />
          <line x1={1325 + draw * 245} y1="344" x2={1325 + draw * 245} y2="496" stroke={REPLICA_THEME.primary} strokeWidth={4} opacity={0.55} />
        </g>
      ) : null}
    </svg>
  );
};

const FlectFlexStoryOverlay: React.FC<{
  sceneId: string;
  frame: number;
  durationInFrames: number;
  layout?: ContinuousScenePlan['layout'];
}> = ({sceneId, frame, durationInFrames, layout}) => {
  const supported = [
    'reflect-bend-back',
    'reflection-returned-image',
    'deflect-turn-aside',
    'inflect-bend-voice',
    'flexible-easy-bend',
    'flexibility-many-bends',
    'reflex-fast-return',
    'inflexible-wont-bend',
  ].includes(sceneId);
  if (!supported) return null;

  const enter = clamped(frame, [8, 20], [0, 1]);
  const exit = clamped(frame, [durationInFrames - 18, durationInFrames - 5], [1, 0]);
  const opacity = enter * exit;
  const groupX = layout === 'text-right' ? 35 : 1015;
  const accent = REPLICA_THEME.accent;
  const primary = REPLICA_THEME.primary;
  const ink = '#111111';

  const phase = clamp01((frame - 26) / 100);
  const climax = clamp01((frame - 104) / 25);
  const settlePulse = Math.max(0, 1 - Math.abs(frame - 128) / 14);
  const dash = 1 - phase;

  let content: React.ReactNode = null;

  if (sceneId === 'reflect-bend-back') {
    const outbound = clamp01(phase * 2);
    const returning = clamp01(phase * 2 - 1);
    const dotX = returning <= 0 ? 80 + 500 * outbound : 580 - 390 * returning;
    const dotY = returning <= 0 ? 385 - 35 * outbound : 350 - 190 * returning;
    content = (
      <>
        <path d="M80 385 C250 360 420 360 580 350" pathLength={1} fill="none" stroke={accent} strokeWidth={10} strokeLinecap="round" strokeDasharray={1} strokeDashoffset={1 - outbound} />
        <line x1="590" y1="225" x2="590" y2="510" stroke={ink} strokeWidth={9} strokeLinecap="round" opacity={clamped(frame, [62, 78], [0, 0.8])} />
        <path d="M580 350 C470 305 330 235 190 160" pathLength={1} fill="none" stroke={accent} strokeWidth={10} strokeLinecap="round" strokeDasharray={1} strokeDashoffset={1 - returning} />
        <circle cx={dotX} cy={dotY} r={12 + settlePulse * 5} fill={accent} />
        <text x="105" y="125" fill={primary} fontFamily={REPLICA_THEME.fontFamily} fontSize="30" fontWeight="800" opacity={climax}>re-：折回来</text>
      </>
    );
  }

  if (sceneId === 'reflection-returned-image') {
    const frameDraw = clamp01((frame - 24) / 40);
    const echo = clamp01((frame - 68) / 55);
    const ripple = Math.max(0, 1 - Math.abs(frame - 118) / 22);
    content = (
      <>
        <rect x="190" y="150" width="360" height="430" rx="34" pathLength={1} fill="rgba(255,255,255,0.72)" stroke={primary} strokeWidth={8} strokeDasharray={1} strokeDashoffset={1 - frameDraw} />
        <path d="M250 465 C320 330 415 270 505 220" pathLength={1} fill="none" stroke={accent} strokeWidth={10} strokeLinecap="round" strokeDasharray={1} strokeDashoffset={1 - echo} />
        {[0, 1, 2].map((ring) => {
          const ringPhase = clamp01(echo * 1.5 - ring * 0.22);
          return (
            <ellipse
              key={ring}
              cx="400"
              cy="350"
              rx={55 + ringPhase * (95 + ring * 28)}
              ry={70 + ringPhase * (110 + ring * 24)}
              fill="none"
              stroke={ring === 0 ? accent : REPLICA_THEME.rule}
              strokeWidth={ring === 0 ? 8 : 5}
              opacity={(1 - ringPhase * 0.68) * (0.82 - ring * 0.16)}
            />
          );
        })}
        <circle cx="400" cy="350" r={18 + ripple * 8} fill={accent} opacity={0.75 + ripple * 0.25} />
        <text x="255" y="110" fill={primary} fontFamily={REPLICA_THEME.fontFamily} fontSize="30" fontWeight="800" opacity={climax}>弯回之后，留下结果</text>
      </>
    );
  }

  if (sceneId === 'deflect-turn-aside') {
    const approach = clamp01(phase * 1.8);
    const turn = clamp01(phase * 1.8 - 0.8);
    const ballX = turn <= 0 ? 70 + 430 * approach : 500 + 245 * turn;
    const ballY = turn <= 0 ? 380 : 380 - 235 * turn;
    content = (
      <>
        <path d="M70 380 L500 380" pathLength={1} fill="none" stroke={primary} strokeWidth={5} strokeDasharray="15 13" strokeDashoffset={18 - approach * 36} opacity={0.5 + approach * 0.35} />
        <path d="M500 380 Q615 270 745 145" pathLength={1} fill="none" stroke={accent} strokeWidth={10} strokeLinecap="round" strokeDasharray={1} strokeDashoffset={1 - turn} />
        <path d="M510 255 L510 505" stroke={ink} strokeWidth={12} strokeLinecap="round" opacity={clamped(frame, [48, 65], [0, 0.82])} />
        <circle cx={ballX} cy={ballY} r={20 + settlePulse * 4} fill="#FFFFFF" stroke={ink} strokeWidth={5} />
        <g opacity={clamped(frame, [96, 107], [0, 1])}>
          <path d="M520 350 l32 -24 M522 382 l42 0 M518 414 l34 24" stroke={accent} strokeWidth={7} strokeLinecap="round" />
        </g>
        <text x="545" y="125" fill={accent} fontFamily={REPLICA_THEME.fontFamily} fontSize="30" fontWeight="800" opacity={climax}>偏离原方向</text>
      </>
    );
  }

  if (sceneId === 'inflect-bend-voice') {
    const cursorX = 70 + phase * 675;
    const cursorY = 335 - Math.sin(phase * Math.PI * 3.2) * (70 + 38 * climax);
    content = (
      <>
        <line x1="65" y1="335" x2="750" y2="335" stroke={REPLICA_THEME.rule} strokeWidth={4} />
        <path d="M70 335 C135 250 190 420 255 335 S375 250 440 335 S560 420 625 335 S695 250 745 335" pathLength={1} fill="none" stroke={accent} strokeWidth={10} strokeLinecap="round" strokeDasharray={1} strokeDashoffset={dash} />
        <circle cx={cursorX} cy={cursorY} r={11 + settlePulse * 4} fill={accent} />
        <path d={`M${cursorX.toFixed(1)} 470 L${cursorX.toFixed(1)} 430`} stroke={primary} strokeWidth={5} strokeLinecap="round" opacity={climax} />
        <text x="205" y="155" fill={primary} fontFamily={REPLICA_THEME.fontFamily} fontSize="30" fontWeight="800" opacity={climax}>声音高低也会“弯”</text>
      </>
    );
  }

  if (sceneId === 'flexible-easy-bend') {
    const beadX = 65 + phase * 690;
    const waveY = (x: number) => 350 + Math.sin((x - 65) / 690 * Math.PI * 2) * 105;
    const beadY = waveY(beadX);
    content = (
      <>
        <circle cx="300" cy="350" r="72" fill="#FFFFFF" stroke={REPLICA_THEME.rule} strokeWidth={6} />
        <circle cx="570" cy="350" r="72" fill="#FFFFFF" stroke={REPLICA_THEME.rule} strokeWidth={6} />
        <path d="M65 350 C155 210 225 210 300 350 S445 490 570 350 S680 210 755 350" pathLength={1} fill="none" stroke={accent} strokeWidth={12} strokeLinecap="round" strokeDasharray={1} strokeDashoffset={dash} />
        <circle cx={beadX} cy={beadY} r={13 + settlePulse * 4} fill={accent} />
        <text x="245" y="145" fill={primary} fontFamily={REPLICA_THEME.fontFamily} fontSize="30" fontWeight="800" opacity={climax}>能弯，才能绕过去</text>
      </>
    );
  }

  if (sceneId === 'flexibility-many-bends') {
    const shapeA = clamp01((frame - 24) / 35);
    const shapeB = clamp01((frame - 72) / 35);
    const shapeC = clamp01((frame - 120) / 35);
    const orbit = (frame - 26) / 18;
    const beadX = 400 + Math.cos(orbit) * (125 + 24 * shapeC);
    const beadY = 350 + Math.sin(orbit * 1.25) * (90 + 18 * shapeB);
    content = (
      <>
        <path d="M120 350 C220 160 340 160 420 350 S610 540 720 350" pathLength={1} fill="none" stroke={REPLICA_THEME.rule} strokeWidth={7} strokeDasharray={1} strokeDashoffset={1 - shapeA} opacity={0.72 * (1 - shapeC * 0.45)} />
        <path d="M125 350 C240 520 345 180 430 350 S600 510 715 350" pathLength={1} fill="none" stroke={primary} strokeWidth={8} strokeDasharray={1} strokeDashoffset={1 - shapeB} opacity={0.72 * shapeB} />
        <path d="M145 350 C210 230 300 470 400 350 S590 230 695 350" pathLength={1} fill="none" stroke={accent} strokeWidth={11} strokeLinecap="round" strokeDasharray={1} strokeDashoffset={1 - shapeC} opacity={shapeC} />
        <circle cx={beadX} cy={beadY} r={12 + settlePulse * 4} fill={accent} opacity={Math.max(shapeA, shapeB)} />
        <text x="245" y="125" fill={primary} fontFamily={REPLICA_THEME.fontFamily} fontSize="30" fontWeight="800" opacity={climax}>不只弯一次，而是随时调整</text>
      </>
    );
  }

  if (sceneId === 'reflex-fast-return') {
    const compress = clamp01((frame - 28) / 55);
    const release = clamp01((frame - 88) / 24);
    const springScale = 1 - compress * 0.42 + release * 0.5;
    const bodyShift = compress * 150 - release * 165;
    const recoil = Math.max(0, 1 - Math.abs(frame - 112) / 12);
    content = (
      <>
        <line x1="105" y1="350" x2="170" y2="350" stroke={ink} strokeWidth={12} strokeLinecap="round" />
        <g transform={`translate(170 0) scale(${springScale.toFixed(4)} 1)`}>
          <path d="M0 350 C35 245 70 455 105 350 S175 245 210 350 S280 455 315 350 S385 245 420 350" fill="none" stroke={accent} strokeWidth={12} strokeLinecap="round" />
        </g>
        <rect x={590 - bodyShift} y="285" width="78" height="130" rx="18" fill="#FFFFFF" stroke={primary} strokeWidth={8} />
        <path d={`M${(650 - bodyShift).toFixed(1)} 250 l${(-36 - recoil * 12).toFixed(1)} -28 M${(650 - bodyShift).toFixed(1)} 450 l${(-36 - recoil * 12).toFixed(1)} 28`} stroke={accent} strokeWidth={7} strokeLinecap="round" opacity={release} />
        <text x="215" y="125" fill={primary} fontFamily={REPLICA_THEME.fontFamily} fontSize="30" fontWeight="800" opacity={climax}>压弯以后，立刻弹回</text>
      </>
    );
  }

  if (sceneId === 'inflexible-wont-bend') {
    const pressure = clamp01((frame - 30) / 65);
    const impact = clamp01((frame - 96) / 14);
    const shake = impact * Math.sin(frame * 1.7) * 7 * (1 - clamp01((frame - 132) / 30));
    content = (
      <>
        <g transform={`translate(${shake.toFixed(2)} 0)`}>
          <rect x="120" y="320" width="600" height="42" rx="21" fill={accent} />
          <line x1="120" y1="300" x2="120" y2="382" stroke={ink} strokeWidth={7} />
          <line x1="720" y1="300" x2="720" y2="382" stroke={ink} strokeWidth={7} />
        </g>
        <path d="M55 341 H112 M82 315 L112 341 L82 367" fill="none" stroke={primary} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" opacity={pressure} />
        <path d="M785 341 H728 M758 315 L728 341 L758 367" fill="none" stroke={primary} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" opacity={pressure} />
        <g opacity={impact}>
          <path d="M390 270 l20 -35 M430 270 l0 -42 M470 270 l22 -35" stroke="#D9362B" strokeWidth={8} strokeLinecap="round" />
          <circle cx="430" cy="341" r={58 + settlePulse * 5} fill="#FFFFFF" stroke="#D9362B" strokeWidth={7} />
          <path d="M405 315 L455 365 M455 315 L405 365" stroke="#D9362B" strokeWidth={9} strokeLinecap="round" />
        </g>
        <text x="265" y="145" fill={primary} fontFamily={REPLICA_THEME.fontFamily} fontSize="30" fontWeight="800" opacity={climax}>受力，但不肯改变形状</text>
      </>
    );
  }

  return (
    <svg
      viewBox="0 0 1920 1080"
      style={{position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 645, opacity, pointerEvents: 'none'}}
    >
      <g transform={`translate(${groupX} 95)`}>{content}</g>
    </svg>
  );
};

const RuptureStoryOverlay: React.FC<{
  sceneId: string;
  frame: number;
  durationInFrames: number;
  layout?: ContinuousScenePlan['layout'];
}> = ({sceneId, frame, durationInFrames, layout}) => {
  const supported = [
    'rupt-hook','rupture-break-open','interrupt-break-in','disrupt-break-apart',
    'erupt-break-out','corrupt-break-down','bankrupt-break-the-bank','abrupt-break-off',
    'incorruptible-not-broken',
  ].includes(sceneId);
  if (!supported) return null;

  const enter = clamped(frame, [8, 20], [0, 1]);
  const exit = clamped(frame, [durationInFrames - 18, durationInFrames - 5], [1, 0]);
  const opacity = enter * exit;
  const groupX = layout === 'text-right' ? 35 : 1015;
  const accent = REPLICA_THEME.accent;
  const primary = REPLICA_THEME.primary;
  const ink = '#111111';
  const progress = clamp01((frame - 24) / 82);
  const climax = clamp01((frame - 94) / 22);
  const settle = Math.max(0, 1 - Math.abs(frame - 128) / 18);
  let content: React.ReactNode = null;

  if (sceneId === 'rupt-hook') {
    const cut = clamp01((frame - 20) / 24);
    const gap = cut * 30;
    content = <>
      <path d="M80 350 C190 300 300 405 420 350 S620 300 750 350" fill="none" stroke={primary} strokeWidth="8" strokeLinecap="round" opacity="0.65" />
      <path d={`M80 350 C190 300 300 405 ${420-gap} 350`} fill="none" stroke={accent} strokeWidth="13" strokeLinecap="round" strokeDasharray="1" strokeDashoffset={1 - clamp01(progress * 1.8)} />
      <path d={`M${420+gap} 350 C540 300 650 405 750 350`} fill="none" stroke={accent} strokeWidth="13" strokeLinecap="round" strokeDasharray="1" strokeDashoffset={1 - clamp01(progress * 1.8 - 0.36)} />
      <line x1={420-gap} y1="300" x2={420-gap} y2="400" stroke={ink} strokeWidth="8" strokeLinecap="round" />
      <line x1={420+gap} y1="300" x2={420+gap} y2="400" stroke={ink} strokeWidth="8" strokeLinecap="round" />
      <text x="210" y="150" fill={accent} fontFamily={REPLICA_THEME.fontFamily} fontSize="34" fontWeight="800" opacity={climax}>一句话，真的被切断了</text>
    </>;
  } else if (sceneId === 'rupture-break-open') {
    const split = clamp01((frame - 45) / 28);
    content = <>
      <circle cx={430 - split * 20} cy="350" r="118" fill="#FFFFFF" stroke={primary} strokeWidth="8" />
      <path d={`M430 235 L${412 - split*26} 294 L${446 + split*32} 345 L${410 - split*24} 404 L430 468`} fill="none" stroke={accent} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M430 235 L${448 + split*26} 294 L${414 - split*32} 345 L${450 + split*24} 404 L430 468`} fill="none" stroke={accent} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" opacity={split} />
      <text x="270" y="140" fill={primary} fontFamily={REPLICA_THEME.fontFamily} fontSize="32" fontWeight="800" opacity={climax}>整体，从裂口处打开</text>
    </>;
  } else if (sceneId === 'interrupt-break-in') {
    const barX = 95 + progress * 560;
    const stop = clamp01((frame - 100) / 18);
    content = <>
      <path d="M70 350 C180 295 285 405 395 350 S610 295 760 350" fill="none" stroke={primary} strokeWidth="9" strokeLinecap="round" opacity="0.58" />
      <rect x={barX} y="255" width="26" height="190" rx="13" fill={accent} transform={`rotate(${stop * 24 - 12} ${barX+13} 350)`} />
      <circle cx={barX+13} cy="350" r={18 + settle*6} fill="#FFFFFF" stroke={ink} strokeWidth="6" />
      <text x="180" y="145" fill={accent} fontFamily={REPLICA_THEME.fontFamily} fontSize="32" fontWeight="800" opacity={climax}>插进中间，打断进行中</text>
    </>;
  } else if (sceneId === 'disrupt-break-apart') {
    const hit = clamp01((frame - 70) / 16);
    const pieces = [[280,300,-18],[410,290,6],[540,300,22],[350,410,12],[500,420,-16]];
    content = <>
      <g opacity={1-hit*0.2}>{pieces.map(([x,y,r],i)=><rect key={i} x={x - 42 - (i%2)*hit*34} y={y - 32 + (i%3)*hit*25} width="84" height="64" rx="9" fill={i===2?accent:'#FFFFFF'} stroke={primary} strokeWidth="7" transform={`rotate(${r + (i%2?hit*14:-hit*10)} ${x} ${y})`} />)}</g>
      <path d={`M${120+hit*40} 360 L${280-hit*10} 360`} stroke={accent} strokeWidth="12" strokeLinecap="round" opacity={0.8} />
      <path d="M210 250 l-34 -32 M210 470 l-34 32 M620 240 l34 -32 M620 470 l34 32" stroke={accent} strokeWidth="8" strokeLinecap="round" opacity={hit} />
      <text x="225" y="145" fill={primary} fontFamily={REPLICA_THEME.fontFamily} fontSize="32" fontWeight="800" opacity={climax}>原本有序，突然被打乱</text>
    </>;
  } else if (sceneId === 'erupt-break-out') {
    const burst = clamp01((frame - 52) / 42);
    const rays = [0,1,2,3,4].map((i) => {
      const x = 420 + Math.cos((-1.2 + i*0.6)) * (110 + burst*120);
      const y = 365 + Math.sin((-1.2 + i*0.6)) * (110 + burst*120);
      return <line key={i} x1="420" y1="380" x2={x} y2={y} stroke={accent} strokeWidth="12" strokeLinecap="round" opacity={burst} />;
    });
    content = <>
      <path d="M255 470 L330 280 Q420 230 510 280 L585 470 Z" fill="#FFFFFF" stroke={primary} strokeWidth="8" />
      <ellipse cx="420" cy="285" rx="90" ry="24" fill="#FFFFFF" stroke={primary} strokeWidth="8" />
      {rays}
      <circle cx="420" cy="375" r={18 + settle*8} fill={accent} opacity={0.8} />
      <text x="255" y="145" fill={accent} fontFamily={REPLICA_THEME.fontFamily} fontSize="32" fontWeight="800" opacity={climax}>从里面向外冲出来</text>
    </>;
  } else if (sceneId === 'corrupt-break-down') {
    const spread = clamp01((frame - 55) / 45);
    content = <>
      <circle cx="420" cy="350" r="128" fill="#FFFFFF" stroke={primary} strokeWidth="8" />
      <path d="M320 350 Q420 245 520 350 Q420 455 320 350Z" fill="none" stroke={primary} strokeWidth="6" opacity="0.55" />
      {[0,1,2,3].map((i) => <circle key={i} cx={360 + i*40} cy={350 + Math.sin(i*1.8)*52*spread} r={9 + spread*8} fill="#D9362B" opacity={0.75 - i*0.11} />)}
      <path d="M220 250 C290 300 300 330 345 350" fill="none" stroke="#D9362B" strokeWidth="9" strokeLinecap="round" strokeDasharray="16 15" strokeDashoffset={20 - spread*30} />
      <text x="245" y="145" fill="#D9362B" fontFamily={REPLICA_THEME.fontFamily} fontSize="32" fontWeight="800" opacity={climax}>内部被破坏，变质了</text>
    </>;
  } else if (sceneId === 'bankrupt-break-the-bank') {
    const drop = clamp01((frame - 62) / 36);
    content = <>
      <path d={`M160 420 L${380-drop*55} 420 L${430+drop*55} 475 L690 475`} fill="none" stroke={primary} strokeWidth="12" strokeLinecap="round" />
      <path d="M360 420 L420 475 L480 420" fill="none" stroke="#D9362B" strokeWidth="9" strokeLinecap="round" />
      {[0,1,2].map((i)=><circle key={i} cx={300+i*52} cy={300 + drop*150 + i*10} r="18" fill={accent} stroke={primary} strokeWidth="5" />)}
      <path d="M420 185 L420 240" stroke={accent} strokeWidth="9" strokeLinecap="round" opacity={drop} />
      <text x="240" y="140" fill={primary} fontFamily={REPLICA_THEME.fontFamily} fontSize="32" fontWeight="800" opacity={climax}>钱袋子一破，系统垮掉</text>
    </>;
  } else if (sceneId === 'abrupt-break-off') {
    const travel = clamp01((frame - 24) / 55);
    const stop = clamp01((frame - 88) / 10);
    const x = 100 + travel * 610 - stop * 95;
    content = <>
      <path d="M95 355 L750 355" stroke={REPLICA_THEME.rule} strokeWidth="8" strokeLinecap="round" strokeDasharray="18 16" />
      <circle cx={x} cy="355" r={20 + settle*5} fill={accent} />
      <path d={`M${x} 285 L${x} 425`} stroke={ink} strokeWidth="10" strokeLinecap="round" opacity={stop} />
      <path d={`M${x+35} 285 L${x+55} 260 M${x+35} 425 L${x+55} 450`} stroke="#D9362B" strokeWidth="8" strokeLinecap="round" opacity={stop} />
      <text x="240" y="145" fill={accent} fontFamily={REPLICA_THEME.fontFamily} fontSize="32" fontWeight="800" opacity={climax}>突然断开，毫无铺垫</text>
    </>;
  } else if (sceneId === 'incorruptible-not-broken') {
    const shield = clamp01((frame - 50) / 30);
    content = <>
      <circle cx="430" cy="350" r="125" fill="#FFFFFF" stroke={primary} strokeWidth="9" />
      <path d="M300 250 Q430 180 560 250" fill="none" stroke={accent} strokeWidth="12" strokeLinecap="round" opacity={shield} />
      <circle cx={300 - shield*10} cy={350 + shield*20} r="15" fill="#D9362B" opacity={0.8} />
      <path d={`M310 350 Q360 310 ${400+shield*35} 350`} fill="none" stroke="#D9362B" strokeWidth="8" strokeLinecap="round" opacity={1-shield*0.7} />
      <path d="M510 250 L555 295 M555 250 L510 295" stroke={accent} strokeWidth="9" strokeLinecap="round" opacity={shield} />
      <text x="220" y="145" fill={primary} fontFamily={REPLICA_THEME.fontFamily} fontSize="32" fontWeight="800" opacity={climax}>不被破坏，保持清白</text>
    </>;
  }

  return (
    <svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,width:'100%',height:'100%',zIndex:645,opacity,pointerEvents:'none'}}>
      <g transform={`translate(${groupX} 95)`}>{content}</g>
    </svg>
  );
};

const MitMissStoryOverlay: React.FC<{
  sceneId: string;
  frame: number;
  durationInFrames: number;
  layout?: ContinuousScenePlan['layout'];
}> = ({sceneId, frame, durationInFrames, layout}) => {
  const supported = [
    'send-hook','submit-send-up','transmit-send-across','emit-send-out','admit-send-in',
    'permit-send-through','commit-send-over','dismiss-send-away','mission-sent-task',
  ].includes(sceneId);
  if (!supported) return null;

  const enter = clamped(frame, [8, 20], [0, 1]);
  const exit = clamped(frame, [durationInFrames - 18, durationInFrames - 5], [1, 0]);
  const opacity = enter * exit;
  const groupX = layout === 'text-right' ? 35 : 1015;
  const accent = REPLICA_THEME.accent;
  const primary = REPLICA_THEME.primary;
  const ink = '#111111';
  const red = '#D9362B';
  const progress = clamp01((frame - 24) / 82);
  const climax = clamp01((frame - 94) / 22);
  const settle = Math.max(0, 1 - Math.abs(frame - 128) / 18);
  let content: React.ReactNode = null;

  if (sceneId === 'send-hook') {
    const pull = clamp01((frame - 10) / 30);
    const spin = clamp01((frame - 35) / 45);
    const capsuleX = 130 + spin * 420;
    const capsuleY = 390 - Math.sin(spin * Math.PI) * 120;
    content = <>
      <circle cx="560" cy="350" r="135" fill="#FFFFFF" stroke={primary} strokeWidth="9" />
      {[0,1,2].map(i=><line key={i} x1="560" y1="350" x2={560+Math.cos(i*2.094+spin*2.4)*118} y2={350+Math.sin(i*2.094+spin*2.4)*118} stroke={primary} strokeWidth="7" strokeLinecap="round" />)}
      <path d={`M115 500 L210 ${500-pull*100}`} stroke={ink} strokeWidth="12" strokeLinecap="round" />
      <rect x={capsuleX-34} y={capsuleY-18} width="68" height="36" rx="18" fill={accent} transform={`rotate(${-18+spin*55} ${capsuleX} ${capsuleY})`} />
      <text x="145" y="145" fill={accent} fontFamily={REPLICA_THEME.fontFamily} fontSize="34" fontWeight="800" opacity={climax}>先发送，再揭晓目的地</text>
    </>;
  } else if (sceneId === 'submit-send-up') {
    const lift = clamp01((frame - 45) / 50);
    const y = 485 - lift * 255;
    content = <>
      <path d="M250 505 L590 505" stroke={primary} strokeWidth="10" strokeLinecap="round" />
      <path d={`M300 500 L540 ${y+40} M540 500 L300 ${y+40}`} stroke={primary} strokeWidth="8" strokeLinecap="round" />
      <rect x="315" y={y} width="210" height="54" rx="12" fill="#FFFFFF" stroke={primary} strokeWidth="7" />
      <rect x="372" y={y+10} width="96" height="34" rx="17" fill={accent} />
      <path d="M325 175 L515 175" stroke={ink} strokeWidth="14" strokeLinecap="round" opacity={climax} />
      <text x="275" y="135" fill={primary} fontFamily={REPLICA_THEME.fontFamily} fontSize="32" fontWeight="800" opacity={climax}>递到更高一级</text>
    </>;
  } else if (sceneId === 'transmit-send-across') {
    const charge = clamp01((frame - 30) / 38);
    const jump = clamp01((frame - 70) / 35);
    const pulseX = 245 + jump * 380;
    content = <>
      {[0,1,2].map(i=><circle key={i} cx="220" cy="350" r={42+i*25} fill="none" stroke={i===0?accent:primary} strokeWidth={i===0?9:5} opacity={charge*(0.8-i*0.16)} />)}
      {[0,1,2].map(i=><circle key={i} cx="650" cy="350" r={42+i*25} fill="none" stroke={i===0?accent:primary} strokeWidth={i===0?9:5} opacity={jump*(0.8-i*0.16)} />)}
      <path d="M305 350 C405 245 495 455 575 350" fill="none" stroke={accent} strokeWidth="10" strokeLinecap="round" strokeDasharray="18 14" strokeDashoffset={30-jump*60} />
      <circle cx={pulseX} cy={350-Math.sin(jump*Math.PI)*75} r={16+settle*5} fill={accent} />
      <text x="255" y="135" fill={primary} fontFamily={REPLICA_THEME.fontFamily} fontSize="32" fontWeight="800" opacity={climax}>跨过距离，传到另一端</text>
    </>;
  } else if (sceneId === 'emit-send-out') {
    const pressure = clamp01((frame - 28) / 42);
    const burst = clamp01((frame - 74) / 34);
    content = <>
      <ellipse cx="420" cy="360" rx={105-pressure*24} ry={105-pressure*24} fill="#FFFFFF" stroke={primary} strokeWidth="9" />
      {[0,1,2,3,4,5].map(i=>{const a=i*Math.PI/3;return <line key={i} x1={420+Math.cos(a)*125} y1={360+Math.sin(a)*125} x2={420+Math.cos(a)*(125+burst*120)} y2={360+Math.sin(a)*(125+burst*120)} stroke={accent} strokeWidth="11" strokeLinecap="round" opacity={burst}/>;})}
      <path d={`M150 330 Q235 ${300+pressure*45} 310 350 Q235 ${400-pressure*45} 150 390Z`} fill="#FFFFFF" stroke={ink} strokeWidth="8" />
      <circle cx="420" cy="360" r={24+settle*8} fill={accent} opacity="0.85" />
      <text x="280" y="135" fill={accent} fontFamily={REPLICA_THEME.fontFamily} fontSize="32" fontWeight="800" opacity={climax}>从源头向外发出</text>
    </>;
  } else if (sceneId === 'admit-send-in') {
    const turn = clamp01((frame - 45) / 48);
    const angle = turn * 120;
    const tokenX = 170 + turn * 260;
    content = <>
      <circle cx="510" cy="350" r="42" fill="#FFFFFF" stroke={primary} strokeWidth="8" />
      {[0,1,2].map(i=>{const a=(angle+i*120)*Math.PI/180;return <line key={i} x1="510" y1="350" x2={510+Math.cos(a)*150} y2={350+Math.sin(a)*150} stroke={primary} strokeWidth="11" strokeLinecap="round"/>;})}
      <path d="M690 190 L690 510" stroke={ink} strokeWidth="10" strokeLinecap="round" />
      <rect x={tokenX-30} y="332" width="60" height="36" rx="18" fill={accent} />
      <text x="250" y="135" fill={primary} fontFamily={REPLICA_THEME.fontFamily} fontSize="32" fontWeight="800" opacity={climax}>让它进入边界里面</text>
    </>;
  } else if (sceneId === 'permit-send-through') {
    const press = clamp01((frame - 34) / 30);
    const open = clamp01((frame - 66) / 34);
    content = <>
      <path d="M135 470 L720 470" stroke={REPLICA_THEME.rule} strokeWidth="8" strokeLinecap="round" />
      <path d={`M430 470 L430 ${250-open*125}`} stroke={ink} strokeWidth="12" strokeLinecap="round" />
      <path d={`M430 ${250-open*125} L675 ${250-open*125}`} stroke={primary} strokeWidth="16" strokeLinecap="round" />
      <path d={`M250 310 C290 ${260+press*55} 330 ${360-press*55} 370 310`} fill="none" stroke={accent} strokeWidth="10" strokeLinecap="round" />
      <rect x="210" y={345-press*55} width="64" height="38" rx="19" fill={accent} />
      <text x="270" y="135" fill={accent} fontFamily={REPLICA_THEME.fontFamily} fontSize="32" fontWeight="800" opacity={climax}>许可一到，关卡放行</text>
    </>;
  } else if (sceneId === 'commit-send-over') {
    const push = clamp01((frame - 42) / 44);
    const lock = clamp01((frame - 88) / 20);
    content = <>
      <path d="M390 220 L680 220 L680 500 L390 500" fill="#FFFFFF" stroke={primary} strokeWidth="10" strokeLinejoin="round" />
      {[0,1,2,3].map(i=><path key={i} d={`M${430+i*58} 500 l28 -38 l28 38`} fill="none" stroke={ink} strokeWidth="7" strokeLinejoin="round" opacity={0.45+lock*0.45}/>)}
      <rect x={120+push*330} y="330" width="100" height="48" rx="24" fill={accent} />
      <path d={`M205 354 L${420+push*55} 354`} stroke={accent} strokeWidth="12" strokeLinecap="round" />
      <path d="M390 275 L430 315 M430 275 L390 315" stroke={red} strokeWidth="9" strokeLinecap="round" opacity={lock} />
      <text x="245" y="135" fill={primary} fontFamily={REPLICA_THEME.fontFamily} fontSize="32" fontWeight="800" opacity={climax}>正式交付，不能随便撤回</text>
    </>;
  } else if (sceneId === 'dismiss-send-away') {
    const compress = clamp01((frame - 28) / 35);
    const eject = clamp01((frame - 66) / 40);
    const folderX = 385 + eject * 330;
    content = <>
      <path d={`M120 355 C180 ${300+compress*55} 245 ${410-compress*55} 310 355`} fill="none" stroke={primary} strokeWidth="11" strokeLinecap="round" />
      <rect x={folderX} y={320-Math.sin(eject*Math.PI)*80} width="110" height="74" rx="10" fill="#FFFFFF" stroke={accent} strokeWidth="9" transform={`rotate(${eject*18} ${folderX+55} 357)`}/>
      <path d="M315 280 L315 430" stroke={ink} strokeWidth="12" strokeLinecap="round" />
      <path d="M630 250 l42 -28 M650 350 l56 0 M630 455 l42 28" stroke={accent} strokeWidth="8" strokeLinecap="round" opacity={eject}/>
      <text x="265" y="135" fill={accent} fontFamily={REPLICA_THEME.fontFamily} fontSize="32" fontWeight="800" opacity={climax}>从中心弹开，送走解散</text>
    </>;
  } else if (sceneId === 'mission-sent-task') {
    const count = clamp01((frame - 28) / 42);
    const launch = clamp01((frame - 72) / 42);
    const x = 245 + launch * 390;
    const y = 455 - launch * 235;
    content = <>
      <path d="M150 520 L430 520 L505 450" fill="none" stroke={primary} strokeWidth="11" strokeLinecap="round" />
      <path d="M515 455 Q650 355 720 205" fill="none" stroke={REPLICA_THEME.rule} strokeWidth="6" strokeDasharray="16 15" />
      <rect x={x-42} y={y-21} width="84" height="42" rx="21" fill={accent} transform={`rotate(${-30-launch*8} ${x} ${y})`}/>
      <circle cx="720" cy="205" r={44-count*8} fill="#FFFFFF" stroke={primary} strokeWidth="8" opacity={0.55+count*0.45}/>
      <path d="M180 310 A110 110 0 0 1 350 250" fill="none" stroke={accent} strokeWidth="9" strokeLinecap="round" strokeDasharray="1" pathLength="1" strokeDashoffset={1-count}/>
      <text x="245" y="135" fill={primary} fontFamily={REPLICA_THEME.fontFamily} fontSize="32" fontWeight="800" opacity={climax}>被派出去完成任务</text>
    </>;
  }

  return (
    <svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,width:'100%',height:'100%',zIndex:645,opacity,pointerEvents:'none'}}>
      <g transform={`translate(${groupX} 95)`}>{content}</g>
    </svg>
  );
};

const LegacyRootWatermark: React.FC<{root: string}> = ({root}) => (
  <div
    style={{
      position: 'absolute',
      right: 100,
      top: 250,
      width: 540,
      height: 400,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 0,
      fontFamily: REPLICA_THEME.fontFamily,
      fontSize: root.length > 12 ? 108 : root.length > 7 ? 150 : 220,
      fontWeight: 900,
      letterSpacing: 0,
      color: 'rgba(4,31,160,0.055)',
      borderLeft: `5px solid ${REPLICA_THEME.accent}`,
    }}
  >
    {root}
  </div>
);

const sceneEnvelope = (
  frame: number,
  scene: ReplicaScene,
  motion: ContinuousSceneMotion,
  humanized: boolean,
) => {
  const start = Math.round(scene.start * FPS);
  const end = Math.round((scene.start + scene.duration) * FPS);
  // Keep the outgoing scene visible after the narration boundary. This creates a true
  // 12-frame overlap without revealing the next keyword before its spoken scene begins.
  const enter = smoothEntrance(frame, start + 3, OVERLAP_FRAMES);
  // Hold the previous visual through the first four frames of the next narration
  // beat, then hand it off over 12 frames. This avoids a white flash at exact cuts.
  const exit = smoothExit(frame, end + 2, OVERLAP_FRAMES - 2);
  const vector = motionVector(motion);
  const opacity = clamp01(Math.min(enter, exit));
  const local = frame - start;
  // The old renderer kept every scene drifting from -3px to +3px. That reads
  // like a slideshow camera trying to hide stillness. Humanized motion comes
  // from the actual semantic action and layer keyframes instead.
  const flow = humanized
    ? 0
    : clamped(local, [0, Math.max(1, Math.round(scene.duration * FPS))], [-3, 3]);
  return {
    opacity,
    x: (1 - enter) * 24 * vector.x + (1 - exit) * -18 * vector.x + flow * vector.x,
    y: (1 - enter) * 18 * vector.y + (1 - exit) * -14 * vector.y + flow * vector.y,
  };
};

const ContinuousScene: React.FC<{
  scene: ReplicaScene;
  motion: ContinuousSceneMotion;
  plan?: ContinuousScenePlan;
  frame: number;
  dynamicAsset?: string;
  root: string;
  staticCardMode?: boolean;
  staticImageOpacity?: number;
  motionProfile?: ContinuousStageDefinition['motionProfile'];
  showRootWatermark?: boolean;
  semanticPropTrack?: ContinuousStageDefinition['semanticPropTrack'];
}> = ({
  scene,
  motion,
  plan,
  frame,
  dynamicAsset,
  root,
  staticCardMode = false,
  staticImageOpacity = 1,
  motionProfile = 'humanized',
  showRootWatermark = false,
  semanticPropTrack,
}) => {
  const start = Math.round(scene.start * FPS);
  const local = frame - start;
  const humanized = motionProfile !== 'legacy';
  const envelope = sceneEnvelope(frame, scene, motion, humanized);
  if (envelope.opacity <= 0) return null;
  const renderedFrame = Math.max(0, Math.min(local, holdFrame(scene)));
  const actionFrame = plan ? Math.round(plan.actionAt * FPS) : strongestActionFrame(scene);
  const chapterProgress = clamp01(local / Math.max(1, Math.round(scene.duration * FPS)));
  const cameraDirection =
    plan?.camera === 'left' ? -1 : plan?.camera === 'right' ? 1 : 0;
  const cameraX = staticCardMode
    ? 0
    : cameraDirection * clamped(chapterProgress, [0, 1], [-10, 10]);
  const cameraScale =
    staticCardMode
      ? 1
      : plan?.camera === 'in'
      ? clamped(chapterProgress, [0, 1], [0.99, 1.018])
      : plan?.camera === 'out'
        ? clamped(chapterProgress, [0, 1], [1.018, 0.99])
        : 1;
  const textOnlyLegacy =
    !plan &&
    scene.layers.every((layer) => layer.kind !== 'image') &&
    scene.layers.filter((layer) => layer.kind === 'text').length > 0 &&
    scene.layers.filter((layer) => layer.kind === 'text').length <= 5 &&
    !/summary|example|recap|outro/i.test(scene.id);

  return (
    <AbsoluteFill
      style={{
        opacity: envelope.opacity,
        transform: `translate3d(${(envelope.x + cameraX).toFixed(3)}px, ${envelope.y}px, 0) scale(${cameraScale.toFixed(5)})`,
        transformOrigin: '50% 50%',
      }}
    >
      {textOnlyLegacy && showRootWatermark ? <LegacyRootWatermark root={root} /> : null}
      {plan?.wordBuild ? <ArtPanel layout={plan.layout} /> : null}
      {scene.layers.map((layer, index) => {
        if (
          plan?.wordBuild?.layerId === layer.id &&
          layer.kind === 'text' &&
          renderedFrame >= Math.round(layer.from * FPS)
        ) {
          return <MorphWordBuild key={layer.id} layer={layer} plan={plan} frame={renderedFrame} />;
        }
        const layout = layoutTransform(plan, layer);
        const safeLayer = layerInSafeZone(plan, layer);
        const effectiveLayer =
          staticCardMode && safeLayer.kind === 'image'
            ? {
                ...safeLayer,
                opacity: (safeLayer.opacity ?? 1) * staticImageOpacity,
              }
            : safeLayer;
        const legacyDensity =
          humanized
            ? ''
            : !plan && layer.kind === 'image' && scene.layers.filter((candidate) => candidate.kind === 'image').length <= 2
              ? 'scale(1.14)'
              : textOnlyLegacy && layer.kind === 'text'
                ? 'scale(1.08)'
                : '';
        const semanticImageMotionEnabled = humanized || !staticCardMode;
        const semantic =
          semanticImageMotionEnabled &&
          layer.kind === 'image' &&
          (!plan?.imageLayerId || plan.imageLayerId === layer.id)
            ? semanticImageTransform({
                frame: renderedFrame,
                actionFrame,
                motion,
                plan: plan ? {...plan, imageScale: plan.imageScale ?? (plan.wordBuild ? 1.16 : 1)} : undefined,
                index,
              })
            : layer.kind === 'text' && plan
              ? semanticTextTransform({frame: renderedFrame, actionFrame, action: plan.action, index, layer})
              : layer.kind === 'text' && humanized
                ? humanizedTextTransform({frame: renderedFrame, actionFrame, motion, index})
                : '';
        if (dynamicAsset && effectiveLayer.kind === 'image') {
          return (
            <DynamicImageLayer
              key={layer.id}
              layer={effectiveLayer}
              asset={dynamicAsset}
              frame={renderedFrame}
              sceneDuration={scene.duration}
              transform={`${layout} ${semantic} ${legacyDensity}`.trim() || undefined}
            />
          );
        }
        return (
          <LayerRenderer
            key={layer.id}
            layer={effectiveLayer}
            frame={renderedFrame}
            sceneDuration={scene.duration}
            additionalTransform={`${layout} ${semantic} ${legacyDensity}`.trim() || undefined}
          />
        );
      })}
      {plan && semanticPropTrack === 'flect-flex' ? (
        <FlectFlexStoryOverlay
          sceneId={scene.id}
          frame={renderedFrame}
          durationInFrames={Math.round(scene.duration * FPS)}
          layout={plan.layout}
        />
      ) : null}
      {plan && semanticPropTrack === 'rupt' ? (
        <RuptureStoryOverlay
          sceneId={scene.id}
          frame={renderedFrame}
          durationInFrames={Math.round(scene.duration * FPS)}
          layout={plan.layout}
        />
      ) : null}
      {plan && semanticPropTrack === 'mit-miss' ? (
        <MitMissStoryOverlay
          sceneId={scene.id}
          frame={renderedFrame}
          durationInFrames={Math.round(scene.duration * FPS)}
          layout={plan.layout}
        />
      ) : null}
      {plan ? <SemanticOverlay frame={renderedFrame} actionFrame={actionFrame} plan={plan} /> : null}
    </AbsoluteFill>
  );
};

const PersistentRoot: React.FC<{
  definition: ContinuousStageDefinition;
  storyboard: ReplicaStoryboard;
  frame: number;
}> = ({definition, storyboard, frame}) => {
  if (definition.showChapterBadge !== true) return null;

  const activeIndex = Math.max(
    0,
    storyboard.scenes.findIndex((scene) =>
      frame < Math.round((scene.start + scene.duration) * FPS),
    ),
  );
  const scene = storyboard.scenes[activeIndex] ?? storyboard.scenes[storyboard.scenes.length - 1];
  const motion = definition.sceneMotion[scene.id] ?? 'still';
  const vector = motionVector(motion);
  const enter = smoothEntrance(frame, 4, 18);
  const nudge = clamped(frame - Math.round(scene.start * FPS), [0, 24], [0, 1]);
  const label = `${String(activeIndex + 1).padStart(2, '0')} / ${String(storyboard.scenes.length).padStart(2, '0')}`;

  return (
    <div
      style={{
        position: 'absolute',
        right: 84 + vector.x * 10 * nudge,
        top: 54 + vector.y * 8 * nudge,
        zIndex: 720,
        minWidth: 255,
        padding: '10px 18px 9px',
        borderRadius: 999,
        border: `2px solid ${REPLICA_THEME.rule}`,
        backgroundColor: 'rgba(255,255,255,0.9)',
        boxShadow: '0 8px 22px rgba(12, 46, 130, 0.06)',
        opacity: enter * 0.86,
        transform: `translateY(${(1 - enter) * -18}px)`,
        fontFamily: REPLICA_THEME.fontFamily,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{fontSize: 25, fontWeight: 840, color: REPLICA_THEME.accent}}>{definition.root}</span>
      <span style={{marginLeft: 10, fontSize: 20, fontWeight: 680, color: REPLICA_THEME.primary}}>{definition.meaning}</span>
      <span style={{marginLeft: 14, fontSize: 18, fontWeight: 650, color: REPLICA_THEME.muted}}>{label}</span>
    </div>
  );
};

const FlectFlexBoundaryThread: React.FC<{
  storyboard: ReplicaStoryboard;
  definition: ContinuousStageDefinition;
  frame: number;
}> = ({storyboard, definition, frame}) => {
  if (definition.semanticPropTrack !== 'flect-flex') return null;
  const wordScenes = storyboard.scenes.filter((scene) => definition.scenePlans?.[scene.id]?.wordBuild);
  const boundary = wordScenes
    .slice(0, -1)
    .map((scene, index) => ({
      at: Math.round((scene.start + scene.duration) * FPS),
      from: definition.scenePlans?.[scene.id]?.layout,
      to: definition.scenePlans?.[wordScenes[index + 1].id]?.layout,
    }))
    .find((item) => Math.abs(frame - item.at) <= 14);
  if (!boundary) return null;

  const local = frame - boundary.at;
  const progress = clamp01((local + 14) / 28);
  const opacity = Math.sin(progress * Math.PI) * 0.72;
  const startX = boundary.from === 'text-right' ? 420 : 1490;
  const endX = boundary.to === 'text-right' ? 420 : 1490;
  const midX = (startX + endX) / 2;
  const bend = startX === endX ? 110 : startX < endX ? -150 : 150;
  return (
    <svg
      viewBox="0 0 1920 1080"
      style={{position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 642, opacity, pointerEvents: 'none'}}
    >
      <path
        d={`M${startX} 520 C${midX - bend} 430 ${midX + bend} 610 ${endX} 520`}
        pathLength={1}
        fill="none"
        stroke={REPLICA_THEME.accent}
        strokeWidth={9}
        strokeLinecap="round"
        strokeDasharray={1}
        strokeDashoffset={1 - progress}
      />
      <circle cx={startX + (endX - startX) * progress} cy={520 - Math.sin(progress * Math.PI) * 55} r={10} fill={REPLICA_THEME.accent} />
    </svg>
  );
};

const MitMissBoundaryCapsule: React.FC<{
  storyboard: ReplicaStoryboard;
  definition: ContinuousStageDefinition;
  frame: number;
}> = ({storyboard, definition, frame}) => {
  if (definition.semanticPropTrack !== 'mit-miss') return null;
  const wordScenes = storyboard.scenes.filter((scene) => definition.scenePlans?.[scene.id]?.wordBuild);
  const boundary = wordScenes
    .slice(0, -1)
    .map((scene, index) => ({
      at: Math.round((scene.start + scene.duration) * FPS),
      from: definition.scenePlans?.[scene.id]?.layout,
      to: definition.scenePlans?.[wordScenes[index + 1].id]?.layout,
      index,
    }))
    .find((item) => Math.abs(frame - item.at) <= 14);
  if (!boundary) return null;

  const local = frame - boundary.at;
  const progress = clamp01((local + 14) / 28);
  const opacity = Math.sin(progress * Math.PI) * 0.8;
  const startX = boundary.from === 'text-right' ? 390 : 1510;
  const endX = boundary.to === 'text-right' ? 390 : 1510;
  const arc = startX === endX ? 135 : boundary.index % 2 === 0 ? -120 : 120;
  const x = startX + (endX - startX) * progress;
  const y = 520 - Math.sin(progress * Math.PI) * arc;
  const rotation = (endX >= startX ? 1 : -1) * progress * 55;
  return (
    <svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,width:'100%',height:'100%',zIndex:644,opacity,pointerEvents:'none'}}>
      <path
        d={`M${startX} 520 Q${(startX+endX)/2} ${520-arc*1.45} ${endX} 520`}
        fill="none"
        stroke={REPLICA_THEME.accent}
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray="15 14"
        strokeDashoffset={28-progress*56}
        opacity="0.55"
      />
      <rect x={x-34} y={y-18} width="68" height="36" rx="18" fill={REPLICA_THEME.accent} transform={`rotate(${rotation} ${x} ${y})`} />
      <circle cx={x-17} cy={y} r="4" fill="#FFFFFF" opacity="0.9" />
    </svg>
  );
};

export const GenericContinuousStage: React.FC<{
  storyboard: ReplicaStoryboard;
  definition: ContinuousStageDefinition;
}> = ({storyboard, definition}) => {
  const frame = useCurrentFrame();
  const semanticPropTrack =
    definition.motionProfile === 'legacy' || definition.showSemanticPropOverlay === true
      ? definition.semanticPropTrack
      : undefined;
  return (
    <AbsoluteFill style={{backgroundColor: 'transparent', overflow: 'hidden'}}>
      {storyboard.scenes.map((scene) => (
        <ContinuousScene
          key={scene.id}
          scene={scene}
          motion={definition.sceneMotion[scene.id] ?? 'still'}
          plan={definition.scenePlans?.[scene.id]}
          dynamicAsset={definition.dynamicAssets?.[scene.id]}
          frame={frame}
          root={definition.root}
          staticCardMode={definition.staticCardMode}
          staticImageOpacity={definition.staticImageOpacity}
          motionProfile={definition.motionProfile}
          showRootWatermark={definition.showRootWatermark}
          semanticPropTrack={semanticPropTrack}
        />
      ))}
      {semanticPropTrack === 'flect-flex' ? <FlectFlexBoundaryThread storyboard={storyboard} definition={definition} frame={frame} /> : null}
      {semanticPropTrack === 'mit-miss' ? <MitMissBoundaryCapsule storyboard={storyboard} definition={definition} frame={frame} /> : null}
      <PersistentRoot definition={definition} storyboard={storyboard} frame={frame} />
    </AbsoluteFill>
  );
};
