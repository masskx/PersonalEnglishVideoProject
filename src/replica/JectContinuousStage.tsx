import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {
  breathingScale,
  cameraDrift,
  clamp01,
  clampedInterpolate,
  directionalTransition,
  floatMotion,
  overshootSpring,
  smoothEntrance,
  smoothExit,
  softSpring,
  stagger,
} from './continuousMotion';
import {
  JECT_SUMMARY_ROWS,
  JECT_TIMELINE,
  JECT_WORD_SCENES,
  type WordScene,
} from './jectContinuousData';
import {REPLICA_THEME} from './theme';

const FPS = 30;
const TRANSITION_OVERLAP = 12;
const JECT_MOTION_ASSETS = {
  throwHook: 'assets/replica/ject-motion/frames/hook',
  directionMachine: 'assets/replica/ject-motion/frames/direction',
  projectForward: 'assets/replica/ject-motion/frames/project',
  injectInside: 'assets/replica/ject-motion/frames/inject',
  objectAgainst: 'assets/replica/ject-motion/frames/object',
  subjectUnder: 'assets/replica/ject-motion/frames/subject',
} as const;

const frameSource = (asset: string, index: number) =>
  staticFile(`${asset}/${String(index).padStart(6, '0')}.png`);

const loopMotionFrames = (localFrame: number) => {
  // Keep the generated motion at its native 30fps. The final 0.5s dissolves into the opening
  // 0.5s, then continues at frame 15, avoiding both slow-motion stutter and a hard 149→0 cut.
  const phase = ((Math.floor(localFrame) % 135) + 135) % 135;
  if (phase < 120) return {primary: phase + 15, secondary: null, mix: 0};
  return {primary: phase + 15, secondary: phase - 120, mix: (phase - 119) / 15};
};

const MotionFrameImage: React.FC<{
  asset: string;
  localFrame: number;
  style: React.CSSProperties;
}> = ({asset, localFrame, style}) => {
  const loop = loopMotionFrames(localFrame);
  const baseOpacity = typeof style.opacity === 'number' ? style.opacity : 1;
  return (
    <>
      <Img
        src={frameSource(asset, loop.primary)}
        style={{...style, opacity: baseOpacity * (1 - loop.mix)}}
      />
      {loop.secondary === null ? null : (
        <Img
          src={frameSource(asset, loop.secondary)}
          style={{...style, opacity: baseOpacity * loop.mix}}
        />
      )}
    </>
  );
};

const wordMotionAsset = (scene: WordScene) => {
  if (scene.direction === 'back') return JECT_MOTION_ASSETS.throwHook;
  if (scene.direction === 'forward') return JECT_MOTION_ASSETS.projectForward;
  if (scene.direction === 'inside') return JECT_MOTION_ASSETS.injectInside;
  if (scene.direction === 'opposite') return JECT_MOTION_ASSETS.objectAgainst;
  return JECT_MOTION_ASSETS.subjectUnder;
};

const SupportingXiaohei: React.FC<{
  from: number;
  duration: number;
  asset?: keyof typeof JECT_MOTION_ASSETS;
  left: number;
  top: number;
  width: number;
  height: number;
  opacity?: number;
  cropScale?: number;
}> = ({
  from,
  duration,
  asset = 'throwHook',
  left,
  top,
  width,
  height,
  opacity = 0.92,
  cropScale = 2.15,
}) => {
  const frame = useCurrentFrame();
  if (frame < from || frame >= from + duration) return null;
  return (
    <div style={{position: 'absolute', left, top, width, height, overflow: 'hidden', opacity}}>
      <MotionFrameImage
        asset={JECT_MOTION_ASSETS[asset]}
        localFrame={frame - from}
        style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', transform: `scale(${cropScale})`}}
      />
    </div>
  );
};

const stageEnvelope = (frame: number, start: number, duration: number, direction: -1 | 1 = 1) =>
  directionalTransition(frame, start, start + duration, direction, TRANSITION_OVERLAP);

const keyframed = (frame: number, input: readonly number[], output: readonly number[]) =>
  clampedInterpolate(frame, input, output);

const rootAnchor = (frame: number) => ({
  x: keyframed(
    frame,
    [0, 205, 250, 450, 505, 1940, 2010, 2240, 2310, 2560, 2630, 2870, 2930, 3149],
    [380, 380, 1320, 1320, 430, 430, 960, 960, 960, 960, 1650, 1650, 960, 960],
  ),
  y: keyframed(
    frame,
    [0, 205, 250, 450, 505, 1940, 2010, 2240, 2310, 2560, 2630, 2870, 2930, 3149],
    [210, 210, 350, 350, 145, 145, 92, 92, 440, 440, 90, 90, 82, 82],
  ),
  scale: keyframed(
    frame,
    [0, 205, 250, 450, 505, 1940, 2010, 2240, 2310, 2560, 2630, 2870, 2930, 3149],
    [1.45, 1.45, 1.08, 1.08, 1, 1, 0.62, 0.62, 0.92, 0.92, 0.5, 0.5, 0.58, 0.58],
  ),
});

const activeWordScene = (frame: number) =>
  JECT_WORD_SCENES.find(
    (scene) => frame >= scene.startFrame - TRANSITION_OVERLAP && frame < scene.startFrame + scene.durationInFrames + TRANSITION_OVERLAP,
  );

const PersistentRoot: React.FC<{frame: number}> = ({frame}) => {
  const anchor = rootAnchor(frame);
  const enter = softSpring(frame, 4, FPS, 26);
  const active = activeWordScene(frame);
  const pulse = active
    ? 1 + Math.max(0, 1 - Math.abs(frame - (active.startFrame + active.actionFrame)) / 12) * 0.028
    : 1;

  return (
    <div
      style={{
        position: 'absolute',
        left: anchor.x,
        top: anchor.y,
        zIndex: 30,
        opacity: enter,
        transform: `translate(-50%, -50%) scale(${anchor.scale * (0.97 + enter * 0.03) * pulse})`,
        transformOrigin: '50% 50%',
        color: REPLICA_THEME.accent,
        fontFamily: REPLICA_THEME.fontFamily,
        fontSize: 118,
        fontWeight: 820,
        lineHeight: 1,
        letterSpacing: 0,
        whiteSpace: 'nowrap',
      }}
    >
      {JECT_WORD_SCENES.map((scene) => {
        const handoffStart = scene.startFrame - 6;
        const handoffEnd = scene.startFrame + scene.durationInFrames - 6;
        const prefixIn = smoothEntrance(frame, handoffStart, 12);
        const prefixVisible = frame >= handoffStart && frame < handoffEnd;
        return (
          <span
            key={scene.id}
            style={{
              position: 'absolute',
              right: '100%',
              bottom: 0,
              color: REPLICA_THEME.primary,
              opacity: prefixVisible ? prefixIn : 0,
              transform: `translateX(${(1 - prefixIn) * 22}px)`,
            }}
          >
            {scene.prefix}
          </span>
        );
      })}
      ject
      <span
        style={{
          position: 'absolute',
          left: '3%',
          right: '3%',
          bottom: -16,
          height: 7,
          borderRadius: 999,
          backgroundColor: REPLICA_THEME.accent,
          transformOrigin: 'left center',
          transform: `scaleX(${smoothEntrance(frame, 12, 18)})`,
          opacity: 0.82,
        }}
      />
    </div>
  );
};

const HookChapter: React.FC<{frame: number}> = ({frame}) => {
  const motion = stageEnvelope(frame, 0, JECT_TIMELINE.hook.durationInFrames, 1);
  const artIn = softSpring(frame, 16, FPS, 26);

  return (
    <div style={{position: 'absolute', inset: 0, opacity: motion.opacity, transform: `translateX(${motion.x}px)`}}>
      <div style={{position: 'absolute', left: 170, top: 350, color: REPLICA_THEME.primary, fontSize: 74, fontWeight: 820}}>
        <span style={{opacity: smoothEntrance(frame, 20, 18)}}>= THROW</span>
        <div style={{marginTop: 34, fontSize: 54, opacity: smoothEntrance(frame, 38, 18)}}>投 · 扔 · 抛出去</div>
      </div>
      <MotionFrameImage
        asset={JECT_MOTION_ASSETS.throwHook}
        localFrame={frame}
        style={{
          position: 'absolute', left: 835, top: 115, width: 900, height: 650, objectFit: 'contain',
          opacity: artIn, transform: `translateY(${(1 - artIn) * 42 + floatMotion(frame, 4, 170)}px) scale(${0.95 + artIn * 0.05})`,
        }}
      />
      <div style={{position: 'absolute', left: 120, top: 760, fontSize: 32, color: REPLICA_THEME.muted, opacity: smoothEntrance(frame, 138, 18)}}>
        先记动作，再让前缀决定方向
      </div>
    </div>
  );
};

const DirectionChapter: React.FC<{frame: number}> = ({frame}) => {
  const {startFrame, durationInFrames} = JECT_TIMELINE.direction;
  const local = frame - startFrame;
  const motion = stageEnvelope(frame, startFrame, durationInFrames, -1);
  const prefixes = [
    ['re-', '回去'], ['pro-', '向前'], ['in-', '进去'], ['ob-', '对着'], ['sub-', '下面'],
  ] as const;

  return (
    <div style={{position: 'absolute', inset: 0, opacity: motion.opacity, transform: `translateX(${motion.x}px)`}}>
      <div style={{position: 'absolute', left: 125, top: 75, fontSize: 68, fontWeight: 820, color: REPLICA_THEME.primary}}>
        前缀 <span style={{color: REPLICA_THEME.accent}}>= 方向拨杆</span>
      </div>
        <MotionFrameImage
          asset={JECT_MOTION_ASSETS.directionMachine}
          localFrame={local}
          style={{
            position: 'absolute', left: 105, top: 180, width: 930, height: 610, objectFit: 'contain',
            opacity: softSpring(local, 6, FPS, 24),
            transform: `translateY(${floatMotion(frame, 4, 180)}px) scale(${breathingScale(frame, 0.006, 240)})`,
          }}
        />
      <div style={{position: 'absolute', left: 1050, top: 500, width: 700, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 18}}>
        {prefixes.map(([prefix, label], index) => {
          const p = softSpring(local, 42 + stagger(index, 6), FPS, 22);
          return (
            <div key={prefix} style={{
              width: 190, padding: '14px 18px', border: `3px solid ${index === Math.floor(clampedInterpolate(local, [80, 190], [0, 4])) ? REPLICA_THEME.accent : REPLICA_THEME.rule}`,
              borderRadius: 999, color: REPLICA_THEME.primary, fontSize: 31, fontWeight: 760, textAlign: 'center',
              opacity: p, transform: `translateY(${(1 - p) * 26}px) scale(${0.96 + p * 0.04})`, backgroundColor: '#FFFFFF',
            }}><span style={{color: REPLICA_THEME.accent}}>{prefix}</span> {label}</div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 1120, top: 720, width: 560, textAlign: 'center', color: REPLICA_THEME.primary, fontSize: 42, fontWeight: 720, opacity: smoothEntrance(local, 140, 18)}}>
        根不动，方向换，词义就连起来
      </div>
    </div>
  );
};

const WordChapter: React.FC<{scene: WordScene; frame: number; index: number}> = ({scene, frame, index}) => {
  const local = frame - scene.startFrame;
  const motion = stageEnvelope(frame, scene.startFrame, scene.durationInFrames, index % 2 === 0 ? 1 : -1);
  const art = softSpring(local, -10, FPS, 24);
  const actionCompression = Math.max(0, 1 - Math.abs(local - scene.actionFrame) / 12);
  const meaningIn = smoothEntrance(local, scene.actionFrame + 20, 18);
  const detailIn = smoothEntrance(local, scene.actionFrame + 64, 18);

  return (
    <div style={{position: 'absolute', inset: 0, opacity: motion.opacity, transform: `translateX(${motion.x}px)`}}>
      <div style={{position: 'absolute', left: 105, top: 265, width: 690}}>
        <div style={{fontSize: 43, fontWeight: 760, color: REPLICA_THEME.primary, opacity: smoothEntrance(local, 0, 16)}}>
          <span style={{color: REPLICA_THEME.accent}}>{scene.prefix}-</span> = {scene.prefixMeaning}
        </div>
        <div style={{height: 6, width: 610, marginTop: 24, borderRadius: 99, backgroundColor: REPLICA_THEME.rule, overflow: 'hidden'}}>
          <div style={{height: '100%', backgroundColor: REPLICA_THEME.accent, transformOrigin: 'left center', transform: `scaleX(${smoothEntrance(local, 10, 22)})`}} />
        </div>
        <div style={{marginTop: 82, fontSize: 60, lineHeight: 1.3, fontWeight: 820, color: REPLICA_THEME.accent, opacity: meaningIn, transform: `translateY(${(1 - meaningIn) * 26}px)`}}>
          {scene.meaning}
        </div>
        <div style={{marginTop: 42, maxWidth: 650, fontSize: 36, lineHeight: 1.55, fontWeight: 620, color: REPLICA_THEME.primary, opacity: detailIn, transform: `translateY(${(1 - detailIn) * 22}px)`}}>
          {scene.detail}
        </div>
      </div>
        <MotionFrameImage
          asset={wordMotionAsset(scene)}
          localFrame={local}
          style={{
            position: 'absolute', left: 820, top: 120, width: 960, height: 690, objectFit: 'contain',
            opacity: art,
            transform: `${scene.direction === 'back' ? 'scaleX(-1) ' : ''}translateY(${(1 - art) * 46 + floatMotion(frame, 4, 180, index * 23)}px) scaleX(${1 - actionCompression * 0.012}) scaleY(${1 + actionCompression * 0.008})`,
          }}
        />
      <div style={{position: 'absolute', right: 132, top: 730, padding: '10px 20px', borderRadius: 999, color: REPLICA_THEME.muted, fontSize: 27, fontWeight: 650, opacity: smoothEntrance(local, scene.actionFrame + 92, 18)}}>
        {scene.direction === 'back' ? '接近 → 碰撞 → 弹回' : scene.direction === 'forward' ? '蓄力 → 投射 → 前进' : scene.direction === 'inside' ? '外部 → 边界 → 内部' : scene.direction === 'opposite' ? '前进 → 阻挡 → 回弹' : '上层 → 压下 → 置于下方'}
      </div>
    </div>
  );
};

const WordProgressRail: React.FC<{frame: number}> = ({frame}) => {
  const visible = smoothEntrance(frame, 520, 20) * smoothExit(frame, 2250, 22);
  return (
    <div style={{position: 'absolute', left: 210, right: 210, top: 835, height: 76, display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 40, opacity: visible}}>
      <div style={{position: 'absolute', left: 32, right: 32, top: 37, height: 3, backgroundColor: REPLICA_THEME.rule, opacity: 0.4}} />
      {JECT_WORD_SCENES.map((scene) => {
        const handoffStart = scene.startFrame - 6;
        const handoffEnd = scene.startFrame + scene.durationInFrames - 6;
        const isActive = frame >= handoffStart && frame < handoffEnd;
        const isDone = frame >= handoffEnd;
        return (
          <div key={scene.id} style={{position: 'relative', minWidth: 210, padding: '12px 18px', borderRadius: 999, textAlign: 'center', backgroundColor: '#FFFFFF', border: `3px solid ${isActive ? REPLICA_THEME.accent : REPLICA_THEME.rule}`, color: isActive ? REPLICA_THEME.primary : REPLICA_THEME.muted, fontSize: 29, fontWeight: isActive ? 820 : 650, opacity: isActive ? 1 : isDone ? 0.68 : 0.38, transform: `scale(${isActive ? 1.03 : 1})`}}>
            <span style={{color: isActive ? REPLICA_THEME.primary : REPLICA_THEME.muted}}>{scene.prefix}</span><span style={{color: REPLICA_THEME.accent}}>ject</span>
          </div>
        );
      })}
    </div>
  );
};

const StressChapter: React.FC<{frame: number}> = ({frame}) => {
  const {startFrame, durationInFrames} = JECT_TIMELINE.stress;
  const local = frame - startFrame;
  const motion = stageEnvelope(frame, startFrame, durationInFrames, 1);
  const rows = [
    {word: 'object', noun: ['OB', 'ject', '/ˈɒbdʒɪkt/'], verb: ['ob', 'JECT', '/əbˈdʒekt/']},
    {word: 'subject', noun: ['SUB', 'ject', '/ˈsʌbdʒɪkt/'], verb: ['sub', 'JECT', '/səbˈdʒekt/']},
  ] as const;
  return (
    <div style={{position: 'absolute', inset: 0, opacity: motion.opacity, transform: `translateX(${motion.x}px)`}}>
      <SupportingXiaohei from={startFrame} duration={durationInFrames} asset="throwHook" left={1400} top={610} width={430} height={240} opacity={0.9} cropScale={1.8} />
      <div style={{position: 'absolute', top: 150, left: 250, right: 250, textAlign: 'center', color: REPLICA_THEME.primary, fontSize: 62, fontWeight: 820}}>词根没变，<span style={{color: REPLICA_THEME.accent}}>重音</span>换位置</div>
      <div style={{position: 'absolute', left: 150, right: 150, top: 300, display: 'grid', gap: 34}}>
        {rows.map((row, rowIndex) => {
          const p = softSpring(local, 28 + rowIndex * 78, FPS, 24);
          const travel = smoothEntrance(local, 70 + rowIndex * 78, 24);
          return (
            <div key={row.word} style={{height: 180, display: 'grid', gridTemplateColumns: '1fr 180px 1fr', alignItems: 'center', borderBottom: `2px solid ${REPLICA_THEME.rule}`, opacity: p, transform: `translateY(${(1 - p) * 38}px)`}}>
              <div style={{textAlign: 'center', fontSize: 48, fontWeight: 760, color: REPLICA_THEME.primary}}>n. <span style={{color: REPLICA_THEME.accent}}>{row.noun[0]}</span>{row.noun[1]} <span style={{fontSize: 30, color: REPLICA_THEME.muted}}>{row.noun[2]}</span></div>
              <div style={{position: 'relative', height: 70}}>
                <div style={{position: 'absolute', left: 10, right: 10, top: 34, height: 4, backgroundColor: REPLICA_THEME.rule}} />
                <div style={{position: 'absolute', left: 10, top: 27, width: 18, height: 18, borderRadius: '50%', backgroundColor: REPLICA_THEME.accent, transform: `translateX(${travel * 142}px)`}} />
              </div>
              <div style={{textAlign: 'center', fontSize: 48, fontWeight: 760, color: REPLICA_THEME.primary}}>v. {row.verb[0]}<span style={{color: REPLICA_THEME.accent}}>{row.verb[1]}</span> <span style={{fontSize: 30, color: REPLICA_THEME.muted}}>{row.verb[2]}</span></div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', top: 775, left: 0, right: 0, textAlign: 'center', color: REPLICA_THEME.muted, fontSize: 32, fontWeight: 650, opacity: smoothEntrance(local, 190, 18)}}>名词重音靠前，动词重音向后移动</div>
    </div>
  );
};

const PrefixMapChapter: React.FC<{frame: number}> = ({frame}) => {
  const {startFrame, durationInFrames} = JECT_TIMELINE.map;
  const local = frame - startFrame;
  const motion = stageEnvelope(frame, startFrame, durationInFrames, -1);
  const nodes = [
    {label: 're-  回去', x: 370, y: 430}, {label: 'pro-  向前', x: 1540, y: 430},
    {label: 'in-  进去', x: 1260, y: 220}, {label: 'ob-  对着', x: 730, y: 710},
    {label: 'sub-  下面', x: 1320, y: 710},
  ] as const;
  return (
    <div style={{position: 'absolute', inset: 0, opacity: motion.opacity, transform: `translateX(${motion.x}px)`}}>
      <SupportingXiaohei from={startFrame} duration={durationInFrames} asset="throwHook" left={30} top={570} width={520} height={290} opacity={0.9} />
      <div style={{position: 'absolute', top: 52, left: 0, right: 0, textAlign: 'center', color: REPLICA_THEME.primary, fontSize: 62, fontWeight: 820}}>五个方向，一张 <span style={{color: REPLICA_THEME.accent}}>ject 地图</span></div>
      <svg viewBox="0 0 1920 1080" width="1920" height="1080" style={{position: 'absolute', inset: 0}} aria-hidden>
        {nodes.map((node, index) => {
          const draw = smoothEntrance(local, 34 + stagger(index, 6), 22);
          return <path key={node.label} d={`M960 470 Q${(960 + node.x) / 2} ${(470 + node.y) / 2 - 34} ${node.x} ${node.y}`} fill="none" stroke={index === Math.floor(clampedInterpolate(local, [80, 220], [0, 4])) ? REPLICA_THEME.accent : REPLICA_THEME.primary} strokeWidth="5" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} opacity={0.75} />;
        })}
      </svg>
      {nodes.map((node, index) => {
        const p = overshootSpring(local, 52 + stagger(index, 7), FPS, 24);
        return <div key={node.label} style={{position: 'absolute', left: node.x, top: node.y, transform: `translate(-50%, -50%) scale(${0.96 + clamp01(p) * 0.04})`, opacity: clamp01(p), padding: '14px 24px', borderRadius: 999, border: `3px solid ${REPLICA_THEME.rule}`, backgroundColor: '#FFFFFF', color: REPLICA_THEME.primary, fontSize: 35, fontWeight: 760}}>{node.label}</div>;
      })}
      <div style={{position: 'absolute', left: 0, right: 0, top: 570, textAlign: 'center', fontSize: 38, color: REPLICA_THEME.primary, fontWeight: 720, opacity: smoothEntrance(local, 135, 18)}}>同一个“投”，因为方向不同，长成五个词义</div>
    </div>
  );
};

const ExamplesChapter: React.FC<{frame: number}> = ({frame}) => {
  const {startFrame, durationInFrames} = JECT_TIMELINE.examples;
  const local = frame - startFrame;
  const motion = stageEnvelope(frame, startFrame, durationInFrames, 1);
  const translations = ['他们拒绝了提议。', '我们启动了新项目。', '护士注入了药液。', '我反对这个计划。', '历史是我最喜欢的学科。'];
  return (
    <div style={{position: 'absolute', inset: 0, opacity: motion.opacity, transform: `translateX(${motion.x}px)`}}>
      <SupportingXiaohei from={startFrame} duration={durationInFrames} asset="throwHook" left={1425} top={245} width={470} height={265} opacity={0.9} />
      <div style={{position: 'absolute', top: 62, left: 145, color: REPLICA_THEME.primary, fontSize: 62, fontWeight: 820}}>把方向放回 <span style={{color: REPLICA_THEME.accent}}>句子</span></div>
      <div style={{position: 'absolute', left: 145, top: 165, width: 1280, display: 'grid', gap: 12}}>
        {JECT_WORD_SCENES.map((scene, index) => {
          const p = softSpring(local, -6 + stagger(index, 34), FPS, 22);
          const keywordIndex = scene.example.toLowerCase().indexOf(scene.word);
          const prefix = keywordIndex >= 0 ? scene.example.slice(0, keywordIndex) : '';
          const keyword = keywordIndex >= 0 ? scene.example.slice(keywordIndex, keywordIndex + scene.word.length + (scene.word === 'reject' || scene.word === 'inject' ? 2 : 0)) : scene.word;
          const suffix = keywordIndex >= 0 ? scene.example.slice(keywordIndex + keyword.length) : scene.example;
          return (
            <div key={scene.id} style={{minHeight: 112, display: 'grid', gridTemplateColumns: '52px 1.45fr 0.95fr', alignItems: 'center', gap: 18, padding: '0 20px', borderBottom: `2px solid ${REPLICA_THEME.rule}`, opacity: p, transform: `translateX(${(1 - p) * 44}px)`}}>
              <div style={{fontSize: 28, color: REPLICA_THEME.accent, fontWeight: 820}}>{String(index + 1).padStart(2, '0')}</div>
              <div style={{fontSize: 36, color: REPLICA_THEME.primary, fontWeight: 700}}>{prefix}<span style={{color: REPLICA_THEME.accent, fontWeight: 820}}>{keyword}</span>{suffix}</div>
              <div style={{fontSize: 29, color: REPLICA_THEME.muted, fontWeight: 620}}>{translations[index]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SummaryChapter: React.FC<{frame: number}> = ({frame}) => {
  const {startFrame, durationInFrames} = JECT_TIMELINE.summary;
  const local = frame - startFrame;
  const enter = smoothEntrance(frame, startFrame - TRANSITION_OVERLAP, TRANSITION_OVERLAP + 4);
  const motion = {opacity: enter, x: (1 - enter) * -42};
  return (
    <div style={{position: 'absolute', inset: 0, opacity: motion.opacity, transform: `translateX(${motion.x}px)`}}>
      <SupportingXiaohei from={startFrame} duration={durationInFrames} asset="throwHook" left={1430} top={245} width={465} height={265} opacity={0.9} />
      <div style={{position: 'absolute', top: 135, left: 0, right: 0, textAlign: 'center', color: REPLICA_THEME.primary, fontSize: 42, fontWeight: 720}}>投 / 扔 · 前缀决定方向</div>
      <div style={{position: 'absolute', left: 180, right: 515, top: 225, display: 'grid'}}>
        {JECT_SUMMARY_ROWS.map((row, index) => {
          const p = softSpring(local, -6 + stagger(index, 13), FPS, 20);
          return (
            <div key={row.word} style={{height: 112, display: 'grid', gridTemplateColumns: '245px 135px 165px 1fr', alignItems: 'center', borderBottom: `2px solid ${REPLICA_THEME.rule}`, opacity: p, transform: `translateY(${(1 - p) * 24}px)`}}>
              <div style={{fontSize: 39, fontWeight: 820, color: REPLICA_THEME.primary}}>{row.word.slice(0, -4)}<span style={{color: REPLICA_THEME.accent}}>ject</span></div>
              <div style={{fontSize: 29, color: REPLICA_THEME.accent, fontWeight: 760}}>{row.prefix}</div>
              <div style={{fontSize: 29, color: REPLICA_THEME.primary, fontWeight: 700}}>{row.direction}</div>
              <div style={{fontSize: 29, color: REPLICA_THEME.ink, fontWeight: 620}}>{row.meaning}</div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', top: 820, left: 0, right: 0, textAlign: 'center', color: REPLICA_THEME.primary, fontSize: 34, fontWeight: 700, opacity: smoothEntrance(local, 105, 18)}}>看见 ject，先想“投”；再看前缀，把方向补完整。</div>
      <div style={{position: 'absolute', left: 570, right: 570, top: 885, height: 5, borderRadius: 99, backgroundColor: REPLICA_THEME.rule, overflow: 'hidden', opacity: smoothEntrance(local, 110, 18)}}>
        <div style={{width: '100%', height: '100%', backgroundColor: REPLICA_THEME.accent, transformOrigin: 'left center', transform: `scaleX(${clampedInterpolate(local, [110, Math.max(111, durationInFrames - 22)], [0, 1])})`}} />
      </div>
    </div>
  );
};

export const JectContinuousStage: React.FC = () => {
  const frame = useCurrentFrame();
  const driftStrength = keyframed(
    frame,
    [0, 480, 510, 1970, 2010, 2240, 2280, 2600, 2640, 3149],
    [0.5, 0.5, 0.62, 0.62, 0.12, 0.12, 0.18, 0.18, 0, 0],
  );
  const drift = cameraDrift(frame, 0, driftStrength);
  const projectScene = JECT_WORD_SCENES[1];
  const projectFollow = frame >= projectScene.startFrame && frame < projectScene.startFrame + projectScene.durationInFrames
    ? clampedInterpolate(frame - projectScene.startFrame, [55, 165], [0, -18])
    : 0;
  const mapScale = keyframed(frame, [0, 2260, 2320, 2560, 2620, 3149], [1, 1, 0.98, 0.98, 1, 1]);

  return (
    <AbsoluteFill style={{backgroundColor: 'transparent', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: -28, transform: `translate3d(${drift.x + projectFollow}px, ${drift.y}px, 0) scale(${drift.scale * mapScale})`, transformOrigin: '50% 50%'}}>
        <HookChapter frame={frame} />
        <DirectionChapter frame={frame} />
        {JECT_WORD_SCENES.map((scene, index) => <WordChapter key={scene.id} scene={scene} frame={frame} index={index} />)}
        <StressChapter frame={frame} />
        <PrefixMapChapter frame={frame} />
        <ExamplesChapter frame={frame} />
        <SummaryChapter frame={frame} />
        <PersistentRoot frame={frame} />
        <WordProgressRail frame={frame} />
      </div>
    </AbsoluteFill>
  );
};
