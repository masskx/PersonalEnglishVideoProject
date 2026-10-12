import {existsSync, mkdirSync, readFileSync, renameSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {resolveDeliveryPaths, type DeliveryProject} from './deliveryPaths';

export type ReleaseStatus = 'draft' | 'approved' | 'published';
type ReleaseUpdate = {
  status: ReleaseStatus;
  platform?: string;
  publishedAt?: string;
  postUrl?: string;
};

/** Called only by an explicit release command; resolving paths never changes publication state. */
export const updateReleaseManifest = (
  project: DeliveryProject,
  update: ReleaseUpdate,
  root = process.cwd(),
) => {
  if (!['draft', 'approved', 'published'].includes(update.status)) {
    throw new Error('Invalid release status; use draft, approved, or published.');
  }
  const current = resolveDeliveryPaths(project, root);
  const previous: Record<string, unknown> = existsSync(current.release)
    ? JSON.parse(readFileSync(current.release, 'utf8'))
    : {};
  if (typeof previous !== 'object' || previous === null || Array.isArray(previous)) {
    throw new Error(`Release manifest must contain a JSON object: ${current.release}`);
  }
  const platforms = previous.platforms ?? [];
  if (!Array.isArray(platforms) || platforms.some((entry) => typeof entry !== 'string')) {
    throw new Error(`Release manifest platforms must be a string array: ${current.release}`);
  }
  const directory = update.status === 'published' ? current.publishedDirectory : current.canonicalDirectory;
  const manifest = {
    ...previous,
    schemaVersion: previous.schemaVersion ?? 1,
    slug: project.slug,
    status: update.status,
    platforms: update.platform ? [...new Set([...platforms, update.platform])] : platforms,
    publishedAt: update.publishedAt ?? previous.publishedAt ?? null,
    postUrl: update.postUrl ?? previous.postUrl ?? null,
    outputVideo: path.basename(current.video),
    updatedAt: new Date().toISOString(),
  };
  if (existsSync(current.directory) && current.directory !== directory) {
    renameSync(current.directory, directory);
  } else {
    mkdirSync(directory, {recursive: true});
  }
  const manifestPath = path.join(directory, 'release.json');
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  return {manifestPath, manifest};
};
