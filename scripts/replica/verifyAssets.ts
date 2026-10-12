import {existsSync} from 'node:fs';
import path from 'node:path';
import {getReplicaProject} from '../../src/replica/projects/registry';
import {verifyPressReplicaAsset} from './assetVerifier';

const args = process.argv.slice(2);
const projectArg = args.find((arg) => arg.startsWith('--project='))?.slice('--project='.length);
if (!projectArg) throw new Error('Missing --project=<slug>.');
const project = getReplicaProject(projectArg);
const onlyArg = args.find((arg) => arg.startsWith('--only='))?.slice('--only='.length);
const requested = onlyArg
  ? new Set(onlyArg.split(',').map((value) => value.trim()).filter(Boolean))
  : null;
const json = args.includes('--json');

const assets = project.illustrations.filter(
  (asset) => !requested || requested.has(asset.id) || requested.has(asset.filename),
);
if (assets.length === 0) throw new Error('No assets matched --only.');

const results = assets.map((asset) => {
  const filePath = path.resolve(process.cwd(), project.paths.alphaAssetDir, asset.filename);
  if (!existsSync(filePath)) {
    return {asset: asset.id, file: filePath, ok: false, errors: ['file is missing']} as const;
  }
  return {asset: asset.id, ...verifyPressReplicaAsset(filePath)};
});

if (json) {
  console.log(JSON.stringify(results, null, 2));
} else {
  for (const result of results) {
    if (!result.ok || !result.metrics) {
      console.error(`FAIL ${result.asset}: ${result.errors.join('; ')}`);
      continue;
    }
    const metrics = result.metrics;
    console.log(
      `PASS ${result.asset}: ${metrics.width}x${metrics.height}, ` +
        `coverage ${(metrics.subjectCoverage * 100).toFixed(2)}%, ` +
        `green ${(metrics.greenResidualRatio * 100).toFixed(3)}%`,
    );
  }
  const failed = results.filter((result) => !result.ok);
  console.log(`${results.length - failed.length}/${results.length} ${project.slug} assets passed QA.`);
}

if (results.some((result) => !result.ok)) process.exit(1);
