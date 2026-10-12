import audioManifestJson from '../jectAudioManifest.json';
import {
  JECT_REPLICA_NEGATIVE_PROMPT,
  jectReplicaIllustrationPrompts,
} from '../jectIllustrationPrompts';
import {jectStoryboard} from '../jectStoryboard';
import {SERIES_BACKGROUND_MUSIC} from '../seriesAudio';
import type {ReplicaAudioManifest} from '../ReplicaVideo';
import type {ReplicaProjectDefinition} from '../projectTypes';

export const jectProject: ReplicaProjectDefinition = {
  slug: 'ject',
  compositionId: 'JectReplica',
  title: 'ject = throw 词根讲解',
  storyboard: jectStoryboard,
  audioManifest: audioManifestJson as ReplicaAudioManifest,
  backgroundMusic: SERIES_BACKGROUND_MUSIC,
  visualRenderer: 'ject-continuous',
  paths: {
    audioManifestFile: 'src/replica/jectAudioManifest.json',
    publicAudioDir: 'public/assets/audio/replica/ject',
    greenSourceDir: 'assets/green-screen/ject',
    alphaAssetDir: 'public/assets/replica/ject',
    outputVideo: 'outputs/ject/ject.mp4',
    outputCover: 'outputs/ject/cover.png',
    outputLandscapeCover: 'outputs/ject/cover-landscape.png',
    outputDouyinCopy: 'outputs/ject/douyin-copy.md',
  },
  cover: {
    seriesLabel: '小黑拆词根',
    root: 'JECT',
    englishMeaning: 'THROW',
    chineseMeaning: '投出去',
    hook: '一个动作，记住 5 个单词',
    words: ['reject', 'project', 'inject', 'object', 'subject'],
    illustrationPath: 'assets/replica/ject/00_throw_hook.png',
    illustrationPosition: '52% 50%',
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
    negativePrompt: JECT_REPLICA_NEGATIVE_PROMPT,
  },
  illustrations: jectReplicaIllustrationPrompts,
};
