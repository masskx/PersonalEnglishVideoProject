# 小黑英语视频项目 · Xiaohei English Videos

Short Chinese-language English lessons (root words, word pairs, CET-4/6 methods) starring the black bean
character 小黑, made with Remotion. Deliveries target Douyin (vertical video) and Xiaohongshu (image cards).

## Start here (English)

| You want to… | Open |
| --- | --- |
| Get a finished video, covers, publish text | Double-click [00-打开工作台.html](00-打开工作台.html) (the workbench) |
| Make videos with local Codex | [docs/LOCAL-CODEX-QUICKSTART-EN.md](docs/LOCAL-CODEX-QUICKSTART-EN.md) |
| Know what to type to Codex | [docs/CODEX-PROMPT-GUIDE-EN.md](docs/CODEX-PROMPT-GUIDE-EN.md) |
| Grow views and promote products later | [docs/growth-playbook-EN.md](docs/growth-playbook-EN.md) |

Codex reads [AGENTS.md](AGENTS.md) automatically. That file is the single rule set for agents; everything an
agent needs (commands, folders, quality bar) is linked from it. Old trials and archives were deleted on
2026-10-13; git history still has them.

## 中文速览

- **成片与发布材料：** 双击 [00-打开工作台.html](00-打开工作台.html)；完整作品表见 [PROJECTS.html](PROJECTS.html)，
  修改后双击 `刷新项目管理.cmd` 或运行 `npm run project:inventory` 刷新。
- **智能体规则：** [AGENTS.md](AGENTS.md) → [当前视频制作基准](docs/当前制作基准.md) →
  [新会话制作入口](docs/新会话制作入口.md)（命令顺序与目录）。
- **当前作品：** 21 期词根/词汇横屏成片（`outputs/<期名>/`，已发布的带“发了”后缀），3 期四六级方法课
  （四级写作 `cet4-writing-paragraph-v2`、四级翻译 `cet4-translation-main-clause`、六级阅读
  `cet6-reading-location-paraphrase`）。每期另可生成 `vertical/`（抖音竖屏完整版、预告、复习卡）和
  `xiaohongshu/`（3:4 图文卡）。
- **当前基准成片：** [ten / tain](outputs/ten-tain/ten-tain.mp4)；视觉锚点
  [mit / miss Sunburst](references/visual-baseline/mit-miss-sunburst-full/mit-miss-sunburst-full.mp4)。

## 下制作指令的方式

- 指定题目：`做一期易混词 affect / effect，完整制作并放工作台。`
- 只指定栏目：`做一个词根视频。`、`做一个四级写作视频。`、`做一个六级阅读定位视频。`
- 指定材料：`用这道题做一期四级阅读定位，保留题目来源，完整制作。`

“完整制作”包含查重、讲稿、配音、小黑关键姿态、文字动效、横屏成片、双封面、抖音竖屏、小红书图文卡、
发布文案、检查记录和工作台刷新；不会自动发布到平台。

## 目录

```text
00-打开工作台.html             日常入口：当前成片、封面、文案、投稿入口
PROJECTS.html                 全部作品表
outputs/<期名>/                交付：成片、双封面、文案、release.json、content-qa.md、review/、vertical/、xiaohongshu/
src/replica/                  词根期：注册表、各期分镜与配音清单、vertical/ 竖屏、xhs/ 小红书
src/cet-writing/ src/cet-translation/ src/cet6-reading/   四六级方法课
scripts/                      配音、生图、渲染、封面、文案、检查命令
public/assets/                渲染运行时素材（每期独立目录）
assets/                       生图源图、视觉基线源图、音乐源、品牌
references/                   小黑风格来源与已验收视觉锚点
planning/                     默认配置、选题台账、关键姿态计划、增长配置
docs/                         规则与说明；*-EN.md 为英文指南
.agents/skills/               制作 Skill
work/                         本机临时目录（不进 git，可清空）
样片/                         早期参照样片
```

## 常用命令

```bash
npm run keys:check                                   # 密钥是否设置（只显示长度）
npm run replica:produce -- --project=<期名> --stage=deliver   # 词根期一条命令交付
npm run xhs:cards -- --project=<期名>                 # 小红书图文卡（词根期或四六级）
npm run vertical:render -- --project=<期名>           # 抖音竖屏完整版 + 预告 + 复习卡
npm run project:test                                 # 回归测试 + 密钥扫描
npm run project:check                                # 交付文件与运行时素材完整性
npm run project:inventory                            # 刷新工作台与作品表
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
