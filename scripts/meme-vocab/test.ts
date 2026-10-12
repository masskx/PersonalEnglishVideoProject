import assert from 'node:assert/strict';
import {buildHooks, defaultMemeVocabInput} from '../../src/meme-vocab/content';
import {buildMemeVocabConfig} from '../../src/meme-vocab/config';
import {buildShortStoryboard} from '../../src/meme-vocab/storyboard';
import {buildResolvedTimeline} from '../../src/meme-vocab/timeline';

const input = defaultMemeVocabInput();
const hooks = buildHooks(input);
const storyboard = buildShortStoryboard(input);
const config = buildMemeVocabConfig(input);
assert.equal(hooks.length, 3);
assert.deepEqual(hooks.map((hook) => hook.angle), ['pain-point', 'plot-conflict', 'test-challenge']);
assert.equal(storyboard.scenes[0].sceneType, 'hook');
assert.equal(storyboard.scenes.at(-1)?.sceneType, 'quiz_cta');
assert.ok(storyboard.duration >= 15 && storyboard.duration <= 28);
assert.equal(storyboard.scenes.at(-1)?.quizAnswer, 'disrupt');
assert.ok(!storyboard.scenes.slice(0, -1).some((scene) => `${scene.narration} ${scene.displayText.join(' ')}`.includes('disrupt')));
assert.equal(config.storyboard.width, 1080);
assert.equal(config.storyboard.height, 1920);
assert.equal(config.estimatedTimeline.source, 'estimated');
assert.equal(config.resolvedTimeline.source, 'estimated');
const resolved = buildResolvedTimeline(storyboard, storyboard.scenes.map((scene, index) => ({
  segmentId: `segment-${index}`,
  sceneId: scene.sceneId,
  text: scene.ttsText,
  audioPath: `assets/audio/${index}.wav`,
  outputAudioPath: `audio/${index}.wav`,
  startTime: 0,
  duration: [1.4, 2.1, 5.2, 2.8, 3.2][index],
  endTime: [1.4, 2.1, 5.2, 2.8, 3.2][index],
  leadingSilence: 0,
  trailingSilence: 0,
  speakingRate: 4,
  status: 'resolved' as const,
})));
assert.equal(resolved.source, 'tts-resolved');
assert.equal(resolved.scenes[0].startFrame, 0);
assert.ok(resolved.scenes.every((scene) => Number.isInteger(scene.startFrame) && Number.isInteger(scene.durationInFrames)));
assert.ok((resolved.scenes.at(-1)?.quizHoldFrames ?? 0) >= 45);
assert.throws(() => buildResolvedTimeline(storyboard, storyboard.scenes.map((scene, index) => ({
  segmentId: `over-limit-${index}`,
  sceneId: scene.sceneId,
  text: scene.ttsText,
  audioPath: `assets/audio/${index}.wav`,
  outputAudioPath: `audio/${index}.wav`,
  startTime: 0,
  duration: index === 2 ? 6.01 : 1.4,
  endTime: index === 2 ? 6.01 : 1.4,
  leadingSilence: 0,
  trailingSilence: 0,
  speakingRate: 4,
  status: 'resolved' as const,
}))), /hard 6s limit/);
assert.ok(config.assets.assets.every((asset) => asset.status === 'placeholder' || asset.status === 'available' || asset.status === 'missing'));
console.log('tests passed: hooks, storyboard, answer gating, estimated/resolved timelines, quiz hold, vertical config, and asset statuses.');
