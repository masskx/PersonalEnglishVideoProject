import audioManifestJson from '../ponPosAudioManifest.json';
import {PON_POS_NEGATIVE_PROMPT, ponPosIllustrationPrompts} from '../ponPosIllustrationPrompts';
import {ponPosStoryboard} from '../ponPosStoryboard';
import {SERIES_BACKGROUND_MUSIC} from '../seriesAudio';
import type {ReplicaAudioManifest} from '../ReplicaVideo';
import type {ReplicaProjectDefinition} from '../projectTypes';

export const ponPosProject: ReplicaProjectDefinition = {
  slug: 'pon-pos',
  compositionId: 'PonPosReplica',
  title: 'pon / pos = put / place 词根讲解',
  keyposePlan: 'planning/pon-pos-keyposes.json',
  storyboard: ponPosStoryboard,
  audioManifest: audioManifestJson as ReplicaAudioManifest,
  backgroundMusic: SERIES_BACKGROUND_MUSIC,
  visualRenderer: 'default',
  paths: {
    audioManifestFile: 'src/replica/ponPosAudioManifest.json',
    publicAudioDir: 'public/assets/audio/replica/pon-pos',
    greenSourceDir: 'assets/green-screen/pon-pos',
    alphaAssetDir: 'public/assets/replica/pon-pos',
    outputVideo: 'outputs/pon-pos/pon-pos.mp4',
    outputCover: 'outputs/pon-pos/cover.png',
    outputLandscapeCover: 'outputs/pon-pos/cover-landscape.png',
    outputDouyinCopy: 'outputs/pon-pos/publish-copy.md',
  },
  cover: {
    seriesLabel: '小黑拆词根',
    root: 'PON / POS',
    englishMeaning: 'PUT · PLACE',
    chineseMeaning: '放置 · 安放',
    hook: 'put 往哪儿放？',
    words: ['compose', 'expose', 'impose', 'propose', 'oppose', 'dispose', 'deposit'],
    wordHighlights: ['pos', 'pos', 'pos', 'pos', 'pos', 'pos', 'posit'],
    familyLabel: '放置方向词族',
    illustrationPath: 'assets/replica/pon-pos/compose-result.png',
    illustrationPosition: '50% 50%',
    illustrationFit: 'contain',
    illustrationScale: 1.08,
  },
  publishCopy: {
    titles: [
      'PON / POS：put 往哪儿放，七个高频词就不乱了',
      'compose、expose、oppose：同一个“放”，方向完全不同',
      '记住 put / place，拆开一串四六级高频词',
    ],
    opening: 'compose 是把部分放到一起，expose 是把隐藏的东西放出来，oppose 则把自己放到对面。PON / POS 这条线索，关键在“方向”。',
    takeaway: '先抓 put / place，再看前缀把动作带到哪里：一起、外面、上面、前面、对面、分开或下面。',
    prompt: '你最容易混 compose、propose、oppose 里的哪两个？',
    pinnedComment: '留一个 PON / POS 词和你的例句，我帮你检查方向和搭配。',
  },
  quality: {
    maxPlaybackRate: 1.16,
    warnPlaybackRate: 1.12,
    audioSilence: {thresholdDb: -45, minimumDurationSec: 1.2},
  },
  tts: {
    model: 'cosyvoice-v3-flash',
    voice: 'longanhuan',
    rate: 1.08,
    pitch: 1,
    volume: 65,
    useInstruction: true,
    instruction: '你正在进行科普知识推广，你说话的情感是happy。',
  },
  image: {model: 'gpt-image-2 (built-in image_gen)', size: '2K', chromaKey: '#00FF00', negativePrompt: PON_POS_NEGATIVE_PROMPT},
  illustrations: ponPosIllustrationPrompts,
};

