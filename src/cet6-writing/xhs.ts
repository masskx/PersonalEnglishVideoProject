import type {MethodDeck} from '../replica/xhs/methodDeck';
import {CET6_WRITING_ID, text, writingArt, writingCues} from './lesson';

const caption = (id: string) => writingCues.find((cue) => cue.id === id)?.caption ?? '';

/** 小红书图文：六级作文「先让步，再反驳」。全部文字取自本期讲稿。 */
export const cet6WritingDeck: MethodDeck = {
  slug: CET6_WRITING_ID,
  deliveryDir: `outputs/${CET6_WRITING_ID}`,
  series: '小黑英语',
  examLabel: '六级写作',
  title: '六级作文先让步再反驳',
  subtitle: '一句让步 · 一句转折 · 一个例子',
  heroArt: writingArt.hook,
  task: {label: '原创六级风格题目', text: text.prompt, question: '两种观点，选一边写'},
  wrong: {label: '常见写法 · 一边倒', text: text.weak, note: '三句都是好处，读者的担心没人回应'},
  steps: [
    {label: '第 1 句｜让步', title: caption('concede'), english: text.concede, art: writingArt.concede},
    {label: '第 2 句｜转折', title: caption('turn'), english: text.turn, art: writingArt.turn},
    {label: '第 3 句｜理由 + 例子', title: caption('support'), english: text.support, art: writingArt.support},
    {label: '注意 1', title: caption('match'), detail: '时间被占用 → 时间管理更好；不要跳到“还能赚钱”'},
    {label: '注意 2', title: caption('limits'), detail: '一句承认就够，写成一大段会看不出立场'},
    {label: '换几种说法', title: '让步 / 转折', english: [...text.concedePhrases, ...text.turnPhrases].join('\n')},
  ],
  checklist: caption('check').split(/\s*→\s*/).filter(Boolean),
  practice: {label: '轮到你', text: text.practicePrompt, question: '写一句让步 + 一句转折', hint: '两句要说同一件事', art: writingArt.practice},
  answer: {text: `${text.practiceConcede}\n${text.practiceTurn}`, note: '灵活便宜 ↔ 即时反馈：都在说学习效果'},
  noteTitles: ['六级作文｜先让步再反驳', '六级写作｜让步段3句话', '六级作文高级感｜先让一步'],
  tags: ['#六级写作', '#英语六级', '#六级作文', '#四六级', '#英语写作', '#大学生', '#英语学习'],
};
