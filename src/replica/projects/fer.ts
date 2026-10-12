import audioManifestJson from '../ferAudioManifest.json';
import {
  FER_REPLICA_NEGATIVE_PROMPT,
  ferReplicaIllustrationPrompts,
} from '../ferIllustrationPrompts';
import {ferStoryboard} from '../ferStoryboard';
import {SERIES_BACKGROUND_MUSIC} from '../seriesAudio';
import {FER_CONTINUOUS_STAGE} from '../continuousStageData';
import type {ReplicaAudioManifest} from '../ReplicaVideo';
import type {ReplicaProjectDefinition} from '../projectTypes';

export const ferProject: ReplicaProjectDefinition = {
  slug: 'fer',
  compositionId: 'FerReplica',
  title: 'fer 词根讲解',
  reference: {
    videoPath: '样片/video_这么多带fer的单词，到底怎么记..._0.mp4',
    durationSec: 136.033,
  },
  storyboard: ferStoryboard,
  audioManifest: audioManifestJson as ReplicaAudioManifest,
  backgroundMusic: SERIES_BACKGROUND_MUSIC,
  visualRenderer: 'continuous',
  continuousStage: FER_CONTINUOUS_STAGE,
  paths: {
    audioManifestFile: 'src/replica/ferAudioManifest.json',
    publicAudioDir: 'public/assets/audio/replica/fer',
    greenSourceDir: 'assets/green-screen/fer',
    alphaAssetDir: 'public/assets/replica/fer',
    outputVideo: 'outputs/fer/fer.mp4',
    outputCover: 'outputs/fer/cover.png',
    outputLandscapeCover: 'outputs/fer/cover-landscape.png',
    outputDouyinCopy: 'outputs/fer/douyin-copy.md',
  },
  cover: {
    seriesLabel: '小黑拆词根',
    root: 'FER',
    englishMeaning: 'CARRY',
    chineseMeaning: '携带 / 搬运',
    hook: '前缀定方向，带走 5 个词',
    words: ['transfer', 'offer', 'prefer', 'refer', 'defer'],
    illustrationPath: 'assets/replica/fer/01_carry_figure.png',
    illustrationPosition: '49% 50%',
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
    negativePrompt: FER_REPLICA_NEGATIVE_PROMPT,
  },
  illustrations: ferReplicaIllustrationPrompts,
};
