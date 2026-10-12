import type {MethodDeck} from '../replica/xhs/methodDeck';
import {CET6_READING_ID, readingArt, readingCues, text} from './lesson';

const caption = (id: string) => readingCues.find((cue) => cue.id === id)?.caption ?? '';

/** 小红书图文：六级阅读「先定位，再认同义替换」。全部文字取自本期讲稿。 */
export const cet6ReadingDeck: MethodDeck = {
  slug: CET6_READING_ID,
  deliveryDir: 'outputs/cet6-reading-location-paraphrase',
  series: '小黑英语',
  examLabel: '六级阅读',
  title: '六级阅读别逐句翻',
  subtitle: '先定位，再认同义替换',
  heroArt: readingArt.hook,
  task: {label: '原创六级风格练习', text: text.passage, question: text.question},
  steps: [
    {label: '第 1 步｜先看题型', title: caption('question'), english: text.question, art: readingArt.hook},
    {label: '第 2 步｜圈两个关键词', title: text.keywords, detail: '它们告诉你：文章在讲城市怎样应对极端高温'},
    {label: '第 3 步｜回原文找证据', title: caption('locate'), english: text.evidenceLine, art: readingArt.evidence},
    {label: '第 4 步｜认出同义改写', title: '原文动作 → 题干概括', english: text.paraphrase, detail: 'redesigning public spaces → use several measures'},
    {label: '第 5 步｜排除干扰项', title: caption('distractor'), english: text.distractors.join('\n'), detail: '局部碰到原词，却没覆盖全文主线', art: readingArt.distractor},
    {label: '答案', title: '保留动作范围 + 问题背景', english: text.correct, art: readingArt.assemble},
  ],
  checklist: caption('check').split(/\s*→\s*/).filter(Boolean),
  practice: {label: '轮到你', text: text.practicePassage, question: text.practiceQuestion, hint: '先找目的句，再看同义改写', art: readingArt.practice},
  answer: {text: text.practiceAnswer, note: '主旨题优先保留目的和对象，别被细节带走'},
  noteTitles: ['六级阅读别逐句翻｜4步定位', '六级阅读｜同义替换一眼认', '六级主旨题｜先定位再选'],
  tags: ['#六级阅读', '#英语六级', '#六级', '#四六级', '#英语学习', '#大学生', '#英语阅读'],
};
