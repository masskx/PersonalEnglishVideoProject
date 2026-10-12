# mit / miss · Sunburst 完整重制版

本轮首选审片版本。完整视频为 `mit-miss-sunburst-full.mp4`：1920×1080、30fps、122.15 秒，保留原配音、字幕、背景音乐和双封面。

## 本版变化

- 8 个单词各使用准备、变化、结果三张静态语义关键姿态，共 24 张。
- `gpt-image-2.5-sunburst` 通过同一母版参考图编辑动作，避免三张图独立生成导致角色和机位漂移。
- 删除蓝色 SVG 机械叠层；画面只保留教学文字、字幕和小黑动作。
- 沿用流畅文字版的词素错峰归位、短距离滑入、遮罩揭示和平滑退出。

## 检查证据

- `render-report.json`：3663 帧、音视频轨、音量和长静音检查通过。
- `review/final-video-contact-sheet.jpg`：从最终 MP4 抽取的五段检查帧。
- `../mit-miss-images2-keyposes/contact-sheet.png`：24 张动作素材总览。

此版本已进入根工作台首项，但仍保留在 `work/experiments/`，没有覆盖 `outputs/mit-miss/` 的历史正式文件，也没有自动发布。
