import {existsSync, statSync} from 'node:fs';
import path from 'node:path';
import type {ReplicaProjectDefinition} from '../../src/replica/projectTypes';

export type DeliveryProject = Pick<ReplicaProjectDefinition, 'slug' | 'paths'>;

/** Delivery location follows the existing folder, independently of release status metadata. */
export const resolveDeliveryPaths = (project: DeliveryProject, root = process.cwd()) => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug)) {
    throw new Error(`Invalid project slug: ${project.slug}`);
  }
  const canonicalDirectory = path.resolve(root, 'outputs', project.slug);
  const publishedDirectory = `${canonicalDirectory}发了`;
  if (existsSync(canonicalDirectory) && existsSync(publishedDirectory)) {
    throw new Error(
      `Both delivery folders exist; resolve the conflict before continuing: ${canonicalDirectory}, ${publishedDirectory}`,
    );
  }
  const directory = existsSync(publishedDirectory) ? publishedDirectory : canonicalDirectory;
  if (existsSync(directory) && !statSync(directory).isDirectory()) {
    throw new Error(`Delivery path is not a directory: ${directory}`);
  }
  const configuredFile = (configured: string | undefined, fallback: string) =>
    path.join(directory, configured ? path.basename(configured) : fallback);
  const review = path.join(directory, 'review');
  return {
    slug: project.slug,
    directory,
    canonicalDirectory,
    publishedDirectory,
    video: configuredFile(project.paths.outputVideo, `${project.slug}.mp4`),
    cover: configuredFile(project.paths.outputCover, 'cover.png'),
    landscapeCover: configuredFile(project.paths.outputLandscapeCover, 'cover-landscape.png'),
    publishCopy: path.join(directory, 'publish-copy.md'),
    douyinCopy: configuredFile(project.paths.outputDouyinCopy, 'douyin-copy.md'),
    contentQa: path.join(directory, 'content-qa.md'),
    release: path.join(directory, 'release.json'),
    review,
    reviewStills: path.join(review, 'stills'),
    draftVideo: path.resolve(root, 'work', 'drafts', project.slug, 'draft.mp4'),
  };
};
