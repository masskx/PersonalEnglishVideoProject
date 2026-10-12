import {createHash} from 'node:crypto';
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
const args = process.argv.slice(2);
const value = (name: string) =>
  args.find((arg) => arg.startsWith(`--${name}=`))?.slice(name.length + 3);
const inputArg = value('input');
const id = value('id');
const prompt = value('prompt');
const resolution = value('resolution') ?? '480P';
const outDir = path.resolve(process.cwd(), value('out-dir') ?? 'outputs/wan-i2v');
const seed = Number(value('seed') ?? '20260724');

if (!inputArg || !id || !prompt) {
  throw new Error('Required: --input=<image> --id=<asset-id> --prompt=<motion prompt>.');
}
if (!['480P', '720P', '1080P'].includes(resolution)) {
  throw new Error('--resolution must be 480P, 720P, or 1080P.');
}
const apiKey = process.env.DASHSCOPE_API_KEY;
if (!apiKey) throw new Error('DASHSCOPE_API_KEY is missing from the project .env.');

const inputPath = path.resolve(process.cwd(), inputArg);
const bytes = readFileSync(inputPath);
const extension = path.extname(inputPath).toLowerCase();
const mime =
  extension === '.png' ? 'image/png' : extension === '.webp' ? 'image/webp' : 'image/jpeg';
const imgUrl = `data:${mime};base64,${bytes.toString('base64')}`;
const endpoint =
  'https://dashscope.aliyuncs.com/api/v1/services/aigc/video-generation/video-synthesis';
const response = await fetch(endpoint, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'X-DashScope-Async': 'enable',
  },
  body: JSON.stringify({
    model: 'wan2.2-i2v-flash',
    input: {
      prompt,
      negative_prompt:
        'camera movement, zoom, pan, cut, scene change, background change, gradient green, ' +
        'shadow, floor, scenery, text, logo, extra character, deformation, flicker, blur',
      img_url: imgUrl,
    },
    parameters: {
      resolution,
      duration: 5,
      prompt_extend: false,
      watermark: false,
      seed,
    },
  }),
});
const payload = (await response.json()) as {
  request_id?: string;
  code?: string;
  message?: string;
  output?: {task_id?: string; task_status?: string};
};
if (!response.ok || !payload.output?.task_id) {
  throw new Error(
    `Wan submit failed (${response.status}): ${payload.code ?? 'unknown'} ${payload.message ?? ''}`.trim(),
  );
}

mkdirSync(outDir, {recursive: true});
const manifest = {
  id,
  model: 'wan2.2-i2v-flash',
  resolution,
  duration: 5,
  seed,
  input: path.relative(process.cwd(), inputPath).replaceAll('\\', '/'),
  inputSha256: createHash('sha256').update(bytes).digest('hex'),
  prompt,
  taskId: payload.output.task_id,
  requestId: payload.request_id ?? null,
  status: payload.output.task_status ?? 'PENDING',
  submittedAt: new Date().toISOString(),
};
const manifestPath = path.join(outDir, `${id}.task.json`);
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(`Submitted ${id}: task ${payload.output.task_id}.`);
console.log(`Manifest: ${path.relative(process.cwd(), manifestPath)}.`);
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
