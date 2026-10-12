# 生图接口检查

2026-09-12 查询用户指定服务的 `/models` 和 `/v1/models`，两者均返回成功，生图模型为：

- gpt-image-1
- gpt-image-1.5
- gpt-image-2
- gpt-image-2.5-flare
- gpt-image-2.5-sunburst

官方文档 https://developers.openai.com/api/docs/guides/image-generation 将 Sunburst 定位于
编辑精度优先、Flare 定位于快速高质量日常生图。对本项目关键姿态连续性，优先选择 Sunburst。

通过用户指定服务 `/v1/images/edits` 实测 Sunburst，使用项目 submit 参考图，要求只改变
信封归属及手臂姿态。约 27.09 秒返回图片。两个人物和桌子得以保留，信封转到上方角色，
下方角色双手放空。输出并非像素级完全保留背景；请求 1536×864，实际输出 1672×941，
接入时必须按实际尺寸校验和统一画布。未测试另外四个模型，不能声称已做横向质量排名。

配置中的 gpt-5.5 是主对话模型，不能仅把它改成生图模型就完成项目接入。
可为绘图脚本单独配置 OpenAI-compatible Images API；原 Seedream 与百炼配音配置均未改。

结果见 comparison.jpg、sunburst-edit.png、result.json。凭据只用于本次请求，未写入这些文件。
