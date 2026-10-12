import type {ReplicaIllustrationPrompt} from './projectTypes';

export const SCRIPT_SCRIB_NEGATIVE_PROMPT = [
  'text', 'letters', 'numbers', 'caption', 'label', 'logo', 'watermark', 'signature',
  'arrow', 'diagram', 'infographic', 'PPT slide', 'ground line', 'floor', 'room',
  'horizon', 'shadow', 'reflection', 'frame', 'border', 'white panel', 'texture',
  'gradient', 'scenery', 'green subject', 'cute mascot', 'children illustration',
  'commercial cartoon', 'stock vector', 'glossy 3D', 'photorealistic', 'cropped body',
].join(', ');

const BASE = [
  'Create one 2K 16:9 horizontal isolated cutout source image.',
  'Use sparse slightly wobbly black hand-drawn pen lines with restrained orange, red, or pale-blue accents.',
  'Include exactly one irregular solid-black deadpan character with two tiny white dot eyes, no mouth, and thin complete stick arms and legs.',
  'The character must perform the core writing action with a clearly visible hand, tool, and result.',
  'The entire background is exactly one flat chroma green #00FF00 plate edge to edge.',
  'Keep the complete subject inside the middle 65% and leave a continuous empty flat-green band around all four outer edges.',
  'No ground, shadow, scenery, frame, writing, letters, numbers, pseudo-text, logos, signatures, arrows, diagrams, or green foreground details.',
  'Serious absurd product-sketch cutout, never cute, commercial, glossy, three-dimensional, or photorealistic.',
].join(' ');

const shots = [
  {id: '00_write_hook', filename: '00_write_hook.png', purpose: '把 script / scrib 固定成笔尖写下轨迹', subject: 'The character pulls one oversized fountain pen like a plow across three floating blank white paper strips. A single clean orange ink ribbon trails from the pen tip. Show the full character, pen, ribbon, and paper strips floating in isolation.'},
  {id: '01_describe_trace', filename: '01_describe_trace.png', purpose: 'describe 把观察到的样子写下来', subject: 'A sparse isolated cutout: the character stands between one small floating plain teapot and one small floating blank sheet, looking at the teapot while drawing one single smooth orange arc on the sheet. Everything floats in an empty flat-green plate. No viewing circle, board, easel, room, floor, ground, shadow, texture, black background, hatching, handwriting, glyph, or pseudo-text.'},
  {id: '02_prescribe_before', filename: '02_prescribe_before.png', purpose: 'prescribe 事先写下医嘱或规定', subject: 'The character writes one single abstract orange straight stroke on a floating blank white instruction card, then firmly hands the card toward one extremely plain cylindrical medicine bottle. The bottle is one unmarked white silhouette with black outline: absolutely no label panel, cross, plus sign, logo, stripe, cap text, or marks.'},
  {id: '03_subscribe_under', filename: '03_subscribe_under.png', purpose: 'subscribe 在下面签写加入', subject: 'The character crouches underneath one floating blank scroll and signs it with a large orange pen stroke along the lower edge. A simple empty paper tube waits beside the scroll. No writing, symbols, checkmarks, or postal marks.'},
  {id: '04_transcribe_across', filename: '04_transcribe_across.png', purpose: 'transcribe 把声音跨到纸上', subject: 'The character listens to one plain horn on the left and carries a pen across a tiny arched bridge to one blank white sheet on the right. One orange sound ribbon enters the ear side and becomes one orange ink ribbon at the pen tip. No waveform, notes, writing, or arrows.'},
  {id: '05_manuscript_hand', filename: '05_manuscript_hand.png', purpose: 'manuscript 用手写成的稿子', subject: 'The character uses both hands to guide one oversized quill across a long floating rolled manuscript sheet. The sheet stays completely blank except for one abstract orange ink trail with no glyphs or pseudo-writing.'},
  {id: '06_inscription_carve', filename: '06_inscription_carve.png', purpose: 'inscription 写进或刻在表面', subject: 'The character braces a chisel and small hammer against one thin floating plain stone tablet, carving one shallow orange groove into the surface. The tablet and full character float separately in empty green space with no floor, shadow, ground scribble, baseline, debris, scenery, or support. The groove is abstract and contains no letters or symbols.'},
  {id: '07_postscript_after', filename: '07_postscript_after.png', purpose: 'postscript 在正文后再补写', subject: 'A sparse isolated cutout with exactly three elements: one plain sealed envelope floating on the left, one tiny completely blank rectangular card floating just behind it on the right, and the character using a small paper clip to attach the extra card after the envelope. No pen and no open paper. Everything floats inside empty flat green. No writing lines, handwriting, alphabetic shapes, words, glyphs, patterns, pseudo-text, ground, floor, shadow, scenery, or texture.'},
  {id: '08_scribble_tangle', filename: '08_scribble_tangle.png', purpose: 'scribble 潦草乱写', subject: 'The character struggles to control one runaway oversized pen that pulls a loose tangled orange ink cord through the air. The tangle is abstract with no letters, symbols, arrows, or pseudo-writing. Show both feet, both hands, full pen, and full cord.'},
] as const;

export const scriptScribIllustrationPrompts: readonly ReplicaIllustrationPrompt[] = shots.map(
  (shot) => ({...shot, prompt: `${BASE} ${shot.subject}`} as ReplicaIllustrationPrompt),
);
