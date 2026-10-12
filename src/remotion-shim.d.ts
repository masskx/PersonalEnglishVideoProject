declare module 'remotion' {
  import type {ComponentType, CSSProperties, ImgHTMLAttributes, ReactNode} from 'react';

  export const AbsoluteFill: ComponentType<{
    children?: ReactNode;
    style?: CSSProperties;
    className?: string;
  }>;

  export const Audio: ComponentType<{
    src: string;
    name?: string;
    loop?: boolean;
    loopVolumeCurveBehavior?: 'repeat' | 'extend';
    playbackRate?: number;
    volume?: number | ((frame: number) => number);
  }>;

  export const Img: ComponentType<
    ImgHTMLAttributes<HTMLImageElement> & {
      style?: CSSProperties;
    }
  >;

  export const OffthreadVideo: ComponentType<{
    src: string;
    style?: CSSProperties;
    playbackRate?: number;
    loop?: boolean;
    muted?: boolean;
    startFrom?: number;
    endAt?: number;
    volume?: number | ((frame: number) => number);
  }>;

  export const Video: ComponentType<{
    src: string;
    style?: CSSProperties;
    playbackRate?: number;
    loop?: boolean;
    muted?: boolean;
    startFrom?: number;
    endAt?: number;
    volume?: number | ((frame: number) => number);
  }>;

  export const Sequence: ComponentType<{
    children?: ReactNode;
    from: number;
    durationInFrames: number;
    name?: string;
  }>;

  export const Composition: ComponentType<{
    id: string;
    component: ComponentType<any>;
    durationInFrames: number;
    fps: number;
    width: number;
    height: number;
    defaultProps?: Record<string, unknown>;
    calculateMetadata?: (args: {
      props: any;
      defaultProps: any;
      compositionId: string;
    }) => {
      durationInFrames?: number;
      fps?: number;
      width?: number;
      height?: number;
    } | Promise<{
      durationInFrames?: number;
      fps?: number;
      width?: number;
      height?: number;
    }>;
  }>;

  export const interpolate: (
    input: number,
    inputRange: readonly number[],
    outputRange: readonly number[],
    options?: {
      extrapolateLeft?: 'clamp' | 'extend' | 'identity';
      extrapolateRight?: 'clamp' | 'extend' | 'identity';
      easing?: (input: number) => number;
    },
  ) => number;

  export class Easing {
    static bezier(x1: number, y1: number, x2: number, y2: number): (input: number) => number;
  }

  export const spring: (options: {
    frame: number;
    fps: number;
    durationInFrames?: number;
    config?: {damping?: number; stiffness?: number; mass?: number; overshootClamping?: boolean};
  }) => number;

  export const registerRoot: (component: ComponentType) => void;
  export const staticFile: (path: string) => string;
  export const useCurrentFrame: () => number;
}
