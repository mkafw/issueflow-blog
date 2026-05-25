---
title: "架构设计"
description: "Issueflow-Blog 系统架构详解"
date: 2026-05-23
draft: false
---

# 架构设计

## 核心设计理念

**输入/输出解耦** — 写作和发布完全分离，互不干扰。

```
┌─────────────────────────────────────────────────────────────────┐
│                    输入/输出解耦架构                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   输入端 (本地)                输出端 (云端)                      │
│   ┌──────────────┐            ┌──────────────┐                 │
│   │   Vim/Bash   │ ────────>  │ Fumadocs/    │                 │
│   │  写作脚本     │            │ Next.js Site │                 │
│   └──────────────┘            └──────────────┘                 │
│          │                           ▲                          │
│          ▼                           │                          │
│   ┌──────────────┐            ┌──────────────┐                 │
│   │ GitHub Issues│ ────────>  │ GitHub       │                 │
│   │ (数据源)     │  关闭时触发 │ Actions      │                 │
│   └──────────────┘            └──────────────┘                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 技术栈分层

| 层级 | 技术 | 职责 |
|------|------|------|
| **输入层** | Vim + Bash | 本地写作环境 |
| **传输层** | GitHub CLI (`gh`) | Issue 创建/管理 |
| **存储层** | GitHub Issues | 内容存储 + 状态管理 |
| **自动化层** | GitHub Actions | 触发同步、构建部署 |
| **渲染层** | Next.js 15 + Fumadocs | 静态站点生成 |
| **部署层** | Vercel / GitHub Pages | 全球 CDN 分发 |

## 数据流

```
1. 用户在 Vim 中写作 → 保存文件
2. 运行写作脚本 → 创建 GitHub Issue (Open 状态)
3. 用户审查内容 → 在 GitHub 上关闭 Issue
4. GitHub Actions 触发 → 读取 Issue 内容
5. 生成 Markdown 文件 → 提交到 content/docs/
6. Git push → 触发 Next.js 构建
7. Vercel 自动部署 → 网站更新
```

## 文件结构

```
issueflow-blog/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 首页
│   └── docs/               # 文档路由
│       └── [[...slug]]/    # 动态路由
├── content/                # 文档内容
│   └── docs/               # Markdown 文件
│       ├── index.md        # 首页
│       ├── quick-start.md  # 快速开始
│       └── *.md            # 自动同步的文章
├── .github/
│   └── workflows/          # GitHub Actions
│       ├── sync.yml        # Issue 同步
│       └── deploy.yml      # 部署流程
├── lib/                    # 工具函数
├── public/                 # 静态资源
├── next.config.ts          # Next.js 配置
├── fumadocs.config.ts      # Fumadocs 配置
└── package.json
```

## 关键组件

### 1. GitHub Actions Workflow

```yaml
# .github/workflows/sync.yml
on:
  issues:
    types: [closed]  # 仅在 Issue 关闭时触发

permissions:
  contents: write    # 写入仓库内容
  issues: read       # 读取 Issue 信息
```

### 2. Fumadocs 配置

```typescript
// fumadocs.config.ts
export default defineConfig({
  docs: {
    title: 'My Blog',
    description: 'Automated blog powered by GitHub Issues',
  },
  source: loader({
    baseUrl: '/docs',
    rootDir: 'content',
    source: createMDXSource(),
  }),
});
```

### 3. Frontmatter 模板

每个 Markdown 文件必须包含：

```yaml
---
title: "文章标题"
description: "文章描述"
date: 2026-05-23
source: "https://github.com/.../issues/1"
draft: false
---
```

---

## 下一步

- [写作流程](./writing-workflow) — 使用 Vim 脚本高效写作
- [部署指南](./deployment) — 多平台部署选项
