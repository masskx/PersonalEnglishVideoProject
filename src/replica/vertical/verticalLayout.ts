import type {ReplicaCaptionCue, ReplicaLayer, ReplicaScene, ReplicaStoryboard, ReplicaTableLayer, ReplicaTextLayer, ReplicaTextRun} from '../types';

/**
 * 竖屏 1080×1920 版式。横屏 storyboard 的绝对坐标不直接复用：文字按原 y 顺序重新堆叠，
 * 小黑插图放大到文字下方，字幕重切成单行短句，全部落在抖音界面不遮挡的安全区内。
 */
export const VERTICAL_CANVAS = {
  width: 1080,
  height: 1920,
  fps: 30,
  columnLeft: 64,
  columnWidth: 888,
  headerTop: 206,
  contentTop: 410,
  contentBottom: 1262,
  captionTop: 1296,
  secondaryCtaTop: 1392,
  minArtHeight: 430,
  artGap: 34,
} as const;

export type VerticalCut = 'full' | 'teaser';

type TimedLayer = {layer: ReplicaLayer; start: number; end: number};

const layerWindow = (layer: ReplicaLayer, sceneDuration: number) => ({
  start: layer.from,
  end: layer.from + (layer.duration ?? Math.max(0, sceneDuration - layer.from)),
});

/** Short crossfades are not real coexistence; they may share a slot or lane. */
const coexist = (a: TimedLayer, b: TimedLayer, tolerance = 0.35) =>
  Math.min(a.end, b.end) - Math.max(a.start, b.start) > tolerance;

const isCjk = (char: string) => /[⺀-鿿豈-﫿＀-￯　-〿]/u.test(char);

/** Approximate glyph advance in em units; tuned for Microsoft YaHei / Noto Sans CJK bold. */
const charEm = (char: string) => {
  if (isCjk(char)) return 1;
  if (/[A-Z]/.test(char)) return 0.68;
  if (/[a-z0-9]/.test(char)) return 0.57;
  if (char === ' ') return 0.3;
  return 0.42;
};

const runsText = (runs: readonly ReplicaTextRun[]) => runs.map((run) => run.text).join('');

export const estimateTextLines = (runs: readonly ReplicaTextRun[], fontSize: number, width: number) => {
  let lines = 0;
  let current = 0;
  const flush = () => {
    lines += Math.max(1, Math.ceil(current / width));
    current = 0;
  };
  for (const run of runs) {
    const size = run.size ?? fontSize;
    for (const char of run.text) {
      if (char === '\n') flush();
      else current += charEm(char) * size * 1.03;
    }
  }
  flush();
  return lines;
};

const verticalFontSize = (fontSize: number) => {
  if (fontSize >= 70) return Math.min(132, fontSize * 1.3);
  if (fontSize >= 50) return fontSize * 1.15;
  return Math.max(40, fontSize * 1.1);
};

const blockSourceSize = (layer: ReplicaLayer) => {
  if (layer.kind === 'table') return {width: layer.width ?? 1500, height: layer.height ?? 430};
  if (layer.kind === 'radial') return {width: layer.width ?? 900, height: layer.height ?? 520};
  return {width: layer.width ?? 0, height: layer.height ?? 0};
};

export type VerticalTextPlacement = {
  kind: 'text';
  layer: ReplicaTextLayer;
  y: number;
};

export type VerticalScaledPlacement = {
  kind: 'scaled';
  layer: ReplicaLayer;
  x: number;
  y: number;
  scale: number;
};

export type VerticalTablePlacement = {
  kind: 'table';
  layer: ReplicaTableLayer;
  y: number;
};

export type VerticalArtPlacement = {
  kind: 'art';
  layer: ReplicaLayer;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type VerticalScenePlan = {
  placements: Array<VerticalTextPlacement | VerticalTablePlacement | VerticalScaledPlacement | VerticalArtPlacement>;
  textBottom: number;
  artBox: {top: number; height: number} | null;
};

type Slot = {originY: number; members: TimedLayer[]; height: number; gap: number};

/** Fit-scaling never goes below a phone-readable floor; dense legacy scenes may run slightly long instead. */
const MIN_FIT_FONT = 28;
const fittedFontSize = (fontSize: number, factor: number) => Math.max(MIN_FIT_FONT, verticalFontSize(fontSize) * factor);

const textHeight = (layer: ReplicaTextLayer, factor: number) => {
  const size = fittedFontSize(layer.fontSize, factor);
  const ratio = size / layer.fontSize;
  const runs = layer.runs.map((run) => (run.size ? {...run, size: run.size * ratio} : run));
  return estimateTextLines(runs, size, VERTICAL_CANVAS.columnWidth) * size * (layer.lineHeight ?? 1.25);
};

/** Tables are re-flowed natively as one phone-width column instead of shrinking a 16:9 grid. */
const tableRowHeight = (layer: ReplicaTableLayer, factor: number) =>
  (layer.rows.some((row) => row.phonetic || (row.part && !layer.partInMeaning)) ? 96 : 80) * factor;

const verticalTable = (layer: ReplicaTableLayer, factor: number): ReplicaTableLayer => ({
  ...layer,
  columns: 1,
  compact: false,
  width: VERTICAL_CANVAS.columnWidth,
  height: Math.round(layer.rows.length * tableRowHeight(layer, factor)),
  wordFontSize: Math.round(44 * factor),
  phoneticFontSize: Math.round(24 * factor),
  meaningFontSize: Math.round(34 * factor),
  wordColumnFraction: 1,
});

const blockHeight = (layer: ReplicaLayer, factor: number) => {
  if (layer.kind === 'text') return textHeight(layer, factor);
  if (layer.kind === 'table') return layer.rows.length * tableRowHeight(layer, factor);
  const {width, height} = blockSourceSize(layer);
  return height * Math.min(1, VERTICAL_CANVAS.columnWidth / Math.max(1, width)) * Math.min(1, factor * 1.05);
};

const blockGap = (layer: ReplicaLayer, factor: number) =>
  layer.kind === 'text' ? Math.max(20, verticalFontSize(layer.fontSize) * factor * 0.3) : 26;

const buildSlots = (blocks: TimedLayer[], factor: number) => {
  const slots: Slot[] = [];
  const ordered = [...blocks].sort((a, b) => a.layer.y - b.layer.y || a.start - b.start);
  for (const block of ordered) {
    const shared = slots.find(
      (slot) => Math.abs(slot.originY - block.layer.y) < 70 && slot.members.every((member) => !coexist(member, block)),
    );
    const height = blockHeight(block.layer, factor);
    const gap = blockGap(block.layer, factor);
    if (shared) {
      shared.members.push(block);
      shared.height = Math.max(shared.height, height);
      shared.gap = Math.max(shared.gap, gap);
    } else {
      slots.push({originY: block.layer.y, members: [block], height, gap});
    }
  }
  return slots;
};

const stackHeight = (slots: Slot[]) =>
  slots.reduce((sum, slot, index) => sum + slot.height + (index === 0 ? 0 : slot.gap), 0);

/** Group art into horizontal lanes: layers that replace each other share one lane at full size. */
const buildLanes = (art: TimedLayer[]) => {
  const lanes: TimedLayer[][] = [];
  for (const item of [...art].sort((a, b) => a.start - b.start)) {
    const lane = lanes.find((candidate) => candidate.every((member) => !coexist(member, item, 0.4)));
    if (lane) lane.push(item);
    else lanes.push([item]);
  }
  const centerX = (lane: TimedLayer[]) =>
    lane.reduce((sum, item) => sum + item.layer.x + (item.layer.width ?? 0) / 2, 0) / lane.length;
  return lanes.sort((a, b) => centerX(a) - centerX(b));
};

export const planVerticalScene = (scene: ReplicaScene): VerticalScenePlan => {
  const C = VERTICAL_CANVAS;
  const timed = scene.layers.map((layer) => ({layer, ...layerWindow(layer, scene.duration)}));
  const blocks = timed.filter(({layer}) => layer.kind === 'text' || layer.kind === 'table' || layer.kind === 'radial');
  // Arrows point at 16:9 coordinates and lose meaning after re-layout, so they are dropped.
  const art = timed.filter(({layer}) => layer.kind === 'image' || layer.kind === 'icon');
  const hasArt = art.length > 0;
  // Word tables are the lesson itself; let them take space from the art when both are present.
  const minArt = blocks.some(({layer}) => layer.kind === 'table') ? 240 : C.minArtHeight;
  const available = C.contentBottom - C.contentTop - (hasArt ? minArt + C.artGap : 0);

  let factor = 1;
  let slots = buildSlots(blocks, factor);
  while (stackHeight(slots) > available && factor > 0.5) {
    factor *= 0.93;
    slots = buildSlots(blocks, factor);
  }
  const total = stackHeight(slots);
  let cursor = hasArt || blocks.length === 0
    ? C.contentTop
    : C.contentTop + Math.max(0, (C.contentBottom - C.contentTop - total) * 0.42);

  const placements: VerticalScenePlan['placements'] = [];
  slots.forEach((slot, index) => {
    if (index > 0) cursor += slot.gap;
    for (const {layer} of slot.members) {
      if (layer.kind === 'text') {
        const size = fittedFontSize(layer.fontSize, factor);
        const ratio = size / layer.fontSize;
        placements.push({
          kind: 'text',
          y: cursor,
          layer: {
            ...layer,
            x: C.columnLeft,
            y: cursor,
            width: C.columnWidth,
            maxWidth: undefined,
            fontSize: Math.round(size),
            align: 'center',
            whiteSpace: layer.whiteSpace === 'nowrap' ? 'pre-wrap' : layer.whiteSpace,
            runs: layer.runs.map((run) => (run.size ? {...run, size: Math.round(run.size * ratio)} : run)),
          },
        });
      } else if (layer.kind === 'table') {
        placements.push({kind: 'table', y: cursor, layer: {...verticalTable(layer, factor), x: C.columnLeft, y: cursor}});
      } else {
        const {width} = blockSourceSize(layer);
        const scale = Math.min(1, C.columnWidth / Math.max(1, width)) * Math.min(1, factor * 1.05);
        placements.push({kind: 'scaled', layer, scale, y: cursor, x: C.columnLeft + (C.columnWidth - width * scale) / 2});
      }
    }
    cursor += slot.height;
  });
  const textBottom = cursor;

  let artBox: VerticalScenePlan['artBox'] = null;
  if (hasArt) {
    const top = blocks.length > 0 ? textBottom + C.artGap : C.contentTop;
    const height = Math.max(minArt * 0.8, C.contentBottom - top);
    artBox = {top, height};
    const lanes = buildLanes(art);
    const laneGap = 24;
    const laneWidth = (C.columnWidth - laneGap * (lanes.length - 1)) / lanes.length;
    lanes.forEach((lane, laneIndex) => {
      const x = C.columnLeft + laneIndex * (laneWidth + laneGap);
      for (const {layer} of lane) {
        if (layer.kind === 'icon') {
          const size = Math.min(240, laneWidth, height);
          placements.push({kind: 'art', layer, x: x + (laneWidth - size) / 2, y: top + (height - size) / 2, width: size, height: size});
        } else {
          // Pose art has wide transparent margins; a single full-width lane can zoom without clipping Xiaohei.
          const zoom = lanes.length === 1 && layer.kind === 'image' && (layer.contentScale ?? 1) * 1.1 <= 1.4 ? 1.1 : 1;
          const zoomed = layer.kind === 'image' ? {...layer, contentScale: (layer.contentScale ?? 1) * zoom} : layer;
          placements.push({kind: 'art', layer: zoomed, x, y: top, width: laneWidth, height});
        }
      }
    });
  }
  return {placements, textBottom, artBox};
};

const captionUnits = (token: string) => [...token].reduce((sum, char) => sum + (isCjk(char) ? 1 : char === ' ' ? 0.3 : 0.56), 0);

const compact = (value: string) => value.replace(/\s+/g, '');

/**
 * Auto-derived captions (narrationToCaptions) were chopped every 34 characters and can split an
 * English word in half. When the cues spell the narration exactly, rebuild them from the narration
 * on clause/word boundaries; hand-timed custom cues keep their own windows.
 */
export const verticalCaptionsForScene = (scene: ReplicaScene, maxUnits = 15): ReplicaCaptionCue[] => {
  const cues = scene.captions;
  if (cues.length === 0) return [];
  const joined = cues.map((cue) => cue.text).join('');
  if (scene.narration && compact(joined) === compact(scene.narration)) {
    const clauses = scene.narration.split(/(?<=[。！？；])/u).map((part) => part.trim()).filter(Boolean);
    const weights = clauses.map((clause) => Math.max(6, compact(clause).length));
    const total = weights.reduce((sum, weight) => sum + weight, 0);
    const from = cues[0].from;
    const to = cues[cues.length - 1].to;
    let cursor = from;
    const clauseCues = clauses.map((text, index) => {
      const end = index === clauses.length - 1 ? to : cursor + ((to - from) * weights[index]) / total;
      const cue = {from: cursor, to: end, text};
      cursor = end;
      return cue;
    });
    return splitCaptionsForVertical(clauseCues, maxUnits);
  }
  return splitCaptionsForVertical(cues, maxUnits);
};

/** Re-cut captions into short single lines for phones while keeping each cue's time window. */
export const splitCaptionsForVertical = (cues: readonly ReplicaCaptionCue[], maxUnits = 15): ReplicaCaptionCue[] =>
  cues.flatMap((cue) => {
    const tokens = cue.text.match(/[A-Za-z0-9_'’\-]+|\s+|[^\sA-Za-z0-9_'’\-]/gu) ?? [cue.text];
    const lines: {text: string; units: number}[] = [];
    let text = '';
    let units = 0;
    const flush = () => {
      const trimmed = text.trim().replace(/[，、；：。,;:]+$/u, '');
      if (trimmed) lines.push({text: trimmed, units: Math.max(1, units)});
      text = '';
      units = 0;
    };
    // Balanced lines: a 20-unit clause becomes 10 + 10, not 15 + an orphaned 5.
    const totalUnits = tokens.reduce((sum, token) => sum + captionUnits(token), 0);
    const limit = Math.min(maxUnits, Math.ceil(totalUnits / Math.max(1, Math.ceil(totalUnits / maxUnits))) + 2);
    for (const token of tokens) {
      const tokenUnits = captionUnits(token);
      const punctuation = /^[，。；：！？、,;:!?”’）)]$/u.test(token);
      if (!punctuation && units + tokenUnits > limit && text.trim()) flush();
      if (!text && /^\s+$/.test(token)) continue;
      if (!text && punctuation && lines.length > 0) {
        // Never open a line with punctuation; it belongs to the previous line.
        continue;
      }
      text += token;
      units += tokenUnits;
      if (/^[，；,;]$/u.test(token) && units >= limit * 0.55) flush();
    }
    flush();
    if (lines.length === 0) return [];
    const total = lines.reduce((sum, line) => sum + line.units, 0);
    let cursor = cue.from;
    return lines.map((line, index) => {
      const to = index === lines.length - 1 ? cue.to : cursor + ((cue.to - cue.from) * line.units) / total;
      const result = {from: cursor, to, text: line.text};
      cursor = to;
      return result;
    });
  });

const normalizeWord = (value: string) => value.toLocaleLowerCase().replace(/[\s\-–—·•/]+/g, '');

/** A word chapter is a scene whose large heading spells one of the episode's taught words. */
export const wordIndexForScene = (scene: ReplicaScene, words: readonly string[]) => {
  const targets = words.map(normalizeWord);
  for (const layer of scene.layers) {
    if (layer.kind !== 'text' || layer.fontSize < 56) continue;
    const index = targets.indexOf(normalizeWord(runsText(layer.runs)));
    if (index >= 0) return index;
  }
  return -1;
};

export type VerticalStoryboardOptions = {
  cut: VerticalCut;
  words: readonly string[];
  teaserWordScenes: number;
  teaserIncludeRootMap: boolean;
  teaserTail?: ReplicaScene;
};

const restart = (scenes: ReplicaScene[]) => {
  let start = 0;
  return scenes.map((scene) => {
    const next = {...scene, start};
    start += scene.duration;
    return next;
  });
};

/** First frame must already show the hook: the earliest heading appears at frame 0 without fading in. */
const strengthenOpening = (scene: ReplicaScene): ReplicaScene => {
  const first = scene.layers
    .filter((layer): layer is ReplicaTextLayer => layer.kind === 'text')
    .sort((a, b) => a.from - b.from || a.y - b.y)[0];
  const firstArt = scene.layers
    .filter((layer) => layer.kind === 'image')
    .sort((a, b) => a.from - b.from)[0];
  if (!first || first.from > 0.4) return scene;
  return {
    ...scene,
    layers: scene.layers.map((layer) =>
      layer === firstArt && layer.from <= 0.4
        ? {...layer, from: 0, duration: layer.duration === undefined ? undefined : layer.duration + layer.from, enter: 'none'}
        : layer === first
        ? {...layer, from: 0, duration: layer.duration === undefined ? undefined : layer.duration + layer.from, enter: 'none', runMotion: undefined}
        : layer,
    ),
  };
};

export const buildVerticalStoryboard = (storyboard: ReplicaStoryboard, options: VerticalStoryboardOptions): ReplicaStoryboard => {
  let scenes = storyboard.scenes;
  if (options.cut === 'teaser') {
    const picked: ReplicaScene[] = [scenes[0]];
    if (options.teaserIncludeRootMap && scenes[1] && wordIndexForScene(scenes[1], options.words) < 0) picked.push(scenes[1]);
    // Distinct taught words only, never re-using a scene that is already in the cut (e.g. a hook titled with a word).
    const seenWords = new Set<number>();
    for (const scene of scenes) {
      if (seenWords.size >= options.teaserWordScenes) break;
      const index = wordIndexForScene(scene, options.words);
      if (index < 0 || seenWords.has(index) || picked.includes(scene)) continue;
      seenWords.add(index);
      picked.push(scene);
    }
    if (options.teaserTail) picked.push(options.teaserTail);
    scenes = picked;
  }
  const retimed = restart(scenes.map((scene, index) => (index === 0 ? strengthenOpening(scene) : scene)));
  const last = retimed[retimed.length - 1];
  return {
    ...storyboard,
    id: `${storyboard.id}-vertical-${options.cut}`,
    duration: last.start + last.duration,
    // Douyin replays videos in a loop; ending on the white summary page keeps the loop seamless.
    fadeToBlackSec: 0,
    fadeEndOpacity: 0,
    scenes: retimed,
  };
};

export const countTaughtWordScenes = (storyboard: ReplicaStoryboard, words: readonly string[]) =>
  new Set(storyboard.scenes.map((scene) => wordIndexForScene(scene, words)).filter((index) => index >= 0)).size;
