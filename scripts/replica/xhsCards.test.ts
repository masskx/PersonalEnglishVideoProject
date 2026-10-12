import assert from 'node:assert/strict';
import {replicaProjects} from '../../src/replica/projects/registry';
import {buildXhsDeck, exampleFromNarration, xhsCardSequence} from '../../src/replica/xhs/xhsCardData';
import {buildXhsNote} from '../../src/replica/xhs/xhsNote';

/** 小红书卡片回归：当前基准期（有关键姿态计划）每个词都要有拆分、释义、插图；卡片数不超过 18。 */
assert.equal(exampleFromNarration('The box contains six books，说的就是盒子', 'contain'), 'The box contains six books');
assert.equal(exampleFromNarration('retain information，就是把信息记住', 'retain'), 'retain information');

let checked = 0;
const gaps: string[] = [];
for (const project of replicaProjects.filter((candidate) => candidate.cover)) {
  const deck = buildXhsDeck(project, '小黑拆词根');
  const cards = xhsCardSequence(deck);
  assert.ok(cards.length <= 18, `${project.slug}: ${cards.length} cards exceed Xiaohongshu's 18-image limit`);
  // Only the postable part (titles + body), not the publishing reminders below it.
  const note = buildXhsNote(deck).split('## 发布备注')[0];
  assert.ok(!/微信|vx|二维码|https?:\/\//i.test(note), `${project.slug}: note must not contain off-platform contact or links`);
  assert.ok(!/#[^\s#]*\//.test(note), `${project.slug}: hashtags must not contain slashes`);
  for (const word of deck.words) {
    checked += 1;
    const missing = (['formula', 'meaning', 'art'] as const).filter((field) => !word[field]);
    if (missing.length) gaps.push(`${project.slug}/${word.word}: ${missing.join(',')}`);
    // Current-baseline episodes (reviewed keypose plans) must be complete; legacy ones may be partial.
    if (project.keyposePlan) assert.deepEqual(missing, [], `${project.slug}/${word.word} is missing ${missing.join(', ')}`);
  }
}
console.log(`xhs cards: ${checked} words checked; current-baseline episodes complete${gaps.length ? `; legacy gaps: ${gaps.length}` : ''}.`);
