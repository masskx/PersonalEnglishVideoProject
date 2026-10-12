import type {MemeVocabInput, ShortStoryboardScene} from './types';

const shared = (input: MemeVocabInput) =>
  [
    'Create one standalone 9:16 vertical keyframe for a short English vocabulary meme video.',
    'Pure white background, sparse slightly wobbly black hand-drawn linework, restrained orange and deep-blue accents.',
    `Character consistency: ${input.characterProfile}. The character must perform the central action, not stand as decoration.`,
    'Show one clear action and one absurd conflict. Keep the main subject in the upper-middle visual zone and leave the lower 22% clean for Douyin UI and subtitles.',
    'No words, letters, numbers, captions, subtitles, logos, watermark, signature, UI, borders, gradients, shadows, 3D, photorealism, cute mascot, children illustration, or PPT infographic.',
    'Keep the subject fully inside the frame with readable limbs and a clean white safety margin.',
  ].join(' ');

export const buildJimengPrompt = (input: MemeVocabInput, scene: ShortStoryboardScene) =>
  [
    shared(input),
    `Person: ${input.characterProfile}.`,
    `Action: ${scene.narration}.`,
    `Conflict: ${input.scenario}.`,
    `Absurd element: ${input.memeTheme}; make the abnormal behavior visually obvious.`,
    'Emotion: deadpan panic, awkward urgency, or exaggerated surprise according to the beat.',
    `Composition: ${scene.cropFocus}; one dominant subject, strong silhouette, vertical 9:16 framing.`,
    'Subject position: upper-middle or center, never behind the subtitle safety area.',
    'Subtitle safe area: reserve the bottom 22% and keep important action above it.',
    'Character consistency: same black body, white dot eyes, thin legs, blank serious face across every shot.',
  ].join(' ');

