/**
 * 云端环境可以把密钥存成 Network secret：代理在请求离开会话后，按域名自动加上 Authorization 头，
 * 会话里只看得到占位值 `proxy-injected`。占位时不发送我们自己的 Authorization 头，交给代理补上；
 * 本机 `.env` 里的真实密钥照常使用。
 */
export const PROXY_INJECTED = 'proxy-injected';

export const isProxyInjected = (key: string | undefined) => key?.trim() === PROXY_INJECTED;

export const bearerHeaders = (key: string): Record<string, string> =>
  isProxyInjected(key) ? {} : {Authorization: `Bearer ${key}`};

export const bearerCurlArgs = (key: string): string[] =>
  isProxyInjected(key) ? [] : ['-H', `Authorization: Bearer ${key}`];
