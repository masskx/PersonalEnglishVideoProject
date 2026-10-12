import type {ReplicaIllustrationPrompt} from './projectTypes';

export const DUC_DUCT_NEGATIVE_PROMPT = [
  'text','letters','numbers','caption','label','logo','watermark','signature','arrow','diagram',
  'infographic','PPT slide','ground line','floor','room','horizon','shadow','reflection','frame',
  'border','white panel','texture','gradient','scenery','green subject','cute mascot',
  'children illustration','commercial cartoon','stock vector','glossy 3D','photorealistic','cropped body',
  'generic stickman','tiny bean','long thin limbs','ring eyes','extra characters','extra limbs',
].join(', ');

const BASE = [
  'Create one 2K 16:9 horizontal isolated cutout source image.',
  'Use the exact accepted project Xiaohei identity from public/assets/replica/mit-miss/00_send_hook.png as the character anchor; do not redesign the character.',
  'The character is a large, substantial irregular solid-black bean body with two filled white dot eyes, no mouth, readable black arms with round hands, and bent black legs with small feet.',
  'Keep the body-to-limb ratio, eye placement, deadpan expression, and hand-drawn silhouette of the accepted anchor; never turn it into a generic stickman.',
  'Use sparse slightly wobbly black hand-drawn pen lines with restrained orange and red accents for the separate prop.',
  'The character must perform the core lead or guide action, not stand beside it.',
  'The entire background is transparent so the Remotion scene can provide a pure white background.',
  'Keep the complete subject inside the middle 65% and leave a continuous transparent band around all four outer edges.',
  'No ground, shadow, scenery, frame, writing, letters, numbers, pseudo-text, logos, signatures, arrows, diagrams, or green foreground details.',
  'Serious absurd product-sketch cutout, never cute, commercial, glossy, three-dimensional, or photorealistic.',
].join(' ');

const shots = [
  {id:'00_lead_hook',filename:'00_lead_hook.png',purpose:'把 duc / duct 固定成 lead',subject:'The character actively steers one thick orange branching route toward a small red destination flag, showing that leading means choosing a direction.'},
  {id:'01_conduct_together',filename:'01_conduct_together.png',purpose:'conduct：一起带领',subject:'The character guides three plain black-outline dots along three orange paths that converge into one shared route and one red destination flag.'},
  {id:'02_induce_in',filename:'02_induce_in.png',purpose:'induce：带入、促使',subject:'The character pushes one plain black-outline object across the threshold of a simple orange doorway, clearly leading it inward.'},
  {id:'03_reduce_back',filename:'03_reduce_back.png',purpose:'reduce：带回到更小范围',subject:'The character pulls a plain orange stack backward toward a small red boundary with a taut short rope, making the stack visibly smaller.'},
  {id:'04_produce_forth',filename:'04_produce_forth.png',purpose:'produce：带出来、产生',subject:'The character pushes a plain orange cart forward out of a compact orange hatch, with a few blank geometric objects appearing in the cart.'},
  {id:'05_introduce_inward',filename:'05_introduce_inward.png',purpose:'introduce：带进新场合',subject:'The character actively presents a blank card into a bright orange circle of light, showing an idea or person being led into a new group.'},
  {id:'06_deduce_down',filename:'06_deduce_down.png',purpose:'deduce：从事实推出结论',subject:'The character pulls three blank fact cards downward along one orange branching line into one plain red conclusion flag.'},
] as const;

export const ducDuctIllustrationPrompts: readonly ReplicaIllustrationPrompt[] = shots.map(
  (shot) => ({...shot,prompt:`${BASE} ${shot.subject}`} as ReplicaIllustrationPrompt),
);
