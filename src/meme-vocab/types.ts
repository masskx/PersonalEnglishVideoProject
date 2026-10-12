import type {ReplicaBackgroundMusicDefinition} from '../replica/projectTypes';

export type MemeVocabMode = 'long_explainer' | 'meme_vocab_short';
export type HookAngle = 'pain-point' | 'plot-conflict' | 'test-challenge';
export type ShortSceneType = 'hook' | 'meme_story' | 'word_reveal' | 'real_usage' | 'quiz_cta';
export type InteractionType = 'two_choice' | 'fill_blank' | 'confusable_word';
export type CameraMotion = 'push-in' | 'pan-left' | 'pan-right' | 'local-zoom' | 'shake' | 'parallax' | 'still';

export type MemeVocabInput = {
  mode: 'meme_vocab_short';
  targetWord: string;
  phonetic: string;
  accurateMeaning: string;
  audience: string;
  memeTheme: string;
  scenario: string;
  durationTarget: number;
  difficulty: string;
  relatedWords: string[];
  exampleSentence: string;
  interactionType: InteractionType;
  voiceStyle: string;
  visualStyle: string;
  characterProfile: string;
  assetDirectory: string;
  bgm: string;
  outputDirectory: string;
};

export type HookOption = {
  hookId: string;
  angle: HookAngle;
  text: string;
  rationale: string;
};

export type RevealTiming = {
  word: number;
  phonetic: number;
  meaning: number;
  example?: number;
};

export type MemeVocabRevealTimingFrames = {
  wordStartFrame: number;
  phoneticStartFrame: number;
  meaningStartFrame: number;
  exampleStartFrame?: number;
};

export type MemeVocabCaptionCue = {
  cueId: string;
  text: string;
  displayText: string[];
  emphasizedWords: string[];
  revealStartFrame: number;
  revealEndFrame: number;
  style: 'subtitle' | 'emphasis' | 'quiz-option';
  position: 'safe-bottom' | 'center' | 'quiz';
};

export type ShortStoryboardScene = {
  sceneId: string;
  sceneType: ShortSceneType;
  startTime: number;
  estimatedDuration: number;
  narration: string;
  /** Natural TTS text. Screen displayText is intentionally separate. */
  ttsText: string;
  displayText: string[];
  emphasizedWords: string[];
  imageAssetId: string;
  jimengPrompt: string;
  cropFocus: string;
  cameraMotion: CameraMotion;
  transition: string;
  soundEffect: string;
  revealTiming: RevealTiming;
  commentGoal: string;
  quizQuestion?: string;
  quizAnswer?: string;
  resolvedStartFrame?: number;
  resolvedDurationInFrames?: number;
  resolvedStartTime?: number;
  resolvedDuration?: number;
};

export type ShortStoryboard = {
  mode: 'meme_vocab_short';
  width: 1080;
  height: 1920;
  fps: 30;
  duration: number;
  defaultHookId: string;
  hooks: HookOption[];
  scenes: ShortStoryboardScene[];
};

export type MemeVocabAsset = {
  assetId: string;
  path: string;
  status: 'available' | 'placeholder' | 'missing';
  purpose: string;
  useTime: string;
  cropFocus: string;
  remotionMotion: CameraMotion;
  replacementRequired: boolean;
};

export type MemeVocabAssetManifest = {
  assetDirectory: string;
  assets: MemeVocabAsset[];
  pendingGeneration: string[];
};

export type MemeVocabAudioTimingSegment = {
  segmentId: string;
  sceneId: string;
  text: string;
  audioPath: string;
  outputAudioPath: string;
  startTime: number;
  duration: number;
  endTime: number;
  leadingSilence: number;
  trailingSilence: number;
  speakingRate: number;
  status: 'resolved' | 'failed';
  error?: string;
};

export type MemeVocabAudioTiming = {
  provider: 'dashscope' | 'test-audio';
  status: 'resolved' | 'failed';
  audioDirectory: string;
  narrationPath: string;
  narrationOutputPath: string;
  segments: MemeVocabAudioTimingSegment[];
  totalDuration: number;
  compressionAttempts?: Array<{
    attempt: number;
    text: string;
    duration: number;
  }>;
  error?: string;
};

export type MemeVocabResolvedSceneTimeline = {
  sceneId: string;
  startFrame: number;
  durationInFrames: number;
  endFrame: number;
  startTime: number;
  duration: number;
  endTime: number;
  audioDuration: number;
  audioDurationInFrames: number;
  visualBufferFrames: number;
  quizHoldFrames: number;
  revealTimingFrames: MemeVocabRevealTimingFrames;
};

export type MemeVocabTimeline = {
  source: 'estimated' | 'tts-resolved';
  fps: number;
  totalFrames: number;
  duration: number;
  scenes: MemeVocabResolvedSceneTimeline[];
};

export type MemeVocabTtsConfig = {
  provider: 'dashscope';
  model: string;
  voice: string;
  rate: number;
  pitch: number;
  volume: number;
  format: 'wav';
};

export type MemeVocabVideoConfig = {
  mode: 'meme_vocab_short';
  input: MemeVocabInput;
  storyboard: ShortStoryboard;
  estimatedTimeline: MemeVocabTimeline;
  resolvedTimeline: MemeVocabTimeline;
  audioTiming?: MemeVocabAudioTiming;
  tts: MemeVocabTtsConfig;
  assets: MemeVocabAssetManifest;
  backgroundMusic: ReplicaBackgroundMusicDefinition;
};

export type MemeVocabShortProps = {
  config: MemeVocabVideoConfig;
};
