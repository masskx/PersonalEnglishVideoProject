import {narrationToCaptions} from './captionUtils';
import type {ReplicaImageLayer, ReplicaRadialLayer, ReplicaScene, ReplicaStoryboard, ReplicaTableLayer, ReplicaTextLayer} from './types';

export const SCRIPT_SCRIB_ASSETS = {
  hook: 'assets/replica/script-scrib/00_write_hook.png',
  describe: 'assets/replica/script-scrib/01_describe_trace.png',
  prescribe: 'assets/replica/script-scrib/02_prescribe_before.png',
  subscribe: 'assets/replica/script-scrib/03_subscribe_under.png',
  transcribe: 'assets/replica/script-scrib/04_transcribe_across.png',
  manuscript: 'assets/replica/script-scrib/05_manuscript_hand.png',
  inscription: 'assets/replica/script-scrib/06_inscription_carve.png',
  postscript: 'assets/replica/script-scrib/07_postscript_after.png',
  scribble: 'assets/replica/script-scrib/08_scribble_tangle.png',
} as const;

const text = (layer: Omit<ReplicaTextLayer, 'kind'>): ReplicaTextLayer => ({kind: 'text', ...layer});
const image = (layer: Omit<ReplicaImageLayer, 'kind'>): ReplicaImageLayer => ({kind: 'image', ...layer});
const radial = (layer: Omit<ReplicaRadialLayer, 'kind'>): ReplicaRadialLayer => ({kind: 'radial', ...layer});
const table = (layer: Omit<ReplicaTableLayer, 'kind'>): ReplicaTableLayer => ({kind: 'table', ...layer});
const hold = (duration: number, from: number, tail = 0.2) => Number(Math.max(0.12, duration - from - tail).toFixed(3));
const WHITE_FADE = {type: 'white-fade' as const, duration: 0.16};

const wordScene = ({id, start, narration, prefix = '', root, suffix = '', formula, meaning, asset}: {
  id: string; start: number; narration: string; prefix?: string; root: 'scrib' | 'script'; suffix?: string;
  formula: string; meaning: string; asset: string;
}): ReplicaScene => {
  const duration = 8.5;
  return {
    id, start, duration, narration, captions: narrationToCaptions(narration, duration),
    sfx: [{at: 0.12, name: 'whoosh', volume: 0.15}, {at: 3.7, name: 'scribble', volume: 0.13}],
    layers: [
      text({id: `${id}-word`, from: 0.05, duration: hold(duration, 0.05), enter: 'pop', enterDuration: 0.42, exit: 'fade', exitDuration: 0.2, x: 85, y: 95, width: 900, fontSize: prefix.length + root.length + suffix.length > 10 ? 78 : 94, fontWeight: 800, runs: [{text: prefix, color: 'primary'}, {text: root, color: 'accent'}, {text: suffix, color: 'primary'}]}),
      text({id: `${id}-formula`, from: 0.72, duration: hold(duration, 0.72), enter: 'wipe-up', enterDuration: 0.34, exit: 'fade', exitDuration: 0.2, x: 100, y: 285, width: 805, fontSize: 42, fontWeight: 760, runs: [{text: formula, color: 'primary'}]}),
      image({id: `${id}-image`, src: asset, from: 0.3, duration: hold(duration, 0.3), enter: 'slide-left', enterDuration: 0.46, exit: 'fade', exitDuration: 0.2, x: 880, y: 95, width: 850, height: 660, fit: 'contain'}),
      text({id: `${id}-meaning`, from: 4.0, duration: hold(duration, 4.0), enter: 'pop', enterDuration: 0.36, exit: 'fade', exitDuration: 0.2, x: 115, y: 510, width: 720, fontSize: 56, fontWeight: 800, align: 'center', runs: [{text: meaning, color: 'accent'}]}),
    ],
    transitionOut: WHITE_FADE,
  };
};

const scenes: ReplicaScene[] = [
  {
    id: 'write-hook', start: 0, duration: 8,
    narration: '今天记词根 script 和 scrib，核心都是 write，写。想象小黑拖着一支笔，走到哪里，哪里就留下文字轨迹。',
    captions: narrationToCaptions('今天记词根 script 和 scrib，核心都是 write，写。想象小黑拖着一支笔，走到哪里，哪里就留下文字轨迹。', 8),
    sfx: [{at: 0.15, name: 'pop', volume: 0.17}, {at: 2.2, name: 'scribble', volume: 0.17}],
    layers: [
      text({id: 'hook-root', from: 0.05, duration: 7.6, enter: 'pop', enterDuration: 0.44, x: 95, y: 155, width: 770, fontSize: 82, fontWeight: 800, align: 'center', runs: [{text: 'SCRIPT / SCRIB', color: 'accent'}]}),
      text({id: 'hook-write', from: 0.7, duration: 6.9, enter: 'rise', enterDuration: 0.34, x: 180, y: 355, width: 600, fontSize: 72, fontWeight: 800, align: 'center', runs: [{text: '= WRITE', color: 'primary'}]}),
      text({id: 'hook-cn', from: 1.2, duration: 6.4, enter: 'wipe-up', enterDuration: 0.34, x: 240, y: 500, width: 480, fontSize: 70, fontWeight: 780, align: 'center', runs: [{text: '写', color: 'primary'}]}),
      image({id: 'hook-image', src: SCRIPT_SCRIB_ASSETS.hook, from: 0.3, duration: 7.3, enter: 'slide-left', enterDuration: 0.5, x: 800, y: 80, width: 960, height: 720, fit: 'contain'}),
    ], transitionOut: WHITE_FADE,
  },
  {
    id: 'writing-map', start: 8, duration: 10,
    narration: 'scrib 和 script 是同一家族的两种样子。看到它们，就先找写的位置：向下写、预先写、跨过去写、用手写，词义马上有方向。',
    captions: narrationToCaptions('scrib 和 script 是同一家族的两种样子。看到它们，就先找写的位置：向下写、预先写、跨过去写、用手写，词义马上有方向。', 10),
    sfx: [{at: 0.15, name: 'scribble', volume: 0.15}],
    layers: [
      text({id: 'map-title', from: 0.05, duration: 9.6, enter: 'rise', enterDuration: 0.38, x: 220, y: 55, width: 1480, fontSize: 62, fontWeight: 800, align: 'center', runs: [{text: '先找“往哪里写”，再还原词义', color: 'primary'}]}),
      radial({id: 'map-radial', from: 0.55, duration: 9.0, enter: 'pop', enterDuration: 0.46, x: 130, y: 170, width: 1660, height: 640, center: [{text: 'SCRIB / SCRIPT', color: 'accent', weight: 800, size: 68}, {text: '\n写', color: 'primary', weight: 760, size: 46}], items: [
        {text: 'de-  完整展开', angle: 205, color: 'primary'}, {text: 'pre-  预先', angle: 150, color: 'primary'},
        {text: 'sub-  在下面', angle: 95, color: 'primary'}, {text: 'trans-  跨过去', angle: 25, color: 'primary'},
        {text: 'manu-  手', angle: 335, color: 'primary'}, {text: 'post-  在后面', angle: 270, color: 'primary'},
      ], radiusX: 600, radiusY: 245}),
    ], transitionOut: WHITE_FADE,
  },
  wordScene({id: 'describe-write-out', start: 18, prefix: 'de', root: 'scrib', suffix: 'e', formula: 'de- 展开 + scrib 写', meaning: '描述；描写', asset: SCRIPT_SCRIB_ASSETS.describe, narration: 'describe 里，de 表示完整展开。把一个人的样子或一件事写出来，就是 describe，描述、描写。'}),
  wordScene({id: 'prescribe-write-before', start: 26.5, prefix: 'pre', root: 'scrib', suffix: 'e', formula: 'pre- 预先 + scrib 写', meaning: '开处方；规定', asset: SCRIPT_SCRIB_ASSETS.prescribe, narration: 'prescribe 的 pre 是预先。医生事先写下用药办法，就是开处方；权威预先写下规则，也表示规定。'}),
  wordScene({id: 'subscribe-write-under', start: 35, prefix: 'sub', root: 'scrib', suffix: 'e', formula: 'sub- 在下面 + scrib 写', meaning: '订阅；认购', asset: SCRIPT_SCRIB_ASSETS.subscribe, narration: 'subscribe 原本是把名字签在下面，表示同意加入。今天常见的意思是订阅频道或服务，也可以表示认购。'}),
  wordScene({id: 'transcribe-write-across', start: 43.5, prefix: 'tran', root: 'scrib', suffix: 'e', formula: 'trans- 跨过去 + scrib 写', meaning: '转录；抄写', asset: SCRIPT_SCRIB_ASSETS.transcribe, narration: 'transcribe 的 trans 是跨过去。把声音、采访或旧文字搬到另一份文字里，就是转录、抄写。'}),
  wordScene({id: 'manuscript-handwritten', start: 52, prefix: 'manu', root: 'script', formula: 'manu- 手 + script 写成的东西', meaning: '手稿；原稿', asset: SCRIPT_SCRIB_ASSETS.manuscript, narration: 'manuscript 前面的 manu 是手。手写出来的稿件，就是 manuscript，手稿；现在也常指尚未出版的原稿。'}),
  wordScene({id: 'inscription-write-into', start: 60.5, prefix: 'in', root: 'script', suffix: 'ion', formula: 'in- 写入 + script + -ion', meaning: '铭文；题词', asset: SCRIPT_SCRIB_ASSETS.inscription, narration: 'inscription 是写进表面、刻在物体上的文字，所以是铭文、题词。想象小黑把笔画凿进石头。'}),
  wordScene({id: 'postscript-write-after', start: 69, prefix: 'post', root: 'script', formula: 'post- 在后面 + script 文字', meaning: '附言；又及', asset: SCRIPT_SCRIB_ASSETS.postscript, narration: 'postscript 的 post 是在后面。信或文章写完后再补上一段，就是附言、又及，常缩写成 P S。'}),
  wordScene({id: 'scribble-write-messily', start: 77.5, root: 'scrib', suffix: 'ble', formula: 'scrib 写 → 笔迹失去控制', meaning: '潦草地写；乱涂', asset: SCRIPT_SCRIB_ASSETS.scribble, narration: 'scribble 还是写，但笔迹像一团线，完全失去控制，所以表示潦草地写，或者在纸上随手乱涂。'}),
  {
    id: 'example-sentences', start: 86, duration: 10,
    narration: 'Please describe it，描述一下。Doctors prescribe medicine，医生开药。I subscribe to the channel，我订阅频道。She transcribed the interview，她转录了采访。',
    captions: narrationToCaptions('Please describe it，描述一下。Doctors prescribe medicine，医生开药。I subscribe to the channel，我订阅频道。She transcribed the interview，她转录了采访。', 10),
    sfx: [{at: 0.12, name: 'scribble', volume: 0.15}],
    layers: [
      text({id: 'examples-title', from: 0.05, duration: 9.6, enter: 'rise', enterDuration: 0.36, x: 260, y: 60, width: 1400, fontSize: 64, fontWeight: 800, align: 'center', runs: [{text: '把“写”放回句子', color: 'primary'}]}),
      text({id: 'ex1', from: 0.8, duration: 8.9, enter: 'typewriter', enterDuration: 0.4, x: 150, y: 210, width: 1620, fontSize: 42, fontWeight: 700, typewriterCharsPerSec: 22, runs: [{text: 'Please ', color: 'primary'}, {text: 'describe', color: 'accent'}, {text: ' it.  请描述一下。', color: 'primary'}]}),
      text({id: 'ex2', from: 3.0, duration: 6.7, enter: 'typewriter', enterDuration: 0.4, x: 150, y: 345, width: 1620, fontSize: 42, fontWeight: 700, typewriterCharsPerSec: 22, runs: [{text: 'Doctors ', color: 'primary'}, {text: 'prescribe', color: 'accent'}, {text: ' medicine.  医生开药。', color: 'primary'}]}),
      text({id: 'ex3', from: 5.2, duration: 4.5, enter: 'typewriter', enterDuration: 0.4, x: 150, y: 480, width: 1620, fontSize: 42, fontWeight: 700, typewriterCharsPerSec: 22, runs: [{text: 'I ', color: 'primary'}, {text: 'subscribe', color: 'accent'}, {text: ' to the channel.  我订阅频道。', color: 'primary'}]}),
      text({id: 'ex4', from: 7.4, duration: 2.3, enter: 'typewriter', enterDuration: 0.4, x: 150, y: 615, width: 1620, fontSize: 42, fontWeight: 700, typewriterCharsPerSec: 22, runs: [{text: 'She ', color: 'primary'}, {text: 'transcribed', color: 'accent'}, {text: ' the interview.  她转录了采访。', color: 'primary'}]}),
    ], transitionOut: WHITE_FADE,
  },
  {
    id: 'final-summary', start: 96, duration: 16,
    narration: '最后收口：script 和 scrib 都是写。describe 描述，prescribe 开处方，subscribe 订阅，transcribe 转录，manuscript 手稿，inscription 铭文，postscript 附言，scribble 乱写。记住笔尖轨迹，这组词就串起来了。',
    captions: narrationToCaptions('最后收口：script 和 scrib 都是写。describe 描述，prescribe 开处方，subscribe 订阅，transcribe 转录，manuscript 手稿，inscription 铭文，postscript 附言，scribble 乱写。记住笔尖轨迹，这组词就串起来了。', 15.45),
    sfx: [{at: 0.12, name: 'scribble', volume: 0.17}],
    layers: [
      text({id: 'summary-title', from: 0.05, duration: 14.95, enter: 'rise', enterDuration: 0.38, x: 250, y: 38, width: 1420, align: 'center', fontSize: 62, fontWeight: 800, runs: [{text: 'script / scrib = ', color: 'primary'}, {text: 'write / 写', color: 'accent'}]}),
      table({id: 'summary-table', from: 0.35, duration: 14.65, enter: 'rise', enterDuration: 0.42, x: 115, y: 125, width: 1690, height: 675, columns: 1, rowFromStep: 0.42, compact: true, variant: 'open', partInMeaning: true, wordFontSize: 34, phoneticFontSize: 21, meaningFontSize: 29, wordColumnFraction: 0.39, rows: [
        {word: 'describe', phonetic: '/dɪˈskraɪb/', part: 'v.', meaning: '完整写出样子 → 描述；描写', accent: 'scrib'},
        {word: 'prescribe', phonetic: '/prɪˈskraɪb/', part: 'v.', meaning: '预先写下办法 → 开处方；规定', accent: 'scrib'},
        {word: 'subscribe', phonetic: '/səbˈskraɪb/', part: 'v.', meaning: '在下面签写 → 订阅；认购', accent: 'scrib'},
        {word: 'transcribe', phonetic: '/trænˈskraɪb/', part: 'v.', meaning: '跨到另一份文字 → 转录；抄写', accent: 'scrib'},
        {word: 'manuscript', phonetic: '/ˈmænjuskrɪpt/', part: 'n.', meaning: '用手写成的稿子 → 手稿；原稿', accent: 'script'},
        {word: 'inscription', phonetic: '/ɪnˈskrɪpʃn/', part: 'n.', meaning: '写入或刻在表面 → 铭文；题词', accent: 'script'},
        {word: 'postscript', phonetic: '/ˈpəʊstskrɪpt/', part: 'n.', meaning: '正文后补写 → 附言；又及', accent: 'script'},
        {word: 'scribble', phonetic: '/ˈskrɪbl/', part: 'v.', meaning: '失去控制地写 → 潦草写；乱涂', accent: 'scrib'},
      ]}),
    ],
  },
];

export const scriptScribStoryboard: ReplicaStoryboard = {
  id: 'script-scrib', duration: 112, fadeToBlackSec: 0.5, fadeEndOpacity: 1, scenes,
};
