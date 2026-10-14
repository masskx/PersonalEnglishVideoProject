export const CET6_WRITING_ID = 'cet6-writing-concession';

const art = (name: string) => `assets/replica/${CET6_WRITING_ID}/${name}.png`;
export const writingArt = {
  hook: art('hook-scale'),
  concede: art('concede-nod'),
  turn: art('turn-arrow'),
  support: art('support-blocks'),
  practice: art('practice-write'),
} as const;

/** 原创六级风格题目与例句（未冒充真题）。 */
export const text = {
  prompt: 'Some people think college students should take part-time jobs, while others believe they should focus on their studies. Write an essay to state your view.',
  weak: 'Part-time jobs are good for students. They can earn money and gain experience. So students should take part-time jobs.',
  concede: 'It is true that a part-time job may take time away from study.',
  turn: 'However, a well-chosen job can teach students to manage their time better.',
  support: 'For example, a student who tutors twice a week has to plan revision in advance, and this habit helps when exams come.',
  concedePhrases: ['It is true that …', 'Admittedly, …', 'Some may argue that …'],
  turnPhrases: ['However, …', 'Even so, …', 'But this does not mean that …'],
  practicePrompt: 'Some people believe online courses will replace classroom teaching.',
  practiceConcede: 'Admittedly, online courses are flexible and cheap.',
  practiceTurn: 'However, classroom teaching gives students instant feedback that a screen cannot fully replace.',
} as const;

export type WritingPanel = 'hook'|'task'|'weak'|'structure'|'concede'|'turn'|'support'|'assemble'|'match'|'limits'|'phrases'|'practice'|'practice-answer'|'check'|'close';
export type WritingCue = {id:string;panel:WritingPanel;voice:string;caption:string;english?:boolean;pauseAfter?:number};

export const writingCues: WritingCue[] = [
  {id:'hook',panel:'hook',voice:'六级作文写观点，很多同学开头就是“我完全同意”，然后一条条列好处，读起来像喊口号。今天学一个小技巧：先让一步，再把话转回来。',caption:'六级作文：先让步，再反驳'},
  {id:'task',panel:'task',voice:`看一道原创六级风格题目：${text.prompt} 题目让你选一边，也默认你知道另一边在担心什么。`,caption:'原创六级风格题目 · 两种观点，选一边',english:true,pauseAfter:0.6},
  {id:'weak',panel:'weak',voice:`很多人会这样写：${text.weak} 三句都在说好处，读者心里那句“会不会耽误学习”，没有人回应。`,caption:'一边倒：只有好处，没人回应担心',english:true},
  {id:'structure',panel:'structure',voice:'让步段可以记成三句：第一句承认对方的担心，第二句用转折词转回来，第三句给出更重要的理由和一个例子。',caption:'让步一句 → 转折一句 → 理由 + 例子'},
  {id:'concede',panel:'concede',voice:`第一句先承认：${text.concede} 意思是，打工确实可能占用学习时间。把对方的担心先说出来，读者会觉得你想得周全。`,caption:'It is true that…：先把对方的担心说出来',english:true},
  {id:'turn',panel:'turn',voice:`第二句转回来：${text.turn} 你承认时间会变少，同时指出，时间会被安排得更好。`,caption:'However：转回自己的观点',english:true},
  {id:'support',panel:'support',voice:`第三句给例子：${text.support} 例子具体到人、频率和结果，比一句“获得经验”更有说服力。`,caption:'例子：具体的人 + 频率 + 结果',english:true},
  {id:'assemble',panel:'assemble',voice:'三句连起来，就是一个完整的论证小段。让步只占一句，篇幅留给你自己的理由。',caption:'让步一句，主体留给自己的理由'},
  {id:'match',panel:'match',voice:'用的时候注意两点。第一，让步和反驳要说同一件事：前面说时间被占用，后面就回应时间管理，不能突然跳到赚钱。',caption:'让步和反驳要对准同一个点'},
  {id:'limits',panel:'limits',voice:'第二，让步要短，也要真诚。一句承认就够，写成一大段，读者会搞不清你站哪边。也不必每段都用，全文用一次最自然。',caption:'一句就够；全文用一次最自然'},
  {id:'phrases',panel:'phrases',voice:'换几种说法，免得每次都写 It is true that。让步可以用 Admittedly，或者 Some may argue that；转折可以用 However、Even so，或者 But this does not mean that。',caption:'让步：Admittedly / Some may argue that · 转折：However / Even so',english:true},
  {id:'practice',panel:'practice',voice:`轮到你。题目是：${text.practicePrompt} 写一句让步，再写一句转折。给自己三秒。`,caption:'练习：写一句让步 + 一句转折',english:true,pauseAfter:3},
  {id:'practice-answer',panel:'practice-answer',voice:`参考写法：${text.practiceConcede} ${text.practiceTurn} 前一句承认网课灵活便宜，后一句转到课堂的即时反馈，两句说的都是学习效果。`,caption:'参考：Admittedly… However…',english:true},
  {id:'check',panel:'check',voice:'交卷前查三件事：有没有一句让步；转折词后面是不是你的观点；理由和让步是不是对准同一个点。',caption:'让步一句 → 转折到观点 → 对准同一个点'},
  {id:'close',panel:'close',voice:'记住，承认一点对方的道理，你的观点反而更站得住。下次写六级作文，先让一步，再把话说回来。',caption:'先让一步，再把话说回来。'},
];

export type TimedWritingCue = WritingCue & {from:number;frames:number;audioFrames:number;src:string;seconds:number};
export type WritingTimeline = {fps:number;totalFrames:number;cues:TimedWritingCue[]};
