> 历史盘点：本文件主要记录 2026-09-11 的状态。它不是当前制作规则，文中旧的生图服务和栏目边界已被 [当前视频制作基准](../当前制作基准.md) 取代。2026-09-12 已完成目录归位与路径修复；当前入口见 [项目管理页](../../PROJECTS.html) 和 [整理结果](../project-organization/RESULTS.md)。

# Skill 清单与使用边界

盘点日期：2026-09-11。入口：[项目总览](OPTIMIZATION.md) · [根目录说明](../../README.md)。

当前项目有一套本地视频制作 skill，以及一份内嵌的 Ian Xiaohei Illustrations 原始风格资料。它们积累了制作横屏小黑视频的经验，可以继续复用；当前画幅、封面、配色、图像生成和整片验收标准以项目根目录的制作基准为准。本轮内容属于历史盘点，不触发新栏目制作。

## 1. 本地视频 skill：现有系列的制作入口

位置：[.agents/skills/build-root-word-video/SKILL.md](../../.agents/skills/build-root-word-video/SKILL.md)。

| 项目 | 实际内容 |
| --- | --- |
| 适用内容 | 英语词根、词族、声音象征等现有小黑讲解系列；样片复刻及该系列的局部维护 |
| 主视频 | 1920×1080、16:9、30 fps，白底，微软雅黑，深蓝 `#041FA0` 与教学橙 `#E85810` |
| 视觉主体 | 小黑承担词义对应动作；静态透明插画加 Remotion 代码动画是默认方案 |
| 图像生成 | 项目自身脚本接入已配置的即梦/Seedream 服务；生成绿幕原图后处理为透明 PNG |
| 配音 | 项目自身脚本接入阿里百炼 CosyVoice；模板预设 `cosyvoice-v3-flash`、`longanhuan`，各项目配置才是实际取值依据 |
| 交付 | MP4、1080×1440 竖封面、1200×900 横封面、`publish-copy.md`、发布状态与验收证据 |
| 可选分支 | 用户明确要求时使用 Wan 图生视频；明确要求白板手绘时使用现有图层的笔迹揭示流程 |
| 界面元数据 | [agents/openai.yaml](../../.agents/skills/build-root-word-video/agents/openai.yaml)，显示名“白底小黑词根视频”，默认提示词强调静态小黑及 Wan 的明确选择 |

该文件是制作规范与入口，不是渲染器。真正执行配音、生图、封面、文案、验收等任务的是仓库 `scripts/replica/` 下的脚本；具体内容与时间轴在 `src/replica/`。只修改 skill 不会自动改变现有视频。

### 7 份参考说明

| 文件 | 解决的问题 | 何时读取 |
| --- | --- | --- |
| [visual-style.md](../../.agents/skills/build-root-word-video/references/visual-style.md) | 字体、配色、构图、插画、动作、转场与双封面语言 | 编写本系列分镜或插画提示词时 |
| [config-schema.md](../../.agents/skills/build-root-word-video/references/config-schema.md) | 项目模块、路径、元数据、场景与渲染模式 | 新增单集或调整配置/渲染能力时 |
| [background-music.md](../../.agents/skills/build-root-word-video/references/background-music.md) | 系列 BGM、连续铺底、旁白避让和混音验收 | 选曲、换曲、混音或声音复核时 |
| [iconfont.md](../../.agents/skills/build-root-word-video/references/iconfont.md) | 语义辅助图标的搜索、来源记录和授权判定 | 本系列新创作单集的图标搜索与复用时；允许最终不采用图标 |
| [dynamic-xiaohei.md](../../.agents/skills/build-root-word-video/references/dynamic-xiaohei.md) | Wan 的明确选择、白底 RGB 首选路径、绿幕 RGBA 后备路径、帧序列与循环验收 | 用户指定图生视频，或检查已有动态素材时 |
| [whiteboard-hand-drawing.md](../../.agents/skills/build-root-word-video/references/whiteboard-hand-drawing.md) | 在现有插画区域增加笔迹/手持笔揭示，保留原有时间轴与配音 | 用户指定白板手绘处理时 |
| [quality-gates.md](../../.agents/skills/build-root-word-video/references/quality-gates.md) | 内容配置、声音、透明图、动态图、字体安全区、节奏、画面、样片比对、封面与文案验收 | 进入对应制作或检查环节时；整理文档不意味着需要生成一条视频 |

### 3 个模板和 5 个辅助脚本

| 文件 | 用途与边界 |
| --- | --- |
| [project.ts.template](../../.agents/skills/build-root-word-video/assets/project.ts.template) | 单集配置骨架，包含双封面及发布文案路径；有等价现成项目时优先沿用项目实际模式 |
| [storyboard.ts.template](../../.agents/skills/build-root-word-video/assets/storyboard.ts.template) | 时间轴和首场景骨架，内含占位符，不能直接当成可发布单集 |
| [audio-manifest.json.template](../../.agents/skills/build-root-word-video/assets/audio-manifest.json.template) | 初始空对象；实际配音生成后写入每个场景的音频信息 |
| [compare_videos.py](../../.agents/skills/build-root-word-video/scripts/compare_videos.py) | 对齐参考/候选视频时间点，生成成对帧、联系表和比较索引 |
| [wan_i2v_submit.ts](../../.agents/skills/build-root-word-video/scripts/wan_i2v_submit.ts) | Wan 提交示例；会调用外部生成服务，不是盘点命令 |
| [wan_i2v_poll.ts](../../.agents/skills/build-root-word-video/scripts/wan_i2v_poll.ts) | 查询任务并保存生成结果的示例 |
| [white_wan_video.py](../../.agents/skills/build-root-word-video/scripts/white_wan_video.py) | 白底动态视频转 RGB 帧并做中性白位归一化及 QA；不生成 Alpha |
| [key_wan_video.py](../../.agents/skills/build-root-word-video/scripts/key_wan_video.py) | 绿幕后备路径的抠像、去溢色和预乘 Alpha 放大 |

完整本地 skill 共 17 个文件：1 个入口、1 个界面配置、7 份参考、3 个模板、5 个脚本。不要把这些辅助脚本和仓库内实际生产脚本混为一份；当前单集以项目引用的实现为准。

## 2. 内嵌 Ian 风格源：插画的视觉资料

位置：[ian-xiaohei-illustrations/SKILL.md](../../references/ian-xiaohei/ian-xiaohei-illustrations/SKILL.md)。它保留在两层同名上游解压目录中。本次通过文档索引消除查找困难，保留原路径，避免破坏本地 build skill 对它的引用。

上游 skill 的原始用途是 **中文文章的 16:9 横版正文配图**。项目借用了小黑 IP、手绘线条、少量红橙蓝批注和视觉隐喻方法，并在本地制作 skill 中适配成英语教学插画：生成文字由代码承载，图像先抠为透明素材，再放入视频。上游所写的内置 `image_gen`、中文批注和文章交付目录，不等同于本项目正在使用的即梦/Seedream 生成脚本或视频交付路径。

| 参考文件 | 内容 |
| --- | --- |
| [style-dna.md](../../references/ian-xiaohei/ian-xiaohei-illustrations/references/style-dna.md) | 纯白、黑线、少量批注、留白与画风禁忌 |
| [xiaohei-ip.md](../../references/ian-xiaohei/ian-xiaohei-illustrations/references/xiaohei-ip.md) | 小黑外形、性格、动作与主体身份 |
| [composition-patterns.md](../../references/ian-xiaohei/ian-xiaohei-illustrations/references/composition-patterns.md) | 流程、前后对比、状态、隐喻、路线、小漫画等结构，以及避免反复复刻的方法 |
| [prompt-template.md](../../references/ian-xiaohei/ian-xiaohei-illustrations/references/prompt-template.md) | 单张配图提示词组织方式 |
| [qa-checklist.md](../../references/ian-xiaohei/ian-xiaohei-illustrations/references/qa-checklist.md) | 生成图的语义主体、文字密度、留白、风格等检查项 |

内层 skill 另带 1 个 `agents/openai.yaml` 和 14 张 `assets/examples/` 校准图。外层上游资料还有 README、LICENSE、NOTICE、示例提示词、8 张 `examples/images/` 示例以及作者二维码。这些是来源与风格参考，不是本项目待发布英语内容，也不应直接照搬成新单集的构图。

来源署名为 Ian Xiaohei Illustrations / Ian；上游包含 [MIT LICENSE](../../references/ian-xiaohei/LICENSE) 和 [NOTICE](../../references/ian-xiaohei/NOTICE.md)。保留这两份来源文件。本轮未修改上游风格源。

## 3. 外部技能、服务与本项目的区别

下列技能在当前机器的技能目录中可用，但不属于本仓库的完整打包内容。可用不代表本项目正在使用，也不需要为了整理项目而安装或运行它们。

| 外部能力 | 可能用途 | 与当前项目的关系 |
| --- | --- | --- |
| `remotion-best-practices` | Remotion 组件与动画实现参考 | 通用技术方法；不决定账号栏目、选题或画面必须重复哪种版式 |
| `baoyu-image-gen` / `imagegen` | 其他生图能力与入口 | 可用于未来明确要求的图像任务；现有系列首先查看项目生成脚本和配置，避免无意换服务 |
| 全局 `ian-xiaohei-illustrations` | 通用中文正文插图 | 与仓库内嵌副本分开维护；本项目现有制作入口明确引用仓库副本 |
| `douyin-remotion-video` / `douyin-remotion-sentence-video` | 黑黄风格单词或句型视频 | 属于不同模板，不宜把它们的布局指令直接混入小黑词根系列 |
| `baoyu-xhs-images`、`baoyu-comic` 等 | 未来图文、知识漫画形式 | 可作为后续探索的工具选择，不代表已经确定要转型或开始生产 |
| `skill-creator` | 小范围维护技能入口和说明 | 本轮用于收窄适用边界、修正文档冲突、运行结构校验 |
| 白板 adapter / `whiteboard-video-engine` | 手绘笔迹揭示 | 属于参考文件描述的外部可选工具；使用前须确认实际可调用，不能把一份说明当作已安装引擎 |

即梦/Seedream、百炼 CosyVoice、Wan 是服务或模型能力；skill 是工作说明，Remotion 是合成实现。这几层应分别记录。凭证不进入技能、日志和交付文档，本轮未读取 `.env` 值。

## 4. 哪些经验继续保留，哪些部分允许变化

| 层级 | 当前保留的内容 | 后续可以做的工作 |
| --- | --- | --- |
| 内容与技术质量 | 拼写/词义/词源核对、配音与字幕一致、清晰可听、文字可读、安全区、素材来源、交付状态与可追溯记录 | 不同栏目仍应满足实际适用的质量要求；像素、音频及渲染实现按选定输出方式重新定义 |
| 现有系列身份 | 小黑主体、纯白、蓝橙、微软雅黑、横屏主片、双封面与既有交付包 | 继续制作这个系列时沿用；明确改变系列设计时再更新规范和渲染实现 |
| 单集创意 | 原 skill 已要求前三秒钩子变化、动作解释词义、多个兼容构图、段落交接和语义道具变化 | 可先从开场问题、真实使用场景、叙事冲突、例句、测试题与视觉动作入手，不必每次套“一个词根带若干单词” |
| 新栏目探索 | 现有代码、插画经验、配音服务和资产可以作为基础 | 画幅、时长、叙事、角色用法、封面结构、交互方式均可重新选；无需让所有栏目继承 16:9 或旧封面固定分区 |

目前重复感的来源不只是“缺少动画”：skill 已积累不少动作和构图变化要求，但主入口同时承担样片复刻、日常单集、动态升级、封面和验收，且用大量固定系列规则描述制作。它容易让后续工作优先复用已有章法。此次明确了适用范围；具体调整内容策略、模板组件或新栏目的选择留到下一阶段，不把新建议写成另一套全局强制模板。

## 5. 本轮已修正与验证

- 缩短本地 skill 的发现描述，补充“只约束现有系列”“盘点不触发生产”及项目导航入口；保留既有自动发现方式与技术验收阈值。
- `visual-style.md` 移除“有 Wan 凭证就默认生成动态”的旧规定，统一为当前任务明确选择后启用；同步白底 RGB 优先、绿幕 RGBA 后备的规则。
- `dynamic-xiaohei.md` 明确绿幕生成/抠像章节的后备范围，最终 QA 同时识别 RGB 与 RGBA；`quality-gates.md` 中 Alpha 检查只作用于 RGBA 后备路径。
- 发布文案以 `publish-copy.md` 为正式文件，`douyin-copy.md` 是可选兼容副本；同步质量检查、配置示例与项目模板。沿用现有类型字段名 `outputDouyinCopy`，没有重命名运行时代码接口。
- 项目模板补齐 `outputLandscapeCover` 与发布文案路径。没有执行带占位符的模板，没有调用生图、配音、Wan、渲染或发布流程。

结构验证于 2026-09-11 通过，命令退出码 `0`，输出 `Skill is valid!`：

```powershell
$env:PYTHONUTF8='1'
python 'C:/Users/lenovo/.codex/skills/.system/skill-creator/scripts/quick_validate.py' '.agents/skills/build-root-word-video'
```

此校验只证明入口元数据/格式合规；本轮人工复核了上述规则的适用范围与一致性，并不等同于成片验收。
