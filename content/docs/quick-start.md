---
title: "快速开始"
description: "5 分钟上手 Issueflow-Blog 自动化博客系统"
date: 2026-05-23
draft: false
---

# 快速开始

本指南带你 5 分钟内完成 Issueflow-Blog 的初始化配置。

## 前置要求

- Node.js 18+ (推荐 v22+)
- GitHub CLI (`gh`)
- Git

## 步骤 1：安装 GitHub CLI

```bash
# macOS
brew install gh

# Ubuntu/Debian
sudo apt install gh

# 认证
gh auth login
# 选择：GitHub.com → HTTPS → Login with web browser
```

## 步骤 2：初始化项目

```bash
# 创建 Fumadocs 项目
npx create-fumadocs-app@latest my-blog \
  --yes \
  --framework nextjs \
  --app \
  --tailwind \
  --typescript

cd my-blog
```

## 步骤 3：配置 GitHub 仓库

```bash
# 创建远程仓库并推送
gh repo create my-blog --public --source=. --push

# 验证
gh repo view
```

## 步骤 4：添加 GitHub Actions

创建 `.github/workflows/sync.yml`：

```yaml
name: Sync Issue to Blog

on:
  issues:
    types: [closed]

permissions:
  contents: write
  issues: read

jobs:
  sync-issue-to-blog:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Create blog post from Issue
        run: |
          # 自动生成 Markdown 文件
          echo "Hello from Issue!" > content/docs/test.md
          git add content/docs/
          git commit -m "docs: sync issue"
          git push
```

## 步骤 5：开始写作

```bash
# 创建内容目录
mkdir -p content/docs

# 创建第一篇文档
cat > content/docs/hello-world.md << 'EOF'
---
title: "Hello World"
description: "我的第一篇文章"
date: 2026-05-23
draft: false
---

# Hello World

这是第一篇博客文章！

EOF
```

## 步骤 6：部署到 Vercel

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录并关联
vercel login
vercel link

# 部署
vercel --prod
```

## 验证

1. 访问 Vercel 提供的预览 URL
2. 确认页面显示 "Hello World"
3. 关闭一个 GitHub Issue 触发自动化

---

## 下一步

- [架构设计](./architecture) — 深入了解系统架构
- [写作流程](./writing-workflow) — 使用 Vim 脚本写作
- [部署指南](./deployment) — 多平台部署选项
