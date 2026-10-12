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

export const JECT_REPLICA_ASSETS = {
  throwHook: 'assets/replica/ject/00_throw_hook.png',
  directionMachine: 'assets/replica/ject/01_direction_machine.png',
  rejectReturn: 'assets/replica/ject/02_reject_return.png',
  projectForward: 'assets/replica/ject/03_project_forward.png',
  injectInside: 'assets/replica/ject/04_inject_inside.png',
  objectAgainst: 'assets/replica/ject/05_object_against.png',
  subjectUnder: 'assets/replica/ject/06_subject_under.png',
} as const;

const JECT_DURATION = 105;
const WHITE_FADE = {type: 'white-fade' as const, duration: 0.16};
const hold = (duration: number, from: number, tail = 0.2) =>
  Number(Math.max(0.12, duration - from - tail).toFixed(3));

const text = (layer: Omit<ReplicaTextLayer, 'kind'>): ReplicaTextLayer => ({kind: 'text', ...layer});
const image = (layer: Omit<ReplicaImageLayer, 'kind'>): ReplicaImageLayer => ({kind: 'image', ...layer});
const arrow = (layer: Omit<ReplicaArrowLayer, 'kind'>): ReplicaArrowLayer => ({kind: 'arrow', ...layer});
const icon = (layer: Omit<ReplicaIconLayer, 'kind'>): ReplicaIconLayer => ({kind: 'icon', ...layer});
const table = (layer: Omit<ReplicaTableLayer, 'kind'>): ReplicaTableLayer => ({kind: 'table', ...layer});
const radial = (layer: Omit<ReplicaRadialLayer, 'kind'>): ReplicaRadialLayer => ({kind: 'radial', ...layer});

const scenes: ReplicaScene[] = [
  {
    id: 'throw-hook',
    start: 0,
    duration: 8,
    narration: '今天只记一个动作：ject，意思就是 throw，投、扔。看到它，就想象小黑把东西用力投出去。',
    captions: narrationToCaptions('今天只记一个动作：ject，意思就是 throw，投、扔。看到它，就想象小黑把东西用力投出去。', 8),
    sfx: [{at: 0.2, name: 'pop', volume: 0.18}, {at: 2.7, name: 'whoosh', volume: 0.22}],
    layers: [
      text({id: 'hook-ject', from: 0.05, duration: hold(8, 0.05), enter: 'pop', enterDuration: 0.46, exit: 'fade', exitDuration: 0.2, x: 120, y: 160, width: 680, fontSize: 170, fontWeight: 800, align: 'center', runs: [{text: 'JECT', color: 'accent'}]}),
      text({id: 'hook-equals', from: 0.65, duration: hold(8, 0.65), enter: 'rise', enterDuration: 0.35, exit: 'fade', exitDuration: 0.2, x: 235, y: 365, width: 460, fontSize: 76, fontWeight: 800, align: 'center', runs: [{text: '= THROW', color: 'primary'}]}),
      text({id: 'hook-meaning', from: 1.2, duration: hold(8, 1.2), enter: 'wipe-up', enterDuration: 0.34, exit: 'fade', exitDuration: 0.2, x: 250, y: 505, width: 430, fontSize: 70, fontWeight: 780, align: 'center', runs: [{text: '投出去', color: 'primary'}]}),
      image({id: 'hook-image', src: JECT_REPLICA_ASSETS.throwHook, from: 0.3, duration: hold(8, 0.3), enter: 'slide-left', enterDuration: 0.5, exit: 'fade', exitDuration: 0.2, x: 785, y: 80, width: 1000, height: 740, fit: 'contain'}),
      arrow({id: 'hook-arrow', from: 2.45, duration: hold(8, 2.45), enter: 'draw', enterDuration: 0.46, exit: 'fade', exitDuration: 0.2, x: 1125, y: 535, width: 535, height: 130, path: 'M20 92 C170 70 330 54 492 30', viewBox: '0 0 535 130', color: 'accent', strokeWidth: 8, headSize: 22, zIndex: 4}),
      icon({id: 'hook-impact', icon: 'impact', from: 3.05, duration: hold(8, 3.05), enter: 'pop', enterDuration: 0.28, exit: 'fade', exitDuration: 0.2, x: 1605, y: 470, width: 90, height: 90, color: 'accent'}),
    ],
    transitionOut: WHITE_FADE,
  },
  {
    id: 'prefix-direction-machine',
    start: 8,
    duration: 8.5,
    narration: 'ject 就是“投掷”的动作。它像一台投掷机，前缀是方向拨杆：换一个前缀，就换一个投法。别把它们当成孤立单词。',
    captions: narrationToCaptions('ject 就是“投掷”的动作。它像一台投掷机，前缀是方向拨杆：换一个前缀，就换一个投法。别把它们当成孤立单词。', 8.5),
    sfx: [{at: 0.18, name: 'scribble', volume: 0.17}, {at: 3.2, name: 'press', volume: 0.16}],
    layers: [
      text({id: 'machine-title', from: 0.05, duration: hold(8.5, 0.05), enter: 'rise', enterDuration: 0.38, exit: 'fade', exitDuration: 0.2, x: 135, y: 85, width: 670, fontSize: 82, fontWeight: 800, runs: [{text: '前缀', color: 'primary'}, {text: ' = 方向拨杆', color: 'accent'}]}),
      image({id: 'machine-image', src: JECT_REPLICA_ASSETS.directionMachine, from: 0.35, duration: hold(8.5, 0.35), enter: 'pop', enterDuration: 0.48, exit: 'fade', exitDuration: 0.2, x: 140, y: 200, width: 980, height: 620, fit: 'contain'}),
      text({id: 'machine-root', from: 1.15, duration: hold(8.5, 1.15), enter: 'pop', enterDuration: 0.36, exit: 'fade', exitDuration: 0.2, x: 1250, y: 285, width: 450, fontSize: 120, fontWeight: 800, align: 'center', runs: [{text: '-ject-', color: 'accent'}]}),
      text({id: 'machine-action', from: 2.05, duration: hold(8.5, 2.05), enter: 'wipe-up', enterDuration: 0.34, exit: 'fade', exitDuration: 0.2, x: 1270, y: 455, width: 410, fontSize: 64, fontWeight: 760, align: 'center', runs: [{text: '投 / 扔', color: 'primary'}]}),
      arrow({id: 'machine-control-arrow', from: 3.05, duration: hold(8.5, 3.05), enter: 'draw', enterDuration: 0.45, exit: 'fade', exitDuration: 0.2, x: 1040, y: 350, width: 280, height: 150, path: 'M18 128 C95 85 170 53 245 25', viewBox: '0 0 280 150', color: 'primary', strokeWidth: 7, headSize: 20}),
      text({id: 'machine-rule', from: 4.55, duration: hold(8.5, 4.55), enter: 'slide-left', enterDuration: 0.38, exit: 'fade', exitDuration: 0.2, x: 1120, y: 650, width: 650, fontSize: 48, fontWeight: 700, align: 'center', runs: [{text: '前缀变，投掷方向变', color: 'primary'}]}),
    ],
    transitionOut: WHITE_FADE,
  },
  {
    id: 'reject-throw-back',
    start: 16.5,
    duration: 9.5,
    narration: '先看 reject。re 表示 back，往回；ject 是扔。把东西扔回去，就是不接受、拒绝，申请被驳回也用 reject。',
    captions: narrationToCaptions('先看 reject。re 表示 back，往回；ject 是扔。把东西扔回去，就是不接受、拒绝，申请被驳回也用 reject。', 9.5),
    sfx: [{at: 0.12, name: 'whoosh', volume: 0.2}, {at: 3.2, name: 'hit', volume: 0.18}],
    layers: [
      text({id: 'reject-word', from: 0.05, duration: hold(9.5, 0.05), enter: 'pop', enterDuration: 0.42, exit: 'fade', exitDuration: 0.2, x: 120, y: 110, width: 760, fontSize: 128, fontWeight: 800, runs: [{text: 're', color: 'primary'}, {text: 'ject', color: 'accent'}]}),
      text({id: 'reject-formula', from: 0.65, duration: hold(9.5, 0.65), enter: 'wipe-up', enterDuration: 0.32, exit: 'fade', exitDuration: 0.2, x: 155, y: 295, width: 640, fontSize: 54, fontWeight: 760, runs: [{text: 're- = back  往回', color: 'primary'}]}),
      image({id: 'reject-image', src: JECT_REPLICA_ASSETS.rejectReturn, from: 0.3, duration: hold(9.5, 0.3), enter: 'slide-left', enterDuration: 0.46, exit: 'fade', exitDuration: 0.2, x: 790, y: 90, width: 1020, height: 700, fit: 'contain'}),
      arrow({id: 'reject-back-arrow', from: 2.45, duration: hold(9.5, 2.45), enter: 'draw', enterDuration: 0.46, exit: 'fade', exitDuration: 0.2, x: 945, y: 560, width: 680, height: 130, path: 'M640 34 C455 62 245 74 35 93', viewBox: '0 0 680 130', color: 'accent', strokeWidth: 8, headSize: 23}),
      text({id: 'reject-meaning', from: 4.15, duration: hold(9.5, 4.15), enter: 'pop', enterDuration: 0.36, exit: 'fade', exitDuration: 0.2, x: 150, y: 505, width: 640, fontSize: 72, fontWeight: 800, align: 'center', runs: [{text: '拒绝；驳回', color: 'accent'}]}),
      icon({id: 'reject-box', icon: 'box', from: 5.1, duration: hold(9.5, 5.1), enter: 'pop', enterDuration: 0.28, exit: 'fade', exitDuration: 0.2, x: 405, y: 650, width: 120, height: 120, color: 'primary', secondaryColor: 'accent'}),
    ],
    transitionOut: WHITE_FADE,
  },
  {
    id: 'project-throw-forward',
    start: 26,
    duration: 10,
    narration: 'project 里的 pro 表示 forward，向前。把想法投向未来，就成了项目和计划；把光线投向前方，就是投射、放映。核心画面都是向前送出去。',
    captions: narrationToCaptions('project 里的 pro 表示 forward，向前。把想法投向未来，就成了项目和计划；把光线投向前方，就是投射、放映。核心画面都是向前送出去。', 10),
    sfx: [{at: 0.12, name: 'pop', volume: 0.18}, {at: 2.7, name: 'whoosh', volume: 0.22}],
    layers: [
      text({id: 'project-word', from: 0.05, duration: hold(10, 0.05), enter: 'pop', enterDuration: 0.42, exit: 'fade', exitDuration: 0.2, x: 105, y: 95, width: 810, fontSize: 126, fontWeight: 800, runs: [{text: 'pro', color: 'primary'}, {text: 'ject', color: 'accent'}]}),
      text({id: 'project-formula', from: 0.72, duration: hold(10, 0.72), enter: 'wipe-up', enterDuration: 0.34, exit: 'fade', exitDuration: 0.2, x: 135, y: 285, width: 710, fontSize: 52, fontWeight: 760, runs: [{text: 'pro- = forward  向前', color: 'primary'}]}),
      image({id: 'project-image', src: JECT_REPLICA_ASSETS.projectForward, from: 0.3, duration: hold(10, 0.3), enter: 'slide-left', enterDuration: 0.46, exit: 'fade', exitDuration: 0.2, x: 800, y: 90, width: 1010, height: 700, fit: 'contain'}),
      arrow({id: 'project-forward-arrow', from: 2.45, duration: hold(10, 2.45), enter: 'draw', enterDuration: 0.46, exit: 'fade', exitDuration: 0.2, x: 1080, y: 520, width: 620, height: 140, path: 'M24 105 C215 80 395 50 575 28', viewBox: '0 0 620 140', color: 'accent', strokeWidth: 8, headSize: 23}),
      text({id: 'project-noun', from: 4.3, duration: hold(10, 4.3), enter: 'rise', enterDuration: 0.34, exit: 'fade', exitDuration: 0.2, x: 145, y: 485, width: 650, fontSize: 64, fontWeight: 800, runs: [{text: 'n. 项目；计划', color: 'accent'}]}),
      text({id: 'project-verb', from: 6.1, duration: hold(10, 6.1), enter: 'rise', enterDuration: 0.34, exit: 'fade', exitDuration: 0.2, x: 145, y: 610, width: 650, fontSize: 58, fontWeight: 760, runs: [{text: 'v. 投射；放映', color: 'primary'}]}),
      icon({id: 'project-spark', icon: 'spark', from: 6.45, duration: hold(10, 6.45), enter: 'pop', enterDuration: 0.28, exit: 'fade', exitDuration: 0.2, x: 735, y: 600, width: 90, height: 90, color: 'accent'}),
    ],
    transitionOut: WHITE_FADE,
  },
  {
    id: 'inject-throw-in',
    start: 36,
    duration: 9.5,
    narration: 'inject 的 in 就是 into，向里面。把药液或能量投进内部，就是注射、注入。记住进入内部的动作，不必死背中文。',
    captions: narrationToCaptions('inject 的 in 就是 into，向里面。把药液或能量投进内部，就是注射、注入。记住进入内部的动作，不必死背中文。', 9.5),
    sfx: [{at: 0.14, name: 'scribble', volume: 0.16}, {at: 2.65, name: 'press', volume: 0.2}, {at: 5.3, name: 'pop', volume: 0.15}],
    layers: [
      text({id: 'inject-word', from: 0.05, duration: hold(9.5, 0.05), enter: 'pop', enterDuration: 0.42, exit: 'fade', exitDuration: 0.2, x: 115, y: 105, width: 720, fontSize: 132, fontWeight: 800, runs: [{text: 'in', color: 'primary'}, {text: 'ject', color: 'accent'}]}),
      text({id: 'inject-formula', from: 0.68, duration: hold(9.5, 0.68), enter: 'wipe-up', enterDuration: 0.34, exit: 'fade', exitDuration: 0.2, x: 145, y: 295, width: 650, fontSize: 54, fontWeight: 760, runs: [{text: 'in- = into  里面', color: 'primary'}]}),
      image({id: 'inject-image', src: JECT_REPLICA_ASSETS.injectInside, from: 0.35, duration: hold(9.5, 0.35), enter: 'slide-left', enterDuration: 0.46, exit: 'fade', exitDuration: 0.2, x: 790, y: 85, width: 1030, height: 715, fit: 'contain'}),
      arrow({id: 'inject-in-arrow', from: 2.45, duration: hold(9.5, 2.45), enter: 'draw', enterDuration: 0.44, exit: 'fade', exitDuration: 0.2, x: 1120, y: 500, width: 520, height: 150, path: 'M22 30 C170 46 310 80 478 115', viewBox: '0 0 520 150', color: 'accent', strokeWidth: 8, headSize: 22}),
      text({id: 'inject-meaning', from: 4.25, duration: hold(9.5, 4.25), enter: 'pop', enterDuration: 0.35, exit: 'fade', exitDuration: 0.2, x: 155, y: 510, width: 610, fontSize: 72, fontWeight: 800, align: 'center', runs: [{text: '注射；注入', color: 'accent'}]}),
      icon({id: 'inject-check', icon: 'check', from: 5.1, duration: hold(9.5, 5.1), enter: 'pop', enterDuration: 0.28, exit: 'fade', exitDuration: 0.2, x: 390, y: 650, width: 110, height: 110, color: 'primary', secondaryColor: 'accent'}),
    ],
    transitionOut: WHITE_FADE,
  },
  {
    id: 'object-throw-against',
    start: 45.5,
    duration: 10.5,
    narration: 'object 的 ob 表示 against，迎面、对着。扔过去却被挡住，就有了“物体、对象”；作为动词时，挡在对面，就是反对。先感受这一下迎面碰撞。',
    captions: narrationToCaptions('object 的 ob 表示 against，迎面、对着。扔过去却被挡住，就有了“物体、对象”；作为动词时，挡在对面，就是反对。先感受这一下迎面碰撞。', 10.5),
    sfx: [{at: 0.12, name: 'whoosh', volume: 0.19}, {at: 2.9, name: 'hit', volume: 0.22}],
    layers: [
      text({id: 'object-word', from: 0.05, duration: hold(10.5, 0.05), enter: 'pop', enterDuration: 0.42, exit: 'fade', exitDuration: 0.2, x: 105, y: 95, width: 780, fontSize: 130, fontWeight: 800, runs: [{text: 'ob', color: 'primary'}, {text: 'ject', color: 'accent'}]}),
      text({id: 'object-formula', from: 0.72, duration: hold(10.5, 0.72), enter: 'wipe-up', enterDuration: 0.34, exit: 'fade', exitDuration: 0.2, x: 135, y: 285, width: 700, fontSize: 52, fontWeight: 760, runs: [{text: 'ob- = against  对着', color: 'primary'}]}),
      image({id: 'object-image', src: JECT_REPLICA_ASSETS.objectAgainst, from: 0.3, duration: hold(10.5, 0.3), enter: 'slide-left', enterDuration: 0.46, exit: 'fade', exitDuration: 0.2, x: 800, y: 80, width: 1020, height: 720, fit: 'contain'}),
      arrow({id: 'object-against-arrow', from: 2.35, duration: hold(10.5, 2.35), enter: 'draw', enterDuration: 0.46, exit: 'fade', exitDuration: 0.2, x: 1080, y: 530, width: 520, height: 105, path: 'M18 54 C180 48 330 50 475 54', viewBox: '0 0 520 105', color: 'accent', strokeWidth: 8, headSize: 23}),
      icon({id: 'object-impact', icon: 'impact', from: 2.92, duration: hold(10.5, 2.92), enter: 'pop', enterDuration: 0.24, exit: 'fade', exitDuration: 0.2, x: 1570, y: 475, width: 95, height: 95, color: 'accent'}),
      text({id: 'object-noun', from: 4.4, duration: hold(10.5, 4.4), enter: 'rise', enterDuration: 0.34, exit: 'fade', exitDuration: 0.2, x: 145, y: 500, width: 650, fontSize: 62, fontWeight: 800, runs: [{text: 'n. 物体；对象', color: 'accent'}]}),
      text({id: 'object-verb', from: 6.25, duration: hold(10.5, 6.25), enter: 'rise', enterDuration: 0.34, exit: 'fade', exitDuration: 0.2, x: 145, y: 625, width: 650, fontSize: 60, fontWeight: 760, runs: [{text: 'v. 反对', color: 'primary'}]}),
    ],
    transitionOut: WHITE_FADE,
  },
  {
    id: 'subject-throw-under',
    start: 56,
    duration: 10.5,
    narration: 'subject 里的 sub 表示 under，在下面。被放到某种控制或讨论之下，就成了主题、学科，也可以表示使某人遭受某事。先记住“置于下面”。',
    captions: narrationToCaptions('subject 里的 sub 表示 under，在下面。被放到某种控制或讨论之下，就成了主题、学科，也可以表示使某人遭受某事。先记住“置于下面”。', 10.5),
    sfx: [{at: 0.12, name: 'pop', volume: 0.18}, {at: 2.75, name: 'press', volume: 0.16}],
    layers: [
      text({id: 'subject-word', from: 0.05, duration: hold(10.5, 0.05), enter: 'pop', enterDuration: 0.42, exit: 'fade', exitDuration: 0.2, x: 90, y: 95, width: 820, fontSize: 126, fontWeight: 800, runs: [{text: 'sub', color: 'primary'}, {text: 'ject', color: 'accent'}]}),
      text({id: 'subject-formula', from: 0.72, duration: hold(10.5, 0.72), enter: 'wipe-up', enterDuration: 0.34, exit: 'fade', exitDuration: 0.2, x: 125, y: 285, width: 730, fontSize: 52, fontWeight: 760, runs: [{text: 'sub- = under  下面', color: 'primary'}]}),
      image({id: 'subject-image', src: JECT_REPLICA_ASSETS.subjectUnder, from: 0.3, duration: hold(10.5, 0.3), enter: 'slide-left', enterDuration: 0.46, exit: 'fade', exitDuration: 0.2, x: 805, y: 80, width: 1010, height: 720, fit: 'contain'}),
      arrow({id: 'subject-under-arrow', from: 2.35, duration: hold(10.5, 2.35), enter: 'draw', enterDuration: 0.46, exit: 'fade', exitDuration: 0.2, x: 1275, y: 270, width: 150, height: 320, path: 'M78 18 C74 110 76 205 76 280', viewBox: '0 0 150 320', color: 'accent', strokeWidth: 8, headSize: 23}),
      text({id: 'subject-noun', from: 4.35, duration: hold(10.5, 4.35), enter: 'rise', enterDuration: 0.34, exit: 'fade', exitDuration: 0.2, x: 140, y: 500, width: 680, fontSize: 62, fontWeight: 800, runs: [{text: 'n. 主题；学科', color: 'accent'}]}),
      text({id: 'subject-verb', from: 6.3, duration: hold(10.5, 6.3), enter: 'rise', enterDuration: 0.34, exit: 'fade', exitDuration: 0.2, x: 140, y: 625, width: 680, fontSize: 58, fontWeight: 760, runs: [{text: 'v. 使遭受；使服从', color: 'primary'}]}),
      icon({id: 'subject-book', icon: 'book', from: 6.6, duration: hold(10.5, 6.6), enter: 'pop', enterDuration: 0.28, exit: 'fade', exitDuration: 0.2, x: 735, y: 620, width: 100, height: 100, color: 'primary', secondaryColor: 'accent'}),
    ],
    transitionOut: WHITE_FADE,
  },
  {
    id: 'noun-verb-stress',
    start: 66.5,
    duration: 9.5,
    narration: '再送你一个实用细节。object 和 subject 作名词时，重音多在前面；作动词时，重音往后移。词根没变，词性和声音在变。',
    captions: narrationToCaptions('再送你一个实用细节。object 和 subject 作名词时，重音多在前面；作动词时，重音往后移。词根没变，词性和声音在变。', 9.5),
    sfx: [{at: 0.18, name: 'scribble', volume: 0.17}, {at: 4.5, name: 'pop', volume: 0.15}],
    layers: [
      text({id: 'stress-title', from: 0.05, duration: hold(9.5, 0.05), enter: 'rise', enterDuration: 0.38, exit: 'fade', exitDuration: 0.2, x: 250, y: 85, width: 1420, align: 'center', fontSize: 72, fontWeight: 800, runs: [{text: '同一个词，重音会换位置', color: 'primary'}]}),
      text({id: 'stress-object-noun', from: 0.75, duration: hold(9.5, 0.75), enter: 'slide-right', enterDuration: 0.38, exit: 'fade', exitDuration: 0.2, x: 170, y: 270, width: 720, align: 'center', fontSize: 58, fontWeight: 760, runs: [{text: 'n. ', color: 'secondary'}, {text: 'OB', color: 'accent'}, {text: 'ject  /ˈɒbdʒɪkt/', color: 'primary'}]}),
      text({id: 'stress-object-verb', from: 1.55, duration: hold(9.5, 1.55), enter: 'slide-left', enterDuration: 0.38, exit: 'fade', exitDuration: 0.2, x: 1030, y: 270, width: 720, align: 'center', fontSize: 58, fontWeight: 760, runs: [{text: 'v. ob', color: 'primary'}, {text: 'JECT', color: 'accent'}, {text: '  /əbˈdʒekt/', color: 'primary'}]}),
      arrow({id: 'stress-object-arrow', from: 2.4, duration: hold(9.5, 2.4), enter: 'draw', enterDuration: 0.42, exit: 'fade', exitDuration: 0.2, x: 850, y: 290, width: 250, height: 80, path: 'M18 42 C85 40 145 40 218 42', viewBox: '0 0 250 80', color: 'accent', strokeWidth: 6, headSize: 18}),
      text({id: 'stress-subject-noun', from: 3.65, duration: hold(9.5, 3.65), enter: 'slide-right', enterDuration: 0.38, exit: 'fade', exitDuration: 0.2, x: 150, y: 505, width: 760, align: 'center', fontSize: 55, fontWeight: 760, runs: [{text: 'n. ', color: 'secondary'}, {text: 'SUB', color: 'accent'}, {text: 'ject  /ˈsʌbdʒɪkt/', color: 'primary'}]}),
      text({id: 'stress-subject-verb', from: 4.45, duration: hold(9.5, 4.45), enter: 'slide-left', enterDuration: 0.38, exit: 'fade', exitDuration: 0.2, x: 1010, y: 505, width: 760, align: 'center', fontSize: 55, fontWeight: 760, runs: [{text: 'v. sub', color: 'primary'}, {text: 'JECT', color: 'accent'}, {text: '  /səbˈdʒekt/', color: 'primary'}]}),
      arrow({id: 'stress-subject-arrow', from: 5.3, duration: hold(9.5, 5.3), enter: 'draw', enterDuration: 0.42, exit: 'fade', exitDuration: 0.2, x: 850, y: 525, width: 250, height: 80, path: 'M18 42 C85 40 145 40 218 42', viewBox: '0 0 250 80', color: 'accent', strokeWidth: 6, headSize: 18}),
      icon({id: 'stress-speech', icon: 'speech', from: 6.2, duration: hold(9.5, 6.2), enter: 'pop', enterDuration: 0.3, exit: 'fade', exitDuration: 0.2, x: 890, y: 650, width: 140, height: 110, color: 'primary', secondaryColor: 'accent'}),
    ],
    transitionOut: WHITE_FADE,
  },
  {
    id: 'prefix-map-recap',
    start: 76,
    duration: 11,
    narration: '现在把五个方向收回来：re，回去；pro，向前；in，进去；ob，对着；sub，下面。中心永远是 ject，永远在投。',
    captions: narrationToCaptions('现在把五个方向收回来：re，回去；pro，向前；in，进去；ob，对着；sub，下面。中心永远是 ject，永远在投。', 11),
    sfx: [{at: 0.15, name: 'whoosh', volume: 0.18}, {at: 1.4, name: 'scribble', volume: 0.15}, {at: 5.8, name: 'pop', volume: 0.15}],
    layers: [
      text({id: 'map-title', from: 0.05, duration: hold(11, 0.05), enter: 'rise', enterDuration: 0.38, exit: 'fade', exitDuration: 0.2, x: 310, y: 55, width: 1300, align: 'center', fontSize: 68, fontWeight: 800, runs: [{text: '前缀决定“投”的方向', color: 'primary'}]}),
      radial({id: 'ject-radial', from: 0.55, duration: hold(11, 0.55), enter: 'pop', enterDuration: 0.48, exit: 'fade', exitDuration: 0.2, x: 160, y: 130, width: 1600, height: 675, center: [{text: '-ject-', color: 'accent', weight: 800, size: 82}, {text: '\n投 / 扔', color: 'primary', weight: 760, size: 42}], items: [{text: 're-  回去', angle: 190, color: 'primary'}, {text: 'pro-  向前', angle: 350, color: 'primary'}, {text: 'in-  进去', angle: 286, color: 'primary'}, {text: 'ob-  对着', angle: 95, color: 'primary'}, {text: 'sub-  下面', angle: 52, color: 'primary'}], radiusX: 560, radiusY: 235}),
      icon({id: 'map-spark-left', icon: 'spark', from: 6.4, duration: hold(11, 6.4), enter: 'pop', enterDuration: 0.3, exit: 'fade', exitDuration: 0.2, x: 215, y: 680, width: 90, height: 90, color: 'accent'}),
      icon({id: 'map-spark-right', icon: 'spark', from: 6.65, duration: hold(11, 6.65), enter: 'pop', enterDuration: 0.3, exit: 'fade', exitDuration: 0.2, x: 1615, y: 680, width: 90, height: 90, color: 'accent', rotate: 18}),
    ],
    transitionOut: WHITE_FADE,
  },
  {
    id: 'example-sentences',
    start: 87,
    duration: 10,
    narration: '放进句子里再看一遍：拒绝提议，启动项目，注入药液，反对计划，还有最喜欢的学科。方向一对，词义就不会散，记忆也会更稳。',
    captions: narrationToCaptions('放进句子里再看一遍：拒绝提议，启动项目，注入药液，反对计划，还有最喜欢的学科。方向一对，词义就不会散，记忆也会更稳。', 10),
    sfx: [{at: 0.12, name: 'scribble', volume: 0.16}, {at: 2.2, name: 'pop', volume: 0.13}, {at: 4.1, name: 'pop', volume: 0.13}, {at: 6, name: 'pop', volume: 0.13}],
    layers: [
      text({id: 'examples-title', from: 0.05, duration: hold(10, 0.05), enter: 'rise', enterDuration: 0.38, exit: 'fade', exitDuration: 0.2, x: 260, y: 55, width: 1400, align: 'center', fontSize: 68, fontWeight: 800, runs: [{text: '把方向放回句子', color: 'primary'}]}),
      text({id: 'example-reject', from: 0.75, duration: hold(10, 0.75), enter: 'typewriter', enterDuration: 0.4, exit: 'fade', exitDuration: 0.2, x: 190, y: 190, width: 1500, fontSize: 45, fontWeight: 700, typewriterCharsPerSec: 22, runs: [{text: 'They ', color: 'primary'}, {text: 'rejected', color: 'accent'}, {text: ' the proposal.  他们拒绝了提议。', color: 'primary'}]}),
      text({id: 'example-project', from: 2.15, duration: hold(10, 2.15), enter: 'typewriter', enterDuration: 0.4, exit: 'fade', exitDuration: 0.2, x: 190, y: 305, width: 1500, fontSize: 45, fontWeight: 700, typewriterCharsPerSec: 22, runs: [{text: 'We launched a new ', color: 'primary'}, {text: 'project', color: 'accent'}, {text: '.  我们启动了新项目。', color: 'primary'}]}),
      text({id: 'example-inject', from: 3.7, duration: hold(10, 3.7), enter: 'typewriter', enterDuration: 0.4, exit: 'fade', exitDuration: 0.2, x: 190, y: 420, width: 1500, fontSize: 45, fontWeight: 700, typewriterCharsPerSec: 22, runs: [{text: 'The nurse ', color: 'primary'}, {text: 'injected', color: 'accent'}, {text: ' the medicine.  护士注入了药液。', color: 'primary'}]}),
      text({id: 'example-object', from: 5.25, duration: hold(10, 5.25), enter: 'typewriter', enterDuration: 0.4, exit: 'fade', exitDuration: 0.2, x: 190, y: 535, width: 1500, fontSize: 45, fontWeight: 700, typewriterCharsPerSec: 22, runs: [{text: 'I ', color: 'primary'}, {text: 'object', color: 'accent'}, {text: ' to the plan.  我反对这个计划。', color: 'primary'}]}),
      text({id: 'example-subject', from: 6.75, duration: hold(10, 6.75), enter: 'typewriter', enterDuration: 0.4, exit: 'fade', exitDuration: 0.2, x: 190, y: 650, width: 1500, fontSize: 45, fontWeight: 700, typewriterCharsPerSec: 22, runs: [{text: 'History is my favorite ', color: 'primary'}, {text: 'subject', color: 'accent'}, {text: '.  历史是我最喜欢的学科。', color: 'primary'}]}),
    ],
    transitionOut: WHITE_FADE,
  },
  {
    id: 'final-summary',
    start: 97,
    duration: 8,
    narration: '最后收口：ject 就是投。re 回、pro 前、in 里、ob 对、sub 下，五个方向带走五个单词。',
    captions: narrationToCaptions('最后收口：ject 就是投。re 回、pro 前、in 里、ob 对、sub 下，五个方向带走五个单词。', 7.35),
    sfx: [{at: 0.12, name: 'stamp', volume: 0.18}, {at: 4.2, name: 'pop', volume: 0.14}],
    layers: [
      text({id: 'summary-title', from: 0.05, duration: hold(8, 0.05, 0.08), enter: 'rise', enterDuration: 0.38, exit: 'fade', exitDuration: 0.16, x: 250, y: 45, width: 1420, align: 'center', fontSize: 64, fontWeight: 800, runs: [{text: '-ject- = ', color: 'primary'}, {text: '投 / 扔', color: 'accent'}]}),
      table({id: 'summary-table', from: 0.35, duration: hold(8, 0.35, 0.08), enter: 'rise', enterDuration: 0.42, exit: 'fade', exitDuration: 0.16, x: 160, y: 135, width: 1600, height: 650, columns: 1, rowFromStep: 0.55, compact: true, variant: 'open', partInMeaning: true, wordFontSize: 43, phoneticFontSize: 27, meaningFontSize: 38, wordColumnFraction: 0.36, rows: [
        {word: 'reject', phonetic: '/rɪˈdʒekt/', part: 'v.', meaning: 're- 回去 → 拒绝；驳回', accent: 'ject'},
        {word: 'project', phonetic: '/ˈprɒdʒekt/', part: 'n./v.', meaning: 'pro- 向前 → 项目；投射', accent: 'ject'},
        {word: 'inject', phonetic: '/ɪnˈdʒekt/', part: 'v.', meaning: 'in- 进去 → 注射；注入', accent: 'ject'},
        {word: 'object', phonetic: '/ˈɒbdʒɪkt/', part: 'n./v.', meaning: 'ob- 对着 → 物体；反对', accent: 'ject'},
        {word: 'subject', phonetic: '/ˈsʌbdʒɪkt/', part: 'n./v.', meaning: 'sub- 下面 → 主题；使遭受', accent: 'ject'},
      ]}),
    ],
  },
];

export const jectStoryboard: ReplicaStoryboard = {
  id: 'ject',
  duration: JECT_DURATION,
  fadeToBlackSec: 0.6,
  fadeEndOpacity: 1,
  scenes,
};
