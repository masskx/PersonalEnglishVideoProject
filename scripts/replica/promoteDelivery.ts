import {copyFileSync, existsSync, mkdirSync, mkdtempSync, statSync, writeFileSync} from 'node:fs';
import path from 'node:path';

/** Validate every file before replacing any delivery; retain the previous files as a version. */
export const promoteDelivery = (stage: string, destination: string, files: readonly string[], backupRoot: string) => {
  for (const name of files) {
    if (path.basename(name) !== name || name === '.' || name === '..') throw new Error(`Invalid delivery filename: ${name}`);
    const source = path.join(stage, name);
    if (!existsSync(source) || !statSync(source).isFile() || statSync(source).size === 0) throw new Error(`Missing staged delivery: ${source}`);
  }
  mkdirSync(backupRoot, {recursive: true});
  const backup = mkdtempSync(path.join(backupRoot, 'previous-'));
  const previous = files.filter((name) => existsSync(path.join(destination, name)));
  for (const name of previous) copyFileSync(path.join(destination, name), path.join(backup, name));
  writeFileSync(path.join(backup, 'version.json'), JSON.stringify({createdAt: new Date().toISOString(), destination, stage, files, previous}, null, 2) + '\n');
  mkdirSync(destination, {recursive: true});
  for (const name of files) copyFileSync(path.join(stage, name), path.join(destination, name));
  return backup;
};
