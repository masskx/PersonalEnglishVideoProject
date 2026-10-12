import type {ReplicaBackgroundMusicDefinition} from './projectTypes';

/**
 * Shared series music policy. Replace the file at this path to update every episode.
 * Levels keep the series beat audible on phone speakers while narration remains primary.
 */
export const SERIES_BACKGROUND_MUSIC: ReplicaBackgroundMusicDefinition = {
  src: 'assets/music/root-word-series-bgm.mp3',
  volume: 0.08,
  duckedVolume: 0.07,
  fadeInSec: 1.2,
  fadeOutSec: 2,
  duckAttackSec: 0.25,
  duckReleaseSec: 0.55,
  loop: true,
};
