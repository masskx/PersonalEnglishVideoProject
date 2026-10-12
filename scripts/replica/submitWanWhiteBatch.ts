import 'dotenv/config';
import {createHash} from 'node:crypto';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const project = args.find((arg) => arg.startsWith('--project='))?.slice(10);
const onlyArg = args.find((arg) => arg.startsWith('--only='))?.slice(7);
const only = onlyArg ? new Set(onlyArg.split(',').map((item) => item.trim()).filter(Boolean)) : null;
const attempt = Number(args.find((arg) => arg.startsWith('--attempt='))?.slice(10) ?? '1');
if (!project) throw new Error('Missing --project=<slug>.');
const apiKey = process.env.DASHSCOPE_API_KEY;
if (!apiKey) throw new Error('DASHSCOPE_API_KEY is missing from .env.');
const planPath = path.resolve('work', 'wan-white', project, 'plan.json');
const plan = JSON.parse(readFileSync(planPath, 'utf8')) as {
  entries: Array<{id: string; input: string; prompt: string}>;
};
const outDir = path.resolve('work', 'wan-white', project, 'tasks');
mkdirSync(outDir, {recursive: true});
const endpoint = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/video-generation/video-synthesis';

for (const [index, entry] of plan.entries.entries()) {
  if (only && !only.has(entry.id)) continue;
  const suffix = attempt > 1 ? `.r${attempt}` : '';
  const manifestPath = path.join(outDir, `${entry.id}${suffix}.task.json`);
  if (existsSync(manifestPath)) {
    console.log(`Skip existing ${project}/${entry.id}.`);
    continue;
  }
  const inputPath = path.resolve(entry.input);
  const bytes = readFileSync(inputPath);
  let response: Response | undefined;
  let payload: {
    request_id?: string;
    code?: string;
    message?: string;
    output?: {task_id?: string; task_status?: string};
  } = {};
  for (let attempt = 1; attempt <= 8; attempt += 1) {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-DashScope-Async': 'enable',
      },
      body: JSON.stringify({
        model: 'wan2.2-i2v-flash',
        input: {
          prompt: `${entry.prompt} Retry correction: preserve exactly two white dot eyes and the original bean-shaped body; keep every existing object and add nothing; the white background must contain zero lines, marks, shadows, or texture.`,
          negative_prompt:
            'camera movement, zoom, pan, cut, scene change, background change, gray background, ' +
            'gradient, shadow, floor, scenery, text, logo, extra character, extra limb, deformation, flicker, blur',
          img_url: `data:image/png;base64,${bytes.toString('base64')}`,
        },
        parameters: {
          resolution: '480P', duration: 5, prompt_extend: false, watermark: false, seed: 20260729 + index + attempt * 1000,
        },
      }),
    });
    payload = await response.json() as typeof payload;
    if (response.status !== 429) break;
    const delayMs = Math.min(45000, attempt * 8000);
    console.log(`Rate limited for ${entry.id}; retrying in ${delayMs / 1000}s.`);
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  if (!response) throw new Error(`No Wan response for ${entry.id}.`);
  if (!response.ok || !payload.output?.task_id) {
    throw new Error(`Wan submit failed for ${entry.id} (${response.status}): ${payload.code ?? ''} ${payload.message ?? ''}`);
  }
  const manifest = {
    id: entry.id,
    model: 'wan2.2-i2v-flash',
    resolution: '480P',
    duration: 5,
    seed: 20260729 + index + attempt * 1000,
    input: entry.input,
    inputSha256: createHash('sha256').update(bytes).digest('hex'),
    prompt: entry.prompt,
    taskId: payload.output.task_id,
    requestId: payload.request_id ?? null,
    status: payload.output.task_status ?? 'PENDING',
    submittedAt: new Date().toISOString(),
  };
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log(`Submitted ${project}/${entry.id}: ${payload.output.task_id}`);
  await new Promise((resolve) => setTimeout(resolve, 5000));
}
console.log(`Submitted selected Wan tasks for ${project}, attempt ${attempt}.`);
