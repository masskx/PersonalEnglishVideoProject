import {getReplicaProject} from '../../src/replica/projects/registry';
import {checkWordVisualCoverage} from './wordVisualCoverage';

const projectArg = process.argv.slice(2).find((arg) => arg.startsWith('--project='))?.slice('--project='.length);
if (!projectArg) throw new Error('Missing --project=<slug>.');
const planOnly = process.argv.includes('--plan-only');
const project = getReplicaProject(projectArg);
const result = checkWordVisualCoverage(project, process.cwd(), {
  checkAssets: !planOnly,
  requireVisualReview: !planOnly,
});

console.log(`Word-to-visual preflight: ${project.slug} (${planOnly ? 'plan only' : 'assets + review gate'})`);
for (const row of result.rows) console.log(`  ${row.word.padEnd(13)} ${row.sceneId}: ${row.action}`);
for (const error of result.errors) console.error(`ERROR: ${error}`);
if (result.errors.length) process.exit(1);
console.log(`${result.rows.length} word scenes mapped to unique three-pose sets.`);
if (planOnly) console.log('Plan structure and scene bindings pass. Assets still require generation and human white-background review.');
