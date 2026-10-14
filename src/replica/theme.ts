import type {CSSProperties} from 'react';

/**
 * 全栏目统一配色（2026-10-14 用户确认，来自小红书图文卡）：暖白点阵纸、深蓝 + 橙、荧光黄重点、浅蓝插图底板。
 * 视频、竖屏、封面、小红书卡片、四六级课都用这一套；不要再改回纯白底。
 */
export const REPLICA_THEME = {
  background: '#FFFBF3',
  primary: '#041FA0',
  accent: '#E85810',
  ink: '#111111',
  muted: '#6673A7',
  rule: '#AAB2D4',
  fontFamily: '"Microsoft YaHei", "微软雅黑", Arial, sans-serif',
  exampleFontFamily: '"Microsoft YaHei", "微软雅黑", Consolas, monospace',
} as const;

export const PAPER = REPLICA_THEME.background;
export const PAPER_DOTS = '#EDE4D3';
export const HIGHLIGHTER = '#FFE36E';
export const SOFT_BLUE = '#EAF0FF';
export const SOFT_ORANGE = '#FFEEE2';
/** RGB of the paper, for render/cover verifiers that sample empty corners. */
export const PAPER_RGB = [0xff, 0xfb, 0xf3] as const;

/** 画布底：暖白纸 + 点阵（静止，不随时间移动）。 */
export const paperStyle = (dot = 36): CSSProperties => ({
  backgroundColor: PAPER,
  backgroundImage: `radial-gradient(${PAPER_DOTS} ${(dot / 16).toFixed(1)}px, transparent ${(dot / 16).toFixed(1)}px)`,
  backgroundSize: `${dot}px ${dot}px`,
});

/** 荧光笔：文字下半部的黄色色带，progress 控制从左到右划出。 */
export const highlighterStyle = (progress = 1): CSSProperties => ({
  backgroundImage: `linear-gradient(transparent 58%, ${HIGHLIGHTER} 58%, ${HIGHLIGHTER} 92%, transparent 92%)`,
  backgroundSize: `${Math.max(0, Math.min(1, progress)) * 100}% 100%`,
  backgroundRepeat: 'no-repeat',
});

export const REPLICA_CANVAS = {
  width: 1920,
  height: 1080,
  fps: 30,
  safeLeft: 88,
  safeRight: 88,
  safeTop: 54,
  captionBottom: 34,
} as const;

export type ReplicaColor =
  | 'primary'
  | 'accent'
  | 'ink'
  | 'muted'
  | 'rule'
  | 'white';

export const resolveReplicaColor = (color: ReplicaColor | string | undefined) => {
  if (!color) return REPLICA_THEME.primary;
  if (color === 'white') return '#FFFFFF';
  if (color in REPLICA_THEME) {
    return REPLICA_THEME[color as keyof typeof REPLICA_THEME];
  }
  return color;
};

export const PRESS_REPLICA_THEME = REPLICA_THEME;
export const PRESS_REPLICA_CANVAS = REPLICA_CANVAS;
export type PressReplicaColor = ReplicaColor;
