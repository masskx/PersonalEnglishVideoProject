# 技术源素材

- `green-screen/<期名>/`：图片接口生成的绿色背景源图。Remotion 不直接读取；用于重新抠图或追溯插图来源。
  真正参与渲染的透明 PNG 在 `public/assets/replica/<期名>/`。
- `replica/<期名>/`：少数期数的关键姿态源图（当前为 duc-duct 手绘版）。
- `visual-baselines/`：已验收视觉基线的源图（mit/miss），只作生成参考，不挂进新片。
- `cet4-translation-main-clause-illustrations/`：四级翻译期插图源文件。
- `background-music/`：系列背景音乐源（MiniMax 纯音乐）；运行时副本在 `public/assets/music/`。
- `branding/`：账号头像等品牌素材。

淘汰图和试验图放本机 `work/`（不进 git），不要放进这里或 `public/`。
