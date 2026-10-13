import type {MethodDeck} from '../replica/xhs/methodDeck';
import {CET_WRITING_ID, WRITER_ART, sentences, writingCues} from './lesson';

const cue = (id: string) => writingCues.find((item) => item.id === id);

/** 小红书图文：四级作文「观点 → 原因 → 例子」主体段。全部文字取自本期讲稿。 */
export const cetWritingDeck: MethodDeck = {
  slug: CET_WRITING_ID,
  deliveryDir: 'outputs/cet4-writing-paragraph-v2',
  series: '小黑英语',
  examLabel: '四级写作',
  title: '只会写“很重要”？',
  subtitle: '观点 → 原因 → 例子',
  heroArt: WRITER_ART,
  task: {label: '原创模拟题', text: '大学生为什么应该经常阅读？', note: '本期只写一个主体段，不是整篇范文'},
  wrong: {label: '常见空话', text: sentences.weak, note: cue('weak')?.caption},
  steps: [
    {label: '第 1 步｜观点写具体', title: cue('claim-intro')?.caption ?? '', english: sentences.claim, detail: cue('claim-en')?.note, art: WRITER_ART},
    {label: '第 2 步｜原因讲过程', title: cue('reason-intro')?.caption ?? '', english: sentences.reason, detail: cue('reason-en')?.note},
    {label: '第 3 步｜例子落到行动', title: cue('example-intro')?.caption ?? '', english: sentences.example, detail: cue('example-en')?.note},
    {label: '连起来看', title: cue('paragraph')?.caption ?? '', detail: cue('paragraph')?.note},
  ],
  checklist: (cue('check')?.caption ?? '').split(/\s*·\s*/).filter(Boolean),
  practice: {label: '轮到你', text: sentences.practice, hint: cue('practice')?.caption?.replace(/^小练习：/, ''), art: WRITER_ART},
  answer: {text: sentences.answer, note: '一种参考写法，答案不唯一'},
  noteTitles: ['四级作文别只写很重要', '四级作文主体段｜3句写满', '观点原因例子｜四级作文'],
  tags: ['#四级作文', '#英语四级', '#四级', '#四六级', '#英语写作', '#英语学习', '#大学生'],
};
