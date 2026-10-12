# CRED 成片检查记录

日期：2026-09-21  
版本：Sunburst full v2 semantic rework  
成片：[`../cred.mp4`](../cred.mp4)  
状态：技术、逐词映射与编码切点检查通过；完整人工观看/听审待完成；release 维持 `draft`。

## 通过项

- `npm run typecheck`、`npm run replica:validate -- --project=cred`、`npm run replica:preflight -- --project=cred` 通过。16 个场景、196.8 秒、89 层；八个教学词各绑定一组独立的 before/change/result 图片，Summary 覆盖八词。
- `npm run replica:render:verify -- --project=cred` 通过：1920×1080、30fps、5904 帧、H.264/AAC；视频和音频完整解码；峰值 -2.79 dBFS；0 个异常长静音窗口、0 个旁白覆盖空档。
- 竖封面 1080×1440、横封面 1200×900 均通过不透明 PNG、四白角和 8 个词汇覆盖检查。`publish-copy.md` 已按 v2 重新生成。
- 对最终编码 MP4 解码了 32 个姿态切点前/后帧。接触表：[`stills/keypose-cuts-encoded/contact-sheet.png`](stills/keypose-cuts-encoded/contact-sheet.png)。重点核对 credulous / incredulous、incredible 事件结果和 discredit 的听众反应，切换方向清晰。
- 与项目内最新已接受的 2026-09-19 `mit-miss-sunburst-full` 进行了 16 点共同时间区间对照。接触表：[`comparison-mit-miss-v2/contact-sheet.png`](comparison-mit-miss-v2/contact-sheet.png)，方法与差异：[样片对照记录](SAMPLE-COMPARISON-NOTES.md)。参考视频流长 122.1 秒（容器 122.155 秒），本片 196.8 秒；共同时间末端章节不同，不作为节奏一对一复刻。白底、词素文字、动作图与例句/总结的层级沿用系列样片。
- 360px 移动缩图 16 场已逐张检查；[最终版移动接触表](stills/mobile-v2/contact-sheet.jpg)。重点词、例句、练习题和八词总结无裁切、遮挡或重叠；小字号中文辅助释义在 360px 下较紧凑，主词与题干仍可辨认。

## 返工内容与发现

- v1 的 9 张图被复用到 8 个词，`incredible` 误用了怀疑人物动作；Summary 只列 4 词。v1 原因及审计见 [`AUDIT-2026-09-21.md`](AUDIT-2026-09-21.md)，返工过程见 [`REWORK-2026-09-21.md`](REWORK-2026-09-21.md)。
- v2 为八词生成 24 张姿态，每词有独立意思/例句/动作和 Summary 行。白底与移动素材总览已人工复核，编码 MP4 的三态切点亦已抽查。
- 第一次 v2 技术渲染发现 examples-in-context 旁白提前 1.546 秒结束。原先此类空档只能等到整片渲染后才会报错；补充 `credible / creditable` 的简明辨析后，实测必需播放速率为 1.119。项目验证现已在渲染前按音频时长拦截会留下至少 1.2 秒空档的项目。
- v2 配音使用 CosyVoice v3 Flash / longanhuan 固定格式 instruction，16 个场景音频均绑定文案和 profile hash；没有静默退化。
- Iconfont 本期仍未使用；没有可核验授权信息。

## 仍待完成

- 对全部 16 个场景做边界巡检，并完整观看最终分辨率成片、逐段听审中文讲解、英文发音、场景交接与 BGM。工具检查、自动解码和抽帧不代替人工听审，因此目前不能批准发布。
- release 状态保持 `draft`；没有自动发布或上架。
