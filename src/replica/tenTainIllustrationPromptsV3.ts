import type {ReplicaIllustrationPrompt} from './projectTypes';

// This prompt deliberately follows the accepted mit / miss visual grammar: a large,
// irregular black Xiaohei cutout, rough ink contours, and a few oversized orange/cyan
// props that read immediately on a phone. The images remain isolated on chroma green;
// the green plate is removed before they enter Remotion.
const MIT_MISS_STYLE_BASE = [
  'Create one 2K 16:9 horizontal isolated bitmap cutout source image for a Douyin English root-word lesson; this must be a genuinely generated raster illustration, not SVG or a vector placeholder.',
  'Use the accepted mit / miss episode as a visual reference only; match its raster ink texture and hand-drawn line rhythm without copying its objects. Match the accepted mit / miss episode visual DNA: sparse slightly wobbly black hand-drawn pen lines, one smooth rounded solid-black Xiaohei bean silhouette, two tiny solid-white dot eyes, no mouth, thin complete stick arms and legs, and restrained orange, cyan, and warm-gray hand-drawn props.',
  'Make the local prop large and unmistakable. The character must actively perform the central hold or keep action; never stand as decoration. Use a serious absurd product-sketch cutout feeling, with a clean black body and rough ink edges only on the props, instead of a furry scribble character, polished cartoon art, or a PPT diagram.',
  'The entire background is exactly one flat chroma green #00FF00 plate edge to edge. Keep the complete subject inside the middle 62% and leave a continuous empty flat-green band around all four outer edges.',
  'This is one finished raster frame, never a storyboard, contact sheet, concept board, or design presentation. Never output SVG, an icon sheet, or a flat geometric vector mockup. Draw exactly one main character and only the named objects. No ground, shadow, room, scenery, frame, writing, letters, numbers, pseudo-text, logos, signatures, arrows, diagrams, labels, panels, gradients, reflections, background notes, or extra characters. No tiny props that disappear at phone size.',
].join(' ');

type Group = {
  word: string;
  purpose: string;
  states: Record<'before' | 'change' | 'result', string>;
};

const groups: Group[] = [
  {
    word: 'retain',
    purpose: '留住已经检查过的信息',
    states: {
      before: 'A large orange-and-gray clipboard folder hangs open in front of the character; three oversized blank cards are sliding away from the open folder.',
      change: 'The character leans forward and stuffs the three blank cards back into the large orange folder with both hands; the folder dominates the lower half.',
      result: 'The character hugs the closed orange folder tightly against the chest; the three cards are visibly contained and the gray clip is shut.',
    },
  },
  {
    word: 'contain',
    purpose: '把东西放进一个清楚的边界里',
    states: {
      before: 'A large open cyan-and-orange storage bin sits beside the character, with six oversized blue cubes scattered around the outside.',
      change: 'The character pushes several big blue cubes over the thick orange rim into the large bin; one cube is caught halfway across the boundary.',
      result: 'The large cyan-and-orange bin is visibly packed with all six blue cubes, and the character grips both sides to keep everything inside.',
    },
  },
  {
    word: 'maintain',
    purpose: '把状态维持在稳定位置',
    states: {
      before: 'A large three-piece orange-and-cyan balancing tower leans dramatically to one side while the character prepares both hands beside it.',
      change: 'The character braces the leaning tower with one hand and pushes the middle cyan block into alignment with the other; the action is the focus.',
      result: 'The large orange-and-cyan tower stands straight and stable; the character keeps one hand beside it as a visible stabilizer.',
    },
  },
  {
    word: 'obtain',
    purpose: '把目标物拿到手里',
    states: {
      before: 'A large orange permission token rests on a chunky gray-and-cyan pedestal just beyond the character reach.',
      change: 'The character reaches across the gap and pulls the large orange token off the pedestal; the hand-to-token contact is clear.',
      result: 'The character holds the orange token high and securely in one hand while the empty pedestal remains visible beside them.',
    },
  },
  {
    word: 'detain',
    purpose: '把移动中的对象留在边界前',
    states: {
      before: 'A broad cyan barrier with a thick orange stop arm crosses the middle of the image; the character approaches it holding a large orange pass.',
      change: 'The character plants both feet before the barrier and presses one hand against the orange stop arm while an orange ball is halted on the near side.',
      result: 'The orange barrier arm is down, the orange ball remains behind it, and the character stands firmly stopped at the boundary.',
    },
  },
  {
    word: 'sustain',
    purpose: '从下面把重量托住',
    states: {
      before: 'A wide orange bridge beam sags above the character while three large blue traffic blocks weigh it down.',
      change: 'The character pushes both hands upward under the wide beam; the beam is visibly rising toward level and the blocks remain on top.',
      result: 'The broad orange bridge is level and held up above the character, carrying the three blue blocks safely.',
    },
  },
  {
    word: 'entertain',
    purpose: '把注意力留住并逗乐',
    states: {
      before: 'One large Xiaohei faces a bold orange ball and a simple cyan stage arch; the character is preparing a performance.',
      change: 'The character tosses the large orange ball in a clear compact arc under the cyan arch; keep one main character and one large prop.',
      result: 'The character presents the orange ball in a raised playful pose under the cyan arch, holding attention through the show.',
    },
  },
  {
    word: 'abstain',
    purpose: '主动把自己拉开并忍住',
    states: {
      before: 'A large bright-orange sweet sits on a broad cyan tray directly in front of the character, whose hands reach toward it.',
      change: 'The character pulls both hands back and turns the torso away from the large orange sweet, leaving the tray untouched.',
      result: 'The character stands one step away with arms folded back while the untouched orange sweet remains clearly visible on the cyan tray.',
    },
  },
];

export const tenTainIllustrationPromptsV3: readonly ReplicaIllustrationPrompt[] = groups.flatMap((group) =>
  (['before', 'change', 'result'] as const).map((state) => ({
    id: `${group.word}-${state}`,
    filename: `${group.word}-${state}.png` as `${string}.png`,
    purpose: `${group.word} ${state}: ${group.purpose}`,
    subject: group.states[state],
    prompt: `${MIT_MISS_STYLE_BASE} This is the ${state} pose in a coherent three-pose sequence for ${group.word}. ${group.states[state]} Keep the same smooth Xiaohei silhouette, line weight, camera distance, and prop palette across all three states; make the before, change, and result moments visibly distinct. Final check: exactly one smooth black Xiaohei in this single frame, no duplicate poses, no ghosted copies, no audience, no text, no storyboard panels.`,
  })),
);

export const TEN_TAIN_NEGATIVE_PROMPT_V3 = [
  'text, letters, numbers, caption, label, logo, watermark, signature, arrow, diagram, infographic, PPT slide, ground line, floor, room, horizon, shadow, reflection, frame, border, white panel, texture, gradient, scenery, generic stick figure, cute mascot, commercial cartoon, glossy 3D, photorealistic, cropped limbs, duplicated main character, fused hands, tiny unreadable props, full-canvas mechanical overlay, green foreground details',
].join(', ');
