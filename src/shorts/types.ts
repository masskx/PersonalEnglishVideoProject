/**
 * 竖屏短视频（30–40 秒，抖音与小红书同一条视频）。一条短视频 = 一个钩子 + 正文节拍，一个交付文件夹。
 * 钩子类型按 HOOK_ROTATION 轮换（脚本库顺序 = 发布顺序）。标题里用 **双星号** 标出重点词，渲染成橙色 + 荧光色带。
 */
export type ShortBeatKind = 'hook' | 'mistake' | 'fix' | 'test' | 'answer' | 'cta';

/** 钩子类型轮换：挑战题 → 常见错误 → 反差对比 → 结果先行 → 回到挑战题……（第 i 条用 HOOK_ROTATION[i % 4]）。 */
export const HOOK_ROTATION = ['challenge', 'mistake', 'contrast', 'result'] as const;
export type HookType = (typeof HOOK_ROTATION)[number];

export type ShortBeat = {
  id: string;
  kind: ShortBeatKind;
  /** 旁白（中文为主，可夹英文例句）。 */
  voice: string;
  /** 大标题，可用 \n 换行、**重点**。 */
  headline: string;
  /** 来源期素材目录里的小黑插图（public/ 相对路径）。 */
  art?: string;
  /** 同一母版的 before / change / result：在本节拍内按顺序切换姿态（优先于 art）。 */
  arts?: string[];
  /** 旁白里说到的例句或要点卡：在 exampleAt（占旁白时长的比例，默认 0.4）时进场；两个空格后为灰色中文释义。 */
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
  /** 视频 ID = 交付文件夹名 outputs/shorts/<id>/。 */
  id: string;
  /** 素材来源期数：插图取自 public/assets/replica/<episode>/。 */
  episode: string;
  /** 内容分类，显示在画面顶部和封面上：四级词汇、六级作文、考研英语、词根…… */
  category: string;
  topic: string;
  hookType: HookType;
  hook: ShortBeat;
  body: ShortBeat[];
  /** 封面（抖音竖封面、抖音横封面、小红书封面共用内容）；默认取钩子标题与插图。 */
  cover?: {headline: string; art: string};
  publish: {
    /** 抖音标题（30 字内）。 */
    title: string;
    /** 小红书标题（20 字内）。 */
    xhsTitle: string;
    body: string;
    tags: string[];
    /** 置顶评论：公布答案 + 引导评论。 */
    pinnedComment: string;
  };
};

export type TimedShortBeat = ShortBeat & {from: number; frames: number; audioFrames: number; src: string};
export type ShortTimeline = {shortId: string; fps: number; totalFrames: number; beats: TimedShortBeat[]};
