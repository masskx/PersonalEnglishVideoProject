import audioManifestJson from '../boubaKikiAudioManifest.json';
import {
  BOUBA_KIKI_REPLICA_NEGATIVE_PROMPT,
  boubaKikiReplicaIllustrationPrompts,
} from '../boubaKikiIllustrationPrompts';
import {boubaKikiStoryboard} from '../boubaKikiStoryboard';
import {SERIES_BACKGROUND_MUSIC} from '../seriesAudio';
import {BOUBA_KIKI_CONTINUOUS_STAGE} from '../continuousStageData';
import type {ReplicaAudioManifest} from '../ReplicaVideo';
import type {ReplicaProjectDefinition} from '../projectTypes';

export const boubaKikiProject: ReplicaProjectDefinition = {
  slug: 'bouba-kiki',
  compositionId: 'BoubaKikiReplica',
  title: 'Bouba/Kiki 语音象征讲解',
  reference: {
    videoPath: '样片/video_用“波巴奇奇”记语音象征的发音组..._0.mp4',
    durationSec: 102.3,
  },
  storyboard: boubaKikiStoryboard,
  audioManifest: audioManifestJson as ReplicaAudioManifest,
  backgroundMusic: SERIES_BACKGROUND_MUSIC,
  visualRenderer: 'continuous',
  continuousStage: BOUBA_KIKI_CONTINUOUS_STAGE,
  paths: {
    audioManifestFile: 'src/replica/boubaKikiAudioManifest.json',
    publicAudioDir: 'public/assets/audio/replica/bouba-kiki',
    greenSourceDir: 'assets/green-screen/bouba-kiki',
    alphaAssetDir: 'public/assets/replica/bouba-kiki',
    outputVideo: 'outputs/bouba-kiki/bouba-kiki.mp4',
    outputCover: 'outputs/bouba-kiki/cover.png',
    outputLandscapeCover: 'outputs/bouba-kiki/cover-landscape.png',
    outputDouyinCopy: 'outputs/bouba-kiki/douyin-copy.md',
  },
  cover: {
    seriesLabel: '小黑拆词根',
    eyebrow: '声音也会“画”形状',
    root: 'BOUBA KIKI',
    englishMeaning: 'SOUND SHAPE',
    chineseMeaning: '声音也有形状',
    hook: '5 组发音，自带画面感',
    familyLabel: '这 5 组，一起记',
    words: ['cr-', 'gl-', 'sl-', 'sn-', 'sp-'],
    wordHighlights: ['cr', 'gl', 'sl', 'sn', 'sp'],
    illustrationPath: 'assets/replica/bouba-kiki/02_thinking_figure.png',
    illustrationPosition: '55% 50%',
    illustrationFit: 'contain',
    illustrationScale: 1.25,
  },
  quality: {
    maxPlaybackRate: 1.16,
    warnPlaybackRate: 1.12,
    audioSilence: {
      thresholdDb: -45,
      minimumDurationSec: 1.2,
      allowedWindows: [
        {
          start: 62.5,
          end: 65,
          reason: 'Matches the deliberate sp-to-sn teaching pause in the reference video.',
        },
      ],
    },
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
    negativePrompt: BOUBA_KIKI_REPLICA_NEGATIVE_PROMPT,
  },
  illustrations: boubaKikiReplicaIllustrationPrompts,
};

export default boubaKikiProject;
