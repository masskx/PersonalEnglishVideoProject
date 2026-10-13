# work/：本机临时目录

整个 `work/` 被 gitignore，只有本说明进仓库。脚本会自动在这里建立：

| 位置 | 内容 |
| --- | --- |
| `render-staging/` | 渲染时按期隔离的 public 素材暂存，渲染结束自动删除 |
| `vertical-stills/` | `npm run vertical:stills` 的竖屏版式抽查图 |
| `drafts/` | 制作中的草稿（还没交付的期数，查重时也算已用题目） |
| `experiments/` | 试验、淘汰图、对照帧 |
| `delivery-backups/` | 更新交付前的上一版文件 |

这里的内容随时可以删除；正式交付只放 `outputs/<期名>/`。2026-10-13 之前留在这里的旧试验已删除，需要追溯用 git 历史。
