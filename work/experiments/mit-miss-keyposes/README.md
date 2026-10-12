# MIT / MISS 关键姿态测试

本轮测试最近一期 `mit-miss`，保留原台词、字幕、配音、背景音乐与 122.1 秒时间轴。
8 个单词各展示动作前、关键变化、结果三个状态。原版视频和两种封面未覆盖。

- [播放测试视频](mit-miss-keyposes.mp4)
- [原版/测试切换播放器](compare.html)
- [24 个姿态总览](pose-contact-sheet.jpg)
- [竖版封面](cover.png) · [横版封面](cover-landscape.png)
- [切换时间及台词依据](beat-map.json)
- [逐帧区间检查](pose-validation.json)
- [成片技术检查](render-report.json)

## 本轮改法

submit、transmit、emit、commit 使用 Seedream 生成的独立姿态；admit、permit、dismiss、
mission 的生成结果出现人数、背景或空间关系漂移，改为复用已接受的小黑切片，配固定
门、栏杆、方向和旗帜，排出三个离散状态。后者是静态分层合成，没有图生视频或连续补间。

删除本次试验中的机械运动、整图漂移、弹跳及不再对应画面的旧音效。词义在结果态
出现并停留，文本锚点保持稳定。开场、总览、例句、总结沿用原内容，以简短淡入展示。
末轮修复了这些段落的提前退场白闪：画面保持到场景结束，下一段标题首帧可见。

绘图使用项目配置 `doubao-seedream-4-0-250828`，2K，绿底去背；测试不使用 Wan。
原配音来自百炼 `cosyvoice-v3-flash` / `longanhuan`，配置 rate 1.14，未重新生成。
维持原有按场景长度计算的播放速率，以及共享 BGM 和语音避让设置。

## 结论与限制

关键姿态方案能够用静态模型表达“谁把什么送到哪里”，不需要每张图持续运动。
但逐张生图不自动保证连续性：本次四组需要固定素材分层合成，这是可复用的制作策略。
transmit 的橙色胶囊作为信息的视觉助记，发送与接收可同时出现；它不代表真实无线电
中的实体胶囊。commit 的卡槽同样是承诺的助记，不能据此推出所有词义。

切换时点依据已有字幕短语安排，并非逐词强制对齐；完整人工听审和传播效果评估未完成。
本轮是形式试验，不改变原发布状态，也不替代原项目待完成的内容核验。

## 复现（仓库根目录运行）

```powershell
# 准备独立时间轴，复用当前试验素材，不调用 API
npx tsx scripts/replica/keyPoseTrial.ts
D:/miniconda/python.exe scripts/replica/keypose/render_assets.py
D:/miniconda/python.exe scripts/replica/keypose/verify_trial.py
npx remotion render src/index.ts MitMissReplica work/experiments/mit-miss-keyposes/mit-miss-keyposes.mp4 --props=work/experiments/mit-miss-keyposes/props.json --public-dir=work/experiments/mit-miss-keyposes/public --codec=h264 --crf=18 --pixel-format=yuv420p --audio-codec=aac --audio-bitrate=192k --concurrency=4 --browser-executable="C:/Program Files/Google/Chrome/Application/chrome.exe"
npm run replica:render:verify -- --project=mit-miss --input=work/experiments/mit-miss-keyposes/mit-miss-keyposes.mp4
D:/miniconda/python.exe scripts/replica/keypose/review_frames.py
```

需要重做某一张时，生成脚本支持 `--generate --only=submit --pose=3 --regenerate`；
该命令会调用付费静态生图服务，旧 PNG 保存在本目录 rejected 中。分层重排脚本是
`scripts/replica/keypose/repair_relations.py`。不要在生成仍运行时打包渲染素材。

`generation-plan.json` 为当前可复用提示计划，`*-prompt.txt` 保留后半轮实际请求提示，
`*-source.png` 为模型源图，`rejected/` 保存被替换素材。前期提示有迭代，不把当前计划
宣称为每一次历史请求的完整日志。运行时图在独立 `public/assets/replica/mit-miss-keyposes/`。
