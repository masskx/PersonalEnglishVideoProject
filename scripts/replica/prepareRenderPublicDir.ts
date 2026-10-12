import {cpSync, existsSync, mkdirSync, readdirSync, statSync} from 'node:fs';
import path from 'node:path';
import type {ReplicaProjectDefinition} from '../../src/replica/projectTypes';

const normalizePublicPath = (value: string) => {
  const normalized = value.replace(/\\/g, '/').replace(/^\/+/, '');
  if (!normalized || normalized.split('/').some((part) => part === '..')) {
    throw new Error(`Unsafe public asset path: ${value}`);
  }
  return normalized;
};

const projectPublicReferences = (project: ReplicaProjectDefinition) => {
  const files = new Set<string>();
  const directories = new Set<string>();
  const addFile = (value: string | undefined) => {
    if (value) files.add(normalizePublicPath(value));
  };

  addFile(project.backgroundMusic.src);
  for (const audio of Object.values(project.audioManifest)) addFile(audio.src);
  for (const scene of project.storyboard.scenes) {
    for (const layer of scene.layers) {
      if (layer.kind === 'image') addFile(layer.src);
    }
    for (const cue of scene.sfx ?? []) addFile(`assets/sfx/${cue.name}.mp3`);
  }
  addFile(project.cover?.illustrationPath);

  for (const directory of Object.values(project.continuousStage?.dynamicAssets ?? {})) {
    directories.add(normalizePublicPath(directory));
  }
  if (project.visualRenderer === 'ject-continuous') {
    for (const name of ['hook', 'direction', 'project', 'inject', 'object', 'subject']) {
      directories.add(`assets/replica/ject-motion/frames/${name}`);
    }
  }
  return {files: [...files], directories: [...directories]};
};

/** Copy only the static files a single composition references into an isolated Remotion public directory. */
export const prepareRenderPublicDir = (
  project: ReplicaProjectDefinition,
  outputDirectory: string,
  repositoryRoot = process.cwd(),
) => {
  const sourceRoot = path.resolve(repositoryRoot, 'public');
  const targetRoot = path.resolve(outputDirectory);
  mkdirSync(targetRoot, {recursive: true});
  const references = projectPublicReferences(project);
  let copiedFiles = 0;
  let copiedBytes = 0;

  const copy = (relativePath: string, recursive: boolean) => {
    const source = path.resolve(sourceRoot, relativePath);
    if (!source.startsWith(`${sourceRoot}${path.sep}`) || !existsSync(source)) {
      throw new Error(`Required render asset is missing from public/: ${relativePath}`);
    }
    const target = path.resolve(targetRoot, relativePath);
    if (!target.startsWith(`${targetRoot}${path.sep}`)) {
      throw new Error(`Unsafe render asset destination: ${relativePath}`);
    }
    mkdirSync(path.dirname(target), {recursive: true});
    cpSync(source, target, {recursive, force: true});
    const stats = statSync(source);
    if (stats.isFile()) {
      copiedFiles += 1;
      copiedBytes += stats.size;
    } else if (recursive) {
      const account = (directory: string) => {
        // Walk only referenced animation directories, never the repository's full public tree.
        for (const entry of readdirSync(directory, {withFileTypes: true})) {
          const entryPath = path.join(directory, entry.name);
          if (entry.isDirectory()) account(entryPath);
          else if (entry.isFile()) {
            copiedFiles += 1;
            copiedBytes += statSync(entryPath).size;
          }
        }
      };
      account(source);
    }
  };

  for (const file of references.files) copy(file, false);
  for (const directory of references.directories) copy(directory, true);
  return {directory: targetRoot, copiedFiles, copiedBytes, ...references};
};
