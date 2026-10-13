import type {ReplicaProjectDefinition} from '../projectTypes';
import type {ReplicaImageLayer, ReplicaScene, ReplicaTextLayer} from '../types';
import {wordIndexForScene} from '../vertical/verticalLayout';

/**
 * 小红书图文笔记数据：从已完成的词根期抽取每个词的拆分、释义、小黑结果姿态和例句。
 * 不调用任何外部服务，不新增讲解内容；抽取不到的字段留空，卡片自动省略该行。
 */
export type XhsWordCard = {
  word: string;
  highlight: string;
  formula?: string;
  gloss?: string;
  meaning?: string;
  art?: string;
  example?: string;
};

export type XhsDeck = {
  slug: string;
  series: string;
  root: string;
  englishMeaning: string;
  chineseMeaning: string;
  hook: string;
  familyLabel?: string;
  heroArt: string;
  words: XhsWordCard[];
};

const textOf = (layer: ReplicaTextLayer) => layer.runs.map((run) => run.text).join('').trim();
const isCjk = (value: string) => /[一-鿿]/u.test(value);

/** English phrase from the narration that uses the word, e.g. “The box contains six books”. */
export const exampleFromNarration = (narration: string, word: string) => {
  const stem = word.toLocaleLowerCase().replace(/e$/, '');
  const phrases = (narration.match(/[A-Za-z][A-Za-z'’-]*(?:[ ,]+[A-Za-z][A-Za-z'’-]*)*/g) ?? [])
    .map((phrase) => phrase.replace(/[ ,]+$/, '').trim())
    .filter((phrase) => phrase.toLocaleLowerCase().includes(stem) && phrase.split(/\s+/).length >= 2);
  return phrases.find((phrase) => phrase.split(/\s+/).length >= 3) ?? phrases.sort((a, b) => b.length - a.length)[0];
};

const wordCardFromScene = (scene: ReplicaScene | undefined, word: string, highlight: string): XhsWordCard => {
  if (!scene) return {word, highlight};
  const texts = scene.layers
    .filter((layer): layer is ReplicaTextLayer => layer.kind === 'text')
    .sort((a, b) => a.y - b.y)
    .map(textOf)
    .filter((text) => text && text.toLocaleLowerCase().replace(/\s+/g, '') !== word.toLocaleLowerCase());
  const formulaLine = texts.find((text) => /[+→]/.test(text));
  const [formula, gloss] = formulaLine?.includes('：') ? formulaLine.split('：', 2) : [formulaLine, undefined];
  const meaning = texts.find((text) => text !== formulaLine && isCjk(text) && text.length <= 18);
  const images = scene.layers.filter((layer): layer is ReplicaImageLayer => layer.kind === 'image');
  const art = (images.find((layer) => /result/i.test(layer.src)) ?? [...images].sort((a, b) => b.from - a.from)[0])?.src;
  return {word, highlight, formula: formula?.trim(), gloss: gloss?.trim(), meaning, art, example: exampleFromNarration(scene.narration, word)};
};

export const buildXhsDeck = (project: ReplicaProjectDefinition, series: string): XhsDeck => {
  const cover = project.cover;
  if (!cover) throw new Error(`${project.slug} has no cover data; Xiaohongshu cards reuse its title and word list.`);
  const rootTail = cover.root.split('/').pop()!.trim().toLocaleLowerCase();
  const words = cover.words.map((word, index) => {
    const scene = project.storyboard.scenes.find((candidate) => wordIndexForScene(candidate, cover.words) === index);
    return wordCardFromScene(scene, word, cover.wordHighlights?.[index] ?? rootTail);
  });
  return {
    slug: project.slug,
    series,
    root: cover.root,
    englishMeaning: cover.englishMeaning,
    chineseMeaning: cover.chineseMeaning,
    hook: cover.hook,
    familyLabel: cover.familyLabel,
    heroArt: cover.illustrationPath,
    words,
  };
};

export type XhsCardSpec =
  | {kind: 'cover'}
  | {kind: 'word'; index: number}
  | {kind: 'summary'}
  | {kind: 'quiz'}
  | {kind: 'end'};

/** Carousel order: cover → one card per word → one-page summary → self-test → follow card (≤ 18 images). */
export const xhsCardSequence = (deck: XhsDeck): XhsCardSpec[] => [
  {kind: 'cover'},
  ...deck.words.map((_, index) => ({kind: 'word' as const, index})),
  {kind: 'summary'},
  {kind: 'quiz'},
  {kind: 'end'},
];
