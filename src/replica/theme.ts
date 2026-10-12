export const REPLICA_THEME = {
  background: '#FFFFFF',
  primary: '#041FA0',
  accent: '#E85810',
  ink: '#111111',
  muted: '#6673A7',
  rule: '#AAB2D4',
  fontFamily: '"Microsoft YaHei", "微软雅黑", Arial, sans-serif',
  exampleFontFamily: '"Microsoft YaHei", "微软雅黑", Consolas, monospace',
} as const;

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
