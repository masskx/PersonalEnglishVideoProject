# pon / pos 词根视频验收记录

日期：2026-09-30  
项目：`pon-pos`  
状态：交付完成，`release.json` 保持 `draft`，未发布

## 通过项

- 选题已核对历史台账、注册表、正式输出、草稿和试验目录；`pon / pos = put / place` 为本轮未制作主题。
- 14 个场景、168.45 秒；旁白清单 14/14，CosyVoice v3 flash / longanhuan，严格保留 instruction。
- 7 个目标词各自拥有独立的 before / change / result 三姿态，共 21 张本期专属透明位图；`replica:assets:verify` 通过 21/21。
- `replica:preflight` 与 `replica:validate` 通过；7 个词均映射到唯一三姿态集合，旁白覆盖空档为 0。
- 正式 MP4：1920×1080、30fps、5054 帧、H.264/AAC；`replica:render:verify` 通过，峰值 -2.75 dBFS，视频/音频完整解码，允许长静音窗口为 0。
- 竖版与横版封面均通过尺寸、四角纯白和 7 词完整性检查。
- `replica:full-preview` 已生成并在 Codex 面板打开；自动布局为 0 个 error。每秒联系页、手机版 14 场抽帧和 28 个关键姿态切点人工检查通过，未发现实际文字溢出、词义错配或动作断裂。
- 与最新 `ten / tain` 接受样片完成 16 点接触表对照，确认白底留白、蓝橙层级、三姿态动作、构图变化和教学节奏保持同一制作基准。
- `content-qa.md` 已逐词记录现代义、记忆桥梁边界，并核对 Cambridge Dictionary 与 Etymonline。

## 非阻断提醒

- 自动布局报告保留 27 个 safe-margin warning，主要来自透明插图/文字层的预留盒超出保守边界；人工联系页确认画面内容没有被裁切。
- 项目校验提示背景音乐在旁白段估算约 -42.5 dB，发布前按规则用手机外放与耳机各听一次，确认旁白优先且音乐仍可感知。
- `pon-pos-examples` 的旁白播放速率为 1.133，低于 1.16 门禁，但属于接近上限的提示。

## 交付路径

- 成片：`outputs/pon-pos/pon-pos.mp4`
- 双封面：`outputs/pon-pos/cover.png`、`outputs/pon-pos/cover-landscape.png`
- 发布文案：`outputs/pon-pos/publish-copy.md`
- 内容核对：`outputs/pon-pos/content-qa.md`
- 全片预览：`outputs/pon-pos/review/full-preview/full-preview.mp4`
- 技术报告：`outputs/pon-pos/render-report.json`、`outputs/pon-pos/review/full-preview/full-preview-report.json`
