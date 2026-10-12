import type {ReplicaIllustrationPrompt} from './projectTypes';

export const BOUBA_KIKI_REPLICA_IMAGE_SPEC = {
  aspectRatio: '16:9',
  arkSize: '2K',
  visualWidth: 2560,
  visualHeight: 1440,
  chromaKey: '#00FF00',
  greenSourceDir: 'assets/green-screen/bouba-kiki',
  alphaOutputDir: 'public/assets/replica/bouba-kiki',
} as const;

const BASE_PROMPT = [
  'Create one 2K 16:9 horizontal isolated cutout source image.',
  'The acting character is one irregular bean-shaped silhouette filled uniformly solid pure black, with exactly two tiny white dot eyes and very thin black stick limbs. The body has no colored fill, gradient, shading, gloss, or texture.',
  'Use sparse slightly wobbly black pen outlines for all other people and props, with restrained flat orange and blue accents.',
  'The entire background is exactly one flat chroma green #00FF00 plate edge to edge. Keep every complete object inside the middle 65% of the canvas.',
  'Leave a continuous empty flat-green band at least 15% of canvas size along all four outer edges. No foreground mark enters this band.',
  'No ground, floor, water surface, ice rink, shadow, reflection, horizon, room, scenery, frame, border, inner panel, or paper edge.',
  'All papers, boards, screens, signs, cards, books, and speech balloons are completely blank. No words, letters, numbers, labels, logos, watermarks, signatures, UI, or formal diagram.',
].join(' ');

const ROUND_TEST_PROMPT = [
  'Create one 2K 16:9 horizontal isolated cutout source image.',
  'One irregular character kneads one single round soft blob with both hands. The character is a uniform flat solid pure-black bean silhouette with exactly two tiny white dot eyes and thin black stick limbs.',
  'The round blob has a restrained pale-cream and pale-pink flat fill with one slightly wobbly black contour. The blob has no face, eyes, mouth, limbs, writing, pattern, or decoration.',
  'Show only the complete black character and the one complete round blob as a floating isolated pair in the middle 50%.',
  'The entire background is exactly flat chroma green #00FF00 edge to edge, with a continuous 18% empty green band on all four sides.',
  'No table, plate, bowl, tool, food, ground, baseline, floor, shadow, scenery, frame, border, panel, text, logo, signature, or extra object.',
].join(' ');

const SPIKY_TEST_PROMPT = [
  'Create one 2K 16:9 horizontal isolated cutout source image.',
  'One irregular character carefully assembles one single angular spiky starburst cutout with both hands. The character is a uniform flat solid pure-black bean silhouette with exactly two tiny white dot eyes and thin black stick limbs.',
  'The starburst has a restrained flat violet fill, sparse orange edge strokes, and one slightly wobbly black contour. The starburst has no face, eyes, mouth, limbs, writing, pattern, or decoration.',
  'Show only the complete black character and the one complete starburst as a floating isolated pair in the middle 50%.',
  'The entire background is exactly flat chroma green #00FF00 edge to edge, with a continuous 18% empty green band on all four sides.',
  'No table, plate, blade, tool, fire, ground, baseline, floor, shadow, scenery, frame, border, panel, text, logo, signature, or extra object.',
].join(' ');

export const BOUBA_KIKI_REPLICA_NEGATIVE_PROMPT = [
  'text', 'Chinese text', 'English words', 'letters', 'numbers', 'pseudo text', 'gibberish',
  'caption', 'label', 'logo', 'watermark', 'signature', 'large formal arrows', 'dense connector arrows',
  'green subject', 'green clothing', 'green object', 'green edge', 'green tint', 'green-screen frame', 'chroma studio', 'scenery', 'landscape',
  'gradient background', 'background texture', 'paper texture', 'shadow', 'cast shadow',
  'contact shadow', 'floor', 'room', 'wall', 'horizon', 'frame', 'border', 'UI',
  'infographic', 'PPT slide', 'formal flowchart', 'mascot', 'cute mascot', 'kawaii', 'chibi',
  'children\'s illustration', 'childish cartoon', 'commercial cartoon', 'stock illustration',
  'stock vector', 'commercial vector', 'photorealistic', 'glossy 3D', '3D render',
  'white backdrop plate',
  'white background',
  'off-white background',
  'cream background',
  'inner white panel',
  'white paper panel',
].join(', ');

const shotSpecs = [
  {
    id: '00_bouba_round',
    filename: '00_bouba_round.png',
    purpose: '开场的圆润 Bouba 候选形象。',
    subject: 'One Xiaohei seriously kneads and inflates a single round soft blob with a wobbly outline, making the round Bouba sensation through its hands and body. Keep the blob a restrained cream/pale-pink flat fill with black linework, no friendly smile, lettering, or extra props; Xiaohei remains solid black with white dot eyes and thin legs.',
  },
  {
    id: '01_kiki_spiky',
    filename: '01_kiki_spiky.png',
    purpose: '开场的尖锐 Kiki 候选形象。',
    subject: 'One Xiaohei deadpanly sharpens and assembles a single angular starburst cutout, making the pointed Kiki sensation through the action. Use a restrained purple/magenta flat fill and sparse orange edge marks, with safe simple spikes but no cute face, fire, weapon, lettering, logo, or scenery.',
  },
  {
    id: '02_thinking_figure',
    filename: '02_thinking_figure.png',
    purpose: '观众思考名字与形状对应关系的简笔人物。',
    subject: 'The solid-black bean character sits in a serious thinking pose, one thin hand on the chin while the other steadies two blank round and spiky shape cutouts. Add one tiny blank speech balloon and a single blue thought mark; keep the balloon empty and the expression neutral.',
  },
  {
    id: '03_experiment_classroom',
    filename: '03_experiment_classroom.png',
    purpose: '经典实验的教室与选择者群像。',
    subject: 'The solid-black bean character conducts a compact sound-shape experiment by placing one round cutout and one spiky cutout on a large completely blank board while two sparse outline participants point to their choices at a plain desk. Keep every board and card empty and omit any room background or extra observer.',
  },
  {
    id: '04_speaking_feeling_pair',
    filename: '04_speaking_feeling_pair.png',
    purpose: '说话者与身体感受者的声音象征对照。',
    subject: 'The solid-black bean character speaks into one blank wobbly speech balloon while one sparse outline listener receives the sound as a pale-blue pressure mark at the chest and head. The black character makes the speaking gesture; no text or extra scenery.',
  },
  {
    id: '05_historical_speakers',
    filename: '05_historical_speakers.png',
    purpose: '古代说话者用声音描述直接感官体验。',
    subject: 'The solid-black bean character, dressed only as a minimal ancient speaker silhouette, physically demonstrates a sound sensation to four sparse outline market listeners around two plain stalls. Use a few empty speech balloons and one red sensation mark, no signs, scenic background, ornate costume, or readable text.',
  },
  {
    id: '06_cracked_glass',
    filename: '06_cracked_glass.png',
    purpose: 'cr- 的破碎感：裂开的透明玻璃。',
    subject: 'The solid-black bean character presses a small plain wedge against one large transparent glass pane until one dark-blue crack radiates from the contact point, with a few pale-blue shards. The black character performs the cracking action; no hammer, text, or background, and keep the pane recognizable.',
  },
  {
    id: '07_water_splash',
    filename: '07_water_splash.png',
    purpose: 'sp- 的飞溅、喷涌：向上爆开的水花。',
    subject: 'The solid-black bean character deliberately stomps into one tiny isolated puddle, causing one lively blue splash to erupt upward with rounded droplets and pointed jets. Use pale and deep blues with dark wobbly outlines, no container, horizon, or extra decoration; the black character causes the spray.',
  },
  {
    id: '08_nose_sneeze_figure',
    filename: '08_nose_sneeze_figure.png',
    purpose: 'sn- 的鼻子与鼻腔声音：捂鼻打喷嚏的人物。',
    subject: 'The solid-black bean character in profile covers its nose and performs a sneeze, sending a few pale-blue curved sound puffs outward. Keep the nose and thin-legged pose readable, with no tissue package, speech text, or extra expression; the sneeze is the core action.',
  },
  {
    id: '09_sliding_skater',
    filename: '09_sliding_skater.png',
    purpose: 'sl- 的滑动：在小片冰面上滑行的人物。',
    subject: 'The solid-black bean character leans forward and slides across one small pale-blue ice patch, one thin leg extended and a few orange motion strokes under its feet. Keep the subject isolated and dynamic, with no rink, scenery, or skating costume.',
  },
  {
    id: '10_diamond_light',
    filename: '10_diamond_light.png',
    purpose: 'gl- 的光亮：发出柔和闪光的切面钻石。',
    subject: 'The solid-black bean character carefully polishes and angles one large faceted diamond until restrained orange and blue sparkle rays appear. Keep the diamond pale blue with dark wobbly facet lines, no jewelry setting, extra hand, text, or glow rectangle; the black character causes the light.',
  },
  {
    id: '11_modern_speakers',
    filename: '11_modern_speakers.png',
    purpose: '从古代回扣到现代说话者的群像。',
    subject: 'The solid-black bean character stands in a loose row of four sparse modern outline adults and physically pulls their empty speech balloons into one shared bundle, making conversation converge. Use clean wobbly linework, restrained clothing accents, a few blue secondary marks, no logos or scenery.',
  },
] as const;

export const boubaKikiReplicaIllustrationPrompts: readonly ReplicaIllustrationPrompt[] = shotSpecs.map(
  (shot) => ({
    ...shot,
    prompt:
      shot.id === '00_bouba_round'
        ? ROUND_TEST_PROMPT
        : shot.id === '01_kiki_spiky'
          ? SPIKY_TEST_PROMPT
          : `${BASE_PROMPT} Main action: ${shot.subject}`,
  }),
);

export default boubaKikiReplicaIllustrationPrompts;
