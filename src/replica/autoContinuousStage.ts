import type {ContinuousScenePlan, ContinuousSceneMotion, ContinuousStageDefinition, ReplicaCoverDefinition} from './projectTypes';
import type {ReplicaStoryboard} from './types';

/**
 * 从分镜自动生成 ten-tain 同款连续舞台（新词根期的默认渲染方式）。
 * 不用手写 scenePlans：按约定识别词页并配置词素组装、左右版式和动作时点。
 *
 * 约定（与 ten-tain / clud-clus 分镜一致）：
 * - 词页 id 为 `<word>-word`，主词文字层 id 为 `<word>-word-word`；
 * - 词页三态图片层 id 以 `-before` / `-change` / `-result` 结尾；
 * - 主词在右半屏（x ≥ 960）为 text-right，否则 text-left（居中的主词按 text-left 处理，与 ten-tain 相同）。
 */
const MOTION_CYCLE: readonly ContinuousSceneMotion[] = ['up', 'right', 'in', 'right', 'press', 'up', 'right', 'left'];

const splitWord = (word: string, highlight: string | undefined) => {
  const index = highlight ? word.toLowerCase().indexOf(highlight.toLowerCase()) : -1;
  if (index < 0) return null;
  return {prefix: word.slice(0, index), root: word.slice(index, index + highlight!.length), suffix: word.slice(index + highlight!.length)};
};

export const buildContinuousStage = (
  storyboard: ReplicaStoryboard,
  cover: ReplicaCoverDefinition,
): ContinuousStageDefinition => {
  const sceneMotion: Record<string, ContinuousSceneMotion> = {};
  const scenePlans: Record<string, ContinuousScenePlan> = {};
  let wordIndex = 0;
  storyboard.scenes.forEach((scene, index) => {
    const isFirst = index === 0;
    const isLast = index === storyboard.scenes.length - 1;
    const word = cover.words.find((candidate) => scene.id === `${candidate}-word`);
    const result = scene.layers.find((layer) => layer.kind === 'image' && layer.id.endsWith('-result') && layer.from > 0);
    const actionAt = result ? Math.max(0.5, result.from - 0.4) : Math.min(scene.duration * 0.45, 5);
    if (!word) {
      sceneMotion[scene.id] = isFirst ? 'in' : isLast ? 'still' : index % 2 ? 'out' : 'in';
      scenePlans[scene.id] = {
        actionAt,
        action: isFirst ? 'enter-view' : isLast ? 'gather' : /practice|quiz/.test(scene.id) ? 'focus' : 'compare',
        camera: isFirst ? 'in' : 'out',
      };
      return;
    }
    const wordLayer = scene.layers.find((layer) => layer.id === `${word}-word-word`);
    const parts = splitWord(word, cover.wordHighlights?.[cover.words.indexOf(word)]);
    sceneMotion[scene.id] = MOTION_CYCLE[wordIndex % MOTION_CYCLE.length];
    wordIndex += 1;
    scenePlans[scene.id] = {
      actionAt,
      action: 'present-proof',
      camera: 'in',
      ...(wordLayer && parts
        ? {layout: wordLayer.x >= 960 ? 'text-right' as const : 'text-left' as const, wordBuild: {layerId: wordLayer.id, ...parts, at: 0.28}}
        : {}),
    };
  });
  return {
    staticCardMode: true,
    staticImageOpacity: 0.9,
    showSemanticPropOverlay: false,
    root: cover.root.toLowerCase(),
    meaning: cover.englishMeaning.toLowerCase().replace(/\s*·\s*/g, ' / '),
    sceneMotion,
    scenePlans,
  };
};
