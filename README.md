# 小黑英语视频项目

**第一次使用：双击 [00-打开工作台.html](00-打开工作台.html)。** 首页直接找视频、双封面、文案和投稿入口。无需浏览程序文件夹。

当前四级作文完整交付：[第二版](outputs/cet4-writing-paragraph-v2/index.html)；[原试片](work/experiments/cet4-writing-paragraph/index.html)保留。

**抖音竖屏（2026-10-12 起默认）：** 每期在 `vertical/` 另有竖屏完整版、约 40 秒预告和复习卡，用 `npm run vertical:render -- --project=<slug>` 生成；推广与行动号召配置在 [growth-promotion.json](planning/growth-promotion.json)，英文增长说明见 [growth-playbook-EN.md](docs/growth-playbook-EN.md)。

**新会话或更换智能体：先读 [当前视频制作基准](docs/当前制作基准.md) 和 [AGENTS.md](AGENTS.md)。**
用户未指定题目时，自主选题、
查重后直接制作；指定题目时按指定内容执行。详见 [长期选题规则](docs/选题与自动制作规则.md)
和 [主题台账](planning/topic-history.json)。

跨会话恢复入口：[新会话制作入口](docs/新会话制作入口.md) ·
[机器默认配置](planning/production-defaults.json) ·
[项目总制作 Skill](.agents/skills/make-xiaohei-english-video/SKILL.md)。这些文件保存在项目
磁盘中，新智能体不需要继承旧聊天记忆也能恢复制作判断和当前链路。

**日常找作品：双击 [PROJECTS.html](PROJECTS.html)。** 修改或新增项目后，双击根目录的 `刷新项目管理.cmd`，会更新清单并打开管理页。

管理页可以按词根、单词、中文含义搜索，按本地发布记录筛选，并直接播放最终视频、打开两种封面与发布文案。

新增内容工作台：新建/编辑选题、推进阶段、记录配套资料与复盘数据，支持浏览器保存和 JSON 导入导出。
当前制作基准：[ten / tain 最新验收成片](outputs/ten-tain/ten-tain.mp4)；视觉动作锚点为
[mit / miss Sunburst 完整重制版](work/experiments/mit-miss-sunburst-full/README.md)。历史正式版与旧试片继续保留，
但不再作为新视频规则。
当前视觉金样：[Sunburst 参考图编辑三姿态](work/experiments/mit-miss-images2-keyposes/README.md)。后续小黑连续动作默认采用“同一母版编辑姿态 + 局部关键帧”，不再叠加遮挡主体的全画布 SVG 机械层。
新增栏目试片：[四级作文：把观点展开](work/experiments/cet4-writing-paragraph/index.html)，包含完整视频、双封面与可打印练习单。
后续安排：[四六级内容与资料产品规划](docs/账号内容与资料产品规划.md)；新栏目直接继承当前视频制作基准，
只按教学目标调整内容结构。

**Working locally with Codex (English):** [docs/LOCAL-CODEX-QUICKSTART-EN.md](docs/LOCAL-CODEX-QUICKSTART-EN.md) ·
小红书图文卡：`npm run xhs:cards -- --project=<slug>`，输出到交付目录 `xiaohongshu/`。

## API keys: rules for Claude / 密钥使用规则

The owner may give Claude API keys (DashScope voice, the OpenAI-compatible image relay, Seedream).
Claude follows these rules in every session. 用户可能会把 API 密钥交给 Claude 使用，每次会话都必须遵守：

1. **Keys stay out of git, always. 密钥永远不进 git。** Never write a key into any tracked file, commit,
   PR, issue, comment, log, report, script output or generated artifact. 不得写入任何被跟踪的文件、提交、PR、
   评论、日志、报告、脚本输出或产物。
2. **Where keys live. 密钥放哪里。** In Claude cloud sessions: the environment's settings, as environment
   variables (`DASHSCOPE_API_KEY`, `OPENAI_API_KEY`, `OPENAI_BASE_URL`, `HUOSHAN_API_KEY`). The matching
   domain must be allowed under Network access. Do not paste keys into chat. On your own PC: the
   gitignored `.env` (template: `.env.example`). 云端会话放环境设置里的环境变量，并在 Network access 允许对应域名，
   不在对话里粘贴密钥；本机放被忽略的 `.env`。
3. **Temporary use only. 只临时使用。** Keys are read from the environment at run time and are not copied
   into other files, caches or memory. When a session ends, nothing keeps the key except your own settings.
   只在运行时从环境读取，不复制到其他文件、缓存或记忆；会话结束后，除你自己的设置外不留副本。
4. **Check before use. 用前检查。** Start with `npm run keys:check`: it shows which keys are set (length only,
   never any characters) and whether each service is reachable. 先运行 `npm run keys:check`。
5. **Scan before every commit. 每次提交前扫描。** `npm run hooks:install` once per clone enables a pre-commit
   hook that runs `npm run secrets:scan --staged`. It blocks any commit containing a key pattern or the
   exact value of a configured key. `npm run project:test` runs the same scan. 每个克隆执行一次
   `npm run hooks:install`，提交时自动扫描暂存区；`project:test` 也包含此扫描。
6. **If a key leaks. 万一泄漏。** Stop, remove it, and tell the owner immediately so they can revoke and
   replace it at the provider. History rewriting alone is not enough once something is pushed.
   立即停止并删除，马上告知用户到服务商后台作废并更换；已推送的内容仅改历史不够。
7. **Spend carefully. 节约额度。** Paid generation (voice, images, video) only for the episode being produced.
   Retry failed items a limited number of times; never loop on the whole batch. 只为当前制作的期数调用付费生成，
   失败项有限重试，不整批循环重跑。

## 当前内容

- 保留 17 期横屏视频、34 张封面、配音、绘图素材和发布文案。
- `interrupt` 竖屏原型归入试验区，现有视频与配音保留，5 张图仍是占位。
- 原成片保持不变；关键姿态、流畅文字与首条四级作文试片另存 work/experiments。

## 三个常用入口

| 要做什么 | 入口 |
| --- | --- |
| 找视频、封面、文案和每期资料 | [项目管理页](PROJECTS.html) |
| 知道从制作到发布怎么管理 | [项目管理流程](docs/项目管理流程.md) |
| 了解配音、绘图、素材位置和参数 | [配音与绘图说明](docs/制作说明-配音与绘图.md) |

## 以后怎么下制作指令

- 指定题目：`按当前小黑 Sunburst 链路，做一期易混词 affect / effect，完整制作并放工作台。`
- 只指定栏目：`做一个四级写作视频。`、`做一个阅读定位视频。`、`做一个翻译拆解视频。`
- 指定材料：`用这道题做一期四级阅读定位，保留题目来源，完整制作。`

“完整制作”默认包含查重、脚本、配音、小黑画面、关键姿态、文字动效、完整视频、双封面、发布文案、检查记录和工作台刷新；不会自动发布到平台。

工作台首屏只展示当前交付。旧试片、绘图证据和接口测试在页面底部默认收起的“历史版本与技术档案”中；纯中间装配目录不会显示。当前目录盘点见 [工作目录与工作台盘点](docs/project-audit/CURRENT-WORKSPACE-2026-09-19.md)。

## 文件现在放在哪里

```text
PROJECTS.html                 日常管理页，可直接双击
outputs/<期名或期名发了>/       最终视频、双封面、文案、发布记录
  review/                     该期分镜、截图、对比与历史验收资料
work/drafts/<期名>/             草稿
work/experiments/              竖屏原型、Wan 历史试验
work/                         其他既有试验与旧版本（见其 README）
public/assets/                渲染用音频、透明插图、动态序列、音乐、音效
assets/                       生图原图、品牌资料、音乐候选等来源素材
references/                   小黑风格来源、绘图规范等参考资料
src/                          每期内容、配置与渲染器
scripts/                      配音、绘图、渲染、整理与检查命令
.agents/skills/               本项目制作 Skill
archive/                      可恢复归档、整理前配置与旧文档
样片/                         原有参考视频
```

`public/assets/` 保持现有运行时路径，序列帧即使体积较大也保留。原根目录 `bg`、`output`、双层小黑来源文件夹已归位；空的 `config` 已移除。

## 常用管理命令

```powershell
# 更新管理页、每期导航和作品清单，不生成媒体
npm run project:inventory

# 检查目录、交付文件和运行时素材
npm run project:check

# 管理路径和发布记录的回归测试
npm run project:test

# 检查全部 TypeScript
npm run typecheck
```

记录某期状态的命令见 [管理流程](docs/项目管理流程.md)。`published` 只是本地记录，命令不会向抖音或小红书发布。

## 整理中保留的待办

4 期文件夹的“发了”后缀与 release.json 不一致，已在管理页明确标记，未猜测实际发布状态。17 期都已有内容检查单，但需填写真实核对结论；rupt 源稿有一处英文否定缺失，已列入内容待办，本轮保留原内容。

[本次整理与保全结果](docs/project-organization/RESULTS.md) · [当前作品清单](docs/project-audit/INVENTORY.md) · [历史结构审计](docs/project-audit/ARCHITECTURE.md) · [技能资料索引](docs/project-audit/SKILLS.md)

## 当前形式试验

[MIT / MISS 关键姿态测试](work/experiments/mit-miss-keyposes/README.md)：用动作前、关键变化、结果的静态画面替代强行叠加的动效。试验与原版分开，包含完整视频、原版切换播放器、两种封面和检查证据。
