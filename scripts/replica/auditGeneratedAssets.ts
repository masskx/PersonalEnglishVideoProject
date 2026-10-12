import {existsSync, readdirSync, statSync, readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import path from 'node:path';
import {replicaProjects} from '../../src/replica/projects/registry';

const root = process.cwd();
const publicReplica = path.join(root, 'public', 'assets', 'replica');
const referenced = new Set<string>();
const specialized = new Set<string>();
const jectSource = readFileSync(path.join(root, 'src/replica/JectContinuousStage.tsx'), 'utf8');
for (const match of jectSource.matchAll(/['"](assets\/replica\/[^'"]+)\/frames\/[^'"]+['"]/g)) {
  specialized.add(match[1]);
}
for (const project of replicaProjects) {
  for (const asset of Object.values(project.continuousStage?.dynamicAssets ?? {})) {
    referenced.add(asset.replace(/\\/g, '/').replace(/\/frames\/[^/]+$/, ''));
  }
}
const folders = existsSync(publicReplica)
  ? readdirSync(publicReplica, {withFileTypes: true}).filter((entry) => entry.isDirectory())
  : [];
const sizeOf = (target: string): number =>
  statSync(target).isDirectory()
    ? readdirSync(target).reduce((sum, name) => sum + sizeOf(path.join(target, name)), 0)
    : statSync(target).size;
const entries = folders.map((entry) => {
  const relative = `assets/replica/${entry.name}`;
  return {
    path: relative,
    bytes: sizeOf(path.join(publicReplica, entry.name)),
    referencedByDynamicStage: referenced.has(relative),
    referencedBySpecializedStage: specialized.has(relative),
  };
});
const report = {
  generatedAt: new Date().toISOString(),
  totalBytes: entries.reduce((sum, entry) => sum + entry.bytes, 0),
  referencedBytes: entries.filter((e) => e.referencedByDynamicStage || e.referencedBySpecializedStage).reduce((s, e) => s + e.bytes, 0),
  archiveCandidates: entries.filter((entry) => !entry.referencedByDynamicStage && !entry.referencedBySpecializedStage && entry.path.endsWith('-motion')),
  note: 'Candidates require a complete caller audit before any move. No files are moved or deleted by this command.',
  entries,
};
const out = path.join(root, 'docs', 'generated-assets-audit.json');
mkdirSync(path.dirname(out), {recursive: true});
writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(`Asset audit written: ${path.relative(root, out)} (${report.archiveCandidates.length} motion candidate(s)).`);
