import audioManifestJson from '../scriptScribAudioManifest.json';
import {SCRIPT_SCRIB_NEGATIVE_PROMPT, scriptScribIllustrationPrompts} from '../scriptScribIllustrationPrompts';
import {scriptScribStoryboard} from '../scriptScribStoryboard';
import {SERIES_BACKGROUND_MUSIC} from '../seriesAudio';
import {SCRIPT_SCRIB_CONTINUOUS_STAGE} from '../continuousStageData';
import type {ReplicaAudioManifest} from '../ReplicaVideo';
import type {ReplicaProjectDefinition} from '../projectTypes';

export const scriptScribProject: ReplicaProjectDefinition = {
  slug: 'script-scrib',
  compositionId: 'ScriptScribReplica',
  title: 'script / scrib = write / 写 词根讲解',
  storyboard: scriptScribStoryboard,
  audioManifest: audioManifestJson as ReplicaAudioManifest,
  backgroundMusic: SERIES_BACKGROUND_MUSIC,
  visualRenderer: 'continuous',
  continuousStage: SCRIPT_SCRIB_CONTINUOUS_STAGE,
  paths: {
    audioManifestFile: 'src/replica/scriptScribAudioManifest.json',
    publicAudioDir: 'public/assets/audio/replica/script-scrib',
    greenSourceDir: 'assets/green-screen/script-scrib',
    alphaAssetDir: 'public/assets/replica/script-scrib',
    outputVideo: 'outputs/script-scrib/script-scrib.mp4',
    outputCover: 'outputs/script-scrib/cover.png',
    outputLandscapeCover: 'outputs/script-scrib/cover-landscape.png',
    outputDouyinCopy: 'outputs/script-scrib/douyin-copy.md',
  },
  cover: {
    seriesLabel: '小黑拆词根',
    root: 'SCRIPT / SCRIB',
    englishMeaning: 'WRITE',
    chineseMeaning: '写',
    hook: '跟着笔尖的轨迹，记住 8 个单词',
    words: ['describe', 'prescribe', 'subscribe', 'transcribe', 'manuscript', 'inscription', 'postscript', 'scribble'],
    wordHighlights: ['scrib', 'scrib', 'scrib', 'scrib', 'script', 'script', 'script', 'scrib'],
    illustrationPath: 'assets/replica/script-scrib/00_write_hook.png',
    illustrationPosition: '50% 50%',
    illustrationFit: 'contain',
    illustrationScale: 1.08,
  },
  quality: {maxPlaybackRate: 1.16, warnPlaybackRate: 1.12, audioSilence: {thresholdDb: -45, minimumDurationSec: 1.2}},
  tts: {model: 'cosyvoice-v3-flash', voice: 'longanhuan', rate: 1.14, pitch: 1, volume: 65, useInstruction: false},
  image: {model: 'doubao-seedream-4-0-250828', size: '2K', chromaKey: '#00FF00', negativePrompt: SCRIPT_SCRIB_NEGATIVE_PROMPT},
  illustrations: scriptScribIllustrationPrompts,
};
