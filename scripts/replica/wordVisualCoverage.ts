import {existsSync, readFileSync} from 'node:fs';
import path from 'node:path';
import type {ReplicaProjectDefinition} from '../../src/replica/projectTypes';
import type {ReplicaImageLayer} from '../../src/replica/types';
import {verifyPressReplicaAsset} from './assetVerifier';

type PoseState = {id: string; source?: string; prompt?: string; editFromReference?: boolean};
type PoseShot = {
  id: string;
  word?: string;
  sceneId?: string;
  meaning?: string;
  example?: string;
  visualAction?: string;
  purpose?: string;
  reference: string;
  states: PoseState[];
};
type CoveragePlan = {
  schemaVersion: number;
  assetDir: string;
  runtimeAssetDirectoryMustBeEpisodeLocal?: boolean;
  assetProvenance?: {
    assetDir?: string;
    generationMethod?: string;
    referenceAnchor?: string;
    runtimeSourceScan?: string;
    reusedRuntimeSources?: string[];
  };
  shots: PoseShot[];
  visualReview?: {status?: string; reviewer?: string; reviewedAt?: string; notes?: string[]};
};

export type WordVisualCheckOptions = {
  checkAssets: boolean;
  requireVisualReview: boolean;
};

const expectedStates = ['before', 'change', 'result'] as const;
const publicRootPath = (source: string) => source.replace(/\\/g, '/').replace(/^public\//, '');

export const checkWordVisualCoverage = (
  project: ReplicaProjectDefinition,
  repoRoot: string,
  options: WordVisualCheckOptions,
) => {
  const errors: string[] = [];
  const planFile = project.keyposePlan;
  if (!planFile) return {errors: ['Project must define keyposePlan for word-to-visual coverage.'], rows: []};

  const planPath = path.resolve(repoRoot, planFile);
  if (!existsSync(planPath)) return {errors: [`Key-pose plan does not exist: ${planFile}.`], rows: []};

  let plan: CoveragePlan;
  try {
    plan = JSON.parse(readFileSync(planPath, 'utf8')) as CoveragePlan;
  } catch (error) {
    return {errors: [`Cannot read key-pose plan ${planFile}: ${error instanceof Error ? error.message : String(error)}`], rows: []};
  }
  if (plan.schemaVersion !== 1 || !Array.isArray(plan.shots)) {
    return {errors: [`Unsupported or malformed key-pose plan ${planFile}.`], rows: []};
  }

  const wordScenes = project.storyboard.scenes.filter((scene) => scene.id.endsWith('-word'));
  const sceneIds = new Set(wordScenes.map((scene) => scene.id));
  const mappedSceneIds = new Set<string>();
  const words = new Set<string>();
  const shotIds = new Set<string>();
  const assetPaths = new Set<string>();
  const rows: Array<{word: string; sceneId: string; action: string; assets: string[]}> = [];
  if (!plan.assetDir) errors.push('Key-pose plan must define assetDir.');
  const assetDir = path.resolve(repoRoot, plan.assetDir ?? 'public');
  const normalizedAssetDir = path.relative(repoRoot, assetDir).replace(/\\/g, '/').replace(/^public\//, '').replace(/\/$/, '');
  const isWithinEpisodeAssetDir = (source: string) => {
    const normalized = source.replace(/\\/g, '/').replace(/^public\//, '');
    const relative = normalized;
    return relative === normalizedAssetDir || relative.startsWith(`${normalizedAssetDir}/`);
  };
  if (plan.runtimeAssetDirectoryMustBeEpisodeLocal) {
    const provenance = plan.assetProvenance;
    if (!provenance?.assetDir || provenance.assetDir !== plan.assetDir) errors.push('Key-pose plan assetProvenance.assetDir must match assetDir.');
    if (!provenance?.generationMethod) errors.push('Key-pose plan must record assetProvenance.generationMethod.');
    if (!provenance?.referenceAnchor) errors.push('Key-pose plan must record assetProvenance.referenceAnchor.');
    if (!provenance?.runtimeSourceScan) errors.push('Key-pose plan must record assetProvenance.runtimeSourceScan.');
    if (provenance?.reusedRuntimeSources?.length) errors.push(`Runtime source reuse is not allowed: ${provenance.reusedRuntimeSources.join(', ')}.`);
    for (const scene of project.storyboard.scenes) {
      for (const layer of scene.layers) {
        if (layer.kind === 'image' && !isWithinEpisodeAssetDir(layer.src)) {
          errors.push(`${scene.id}/${layer.id}: runtime image source ${layer.src} escapes episode-local assetDir ${plan.assetDir}.`);
        }
      }
    }
    if (project.cover?.illustrationPath && !isWithinEpisodeAssetDir(project.cover.illustrationPath)) {
      errors.push(`Cover illustration ${project.cover.illustrationPath} escapes episode-local assetDir ${plan.assetDir}.`);
    }
  }

  for (const shot of plan.shots) {
    if (!shot.id || !shot.word || !shot.sceneId || !shot.meaning || !shot.example || !shot.visualAction || !shot.purpose) {
      errors.push(`${shot.id || '(unnamed shot)'}: word, sceneId, meaning, example, visualAction and purpose are required.`);
      continue;
    }
    if (shotIds.has(shot.id)) errors.push(`${shot.id}: duplicate shot id.`);
    shotIds.add(shot.id);
    if (words.has(shot.word.toLowerCase())) errors.push(`${shot.word}: duplicate word mapping; each word needs its own semantic pose set.`);
    words.add(shot.word.toLowerCase());
    if (mappedSceneIds.has(shot.sceneId)) errors.push(`${shot.sceneId}: mapped more than once.`);
    mappedSceneIds.add(shot.sceneId);
    if (!sceneIds.has(shot.sceneId)) {
      errors.push(`${shot.word}: storyboard scene ${shot.sceneId} does not exist or is not a word scene.`);
      continue;
    }

    const states = shot.states ?? [];
    const stateIds = states.map((state) => state.id);
    if (stateIds.length !== 3 || expectedStates.some((state, index) => stateIds[index] !== state)) {
      errors.push(`${shot.word}: states must be ordered exactly before, change, result.`);
      continue;
    }
    for (const state of states) {
      if (!state.source && !state.prompt) errors.push(`${shot.word}/${state.id}: requires a source image or edit prompt.`);
      if (state.source && state.prompt && !state.editFromReference) {
        errors.push(`${shot.word}/${state.id}: source plus prompt requires editFromReference:true.`);
      }
      if (state.editFromReference && !state.prompt) errors.push(`${shot.word}/${state.id}: editFromReference requires a prompt.`);
    }
    const referenceFile = path.resolve(repoRoot, shot.reference);
    if (options.checkAssets && !existsSync(referenceFile)) errors.push(`${shot.word}: missing image anchor ${path.relative(repoRoot, referenceFile)}.`);

    const scene = wordScenes.find((item) => item.id === shot.sceneId)!;
    const sceneImages = scene.layers.filter((layer) => layer.kind === 'image' && layer.id.startsWith(`${scene.id}-`));
    if (sceneImages.length !== 3) {
      errors.push(`${shot.word}: ${scene.id} must contain exactly three word key-pose image layers; found ${sceneImages.length}.`);
    }
    const expectedIntervals: Array<{from: number; to: number}> = [];
    for (const state of shot.states) {
      const source = publicRootPath(path.posix.join(path.posix.relative('public', plan.assetDir.replace(/\\/g, '/')), `${shot.id}-${state.id}.png`));
      const key = path.posix.join(path.posix.relative('public', plan.assetDir.replace(/\\/g, '/')), `${shot.id}-${state.id}.png`);
      if (assetPaths.has(key)) errors.push(`${shot.word}/${state.id}: pose asset is reused across words (${key}).`);
      assetPaths.add(key);
      if (plan.runtimeAssetDirectoryMustBeEpisodeLocal && !isWithinEpisodeAssetDir(source)) {
        errors.push(`${shot.word}/${state.id}: plan state source ${source} escapes episode-local assetDir ${plan.assetDir}.`);
      }
      const layer = scene.layers.find(
        (item): item is ReplicaImageLayer => item.kind === 'image' && item.id === `${scene.id}-${state.id}`,
      );
      if (!layer) errors.push(`${shot.word}/${state.id}: missing image layer ${scene.id}-${state.id}.`);
      else {
        if (layer.src.replace(/\\/g, '/') !== source) {
          errors.push(`${shot.word}/${state.id}: layer uses ${layer.src}; plan expects ${source}.`);
        }
        if (layer.enter !== 'none' || layer.exit !== 'none') {
          errors.push(`${shot.word}/${state.id}: key poses must cut directly with enter/exit none.`);
        }
        expectedIntervals.push({from: layer.from, to: layer.from + (layer.duration ?? scene.duration)});
      }
      if (options.checkAssets) {
        const file = path.resolve(assetDir, `${shot.id}-${state.id}.png`);
        if (!existsSync(file)) errors.push(`${shot.word}/${state.id}: missing asset ${path.relative(repoRoot, file)}.`);
        else {
          const verification = verifyPressReplicaAsset(file);
          if (!verification.ok) errors.push(`${shot.word}/${state.id}: asset QA failed: ${verification.errors.join('; ')}.`);
        }
      }
    }
    if (expectedIntervals.length === 3) {
      if (Math.abs(expectedIntervals[0].from) > 0.002) errors.push(`${shot.word}: before pose must start at scene time 0.`);
      for (let index = 1; index < expectedIntervals.length; index += 1) {
        if (Math.abs(expectedIntervals[index].from - expectedIntervals[index - 1].to) > 0.002) {
          errors.push(`${shot.word}: key-pose intervals have a gap or overlap between ${expectedStates[index - 1]} and ${expectedStates[index]}.`);
        }
      }
      if (Math.abs(expectedIntervals[2].to - scene.duration) > 0.002) errors.push(`${shot.word}: result pose must hold to the end of ${scene.id}.`);
    }
    const wordLayer = scene.layers.find((layer) => layer.kind === 'text' && layer.id === `${scene.id}-word`);
    if (!wordLayer) errors.push(`${shot.word}: visible word text layer is missing in ${scene.id}.`);
    rows.push({word: shot.word, sceneId: shot.sceneId, action: shot.visualAction, assets: expectedStates.map((state) => `${shot.id}-${state}.png`)});
  }

  for (const sceneId of sceneIds) if (!mappedSceneIds.has(sceneId)) errors.push(`${sceneId}: no word-to-visual coverage entry.`);
  for (const shot of plan.shots) if (shot.sceneId && !sceneIds.has(shot.sceneId)) errors.push(`${shot.sceneId}: coverage references a non-word scene.`);
  if (options.requireVisualReview && plan.visualReview?.status !== 'approved') {
    errors.push(`White-background visual pose review is ${plan.visualReview?.status ?? 'missing'}; it must be marked approved before rendering.`);
  }
  return {errors, rows};
};
