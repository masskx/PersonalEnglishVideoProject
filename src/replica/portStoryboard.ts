import {narrationToCaptions} from './captionUtils';
import type {
  ReplicaArrowLayer,
  ReplicaIconLayer,
  ReplicaImageLayer,
  ReplicaRadialLayer,
  ReplicaScene,
  ReplicaStoryboard,
  ReplicaTableLayer,
  ReplicaTextLayer,
} from './types';

export const PORT_REPLICA_ASSETS = {
  carryHook: 'assets/replica/port/00_carry_hook.png',
  importCarryIn: 'assets/replica/port/01_import_inside.png',
  exportCarryOut: 'assets/replica/port/02_export_outside.png',
  transportAcross: 'assets/replica/port/03_transport_across.png',
  supportUnder: 'assets/replica/port/04_support_under.png',
  reportBack: 'assets/replica/port/05_report_back.png',
  portableCarry: 'assets/replica/port/06_portable_carry.png',
  porterWorker: 'assets/replica/port/07_porter_worker.png',
  deportAway: 'assets/replica/port/08_deport_away.png',
} as const;

const PORT_DURATION = 112.5;
const WHITE_FADE = {type: 'white-fade' as const, duration: 0.16};
const hold = (duration: number, from: number, tail = 0.2) =>
  Number(Math.max(0.12, duration - from - tail).toFixed(3));
const text = (layer: Omit<ReplicaTextLayer, 'kind'>): ReplicaTextLayer => ({kind: 'text', ...layer});
const image = (layer: Omit<ReplicaImageLayer, 'kind'>): ReplicaImageLayer => ({kind: 'image', ...layer});
const arrow = (layer: Omit<ReplicaArrowLayer, 'kind'>): ReplicaArrowLayer => ({kind: 'arrow', ...layer});
const icon = (layer: Omit<ReplicaIconLayer, 'kind'>): ReplicaIconLayer => ({kind: 'icon', ...layer});
const table = (layer: Omit<ReplicaTableLayer, 'kind'>): ReplicaTableLayer => ({kind: 'table', ...layer});
const radial = (layer: Omit<ReplicaRadialLayer, 'kind'>): ReplicaRadialLayer => ({kind: 'radial', ...layer});

const scenes: ReplicaScene[] = [
  {
    id: 'carry-hook', start: 0, duration: 8.5,
    narration: '今天只记一个动作：port，来自拉丁语 portare，意思就是 carry，携带、运输。看到 port，就想象小黑背着东西往前搬。',
    captions: narrationToCaptions('今天只记一个动作：port，来自拉丁语 portare，意思就是 carry，携带、运输。看到 port，就想象小黑背着东西往前搬。', 8.5),
    sfx: [{at: 0.2, name: 'pop', volume: 0.18}, {at: 2.7, name: 'whoosh', volume: 0.22}],
    layers: [
      text({id: 'hook-port', from: 0.05, duration: hold(8, 0.05), enter: 'pop', enterDuration: 0.46, exit: 'fade', exitDuration: 0.2, x: 110, y: 150, width: 690, fontSize: 170, fontWeight: 800, align: 'center', runs: [{text: 'PORT', color: 'accent'}]}),
      text({id: 'hook-equals', from: 0.7, duration: hold(8, 0.7), enter: 'rise', enterDuration: 0.35, exit: 'fade', exitDuration: 0.2, x: 220, y: 355, width: 480, fontSize: 76, fontWeight: 800, align: 'center', runs: [{text: '= CARRY', color: 'primary'}]}),
      text({id: 'hook-meaning', from: 1.25, duration: hold(8, 1.25), enter: 'wipe-up', enterDuration: 0.34, exit: 'fade', exitDuration: 0.2, x: 190, y: 500, width: 540, fontSize: 64, fontWeight: 780, align: 'center', runs: [{text: '携带 / 运输', color: 'primary'}]}),
      image({id: 'hook-image', src: PORT_REPLICA_ASSETS.carryHook, from: 0.3, duration: hold(8, 0.3), enter: 'slide-left', enterDuration: 0.5, exit: 'fade', exitDuration: 0.2, x: 790, y: 80, width: 1000, height: 740, fit: 'contain'}),
      arrow({id: 'hook-arrow', from: 2.45, duration: hold(8, 2.45), enter: 'draw', enterDuration: 0.46, exit: 'fade', exitDuration: 0.2, x: 1110, y: 545, width: 550, height: 120, path: 'M20 94 C180 76 350 52 510 30', viewBox: '0 0 550 120', color: 'accent', strokeWidth: 8, headSize: 22}),
      icon({id: 'hook-box', icon: 'box', from: 3.1, duration: hold(8, 3.1), enter: 'pop', enterDuration: 0.28, exit: 'fade', exitDuration: 0.2, x: 1600, y: 470, width: 90, height: 90, color: 'accent'}),
    ], transitionOut: WHITE_FADE,
  },
  {
    id: 'route-machine', start: 8.5, duration: 10,
    narration: 'port 像一台搬运机，前缀就是路线：in 往里，ex 往外，trans 横着过，sub 从下面托，re 带回来，de 带走。路线一换，词义就换。',
    captions: narrationToCaptions('port 像一台搬运机，前缀就是路线：in 往里，ex 往外，trans 横着过，sub 从下面托，re 带回来，de 带走。路线一换，词义就换。', 10),
    sfx: [{at: 0.18, name: 'scribble', volume: 0.17}, {at: 3.3, name: 'press', volume: 0.16}],
    layers: [
      text({id: 'route-title', from: 0.05, duration: hold(8.5, 0.05), enter: 'rise', enterDuration: 0.38, exit: 'fade', exitDuration: 0.2, x: 130, y: 75, width: 820, fontSize: 78, fontWeight: 800, runs: [{text: '前缀', color: 'primary'}, {text: ' = 运输路线', color: 'accent'}]}),
      radial({id: 'route-radial', from: 0.55, duration: hold(8.5, 0.55), enter: 'pop', enterDuration: 0.48, exit: 'fade', exitDuration: 0.2, x: 110, y: 185, width: 1650, height: 630, center: [{text: '-port-', color: 'accent', weight: 800, size: 78}, {text: '\n搬运', color: 'primary', weight: 760, size: 42}], items: [{text: 'in-  往里', angle: 205, color: 'primary'}, {text: 'ex-  往外', angle: 335, color: 'primary'}, {text: 'trans-  横过', angle: 270, color: 'primary'}, {text: 'sub-  下面', angle: 75, color: 'primary'}, {text: 're-  带回', angle: 145, color: 'primary'}, {text: 'de-  带走', angle: 25, color: 'primary'}], radiusX: 570, radiusY: 235}),
      text({id: 'route-rule', from: 5.7, duration: hold(8.5, 5.7), enter: 'slide-left', enterDuration: 0.38, exit: 'fade', exitDuration: 0.2, x: 1130, y: 735, width: 610, fontSize: 44, fontWeight: 700, align: 'center', runs: [{text: '同一台搬运机，换路线', color: 'primary'}]}),
    ], transitionOut: WHITE_FADE,
  },
  {
    id: 'import-carry-in', start: 18.5, duration: 9,
    narration: 'import 里的 im，是 in 的同化写法，表示 into，往里面。把货物搬进来，就是进口；把信息带进系统，也叫导入。',
    captions: narrationToCaptions('import 里的 im，是 in 的同化写法，表示 into，往里面。把货物搬进来，就是进口；把信息带进系统，也叫导入。', 9),
    sfx: [{at: 0.12, name: 'whoosh', volume: 0.2}, {at: 2.9, name: 'press', volume: 0.18}],
    layers: [
      text({id: 'import-word', from: 0.05, duration: hold(9, 0.05), enter: 'pop', enterDuration: 0.42, exit: 'fade', exitDuration: 0.2, x: 95, y: 95, width: 820, fontSize: 130, fontWeight: 800, runs: [{text: 'im', color: 'primary'}, {text: 'port', color: 'accent'}]}),
      text({id: 'import-formula', from: 0.7, duration: hold(9, 0.7), enter: 'wipe-up', enterDuration: 0.34, exit: 'fade', exitDuration: 0.2, x: 130, y: 280, width: 720, fontSize: 50, fontWeight: 760, runs: [{text: 'in- / im- = into  往里', color: 'primary'}]}),
      image({id: 'import-image', src: PORT_REPLICA_ASSETS.importCarryIn, from: 0.3, duration: hold(9, 0.3), enter: 'slide-left', enterDuration: 0.46, exit: 'fade', exitDuration: 0.2, x: 790, y: 80, width: 1020, height: 710, fit: 'contain'}),
      arrow({id: 'import-arrow', from: 2.35, duration: hold(9, 2.35), enter: 'draw', enterDuration: 0.46, exit: 'fade', exitDuration: 0.2, x: 1150, y: 515, width: 510, height: 145, path: 'M30 105 C190 74 340 56 475 32', viewBox: '0 0 510 145', color: 'accent', strokeWidth: 8, headSize: 22}),
      text({id: 'import-meaning', from: 4.15, duration: hold(9, 4.15), enter: 'pop', enterDuration: 0.36, exit: 'fade', exitDuration: 0.2, x: 145, y: 500, width: 650, fontSize: 70, fontWeight: 800, align: 'center', runs: [{text: '进口；导入', color: 'accent'}]}),
    ], transitionOut: WHITE_FADE,
  },
  {
    id: 'export-carry-out', start: 27.5, duration: 9,
    narration: 'export 的 ex 表示 out，向外。把货物搬出去，就是出口；把照片、文件带出去，就是导出。先记住“跨出边界”。',
    captions: narrationToCaptions('export 的 ex 表示 out，向外。把货物搬出去，就是出口；把照片、文件带出去，就是导出。先记住“跨出边界”。', 9),
    sfx: [{at: 0.12, name: 'whoosh', volume: 0.2}, {at: 3.1, name: 'pop', volume: 0.16}],
    layers: [
      text({id: 'export-word', from: 0.05, duration: hold(9, 0.05), enter: 'pop', enterDuration: 0.42, exit: 'fade', exitDuration: 0.2, x: 90, y: 95, width: 850, fontSize: 130, fontWeight: 800, runs: [{text: 'ex', color: 'primary'}, {text: 'port', color: 'accent'}]}),
      text({id: 'export-formula', from: 0.7, duration: hold(9, 0.7), enter: 'wipe-up', enterDuration: 0.34, exit: 'fade', exitDuration: 0.2, x: 130, y: 280, width: 720, fontSize: 50, fontWeight: 760, runs: [{text: 'ex- = out  向外', color: 'primary'}]}),
      image({id: 'export-image', src: PORT_REPLICA_ASSETS.exportCarryOut, from: 0.3, duration: hold(9, 0.3), enter: 'slide-left', enterDuration: 0.46, exit: 'fade', exitDuration: 0.2, x: 790, y: 80, width: 1020, height: 710, fit: 'contain'}),
      arrow({id: 'export-arrow', from: 2.35, duration: hold(9, 2.35), enter: 'draw', enterDuration: 0.46, exit: 'fade', exitDuration: 0.2, x: 1100, y: 525, width: 550, height: 120, path: 'M20 32 C180 57 340 72 520 92', viewBox: '0 0 550 120', color: 'accent', strokeWidth: 8, headSize: 23}),
      text({id: 'export-meaning', from: 4.15, duration: hold(9, 4.15), enter: 'pop', enterDuration: 0.36, exit: 'fade', exitDuration: 0.2, x: 145, y: 500, width: 650, fontSize: 70, fontWeight: 800, align: 'center', runs: [{text: '出口；导出', color: 'accent'}]}),
    ], transitionOut: WHITE_FADE,
  },
  {
    id: 'transport-carry-across', start: 36.5, duration: 9.5,
    narration: 'transport 的 trans 表示 across，横跨、穿过。把人或货物从这一边搬到那一边，就是运输、运送；公共交通也叫 transport。',
    captions: narrationToCaptions('transport 的 trans 表示 across，横跨、穿过。把人或货物从这一边搬到那一边，就是运输、运送；公共交通也叫 transport。', 9.5),
    sfx: [{at: 0.12, name: 'pop', volume: 0.18}, {at: 2.9, name: 'whoosh', volume: 0.22}],
    layers: [
      text({id: 'transport-word', from: 0.05, duration: hold(9.5, 0.05), enter: 'pop', enterDuration: 0.42, exit: 'fade', exitDuration: 0.2, x: 70, y: 95, width: 900, fontSize: 118, fontWeight: 800, runs: [{text: 'trans', color: 'primary'}, {text: 'port', color: 'accent'}]}),
      text({id: 'transport-formula', from: 0.7, duration: hold(9.5, 0.7), enter: 'wipe-up', enterDuration: 0.34, exit: 'fade', exitDuration: 0.2, x: 110, y: 280, width: 760, fontSize: 50, fontWeight: 760, runs: [{text: 'trans- = across  横跨', color: 'primary'}]}),
      image({id: 'transport-image', src: PORT_REPLICA_ASSETS.transportAcross, from: 0.3, duration: hold(9.5, 0.3), enter: 'slide-left', enterDuration: 0.46, exit: 'fade', exitDuration: 0.2, x: 790, y: 70, width: 1030, height: 730, fit: 'contain'}),
      arrow({id: 'transport-arrow', from: 2.35, duration: hold(9.5, 2.35), enter: 'draw', enterDuration: 0.46, exit: 'fade', exitDuration: 0.2, x: 1030, y: 545, width: 680, height: 110, path: 'M20 55 C205 53 390 53 640 53', viewBox: '0 0 680 110', color: 'accent', strokeWidth: 8, headSize: 24}),
      text({id: 'transport-meaning', from: 4.15, duration: hold(9.5, 4.15), enter: 'pop', enterDuration: 0.36, exit: 'fade', exitDuration: 0.2, x: 120, y: 500, width: 670, fontSize: 66, fontWeight: 800, align: 'center', runs: [{text: '运输；运送', color: 'accent'}]}),
    ], transitionOut: WHITE_FADE,
  },
  {
    id: 'support-carry-under', start: 46, duration: 9.5,
    narration: 'support 的 sup 是 sub 的变体，表示 under，在下面。小黑从下面把重量托住，就是 support，支持、支撑；观点也可以被证据支撑。',
    captions: narrationToCaptions('support 的 sup 是 sub 的变体，表示 under，在下面。小黑从下面把重量托住，就是 support，支持、支撑；观点也可以被证据支撑。', 9.5),
    sfx: [{at: 0.12, name: 'press', volume: 0.18}, {at: 2.9, name: 'hit', volume: 0.16}],
    layers: [
      text({id: 'support-word', from: 0.05, duration: hold(9.5, 0.05), enter: 'pop', enterDuration: 0.42, exit: 'fade', exitDuration: 0.2, x: 80, y: 95, width: 900, fontSize: 124, fontWeight: 800, runs: [{text: 'sup', color: 'primary'}, {text: 'port', color: 'accent'}]}),
      text({id: 'support-formula', from: 0.7, duration: hold(9.5, 0.7), enter: 'wipe-up', enterDuration: 0.34, exit: 'fade', exitDuration: 0.2, x: 115, y: 280, width: 760, fontSize: 50, fontWeight: 760, runs: [{text: 'sub- / sup- = under  下面', color: 'primary'}]}),
      image({id: 'support-image', src: PORT_REPLICA_ASSETS.supportUnder, from: 0.3, duration: hold(9.5, 0.3), enter: 'slide-left', enterDuration: 0.46, exit: 'fade', exitDuration: 0.2, x: 790, y: 70, width: 1030, height: 730, fit: 'contain'}),
      arrow({id: 'support-arrow', from: 2.35, duration: hold(9.5, 2.35), enter: 'draw', enterDuration: 0.46, exit: 'fade', exitDuration: 0.2, x: 1280, y: 280, width: 130, height: 340, path: 'M65 18 C65 120 65 225 65 310', viewBox: '0 0 130 340', color: 'accent', strokeWidth: 8, headSize: 23}),
      text({id: 'support-meaning', from: 4.15, duration: hold(9.5, 4.15), enter: 'pop', enterDuration: 0.36, exit: 'fade', exitDuration: 0.2, x: 145, y: 500, width: 650, fontSize: 70, fontWeight: 800, align: 'center', runs: [{text: '支持；支撑', color: 'accent'}]}),
    ], transitionOut: WHITE_FADE,
  },
  {
    id: 'report-carry-back', start: 55.5, duration: 9,
    narration: 'report 的 re 表示 back，带回来。把消息带回去给别人，就是 report，报告、汇报；新闻报道，本质也是把信息带回来。',
    captions: narrationToCaptions('report 的 re 表示 back，带回来。把消息带回去给别人，就是 report，报告、汇报；新闻报道，本质也是把信息带回来。', 9),
    sfx: [{at: 0.12, name: 'whoosh', volume: 0.18}, {at: 3.1, name: 'scribble', volume: 0.16}],
    layers: [
      text({id: 'report-word', from: 0.05, duration: hold(9, 0.05), enter: 'pop', enterDuration: 0.42, exit: 'fade', exitDuration: 0.2, x: 90, y: 95, width: 850, fontSize: 130, fontWeight: 800, runs: [{text: 're', color: 'primary'}, {text: 'port', color: 'accent'}]}),
      text({id: 'report-formula', from: 0.7, duration: hold(9, 0.7), enter: 'wipe-up', enterDuration: 0.34, exit: 'fade', exitDuration: 0.2, x: 130, y: 280, width: 720, fontSize: 50, fontWeight: 760, runs: [{text: 're- = back  带回来', color: 'primary'}]}),
      image({id: 'report-image', src: PORT_REPLICA_ASSETS.reportBack, from: 0.3, duration: hold(9, 0.3), enter: 'slide-left', enterDuration: 0.46, exit: 'fade', exitDuration: 0.2, x: 790, y: 80, width: 1020, height: 710, fit: 'contain'}),
      arrow({id: 'report-arrow', from: 2.35, duration: hold(9, 2.35), enter: 'draw', enterDuration: 0.46, exit: 'fade', exitDuration: 0.2, x: 1040, y: 535, width: 590, height: 120, path: 'M560 32 C385 56 220 72 28 95', viewBox: '0 0 590 120', color: 'accent', strokeWidth: 8, headSize: 23}),
      text({id: 'report-meaning', from: 4.15, duration: hold(9, 4.15), enter: 'pop', enterDuration: 0.36, exit: 'fade', exitDuration: 0.2, x: 145, y: 500, width: 650, fontSize: 70, fontWeight: 800, align: 'center', runs: [{text: '报告；汇报', color: 'accent'}]}),
    ], transitionOut: WHITE_FADE,
  },
  {
    id: 'portable-able-to-carry', start: 64.5, duration: 8.5,
    narration: 'portable 是 port 加上 able，表示 able to be carried，能够被携带的。所以 portable 就是便携的、可移动的。',
    captions: narrationToCaptions('portable 是 port 加上 able，表示 able to be carried，能够被携带的。所以 portable 就是便携的、可移动的。', 8.5),
    sfx: [{at: 0.15, name: 'pop', volume: 0.18}, {at: 3.5, name: 'whoosh', volume: 0.16}],
    layers: [
      text({id: 'portable-word', from: 0.05, duration: hold(8.5, 0.05), enter: 'pop', enterDuration: 0.42, exit: 'fade', exitDuration: 0.2, x: 65, y: 100, width: 940, fontSize: 116, fontWeight: 800, runs: [{text: 'port', color: 'accent'}, {text: 'able', color: 'primary'}]}),
      text({id: 'portable-formula', from: 0.7, duration: hold(8.5, 0.7), enter: 'wipe-up', enterDuration: 0.34, exit: 'fade', exitDuration: 0.2, x: 100, y: 280, width: 790, fontSize: 48, fontWeight: 760, runs: [{text: '-able = able to be  能够被', color: 'primary'}]}),
      image({id: 'portable-image', src: PORT_REPLICA_ASSETS.portableCarry, from: 0.3, duration: hold(8.5, 0.3), enter: 'slide-left', enterDuration: 0.46, exit: 'fade', exitDuration: 0.2, x: 790, y: 80, width: 1020, height: 710, fit: 'contain'}),
      arrow({id: 'portable-arrow', from: 2.35, duration: hold(8.5, 2.35), enter: 'draw', enterDuration: 0.44, exit: 'fade', exitDuration: 0.2, x: 1110, y: 540, width: 550, height: 110, path: 'M25 68 C190 45 350 43 520 55', viewBox: '0 0 550 110', color: 'accent', strokeWidth: 8, headSize: 23}),
      text({id: 'portable-meaning', from: 4.15, duration: hold(8.5, 4.15), enter: 'pop', enterDuration: 0.36, exit: 'fade', exitDuration: 0.2, x: 145, y: 510, width: 650, fontSize: 70, fontWeight: 800, align: 'center', runs: [{text: '便携的；可移动的', color: 'accent'}]}),
    ], transitionOut: WHITE_FADE,
  },
  {
    id: 'porter-person-who-carries', start: 73, duration: 8,
    narration: 'porter 是 port 加 er，er 表示“做这件事的人”。porter 就是搬运工，尤其是帮你搬行李的人。一个 port，变成一个人。',
    captions: narrationToCaptions('porter 是 port 加 er，er 表示“做这件事的人”。porter 就是搬运工，尤其是帮你搬行李的人。一个 port，变成一个人。', 8),
    sfx: [{at: 0.15, name: 'pop', volume: 0.18}, {at: 3.2, name: 'press', volume: 0.16}],
    layers: [
      text({id: 'porter-word', from: 0.05, duration: hold(8, 0.05), enter: 'pop', enterDuration: 0.42, exit: 'fade', exitDuration: 0.2, x: 95, y: 105, width: 830, fontSize: 128, fontWeight: 800, runs: [{text: 'port', color: 'accent'}, {text: 'er', color: 'primary'}]}),
      text({id: 'porter-formula', from: 0.7, duration: hold(8, 0.7), enter: 'wipe-up', enterDuration: 0.34, exit: 'fade', exitDuration: 0.2, x: 125, y: 280, width: 730, fontSize: 50, fontWeight: 760, runs: [{text: '-er = person who  做……的人', color: 'primary'}]}),
      image({id: 'porter-image', src: PORT_REPLICA_ASSETS.porterWorker, from: 0.3, duration: hold(8, 0.3), enter: 'slide-left', enterDuration: 0.46, exit: 'fade', exitDuration: 0.2, x: 790, y: 80, width: 1020, height: 710, fit: 'contain'}),
      text({id: 'porter-meaning', from: 4.1, duration: hold(8, 4.1), enter: 'pop', enterDuration: 0.36, exit: 'fade', exitDuration: 0.2, x: 145, y: 505, width: 650, fontSize: 70, fontWeight: 800, align: 'center', runs: [{text: '搬运工；行李员', color: 'accent'}]}),
      icon({id: 'porter-check', icon: 'check', from: 5.15, duration: hold(8, 5.15), enter: 'pop', enterDuration: 0.28, exit: 'fade', exitDuration: 0.2, x: 720, y: 620, width: 100, height: 100, color: 'primary', secondaryColor: 'accent'}),
    ], transitionOut: WHITE_FADE,
  },
  {
    id: 'deport-carry-away', start: 81, duration: 9.5,
    narration: 'deport 的 de 表示 away，带离、带走。把一个人带离某个国家或地方，就是 deport，驱逐出境。动作仍然是 port，只是方向变成离开。',
    captions: narrationToCaptions('deport 的 de 表示 away，带离、带走。把一个人带离某个国家或地方，就是 deport，驱逐出境。动作仍然是 port，只是方向变成离开。', 9.5),
    sfx: [{at: 0.12, name: 'whoosh', volume: 0.2}, {at: 2.8, name: 'hit', volume: 0.16}],
    layers: [
      text({id: 'deport-word', from: 0.05, duration: hold(9, 0.05), enter: 'pop', enterDuration: 0.42, exit: 'fade', exitDuration: 0.2, x: 80, y: 95, width: 900, fontSize: 128, fontWeight: 800, runs: [{text: 'de', color: 'primary'}, {text: 'port', color: 'accent'}]}),
      text({id: 'deport-formula', from: 0.7, duration: hold(9, 0.7), enter: 'wipe-up', enterDuration: 0.34, exit: 'fade', exitDuration: 0.2, x: 115, y: 280, width: 760, fontSize: 50, fontWeight: 760, runs: [{text: 'de- = away  带离', color: 'primary'}]}),
      image({id: 'deport-image', src: PORT_REPLICA_ASSETS.deportAway, from: 0.3, duration: hold(9, 0.3), enter: 'slide-left', enterDuration: 0.46, exit: 'fade', exitDuration: 0.2, x: 790, y: 80, width: 1020, height: 710, fit: 'contain'}),
      arrow({id: 'deport-arrow', from: 2.35, duration: hold(9, 2.35), enter: 'draw', enterDuration: 0.46, exit: 'fade', exitDuration: 0.2, x: 1100, y: 525, width: 560, height: 120, path: 'M30 55 C210 38 370 55 530 86', viewBox: '0 0 560 120', color: 'accent', strokeWidth: 8, headSize: 23}),
      text({id: 'deport-meaning', from: 4.15, duration: hold(9, 4.15), enter: 'pop', enterDuration: 0.36, exit: 'fade', exitDuration: 0.2, x: 145, y: 500, width: 650, fontSize: 70, fontWeight: 800, align: 'center', runs: [{text: '驱逐出境；带离', color: 'accent'}]}),
    ], transitionOut: WHITE_FADE,
  },
  {
    id: 'example-sentences', start: 90.5, duration: 11,
    narration: '把方向放回句子：China imports coffee，进口咖啡；The truck transports goods，卡车运输货物；This laptop is portable，这台电脑便携；The porter carried my bag，搬运工拿了我的包。',
    captions: narrationToCaptions('把方向放回句子：China imports coffee，进口咖啡；The truck transports goods，卡车运输货物；This laptop is portable，这台电脑便携；The porter carried my bag，搬运工拿了我的包。', 11),
    sfx: [{at: 0.12, name: 'scribble', volume: 0.16}, {at: 2.4, name: 'pop', volume: 0.13}, {at: 5, name: 'pop', volume: 0.13}, {at: 7.5, name: 'pop', volume: 0.13}],
    layers: [
      text({id: 'examples-title', from: 0.05, duration: hold(10.5, 0.05), enter: 'rise', enterDuration: 0.38, exit: 'fade', exitDuration: 0.2, x: 260, y: 55, width: 1400, align: 'center', fontSize: 68, fontWeight: 800, runs: [{text: '把运输路线放回句子', color: 'primary'}]}),
      text({id: 'example-import', from: 0.75, duration: hold(10.5, 0.75), enter: 'typewriter', enterDuration: 0.4, exit: 'fade', exitDuration: 0.2, x: 145, y: 190, width: 1650, fontSize: 42, fontWeight: 700, typewriterCharsPerSec: 22, runs: [{text: 'China ', color: 'primary'}, {text: 'imports', color: 'accent'}, {text: ' coffee.  中国进口咖啡。', color: 'primary'}]}),
      text({id: 'example-transport', from: 2.8, duration: hold(10.5, 2.8), enter: 'typewriter', enterDuration: 0.4, exit: 'fade', exitDuration: 0.2, x: 145, y: 305, width: 1650, fontSize: 42, fontWeight: 700, typewriterCharsPerSec: 22, runs: [{text: 'The truck ', color: 'primary'}, {text: 'transports', color: 'accent'}, {text: ' goods.  卡车运输货物。', color: 'primary'}]}),
      text({id: 'example-portable', from: 4.85, duration: hold(10.5, 4.85), enter: 'typewriter', enterDuration: 0.4, exit: 'fade', exitDuration: 0.2, x: 145, y: 420, width: 1650, fontSize: 42, fontWeight: 700, typewriterCharsPerSec: 22, runs: [{text: 'This laptop is ', color: 'primary'}, {text: 'portable', color: 'accent'}, {text: '.  这台电脑很便携。', color: 'primary'}]}),
      text({id: 'example-porter', from: 6.9, duration: hold(10.5, 6.9), enter: 'typewriter', enterDuration: 0.4, exit: 'fade', exitDuration: 0.2, x: 145, y: 535, width: 1650, fontSize: 42, fontWeight: 700, typewriterCharsPerSec: 22, runs: [{text: 'The ', color: 'primary'}, {text: 'porter', color: 'accent'}, {text: ' carried my bag.  搬运工拿了我的包。', color: 'primary'}]}),
      text({id: 'example-callback', from: 8.9, duration: hold(10.5, 8.9), enter: 'rise', enterDuration: 0.34, exit: 'fade', exitDuration: 0.2, x: 320, y: 700, width: 1280, fontSize: 42, fontWeight: 760, align: 'center', runs: [{text: '前缀先看路线，port 再看搬运', color: 'accent'}]}),
    ], transitionOut: WHITE_FADE,
  },
  {
    id: 'final-summary', start: 101.5, duration: 11,
    narration: '最后收口：port 就是 carry，携带、运输。im 进，ex 出，trans 横过，sup 从下托，re 带回，able 能被带，er 是搬运的人，de 带走。',
    captions: narrationToCaptions('最后收口：port 就是 carry，携带、运输。im 进，ex 出，trans 横过，sup 从下托，re 带回，able 能被带，er 是搬运的人，de 带走。', 10.35),
    sfx: [{at: 0.12, name: 'stamp', volume: 0.18}, {at: 4.2, name: 'pop', volume: 0.14}],
    layers: [
      text({id: 'summary-title', from: 0.05, duration: hold(8, 0.05, 0.08), enter: 'rise', enterDuration: 0.38, exit: 'fade', exitDuration: 0.16, x: 250, y: 45, width: 1420, align: 'center', fontSize: 64, fontWeight: 800, runs: [{text: 'port = ', color: 'primary'}, {text: '携带 / 运输', color: 'accent'}]}),
      table({id: 'summary-table', from: 0.35, duration: hold(8, 0.35, 0.08), enter: 'rise', enterDuration: 0.42, exit: 'fade', exitDuration: 0.16, x: 120, y: 135, width: 1680, height: 650, columns: 1, rowFromStep: 0.38, compact: true, variant: 'open', partInMeaning: true, wordFontSize: 37, phoneticFontSize: 24, meaningFontSize: 31, wordColumnFraction: 0.36, rows: [
        {word: 'import', phonetic: '/ɪmˈpɔːt/', part: 'v.', meaning: 'im- 进 → 进口；导入', accent: 'port'},
        {word: 'export', phonetic: '/ɪkˈspɔːt/', part: 'v./n.', meaning: 'ex- 出 → 出口；导出', accent: 'port'},
        {word: 'transport', phonetic: '/ˈtrænspɔːt/', part: 'v./n.', meaning: 'trans- 横过 → 运输', accent: 'port'},
        {word: 'support', phonetic: '/səˈpɔːt/', part: 'v./n.', meaning: 'sup- 下面 → 支持；支撑', accent: 'port'},
        {word: 'report', phonetic: '/rɪˈpɔːt/', part: 'v./n.', meaning: 're- 带回 → 报告；汇报', accent: 'port'},
        {word: 'portable', phonetic: '/ˈpɔːtəbl/', part: 'adj.', meaning: 'port + -able → 便携的', accent: 'port'},
        {word: 'porter', phonetic: '/ˈpɔːtə/', part: 'n.', meaning: 'port + -er → 搬运工', accent: 'port'},
        {word: 'deport', phonetic: '/dɪˈpɔːt/', part: 'v.', meaning: 'de- 带走 → 驱逐出境', accent: 'port'},
      ]}),
    ],
  },
];

export const portStoryboard: ReplicaStoryboard = {
  id: 'port', duration: PORT_DURATION, fadeToBlackSec: 0.6, fadeEndOpacity: 1, scenes,
};
