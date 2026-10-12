import type {ReplicaIllustrationPrompt} from './projectTypes';

const BASE = [
  'Create one 2K 16:9 horizontal isolated cutout source image for a Douyin English root-word lesson.',
  'Use the accepted Xiaohei identity: one irregular solid-black hand-drawn character, two tiny solid-white dot eyes, no mouth, calm deadpan expression, complete thin black arms and legs, restrained orange and pale-blue prop accents.',
  'The image is a single semantic pose on a flat chroma green #00FF00 plate edge to edge. Keep the full subject inside the middle 62% with a continuous empty green band around every outer edge.',
  'Sparse pen-and-ink educational illustration, slightly wobbly lines, strong readable silhouette at phone size, no scenery, no floor, no shadows, no text, no labels, no arrows, no logos, no watermark, no border, no PPT panel, no gradient, no duplicated character, no generic stick figure, no cute mascot, no photorealism.',
].join(' ');

type Shot = {
  id: string;
  filename: `${string}.png`;
  word: string;
  state: 'before' | 'change' | 'result';
  purpose: string;
  subject: string;
};

const groups: Array<{word: string; purpose: string; states: Record<Shot['state'], string>}> = [
  {
    word: 'retain',
    purpose: '留住已检查的信息',
    states: {
      before: 'The character holds an open orange folder loosely while three blank note cards are about to slip out.',
      change: 'The character quickly gathers the three blank note cards and presses them into the orange folder with both hands.',
      result: 'The orange folder is closed and hugged firmly to the character chest; all three blank note cards stay inside.',
    },
  },
  {
    word: 'contain',
    purpose: '把东西装在边界里面',
    states: {
      before: 'A small orange open-top storage tub sits beside the character while six plain blue cubes are scattered outside it.',
      change: 'The character uses both hands to guide the blue cubes over the rim of the orange tub; several cubes are midway inside.',
      result: 'All six blue cubes are visibly inside the orange tub and the character holds the tub steady from both sides.',
    },
  },
  {
    word: 'maintain',
    purpose: '把稳定状态维持住',
    states: {
      before: 'A small orange three-piece balance tower leans to one side while the character watches with one hand ready.',
      change: 'The character braces the leaning tower with one hand and aligns the middle blue piece with the other.',
      result: 'The three-piece tower stands straight and steady; the character keeps one palm beside it as a quiet stabilizer.',
    },
  },
  {
    word: 'obtain',
    purpose: '把目标物拿到手里',
    states: {
      before: 'A plain orange permission token rests on a small raised pedestal just beyond the character reach.',
      change: 'The character reaches across and takes the orange token from the pedestal with one hand.',
      result: 'The character holds the orange token up securely in one hand while the empty pedestal remains beside them.',
    },
  },
  {
    word: 'detain',
    purpose: '把人留在边界前',
    states: {
      before: 'The character approaches a simple blue boundary line with one orange pass in hand and one foot about to cross.',
      change: 'The character plants both feet before the blue boundary and raises one palm to stop a small orange rolling ball from crossing.',
      result: 'The orange ball is held behind the blue boundary by the character; the character remains firmly stopped on the near side.',
    },
  },
  {
    word: 'sustain',
    purpose: '从下面托住重量',
    states: {
      before: 'A small orange platform is buckling under three blue blocks while the character crouches underneath with empty hands.',
      change: 'The character pushes both hands upward under the orange platform as it rises back toward level.',
      result: 'The orange platform is level and supported above the character hands, carrying the three blue blocks safely.',
    },
  },
  {
    word: 'entertain',
    purpose: '把注意力留住并逗乐',
    states: {
      before: 'The character faces a second small black Xiaohei-like audience figure that looks away while a plain orange juggling ball rests on the floorless empty space.',
      change: 'The character tosses the orange ball in a clear arc between both hands while the audience figure turns toward the action.',
      result: 'The character presents the orange ball with a playful raised pose and the audience figure leans in, visibly engaged; no facial features beyond white dot eyes.',
    },
  },
  {
    word: 'abstain',
    purpose: '主动忍住不去拿',
    states: {
      before: 'A bright orange sweet sits on a tiny blue tray just in front of the character, whose hands are reaching toward it.',
      change: 'The character pulls both hands back and turns the torso away from the orange sweet, leaving the tray untouched.',
      result: 'The character stands a step away with arms folded back while the untouched orange sweet remains on the tray.',
    },
  },
];

export const tenTainIllustrationPrompts: readonly ReplicaIllustrationPrompt[] = groups.flatMap((group) =>
  (['before', 'change', 'result'] as const).map((state) => {
    const shot = {
      id: `${group.word}-${state}`,
      filename: `${group.word}-${state}.png` as `${string}.png`,
      purpose: `${group.word} ${state}: ${group.purpose}`,
      subject: group.states[state],
      prompt: `${BASE} This is the ${state} pose in a coherent three-pose sequence for the word ${group.word}. ${group.states[state]} Keep the character, prop colors, line weight, and scale consistent with the other two poses, while making this state clearly distinct.`,
    } satisfies ReplicaIllustrationPrompt;
    return shot;
  }),
);

export const TEN_TAIN_NEGATIVE_PROMPT = [
  'text, letters, numbers, caption, label, logo, watermark, signature, arrow, diagram, infographic, PPT slide, ground line, floor, room, horizon, shadow, reflection, frame, border, white panel, texture, gradient, scenery, generic stick figure, cute mascot, commercial cartoon, glossy 3D, photorealistic, cropped limbs, duplicate main character, fused hands, green foreground details',
].join(', ');
