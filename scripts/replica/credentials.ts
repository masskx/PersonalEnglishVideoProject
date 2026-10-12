import {config as loadDotenv} from 'dotenv';

/**
 * 外部服务密钥清单（唯一来源）。密钥只从环境变量或被 gitignore 的 .env 读取，
 * 永远不写入仓库、日志、报告或产物。checkCredentials 与 scanSecrets 都读这里。
 */
loadDotenv({override: false, quiet: true});

export type CredentialSpec = {
  name: string;
  purpose: string;
  host: string;
  commands: string[];
  /** Optional companion setting that is not secret (e.g. a relay base URL). */
  hostFromEnv?: string;
};

export const CREDENTIALS: readonly CredentialSpec[] = [
  {
    name: 'DASHSCOPE_API_KEY',
    purpose: '阿里云百炼：CosyVoice 配音、Wan 图生视频',
    host: 'dashscope.aliyuncs.com',
    commands: ['replica:voice', 'translation:voice', 'cet6:voice', 'replica:wan:*'],
  },
  {
    name: 'OPENAI_API_KEY',
    purpose: 'OpenAI 兼容图片接口（gpt-image-2 / 中转站）：关键姿态与插图',
    host: 'api.openai.com',
    hostFromEnv: 'OPENAI_BASE_URL',
    commands: ['replica:images (provider=openai)', 'replica:keyposes:edit', 'replica:image:test'],
  },
  {
    name: 'HUOSHAN_API_KEY',
    purpose: '火山方舟 Seedream 生图（历史路线，当前默认不用）',
    host: 'ark.cn-beijing.volces.com',
    commands: ['replica:images (provider=huoshan)'],
  },
];

export const credentialHost = (spec: CredentialSpec) => {
  const configured = spec.hostFromEnv ? process.env[spec.hostFromEnv] : undefined;
  if (!configured) return spec.host;
  try {
    return new URL(configured).host;
  } catch {
    return spec.host;
  }
};

/** Values of every configured secret, for exact-match leak scanning. Never print these. */
export const configuredSecretValues = () =>
  CREDENTIALS.map((spec) => ({name: spec.name, value: process.env[spec.name]?.trim() ?? ''}))
    .filter((entry) => entry.value.length >= 8);

/** Safe description of a secret: presence and length only, never characters of the value. */
export const describeSecret = (value: string | undefined) =>
  value && value.trim() ? `已设置（${value.trim().length} 字符）` : '未设置';
