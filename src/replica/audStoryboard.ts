import {narrationToCaptions} from './captionUtils';
import type {ReplicaImageLayer, ReplicaRadialLayer, ReplicaScene, ReplicaStoryboard, ReplicaTableLayer, ReplicaTextLayer} from './types';

export const AUD_REPLICA_ASSETS = {
  hook: 'assets/replica/aud/00_hear_hook.png', audio: 'assets/replica/aud/01_audio_sound.png',
  audience: 'assets/replica/aud/02_audience_listen.png', audit: 'assets/replica/aud/03_audit_listen_check.png',
  audible: 'assets/replica/aud/04_audible_heard.png', audition: 'assets/replica/aud/05_audition_try.png',
  auditorium: 'assets/replica/aud/06_auditorium_hall.png', inaudible: 'assets/replica/aud/07_inaudible_blocked.png',
  audiobook: 'assets/replica/aud/08_audiobook_listen_book.png',
} as const;

const text = (layer: Omit<ReplicaTextLayer, 'kind'>): ReplicaTextLayer => ({kind: 'text', ...layer});
const image = (layer: Omit<ReplicaImageLayer, 'kind'>): ReplicaImageLayer => ({kind: 'image', ...layer});
const radial = (layer: Omit<ReplicaRadialLayer, 'kind'>): ReplicaRadialLayer => ({kind: 'radial', ...layer});
const table = (layer: Omit<ReplicaTableLayer, 'kind'>): ReplicaTableLayer => ({kind: 'table', ...layer});
const hold = (duration: number, from: number, tail = 0.2) => Number(Math.max(0.12, duration - from - tail).toFixed(3));
const WHITE_FADE = {type: 'white-fade' as const, duration: 0.16};

const wordScene = ({id, start, duration, narration, prefix = '', suffix, formula, meaning, asset}: {
  id: string; start: number; duration: number; narration: string; prefix?: string; suffix: string;
  formula: string; meaning: string; asset: string;
}): ReplicaScene => ({
  id, start, duration, narration, captions: narrationToCaptions(narration, duration),
  sfx: [{at: 0.12, name: 'whoosh', volume: 0.16}, {at: 3.1, name: 'pop', volume: 0.13}],
  layers: [
    text({id: `${id}-word`, from: 0.05, duration: hold(duration, 0.05), enter: 'pop', enterDuration: 0.42, exit: 'fade', exitDuration: 0.2, x: 85, y: 95, width: 900, fontSize: prefix.length + suffix.length > 7 ? 96 : 116, fontWeight: 800, runs: [{text: prefix, color: 'primary'}, {text: 'aud', color: 'accent'}, {text: suffix, color: 'primary'}]}),
    text({id: `${id}-formula`, from: 0.72, duration: hold(duration, 0.72), enter: 'wipe-up', enterDuration: 0.34, exit: 'fade', exitDuration: 0.2, x: 100, y: 285, width: 805, fontSize: 46, fontWeight: 760, runs: [{text: formula, color: 'primary'}]}),
    image({id: `${id}-image`, src: asset, from: 0.3, duration: hold(duration, 0.3), enter: 'slide-left', enterDuration: 0.46, exit: 'fade', exitDuration: 0.2, x: 880, y: 95, width: 850, height: 660, fit: 'contain'}),
    text({id: `${id}-meaning`, from: 4.0, duration: hold(duration, 4.0), enter: 'pop', enterDuration: 0.36, exit: 'fade', exitDuration: 0.2, x: 115, y: 510, width: 720, fontSize: 64, fontWeight: 800, align: 'center', runs: [{text: meaning, color: 'accent'}]}),
  ], transitionOut: WHITE_FADE,
});

const scenes: ReplicaScene[] = [
  {
    id: 'hear-hook', start: 0, duration: 9,
    narration: '今天记一个和耳朵有关的词根：aud，核心就是 hear，听。看到 aud，就想象小黑举起一只大耳朵，把飘来的声音稳稳接住。',
    captions: narrationToCaptions('今天记一个和耳朵有关的词根：aud，核心就是 hear，听。看到 aud，就想象小黑举起一只大耳朵，把飘来的声音稳稳接住。', 9),
    sfx: [{at: 0.15, name: 'pop', volume: 0.17}, {at: 2.2, name: 'whoosh', volume: 0.18}],
    layers: [
      text({id: 'hook-root', from: 0.05, duration: 7.7, enter: 'pop', enterDuration: 0.44, x: 110, y: 155, width: 680, fontSize: 168, fontWeight: 800, align: 'center', runs: [{text: 'AUD', color: 'accent'}]}),
      text({id: 'hook-hear', from: 0.7, duration: 7, enter: 'rise', enterDuration: 0.34, x: 180, y: 365, width: 540, fontSize: 78, fontWeight: 800, align: 'center', runs: [{text: '= HEAR', color: 'primary'}]}),
      text({id: 'hook-cn', from: 1.2, duration: 6.5, enter: 'wipe-up', enterDuration: 0.34, x: 220, y: 505, width: 460, fontSize: 70, fontWeight: 780, align: 'center', runs: [{text: '听', color: 'primary'}]}),
      image({id: 'hook-image', src: AUD_REPLICA_ASSETS.hook, from: 0.3, duration: 7.4, enter: 'slide-left', enterDuration: 0.5, x: 800, y: 80, width: 960, height: 720, fit: 'contain'}),
    ], transitionOut: WHITE_FADE,
  },
  {
    id: 'ear-map', start: 9, duration: 9,
    narration: '把 aud 当成声音接收器。后缀会告诉你：是声音本身、听的人、能不能听见、试着让人听，还是专门用来听的地方和内容。',
    captions: narrationToCaptions('把 aud 当成声音接收器。后缀会告诉你：是声音本身、听的人、能不能听见、试着让人听，还是专门用来听的地方和内容。', 9),
    sfx: [{at: 0.15, name: 'scribble', volume: 0.15}],
    layers: [
      text({id: 'map-title', from: 0.05, duration: 8.7, enter: 'rise', enterDuration: 0.38, x: 220, y: 55, width: 1480, fontSize: 66, fontWeight: 800, align: 'center', runs: [{text: 'aud = 声音接收器', color: 'primary'}]}),
      radial({id: 'map-radial', from: 0.55, duration: 8.1, enter: 'pop', enterDuration: 0.46, x: 130, y: 170, width: 1660, height: 640, center: [{text: 'AUD', color: 'accent', weight: 800, size: 82}, {text: '\n听', color: 'primary', weight: 760, size: 46}], items: [
        {text: 'audio  声音', angle: 205, color: 'primary'}, {text: 'audience  听众', angle: 150, color: 'primary'},
        {text: 'audit  听取核查', angle: 95, color: 'primary'}, {text: 'audible  能听见', angle: 25, color: 'primary'},
        {text: 'audition  试音', angle: 335, color: 'primary'}, {text: 'auditorium  听音场所', angle: 270, color: 'primary'},
      ], radiusX: 600, radiusY: 245}),
    ], transitionOut: WHITE_FADE,
  },
  wordScene({id: 'audio-sound', start: 18, duration: 8.5, suffix: 'io', formula: 'aud 听 + -io 相关事物', meaning: '音频；声音', asset: AUD_REPLICA_ASSETS.audio, narration: 'audio 最直接：和听觉、声音有关的内容，就是音频、声音。比如 audio file，就是音频文件。先想到耳朵收到的声音。'}),
  wordScene({id: 'audience-listeners', start: 26.5, duration: 8.5, suffix: 'ience', formula: '原义：正在听的人', meaning: '听众；观众', asset: AUD_REPLICA_ASSETS.audience, narration: 'audience 原来就是正在听的人。后来范围扩大，去听演讲、看表演的一群人，都叫 audience，听众或观众。'}),
  wordScene({id: 'audit-hear-check', start: 35, duration: 9.5, suffix: 'it', formula: '先听取陈述，再核查', meaning: '审计；审核', asset: AUD_REPLICA_ASSETS.audit, narration: 'audit 的历史画面是：先听取账目和陈述，再认真核查。所以今天的 audit 是审计、审核。这是词源记忆钩子，不等于现代字面直译。'}),
  wordScene({id: 'audible-able-heard', start: 44.5, duration: 8.5, suffix: 'ible', formula: '-ible = able to  能够', meaning: '听得见的', asset: AUD_REPLICA_ASSETS.audible, narration: 'audible 里，ible 表示能够。能够被耳朵接收到，就是 audible，听得见的。The voice is barely audible，声音几乎听不见。'}),
  wordScene({id: 'audition-try-hearing', start: 53, duration: 8.5, suffix: 'ition', formula: '让别人听一听你的表现', meaning: '试音；试镜', asset: AUD_REPLICA_ASSETS.audition, narration: 'audition 就是让别人听一听你的表现，判断是否合适。所以它是试音，也常指演员的试镜。这就是一次听选。'}),
  wordScene({id: 'auditorium-hearing-place', start: 61.5, duration: 9, suffix: 'itorium', formula: '供人听演讲或表演的地方', meaning: '礼堂；观众席', asset: AUD_REPLICA_ASSETS.auditorium, narration: 'auditorium 是专门让人坐下来听演讲、音乐或表演的地方，也就是礼堂、会堂，或剧场里的观众席。'}),
  wordScene({id: 'inaudible-not-heard', start: 70.5, duration: 8.5, prefix: 'in', suffix: 'ible', formula: 'in- 不 + audible 听得见', meaning: '听不见的', asset: AUD_REPLICA_ASSETS.inaudible, narration: 'inaudible 在 audible 前加 in，表示不。声音被挡住，耳朵接不到，就是 inaudible，听不见的，也就是无法听清。'}),
  wordScene({id: 'audiobook-heard-book', start: 79, duration: 8.5, suffix: 'iobook', formula: 'audio 声音 + book 书', meaning: '有声书', asset: AUD_REPLICA_ASSETS.audiobook, narration: 'audiobook 很透明：audio 是声音，book 是书。不是用眼睛读，而是用耳朵听的书，就是有声书，适合通勤时听。'}),
  {
    id: 'example-sentences', start: 87.5, duration: 10.5,
    narration: '放进句子里：The audience enjoyed the audio，观众喜欢这段音频。She passed the audition，她通过了试镜。The announcement was inaudible，广播听不清。',
    captions: narrationToCaptions('放进句子里：The audience enjoyed the audio，观众喜欢这段音频。She passed the audition，她通过了试镜。The announcement was inaudible，广播听不清。', 10.5),
    sfx: [{at: 0.12, name: 'scribble', volume: 0.15}],
    layers: [
      text({id: 'examples-title', from: 0.05, duration: 10.1, enter: 'rise', enterDuration: 0.36, x: 260, y: 70, width: 1400, fontSize: 66, fontWeight: 800, align: 'center', runs: [{text: '把“听”放回句子', color: 'primary'}]}),
      text({id: 'ex1', from: 0.8, duration: 9.3, enter: 'typewriter', enterDuration: 0.4, x: 150, y: 235, width: 1620, fontSize: 44, fontWeight: 700, typewriterCharsPerSec: 22, runs: [{text: 'The ', color: 'primary'}, {text: 'audience', color: 'accent'}, {text: ' enjoyed the audio.  观众喜欢这段音频。', color: 'primary'}]}),
      text({id: 'ex2', from: 3.7, duration: 6.4, enter: 'typewriter', enterDuration: 0.4, x: 150, y: 390, width: 1620, fontSize: 44, fontWeight: 700, typewriterCharsPerSec: 22, runs: [{text: 'She passed the ', color: 'primary'}, {text: 'audition', color: 'accent'}, {text: '.  她通过了试镜。', color: 'primary'}]}),
      text({id: 'ex3', from: 6.4, duration: 3.7, enter: 'typewriter', enterDuration: 0.4, x: 150, y: 545, width: 1620, fontSize: 44, fontWeight: 700, typewriterCharsPerSec: 22, runs: [{text: 'The announcement was ', color: 'primary'}, {text: 'inaudible', color: 'accent'}, {text: '.  广播听不清。', color: 'primary'}]}),
    ], transitionOut: WHITE_FADE,
  },
  {
    id: 'final-summary', start: 98, duration: 14.2,
    narration: '最后收口：aud 就是 hear，听。audio 是声音，audience 是听众，audit 是听取后核查，audible 是能听见，audition 是试音，auditorium 是听音场所，inaudible 是听不见，audiobook 是用耳朵听的书。',
    captions: narrationToCaptions('最后收口：aud 就是 hear，听。audio 是声音，audience 是听众，audit 是听取后核查，audible 是能听见，audition 是试音，auditorium 是听音场所，inaudible 是听不见，audiobook 是用耳朵听的书。', 13.7),
    sfx: [{at: 0.12, name: 'stamp', volume: 0.17}],
    layers: [
      text({id: 'summary-title', from: 0.05, duration: 13.15, enter: 'rise', enterDuration: 0.38, x: 250, y: 38, width: 1420, align: 'center', fontSize: 64, fontWeight: 800, runs: [{text: 'aud = ', color: 'primary'}, {text: 'hear / 听', color: 'accent'}]}),
      table({id: 'summary-table', from: 0.35, duration: 12.85, enter: 'rise', enterDuration: 0.42, x: 115, y: 125, width: 1690, height: 675, columns: 1, rowFromStep: 0.4, compact: true, variant: 'open', partInMeaning: true, wordFontSize: 36, phoneticFontSize: 22, meaningFontSize: 30, wordColumnFraction: 0.37, rows: [
        {word: 'audio', phonetic: '/ˈɔːdiəʊ/', part: 'n./adj.', meaning: '声音；音频（的）', accent: 'aud'},
        {word: 'audience', phonetic: '/ˈɔːdiəns/', part: 'n.', meaning: '听众；观众', accent: 'aud'},
        {word: 'audit', phonetic: '/ˈɔːdɪt/', part: 'n./v.', meaning: '审计；审核', accent: 'aud'},
        {word: 'audible', phonetic: '/ˈɔːdəbl/', part: 'adj.', meaning: '听得见的', accent: 'aud'},
        {word: 'audition', phonetic: '/ɔːˈdɪʃn/', part: 'n./v.', meaning: '试音；试镜', accent: 'aud'},
        {word: 'auditorium', phonetic: '/ˌɔːdɪˈtɔːriəm/', part: 'n.', meaning: '礼堂；观众席', accent: 'aud'},
        {word: 'inaudible', phonetic: '/ɪnˈɔːdəbl/', part: 'adj.', meaning: '听不见的', accent: 'aud'},
        {word: 'audiobook', phonetic: '/ˈɔːdiəbʊk/', part: 'n.', meaning: '有声书', accent: 'aud'},
      ]}),
    ],
  },
];

export const audStoryboard: ReplicaStoryboard = {id: 'aud', duration: 112.2, fadeToBlackSec: 0.5, fadeEndOpacity: 1, scenes};
