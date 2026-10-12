# spect = look / 看

本集按 `G:\抖音卡片英语白色\outputs\press\press.mp4` 拆解并复用系列语法：纯白舞台、微软雅黑、深蓝 `#041FA0`、橙色 `#E85810`、代码绘制箭头/径向图/例句/总结表，小黑只负责每个场景的核心观察动作。参考样片为 172.667 秒，本集为了满足 90–120 秒目标压缩为 117.900 秒；结尾保留同样的 0.500 秒全黑压暗。

## 交付物

- [spect.mp4](./spect.mp4)：1920×1080、30fps、H.264 `yuvj420p`、AAC stereo 48kHz。
- [cover.png](./cover.png)：1080×1440 竖版封面；[cover-landscape.png](./cover-landscape.png)：1200×900（4:3）小红书横版封面。
- [douyin-copy.md](./douyin-copy.md)：同步生成的发布文案。
- [beat-map.md](./beat-map.md)：场景、旁白、字幕、动作、代码图层和转场记录。
- [asset-contact-sheet.png](./asset-contact-sheet.png)：9 张透明小黑插图白底合成审图。
- [review-stills/](./review-stills/)：草片中点、边界帧与后缀标题修正证据。
- [final-encoded-checks/contact-sheet.png](./final-encoded-checks/contact-sheet.png)：最终编码 MP4 的 24 个抽帧；`review-stills/` 与 `final-spot-checks/` 保留源合成检查证据。
- [comparison/contact-sheet.png](./comparison/contact-sheet.png)：与 press 参考片的 16 个同时间点对比；[comparison/findings.md](./comparison/findings.md)：差异说明。
- [render-report.json](./render-report.json)：完整解码、音频峰值、白底/压暗、静音和背景音乐门禁报告。

## 教学决定

记忆钩子是“`SPECT` 是小黑的观察镜头；前缀决定镜头朝哪儿，后缀决定谁在看或看见什么”。八个词按 `inspect → respect → suspect → expect → prospect → spectator → spectacle → retrospect` 展开；`expect` 在主标题中保持正确拼写 `ex + pect`，旁白注明 `s` 的省写变体；`sus-` 明确标注为 `sub-` 的历史同化记忆钩子，`respect` 的“回看→重视”也在旁白中标明是词源记忆而非机械直译。

## 质量结果

- `replica:assets:verify`：9/9 资产通过；2848×1600 RGBA、覆盖率 2.57%–16.32%、可见绿残留均为 0.000%。其中 `respect`、`suspect`、`expect` 初版模型图因重复角色、问号字形和箭头被人工退回，改为仓库内代码绘制的简洁绿幕动作源后重新走同一抠像链路。
- `replica:validate`：12 场景、56 图层、117.900 秒；所有语音倍率 ≤1.16×，7 个场景有接近上限的提示但无硬门禁失败。
- `replica:render:verify`：3537 帧，完整音视频解码，峰值 `-2.86 dBFS`，0 个旁白覆盖缺口，0 个未解释长静音；采样画面从 `(255,255,255)` 进入 `(0,0,0)`，15 帧全黑淡出。
- 封面检查：竖版/横版均通过不透明 PNG、白角、尺寸和 8 词 chip 检查。
- 对比结论：白底、配色、镜头标签、词形拆分、动作插图、代码箭头和总结表与 press 系列一致；仅内容顺序和总时长按 spect 八词及 90–120 秒目标重新编排，未声称与 press 的绝对时间一一对应。
