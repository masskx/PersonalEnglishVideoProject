import type {MethodDeck} from '../replica/xhs/methodDeck';
import {CET_TRANSLATION_ID, text, translationArt, translationCues} from './lesson';

const caption = (id: string) => translationCues.find((cue) => cue.id === id)?.caption ?? '';

/** 小红书图文：四级翻译「先找主干，再补修饰」。全部文字取自本期讲稿。 */
export const cetTranslationDeck: MethodDeck = {
  slug: CET_TRANSLATION_ID,
  deliveryDir: 'outputs/cet4-translation-main-clause',
  series: '小黑英语',
  examLabel: '四级翻译',
  title: '中文长句怎么翻？',
  subtitle: '先找主干，再补修饰',
  heroArt: translationArt.cut,
  task: {label: '原创四级风格练习', text: text.source, note: '参考译法不唯一'},
  wrong: {label: '先看一个逐字翻译', text: text.literal, note: caption('literal')},
  steps: [
    {label: '第 1 步｜先圈主干', title: text.main, english: text.mainEn, detail: '谁，做了什么？时间、原因先放一边', art: translationArt.cut},
    {label: '第 2 步｜补时间', title: '近年来 → 趋势延续至今', english: 'choose → have chosen', detail: '前后时态保持一致即可'},
    {label: '第 3 步｜换成自然搭配', title: '走进博物馆 → visit museums', english: 'on weekends', detail: '在周末 → on weekends', art: translationArt.museum},
    {label: '第 4 步｜处理原因和并列', title: '因为这种方式 → because doing so', english: 'helps them learn about local history and slow down their busy lives', detail: '两个好处共用 helps，结构对齐', art: translationArt.benefits},
    {label: '第 5 步｜接回整句', title: '主干站稳，再把时间和原因接回来', english: text.final},
  ],
  checklist: caption('check').split(/\s*·\s*/).filter(Boolean),
  practice: {label: '轮到你', text: text.practice, hint: '先找“谁，做了什么”，停三秒再往下翻', art: translationArt.volunteer},
  answer: {text: text.practiceAnswer, note: `主干：${text.practiceMain} · 一种参考译法，答案不唯一`},
  noteTitles: ['四级翻译长句｜先找主干', '中文长句别硬翻｜5步拆完', '四级翻译｜主干+修饰一页记'],
  tags: ['#四级翻译', '#英语四级', '#四级', '#四六级', '#英语学习', '#大学生', '#英语翻译'],
};
