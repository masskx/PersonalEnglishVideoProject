# mit / miss 流畅文字试验复核

日期：2026-09-12。范围：文字动作、场景交接、工作台与 Skill；保持正式交付不变。

## 已完成

- 新增 smooth-rise、smooth-slide、smooth-reveal、smooth-out 与彩色词素错峰归位。
  五次平滑曲线由帧驱动；起止速度/加速度为零。没有整图漂移或弹跳。
- 完整成片：1920×1080，30/1 恒定帧率，3663 帧，视频轨 122.1 秒；AAC 48kHz 双声道。
- 最终修正版通过 replica:render:verify：峰值 −2.83 dBFS，没有检测到不允许的长静音。
  详见 ../render-report.json；封装时长可比视频轨稍长，来自 AAC 尾部。
- 三处非单词页首标题立即可读，纯文字页保留标题至边界；边界修正的 AAC 数据保持不变。
  详见 ../boundary-fix.json；修改前版本保留在 ../render-history/。
- 提取最终编码视频 245 帧，覆盖所有姿态切换、场景边界和文字进入中间帧。
  已目检三张边界总表、八词姿态总表及交接预览；未宣称逐帧人工审完 3663 帧。
- props-check.json 验证：旁白、字幕、BGM、文字内容和配图层未变；2256 个单词场景帧
  每帧仅有一个姿态；图层时间不越界，非单词页首标题在第一帧可读。
- npm run typecheck、project:test、project:check、replica:validate -- --project=mit-miss 通过。
  注册项目校验针对原配置；试验额外使用 ../check-props.py 校验独立 props。
- Skill quick_validate 通过。原素材保全：153 个受保护文件、1896 个迁移文件哈希全部相同。

## 工作台

新增计划源 planning/content-plan.json。支持新增/编辑选题、栏目与资料信息、阶段推进、
下一步与真实复盘数据，以及浏览器 localStorage 保存和 JSON 导入导出。
浏览器功能验证覆盖新增、编辑、刷新保存、导入、导出、作品筛选、播放器与 390px 宽度。
测试结束已恢复种子计划，未留下伪造播放或销售数据。截图与导出证据在本目录。
浏览器测试使用本地 HTTP；自动化工具阻止 file://，没有据此声称已实测双击页面模式。
文件模式不依赖 fetch；若浏览器限制本地存储，页面提示导出备份。
三版对比已验证在 29.6 秒切换后保持时间。普通 Python http.server 不支持视频字节范围，
会导致跳播回到起点；本次预览改用 ../preview-server.py，监听本机 8767 端口并支持 Range。

## 感官与内容复核边界

这是可观看、可比较的完整试验版，不是已经批准发布的版本。
主观“丝滑程度”仍须实际播放判断；没有完成整期人工听审，也未重新审核词源、搭配等教学内容。
本次未重新调用配音/绘图接口，未更换生产生图供应商，未创建新的四六级视频或上架资料。
原 17 期内容复核与 4 处发布记录冲突仍保留待核对。

## 复现

准备：npx tsx scripts/replica/smoothTrial.ts。
渲染：npx remotion render src/index.ts MitMissReplica work/experiments/mit-miss-smooth/mit-miss-smooth.mp4 --props=work/experiments/mit-miss-smooth/props.json --public-dir=work/experiments/mit-miss-keyposes/public --codec=h264 --crf=18 --pixel-format=yuv420p --audio-codec=aac --audio-bitrate=192k --concurrency=4 --browser-executable="C:/Program Files/Google/Chrome/Application/chrome.exe"

若要保留本次成片，再次渲染应使用新文件名。素材来自已有关键姿态试验，不需要请求生成接口。
