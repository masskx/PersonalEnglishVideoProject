import growth from '../../../planning/growth-promotion.json';
import type {ReplicaProjectDefinition} from '../projectTypes';
import type {ReplicaScene} from '../types';
import type {VerticalReplicaVideoProps} from './VerticalReplicaVideo';
import {buildVerticalStoryboard, countTaughtWordScenes, wordIndexForScene, type VerticalCut} from './verticalLayout';

const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));

export const verticalCompositionId = (project: ReplicaProjectDefinition, cut: VerticalCut) =>
  `${project.compositionId}${cut === 'teaser' ? 'VerticalTeaser' : 'Vertical'}`;

/** A teaser needs at least one taught word after the preview words, otherwise there is nothing to tease. */
export const supportsTeaser = (project: ReplicaProjectDefinition) =>
  !!project.cover && countTaughtWordScenes(project.storyboard, project.cover.words) > growth.vertical.teaser.wordScenes;

const teaserTail = (project: ReplicaProjectDefinition, remaining: number): ReplicaScene => {
  const series = growth.series.name;
  const primary = fill(growth.cta.teaserEndCard.primary, {remaining, series});
  const secondary = fill(growth.cta.teaserEndCard.secondary, {remaining, series});
  return {
    id: 'vertical-teaser-tail',
    start: 0,
    duration: 3.4,
    narration: '',
    captions: [],
    sfx: [{at: 0.08, name: 'pop', volume: 0.12}],
    layers: [
      {kind: 'text', id: 'tail-primary', from: 0, enter: 'smooth-rise', enterDuration: 0.35, x: 0, y: 100, width: 1600, fontSize: 64, fontWeight: 880, align: 'center',
        runs: [{text: primary, color: 'accent'}]},
      {kind: 'text', id: 'tail-secondary', from: 0.45, enter: 'smooth-reveal', enterDuration: 0.35, x: 0, y: 260, width: 1600, fontSize: 44, fontWeight: 800, align: 'center',
        runs: [{text: secondary, color: 'primary'}]},
      {kind: 'image', id: 'tail-art', src: project.cover!.illustrationPath, from: 0.2, enter: 'smooth-rise', enterDuration: 0.35, x: 0, y: 400, width: 900, height: 600,
        fit: project.cover!.illustrationFit ?? 'contain', contentScale: project.cover!.illustrationScale ?? 1},
    ],
  };
};

export const buildVerticalProps = (project: ReplicaProjectDefinition, cut: VerticalCut): VerticalReplicaVideoProps => {
  if (!project.cover) throw new Error(`Project ${project.slug} has no cover; vertical renders reuse its title and word list.`);
  const words = project.cover.words;
  const taught = countTaughtWordScenes(project.storyboard, words);
  const shown = Math.min(growth.vertical.teaser.wordScenes, taught);
  const storyboard = buildVerticalStoryboard(project.storyboard, {
    cut,
    words,
    teaserWordScenes: growth.vertical.teaser.wordScenes,
    teaserIncludeRootMap: growth.vertical.teaser.includeRootMap,
    teaserTail: cut === 'teaser' ? teaserTail(project, Math.max(1, words.length - shown)) : undefined,
  });
  return {storyboard, audioManifest: project.audioManifest, backgroundMusic: project.backgroundMusic, cover: project.cover, cut};
};

export const reviewCardFrame = (props: VerticalReplicaVideoProps) => {
  // Final summary page, shortly before the end, after every row has revealed.
  const last = props.storyboard.scenes[props.storyboard.scenes.length - 1];
  return Math.max(0, Math.round((last.start + last.duration - 0.6) * 30));
};

export const describeVerticalCut = (project: ReplicaProjectDefinition, cut: VerticalCut) => {
  const props = buildVerticalProps(project, cut);
  return {
    compositionId: verticalCompositionId(project, cut),
    durationSec: props.storyboard.duration,
    scenes: props.storyboard.scenes.map((scene) => ({
      id: scene.id,
      start: Number(scene.start.toFixed(2)),
      word: wordIndexForScene(scene, props.cover.words) >= 0 ? props.cover.words[wordIndexForScene(scene, props.cover.words)] : null,
    })),
  };
};

/** The taught words a teaser actually previews, in on-screen order (used by the publish copy). */
export const teaserWordList = (project: ReplicaProjectDefinition) => {
  if (!project.cover || !supportsTeaser(project)) return [];
  const words = project.cover.words;
  const indices = buildVerticalProps(project, 'teaser').storyboard.scenes.slice(1)
    .map((scene) => wordIndexForScene(scene, words))
    .filter((index, position, all) => index >= 0 && all.indexOf(index) === position);
  return indices.map((index) => words[index]);
};
