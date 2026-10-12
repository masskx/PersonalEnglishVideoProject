import {narrationToCaptions} from './captionUtils';
import type {ReplicaImageLayer, ReplicaRadialLayer, ReplicaScene, ReplicaStoryboard, ReplicaTableLayer, ReplicaTextLayer} from './types';

export const DICT_REPLICA_ASSETS = {
  hook: 'assets/replica/dict/00_say_hook.png',
  predict: 'assets/replica/dict/01_predict_before.png',
  contradict: 'assets/replica/dict/02_contradict_opposite.png',
  verdict: 'assets/replica/dict/03_verdict_truth.png',
  dictate: 'assets/replica/dict/04_dictate_command.png',
  dictionary: 'assets/replica/dict/05_dictionary_book.png',
  diction: 'assets/replica/dict/06_diction_word_choice.png',
  dictation: 'assets/replica/dict/07_dictation_write.png',
  indict: 'assets/replica/dict/08_indict_charge.png',
} as const;

const text = (layer: Omit<ReplicaTextLayer, 'kind'>): ReplicaTextLayer => ({kind: 'text', ...layer});
const image = (layer: Omit<ReplicaImageLayer, 'kind'>): ReplicaImageLayer => ({kind: 'image', ...layer});
const radial = (layer: Omit<ReplicaRadialLayer, 'kind'>): ReplicaRadialLayer => ({kind: 'radial', ...layer});
const table = (layer: Omit<ReplicaTableLayer, 'kind'>): ReplicaTableLayer => ({kind: 'table', ...layer});
const hold = (duration: number, from: number, tail = 0.2) => Number(Math.max(0.12, duration - from - tail).toFixed(3));
const WHITE_FADE = {type: 'white-fade' as const, duration: 0.16};

const wordScene = ({id, start, narration, prefix = '', suffix = '', formula, meaning, asset}: {
  id: string; start: number; narration: string; prefix?: string; suffix?: string;
  formula: string; meaning: string; asset: string;
}): ReplicaScene => {
  const duration = 8.5;
  return {
    id, start, duration, narration, captions: narrationToCaptions(narration, duration),
    sfx: [{at: 0.12, name: 'whoosh', volume: 0.15}, {at: 3.7, name: 'pop', volume: 0.13}],
    layers: [
      text({id: `${id}-word`, from: 0.05, duration: hold(duration, 0.05), enter: 'pop', enterDuration: 0.42, exit: 'fade', exitDuration: 0.2, x: 85, y: 95, width: 900, fontSize: prefix.length + suffix.length > 8 ? 88 : 108, fontWeight: 800, runs: [{text: prefix, color: 'primary'}, {text: 'dict', color: 'accent'}, {text: suffix, color: 'primary'}]}),
      text({id: `${id}-formula`, from: 0.72, duration: hold(duration, 0.72), enter: 'wipe-up', enterDuration: 0.34, exit: 'fade', exitDuration: 0.2, x: 100, y: 285, width: 805, fontSize: 44, fontWeight: 760, runs: [{text: formula, color: 'primary'}]}),
      image({id: `${id}-image`, src: asset, from: 0.3, duration: hold(duration, 0.3), enter: 'slide-left', enterDuration: 0.46, exit: 'fade', exitDuration: 0.2, x: 880, y: 95, width: 850, height: 660, fit: 'contain'}),
      text({id: `${id}-meaning`, from: 4.0, duration: hold(duration, 4.0), enter: 'pop', enterDuration: 0.36, exit: 'fade', exitDuration: 0.2, x: 115, y: 510, width: 720, fontSize: 60, fontWeight: 800, align: 'center', runs: [{text: meaning, color: 'accent'}]}),
    ],
    transitionOut: WHITE_FADE,
  };
};

const scenes: ReplicaScene[] = [
  {
    id: 'say-hook', start: 0, duration: 8,
    narration: '今天记词根 dict，核心就是 say，说。把它想成小黑的说话印章：声音一出来，就压成一句有分量的话。',
    captions: narrationToCaptions('今天记词根 dict，核心就是 say，说。把它想成小黑的说话印章：声音一出来，就压成一句有分量的话。', 8),
    sfx: [{at: 0.15, name: 'pop', volume: 0.17}, {at: 2.2, name: 'stamp', volume: 0.17}],
    layers: [
      text({id: 'hook-root', from: 0.05, duration: 7.6, enter: 'pop', enterDuration: 0.44, x: 110, y: 150, width: 680, fontSize: 164, fontWeight: 800, align: 'center', runs: [{text: 'DICT', color: 'accent'}]}),
      text({id: 'hook-say', from: 0.7, duration: 6.9, enter: 'rise', enterDuration: 0.34, x: 180, y: 360, width: 540, fontSize: 78, fontWeight: 800, align: 'center', runs: [{text: '= SAY', color: 'primary'}]}),
      text({id: 'hook-cn', from: 1.2, duration: 6.4, enter: 'wipe-up', enterDuration: 0.34, x: 220, y: 505, width: 460, fontSize: 70, fontWeight: 780, align: 'center', runs: [{text: '说', color: 'primary'}]}),
      image({id: 'hook-image', src: DICT_REPLICA_ASSETS.hook, from: 0.3, duration: 7.3, enter: 'slide-left', enterDuration: 0.5, x: 800, y: 80, width: 960, height: 720, fit: 'contain'}),
    ], transitionOut: WHITE_FADE,
  },
  {
    id: 'speech-map', start: 8, duration: 10,
    narration: '接下来只问：什么时候说、朝哪边说、怎样说？提前说是预测，反着说是反驳，正式说可能是裁决、命令或指控。',
    captions: narrationToCaptions('接下来只问：什么时候说、朝哪边说、怎样说？提前说是预测，反着说是反驳，正式说可能是裁决、命令或指控。', 10),
    sfx: [{at: 0.15, name: 'scribble', volume: 0.15}],
    layers: [
      text({id: 'map-title', from: 0.05, duration: 9.6, enter: 'rise', enterDuration: 0.38, x: 220, y: 55, width: 1480, fontSize: 62, fontWeight: 800, align: 'center', runs: [{text: '先找“怎么说”，再还原词义', color: 'primary'}]}),
      radial({id: 'map-radial', from: 0.55, duration: 9.0, enter: 'pop', enterDuration: 0.46, x: 130, y: 170, width: 1660, height: 640, center: [{text: 'DICT', color: 'accent', weight: 800, size: 82}, {text: '\n说', color: 'primary', weight: 760, size: 46}], items: [
        {text: 'pre-  提前', angle: 205, color: 'primary'}, {text: 'contra-  相反', angle: 150, color: 'primary'},
        {text: 'ver-  真实', angle: 95, color: 'primary'}, {text: '-ate  做动作', angle: 25, color: 'primary'},
        {text: '-ion  结果/方式', angle: 335, color: 'primary'}, {text: 'in-  针对', angle: 270, color: 'primary'},
      ], radiusX: 600, radiusY: 245}),
    ], transitionOut: WHITE_FADE,
  },
  wordScene({id: 'predict-before-say', start: 18, prefix: 'pre', formula: 'pre- 提前 + dict 说', meaning: '预测；预言', asset: DICT_REPLICA_ASSETS.predict, narration: 'predict 里，pre 是提前。事情还没发生，小黑就先说出结果，这就是 predict，预测、预言。'}),
  wordScene({id: 'contradict-opposite-say', start: 26.5, prefix: 'contra', formula: 'contra- 相反 + dict 说', meaning: '反驳；与……矛盾', asset: DICT_REPLICA_ASSETS.contradict, narration: 'contradict 的 contra 表示相反。别人说一句，你朝反方向说一句，就是反驳；两条信息对不上，就是相互矛盾。'}),
  wordScene({id: 'verdict-true-say', start: 35, prefix: 'ver', formula: 'ver- 真实 + dict 说', meaning: '裁决；判决', asset: DICT_REPLICA_ASSETS.verdict, narration: 'verdict 的 ver 和真实有关：把判断正式说出来。今天它指陪审团或法庭作出的裁决、判决。'}),
  wordScene({id: 'dictate-command-say', start: 43.5, suffix: 'ate', formula: 'dict 说 + -ate 做动作', meaning: '口述；命令；支配', asset: DICT_REPLICA_ASSETS.dictate, narration: 'dictate 是把话说出来，让别人记录或照做。所以它既可以是口述，也可以是命令、支配，强调说话者掌握决定权。'}),
  wordScene({id: 'dictionary-word-book', start: 52, suffix: 'ionary', formula: '收集“怎么说”的词语之书', meaning: '词典；字典', asset: DICT_REPLICA_ASSETS.dictionary, narration: 'dictionary 可以记成收集词语怎么说、什么意思的一本书，也就是词典、字典。这里不要机械拆碎后缀。'}),
  wordScene({id: 'diction-word-choice', start: 60.5, suffix: 'ion', formula: '说话时选择词语的方式', meaning: '措辞；发音方式', asset: DICT_REPLICA_ASSETS.diction, narration: 'diction 关注你怎样选词、怎样发音，常表示措辞或发音方式。clear diction，就是清晰的发音。'}),
  wordScene({id: 'dictation-hear-write', start: 69, suffix: 'ation', formula: '别人说，你听后写下来', meaning: '听写；口述记录', asset: DICT_REPLICA_ASSETS.dictation, narration: 'dictation 是一个人说，另一个人听后写下。所以它是听写，也可以指口述记录。课堂上老师念词、学生落笔，就是这个画面。'}),
  wordScene({id: 'indict-formal-charge', start: 77.5, prefix: 'in', formula: '正式把指控说到某人身上', meaning: '正式起诉；控告', asset: DICT_REPLICA_ASSETS.indict, narration: 'indict 是法律词：正式把指控说到某人身上，也就是起诉、控告。它读 in-dite，结尾 c 不发音。'}),
  {
    id: 'example-sentences', start: 86, duration: 10,
    narration: 'Experts predict change，专家预测变化。The facts contradict him，事实与他矛盾。The jury reached a verdict，陪审团裁决。She has clear diction，发音清晰。',
    captions: narrationToCaptions('Experts predict change，专家预测变化。The facts contradict him，事实与他矛盾。The jury reached a verdict，陪审团裁决。She has clear diction，发音清晰。', 10),
    sfx: [{at: 0.12, name: 'scribble', volume: 0.15}],
    layers: [
      text({id: 'examples-title', from: 0.05, duration: 9.6, enter: 'rise', enterDuration: 0.36, x: 260, y: 60, width: 1400, fontSize: 64, fontWeight: 800, align: 'center', runs: [{text: '把“说”放回句子', color: 'primary'}]}),
      text({id: 'ex1', from: 0.8, duration: 8.9, enter: 'typewriter', enterDuration: 0.4, x: 150, y: 210, width: 1620, fontSize: 42, fontWeight: 700, typewriterCharsPerSec: 22, runs: [{text: 'Experts ', color: 'primary'}, {text: 'predict', color: 'accent'}, {text: ' change.  专家预测变化。', color: 'primary'}]}),
      text({id: 'ex2', from: 3.0, duration: 6.7, enter: 'typewriter', enterDuration: 0.4, x: 150, y: 345, width: 1620, fontSize: 42, fontWeight: 700, typewriterCharsPerSec: 22, runs: [{text: 'The facts ', color: 'primary'}, {text: 'contradict', color: 'accent'}, {text: ' him.  事实与他的话矛盾。', color: 'primary'}]}),
      text({id: 'ex3', from: 5.2, duration: 4.5, enter: 'typewriter', enterDuration: 0.4, x: 150, y: 480, width: 1620, fontSize: 42, fontWeight: 700, typewriterCharsPerSec: 22, runs: [{text: 'The jury reached a ', color: 'primary'}, {text: 'verdict', color: 'accent'}, {text: '.  陪审团作出了裁决。', color: 'primary'}]}),
      text({id: 'ex4', from: 7.4, duration: 2.3, enter: 'typewriter', enterDuration: 0.4, x: 150, y: 615, width: 1620, fontSize: 42, fontWeight: 700, typewriterCharsPerSec: 22, runs: [{text: 'She has clear ', color: 'primary'}, {text: 'diction', color: 'accent'}, {text: '.  她的发音很清晰。', color: 'primary'}]}),
    ], transitionOut: WHITE_FADE,
  },
  {
    id: 'final-summary', start: 96, duration: 16,
    narration: '最后收口：dict 就是说。predict，预测；contradict，反驳；verdict，裁决；dictate，口述或命令；dictionary，词典；diction，措辞和发音；dictation，听写；indict，起诉。记住说话印章，这一组就串起来了。',
    captions: narrationToCaptions('最后收口：dict 就是说。predict，预测；contradict，反驳；verdict，裁决；dictate，口述或命令；dictionary，词典；diction，措辞和发音；dictation，听写；indict，起诉。记住说话印章，这一组就串起来了。', 15.45),
    sfx: [{at: 0.12, name: 'stamp', volume: 0.17}],
    layers: [
      text({id: 'summary-title', from: 0.05, duration: 14.95, enter: 'rise', enterDuration: 0.38, x: 250, y: 38, width: 1420, align: 'center', fontSize: 64, fontWeight: 800, runs: [{text: 'dict = ', color: 'primary'}, {text: 'say / 说', color: 'accent'}]}),
      table({id: 'summary-table', from: 0.35, duration: 14.65, enter: 'rise', enterDuration: 0.42, x: 115, y: 125, width: 1690, height: 675, columns: 1, rowFromStep: 0.42, compact: true, variant: 'open', partInMeaning: true, wordFontSize: 36, phoneticFontSize: 22, meaningFontSize: 30, wordColumnFraction: 0.38, rows: [
        {word: 'predict', phonetic: '/prɪˈdɪkt/', part: 'v.', meaning: 'pre- 提前说 → 预测；预言', accent: 'dict'},
        {word: 'contradict', phonetic: '/ˌkɒntrəˈdɪkt/', part: 'v.', meaning: 'contra- 反着说 → 反驳；矛盾', accent: 'dict'},
        {word: 'verdict', phonetic: '/ˈvɜːdɪkt/', part: 'n.', meaning: '正式说出判断 → 裁决；判决', accent: 'dict'},
        {word: 'dictate', phonetic: '/dɪkˈteɪt/', part: 'v.', meaning: '说给人照做 → 口述；命令', accent: 'dict'},
        {word: 'dictionary', phonetic: '/ˈdɪkʃənri/', part: 'n.', meaning: '收纳词语说法 → 词典；字典', accent: 'dict'},
        {word: 'diction', phonetic: '/ˈdɪkʃn/', part: 'n.', meaning: '说话的选词方式 → 措辞；发音', accent: 'dict'},
        {word: 'dictation', phonetic: '/dɪkˈteɪʃn/', part: 'n.', meaning: '听别人说后写下 → 听写', accent: 'dict'},
        {word: 'indict', phonetic: '/ɪnˈdaɪt/', part: 'v.', meaning: '正式说出指控 → 起诉；控告', accent: 'dict'},
      ]}),
    ],
  },
];

export const dictStoryboard: ReplicaStoryboard = {
  id: 'dict', duration: 112, fadeToBlackSec: 0.5, fadeEndOpacity: 1, scenes,
};
