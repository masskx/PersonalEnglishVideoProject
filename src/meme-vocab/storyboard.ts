import {buildHooks, buildQuiz, defaultMemeVocabInput} from './content';
import {buildJimengPrompt} from './prompts';
import type {MemeVocabInput, ShortStoryboard, ShortStoryboardScene} from './types';

const round3 = (value: number) => Number(value.toFixed(3));

export const buildShortStoryboard = (input: MemeVocabInput = defaultMemeVocabInput()): ShortStoryboard => {
  const duration = Math.min(28, Math.max(15, input.durationTarget));
  const durations = [0.09, 0.18, 0.23, 0.25, 0.25].map((ratio) => round3(duration * ratio));
  durations[durations.length - 1] = round3(duration - durations.slice(0, -1).reduce((sum, value) => sum + value, 0));
  const quiz = buildQuiz(input);
  const hooks = buildHooks(input);
  const selectedHook = hooks[1];
  const narrations = [
    selectedHook.text,
    '老板在会议室把奖金、期权和未来都画成了大饼。小黑刚想点头，员工突然举起工资单：先别画，工资呢？',
    `${input.targetWord}，/ˌɪntəˈrʌpt/，意思是“${input.accurateMeaning}”。inter 是插进中间，rupt 是打破；声音插进正在发生的事，就是打断。注意，这里是记忆联想，不是严格词源结论。`,
    `${input.exampleSentence} 意思是：我说话时请不要打断我。会议里突然插话，用 ${input.targetWord}；它强调把正在进行的话或动作截断。`,
    `${quiz.question} 把秩序搅乱，答案不是 interrupt。评论区只写一个词，不要把答案写在前面。`,
  ];
  const ttsTexts = [
    '老板画饼，工资呢？',
    '老板画饼，员工拍工资单：工资呢？',
    `${input.targetWord}，意思是打断正在进行的事。inter 是插入，rupt 是打破，只是记忆联想。`,
    `Please don't interrupt me. 意思是：请不要打断我。`,
    '插嘴是 interrupt。搅乱整个秩序，用哪个词？',
  ];
  const sceneTypes = ['hook', 'meme_story', 'word_reveal', 'real_usage', 'quiz_cta'] as const;
  const imageIds = ['interrupt-hook', 'interrupt-meeting', 'interrupt-reveal', 'interrupt-usage', 'interrupt-quiz'];
  const motions = ['push-in', 'shake', 'local-zoom', 'pan-right', 'push-in'] as const;
  const cropFocus = ['人物和被拍到桌上的工资单', '老板的大饼与员工举起的工资单', '小黑卡在“正在说话”的断裂线中间', '人物嘴边被截断的对话气泡和小黑', '小黑指向两个空白选项框，问题区域留白'];
  const displayText = [
    [selectedHook.text],
    ['奖金、期权、未来', '工资呢？'],
    [input.targetWord, input.phonetic, input.accurateMeaning],
    [input.exampleSentence, '我说话时请不要打断我'],
    [quiz.question, 'A. interrupt   B. disrupt'],
  ];
  const emphasizedWords = [
    [input.targetWord],
    ['工资呢？'],
    [input.targetWord, 'inter', 'rupt', input.accurateMeaning],
    [input.targetWord],
    ['interrupt', 'disrupt'],
  ];
  const starts: number[] = [];
  let cursor = 0;
  for (const sceneDuration of durations) {
    starts.push(round3(cursor));
    cursor += sceneDuration;
  }
  const scenes: ShortStoryboardScene[] = sceneTypes.map((sceneType, index) => {
    const scene: ShortStoryboardScene = {
      sceneId: imageIds[index],
      sceneType,
      startTime: starts[index],
      estimatedDuration: durations[index],
      narration: narrations[index],
      ttsText: ttsTexts[index],
      displayText: displayText[index],
      emphasizedWords: emphasizedWords[index],
      imageAssetId: imageIds[index],
      jimengPrompt: '',
      cropFocus: cropFocus[index],
      cameraMotion: motions[index],
      transition: index === 0 ? 'cut' : 'whip-white',
      soundEffect: index === 0 ? 'hit' : index === 4 ? 'pop' : 'whoosh',
      revealTiming: {
        word: index === 2 ? 1.2 : 0,
        phonetic: index === 2 ? 2.0 : 0,
        meaning: index === 2 ? 2.7 : 0,
        example: index === 3 ? 1.2 : undefined,
      },
      commentGoal:
        index === 4 ? '让观众评论 disrupt，并解释 interrupt 与 disrupt 的差别' : '推动观众继续看下一次语义转折',
      ...(index === 4 ? {quizQuestion: quiz.question, quizAnswer: quiz.answer} : {}),
    };
    scene.jimengPrompt = buildJimengPrompt(input, scene);
    return scene;
  });
  return {
    mode: 'meme_vocab_short',
    width: 1080,
    height: 1920,
    fps: 30,
    duration: round3(cursor),
    defaultHookId: selectedHook.hookId,
    hooks,
    scenes,
  };
};
