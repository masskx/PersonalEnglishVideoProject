import audioManifestJson from '../cludClusAudioManifest.json';
import {cludClusIllustrationPrompts} from '../cludClusIllustrationPrompts';
import {buildContinuousStage} from '../autoContinuousStage';
import {cludClusStoryboard} from '../cludClusStoryboard';
import {SERIES_BACKGROUND_MUSIC} from '../seriesAudio';
import type {ReplicaAudioManifest} from '../ReplicaVideo';
import type {ReplicaCoverDefinition, ReplicaProjectDefinition} from '../projectTypes';

const CLUD_CLUS_COVER: ReplicaCoverDefinition = {"seriesLabel":"小黑拆词根","root":"CLUD / CLUS","englishMeaning":"CLOSE · SHUT","chineseMeaning":"关 · 合拢","hook":"早餐算在价格里吗？","words":["include","exclude","conclude","preclude","seclude"],"wordHighlights":["clude","clude","clude","clude","clude"],"familyLabel":"关合词根家族","illustrationPath":"assets/replica/clud-clus/include-result.png","illustrationPosition":"50% 50%","illustrationFit":"contain","illustrationScale":1.08};

export const cludClusProject: ReplicaProjectDefinition = {
  slug: 'clud-clus',
  compositionId: 'CludClusReplica',
  title: 'CLUD / CLUS = close / shut 词根讲解',
  keyposePlan: 'planning/clud-clus-keyposes.json',
  storyboard: cludClusStoryboard,
  audioManifest: audioManifestJson as ReplicaAudioManifest,
  backgroundMusic: {...SERIES_BACKGROUND_MUSIC, volume: 0.10, duckedVolume: 0.095},
  visualRenderer: 'continuous',
  continuousStage: buildContinuousStage(cludClusStoryboard, CLUD_CLUS_COVER),
  paths: {
    audioManifestFile: 'src/replica/cludClusAudioManifest.json',
    publicAudioDir: 'public/assets/audio/replica/clud-clus',
    greenSourceDir: 'assets/green-screen/clud-clus',
    alphaAssetDir: 'public/assets/replica/clud-clus',
    outputVideo: 'outputs/clud-clus/clud-clus.mp4',
    outputCover: 'outputs/clud-clus/cover.png',
    outputLandscapeCover: 'outputs/clud-clus/cover-landscape.png',
    outputDouyinCopy: 'outputs/clud-clus/publish-copy.md',
  },
  cover: CLUD_CLUS_COVER,
  publishCopy: {"titles":["include 和 exclude：早餐算在价格里吗？","CLUD / CLUS 词根：五个词看懂关在哪里","exclude 与 preclude：不包括，还是办不成？"],"opening":"价格包含早餐，用 include；早餐要另外付钱，用 exclude。小黑用盒子、文件夹和闸门演示五个关合词根词。","takeaway":"记住 close / shut 的词源线索，再用现代词义与搭配区分包括、排除、结束、阻止和独处。","prompt":"The injury ___ him from playing. 你会填哪个词？","pinnedComment":"答案是 precluded。exclude him from the team 说的是排除出队伍；preclude him from playing 说的是使他无法参赛。"},
  quality: {
    maxPlaybackRate: 1.16,
    warnPlaybackRate: 1.12,
    audioSilence: {thresholdDb: -45, minimumDurationSec: 1.2, allowedWindows: [{"start":142.61766666666665,"end":144.63333333333333,"reason":"原创检索练习：旁白要求给自己两秒，题目保持可读，随后讲答案。"}]},
  },
  tts: {
    model: 'cosyvoice-v3-flash',
    voice: 'longanhuan',
    rate: 1.08,
    pitch: 1,
    volume: 65,
    useInstruction: true,
    instruction: '你正在进行科普知识推广，你说话的情感是happy。',
  },
  image: {model: 'gpt-image-2 (built-in image_gen)', size: '2K', chromaKey: '#00FF00', negativePrompt: 'text, logos, extra limbs, cartoon, shadows, gradients'},
  illustrations: cludClusIllustrationPrompts,
};
