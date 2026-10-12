import type {ReplicaIllustrationPrompt} from './projectTypes';

export const FORM_NEGATIVE_PROMPT = [
  'text','letters','numbers','caption','label','logo','watermark','signature','arrow','diagram',
  'infographic','PPT slide','ground line','floor','room','horizon','shadow','reflection','frame',
  'border','white panel','texture','gradient','scenery','green subject','cute mascot',
  'children illustration','commercial cartoon','stock vector','glossy 3D','photorealistic','cropped body',
].join(', ');

const BASE = [
  'Create one 2K 16:9 horizontal isolated cutout source image.',
  'Use sparse slightly wobbly black hand-drawn pen lines with restrained orange, red, or pale-blue accents.',
  'Include exactly one irregular solid-black deadpan character with two tiny white dot eyes, no mouth, and thin complete stick arms and legs.',
  'The character must actively shape, mold, assemble, or reshape the main object.',
  'The entire background is exactly one flat chroma green #00FF00 plate edge to edge.',
  'Keep the complete subject inside the middle 65% and leave a continuous empty flat-green band around all four outer edges.',
  'No ground, shadow, scenery, frame, writing, letters, numbers, pseudo-text, logos, signatures, arrows, diagrams, or green foreground details.',
  'Serious absurd product-sketch cutout, never cute, commercial, glossy, three-dimensional, or photorealistic.',
].join(' ');

const shots = [
  {id:'00_shape_hook',filename:'00_shape_hook.png',purpose:'form 是形状与形成',subject:'The character presses one soft white blob into a simple orange outline mold, and one clean geometric shape emerges from the other side.'},
  {id:'01_formation_result',filename:'01_formation_result.png',purpose:'formation 形成与构成',subject:'The character assembles four plain floating pieces into one stable geometric formation using both hands.'},
  {id:'02_inform_mind',filename:'02_inform_mind.png',purpose:'inform 把信息放进头脑形成认识',subject:'The character feeds three tiny blank cards into a large black-outline head-shaped mold, causing one orange idea pebble to form inside.'},
  {id:'03_reform_again',filename:'03_reform_again.png',purpose:'reform 重新塑形',subject:'Sparse floating cutout only: the character takes one bent plain object apart and presses it through a small orange hand-cranked mold so it emerges straight. All pieces float. Absolutely no floor, baseline, platform, ground scribble, shadow, scenery, or edge crop.'},
  {id:'04_transform_change',filename:'04_transform_change.png',purpose:'transform 彻底变形',subject:'Sparse floating cutout only: the character turns a crank on a compact strange molding machine; one round blob enters and one angular object emerges. All elements float. Absolutely no floor, baseline, platform, ground scribble, shadow, debris, built-in arrow, or edge crop.'},
  {id:'05_conform_same',filename:'05_conform_same.png',purpose:'conform 变成同样形状',subject:'The character squeezes one odd-shaped piece into a row of three identical outline molds until it matches them.'},
  {id:'06_deform_bad_shape',filename:'06_deform_bad_shape.png',purpose:'deform 破坏形状',subject:'Sparse floating cutout only: the character pulls one handle and visibly warps a small plain round object into a lopsided shape, with one restrained red stress mark. Absolutely no floor, baseline, ground scribble, shadow, scenery, giant balloon, or edge crop.'},
  {id:'07_uniform_one_shape',filename:'07_uniform_one_shape.png',purpose:'uniform 统一形制',subject:'Minimal floating cutout with exactly one black character. The character grips one plain orange star-shaped cookie cutter with both hands and presses it onto one small floating clay blob; three identical star-shaped clay pieces float nearby as the result. There is no surface under anything. Absolutely no table, counter, floor, horizontal line, baseline, machine, ruler, tools, measurement ticks, numbers, letters, pseudo-text, extra people, clothing, shadow, or scenery.'},
  {id:'08_formula_mold',filename:'08_formula_mold.png',purpose:'formula 固定形成方法',subject:'Sparse centered floating cutout: the character pours three small blank ingredient bowls into one compact orange mold and one repeatable object emerges. Keep every bowl, hand, mold, and result fully visible with generous green padding on all sides. No table, counter, floor, baseline, scenery, edge crop, symbols, or writing.'},
] as const;

export const formIllustrationPrompts: readonly ReplicaIllustrationPrompt[] = shots.map(
  (shot)=>({...shot,prompt:`${BASE} ${shot.subject}`} as ReplicaIllustrationPrompt),
);
