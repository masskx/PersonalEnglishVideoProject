import {Easing, interpolate, spring} from 'remotion';

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export const clampedInterpolate = (
  frame: number,
  input: readonly number[],
  output: readonly number[],
) =>
  interpolate(frame, input, output, {
    easing: Easing.bezier(0.22, 1, 0.36, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

export const stagger = (index: number, gap = 4) => index * gap;

export const smoothEntrance = (frame: number, start: number, duration = 18) =>
  clampedInterpolate(frame, [start, start + Math.max(1, duration)], [0, 1]);

export const smoothExit = (frame: number, start: number, duration = 10) =>
  clampedInterpolate(frame, [start, start + Math.max(1, duration)], [1, 0]);

export const softSpring = (
  frame: number,
  start: number,
  fps = 30,
  durationInFrames = 24,
) =>
  clamp01(
    spring({
      frame: Math.max(0, frame - start),
      fps,
      durationInFrames,
      config: {damping: 26, stiffness: 150, mass: 0.9},
    }),
  );

export const overshootSpring = (
  frame: number,
  start: number,
  fps = 30,
  durationInFrames = 22,
) =>
  spring({
    frame: Math.max(0, frame - start),
    fps,
    durationInFrames,
    config: {damping: 18, stiffness: 170, mass: 0.75},
  });

export const floatMotion = (frame: number, amplitude = 5, period = 150, phase = 0) =>
  ((Math.sin(((frame + phase) / Math.max(1, period)) * Math.PI * 2) +
    Math.sin(((frame + phase * 0.63) / Math.max(1, period * 1.73)) * Math.PI * 2) * 0.42) /
    1.42) *
  amplitude;

export const breathingScale = (
  frame: number,
  amount = 0.008,
  period = 210,
  phase = 0,
) => 1 + floatMotion(frame, 1, period, phase) * amount;

export const cameraDrift = (frame: number, phase = 0, strength = 1) => ({
  x: floatMotion(frame, 10 * strength, 270, phase),
  y: floatMotion(frame, 6 * strength, 330, phase + 41),
  scale: breathingScale(frame, 0.006 * strength, 360, phase + 17),
});

export const wordHighlight = (frame: number, start: number, duration = 20) => {
  const inProgress = smoothEntrance(frame, start, duration);
  return {
    colorMix: inProgress,
    underlineScale: inProgress,
    weight: Math.round(clampedInterpolate(inProgress, [0, 1], [700, 820])),
  };
};

export const directionalTransition = (
  frame: number,
  start: number,
  end: number,
  direction: -1 | 1,
  overlap = 12,
) => {
  const enter = smoothEntrance(frame, start - overlap, overlap + 4);
  const exit = smoothExit(frame, end - overlap, overlap + 4);
  const opacity = clamp01(Math.min(enter, exit));
  return {
    opacity,
    x: (1 - enter) * 42 * direction + (1 - exit) * -28 * direction,
    scale: 0.97 + opacity * 0.03,
  };
};
