import {JECT_REPLICA_ASSETS} from './jectStoryboard';

export type JectDirection = 'back' | 'forward' | 'inside' | 'opposite' | 'under';

export type WordScene = {
  id: string;
  word: string;
  prefix: string;
  root: 'ject';
  prefixMeaning: string;
  meaning: string;
  detail: string;
  direction: JectDirection;
  startFrame: number;
  durationInFrames: number;
  actionFrame: number;
  image: string;
  example: string;
};

export const JECT_TIMELINE = {
  hook: {startFrame: 0, durationInFrames: 240},
  direction: {startFrame: 240, durationInFrames: 255},
  stress: {startFrame: 1995, durationInFrames: 285},
  map: {startFrame: 2280, durationInFrames: 330},
  examples: {startFrame: 2610, durationInFrames: 300},
  summary: {startFrame: 2910, durationInFrames: 240},
  totalFrames: 3150,
} as const;

export const JECT_WORD_SCENES: readonly WordScene[] = [
  {
    id: 'reject-throw-back',
    word: 'reject',
    prefix: 're',
    root: 'ject',
    prefixMeaning: 'back · 往回',
    meaning: '拒绝；驳回',
    detail: '先接近，再碰撞，最后原路弹回',
    direction: 'back',
    startFrame: 495,
    durationInFrames: 285,
    actionFrame: 96,
    image: JECT_REPLICA_ASSETS.rejectReturn,
    example: 'They rejected the proposal.',
  },
  {
    id: 'project-throw-forward',
    word: 'project',
    prefix: 'pro',
    root: 'ject',
    prefixMeaning: 'forward · 向前',
    meaning: 'n. 项目；计划  /  v. 投射；放映',
    detail: '从后方蓄力，把想法或光线送向前方',
    direction: 'forward',
    startFrame: 780,
    durationInFrames: 300,
    actionFrame: 81,
    image: JECT_REPLICA_ASSETS.projectForward,
    example: 'We launched a new project.',
  },
  {
    id: 'inject-throw-in',
    word: 'inject',
    prefix: 'in',
    root: 'ject',
    prefixMeaning: 'into · 里面',
    meaning: '注射；注入',
    detail: '跨过容器边界，把药液或能量送入内部',
    direction: 'inside',
    startFrame: 1080,
    durationInFrames: 285,
    actionFrame: 80,
    image: JECT_REPLICA_ASSETS.injectInside,
    example: 'The nurse injected the medicine.',
  },
  {
    id: 'object-throw-against',
    word: 'object',
    prefix: 'ob',
    root: 'ject',
    prefixMeaning: 'against · 对着',
    meaning: 'n. 物体；对象  /  v. 反对',
    detail: '运动路径的对面出现阻挡，碰撞后阻尼回弹',
    direction: 'opposite',
    startFrame: 1365,
    durationInFrames: 315,
    actionFrame: 87,
    image: JECT_REPLICA_ASSETS.objectAgainst,
    example: 'I object to the plan.',
  },
  {
    id: 'subject-throw-under',
    word: 'subject',
    prefix: 'sub',
    root: 'ject',
    prefixMeaning: 'under · 下面',
    meaning: 'n. 主题；学科  /  v. 使遭受；使服从',
    detail: '主体留在下层，上方结构缓慢压下并形成覆盖',
    direction: 'under',
    startFrame: 1680,
    durationInFrames: 315,
    actionFrame: 83,
    image: JECT_REPLICA_ASSETS.subjectUnder,
    example: 'History is my favorite subject.',
  },
] as const;

export const JECT_SUMMARY_ROWS = JECT_WORD_SCENES.map((scene) => ({
  word: scene.word,
  prefix: `${scene.prefix}-`,
  direction: scene.prefixMeaning.split(' · ')[1],
  meaning: scene.meaning,
}));

