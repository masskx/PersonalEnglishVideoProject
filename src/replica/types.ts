import type {ReplicaColor} from './theme';

export type ReplicaEnterMotion =
  | 'none'
  | 'fade'
  | 'smooth-rise'
  | 'smooth-reveal'
  | 'smooth-slide'
  | 'rise'
  | 'pop'
  | 'wipe-up'
  | 'slide-left'
  | 'slide-right'
  | 'typewriter'
  | 'draw';

export type ReplicaExitMotion = 'none' | 'fade' | 'shrink' | 'smooth-out';

export type ReplicaTextRun = {
  text: string;
  color?: ReplicaColor | string;
  weight?: number;
  size?: number;
};

export type ReplicaLayerBase = {
  id: string;
  kind: string;
  from: number;
  duration?: number;
  enter?: ReplicaEnterMotion;
  /** Values below 2 are seconds; larger values are treated as frames. */
  enterDuration?: number;
  exit?: ReplicaExitMotion;
  /** Values below 2 are seconds; larger values are treated as frames. */
  exitDuration?: number;
  x: number;
  y: number;
  width?: number;
  height?: number;
  zIndex?: number;
  rotate?: number;
};

export type ReplicaTextLayer = ReplicaLayerBase & {
  kind: 'text';
  /** Assemble existing colored morpheme runs without changing final text layout. */
  runMotion?: 'assemble';
  runs: ReplicaTextRun[];
  fontSize: number;
  fontWeight?: number;
  lineHeight?: number;
  align?: 'left' | 'center' | 'right';
  maxWidth?: number;
  typewriterCharsPerSec?: number;
  fontFamily?: 'main' | 'example';
  whiteSpace?: 'normal' | 'nowrap' | 'pre-line' | 'pre-wrap';
};

export type ReplicaImageLayer = ReplicaLayerBase & {
  kind: 'image';
  src: string;
  fit?: 'contain' | 'cover';
  objectPosition?: string;
  opacity?: number;
  /** Static crop control for artwork whose subject occupies too little of its source canvas. */
  contentScale?: number;
  contentTranslateX?: number;
  contentTranslateY?: number;
};

export type ReplicaArrowLayer = ReplicaLayerBase & {
  kind: 'arrow';
  path: string;
  viewBox: string;
  color?: ReplicaColor | string;
  strokeWidth?: number;
  dashed?: boolean;
  headSize?: number;
};

export type ReplicaIconName =
  | 'quote'
  | 'spark'
  | 'heart'
  | 'speech'
  | 'check'
  | 'impact'
  | 'newspaper'
  | 'printer'
  | 'book'
  | 'box';

export type ReplicaIconLayer = ReplicaLayerBase & {
  kind: 'icon';
  icon: ReplicaIconName;
  color?: ReplicaColor | string;
  secondaryColor?: ReplicaColor | string;
};

export type ReplicaTableRow = {
  word: string;
  phonetic?: string;
  part?: string;
  meaning: string;
  accent?: string;
};

export type ReplicaTableLayer = ReplicaLayerBase & {
  kind: 'table';
  rows: ReplicaTableRow[];
  columns?: 1 | 2;
  rowFromStep?: number;
  compact?: boolean;
  variant?: 'open' | 'boxed-dashed';
  partInMeaning?: boolean;
  meaningColor?: ReplicaColor | string;
  wordFontSize?: number;
  phoneticFontSize?: number;
  meaningFontSize?: number;
  wordColumnFraction?: number;
};

export type ReplicaRadialItem = {
  text: string;
  angle: number;
  color?: ReplicaColor | string;
};

export type ReplicaRadialLayer = ReplicaLayerBase & {
  kind: 'radial';
  center: ReplicaTextRun[];
  items: ReplicaRadialItem[];
  radiusX: number;
  radiusY: number;
};

export type ReplicaLayer =
  | ReplicaTextLayer
  | ReplicaImageLayer
  | ReplicaArrowLayer
  | ReplicaIconLayer
  | ReplicaTableLayer
  | ReplicaRadialLayer;

export type ReplicaCaptionCue = {
  from: number;
  to: number;
  text: string;
};

export type ReplicaSfxCue = {
  at: number;
  name: 'hit' | 'press' | 'stamp' | 'whoosh' | 'pop' | 'scribble';
  volume?: number;
};

export type ReplicaScene = {
  id: string;
  start: number;
  duration: number;
  narration: string;
  audio?: string;
  layers: ReplicaLayer[];
  captions: ReplicaCaptionCue[];
  sfx?: ReplicaSfxCue[];
  /** Whole-scene tail transition; keep the shared canvas white underneath. */
  transitionOut?: ReplicaSceneTransition;
};

export type ReplicaSceneTransition = {
  type: 'none' | 'white-fade' | 'swirl' | 'zoom';
  duration: number;
  strength?: number;
};

export type ReplicaStoryboard = {
  id: string;
  duration: number;
  fadeToBlackSec: number;
  /** Black overlay opacity at the final frame. Defaults to 1. */
  fadeEndOpacity?: number;
  scenes: ReplicaScene[];
};

export type PressReplicaScene = ReplicaScene;
export type PressReplicaStoryboard = ReplicaStoryboard;
