import type {ReplicaIllustrationPrompt} from './projectTypes';

const BASE = [
  'Create one 2K 16:9 horizontal isolated cutout source image.',
  'Use sparse slightly wobbly black hand-drawn pen lines with restrained flat orange and pale-blue accents.',
  'Include exactly one irregular solid-black deadpan observer with two tiny white dot eyes, no mouth, and thin limbs. It must perform the core seeing action.',
  'The entire background is exactly flat chroma green #00FF00 edge to edge. Keep the subject inside the middle 65% with a continuous empty green band around all edges.',
  'No text, letters, numbers, logos, signatures, arrows, diagrams, frame, border, screen panel, ground, floor, shadow, room, scenery, or green foreground details.',
  'Sparse strange product sketch, serious and deadpan; never cute, commercial, glossy 3D, photorealistic, or children illustration.',
].join(' ');

export const VIS_VID_NEGATIVE_PROMPT = 'text, letters, numbers, pseudo text, logo, watermark, signature, arrow, diagram, infographic, PPT, ground line, floor, wall, room, horizon, shadow, reflection, frame, border, panel, paper texture, gradient, scenery, green subject, cute mascot, kawaii, chibi, commercial cartoon, stock vector, glossy 3D, photorealistic, extra character, crowd, clipped object';

const shots = [
  ['00_see_hook','00_see_hook.png','vis / vid 看见总钩子','The observer presses one eye to an absurd oversized freestanding eye-shaped lens while turning a tiny orange focus knob. Show the full lens, character, hands and feet.'],
  ['01_vision','01_vision.png','vision 看见后形成画面','The observer looks through compact binoculars at one floating pale-blue sprout enclosed only by three loose black contour strokes, never a rectangular screen.'],
  ['02_visible','02_visible.png','visible 从遮挡到看得见','The observer pulls one small white cloth completely away from one floating orange sphere, making the revealed object unmistakably visible.'],
  ['03_video','03_video.png','video 给眼睛看的活动画面','The observer seriously turns the crank of one simple black-outline film projector while three blank white film circles float from it. No screen, film text, perforations, or frame.'],
  ['04_visual','04_visual.png','visual 与视觉有关','The observer closes one eye and carefully aligns one pale-blue circle, one orange triangle, and one white square in midair as a clean visual composition.'],
  ['05_evidence','05_evidence.png','evidence 摆到眼前的证据','The observer holds one oversized magnifying glass over one simple black spiral fingerprint-like mark on a floating white pebble. One orange focus spark, no detective scenery.'],
  ['06_evident','06_evident.png','evident 清楚可见','The observer operates one tiny lamp that casts a sparse orange cone toward one plain white floating object, making it plainly seen. No floor or dark background.'],
  ['07_visit','07_visit.png','visit 去看一看','The observer knocks on one sparse freestanding doorway outline and leans forward to look through the opening. Exactly one character; no wall, building, room, or second person.'],
  ['08_revise','08_revise.png','revise 再看再改','The observer looks again at one blank floating sheet while holding a simple pencil and eraser, with two short orange revision strokes beside the sheet but no writing or symbols.'],
] as const;

export const visVidIllustrationPrompts: readonly ReplicaIllustrationPrompt[] = shots.map(([id,filename,purpose,subject]) => ({id, filename, purpose, subject, prompt: `${BASE} ${subject}`}));
