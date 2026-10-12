import type {ReplicaIllustrationPrompt} from './projectTypes';

const anchor =
  'Use the accepted solid-black Xiaohei identity, white dot eyes, thin complete limbs, calm blank expression, stable proportions, and wobbly hand-drawn black line quality from the provided reference image. Keep one Xiaohei as the primary semantic actor.';

const common =
  'Pure transparent background, clean when composited on white, restrained orange and pale-blue local props, no words, letters, labels, numbers, logos, watermarks, signatures, arrows, shadows, gradients, scenery, frames, panels, extra characters, or extra limbs. Keep the camera and subject scale stable. Make the local prop subordinate to Xiaohei.';

const specs = [
  ['compose-before', 'compose：分开的材料还没有放在一起', 'Xiaohei stands beside three separate blank geometric pieces and an empty orange tray, with both hands ready to place the pieces together.'],
  ['compose-change', 'compose：把材料放到一起', 'Xiaohei is placing the second of three separate blank geometric pieces into the orange tray while one piece remains beside the tray.'],
  ['compose-result', 'compose：多个部分组成一个整体', 'Xiaohei calmly holds the completed tidy stack of three blank pieces inside the orange tray.'],
  ['expose-before', 'expose：隐藏的东西还被盖住', 'Xiaohei stands beside a small orange cover resting over a pale-blue blank card, with the card still hidden.'],
  ['expose-change', 'expose：把盖子向外掀开', 'Xiaohei lifts the small orange cover away from the pale-blue blank card; the card is partly visible.'],
  ['expose-result', 'expose：把原来隐藏的东西展示出来', 'Xiaohei holds the orange cover aside while the pale-blue blank card is fully visible and clearly exposed.'],
  ['impose-before', 'impose：规则还没有压到对象上', 'Xiaohei stands beside a small orange rule tablet held above a pale-blue blank block, not touching it yet.'],
  ['impose-change', 'impose：把规则压到对象上', 'Xiaohei lowers the orange rule tablet onto the pale-blue block with both hands, showing a clear placing-on action.'],
  ['impose-result', 'impose：把规则或负担强加上去', 'The orange rule tablet rests firmly on the pale-blue block while Xiaohei holds it down with a serious posture.'],
  ['propose-before', 'propose：想法还在手里', 'Xiaohei holds one blank orange idea card beside a small pale-blue empty stand, preparing to present it.'],
  ['propose-change', 'propose：把想法放到别人面前', 'Xiaohei extends the blank orange idea card forward toward the pale-blue stand, offering it for consideration.'],
  ['propose-result', 'propose：把计划提出供人考虑', 'The blank orange idea card now rests on the stand in front of Xiaohei, clearly presented for consideration.'],
  ['oppose-before', 'oppose：双方还没有形成对立', 'Xiaohei stands on one side of a low pale-blue line while a small orange block sits on the other side, with space between them.'],
  ['oppose-change', 'oppose：把自己放到对面', 'Xiaohei plants both feet against the pale-blue line and braces both hands toward the orange block on the opposite side.'],
  ['oppose-result', 'oppose：把力量放在对立面', 'Xiaohei remains firmly behind the pale-blue line, holding the orange block back from the other side with a clear opposing stance.'],
  ['dispose-before', 'dispose：物件还混在手边', 'Xiaohei faces three blank orange and pale-blue scraps gathered in one small open tray, not yet sorted.'],
  ['dispose-change', 'dispose：把物件分开放置', 'Xiaohei moves one blank scrap away from the tray toward a second empty tray, separating the items.'],
  ['dispose-result', 'dispose：整理或处理掉东西', 'The scraps are now separated into two tidy trays while Xiaohei calmly closes the first tray.'],
  ['deposit-before', 'deposit：钱还在手里', 'Xiaohei holds one blank orange token above a small pale-blue slot box, ready to put it down.'],
  ['deposit-change', 'deposit：把东西放下去', 'Xiaohei lowers the blank orange token into the pale-blue slot box, halfway through the downward placement.'],
  ['deposit-result', 'deposit：把钱存入账户或把东西放下', 'The blank orange token rests inside the pale-blue slot box while Xiaohei stands beside it with empty hands.'],
] as const;

export const PON_POS_NEGATIVE_PROMPT = [
  'text, letters, numbers, pseudo-text, labels, logos, signatures, watermarks, extra characters, extra limbs, changed eyes, ring eyes, mouth, clothing, cute mascot, commercial cartoon, children illustration, 3D, photorealistic, scenery, shadow, gradient, paper texture, border, inset frame, green, teal, lime, giant geometric overlay, duplicated figure',
].join(', ');

export const ponPosIllustrationPrompts: readonly ReplicaIllustrationPrompt[] = specs.map(
  ([id, purpose, subject]) => ({
    id,
    filename: `${id}.png`,
    purpose,
    subject,
    prompt: `${anchor} ${common} Create one isolated 16:9 raster pose for a word-root teaching video. ${subject} Keep all objects local and hand-drawn, with at least 35% quiet white space and no baked text.`,
  }),
);

