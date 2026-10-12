/** Frame-driven curves with zero velocity and acceleration at both ends. */
export const smoothProgress = (frame: number, start: number, duration: number) => {
  const t = Math.max(0, Math.min(1, (frame - start) / Math.max(1, duration)));
  return t * t * t * (t * (t * 6 - 15) + 10);
};

export const morphemeMotion = (frame: number, index: number, fps: number) => {
  const settled = smoothProgress(frame, index * fps * 0.055, fps * 0.48);
  return {opacity: smoothProgress(frame, index * fps * 0.055, fps * 0.22),
    transform: `translate3d(${index * 12 * (1 - settled)}px, ${12 * (1 - settled)}px, 0)`};
};
