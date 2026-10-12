import type {ReplicaIllustrationPrompt} from './projectTypes';

export const TRACT_NEGATIVE_PROMPT = [
  'text','letters','numbers','caption','label','logo','watermark','signature','arrow','diagram',
  'infographic','PPT slide','ground line','floor','room','horizon','shadow','reflection','frame',
  'border','white panel','texture','gradient','scenery','green subject','cute mascot',
  'children illustration','commercial cartoon','stock vector','glossy 3D','photorealistic','cropped body',
].join(', ');

const BASE = [
  'Create one 2K 16:9 horizontal isolated cutout source image.',
  'Use sparse slightly wobbly black hand-drawn pen lines with restrained orange, red, or pale-blue accents.',
  'Include exactly one irregular solid-black deadpan character with two tiny white dot eyes, no mouth, and thin complete stick arms and legs.',
  'The character must perform the core pulling action with a clearly visible rope, handle, object, or machine.',
  'The entire background is exactly one flat chroma green #00FF00 plate edge to edge.',
  'Keep the complete subject inside the middle 65% and leave a continuous empty flat-green band around all four outer edges.',
  'No ground, shadow, scenery, frame, writing, letters, numbers, pseudo-text, logos, signatures, arrows, diagrams, or green foreground details.',
  'Serious absurd product-sketch cutout, never cute, commercial, glossy, three-dimensional, or photorealistic.',
].join(' ');

const shots = [
  {id:'00_pull_hook',filename:'00_pull_hook.png',purpose:'把 tract 固定成拉和拖',subject:'The character leans backward and pulls one thick orange rope attached to one plain floating black-outline crate. Show the rope under tension and both feet braced in the air, with no ground.'},
  {id:'01_attract_toward',filename:'01_attract_toward.png',purpose:'attract 拉向自己',subject:'The character turns one oversized plain horseshoe magnet crank that pulls three small blank metal pebbles toward its body along one orange cord. No magnet symbols or marks.'},
  {id:'02_distract_apart',filename:'02_distract_apart.png',purpose:'distract 把注意力拉开',subject:'The character tries to read one completely blank floating card while three small orange cords pull its head and hands outward in different directions. No second character and no writing.'},
  {id:'03_extract_out',filename:'03_extract_out.png',purpose:'extract 向外拉出',subject:'A sparse isolated cutout: the character uses both hands and large tongs to pull one orange core pebble out from the center of one small plain black-outline shell. The character, shell, tongs and pebble all float separately inside empty flat green. Absolutely no ground scribble, floor, baseline, shadow, debris, hatch marks outside the shell, scenery, cut-surface text, or seeds.'},
  {id:'04_contract_together',filename:'04_contract_together.png',purpose:'contract 拉到一起并收缩',subject:'The character turns one winch that pulls the two ends of a long accordion tube toward each other, visibly shortening it. One orange rope connects the ends.'},
  {id:'05_subtract_away',filename:'05_subtract_away.png',purpose:'subtract 从下面拉走',subject:'The character crouches below a floating stack of five plain white tiles and pulls one bottom tile away with an orange rope, leaving four tiles above. No numbers or symbols.'},
  {id:'06_retract_back',filename:'06_retract_back.png',purpose:'retract 往回拉缩回',subject:'The character turns a small reel that pulls one long orange measuring tape back into a plain round case. No scale marks, numbers, or labels.'},
  {id:'07_tractor_machine',filename:'07_tractor_machine.png',purpose:'tractor 是拉东西的机器',subject:'The character seriously drives one tiny logo-free open tractor-like pulling machine that drags one plain floating cart by an orange tow bar. No field, road, wheels touching ground, badge, or text.'},
  {id:'08_traction_grip',filename:'08_traction_grip.png',purpose:'traction 是牵引力和抓地力',subject:'A sparse isolated cutout: the character pulls one taut orange rope while its two oversized black-outline gripping boots press against one tiny floating white oval pad. All elements float inside empty flat green. Absolutely no floor, ground line, black shadow, debris, tire marks, extra strokes, labels, or arrows.'},
] as const;

export const tractIllustrationPrompts: readonly ReplicaIllustrationPrompt[] = shots.map(
  (shot)=>({...shot,prompt:`${BASE} ${shot.subject}`} as ReplicaIllustrationPrompt),
);
