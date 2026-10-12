import audioManifestJson from '../regAudioManifest.json';
import {
  REG_REPLICA_NEGATIVE_PROMPT,
  regReplicaIllustrationPrompts,
} from '../regIllustrationPrompts';
import {regStoryboard} from '../regStoryboard';
import {SERIES_BACKGROUND_MUSIC} from '../seriesAudio';
import {REG_CONTINUOUS_STAGE} from '../continuousStageData';
import type {ReplicaAudioManifest} from '../ReplicaVideo';
import type {ReplicaProjectDefinition} from '../projectTypes';

export const regProject: ReplicaProjectDefinition = {
  slug: 'reg',
  compositionId: 'RegReplica',
  title: 'reg 词根讲解',
  reference: {
    videoPath: '样片/video_这么多带reg的单词怎么记住啊？..._0.mp4',
    durationSec: 3100 / 30,
  },
  storyboard: regStoryboard,
  audioManifest: audioManifestJson as ReplicaAudioManifest,
  backgroundMusic: SERIES_BACKGROUND_MUSIC,
  visualRenderer: 'continuous',
  continuousStage: REG_CONTINUOUS_STAGE,
  paths: {
    audioManifestFile: 'src/replica/regAudioManifest.json',
    publicAudioDir: 'public/assets/audio/replica/reg',
    greenSourceDir: 'assets/green-screen/reg',
    alphaAssetDir: 'public/assets/replica/reg',
    outputVideo: 'outputs/reg/reg.mp4',
    outputCover: 'outputs/reg/cover.png',
    outputLandscapeCover: 'outputs/reg/cover-landscape.png',
    outputDouyinCopy: 'outputs/reg/douyin-copy.md',
  },
  cover: {
    seriesLabel: '小黑拆词根',
    root: 'REG',
    englishMeaning: 'STRAIGHT / RULE',
    chineseMeaning: '直 · 规则',
    hook: '从“直”到“管理”，带走 5 个词',
    words: ['regulate', 'regulation', 'regent', 'regime', 'regal'],
    illustrationPath: 'assets/replica/reg/00_ruler.png',
    illustrationPosition: '50% 50%',
    illustrationFit: 'contain',
    illustrationScale: 1.24,
  },
  quality: {
    maxPlaybackRate: 1.16,
    warnPlaybackRate: 1.12,
    audioSilence: {thresholdDb: -45, minimumDurationSec: 1.2},
  },
  tts: {
    model: 'cosyvoice-v3-flash',
    voice: 'longanhuan',
    rate: 1.14,
    pitch: 1,
    volume: 65,
    useInstruction: false,
  },
  image: {
    model: 'doubao-seedream-4-0-250828',
    size: '2K',
    chromaKey: '#00FF00',
    negativePrompt: REG_REPLICA_NEGATIVE_PROMPT,
  },
  illustrations: regReplicaIllustrationPrompts,
};
