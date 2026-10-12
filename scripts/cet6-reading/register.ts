import {readFileSync, writeFileSync} from 'node:fs';

const ledgerPath = 'planning/topic-history.json';
const planPath = 'planning/content-plan.json';
const ledger = JSON.parse(readFileSync(ledgerPath, 'utf8')) as {topics: Array<Record<string, unknown>>};
const topicId = 'cet6-reading-location-paraphrase';
const existing = ledger.topics.find((topic) => topic.id === topicId);
const topic = {
  id: topicId,
  column: 'cet6-reading',
  title: '六级阅读：先定位，再认同义替换',
  aliases: ['四六级阅读定位', '六级主旨题', '同义替换排除干扰项'],
  coreTeachingObjective: '用题型、关键词、同义定位和主线选项四步处理六级阅读主旨题，并通过迁移练习巩固方法。',
  material: {
    type: 'original-practice',
    passage: 'Cities are redesigning some public spaces to make them more resilient to extreme heat.',
    practicePassage: 'Universities are rethinking orientation programs.',
  },
  status: 'produced',
  artifacts: [
    'outputs/cet6-reading-location-paraphrase/cet6-reading-location-paraphrase.mp4',
    'outputs/cet6-reading-location-paraphrase/cover.png',
    'outputs/cet6-reading-location-paraphrase/cover-landscape.png',
    'outputs/cet6-reading-location-paraphrase/publish-copy.md',
    'outputs/cet6-reading-location-paraphrase/worksheet.html',
    'outputs/cet6-reading-location-paraphrase/review/REVIEW.md',
    'outputs/cet6-reading-location-paraphrase/review/full-preview/full-preview.mp4',
  ],
  selectionReason: '核对长期选题台账、内容计划、src、outputs、work/drafts、work/experiments、项目记忆和制作日志后，未发现该六级阅读主题已有成片；内容计划已列出“定位句与同义替换”，适合扩展为主旨题定位与排除训练。',
  checkedSources: [
    'planning/topic-history.json', 'planning/content-plan.json', 'src/', 'outputs/',
    'work/drafts/', 'work/experiments/', 'PROJECT_MEMORY.md', 'docs/production-log.md',
  ],
  reviewStatus: '脚本、内置 image_gen 栅格插图、双封面、成片技术检查和整片预览通过；完整人工观看与手机外放/耳机听审待完成。',
  publicationStatus: '未发布',
  versions: [{
    id: 'location-paraphrase-v1',
    status: 'produced',
    directory: 'outputs/cet6-reading-location-paraphrase',
    durationSeconds: 164.82133333333334,
    artifacts: [
      'outputs/cet6-reading-location-paraphrase/cet6-reading-location-paraphrase.mp4',
      'outputs/cet6-reading-location-paraphrase/cover.png',
      'outputs/cet6-reading-location-paraphrase/cover-landscape.png',
      'outputs/cet6-reading-location-paraphrase/publish-copy.md',
      'outputs/cet6-reading-location-paraphrase/review/full-preview/full-preview-report.json',
    ],
    technicalReview: '1920×1080、30fps、4943 帧、约 164.82 秒；H.264/AAC，完整解码通过；动态背景音乐按旁白段压低；5 张本期专属 image_gen 栅格插图；双封面和整片预览通过。',
    humanReview: '代表性联系页已检查；整片人工观看、手机外放与耳机听审待完成，当前为草稿。',
  }],
  latestDelivery: 'outputs/cet6-reading-location-paraphrase',
};
if (existing) Object.assign(existing, topic);
else ledger.topics.push(topic);
writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2) + '\n');

const plan = JSON.parse(readFileSync(planPath, 'utf8')) as {items: Array<Record<string, unknown>>};
const item = plan.items.find((candidate) => candidate.id === 'cet-reading');
if (item) {
  item.stage = '审核';
  item.next = '完整观看六级阅读成片，重点检查手机尺寸字幕、旁白与背景音乐比例；确认后再发布。';
  item.product = '六级阅读完整成片 + 双封面 + 定位与排除训练单 + 参考答案';
  item.source = '原创六级风格模拟题；未冒充真题；待发布前完整人工听审';
}
writeFileSync(planPath, JSON.stringify(plan, null, 2) + '\n');
console.log('Registered CET6 topic and updated content plan.');
