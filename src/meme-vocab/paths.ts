// Shared by browser defaults and Node scripts; keep this module free of Node imports.
export const MEME_VOCAB_EXPERIMENT_ROOT = 'work/experiments/meme-vocab';

export const memeVocabOutputDirectory = (targetWord = 'interrupt') => `${MEME_VOCAB_EXPERIMENT_ROOT}/${targetWord}`;

export const DEFAULT_MEME_VOCAB_CONFIG_PATH = `${memeVocabOutputDirectory()}/video-config.json`;
