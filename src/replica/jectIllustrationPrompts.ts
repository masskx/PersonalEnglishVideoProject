import type {ReplicaIllustrationPrompt} from './projectTypes';

export const JECT_REPLICA_IMAGE_SPEC = {
  aspectRatio: '16:9',
  arkSize: '2K',
  visualWidth: 2560,
  visualHeight: 1440,
  chromaKey: '#00FF00',
  greenSourceDir: 'assets/green-screen/ject',
  alphaOutputDir: 'public/assets/replica/ject',
} as const;

const BASE_PROMPT = [
  'Create one 2K 16:9 horizontal isolated cutout source image.',
  'Use sparse slightly wobbly black hand-drawn pen lines with restrained flat orange, red, or pale-blue accents.',
  'Include exactly one irregular solid-black deadpan worker character with two tiny white dot eyes, no mouth, and thin stick arms and legs. The character must perform the core action.',
  'The entire background is exactly one flat chroma green #00FF00 plate edge to edge.',
  'Keep the complete subject inside the middle 65% and leave a continuous empty flat-green band around all four outer edges.',
  'No ground line, floor, shadow, room, scenery, frame, panel, paper edge, writing, letters, numbers, logos, signatures, arrows, diagrams, or green foreground details.',
  'The result is a strange sparse product-sketch cutout, serious and deadpan, never a cute mascot, commercial cartoon, children illustration, glossy 3D render, or photorealistic scene.',
].join(' ');

export const JECT_REPLICA_NEGATIVE_PROMPT = [
  'text', 'letters', 'numbers', 'Chinese text', 'English words', 'pseudo text', 'caption', 'label',
  'logo', 'watermark', 'signature', 'artist mark', 'arrow', 'diagram', 'infographic', 'PPT slide',
  'formal flowchart', 'ground line', 'baseline', 'floor', 'road', 'wall', 'room', 'horizon',
  'cast shadow', 'contact shadow', 'reflection', 'frame', 'border', 'white panel', 'paper texture',
  'gradient', 'scenery', 'landscape', 'green subject', 'green object', 'green clothing', 'green edge',
  'cute mascot', 'kawaii', 'chibi', 'children illustration', 'commercial cartoon', 'stock vector',
  'glossy 3D', 'photorealistic', 'extra character', 'crowd', 'clipped object', 'cropped feet',
].join(', ');

const shots = [
  {
    id: '00_throw_hook',
    filename: '00_throw_hook.png',
    purpose: '开场把 ject 固定成“投出去”的动作记忆',
    subject:
      'The single solid-black worker plants both thin feet and seriously throws one plain white rounded block away from its body. The block is frozen in mid-air with only three short orange motion strokes behind it. Make the throwing pose and outward separation unmistakable. Show the full character, both feet, both arms, the complete block, and wide empty green padding.',
  },
  {
    id: '01_direction_machine',
    filename: '01_direction_machine.png',
    purpose: '前缀像方向拨杆，控制同一台 ject 投掷机',
    subject:
      'The single solid-black worker operates one absurd simple hand-cranked throwing machine made from sparse black outline tubes and one bowl-shaped launcher. Five short empty outlet tubes point in clearly different directions, but contain no arrows or labels. The worker turns the orange crank and one plain white ball sits ready in the launcher. Keep the machine compact, fully visible, and visually simple.',
  },
  {
    id: '02_reject_return',
    filename: '02_reject_return.png',
    purpose: 'reject 把不接受的东西扔回去',
    subject:
      'The one worker is a uniformly filled pure-black #000000 flat silhouette with no gray, highlight, gloss, shading, gradient, texture, rim light, or colored body edge. It leans back and uses both thin arms to forcefully throw one perfectly plain white sphere away to the left, as if returning it to where it came from. The sphere is completely featureless and is already separated from the hands, with three short orange reverse-motion strokes. Show only the worker and sphere. No barrier, cross, parcel, box, second person, sign, text, ground, floor, or shadow.',
  },
  {
    id: '03_project_forward',
    filename: '03_project_forward.png',
    purpose: 'project 把计划和想法向前投射',
    subject:
      'The single solid-black worker leans into a small slingshot-like launcher and sends one rolled blank blueprint forward. The blank roll is airborne in front of the worker with restrained orange motion strokes and one tiny blue spark. The worker is the operator, the action clearly moves forward, and every part remains fully inside the canvas.',
  },
  {
    id: '04_inject_inside',
    filename: '04_inject_inside.png',
    purpose: 'inject 把液体注入容器内部',
    subject:
      'The single solid-black worker uses both thin arms to press one oversized simple syringe pump, pushing one orange droplet through a black outline nozzle into a transparent outline bottle. The droplet is visibly entering the bottle opening. Keep it non-medical, harmless, sparse, and fully isolated; no needle touching a body.',
  },
  {
    id: '05_object_against',
    filename: '05_object_against.png',
    purpose: 'object 是迎面挡住、提出反对的东西',
    subject:
      'The single solid-black worker throws one small plain white ball against one upright plain black-outline slab directly ahead. The ball visibly bounces back with one red impact burst and two orange motion strokes. The worker, ball, and slab are complete floating cutout objects. From the lowest foot and lowest slab edge down to the canvas edge, every other pixel must be uninterrupted flat chroma green. Absolutely no blue patch, ground, baseline, floor, platform, shadow, reflection, glow, architecture, or extra prop.',
  },
  {
    id: '06_subject_under',
    filename: '06_subject_under.png',
    purpose: 'subject 是被放到下面、置于某种支配或讨论之下',
    subject:
      'The single solid-black worker stands directly underneath one large lightweight outline platform, calmly holding it overhead with both thin arms. On the platform sits one blank white speech bubble-shaped object and one small blue book icon without markings. The worker clearly bears the subject matter from below; keep all shapes sparse, complete, and isolated.',
  },
] as const;

export const jectReplicaIllustrationPrompts: readonly ReplicaIllustrationPrompt[] = shots.map(
  (shot) => ({...shot, prompt: `${BASE_PROMPT} ${shot.subject}`} as ReplicaIllustrationPrompt),
);
