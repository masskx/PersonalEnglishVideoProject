import {SERIES_BACKGROUND_MUSIC} from '../replica/seriesAudio';
import {buildAssetManifest, type AssetResolver} from './assets';
import {defaultMemeVocabInput} from './content';
import {buildShortStoryboard} from './storyboard';
import {buildEstimatedTimeline} from './timeline';
import type {MemeVocabInput, MemeVocabVideoConfig} from './types';

export const buildMemeVocabConfig = (
  input: MemeVocabInput = defaultMemeVocabInput(),
  resolveAsset?: AssetResolver,
): MemeVocabVideoConfig => {
  const storyboard = buildShortStoryboard(input);
  const estimatedTimeline = buildEstimatedTimeline(storyboard);
  return {
    mode: 'meme_vocab_short',
    input,
    storyboard,
    estimatedTimeline,
    // The browser Composition needs deterministic defaults for listing/preview.
    // Production renders replace this with the TTS-resolved timeline before rendering.
    resolvedTimeline: estimatedTimeline,
    tts: {
      provider: 'dashscope',
      model: 'cosyvoice-v3-flash',
      voice: 'longanhuan',
      rate: 1,
      pitch: 1,
      volume: 65,
      format: 'wav',
    },
    assets: buildAssetManifest(input, storyboard, resolveAsset),
    backgroundMusic: {
      ...SERIES_BACKGROUND_MUSIC,
      src: input.bgm,
      fadeInSec: 0.3,
      fadeOutSec: 0.7,
    },
  };
};
