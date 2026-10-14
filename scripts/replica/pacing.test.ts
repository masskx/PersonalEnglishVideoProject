import assert from 'node:assert/strict';
import {replicaProjects, getReplicaProject} from '../../src/replica/projects/registry';
import {buildContinuousStage} from '../../src/replica/autoContinuousStage';
import {measurePacing, PACING_LEGACY_EPISODES} from '../../src/replica/pacing';

/**
 * 模板与节奏回归：
 * 1. buildContinuousStage 必须复现 ten-tain 手写的词素组装与版式（模板没有走样）；
 * 2. 基准 ten-tain 必须通过节奏闸门（阈值没有被调到连基准都过不了）；
 * 3. 2026-10-14 之后的每一期都用连续舞台并通过节奏闸门。
 */
const tenTain = getReplicaProject('ten-tain');
const auto = buildContinuousStage(tenTain.storyboard, tenTain.cover!);
for (const [sceneId, plan] of Object.entries(tenTain.continuousStage!.scenePlans!)) {
  if (!plan.wordBuild) continue;
  const generated = auto.scenePlans![sceneId];
  assert.deepEqual([generated.layout, generated.wordBuild], [plan.layout, plan.wordBuild], `${sceneId}: auto stage differs from ten-tain`);
}
assert.deepEqual(measurePacing(tenTain.storyboard).errors, [], 'ten-tain baseline must pass the pacing gate');

const current = replicaProjects.filter((project) => !PACING_LEGACY_EPISODES.has(project.slug));
for (const project of current) {
  assert.equal(project.visualRenderer, 'continuous', `${project.slug}: new episodes use the ten-tain continuous stage`);
  assert.deepEqual(measurePacing(project.storyboard).errors, [], `${project.slug}: pacing gate`);
}
console.log(`pacing: ten-tain template reproduced; ${current.length} current episode(s) pass (${current.map((p) => p.slug).join(', ')}).`);
