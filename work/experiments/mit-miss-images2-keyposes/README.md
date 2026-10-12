# MIT / MISS · Sunburst 参考图编辑三姿态

这是新视觉链路的第一组实际产物，不替换现有正式成片。

- [三姿态总览](contact-sheet.png)
- 动作前：`public/assets/replica/mit-miss-images2-keyposes/submit-before.png`
- 交接中：`public/assets/replica/mit-miss-images2-keyposes/submit-change.png`
- 结果：`public/assets/replica/mit-miss-images2-keyposes/submit-result.png`
- [调用与素材 QA 报告](source/reference-edit-report.json)
- [长期视觉金样](../../../assets/visual-baselines/mit-miss-sunburst/README.md)
- [可复用计划](../../../planning/visual-baselines/mit-miss-sunburst-plan.json)

制作方法：从同一母版分别编辑动作中和结果，不连续串改图片；接口返回后统一到
2048×1152、去除白底并执行透明素材 QA。成片只使用互斥姿态、局部关键帧和文字节奏，
不使用覆盖主体的蓝色 SVG 机械层。
