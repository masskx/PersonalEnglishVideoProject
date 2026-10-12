import {CREDENTIALS, credentialHost, describeSecret} from './credentials';

/**
 * npm run keys:check —— 会话开始时先跑：哪些密钥已提供、对应服务能否连通、哪些命令可用。
 * 只打印“已设置/未设置”和长度，不打印密钥任何字符；不带密钥访问服务，只测网络连通。
 */
const probe = async (host: string) => {
  try {
    const response = await fetch(`https://${host}/`, {method: 'GET', signal: AbortSignal.timeout(12000)});
    // Any HTTP answer (even 401/404) proves the host is reachable; 403 from a proxy CONNECT throws instead.
    return {reachable: true, detail: `HTTP ${response.status}`};
  } catch (error) {
    const cause = (error as {cause?: {code?: string; message?: string}}).cause;
    return {reachable: false, detail: String(cause?.code || cause?.message || (error as Error).message || '代理拒绝或无法连接')};
  }
};

const inProxySandbox = Boolean(process.env.HTTPS_PROXY || process.env.https_proxy);
if (inProxySandbox && process.env.NODE_USE_ENV_PROXY !== '1') {
  console.log('提示：检测到 HTTPS 代理但未设置 NODE_USE_ENV_PROXY=1，Node fetch 不会走代理（.claude/settings.json 已为 Claude 会话设置）。\n');
}

let missing = 0;
for (const spec of CREDENTIALS) {
  const value = process.env[spec.name];
  const host = credentialHost(spec);
  const network = await probe(host);
  if (!value?.trim()) missing += 1;
  console.log(`${spec.name}: ${describeSecret(value)}`);
  console.log(`  用途：${spec.purpose}`);
  console.log(`  服务：${host} → ${network.reachable ? `可连通（${network.detail}）` : `不可连通（${network.detail}）`}`);
  console.log(`  解锁命令：${spec.commands.join('、')}`);
  console.log(`  状态：${value?.trim() && network.reachable ? '可以使用' : value?.trim() ? '有密钥但网络不通：在云端环境设置里允许该域名' : '缺少密钥'}\n`);
}
console.log(missing === CREDENTIALS.length ? '没有任何密钥：只能做不调用外部服务的工作（排版、渲染、文案、检查）。' : '密钥只在本机/本会话使用，提交前运行 npm run secrets:scan。');
