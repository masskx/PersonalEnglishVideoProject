import assert from 'node:assert/strict';
import {existsSync, mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, writeFileSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {resolveDeliveryPaths} from './deliveryPaths';
import {updateReleaseManifest} from './releaseManifest';
import {promoteDelivery} from './promoteDelivery';

const root = mkdtempSync(path.join(os.tmpdir(), 'xiaohei-management-'));
const project = {slug: 'test-episode', paths: {
  audioManifestFile: '', publicAudioDir: '', greenSourceDir: '', alphaAssetDir: '',
  outputVideo: 'outputs/test-episode/test-episode.mp4',
  outputCover: 'outputs/test-episode/cover.png', outputLandscapeCover: 'outputs/test-episode/cover-landscape.png',
}};
try {
  const initial = resolveDeliveryPaths(project, root);
  assert.equal(initial.directory, path.join(root, 'outputs/test-episode'));
  assert.equal(initial.draftVideo, path.join(root, 'work/drafts/test-episode/draft.mp4'));
  assert.equal(initial.reviewStills, path.join(initial.directory, 'review/stills'));
  mkdirSync(initial.directory, {recursive: true});
  writeFileSync(initial.video, 'unchanged-final-video');
  writeFileSync(initial.release, JSON.stringify({slug: project.slug, status: 'draft', qa: {manual: 'pending'}, note: 'keep this', platforms: []}));
  const published = updateReleaseManifest(project, {status: 'published', platform: 'douyin', postUrl: 'https://example.com/post'}, root);
  assert.ok(!existsSync(initial.directory));
  const resolved = resolveDeliveryPaths(project, root);
  assert.equal(resolved.directory, initial.publishedDirectory);
  assert.equal(readFileSync(resolved.video, 'utf8'), 'unchanged-final-video');
  assert.deepEqual(JSON.parse(readFileSync(published.manifestPath, 'utf8')).qa, {manual: 'pending'});
  assert.equal(JSON.parse(readFileSync(published.manifestPath, 'utf8')).note, 'keep this');
  updateReleaseManifest(project, {status: 'published', platform: 'douyin'}, root);
  assert.deepEqual(JSON.parse(readFileSync(resolved.release, 'utf8')).platforms, ['douyin']);
  const restored = updateReleaseManifest(project, {status: 'approved'}, root);
  assert.ok(existsSync(initial.directory));
  assert.ok(!existsSync(initial.publishedDirectory));
  assert.equal(restored.manifest.postUrl, 'https://example.com/post');
  assert.deepEqual(JSON.parse(readFileSync(restored.manifestPath, 'utf8')).qa, {manual: 'pending'});
  mkdirSync(initial.publishedDirectory);
  assert.throws(() => resolveDeliveryPaths(project, root), /Both delivery folders/);
  assert.throws(() => updateReleaseManifest(project, {status: 'published'}, root), /Both delivery folders/);
  assert.equal(readFileSync(initial.video, 'utf8'), 'unchanged-final-video');
  renameSync(initial.publishedDirectory, path.join(root, 'unused-empty-folder'));

  const stage = path.join(root, 'stage');
  mkdirSync(stage);
  writeFileSync(path.join(stage, 'test-episode.mp4'), 'new-final');
  assert.throws(() => promoteDelivery(stage, initial.directory, ['test-episode.mp4', 'cover.png'], path.join(root, 'backups')), /Missing staged/);
  assert.equal(readFileSync(initial.video, 'utf8'), 'unchanged-final-video');
  writeFileSync(path.join(stage, 'cover.png'), 'new-cover');
  const backup = promoteDelivery(stage, initial.directory, ['test-episode.mp4', 'cover.png'], path.join(root, 'backups'));
  assert.equal(readFileSync(path.join(backup, 'test-episode.mp4'), 'utf8'), 'unchanged-final-video');
  assert.equal(readFileSync(initial.video, 'utf8'), 'new-final');
  assert.equal(JSON.parse(readFileSync(initial.release, 'utf8')).status, 'approved');
  assert.throws(() => promoteDelivery(stage, initial.directory, ['../bad'], path.join(root, 'backups')), /Invalid delivery/);
  const qaDirectory = path.join(root, 'outputs/rupt发了');
  mkdirSync(qaDirectory, {recursive: true});
  const qa = path.join(qaDirectory, 'content-qa.md');
  writeFileSync(qa, 'Human-reviewed notes that must survive regeneration');
  const qaRun = spawnSync(process.execPath, [path.resolve('node_modules/tsx/dist/cli.mjs'), path.resolve('scripts/replica/generateContentQa.ts'), '--project=rupt'], {cwd: root, encoding: 'utf8', windowsHide: true});
  assert.equal(qaRun.status, 0, qaRun.stderr);
  assert.equal(readFileSync(qa, 'utf8'), 'Human-reviewed notes that must survive regeneration');
  assert.ok(!existsSync(path.join(root, 'outputs/rupt')));
  console.log('PASS: published/canonical paths, conflict refusal, status round-trip, custom metadata, draft/review placement, complete staged delivery and previous-version preservation.');
} finally {
  const verified = path.resolve(root);
  const temp = path.resolve(os.tmpdir());
  if (path.dirname(verified) !== temp || !path.basename(verified).startsWith('xiaohei-management-')) throw new Error('Unexpected temporary test directory');
  rmSync(verified, {recursive: true, force: true});
}
