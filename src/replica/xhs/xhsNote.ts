import growth from '../../../planning/growth-promotion.json';
import type {XhsDeck} from './xhsCardData';
import type {MethodDeck} from './methodDeck';

/** 小红书笔记文案：标题（20 字上限检查）、每词一行的正文、话题标签与发布备注。 */
const xhs = growth.xiaohongshu;

const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));

export const buildXhsNote = (deck: XhsDeck) => {
  const rootTail = deck.root.split('/').pop()!.trim().toLocaleLowerCase();
  const values = {n: deck.words.length, root: deck.root.replace(/\s+/g, ''), rootTail};
  const titles = xhs.titleTemplates.map((template) => fill(template, values));
  const lengthNote = (title: string) => ([...title].length > xhs.maxTitleChars ? `（${[...title].length} 字，超过 ${xhs.maxTitleChars} 字上限，需缩短）` : '');
  const lines = deck.words.map((word) => `· ${word.word}${word.meaning ? ` ${word.meaning}` : ''}`).join('\n');
  return `# 小红书图文笔记

## 标题（选一个，${xhs.maxTitleChars} 字以内）

${titles.map((title, index) => `${index + 1}. ${title}${lengthNote(title)}`).join('\n')}

## 正文

${deck.hook}${/[？?！!。]$/.test(deck.hook) ? '' : '。'}记住 ${deck.root} = ${deck.englishMeaning}（${deck.chineseMeaning}），这组词就有画面了。

${lines}

图里每个词都配了小黑的动作和例句，自测页按中文写单词，再回到总结页核对答案。

${xhs.commentPrompt}

${xhs.tags.join(' ')} #${values.root.replace(/[^\p{L}\p{N}]+/gu, '')}

## 发布备注

- 图片按文件名顺序上传：01 是封面，最后是关注卡。
- 封面决定点击，正文第一句决定停留；不要在图片或正文里放微信号、二维码、外部链接。
- 同一期的竖屏视频可以发抖音；小红书优先发这组图文。
`;
};


/** 四六级方法卡的小红书文案：标题来自 deck.noteTitles，正文为题目、步骤、检查清单和互动。 */
export const buildMethodNote = (deck: MethodDeck) => {
  const lengthNote = (title: string) => ([...title].length > xhs.maxTitleChars ? `（${[...title].length} 字，超过 ${xhs.maxTitleChars} 字上限，需缩短）` : '');
  const steps = deck.steps.map((step) => `· ${step.label.replace(/^第\s*\d+\s*步｜/, '')}：${step.title}`).join('\n');
  return `# 小红书图文笔记

## 标题（选一个，${xhs.maxTitleChars} 字以内）

${deck.noteTitles.map((title, index) => `${index + 1}. ${title}${lengthNote(title)}`).join('\n')}

## 正文

${deck.examLabel}：${deck.title} ${deck.subtitle}。

${steps}

考场检查：${deck.checklist.join(' → ')}

图里有原创练习和参考答案，先遮住答案自己做一遍。

${xhs.commentPrompt}

${deck.tags.join(' ')}

## 发布备注

- 图片按文件名顺序上传：01 是封面，最后是关注卡。
- 练习为原创模拟题，不要写成“真题”；参考答案不唯一。
- 不要在图片或正文里放微信号、二维码、外部链接。
`;
};
