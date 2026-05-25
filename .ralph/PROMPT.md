# Issueflow-Blog 自动化任务指令

## 项目概述

基于 GitHub Issues + Vim + Fumadocs 的自动化博客系统。

**技术栈**：
- Next.js 15 + React 19（自动适配）
- Fumadocs 15（MDX 文档框架）
- Tailwind CSS v4
- GitHub Actions（自动化部署）
- Netlify（部署平台）

## 核心功能

1. **Vim 写作** → `scripts/write.sh` 创建 GitHub Issue
2. **Issue 关闭** → GitHub Actions 自动同步到博客
3. **Netlify 部署** → 自动构建并发布

## 自动化任务规则

### 可以自动执行的任务（无需请示）

- ✅ 修复构建错误（Next.js、Fumadocs 配置）
- ✅ 更新依赖版本（npm update）
- ✅ 添加新的 GitHub Actions 工作流
- ✅ 修改样式（Tailwind CSS）
- ✅ 创建/修改 Markdown 文档
- ✅ 修复 TypeScript 类型错误
- ✅ 添加新的 CLI 脚本

### 需要请示的任务

- ❌ 修改核心架构（Next.js 配置、Fumadocs 配置）
- ❌ 删除已有文件
- ❌ 修改部署平台配置
- ❌ 涉及 GitHub API 权限的变更
- ❌ 超过 500 行的单次修改

## 工作目录

`/home/qiyu/下载/Issueflow-Blog/`

## 关键文件

| 文件 | 作用 |
|------|------|
| `next.config.ts` | Next.js 配置（静态导出） |
| `fumadocs.config.ts` | Fumadocs MDX 配置 |
| `package.json` | 依赖管理 |
| `.github/workflows/sync-netlify.yml` | Netlify 部署工作流 |
| `.github/workflows/sync-github-pages.yml` | GitHub Pages 工作流 |
| `scripts/write.sh` | Vim 写作脚本 |

## 部署流程

```
GitHub Issue 关闭 → Actions 触发 → 生成 Markdown → Commit & Push → Netlify 部署
```

## 调试命令

```bash
# 构建测试
npm run build

# 开发服务器
npm run dev

# 检查依赖
npm list

# 运行写作脚本
bash scripts/write.sh
```
