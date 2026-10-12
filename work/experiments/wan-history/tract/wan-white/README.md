# 白底图生视频实验

本目录记录 `-tract` 的白底免抠动态图实验。

## 方法

1. 将 9 张已验收透明小黑插图合成到纯白 16:9 输入板。
2. 使用 Wan 生成 9 条 5 秒、30fps、固定镜头动作，提示词强制白底、无阴影、无渐变、无边框、无黑场。
3. 不生成 Alpha、不进行绿幕抠像；直接从 MP4 抽取 1664×928 RGB PNG。
4. 对整帧近中性高亮像素做白场校正，使模型产生的浅灰背景回到 `#FFFFFF`。这是全帧色阶归一，不是人物分割。
5. 在 Remotion 中使用单帧原速往返播放，避免白底双帧溶解产生重影，也避免 `149 → 0` 硬切。

## 结果

- 9/9 核心动作已接入正式成片：hook、attract、distract、extract、contract、subtract、retract、tractor、traction。
- 最终成片抽帧未见绿边、黑色/灰色矩形底板或循环双影。
- `contact-sheet-raw.jpg`：模型原始白底效果。
- `contact-sheet-normalized.jpg`：白场校正后的 9×3 动作帧。
- `final-contact-sheet.jpg`：接入正式成片后的 12 场景抽帧。
- `*-white.task.json` 与 `*-white.source.mp4`：9 条图生视频任务和源片。

## 当前判断

这条路线在本集上可用，且明显降低抠像失败风险。不过暂不修改全局 Skill；需用户观看正式成片确认后，再将白底输入、白场校正、RGB 帧检查和往返播放写入 Skill。

