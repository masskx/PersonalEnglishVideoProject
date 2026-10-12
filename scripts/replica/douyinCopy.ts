import {existsSync, mkdirSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import type {ReplicaProjectDefinition} from '../../src/replica/projectTypes';
import {resolveDeliveryPaths} from './deliveryPaths';
import growth from '../../planning/growth-promotion.json';
import {teaserWordList} from '../../src/replica/vertical/verticalProjects';

const normalize = (value: string) => value.replace(/\s+/g, ' ').trim();
const rootHashtag = (root: string) =>
  normalize(root).replace(/^-|-$/g, '').replace(/[^\p{L}\p{N}]+/gu, '');

const pick = <T,>(items: readonly T[], seed: string, offset = 0) => {
  const hash = [...seed].reduce((sum, char) => sum + char.codePointAt(0)!, 0);
  return items[(hash + offset) % items.length];
};

export const buildDouyinCopy = (project: ReplicaProjectDefinition) => {
  if (!project.cover) throw new Error(`Project ${project.slug} has no cover configuration.`);
  const {cover} = project;
  const sound = project.slug === 'bouba-kiki';
  const root = normalize(cover.root);
  const english = normalize(cover.englishMeaning);
  const chinese = normalize(cover.chineseMeaning);
  const words = cover.words.map(normalize);
  const wordList = words.join('、');
  const anchor = sound ? `${root} 的声音画面` : `${root} = ${english}（${chinese}）`;

  const fallbackTitles = sound
    ? [
        `为什么 ${root} 一开口就有形状？`,
        `听声音也能猜词义：${root} 的隐藏画面`,
        `${root} 不用硬背，先听出形状`,
      ]
    : [
        `${words[0]} 里为什么有 ${root}？`,
        `${root} 这组词，最容易混的是哪两个？`,
        `${words.length} 个 ${root} 词放在一张图里看`,
      ];

  const fallbackOpenings = sound
    ? [
        `同一个发音，会让人联想到怎样的形状？这次用小黑把 ${root} 演出来。`,
        `先不要看翻译。听一遍 ${root}，你脑中出现的是圆润还是尖锐？`,
      ]
    : [
        `${words[0]} 里藏着 ${root}。把它放回例句，和“${chinese}”相关的意思就清楚了。`,
        `${cover.hook}。这期用小黑的动作，把容易混的词放到同一个语境里看。`,
        `${root} 和“${chinese}”有关。前缀、词尾和搭配一换，${words.length} 个词各有自己的落点。`,
      ];
  const learningTip = sound
    ? '先听声音，再看小黑的动作和形状；第二遍关掉中文，试着自己说出联想。'
    : pick(
        [
          '看完后遮住中文，用画面复述每个词；卡住的那个，就是下一遍要重点看的词。',
          '可以暂停在总结页，任选两个词各造一句短句。',
          '做题时先找被修饰的对象，再回想视频里小黑做了什么。',
        ],
        project.slug,
      );
  const question = pick(
    [
      `不看视频，你还能说出 ${words[0]} 和 ${words.at(-1)} 的动作区别吗？`,
      `这组词里你最容易混淆哪两个？`,
      `先遮住中文，${words[pick([0, Math.floor(words.length / 2), words.length - 1], project.slug, 1)]} 你能自己拆出来吗？`,
    ],
    project.slug,
    2,
  );
  // Topic tags come from planning/growth-promotion.json: broad reach + exam intent + this episode's root.
  const tagPool = [
    ...growth.hashtags.always,
    pick(growth.hashtags.rotateExam, project.slug),
    ...(sound ? growth.hashtags.soundSymbolism : growth.hashtags.rootWord),
  ];
  const hashtags = [...new Set(tagPool)].slice(0, growth.hashtags.maxCount - 1).concat(`#${rootHashtag(root)}`).join(' ');
  const series = growth.series.name;
  const collection = growth.series.collectionName;
  const teaserWords = teaserWordList(project);
  const remaining = Math.max(1, words.length - teaserWords.length);
  const leadMagnet = growth.cta.leadMagnet;
  const verticalDir = path.join(resolveDeliveryPaths(project).directory, 'vertical');
  const hasVertical = existsSync(path.join(verticalDir, `${project.slug}-vertical.mp4`));
  const hasTeaser = existsSync(path.join(verticalDir, `${project.slug}-teaser.mp4`));
  const hasCard = existsSync(path.join(verticalDir, 'review-card.png'));
  const liveProduct = growth.products.find(
    (product) => product.status === 'live' && product.link && product.pairsWith.includes(sound ? 'sound-symbolism' : 'root-word'),
  );

  const titles = project.publishCopy?.titles ?? fallbackTitles;
  const opening = project.publishCopy?.opening ?? pick(fallbackOpenings, project.slug);
  const takeaway = project.publishCopy?.takeaway ?? learningTip;
  const viewerPrompt = project.publishCopy?.prompt ?? question;
  const basePinned = project.publishCopy?.pinnedComment ?? `从 ${wordList} 里挑一个词造句，我帮你看搭配。`;
  const pinnedComment = leadMagnet.enabled ? `${basePinned}\n${leadMagnet.pinnedComment}` : basePinned;
  const teaserTitle = teaserWords.length >= 2
    ? sound
      ? `${teaserWords[0]} 和 ${teaserWords[1]}，听起来哪里不一样？`
      : `${teaserWords[0]} 和 ${teaserWords[1]} 怎么区分？看小黑做一遍`
    : `${root} 先看这一个词`;

  return `# 抖音 / 小红书共用发布文案

## 标题备选

1. ${titles[0]}
2. ${titles[1]}
3. ${titles[2]}

## 推荐标题

${pick(titles, project.slug)}

## 可直接发布

${opening}

核心线索：${anchor}。
本期词族：${wordList}。

${takeaway}

${viewerPrompt}

${hashtags}

## 置顶评论

${pinnedComment}

${hasVertical ? `## 抖音竖屏发布（主推）

- 上传文件：\`vertical/${project.slug}-vertical.mp4\`（1080×1920 竖屏完整版）。横屏原版留给 B 站、西瓜或小红书横版。
- 封面：上传 \`cover.png\`（3:4，主页网格完整显示）。
- 合集：加入「${collection}」，方便观众连看。
- 发布后第一时间在评论区置顶下面的「置顶评论」，并回复前几条评论。
${liveProduct ? `- 资料：本期可挂「${liveProduct.name}」，视频里不说价格，只说“${liveProduct.videoCta ?? '资料已整理好'}”。\n` : ''}
` : `## 抖音竖屏发布（主推）

- 本期还没有竖屏版：运行 \`npm run vertical:render -- --project=${project.slug}\` 生成后重新生成本文案。

`}${hasTeaser ? `## 预告短片文案

- 上传文件：\`vertical/${project.slug}-teaser.mp4\`（约 30–45 秒，只讲 ${teaserWords.join('、') || words[0]}）。
- 建议先发预告，隔天发完整版；或完整版发布 2–3 天后再发预告拉新。

标题：${teaserTitle}

正文：${teaserWords.length ? `先用小黑的动作看懂 ${teaserWords.join('、')}。` : ''}剩下 ${remaining} 个词在合集「${collection}」里接着讲。

${growth.cta.commentPrompt}

${hashtags}

` : ''}${hasCard ? `## 复习卡

- 文件：\`vertical/review-card.png\`。可作为小红书图文第二张、粉丝群资料或私信回复。
${leadMagnet.enabled ? `- 已开启领取：评论关键词「${leadMagnet.keyword}」后私信发送；不要在任何位置留微信号或外部链接。\n` : `- 领取引导默认关闭；准备好私信或粉丝群交付后，在 planning/growth-promotion.json 打开 leadMagnet。\n`}
` : ''}## 发布备注

- 系列名「${series}」保持不变，标题里保留词根，方便搜索和连看。
- 抖音和小红书共用正文；发布时从三个标题中选择一个。
- 不要把“标题备选”和“发布备注”粘贴到平台正文。
- 下一次发布同一视频时更换标题角度，不要只替换表情符号。
`;
};

export const writeDouyinCopy = (project: ReplicaProjectDefinition, outputOverride?: string) => {
  const output = path.resolve(
    process.cwd(),
    outputOverride ?? resolveDeliveryPaths(project).douyinCopy,
  );
  mkdirSync(path.dirname(output), {recursive: true});
  const content = buildDouyinCopy(project);
  writeFileSync(output, content, 'utf8');
  const sharedOutput = path.join(path.dirname(output), 'publish-copy.md');
  const legacyOutput = path.join(path.dirname(output), 'douyin-copy.md');
  if (path.resolve(sharedOutput) !== path.resolve(output)) writeFileSync(sharedOutput, content, 'utf8');
  if (path.resolve(legacyOutput) !== path.resolve(output)) writeFileSync(legacyOutput, content, 'utf8');
  return output;
};
