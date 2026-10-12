# MIT / MISS Sunburst 视觉金样

这是 2026-09-12 已获用户认可的参考图编辑结果，现提升为后续视频的稳定视觉基线。

- `reference.png`：同一构图的动作前状态，下方小黑持橙色信封。
- `result.png`：通过 `gpt-image-2.5-sunburst` `/v1/images/edits` 得到的动作结果，上方小黑持同一信封。
- `comparison.jpg`：动作前/结果并排证据。
- `prompt.txt`：当次实际编辑请求。
- `result.json`：模型、接口、耗时、尺寸和人工观察，不含凭据或图片正文。

这套金样约束的是视觉连续性和制作链路，不要求后续题目复刻桌子或信封。新题目应重新设计动作隐喻，但必须沿用“先定母版、再编辑姿态、最后做局部关键帧”的方法。

复现入口：

```powershell
npx tsx scripts/replica/generateReferenceKeyPoses.ts --plan=planning/visual-baselines/mit-miss-sunburst-plan.json
npx tsx scripts/replica/generateReferenceKeyPoses.ts --plan=planning/visual-baselines/mit-miss-sunburst-plan.json --generate
```

第一条命令只预览计划；第二条会调用已配置的 Images2 中转站。项目凭据统一保存在根目录、已被 Git 忽略的 `.env`。
