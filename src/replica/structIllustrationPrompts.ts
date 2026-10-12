import type {ReplicaIllustrationPrompt} from './projectTypes';

export const STRUCT_NEGATIVE_PROMPT=[
  'text','letters','numbers','caption','label','logo','watermark','signature','arrow','diagram',
  'infographic','PPT slide','ground line','floor','room','horizon','shadow','reflection','frame',
  'border','white panel','texture','gradient','scenery','green subject','cute mascot',
  'children illustration','commercial cartoon','stock vector','glossy 3D','photorealistic','cropped body',
].join(', ');

const BASE=[
  'Create one 2K 16:9 horizontal isolated cutout source image.',
  'Use sparse slightly wobbly black hand-drawn pen lines with restrained orange, red, or pale-blue accents.',
  'Include exactly one irregular solid-black deadpan character with two tiny white dot eyes, no mouth, and thin complete stick arms and legs.',
  'The character must actively build, assemble, dismantle, rebuild, teach, or block the central structure.',
  'The entire background is exactly one flat chroma green #00FF00 plate edge to edge.',
  'Keep the complete subject inside the middle 65% and leave a continuous empty flat-green band around all four outer edges.',
  'No ground, shadow, scenery, frame, writing, letters, numbers, pseudo-text, logos, signatures, arrows, diagrams, or green foreground details.',
  'Serious absurd product-sketch cutout, never cute, commercial, glossy, three-dimensional, or photorealistic.',
].join(' ');

const shots=[
  {id:'00_build_hook',filename:'00_build_hook.png',purpose:'struct 就是建造',subject:'The character stacks three plain black-outline blocks into one small orange scaffold frame, tightening the final joint with a tiny wrench. Everything floats.'},
  {id:'01_construct_together',filename:'01_construct_together.png',purpose:'construct 共同搭建',subject:'The character pulls several separate floating beams together and locks them into one compact orange frame, visibly constructing it.'},
  {id:'02_construction_process',filename:'02_construction_process.png',purpose:'construction 建造过程',subject:'One isolated action only: the character uses both hands to install one orange horizontal beam onto a very small floating unfinished frame made from only three or four short beams, with exactly two loose orange blocks nearby. No crane, construction site, building, room, floor, platform, scaffold scenery, writing, pseudo-text, letters, numbers, or arrows.'},
  {id:'03_structure_result',filename:'03_structure_result.png',purpose:'structure 搭出的结构',subject:'One isolated action only: the character gently pushes and checks one small floating orange triangular truss made from exactly six simple linear bars. The truss is compact and visibly stable. No room, doorway, giant rectangle, floor, perspective scene, writing, pseudo-text, letters, numbers, or arrows.'},
  {id:'04_instruct_build_mind',filename:'04_instruct_build_mind.png',purpose:'instruct 在头脑中搭建',subject:'The character places three blank white blocks into one large black-outline head-shaped frame, building an orderly orange arrangement inside.'},
  {id:'05_instruction_steps',filename:'05_instruction_steps.png',purpose:'instruction 建造认识的指令',subject:'The character follows three floating blank tiles in sequence and uses them to assemble one small object. No symbols, text, arrows, or numbers.'},
  {id:'06_reconstruct_again',filename:'06_reconstruct_again.png',purpose:'reconstruct 重新建造',subject:'The character gathers pieces of one broken floating frame and rebuilds them into a clean orange frame with both hands.'},
  {id:'07_destruct_take_down',filename:'07_destruct_take_down.png',purpose:'destruct 拆毁结构',subject:'One isolated action only: the character uses a tiny wrench to remove one beam from an ordinary small floating orange block frame made from cubes and straight bars; one small cube is falling away. The structure must be abstract and generic. Absolutely no Eiffel Tower, tower, landmark, bridge, building, floor, scenery, writing, pseudo-text, letters, numbers, or arrows.'},
  {id:'08_obstruct_block_build',filename:'08_obstruct_block_build.png',purpose:'obstruct 挡住建造通路',subject:'The character braces one oversized plain block directly across the opening of a small floating scaffold, visibly preventing another beam from entering.'},
] as const;

export const structIllustrationPrompts:readonly ReplicaIllustrationPrompt[]=shots.map(
  shot=>({...shot,prompt:`${BASE} ${shot.subject}`} as ReplicaIllustrationPrompt),
);
