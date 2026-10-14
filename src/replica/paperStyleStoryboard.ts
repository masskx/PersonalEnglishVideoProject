import type {ReplicaScene, ReplicaStoryboard, ReplicaTextLayer, ReplicaTextRun} from './types';

/**
 * 纸面配色的词页样式（与小红书词卡同一套视觉语言），渲染时统一套用，分镜数据不用手写样式：
 * - 主词：词根橙色 + 荧光笔；
 * - 构词式“in- + clude：关在里面”→ 描边胶囊 + 灰色小字；
 * - 释义：深色大字、左对齐到主词；
 * - 例句层（id 以 -example 结尾）：前面加橙底“例句”标签，关键词橙色下划线。
 * 只认 `<word>-word` 词页约定（见 docs/新会话制作入口.md），其他场景原样返回；重复套用结果不变。
 */
const hasMarks = (runs: readonly ReplicaTextRun[]) => runs.some((run) => run.mark);

const styleWordLayer = (layer: ReplicaTextLayer): ReplicaTextLayer =>
  hasMarks(layer.runs) ? layer : {...layer, runs: layer.runs.map((run) => (run.color === 'accent' ? {...run, mark: 'highlight'} : run))};

const styleFormula = (layer: ReplicaTextLayer): ReplicaTextLayer => {
  if (hasMarks(layer.runs)) return layer;
  const text = layer.runs.map((run) => run.text).join('');
  const [formula, ...rest] = text.split(/[：:]/);
  const note = rest.join('：').trim();
  const size = layer.fontSize ?? 36;
  return {
    ...layer,
    runs: [
      {text: formula.trim(), color: 'primary', mark: 'pill'},
      ...(note ? [{text: note, color: 'muted', size: Math.round(size * 0.86), weight: 700}] : []),
    ],
  };
};

const styleMeaning = (layer: ReplicaTextLayer, wordX: number | undefined): ReplicaTextLayer => ({
  ...layer,
  ...(wordX === undefined ? {} : {x: wordX, align: 'left' as const}),
  runs: layer.runs.map((run) => ({...run, color: 'ink'})),
});

const styleExample = (layer: ReplicaTextLayer): ReplicaTextLayer =>
  hasMarks(layer.runs)
    ? layer
    : {...layer, runs: [{text: '例句', mark: 'tag'}, ...layer.runs.map((run) => (run.color === 'accent' ? {...run, mark: 'underline' as const} : run))]};

const styleScene = (scene: ReplicaScene): ReplicaScene => {
  const word = scene.id.match(/^(.+)-word$/)?.[1];
  if (!word) return scene;
  const wordLayer = scene.layers.find((layer) => layer.id === `${word}-word-word`);
  const wordX = wordLayer?.kind === 'text' ? wordLayer.x : undefined;
  return {
    ...scene,
    layers: scene.layers.map((layer) => {
      if (layer.kind !== 'text') return layer;
      if (layer.id === `${word}-word-word`) return styleWordLayer(layer);
      if (layer.id === `${word}-word-formula`) return styleFormula(layer);
      if (layer.id === `${word}-word-meaning`) return styleMeaning(layer, wordX);
      if (layer.id.endsWith('-example')) return styleExample(layer);
      return layer;
    }),
  };
};

export const applyPaperStyle = (storyboard: ReplicaStoryboard): ReplicaStoryboard => ({
  ...storyboard,
  scenes: storyboard.scenes.map(styleScene),
});
