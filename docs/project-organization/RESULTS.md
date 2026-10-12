# 2026-09-12 项目整理结果

本轮按“保留基本内容、保留封面和最终视频、先整理后拓展”执行。日常入口是 [PROJECTS.html](../../PROJECTS.html)，用根目录 `刷新项目管理.cmd` 更新并打开。

## 实际完成的整理

| 原来 | 现在 |
| --- | --- |
| 每期目录中混有成片、草稿、截图、分镜 | 最终文件留原位置；分镜、截图和对比集中到各期 review/ |
| outputs 中的 5 个 draft.mp4 | work/drafts/<期名>/draft.mp4 |
| outputs 下 script-scrib / tract 的 Wan 源片和任务 | work/experiments/wan-history/<期名>/ |
| 根目录 output/interrupt | work/experiments/meme-vocab/interrupt/，代码默认路径同步 |
| 根目录 bg | assets/music-source/candidates/ |
| 双层 ian-xiaohei-illustrations-main | references/ian-xiaohei/，完整保留 LICENSE、NOTICE 和来源资料 |
| work 根散落日志、pid 文本 | work/logs/legacy/ |
| 空 config/voice 和 config | 移除空目录；实际参数仍在各期源码配置 |
| 各期缺少统一管理入口 | 搜索/筛选/播放管理页 + 17 份统一导航 + 当前作品清单 |

原有运行时配音、插图、动态帧、BGM 和音效保留在 public/assets/。没有删除旧媒体，没有为整理调用生图、TTS、Wan 或重新渲染视频。

## 内容保全证据

- 整理前记录了 **153 个核心原文件**的 SHA-256：17 个最终 MP4、34 张封面、34 份文案、17 份 release 和 51 份媒体/封面报告。整理后全部一致。
- 主目录迁移 **143 项**，包含 **1896 个文件**，逐一验证迁移前后 SHA-256 一致。
- interrupt 的 2 个 MP4、6 个 WAV 与其他未涉及路径修改的文件保全；路径和使用时段元数据修正前已单独备份。教学文本、已有时间线和历史 QA 保持不变。
- 原 README 保存到各期 review/README.before-organization.md；当前 README 为自动导航。原配置、Skill 和入口文档保存在 archive/project-organization-2026-09-12/。

[核心文件和目录保全结果](preservation-results.json) · [逐项迁移日志](directory-migration.json) · [原型迁移与验证](prototype-migration.json)

## 管理流程修复

长视频工具共用目录解析，识别真实存在的普通目录或“发了”目录；两者同时存在时报告冲突，不静默选一份。默认草稿与验收截图也使用整理后的路径。发布状态更新保留已有自定义字段，内容 QA 的普通生成不会覆盖已有记录。正式渲染先暂存并通过技术检查，再更新交付文件；旧交付保存在 work/delivery-backups/。

原型脚本统一到 work/experiments/meme-vocab/，图片引用改用 public 相对路径，素材使用时段对齐已有实测时间线。5 张占位图仍明确标为待替换；没有把原型误标为完成。

管理页与清单从当前配置和文件生成，保留本地发布记录、内容复核和媒体齐全度三种不同状态。以后不用靠手工移动目录来维护状态。

## 本轮验证

TypeScript、项目管理回归测试、原型既有测试和 17/17 期项目校验通过。当前目录/运行时路径检查已通过：17 期，6,779 个文件，42 组动态帧目录。[健康检查](health.json) 的两类提示是实际待办：4 个发布记录冲突、17 期内容尚待人工核对。这不是文件缺失。

浏览器已检查桌面管理页、关键词搜索、4 项状态冲突筛选、视频弹窗和媒体加载；窄屏布局与最终回归记录见 [验证汇总](verification.json)。此处没有声称全片听审或内容准确性已通过。

## 明确保留的待办

- flect-flex、struct、tract、rupt 的发布标记存在历史冲突，等待实际发布信息，未猜测、更改或伪造平台链接。
- 已补齐 rupt、mit-miss 缺失的内容检查单；17 期均待填写事实核对结果。
- rupt 源稿“interrupt me，就是别打断我”的英文否定缺失列为内容修订项。本轮保持教学内容和音视频不变。
- 后续栏目拓展尚未开始。

[管理流程](../项目管理流程.md) · [配音与绘图](../制作说明-配音与绘图.md) · [返回项目](../../README.md)
