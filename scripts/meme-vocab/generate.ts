import {existsSync, mkdirSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {buildAssetManifest, type AssetResolver} from '../../src/meme-vocab/assets';
import {buildMemeVocabConfig} from '../../src/meme-vocab/config';
import {buildHooks, defaultMemeVocabInput} from '../../src/meme-vocab/content';
import {buildShortStoryboard} from '../../src/meme-vocab/storyboard';
import {memeVocabShortJsonSchema} from '../../src/meme-vocab/schema';
import {memeVocabOutputDirectory} from '../../src/meme-vocab/paths';
import type {MemeVocabInput} from '../../src/meme-vocab/types';

const args = process.argv.slice(2);
const arg = (name: string) => args.find((value) => value.startsWith(`--${name}=`))?.slice(name.length + 3);
const outputDirectory = arg('output-directory');
const targetWord = arg('word') ?? arg('target-word') ?? 'interrupt';
const input: MemeVocabInput = defaultMemeVocabInput({
  targetWord,
  scenario: arg('scenario') ?? defaultMemeVocabInput().scenario,
  accurateMeaning: arg('meaning') ?? defaultMemeVocabInput().accurateMeaning,
  phonetic: arg('phonetic') ?? defaultMemeVocabInput().phonetic,
  exampleSentence: arg('example') ?? defaultMemeVocabInput().exampleSentence,
  durationTarget: Number(arg('duration') ?? defaultMemeVocabInput().durationTarget),
  outputDirectory: outputDirectory ?? memeVocabOutputDirectory(targetWord),
  assetDirectory: arg('asset-directory') ?? `public/assets/meme-vocab/${targetWord}`,
});
const assetDir = path.resolve(process.cwd(), input.assetDirectory);
const outDir = path.resolve(process.cwd(), input.outputDirectory);
mkdirSync(assetDir, {recursive: true});
mkdirSync(outDir, {recursive: true});
const placeholder = path.join(assetDir, 'placeholder.svg');
if (!existsSync(placeholder)) {
  writeFileSync(placeholder, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900"><rect width="600" height="900" fill="#fff9f5"/><rect x="36" y="36" width="528" height="828" rx="32" fill="none" stroke="#E85810" stroke-width="8" stroke-dasharray="18 14"/><circle cx="300" cy="360" r="105" fill="#111"/><circle cx="265" cy="338" r="12" fill="#fff"/><circle cx="335" cy="338" r="12" fill="#fff"/><path d="M300 470V650M300 530L190 465M300 530L410 465M300 650L220 790M300 650L380 790" fill="none" stroke="#111" stroke-width="14" stroke-linecap="round"/><text x="300" y="135" text-anchor="middle" font-family="Arial" font-size="42" font-weight="800" fill="#E85810">PLACEHOLDER</text><text x="300" y="825" text-anchor="middle" font-family="Arial" font-size="25" font-weight="700" fill="#041FA0">REPLACE WITH JIMENG IMAGE</text></svg>`, 'utf8');
}
const resolveAsset: AssetResolver = (currentInput, assetId) => {
  const candidate = ['png', 'jpg', 'webp'].map((extension) => path.join(assetDir, `${assetId}.${extension}`)).find((file) => existsSync(file));
  const publicPath = (file: string) => path.relative(path.resolve(process.cwd(), 'public'), file).replace(/\\/g, '/');
  return candidate
    ? {path: publicPath(candidate), status: 'available'}
    : existsSync(placeholder)
      ? {path: publicPath(placeholder), status: 'placeholder'}
      : {path: publicPath(placeholder), status: 'missing'};
};
const storyboard = buildShortStoryboard(input);
const config = buildMemeVocabConfig(input, resolveAsset);
const hooks = buildHooks(input);
const manifest = buildAssetManifest(input, storyboard, resolveAsset);
const write = (name: string, value: string) => writeFileSync(path.join(outDir, name), value, 'utf8');

write('storyboard.json', `${JSON.stringify(storyboard, null, 2)}\n`);
write('assets-manifest.json', `${JSON.stringify(manifest, null, 2)}\n`);
write('video-config.json', `${JSON.stringify(config, null, 2)}\n`);
write('hooks.md', `# ${input.targetWord} Hook 方案\n\n${hooks.map((hook, index) => `## ${index + 1}. ${hook.angle}\n\n${hook.text}\n\n${hook.rationale}`).join('\n\n')}\n\n默认方案：${storyboard.defaultHookId}\n`);
write('jimeng-prompts.md', `# 即梦提示词\n\n${storyboard.scenes.map((scene) => `## ${scene.sceneId}\n\n用途：${scene.sceneType}\n\n${scene.jimengPrompt}`).join('\n\n')}\n`);
write('script.md', `# ${input.targetWord} 短视频文案\n\n- 模式：meme_vocab_short\n- 预计时长：${storyboard.duration}s\n- 核心词：${input.targetWord} ${input.phonetic}｜${input.accurateMeaning}\n- 记忆边界：inter + rupt 是记忆联想，不冒充严格词源。\n\n${storyboard.scenes.map((scene) => `## ${scene.sceneType}｜estimated ${scene.startTime}s\n\n屏幕文案：${scene.narration}\n\nTTS口播：${scene.ttsText}`).join('\n\n')}\n`);
write('publish-copy.md', `# 发布文案\n\n## 标题备选\n\n1. 老板画饼被一句话打断：interrupt 到底怎么用？\n2. 别再把 interrupt 和 disrupt 混了\n3. 会议里突然插嘴，英语到底说哪个词？\n\n## 封面大字\n\n- 方案 A：老板的饼，被谁打断了？\n- 方案 B：interrupt ≠ disrupt\n\n## 简短发布描述\n\n用一场“工资呢？”的荒诞会议，记住 interrupt：打断正在发生的话或动作。\n\n## 置顶评论\n\n插嘴打断会议用 interrupt；把整个会议秩序搅乱应该用哪个词？\n\n## 评论区测试题答案\n\n${storyboard.scenes.at(-1)?.quizAnswer}\n`);
write('schema.json', `${JSON.stringify(memeVocabShortJsonSchema, null, 2)}\n`);
console.log(`Generated meme_vocab_short package: ${path.relative(process.cwd(), outDir)}`);
console.log(`Assets pending replacement: ${manifest.pendingGeneration.join(', ')}`);
