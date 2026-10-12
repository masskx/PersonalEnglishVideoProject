import {narrationToCaptions} from './captionUtils';
import type {ReplicaImageLayer, ReplicaScene, ReplicaStoryboard, ReplicaTextLayer} from './types';

type KeyposeSet = readonly [string, string, string];

export const TEN_TAIN_ASSETS = {
  retain: ['assets/replica/ten-tain-v3/retain-before.png', 'assets/replica/ten-tain-v3/retain-change.png', 'assets/replica/ten-tain-v3/retain-result.png'] as KeyposeSet,
  contain: ['assets/replica/ten-tain-v3/contain-before.png', 'assets/replica/ten-tain-v3/contain-change.png', 'assets/replica/ten-tain-v3/contain-result.png'] as KeyposeSet,
  maintain: ['assets/replica/ten-tain-v3/maintain-before.png', 'assets/replica/ten-tain-v3/maintain-change.png', 'assets/replica/ten-tain-v3/maintain-result.png'] as KeyposeSet,
  obtain: ['assets/replica/ten-tain-v3/obtain-before.png', 'assets/replica/ten-tain-v3/obtain-change.png', 'assets/replica/ten-tain-v3/obtain-result.png'] as KeyposeSet,
  detain: ['assets/replica/ten-tain-v3/detain-before.png', 'assets/replica/ten-tain-v3/detain-change.png', 'assets/replica/ten-tain-v3/detain-result.png'] as KeyposeSet,
  sustain: ['assets/replica/ten-tain-v3/sustain-before.png', 'assets/replica/ten-tain-v3/sustain-change.png', 'assets/replica/ten-tain-v3/sustain-result.png'] as KeyposeSet,
  entertain: ['assets/replica/ten-tain-v3/entertain-before.png', 'assets/replica/ten-tain-v3/entertain-change.png', 'assets/replica/ten-tain-v3/entertain-result.png'] as KeyposeSet,
  abstain: ['assets/replica/ten-tain-v3/abstain-before.png', 'assets/replica/ten-tain-v3/abstain-change.png', 'assets/replica/ten-tain-v3/abstain-result.png'] as KeyposeSet,
} as const;

const text = (layer: Omit<ReplicaTextLayer, 'kind'>): ReplicaTextLayer => ({kind: 'text', ...layer});
const image = (layer: Omit<ReplicaImageLayer, 'kind'>): ReplicaImageLayer => ({kind: 'image', ...layer});
const hold = (duration: number, from: number, tail = 0.22) => Math.max(0.12, duration - from - tail);
const WHITE_FADE = {type: 'white-fade' as const, duration: 0.12};

const poseLayers = (id: string, poses: KeyposeSet, duration: number, x: number, y: number, width: number, height: number): ReplicaImageLayer[] => {
  const first = 2.25;
  const second = 4.1;
  return [
    image({id: `${id}-before`, src: poses[0], from: 0, duration: first, enter: 'none', exit: 'none', x, y, width, height, fit: 'contain', contentScale: 1.18}),
    image({id: `${id}-change`, src: poses[1], from: first, duration: second - first, enter: 'none', exit: 'none', x, y, width, height, fit: 'contain', contentScale: 1.18}),
    image({id: `${id}-result`, src: poses[2], from: second, duration: duration - second, enter: 'none', exit: 'none', x, y, width, height, fit: 'contain', contentScale: 1.18}),
  ];
};

const addScene = (scenes: ReplicaScene[], input: Omit<ReplicaScene, 'start'>) => {
  const start = scenes.length ? scenes[scenes.length - 1].start + scenes[scenes.length - 1].duration : 0;
  scenes.push({...input, start});
};

const wordScene = (args: {
  id: string;
  duration: number;
  narration: string;
  word: string;
  prefix?: string;
  root?: string;
  suffix?: string;
  formula: string;
  meaning: string;
  poses: KeyposeSet;
  layout?: 'left' | 'right' | 'hero';
}): Omit<ReplicaScene, 'start'> => {
  const {id, duration, narration, word, prefix = '', root = 'tain', suffix = '', formula, meaning, poses, layout = 'left'} = args;
  if (layout === 'hero') {
    return {id, duration, narration, captions: narrationToCaptions(narration, duration), transitionOut: WHITE_FADE, layers: [
      text({id: `${id}-word`, from: 0.05, duration: hold(duration, 0.05), enter: 'smooth-rise', enterDuration: 0.4, exit: 'smooth-out', exitDuration: 0.2, x: 130, y: 50, width: 1660, fontSize: word.length > 10 ? 68 : 86, fontWeight: 840, align: 'center', runs: [{text: prefix, color: 'primary'}, {text: root, color: 'accent'}, {text: suffix, color: 'primary'}], runMotion: 'assemble'}),
      text({id: `${id}-formula`, from: 0.7, duration: hold(duration, 0.7), enter: 'smooth-reveal', enterDuration: 0.32, exit: 'smooth-out', exitDuration: 0.2, x: 310, y: 165, width: 1300, fontSize: 35, fontWeight: 740, align: 'center', runs: [{text: formula, color: 'primary'}]}),
      ...poseLayers(id, poses, duration, 425, 215, 1070, 590),
      text({id: `${id}-meaning`, from: 4.0, duration: hold(duration, 4.0), enter: 'smooth-rise', enterDuration: 0.34, exit: 'smooth-out', exitDuration: 0.2, x: 410, y: 765, width: 1100, fontSize: 43, fontWeight: 820, align: 'center', runs: [{text: meaning, color: 'accent'}]}),
    ]};
  }
  const textX = layout === 'left' ? 95 : 980;
  const artX = layout === 'left' ? 995 : 55;
  return {id, duration, narration, captions: narrationToCaptions(narration, duration), transitionOut: WHITE_FADE, layers: [
    text({id: `${id}-word`, from: 0.05, duration: hold(duration, 0.05), enter: 'smooth-rise', enterDuration: 0.45, exit: 'smooth-out', exitDuration: 0.2, x: textX, y: 125, width: 830, fontSize: word.length > 10 ? 70 : 88, fontWeight: 820, runs: [{text: prefix, color: 'primary'}, {text: root, color: 'accent'}, {text: suffix, color: 'primary'}], runMotion: 'assemble'}),
    text({id: `${id}-formula`, from: 0.85, duration: hold(duration, 0.85), enter: 'smooth-slide', enterDuration: 0.34, exit: 'smooth-out', exitDuration: 0.2, x: textX + 8, y: 295, width: 790, fontSize: 36, fontWeight: 740, runs: [{text: formula, color: 'primary'}]}),
    ...poseLayers(id, poses, duration, artX, 105, 835, 675),
    text({id: `${id}-meaning`, from: 3.95, duration: hold(duration, 3.95), enter: 'smooth-reveal', enterDuration: 0.34, exit: 'smooth-out', exitDuration: 0.2, x: textX - 12, y: 515, width: 825, fontSize: 46, fontWeight: 800, align: 'center', runs: [{text: meaning, color: 'accent'}]}),
  ]};
};

const scenes: ReplicaScene[] = [];

const hook = '同一个 hold，为什么 retain 是保留，detain 却变成扣住，entertain 还能变成逗乐？看清前缀的方向，八个高频词就能串起来。';
addScene(scenes, {id: 'ten-tain-hook', duration: 9.0, narration: hook, captions: narrationToCaptions(hook, 9.0), sfx: [{at: 0.12, name: 'pop', volume: 0.14}, {at: 3.2, name: 'whoosh', volume: 0.11}], transitionOut: WHITE_FADE, layers: [
  text({id: 'hook-root', from: 0.05, duration: 8.45, enter: 'smooth-rise', enterDuration: 0.4, exit: 'smooth-out', exitDuration: 0.2, x: 90, y: 100, width: 870, fontSize: 82, fontWeight: 840, runs: [{text: 'RETAIN', color: 'accent'}, {text: ' 还是 ', color: 'primary'}, {text: 'DETAIN', color: 'accent'}]}),
  text({id: 'hook-line', from: 0.85, duration: 7.65, enter: 'smooth-reveal', enterDuration: 0.35, x: 110, y: 315, width: 840, fontSize: 47, fontWeight: 760, runs: [{text: 'hold 往哪儿走？', color: 'primary'}]}),
  text({id: 'hook-sub', from: 2.2, duration: 6.3, enter: 'smooth-slide', enterDuration: 0.35, x: 110, y: 480, width: 840, fontSize: 40, fontWeight: 720, runs: [{text: '前缀换方向，词义就换场景', color: 'accent'}]}),
  image({id: 'hook-art', src: TEN_TAIN_ASSETS.retain[2], from: 0.15, duration: 3.1, enter: 'smooth-slide', enterDuration: 0.35, x: 1030, y: 105, width: 800, height: 670, fit: 'contain', contentScale: 1.32}),
  image({id: 'hook-art-2', src: TEN_TAIN_ASSETS.detain[2], from: 3.25, duration: 5.4, enter: 'smooth-rise', enterDuration: 0.3, x: 1030, y: 105, width: 800, height: 670, fit: 'contain', contentScale: 1.32}),
]});

const rootMap = 'ten 和 tain 来自拉丁语 tenere，核心画面就是 hold、keep：把东西握住、放住、维持住。前缀告诉你，握住的方向发生了什么变化。';
addScene(scenes, {id: 'ten-tain-root-map', duration: 10.4, narration: rootMap, captions: narrationToCaptions(rootMap, 10.4), sfx: [{at: 0.2, name: 'scribble', volume: 0.1}], transitionOut: WHITE_FADE, layers: [
  text({id: 'root-main', from: 0.05, duration: 8.95, enter: 'smooth-rise', enterDuration: 0.4, x: 140, y: 80, width: 800, fontSize: 104, fontWeight: 850, align: 'center', runs: [{text: 'TEN / TAIN', color: 'accent'}]}),
  text({id: 'root-meaning', from: 0.7, duration: 8.3, enter: 'smooth-slide', enterDuration: 0.35, x: 120, y: 285, width: 830, fontSize: 54, fontWeight: 800, align: 'center', runs: [{text: 'HOLD · KEEP', color: 'primary'}]}),
  text({id: 'root-cn', from: 1.25, duration: 7.7, enter: 'smooth-reveal', enterDuration: 0.4, x: 125, y: 430, width: 820, fontSize: 48, fontWeight: 760, align: 'center', runs: [{text: '持有 · 保持', color: 'accent'}]}),
  image({id: 'root-xiaohei', src: TEN_TAIN_ASSETS.retain[2], from: 0.2, duration: 8.75, enter: 'smooth-slide', enterDuration: 0.45, x: 1020, y: 95, width: 820, height: 690, fit: 'contain', contentScale: 1.25}),
]});

addScene(scenes, wordScene({id: 'retain-word', duration: 9.6, narration: 'retain 是把东西留在手里，不让它流失。retain information，就是把信息记住、保留下来；画面里，检查之后，资料被稳稳收好。', word: 'retain', prefix: 're', root: 'tain', formula: 're- + tain：把东西留住', meaning: '保留；记住', poses: TEN_TAIN_ASSETS.retain}));
addScene(scenes, wordScene({id: 'contain-word', duration: 8.8, narration: 'contain 是把东西放在一个范围里，让它待在里面。The box contains six books，说的就是盒子把六本书装在其中。', word: 'contain', prefix: 'con', root: 'tain', formula: 'con- + tain：一起放在里面', meaning: '包含；容纳', poses: TEN_TAIN_ASSETS.contain, layout: 'right'}));
addScene(scenes, wordScene({id: 'maintain-word', duration: 8.8, narration: 'maintain 是把状态维持住。maintain a routine，表示让一个习惯持续运行；重点在保持原来的稳定。', word: 'maintain', prefix: 'main', root: 'tain', formula: 'main + tain：把状态维持住', meaning: '维持；保持', poses: TEN_TAIN_ASSETS.maintain, layout: 'hero'}));
addScene(scenes, wordScene({id: 'obtain-word', duration: 8.8, narration: 'obtain 先是拿到，再把它握在手里。obtain permission，就是设法获得许可；手续完成，许可到手。', word: 'obtain', prefix: 'ob', root: 'tain', formula: 'ob- + tain：朝着目标拿到', meaning: '获得；得到', poses: TEN_TAIN_ASSETS.obtain, layout: 'right'}));
addScene(scenes, wordScene({id: 'detain-word', duration: 8.8, narration: 'detain 是把人留住，让他暂时不能离开。机场安检 detains a passenger，画面重点是停在边界前，不让人继续走。', word: 'detain', prefix: 'de', root: 'tain', formula: 'de- + tain：把人拦下来', meaning: '拘留；扣留', poses: TEN_TAIN_ASSETS.detain}));
addScene(scenes, wordScene({id: 'sustain-word', duration: 8.8, narration: 'sustain 是把重量、努力或生活撑住。A strong bridge sustains heavy traffic，桥梁把压力稳稳托住。', word: 'sustain', prefix: 'sus', root: 'tain', formula: 'sus- + tain：从下面托住', meaning: '支撑；维持', poses: TEN_TAIN_ASSETS.sustain, layout: 'right'}));
addScene(scenes, wordScene({id: 'entertain-word', duration: 8.8, narration: 'entertain 原来是把注意力 hold 住。表演、故事或节目让观众一直看下去，就是 entertain the audience。', word: 'entertain', prefix: 'enter', root: 'tain', formula: 'enter- + tain：把注意力带进来并留住', meaning: '娱乐；使感兴趣', poses: TEN_TAIN_ASSETS.entertain, layout: 'hero'}));
addScene(scenes, wordScene({id: 'abstain-word', duration: 8.8, narration: 'abstain 是主动把自己 hold back。abstain from sweets，表示克制自己不吃甜食，重点是忍住不做。', word: 'abstain', prefix: 'abs', root: 'tain', formula: 'abs- + tain：把自己拉开并忍住', meaning: '戒除；避免', poses: TEN_TAIN_ASSETS.abstain, layout: 'right'}));

const mapNarration = '把八个词按 hold 的方向分组：retain 留在手里，contain 放在范围里，maintain 维持状态；obtain 拿到，detain 拦住，sustain 托住；entertain 留住注意力，abstain 把自己拉开。';
addScene(scenes, {id: 'ten-tain-family-map', duration: 15.8, narration: mapNarration, captions: narrationToCaptions(mapNarration, 15.8), transitionOut: WHITE_FADE, layers: [
  text({id: 'map-title', from: 0.05, duration: 15.5, enter: 'smooth-rise', enterDuration: 0.38, x: 160, y: 38, width: 1600, fontSize: 58, fontWeight: 820, align: 'center', runs: [{text: '同一个 hold，前缀换方向', color: 'primary'}]}),
  text({id: 'map-row-1', from: 0.8, duration: 14.7, enter: 'smooth-reveal', enterDuration: 0.35, x: 90, y: 190, width: 1380, fontSize: 40, fontWeight: 780, runs: [{text: 'retain / contain / maintain', color: 'primary'}, {text: '  →  ', color: 'primary'}, {text: '留住 / 装住 / 维持', color: 'accent'}]}),
  text({id: 'map-row-2', from: 3.1, duration: 12.4, enter: 'smooth-reveal', enterDuration: 0.35, x: 90, y: 345, width: 1380, fontSize: 40, fontWeight: 780, runs: [{text: 'obtain / detain / sustain', color: 'primary'}, {text: '  →  ', color: 'primary'}, {text: '拿到 / 拦住 / 托住', color: 'accent'}]}),
  text({id: 'map-row-3', from: 5.7, duration: 9.8, enter: 'smooth-reveal', enterDuration: 0.35, x: 90, y: 500, width: 1380, fontSize: 40, fontWeight: 780, runs: [{text: 'entertain / abstain', color: 'primary'}, {text: '  →  ', color: 'primary'}, {text: '留住注意力 / 忍住', color: 'accent'}]}),
  text({id: 'map-tip', from: 8.2, duration: 7.2, enter: 'smooth-slide', enterDuration: 0.32, x: 90, y: 690, width: 1380, fontSize: 34, fontWeight: 720, runs: [{text: '先想“握住什么”，再看前缀把它带向哪里', color: 'primary'}]}),
  image({id: 'map-art-1', src: TEN_TAIN_ASSETS.retain[2], from: 0.2, duration: 5.1, enter: 'smooth-slide', enterDuration: 0.3, x: 1480, y: 165, width: 330, height: 290, fit: 'contain', contentScale: 1.35}),
  image({id: 'map-art-2', src: TEN_TAIN_ASSETS.sustain[2], from: 5.3, duration: 5.2, enter: 'smooth-rise', enterDuration: 0.28, x: 1480, y: 365, width: 330, height: 290, fit: 'contain', contentScale: 1.35}),
  image({id: 'map-art-3', src: TEN_TAIN_ASSETS.entertain[2], from: 10.5, duration: 5.1, enter: 'smooth-rise', enterDuration: 0.28, x: 1480, y: 565, width: 330, height: 290, fit: 'contain', contentScale: 1.35}),
]});

const practice = '小练习：The museum can ____ thousands of visitors in one day。这里强调“把人装在场馆范围内”，你会选 contain 还是 maintain？';
addScene(scenes, {id: 'practice', duration: 10.4, narration: practice, captions: narrationToCaptions(practice, 10.4), sfx: [{at: 0.18, name: 'scribble', volume: 0.09}], transitionOut: WHITE_FADE, layers: [
  text({id: 'practice-title', from: 0.05, duration: hold(10.4, 0.05), enter: 'smooth-rise', enterDuration: 0.38, exit: 'smooth-out', exitDuration: 0.2, x: 160, y: 45, width: 1600, fontSize: 60, fontWeight: 820, align: 'center', runs: [{text: '停一下，选哪个？', color: 'primary'}]}),
  text({id: 'practice-sentence', from: 1.0, duration: hold(10.4, 1.0), enter: 'smooth-reveal', enterDuration: 0.38, exit: 'smooth-out', exitDuration: 0.2, x: 125, y: 235, width: 1670, fontSize: 54, fontWeight: 820, align: 'center', runs: [{text: 'The museum can ', color: 'primary'}, {text: '____', color: 'accent'}, {text: ' thousands of visitors.', color: 'primary'}]}),
  text({id: 'practice-options', from: 3.2, duration: hold(10.4, 3.2), enter: 'smooth-slide', enterDuration: 0.35, exit: 'smooth-out', exitDuration: 0.2, x: 250, y: 450, width: 1420, fontSize: 48, fontWeight: 800, align: 'center', runs: [{text: 'contain  /  maintain', color: 'accent'}]}),
  image({id: 'practice-art', src: TEN_TAIN_ASSETS.contain[2], from: 5.0, duration: hold(10.4, 5.0), enter: 'smooth-rise', enterDuration: 0.3, exit: 'smooth-out', exitDuration: 0.2, x: 680, y: 535, width: 560, height: 330, fit: 'contain', contentScale: 1.25}),
]});

const practiceAnswer = '答案是 contain。museum 是一个范围，游客被容纳在里面；maintain 讲的是把状态维持住，比如 maintain a routine。';
addScene(scenes, {id: 'practice-answer', duration: 11.4, narration: practiceAnswer, captions: narrationToCaptions(practiceAnswer, 11.4), transitionOut: WHITE_FADE, layers: [
  text({id: 'answer-title', from: 0.05, duration: hold(11.4, 0.05), enter: 'smooth-rise', enterDuration: 0.38, exit: 'smooth-out', exitDuration: 0.2, x: 200, y: 55, width: 1520, fontSize: 66, fontWeight: 840, align: 'center', runs: [{text: '答案：contain', color: 'accent'}]}),
  text({id: 'answer-explain', from: 1.0, duration: hold(11.4, 1.0), enter: 'smooth-reveal', enterDuration: 0.34, exit: 'smooth-out', exitDuration: 0.2, x: 180, y: 240, width: 1560, fontSize: 44, fontWeight: 760, align: 'center', runs: [{text: '范围里装得下 → contain', color: 'primary'}]}),
  text({id: 'answer-contrast', from: 3.7, duration: hold(11.4, 3.7), enter: 'smooth-slide', enterDuration: 0.34, exit: 'smooth-out', exitDuration: 0.2, x: 180, y: 420, width: 1560, fontSize: 42, fontWeight: 760, align: 'center', runs: [{text: '状态保持稳定 → maintain', color: 'accent'}]}),
  image({id: 'answer-art', src: TEN_TAIN_ASSETS.maintain[2], from: 6.1, duration: hold(11.4, 6.1), enter: 'smooth-rise', enterDuration: 0.3, exit: 'smooth-out', exitDuration: 0.2, x: 710, y: 560, width: 500, height: 280, fit: 'contain', contentScale: 1.18}),
]});

const summary = '最后收一遍：ten、tain 的核心是 hold、keep。retain 保留，contain 包含，maintain 维持，obtain 获得，detain 扣留，sustain 支撑，entertain 娱乐，abstain 戒除。遇到新词，先把“握住什么”想出来，再让前缀补上方向。';
addScene(scenes, {id: 'ten-tain-summary', duration: 18.6, narration: summary, captions: narrationToCaptions(summary, 18.6), transitionOut: WHITE_FADE, layers: [
  text({id: 'summary-title', from: 0.05, duration: 18.2, enter: 'smooth-rise', enterDuration: 0.38, x: 160, y: 35, width: 1600, fontSize: 58, fontWeight: 820, align: 'center', runs: [{text: 'TEN / TAIN 词族总表', color: 'primary'}]}),
  text({id: 'summary-row-1', from: 0.85, duration: 17.4, enter: 'smooth-reveal', enterDuration: 0.34, x: 90, y: 165, width: 1470, fontSize: 38, fontWeight: 780, runs: [{text: 'retain  保留   ·   contain  包含   ·   maintain  维持', color: 'primary'}]}),
  text({id: 'summary-row-2', from: 3.3, duration: 14.9, enter: 'smooth-reveal', enterDuration: 0.34, x: 90, y: 300, width: 1470, fontSize: 38, fontWeight: 780, runs: [{text: 'obtain  获得   ·   detain  扣留   ·   sustain  支撑', color: 'primary'}]}),
  text({id: 'summary-row-3', from: 5.8, duration: 12.4, enter: 'smooth-reveal', enterDuration: 0.34, x: 90, y: 435, width: 1470, fontSize: 38, fontWeight: 780, runs: [{text: 'entertain  娱乐   ·   abstain  戒除', color: 'primary'}]}),
  text({id: 'summary-tip', from: 8.2, duration: 10.0, enter: 'smooth-slide', enterDuration: 0.34, x: 90, y: 650, width: 1470, fontSize: 34, fontWeight: 720, runs: [{text: '先抓住 hold，再判断前缀改变的方向', color: 'accent'}]}),
  image({id: 'summary-art-1', src: TEN_TAIN_ASSETS.retain[2], from: 0.2, duration: 6.0, enter: 'smooth-slide', enterDuration: 0.3, x: 1515, y: 155, width: 320, height: 285, fit: 'contain', contentScale: 1.36}),
  image({id: 'summary-art-2', src: TEN_TAIN_ASSETS.detain[2], from: 6.2, duration: 6.0, enter: 'smooth-rise', enterDuration: 0.3, x: 1515, y: 355, width: 320, height: 285, fit: 'contain', contentScale: 1.36}),
  image({id: 'summary-art-3', src: TEN_TAIN_ASSETS.entertain[2], from: 12.2, duration: 6.0, enter: 'smooth-rise', enterDuration: 0.3, x: 1515, y: 555, width: 320, height: 285, fit: 'contain', contentScale: 1.36}),
]});

export const tenTainStoryboard: ReplicaStoryboard = {
  id: 'ten-tain',
  duration: scenes[scenes.length - 1].start + scenes[scenes.length - 1].duration,
  fadeToBlackSec: 0.7,
  fadeEndOpacity: 0.82,
  scenes,
};
