import audioManifestJson from '../dictAudioManifest.json';
import {DICT_REPLICA_NEGATIVE_PROMPT, dictReplicaIllustrationPrompts} from '../dictIllustrationPrompts';
import {dictStoryboard} from '../dictStoryboard';
import {SERIES_BACKGROUND_MUSIC} from '../seriesAudio';
import {DICT_CONTINUOUS_STAGE} from '../continuousStageData';
import type {ReplicaAudioManifest} from '../ReplicaVideo';
import type {ReplicaProjectDefinition} from '../projectTypes';

export const dictProject: ReplicaProjectDefinition = {
  slug: 'dict',
  compositionId: 'DictReplica',
  title: 'dict = say / 说 词根讲解',
  storyboard: dictStoryboard,
  audioManifest: audioManifestJson as ReplicaAudioManifest,
  backgroundMusic: SERIES_BACKGROUND_MUSIC,
  visualRenderer: 'continuous',
  continuousStage: DICT_CONTINUOUS_STAGE,
  paths: {
    audioManifestFile: 'src/replica/dictAudioManifest.json',
    publicAudioDir: 'public/assets/audio/replica/dict',
    greenSourceDir: 'assets/green-screen/dict',
    alphaAssetDir: 'public/assets/replica/dict',
    outputVideo: 'outputs/dict/dict.mp4',
    outputCover: 'outputs/dict/cover.png',
    outputLandscapeCover: 'outputs/dict/cover-landscape.png',
    outputDouyinCopy: 'outputs/dict/douyin-copy.md',
  },
  cover: {
    seriesLabel: '小黑拆词根',
    root: 'DICT',
    englishMeaning: 'SAY',
    chineseMeaning: '说',
    hook: '把“说出口的话”压成文字，记住 8 个单词',
    words: ['predict', 'contradict', 'verdict', 'dictate', 'dictionary', 'diction', 'dictation', 'indict'],
    illustrationPath: 'assets/replica/dict/00_say_hook.png',
    illustrationPosition: '50% 50%',
    illustrationFit: 'contain',
    illustrationScale: 1.1,
  },
  quality: {maxPlaybackRate: 1.16, warnPlaybackRate: 1.12, audioSilence: {thresholdDb: -45, minimumDurationSec: 1.2}},
  tts: {model: 'cosyvoice-v3-flash', voice: 'longanhuan', rate: 1.14, pitch: 1, volume: 65, useInstruction: false},
  image: {model: 'doubao-seedream-4-0-250828', size: '2K', chromaKey: '#00FF00', negativePrompt: DICT_REPLICA_NEGATIVE_PROMPT},
  illustrations: dictReplicaIllustrationPrompts,
};
