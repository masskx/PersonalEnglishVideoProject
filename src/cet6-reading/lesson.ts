export const CET6_READING_ID = 'cet6-reading-location-paraphrase';

export const readingArt = {
  hook: 'assets/replica/cet6-reading-location-paraphrase/hook-locate.png',
  evidence: 'assets/replica/cet6-reading-location-paraphrase/evidence.png',
  distractor: 'assets/replica/cet6-reading-location-paraphrase/distractor.png',
  assemble: 'assets/replica/cet6-reading-location-paraphrase/assemble.png',
  practice: 'assets/replica/cet6-reading-location-paraphrase/practice.png',
} as const;

export const text = {
  passage: 'Cities are redesigning some public spaces to make them more resilient to extreme heat. Instead of adding more air-conditioning, planners are combining shade trees, reflective materials, and water-sensitive landscaping. These measures do not merely lower surface temperatures; they also encourage residents to spend more time outdoors.',
  question: 'What is the passage mainly about?',
  correct: 'How cities use several measures to cope with extreme heat.',
  distractors: [
    'Why residents prefer air-conditioned malls.',
    'Why water-sensitive landscaping is expensive.',
    'How planners measure surface temperatures.',
  ],
  keywords: 'redesigning public spaces · extreme heat',
  paraphrase: 'use several measures to cope with extreme heat',
  evidenceLine: 'planners are combining shade trees, reflective materials, and water-sensitive landscaping',
  practicePassage: 'Universities are rethinking orientation programs. Rather than filling the first week with formal talks, some schools are giving new students small team projects and guided visits around campus. The aim is to help them build connections before classes become demanding.',
  practiceQuestion: 'What is the main purpose of the new orientation programs?',
  practiceAnswer: 'To help new students build connections before classes become demanding.',
} as const;

export type ReadingPanel = 'hook'|'task'|'question'|'keywords'|'locate'|'paraphrase'|'options'|'distractor'|'answer'|'practice'|'practice-locate'|'practice-answer'|'check'|'close';
export type ReadingCue = {id:string;panel:ReadingPanel;voice:string;caption:string;english?:boolean;pauseAfter?:number};

export const readingCues: ReadingCue[] = [
  {id:'hook',panel:'hook',voice:'六级阅读遇到抽象段落，别从头到尾逐句翻译。给我两分钟，学会先定位，再识别同义替换。',caption:'六级阅读：先定位，再认同义替换。'},
  {id:'task',panel:'task',voice:`看一道原创六级风格练习。${text.passage}`,caption:'原创六级风格练习 · 先读问题，再回原文',pauseAfter:1},
  {id:'question',panel:'question',voice:`题目问：${text.question}。先别急着选答案，先找题干里的方向词。`,caption:'题目问主旨：先抓方向，不急着逐句翻'},
  {id:'keywords',panel:'keywords',voice:`这道题的两个抓手是：${text.keywords}。它们告诉我们，文章在讲城市怎样应对极端高温。`,caption:'关键词：redesign public spaces · extreme heat'},
  {id:'locate',panel:'locate',voice:`回到原文，先找和关键词同义的表达。第一句出现 redesigning public spaces，说明对象和动作；后面 extreme heat 给出问题背景。`,caption:'定位句：对象 + 动作 + 问题背景',english:true},
  {id:'paraphrase',panel:'paraphrase',voice:`题干不会原样重复。redesigning public spaces，被概括成 use several measures；to make them more resilient to extreme heat，被概括成 cope with extreme heat。`,caption:'原文动作 → 题干概括：use several measures · cope with extreme heat'},
  {id:'options',panel:'options',voice:'现在看四个选项。先把能被原文直接支持的范围圈出来，再排除只抓到一个细节的选项。',caption:'选项要覆盖全文主线，不能只抓一个细节'},
  {id:'distractor',panel:'distractor',voice:`A 只说空调商场，原文没有比较居民偏好；C 把一个措施说成重点；D 只问测温方法。它们都碰到局部词，却没有覆盖全文。`,caption:'干扰项常见陷阱：局部正确，主线缺失'},
  {id:'answer',panel:'answer',voice:`答案是：${text.correct}。这句话把“多种措施”和“应对极端高温”都保留下来，覆盖了原文的主线。`,caption:'正确答案：保留动作范围 + 问题背景',english:true},
  {id:'practice',panel:'practice',voice:`轮到你。${text.practicePassage} 题目是：${text.practiceQuestion}。先看题干，再找原文的目的句。`,caption:'迁移练习：先找目的，再看同义改写',pauseAfter:3},
  {id:'practice-locate',panel:'practice-locate',voice:'目的句在最后：The aim is to help them build connections before classes become demanding。这里的 help new students build connections，就是题目里的核心改写。',caption:'目的句：The aim is to help them build connections',english:true},
  {id:'practice-answer',panel:'practice-answer',voice:`参考答案：${text.practiceAnswer}。主旨题要优先保留目的和对象，不要被 small team projects 这样的细节带走。`,caption:'参考答案：保留目的与对象，删掉无关细节'},
  {id:'check',panel:'check',voice:'考场上用四步检查：第一，题干问主旨、细节还是态度；第二，圈出两个关键词；第三，回原文找同义表达；第四，选能覆盖主线的选项。',caption:'题型 → 关键词 → 同义定位 → 主线选项'},
  {id:'close',panel:'close',voice:'记住，六级阅读不是逐句翻译比赛。先知道题目要找什么，再回原文找同义表达，最后检查选项有没有覆盖主线。',caption:'先定位，再认改写；主线比局部细节更重要。'},
];

export type TimedReadingCue = ReadingCue & {from:number;frames:number;audioFrames:number;src:string;seconds:number};
export type ReadingTimeline = {fps:number;totalFrames:number;cues:TimedReadingCue[]};
