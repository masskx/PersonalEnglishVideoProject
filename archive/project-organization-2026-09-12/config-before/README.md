# 英语单词视频工作室

这是用 **Remotion + 即梦/Seedream 绘图 + 百炼 CosyVoice 配音** 制作英语学习视频的本地项目。当前有一条成熟的白底小黑词根长视频路线，以及一条尚未完成的竖屏情景短视频路线。

> 2026-09-11 已完成项目梳理。本页为当前入口；历次决策见 PROJECT_MEMORY.md，旧版入口保存在 docs/history/2026-09-11/。原有成片、源素材和实验文件保留原位。

## 从这里开始

| 你要找什么 | 入口 |
| --- | --- |
| 项目现在有哪些能力、为什么看起来重复 | [现状与后续优化路线](docs/project-audit/OPTIMIZATION.md) |
| 17 个作品、时长、发布记录与缺项 | [作品清单](docs/project-audit/INVENTORY.md) |
| 封面一览、当前视频画面 | [17 张封面总览](docs/project-audit/covers-overview.jpg) · [视频抽帧对照](docs/project-audit/template-samples.jpg) |
| Skill 与参考资料分别负责什么 | [技能索引](docs/project-audit/SKILLS.md) |
| 代码入口、制作流程和扩展限制 | [技术结构说明](docs/project-audit/ARCHITECTURE.md) |
| 产物、素材、试验与磁盘占用 | [产物审计](docs/project-audit/ARTIFACT_AUDIT.md) |
| 制作一条新视频怎么提需求 | [制作需求模板](docs/NEW_VIDEO_PROMPT.md) |
| 交付目录和发布记录如何维护 | [交付规则](docs/DELIVERY_WORKFLOW.md) |

## 两条制作路线

| 路线 | 当前能力 | 当前限制 |
| --- | --- | --- |
| 白底小黑词根 / 词族 / 语音象征 | 17 个项目，1920×1080、30fps，约 102–173 秒；视频、双封面、发布文案与技术报告齐全 | 大量作品共用逐词讲解结构；内容核对记录尚未闭环 |
| 单词情景短视频 meme_vocab_short | interrupt 原型，1080×1920 设计，实测时间线约 18 秒；场景、词义、例句、测验 | 5 张图仍是占位；现有视频为 540×960 草稿；文案有硬编码，不能只换词批量生产 |

17 个作品不是 17 套模板。当前 16 期使用通用连续舞台，ject 使用独立连续舞台；新短视频另有一套组件。

## 文件放在哪里

| 路径 | 用途 / 维护方式 |
| --- | --- |
| src/replica/、scripts/replica/ | 长视频分镜、配音清单、绘图提示词、配置、动画与制作命令 |
| src/meme-vocab/、scripts/meme-vocab/ | 竖屏单词短视频原型；下一轮扩展前先完成素材与内容参数化 |
| outputs/ | 长视频交付包；带“发了”的目录保留用户原命名 |
| output/interrupt/ | 竖屏原型及其配置、提示词、TTS、QA；与 outputs/ 是两个现存代码约定 |
| public/assets/ | 渲染运行时依赖：音频、透明插图、动态帧、音乐、音效 |
| assets/ | 绿底源图、品牌图、Wan 输入等；不是最终交付目录 |
| work/ | 可复查的动作、白板、静态卡片等实验和旧成片备份 |
| archive/ | 先前已归档的素材；不等于可直接删除 |
| 样片/ | 早期参考视频 |
| .agents/skills/build-root-word-video/ | 本项目词根栏目制作技能 |
| ian-xiaohei-illustrations-main/ | 随项目保存的小黑风格来源，保留目录以免断开引用 |
| references/ | 竖屏即梦关键帧规范等项目参考资料 |
| docs/project-audit/ | 本次整理的当前索引、结构说明、优化路线和扫描证据 |
| docs/production-log.md、PROJECT_MEMORY.md | 历史生产日志与决策；遇到旧记录冲突时以较新明确决策及当前文件为准 |

`config/voice/` 当前为空，实际音色参数在项目配置中。`bg/` 是音乐源文件，正式运行时音乐在 public/assets/music/。

## 当前待核对事项

- flect-flex、struct、tract 的文件夹有“发了”后缀，但 release.json 写 draft；rupt 写 approved。此次保留两种记录，未推断实际发布状态。
- 15 份 content-qa.md 仍是待人工核对表；rupt、mit-miss 缺该文件。技术验证通过不代表词义、例句、词源已人工确认。
- rupt 源分镜中有一句“interrupt me，就是别打断我”，缺少英文否定。应连同旁白、字幕、音频和成片一起修正，已列入下一轮优先项。
- 已发布目录重命名后，部分制作脚本仍使用原始输出路径。重渲染已发布作品前先修复或统一输出路径解析，避免出现两份目录。

## 常用命令

从项目根目录运行。已有 node_modules；新机器才需要 npm install。

```powershell
# 刷新作品索引，不调用接口、不改变交付文件
npm run project:inventory

# 代码与现有测试
npm run typecheck
npm run lint
npm test

# 以 mit-miss 为例：校验与生成计划（不调用生成接口）
npm run replica:validate -- --project=mit-miss
npm run replica:voice -- --project=mit-miss
npm run replica:images -- --project=mit-miss

# 打开 Remotion 预览
npm run preview
```

`lint` 和 `test` 当前只覆盖短视频原型的已有检查，不是全项目通用测试。具体生成、渲染、封面和发布命令见技能及交付说明。配音/绘图命令带 `--generate` 才调用对应接口；Wan 图生视频是单独的可选分支。

代码默认绘图模型为 doubao-seedream-4-0-250828，配音为 cosyvoice-v3-flash / longanhuan。密钥使用本地 .env 的 HUOSHAN_API_KEY 与 DASHSCOPE_API_KEY，本次未读取其值。图像走火山方舟 API，不是操作即梦网页。

## 本次验证范围

TypeScript、已有短视频 lint/test、17 个项目时间线/配音素材校验通过。已核对当前 MP4 的媒体参数，并抽查四期视频的 16 帧和全部封面；语速接近上限的警告保存在 [验证记录](docs/project-audit/validation-results.json)。本轮没有重新生成媒体，也没有把旧验收报告当作新的完整视听或内容验收。
