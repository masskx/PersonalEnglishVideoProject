import type {ReplicaIllustrationPrompt} from './projectTypes';

export const FLECT_FLEX_NEGATIVE_PROMPT=[
  'text','letters','numbers','caption','label','logo','watermark','signature','arrow','diagram',
  'infographic','PPT slide','ground line','floor','room','horizon','shadow','reflection effect',
  'frame','border','white panel','texture','gradient','scenery','green subject','cute mascot',
  'children illustration','commercial cartoon','stock vector','glossy 3D','photorealistic','cropped body',
].join(', ');

const BASE=[
  'Create one 2K 16:9 horizontal isolated cutout source image.',
  'Use sparse slightly wobbly black hand-drawn pen lines with restrained orange, red, or pale-blue accents.',
  'Include exactly one irregular solid-black deadpan character with two tiny white dot eyes, no mouth, and thin complete stick arms and legs.',
  'The character must actively bend, redirect, flex, resist bending, or test the central object.',
  'The entire background is exactly one flat chroma green #00FF00 plate edge to edge.',
  'Keep the complete subject inside the middle 65% and leave a continuous empty flat-green band around all four outer edges.',
  'No ground, shadow, scenery, room, frame, writing, letters, numbers, pseudo-text, logos, signatures, arrows, diagrams, or green foreground details.',
  'Serious absurd product-sketch cutout, never cute, commercial, glossy, three-dimensional, or photorealistic.',
].join(' ');

const shots=[
  {id:'00_bend_hook',filename:'00_bend_hook.png',purpose:'flect / flex 就是弯曲',subject:'The character grips both ends of one long orange flexible rod and bends it into a clear smooth arc. The rod and character float; no platform.'},
  {id:'01_reflect_bend_back',filename:'01_reflect_bend_back.png',purpose:'reflect 弯回去',subject:'The character holds a small plain black-outline mirror panel while one orange beam strikes it and bends back as a pale-blue beam. The beams contain no arrowheads.'},
  {id:'02_reflection_return_image',filename:'02_reflection_return_image.png',purpose:'reflection 反射结果',subject:'One isolated floating action only: the character holds a small plain rectangular reflective sheet directly in both hands. On the sheet is only one simple black oval echo with two white dot eyes. The sheet has no stand, stem, base, border decoration, or environment. Keep every object in the central area surrounded by uninterrupted flat green. Absolutely no floor line, top line, baseline, room, table, writing, pseudo-text, or signature.'},
  {id:'03_deflect_turn_aside',filename:'03_deflect_turn_aside.png',purpose:'deflect 使偏转',subject:'One isolated floating action only: the character holds a small curved orange shield directly in both hands while one plain white ball bounces aside. The shield has no stand, base, feet, or support. Both character feet float in empty green space. No floor marks, baseline, writing, or signature.'},
  {id:'04_inflect_bend_voice',filename:'04_inflect_bend_voice.png',purpose:'inflect 改变语调',subject:'The character gently bends one floating black waveform ribbon upward with both hands, changing its curve. The ribbon is abstract with no symbols or musical notes.'},
  {id:'05_flexible_easy_bend',filename:'05_flexible_easy_bend.png',purpose:'flexible 易弯且适应',subject:'One isolated floating action only: the character bends a short orange ribbon into a smooth U-shape around one small floating gray cube without touching the cube. The ribbon has two clean ends and is not a cable, hose, plug, or wire. No floor, shadow, grass, baseline, writing, or signature.'},
  {id:'06_flexibility_many_shapes',filename:'06_flexibility_many_shapes.png',purpose:'flexibility 灵活性',subject:'One isolated floating action only: the character holds a short orange spring-like strip and bends it into three compact curves between its hands. Only the character and the short strip exist. No rings, holes, poles, cylinders, beads, long cord, horizontal line, floor, baseline, labels, writing, pseudo-text, or signature.'},
  {id:'07_reflex_bend_back_fast',filename:'07_reflex_bend_back_fast.png',purpose:'reflex 反射动作',subject:'Make a very small compact sticker-like cutout occupying only the central 35 percent: one bean-shaped solid-black creature with exactly two white dot eyes and no mouth holds a tiny orange U-shaped spring that is snapping back outward. Generate only these two objects. At least 30 percent of the image on the top, bottom, left, and right must be exact uninterrupted flat chroma green. Do not draw any line or mark outside the central subject. No medical scene, platform, oval, ring, floor, horizon, baseline, shadow, frame, labels, writing, pseudo-text, or signature.'},
  {id:'08_inflexible_wont_bend',filename:'08_inflexible_wont_bend.png',purpose:'inflexible 不肯弯',subject:'The character strains with both hands against one thick perfectly straight orange bar that refuses to bend. Add one tiny red stress mark, no broken bar and no platform.'},
] as const;

export const flectFlexIllustrationPrompts:readonly ReplicaIllustrationPrompt[]=shots.map(
  shot=>({...shot,prompt:`${BASE} ${shot.subject}`} as ReplicaIllustrationPrompt),
);
