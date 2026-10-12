# Whiteboard reveal pilot

这是基于现有 `mit-miss` 配图的非破坏性视觉试片，不替换正式成片，也没有接入正式项目配置。

## 试片内容

- `submit-whiteboard.mp4`：`submit`，向上递交
- `transmit-whiteboard.mp4`：`transmit`，横跨传送
- `dismiss-whiteboard.mp4`：`dismiss`，送走、解散
- `whiteboard-mit-miss-preview.mp4`：三张配图合成的 1920×1080、12 秒教学布局预览
- `whiteboard-mit-miss-preview-contact.jpg`：逐笔绘制过程联系表
- `whiteboard-mit-miss-preview-hand.mp4`：加入“手握笔绘制”动作的 12 秒预览
- `whiteboard-mit-miss-preview-hand-contact.jpg`：加入手后的逐笔绘制过程联系表
- `mit-miss-whiteboard-hand-full.mp4`：沿用现有 `mit-miss` 完整时间线、旁白、字幕和背景音乐的 122.1 秒试片
- `mit-miss-whiteboard-hand-full-contact.jpg`：完整试片的 5 秒采样联系表

## 当前参数

- 纯白画布，30fps
- `render-image`
- `stroke-detail=rich`
- `color-fill=contour-wipe`
- `tail-color=1.2s`
- `hand=asian`
- `hand-scale=0.72`
- 透明 PNG 先合成到纯白底，避免透明区域被当成黑色

## 观察结论

- 橙色、蓝色道具的逐笔出现效果清楚，适合做配图入场。
- 实心黑色小黑最终保持稳定，和当前系列风格兼容。
- 手在每个分镜的线稿绘制阶段握笔跟随笔画，彩色填充和主体完成后自然退出；0.72 倍尺寸不会抢主体注意力。
- 完整版没有改正式 `src/` 或 `outputs/` 交付物；只是把原成片的画面层在 `work/whiteboard-pilot/` 中替换为手绘试片，音轨沿用已验证的旁白+BGM混音。
- 机械结构和纹理较多的图在线稿阶段会略密；正式批量化前应按素材简化线稿或改用更克制的 stroke detail。
- 试片仍是独立白底 MP4；若接入正式 Remotion，需要把它限制在插图区，完成后切回透明 PNG，避免白底遮住文字和字幕。
