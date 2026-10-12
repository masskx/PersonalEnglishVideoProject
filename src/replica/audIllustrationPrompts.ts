import type {ReplicaIllustrationPrompt} from './projectTypes';

export const AUD_REPLICA_NEGATIVE_PROMPT = [
  'text', 'letters', 'numbers', 'caption', 'label', 'logo', 'watermark', 'signature',
  'arrow', 'diagram', 'infographic', 'PPT slide', 'ground line', 'floor', 'room',
  'horizon', 'shadow', 'reflection', 'frame', 'border', 'white panel', 'texture',
  'gradient', 'scenery', 'green subject', 'cute mascot', 'children illustration',
  'commercial cartoon', 'stock vector', 'glossy 3D', 'photorealistic', 'cropped body',
].join(', ');

const BASE = [
  'Create one 2K 16:9 horizontal isolated cutout source image.',
  'Use sparse slightly wobbly black hand-drawn pen lines with restrained orange, red, or pale-blue accents.',
  'Include exactly one irregular solid-black deadpan character with two tiny white dot eyes, no mouth, and thin stick arms and legs. The character must perform the core hearing action.',
  'The entire background is exactly one flat chroma green #00FF00 plate edge to edge.',
  'Keep the complete subject inside the middle 65% and leave a continuous empty flat-green band around all four outer edges.',
  'No ground line, floor, shadow, room, scenery, frame, panel, paper edge, writing, letters, numbers, logos, signatures, arrows, diagrams, or green foreground details.',
  'Serious strange product-sketch cutout, not cute, commercial, glossy, or photorealistic.',
].join(' ');

const shots = [
  ['00_hear_hook', '00_hear_hook.png', '用耳朵接住声音的开场记忆钩子', 'The black character holds one oversized black-outline ear-shaped listening horn toward three small orange sound ripples, catching them in a tiny white basket. Full body, horn, basket, and ripples visible.'],
  ['01_audio_sound', '01_audio_sound.png', 'audio 表示声音或音频', 'The black character operates one simple black-outline sound player with a single round speaker cone while orange sound ripples travel into its oversized listening horn. No buttons with symbols.'],
  ['02_audience_listen', '02_audience_listen.png', 'audience 是正在听的一群人', 'The single black character sits deadpan on one tiny floating chair, holding an oversized ear horn toward a small floating black-outline stage curtain. Suggest listeners with three empty white chairs only; no extra humanoids.'],
  ['03_audit_listen_check', '03_audit_listen_check.png', 'audit 从听取账目到审计核查', 'The black character listens through one ear horn to three separate plain white counting beads floating in the air, then inspects one bead with a tiny magnifying glass. Add one restrained orange listening ripple. No book, paper, rows, writing, currency symbols, check marks, numbers, platform, or horizontal band.'],
  ['04_audible_heard', '04_audible_heard.png', 'audible 是能被听见的', 'The black character catches one orange sound ripple with an oversized ear-shaped net. The ripple lands clearly inside the net. Full body and net visible.'],
  ['05_audition_try', '05_audition_try.png', 'audition 是试音选角', 'The black character stands seriously before one simple floating microphone and releases three small orange sound ripples toward it, holding one blank audition card. No stage, spotlight, text, or audience.'],
  ['06_auditorium_hall', '06_auditorium_hall.png', 'auditorium 是供人听的大厅', 'The black character rolls one oversized ear-shaped listening shell into a sparse semicircle of five empty black-outline chairs. No building, room, floor, crowd, or stage.'],
  ['07_inaudible_blocked', '07_inaudible_blocked.png', 'inaudible 是听不见的', 'Arrange one clear left-to-right relationship: the black character and its oversized listening horn are on the left, one thick floating white cushion barrier is in the center, and three orange sound ripples are on the right. The ripples visibly stop at the right face of the cushion and never reach the horn. The character has only two white dot eyes and absolutely no mouth. Add one tiny red frustrated spark. No ground, punctuation, or extra sound ripples.'],
  ['08_audiobook_listen_book', '08_audiobook_listen_book.png', 'audiobook 是用耳朵听书', 'The black character wears plain black-outline headphones while an open blank book floats nearby and three orange sound ripples travel from the book into the headphones. No text, letters, or device logo.'],
] as const;

export const audReplicaIllustrationPrompts: readonly ReplicaIllustrationPrompt[] = shots.map(
  ([id, filename, purpose, subject]) => ({
    id, filename, purpose, subject, prompt: `${BASE} ${subject}`,
  }),
);
