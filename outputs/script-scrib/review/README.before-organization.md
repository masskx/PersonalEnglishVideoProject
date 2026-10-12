# SCRIPT / SCRIB = WRITE / 写

新的白底小黑词根讲解视频，成片 112 秒，讲解 8 个词：
`describe`、`prescribe`、`subscribe`、`transcribe`、`manuscript`、`inscription`、`postscript`、`scribble`。

## 交付物

- `script-scrib.mp4`：1920×1080 / 30 fps / H.264 + AAC 正式成片
- `cover.png`：1080×1440 抖音竖版封面
- `cover-landscape.png`：1200×900 小红书横版封面
- `douyin-copy.md`：可直接发布的标题、正文与置顶评论
- `beat-map.md`：完整文案节拍与 Storyboard
- `asset-contact-sheet.png`：9 张透明小黑静帧白底检查
- `dynamic-contact-sheet.jpg`：9 组动态候选的起势、中段与收势
- `review-stills/`：12 个场景中点抽帧及接触表
- `comparison/`：与 `press` 系列样片的 7 组并排抽帧
- `comparison-findings.md`：对比结论与有意差异
- `render-report.json`：帧数、像素、音量、静音和结尾压暗验证
- `cover-report.json` / `cover-landscape-report.json`：封面尺寸与纯白角点验证
- `wan/`：动态任务清单、源视频与抠像报告

## 质量结果

- 3360 帧、112 秒、1920×1080、30 fps。
- 最高配音加速倍率 1.079；最终总结 1.033。
- 峰值 -2.80 dBFS；无 ≥1.2 秒未解释长静音。
- 9/9 透明插图通过尺寸、透明边缘与残绿检查。
- 结尾第 3344 帧为白、第 3352 帧为中灰、第 3359 帧为黑。
- 两张封面均为不透明 PNG、四角 `#FFFFFF`，8 个词完整。
- Iconfont 检索未发现可核验的候选级商用授权，因此采用零外部图标。

## 复现

```powershell
npm run typecheck
npm run replica:validate -- --project=script-scrib
npm run replica:assets:verify -- --project=script-scrib
npm run replica:render -- --project=script-scrib
npm run replica:render:verify -- --project=script-scrib
npm run replica:cover:verify -- --project=script-scrib
```
