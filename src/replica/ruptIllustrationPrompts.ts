import type {ReplicaIllustrationPrompt} from './projectTypes';

export const RUPT_NEGATIVE_PROMPT=[
  'text','letters','numbers','caption','label','logo','watermark','signature','arrow','diagram',
  'infographic','PPT slide','ground line','floor','room','horizon','shadow','reflection effect',
  'frame','border','white panel','texture','gradient','scenery','floor','ground','grass','handwriting','scribble','equation','large rectangle','pipe','window','wall','green subject','cute mascot',
  'children illustration','commercial cartoon','stock vector','glossy 3D','photorealistic','cropped body',
].join(', ');

const BASE=[
  'Create one 2K 16:9 horizontal isolated cutout source image.',
  'Use sparse slightly wobbly black hand-drawn pen lines with restrained orange, red, or pale-blue accents.',
  'Include exactly one irregular solid-black deadpan Xiaohei-like character with two tiny white dot eyes, no mouth, thin complete stick arms and legs.',
  'The black character must actively perform the central break, interruption, rupture, or boundary action; never stand as decoration.',
  'The entire background is exactly one flat chroma green #00FF00 plate edge to edge.',
  'Keep the complete subject inside the middle 62% and leave a continuous empty flat-green band around all four outer edges.',
  'No ground, shadow, scenery, room, frame, writing, letters, numbers, pseudo-text, logos, signatures, arrows, diagrams, or green foreground details.',
  'Serious absurd product-sketch cutout, never cute, commercial, glossy, three-dimensional, or photorealistic.',
].join(' ');

const shots=[
  {id:'00_rupt_hook',filename:'00_rupt_hook.png',purpose:'interrupt 真实切断一句话',subject:'The character holds two ends of one long black waveform ribbon while a narrow orange divider slices into the middle, leaving a visible gap. The character is caught in the interruption.'},
  {id:'01_rupture_break_open',filename:'01_rupture_break_open.png',purpose:'rupture 裂开',subject:'The character pulls open a plain oval shell with a bold orange zigzag crack splitting it into two halves. No scenery.'},
  {id:'02_interrupt_break_in',filename:'02_interrupt_break_in.png',purpose:'interrupt 插入中间',subject:'The character pushes a short orange bar between two separate black waveform ribbons, visibly blocking their connection. One simple break-in action only.'},
  {id:'03_disrupt_break_apart',filename:'03_disrupt_break_apart.png',purpose:'disrupt 打乱',subject:'The character bumps a neat stack of five simple outline blocks; three blocks are airborne and the order is visibly broken apart. Use one orange impact mark.'},
  {id:'04_erupt_break_out',filename:'04_erupt_break_out.png',purpose:'erupt 向外喷发',subject:'One isolated floating action only: the character braces beside a small plain volcano cone as orange blobs and red sparks burst outward from the opening. The complete cone and character float in empty space with a large uninterrupted flat-green margin below them; leave the bottom 25 percent completely empty flat green. Absolutely no floor, ground marks, grass, landscape, writing, scribbles, equations, arrows, or extra scenery.'},
  {id:'05_corrupt_break_down',filename:'05_corrupt_break_down.png',purpose:'corrupt 破坏变质',subject:'The character drips one red drop onto a clean white circular object with a simple black outline; the red stain spreads through a small internal crack. The character performs the damaging action.'},
  {id:'06_bankrupt_break_the_bank',filename:'06_bankrupt_break_the_bank.png',purpose:'bankrupt 破产',subject:'The character stands on a simple orange platform shaped like a bank counter as the middle snaps downward and three plain orange coins fall through the break. No bank logo or text.'},
  {id:'07_abrupt_break_off',filename:'07_abrupt_break_off.png',purpose:'abrupt 突然中断',subject:'The character runs along a thin orange rail and slams a small black stop block; the rail ends suddenly with a clean angled break and two red stress marks.'},
  {id:'08_incorruptible_not_broken',filename:'08_incorruptible_not_broken.png',purpose:'incorruptible 不被破坏',subject:'One isolated floating action only: the character holds a red droplet and tries to push it through a small simple blue circular boundary around a clean white disk; the droplet stops outside while the disk remains untouched. The boundary is a thin circle, never a rectangle, pipe, window, wall, frame, panel, or landscape. No floor, writing, scribbles, equations, or scenery.'},
] as const;

export const ruptIllustrationPrompts:readonly ReplicaIllustrationPrompt[]=shots.map(
  shot=>({...shot,prompt:`${BASE} ${shot.subject}`} as ReplicaIllustrationPrompt),
);
