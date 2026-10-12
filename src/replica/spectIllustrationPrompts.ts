import type {ReplicaIllustrationPrompt} from './projectTypes';

export const SPECT_REPLICA_IMAGE_SPEC = {
  aspectRatio: '16:9',
  arkSize: '2K',
  visualWidth: 2560,
  visualHeight: 1440,
  chromaKey: '#00FF00',
  greenSourceDir: 'assets/green-screen/spect',
  alphaOutputDir: 'public/assets/replica/spect',
} as const;

const BASE_PROMPT = [
  'Create one 2K 16:9 horizontal isolated cutout source image.',
  'Use sparse slightly wobbly black hand-drawn pen lines with restrained flat orange, red, or pale-blue accents.',
  'Include exactly one irregular solid-black deadpan observer character with two tiny white dot eyes, no mouth, and thin stick arms and legs. The character must perform the core looking action.',
  'The entire background is exactly one flat chroma green #00FF00 plate edge to edge.',
  'Keep the complete subject inside the middle 65% and leave a continuous empty flat-green band around all four outer edges.',
  'No ground line, floor, shadow, room, scenery, frame, panel, paper edge, writing, letters, numbers, logos, signatures, arrows, diagrams, or green foreground details.',
  'The result is a strange sparse product-sketch cutout, serious and deadpan, never a cute mascot, commercial cartoon, children illustration, glossy 3D render, or photorealistic scene.',
].join(' ');

export const SPECT_REPLICA_NEGATIVE_PROMPT = [
  'text', 'letters', 'numbers', 'Chinese text', 'English words', 'pseudo text', 'caption', 'label',
  'logo', 'watermark', 'signature', 'artist mark', 'arrow', 'diagram', 'infographic', 'PPT slide',
  'formal flowchart', 'ground line', 'baseline', 'floor', 'road', 'wall', 'room', 'horizon',
  'cast shadow', 'contact shadow', 'reflection', 'frame', 'border', 'white panel', 'paper texture',
  'gradient', 'scenery', 'landscape', 'green subject', 'green object', 'green clothing', 'green edge',
  'cute mascot', 'kawaii', 'chibi', 'children illustration', 'commercial cartoon', 'stock vector',
  'glossy 3D', 'photorealistic', 'extra character', 'crowd', 'clipped object', 'cropped feet',
].join(', ');

const shots = [
  {
    id: '00_look_hook', filename: '00_look_hook.png', purpose: '开场把 spect 固定成小黑的观察镜头',
    subject: 'The single solid-black observer leans into one absurd oversized freestanding telescope made from sparse black outlines. One eye aligns with the eyepiece, the far lens is pale blue, and two short orange focus marks make the looking action unmistakable. Show the full observer and complete telescope with wide empty green padding.',
  },
  {
    id: '01_inspect_inside', filename: '01_inspect_inside.png', purpose: 'inspect 向内部仔细看',
    subject: 'The single solid-black observer bends forward and uses one large black-outline magnifying glass to peer deep inside one open plain white box. The face, lens, hands, both feet, and complete box remain visible. Add one tiny orange focus mark inside the box. No writing, tools, floor, or second person.',
  },
  {
    id: '02_respect_back', filename: '02_respect_back.png', purpose: 'respect 回头认真看并给予重视',
    subject: 'Exactly one and only one solid-black observer turns its own head backward while respectfully tipping one simple black-outline hat toward one small floating orange starburst. Never depict a reflection, duplicate, portrait, statue, silhouette, audience, pedestal, platform, or any other humanoid form. The single head, white dot eyes, hat, body, both arms, and both feet are complete. No horizontal bar, ceremony scenery, or support object.',
  },
  {
    id: '03_suspect_under', filename: '03_suspect_under.png', purpose: 'suspect 从下方偷看而起疑',
    subject: 'The single solid-black observer crouches beneath one short floating black-outline ledge and peeks upward at one closed plain white parcel resting above it. Add exactly three tiny separate orange suspicion dots in a loose arc, not punctuation and not a question mark. Keep every object isolated and fully visible. Absolutely no glyphs, punctuation, writing, floor, room, detective props, or second character.',
  },
  {
    id: '04_expect_out', filename: '04_expect_out.png', purpose: 'expect 向外张望并等待',
    subject: 'The single solid-black observer and one complete sparse freestanding lookout tube together fill about 40% of the canvas width and height. The observer stretches forward through the tube while waiting for one small plain white parcel floating in the distance. Add two tiny separate orange anticipation sparks near the observer, never arrows or directional marks. Show the full observer, both feet, complete tube, and parcel. No arrowheads, horizon, window, building, clock, punctuation, or text.',
  },
  {
    id: '05_prospect_forward', filename: '05_prospect_forward.png', purpose: 'prospect 向前看见前景',
    subject: 'The single solid-black observer stands upright and looks through one compact black-outline telescope toward a tiny floating pale-blue sprout and three rising white stepping blocks. One orange ray marks the promising view. Keep the whole arrangement centered with no ground, horizon, landscape, chart, or arrows.',
  },
  {
    id: '06_spectator_watch', filename: '06_spectator_watch.png', purpose: 'spectator 是坐着观看的人',
    subject: 'The single solid-black observer sits seriously on one minimal floating black-outline chair while watching one small plain white juggling ball in the air. The character holds one tiny blank ticket with no marks. Show the full chair, both feet, ticket, and ball. No stage, screen, crowd, frame, floor, or second performer.',
  },
  {
    id: '07_spectacle_show', filename: '07_spectacle_show.png', purpose: 'spectacle 是值得观看的壮观场面',
    subject: 'The single solid-black observer pulls away one small plain white cloth to reveal one absurd oversized floating black-outline lens with a pale-blue center. Three restrained orange sparks surround the lens. Show the full observer, cloth, lens, and sparks. No stage, curtains, scenery, audience, text, or second character.',
  },
  {
    id: '08_retrospect_backwards', filename: '08_retrospect_backwards.png', purpose: 'retrospect 向后回看过去',
    subject: 'The single solid-black observer walks forward while holding one complete small rear-view mirror and looking backward into it. Behind the observer float three tiny blank white memory cards with no border text or images, indicated only by sparse black outlines and one curved orange trail. No road, floor, timeline, arrows, scenery, or second person.',
  },
] as const;

export const spectReplicaIllustrationPrompts: readonly ReplicaIllustrationPrompt[] = shots.map(
  (shot) => ({...shot, prompt: `${BASE_PROMPT} ${shot.subject}`} as ReplicaIllustrationPrompt),
);
