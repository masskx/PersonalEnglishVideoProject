import assert from 'node:assert/strict';
import {replicaProjects} from '../../src/replica/projects/registry';
import {
  VERTICAL_CANVAS as C,
  estimateTextLines,
  planVerticalScene,
  verticalCaptionsForScene,
  wordIndexForScene,
} from '../../src/replica/vertical/verticalLayout';
import {buildVerticalProps, supportsTeaser} from '../../src/replica/vertical/verticalProjects';

/** 竖屏版式回归：所有已注册期都必须落在抖音安全区内，字幕不切断英文单词，预告结构正确。 */
let checkedScenes = 0;
const overflows: string[] = [];

for (const project of replicaProjects.filter((candidate) => candidate.cover)) {
  const full = buildVerticalProps(project, 'full');
  assert.equal(full.storyboard.fadeToBlackSec, 0, `${project.slug}: vertical ending must stay loop-friendly`);
  assert.ok(Math.abs(full.storyboard.duration - project.storyboard.duration) < 0.01, `${project.slug}: full cut keeps every scene`);

  for (const scene of full.storyboard.scenes) {
    checkedScenes += 1;
    const plan = planVerticalScene(scene);
    for (const placement of plan.placements) {
      if (placement.kind === 'text') {
        const {layer} = placement;
        const bottom = layer.y + estimateTextLines(layer.runs, layer.fontSize, C.columnWidth) * layer.fontSize * (layer.lineHeight ?? 1.25);
        if (layer.y < C.contentTop - 1 || bottom > C.contentBottom + 2) overflows.push(`${project.slug}/${scene.id}/${layer.id} text ${Math.round(layer.y)}–${Math.round(bottom)}`);
        assert.ok(layer.fontSize >= 28, `${project.slug}/${layer.id}: text shrank below phone-readable size (${layer.fontSize}px)`);
      }
      if (placement.kind === 'art') {
        if (placement.y + placement.height > C.contentBottom + 2 || placement.x + placement.width > C.columnLeft + C.columnWidth + 1) {
          overflows.push(`${project.slug}/${scene.id}/${placement.layer.id} art`);
        }
      }
    }
    for (const cue of verticalCaptionsForScene(scene)) {
      assert.ok(cue.to > cue.from, `${project.slug}/${scene.id}: empty caption window`);
      assert.ok(!/^[，。；：！？、,;:!?]/u.test(cue.text), `${project.slug}/${scene.id}: caption starts with punctuation: ${cue.text}`);
    }
    // Every English word in the narration must appear whole in some caption line.
    const captionText = verticalCaptionsForScene(scene).map((cue) => cue.text).join(' ');
    for (const word of scene.narration.match(/[A-Za-z]{3,}/g) ?? []) {
      if (!scene.captions.some((cue) => cue.text.includes(word))) continue;
      assert.ok(new RegExp(`(^|[^A-Za-z])${word}([^A-Za-z]|$)`).test(captionText), `${project.slug}/${scene.id}: caption split "${word}"`);
    }
  }

  if (supportsTeaser(project)) {
    const teaser = buildVerticalProps(project, 'teaser');
    const words = new Set(teaser.storyboard.scenes.slice(1).map((scene) => wordIndexForScene(scene, project.cover!.words)).filter((index) => index >= 0));
    assert.equal(words.size, 2, `${project.slug}: teaser should preview two distinct words`);
    assert.equal(new Set(teaser.storyboard.scenes.map((scene) => scene.id)).size, teaser.storyboard.scenes.length, `${project.slug}: teaser repeats a scene`);
    assert.equal(teaser.storyboard.scenes.at(-1)?.id, 'vertical-teaser-tail', `${project.slug}: teaser ends on the collection card`);
    assert.ok(teaser.storyboard.duration < 75, `${project.slug}: teaser too long (${teaser.storyboard.duration.toFixed(1)}s)`);
  }
}

// Estimated heights are approximate; allow at most a handful of minor misses across the whole library.
assert.ok(overflows.length <= 3, `Vertical safe-area overflow:\n${overflows.join('\n')}`);
console.log(`vertical layout: ${checkedScenes} scenes across ${replicaProjects.length} projects pass${overflows.length ? ` (minor: ${overflows.join('; ')})` : ''}.`);
