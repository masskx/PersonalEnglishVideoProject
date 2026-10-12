import {readFileSync, statSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {configuredSecretValues} from './credentials';

/**
 * npm run secrets:scan —— 提交前的密钥泄漏闸门（pre-commit 钩子与 project:test 都会调用）。
 * 扫描将要进入 git 的文本文件：已跟踪文件、暂存区、未被忽略的新文件。
 * 1) 当前环境里真实密钥的原文（精确匹配）；2) 常见密钥格式。发现即失败，输出只显示打码片段。
 *   --staged  只扫描暂存区内容（钩子使用）
 */
const stagedOnly = process.argv.includes('--staged');
const git = (args: string[]) => {
  const result = spawnSync('git', args, {encoding: 'utf8', maxBuffer: 64 * 1024 * 1024});
  if (result.status !== 0) throw new Error(`git ${args.join(' ')} failed: ${result.stderr}`);
  return result.stdout.split('\0').filter(Boolean);
};

const files = stagedOnly
  ? git(['diff', '--cached', '--name-only', '--diff-filter=ACMR', '-z'])
  : [...new Set([...git(['ls-files', '-z']), ...git(['ls-files', '--others', '--exclude-standard', '-z'])])];

const lfsPatterns = /\.(png|jpe?g|webp|gif|mp4|mp3|wav|webm|pdf|ttf|otf|woff2?|ico)$/i;
const PATTERNS: Array<{name: string; regex: RegExp}> = [
  {name: 'OpenAI/DashScope 风格 sk- 密钥', regex: /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}/g},
  {name: 'Bearer 令牌', regex: /Bearer\s+[A-Za-z0-9._-]{24,}/g},
  {name: 'GitHub 令牌', regex: /\b(?:ghp|gho|ghu|ghs|github_pat)_[A-Za-z0-9_]{20,}/g},
  {name: 'AWS 访问密钥', regex: /\bAKIA[0-9A-Z]{16}\b/g},
  {name: '私钥块', regex: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g},
  // Real keys are ASCII; Chinese placeholder text such as “你的…密钥” is not flagged.
  {name: '.env 赋值的非空密钥', regex: /^\s*[A-Z0-9_]*(?:API_KEY|SECRET|TOKEN)\s*=\s*["']?[A-Za-z0-9_.\-+/=]{12,}/gm},
];
// Placeholders used in docs and the .env.example template are not secrets.
const ALLOWED = /sk-x{6,}|sk-\.\.\.|sk-your|<[^>]*key[^>]*>|你的密钥/i;
const secrets = configuredSecretValues();
const mask = (value: string) => `${value.slice(0, 4)}…（${value.length} 字符）`;

const findings: string[] = [];
for (const file of files) {
  if (lfsPatterns.test(file)) continue;
  let content: string;
  try {
    if (stagedOnly) {
      const result = spawnSync('git', ['show', `:${file}`], {encoding: 'utf8', maxBuffer: 64 * 1024 * 1024});
      if (result.status !== 0) continue;
      content = result.stdout;
    } else {
      if (statSync(file).size > 8 * 1024 * 1024) continue;
      content = readFileSync(file, 'utf8');
    }
  } catch {
    continue;
  }
  if (content.includes('\0')) continue;
  for (const secret of secrets) {
    if (content.includes(secret.value)) findings.push(`${file}: 含有 ${secret.name} 的真实值`);
  }
  const lines = content.split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const pattern of PATTERNS) {
      for (const match of line.matchAll(pattern.regex)) {
        if (ALLOWED.test(match[0])) continue;
        findings.push(`${file}:${index + 1}: 疑似${pattern.name} ${mask(match[0])}`);
      }
    }
  });
}

if (findings.length) {
  console.error(`密钥扫描失败：发现 ${findings.length} 处疑似密钥，禁止提交。\n${findings.join('\n')}`);
  console.error('处理：从文件中删除密钥，改为读取环境变量；若已推送到远端，立即到服务商后台作废并更换该密钥。');
  process.exit(1);
}
console.log(`secrets scan: ${files.length} 个文件${stagedOnly ? '（暂存区）' : ''}未发现密钥${secrets.length ? `，已对照 ${secrets.length} 个当前密钥原文` : ''}。`);
