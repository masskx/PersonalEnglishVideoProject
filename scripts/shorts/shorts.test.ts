import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import {shortLibrary} from '../../src/shorts/library';
import type {ShortTimeline} from '../../src/shorts/types';

/**
 * 抖音短视频回归：结构（钩子 A/B → 讲点 → 作答 → 答案 → 收藏）、插图来自来源期、钩子不用栏目名开场、
 * 已生成的时间轴时长 30–45 秒、作答节拍留出倒计时。
 */
const BANNED_OPENINGS = /^(今天|大家好|欢迎|小黑英语|这期)/;
for (const short of shortLibrary) {
  const kinds = short.body.map((beat) => beat.kind);
  assert.deepEqual(kinds.slice(-3), ['test', 'answer', 'cta'], `${short.id}: body ends with test → answer → cta`);
  for (const variant of ['A', 'B'] as const) {
    const hook = short.hooks[variant];
    assert.ok(['hook', 'mistake'].includes(hook.kind), `${short.id}-${variant}: hook kind`);
    assert.ok(!BANNED_OPENINGS.test(hook.voice) && !BANNED_OPENINGS.test(hook.headline), `${short.id}-${variant}: no topic-label opening`);
    assert.ok(hook.art || hook.wrong, `${short.id}-${variant}: frame 0 needs Xiaohei or a mistake card`);
    assert.ok(short.publish.titles[variant].length <= 30, `${short.id}-${variant}: title ≤ 30 chars`);
  }
  const test = short.body.find((beat) => beat.kind === 'test')!;
  assert.ok(test.options && test.options.length >= 2 && test.correct !== undefined && test.correct < test.options.length, `${short.id}: test options`);
  assert.ok((test.pause ?? 0) >= 2, `${short.id}: test leaves a countdown`);
  for (const beat of [short.hooks.A, short.hooks.B, ...short.body]) {
    for (const art of [beat.art, ...(beat.arts ?? [])]) {
      if (!art) continue;
      assert.ok(art.startsWith(`assets/replica/${short.episode}/`), `${short.id}/${beat.id}: art must come from ${short.episode}`);
      assert.ok(existsSync(`public/${art}`), `${short.id}/${beat.id}: missing public/${art}`);
    }
  }
  for (const variant of ['A', 'B']) {
    const file = `src/shorts/timelines/${short.id}-${variant}.json`;
    if (!existsSync(file)) continue;
    const timeline = JSON.parse(readFileSync(file, 'utf8')) as ShortTimeline;
    const seconds = timeline.totalFrames / timeline.fps;
    assert.ok(seconds >= 25 && seconds <= 45, `${short.id}-${variant}: ${seconds.toFixed(1)}s outside 25–45 s`);
    assert.ok(timeline.beats[0].audioFrames / timeline.fps <= 6, `${short.id}-${variant}: hook narration ≤ 6 s`);
  }
}
console.log(`shorts: ${shortLibrary.length} short(s) pass structure, art and duration checks.`);
