/**
 * 四六级方法类图文卡数据（写作、阅读、翻译等非词根栏目）。
 * 每个栏目在自己的 lesson 目录导出一个 MethodDeck，内容只取自本期已审核的讲稿与例句，不另编讲解。
 * 新的四六级栏目：在 src/<栏目>/xhs.ts 导出 deck，并加入 src/replica/xhs/methodDecks.ts 的清单。
 */
export type MethodStep = {
  /** Short step label, e.g. “第 1 步｜先圈主干”. */
  label: string;
  /** Main line of the card, Chinese or a short formula. */
  title: string;
  /** Optional English sentence or phrase shown in the example box. */
  english?: string;
  /** Optional supporting line (pattern, explanation, note). */
  detail?: string;
  art?: string;
};

export type MethodDeck = {
  slug: string;
  /** Delivery folder relative to the repository root, e.g. outputs/cet4-writing-paragraph-v2. */
  deliveryDir: string;
  series: string;
  examLabel: string;
  title: string;
  subtitle: string;
  heroArt: string;
  task: {label: string; text: string; question?: string; note?: string};
  /** A weak / literal / trap version shown before the method, when the lesson has one. */
  wrong?: {label: string; text: string; note?: string};
  steps: MethodStep[];
  checklist: string[];
  practice: {label: string; text: string; question?: string; hint?: string; art?: string};
  answer: {text: string; note?: string};
  /** Xiaohongshu title options, 20 characters or fewer. */
  noteTitles: string[];
  tags: string[];
};

export type MethodCardSpec =
  | {kind: 'cover'}
  | {kind: 'task'}
  | {kind: 'wrong'}
  | {kind: 'step'; index: number}
  | {kind: 'checklist'}
  | {kind: 'practice'}
  | {kind: 'answer'}
  | {kind: 'end'};

/** Carousel order: cover → task → (trap) → steps → one-page checklist → practice → answer → follow. */
export const methodCardSequence = (deck: MethodDeck): MethodCardSpec[] => [
  {kind: 'cover'},
  {kind: 'task'},
  ...(deck.wrong ? [{kind: 'wrong' as const}] : []),
  ...deck.steps.map((_, index) => ({kind: 'step' as const, index})),
  {kind: 'checklist'},
  {kind: 'practice'},
  {kind: 'answer'},
  {kind: 'end'},
];

export const methodDeckArt = (deck: MethodDeck) =>
  [...new Set([deck.heroArt, deck.practice.art, ...deck.steps.map((step) => step.art)].filter((art): art is string => Boolean(art)))];
