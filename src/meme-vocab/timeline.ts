import type {
  MemeVocabAudioTimingSegment,
  MemeVocabResolvedSceneTimeline,
  MemeVocabRevealTimingFrames,
  MemeVocabTimeline,
  ShortStoryboard,
} from './types';

const FPS = 30;
const frameSeconds = (frames: number) => Number((frames / FPS).toFixed(3));
const secondsFrames = (seconds: number) => Math.max(1, Math.ceil(seconds * FPS));

const emptyRevealTiming = (scene: ShortStoryboard['scenes'][number], startFrame: number): MemeVocabRevealTimingFrames => ({
  wordStartFrame: startFrame + Math.max(0, Math.round(scene.revealTiming.word * FPS)),
  phoneticStartFrame: startFrame + Math.max(0, Math.round(scene.revealTiming.phonetic * FPS)),
  meaningStartFrame: startFrame + Math.max(0, Math.round(scene.revealTiming.meaning * FPS)),
  ...(scene.revealTiming.example === undefined ? {} : {exampleStartFrame: startFrame + Math.round(scene.revealTiming.example * FPS)}),
});

const timelineFromDurations = (
  storyboard: ShortStoryboard,
  durationsInFrames: number[],
  source: MemeVocabTimeline['source'],
  audioByScene?: Map<string, MemeVocabAudioTimingSegment>,
): MemeVocabTimeline => {
  let cursor = 0;
  const scenes = storyboard.scenes.map((scene, index) => {
    const durationInFrames = Math.max(1, durationsInFrames[index] ?? 1);
    const startFrame = cursor;
    const endFrame = startFrame + durationInFrames;
    cursor = endFrame;
    const audio = audioByScene?.get(scene.sceneId);
    const audioDurationInFrames = audio ? secondsFrames(audio.duration) : 0;
    const reveal = emptyRevealTiming(scene, startFrame);
    return {
      sceneId: scene.sceneId,
      startFrame,
      durationInFrames,
      endFrame,
      startTime: frameSeconds(startFrame),
      duration: frameSeconds(durationInFrames),
      endTime: frameSeconds(endFrame),
      audioDuration: audio?.duration ?? 0,
      audioDurationInFrames,
      visualBufferFrames: Math.max(0, durationInFrames - audioDurationInFrames),
      quizHoldFrames: scene.sceneType === 'quiz_cta' ? Math.max(0, durationInFrames - audioDurationInFrames) : 0,
      revealTimingFrames: reveal,
    } satisfies MemeVocabResolvedSceneTimeline;
  });
  return {source, fps: FPS, totalFrames: cursor, duration: frameSeconds(cursor), scenes};
};

export const buildEstimatedTimeline = (storyboard: ShortStoryboard): MemeVocabTimeline => {
  const totalFrames = Math.max(1, Math.round(storyboard.duration * FPS));
  const durations = storyboard.scenes.map((scene) => Math.max(1, Math.round(scene.estimatedDuration * FPS)));
  durations[durations.length - 1] = Math.max(1, totalFrames - durations.slice(0, -1).reduce((sum, value) => sum + value, 0));
  return timelineFromDurations(storyboard, durations, 'estimated');
};

export const buildResolvedTimeline = (
  storyboard: ShortStoryboard,
  segments: MemeVocabAudioTimingSegment[],
): MemeVocabTimeline => {
  const audioByScene = new Map(segments.map((segment) => [segment.sceneId, segment]));
  if (segments.length !== storyboard.scenes.length || storyboard.scenes.some((scene) => !audioByScene.has(scene.sceneId))) {
    throw new Error('Cannot resolve timeline: every storyboard scene must have one TTS segment.');
  }
  if (segments.some((segment) => segment.status !== 'resolved')) {
    throw new Error('Cannot resolve timeline: one or more TTS segments failed.');
  }

  const durations: number[] = [];
  let cursor = 0;
  storyboard.scenes.forEach((scene, index) => {
    const audio = audioByScene.get(scene.sceneId)!;
    const audioFrames = secondsFrames(audio.duration);
    if (scene.sceneType === 'word_reveal' && audio.duration > 6) {
      throw new Error(`Word Reveal TTS is ${audio.duration.toFixed(3)}s and exceeds the hard 6s limit after compression attempts.`);
    }
    if (index === 0 && audioFrames > Math.round(2.8 * FPS)) {
      throw new Error(`Hook TTS is ${audio.duration.toFixed(2)}s; shorten the Hook narration below 2.8s before rendering.`);
    }
    const visualBufferFrames = index === storyboard.scenes.length - 1 ? Math.round(0.2 * FPS) : Math.round(0.15 * FPS);
    const quizHoldFrames = scene.sceneType === 'quiz_cta' ? Math.max(Math.round(1.5 * FPS), visualBufferFrames) : 0;
    const duration = audioFrames + visualBufferFrames + quizHoldFrames;
    durations.push(duration);
    cursor += duration;
  });

  const minimumFrames = Math.round(15 * FPS);
  const maximumFrames = Math.round(28 * FPS);
  if (cursor < minimumFrames) durations[durations.length - 1] += minimumFrames - cursor;
  const resolved = timelineFromDurations(storyboard, durations, 'tts-resolved', audioByScene);
  if (resolved.totalFrames > maximumFrames) {
    throw new Error(`Resolved TTS timeline is ${resolved.duration.toFixed(2)}s, over the 28s limit. Shorten the narration instead of forcing a faster playback rate.`);
  }

  const revealScene = resolved.scenes.find((scene) => scene.sceneId === storyboard.scenes.find((candidate) => candidate.sceneType === 'word_reveal')?.sceneId);
  if (revealScene) {
    const audio = audioByScene.get(revealScene.sceneId)!;
    const leadingSilenceFrames = Math.round(audio.leadingSilence * FPS);
    revealScene.revealTimingFrames.wordStartFrame = revealScene.startFrame + leadingSilenceFrames;
    revealScene.revealTimingFrames.phoneticStartFrame = Math.min(revealScene.endFrame - 1, revealScene.startFrame + leadingSilenceFrames + Math.round(revealScene.audioDuration * FPS * 0.22));
    revealScene.revealTimingFrames.meaningStartFrame = Math.min(revealScene.endFrame - 1, revealScene.startFrame + leadingSilenceFrames + Math.round(revealScene.audioDuration * FPS * 0.42));
  }
  return resolved;
};

export const applyResolvedTimelineToStoryboard = (storyboard: ShortStoryboard, timeline: MemeVocabTimeline): ShortStoryboard => ({
  ...storyboard,
  duration: timeline.duration,
  scenes: storyboard.scenes.map((scene) => {
    const resolved = timeline.scenes.find((candidate) => candidate.sceneId === scene.sceneId)!;
    return {
      ...scene,
      resolvedStartFrame: resolved.startFrame,
      resolvedDurationInFrames: resolved.durationInFrames,
      resolvedStartTime: resolved.startTime,
      resolvedDuration: resolved.duration,
    };
  }),
});
