/**
 * 抖音竖屏短视频（30–45 秒，主推格式）。一条短视频 = 两个钩子版本 A/B + 共用的正文节拍。
 * 标题里用 **双星号** 标出重点词，渲染成橙色 + 荧光色带。
 */
export type ShortBeatKind = 'hook' | 'mistake' | 'fix' | 'test' | 'answer' | 'cta';

export type ShortBeat = {
  id: string;
  kind: ShortBeatKind;
  /** 旁白（中文为主，可夹英文例句）。 */
  voice: string;
  /** 大标题，可用 \n 换行、**重点**。 */
  headline: string;
  /** 本期素材目录里的小黑插图（public/ 相对路径）。 */
  art?: string;
  /** 同一母版的 before / change / result：在本节拍内按顺序切换姿态（优先于 art）。 */
  arts?: string[];
  /** 旁白里说到的例句或要点卡：在 exampleAt（占旁白时长的比例，默认 0.4）时进场。 */
  example?: string;
  exampleAt?: number;
  /** mistake 节拍：错误写法（会被划掉）与正确写法。 */
  wrong?: string;
  right?: string;
  /** test 节拍：选项与正确项序号；pause 为旁白后的思考秒数（显示倒计时）。 */
  options?: string[];
  correct?: number;
  pause?: number;
  /** 旁白以英文为主时略放慢语速。 */
  english?: boolean;
};

export type ShortScript = {
  id: string;
  /** 素材来源期数：插图取自这期，成片放在 outputs/<episode>/douyin-shorts/。 */
  episode: string;
  topic: string;
  hooks: {A: ShortBeat; B: ShortBeat};
  body: ShortBeat[];
  publish: {
    titles: {A: string; B: string};
    body: string;
    tags: string[];
    /** 置顶评论：公布答案 + 引导评论。 */
    pinnedComment: string;
  };
};

export type ShortVariant = 'A' | 'B';

export type TimedShortBeat = ShortBeat & {from: number; frames: number; audioFrames: number; src: string};
export type ShortTimeline = {shortId: string; variant: ShortVariant; fps: number; totalFrames: number; beats: TimedShortBeat[]};
