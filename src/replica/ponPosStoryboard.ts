import {narrationToCaptions} from './captionUtils';
import type {ReplicaImageLayer, ReplicaScene, ReplicaStoryboard, ReplicaTableLayer, ReplicaTextLayer} from './types';

type KeyposeSet = readonly [string, string, string];

export const PON_POS_ASSETS = {
  compose: ['assets/replica/pon-pos/compose-before.png', 'assets/replica/pon-pos/compose-change.png', 'assets/replica/pon-pos/compose-result.png'] as KeyposeSet,
  expose: ['assets/replica/pon-pos/expose-before.png', 'assets/replica/pon-pos/expose-change.png', 'assets/replica/pon-pos/expose-result.png'] as KeyposeSet,
  impose: ['assets/replica/pon-pos/impose-before.png', 'assets/replica/pon-pos/impose-change.png', 'assets/replica/pon-pos/impose-result.png'] as KeyposeSet,
  propose: ['assets/replica/pon-pos/propose-before.png', 'assets/replica/pon-pos/propose-change.png', 'assets/replica/pon-pos/propose-result.png'] as KeyposeSet,
  oppose: ['assets/replica/pon-pos/oppose-before.png', 'assets/replica/pon-pos/oppose-change.png', 'assets/replica/pon-pos/oppose-result.png'] as KeyposeSet,
  dispose: ['assets/replica/pon-pos/dispose-before.png', 'assets/replica/pon-pos/dispose-change.png', 'assets/replica/pon-pos/dispose-result.png'] as KeyposeSet,
  deposit: ['assets/replica/pon-pos/deposit-before.png', 'assets/replica/pon-pos/deposit-change.png', 'assets/replica/pon-pos/deposit-result.png'] as KeyposeSet,
} as const;

const text = (layer: Omit<ReplicaTextLayer, 'kind'>): ReplicaTextLayer => ({kind: 'text', ...layer});
const image = (layer: Omit<ReplicaImageLayer, 'kind'>): ReplicaImageLayer => ({kind: 'image', ...layer});
const table = (layer: Omit<ReplicaTableLayer, 'kind'>): ReplicaTableLayer => ({kind: 'table', ...layer});
const hold = (duration: number, from: number, tail = 0.22) => Math.max(0.12, duration - from - tail);
const WHITE_FADE = {type: 'white-fade' as const, duration: 0.12};

const poseLayers = (id: string, poses: KeyposeSet, duration: number, x: number, y: number, width: number, height: number, contentScale = 1.2): ReplicaImageLayer[] => {
  const first = 2.6;
  const second = 5.4;
  return [
    image({id: `${id}-before`, src: poses[0], from: 0, duration: first, enter: 'none', exit: 'none', x, y, width, height, fit: 'contain', contentScale}),
    image({id: `${id}-change`, src: poses[1], from: first, duration: second - first, enter: 'none', exit: 'none', x, y, width, height, fit: 'contain', contentScale}),
    image({id: `${id}-result`, src: poses[2], from: second, duration: duration - second, enter: 'none', exit: 'none', x, y, width, height, fit: 'contain', contentScale}),
  ];
};

const addScene = (scenes: ReplicaScene[], input: Omit<ReplicaScene, 'start'>) => {
  const start = scenes.length ? scenes[scenes.length - 1].start + scenes[scenes.length - 1].duration : 0;
  scenes.push({...input, start});
};

const wordScene = (args: {id: string; duration: number; narration: string; word: string; prefix?: string; root?: string; suffix?: string; formula: string; meaning: string; poses: KeyposeSet; layout?: 'left' | 'right' | 'hero'}): Omit<ReplicaScene, 'start'> => {
  const {id, duration, narration, word, prefix = '', root = 'pos', suffix = '', formula, meaning, poses, layout = 'left'} = args;
  if (layout === 'hero') {
    return {id, duration, narration, captions: narrationToCaptions(narration, duration), transitionOut: WHITE_FADE, layers: [
      text({id: `${id}-word`, from: 0.05, duration: hold(duration, 0.05), enter: 'smooth-rise', enterDuration: 0.4, exit: 'smooth-out', exitDuration: 0.2, x: 130, y: 50, width: 1660, fontSize: word.length > 9 ? 74 : 88, fontWeight: 840, align: 'center', runs: [{text: prefix, color: 'primary'}, {text: root, color: 'accent'}, {text: suffix, color: 'primary'}], runMotion: 'assemble'}),
      text({id: `${id}-formula`, from: 0.7, duration: hold(duration, 0.7), enter: 'smooth-reveal', enterDuration: 0.32, exit: 'smooth-out', exitDuration: 0.2, x: 310, y: 165, width: 1300, fontSize: 35, fontWeight: 740, align: 'center', runs: [{text: formula, color: 'primary'}]}),
      ...poseLayers(id, poses, duration, 425, 215, 1070, 590, 1.22),
      text({id: `${id}-meaning`, from: 4.0, duration: hold(duration, 4.0), enter: 'smooth-rise', enterDuration: 0.34, exit: 'smooth-out', exitDuration: 0.2, x: 410, y: 765, width: 1100, fontSize: 43, fontWeight: 820, align: 'center', runs: [{text: meaning, color: 'accent'}]}),
    ]};
  }
  const textX = layout === 'left' ? 95 : 980;
  const artX = layout === 'left' ? 995 : 55;
  return {id, duration, narration, captions: narrationToCaptions(narration, duration), transitionOut: WHITE_FADE, layers: [
    text({id: `${id}-word`, from: 0.05, duration: hold(duration, 0.05), enter: 'smooth-rise', enterDuration: 0.45, exit: 'smooth-out', exitDuration: 0.2, x: textX, y: 125, width: 830, fontSize: word.length > 9 ? 70 : 88, fontWeight: 820, runs: [{text: prefix, color: 'primary'}, {text: root, color: 'accent'}, {text: suffix, color: 'primary'}], runMotion: 'assemble'}),
    text({id: `${id}-formula`, from: 0.85, duration: hold(duration, 0.85), enter: 'smooth-slide', enterDuration: 0.34, exit: 'smooth-out', exitDuration: 0.2, x: textX + 8, y: 295, width: 790, fontSize: 36, fontWeight: 740, runs: [{text: formula, color: 'primary'}]}),
    ...poseLayers(id, poses, duration, artX, 105, 835, 675, 1.18),
    text({id: `${id}-meaning`, from: 3.95, duration: hold(duration, 3.95), enter: 'smooth-reveal', enterDuration: 0.34, exit: 'smooth-out', exitDuration: 0.2, x: textX - 12, y: 515, width: 825, fontSize: 46, fontWeight: 800, align: 'center', runs: [{text: meaning, color: 'accent'}]}),
  ]};
};

const scenes: ReplicaScene[] = [];

addScene(scenes, {id: 'pon-pos-hook', duration: 7, narration: 'compose 是把东西放一起，oppose 却把自己放到对面。它们为什么都像在“放”？', captions: narrationToCaptions('compose 是把东西放一起，oppose 却把自己放到对面。它们为什么都像在“放”？', 7), sfx: [{at: 0.14, name: 'pop', volume: 0.13}, {at: 2.9, name: 'whoosh', volume: 0.11}], transitionOut: WHITE_FADE, layers: [
  text({id: 'hook-left', from: 0.05, duration: 6.7, enter: 'smooth-rise', enterDuration: 0.4, exit: 'smooth-out', exitDuration: 0.2, x: 110, y: 150, width: 820, fontSize: 76, fontWeight: 840, runs: [{text: 'compose', color: 'accent'}, {text: '：放一起', color: 'primary'}]}),
  text({id: 'hook-right', from: 2.55, duration: 4.15, enter: 'smooth-slide', enterDuration: 0.34, exit: 'smooth-out', exitDuration: 0.2, x: 110, y: 360, width: 900, fontSize: 76, fontWeight: 840, runs: [{text: 'oppose', color: 'accent'}, {text: '：放对面', color: 'primary'}]}),
  image({id: 'hook-compose', src: PON_POS_ASSETS.compose[2], from: 0.25, duration: 2.35, enter: 'smooth-slide', enterDuration: 0.35, exit: 'fade', exitDuration: 0.2, x: 1100, y: 140, width: 720, height: 650, fit: 'contain', contentScale: 1.23}),
  image({id: 'hook-oppose', src: PON_POS_ASSETS.oppose[2], from: 2.65, duration: 4.05, enter: 'smooth-rise', enterDuration: 0.3, exit: 'fade', exitDuration: 0.2, x: 1100, y: 140, width: 720, height: 650, fit: 'contain', contentScale: 1.23}),
]});

addScene(scenes, {id: 'pon-pos-root-map', duration: 9, narration: 'pon 和 pos 都可以先记成 put、place，也就是“放置”。真正决定词义的，是前缀把这个放置动作带向哪里。', captions: narrationToCaptions('pon 和 pos 都可以先记成 put、place，也就是“放置”。真正决定词义的，是前缀把这个放置动作带向哪里。', 9), sfx: [{at: 0.18, name: 'scribble', volume: 0.1}], transitionOut: WHITE_FADE, layers: [
  text({id: 'root-main', from: 0.05, duration: 8.7, enter: 'smooth-rise', enterDuration: 0.4, x: 130, y: 90, width: 850, fontSize: 108, fontWeight: 850, align: 'center', runs: [{text: 'PON / POS', color: 'accent'}]}),
  text({id: 'root-meaning', from: 0.7, duration: 8.05, enter: 'smooth-slide', enterDuration: 0.35, x: 140, y: 285, width: 830, fontSize: 54, fontWeight: 800, align: 'center', runs: [{text: 'PUT · PLACE', color: 'primary'}]}),
  text({id: 'root-cn', from: 1.3, duration: 7.45, enter: 'smooth-reveal', enterDuration: 0.4, x: 145, y: 425, width: 820, fontSize: 48, fontWeight: 760, align: 'center', runs: [{text: '放置 · 安放', color: 'accent'}]}),
  image({id: 'root-art', src: PON_POS_ASSETS.compose[2], from: 0.2, duration: 8.55, enter: 'smooth-slide', enterDuration: 0.45, x: 1040, y: 105, width: 820, height: 690, fit: 'contain', contentScale: 1.23}),
]});

addScene(scenes, wordScene({id: 'compose-word', duration: 10, narration: 'compose 是把几个部分放到一起，组成一个整体。比如 The course is composed of four units，这门课由四个单元组成。', word: 'compose', prefix: 'com', root: 'pos', suffix: 'e', formula: 'com- + pos + -e：放到一起', meaning: '组成；构成', poses: PON_POS_ASSETS.compose, layout: 'left'}));
addScene(scenes, wordScene({id: 'expose-word', duration: 11, narration: 'expose 可以想成“放到外面”。盖子掀开，隐藏的东西被看见；The report exposed a hidden problem，报告揭示了一个隐藏问题。', word: 'expose', prefix: 'ex', root: 'pos', suffix: 'e', formula: 'ex- + pos + -e：放到外面', meaning: '揭露；使显露', poses: PON_POS_ASSETS.expose, layout: 'right'}));
addScene(scenes, wordScene({id: 'impose-word', duration: 11.35, narration: 'impose 是把东西放到别人或事情上面，常见的是规则、税或负担。The city imposed a ban on parking，城市实施了禁停规定。', word: 'impose', prefix: 'im', root: 'pos', suffix: 'e', formula: 'im- + pos + -e：放到上面', meaning: '强加；实施', poses: PON_POS_ASSETS.impose, layout: 'hero'}));
addScene(scenes, wordScene({id: 'propose-word', duration: 9.2, narration: 'propose 是把想法放到前面，交给别人考虑。She proposed a practical solution，她提出了一个可行的方案。', word: 'propose', prefix: 'pro', root: 'pos', suffix: 'e', formula: 'pro- + pos + -e：放到前面', meaning: '提议；提出', poses: PON_POS_ASSETS.propose, layout: 'left'}));
addScene(scenes, wordScene({id: 'oppose-word', duration: 11.5, narration: 'oppose 则把自己放到对面，表示反对。The committee opposed the plan，委员会反对这项计划。注意它描述的是立场，不只是“不同意一句话”。', word: 'oppose', prefix: 'op', root: 'pos', suffix: 'e', formula: 'op- + pos + -e：放到对面', meaning: '反对；与……对立', poses: PON_POS_ASSETS.oppose, layout: 'right'}));
addScene(scenes, wordScene({id: 'dispose-word', duration: 11.5, narration: 'dispose 带着“分开摆放、安排”的感觉。最常见的搭配是 dispose of，处理掉或清理掉。Please dispose of the waste properly，请妥善处理垃圾。', word: 'dispose', prefix: 'dis', root: 'pos', suffix: 'e', formula: 'dis- + pos + -e：分开放置', meaning: '处理；处置', poses: PON_POS_ASSETS.dispose, layout: 'hero'}));
addScene(scenes, wordScene({id: 'deposit-word', duration: 11, narration: 'deposit 是把东西放下去。钱可以 deposit into an account，存进账户；也可以说 deposit a sum of money，存入一笔钱。', word: 'deposit', prefix: 'de', root: 'posit', suffix: '', formula: 'de- + posit：向下放置', meaning: '存入；放下；押金', poses: PON_POS_ASSETS.deposit, layout: 'left'}));

const mapNarration = '把方向收一下：compose 放一起，expose 放出来，impose 放上去，propose 放前面，oppose 放对面，dispose 分开放置，deposit 放下去。词根给动作，前缀给方向。';
addScene(scenes, {id: 'pon-pos-family-map', duration: 14.5, narration: mapNarration, captions: narrationToCaptions(mapNarration, 14.5), transitionOut: WHITE_FADE, layers: [
  text({id: 'map-title', from: 0.05, duration: 14.2, enter: 'smooth-rise', enterDuration: 0.38, x: 120, y: 45, width: 1680, fontSize: 58, fontWeight: 820, align: 'center', runs: [{text: '前缀改变方向，词义就换了位置', color: 'primary'}]}),
  text({id: 'map-left-1', from: 0.7, duration: 13.7, enter: 'smooth-reveal', enterDuration: 0.35, x: 100, y: 180, width: 1180, fontSize: 39, fontWeight: 780, runs: [{text: 'compose  →  放一起', color: 'accent'}]}),
  text({id: 'map-left-2', from: 2.25, duration: 12.15, enter: 'smooth-reveal', enterDuration: 0.35, x: 100, y: 300, width: 1180, fontSize: 39, fontWeight: 780, runs: [{text: 'expose   →  放出来', color: 'accent'}]}),
  text({id: 'map-left-3', from: 3.8, duration: 10.6, enter: 'smooth-reveal', enterDuration: 0.35, x: 100, y: 420, width: 1180, fontSize: 39, fontWeight: 780, runs: [{text: 'impose   →  放上去', color: 'accent'}]}),
  text({id: 'map-left-4', from: 5.35, duration: 9.05, enter: 'smooth-reveal', enterDuration: 0.35, x: 100, y: 540, width: 1180, fontSize: 39, fontWeight: 780, runs: [{text: 'propose  →  放前面', color: 'accent'}]}),
  text({id: 'map-right-1', from: 6.9, duration: 7.5, enter: 'smooth-reveal', enterDuration: 0.35, x: 100, y: 660, width: 1180, fontSize: 39, fontWeight: 780, runs: [{text: 'oppose   →  放对面', color: 'accent'}]}),
  text({id: 'map-right-2', from: 8.45, duration: 5.95, enter: 'smooth-reveal', enterDuration: 0.35, x: 100, y: 780, width: 1180, fontSize: 39, fontWeight: 780, runs: [{text: 'dispose / deposit  →  分开 / 向下', color: 'accent'}]}),
  image({id: 'map-compose', src: PON_POS_ASSETS.compose[2], from: 0.25, duration: 4.5, enter: 'smooth-slide', enterDuration: 0.3, x: 1370, y: 175, width: 450, height: 330, fit: 'contain', contentScale: 1.25}),
  image({id: 'map-oppose', src: PON_POS_ASSETS.oppose[2], from: 4.8, duration: 4.3, enter: 'smooth-rise', enterDuration: 0.28, x: 1370, y: 450, width: 450, height: 330, fit: 'contain', contentScale: 1.25}),
  image({id: 'map-deposit', src: PON_POS_ASSETS.deposit[2], from: 9.15, duration: 5.15, enter: 'smooth-rise', enterDuration: 0.28, x: 1370, y: 650, width: 450, height: 330, fit: 'contain', contentScale: 1.25}),
]});

const exampleNarration = '换成搭配，方向会更稳。The course is composed of four units，课程由四个单元组成。The report exposed a hidden problem，报告揭示了隐藏问题。She proposed a practical solution，她提出了可行方案。Please dispose of the waste properly，请妥善处理垃圾。';
addScene(scenes, {id: 'pon-pos-examples', duration: 15.8, narration: exampleNarration, captions: narrationToCaptions(exampleNarration, 15.8), transitionOut: WHITE_FADE, layers: [
  text({id: 'examples-title', from: 0.05, duration: 12.7, enter: 'smooth-rise', enterDuration: 0.38, x: 140, y: 35, width: 1640, fontSize: 58, fontWeight: 820, align: 'center', runs: [{text: '把方向放进真实搭配', color: 'primary'}]}),
  text({id: 'example-1', from: 0.75, duration: 12.1, enter: 'smooth-reveal', enterDuration: 0.34, x: 95, y: 165, width: 1320, fontSize: 34, fontWeight: 740, runs: [{text: 'The course is ', color: 'primary'}, {text: 'composed of four units.', color: 'accent'}, {text: '  课程由四个单元组成。', color: 'primary'}]}),
  text({id: 'example-2', from: 3.25, duration: 9.6, enter: 'smooth-reveal', enterDuration: 0.34, x: 95, y: 320, width: 1320, fontSize: 34, fontWeight: 740, runs: [{text: 'The report ', color: 'primary'}, {text: 'exposed a hidden problem.', color: 'accent'}, {text: '  报告揭示了隐藏问题。', color: 'primary'}]}),
  text({id: 'example-3', from: 6.0, duration: 6.85, enter: 'smooth-reveal', enterDuration: 0.34, x: 95, y: 475, width: 1320, fontSize: 34, fontWeight: 740, runs: [{text: 'She ', color: 'primary'}, {text: 'proposed a practical solution.', color: 'accent'}, {text: '  她提出了可行方案。', color: 'primary'}]}),
  text({id: 'example-4', from: 8.75, duration: 4.1, enter: 'smooth-reveal', enterDuration: 0.34, x: 95, y: 630, width: 1320, fontSize: 34, fontWeight: 740, runs: [{text: 'Please ', color: 'primary'}, {text: 'dispose of the waste properly.', color: 'accent'}, {text: '  请妥善处理垃圾。', color: 'primary'}]}),
  image({id: 'example-art-1', src: PON_POS_ASSETS.compose[2], from: 0.35, duration: 3.0, enter: 'smooth-slide', enterDuration: 0.3, x: 1450, y: 210, width: 390, height: 470, fit: 'contain', contentScale: 1.28}),
  image({id: 'example-art-2', src: PON_POS_ASSETS.expose[2], from: 3.4, duration: 2.75, enter: 'smooth-rise', enterDuration: 0.28, x: 1450, y: 210, width: 390, height: 470, fit: 'contain', contentScale: 1.28}),
  image({id: 'example-art-3', src: PON_POS_ASSETS.propose[2], from: 6.15, duration: 2.75, enter: 'smooth-rise', enterDuration: 0.28, x: 1450, y: 210, width: 390, height: 470, fit: 'contain', contentScale: 1.28}),
  image({id: 'example-art-4', src: PON_POS_ASSETS.dispose[2], from: 8.9, duration: 3.0, enter: 'smooth-rise', enterDuration: 0.28, x: 1450, y: 210, width: 390, height: 470, fit: 'contain', contentScale: 1.28}),
]});

const practiceNarration = '小练习，先看方向。第一句，四个单元被放到一起，填 composed。第二句，隐藏问题被放出来，填 exposed。第三句，方案被放到别人面前，填 proposed。最后，垃圾被处理掉，搭配是 dispose of。';
addScene(scenes, {id: 'pon-pos-practice', duration: 15, narration: practiceNarration, captions: narrationToCaptions(practiceNarration, 15), sfx: [{at: 0.18, name: 'pop', volume: 0.1}, {at: 8.1, name: 'stamp', volume: 0.1}], transitionOut: WHITE_FADE, layers: [
  text({id: 'practice-title', from: 0.05, duration: 14.7, enter: 'smooth-rise', enterDuration: 0.38, x: 190, y: 35, width: 1540, fontSize: 61, fontWeight: 820, align: 'center', runs: [{text: '小练习：看它被放到哪里', color: 'primary'}]}),
  text({id: 'practice-q1', from: 0.7, duration: 14.05, enter: 'smooth-reveal', enterDuration: 0.34, x: 90, y: 170, width: 1710, fontSize: 37, fontWeight: 760, runs: [{text: 'The course is made up of four units. It is ', color: 'primary'}, {text: '____.', color: 'accent'}]}),
  text({id: 'practice-q2', from: 4.35, duration: 10.4, enter: 'smooth-reveal', enterDuration: 0.34, x: 90, y: 325, width: 1710, fontSize: 37, fontWeight: 760, runs: [{text: 'The report showed a hidden problem. It ', color: 'primary'}, {text: '____', color: 'accent'}, {text: ' the problem.', color: 'primary'}]}),
  text({id: 'practice-q3', from: 7.9, duration: 6.85, enter: 'smooth-reveal', enterDuration: 0.34, x: 90, y: 480, width: 1710, fontSize: 37, fontWeight: 760, runs: [{text: 'She put the plan before the team. She ', color: 'primary'}, {text: '____', color: 'accent'}, {text: ' it.', color: 'primary'}]}),
  text({id: 'practice-answers', from: 11.6, duration: 3.15, enter: 'smooth-slide', enterDuration: 0.32, x: 120, y: 700, width: 1500, fontSize: 34, fontWeight: 780, align: 'center', runs: [{text: '答案：composed · exposed · proposed · dispose of', color: 'accent'}]}),
  image({id: 'practice-art-1', src: PON_POS_ASSETS.compose[2], from: 0.35, duration: 3.8, enter: 'smooth-slide', enterDuration: 0.3, x: 1470, y: 650, width: 350, height: 290, fit: 'contain', contentScale: 1.32}),
  image({id: 'practice-art-2', src: PON_POS_ASSETS.expose[2], from: 4.15, duration: 3.7, enter: 'smooth-rise', enterDuration: 0.28, x: 1470, y: 650, width: 350, height: 290, fit: 'contain', contentScale: 1.32}),
  image({id: 'practice-art-3', src: PON_POS_ASSETS.propose[2], from: 7.85, duration: 3.65, enter: 'smooth-rise', enterDuration: 0.28, x: 1470, y: 650, width: 350, height: 290, fit: 'contain', contentScale: 1.32}),
]});

const answerNarration = '做题时先找前缀的方向：com- 是一起，ex- 是出来，pro- 是向前。oppose 是对立，dispose of 是处理掉，deposit 是向下放入。不要只盯着 pos 的拼写。';
addScene(scenes, {id: 'pon-pos-practice-explanation', duration: 13.8, narration: answerNarration, captions: narrationToCaptions(answerNarration, 13.8), transitionOut: WHITE_FADE, layers: [
  text({id: 'answer-title', from: 0.05, duration: 10.25, enter: 'smooth-rise', enterDuration: 0.38, x: 170, y: 50, width: 1580, fontSize: 60, fontWeight: 820, align: 'center', runs: [{text: '先看方向，再看词义', color: 'primary'}]}),
  text({id: 'answer-together', from: 0.7, duration: 9.75, enter: 'smooth-reveal', enterDuration: 0.34, x: 115, y: 210, width: 900, fontSize: 41, fontWeight: 780, runs: [{text: 'com- / ex- / pro-  ', color: 'accent'}, {text: '一起 / 出来 / 向前', color: 'primary'}]}),
  text({id: 'answer-opposite', from: 2.9, duration: 7.55, enter: 'smooth-reveal', enterDuration: 0.34, x: 115, y: 365, width: 900, fontSize: 41, fontWeight: 780, runs: [{text: 'op- / dis- / de-  ', color: 'accent'}, {text: '对面 / 分开 / 向下', color: 'primary'}]}),
  text({id: 'answer-note', from: 5.1, duration: 5.35, enter: 'smooth-reveal', enterDuration: 0.34, x: 115, y: 520, width: 900, fontSize: 38, fontWeight: 740, runs: [{text: 'pos 会变成 pon / posit，动作线索还在。', color: 'accent'}]}),
  image({id: 'answer-art-1', src: PON_POS_ASSETS.propose[2], from: 0.25, duration: 3.4, enter: 'smooth-slide', enterDuration: 0.3, x: 1135, y: 195, width: 675, height: 580, fit: 'contain', contentScale: 1.28}),
  image({id: 'answer-art-2', src: PON_POS_ASSETS.oppose[2], from: 3.65, duration: 3.3, enter: 'smooth-rise', enterDuration: 0.28, x: 1135, y: 195, width: 675, height: 580, fit: 'contain', contentScale: 1.28}),
  image({id: 'answer-art-3', src: PON_POS_ASSETS.deposit[2], from: 6.95, duration: 3.3, enter: 'smooth-rise', enterDuration: 0.28, x: 1135, y: 195, width: 675, height: 580, fit: 'contain', contentScale: 1.28}),
]});

const summaryNarration = '最后过一遍：compose 组成，expose 揭露，impose 强加，propose 提议，oppose 反对，dispose 处理，deposit 存入。看到 pon、pos、posit，先想 put / place，再问：放到哪里？';
addScene(scenes, {id: 'pon-pos-summary', duration: 17.8, narration: summaryNarration, captions: narrationToCaptions(summaryNarration, 17.8), sfx: [{at: 0.2, name: 'pop', volume: 0.1}], transitionOut: WHITE_FADE, layers: [
  text({id: 'summary-root', from: 0.05, duration: 17.6, enter: 'smooth-rise', enterDuration: 0.38, x: 70, y: 45, width: 740, fontSize: 86, fontWeight: 840, align: 'center', runs: [{text: 'PON / POS', color: 'accent'}]}),
  text({id: 'summary-meaning', from: 0.75, duration: 16.9, enter: 'smooth-slide', enterDuration: 0.34, x: 80, y: 170, width: 720, fontSize: 42, fontWeight: 780, align: 'center', runs: [{text: 'PUT · PLACE', color: 'primary'}]}),
  table({id: 'summary-rows', from: 1.1, duration: 16.5, enter: 'smooth-reveal', enterDuration: 0.38, x: 75, y: 275, width: 930, height: 590, rows: [
    {word: 'compose', meaning: '组成；构成', accent: 'orange'},
    {word: 'expose', meaning: '揭露；使显露'},
    {word: 'impose', meaning: '强加；实施'},
    {word: 'propose', meaning: '提议；提出'},
    {word: 'oppose', meaning: '反对；对立'},
    {word: 'dispose', meaning: '处理；处置'},
    {word: 'deposit', meaning: '存入；放下'},
  ], rowFromStep: 0.42, wordFontSize: 27, meaningFontSize: 27, wordColumnFraction: 0.5, compact: true}),
  image({id: 'summary-art-1', src: PON_POS_ASSETS.compose[2], from: 0.2, duration: 4.1, enter: 'smooth-slide', enterDuration: 0.3, x: 1115, y: 230, width: 720, height: 610, fit: 'contain', contentScale: 1.25}),
  image({id: 'summary-art-2', src: PON_POS_ASSETS.oppose[2], from: 4.3, duration: 4.0, enter: 'smooth-rise', enterDuration: 0.28, x: 1115, y: 230, width: 720, height: 610, fit: 'contain', contentScale: 1.25}),
  image({id: 'summary-art-3', src: PON_POS_ASSETS.deposit[2], from: 8.3, duration: 4.0, enter: 'smooth-rise', enterDuration: 0.28, x: 1115, y: 230, width: 720, height: 610, fit: 'contain', contentScale: 1.25}),
  image({id: 'summary-art-4', src: PON_POS_ASSETS.expose[2], from: 12.3, duration: 5.5, enter: 'smooth-rise', enterDuration: 0.28, x: 1115, y: 230, width: 720, height: 610, fit: 'contain', contentScale: 1.25}),
]});

export const ponPosStoryboard: ReplicaStoryboard = {id: 'pon-pos', duration: scenes[scenes.length - 1].start + scenes[scenes.length - 1].duration, fadeToBlackSec: 0.7, fadeEndOpacity: 0.84, scenes};

