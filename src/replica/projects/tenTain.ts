import audioManifestJson from '../tenTainAudioManifest.json';
import {TEN_TAIN_CONTINUOUS_STAGE} from '../continuousStageData';
import {SERIES_BACKGROUND_MUSIC} from '../seriesAudio';
import {tenTainStoryboard} from '../tenTainStoryboard';
import {TEN_TAIN_NEGATIVE_PROMPT_V3, tenTainIllustrationPromptsV3} from '../tenTainIllustrationPromptsV3';
import type {ReplicaAudioManifest} from '../ReplicaVideo';
import type {ReplicaProjectDefinition} from '../projectTypes';

export const tenTainProject: ReplicaProjectDefinition = {
  slug: 'ten-tain',
  compositionId: 'TenTainReplica',
  title: 'ten / tain = hold / keep 词根讲解',
  keyposePlan: 'planning/ten-tain-keyposes.json',
  storyboard: tenTainStoryboard,
  audioManifest: audioManifestJson as ReplicaAudioManifest,
  backgroundMusic: SERIES_BACKGROUND_MUSIC,
  visualRenderer: 'continuous',
  continuousStage: TEN_TAIN_CONTINUOUS_STAGE,
  paths: {
    audioManifestFile: 'src/replica/tenTainAudioManifest.json',
    publicAudioDir: 'public/assets/audio/replica/ten-tain',
    greenSourceDir: 'assets/green-screen/ten-tain-v3',
    alphaAssetDir: 'public/assets/replica/ten-tain-v3',
    outputVideo: 'outputs/ten-tain/ten-tain.mp4',
    outputCover: 'outputs/ten-tain/cover.png',
    outputLandscapeCover: 'outputs/ten-tain/cover-landscape.png',
    outputDouyinCopy: 'outputs/ten-tain/douyin-copy.md',
  },
  cover: {
    seriesLabel: '小黑拆词根',
    root: 'TEN / TAIN',
    englishMeaning: 'HOLD · KEEP',
    chineseMeaning: '持有 · 保持',
    hook: 'hold 往哪儿走？',
    words: ['retain', 'contain', 'maintain', 'obtain', 'detain', 'sustain', 'entertain', 'abstain'],
    wordHighlights: ['tain', 'tain', 'tain', 'tain', 'tain', 'tain', 'tain', 'tain'],
    familyLabel: '持有与保持词族',
    illustrationPath: 'assets/replica/ten-tain-v3/retain-result.png',
    illustrationPosition: '50% 50%',
    illustrationFit: 'contain',
    illustrationScale: 1.05,
  },
  publishCopy: {
    titles: ['TEN / TAIN：hold 往哪儿走，八个高频词一次串起来', 'retain、contain、detain，到底怎么区分？', '记住 hold，就能拆开这一组四六级高频词'],
    opening: 'retain 是保留，detain 是扣留，entertain 又和“留住注意力”有关。它们都藏着 ten / tain 这条 hold、keep 线索。',
    takeaway: '先抓住 hold，再看前缀把动作带向哪里：留在手里、装在范围里、拦在边界前，词义就有了画面。',
    prompt: '你最容易混 retain、contain、maintain 里的哪两个？',
    pinnedComment: '留一个 TEN / TAIN 词和你的例句，我帮你检查搭配。',
  },
  quality: {
    maxPlaybackRate: 1.16,
    warnPlaybackRate: 1.12,
    audioSilence: {thresholdDb: -45, minimumDurationSec: 1.2},
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
  image: {model: 'gpt-image-2 (built-in image_gen)', size: '2K', chromaKey: '#00FF00', negativePrompt: TEN_TAIN_NEGATIVE_PROMPT_V3},
  illustrations: tenTainIllustrationPromptsV3,
};
