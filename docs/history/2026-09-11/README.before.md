# 白底小黑词根视频项目

这是一个用 Remotion 批量制作中文词根、词族和语音象征讲解视频的项目。当前成片均为
`1920×1080 / 30fps / #FFFFFF`，字体使用系统微软雅黑，主色为深蓝 `#041FA0`，强调色为
橙色 `#E85810`。插图统一采用本地小黑黑线风格，箭头、图标、表格和装饰线由代码绘制。

## 最终成片

所有成片与验收产物统一放在 [`outputs/`](outputs/)：

| 项目 | 成片 | 内容 |
| --- | --- | --- |
| flect-flex | `outputs/flect-flex/flect-flex.mp4` | flect / flex = bend / 弯曲；八词连续语义舞台 |
| struct | `outputs/struct/struct.mp4` | struct = build / 建造、搭建；八词连续语义舞台 |
| form | `outputs/form/form.mp4` | form = shape / 形状、形成；八词连续语义舞台 |
| press | `outputs/press/press.mp4` | press 词根与派生词 |
| reg | `outputs/reg/reg.mp4` | reg 词根与规则、管理、统治 |
| fer | `outputs/fer/fer.mp4` | fer 词根与方向前缀 |
| bouba-kiki | `outputs/bouba-kiki/bouba-kiki.mp4` | 语音象征与五组发音家族 |
| ject | `outputs/ject/ject.mp4` | ject = throw 与五个方向前缀 |

每个子目录都包含：

- 最终 MP4；
- `cover.png` 统一风格的 1080×1440 抖音封面；
- `cover-report.json` 封面尺寸、格式、白角和配置验收报告（新视频）；
- `render-report.json` 媒体验收报告；
- `comparison/` 样片与成片对比联系表；
- `spot-checks/` 最终字幕或构图抽查帧（若该项目有专项抽查）；
- `reference-analysis.md` 样片拆解（若有）；
- 该视频自己的 `README.md`。

## 项目结构

```text
.
├─ outputs/                         # 唯一交付目录：每个子目录对应一条视频
│  ├─ press/
│  ├─ reg/
│  ├─ fer/
│  ├─ bouba-kiki/
│  └─ ject/
├─ src/replica/                     # Storyboard、项目配置、通用渲染器
│  └─ projects/                     # 项目注册表和每条视频的配置
├─ scripts/replica/                 # 配音、插图、渲染、验证工具
├─ public/assets/
│  ├─ audio/replica/                # Remotion 运行时配音
│  ├─ music/                        # 全系列共用 AI 背景音乐
│  ├─ replica/                      # 透明 PNG 插图
│  └─ sfx/                          # 通用音效
├─ assets/green-screen/             # 即梦/Seedream 绿色底技术源
├─ docs/                             # 生产日志与新视频提示词
├─ 样片/                             # 复刻目标样片
├─ ian-xiaohei-illustrations-main/  # 小黑风格源与规范
├─ PROJECT_MEMORY.md                # 关键活动记忆
└─ .env                             # 本机接口密钥，不应分享或提交
```

## 环境

```powershell
npm install
```

成片验收默认使用 Remotion 随项目安装的 `ffmpeg`/`ffprobe`，无需另行配置系统 PATH。

根目录 `.env` 需要配置：

```env
DASHSCOPE_API_KEY=你的百炼语音接口密钥
HUOSHAN_API_KEY=你的火山/即梦图片接口密钥
```

## 常用命令

将 `<slug>` 替换为 `press`、`reg`、`fer`、`bouba-kiki` 或 `ject`：

```powershell
# 打开 Remotion 预览
npm run preview

# 查看已注册的 Composition
npm run compositions

# 检查代码、时间线和透明素材
npm run typecheck
npm run replica:validate -- --project=<slug>
npm run replica:assets:verify -- --project=<slug>

# 查看配音/插图生成计划，不调用接口
npm run replica:voice -- --project=<slug>
npm run replica:images -- --project=<slug>

# 调用接口生成资源
npm run replica:voice -- --project=<slug> --generate
npm run replica:images -- --project=<slug> --generate

# 渲染草片、正式片和验收报告
npm run replica:render -- --project=<slug> --draft
npm run replica:render -- --project=<slug>
npm run replica:render:verify -- --project=<slug>

# 导出统一抖音封面
npm run replica:cover -- --project=<slug>
npm run replica:cover:verify -- --project=<slug>

# 生成中点、边界或指定时间抽帧
npm run replica:stills -- --project=<slug> --mode=midpoints
npm run replica:stills -- --project=<slug> --mode=boundaries
npm run replica:stills -- --project=<slug> --timestamps=5,18.5,42
```

正式渲染会直接写入 `outputs/<slug>/<slug>.mp4`；验收报告写入同一目录。
封面由共享 React/Remotion 前端组件导出到 `outputs/<slug>/cover.png`。

## AI 背景音乐

适配本项目的英文生成提示词、负面提示词和导出参数见
[`docs/BACKGROUND_MUSIC_PROMPTS.md`](docs/BACKGROUND_MUSIC_PROMPTS.md)。把最终音乐保存为
`public/assets/music/root-word-series-bgm.mp3` 后，所有草稿和正式渲染都会自动循环使用，
并在旁白出现时降低音量、在全片首尾淡入淡出。缺少该文件时，渲染命令会明确停止，避免
误交付无背景音乐版本。

## 统一封面系统

每条新视频在生成成片的同时必须生成一张 1080×1440 PNG 封面。封面保持固定版式：

- 纯白背景、深蓝圆角描边；
- 左上角“小黑拆词根”品牌标，右上角橙色“词根动画记忆卡”；
- 上半区使用超大词根、英文核心动作和中文含义；
- 中右区固定放置小黑执行核心动作的透明插图；
- 下方列出词族，并用橙色突出共同词根；
- 所有文字使用系统微软雅黑，由前端代码绘制，不烘焙进即梦插图。

优先复用该视频已经验收的主题插图；只有现有插图无法表达核心动作时，才通过即梦
生成新的绿色底小黑插图并代码抠图。封面内容通过项目模块的 `cover` 字段配置，禁止
为单条视频另建一套版式。`press / reg / fer / bouba-kiki / ject` 已全部使用这套封面，
以后新增视频也必须在同一次生产中导出并验收 `cover.png`。

## 新视频怎么提需求

以后不需要描述技术实现，只要提供词根资料并引用下面的标准提示词即可。完整版也保存在
[`docs/NEW_VIDEO_PROMPT.md`](docs/NEW_VIDEO_PROMPT.md)。

```text
请使用 build-root-word-video Skill，在当前项目中制作一条新的白底小黑词根讲解视频。

词根/主题：<例如 spect>
核心含义：<例如 看>
必须讲解的单词：<例如 inspect, respect, suspect, prospect, spectator>
可选记忆钩子：<没有就由你设计>
目标时长：<例如 90-120 秒；没有则由你按内容决定>
结尾压暗：<全黑 / 部分压暗 / 不压暗；没有则由你决定>
参考样片：<有就写路径，没有就沿用当前系列风格>

要求：使用系统微软雅黑、纯白 #FFFFFF 背景、深蓝 #041FA0 与橙色 #E85810；
所有插图遵循项目里的小黑黑线风格，小黑必须执行核心动作；箭头、图标、表格和文字
用代码绘制。请自行完成文案、Storyboard、配音、插图、动画、转场、渲染、全片检查、
样片对比和媒体门禁。同时用共享前端组件导出 1080×1440 的统一封面 `cover.png`。
最终成片及相关产物统一放到 outputs/<slug>/，并更新 README、生产日志和
PROJECT_MEMORY.md。除非缺少身份关键或授权素材，否则不要中途询问。
```

## 新增项目时的代码位置

新视频至少需要：

1. `src/replica/<slug>Storyboard.ts`；
2. `src/replica/<slug>IllustrationPrompts.ts`；
3. `src/replica/<slug>AudioManifest.json`；
4. `src/replica/projects/<slug>.ts`；
5. 在 `src/replica/projects/registry.ts` 注册项目。

运行时素材必须在 `public/assets/`；绿色技术源必须在 `assets/green-screen/<slug>/`；最终
交付必须在 `outputs/<slug>/`。不要重新创建 `edit/`、`out/` 或其他临时交付目录。

## 完成标准

- TypeScript、时间线、素材 QA 全部通过；
- H.264/AAC、1920×1080、30fps、精确帧数通过；
- 视频与音频完整解码通过；
- 白底与结尾压暗像素通过；
- 音频峰值与长静音检查通过；
- 样片/成片联系表经过人工复核；
- 无缺失或未引用运行时资源；
- 新视频的 1080×1440 `cover.png` 已通过全尺寸与缩略图检查；
- 最终视频和产物已归档到对应 `outputs/<slug>/`。
