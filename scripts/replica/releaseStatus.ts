import path from 'node:path';
import {getReplicaProject} from '../../src/replica/projects/registry';
import {updateReleaseManifest, type ReleaseStatus} from './releaseManifest';

const args = process.argv.slice(2);
const value = (name: string) => args.find((arg) => arg.startsWith(`--${name}=`))?.split('=').slice(1).join('=');
const slug = value('project');
const status = value('status') as ReleaseStatus | undefined;
if (!slug) throw new Error('Missing --project=<slug>.');
if (!status || !['draft', 'approved', 'published'].includes(status)) {
  throw new Error('Missing or invalid --status=draft|approved|published.');
}
const project = getReplicaProject(slug);
const {manifestPath} = updateReleaseManifest(project, {
  status,
  platform: value('platform'),
  publishedAt: value('published-at'),
  postUrl: value('post-url'),
});
console.log(`Release status: ${slug} -> ${status} (${path.relative(process.cwd(), manifestPath)})`);
