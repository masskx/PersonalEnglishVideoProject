# ject = throw

- 最终成片：`ject.mp4`
- 统一封面：`cover.png`（1080×1440，React/Remotion 前端导出）
- 封面验收：`cover-report.json`
- 缩略检查：`cover-thumbnail-review.png`（270×360）
- 规格：1920×1080、30fps、105.000 秒、3150 帧
- 内容：`ject = throw`，以及 `reject / project / inject / object / subject`
- 结构：11 段音频时间轴 + 1 个全片持续舞台、11 段配音、7 张透明小黑插图
- 结尾：最后 0.6 秒淡至全黑
- 媒体：H.264 + AAC 双声道 48kHz，峰值 -2.90 dBFS
- 静音门禁：`-45 dB / 1.2s`，无未解释长静音

相关产物：

- `render-report.json`：完整媒体门禁报告；
- `beat-map.md`：场景、时间、核心信息和视觉动作；
- `comparison/`：与现有 press 成片的系列风格对照；
- `review-stills/`：中点、边界和制作复核帧；
- `spot-checks/`：从最终编码 MP4 解出的重点帧；
- `final-spot-checks/`：连续舞台升级后从最终编码 MP4 解出的动作、地图、例句、总结和结尾复核帧；
- `asset-contact-sheet.png`：7 张透明插图的白底人工复核表。

本条没有用户指定样片，因此 `comparison/` 只验证系列视觉语言，不宣称逐镜时间对应。
`reject` 插图在三次模型结果出现标签、光泽或黑边后改用代码绘制绿色底板，再通过统一抠图流程生成透明 PNG。
被拒绝的模型样本保留在项目级 `assets/archive/ject-rejected/`，不参与运行时渲染。

封面使用共享系列版式，并复用已验收的 `00_throw_hook.png`。视频视觉已升级为持续
`ject` 舞台；封面和其他四条已验收视频不受本次 Ject 专项重构影响。
