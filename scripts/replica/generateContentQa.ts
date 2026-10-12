import {existsSync, mkdirSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {getReplicaProject} from '../../src/replica/projects/registry';
import {resolveDeliveryPaths} from './deliveryPaths';

const projectArg = process.argv.slice(2).find((arg) => arg.startsWith('--project='))?.slice(10);
if (!projectArg) throw new Error('Missing --project=<slug>.');
const project = getReplicaProject(projectArg);
if (!project.cover) throw new Error(`Project ${project.slug} has no cover metadata.`);
const delivery = resolveDeliveryPaths(project);
const outDir = delivery.directory;
const out = delivery.contentQa;
if (existsSync(out) && !process.argv.includes('--force')) {
  console.log(`Content QA already exists: ${path.relative(process.cwd(), out)}`);
  process.exit(0);
}
const rows = project.cover.words
  .map((word) => `| ${word} | 待核对 | 待核对 | 待核对 | 待核对 |`)
  .join('\n');
const content = `# ${project.cover.root} 内容准确性检查

> 状态：待人工核对。此文件是发布前检查单，不代表词源结论已经通过。

| 单词 | 视频中的现代义 | 词源关系 | 记忆桥梁是否注明为助记 | 权威来源 |
|---|---|---|---|---|
${rows}

## 发布前确认

- [ ] 现代义与例句符合常用语境
- [ ] 没有把助记拆分冒充严格历史词源
- [ ] 拼写变化和假同源词已单独说明
- [ ] 中文旁白、字幕、总结页顺序一致
- [ ] 至少核对一本权威词典和一个词源来源
`;
mkdirSync(outDir, {recursive: true});
writeFileSync(out, content, 'utf8');
console.log(`Content QA created: ${path.relative(process.cwd(), out)}`);
