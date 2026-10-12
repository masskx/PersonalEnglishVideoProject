# duc / duct / duce 内容与角色质检

## 内容

- 主题：`duc / duct / duce = lead`，带领、引导。
- 例词：`conduct`、`induce`、`reduce`、`produce`、`introduce`、`deduce`。
- 教学边界：视频把前缀讲成“引导方向”的记忆线索；这是一种便于记忆的构词提示，不把它表述成所有单词都能机械套用的万能规则。
- 词义核对：
  - [Merriam-Webster: conduct](https://www.merriam-webster.com/dictionary/conduct)
  - [Merriam-Webster: induce](https://www.merriam-webster.com/dictionary/induce)
  - [Merriam-Webster: reduce](https://www.merriam-webster.com/dictionary/reduce)
  - [Merriam-Webster: produce](https://www.merriam-webster.com/dictionary/produce)
  - [Merriam-Webster: introduce](https://www.merriam-webster.com/dictionary/introduce)
  - [Etymonline: deduce](https://www.etymonline.com/word/deduce)

## 角色与画面

- 小黑角色母版：`public/assets/replica/mit-miss/00_send_hook.png`。
- 本版修订采用 `mit-miss-sunburst-full` 的真实链路：先以已接受的小黑素材生成 6 张手绘语义母版，再从每张母版分别编辑 `before / change / result`，共 18 张透明关键姿态；不使用通用火柴人，不使用全画布 SVG 语义叠层。
- 关键姿态在 Remotion 中按固定机位互斥切换：每个词 `0–3.1s` 为 before、`3.1–5.2s` 为 change、`5.2s–场景结束` 为 result；图片层均为 `enter: none / exit: none`，动作由角色与局部手绘道具的姿态变化承担。
- 素材验收：7/7 主语义资产通过自动 QA；关键姿态 18/18 通过透明素材 QA；白底复合总览：`review/handdrawn-keypose-contact-sheet.jpg`。
- 参考编辑报告：`review/handdrawn-base-reference-edit-report.json`、`review/handdrawn-keypose-reference-edit-report.json`。

## 成片验收

- 成片：`134 秒 / 1920×1080 / 30fps / 4020 帧 / H.264 + AAC`。
- 严格渲染检查通过：音频峰值 `-2.87 dBFS`，无异常长静音窗口；编码后抽查 conduct、induce、deduce 三组词的 before/change/result 切点，均保持白底、角色完整和局部道具，不出现 SVG 式全屏遮挡。
- 竖版与横版封面检查通过，均为不透明 PNG、白色安全角、包含 6 个例词。
- 状态：已完成制作，未自动发布或上架。
