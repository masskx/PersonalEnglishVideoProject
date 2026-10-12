import type {CSSProperties, ReactNode} from 'react';
import {smoothProgress, morphemeMotion} from './smoothMotion';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {
  PRESS_REPLICA_CANVAS,
  PRESS_REPLICA_THEME,
  resolveReplicaColor,
} from './theme';
import type {
  ReplicaArrowLayer,
  ReplicaCaptionCue,
  ReplicaEnterMotion,
  ReplicaIconLayer,
  ReplicaIconName,
  ReplicaImageLayer,
  ReplicaLayer,
  ReplicaRadialLayer,
  ReplicaScene,
  ReplicaTableLayer,
  ReplicaTableRow,
  ReplicaTextLayer,
  ReplicaTextRun,
} from './types';

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const progress = (frame: number, from: number, duration: number) =>
  clamp((frame - from) / Math.max(1, duration));
const easeOutCubic = (value: number) => 1 - (1 - clamp(value)) ** 3;
const easeOutBack = (value: number) => {
  const t = clamp(value) - 1;
  const overshoot = 1.42;
  return 1 + (overshoot + 1) * t ** 3 + overshoot * t ** 2;
};
const durationFrames = (
  value: number | undefined,
  fallback: number,
  fps: number,
  min: number,
  max: number,
) => {
  const raw = value ?? fallback;
  const frames = raw > 0 && raw < 2 ? raw * fps : raw;
  return Math.round(clamp(frames, min, max));
};

const clampEnterFrames = (value: number | undefined, fallback: number, fps: number) =>
  durationFrames(value, fallback, fps, 8, 18);
const clampExitFrames = (value: number | undefined, fps: number) =>
  durationFrames(value, 8, fps, 6, 10);

const defaultEnterDuration = (motion: ReplicaEnterMotion | undefined) => {
  switch (motion) {
    case 'fade':
      return 10;
    case 'rise':
      return 14;
    case 'smooth-rise':
    case 'smooth-reveal':
    case 'smooth-slide':
      return 16;
    case 'pop':
      return 16;
    case 'wipe-up':
      return 14;
    case 'slide-left':
    case 'slide-right':
      return 15;
    case 'draw':
      return 18;
    case 'typewriter':
      return 10;
    default:
      return 8;
  }
};

type LifeCycle = {
  opacity: number;
  transform: string;
  clipPath?: string;
};

const getLifeCycle = ({
  frame,
  startFrame,
  endFrame,
  enter,
  enterDuration,
  exit,
  exitDuration,
  fps,
  rotate = 0,
}: {
  frame: number;
  startFrame: number;
  endFrame?: number;
  enter: ReplicaEnterMotion | undefined;
  enterDuration: number | undefined;
  exit: ReplicaLayer['exit'];
  exitDuration: number | undefined;
  fps: number;
  rotate?: number;
}): LifeCycle => {
  const enterFrames = clampEnterFrames(enterDuration, defaultEnterDuration(enter), fps);
  const enterRaw = progress(frame, startFrame, enterFrames);
  const enterEase = easeOutCubic(enterRaw);
  let opacity = 1;
  let x = 0;
  let y = 0;
  let scale = 1;
  let clipPath: string | undefined;

  switch (enter ?? 'rise') {
    case 'smooth-rise':
    case 'smooth-reveal':
    case 'smooth-slide': {
      const smooth = smoothProgress(frame, startFrame, enterFrames);
      opacity = smoothProgress(frame, startFrame, enterFrames * 0.7);
      if (enter === 'smooth-slide') x = 24 * (1 - smooth);
      else y = 16 * (1 - smooth);
      if (enter === 'smooth-reveal') clipPath = `inset(0 -3% ${100 * (1 - smooth)}% -3%)`;
      break;
    }
    case 'none':
      break;
    case 'fade':
      opacity = enterEase;
      break;
    case 'rise':
      opacity = enterEase;
      y = interpolate(enterEase, [0, 1], [22, 0]);
      break;
    case 'pop':
      opacity = enterEase;
      scale = interpolate(easeOutBack(enterRaw), [0, 1], [0.72, 1]);
      break;
    case 'wipe-up':
      opacity = enterRaw;
      clipPath = `inset(${interpolate(enterEase, [0, 1], [100, 0])}% 0 0 0)`;
      break;
    case 'slide-left':
      opacity = enterEase;
      x = interpolate(enterEase, [0, 1], [34, 0]);
      break;
    case 'slide-right':
      opacity = enterEase;
      x = interpolate(enterEase, [0, 1], [-34, 0]);
      break;
    case 'typewriter':
    case 'draw':
      opacity = enterEase;
      break;
  }

  if (endFrame !== undefined && exit && exit !== 'none') {
    const exitFrames = clampExitFrames(exitDuration, fps);
    const exitRaw = progress(frame, endFrame - exitFrames, exitFrames);
    const remaining = 1 - (exit === 'smooth-out' ? smoothProgress(frame, endFrame - exitFrames, exitFrames - 1) : easeOutCubic(exitRaw));
    opacity *= remaining;
    if (exit === 'smooth-out') y -= 10 * (1 - remaining);
    if (exit === 'shrink') {
      scale *= interpolate(remaining, [0, 1], [0.86, 1]);
    }
  }

  return {
    opacity,
    transform: `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(${scale})`,
    clipPath,
  };
};

const fontFor = (fontFamily: ReplicaTextLayer['fontFamily']) =>
  fontFamily === 'example'
    ? PRESS_REPLICA_THEME.exampleFontFamily
    : PRESS_REPLICA_THEME.fontFamily;

const runStyle = (run: ReplicaTextRun, defaultSize: number, defaultWeight: number): CSSProperties => ({
  color: resolveReplicaColor(run.color),
  fontSize: run.size ?? defaultSize,
  fontWeight: run.weight ?? defaultWeight,
  letterSpacing: 0,
});

const StyledRuns = ({
  runs,
  defaultSize,
  defaultWeight,
  characterLimit,
}: {
  runs: ReplicaTextRun[];
  defaultSize: number;
  defaultWeight: number;
  characterLimit?: number;
}) => {
  let charactersLeft = characterLimit ?? Number.POSITIVE_INFINITY;
  return (
    <>
      {runs.map((run, index) => {
        const visibleText = run.text.slice(0, Math.max(0, charactersLeft));
        charactersLeft -= run.text.length;
        return (
          <span key={`${index}-${run.text}`} style={runStyle(run, defaultSize, defaultWeight)}>
            {visibleText}
          </span>
        );
      })}
    </>
  );
};

const TextLayerView = ({
  layer,
  localFrame,
  fps,
}: {
  layer: ReplicaTextLayer;
  localFrame: number;
  fps: number;
}) => {
  const defaultWeight = layer.fontWeight ?? 700;
  const sharedStyle: CSSProperties = {
    display: 'block',
    width: '100%',
    color: PRESS_REPLICA_THEME.primary,
    fontFamily: fontFor(layer.fontFamily),
    fontSize: layer.fontSize,
    fontWeight: defaultWeight,
    lineHeight: layer.lineHeight ?? 1.25,
    letterSpacing: 0,
    textAlign: layer.align ?? 'left',
    whiteSpace: layer.whiteSpace ?? 'pre-wrap',
    overflowWrap: 'break-word',
  };

  if (layer.runMotion === 'assemble') {
    return <div style={sharedStyle}>{layer.runs.filter(run => run.text.length > 0).map((run, index) =>
      <span key={index} style={{...runStyle(run, layer.fontSize, defaultWeight), display: 'inline-block', ...morphemeMotion(localFrame, index, fps)}}>{run.text}</span>
    )}</div>;
  }

  if (layer.enter !== 'typewriter') {
    return (
      <div style={sharedStyle}>
        <StyledRuns runs={layer.runs} defaultSize={layer.fontSize} defaultWeight={defaultWeight} />
      </div>
    );
  }

  const totalCharacters = layer.runs.reduce((sum, run) => sum + run.text.length, 0);
  const typedCharacters = Math.min(
    totalCharacters,
    Math.max(0, Math.floor((localFrame / fps) * (layer.typewriterCharsPerSec ?? 20))),
  );

  // The invisible complete line owns layout so center/right aligned copy never shifts while typing.
  return (
    <div style={{...sharedStyle, position: 'relative'}}>
      <span aria-hidden style={{visibility: 'hidden'}}>
        <StyledRuns runs={layer.runs} defaultSize={layer.fontSize} defaultWeight={defaultWeight} />
      </span>
      <span
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          textAlign: layer.align ?? 'left',
          whiteSpace: layer.whiteSpace ?? 'pre-wrap',
        }}
      >
        <StyledRuns
          runs={layer.runs}
          defaultSize={layer.fontSize}
          defaultWeight={defaultWeight}
          characterLimit={typedCharacters}
        />
      </span>
    </div>
  );
};

const resolveImageSource = (src: string) => {
  if (/^(?:https?:|data:|blob:)/i.test(src) || src.startsWith('/')) return src;
  return staticFile(src.replace(/^\\+/, '').replace(/\\/g, '/'));
};

const ImageLayerView = ({layer}: {layer: ReplicaImageLayer}) => (
  <Img
    src={resolveImageSource(layer.src)}
    style={{
      display: 'block',
      width: '100%',
      height: '100%',
      objectFit: layer.fit ?? 'contain',
      objectPosition: layer.objectPosition ?? 'center',
      opacity: layer.opacity ?? 1,
      transform: `translate3d(${layer.contentTranslateX ?? 0}px, ${layer.contentTranslateY ?? 0}px, 0) scale(${layer.contentScale ?? 1})`,
      transformOrigin: '50% 50%',
      letterSpacing: 0,
    }}
  />
);

const ArrowLayerView = ({
  layer,
  localFrame,
  fps,
}: {
  layer: ReplicaArrowLayer;
  localFrame: number;
  fps: number;
}) => {
  const color = resolveReplicaColor(layer.color);
  const drawFrames = clampEnterFrames(layer.enterDuration, 18, fps);
  const drawProgress = layer.enter === 'draw' ? easeOutCubic(progress(localFrame, 0, drawFrames)) : 1;
  const arrowHeadProgress = easeOutCubic(progress(drawProgress, 0.78, 0.22));
  const markerId = `replica-arrow-${layer.id.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
  const revealId = `${markerId}-reveal`;
  const strokeWidth = layer.strokeWidth ?? 7;

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={layer.viewBox}
      preserveAspectRatio="none"
      aria-hidden
      style={{display: 'block', overflow: 'visible'}}
    >
      <defs>
        <mask id={revealId} maskUnits="userSpaceOnUse">
          <rect x="-20%" y="-20%" width="140%" height="140%" fill="#000000" />
          <path
            d={layer.path}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={strokeWidth * 2.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - drawProgress}
          />
        </mask>
        <marker
          id={markerId}
          markerWidth={layer.headSize ?? Math.max(18, strokeWidth * 3)}
          markerHeight={layer.headSize ?? Math.max(18, strokeWidth * 3)}
          refX="9"
          refY="5"
          orient="auto"
          markerUnits="userSpaceOnUse"
          viewBox="0 0 10 10"
        >
          <path
            d="M 0 0 L 10 5 L 0 10 Q 3 5 0 0 Z"
            fill={color}
            opacity={arrowHeadProgress}
          />
        </marker>
      </defs>
      <g mask={`url(#${revealId})`}>
        <path
          d={layer.path}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth + 2}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.16}
          transform="translate(1.5 1)"
          pathLength={1}
          strokeDasharray={layer.dashed ? '0.05 0.026' : undefined}
        />
        <path
          d={layer.path}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={layer.dashed ? '0.05 0.026' : undefined}
        />
      </g>
      <path
        d={layer.path}
        fill="none"
        stroke="transparent"
        strokeWidth={Math.max(1, strokeWidth / 3)}
        markerEnd={`url(#${markerId})`}
      />
    </svg>
  );
};

const IconSvg = ({
  icon,
  color,
  secondary,
}: {
  icon: ReplicaIconName;
  color: string;
  secondary: string;
}) => {
  const common = {
    fill: 'none',
    stroke: color,
    strokeWidth: 5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  const art: Record<ReplicaIconName, ReactNode> = {
    quote: (
      <>
        <path d="M18 31 C18 18 28 12 40 12 C31 19 30 27 32 34 C42 36 47 43 47 54 C47 67 38 76 26 76 C15 76 8 67 8 56 C8 46 12 38 18 31 Z" fill={secondary} opacity={0.92} />
        <path d="M61 31 C61 18 71 12 83 12 C74 19 73 27 75 34 C85 36 90 43 90 54 C90 67 81 76 69 76 C58 76 51 67 51 56 C51 46 55 38 61 31 Z" fill={color} opacity={0.92} />
        <path d="M76 84 L79 90 L85 93 L79 96 L76 102 L73 96 L67 93 L73 90 Z" fill={secondary} transform="translate(0 -9)" />
      </>
    ),
    spark: (
      <>
        <path d="M50 7 C54 28 63 41 86 48 C63 55 54 68 50 91 C46 68 37 55 14 48 C37 41 46 28 50 7 Z" fill={secondary} stroke={color} strokeWidth="4" strokeLinejoin="round" />
        <path d="M79 9 L82 19 L92 22 L82 25 L79 35 L76 25 L66 22 L76 19 Z" fill={color} />
      </>
    ),
    heart: (
      <>
        <path d="M50 88 C38 78 15 63 11 43 C8 27 18 15 32 15 C41 15 47 20 50 27 C54 20 60 15 69 15 C83 15 93 27 90 43 C86 63 63 78 50 88 Z" fill={secondary} stroke={color} strokeWidth="5" strokeLinejoin="round" />
        <path d="M26 35 C29 28 35 26 41 29" {...common} stroke="#FFFFFF" strokeWidth="4" />
      </>
    ),
    speech: (
      <>
        <path d="M12 18 H88 V67 H52 L35 83 L37 67 H12 Z" {...common} fill="#FFFFFF" />
        <circle cx="31" cy="43" r="5" fill={secondary} />
        <circle cx="50" cy="43" r="5" fill={secondary} />
        <circle cx="69" cy="43" r="5" fill={secondary} />
        <path d="M82 10 L86 2 M89 16 L98 13" {...common} stroke={secondary} strokeWidth="4" />
      </>
    ),
    check: (
      <>
        <path d="M18 50 L39 72 L82 22" {...common} strokeWidth="10" />
        <path d="M79 51 L83 62 L94 66 L83 70 L79 81 L75 70 L64 66 L75 62 Z" fill={secondary} />
      </>
    ),
    impact: (
      <>
        <path d="M50 4 L59 28 L82 17 L73 40 L97 48 L73 57 L84 81 L59 71 L50 96 L41 71 L17 83 L27 58 L3 50 L27 41 L16 18 L41 28 Z" fill={secondary} stroke={color} strokeWidth="4" strokeLinejoin="round" />
        <path d="M50 29 L50 57 M50 71 L50 74" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
      </>
    ),
    newspaper: (
      <>
        <path d="M16 12 H79 V25 H89 V86 H16 Z" {...common} fill="#FFFFFF" />
        <path d="M79 25 V74 C79 82 82 86 89 86" {...common} />
        <path d="M27 25 H66" {...common} stroke={secondary} strokeWidth="8" />
        <rect x="27" y="40" width="20" height="17" fill={secondary} />
        <path d="M55 42 H68 M55 54 H68 M27 67 H68 M27 77 H64" {...common} strokeWidth="4" />
      </>
    ),
    printer: (
      <>
        <path d="M29 8 H72 V35 H29 Z" {...common} fill="#FFFFFF" />
        <path d="M17 32 H84 C89 32 92 37 92 43 V73 H75 V91 H25 V73 H8 V43 C8 37 12 32 17 32 Z" {...common} fill="#FFFFFF" />
        <path d="M25 64 H75 V91 H25 Z" {...common} fill="#FFFFFF" />
        <path d="M36 75 H65 M36 84 H59" {...common} strokeWidth="4" />
        <circle cx="77" cy="48" r="5" fill={secondary} />
      </>
    ),
    book: (
      <>
        <path d="M8 20 C24 16 39 20 50 30 V86 C38 76 24 73 8 77 Z" {...common} fill="#FFFFFF" />
        <path d="M92 20 C76 16 61 20 50 30 V86 C62 76 76 73 92 77 Z" {...common} fill="#FFFFFF" />
        <path d="M50 31 V84" {...common} />
        <path d="M19 35 C29 33 38 36 43 40 M19 49 C29 47 38 50 43 54 M81 35 C71 33 62 36 57 40 M81 49 C71 47 62 50 57 54" {...common} stroke={secondary} strokeWidth="3.5" />
      </>
    ),
    box: (
      <>
        <path d="M11 29 L50 9 L89 29 L50 50 Z" {...common} fill="#FFFFFF" />
        <path d="M11 29 V72 L50 93 V50 Z" {...common} fill="#FFFFFF" />
        <path d="M89 29 V72 L50 93 V50 Z" {...common} fill="#FFFFFF" />
        <path d="M31 19 L70 40 V59" {...common} stroke={secondary} />
        <path d="M70 40 L89 30" {...common} stroke={secondary} />
        <path d="M71 70 L80 65" {...common} strokeWidth="4" />
      </>
    ),
  };

  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" aria-hidden style={{display: 'block', overflow: 'visible'}}>
      {art[icon]}
    </svg>
  );
};

const IconLayerView = ({layer}: {layer: ReplicaIconLayer}) => (
  <IconSvg
    icon={layer.icon}
    color={resolveReplicaColor(layer.color)}
    secondary={resolveReplicaColor(layer.secondaryColor ?? 'accent')}
  />
);

const AccentWord = ({row}: {row: ReplicaTableRow}) => {
  if (!row.accent) return <>{row.word}</>;
  const index = row.word.toLocaleLowerCase().indexOf(row.accent.toLocaleLowerCase());
  if (index < 0) return <>{row.word}</>;
  return (
    <>
      {row.word.slice(0, index)}
      <span style={{color: PRESS_REPLICA_THEME.accent}}>
        {row.word.slice(index, index + row.accent.length)}
      </span>
      {row.word.slice(index + row.accent.length)}
    </>
  );
};

const TableLayerView = ({
  layer,
  localFrame,
  fps,
}: {
  layer: ReplicaTableLayer;
  localFrame: number;
  fps: number;
}) => {
  const columns = layer.columns ?? 2;
  const rawRowStep = layer.rowFromStep ?? 5;
  const rowStep = rawRowStep > 0 && rawRowStep < 2 ? rawRowStep * fps : rawRowStep;
  const visualRows = Math.max(1, Math.ceil(layer.rows.length / columns));
  const rowHeight = `${100 / visualRows}%`;
  const boxed = layer.variant === 'boxed-dashed';
  const open = layer.variant === 'open';
  const wordFraction = layer.wordColumnFraction ?? (layer.compact ? 0.9 : 1);
  const meaningFraction = layer.compact ? 1.2 : 1.25;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gridAutoRows: rowHeight,
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        border: boxed ? `3px solid ${PRESS_REPLICA_THEME.primary}` : undefined,
        borderTop: boxed || open ? undefined : `3px solid ${PRESS_REPLICA_THEME.primary}`,
        borderBottom: boxed || open ? undefined : `3px solid ${PRESS_REPLICA_THEME.primary}`,
        backgroundColor: '#FFFFFF',
        fontFamily: PRESS_REPLICA_THEME.fontFamily,
        letterSpacing: 0,
      }}
    >
      {layer.rows.map((row, index) => {
        const itemProgress = easeOutCubic(progress(localFrame, index * rowStep, 10));
        const isRightColumn = columns === 2 && index % 2 === 1;
        const visualRow = Math.floor(index / columns);
        return (
          <div
            key={`${row.word}-${index}`}
            style={{
              minWidth: 0,
              boxSizing: 'border-box',
              display: 'grid',
              gridTemplateColumns: `${wordFraction}fr ${meaningFraction}fr`,
              alignItems: 'center',
              columnGap: boxed ? 0 : layer.compact ? 20 : 30,
              padding: boxed ? 0 : layer.compact ? '10px 24px' : '16px 30px',
              borderLeft: isRightColumn && !open
                ? `${boxed ? 2 : 2}px ${boxed ? 'dashed' : 'solid'} ${boxed ? PRESS_REPLICA_THEME.primary : PRESS_REPLICA_THEME.rule}`
                : undefined,
              borderBottom:
                !open && visualRow < visualRows - 1
                  ? `${boxed ? 2 : 1.5}px ${boxed ? 'dashed' : 'solid'} ${boxed ? PRESS_REPLICA_THEME.primary : PRESS_REPLICA_THEME.rule}`
                  : undefined,
              opacity: itemProgress,
              transform: `translateY(${interpolate(itemProgress, [0, 1], [13, 0])}px)`,
              letterSpacing: 0,
            }}
          >
            <div
              style={{
                minWidth: 0,
                alignSelf: 'stretch',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: boxed ? '10px 20px' : undefined,
                borderRight: boxed ? `2px dashed ${PRESS_REPLICA_THEME.primary}` : undefined,
              }}
            >
              <div
                style={{
                  color: PRESS_REPLICA_THEME.primary,
                  fontSize: layer.wordFontSize ?? (layer.compact ? 33 : 40),
                  fontWeight: 800,
                  lineHeight: 1.08,
                  letterSpacing: 0,
                  whiteSpace: 'nowrap',
                }}
              >
                <AccentWord row={row} />
              </div>
              {(row.phonetic || (row.part && !layer.partInMeaning)) && (
                <div
                  style={{
                    color: PRESS_REPLICA_THEME.muted,
                    fontSize: layer.phoneticFontSize ?? (layer.compact ? 20 : 23),
                    fontWeight: 500,
                    lineHeight: 1.3,
                    letterSpacing: 0,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {[row.phonetic, layer.partInMeaning ? undefined : row.part]
                    .filter(Boolean)
                    .join('  ')}
                </div>
              )}
            </div>
            <div
              style={{
                minWidth: 0,
                alignSelf: 'stretch',
                display: 'flex',
                alignItems: 'center',
                padding: boxed ? '10px 22px' : undefined,
                color: resolveReplicaColor(layer.meaningColor ?? 'ink'),
                fontSize: layer.meaningFontSize ?? (layer.compact ? 25 : 29),
                fontWeight: 600,
                lineHeight: 1.28,
                letterSpacing: 0,
                overflowWrap: 'break-word',
              }}
            >
              {layer.partInMeaning && row.part ? `${row.part} ${row.meaning}` : row.meaning}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const RadialLayerView = ({
  layer,
  localFrame,
}: {
  layer: ReplicaRadialLayer;
  localFrame: number;
}) => {
  const width = layer.width ?? 900;
  const height = layer.height ?? 500;
  const centerX = width / 2;
  const centerY = height / 2;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        fontFamily: PRESS_REPLICA_THEME.fontFamily,
        letterSpacing: 0,
      }}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        aria-hidden
        style={{position: 'absolute', inset: 0, overflow: 'visible'}}
      >
        {layer.items.map((item, index) => {
          const radians = (item.angle * Math.PI) / 180;
          const itemX = centerX + Math.cos(radians) * layer.radiusX;
          const itemY = centerY + Math.sin(radians) * layer.radiusY;
          const lineProgress = easeOutCubic(progress(localFrame, 5 + index * 4, 14));
          const bend = index % 2 === 0 ? -16 : 16;
          const path = `M ${centerX} ${centerY} Q ${(centerX + itemX) / 2 + bend} ${(centerY + itemY) / 2 - bend} ${itemX} ${itemY}`;
          return (
            <path
              key={`connector-${item.text}-${index}`}
              d={path}
              fill="none"
              stroke={resolveReplicaColor(item.color ?? 'rule')}
              strokeWidth="3.5"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - lineProgress}
            />
          );
        })}
      </svg>

      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          color: PRESS_REPLICA_THEME.primary,
          fontSize: 62,
          fontWeight: 800,
          lineHeight: 1.1,
          textAlign: 'center',
          whiteSpace: 'nowrap',
          letterSpacing: 0,
        }}
      >
        <StyledRuns runs={layer.center} defaultSize={62} defaultWeight={800} />
      </div>

      {layer.items.map((item, index) => {
        const radians = (item.angle * Math.PI) / 180;
        const left = centerX + Math.cos(radians) * layer.radiusX;
        const top = centerY + Math.sin(radians) * layer.radiusY;
        const itemProgress = easeOutBack(progress(localFrame, 12 + index * 4, 14));
        return (
          <div
            key={`${item.text}-${index}`}
            style={{
              position: 'absolute',
              left,
              top,
              transform: `translate(-50%, -50%) scale(${interpolate(itemProgress, [0, 1], [0.78, 1])})`,
              opacity: clamp(itemProgress),
              color: resolveReplicaColor(item.color ?? 'primary'),
              backgroundColor: '#FFFFFF',
              padding: '4px 12px',
              fontSize: 34,
              fontWeight: 700,
              lineHeight: 1.2,
              textAlign: 'center',
              whiteSpace: 'nowrap',
              letterSpacing: 0,
            }}
          >
            {item.text}
          </div>
        );
      })}
    </div>
  );
};

export type LayerRendererProps = {
  layer: ReplicaLayer;
  /** Scene-local frame. Defaults to Remotion's current frame. */
  frame?: number;
  /** Layer `from` and `duration` use seconds in the storyboard. */
  sceneDuration?: number;
  fps?: number;
  /** Optional deterministic stage motion composed before the layer lifecycle transform. */
  additionalTransform?: string;
};

export const LayerRenderer = ({
  layer,
  frame: frameOverride,
  sceneDuration,
  fps = PRESS_REPLICA_CANVAS.fps,
  additionalTransform,
}: LayerRendererProps) => {
  const currentFrame = useCurrentFrame();
  const frame = frameOverride ?? currentFrame;
  const startFrame = Math.round(layer.from * fps);
  const durationSeconds = layer.duration ?? Math.max(0, (sceneDuration ?? layer.from + 9999) - layer.from);
  const durationFrames = Math.max(1, Math.round(durationSeconds * fps));
  const endFrame = startFrame + durationFrames;

  if (frame < startFrame || frame >= endFrame) return null;

  const lifeCycle = getLifeCycle({
    frame,
    startFrame,
    endFrame,
    enter: layer.enter,
    enterDuration: layer.enterDuration,
    exit: layer.exit,
    exitDuration: layer.exitDuration,
    fps,
    rotate: layer.rotate,
  });
  const localFrame = frame - startFrame;
  const width = layer.width ?? (layer.kind === 'text' ? layer.maxWidth : undefined);
  const defaultDimensions =
    layer.kind === 'icon'
      ? {width: width ?? 90, height: layer.height ?? 90}
      : layer.kind === 'arrow'
        ? {width: width ?? 330, height: layer.height ?? 160}
        : layer.kind === 'radial'
          ? {width: width ?? 900, height: layer.height ?? 520}
          : layer.kind === 'table'
            ? {width: width ?? 1500, height: layer.height ?? 430}
            : {width, height: layer.height};

  const content = (() => {
    switch (layer.kind) {
      case 'text':
        return <TextLayerView layer={layer} localFrame={localFrame} fps={fps} />;
      case 'image':
        return <ImageLayerView layer={layer} />;
      case 'arrow':
        return <ArrowLayerView layer={layer} localFrame={localFrame} fps={fps} />;
      case 'icon':
        return <IconLayerView layer={layer} />;
      case 'table':
        return <TableLayerView layer={layer} localFrame={localFrame} fps={fps} />;
      case 'radial':
        return <RadialLayerView layer={layer} localFrame={localFrame} />;
    }
  })();

  return (
    <div
      data-replica-layer={layer.id}
      style={{
        position: 'absolute',
        left: layer.x,
        top: layer.y,
        width: defaultDimensions.width,
        height: defaultDimensions.height,
        zIndex: layer.zIndex ?? 1,
        opacity: lifeCycle.opacity,
        transform: `${additionalTransform ?? ''} ${lifeCycle.transform}`.trim(),
        transformOrigin: '50% 50%',
        clipPath: lifeCycle.clipPath,
        color: PRESS_REPLICA_THEME.primary,
        fontFamily: PRESS_REPLICA_THEME.fontFamily,
        letterSpacing: 0,
      }}
    >
      {content}
    </div>
  );
};

export type ReplicaLayerRendererProps = {
  layers: ReplicaLayer[];
  /** Scene duration in seconds. */
  sceneDuration: number;
};

export const ReplicaLayerRenderer = ({layers, sceneDuration}: ReplicaLayerRendererProps) => (
  <AbsoluteFill
    style={{
      backgroundColor: '#FFFFFF',
      color: PRESS_REPLICA_THEME.primary,
      fontFamily: PRESS_REPLICA_THEME.fontFamily,
      letterSpacing: 0,
      overflow: 'hidden',
    }}
  >
    {layers.map((layer) => (
      <LayerRenderer key={layer.id} layer={layer} sceneDuration={sceneDuration} />
    ))}
  </AbsoluteFill>
);

/** Apply a sampled whole-scene tail transition while the outer canvas stays white. */
export const ReplicaSceneTransition: React.FC<{
  scene: ReplicaScene;
  children: ReactNode;
}> = ({scene, children}) => {
  const frame = useCurrentFrame();
  const transition = scene.transitionOut;
  if (!transition || transition.type === 'none' || transition.duration <= 0) {
    return <>{children}</>;
  }

  const fps = PRESS_REPLICA_CANVAS.fps;
  const totalFrames = Math.max(1, Math.round(scene.duration * fps));
  const transitionFrames = Math.max(1, Math.round(transition.duration * fps));
  const startFrame = Math.max(0, totalFrames - transitionFrames);
  const t = easeOutCubic(progress(frame, startFrame, transitionFrames));
  const strength = transition.strength ?? 1;
  let opacity = 1;
  let transform = 'none';
  let filter = 'none';

  if (transition.type === 'white-fade') {
    opacity = 1 - t;
  } else if (transition.type === 'zoom') {
    opacity = 1 - t;
    transform = `scale(${interpolate(t, [0, 1], [1, 1 + 0.42 * strength])})`;
    filter = `blur(${interpolate(t, [0, 1], [0, 5 * strength])}px)`;
  } else if (transition.type === 'swirl') {
    opacity = 1 - t;
    const scale = interpolate(t, [0, 1], [1, Math.max(0.04, 0.18 - 0.06 * strength)]);
    const rotate = interpolate(t, [0, 1], [0, 180 * strength]);
    transform = `rotate(${rotate}deg) scale(${scale})`;
    filter = `blur(${interpolate(t, [0, 1], [0, 3 * strength])}px)`;
  }

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform,
        transformOrigin: '50% 50%',
        filter,
        backgroundColor: '#FFFFFF',
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export type CaptionRendererProps = {
  cue: ReplicaCaptionCue;
  frame?: number;
  fps?: number;
};

export const CaptionRenderer = ({
  cue,
  frame: frameOverride,
  fps = PRESS_REPLICA_CANVAS.fps,
}: CaptionRendererProps) => {
  const currentFrame = useCurrentFrame();
  const frame = frameOverride ?? currentFrame;
  const fromFrame = Math.round(cue.from * fps);
  const toFrame = Math.round(cue.to * fps);
  if (frame < fromFrame || frame >= toFrame) return null;

  const enter = easeOutCubic(progress(frame, fromFrame, 8));
  const exit = 1 - easeOutCubic(progress(frame, toFrame - 6, 6));

  return (
    <div
      style={{
        position: 'absolute',
        left: PRESS_REPLICA_CANVAS.safeLeft,
        right: PRESS_REPLICA_CANVAS.safeRight,
        bottom: PRESS_REPLICA_CANVAS.captionBottom,
        zIndex: 900,
        opacity: enter * exit,
        transform: `translateY(${interpolate(enter, [0, 1], [10, 0])}px)`,
        color: PRESS_REPLICA_THEME.primary,
        backgroundColor: 'transparent',
        fontFamily: PRESS_REPLICA_THEME.fontFamily,
        fontSize: 38,
        fontWeight: 600,
        lineHeight: 1.45,
        letterSpacing: 0,
        textAlign: 'center',
        whiteSpace: 'pre-wrap',
        overflowWrap: 'break-word',
      }}
    >
      {cue.text}
    </div>
  );
};

export type CaptionTrackProps = {
  cues: ReplicaCaptionCue[];
};

export const CaptionTrack = ({cues}: CaptionTrackProps) => {
  const frame = useCurrentFrame();
  return (
    <>
      {cues.map((cue, index) => (
        <CaptionRenderer key={`${cue.from}-${cue.to}-${index}`} cue={cue} frame={frame} />
      ))}
    </>
  );
};

export const ReplicaCanvas = ({children}: {children?: ReactNode}) => (
  <AbsoluteFill
    style={{
      backgroundColor: '#FFFFFF',
      color: PRESS_REPLICA_THEME.primary,
      fontFamily: PRESS_REPLICA_THEME.fontFamily,
      letterSpacing: 0,
      overflow: 'hidden',
    }}
  >
    {children}
  </AbsoluteFill>
);
