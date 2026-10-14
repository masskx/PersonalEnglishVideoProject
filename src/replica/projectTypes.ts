import type {ReplicaAudioManifest} from './ReplicaVideo';
import type {ReplicaStoryboard} from './types';

export type ReplicaIllustrationPrompt = {
  id: string;
  filename: `${string}.png`;
  purpose: string;
  subject: string;
  prompt: string;
};

export type ReplicaCoverDefinition = {
  seriesLabel: string;
  badgeLabel?: string;
  landscapeBadgeLabel?: string;
  footerLabel?: string;
  landscapeFooterLabel?: string;
  /** 封面左下角的一行说明；默认是词根期的“看动作 · 拆前缀 · 记词族”。 */
  footerTagline?: string;
  eyebrow?: string;
  root: string;
  englishMeaning: string;
  chineseMeaning: string;
  hook: string;
  words: readonly string[];
  familyLabel?: string;
  wordHighlights?: readonly string[];
  illustrationPath: string;
  illustrationPosition?: string;
  illustrationFit?: 'cover' | 'contain';
  illustrationScale?: number;
};

export type ReplicaPublishCopyDefinition = {
  titles: readonly [string, string, string];
  opening: string;
  takeaway: string;
  prompt: string;
  pinnedComment: string;
};

export type ReplicaBackgroundMusicDefinition = {
  src: string;
  volume: number;
  duckedVolume: number;
  fadeInSec: number;
  fadeOutSec: number;
  duckAttackSec: number;
  duckReleaseSec: number;
  loop: boolean;
};

export type ContinuousSceneMotion =
  | 'left'
  | 'right'
  | 'up'
  | 'down'
  | 'in'
  | 'out'
  | 'press'
  | 'impact'
  | 'still';

export type SemanticAction =
  | 'focus'
  | 'compare'
  | 'form-image'
  | 'enter-view'
  | 'play'
  | 'scan'
  | 'present-proof'
  | 'clarify'
  | 'approach'
  | 'revisit'
  | 'cascade'
  | 'gather';

export type ContinuousScenePlan = {
  /** Scene-local semantic climax in seconds, aligned to the narration beat. */
  actionAt: number;
  action: SemanticAction;
  camera?: 'left' | 'right' | 'in' | 'out' | 'none';
  imageLayerId?: string;
  imageFit?: 'contain' | 'cover';
  imageScale?: number;
  strength?: number;
  layout?: 'text-left' | 'text-right';
  wordBuild?: {
    layerId: string;
    prefix: string;
    root: string;
    suffix: string;
    /** Scene-local assembly start in seconds. */
    at: number;
  };
};

export type ContinuousStageDefinition = {
  root: string;
  meaning: string;
  /** Keep the chapter badge off the finished video by default; enable only for an explicit teaching need. */
  showChapterBadge?: boolean;
  /** Humanized is the default for new renders; legacy is reserved for exact historical replicas. */
  motionProfile?: 'humanized' | 'legacy';
  /** The large pale root watermark is opt-in because it often reads as production furniture. */
  showRootWatermark?: boolean;
  /** One semantic motion per scene. Keys are storyboard scene ids. */
  sceneMotion: Readonly<Record<string, ContinuousSceneMotion>>;
  /** Optional semantic keyframe choreography. Falls back to sceneMotion when absent. */
  scenePlans?: Readonly<Record<string, ContinuousScenePlan>>;
  /** Optional native-30fps RGBA frame directory keyed by storyboard scene id. */
  dynamicAssets?: Readonly<Record<string, string>>;
  /** Uses transparent cards and disables camera movement; humanized local keyframes may still act on them. */
  staticCardMode?: boolean;
  /** Hold opacity for static image layers; useful when art must remain subordinate to text. */
  staticImageOpacity?: number;
  /** Optional episode-specific semantic prop choreography layered over static Xiaohei art. */
  semanticPropTrack?: 'flect-flex' | 'rupt' | 'mit-miss';
  /** Full-canvas SVG prop choreography is legacy-only and must be explicitly enabled. */
  showSemanticPropOverlay?: boolean;
};

export type ReplicaProjectDefinition = {
  slug: string;
  compositionId: string;
  title: string;
  reference?: {
    videoPath: string;
    durationSec: number;
  };
  storyboard: ReplicaStoryboard;
  audioManifest: ReplicaAudioManifest;
  backgroundMusic: ReplicaBackgroundMusicDefinition;
  /** Selects a persistent, project-data-driven visual stage without changing audio timing. */
  visualRenderer?: 'default' | 'continuous' | 'ject-continuous';
  continuousStage?: ContinuousStageDefinition;
  /** Root-word episodes must bind each taught word to its own reviewed semantic pose set. */
  keyposePlan?: string;
  paths: {
    audioManifestFile: string;
    publicAudioDir: string;
    greenSourceDir: string;
    alphaAssetDir: string;
    outputVideo: string;
    outputCover?: string;
    outputLandscapeCover?: string;
    outputDouyinCopy?: string;
  };
  cover?: ReplicaCoverDefinition;
  /** Episode-specific natural copy; preferred over reusable series prose. */
  publishCopy?: ReplicaPublishCopyDefinition;
  quality?: {
    maxPlaybackRate?: number;
    warnPlaybackRate?: number;
    audioSilence?: {
      thresholdDb: number;
      minimumDurationSec: number;
      allowedWindows?: Array<{
        start: number;
        end: number;
        reason: string;
      }>;
    };
  };
  tts: {
    model: string;
    voice: string;
    rate: number;
    pitch: number;
    volume: number;
    useInstruction: boolean;
    instruction?: string;
  };
  image: {
    model: string;
    size: string;
    chromaKey: string;
    negativePrompt: string;
  };
  illustrations: readonly ReplicaIllustrationPrompt[];
};
