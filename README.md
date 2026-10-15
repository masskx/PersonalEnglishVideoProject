# 小黑英语视频项目 · Xiaohei English Videos

Short Chinese-language English lessons starring the black bean character 小黑, made with Remotion.
**Content covers all of English learning:** CET-4 and CET-6 (vocabulary, writing, reading, translation,
listening), graduate-entrance-exam English (考研英语), word roots and confusable words, grammar, and everyday
usage.

**Main format (since 2026-10-14):** 20–30 s vertical videos (1080×1920). **The same video is posted on Douyin
and Xiaohongshu.** Each video gets its own folder with three covers:

| Cover | Size | Used for |
| --- | --- | --- |
| `cover-douyin-vertical.png` | 1080×1920 (9:16) | Douyin vertical cover. Content stays inside the middle 3:4, which is all the desktop upload page keeps. |
| `cover-douyin-landscape.png` | 1440×1080 (4:3) | Douyin horizontal cover |
| `cover-xiaohongshu.png` | 1080×1440 (3:4) | Xiaohongshu cover |

Xiaohongshu image cards are no longer made. Hooks rotate from video to video, with no A/B tests:
challenge question, then common mistake, then contrast, then result first, then back to the challenge question.

## Start here (English)

| You want to… | Open |
| --- | --- |
| Post a finished video | `outputs/shorts/<video>/`: the video, 3 covers, and `publish.md` (Douyin and Xiaohongshu titles, text, tags, pinned comment) |
| Send daily numbers | [docs/DOUYIN-DATA-EN.md](docs/DOUYIN-DATA-EN.md) |
| Make videos with local Codex | [docs/LOCAL-CODEX-QUICKSTART-EN.md](docs/LOCAL-CODEX-QUICKSTART-EN.md) |
| Know what to type to Codex | [docs/CODEX-PROMPT-GUIDE-EN.md](docs/CODEX-PROMPT-GUIDE-EN.md) |
| Grow views and promote products later | [docs/growth-playbook-EN.md](docs/growth-playbook-EN.md) |
| Browse older long lessons | Double-click [00-打开工作台.html](00-打开工作台.html) (the workbench) |

Codex and Claude read [AGENTS.md](AGENTS.md) automatically. That file is the single rule set for agents;
everything an agent needs (commands, folders, quality bar) is linked from it.

## 中文速览

- **主推格式：** 20–30 秒竖屏短视频，抖音和小红书发同一条；一条视频一个文件夹 `outputs/shorts/<视频ID>/`：
  成片 `<视频ID>.mp4`、抖音竖封面（9:16）、抖音横封面（4:3）、小红书封面（3:4）、`publish.md`（两个平台的标题、
  正文、话题、置顶评论）、`release.json`、`review/`。不再做小红书图文卡。
- **内容范围：** 四六级（词汇、作文、阅读、翻译、听力）、考研英语、词根与易混词、语法、日常用法，所有英语学习内容。
- **钩子轮换：** 挑战题 → 常见错误 → 反差对比 → 结果先行，按发布顺序轮换，不再做 A/B 实验。
- **智能体规则：** [AGENTS.md](AGENTS.md) → [当前视频制作基准](docs/当前制作基准.md) →
  [新会话制作入口](docs/新会话制作入口.md)（命令顺序与目录）。
- **素材来源期：** 词根期（`src/replica/`）与四六级方法课（`src/cet-*`、`src/cet6-*`）提供小黑插图和讲解素材；
  旧的长讲解成片仍在 `outputs/<期名>/`（已发布的带“发了”后缀），工作台 [00-打开工作台.html](00-打开工作台.html)。

## 下制作指令的方式

- 只说“做视频”或指定方向：`做一条考研词汇短视频。`、`做一条六级作文短视频。`、`做一条词根短视频。`
  → 智能体自主查重选题，按轮到的钩子类型直接做完。
- 指定题目：`做一条 affect / effect 的短视频。`
- 指定材料：`用这道四级阅读题做一条短视频。`

“做完”包含查重、讲稿、配音（需要时生图）、竖屏成片、三张封面、两个平台的发布文案和检查；不会自动发布到平台。

## 目录

```text
outputs/shorts/<视频ID>/       交付（主推）：一条视频 + 三张封面 + publish.md + release.json + review/
outputs/<期名>/                旧的长讲解交付与素材来源期
src/shorts/                   短视频脚本库 library.ts、竖屏组件 DouyinShort.tsx、封面 ShortCover.tsx、时间轴
src/replica/                  词根期：注册表、各期分镜与配音清单、竖屏重排
src/cet-writing/ src/cet-translation/ src/cet6-reading/ src/cet6-writing/   四六级方法课
scripts/shorts/               短视频配音、渲染、数据报告、回归测试
scripts/                      其余配音、生图、渲染、封面、文案、检查命令
public/assets/                渲染运行时素材（每期独立目录；短视频配音在 audio/shorts/）
assets/                       生图源图、视觉基线源图、音乐源、品牌
references/                   小黑风格来源与已验收视觉锚点
planning/                     默认配置、选题台账、增长配置、数据台账 douyin-metrics.json
docs/                         规则与说明；*-EN.md 为英文指南
.agents/skills/               制作 Skill
work/                         本机临时目录（不进 git，可清空）
```

## 常用命令

```bash
npm run keys:check                                   # 密钥是否设置（只显示长度）
npm run shorts:voice -- --short=<视频ID>              # 短视频配音计划；加 --generate 生成，加 --prune 清旧音频
npm run shorts:render -- --short=<视频ID>             # 竖屏成片 + 三张封面 + 发布文案（--covers-only 只出封面）
npm run metrics:report                               # 数据报告（按钩子类型、平台汇总）
npm run replica:keyposes:edit -- --plan=<计划>        # 新素材：从已验收小黑锚点编辑生图（加 --generate）
npm run project:test                                 # 回归测试 + 密钥扫描
npm run project:check                                # 交付文件与运行时素材完整性
npm run typecheck                                    # TypeScript 检查
```

更多：[项目管理流程](docs/项目管理流程.md) · [配音与绘图说明](docs/制作说明-配音与绘图.md) ·
[选题规则](docs/选题与自动制作规则.md) · [选题台账](planning/topic-history.json)。

## API keys: rules for Claude / 密钥使用规则

The owner may give Claude API keys (DashScope voice, the OpenAI-compatible image relay; the Seedream key is optional and its route is retired).
Claude follows these rules in every session. 用户可能会把 API 密钥交给 Claude 使用，每次会话都必须遵守：

1. **Keys stay out of git, always. 密钥永远不进 git。** Never write a key into any tracked file, commit,
   PR, issue, comment, log, report, script output or generated artifact. 不得写入任何被跟踪的文件、提交、PR、
   评论、日志、报告、脚本输出或产物。
2. **Where keys live. 密钥放哪里。** In Claude cloud sessions: the environment's **Network secrets** (one per
   service: DashScope → `dashscope.aliyuncs.com`, image relay → the host of `OPENAI_BASE_URL`; header
   `Authorization`, prefix `Bearer`). The agent proxy adds the key to those requests, so sessions never see it.
   The environment variables then hold only the placeholder `DASHSCOPE_API_KEY=proxy-injected` /
   `OPENAI_API_KEY=proxy-injected` plus non-secret settings; the scripts omit their own Authorization header
   for the placeholder (`src/proxyCredentials.ts`). Do not paste keys into chat. On your own PC: the gitignored
   `.env` (template: `.env.example`). 云端会话把密钥存成 Network secret，环境变量里只写占位值 `proxy-injected`；
   不在对话里粘贴密钥；本机放被忽略的 `.env`。
3. **Temporary use only. 只临时使用。** Keys are read from the environment at run time and are not copied
   into other files, caches or memory. When a session ends, nothing keeps the key except your own settings.
   只在运行时从环境读取，不复制到其他文件、缓存或记忆；会话结束后，除你自己的设置外不留副本。
4. **Check before use. 用前检查。** Start with `npm run keys:check`: it shows which keys are set (length only,
   never any characters) and whether each service is reachable. 先运行 `npm run keys:check`。
5. **Scan before every commit. 每次提交前扫描。** `npm run hooks:install` once per clone points git at `.githooks/` (which also carries the Git LFS hooks, so video uploads keep working) and enables a pre-commit
   hook that runs `npm run secrets:scan --staged`. It blocks any commit containing a key pattern or the
   exact value of a configured key. `npm run project:test` runs the same scan. 每个克隆执行一次
   `npm run hooks:install`，提交时自动扫描暂存区；`project:test` 也包含此扫描。
6. **If a key leaks. 万一泄漏。** Stop, remove it, and tell the owner immediately so they can revoke and
   replace it at the provider. History rewriting alone is not enough once something is pushed.
   立即停止并删除，马上告知用户到服务商后台作废并更换；已推送的内容仅改历史不够。
7. **Spend carefully. 节约额度。** Paid generation (voice, images, video) only for the episode being produced.
   Retry failed items a limited number of times; never loop on the whole batch. 只为当前制作的期数调用付费生成，
   失败项有限重试，不整批循环重跑。

## 待办

部分“发了”目录与 release.json 不一致，已在工作台标记，未猜测实际发布状态。各期 `content-qa.md` 需填写真实人工核对结论；
rupt 源稿有一处英文否定缺失，已列入内容待办。
