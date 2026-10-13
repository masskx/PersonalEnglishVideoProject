# 项目记忆（当前状态与教训）

本文件只记录**当前状态**和**仍然有效的教训**，给新会话、新智能体快速接手用。规则总表在 [AGENTS.md](AGENTS.md)，
标准在 [当前制作基准](docs/当前制作基准.md)，逐次制作记录在 [docs/production-log.md](docs/production-log.md)。
2026-10-13 之前的长篇历史条目已删除（其中多条描述的是已停用路线，容易误导）；需要追溯用 git 历史：
`git log -p -- PROJECT_MEMORY.md`。每次有实质变化，在文末“更新记录”追加一条短条目。

## 用户

- 用户在台湾，读英文、不读中文。对话用英文；仓库文档、讲稿、字幕、画面文字用中文。
- 用户在本机用 Codex 制作，拉取本仓库后按 AGENTS.md 工作；英文指南在 `docs/*-EN.md`。
- 目标：提升抖音播放与粉丝，后续推广资料产品。资料未上架前不出现购买或领取引导。

## 当前作品（2026-10-13）

- 21 期词根/词汇横屏成片：press、reg、fer、bouba-kiki、ject、port、spect、vis-vid、aud、dict、script-scrib、
  tract、form、struct、flect-flex、rupt、mit-miss、duc-duct、cred、ten-tain、pon-pos（注册在
  `src/replica/projects/registry.ts`，交付在 `outputs/<期名>/` 或 `outputs/<期名>发了/`）。
- 3 期四六级方法课：`cet4-writing-paragraph-v2`、`cet4-translation-main-clause`、`cet6-reading-location-paraphrase`。
- 当前基准成片：`outputs/ten-tain/ten-tain.mp4`；视觉锚点：`references/visual-baseline/mit-miss-sunburst-full/`；
  生图角色参考：`public/assets/replica/mit-miss-images2-keyposes/` 与 `public/assets/replica/mit-miss/00_send_hook.png`。
- 平台交付：抖音竖屏（`vertical/`）、小红书图文卡（`xiaohongshu/`）均可由命令生成；推广配置在
  `planning/growth-promotion.json`。所有 release 仍为 draft，发布前需用户手机外放与耳机完整听看。

## 仍然有效的教训

1. **角色漂移是头号风险。** 只靠“black bean / stick figure”提示词会退化成细火柴人、空心眼、主体过小。
   必须以已接受小黑为参考图编辑，并在白底复合预览里人工复核后再进入配音和渲染（duc-duct、ten-tain 都因此返工）。
2. **每个词要有自己的姿态。** cred 首版 3 套姿态复用于 8 个词，词义与画面不符，整期返工。词图映射预检
   （`replica:preflight`）现已 fail closed。
3. **运行时素材只能来自本期目录。** ten-tain 首版误把旧期图片放进运行时目录，成片沿用旧配图。渲染前来源扫描会拦截。
4. **代码绘图不能冒充生图。** SVG / 代码形状兜底看起来像 PPT；全画布 SVG 机械层会盖住小黑。只用内置 `image_gen` 位图，
   动作用同母版 before / change / result 静态姿态切换。
5. **技术通过 ≠ 内容通过。** 解码、峰值、静音检查通过不代表语义正确；整片低清预览要连续看完，手机外放和耳机都要听。
   中点抽帧不能替代整片预览（ten-tain 曾因兼容位移出现单词溢出，只有整片预览发现）。
6. **TTS instruction 失败不能静默降级。** 换音色或文本就重配；缓存按文案与音色指纹失效。
7. **字幕不能切断英文单词。** 竖屏字幕按旁白重切为单行短句；`project:test` 有回归。
8. **Windows 兼容：** ffmpeg 不支持 `-pattern_type glob`，联系图一律用 concat 列表；浏览器与 ffmpeg 路径统一由
   `scripts/replica/renderEnv.ts` 解析（可用 `REMOTION_BROWSER_EXECUTABLE`、`FFMPEG_PATH`、`FFPROBE_PATH` 覆盖）。
9. **云端会话限制：** Claude 云端环境的网络策略拦截 `lfs.github.com`，不能推送新的图片/视频二进制；也可能拦截配音、
   生图接口。真正的生产在用户本机 Codex 完成。
10. **密钥：** 只在运行时从环境变量或被忽略的 `.env` 读取；提交前钩子扫描。用户曾在对话里粘贴密钥，已建议作废更换。

## 已停用路线（不要恢复）

即梦 / Seedream 生图、Wan 图生视频“动态小黑”、meme-vocab 竖屏原型、SVG 或代码绘图插画、全画布机械动效层、
重复 PPT 卡片、持续漂浮/随机弹跳。相关脚本与素材已在 2026-10-13 删除。老期数（ject、script-scrib、tract 等）的
已有运行时序列帧仍保留以便重渲染，但新期数不再制作。

## 更新记录

- 2026-10-12 抖音竖屏完整版、预告、复习卡与 `growth-promotion.json`；PR #1 合并。
- 2026-10-12 小红书图文卡（词根词卡、四六级方法卡）、`replica:produce --stage=deliver` 一条命令交付、英文指南；PR #2 合并。
- 2026-10-13 全项目整理：删除 `archive/`、`docs/history/`、旧审计与整理报告、`work/` 下全部试验、Wan / Seedream /
  meme-vocab 脚本与未引用素材（约 9,300 个文件）；视觉锚点样片移到 `references/visual-baseline/`；`work/` 改为
  本机临时目录不进 git；AGENTS.md 重写为单一规则入口；新增 `renderEnv.ts` 统一浏览器与 ffmpeg 路径。
