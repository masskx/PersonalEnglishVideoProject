# CRED 与当前接受样片对照记录

日期：2026-09-21  
本期：[`../cred.mp4`](../cred.mp4)（1920×1080，30fps，196.8 秒）  
参考：[`../../../work/experiments/mit-miss-sunburst-full/mit-miss-sunburst-full.mp4`](../../../work/experiments/mit-miss-sunburst-full/mit-miss-sunburst-full.mp4)（1920×1080，30fps；视频流 122.1 秒，容器 122.155 秒）

## 对照方法

对两支实际编码 MP4 在共同时间区间内取 16 个等间隔时间点；两边仍帧由编码视频解码得到。接触表：[`comparison-mit-miss-v2/contact-sheet.png`](comparison-mit-miss-v2/contact-sheet.png)，机器探测结果：[`comparison-mit-miss-v2/comparison.json`](comparison-mit-miss-v2/comparison.json)。

这组抽样按共同的绝对时间点对照，适合看系列视觉语法和画面密度，不是按教学章节对齐的节奏比较。两片时长不同，最后一个共同时间点已进入参考片尾段、而 CRED 仍处于例句部分；不能据此声称两片节奏完全相同。

## 对照发现

- 保留系列的 1920×1080 白底构图、蓝/橙文字层级、小黑主导语义动作、简洁例句与总结页。
- CRED 返工版逐个词使用 before/change/result 三态图；动作画面表达各自词义，不再把“人不相信”的动作借给 `incredible` 或 `discredit`。
- 文字有丝滑进出场，正文不出现制作步骤导航、调试标签或大面积机械 SVG 道具层。
- 本期为修复 v1 的教学映射缺陷增加了辨析、例句和练习内容，时长比参考片长 74.7 秒；后续比较节奏时应按同类教学段落对齐，而不是直接用整片时长判定。

## 移动端复核

[360px 接触表](stills/mobile-v2/contact-sheet.jpg)覆盖本片 16 个场景。逐张复核时，目标词、例句、练习题和总结表没有裁切、遮挡或重叠；中文辅助释义在缩图下偏紧凑，整体仍沿用本项目横屏母版。此结果不是整片观看或听审的替代证据。

## 尚未完成

完整场景边界巡检、整片观看和逐段听审仍待完成。比较与自动技术检查通过不等于人工终审通过；`release.json` 保持 `draft`。
