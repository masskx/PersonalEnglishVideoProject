import type {ReplicaLayer, ReplicaTableRow, ReplicaStoryboard} from './types';
import {narrationToCaptions} from './captionUtils';

export const BOUBA_KIKI_REPLICA_ASSETS = {
  boubaRound: 'assets/replica/bouba-kiki/00_bouba_round.png',
  kikiSpiky: 'assets/replica/bouba-kiki/01_kiki_spiky.png',
  thinkingFigure: 'assets/replica/bouba-kiki/02_thinking_figure.png',
  experimentClassroom: 'assets/replica/bouba-kiki/03_experiment_classroom.png',
  speakingFeelingPair: 'assets/replica/bouba-kiki/04_speaking_feeling_pair.png',
  historicalSpeakers: 'assets/replica/bouba-kiki/05_historical_speakers.png',
  crackedGlass: 'assets/replica/bouba-kiki/06_cracked_glass.png',
  waterSplash: 'assets/replica/bouba-kiki/07_water_splash.png',
  noseSneezeFigure: 'assets/replica/bouba-kiki/08_nose_sneeze_figure.png',
  slidingSkater: 'assets/replica/bouba-kiki/09_sliding_skater.png',
  diamondLight: 'assets/replica/bouba-kiki/10_diamond_light.png',
  modernSpeakers: 'assets/replica/bouba-kiki/11_modern_speakers.png',
} as const;

export const boubaKikiReplicaContent = {
  style: {
    background: '#FFFFFF',
    fontFamily: 'Microsoft YaHei',
    primary: '#041FA0',
    accent: '#E85810',
  },
  premise: {
    title: 'Sound Symbolism',
    chineseTitle: '语音象征',
    question: '圆润的形状，为什么更像 Bouba？尖锐的形状，为什么更像 Kiki？',
  },
  familyOrder: ['cr-', 'sp-', 'sn-', 'sl-', 'gl-'],
  summaryOrder: ['cr-', 'sp-', 'sn-', 'sl-', 'gl-'],
} as const;

const CR_ROWS: ReplicaTableRow[] = [
  {word: 'crack', phonetic: '/kræk/', part: 'v./n.', meaning: '裂开；破裂；裂缝', accent: 'cr'},
  {word: 'crash', phonetic: '/kræʃ/', part: 'v./n.', meaning: '猛撞；撞毁；巨响', accent: 'cr'},
  {word: 'crush', phonetic: '/krʌʃ/', part: 'v.', meaning: '压碎；挤碎', accent: 'cr'},
  {word: 'crumble', phonetic: '/ˈkrʌmbəl/', part: 'v.', meaning: '碎裂；崩裂；坍塌', accent: 'cr'},
  {word: 'crumple', phonetic: '/ˈkrʌmpəl/', part: 'v./n.', meaning: '压皱；揉皱', accent: 'cr'},
  {word: 'crackle', phonetic: '/ˈkrækəl/', part: 'v./n.', meaning: '发噼啪声；噼啪声', accent: 'cr'},
];

const SP_FIRST_ROWS: ReplicaTableRow[] = [
  {word: 'spring', phonetic: '/sprɪŋ/', part: 'v/n.', meaning: '弹起；涌出；弹簧；温泉；春天', accent: 'sp'},
  {word: 'spark', phonetic: '/spɑːrk/', part: 'v/n.', meaning: '火花；火星；引发；点燃', accent: 'sp'},
  {word: 'splash', phonetic: '/splæʃ/', part: 'v/n.', meaning: '飞溅；落水声', accent: 'sp'},
  {word: 'spit', phonetic: '/spɪt/', part: 'v/n.', meaning: '吐；唾液', accent: 'sp'},
  {word: 'spill', phonetic: '/spɪl/', part: 'v/n.', meaning: '洒出；溢出；洒落；涌出', accent: 'sp'},
];

const SP_SECOND_ROWS: ReplicaTableRow[] = [
  {word: 'spurt', phonetic: '/spɜːt/', part: 'v./n.', meaning: '喷射；喷出；涌出的液体', accent: 'sp'},
  {word: 'spew', phonetic: '/spjuː/', part: 'v.', meaning: '喷涌；呕吐', accent: 'sp'},
  {word: 'spread', phonetic: '/spred/', part: 'v./n.', meaning: '展开；传播；扩散；蔓延', accent: 'sp'},
  {word: 'spray', phonetic: '/spreɪ/', part: 'v./n.', meaning: '喷洒；喷雾', accent: 'sp'},
  {word: 'sprinkle', phonetic: '/ˈsprɪŋkəl/', part: 'v./n.', meaning: '撒；洒', accent: 'sp'},
  {word: 'sprout', phonetic: '/spraʊt/', part: 'v./n.', meaning: '发芽；长出；新芽', accent: 'sp'},
];

const SN_ROWS: ReplicaTableRow[] = [
  {word: 'sniff', phonetic: '/snɪf/', part: 'v./n.', meaning: '闻；嗅；抽鼻子', accent: 'sn'},
  {word: 'sneeze', phonetic: '/sniːz/', part: 'v./n.', meaning: '打喷嚏', accent: 'sn'},
  {word: 'snore', phonetic: '/snɔːr/', part: 'v./n.', meaning: '打鼾；鼾声', accent: 'sn'},
  {word: 'snort', phonetic: '/snɔːrt/', part: 'v./n.', meaning: '用鼻子喷气；哼鼻子', accent: 'sn'},
  {word: 'snout', phonetic: '/snaʊt/', part: 'n.', meaning: '（动物的）口鼻部', accent: 'sn'},
  {word: 'snuffle', phonetic: '/ˈsnʌfəl/', part: 'v./n.', meaning: '抽鼻子；带鼻音说话；鼻音', accent: 'sn'},
];

const SL_ROWS: ReplicaTableRow[] = [
  {word: 'slide', phonetic: '/slaɪd/', part: 'v./n.', meaning: '滑动；滑落；滑行；滑梯', accent: 'sl'},
  {word: 'slip', phonetic: '/slɪp/', part: 'v./n.', meaning: '滑倒；滑脱；溜走；失足', accent: 'sl'},
  {word: 'slime', phonetic: '/slaɪm/', part: 'n./v.', meaning: '史莱姆；黏液；变黏滑', accent: 'sl'},
  {word: 'slither', phonetic: '/ˈslɪðər/', part: 'v.', meaning: '蜿蜒滑行（尤指蛇）；滑动', accent: 'sl'},
  {word: 'sled', phonetic: '/sled/', part: 'n./v.', meaning: '雪橇；乘雪橇滑行', accent: 'sl'},
];

const GL_ROWS: ReplicaTableRow[] = [
  {word: 'glow', phonetic: '/ɡləʊ/', part: 'v./n.', meaning: '发光；发亮；微弱稳定的光', accent: 'gl'},
  {word: 'gleam', phonetic: '/ɡliːm/', part: 'v./n.', meaning: '微光；闪光', accent: 'gl'},
  {word: 'glitter', phonetic: '/ˈɡlɪtər/', part: 'v./n.', meaning: '闪光；闪烁；闪耀', accent: 'gl'},
  {word: 'glimmer', phonetic: '/ˈɡlɪmər/', part: 'v./n.', meaning: '闪烁；微光', accent: 'gl'},
  {word: 'glisten', phonetic: '/ˈɡlɪsən/', part: 'v./n.', meaning: '闪亮；发光', accent: 'gl'},
  {word: 'glare', phonetic: '/ɡler/', part: 'v./n.', meaning: '瞪眼；强光；刺眼的光', accent: 'gl'},
];

export const boubaKikiWordFamilies = {
  cr: {prefix: 'cr-', meaning: '破碎感', rows: CR_ROWS, image: BOUBA_KIKI_REPLICA_ASSETS.crackedGlass},
  sp: {
    prefix: 'sp-',
    meaning: '飞溅；喷涌',
    rows: [...SP_FIRST_ROWS, ...SP_SECOND_ROWS],
    tableGroups: [SP_FIRST_ROWS, SP_SECOND_ROWS],
    image: BOUBA_KIKI_REPLICA_ASSETS.waterSplash,
  },
  sn: {prefix: 'sn-', meaning: '鼻子；鼻腔发出的声音', rows: SN_ROWS, image: BOUBA_KIKI_REPLICA_ASSETS.noseSneezeFigure},
  sl: {prefix: 'sl-', meaning: '滑动', rows: SL_ROWS, image: BOUBA_KIKI_REPLICA_ASSETS.slidingSkater},
  gl: {prefix: 'gl-', meaning: '光亮', rows: GL_ROWS, image: BOUBA_KIKI_REPLICA_ASSETS.diamondLight},
} as const;

type FamilySpec = {
  id: string;
  prefix: string;
  meaning: string;
  rows: ReplicaTableRow[];
  image: string;
  imageAt: number;
  meaningAt: number;
  tableAt: number;
  pointerStart: number;
  pointerStep: number;
};

type PointerSpec = {
  id: string;
  rows: ReplicaTableRow[];
  tableX: number;
  tableY: number;
  tableHeight: number;
  pointerStart: number;
  pointerStep: number;
};

const rowPointers = (spec: PointerSpec): ReplicaLayer[] => {
  const rowHeight = spec.tableHeight / spec.rows.length;
  return spec.rows.map((row, index): ReplicaLayer => ({
    id: `${spec.id}-pointer-${index + 1}-${row.word}`,
    kind: 'arrow',
    from: spec.pointerStart + index * spec.pointerStep,
    duration: spec.pointerStep + 0.12,
    enter: 'draw',
    enterDuration: 0.2,
    exit: 'fade',
    exitDuration: 0.14,
    x: spec.tableX - 94,
    y: spec.tableY + rowHeight * (index + 0.5) - 29,
    width: 92,
    height: 58,
    path: 'M7 46 C27 20 50 9 82 18',
    viewBox: '0 0 92 58',
    color: 'accent',
    strokeWidth: 5,
    headSize: 13,
  }));
};

const FAMILY_TABLE_X = 610;
const FAMILY_TABLE_Y = 72;
const FAMILY_TABLE_WIDTH = 1200;
const FAMILY_TABLE_HEIGHT = 838;

const familyLayers = (spec: FamilySpec): ReplicaLayer[] => [
  {
    id: `${spec.id}-prefix`, kind: 'text', from: 0.08, enter: 'pop', enterDuration: 0.3,
    x: 105, y: 250, width: 440, align: 'center', fontSize: 112, fontWeight: 850,
    runs: [{text: spec.prefix, color: 'accent'}],
  },
  {
    id: `${spec.id}-image`, kind: 'image', src: spec.image, from: spec.imageAt,
    duration: spec.tableAt - spec.imageAt - 0.08, enter: 'pop', enterDuration: 0.4,
    exit: 'fade', exitDuration: 0.2, x: 630, y: 105, width: 1180, height: 690, fit: 'contain',
  },
  {
    id: `${spec.id}-meaning`, kind: 'text', from: spec.meaningAt, enter: 'rise', enterDuration: 0.28,
    x: 90, y: 430, width: 470, align: 'center', fontSize: 47, fontWeight: 800,
    lineHeight: 1.28, runs: [{text: spec.meaning, color: 'accent'}],
  },
  {
    id: `${spec.id}-word-table`, kind: 'table', from: spec.tableAt, enter: 'rise', enterDuration: 0.3,
    x: FAMILY_TABLE_X, y: FAMILY_TABLE_Y, width: FAMILY_TABLE_WIDTH, height: FAMILY_TABLE_HEIGHT,
    columns: 1, compact: true, rowFromStep: 0.14, variant: 'open', partInMeaning: true,
    meaningColor: 'primary', wordFontSize: 34, phoneticFontSize: 21, meaningFontSize: 27,
    wordColumnFraction: 0.82, rows: spec.rows,
  },
  ...rowPointers({
    id: spec.id,
    rows: spec.rows,
    tableX: FAMILY_TABLE_X,
    tableY: FAMILY_TABLE_Y,
    tableHeight: FAMILY_TABLE_HEIGHT,
    pointerStart: spec.pointerStart,
    pointerStep: spec.pointerStep,
  }),
];

const spFamilyLayers = (): ReplicaLayer[] => {
  const tableX = 600;
  const tableY = 72;
  const tableWidth = 1210;
  const tableHeight = 838;
  return [
    {
      id: 'sp-prefix', kind: 'text', from: 0.08, enter: 'pop', enterDuration: 0.3,
      x: 105, y: 250, width: 440, align: 'center', fontSize: 112, fontWeight: 850,
      runs: [{text: 'sp-', color: 'accent'}],
    },
    {
      id: 'sp-image', kind: 'image', src: BOUBA_KIKI_REPLICA_ASSETS.waterSplash, from: 0.92,
      duration: 3.42, enter: 'pop', enterDuration: 0.4, exit: 'fade', exitDuration: 0.2,
      x: 630, y: 105, width: 1180, height: 690, fit: 'contain',
    },
    {
      id: 'sp-meaning', kind: 'text', from: 2.9, enter: 'rise', enterDuration: 0.28,
      x: 90, y: 430, width: 470, align: 'center', fontSize: 47, fontWeight: 800,
      lineHeight: 1.28, runs: [{text: '飞溅；喷涌', color: 'accent'}],
    },
    {
      id: 'sp-word-table-first', kind: 'table', from: 4.45, duration: 3.12,
      enter: 'rise', enterDuration: 0.28, exit: 'fade', exitDuration: 0.2,
      x: tableX, y: tableY, width: tableWidth, height: tableHeight, columns: 1, compact: true,
      rowFromStep: 0.1, variant: 'open', partInMeaning: true, meaningColor: 'primary',
      wordFontSize: 34, phoneticFontSize: 21, meaningFontSize: 26, wordColumnFraction: 0.8,
      rows: SP_FIRST_ROWS,
    },
    ...rowPointers({
      id: 'sp-first', rows: SP_FIRST_ROWS, tableX, tableY, tableHeight,
      pointerStart: 4.65, pointerStep: 0.54,
    }),
    {
      id: 'sp-word-table-second', kind: 'table', from: 7.75, enter: 'rise', enterDuration: 0.24,
      x: tableX, y: tableY, width: tableWidth, height: tableHeight, columns: 1, compact: true,
      rowFromStep: 0.09, variant: 'open', partInMeaning: true, meaningColor: 'primary',
      wordFontSize: 34, phoneticFontSize: 21, meaningFontSize: 26, wordColumnFraction: 0.8,
      rows: SP_SECOND_ROWS,
    },
    ...rowPointers({
      id: 'sp-second', rows: SP_SECOND_ROWS, tableX, tableY, tableHeight,
      pointerStart: 7.9, pointerStep: 0.48,
    }),
  ];
};

export const boubaKikiStoryboard: ReplicaStoryboard = {
  id: 'bouba-kiki-replica',
  duration: 102.3,
  fadeToBlackSec: 0.4,
  fadeEndOpacity: 0.733,
  scenes: [
    {
      id: 'question-characters',
      start: 0,
      duration: 7,
      narration: '如果给你两个外星词：Bouba，还有 Kiki。用它们来形容这两张图，你觉得哪个是 Bouba，哪个是 Kiki？',
      captions: [
        {from: 0, to: 1.75, text: '如果给你两个外星词：Bouba。'},
        {from: 1.75, to: 3.55, text: '还有 Kiki。'},
        {from: 3.55, to: 5.65, text: '用它们来形容这两张图。'},
        {from: 5.65, to: 6.78, text: '哪个是 Bouba，哪个是 Kiki？'},
      ],
      sfx: [
        {at: 0.45, name: 'pop', volume: 0.2},
        {at: 2.0, name: 'pop', volume: 0.2},
        {at: 4.0, name: 'whoosh', volume: 0.2},
        {at: 5.85, name: 'pop', volume: 0.18},
      ],
      transitionOut: {type: 'white-fade', duration: 0.2},
      layers: [
        {
          id: 'question-bouba', kind: 'text', from: 0.45, duration: 1.25,
          enter: 'pop', enterDuration: 0.28, exit: 'fade', exitDuration: 0.18,
          x: 440, y: 325, width: 1040, align: 'center', fontSize: 126, fontWeight: 850,
          runs: [{text: 'Bouba', color: 'primary'}],
        },
        {
          id: 'question-kiki', kind: 'text', from: 2.0, duration: 1.25,
          enter: 'pop', enterDuration: 0.28, exit: 'fade', exitDuration: 0.18,
          x: 440, y: 325, width: 1040, align: 'center', fontSize: 126, fontWeight: 850,
          runs: [{text: 'Kiki', color: 'primary'}],
        },
        {
          id: 'question-round', kind: 'image', src: BOUBA_KIKI_REPLICA_ASSETS.boubaRound, from: 4.0,
          duration: 1.58, enter: 'pop', enterDuration: 0.34, exit: 'fade', exitDuration: 0.2,
          x: 180, y: 195, width: 560, height: 570, fit: 'cover',
        },
        {
          id: 'question-spiky', kind: 'image', src: BOUBA_KIKI_REPLICA_ASSETS.kikiSpiky, from: 4.08,
          duration: 1.5, enter: 'pop', enterDuration: 0.34, exit: 'fade', exitDuration: 0.2,
          x: 1180, y: 195, width: 560, height: 570, fit: 'cover',
        },
        {
          id: 'question-thinker', kind: 'image', src: BOUBA_KIKI_REPLICA_ASSETS.thinkingFigure, from: 5.85,
          enter: 'rise', enterDuration: 0.34, x: 640, y: 135, width: 640, height: 690, fit: 'cover',
        },
      ],
    },
    {
      id: 'experiment-classroom',
      start: 7,
      duration: 11.1,
      narration: '这来自一个著名实验。研究者让参与者给圆形和尖形选名字。结果，绝大多数人都把 Bouba 给圆形，把 Kiki 给尖形。',
      captions: [
        {from: 0, to: 3.0, text: '曾经做过一个著名实验。'},
        {from: 3.0, to: 6.0, text: '人们给圆形和尖形选名字。'},
        {from: 6.0, to: 9.0, text: '绝大多数人都会做出同样的选择。'},
        {from: 9.0, to: 10.88, text: 'Bouba 给圆形，Kiki 给尖形。'},
      ],
      sfx: [
        {at: 0.18, name: 'whoosh', volume: 0.2},
        {at: 1.1, name: 'pop', volume: 0.18},
        {at: 9.0, name: 'pop', volume: 0.18},
        {at: 9.6, name: 'scribble', volume: 0.14},
      ],
      transitionOut: {type: 'white-fade', duration: 0.2},
      layers: [
        {
          id: 'experiment-bouba-label', kind: 'text', from: 0.18, duration: 8.6,
          enter: 'wipe-up', enterDuration: 0.28, exit: 'fade', exitDuration: 0.18,
          x: 675, y: 55, width: 300, align: 'center', fontSize: 58, fontWeight: 850,
          runs: [{text: 'Bouba', color: 'primary'}],
        },
        {
          id: 'experiment-kiki-label', kind: 'text', from: 0.32, duration: 8.46,
          enter: 'wipe-up', enterDuration: 0.28, exit: 'fade', exitDuration: 0.18,
          x: 1010, y: 55, width: 300, align: 'center', fontSize: 58, fontWeight: 850,
          runs: [{text: 'Kiki', color: 'primary'}],
        },
        {
          id: 'experiment-classroom-image', kind: 'image', src: BOUBA_KIKI_REPLICA_ASSETS.experimentClassroom,
          from: 0.72, duration: 8.08, enter: 'pop', enterDuration: 0.4,
          exit: 'fade', exitDuration: 0.2, x: 170, y: 150, width: 1580, height: 690, fit: 'contain',
        },
        {
          id: 'experiment-result-round-image', kind: 'image', src: BOUBA_KIKI_REPLICA_ASSETS.boubaRound,
          from: 9.0, enter: 'pop', enterDuration: 0.32,
          x: 155, y: 215, width: 650, height: 570, fit: 'cover',
        },
        {
          id: 'experiment-result-spiky-image', kind: 'image', src: BOUBA_KIKI_REPLICA_ASSETS.kikiSpiky,
          from: 9.08, enter: 'pop', enterDuration: 0.32,
          x: 1115, y: 215, width: 650, height: 570, fit: 'cover',
        },
        {
          id: 'experiment-result-bouba', kind: 'text', from: 9.0, enter: 'wipe-up', enterDuration: 0.24,
          x: 260, y: 90, width: 440, align: 'center', fontSize: 72, fontWeight: 850,
          runs: [{text: 'Bouba', color: 'primary'}],
        },
        {
          id: 'experiment-result-kiki', kind: 'text', from: 9.08, enter: 'wipe-up', enterDuration: 0.24,
          x: 1220, y: 90, width: 440, align: 'center', fontSize: 72, fontWeight: 850,
          runs: [{text: 'Kiki', color: 'primary'}],
        },
        {
          id: 'experiment-round-dashed-arc', kind: 'arrow', from: 9.45, enter: 'draw', enterDuration: 0.34,
          x: 200, y: 240, width: 560, height: 500,
          path: 'M92 365 C25 255 57 102 182 45 C312 -16 472 48 506 180 C535 296 450 415 322 432',
          viewBox: '0 0 560 470', color: 'accent', strokeWidth: 5, dashed: true, headSize: 1,
        },
        {
          id: 'experiment-spiky-zigzag', kind: 'arrow', from: 9.72, enter: 'draw', enterDuration: 0.3,
          x: 1070, y: 300, width: 170, height: 250,
          path: 'M150 10 L88 62 L132 112 L54 162 L86 228 L12 242',
          viewBox: '0 0 170 250', color: 'accent', strokeWidth: 6, headSize: 15,
        },
      ],
    },
    {
      id: 'sound-symbolism-explanation',
      start: 18.1,
      duration: 8.4,
      narration: '为什么 Bouba 听着更圆润，而 Kiki 听着比较尖锐？声音和感觉，好像本来就联系在一起。',
      captions: [
        {from: 0, to: 2.6, text: '这是因为 Bouba 听着圆润一些。'},
        {from: 2.6, to: 5.1, text: '而 Kiki 听着就比较尖锐。'},
        {from: 5.1, to: 8.18, text: '声音和感觉，好像是联系在一起的。'},
      ],
      sfx: [{at: 0.15, name: 'whoosh', volume: 0.18}, {at: 1.15, name: 'scribble', volume: 0.16}, {at: 2.85, name: 'hit', volume: 0.15}],
      transitionOut: {type: 'white-fade', duration: 0.18},
      layers: [
        {
          id: 'explanation-bouba-image', kind: 'image', src: BOUBA_KIKI_REPLICA_ASSETS.boubaRound,
          from: 0.05, enter: 'pop', enterDuration: 0.32,
          x: 140, y: 210, width: 680, height: 585, fit: 'cover',
        },
        {
          id: 'explanation-kiki-image', kind: 'image', src: BOUBA_KIKI_REPLICA_ASSETS.kikiSpiky,
          from: 0.12, enter: 'pop', enterDuration: 0.32,
          x: 1100, y: 210, width: 680, height: 585, fit: 'cover',
        },
        {
          id: 'explanation-bouba-label', kind: 'text', from: 0.1, enter: 'wipe-up', enterDuration: 0.24,
          x: 250, y: 85, width: 460, align: 'center', fontSize: 76, fontWeight: 850,
          runs: [{text: 'Bouba', color: 'primary'}],
        },
        {
          id: 'explanation-kiki-label', kind: 'text', from: 0.18, enter: 'wipe-up', enterDuration: 0.24,
          x: 1210, y: 85, width: 460, align: 'center', fontSize: 76, fontWeight: 850,
          runs: [{text: 'Kiki', color: 'primary'}],
        },
        {
          id: 'explanation-round-dashed-arc', kind: 'arrow', from: 1.12, enter: 'draw', enterDuration: 0.38,
          x: 205, y: 230, width: 575, height: 500,
          path: 'M92 370 C18 252 56 95 188 40 C330 -20 493 58 520 202 C540 322 444 424 306 438',
          viewBox: '0 0 575 480', color: 'accent', strokeWidth: 6, dashed: true, headSize: 1,
        },
        {
          id: 'explanation-spiky-zigzag-left', kind: 'arrow', from: 2.72, enter: 'draw', enterDuration: 0.3,
          x: 1050, y: 310, width: 170, height: 265,
          path: 'M154 12 L88 68 L136 120 L55 170 L92 230 L12 252',
          viewBox: '0 0 170 265', color: 'accent', strokeWidth: 6, headSize: 15,
        },
        {
          id: 'explanation-spiky-zigzag-right', kind: 'arrow', from: 2.92, enter: 'draw', enterDuration: 0.3,
          x: 1690, y: 310, width: 170, height: 265,
          path: 'M16 12 L82 68 L34 120 L115 170 L78 230 L158 252',
          viewBox: '0 0 170 265', color: 'accent', strokeWidth: 6, headSize: 15,
        },
      ],
    },
    {
      id: 'family-preview',
      start: 26.5,
      duration: 11.5,
      narration: '声音和感觉联系在一起。语言学家把这种现象叫 Sound Symbolism，语音象征。很早以前，人们就用这些声音家族：cr、sp、sn、sl、gl。',
      captions: [
        {from: 0, to: 2.25, text: '声音和感觉是联系在一起的。'},
        {from: 2.25, to: 5.1, text: '这种现象叫 Sound Symbolism，语音象征。'},
        {from: 5.1, to: 7.45, text: '其实也存在着许多这样的声音家族。'},
        {from: 7.45, to: 9.25, text: '它们往往都是一些非常古老的词。'},
        {from: 9.25, to: 11.28, text: 'cr-  sp-  sn-  sl-  gl-。'},
      ],
      sfx: [{at: 0.14, name: 'whoosh', volume: 0.18}, {at: 0.8, name: 'scribble', volume: 0.15}, {at: 2.2, name: 'pop', volume: 0.16}, {at: 7.5, name: 'whoosh', volume: 0.18}, {at: 8.15, name: 'scribble', volume: 0.15}],
      transitionOut: {type: 'white-fade', duration: 0.2},
      layers: [
        {
          id: 'preview-speaking-feeling', kind: 'image', src: BOUBA_KIKI_REPLICA_ASSETS.speakingFeelingPair,
          from: 0.08, duration: 7.02, enter: 'pop', enterDuration: 0.36,
          exit: 'fade', exitDuration: 0.2, x: 275, y: 150, width: 1370, height: 650, fit: 'contain',
        },
        {
          id: 'preview-title-en', kind: 'text', from: 1.05, duration: 6.0,
          enter: 'wipe-up', enterDuration: 0.26, exit: 'fade', exitDuration: 0.18,
          x: 690, y: 325, width: 540, align: 'center', fontSize: 66, fontWeight: 850,
          lineHeight: 1.08, runs: [{text: 'Sound\nSymbolism', color: 'primary'}], whiteSpace: 'pre-line',
        },
        {
          id: 'preview-title-zh', kind: 'text', from: 2.15, duration: 4.9,
          enter: 'rise', enterDuration: 0.24, exit: 'fade', exitDuration: 0.18,
          x: 720, y: 500, width: 480, align: 'center', fontSize: 46, fontWeight: 800,
          runs: [{text: '语音象征', color: 'primary'}],
        },
        {
          id: 'preview-circular-arrow-top', kind: 'arrow', from: 0.72, duration: 6.34,
          enter: 'draw', enterDuration: 0.38, exit: 'fade', exitDuration: 0.18,
          x: 640, y: 205, width: 650, height: 160,
          path: 'M24 130 C185 14 462 6 625 105', viewBox: '0 0 650 145',
          color: 'accent', strokeWidth: 5, headSize: 14,
        },
        {
          id: 'preview-circular-arrow-bottom', kind: 'arrow', from: 0.98, duration: 6.08,
          enter: 'draw', enterDuration: 0.38, exit: 'fade', exitDuration: 0.18,
          x: 655, y: 585, width: 620, height: 155,
          path: 'M602 20 C448 134 186 140 18 42', viewBox: '0 0 620 145',
          color: 'accent', strokeWidth: 5, headSize: 14,
        },
        {
          id: 'preview-family-heading', kind: 'text', from: 7.5, enter: 'wipe-up', enterDuration: 0.24,
          x: 650, y: 38, width: 620, align: 'center', fontSize: 51, fontWeight: 800,
          runs: [{text: 'sound family', color: 'primary'}],
        },
        {
          id: 'preview-historical', kind: 'image', src: BOUBA_KIKI_REPLICA_ASSETS.historicalSpeakers,
          from: 7.5, enter: 'pop', enterDuration: 0.34, x: 100, y: 225, width: 1720, height: 665, fit: 'contain',
        },
        {
          id: 'preview-cr-label', kind: 'text', from: 8.05, enter: 'pop', enterDuration: 0.22,
          x: 190, y: 118, width: 180, align: 'center', fontSize: 48, fontWeight: 850,
          runs: [{text: 'cr-', color: 'primary'}],
        },
        {
          id: 'preview-cr-arrow', kind: 'arrow', from: 8.18, enter: 'draw', enterDuration: 0.24,
          x: 230, y: 165, width: 110, height: 115, path: 'M18 12 C40 45 61 68 92 100',
          viewBox: '0 0 110 115', color: 'accent', strokeWidth: 5, headSize: 13,
        },
        {
          id: 'preview-sp-label', kind: 'text', from: 8.4, enter: 'pop', enterDuration: 0.22,
          x: 500, y: 112, width: 180, align: 'center', fontSize: 48, fontWeight: 850,
          runs: [{text: 'sp-', color: 'primary'}],
        },
        {
          id: 'preview-sp-arrow', kind: 'arrow', from: 8.53, enter: 'draw', enterDuration: 0.24,
          x: 540, y: 160, width: 110, height: 120, path: 'M16 12 C44 42 60 72 94 104',
          viewBox: '0 0 110 120', color: 'accent', strokeWidth: 5, headSize: 13,
        },
        {
          id: 'preview-sn-label', kind: 'text', from: 8.75, enter: 'pop', enterDuration: 0.22,
          x: 810, y: 110, width: 180, align: 'center', fontSize: 48, fontWeight: 850,
          runs: [{text: 'sn-', color: 'primary'}],
        },
        {
          id: 'preview-sn-arrow', kind: 'arrow', from: 8.88, enter: 'draw', enterDuration: 0.24,
          x: 850, y: 158, width: 110, height: 124, path: 'M18 12 C40 42 63 76 92 108',
          viewBox: '0 0 110 124', color: 'accent', strokeWidth: 5, headSize: 13,
        },
        {
          id: 'preview-sl-label', kind: 'text', from: 9.1, enter: 'pop', enterDuration: 0.22,
          x: 1120, y: 112, width: 180, align: 'center', fontSize: 48, fontWeight: 850,
          runs: [{text: 'sl-', color: 'primary'}],
        },
        {
          id: 'preview-sl-arrow', kind: 'arrow', from: 9.23, enter: 'draw', enterDuration: 0.24,
          x: 1160, y: 160, width: 110, height: 120, path: 'M16 12 C43 42 61 73 94 104',
          viewBox: '0 0 110 120', color: 'accent', strokeWidth: 5, headSize: 13,
        },
        {
          id: 'preview-gl-label', kind: 'text', from: 9.45, enter: 'pop', enterDuration: 0.22,
          x: 1430, y: 118, width: 180, align: 'center', fontSize: 48, fontWeight: 850,
          runs: [{text: 'gl-', color: 'primary'}],
        },
        {
          id: 'preview-gl-arrow', kind: 'arrow', from: 9.58, enter: 'draw', enterDuration: 0.24,
          x: 1470, y: 165, width: 110, height: 115, path: 'M18 12 C42 44 62 70 92 100',
          viewBox: '0 0 110 115', color: 'accent', strokeWidth: 5, headSize: 13,
        },
      ],
    },
    {
      id: 'cr-family',
      start: 38,
      duration: 15.3,
      narration: '先看 cr。cr 的声音像东西突然裂开、撞击、被压碎，所以 crack、crash、crush、crumble、crumple、crackle，都带着破碎和冲击的感觉。',
      captions: [
        {from: 0, to: 2.4, text: 'cr-：破碎感。'},
        {from: 2.4, to: 5.2, text: '像裂开、撞击、被压碎。'},
        {from: 5.2, to: 9.0, text: 'crack / crash / crush / crumble'},
        {from: 9.0, to: 12.4, text: 'crumple / crackle，也沿着这份感觉展开。'},
        {from: 12.4, to: 15.05, text: '听到 cr-，先想到“破碎”。'},
      ],
      sfx: [{at: 0.16, name: 'whoosh', volume: 0.2}, {at: 1.28, name: 'hit', volume: 0.22}, {at: 6.0, name: 'pop', volume: 0.15}, {at: 10.0, name: 'pop', volume: 0.15}],
      transitionOut: {type: 'white-fade', duration: 0.2},
      layers: familyLayers({
        id: 'cr', prefix: 'cr-', meaning: '破碎感', rows: CR_ROWS,
        image: BOUBA_KIKI_REPLICA_ASSETS.crackedGlass,
        imageAt: 0.76, meaningAt: 2.48, tableAt: 4.7,
        pointerStart: 5.02, pointerStep: 1.54,
      }),
    },
    {
      id: 'sp-family',
      start: 53.3,
      duration: 11.0666666667,
      narration: 'sp 表示飞溅、喷涌。第一组是 spring、spark、splash、spit、spill。第二组从 spurt 到 sprout，也都表示向外喷出、散开。',
      captions: [
        {from: 0, to: 2.0, text: 'sp-：飞溅；喷涌。'},
        {from: 2.0, to: 4.3, text: '像液体从一点向外喷出、散开。'},
        {from: 4.3, to: 7.62, text: 'spring / spark / splash / spit / spill'},
        {from: 7.62, to: 10.85, text: 'spurt / spew / spread / spray / sprinkle / sprout'},
      ],
      sfx: [{at: 0.14, name: 'whoosh', volume: 0.2}, {at: 1.4, name: 'pop', volume: 0.2}, {at: 5.2, name: 'pop', volume: 0.16}],
      transitionOut: {type: 'white-fade', duration: 0.18},
      layers: spFamilyLayers(),
    },
    {
      id: 'sn-family',
      start: 64.3666666667,
      duration: 11.5,
      narration: 'sn 的声音很像鼻子发出的声音。sniff 是闻，sneeze 是打喷嚏，snore 是打鼾，snort 是鼻子喷气，snout 是口鼻部，snuffle 是抽鼻子。',
      captions: [
        {from: 0, to: 2.0, text: 'sn-：鼻子；鼻腔发出的声音。'},
        {from: 2.0, to: 4.6, text: 'sniff / sneeze / snore / snort'},
        {from: 4.6, to: 7.8, text: 'snout 是口鼻部，snuffle 是抽鼻子。'},
        {from: 7.8, to: 11.25, text: '听到 sn-，先把注意力放到鼻子。'},
      ],
      sfx: [{at: 0.14, name: 'whoosh', volume: 0.2}, {at: 1.5, name: 'pop', volume: 0.2}, {at: 4.8, name: 'pop', volume: 0.16}],
      transitionOut: {type: 'white-fade', duration: 0.18},
      layers: familyLayers({
        id: 'sn', prefix: 'sn-', meaning: '鼻子；鼻腔发出的声音', rows: SN_ROWS,
        image: BOUBA_KIKI_REPLICA_ASSETS.noseSneezeFigure,
        imageAt: 0.72, meaningAt: 2.28, tableAt: 3.96,
        pointerStart: 4.25, pointerStep: 1.14,
      }),
    },
    {
      id: 'sl-family',
      start: 75.8666666667,
      duration: 10.8,
      narration: 'sl 就像身体在表面上滑过去。slide 是滑动，slip 是滑倒，slime 是黏液，slither 是蜿蜒滑行，sled 是雪橇。它们都保留了滑动的手感。',
      captions: [
        {from: 0, to: 1.8, text: 'sl-：滑动。'},
        {from: 1.8, to: 4.2, text: 'slide / slip：滑过去，或脚下一滑。'},
        {from: 4.2, to: 7.0, text: 'slime / slither / sled'},
        {from: 7.0, to: 10.55, text: '听到 sl-，想象一个向前滑过的动作。'},
      ],
      sfx: [{at: 0.16, name: 'whoosh', volume: 0.2}, {at: 1.4, name: 'pop', volume: 0.2}, {at: 5.0, name: 'scribble', volume: 0.14}],
      transitionOut: {type: 'white-fade', duration: 0.18},
      layers: familyLayers({
        id: 'sl', prefix: 'sl-', meaning: '滑动', rows: SL_ROWS,
        image: BOUBA_KIKI_REPLICA_ASSETS.slidingSkater,
        imageAt: 0.72, meaningAt: 2.2, tableAt: 3.72,
        pointerStart: 4.02, pointerStep: 1.25,
      }),
    },
    {
      id: 'gl-family',
      start: 86.6666666667,
      duration: 10.3,
      narration: '最后是 gl。gl 像光线在表面闪动：glow 是发光，gleam 是闪光，glitter、glimmer、glisten、glare，都和亮起来、闪起来有关。',
      captions: [
        {from: 0, to: 1.75, text: 'gl-：光亮。'},
        {from: 1.75, to: 4.1, text: 'glow / gleam：发光、闪光。'},
        {from: 4.1, to: 7.0, text: 'glitter / glimmer / glisten / glare'},
        {from: 7.0, to: 10.05, text: '听到 gl-，眼前先亮起来。'},
      ],
      sfx: [{at: 0.16, name: 'whoosh', volume: 0.2}, {at: 1.5, name: 'pop', volume: 0.2}, {at: 4.8, name: 'pop', volume: 0.16}],
      transitionOut: {type: 'white-fade', duration: 0.18},
      layers: familyLayers({
        id: 'gl', prefix: 'gl-', meaning: '光亮', rows: GL_ROWS,
        image: BOUBA_KIKI_REPLICA_ASSETS.diamondLight,
        imageAt: 0.66, meaningAt: 2.0, tableAt: 3.45,
        pointerStart: 3.72, pointerStep: 1.02,
      }),
    },
    {
      id: 'historical-modern-recap',
      start: 96.9666666667,
      duration: 2.3333333333,
      narration: '五组声音，五幅画面。',
      captions: [
        {from: 0, to: 1.05, text: '古代到现代：声音一直连着感官。'},
        {from: 1.05, to: 2.28, text: '五组声音，五幅画面。'},
      ],
      sfx: [{at: 0.1, name: 'whoosh', volume: 0.18}, {at: 0.82, name: 'pop', volume: 0.16}],
      transitionOut: {type: 'white-fade', duration: 0.12},
      layers: [
        {
          id: 'recap-historical-image', kind: 'image', src: BOUBA_KIKI_REPLICA_ASSETS.historicalSpeakers,
          from: 0.04, duration: 0.98, enter: 'pop', enterDuration: 0.24, exit: 'fade', exitDuration: 0.16,
          x: 210, y: 150, width: 1500, height: 650, fit: 'contain',
        },
        {
          id: 'recap-modern-image', kind: 'image', src: BOUBA_KIKI_REPLICA_ASSETS.modernSpeakers,
          from: 1.08, enter: 'pop', enterDuration: 0.24, x: 210, y: 150, width: 1500, height: 650, fit: 'contain',
        },
        {
          id: 'recap-ancient-label', kind: 'text', from: 0.18, duration: 0.82, enter: 'wipe-up', enterDuration: 0.2, exit: 'fade', exitDuration: 0.14,
          x: 560, y: 810, width: 800, align: 'center', fontSize: 40, fontWeight: 800,
          runs: [{text: '古代：描述眼前的感觉', color: 'primary'}],
        },
        {
          id: 'recap-modern-label', kind: 'text', from: 1.22, enter: 'wipe-up', enterDuration: 0.2,
          x: 560, y: 810, width: 800, align: 'center', fontSize: 40, fontWeight: 800,
          runs: [{text: '现代：仍然听得出画面', color: 'primary'}],
        },
      ],
    },
    {
      id: 'outro-fade',
      start: 99.3,
      duration: 3,
      narration: '语音象征，下次见。',
      captions: [
        {from: 0, to: 1.1, text: 'Sound Symbolism'},
        {from: 1.1, to: 2.55, text: '语音象征：用声音，记住画面。'},
      ],
      sfx: [{at: 0.12, name: 'whoosh', volume: 0.18}, {at: 0.62, name: 'pop', volume: 0.18}, {at: 2.25, name: 'press', volume: 0.14}],
      layers: [
        {
          id: 'outro-speaking-image', kind: 'image', src: BOUBA_KIKI_REPLICA_ASSETS.speakingFeelingPair,
          from: 0.04, enter: 'pop', enterDuration: 0.24, x: 180, y: 170, width: 1560, height: 610, fit: 'contain',
        },
        {
          id: 'outro-title-en', kind: 'text', from: 0.16, enter: 'wipe-up', enterDuration: 0.22,
          x: 690, y: 90, width: 540, align: 'center', fontSize: 62, fontWeight: 850,
          runs: [{text: 'Sound Symbolism', color: 'primary'}],
        },
        {
          id: 'outro-title-zh', kind: 'text', from: 0.34, enter: 'rise', enterDuration: 0.2,
          x: 720, y: 770, width: 480, align: 'center', fontSize: 44, fontWeight: 800,
          runs: [{text: '语音象征', color: 'accent'}],
        },
        {
          id: 'outro-circular-arrow-top', kind: 'arrow', from: 0.55, enter: 'draw', enterDuration: 0.24,
          x: 590, y: 235, width: 740, height: 180, path: 'M30 138 C210 14 515 5 710 115', viewBox: '0 0 740 150', color: 'accent', strokeWidth: 5, headSize: 14,
        },
        {
          id: 'outro-circular-arrow-bottom', kind: 'arrow', from: 0.78, enter: 'draw', enterDuration: 0.24,
          x: 610, y: 610, width: 700, height: 180, path: 'M680 26 C500 145 206 148 18 42', viewBox: '0 0 700 150', color: 'accent', strokeWidth: 5, headSize: 14,
        },
      ],
    },
  ],
};

const BOUBA_KIKI_DETAILED_NARRATION: Record<string, string> = {
  'sound-symbolism-explanation':
    '为什么 Bouba 听着圆润，Kiki 听着尖锐？说 Bouba 时嘴巴更圆；Kiki 的爆破音更硬。声音和感觉，好像本来就有联系。',
  'family-preview':
    '这种声音与感觉的联系叫 Sound Symbolism，语音象征。它不是死规则，而是相似发音常唤起相似画面。记住五个家族：cr、sp、sn、sl、gl。',
  'cr-family':
    '先看 cr。cr 的声音像东西突然裂开、撞击、被压碎。读这些词时，喉咙和舌尖先蓄力，再突然释放，所以听感像咔嚓、碰撞和碎裂。crack、crash、crush、crumble、crumple、crackle，都带着破碎和冲击的感觉。',
  'sn-family':
    'sn 的声音很像鼻子发出的声音。sniff 是闻，sneeze 是打喷嚏，snore 是打鼾，snort 是鼻子喷气，snout 是口鼻部，snuffle 是抽鼻子。它们都是鼻腔画面。',
  'outro-fade':
    '语音象征，画面记忆，下次见。',
};

for (const scene of boubaKikiStoryboard.scenes) {
  const narration = BOUBA_KIKI_DETAILED_NARRATION[scene.id];
  if (!narration) continue;
  scene.narration = narration;
  scene.captions = narrationToCaptions(narration, scene.duration);
}

export default boubaKikiStoryboard;
