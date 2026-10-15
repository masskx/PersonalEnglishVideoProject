import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import {shortLibrary} from '../../src/shorts/library';
import {HOOK_ROTATION, type ShortTimeline} from '../../src/shorts/types';

/**
 * 短视频回归：钩子类型按发布顺序轮换、钩子不用栏目名开场、插图来自来源期、标题字数（抖音 30、小红书 20）、
 * 交付文件夹只放一个视频。v2（默认）另查：结构钩子 → 讲点 → 作答 → 答案（答案即结尾，没有单独收藏拍）、
 * 时间轴 18–30 秒、钩子旁白 ≤ 4.5 秒、作答倒计时 ≥ 2 秒。v1 只为已发布视频存档，不查结构与时长。
 */
const BANNED_OPENINGS = /^(今天|大家好|欢迎|小黑英语|这期)/;
const ids = new Set<string>();
shortLibrary.forEach((short, index) => {
  assert.ok(!ids.has(short.id), `${short.id}: duplicate id`);
  ids.add(short.id);
  assert.equal(short.hookType, HOOK_ROTATION[index % HOOK_ROTATION.length], `${short.id}: hook type must follow the rotation (#${index} → ${HOOK_ROTATION[index % HOOK_ROTATION.length]})`);
  const v2 = (short.version ?? 2) >= 2;
  if (v2) {
    assert.deepEqual(short.body.map((beat) => beat.kind).slice(-2), ['test', 'answer'], `${short.id}: v2 body ends with test → answer (the answer is the ending)`);
    assert.ok(!short.body.some((beat) => beat.kind === 'cta'), `${short.id}: v2 has no separate save/follow beat`);
  }
  const {hook} = short;
  assert.ok(['hook', 'mistake'].includes(hook.kind), `${short.id}: hook kind`);
  if (short.hookType === 'mistake') assert.ok(hook.kind === 'mistake' && hook.wrong && hook.right, `${short.id}: mistake hook needs wrong/right`);
  assert.ok(!BANNED_OPENINGS.test(hook.voice) && !BANNED_OPENINGS.test(hook.headline), `${short.id}: no topic-label opening`);
  assert.ok(hook.art || short.cover?.art, `${short.id}: frame 0 and the covers need Xiaohei`);
  assert.ok(short.category.trim(), `${short.id}: category`);
  assert.ok([...short.publish.title].length <= 30, `${short.id}: Douyin title ≤ 30 chars`);
  assert.ok([...short.publish.xhsTitle].length <= 20, `${short.id}: Xiaohongshu title ≤ 20 chars`);
  const copy = Object.values(short.publish).flat().join(' ');
  assert.ok(!/微信|vx|二维码|https?:\/\//i.test(copy), `${short.id}: no off-platform contact or links`);
  const test = short.body.find((beat) => beat.kind === 'test')!;
  assert.ok(test.options && test.options.length >= 2 && test.correct !== undefined && test.correct < test.options.length, `${short.id}: test options`);
  assert.ok((test.pause ?? 0) >= 2, `${short.id}: test leaves a countdown`);
  for (const beat of [hook, ...short.body, ...(short.cover ? [{id: 'cover', art: short.cover.art}] : [])] as Array<{id: string; art?: string; arts?: string[]}>) {
    for (const art of [beat.art, ...(beat.arts ?? [])]) {
      if (!art) continue;
      assert.ok(art.startsWith(`assets/replica/${short.episode}/`), `${short.id}/${beat.id}: art must come from ${short.episode}`);
      assert.ok(existsSync(`public/${art}`), `${short.id}/${beat.id}: missing public/${art}`);
    }
  }
  const file = `src/shorts/timelines/${short.id}.json`;
  if (existsSync(file)) {
    const timeline = JSON.parse(readFileSync(file, 'utf8')) as ShortTimeline;
    const seconds = timeline.totalFrames / timeline.fps;
    if (v2) {
      assert.ok(seconds >= 18 && seconds <= 30, `${short.id}: ${seconds.toFixed(1)}s outside 18–30 s`);
      assert.ok(timeline.beats[0].audioFrames / timeline.fps <= 4.5, `${short.id}: hook narration ≤ 4.5 s`);
    }
  }
  for (const dir of [`outputs/shorts/${short.id}`, `outputs/shorts/${short.id}发了`]) {
    if (!existsSync(dir)) continue;
    for (const name of ['cover-douyin-vertical.png', 'cover-douyin-landscape.png', 'cover-xiaohongshu.png', 'publish.md', 'release.json', `${short.id}.mp4`]) {
      assert.ok(existsSync(`${dir}/${name}`), `${dir}: missing ${name}`);
    }
  }
});
console.log(`shorts: ${shortLibrary.length} short(s) pass rotation, structure, art, title and duration checks.`);
