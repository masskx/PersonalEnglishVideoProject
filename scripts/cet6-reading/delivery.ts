import {writeFileSync, mkdirSync} from 'node:fs';
import {readingCues, text} from '../../src/cet6-reading/lesson';
import timeline from '../../src/cet6-reading/timeline.json';

const base = 'outputs/cet6-reading-location-paraphrase';
mkdirSync(`${base}/review`, {recursive: true});
const esc = (value: string) => value.replace(/[&<>'"]/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
}[char] ?? char));

writeFileSync(`${base}/script.md`, `# 六级阅读：先定位，再认同义替换\n\n原创六级风格练习；本期聚焦主旨题的定位与排除。\n\n${readingCues.map((cue) => `## ${cue.id}\n\n旁白：${cue.voice}\n\n字幕：${cue.caption}`).join('\n\n')}\n`);

writeFileSync(`${base}/publish-copy.md`, `# 六级阅读主旨题：先定位，再认同义替换\n\n主旨题不用从第一句翻到最后一句。先看题干，圈出对象和问题背景；回原文找同义表达；最后选能覆盖全文主线的选项。\n\n这期用“城市应对极端高温”的原创六级风格段落，演示定位句、改写表达和干扰项排除，再用校园迎新活动做一道迁移练习。\n\n你在考场上可以直接套这四步：题型 → 关键词 → 同义定位 → 主线选项。\n\n#六级阅读 #四六级备考 #英语阅读 #同义替换 #小黑英语\n`);

writeFileSync(`${base}/content-qa.md`, `# 内容检查：六级阅读定位与同义替换\n\n- 题型：原创六级风格主旨题，未冒充真题。\n- 讲解主线：题型 → 关键词 → 原文定位 → 同义改写 → 主线选项。\n- 原文场景：城市用遮阴树、反射材料和节水景观应对极端高温。\n- 正确答案：How cities use several measures to cope with extreme heat.\n- 迁移练习答案：To help new students build connections before classes become demanding.\n- 干扰项处理：分别指出只抓空调商场、单个措施和测温方法的局部信息。\n- 语言检查：旁白使用自然短句，未套用“不是……而是……”等批量模板。\n- 发布状态：草稿，未发布；完整人工观看、手机外放和耳机听审仍需发布前完成。\n`);

writeFileSync(`${base}/review/REVIEW.md`, `# 六级阅读视频验收记录\n\n- 成片：1920×1080，30fps，${timeline.totalFrames} 帧，约 ${(timeline.totalFrames / 30).toFixed(2)} 秒。\n- 配音：${readingCues.length} 段 CosyVoice 旁白，按实测时长排布。\n- 画面：5 张本期专属内置 image_gen 栅格插图，运行时使用 episode-local public bundle。\n- 动画：帧驱动文字 reveal、轻微上移、同镜头语义图切换和白底淡入淡出。\n- 音频：系列纯音乐动态 ducking，人声段主动压低，停顿段轻微抬升。\n- 封面：竖版与横版均沿用词根封面母版。\n- 整片预览：review/full-preview/full-preview.mp4，每秒抽帧 165 张；layoutIssues/layoutErrors/layoutWarnings 均为空。\n- 已检查：开场、题干段落、关键词、定位、改写、选项、干扰项、练习和收尾联系页；未发现文字溢出。\n- 仍需：发布前连续观看整片，并用手机外放和耳机确认人声优先。\n`);

writeFileSync(`${base}/release.json`, JSON.stringify({
  status: 'draft',
  updatedAt: '2026-09-29',
  topic: '六级阅读：定位句与同义替换',
  note: '成片、双封面、整片预览和技术检查通过；完整人工观看、手机外放和耳机听审待完成。未发布。'
}, null, 2) + '\n');

const chapters = timeline.cues.filter((cue, index) => index === 0 || cue.panel !== timeline.cues[index - 1].panel)
  .map((cue) => ({title: cue.caption, seconds: cue.from / 30}));
writeFileSync(`${base}/index.html`, `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>小黑英语 · 六级阅读</title><style>body{margin:0;background:#f3f7fc;font-family:"Microsoft YaHei",sans-serif;color:#142544}main{max-width:1180px;margin:auto;padding:32px}video{width:100%;background:#fff;border-radius:15px}h1{color:#082b8a}.links{display:flex;gap:18px;flex-wrap:wrap;margin:24px 0}a{color:#082b8a}</style><main><h1>六级阅读：先定位，再认同义替换</h1><p>原创六级风格练习 · ${(timeline.totalFrames / 30).toFixed(1)} 秒完整讲解</p><video id="v" src="cet6-reading-location-paraphrase.mp4" controls poster="cover-landscape.png"></video><p id="chapters"></p><div class="links"><a href="cet6-reading-location-paraphrase.mp4" download>保存 MP4</a><a href="cover.png" download>竖封面</a><a href="cover-landscape.png" download>横封面</a><a href="worksheet.html">练习单</a><a href="script.md">讲稿</a><a href="publish-copy.md">发布文案</a><a href="review/REVIEW.md">验收说明</a><a href="../../PROJECTS.html">返回工作台</a></div></main><script>const v=document.querySelector('#v');for(const c of ${JSON.stringify(chapters)}){const b=document.createElement('button');b.textContent=c.title;b.style='margin:4px;padding:8px;border:1px solid #cad5e5;border-radius:8px;background:#fff;color:#082b8a;cursor:pointer';b.onclick=()=>v.currentTime=c.seconds;document.querySelector('#chapters').append(b)}</script></html>`);

writeFileSync(`${base}/worksheet.html`, `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>六级阅读定位练习</title><style>body{max-width:850px;margin:38px auto;padding:0 28px;font:16px/1.75 "Microsoft YaHei",Arial;color:#142544}h1,h2{color:#082b8a}.box{padding:16px 20px;background:#f3f7fc;border-left:5px solid #f26419;margin:14px 0}.en{font-family:Arial;font-size:18px}.line{height:34px;border-bottom:1px solid #cbd5e6}@page{size:A4;margin:16mm}@media print{body{margin:0;padding:0;font-size:12px}.en{font-size:15px}.line{height:27px}}</style><h1>六级阅读：先定位，再认同义替换</h1><p>小黑英语 · 原创六级风格练习</p><h2>01 主旨题定位</h2><div class="box en">${esc(text.passage)}</div><p>题目：${esc(text.question)}</p><p>关键词：________________　问题背景：________________</p><div class="line"></div><h2>02 选项排除</h2><p>A：${esc(text.distractors[0])}</p><p>C：${esc(text.distractors[1])}</p><p>D：${esc(text.distractors[2])}</p><p>它们分别只抓到了什么局部信息？</p><div class="line"></div><div class="line"></div><h2>03 迁移练习</h2><div class="box en">${esc(text.practicePassage)}</div><p>${esc(text.practiceQuestion)}</p><div class="line"></div><div class="line"></div><h2>参考答案</h2><p class="en">${esc(text.correct)}</p><p class="en">${esc(text.practiceAnswer)}</p><p>检查顺序：题型 → 关键词 → 同义定位 → 主线选项。</p></html>`);

writeFileSync(`${base}/README.md`, `# 六级阅读：先定位，再认同义替换\n\n- [播放页](index.html)\n- [成片](cet6-reading-location-paraphrase.mp4)\n- [竖封面](cover.png) / [横封面](cover-landscape.png)\n- [配套练习](worksheet.html)\n- [讲稿](script.md) / [发布文案](publish-copy.md)\n- [验收说明](review/REVIEW.md)\n- [整片预览](review/full-preview/full-preview.mp4)\n\n规格：1920×1080 / 30 fps / ${(timeline.totalFrames / 30).toFixed(2)} 秒。原创六级风格练习，当前为草稿，未发布。\n`);
console.log('Prepared CET6 delivery pages, worksheet, script, QA and release record.');
