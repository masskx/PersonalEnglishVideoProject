export const CET_TRANSLATION_ID = 'cet4-translation-main-clause';

export const translationArt = {
  cut: 'assets/cet-translation/01-main-clause.png',
  museum: 'assets/cet-translation/02-museum.png',
  benefits: 'assets/cet-translation/03-parallel-benefits.png',
  volunteer: 'assets/cet-translation/04-volunteer.png',
} as const;

export const text = {
  source: '近年来，越来越多的年轻人选择在周末走进博物馆，因为这种方式既能帮助他们了解本地历史，也能让忙碌的生活慢下来。',
  main: '越来越多的年轻人选择走进博物馆。',
  mainEn: 'An increasing number of young people have chosen to visit museums.',
  final: 'In recent years, an increasing number of young people have chosen to visit museums on weekends, because doing so helps them learn about local history and slow down their busy lives.',
  literal: 'More and more young people choose in weekends walk into museums, because this way can help them understand local history, and can also let busy life slow down.',
  practice: '如今，许多大学生利用假期参加志愿活动，因为这些经历不仅能锻炼他们的沟通能力，也能让他们更好地了解社会。',
  practiceMain: '许多大学生参加志愿活动。',
  practiceAnswer: 'Today, many college students take part in volunteer activities during their vacations, because these experiences improve their communication skills and help them better understand society.',
} as const;

export type TranslationPanel = 'hook'|'task'|'cut'|'main'|'time'|'museum'|'reason'|'benefits'|'assemble'|'literal'|'practice'|'practice-main'|'answer'|'check'|'close';
export type TranslationCue = {id:string;panel:TranslationPanel;voice:string;caption:string;note?:string;english?:boolean;pauseAfter?:number};

export const translationCues: TranslationCue[] = [
  {id:'hook',panel:'hook',voice:'四级翻译遇到中文长句，别从第一个字一路硬翻。给我两分钟，先把能站稳的英语主干找出来。',caption:'中文长句怎么翻？先让英语主干站稳。'},
  {id:'task',panel:'task',voice:`看一道原创练习。${text.source}`,caption:'原创四级风格练习 · 参考译法不唯一'},
  {id:'cut-intro',panel:'cut',voice:'这句话信息很多。先暂时放下时间、周末和后面的原因，只问一句：谁，做了什么？',caption:'先圈主干：谁，做了什么？'},
  {id:'main-cn',panel:'main',voice:`主干是：${text.main} 主语是越来越多的年轻人，动作是选择参观博物馆。`,caption:'主语 + 动作：年轻人选择参观博物馆'},
  {id:'main-en',panel:'main',voice:text.mainEn,caption:'An increasing number of young people + have chosen + to visit museums',english:true},
  {id:'time',panel:'time',voice:'再补“近年来”。这个趋势从过去延续到现在，用现在完成时很顺。于是 choose 变成 have chosen。这里也可以根据语境换用一般现在时，关键是前后一致。',caption:'近年来 → 趋势延续至今 → have chosen'},
  {id:'museum',panel:'museum',voice:'“走进博物馆”在这里说的是参观。英语直接用 visit museums 更自然。weekend 前面用 on，写成 on weekends。',caption:'走进博物馆 → visit museums · 在周末 → on weekends'},
  {id:'reason',panel:'reason',voice:'接着处理“因为这种方式”。如果直译成 because this way，句子会很生硬。前面已经有一个动作，可以用 because doing so，直接指代前面的选择。',caption:'因为这种方式 → because doing so'},
  {id:'benefit-one',panel:'benefits',voice:'后面有两个并列好处。第一个，“帮助他们了解本地历史”，写成 helps them learn about local history。',caption:'好处一：helps them learn about local history'},
  {id:'benefit-two',panel:'benefits',voice:'第二个，“让忙碌的生活慢下来”，可以写 slow down their busy lives。两个动词 learn 和 slow down 共用 helps，结构就齐了。',caption:'好处二：slow down their busy lives'},
  {id:'assemble',panel:'assemble',voice:`把这些部分接回去：${text.final}`,caption:'主干站稳，再把时间和原因接回来',english:true},
  {id:'literal',panel:'literal',voice:'对照一个常见的逐字版本。choose in weekends、walk into museums、let busy life slow down，都能看出中文词序留下的痕迹。修改时逐项检查搭配，句子会干净很多。',caption:'逐字翻译留下的三个痕迹：介词 · 动词 · 搭配'},
  {id:'practice',panel:'practice',voice:`轮到你。${text.practice} 先停三秒，只找主干。`,caption:'迁移练习：先找“谁，做了什么”',pauseAfter:3},
  {id:'practice-main',panel:'practice-main',voice:`主干是：${text.practiceMain} 可以先写 Many college students take part in volunteer activities。`,caption:'Many college students + take part in + volunteer activities'},
  {id:'practice-build',panel:'practice-main',voice:'然后补 during their vacations，再接 because these experiences。后面两个好处并列：improve their communication skills，和 help them better understand society。',caption:'假期 + 原因 + 两个并列好处'},
  {id:'answer',panel:'answer',voice:text.practiceAnswer,caption:'一种参考译法 · 答案不唯一',english:true},
  {id:'check',panel:'check',voice:'考场上用四步检查。第一，主干能不能单独成立；第二，时间和地点放对位置；第三，中文动词有没有换成自然搭配；第四，并列部分的形式是否一致。',caption:'主干成立 · 修饰归位 · 搭配自然 · 并列一致'},
  {id:'close',panel:'close',voice:'再遇到长句，就先写出谁做什么，再补修饰。今天这道原创练习和参考译文已经放进配套练习单，你可以遮住答案再做一次。',caption:'先主干，后修饰。把中文长句拆开再翻。'},
];

export type TimedTranslationCue = TranslationCue & {from:number;frames:number;audioFrames:number;src:string;seconds:number};
export type TranslationTimeline = {fps:number;totalFrames:number;cues:TimedTranslationCue[]};
