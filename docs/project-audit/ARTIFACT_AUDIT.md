> 历史盘点：本文件主要记录 2026-09-11 的状态。2026-09-12 已完成目录归位与路径修复；当前入口见 [项目管理页](../../PROJECTS.html) 和 [整理结果](../project-organization/RESULTS.md)。

# 成片、素材与实验产物盘点

盘点日期：2026-09-11。范围：本机 `F:/抖音卡片英语白色`。本文依据目录、JSON/Markdown 报告、当前视频和封面文件的实际媒体信息整理；没有调用图片、配音或视频生成接口，没有重新渲染，也没有覆盖历史验收报告。

目前已经积累了 **17 期横屏成片、34 张正式封面，以及一个尚未完成图片替换的竖屏单词实验**。成片文件齐全；较大的缺口集中在内容核对、发布记录一致性、历史路径和实验资产管理。

## 1. 先看哪一份

| 要找什么 | 位置与判断方法 |
|---|---|
| 17 期当前横屏成片 | `outputs/` 各主题目录内的 `<slug>.mp4`；不要将同目录的 `draft.mp4` 当作正式版本 |
| 抖音竖封面 | 各主题目录的 `cover.png`，实际尺寸均为 1080×1440 |
| 小红书横封面 | 各主题目录的 `cover-landscape.png`，实际尺寸均为 1200×900 |
| 发布文案 | 各主题目录的 `publish-copy.md`；17 份 `douyin-copy.md` 与其逐文件哈希相同，是兼容镜像 |
| 内容是否经过核对 | 查看 `content-qa.md` 的结论和来源，不能只看文件是否存在 |
| 本地发布状态 | `release.json`；文件夹名称含“发了”只是另一份人工标记，二者目前存在冲突 |
| 竖屏短视频新方向 | `output/interrupt/final-with-tts.mp4`，18.067 秒、540×960，仍为占位图草稿 |
| 白板手绘方向 | `work/whiteboard-pilot/README.md` 和试片；此处是独立实验 |
| 整个项目的机器可读清单 | 参阅同次整理生成的 `docs/project-audit/` |

## 2. 17 期交付矩阵

下表“成套”表示五类文件实际存在：正式 MP4、竖封面、横封面、两份发布文案、`release.json`。每期还都存在 `render-report.json`、`cover-report.json`、`cover-landscape-report.json`。

全部 17 个 MP4 的当前媒体信息经项目自带 `ffprobe.exe` 读取，均为 **1920×1080、30fps、H.264 视频与 AAC 音频**。时长取视频流，容器/音频流可能多出少量编码尾帧。

| 实际文件夹 | 时长（秒） | 视频帧数 | 交付文件 | 本地 release 状态 | 内容 QA 现状 | 特别注意 |
|---|---:|---:|---|---|---|---|
| `outputs/aud发了/` | 112.200 | 3366 | 成套 | published | 待人工核对，0/5 勾选 | 缺发布平台、日期和链接 |
| `outputs/bouba-kiki/` | 102.300 | 3069 | 成套 | draft | 待人工核对，0/5 勾选 | 语音象征主题 |
| `outputs/dict发了/` | 112.000 | 3360 | 成套 | published | 待人工核对，0/5 勾选 | 缺发布平台、日期和链接 |
| `outputs/fer/` | 136.033 | 4081 | 成套 | draft | 待人工核对，0/5 勾选 | 早期样片对应主题 |
| `outputs/flect-flex发了/` | 112.000 | 3360 | 成套 | draft | 待人工核对，0/5 勾选 | 文件夹与 release 冲突；留有 draft |
| `outputs/form/` | 112.000 | 3360 | 成套 | draft | 待人工核对，0/5 勾选 | 留有 draft |
| `outputs/ject发了/` | 105.000 | 3150 | 成套 | published | 待人工核对，0/5 勾选 | 缺发布平台、日期和链接 |
| `outputs/mit-miss/` | 122.100 | 3663 | 成套 | approved | 缺少 content-qa.md | 留有 draft；缺单期 README 和 comparison 目录 |
| `outputs/port发了/` | 112.500 | 3375 | 成套 | published | 待人工核对，0/5 勾选 | 缺发布平台、日期和链接 |
| `outputs/press/` | 172.667 | 5180 | 成套 | draft | 待人工核对，0/5 勾选 | 最长一期，约 2 分 53 秒 |
| `outputs/reg/` | 103.333 | 3100 | 成套 | draft | 待人工核对，0/5 勾选 | 早期样片对应主题 |
| `outputs/rupt发了/` | 122.100 | 3663 | 成套 | approved | 缺少 content-qa.md | 文件夹与 release 冲突；留有 draft；缺单期 README 和 comparison 目录 |
| `outputs/script-scrib/` | 112.000 | 3360 | 成套 | draft | 待人工核对，0/5 勾选 | 交付目录仍含 wan 中间材料 |
| `outputs/spect发了/` | 117.900 | 3537 | 成套 | published | 待人工核对，0/5 勾选 | 缺发布平台、日期和链接 |
| `outputs/struct发了/` | 112.000 | 3360 | 成套 | draft | 待人工核对，0/5 勾选 | 文件夹与 release 冲突；留有 draft |
| `outputs/tract发了/` | 112.000 | 3360 | 成套 | draft | 待人工核对，0/5 勾选 | 文件夹与 release 冲突；含 wan、wan-white 中间材料 |
| `outputs/vis-vid/` | 118.500 | 3555 | 成套 | draft | 待人工核对，0/5 勾选 | 同时保留 comparison 与 comparison-14 |

成片总大小为 **321,711,947 字节，约 306.8 MiB**。`outputs/` 总计约 597.4 MiB，其余主要是双封面、抽帧、联系表、验收材料、部分草片以及 `rupt` / `mit-miss` 的交付素材副本。

### 发布状态的证据边界

- `release.json` 合计：**5 期 published、10 期 draft、2 期 approved**。
- 含“发了”的目录有 9 个，其中 `flect-flex`、`struct`、`tract` 的 JSON 仍为 draft，`rupt` 为 approved。
- 5 份 published 记录均为 `platforms: []`、`publishedAt: null`、`postUrl: null`。本文只能确认“本地标注发布”，**没有验证抖音或小红书上的远程发布状态**。
- `rupt` 和 `mit-miss` 的 release 结构与另外 15 期不同：缺少统一的 `schemaVersion`、平台及链接字段。`mit-miss` 自述 QA pass；`rupt` 记录 `verifiedAt`。这些记录不能补足具体的词源核对证据。
- 现有记录不含能支持选题效果判断的播放、完播、关注转化数据。不能从“文件名发了”推断哪类内容表现更好。

### 内容准确性尚未形成闭环

15 份现存 `content-qa.md` 都明确写着：**“状态：待人工核对。此文件是发布前检查单，不代表词源结论已经通过。”** 单词行中的现代义、词源关系、助记标记、权威来源仍为“待核对”，每份均有 5 个未勾选项，合计 75 项。另有 2 期缺少此文件。

这说明当前仓库没有一份可以据此认定“内容 QA 已完成”的单期检查单；它不证明视频中的讲解一定有错。后续应补真实来源和结论，再将词源事实、现代用法和助记联想分别表述。

## 3. 历史验收报告能证明什么

| 证据 | 本次看到的实际状态 | 可得出的结论 |
|---|---|---|
| 17 份 render-report.json | 均为 `errors: []`，`fullDecode.video/audio: true` | 历史报告记录媒体门禁通过 |
| 当前 MP4 元数据 | 17 期尺寸、帧率、编码、帧数均与相应历史报告一致 | 当前文件的主要媒体参数与历史记录相符 |
| 当前 MP4 字节数 | 17 期均与历史报告的 `metadata.format.size` 相同 | 大小一致；不能代替内容哈希或重新完整解码 |
| 34 张当前封面 | 实测竖图 1080×1440、横图 1200×900 | 当前封面尺寸正确 |
| 34 份封面报告 | 均记录 `ok: true`、`errors: []` | 历史自动检查通过；不等于再次人工审美检查 |
| 内容检查单 | 15 份待核对，2 份缺少 | 媒体验收不能替代知识内容核对 |
| 样片对比目录 | 15 期存在；rupt、mit-miss 缺少 comparison，但有 review-stills | 有抽帧或对比材料；目录存在不代表每一帧已经人工复核 |

本文没有重新全片解码、逐帧审看或听完所有旁白，因此不把历史验收结果改写为“本次全部验收通过”。

### 路径漂移

以下 **5 份视频报告**的 `input` 仍指向已不存在的无“发了”路径：`flect-flex`、`ject`、`rupt`、`struct`、`tract`。当前实际 MP4 存在于带“发了”的目录中。

**14 份封面报告**也存在同类失效 `input`：

- 竖封面：全部 9 个带“发了”的目录。
- 横封面：dict、flect-flex、rupt、struct、tract。

这是路径记录过时，不是媒体丢失。整理时宜补当前清单和旧路径映射，保留原始报告的历史性；未来迁移目录应同步入口，避免把未经重跑的历史报告伪装成新验收。

盘点开始时根 README 只列出 8 期、`outputs/README.md` 只列出 5 期，并包含失效的无后缀路径。这与磁盘上的 17 期现状不一致；应以本次目录清单为准。根 README 的旧生产规范也不能用来反推每期实际上已完成的检查。

## 4. 已有的竖屏单词实验：interrupt

位置为单数 `output/interrupt/`，与旧横屏系列 `outputs/` 并行。这不是另外一条已经完成的正式交付。

| 产物 | 实际状态 |
|---|---|
| `final.mp4` | 22.000 秒、660 帧、540×960、30fps；早期草稿 |
| `final-with-tts.mp4` | 18.067 秒、542 帧、540×960、30fps；当前真实配音时间线草稿 |
| `audio/` | 存在 5 段 WAV 与合成 narration.wav |
| `audio-timing.json` | provider 为 dashscope，status 为 resolved；记录各段实测时长及台词压缩过程 |
| `video-config.json` | 使用 cosyvoice-v3-flash / longanhuan；设计画布 1080×1920，配音后按帧确定时间线 |
| `hooks.md`、`script.md`、`storyboard.json` | 已有钩子、脚本、5 段分镜 |
| `jimeng-prompts.md` | 已有待生成图片提示词 |
| `assets-manifest.json` | 5 张图片全部是 placeholder，replacementRequired 均为 true |
| `public/assets/meme-vocab/interrupt/` | 实际只有一份 placeholder.svg；5 个场景复用此占位图 |
| `publish-copy.md` | 有标题、封面大字、正文、置顶问题及答案 |
| `qa-report.json / .md` | PASS_WITH_WARNINGS：0 errors，2 warnings；待替换图片、输出仅草稿分辨率 |
| 独立正式双封面、release.json | 未发现 |

这个实验已有“老板画饼 → 工资单打断 → interrupt 释义 → 例句 → interrupt/disrupt 问答”的情景教学结构，有后续继续试验的价值。当前不能作为已完成的视频发布。

还有两处历史信息需要在继续实验前同步：

1. `assets-manifest.json` 和配置中的图片绝对路径仍为 `G:/...`，与当前 `F:/...` 工作区不同；其中图片 `useTime` 仍沿用 22 秒旧时间线。它们不能直接作为当前 18.067 秒配音版的准确素材时段表。
2. QA 的人工清单仍写着“Generate and listen to TTS voiceover”，而 WAV 已存在、时间线也已 resolved。真实状态是“配音已生成，试听及其余人工检查尚无勾选结论”，不要将这一模板句误判为完全没有配音。

## 5. 资产与历史材料分层

以下大小使用 MiB（1,048,576 字节），为盘点时递归文件统计，不包含外部服务存储。文件数包括报告、抽帧和实验依赖库，不能直接等同于原创素材数。

| 目录 | 文件数 | 大小（MiB） | 角色及整理边界 |
|---|---:|---:|---|
| `outputs/` | 2,081 | 597.4 | 17 期交付及证据；混有 5 份 draft、部分 Wan 中间材料 |
| `output/` | 19 | 8.6 | interrupt 竖屏实验与配音；没有完成图片替换 |
| `public/assets/` | 10,157 | 3,384.5 | Remotion 运行时素材；不能按“生成文件”一概删除 |
| `assets/` | 176 | 172.3 | 可追溯的技术源图、品牌头像、Wan 输入和拒绝样本 |
| `archive/` | 1,350 | 649.1 | 已归档的旧 tract-motion 序列帧 |
| `work/` | 6,160 | 1,045.3 | 视觉实验、布局审计、旧版备份及白板试验依赖 |
| `bg/` | 3 | 24.0 | 3 份背景音乐候选；正式项目共享音乐另有固定路径 |
| `样片/` | 4 | 28.8 | press、reg、fer、Bouba/Kiki 外部参考样片；用于风格和时序对照 |

### 运行时目录为什么大

`public/assets/replica/` 占 3,299.1 MiB、9,918 个文件。主要体积来自图生视频拆出的序列帧，而非 17 期静态小黑插图：

| 运行时目录 | 文件数 | 大小（MiB） |
|---|---:|---:|
| `dict-motion` | 1,350 | 1,100.6 |
| `script-scrib-motion` | 1,350 | 682.7 |
| `tract-white-motion` | 1,350 | 328.3 |
| `form-white-motion` | 1,350 | 328.3 |
| `ject-motion` | 908 | 273.2 |
| `struct-white-motion` | 1,350 | 218.3 |
| `flect-flex-white-motion` | 1,350 | 166.6 |
| `script-scrib-white-motion` | 600 | 81.0 |
| `dict-white-motion` | 150 | 22.4 |

`src/replica/continuousStageData.ts` 中直接存在 dict-motion、script-scrib-motion、tract-white-motion、form-white-motion 等引用。是否仍被某条当前 Composition 消费，应结合注册表、分支选择和动态帧路径做引用审计；**目录大或修改时间旧，都不是可删除证据**。尤其不能只查完整帧文件名，代码会动态拼帧号。

其他运行时素材：`audio/` 216 文件、68.7 MiB；`music/` 2 文件、16.6 MiB（含 README）；`sfx/` 6 文件；`icons/` 14 文件；`meme-vocab/` 1 个占位 SVG。

`src/replica/seriesAudio.ts` 指向 `assets/music/root-word-series-bgm.mp3`，实际文件位于 `public/assets/music/`，配置包含旁白期间压低音量和首尾淡入淡出。`bg/` 中的三份候选音乐不是这个固定运行时入口，暂不把它们认定为可删重复文件。

### 技术源图与归档不能混为一谈

- `assets/green-screen/`：164 文件、168.8 MiB，保存即梦/Seedream 绿底技术源；重新抠图时要用。
- `assets/wan-input/ject/`：7 文件、1.9 MiB，保存 Wan 输入源。
- `assets/archive/`：2 文件、0.9 MiB，拒绝样本/门禁回归证据；与根 `archive/` 不同。
- `assets/branding/`：头像与账号简介，2 文件、0.8 MiB。账号名“小黑拆词根”，包含现有定位文案。
- 根 `archive/generated-assets/public-assets/replica/tract-motion/`：1,350 文件、649.1 MiB。`docs/production-log.md` 的 2026-07-26 记录称它被 tract-white-motion 替代后移入归档。这是历史替换证据；本次保留，不再次推断删除授权。

### work 中已经尝试过什么

| 目录 | 大小（MiB） | 已有内容及用途 |
|---|---:|---|
| `wan-white/` | 494.8 | 多主题白底动态视频尝试、重试和报告 |
| `output-experiments/` | 395.2 | 旧实验集中区：Ject 动态抠图、Dict Wan、旧预览、按项目备份、弃用 GPT-SoVITS 试验等 |
| `whiteboard-pilot/` | 90.6 | mit-miss 的逐笔/手握笔试片、联系表与本地 Python 依赖；3,710 文件中多数是依赖库，不是 3,710 张设计稿 |
| `pre-wan-finals/` | 35.6 | dict-partial-wan.mp4、script-scrib-partial-wan.mp4 两份旧版备份 |
| `flect-flex-semantic-v2/` | 19.2 | 语义动作重做、抽帧与对照材料 |
| `layout-audit/` | 4.8 | 15 期画面密度、留白调整前后联系表和报告 |
| `flect-flex-motion-trial/` | 3.8 | flect-flex 动作试验 |
| `flect-flex-redo/` | 0.6 | 重做抽帧；根 work 还保留相关日志与 pid 文本 |
| `static-card-review/` | 0.5 | struct 与 flect-flex 静态卡片布局复核 |

`work/whiteboard-pilot/README.md` 明确说明：手绘完整试片沿用 mit-miss 的 122.1 秒时间线、配音和 BGM，未接入正式配置。它还记录了线稿密度、白底 MP4 可能遮住文本、最终需切回透明 PNG 等问题。后续可以从这份试验继续，而不必把“手绘动画”当作尚未试过的全新方向。

布局报告也表明项目已经进行过一次主体放大和阅读顺序优化。它衡量的是九个抽样画面的非白像素占比，不是完播率或观众满意度，不能用该统计证明模板更适合自媒体。

## 6. 后续整理建议

| 优先级 | 建议 | 为什么 |
|---|---|---|
| 先做 | 以一份主题清单连接实际路径、当前版本、交付完整度和本地发布状态 | 避免“发了”目录与 JSON 各说一套 |
| 先做 | 为 17 期补充内容 QA 结论、来源和核对日期 | 现有媒体 QA 已较多，内容证据仍空缺 |
| 先做 | 保留历史报告，新增当前路径映射；以后报告附成片哈希 | 解决 19 份报告 input 失效及版本对应问题 |
| 再做 | 将 release 字段统一，补已发布链接、平台和时间 | 为真实的发布台账和表现复盘打基础 |
| 再做 | 给实验注明状态、最佳预览、已知问题和是否进入生产 | interrupt、白板、Wan、语义动作重做已有投入，可以直接复用经验 |
| 再做 | 为 draft、WAN 中间材料、重复抽帧做分层清单 | 缩短找成片的时间；迁移需先确认依赖和历史证据 |
| 之后 | 基于运行时引用清单处理大体积资产和实验依赖 | 先证明无引用、可重建且有备份，再决定归档或清理 |

本次仅盘点与建立文档，没有移动、删除或改写任何原有产物。

## 7. 推荐视觉抽样入口

| 要比较的方向 | 已存在的材料 |
|---|---|
| 旧系列布局 | `work/layout-audit/after-all/press-layout.jpg`、`ject-layout.jpg`、`dict-layout.jpg` |
| 连续舞台与静态卡片 | `work/static-card-review/final/flect-flex-layout.jpg`、`struct-layout.jpg` |
| 语义动作重做的前后差异 | `outputs/flect-flex发了/semantic-v2-before-after.png`、`semantic-v2-findings.md` |
| 白板手绘 | `work/whiteboard-pilot/whiteboard-mit-miss-preview-hand-contact.jpg`、`mit-miss-whiteboard-hand-full-contact.jpg` |
| 现有封面的一致性 | 任取 3–5 期 `cover.png` 并排查看；尺寸不是封面点击率的证明 |
| 竖屏情景版 | `output/interrupt/final-with-tts.mp4`；查看时保留“5 张占位图”的实验前提 |

以上为已有抽样证据。要判断当前成片的真实观感，宜从实际 MP4 再抽几帧核对，因为历史联系表可能属于被替换前的版本。
