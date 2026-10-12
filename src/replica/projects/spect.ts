import audioManifestJson from '../spectAudioManifest.json';
import {
  SPECT_REPLICA_NEGATIVE_PROMPT,
  spectReplicaIllustrationPrompts,
} from '../spectIllustrationPrompts';
import {spectStoryboard} from '../spectStoryboard';
import {SERIES_BACKGROUND_MUSIC} from '../seriesAudio';
import {SPECT_CONTINUOUS_STAGE} from '../continuousStageData';
import type {ReplicaAudioManifest} from '../ReplicaVideo';
import type {ReplicaProjectDefinition} from '../projectTypes';

export const spectProject: ReplicaProjectDefinition = {
  slug: 'spect',
  compositionId: 'SpectReplica',
  title: 'spect = look 词根讲解',
  storyboard: spectStoryboard,
  audioManifest: audioManifestJson as ReplicaAudioManifest,
  backgroundMusic: SERIES_BACKGROUND_MUSIC,
  visualRenderer: 'continuous',
  continuousStage: SPECT_CONTINUOUS_STAGE,
  paths: {
    audioManifestFile: 'src/replica/spectAudioManifest.json',
    publicAudioDir: 'public/assets/audio/replica/spect',
    greenSourceDir: 'assets/green-screen/spect',
    alphaAssetDir: 'public/assets/replica/spect',
    outputVideo: 'outputs/spect/spect.mp4',
    outputCover: 'outputs/spect/cover.png',
    outputLandscapeCover: 'outputs/spect/cover-landscape.png',
    outputDouyinCopy: 'outputs/spect/douyin-copy.md',
  },
  cover: {
    seriesLabel: '小黑拆词根',
    root: 'SPECT',
    englishMeaning: 'LOOK',
    chineseMeaning: '看、观察',
    hook: '一只观察镜头，记住 8 个单词',
    words: ['inspect', 'respect', 'suspect', 'expect', 'prospect', 'spectator', 'spectacle', 'retrospect'],
    illustrationPath: 'assets/replica/spect/00_look_hook.png',
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
    negativePrompt: SPECT_REPLICA_NEGATIVE_PROMPT,
  },
  illustrations: spectReplicaIllustrationPrompts,
};
