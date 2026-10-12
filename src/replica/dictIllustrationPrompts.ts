import type {ReplicaIllustrationPrompt} from './projectTypes';

export const DICT_REPLICA_NEGATIVE_PROMPT = [
  'text', 'letters', 'numbers', 'caption', 'label', 'logo', 'watermark', 'signature',
  'arrow', 'diagram', 'infographic', 'PPT slide', 'ground line', 'floor', 'room',
  'horizon', 'shadow', 'reflection', 'frame', 'border', 'white panel', 'texture',
  'gradient', 'scenery', 'green subject', 'cute mascot', 'children illustration',
  'commercial cartoon', 'stock vector', 'glossy 3D', 'photorealistic', 'cropped body',
].join(', ');

const BASE = [
  'Create one 2K 16:9 horizontal isolated cutout source image.',
  'Use sparse slightly wobbly black hand-drawn pen lines with restrained orange, red, or pale-blue accents.',
  'Include exactly one irregular solid-black deadpan character with two tiny white dot eyes, no mouth, and thin stick arms and legs. The character must perform the core speaking action.',
  'The entire background is exactly one flat chroma green #00FF00 plate edge to edge.',
  'Keep the complete subject inside the middle 65% and leave a continuous empty flat-green band around all four outer edges.',
  'No ground, shadow, scenery, frame, writing, letters, numbers, logos, signatures, arrows, diagrams, or green foreground details.',
  'Serious absurd product-sketch cutout, never cute, commercial, glossy, three-dimensional, or photorealistic.',
].join(' ');

const shots = [
  {id: '00_say_hook', filename: '00_say_hook.png', purpose: '把 dict 固定成说出口的话', subject: 'The character operates one oversized simple speaking horn. Three blank orange speech puffs leave the horn and are pressed by one completely plain solid-black stamp into three completely blank white tiles. No seal face, emblem, pseudo-writing, marks, glyphs, or decorative lines anywhere. Show the full character, horn, puffs, stamp, and tiles floating in isolation.'},
  {id: '01_predict_before', filename: '01_predict_before.png', purpose: 'predict 在事情前面先说', subject: 'The character leans ahead of one floating closed curtain and speaks one orange blank speech puff toward a tiny pale-blue cloud and sun symbol behind the curtain. The character is clearly speaking before the event appears.'},
  {id: '02_contradict_opposite', filename: '02_contradict_opposite.png', purpose: 'contradict 朝相反方向说', subject: 'The character braces both feet and speaks one orange blank speech puff directly against one incoming red blank speech puff. The two puffs meet nose-to-nose at the center with a tiny black impact spark.'},
  {id: '03_verdict_truth', filename: '03_verdict_truth.png', purpose: 'verdict 正式说出裁决', subject: 'The character seriously raises one plain wooden gavel and stamps one floating blank white decision tile. A single orange speech puff becomes a firm red circular mark with no symbol or writing. Everything floats in isolation: absolutely no floor line, ground scribble, shadow, platform, desk, scenery, or baseline.'},
  {id: '04_dictate_command', filename: '04_dictate_command.png', purpose: 'dictate 说给别人照做', subject: 'The character speaks through a small horn while turning one crank that makes a plain white mechanical hand place three blank tiles in a row. The speaking action visibly controls the mechanism.'},
  {id: '05_dictionary_book', filename: '05_dictionary_book.png', purpose: 'dictionary 收纳词语说法', subject: 'The character catches several blank orange speech puffs with a net and carefully files them into one large open black-outline book. No marks or writing appear on the pages.'},
  {id: '06_diction_word_choice', filename: '06_diction_word_choice.png', purpose: 'diction 是说话用词方式', subject: 'The character uses small tongs to choose one clean orange speech pebble from three differently shaped blank speech pebbles, then places it into a simple speaking horn. Everything floats in isolation with large clean green padding. Absolutely no floor, horizon, baseline, stray edge strokes, shadow, cable, panel, or scenery.'},
  {id: '07_dictation_write', filename: '07_dictation_write.png', purpose: 'dictation 听到后写下来', subject: 'The character listens to one orange blank speech puff through a horn and simultaneously traces it with a pen onto one floating blank white sheet. Show the full horn, hand, pen, paper, and both feet. Everything floats in isolation: absolutely no writing, floor, ground ellipse, shadow, desk, room, horizon, or baseline.'},
  {id: '08_indict_charge', filename: '08_indict_charge.png', purpose: 'indict 正式说出指控', subject: 'The character pushes one serious orange speech puff into a plain black-outline courthouse file box while a small red alert spark appears above the box. No scales, badges, letters, law text, or second person.'},
] as const;

export const dictReplicaIllustrationPrompts: readonly ReplicaIllustrationPrompt[] = shots.map(
  (shot) => ({...shot, prompt: `${BASE} ${shot.subject}`} as ReplicaIllustrationPrompt),
);
