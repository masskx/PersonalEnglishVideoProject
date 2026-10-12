import type {ReplicaIllustrationPrompt} from './projectTypes';

export const PORT_REPLICA_IMAGE_SPEC = {
  aspectRatio: '16:9',
  arkSize: '2K',
  visualWidth: 2560,
  visualHeight: 1440,
  chromaKey: '#00FF00',
  greenSourceDir: 'assets/green-screen/port',
  alphaOutputDir: 'public/assets/replica/port',
} as const;

const BASE_PROMPT = [
  'Create one 2K 16:9 horizontal isolated cutout source image.',
  'Use sparse slightly wobbly black hand-drawn pen lines with restrained flat orange, red, or pale-blue accents.',
  'Include exactly one irregular solid-black deadpan worker character with two tiny white dot eyes, no mouth, and thin stick arms and legs. The character must perform the core carrying action.',
  'The entire background is exactly one flat chroma green #00FF00 plate edge to edge.',
  'Keep the complete subject inside the middle 65% and leave a continuous empty flat-green band around all four outer edges.',
  'No ground line, floor, shadow, room, scenery, frame, panel, paper edge, writing, letters, numbers, logos, signatures, arrows, diagrams, or green foreground details.',
  'The result is a strange sparse product-sketch cutout, serious and deadpan, never a cute mascot, commercial cartoon, children illustration, glossy 3D render, or photorealistic scene.',
].join(' ');

export const PORT_REPLICA_NEGATIVE_PROMPT = [
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
    id: '00_carry_hook',
    filename: '00_carry_hook.png',
    purpose: '开场把 port 固定成小黑搬运重箱的动作记忆',
    subject:
      'The single solid-black worker trudges forward while carrying one oversized plain white suitcase on its back. Both thin legs strain under the load, one orange motion stroke trails behind, and the carrying action is unmistakable. Show the full worker, both feet, and the complete luggage with wide empty green padding.',
  },
  {
    id: '01_import_inside',
    filename: '01_import_inside.png',
    purpose: 'import 把货物搬进边界内部',
    subject:
      'The single solid-black worker carries one plain white crate through an extremely sparse freestanding doorway made from exactly three thin wobbly black strokes: two narrow posts and one lintel. The worker and crate are halfway through the opening, with a small orange path segment indicating inward travel. No wall mass, no dark panel, no hatching, no filled architecture, no scenery, and no line touching any canvas edge.',
  },
  {
    id: '02_export_outside',
    filename: '02_export_outside.png',
    purpose: 'export 把货物搬出边界',
    subject:
      'The single solid-black worker pushes one plain white crate outward through a freestanding black-outline doorway. The crate has already crossed most of the opening and moves away from the doorway, with two restrained orange motion strokes. No second person and no building.',
  },
  {
    id: '03_transport_across',
    filename: '03_transport_across.png',
    purpose: 'transport 横跨一段距离运输',
    subject:
      'The single uniformly flat-black worker pedals an absurd cargo bicycle while transporting one large plain white parcel across one short floating rope span. Make the complete worker-bicycle-parcel group fill about 45% of the canvas width and 45% of its height. The rope span occupies less than half the canvas width and ends clearly in empty green on both sides. Keep the full bicycle, both wheels, parcel, worker, and rope visible. No bridge deck, ground, road, baseline, horizon, floor, scenery, or line extending toward an outer edge.',
  },
  {
    id: '04_support_under',
    filename: '04_support_under.png',
    purpose: 'support 从下方托住重量',
    subject:
      'The single solid-black worker stands directly underneath one large plain white slab and supports it overhead with both thin arms. The slab bows slightly but stays aloft. Add one tiny orange strain mark and one pale-blue balance mark. No platform, floor, columns, or other characters.',
  },
  {
    id: '05_report_back',
    filename: '05_report_back.png',
    purpose: 'report 把消息带回来汇报',
    subject:
      'The single solid-black worker returns while carrying one blank rolled message tube under an arm and presenting one completely blank white sheet with the other hand. A short curved orange trail behind the worker implies coming back. No writing, symbols, microphone, desk, or second person.',
  },
  {
    id: '06_portable_carry',
    filename: '06_portable_carry.png',
    purpose: 'portable 能被轻松携带',
    subject:
      'The one worker is a uniformly filled pure-black #000000 flat silhouette with no gray, highlight, gloss, shading, gradient, texture, rim light, or colored body edge. It casually carries one compact plain white rectangular case by a simple black handle using one thin arm. The worker walks lightly with one foot raised and one small orange ease mark. The case is completely blank with no screen, buttons, logo, writing, cable, reflection, or shadow.',
  },
  {
    id: '07_porter_worker',
    filename: '07_porter_worker.png',
    purpose: 'porter 是专门搬运行李的人',
    subject:
      'The single uniformly flat-black worker seriously pulls a tiny two-wheel hand cart carrying three plain white pieces of luggage. Place the whole group inside the central 50% of the canvas. Show the complete cart, both wheels, all luggage corners, the entire handle, the worker body, both thin legs, and both feet with generous green below them. Add only one orange effort stroke. Nothing may be cropped or touch an outer edge.',
  },
  {
    id: '08_deport_away',
    filename: '08_deport_away.png',
    purpose: 'deport 把人带离某地、驱逐出境',
    subject:
      'The single uniformly flat-black worker stands seriously on one compact plain white wheeled suitcase that carries the worker away from a very small freestanding boundary gate made of three thin black strokes. The worker grips the suitcase handle. Keep the complete worker, both feet, the entire suitcase, all wheels, full handle, and whole gate inside the central 55% with wide green padding on every side. Use two short orange away-motion strokes. No oversized object, crop, flags, police, country symbols, text, floor, conveyor, or second character.',
  },
] as const;

export const portReplicaIllustrationPrompts: readonly ReplicaIllustrationPrompt[] = shots.map(
  (shot) => ({...shot, prompt: `${BASE_PROMPT} ${shot.subject}`} as ReplicaIllustrationPrompt),
);
