import audioManifestJson from '../audAudioManifest.json';
import {AUD_REPLICA_NEGATIVE_PROMPT, audReplicaIllustrationPrompts} from '../audIllustrationPrompts';
import {audStoryboard} from '../audStoryboard';
import {SERIES_BACKGROUND_MUSIC} from '../seriesAudio';
import {AUD_CONTINUOUS_STAGE} from '../continuousStageData';
import type {ReplicaAudioManifest} from '../ReplicaVideo';
import type {ReplicaProjectDefinition} from '../projectTypes';

export const audProject: ReplicaProjectDefinition = {
  slug: 'aud',
  compositionId: 'AudReplica',
  title: 'aud = hear 词根讲解',
  reference: {videoPath: 'outputs/press/press.mp4', durationSec: 172.714667},
  storyboard: audStoryboard,
  audioManifest: audioManifestJson as ReplicaAudioManifest,
  backgroundMusic: SERIES_BACKGROUND_MUSIC,
  visualRenderer: 'continuous',
  continuousStage: AUD_CONTINUOUS_STAGE,
  paths: {
    audioManifestFile: 'src/replica/audAudioManifest.json',
    publicAudioDir: 'public/assets/audio/replica/aud',
    greenSourceDir: 'assets/green-screen/aud',
    alphaAssetDir: 'public/assets/replica/aud',
    outputVideo: 'outputs/aud/aud.mp4',
    outputCover: 'outputs/aud/cover.png',
    outputLandscapeCover: 'outputs/aud/cover-landscape.png',
    outputDouyinCopy: 'outputs/aud/douyin-copy.md',
  },
  cover: {
    seriesLabel: '小黑拆词根',
    root: 'AUD',
    englishMeaning: 'HEAR',
    chineseMeaning: '听',
    hook: '把耳朵变成接收器，记住 8 个单词',
    words: ['audio', 'audience', 'audit', 'audible', 'audition', 'auditorium', 'inaudible', 'audiobook'],
    illustrationPath: 'assets/replica/aud/00_hear_hook.png',
    illustrationPosition: '50% 50%',
    illustrationFit: 'contain',
    illustrationScale: 1.12,
  },
  quality: {maxPlaybackRate: 1.16, warnPlaybackRate: 1.12, audioSilence: {thresholdDb: -45, minimumDurationSec: 1.2}},
  tts: {model: 'cosyvoice-v3-flash', voice: 'longanhuan', rate: 1.14, pitch: 1, volume: 65, useInstruction: false},
  image: {model: 'doubao-seedream-4-0-250828', size: '2K', chromaKey: '#00FF00', negativePrompt: AUD_REPLICA_NEGATIVE_PROMPT},
  illustrations: audReplicaIllustrationPrompts,
};
