import type {ReplicaIllustrationPrompt} from './projectTypes';

export const MIT_MISS_NEGATIVE_PROMPT=[
  'text','letters','numbers','caption','label','logo','watermark','signature','arrow','diagram',
  'infographic','PPT slide','ground line','floor','room','horizon','shadow','reflection effect',
  'frame','border','white panel','texture','gradient','scenery','handwriting','scribble','equation',
  'large rectangle','window','wall','green subject','cute mascot','children illustration',
  'commercial cartoon','stock vector','glossy 3D','photorealistic','cropped body','postal logo',
  'currency symbol','dollar sign','ticket text','floor baseline',
].join(', ');

const BASE=[
  'Create one 2K 16:9 horizontal isolated cutout source image.',
  'Use sparse slightly wobbly black hand-drawn pen lines with restrained orange, red, or pale-blue accents.',
  'Include exactly one irregular solid-black deadpan Xiaohei-like character with two tiny white dot eyes, no mouth, thin complete stick arms and legs.',
  'The black character must actively perform the central sending, routing, admission, release, or dispatch action; never stand as decoration.',
  'The entire background is exactly one flat chroma green #00FF00 plate edge to edge.',
  'Keep the complete subject inside the middle 62% and leave a continuous empty flat-green band around all four outer edges.',
  'No ground, shadow, scenery, room, frame, writing, letters, numbers, pseudo-text, logos, signatures, arrows, diagrams, or green foreground details.',
  'Serious absurd product-sketch cutout, never cute, commercial, glossy, three-dimensional, or photorealistic.',
].join(' ');

const shots=[
  {id:'00_send_hook',filename:'00_send_hook.png',purpose:'发送胶囊进入未知路线',subject:'The character pulls a plain lever on a small rotary dispatch drum while one bright orange capsule is being sucked into an open circular slot. The destination is deliberately unknown. One isolated mechanism only.'},
  {id:'01_submit_send_up',filename:'01_submit_send_up.png',purpose:'submit 向上递交',subject:'The character turns a hand crank on a compact scissor lift that raises one plain orange envelope toward a high narrow receiving slot. The character is doing the lifting and submitting.'},
  {id:'02_transmit_send_across',filename:'02_transmit_send_across.png',purpose:'transmit 横跨传送',subject:'The character braces between two simple relay coils separated by a gap, connecting them with one taut orange cable while a small pulse is ready to cross. No text or symbols.'},
  {id:'03_emit_send_out',filename:'03_emit_send_out.png',purpose:'emit 向外发出',subject:'The character compresses a small black hand bellows into a plain round orange lamp; several short orange rays are beginning to emerge outward. Keep all rays compact and inside the safe middle area.'},
  {id:'04_admit_send_in',filename:'04_admit_send_in.png',purpose:'admit 允许进入',subject:'A tiny floating three-arm turnstile hub with no posts or building. The character pushes one completely blank solid-orange oval token toward the hub and is halfway through the rotating arms. Use only the character, token, central hub, and three short arms. Absolutely no rectangular gate, kiosk, panel, wall, fence, screen, machine housing, writing, floor, or scenery.'},
  {id:'05_permit_send_through',filename:'05_permit_send_through.png',purpose:'permit 放行通过',subject:'A tiny floating barrier mechanism made of one short post, one horizontal arm, and one exposed spring. The character inserts one completely blank solid-orange oval token with no marks into the spring latch, making the arm tilt upward. Keep the mechanism compact and lower than the character. Absolutely no door, rectangular panel, cabinet, wall, frame, base platform, floor, currency symbol, writing, or scenery.'},
  {id:'06_commit_send_over',filename:'06_commit_send_over.png',purpose:'commit 正式交付投入',subject:'One small floating one-way ratchet device only. The character uses both hands to push one plain orange capsule into the toothed opening; two small teeth close behind it so it cannot be pulled back. Keep the device smaller than the character. No giant box, key shape, lock, logo, ground line, floor, base, wall, writing, or scenery.'},
  {id:'07_dismiss_send_away',filename:'07_dismiss_send_away.png',purpose:'dismiss 送走解散',subject:'The character presses a large spring ejector that launches one plain orange folder away from a small central tray. The character performs the dismissal action; no papers contain writing.'},
  {id:'08_mission_sent_task',filename:'08_mission_sent_task.png',purpose:'mission 被派出的任务',subject:'The character straps one orange capsule onto a tiny angled launch cradle and holds the release handle, ready to send it toward a distant simple circular target. No rocket flames, flags, writing, stars, or scenery.'},
] as const;

export const mitMissIllustrationPrompts:readonly ReplicaIllustrationPrompt[]=shots.map(
  shot=>({...shot,prompt:`${BASE} ${shot.subject}`} as ReplicaIllustrationPrompt),
);
