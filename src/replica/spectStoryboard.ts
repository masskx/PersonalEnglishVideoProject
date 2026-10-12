import {narrationToCaptions} from './captionUtils';
import type {
  ReplicaArrowLayer,
  ReplicaIconLayer,
  ReplicaImageLayer,
  ReplicaRadialLayer,
  ReplicaScene,
  ReplicaStoryboard,
  ReplicaTableLayer,
  ReplicaTextLayer,
} from './types';

export const SPECT_REPLICA_ASSETS = {
  lookHook: 'assets/replica/spect/00_look_hook.png',
  inspectInside: 'assets/replica/spect/01_inspect_inside.png',
  respectBack: 'assets/replica/spect/02_respect_back.png',
  suspectUnder: 'assets/replica/spect/03_suspect_under.png',
  expectOut: 'assets/replica/spect/04_expect_out.png',
  prospectForward: 'assets/replica/spect/05_prospect_forward.png',
  spectatorWatch: 'assets/replica/spect/06_spectator_watch.png',
  spectacleShow: 'assets/replica/spect/07_spectacle_show.png',
  retrospectBackwards: 'assets/replica/spect/08_retrospect_backwards.png',
} as const;

const SPECT_DURATION = 117.9;
const WHITE_FADE = {type: 'white-fade' as const, duration: 0.16};
const hold = (duration: number, from: number, tail = 0.2) =>
  Number(Math.max(0.12, duration - from - tail).toFixed(3));
const text = (layer: Omit<ReplicaTextLayer, 'kind'>): ReplicaTextLayer => ({kind: 'text', ...layer});
const image = (layer: Omit<ReplicaImageLayer, 'kind'>): ReplicaImageLayer => ({kind: 'image', ...layer});
const arrow = (layer: Omit<ReplicaArrowLayer, 'kind'>): ReplicaArrowLayer => ({kind: 'arrow', ...layer});
const icon = (layer: Omit<ReplicaIconLayer, 'kind'>): ReplicaIconLayer => ({kind: 'icon', ...layer});
const table = (layer: Omit<ReplicaTableLayer, 'kind'>): ReplicaTableLayer => ({kind: 'table', ...layer});
const radial = (layer: Omit<ReplicaRadialLayer, 'kind'>): ReplicaRadialLayer => ({kind: 'radial', ...layer});

const wordScene = ({id, start, duration = 9, narration, prefix, stem = 'spect', suffix = '', formula, meaning, asset, motion = 'right'}: {
  id: string; start: number; duration?: number; narration: string; prefix: string; stem?: string; suffix?: string; formula: string; meaning: string; asset: string; motion?: 'right' | 'left' | 'down' | 'up';
}): ReplicaScene => ({
  id, start, duration, narration, captions: narrationToCaptions(narration, duration),
  sfx: [{at: 0.12, name: 'whoosh', volume: 0.18}, {at: 3, name: 'pop', volume: 0.15}],
  layers: [
    text({id: `${id}-word`, from: 0.05, duration: hold(duration, 0.05), enter: 'pop', enterDuration: 0.42, exit: 'fade', exitDuration: 0.2, x: 75, y: 90, width: 920, fontSize: prefix.length + suffix.length > 5 ? 108 : 124, fontWeight: 800, runs: [{text: prefix, color: 'primary'}, {text: stem, color: 'accent'}, {text: suffix, color: 'primary'}]}),
    text({id: `${id}-formula`, from: 0.7, duration: hold(duration, 0.7), enter: 'wipe-up', enterDuration: 0.34, exit: 'fade', exitDuration: 0.2, x: 105, y: 275, width: 790, fontSize: 48, fontWeight: 760, runs: [{text: formula, color: 'primary'}]}),
    image({id: `${id}-image`, src: asset, from: 0.3, duration: hold(duration, 0.3), enter: motion === 'left' ? 'slide-right' : 'slide-left', enterDuration: 0.46, exit: 'fade', exitDuration: 0.2, x: 790, y: 65, width: 1030, height: 740, fit: 'contain'}),
    arrow({id: `${id}-arrow`, from: 2.3, duration: hold(duration, 2.3), enter: 'draw', enterDuration: 0.46, exit: 'fade', exitDuration: 0.2, x: 1080, y: 535, width: 590, height: 120, path: motion === 'left' ? 'M560 32 C385 56 220 72 28 95' : motion === 'down' ? 'M290 15 C290 45 290 72 290 102' : motion === 'up' ? 'M290 105 C290 75 290 48 290 18' : 'M25 72 C205 46 380 46 555 70', viewBox: '0 0 590 120', color: 'accent', strokeWidth: 8, headSize: 23}),
    text({id: `${id}-meaning`, from: 4.1, duration: hold(duration, 4.1), enter: 'pop', enterDuration: 0.36, exit: 'fade', exitDuration: 0.2, x: 125, y: 500, width: 680, fontSize: 68, fontWeight: 800, align: 'center', runs: [{text: meaning, color: 'accent'}]}),
  ], transitionOut: WHITE_FADE,
});

const scenes: ReplicaScene[] = [
  {
    id: 'look-hook', start: 0, duration: 8,
    narration: '今天只记一只观察镜头：spect，核心就是 look，看、观察。看到 spect，就想象小黑把眼睛贴上镜头，认真去看。',
    captions: narrationToCaptions('今天只记一只观察镜头：spect，核心就是 look，看、观察。看到 spect，就想象小黑把眼睛贴上镜头，认真去看。', 8),
    sfx: [{at: 0.18, name: 'pop', volume: 0.18}, {at: 2.5, name: 'whoosh', volume: 0.2}],
    layers: [
      text({id: 'hook-spect', from: 0.05, duration: hold(7.7, 0.05), enter: 'pop', enterDuration: 0.46, exit: 'fade', exitDuration: 0.2, x: 100, y: 145, width: 700, fontSize: 160, fontWeight: 800, align: 'center', runs: [{text: 'SPECT', color: 'accent'}]}),
      text({id: 'hook-equals', from: 0.7, duration: hold(7.7, 0.7), enter: 'rise', enterDuration: 0.35, exit: 'fade', exitDuration: 0.2, x: 190, y: 350, width: 520, fontSize: 78, fontWeight: 800, align: 'center', runs: [{text: '= LOOK', color: 'primary'}]}),
      text({id: 'hook-meaning', from: 1.25, duration: hold(7.7, 1.25), enter: 'wipe-up', enterDuration: 0.34, exit: 'fade', exitDuration: 0.2, x: 190, y: 495, width: 520, fontSize: 64, fontWeight: 780, align: 'center', runs: [{text: '看 / 观察', color: 'primary'}]}),
      image({id: 'hook-image', src: SPECT_REPLICA_ASSETS.lookHook, from: 0.3, duration: hold(7.7, 0.3), enter: 'slide-left', enterDuration: 0.5, exit: 'fade', exitDuration: 0.2, x: 780, y: 75, width: 1030, height: 740, fit: 'contain'}),
      icon({id: 'hook-spark', icon: 'spark', from: 2.7, duration: hold(7.7, 2.7), enter: 'pop', enterDuration: 0.28, exit: 'fade', exitDuration: 0.2, x: 1570, y: 230, width: 92, height: 92, color: 'accent'}),
    ], transitionOut: WHITE_FADE,
  },
  {
    id: 'viewfinder-map', start: 8, duration: 11.5,
    narration: '把 spect 当成镜头。前缀决定镜头朝哪里：in 向里，re 回头，sub 从下看，ex 向外，pro 向前，retro 向后；后缀则告诉你，是谁在看，或什么值得看。',
    captions: narrationToCaptions('把 spect 当成镜头。前缀决定镜头朝哪里：in 向里，re 回头，sub 从下看，ex 向外，pro 向前，retro 向后；后缀则告诉你，是谁在看，或什么值得看。', 11.5),
    sfx: [{at: 0.18, name: 'scribble', volume: 0.17}, {at: 4, name: 'press', volume: 0.14}],
    layers: [
      text({id: 'map-title', from: 0.05, duration: hold(11.1, 0.05), enter: 'rise', enterDuration: 0.38, exit: 'fade', exitDuration: 0.2, x: 200, y: 60, width: 1520, fontSize: 68, fontWeight: 800, align: 'center', runs: [{text: '前缀 = 镜头方向　后缀 = 观看角色', color: 'primary'}]}),
      radial({id: 'map-radial', from: 0.55, duration: hold(11.1, 0.55), enter: 'pop', enterDuration: 0.48, exit: 'fade', exitDuration: 0.2, x: 110, y: 165, width: 1700, height: 650, center: [{text: '-spect-', color: 'accent', weight: 800, size: 76}, {text: '\n看', color: 'primary', weight: 760, size: 44}], items: [{text: 'in-  向里', angle: 210, color: 'primary'}, {text: 're-  回看', angle: 150, color: 'primary'}, {text: 'sub-  下方', angle: 90, color: 'primary'}, {text: 'ex-  向外', angle: 330, color: 'primary'}, {text: 'pro-  向前', angle: 270, color: 'primary'}, {text: 'retro-  向后', angle: 30, color: 'primary'}], radiusX: 590, radiusY: 245}),
      text({id: 'map-suffix', from: 6.3, duration: hold(11.1, 6.3), enter: 'rise', enterDuration: 0.34, exit: 'fade', exitDuration: 0.2, x: 480, y: 760, width: 960, fontSize: 42, fontWeight: 760, align: 'center', runs: [{text: '-ator 观看的人　-acle 值得看的场面', color: 'accent'}]}),
    ], transitionOut: WHITE_FADE,
  },
  wordScene({id: 'inspect-look-inside', start: 19.5, prefix: 'in', formula: 'in- = into  向里面看', meaning: '检查；视察', asset: SPECT_REPLICA_ASSETS.inspectInside, narration: 'inspect 的 in 表示 into，向里面。把镜头伸进去仔细看，就是 inspect，检查、视察。别只扫一眼，要看到内部细节。'}),
  wordScene({id: 'respect-look-back', start: 28.5, duration: 9.1, prefix: 're', formula: 're- = back / again  回看', meaning: '尊重；重视', asset: SPECT_REPLICA_ASSETS.respectBack, motion: 'left', narration: 'respect 的 re 可以记成 back 或 again，回头再看。愿意认真看见一个人的价值，就是 respect，尊重、重视。这里是词源记忆钩子，不是机械直译。'}),
  wordScene({id: 'suspect-look-under', start: 37.6, duration: 9.2, prefix: 'su', formula: 'sus- ← sub- = under  从下看', meaning: '怀疑；嫌疑人', asset: SPECT_REPLICA_ASSETS.suspectUnder, motion: 'up', narration: 'suspect 里的 sus，历史上和 sub 有关，可以记成 under，从下面偷偷观察。越看越觉得不对，于是 suspect 就是怀疑，也可以指嫌疑人。'}),
  wordScene({id: 'expect-look-out', start: 46.8, prefix: 'ex', stem: 'pect', formula: 'ex- = out  向外张望（s 省写）', meaning: '期待；预料', asset: SPECT_REPLICA_ASSETS.expectOut, narration: 'expect 的 ex 表示 out。站着向外张望，等某件事出现，就是 expect，期待、预料。它的画面是把目光投向还没到来的东西。'}),
  wordScene({id: 'prospect-look-forward', start: 55.8, prefix: 'pro', formula: 'pro- = forward  向前看', meaning: '前景；展望', asset: SPECT_REPLICA_ASSETS.prospectForward, narration: 'prospect 的 pro 表示 forward，向前。抬起镜头看前方可能出现什么，就是 prospect，前景、展望，也常指有希望的可能性。'}),
  wordScene({id: 'spectator-person-watching', start: 64.8, prefix: '', suffix: 'ator', formula: '-ator = person who  做……的人', meaning: '观众；旁观者', asset: SPECT_REPLICA_ASSETS.spectatorWatch, narration: 'spectator 保留 spect 的看，再加 ator，表示做这个动作的人。负责坐着观看的人，就是 spectator，观众、旁观者。', motion: 'right'}),
  wordScene({id: 'spectacle-thing-seen', start: 73.8, duration: 9.1, prefix: '', suffix: 'acle', formula: '-acle = thing to be seen  可看的场面', meaning: '景象；壮观场面', asset: SPECT_REPLICA_ASSETS.spectacleShow, narration: 'spectacle 也是从看出发。把它记成一个值得所有人抬头观看的场面，就是 spectacle，景象、壮观场面。复数 spectacles 还可以表示眼镜。'}),
  wordScene({id: 'retrospect-look-backwards', start: 82.9, prefix: 'retro', formula: 'retro- = backward  向后看', meaning: '回顾；追溯', asset: SPECT_REPLICA_ASSETS.retrospectBackwards, motion: 'left', narration: 'retrospect 的 retro 表示 backward，向后。把镜头转回过去重新看，就是 retrospect，回顾、追溯。in retrospect 就是回过头来看。'}),
  {
    id: 'example-sentences', start: 91.9, duration: 12,
    narration: '把镜头放回句子：Please inspect the machine，请检查机器。We respect her choice，我们尊重她的选择。I expect good news，我期待好消息。In retrospect, I was wrong，回头看，当时我错了。',
    captions: narrationToCaptions('把镜头放回句子：Please inspect the machine，请检查机器。We respect her choice，我们尊重她的选择。I expect good news，我期待好消息。In retrospect, I was wrong，回头看，当时我错了。', 12),
    sfx: [{at: 0.12, name: 'scribble', volume: 0.16}, {at: 2.6, name: 'pop', volume: 0.12}, {at: 5.2, name: 'pop', volume: 0.12}, {at: 7.8, name: 'pop', volume: 0.12}],
    layers: [
      text({id: 'examples-title', from: 0.05, duration: hold(11.5, 0.05), enter: 'rise', enterDuration: 0.38, exit: 'fade', exitDuration: 0.2, x: 260, y: 55, width: 1400, align: 'center', fontSize: 68, fontWeight: 800, runs: [{text: '把观察镜头放回句子', color: 'primary'}]}),
      text({id: 'example-inspect', from: 0.75, duration: hold(11.5, 0.75), enter: 'typewriter', enterDuration: 0.4, exit: 'fade', exitDuration: 0.2, x: 145, y: 185, width: 1650, fontSize: 42, fontWeight: 700, typewriterCharsPerSec: 22, runs: [{text: 'Please ', color: 'primary'}, {text: 'inspect', color: 'accent'}, {text: ' the machine.  请检查机器。', color: 'primary'}]}),
      text({id: 'example-respect', from: 3.15, duration: hold(11.5, 3.15), enter: 'typewriter', enterDuration: 0.4, exit: 'fade', exitDuration: 0.2, x: 145, y: 305, width: 1650, fontSize: 42, fontWeight: 700, typewriterCharsPerSec: 22, runs: [{text: 'We ', color: 'primary'}, {text: 'respect', color: 'accent'}, {text: ' her choice.  我们尊重她的选择。', color: 'primary'}]}),
      text({id: 'example-expect', from: 5.55, duration: hold(11.5, 5.55), enter: 'typewriter', enterDuration: 0.4, exit: 'fade', exitDuration: 0.2, x: 145, y: 425, width: 1650, fontSize: 42, fontWeight: 700, typewriterCharsPerSec: 22, runs: [{text: 'I ', color: 'primary'}, {text: 'expect', color: 'accent'}, {text: ' good news.  我期待好消息。', color: 'primary'}]}),
      text({id: 'example-retro', from: 7.95, duration: hold(11.5, 7.95), enter: 'typewriter', enterDuration: 0.4, exit: 'fade', exitDuration: 0.2, x: 145, y: 545, width: 1650, fontSize: 42, fontWeight: 700, typewriterCharsPerSec: 22, runs: [{text: 'In ', color: 'primary'}, {text: 'retrospect', color: 'accent'}, {text: ', I was wrong.  回头看，当时我错了。', color: 'primary'}]}),
      text({id: 'example-hook', from: 9.75, duration: hold(11.5, 9.75), enter: 'rise', enterDuration: 0.34, exit: 'fade', exitDuration: 0.2, x: 320, y: 700, width: 1280, fontSize: 42, fontWeight: 760, align: 'center', runs: [{text: '先找镜头方向，再还原词义', color: 'accent'}]}),
    ], transitionOut: WHITE_FADE,
  },
  {
    id: 'final-summary', start: 103.9, duration: 14,
    narration: '最后收口：spect 就是 look，看。in 向里检查，re 回看并重视，sus 从下看而怀疑，ex 向外期待，pro 向前看前景；ator 是观看的人，acle 是可看的场面，retro 则向后回顾。',
    captions: narrationToCaptions('最后收口：spect 就是 look，看。in 向里检查，re 回看并重视，sus 从下看而怀疑，ex 向外期待，pro 向前看前景；ator 是观看的人，acle 是可看的场面，retro 则向后回顾。', 13.45),
    sfx: [{at: 0.12, name: 'stamp', volume: 0.18}, {at: 5.2, name: 'pop', volume: 0.13}],
    layers: [
      text({id: 'summary-title', from: 0.05, duration: hold(13.3, 0.05, 0.08), enter: 'rise', enterDuration: 0.38, exit: 'fade', exitDuration: 0.16, x: 250, y: 38, width: 1420, align: 'center', fontSize: 64, fontWeight: 800, runs: [{text: 'spect = ', color: 'primary'}, {text: '看 / 观察', color: 'accent'}]}),
      table({id: 'summary-table', from: 0.35, duration: hold(13.3, 0.35, 0.08), enter: 'rise', enterDuration: 0.42, exit: 'fade', exitDuration: 0.16, x: 120, y: 125, width: 1680, height: 675, columns: 1, rowFromStep: 0.42, compact: true, variant: 'open', partInMeaning: true, wordFontSize: 37, phoneticFontSize: 23, meaningFontSize: 30, wordColumnFraction: 0.37, rows: [
        {word: 'inspect', phonetic: '/ɪnˈspekt/', part: 'v.', meaning: 'in- 向里 → 检查；视察', accent: 'spect'},
        {word: 'respect', phonetic: '/rɪˈspekt/', part: 'v./n.', meaning: 're- 回看 → 尊重；重视', accent: 'spect'},
        {word: 'suspect', phonetic: '/səˈspekt/', part: 'v./n.', meaning: 'sus- 下方 → 怀疑；嫌疑人', accent: 'spect'},
        {word: 'expect', phonetic: '/ɪkˈspekt/', part: 'v.', meaning: 'ex- 向外；s 省写 → 期待；预料', accent: 'pect'},
        {word: 'prospect', phonetic: '/ˈprɒspekt/', part: 'n.', meaning: 'pro- 向前 → 前景；展望', accent: 'spect'},
        {word: 'spectator', phonetic: '/spekˈteɪtə/', part: 'n.', meaning: '-ator 人 → 观众；旁观者', accent: 'spect'},
        {word: 'spectacle', phonetic: '/ˈspektəkl/', part: 'n.', meaning: '-acle 场面 → 景象；壮观场面', accent: 'spect'},
        {word: 'retrospect', phonetic: '/ˈretrəspekt/', part: 'n./v.', meaning: 'retro- 向后 → 回顾；追溯', accent: 'spect'},
      ]}),
    ],
  },
];

export const spectStoryboard: ReplicaStoryboard = {
  id: 'spect', duration: SPECT_DURATION, fadeToBlackSec: 0.5, fadeEndOpacity: 1, scenes,
};
