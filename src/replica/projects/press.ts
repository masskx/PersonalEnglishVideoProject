import audioManifestJson from '../pressAudioManifest.json';
import {
  PRESS_REPLICA_NEGATIVE_PROMPT,
  pressReplicaIllustrationPrompts,
} from '../pressIllustrationPrompts';
import {pressStoryboard} from '../pressStoryboard';
import {SERIES_BACKGROUND_MUSIC} from '../seriesAudio';
import {PRESS_CONTINUOUS_STAGE} from '../continuousStageData';
import type {ReplicaAudioManifest} from '../ReplicaVideo';
import type {ReplicaProjectDefinition} from '../projectTypes';

export const pressProject: ReplicaProjectDefinition = {
  slug: 'press',
  compositionId: 'PressReplica',
  title: 'press 词根讲解',
  reference: {
    videoPath: '样片/video_从press“压”记住这么多单词..._0.mp4',
    durationSec: 172.667,
  },
  storyboard: pressStoryboard,
  audioManifest: audioManifestJson as ReplicaAudioManifest,
  backgroundMusic: SERIES_BACKGROUND_MUSIC,
  visualRenderer: 'continuous',
  continuousStage: PRESS_CONTINUOUS_STAGE,
  paths: {
    audioManifestFile: 'src/replica/pressAudioManifest.json',
    publicAudioDir: 'public/assets/audio/replica/press',
    greenSourceDir: 'assets/green-screen/press',
    alphaAssetDir: 'public/assets/replica/press',
    outputVideo: 'outputs/press/press.mp4',
    outputCover: 'outputs/press/cover.png',
    outputLandscapeCover: 'outputs/press/cover-landscape.png',
    outputDouyinCopy: 'outputs/press/douyin-copy.md',
  },
  cover: {
    seriesLabel: '小黑拆词根',
    root: 'PRESS',
    englishMeaning: 'PRESS DOWN',
    chineseMeaning: '按 / 压',
    hook: '一个按压动作，带走 5 个高频词',
    words: ['pressure', 'impress', 'express', 'depress', 'compress'],
    illustrationPath: 'assets/replica/press/01_press.png',
    illustrationPosition: '50% 48%',
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
    negativePrompt: PRESS_REPLICA_NEGATIVE_PROMPT,
  },
  illustrations: pressReplicaIllustrationPrompts,
};
