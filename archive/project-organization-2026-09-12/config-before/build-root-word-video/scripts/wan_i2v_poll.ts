import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';

const envPath = path.resolve(process.cwd(), '.env');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (match && process.env[match[1]] === undefined) {
      process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
    }
  }
}

const main = async () => {
const manifestArg = process.argv
  .slice(2)
  .find((arg) => arg.startsWith('--manifest='))
  ?.slice('--manifest='.length);
if (!manifestArg) throw new Error('Required: --manifest=<task.json>.');
const apiKey = process.env.DASHSCOPE_API_KEY;
if (!apiKey) throw new Error('DASHSCOPE_API_KEY is missing from the project .env.');

const manifestPath = path.resolve(process.cwd(), manifestArg);
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
  id: string;
  taskId: string;
  status?: string;
  outputVideo?: string;
  [key: string]: unknown;
};
const response = await fetch(`https://dashscope.aliyuncs.com/api/v1/tasks/${manifest.taskId}`, {
  headers: {Authorization: `Bearer ${apiKey}`},
});
const payload = (await response.json()) as {
  request_id?: string;
  code?: string;
  message?: string;
  output?: {
    task_status?: string;
    video_url?: string;
    submit_time?: string;
    scheduled_time?: string;
    end_time?: string;
  };
};
if (!response.ok || !payload.output?.task_status) {
  throw new Error(
    `Wan poll failed (${response.status}): ${payload.code ?? 'unknown'} ${payload.message ?? ''}`.trim(),
  );
}

manifest.status = payload.output.task_status;
manifest.lastPolledAt = new Date().toISOString();
manifest.requestId = payload.request_id ?? manifest.requestId;
if (payload.output.task_status === 'SUCCEEDED') {
  if (!payload.output.video_url) throw new Error('Wan task succeeded without video_url.');
  const videoResponse = await fetch(payload.output.video_url);
  if (!videoResponse.ok) throw new Error(`Video download failed (${videoResponse.status}).`);
  const outputPath = path.join(path.dirname(manifestPath), `${manifest.id}.source.mp4`);
  mkdirSync(path.dirname(outputPath), {recursive: true});
  writeFileSync(outputPath, Buffer.from(await videoResponse.arrayBuffer()));
  manifest.outputVideo = path.relative(process.cwd(), outputPath).replaceAll('\\', '/');
  manifest.completedAt = new Date().toISOString();
  manifest.remoteTiming = {
    submitTime: payload.output.submit_time ?? null,
    scheduledTime: payload.output.scheduled_time ?? null,
    endTime: payload.output.end_time ?? null,
  };
  console.log(`Downloaded ${manifest.id}: ${manifest.outputVideo}.`);
} else if (payload.output.task_status === 'FAILED' || payload.output.task_status === 'CANCELED') {
  manifest.error = {code: payload.code ?? null, message: payload.message ?? null};
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  throw new Error(
    `Wan task ${payload.output.task_status}: ${payload.code ?? ''} ${payload.message ?? ''}`,
  );
} else {
  console.log(`Task ${manifest.taskId}: ${payload.output.task_status}.`);
}
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
if (manifest.outputVideo && !existsSync(path.resolve(process.cwd(), manifest.outputVideo))) {
  throw new Error(`Downloaded video missing: ${manifest.outputVideo}.`);
}
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
