---
title: "部署指南"
description: "GitHub Pages + Netlify + Issues 三平台部署详解"
date: 2026-05-23
draft: false
---

# 部署指南

本文介绍 Issueflow-Blog 的 **GitHub Pages + Netlify + Issues** 三平台部署方案。

## 三平台部署架构

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Issueflow-Blog 三平台部署架构                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌─────────────┐                                                       │
│   │ GitHub      │  ←── Issues 作为内容源（写作、管理、状态追踪）          │
│   │ Issues      │                                                       │
│   └──────┬──────┘                                                       │
│          │                                                              │
│          │ 关闭 Issue 触发同步                                           │
│          ▼                                                              │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                    GitHub Actions                                 │   │
│   │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │   │
│   │  │ sync-issues  │─>│ generate-    │─>│ 构建 Next.js          │   │   │
│   │  │ .js          │  │ pages.js     │  │ (npm run build)       │   │   │
│   │  └──────────────┘  └──────────────┘  └──────────┬───────────┘   │   │
│   │                                                   │               │   │
│   └───────────────────────────────────────────────────┼───────────────┘   │
│                                                       │                   │
│                    ┌──────────────────────────────────┼────────────────┐  │
│                    │                                  │                │  │
│                    ▼                                  ▼                ▼  │
│           ┌──────────────┐                  ┌──────────────┐   ┌────────┐│
│           │ GitHub Pages │                  │   Netlify    │   │ Issues ││
│           │              │                  │              │   │ 状态   ││
│           │ 免费托管      │                  │ 全球 CDN     │   │ 同步   ││
│           │ 自定义域名    │                  │ 预览部署     │   │ 通知   ││
│           └──────────────┘                  └──────────────┘   └────────┘│
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 平台对比

| 平台 | 用途 | 触发条件 | 地址 |
|------|------|----------|------|
| **GitHub Pages** | 主站托管 | push to master | `https://mkafw.github.io/issueflow-blog` |
| **Netlify** | 备用 + 预览 | push to master | `https://issueflow-blog.netlify.app` |
| **GitHub Issues** | 内容源 + 状态 | Issue 关闭 | `https://github.com/mkafw/issueflow-blog/issues` |

## 1. GitHub Pages 部署

### Workflow: `.github/workflows/pages.yml`

```yaml
name: Build and Deploy to GitHub Pages

on:
  push:
    branches: [master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4 with: node-version: '22'
      - run: npm ci
      
      # 同步 Issues 到内容
      - run: node scripts/sync-issues.js ...
      
      # 生成页面
      - run: node scripts/generate-pages.js ...
      
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3 with: path: './out'

  deploy:
    needs: build
    environment: github-pages
    steps:
      - uses: actions/deploy-pages@v4
```

### 启用 GitHub Pages

1. 进入 GitHub 仓库 → Settings → Pages
2. Source: **Deploy from a branch**
3. Branch: `master`, Folder: `/` (root)
4. 保存

### 访问地址

```
https://mkafw.github.io/issueflow-blog
```

## 2. Netlify 部署

### Workflow: `.github/workflows/deploy.yml`

```yaml
name: Build and Deploy

on:
  push:
    branches: [master]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4 with: node-version: '22'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4 with: path: out/

  deploy:
    needs: build
    if: github.ref == 'refs/heads/master'
    steps:
      - uses: nwtgck/actions-netlify@v3
        with:
          publish-dir: './out'
          production-branch: master
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### netlify.toml 配置

```toml
[build]
  publish = "out"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "22"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 配置 Netlify Secrets

在 GitHub 仓库 Settings → Secrets and variables → Actions 添加：

| Secret | 说明 |
|--------|------|
| `NETLIFY_AUTH_TOKEN` | Netlify API Token |
| `NETLIFY_SITE_ID` | 站点 ID |

### 访问地址

```
https://issueflow-blog.netlify.app
```

## 3. Issues 同步到 Pages

### Workflow: `.github/workflows/issues-to-pages.yml`

**触发条件**：
- Issue 打开/编辑/关闭/标签变更
- 手动触发（workflow_dispatch）

```yaml
name: Issues to Pages

on:
  issues:
    types: [opened, edited, closed, labeled, unlabeled]
  workflow_dispatch:
    inputs:
      issue_number:
        description: 'Issue 编号（留空则处理所有开放 Issue）'
      force_sync:
        description: '强制同步所有 Issue'
        default: 'false'

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: node scripts/sync-issues.js ...
      - run: node scripts/generate-pages.js ...
      - run: |
          git add -A
          git commit -m "chore: sync issues to pages [skip ci]"
          git push
```

### 手动触发同步

```bash
# 同步所有 Issue
gh workflow run issues-to-pages.yml

# 同步特定 Issue
gh workflow run issues-to-pages.yml -f issue_number=1
```

### 飞书通知

部署成功后自动发送飞书卡片：

```
✅ Issueflow-Blog 部署成功

仓库: mkafw/issueflow-blog
提交: abc123...
作者: qiyu

[查看网站]  [查看提交]
```

需要配置 `FEISHU_WEBHOOK_URL` Secret。

## 三平台协同工作流

```
1. 用户在 GitHub Issues 创建 Issue（写作）
         ↓
2. 编写内容，设置标签（blog/tutorial/news）
         ↓
3. 关闭 Issue（完成写作）
         ↓
4. issues-to-pages.yml 触发
   ├── 读取 Issue 内容
   ├── 生成 Markdown 文件
   └── Commit & Push 到 master
         ↓
5. pages.yml 触发 → GitHub Pages 部署
6. deploy.yml 触发 → Netlify 部署
         ↓
7. 飞书通知 → 查看网站
```

## Secrets 配置清单

| Secret | 用途 | 平台 |
|--------|------|------|
| `NETLIFY_AUTH_TOKEN` | Netlify API 认证 | Netlify |
| `NETLIFY_SITE_ID` | Netlify 站点 ID | Netlify |
| `FEISHU_WEBHOOK_URL` | 飞书卡片通知 | 飞书 |

### 获取方式

```bash
# Netlify Token
# 访问: https://app.netlify.com/account/applications
# 生成 Personal Access Token

# Netlify Site ID
# 访问: https://app.netlify.com/sites/[site-name]/settings/general
# 复制 Site ID

# 飞书 Webhook
# 访问: https://open.feishu.cn/
# 创建机器人 → 添加 Webhook
```

## 验证部署

### 检查 Actions 运行

```bash
# 查看最近的运行
gh run list --limit 10

# 查看特定运行详情
gh run view <run-id>

# 查看日志
gh run view <run-id> --log
```

### 访问各平台

| 平台 | URL |
|------|-----|
| GitHub Pages | `https://mkafw.github.io/issueflow-blog` |
| Netlify | `https://issueflow-blog.netlify.app` |
| GitHub Issues | `https://github.com/mkafw/issueflow-blog/issues` |

## 常见问题

### GitHub Pages 未更新

1. 检查 `pages.yml` 是否成功运行
2. 确认 `master` 分支有新提交
3. 查看 GitHub Pages 设置 → 是否启用

### Netlify 部署失败

1. 检查 `NETLIFY_AUTH_TOKEN` 和 `NETLIFY_SITE_ID` 是否正确
2. 查看 Actions 日志：`gh run view <run-id> --log`
3. 确认 `npm run build` 成功

### Issues 未同步

1. 手动触发：`gh workflow run issues-to-pages.yml`
2. 检查 `scripts/sync-issues.js` 和 `scripts/generate-pages.js` 是否存在
3. 确认 Issue 有 `blog` 标签

---

## 下一步

- [故障排除](./troubleshooting) — 常见问题详细解答
