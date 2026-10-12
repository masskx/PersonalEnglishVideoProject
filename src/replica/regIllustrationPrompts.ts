import type {ReplicaIllustrationPrompt} from './projectTypes';

export const REG_REPLICA_IMAGE_SPEC = {
  aspectRatio: '16:9',
  arkSize: '2K',
  visualWidth: 2560,
  visualHeight: 1440,
  chromaKey: '#00FF00',
  greenSourceDir: 'assets/green-screen/reg',
  alphaOutputDir: 'public/assets/replica/reg',
} as const;

const BASE_PROMPT = [
  'Create one 2K 16:9 horizontal isolated cutout source image.',
  'Use sparse slightly wobbly dark hand-drawn pen lines with restrained flat orange and blue accents.',
  'Include one irregular solid-ink bean character with two tiny white dot eyes and thin stick limbs. The character performs the main action.',
  'The background is one flat chroma green #00FF00 color edge to edge. Keep every subject complete inside the middle 65% with wide green padding.',
  'No ground line, floor, shadow, scenery, frame, white panel, writing, logo, signature, or extra decoration. No foreground detail is green.',
].join(' ');

const RULER_TEST_PROMPT = [
  'Create one 2K 16:9 horizontal isolated cutout source image.',
  'One isolated solid-black irregular bean-shaped deadpan worker character with exactly two tiny solid-white dot eyes, no pupils and no mouth, and thin stick arms and legs, holding one long plain ruler horizontally with simple unnumbered tick marks.',
  'Minimal slightly wobbly black hand-drawn line art with a restrained white ruler fill.',
  'Entire background exactly flat chroma green #00FF00 edge to edge.',
  'No ground, floor, ground line, platform, pedestal, contact shadow, cast shadow, reflection, frame, border, inner panel, text, letters, numbers, decorative marks, arrows, logos, signatures, or extra objects. From the feet downward to the bottom edge, every pixel outside the thin black legs and feet is the same flat chroma green.',
  'Subject centered, occupying 40% to 55% of the canvas, fully visible with generous uninterrupted green padding on all sides.',
].join(' ');

const QUEUE_TEST_PROMPT = [
  'Create one 2K 16:9 horizontal isolated cutout source image.',
  'One dark-ink irregular bean-shaped deadpan character with two tiny white dot eyes and thin stick limbs holds a plain ruler beside four simple outline stick figures walking in a neat single-file line, checking equal spacing between them.',
  'Minimal slightly wobbly black pen drawing; all five complete figures and every foot are fully visible and float above the background.',
  'Entire background exactly flat chroma green #00FF00 edge to edge, with wide uninterrupted green padding on every side.',
  'No ground, baseline, platform, shadow, sign, text, letters, numbers, symbols, frame, border, scenery, or extra figures.',
].join(' ');

const THUMBS_TEST_PROMPT = [
  'Create one 2K 16:9 horizontal isolated cutout source image.',
  'One isolated solid-black irregular bean-shaped figure with exactly two tiny white dot eyes and thin black stick arms and legs calmly raises one arm in a clear thumbs-up gesture.',
  'The entire body is flat solid black, never orange, brown, blue, outlined, glossy, shaded, or textured. Only two tiny orange motion strokes may sit beside the raised thumb.',
  'Minimal slightly wobbly hand-drawn black pen style. The complete figure and every foot are centered inside the middle 45% of the canvas.',
  'The entire background is exactly flat chroma green #00FF00 edge to edge with wide uninterrupted green padding on all four sides.',
  'No outer frame, border, inner panel, paper edge, ground, baseline, floor, shadow, reflection, text, letters, numbers, logo, signature, extra object, or extra person.',
].join(' ');

const STRICT_ACTION_PROMPT = [
  'Create one 2K 16:9 horizontal isolated cutout source image.',
  'The acting character is one irregular bean-shaped silhouette filled uniformly solid pure black, with exactly two tiny white dot eyes and very thin black stick limbs.',
  'The black body has no colored fill, highlight, outline-only treatment, gradient, shading, gloss, or texture. Other people, vehicles, and props use sparse slightly wobbly black pen outlines with restrained flat orange or blue details.',
  'The entire background is exactly one flat chroma green #00FF00 plate edge to edge. Keep every object complete inside the middle 65% of the canvas.',
  'Leave a continuous empty flat-green band at least 15% of canvas size along all four outer edges. No foreground line or mark enters this outer band.',
  'No ground, baseline, floor, road, contact shadow, cast shadow, reflection, horizon, room, scenery, frame, border, inner panel, paper edge, text, letters, numbers, logo, badge, watermark, or signature.',
].join(' ');

const CAR_TEST_PROMPT = [
  'Create one 2K 16:9 horizontal isolated cutout source image.',
  'Draw one deliberately crude flat vehicle icon: a pale-blue rounded rectangular body, one simple trapezoid cabin, exactly two plain circle wheels, one blank windshield, and one tiny steering wheel. One irregular driver character sits visibly behind the steering wheel.',
  'The driver body and head are one uniform flat solid pure-black silhouette with exactly two tiny white dot eyes and thin black arms. The driver is never brown, tan, orange, blue, shaded, glossy, textured, or human-skinned.',
  'Use fewer than twenty sparse slightly wobbly black pen strokes, one flat pale-blue fill, and two tiny orange accents. This is a primitive doodle icon, not a realistic automobile. No hood ornament, grille, brand badge, emblem, logo, license plate, photographic detail, metallic shading, reflections, interior detail, or third wheel.',
  'The entire background is exactly flat chroma green #00FF00 edge to edge. Keep every bumper and wheel inside the middle 55% with a continuous 18% empty green band on all four edges.',
  'No road, ground, baseline, shadow, reflection, scenery, frame, border, panel, paper edge, writing, signature, or extra object.',
].join(' ');

export const REG_REPLICA_NEGATIVE_PROMPT = [
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
  'car badge',
  'license plate text',
  'watermark',
  'signature',
  'handwritten annotation',
  'annotation legend',
  'legend key',
  'artist mark',
  'ground line',
  'baseline',
  'symbol',
  'warning icon',
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
    id: '00_ruler',
    filename: '00_ruler.png',
    purpose: 'ruler 直尺与“直”这一原始方向感的开场记忆点',
    subject:
      'STRICT ISOLATED CUTOUT: show only one Xiaohei and one plain straight ruler, using only black and white foreground colors. Xiaohei is a solid-black deadpan figure with exactly two tiny solid-white dot eyes, no pupils, no irises, no eye outlines, no mouth, thin arms, and thin legs. It seriously holds the ruler level as if checking whether the world is truly straight. Use sparse black wobbly contours and plain ruler tick marks without numerals. Center the complete pair within the middle 55% of the canvas, limit the ruler to 50% of canvas width, and leave at least 20% uninterrupted flat-green padding on every edge. Present the pair as a floating isolated icon; from below the feet to the image edge there is nothing except uninterrupted flat green. ZERO text, ZERO labels, ZERO legend, ZERO arrows, ZERO symbols, ZERO annotation marks, ZERO colored marks, ZERO ground line, ZERO platform, ZERO shadow, ZERO glow, ZERO reflection, ZERO extra objects or people; the ruler action alone must make straightness and measuring direction immediately readable.',
  },
  {
    id: '01_rules_queue',
    filename: '01_rules_queue.png',
    purpose: '规则与管理让人群沿同一方向有序行动',
    subject:
      'The solid-ink bean figure uses a thin plain ruler to organize the spacing of four sparse outline figures walking in one orderly single-file queue. All five full bodies and every foot float cleanly above uninterrupted green with no baseline. Everyone faces one direction with visible spacing. No signboard and no extra marks.',
  },
  {
    id: '02_thumbs_up',
    filename: '02_thumbs_up.png',
    purpose: '从直尺过渡到 ruler 统治者、管理者含义的克制确认图标',
    subject:
      'The solid-ink bean figure calmly raises one thin arm in a clear thumbs-up gesture. Show the complete single figure as a floating isolated icon, with two tiny orange emphasis strokes and wide uninterrupted green around the feet and gesture.',
  },
  {
    id: '03_traffic_regulation',
    filename: '03_traffic_regulation.png',
    purpose: 'regulate 调节、管理交通并恢复秩序',
    subject:
      'The solid-ink bean figure guides two small compact toy-sized side-view car icons, one on each side, with one raised hand and one short orange motion stroke. Both entire cars, including front bumper, rear bumper, roof, and all wheels, fit inside the central 55% of the canvas and appear much smaller than the character. Every tire floats above green; no road, signs, lane marks, city, or extra person.',
  },
  {
    id: '04_regent_court',
    filename: '04_regent_court.png',
    purpose: 'regent 代君主行使统治权的摄政者',
    subject:
      'The solid-ink bean character stands beside one empty ornate chair, holds a completely blank rolled paper, and gestures toward the chair while two distant outline assistants wait. Use one restrained red emphasis mark and no architecture or scenery.',
  },
  {
    id: '05_governance_ring',
    filename: '05_governance_ring.png',
    purpose: 'regime 作为一整套政权、政体和治理系统',
    subject:
      'The solid-ink bean character turns one plain central hand wheel with both thin arms while five sparse outline figures move together around it. Use a few orange motion marks and one blue state mark, without formal connectors or writing. The group reads as one coordinated system.',
  },
  {
    id: '06_region_map',
    filename: '06_region_map.png',
    purpose: 'region 被边界划分和管理的一块区域',
    subject:
      'The solid-ink bean character uses one thin orange pencil to trace the edge of one single small irregular land-shape outline, then plants one tiny completely blank flag inside it. Show only the character, one land shape, one pencil, and one flag. The land shape has a restrained pale-blue flat fill. No other maps, inset panels, vehicles, people, labels, symbols, frame, or shadow.',
  },
  {
    id: '07_royal_court',
    filename: '07_royal_court.png',
    purpose: 'regal 与 royal 的帝王、王室和庄严感',
    subject:
      'The solid-ink bean character stands in a rigid formal posture, holding a simple crown and a short ceremonial staff beside one sparse outline partner. Use restrained deep-blue and orange accents; keep the pair dignified without elaborate clothing, architecture, or scenery.',
  },
  {
    id: '08_buick_regal',
    filename: '08_buick_regal.png',
    purpose: 'Buick Regal 别克君威的实车名称联想',
    subject:
      'The solid-ink bean character is visibly seated behind the steering wheel of one small complete hand-drawn toy sedan in a simple three-quarter view. Build the car from sparse slightly wobbly black pen contours with one flat pale-blue body fill and two tiny orange accents. Use no realistic rendering, photographic detail, metallic shading, grille pattern, badge shape, logo, license text, road, shadow, or scenery. Keep the entire car inside the central 55% and leave wide green around every bumper and wheel.',
  },
] as const;

export const regReplicaIllustrationPrompts: readonly ReplicaIllustrationPrompt[] =
  shotSpecs.map((shot) => ({
    ...shot,
    prompt:
      shot.id === '00_ruler'
        ? RULER_TEST_PROMPT
        : shot.id === '01_rules_queue'
          ? QUEUE_TEST_PROMPT
          : shot.id === '02_thumbs_up'
            ? THUMBS_TEST_PROMPT
          : shot.id === '08_buick_regal'
            ? CAR_TEST_PROMPT
        : `${STRICT_ACTION_PROMPT} Main action: ${shot.subject}`,
  }));
