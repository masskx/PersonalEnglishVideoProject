# 技术源素材

`green-screen/<slug>/` 保存图片接口生成的绿色背景源图。Remotion 不直接读取这些文件；
它们用于重新抠图或追溯插图来源。真正参与渲染的透明 PNG 位于
`public/assets/replica/<slug>/`。

`archive/<slug>-rejected/` 仅保存与最终取舍有关的拒绝样本，用于复盘素材门禁；这些文件
不参与运行时渲染，也不应复制到 `public/`。目前 `ject-rejected/` 留存模型黑边失败样本
和检测回归图，最终采用的代码底板仍位于 `green-screen/ject/`。
