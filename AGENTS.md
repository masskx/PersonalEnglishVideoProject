# 小黑英语视频项目 · 智能体工作规则

本文件是 Codex / Claude 等智能体进入仓库后的**唯一入口**，每次会话自动读取。这里只写当前有效的规则；
历史记录（`docs/production-log.md`、台账里的旧路径、git 历史）只用于追溯，不是规则。

**沟通语言：** 用户读英文、不读中文。和用户对话一律用英文；仓库文档、讲稿、字幕和画面文字保持中文。

## 0. 开始任何任务前

1. 读本文件，再读 [当前视频制作基准](docs/当前制作基准.md)（视觉、声音与验收的唯一基准）和
   [新会话制作入口](docs/新会话制作入口.md)（流程、命令与目录）。
2. 运行 `npm run keys:check`（只显示密钥是否设置与长度）。新克隆先 `npm run hooks:install`。
3. 制作请求先加载 [总制作 Skill](.agents/skills/make-xiaohei-english-video/SKILL.md)；词根、词汇辨析、
   易混词再加载 [词根 Skill](.agents/skills/build-root-word-video/SKILL.md)。
4. 机器默认值在 `planning/production-defaults.json`；平台文案、行动号召、话题在
   `planning/growth-promotion.json`；做过的题目在 `planning/topic-history.json`。

## 1. 判断用户要什么

| 用户说法 | 做法 |
| --- | --- |
| 只给栏目：“做一个词根视频 / 易混词视频 / 四级作文、阅读、翻译视频” | 自主选一个没做过的题目，查重后在台账登记 `in_progress`，直接完整制作。不要让用户挑题或确认普通选题，不要停在计划阶段 |
| 给了具体题目、词根、试题或材料 | 严格按指定内容制作；做过也做新版本并保留旧版，不换题 |
| 讨论、检查、整理、记录规则 | 只做这件事，不开始制作新视频 |
| 修改某一期 | 只改那一期；已通过检查的配音和图片不重做 |
| 新偏好要长期生效 | 写进本文件（和相关配置），只写在聊天里下次会忘 |

查重范围：`planning/topic-history.json`、`src/replica/projects/registry.ts`、`src/cet-*` 各栏目、
`outputs/`、本机 `work/` 里的进行中草稿。同一词根家族（mit/miss、vis/vid 等）算同题；换标题、封面、
动效或例句不算新题。有实质歧义、无法合理决策时，用一个具体问题问用户；普通实现选择直接做。

## 2. 仓库地图

| 路径 | 内容 |
| --- | --- |
| `outputs/<期名>/`（已发布为 `<期名>发了/`） | 每期交付：成片、双封面、文案、`release.json`、`content-qa.md`、`review/`、`vertical/`、`xiaohongshu/` |
| `src/replica/` | 词根期：`projects/registry.ts` 注册表、各期 storyboard 与配音清单、`vertical/` 竖屏重排、`xhs/` 小红书卡片 |
| `src/cet-writing/`、`src/cet-translation/`、`src/cet6-reading/` | 四六级方法课：`lesson.ts` 讲稿数据、视频组件、`xhs.ts` 小红书 deck |
| `scripts/replica/` | 配音、生图、渲染、封面、文案、检查命令；`renderEnv.ts` 统一浏览器与 ffmpeg 路径 |
| `public/assets/` | 渲染运行时素材，每期一个独立目录 |
| `assets/` | 生图源文件（绿底源、视觉基线）、背景音乐源、品牌 |
| `references/` | 小黑风格来源（`ian-xiaohei/`）和已验收视觉锚点样片（`visual-baseline/`） |
| `planning/` | 默认配置、台账、各期关键姿态计划、增长配置 |
| `docs/` | 规则与说明；`*-EN.md` 是给用户的英文指南 |
| `work/` | 本机临时目录（草稿、渲染暂存、试验、淘汰图），**整个目录不进 git** |
| `样片/` | 早期四期的参照样片 |

## 3. 制作链路与命令

词根 / 词汇 / 易混词（注册在 `src/replica/projects/registry.ts`）：

1. 查重选题 → 台账登记 `in_progress`。
2. 资料核对（可靠词典、词源；区分真实构词与记忆联想）→ 自然口语讲稿。
3. 建期：**复制 `src/replica/projects/cludClus.ts`**（唯一模板，ten-tain 同款连续舞台：
   `visualRenderer: 'continuous'` + `buildContinuousStage(storyboard, cover)`），分镜用同名 JSON；
   不要复制老期数（pon-pos、cred、duc-duct 等用的是已淘汰的 `'default'` 渲染）。
   写词图映射（每个词：释义、动作因果、场景、before/change/result 路径、总结行）→
   `npm run replica:preflight -- --project=<期名> --plan-only`。
4. 生图：以已验收小黑为锚点，同一母版编辑 before / change / result（`npm run replica:keyposes:edit -- --plan=<计划> --generate`
   或 `npm run replica:images -- --project=<期名> --generate`）→ 素材白底复核（只检查插图本身）→
   `npm run replica:preflight -- --project=<期名>`。未通过不得继续。
5. 配音：`npm run replica:voice -- --project=<期名> --generate` → `npm run replica:validate -- --project=<期名>`。
   validate 含**画面节奏闸门**（字幕换句不算画面变化）：任何一段画面静止不超过 8 秒；超过 3.5 秒的静止
   合计不超过全片 20%；第一次画面变化早于 1.5 秒、第二次早于 3 秒。不通过就在那段旁白里加画面层
   （例句卡、中文释义、搭配、对比、姿态切换），或把讲稿写短重配；不要放宽阈值。
6. 交付：`npm run replica:produce -- --project=<期名> --stage=deliver`（横屏高质量成片、双封面、
   抖音竖屏完整版 + 预告 + 复习卡、小红书图文卡、发布文案、`release.json` 保持 draft、刷新工作台）。
7. 人工终审：打开 `review/full-preview/` 整片低清预览连续观看；手机外放和耳机都听一遍。
8. 收尾：填 `content-qa.md`、台账改 `produced` 并写产物路径、`docs/production-log.md` 记一条。

四六级方法课（每栏目自带脚本）：

- 四级写作：`writing:voice` → `writing:prepare` → `writing:render` → `writing:delivery`
- 四级翻译：`translation:voice` → `translation:prepare` → `translation:render` → `translation:delivery`
- 六级阅读：`cet6:voice` → `cet6:prepare` → `cet6:render` → `cet6:delivery`
- 六级写作：`cet6w:voice` → `cet6w:prepare` → `cet6w:render`（静帧 + 双封面）→ `cet6w:render -- --video` → `cet6w:delivery`
  → `replica:full-preview -- --project=<期名>` → `xhs:cards -- --project=<期名>`；插图用 `replica:keyposes:edit` 按
  `planning/<期名>-art.json` 从已验收小黑锚点参考编辑生成（云端可跑）
- 新四六级栏目：参照最接近的现有栏目新建 `src/<栏目>/`（`lesson.ts`、视频组件、`xhs.ts`），在
  `src/replica/xhs/methodDecks.ts` 登记 deck；至少 3 张不同的小黑插图；最后 `npm run xhs:cards -- --project=<期名>`。

配音、生图命令不带 `--generate` 时只显示计划，不花钱；先看计划再生成。

## 4. 每期交付清单

横屏成片（1920×1080）、竖封面 `cover.png`（1080×1440）、横封面 `cover-landscape.png`（1200×900）、
`publish-copy.md`、`content-qa.md`、`release.json`、`review/`（含整片预览）、`vertical/`（抖音竖屏完整版、
预告、复习卡）、`xiaohongshu/`（3:4 图文卡与 `xhs-note.md`）。四六级另加练习单。交付不等于发布。

## 5. 内容、画面与声音标准（细节见当前制作基准）

- 时长默认 2–3 分钟（用户要短片时按要求）。偏四六级应试但易懂有趣：一个可带走的知识点 → 演示 →
  小练习 → 讲答案与使用边界。不承诺分数，不把某个结构称作万能模板。
- **配色（2026-10-14 用户确认，全部画面统一）：小红书词卡的纸面配色**——暖白点阵纸底、深蓝 + 橙、
  词根荧光黄色带、小黑放在浅蓝圆角底板上、构词式描边胶囊、例句橙色小标签、总结表浅橙交替行。
  唯一色值来源 `src/replica/theme.ts`；横屏、竖屏、封面、小红书卡、四六级课都用它，**不再用纯白画布**。
  词页样式由 `src/replica/paperStyleStoryboard.ts` 自动套用，分镜只写内容。细则见当前制作基准。
- 生图：内置 `image_gen` 栅格位图，风格锚定已验收 mit/miss：纯白背景生成后去底为透明 PNG、实心黑色小黑、
  白点眼、手绘线条、少量橙红蓝；成片里插图 100% 不透明。词根动作用同母版 before / change / result。
  每个词有自己的姿态，不同意思不复用同一组。
- 动画：Remotion 帧驱动的丝滑文字（smooth-rise / reveal / slide、词素组装、语义姿态切换、淡出到纸面），
  英文留足阅读时间。前 1.5 秒给具体钩子，3 秒内第二次画面变化；至少三种有教学意义的构图。
- 节奏：旁白里说到的例句、中文释义、搭配和对比都要在画面上出现（与旁白同时进场），不能只放在字幕里；
  一个词页约 9–12 秒，讲稿更长就加画面节拍。
- 声音：可听见的纯音乐（104–112 BPM），旁白时压低、空档轻抬；人声永远在前。
- 文风：具体场景、动作、自然短句；避免“不是……而是……”“别再……”“先别……”“抓住……立刻……”
  “一个动作串起……”等模板腔。改稿后让对应配音缓存失效重配。
- 正片只放对观众有用的标题、例句、重点和字幕；不放步骤导航、流程标签、调试小字。
- 封面统一用 `RootWordCover` / `RootWordLandscapeCover` 母版，只换内容。

## 6. 小黑角色质量门槛

- 先用项目内已接受的小黑素材和 `references/ian-xiaohei/` 作角色锚点，再生成动作变体；不能只靠
  “black bean / stick figure”提示词。
- 配音、时间轴和渲染前做素材白底复核（把插图单独放在纯白上检查角色，不是成片底色）：身体比例、实心白点眼、
  黑色手脚、冷静表情一致；细火柴人、空心眼、
  主体过小或角色漂移立即淘汰。检查顺序见 [小黑角色验收规则](docs/小黑角色验收规则.md)。
- 动作场景用局部手绘语义物；不用全画布 SVG 机械层、跨角色轨迹或遮住小黑的大型几何叠层。
- 运行时图片只能来自本期自己的 `public/assets/replica/<期名>/`；旧期图片只能当生成参考，跨期挂载会被渲染前扫描拦截。
- TTS 指令遵循所选模型与音色支持的格式；文本或音色变化就重新生成，不静默去掉 instruction 降级重试。
  网络临时失败有限重试，从失败项续跑。

## 7. 抖音与小红书

- 抖音主推竖屏：`vertical/<期名>-vertical.mp4`（同一 storyboard 重排为 1080×1920，不重新生图、不改讲稿）。
  首帧要有题目和小黑；正文和字幕在安全区内（顶部 200px、底部 440px、右侧按钮列）；英文不被切断；
  结尾停在纸面总结页便于循环。版式抽查：`npm run vertical:stills -- --project=<期名>`。
- 小红书主推图文：`npm run xhs:cards -- --project=<期名>`，词根期出词卡（封面、每词一张、总结、自测、
  关注卡），四六级出方法卡（题目、常见错误、步骤、检查清单、练习、答案、关注卡）。最多 18 张；标题 20 字内。
- 行动号召、合集名、话题、资料产品与领取开关只改 `planning/growth-promotion.json`。资料未上架、领取未开启时
  不出现购买或领取引导。任何位置都不放微信号、二维码或站外链接。

## 8. 密钥

- 密钥只在运行时从环境变量或被 gitignore 的 `.env` 读取；永远不写入被跟踪文件、提交、PR、评论、日志、
  报告或产物，也不复制到缓存或记忆。不在对话里索要密钥。完整规则见 [README 密钥规则](README.md)。
- 提交前钩子自动运行 `secrets:scan`；`npm run project:test` 也会扫描。发现泄漏立即停止并告诉用户作废更换。
- 付费生成（配音、生图）只为当前制作的期数调用，失败项有限重试。

## 9. 不要做

- 不自动发布、上架或替用户发消息；`release.json` 只在用户确认真实发布后才改 published。
- 不恢复已停用路线：即梦/Seedream 生图、Wan 图生视频、SVG 或代码绘图冒充插画、重复 PPT 卡片、
  持续漂浮/随机弹跳、只看中点抽帧不看整片、为四六级另起低规格链路。
- 不跨期挂载运行时素材；不把淘汰图或旧版素材留在本期运行时目录（放本机 `work/`）。
- 不手工搬动或删除 `public/assets/` 里仍被引用的素材；删除前先确认没有分镜或专用渲染器引用。
- 不同时保留 `outputs/<期名>/` 和 `outputs/<期名>发了/`。

## 10. 收尾检查

`npm run project:test`（管理、竖屏版式、小红书卡片、模板与节奏回归 + 密钥扫描）、`npm run project:check`
（文件与运行时路径完整性）、`npm run project:inventory`（刷新工作台 `00-打开工作台.html` 与 `PROJECTS.html`）。

给用户的英文指南：[本机 Codex 上手](docs/LOCAL-CODEX-QUICKSTART-EN.md) ·
[提示词与续做](docs/CODEX-PROMPT-GUIDE-EN.md) · [增长说明](docs/growth-playbook-EN.md)。
