import {spawnSync} from 'node:child_process';
import path from 'node:path';

type Stage = 'plan' | 'assemble' | 'deliver';

const args = process.argv.slice(2);
const value = (name: string) =>
  args.find((arg) => arg.startsWith(`--${name}=`))?.split('=').slice(1).join('=');
const project = value('project');
const stage = (value('stage') ?? 'assemble') as Stage;

if (!project) throw new Error('Missing --project=<slug>.');
if (!['plan', 'assemble', 'deliver'].includes(stage)) {
  throw new Error('Invalid --stage. Use plan, assemble, or deliver.');
}

const npmCli =
  process.env.npm_execpath ??
  path.resolve(path.dirname(process.execPath), 'node_modules', 'npm', 'bin', 'npm-cli.js');
const run = (script: string, scriptArgs: string[]) => {
  console.log(`\n[production] ${script} ${scriptArgs.join(' ')}`);
  const result = spawnSync(process.execPath, [npmCli, 'run', script, '--', ...scriptArgs], {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit',
    windowsHide: true,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${script} failed with exit code ${result.status ?? 'unknown'}.`);
  }
};

if (stage === 'plan') {
  run('replica:preflight', [`--project=${project}`, '--plan-only']);
  console.log('\n[production] Plan gate complete. Generate and review assets before assemble.');
  process.exit(0);
}

run('replica:preflight', [`--project=${project}`]);
run('replica:voice', [`--project=${project}`, '--generate']);
run('replica:validate', [`--project=${project}`]);

if (stage === 'assemble') {
  console.log('\n[production] Assemble gate complete. Review preview/stills before deliver.');
  process.exit(0);
}

run('replica:render:hq', [`--project=${project}`]);
// 竖屏完整版（抖音、小红书同一条）；2026-10-14 起不再做预告和小红书图文卡。
run('vertical:render', [`--project=${project}`, '--cut=full']);
run('replica:copy', [`--project=${project}`]);
run('replica:release', [`--project=${project}`, '--status=draft']);
run('project:inventory', []);
console.log('\n[production] Delivery complete. Status remains draft until human review.');
