# 四级作文试片：把观点展开

[播放视频](index.html) · [竖封面](cover.png) · [横封面](cover-landscape.png) · [配套练习](worksheet.html) · [讲稿](script.md) · [发布文案](publish-copy.md)

规格：1920×1080 / 30 fps / 106.03 秒。15 段百炼 CosyVoice 配音，按实测时长排布；英文合成语速 1，中文 1.08，播放不加速。复用写字小黑图和原背景音乐，无新生图调用。

主题为原创模拟题。词汇、拼写统一采用英式 organise / practise；本期仅展示一个主体段。

复现：先运行 npx tsx scripts/replica/cetWritingVoice.ts（仅检查已有配音；加 --generate 才请求生成）；再运行 python scripts/replica/prepareCetWriting.py、npx tsx scripts/replica/cetWritingRender.ts、npx tsx scripts/replica/cetWritingRender.ts --video。

此处为试验交付，不代表已发布。验收记录见 review/REVIEW.md。
