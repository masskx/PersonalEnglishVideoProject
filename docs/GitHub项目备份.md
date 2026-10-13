# GitHub 项目备份

本仓库保存项目源码、Skills、规则、计划、参考素材、正式交付和制作检查记录。草稿与试验只放本机 `work/`，不进仓库；
2026-10-13 删除的旧归档与试验可从 git 历史找回。

## 恢复项目

安装 Git LFS 后克隆仓库，以取得完整图片、音频、视频和 PDF：

```powershell
git lfs install
git clone https://github.com/masskx/PersonalEnglishVideoProject.git
cd PersonalEnglishVideoProject
git lfs pull
npm ci
Copy-Item .env.example .env
npm run hooks:install
```

在本机 `.env` 中填写自己的配置；仓库中的 `.env.example` 仅含变量名和空值。
随后打开根目录 `00-打开工作台.html`，并按 `AGENTS.md` 恢复项目工作。

## 排除范围

- 个人环境文件、私钥、凭据文件。
- Chrome/浏览器用户配置目录及自动化浏览器状态。
- `node_modules`、Python 虚拟环境、第三方 Python 安装目录、字节码缓存。
- `work/` 整个目录（渲染暂存、草稿、试验、淘汰图）、临时文件和进程号文件。
- Git 自身的本地对象、未引用对象和运行状态不会随提交上传。

图片、音频、视频等二进制素材由 `.gitattributes` 指定使用 Git LFS。
后续提交也必须检查新增内容是否包含密钥；`.gitignore` 只负责按路径排除，不能识别写入源码或文档的凭据。
