> 历史盘点：本文件主要记录 2026-09-11 的状态。2026-09-12 已完成目录归位与路径修复；当前入口见 [项目管理页](../../PROJECTS.html) 和 [整理结果](../project-organization/RESULTS.md)。

# 制作架构与模板审计

审计日期：2026-09-11。结论来自代码、配置及本地检查，不包含平台运营数据，也没有调用绘图、配音或图生视频 API。作品状态见[作品清单](INVENTORY.md)，技能职责见[技能说明](SKILLS.md)。

## 两条制作线

| 制作线 | 当前范围 | 入口与交付 |
| --- | --- | --- |
| 白底小黑词根 / 语音象征长视频 | 注册 17 集，约 102–173 秒，1920×1080、30 fps | [项目注册表](../../src/replica/projects/registry.ts) → [ReplicaVideo](../../src/replica/ReplicaVideo.tsx)；视频、1080×1440 竖封面、1200×900 横封面、发布文案 |
| 情景梗单词短视频 | interrupt 原型，15–28 秒，1080×1920、30 fps | [内容与默认输入](../../src/meme-vocab/content.ts) → [短视频分镜](../../src/meme-vocab/storyboard.ts) → [MemeVocabShortVideo](../../src/meme-vocab/MemeVocabShortVideo.tsx)；配置、分镜、提示词、配音、视频与 QA |

[Root.tsx](../../src/Root.tsx) 共注册 20 个 Remotion 合成项：17 集长视频、1 个短视频、2 个共用封面。17 集并非 17 套独立模板：16 集使用 [GenericContinuousStage](../../src/replica/GenericContinuousStage.tsx)，ject 使用 [JectContinuousStage](../../src/replica/JectContinuousStage.tsx)。旧 `default` 图层渲染分支仍保留，当前项目没有使用。

长视频链路：项目配置 → 分镜与配图提示词 → 分场景配音及音频清单 → 插图生成、去底、素材校验 → Remotion 渲染 → 两种封面与发布文案。[渲染脚本](../../scripts/replica/renderProject.ts) 运行类型检查、项目校验和插图校验；正式模式自动产出封面及文案。成片解码、黑帧、静音等检查另由 [verifyRender.ts](../../scripts/replica/verifyRender.ts) 执行，不能把渲染成功等同于全部验收完成。

短视频链路：[generate.ts](../../scripts/meme-vocab/generate.ts) 写出内容配置、提示词和素材清单 → 人工或其他流程补齐插图 → [generateTts.ts](../../scripts/meme-vocab/generateTts.ts) 配音 → [timeline.ts](../../src/meme-vocab/timeline.ts) 根据音频实长重排 → [render.ts](../../scripts/meme-vocab/render.ts) 渲染并调用 QA。当前生成脚本不会直接请求即梦绘图。

## 外部服务与配置位置

| 用途 | 代码默认配置 | 配置与实现 |
| --- | --- | --- |
| 主线绘图 | 火山方舟 Seedream，`doubao-seedream-4-0-250828`，2K | [每集项目配置](../../src/replica/projects/)、[generateIllustrations.ts](../../scripts/replica/generateIllustrations.ts)，后者第 101 行起调用方舟图片接口；不是即梦网页操作 |
| 配音 | 百炼 DashScope，`cosyvoice-v3-flash`，`longanhuan` | [主线配音](../../scripts/replica/generateVoice.ts)、[短线配置](../../src/meme-vocab/config.ts)、[共用 DashScope 客户端](../../src/tts/dashscope.ts) |
| 可选图生视频 | 百炼 `wan2.2-i2v-flash`，5 秒 | [submitWanI2V.ts](../../scripts/replica/submitWanI2V.ts)、[白底批量提交](../../scripts/replica/submitWanWhiteBatch.ts)；后续处理为帧序列 |
| 背景音乐 | 全系列共用一首音乐，旁白期间自动压低音量 | [seriesAudio.ts](../../src/replica/seriesAudio.ts) |

上述为代码默认值；环境变量可覆盖部分设置，本次没有读取密钥值，也未确认覆盖后的实际请求参数。`config/voice/` 当前为空，主要配置并不存放在那里。

## 模板重复的具体来源

1. **内容顺序重复。** 后期多数集数使用 12 段结构：“开头 → 词根地图 → 8 个单词 → 例句 → 总结”。大量单词场景复用相同坐标、出场时点和拆词公式，例如 [formStoryboard.ts](../../src/replica/formStoryboard.ts) 第 18 行的 `wordScene`。
2. **视觉和声音变化少。** [theme.ts](../../src/replica/theme.ts) 固定白底、橙蓝和微软雅黑；封面共用 [RootWordCover.tsx](../../src/replica/RootWordCover.tsx)；默认音色及 BGM 一致。
3. **动作变化尚未改变叙事。** 多数动画是图片的位移、缩放、淡入和循环。dict、script-scrib、tract、form 各配置 9 组动态资源；struct、flect-flex、rupt、mit-miss 使用静态卡片模式，后三者另加语义道具动画。配置见 [continuousStageData.ts](../../src/replica/continuousStageData.ts)。这些差异主要作用于画面表现。
4. **长视频节奏主要由预定场景时长控制。** [ReplicaVideo.tsx](../../src/replica/ReplicaVideo.tsx) 第 137 行会加速过长的配音；[captionUtils.ts](../../src/replica/captionUtils.ts) 按文字长度分配字幕时间。它们不提供逐词音画对齐。

以上能够解释结构相似，但不能证明相似已经导致账号流量下降。后续应结合留存、完播、收藏、评论等实际数据判断。

## 已有扩展接口

- [projectTypes.ts](../../src/replica/projectTypes.ts)：每集统一描述内容、素材路径、封面、TTS、图像模型与质量参数；新集由注册表接入。
- 同文件的 `scenePlans`、`wordBuild`、`dynamicAssets`、`semanticPropTrack`：分别控制语义时点、拆词组装、动态资源和道具动画，可以复用现有音频与渲染流水线。
- [types.ts](../../src/replica/types.ts)：图层支持文字、图片、箭头、图标、表格、放射图及进出场动画；但主线尺寸和主题仍主要是全局固定值。
- [短视频类型](../../src/meme-vocab/types.ts) 与[时间线](../../src/meme-vocab/timeline.ts)：已经划分 Hook、情景、单词揭示、真实用法、互动五类场景，并按配音时长安排镜头。这是后续短内容可复用的基础。

建议先把“每期内容”与“栏目结构”分开，再引入情境单词、易混词对决、限时挑战等结构。保留长视频作为系统复习栏目；不同栏目不必都继承同一张词根卡。`GenericContinuousStage.tsx` 已超过 1200 行且包含特定集动画，后续扩展时宜拆成独立场景组件。

## 优化前需要处理的问题

### interrupt 是原型，尚非通用换词模板

虽然 CLI 接收 `--word`、`--meaning`、`--scenario` 等参数，但 [content.ts](../../src/meme-vocab/content.ts) 第 25 行起的 Hook、测试题与答案，[storyboard.ts](../../src/meme-vocab/storyboard.ts) 第 14 行起的老板画饼故事、inter/rupt 拆词、部分音标与 TTS、例句翻译、选项和素材 ID，以及 [generate.ts](../../scripts/meme-vocab/generate.ts) 第 51 行起的发布文案仍大量写死 interrupt。只替换词名可能产生画面、口播、答案互相不符。

后续应把 Hook、情节、助记依据、英文例句、中文翻译、问题、选项、答案和发布文案都纳入完整单期配置，再扩展新词。当前 [render.ts](../../scripts/meme-vocab/render.ts) 第 16 行默认 `--scale=0.5`，输出 540×960 草稿；正式竖屏需要指定 `--scale=1`。

### rupt 旁白有一处明确的否定错误

[ruptStoryboard.ts](../../src/replica/ruptStoryboard.ts) 第 57 行写着“interrupt me，就是别打断我”。`interrupt me` 本身没有否定，应改为 “Please don’t interrupt me”，或把中文改为“打断我”。本次只记录，未改动分镜、配音或成片；修复时应一并核对对应音频和字幕，避免只改源码。

[内容 QA 脚本](../../scripts/replica/generateContentQa.ts) 生成的是“待人工核对”检查单，不是已验证的词源结论。该问题也说明技术检查通过不能替代内容核对。

### 发布状态与产物路径需要统一

[releaseStatus.ts](../../scripts/replica/releaseStatus.ts) 会把目录重命名为 `${slug}发了`，但项目默认渲染路径仍指向原目录，重渲染可能再次创建原目录。整理应依照[作品清单](INVENTORY.md)保留冲突证据，后续统一清单与路径规则，避免自动合并不同版本。

## 验证边界

本轮已完成 TypeScript 检查、现有 meme-vocab 测试和 17 集长视频 `validateProject`，均通过；部分长视频场景提示约 1.12–1.159 倍播放速率接近上限。统一检查结果另见 [validation-results.json](validation-results.json)。没有重新生成媒体；这些检查不替代视觉审看、配音听审和词义、词源核对。
