import audioManifestJson from '../portAudioManifest.json';
import {
  PORT_REPLICA_NEGATIVE_PROMPT,
  portReplicaIllustrationPrompts,
} from '../portIllustrationPrompts';
import {portStoryboard} from '../portStoryboard';
import {SERIES_BACKGROUND_MUSIC} from '../seriesAudio';
import {PORT_CONTINUOUS_STAGE} from '../continuousStageData';
import type {ReplicaAudioManifest} from '../ReplicaVideo';
import type {ReplicaProjectDefinition} from '../projectTypes';

export const portProject: ReplicaProjectDefinition = {
  slug: 'port',
  compositionId: 'PortReplica',
  title: 'port = carry 词根讲解',
  storyboard: portStoryboard,
  audioManifest: audioManifestJson as ReplicaAudioManifest,
  backgroundMusic: SERIES_BACKGROUND_MUSIC,
  visualRenderer: 'continuous',
  continuousStage: PORT_CONTINUOUS_STAGE,
  paths: {
    audioManifestFile: 'src/replica/portAudioManifest.json',
    publicAudioDir: 'public/assets/audio/replica/port',
    greenSourceDir: 'assets/green-screen/port',
    alphaAssetDir: 'public/assets/replica/port',
    outputVideo: 'outputs/port/port.mp4',
    outputCover: 'outputs/port/cover.png',
    outputLandscapeCover: 'outputs/port/cover-landscape.png',
    outputDouyinCopy: 'outputs/port/douyin-copy.md',
  },
  cover: {
    seriesLabel: '小黑拆词根',
    root: 'PORT',
    englishMeaning: 'CARRY',
    chineseMeaning: '携带、运输',
    hook: '一条运输线，记住 8 个单词',
    words: ['import', 'export', 'transport', 'support', 'report', 'portable', 'porter', 'deport'],
    illustrationPath: 'assets/replica/port/00_carry_hook.png',
    illustrationPosition: '52% 50%',
    illustrationFit: 'cover',
    illustrationScale: 1.05,
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
    negativePrompt: PORT_REPLICA_NEGATIVE_PROMPT,
  },
  illustrations: portReplicaIllustrationPrompts,
};
