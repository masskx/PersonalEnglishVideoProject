import 'dotenv/config';
import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';

const project = process.argv.slice(2).find((arg) => arg.startsWith('--project='))?.slice(10);
const args = process.argv.slice(2);
const onlyArg = args.find((arg) => arg.startsWith('--only='))?.slice(7);
const only = onlyArg ? new Set(onlyArg.split(',').map((item) => item.trim()).filter(Boolean)) : null;
const attempt = Number(args.find((arg) => arg.startsWith('--attempt='))?.slice(10) ?? '1');
if (!project) throw new Error('Missing --project=<slug>.');
const apiKey = process.env.DASHSCOPE_API_KEY;
if (!apiKey) throw new Error('DASHSCOPE_API_KEY is missing from .env.');
const tasksDir = path.resolve('work', 'wan-white', project, 'tasks');
const plan = JSON.parse(readFileSync(path.resolve('work', 'wan-white', project, 'plan.json'), 'utf8')) as {
  entries: Array<{id: string}>;
};
const pending = new Set(plan.entries.map((entry) => entry.id).filter((id) => !only || only.has(id)));

for (let cycle = 1; cycle <= 30 && pending.size > 0; cycle += 1) {
  for (const id of [...pending]) {
    const suffix = attempt > 1 ? `.r${attempt}` : '';
    const manifestPath = path.join(tasksDir, `${id}${suffix}.task.json`);
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
      id: string; taskId: string; status?: string; outputVideo?: string; [key: string]: unknown;
    };
    if (manifest.outputVideo && existsSync(path.resolve(manifest.outputVideo))) {
      pending.delete(id);
      continue;
    }
    const response = await fetch(`https://dashscope.aliyuncs.com/api/v1/tasks/${manifest.taskId}`, {
      headers: {Authorization: `Bearer ${apiKey}`},
    });
    const payload = await response.json() as {
      request_id?: string; code?: string; message?: string;
      output?: {task_status?: string; video_url?: string};
    };
    const status = payload.output?.task_status;
    if (!response.ok || !status) throw new Error(`Poll failed for ${id}: ${response.status} ${payload.message ?? ''}`);
    manifest.status = status;
    manifest.lastPolledAt = new Date().toISOString();
    if (status === 'SUCCEEDED') {
      if (!payload.output?.video_url) throw new Error(`${id} succeeded without video URL.`);
      const video = await fetch(payload.output.video_url);
      if (!video.ok) throw new Error(`Download failed for ${id}: ${video.status}`);
      const output = path.join(tasksDir, `${id}${suffix}.source.mp4`);
      writeFileSync(output, Buffer.from(await video.arrayBuffer()));
      manifest.outputVideo = path.relative(process.cwd(), output).replaceAll('\\', '/');
      manifest.completedAt = new Date().toISOString();
      pending.delete(id);
      console.log(`Downloaded ${project}/${id}.`);
    } else if (status === 'FAILED' || status === 'CANCELED') {
      manifest.error = {code: payload.code ?? null, message: payload.message ?? null};
      writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
      throw new Error(`${project}/${id} ${status}: ${payload.message ?? ''}`);
    }
    writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  }
  if (pending.size > 0) {
    console.log(`${project}: ${pending.size} task(s) still running; cycle ${cycle}/30.`);
    await new Promise((resolve) => setTimeout(resolve, 15000));
  }
}
if (pending.size > 0) throw new Error(`Timed out waiting for: ${[...pending].join(', ')}`);
console.log(`All selected Wan sources downloaded for ${project}, attempt ${attempt}.`);
