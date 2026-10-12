import type {ReplicaIllustrationPrompt} from './projectTypes';

export const FER_REPLICA_IMAGE_SPEC = {
  aspectRatio: '16:9',
  arkSize: '2K',
  visualWidth: 2560,
  visualHeight: 1440,
  chromaKey: '#00FF00',
  greenSourceDir: 'assets/green-screen/fer',
  alphaOutputDir: 'public/assets/replica/fer',
} as const;

const BASE_PROMPT = [
  'Create one 2K 16:9 horizontal isolated cutout source image.',
  'The acting character is one irregular bean-shaped silhouette filled uniformly solid pure black, with exactly two tiny white dot eyes and very thin black stick limbs. The body has no colored fill, gradient, shading, gloss, or texture.',
  'Use sparse slightly wobbly black pen outlines for all other people and props, with restrained flat orange and blue accents.',
  'The entire background is exactly one flat chroma green #00FF00 plate edge to edge. Keep every complete object inside the middle 65% of the canvas.',
  'Leave a continuous empty flat-green band at least 15% of canvas size along all four outer edges. No foreground mark enters this band.',
  'No ground, floor, road, water surface, shadow, reflection, horizon, room, scenery, frame, border, inner panel, or paper edge.',
  'All papers, screens, signs, tickets, books, documents, plaques, speech balloons, and cards are completely blank. No words, letters, numbers, labels, logos, watermarks, signatures, UI, or formal diagram.',
].join(' ');

const FERRY_TEST_PROMPT = [
  'Create one 2K 16:9 horizontal isolated cutout source image.',
  'One small passenger ferry floats in the center between exactly two short complete wooden docks, one at far left and one at far right. Both docks are entirely visible and separated from the ferry.',
  'One irregular driver character stands at the ferry wheel. Its body and head are a uniform flat solid pure-black silhouette with exactly two tiny white dot eyes and thin black limbs. Three other passengers are sparse outline figures.',
  'Use slightly wobbly black pen contours, restrained flat orange on the hull, and only two short pale-blue wave strokes. No mast cross, flag, sign, roof emblem, text, number, logo, or extra dock.',
  'The entire background is exactly flat chroma green #00FF00 edge to edge. Keep the complete two docks, ferry, and every passenger inside the middle 65%, with a continuous 15% empty green band on all four edges.',
  'No water surface, horizon, ground, floor, shadow, reflection, scenery, frame, border, panel, paper edge, signature, or extra object.',
].join(' ');

export const FER_REPLICA_NEGATIVE_PROMPT = [
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
  'brand mark',
  'watermark',
  'signature',
  'large formal arrows',
  'dense connector arrows',
  'green subject',
  'green clothing',
  'green object',
  'green edge',
  'green tint',
  'green-screen frame',
  'chroma studio',
  'scenery',
  'landscape',
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
  'formal flowchart',
  'mascot',
  'cute mascot',
  'kawaii',
  'chibi',
  'children\'s illustration',
  'childish cartoon',
  'commercial cartoon',
  'stock illustration',
  'stock vector',
  'commercial vector',
  'photorealistic',
  'glossy 3D',
  '3D render',
  'white backdrop plate',
  'white background',
  'off-white background',
  'cream background',
  'inner white panel',
  'white paper panel',
].join(', ');

const shotSpecs = [
  {
    id: '00_ferry_docks',
    filename: '00_ferry_docks.png',
    purpose: '开场记忆钩子：渡船把乘客从一个码头带到另一个码头',
    subject:
      'The solid-black bean character seriously steers a small passenger ferry by a thin rope from one sparse wooden dock to another, visibly carrying three simple outline passengers across. Keep only two short pale-blue wave strokes under the hull, no horizon or scenery, and make the crossing action the semantic center.',
  },
  {
    id: '01_carry_figure',
    filename: '01_carry_figure.png',
    purpose: '词根核心动作：人物把箱子携带到另一处',
    subject:
      'The solid-black bean character walks purposefully while carrying one medium plain cardboard box in both thin arms. Its serious pose clearly communicates taking an object from one place to another; the box is closed and completely blank, with one short orange motion mark.',
  },
  {
    id: '02_transfer_data_money',
    filename: '02_transfer_data_money.png',
    purpose: 'transfer 的对象迁移：文件与资金被转移',
    subject:
      'The solid-black bean character performs both sides of transfer in one sparse scene: it pulls a blank document from one simple laptop and feeds it into another while a small plain coin stack follows the same hand-to-hand route. Use two separated endpoints and a few orange path strokes, not a formal diagram; all screens, papers, and coins remain blank and unmarked.',
  },
  {
    id: '03_station_transfer',
    filename: '03_station_transfer.png',
    purpose: 'transfer 的交通换乘义：从火车换到飞机',
    subject:
      'The solid-black bean traveler with a small suitcase physically steps from one compact side-view train icon toward one compact airplane icon, looking back while moving forward. Keep both complete vehicles small, generic, hand-drawn, and logo-free, with one orange transfer stroke and no signs, destination boards, letters, or numbers.',
  },
  {
    id: '04_offer_gift_proposal',
    filename: '04_offer_gift_proposal.png',
    purpose: 'offer 的给予与提出：把礼物或方案带到对方面前',
    subject:
      'The solid-black bean character extends a small wrapped gift and a separate completely blank proposal sheet toward one sparse outline person, who receives both with open hands. The black character performs the offering action; the gift has one simple ribbon and no tag, writing, or smiley decoration.',
  },
  {
    id: '05_job_university_offers',
    filename: '05_job_university_offers.png',
    purpose: 'job offer 与 university offer 两类正式录取场景',
    subject:
      'The solid-black bean character stands between two sparse endpoint silhouettes, one neutral office building and one university building, and catches two floating blank acceptance letters. Use simple envelopes and one orange-to-blue hand-drawn route mark, with no crests, signs, symbols, words, or letters.',
  },
  {
    id: '06_ab_choice',
    filename: '06_ab_choice.png',
    purpose: 'prefer 的偏好选择：在两个选项中把一个放在前面',
    subject:
      'The solid-black bean character compares a warm cup and a cold drink, then physically pushes the warm cup a little forward while leaning toward it. Keep both cups floating without pedestals, use one restrained orange preference stroke, and include no letters, labels, checkmarks, or dense arrows.',
  },
  {
    id: '07_childhood_memory',
    filename: '07_childhood_memory.png',
    purpose: 'refer to a childhood memory：把话题带回童年',
    subject:
      'The solid-black bean character pulls a small completely blank childhood photo card from one sparse pale-blue memory cloud and holds it against the chest. Inside the cloud, use only a tiny outline child flying a plain kite; no speech balloon, dates, letters, or photo border markings.',
  },
  {
    id: '08_book_reference',
    filename: '08_book_reference.png',
    purpose: 'refer to a source：把读者带回书本或资料来源',
    subject:
      'The solid-black bean character opens one large completely blank reference book and pulls one loose blank document back toward it. Include one orange bookmark ribbon and a short blue recall mark; every page contains no marks, writing, numbers, or diagrams.',
  },
  {
    id: '09_delayed_task',
    filename: '09_delayed_task.png',
    purpose: 'defer 的推迟义：把待办任务向后挪',
    subject:
      'The solid-black bean character uses both hands to slide one pale-blue blank task card behind a short upright row of three pale-blue blank cards. Give all four cards thick wobbly black outlines so they survive chroma-key extraction. Show only the character and four cards, with one small orange backward motion stroke. No white card fill, calendar, grid, date, checkmark, symbol, stack of paper, baseline, or floor.',
  },
  {
    id: '10_deference_leader',
    filename: '10_deference_leader.png',
    purpose: 'defer to 的尊重采纳：把判断交给更有经验的人',
    subject:
      'The solid-black bean character steps back, bends forward slightly, and hands a completely blank decision sheet upward to one taller calm outline expert. The expert accepts the sheet and operates one simple unmarked decision lever. Keep hierarchy readable through pose and height only; no words, labels, speech balloons, logos, room, floor, step, or extra people.',
  },
  {
    id: '11_roundtable_conference',
    filename: '11_roundtable_conference.png',
    purpose: 'confer 的商议义：把多方观点带到一起',
    subject:
      'The solid-black bean character sits at a small round table and physically gathers several completely blank note cards into one center pile while three sparse outline people lean inward. Use hand gestures and a few blue secondary marks; no speech balloons, writing, screens, floor, or room scenery.',
  },
  {
    id: '12_degree_conferral',
    filename: '12_degree_conferral.png',
    purpose: 'confer 的授予义：正式授予学位或权力',
    subject:
      'The solid-black bean character presents a rolled completely blank diploma tied with an orange ribbon to one sparse outline graduate in a simple dark-blue cap and gown. The black character performs the handover; diploma, clothing, and cap contain no letters, seals, crests, logos, or symbols.',
  },
] as const;

export const ferReplicaIllustrationPrompts: readonly ReplicaIllustrationPrompt[] = shotSpecs.map(
  (shot) => ({
    ...shot,
    prompt:
      shot.id === '00_ferry_docks'
        ? FERRY_TEST_PROMPT
        : `${BASE_PROMPT} Main action: ${shot.subject}`,
  }),
);
