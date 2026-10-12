import path from 'node:path';
import {getReplicaProject, replicaProjects} from '../../src/replica/projects/registry';
import {writeDouyinCopy} from './douyinCopy';

const args = process.argv.slice(2);
const projectArg = args.find((arg) => arg.startsWith('--project='))?.slice('--project='.length);
const outputArg = args.find((arg) => arg.startsWith('--output='))?.slice('--output='.length);
const all = args.includes('--all');

if (!projectArg && !all) {
  throw new Error('Missing --project=<slug> or --all.');
}
if (projectArg && all) {
  throw new Error('Use either --project=<slug> or --all, not both.');
}
if (all && outputArg) {
  throw new Error('--output can only be used with --project=<slug>.');
}

const projects = all ? replicaProjects : [getReplicaProject(projectArg!)];
for (const project of projects) {
  const output = writeDouyinCopy(project, outputArg);
  console.log(`Generated ${project.slug} Douyin copy: ${path.relative(process.cwd(), output)}.`);
}
