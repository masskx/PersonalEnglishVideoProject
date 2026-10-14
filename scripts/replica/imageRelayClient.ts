import {spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {bearerCurlArgs, bearerHeaders} from '../../src/proxyCredentials';

type ImageResponse = {
  data?: Array<{b64_json?: string; url?: string}>;
};

const parseResponse = (body: string, status: number): ImageResponse => {
  try {
    return JSON.parse(body) as ImageResponse;
  } catch {
    throw new Error(`Images2 returned non-JSON: HTTP ${status}\n${body.slice(0, 1000)}`);
  }
};

const requestJson = async (url: string, apiKey: string, body: Record<string, unknown>) => {
  const encoded = JSON.stringify(body);

  // Node's undici client can time out during the TCP connect to this relay on Windows even
  // though the system curl path works. Use curl.exe there so the project follows the same
  // network path as the verified PowerShell probe.
  if (process.platform === 'win32') {
    const result = spawnSync(
      'curl.exe',
      [
        '-sS',
        '--connect-timeout',
        '30',
        '--max-time',
        '180',
        ...bearerCurlArgs(apiKey),
        '-H',
        'Content-Type: application/json',
        '--data-binary',
        '@-',
        '-w',
        '\n__HTTP_STATUS__:%{http_code}\n',
        url,
      ],
      {input: encoded, encoding: 'utf8', windowsHide: true},
    );
    if (result.error) throw new Error(`Images2 curl failed: ${result.error.message}`);
    const marker = '__HTTP_STATUS__:';
    const markerIndex = result.stdout.lastIndexOf(marker);
    if (markerIndex < 0) {
      throw new Error(`Images2 curl returned no HTTP status. ${result.stderr}`);
    }
    const status = Number(result.stdout.slice(markerIndex + marker.length).trim());
    const responseBody = result.stdout.slice(0, markerIndex).trim();
    return {status, payload: parseResponse(responseBody, status)};
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {...bearerHeaders(apiKey), 'Content-Type': 'application/json'},
    body: encoded,
    signal: AbortSignal.timeout(180_000),
  });
  return {status: response.status, payload: parseResponse(await response.text(), response.status)};
};

const download = async (url: string) => {
  if (process.platform === 'win32') {
    const result = spawnSync(
      'curl.exe',
      ['-sS', '--connect-timeout', '30', '--max-time', '60', '-L', url],
      {encoding: 'buffer', windowsHide: true},
    );
    if (result.error || result.status !== 0) {
      throw new Error(`Images2 image download failed: ${result.error?.message ?? result.stderr}`);
    }
    return Buffer.from(result.stdout);
  }

  const response = await fetch(url, {signal: AbortSignal.timeout(60_000)});
  if (!response.ok) throw new Error(`Images2 image download failed: HTTP ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
};

const imageBytes = async (payload: ImageResponse) => {
  if (payload.data?.[0]?.b64_json) return Buffer.from(payload.data[0].b64_json, 'base64');
  if (payload.data?.[0]?.url) return download(payload.data[0].url);
  throw new Error(`OpenAI-compatible image response has no image data: ${JSON.stringify(payload)}`);
};

export const generateOpenAICompatibleImage = async ({
  baseUrl,
  apiKey,
  model,
  prompt,
  size,
  quality,
}: {
  baseUrl: string;
  apiKey: string;
  model: string;
  prompt: string;
  size: string;
  quality: string;
}) => {
  const {status, payload} = await requestJson(`${baseUrl.replace(/\/+$/, '')}/images/generations`, apiKey, {
    model,
    prompt,
    size,
    quality,
  });
  if (status < 200 || status >= 300) {
    throw new Error(`OpenAI-compatible image generation failed: HTTP ${status}\n${JSON.stringify(payload)}`);
  }
  return imageBytes(payload);
};

/**
 * Reference-preserving image edit used by the accepted Xiaohei key-pose workflow.
 * The edit endpoint keeps character identity, framing and props more stable than
 * independent text-to-image calls. The caller still normalizes and mattes output.
 */
export const editOpenAICompatibleImage = async ({
  baseUrl,
  apiKey,
  model,
  prompt,
  imagePath,
  size,
  quality,
}: {
  baseUrl: string;
  apiKey: string;
  model: string;
  prompt: string;
  imagePath: string;
  size: string;
  quality: string;
}) => {
  const endpoint = `${baseUrl.replace(/\/+$/, '')}/images/edits`;
  let status: number;
  let payload: ImageResponse;

  if (process.platform === 'win32') {
    const result = spawnSync(
      'curl.exe',
      [
        '-sS',
        '--connect-timeout',
        '30',
        '--max-time',
        '240',
        ...bearerCurlArgs(apiKey),
        '-F',
        `model=${model}`,
        '-F',
        `prompt=${prompt}`,
        '-F',
        `image=@${imagePath}`,
        '-F',
        `size=${size}`,
        '-F',
        `quality=${quality}`,
        '-F',
        'response_format=b64_json',
        '-w',
        '\n__HTTP_STATUS__:%{http_code}\n',
        endpoint,
      ],
      {encoding: 'utf8', windowsHide: true, maxBuffer: 64 * 1024 * 1024},
    );
    if (result.error) throw new Error(`Images2 edit curl failed: ${result.error.message}`);
    const marker = '__HTTP_STATUS__:';
    const markerIndex = result.stdout.lastIndexOf(marker);
    if (markerIndex < 0) {
      throw new Error(`Images2 edit curl returned no HTTP status. ${result.stderr}`);
    }
    status = Number(result.stdout.slice(markerIndex + marker.length).trim());
    if (status === 0) {
      throw new Error(
        `Images2 edit network failure (curl exit ${result.status}): ${result.stderr.trim() || result.stdout.slice(0, 500) || 'no response body'}`,
      );
    }
    payload = parseResponse(result.stdout.slice(0, markerIndex).trim(), status);
  } else {
    const form = new FormData();
    form.set('model', model);
    form.set('prompt', prompt);
    form.set('image', new Blob([readFileSync(imagePath)]), path.basename(imagePath));
    form.set('size', size);
    form.set('quality', quality);
    form.set('response_format', 'b64_json');
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {...bearerHeaders(apiKey)},
      body: form,
      signal: AbortSignal.timeout(240_000),
    });
    status = response.status;
    payload = parseResponse(await response.text(), status);
  }

  if (status < 200 || status >= 300) {
    throw new Error(`OpenAI-compatible image edit failed: HTTP ${status}\n${JSON.stringify(payload)}`);
  }
  return imageBytes(payload);
};
