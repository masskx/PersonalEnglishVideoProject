# CRED 内容准确性检查

> 词义、例句和词源核对已完成。v1 的词义—画面错配仍作为历史问题留档；v2 已为八个教学词各自绑定三态姿势，且白底 mapping 与最终编码 MP4 的 32 个姿态切点前后帧均已通过人工复核。完整场景边界巡检、整片观看与逐段听审仍待完成，本片维持草稿。

> 360px 移动检查已逐张查看 16 场：主要词汇、例句、练习与总结无裁切、遮挡、重叠；小字号中文辅助释义偏紧凑。该检查不替代完整播放审听。

## 词义与词源

| 单词 | 视频中的现代义 | 关系说明 | 助记边界 | 词典来源 |
|---|---|---|---|---|
| credible | 有理由相信的；可信的 | 与 Latin *credere*（believe / trust）同族 | “值得相信”不等于已经证实为真 | [Cambridge](https://dictionary.cambridge.org/dictionary/english/credible) |
| credibility | 可信度；可靠性 | 由 credible 派生，拼写中 y 变 i 后加 -ity | 按词形变化记，不把 cred + ibility 当作独立后缀 | [Cambridge](https://dictionary.cambridge.org/dictionary/english/credibility) |
| credulous | 太容易相信别人的；轻信的 | Latin *credulus* 来自 *credere* | 主要描写容易相信的人，常带批评或提醒意味 | [Cambridge](https://dictionary.cambridge.org/dictionary/english/credulous)、[Etymonline](https://www.etymonline.com/word/credulous) |
| incredulous | 不愿或不能相信的；表示怀疑的 | 与 credulous 同族，in- 表示否定方向 | 不是“难以置信的消息”；消息用 incredible，人用 incredulous | [Cambridge](https://dictionary.cambridge.org/dictionary/english/incredulous) |
| incredible | 难以置信的；口语中也可表示极好的、惊人的 | in- 与 credible 相关 | 词义由语境决定；本片区分“消息难以相信”和“人表示不相信” | [Cambridge](https://dictionary.cambridge.org/dictionary/english/incredible) |
| credit | 认可、功劳、信用；赊借 | English 经由 Latin *creditum* 与 *credere* 相连 | 不同词义有历史语义延伸，视频只作记忆连接 | [Cambridge](https://dictionary.cambridge.org/dictionary/english/credit)、[Etymonline](https://www.etymonline.com/word/credit) |
| creditable | 值得称赞的；不错的 | credit + -able 的词形关系 | 不能和 credible（可信的）混用 | [Cambridge](https://dictionary.cambridge.org/dictionary/english/creditable) |
| discredit | 损害信誉；使人不再相信 | dis- 表示削弱/否定，credit 指信誉或认可 | 语境中可指损害人的声誉或某种说法的可信度 | [Cambridge](https://dictionary.cambridge.org/us/dictionary/english/discredit) |

## 核对结论

- [x] Cambridge Dictionary 词义与本片中文释义、例句相符。
- [x] 用 Etymonline 核对 credulous 与 credit 的拉丁词源线索。
- [x] 旁白明确说明 cred 是记忆线索，不能把每个词都机械翻译成同一公式。
- [x] 已区分 credible / credulous / incredulous / incredible，避免把“可信的”“轻信的”“不相信的”“难以置信的”混为一谈。
- [x] 已说明 credible evidence 的“可信”并非“百分之百证实”。
- [ ] 完整观看并听完成片；需成片输出后做最终人工复核。

## 画面与讲解映射复核

- [x] v2 映射计划逐项覆盖八个教学词；每词有独立场景、语义动作、例句与 before/change/result 资源路径，复习页列全八词。计划：[`../../planning/cred-keyposes-v2.json`](../../planning/cred-keyposes-v2.json)。
- [x] 白底 contact sheet 复核通过，特别复核 credulous / incredulous 的动作区别、incredible 的事件结果、discredit 的听众反应：[`review/keyposes-v2-contact.png`](review/keyposes-v2-contact.png)；移动端缩图：[`review/keyposes-v2-contact-mobile.png`](review/keyposes-v2-contact-mobile.png)。
- [x] 最终编码 MP4 的 16 个姿态切点均提取切换前/后帧复核，接触表见 [`review/stills/keypose-cuts-encoded/contact-sheet.png`](review/stills/keypose-cuts-encoded/contact-sheet.png)。
- [ ] 全部场景边界巡检和整期观看仍待完成。v1 发现保留在 [`review/AUDIT-2026-09-21.md`](review/AUDIT-2026-09-21.md)；最新样片比较证据在 [`review/comparison-mit-miss-v2/contact-sheet.png`](review/comparison-mit-miss-v2/contact-sheet.png)。

## 语音与图标记录

- 旁白模型：CosyVoice v3 Flash，音色 longanhuan，配置语速 1.08。
- v1 使用不受该音色支持的自由描述并静默回退。v2 已改为固定格式 `你正在进行科普知识推广，你说话的情感是neutral。`，全段重新合成且写入文本与音色配置指纹；不再把文件存在误当成缓存仍有效。
- 完整逐段听审尚未完成；不能据技术合成成功推定英语发音和口语自然度已通过。
- Iconfont 页面需要登录，目前没有可核验的授权状态；本期不使用外部图标。
