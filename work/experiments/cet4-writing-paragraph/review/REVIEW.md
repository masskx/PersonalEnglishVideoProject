# 四级作文试片验收

日期：2026-09-12。版本：完成首标题与混音修正的完整试片。

## 交付

- cet4-writing-paragraph.mp4：1920×1080，30 fps，3181 帧，视频时长 106.033 秒。
- cover.png：1080×1920；cover-landscape.png：1200×900，分别排版。
- index.html：本地播放器、10 个章节跳转和资料入口。
- worksheet.html / worksheet.pdf：原创练习和参考答案；PDF 为两页 A4，已检查分页与文字。
- script.md、publish-copy.md、voice-report.json、asset-manifest.json。

## 内容与制作

范围是四级作文主体段展开，用原创阅读话题演示具体观点、作用过程和行动例子，
再用运动话题迁移。文本核对见 content-review.md；不冒充真题或完整范文。
原句缩小、划线，新句顺序进入；保留阅读时间，不逐字跳动整段英文。
六个章节入口的标题立即可读，正文再进入，避免内容区切入空白。

配音为 15 段新百炼 cosyvoice-v3-flash / longanhuan；中文合成语速 1.08，英文 1。
按 ffprobe 测量时长生成 src/cet-writing/timeline.json，播放不加速。
字幕是每段的摘要/译文，不是逐字强制对齐字幕。
沿用原 BGM，复用已有写字小黑插图；未请求新的生图或图生视频。

## 检查结果

- npm run typecheck 通过。
- npm run project:test 通过；project:check 通过并保留原 17 期审核和 4 处发布状态冲突提示。
- verifyCetWriting.py 对最终修正版校验通过：帧数、恒定帧率、完整解码、AAC 48kHz 双声道。
- 混音峰值 −5.7 dBFS；对白增益 0.72，音乐 0.045，没有最终音轨削波。
- 独立于背景音乐检查旁白覆盖，未发现非预期长静音。
  89.22–92.00 秒为练习思考窗口：包括两秒额外停顿和 TTS 片段首尾空隙。
- 初稿 19 张 still 与双封面均已目检。最终编码视频提取 76 张审查帧，覆盖每段语音边界、
  动效中间态、练习倒计时和结尾；复核了改句、原因、例子、练习和六个章节首帧。
  最终首帧证据见 first-headings.jpg；encoded-*.jpg 与 encoded-index.json 对应最终 MP4。
- heading-fix.json 记录六处首帧修正，修正时音轨数据未变。
- audio-mix-fix.json 记录混音余量修正，调整音轨时视频数据未变。
- 播放页已通过加载、章节跳转、静音播放推进和暂停验证；未将静音播放当作听审。

## 状态

这是用于观看效果的完整试片，未发布或上架。已完成技术检查和上述画面/文本核对，
尚未完成整期人工听审或独立教师审核。原词根视频、双封面与发布记录保持不变。
work/experiments 里的历史渲染与处理中间文件仅供复现，用户入口以 index.html 为准。
