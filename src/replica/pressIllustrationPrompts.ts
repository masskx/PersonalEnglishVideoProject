export type PressReplicaIllustrationPrompt = {
  id: string;
  filename: `${string}.png`;
  purpose: string;
  subject: string;
  prompt: string;
};

export const PRESS_REPLICA_IMAGE_SPEC = {
  aspectRatio: '16:9',
  arkSize: '2K',
  visualWidth: 2560,
  visualHeight: 1440,
  chromaKey: '#00FF00',
  greenSourceDir: 'assets/green-screen/press',
  alphaOutputDir: 'public/assets/replica/press',
} as const;

const BASE_PROMPT = [
  'Use case: scientific-educational.',
  'Asset type: isolated illustration for a 1920x1080 English root-word explainer video.',
  'Create one standalone 16:9, 2K horizontal illustration.',
  'Scene/backdrop: a perfectly flat, uniform, solid #00FF00 chroma-key background.',
  'The background must be exactly one color with no gradient, texture, paper grain, vignette, lighting variation, horizon, room, floor plane, reflection, contact shadow, or cast shadow.',
  'Style/medium: Ian Xiaohei editorial sketch style: pure-white/minimal black wobbly hand-drawn linework, sparse orange/red/blue annotations, lots of quiet white space, strange clean product-sketch feeling. Include one solid-black Xiaohei with white dot eyes, thin legs, blank serious expression, and make Xiaohei perform the core press action. Do not make it a cute mascot or colored commercial cartoon.',
  'Composition/framing: one isolated central visual metaphor, subject occupying roughly 30% to 55% of the canvas, fully inside frame, crisp separated edges, generous green padding on all four sides.',
  'The subject and every foreground detail must contain no green, lime, chartreuse, emerald, teal-green, olive, green reflection, or green-tinted antialiasing.',
  'No words, letters, Chinese characters, numbers, punctuation, labels, captions, speech text, logos, watermarks, signatures, arrows, pointer lines, diagrams, frames, UI, or decorative border.',
  'Do not draw a white or colored rectangular background behind the subject. Keep every non-subject pixel pure #00FF00.',
  'No 3D rendering, photorealism, glossy plastic, commercial stock-vector look, dense scenery, or childish poster styling.',
].join(' ');

export const PRESS_REPLICA_NEGATIVE_PROMPT = [
  'text',
  'Chinese text',
  'English words',
  'letters',
  'numbers',
  'pseudo text',
  'gibberish',
  'caption',
  'label',
  'logo',
  'watermark',
  'signature',
  'arrow',
  'pointer',
  'connector line',
  'green subject',
  'green clothing',
  'green object',
  'green edge',
  'green tint',
  'gradient background',
  'background texture',
  'paper texture',
  'shadow',
  'cast shadow',
  'contact shadow',
  'floor',
  'room',
  'wall',
  'horizon',
  'frame',
  'border',
  'UI',
  'infographic',
  'PPT slide',
  'photorealistic',
  '3D render',
].join(', ');

const shotSpecs = [
  {
    id: '00_hook',
    filename: '00_hook.png',
    purpose: '开场：很多词都由同一个按压动作串起来',
    subject:
      'A puzzled but friendly simple line-drawn learner beside a small mechanical press button, with several blank rounded paper slips floating loosely around it. The slips are completely blank and contain no marks. The visual should suggest many related ideas converging on one press action without using arrows or connector lines.',
  },
  {
    id: '01_press',
    filename: '01_press.png',
    purpose: '词根 press 的核心按压动作',
    subject:
      'A simple expressive hand pressing down a large empty round mechanical button mounted on a tiny base. Show the button visibly compressed through pose and shape only. Keep the mechanism minimal, tactile, and immediately readable.',
  },
  {
    id: '02_pressure',
    filename: '02_pressure.png',
    purpose: 'pressure：从四周感到压力',
    subject:
      'A tiny simple person gently squeezed between two large opposing padded plates, with one smaller plate hovering closely above. The character looks strained but not harmed. Convey surrounding pressure through compression and pose only, with no arrows or motion labels.',
  },
  {
    id: '03_impress',
    filename: '03_impress.png',
    purpose: 'impress：把印象压进心里',
    subject:
      'A simple person pressing a classic rubber stamp onto a blank heart-shaped memory tablet. A small clean orange impression shape is visible on the heart, but it contains no symbol, letter, or text. The action clearly feels like leaving an impression inside.',
  },
  {
    id: '04_express',
    filename: '04_express.png',
    purpose: 'express：把内在想法表达出来',
    subject:
      'A simple person opening both hands from the chest as a small orange heart, pale-blue idea cloud, and two tiny sparkle shapes emerge outward. Show outward expression through pose and spacing only, with no speech bubble, words, arrows, or connector lines.',
  },
  {
    id: '05_depress',
    filename: '05_depress.png',
    purpose: 'depress：向下压低、使沮丧',
    subject:
      'A small seated person with lowered head gently compressed beneath a large dark-blue soft-edged rectangular weight. The figure remains clearly visible and unharmed. Convey being pressed downward and low mood through posture and compressed spacing only.',
  },
  {
    id: '06_suppress',
    filename: '06_suppress.png',
    purpose: 'suppress：把冒出的东西压住',
    subject:
      'Two simple small people pressing a bright orange flame down into a minimal open hatch using a plain flat lid. The flame is almost contained. Make the action cooperative and clear, with no arrows, labels, smoke, or environmental scene.',
  },
  {
    id: '07_repress',
    filename: '07_repress.png',
    purpose: 'repress：把情绪重新压回去',
    subject:
      'A simple person using both hands to push a pale-pink emotion cloud back into a small open box while closing its lid. The cloud has only a tiny abstract heart shape and no face or writing. Emphasize returning and containing through pose, not arrows.',
  },
  {
    id: '08_compress',
    filename: '08_compress.png',
    purpose: 'compress：从两边一起压缩',
    subject:
      'A stack of blank pale-blue paper blocks being squeezed into one compact block by two opposing simple mechanical press plates. Two tiny workers push the plates from each side. All paper surfaces are completely blank and contain no document marks.',
  },
  {
    id: '09_oppress',
    filename: '09_oppress.png',
    purpose: 'oppress：巨大的力量朝人压过去',
    subject:
      'A very small upright person beneath a huge descending dark-blue hand-shaped press plate. Keep a visible gap so the scene is tense but not violent. Convey unequal force and oppression through scale alone, with no ground shadow, arrows, or scenery.',
  },
  {
    id: '10_summary',
    filename: '10_summary.png',
    purpose: '总结：一个按压动作衍生多种语义画面',
    subject:
      'A central simple press button surrounded by five well-separated miniature object metaphors: a blank heart stamp, a compact paper block, a contained orange flame, a small closed emotion box, and a soft dark-blue weight. Arrange them as an airy balanced family of icons with no arrows, lines, text, or enclosing panel.',
  },
] as const;

export const pressReplicaIllustrationPrompts: readonly PressReplicaIllustrationPrompt[] =
  shotSpecs.map((shot) => ({
    ...shot,
    prompt: `${BASE_PROMPT} Primary request: ${shot.subject} Final check: pure flat #00FF00 surrounds the entire isolated subject; the subject has no green; no text and no arrows.`,
  }));
