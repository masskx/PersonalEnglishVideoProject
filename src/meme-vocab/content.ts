import type {MemeVocabInput, HookOption, InteractionType} from './types';
import {memeVocabOutputDirectory} from './paths';

export const defaultMemeVocabInput = (overrides: Partial<MemeVocabInput> = {}): MemeVocabInput => ({
  mode: 'meme_vocab_short',
  targetWord: 'interrupt',
  phonetic: '/ˌɪntəˈrʌpt/',
  accurateMeaning: '打断；中断；插话',
  audience: '四六级与考研学生',
  memeTheme: '老板画饼、员工追问工资',
  scenario: '老板在会议室画饼，员工突然问工资，直接打断老板施法',
  durationTarget: 22,
  difficulty: 'CET-6',
  relatedWords: ['disrupt', 'intervene'],
  exampleSentence: "Please don't interrupt me while I'm speaking.",
  interactionType: 'confusable_word',
  voiceStyle: '自然、快速、带一点吐槽',
  visualStyle: '白底小黑、橙蓝强调、荒诞手绘',
  characterProfile: '黑色实心小黑，白点眼，细腿，冷静认真，像被迫维持会议秩序的实习生',
  assetDirectory: 'public/assets/meme-vocab/interrupt',
  bgm: 'assets/music/root-word-series-bgm.mp3',
  outputDirectory: memeVocabOutputDirectory(overrides.targetWord),
  ...overrides,
});

export const buildHooks = (input: MemeVocabInput): HookOption[] => [
  {
    hookId: 'hook-pain-point',
    angle: 'pain-point',
    text: '老板又开始画饼，但你一句话就能让他当场卡壳。',
    rationale: '直击学生在会议、汇报和面试中“不敢插话”的痛点。',
  },
  {
    hookId: 'hook-plot-conflict',
    angle: 'plot-conflict',
    text: '老板正在宣布“下个月一定发奖金”，员工突然把工资单拍上桌。',
    rationale: `直接展示${input.scenario}，用异常行为制造冲突。`,
  },
  {
    hookId: 'hook-test-challenge',
    angle: 'test-challenge',
    text: '“别插嘴”用哪个词？是 interrupt，还是 disrupt？先别急着看答案。',
    rationale: '用二选一制造即时测试，提前建立评论区回答动机。',
  },
];

export const interactionAnswer = (input: MemeVocabInput): string => {
  if (input.interactionType === 'two_choice') return input.targetWord;
  if (input.interactionType === 'fill_blank') return input.targetWord;
  return 'disrupt';
};

export const buildQuiz = (input: MemeVocabInput) => ({
  question: '插嘴打断会议用 interrupt；如果把整个会议秩序搅乱，应该用哪个词？',
  answer: interactionAnswer(input),
});
