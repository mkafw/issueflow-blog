---
title: "示例文章：如何使用 Issueflow-Blog"
description: "Synced from GitHub Issue #1"
date: 2026-05-23
source: "https://github.com/example/issueflow-blog/issues/1"
draft: false
---

# 示例文章：如何使用 Issueflow-Blog

> 写作时间: 2026-05-23 12:00:00

## 什么是 Issueflow-Blog？

Issueflow-Blog 是一个基于 **GitHub Issues + Vim + Fumadocs** 的自动化博客系统。

### 核心设计理念

```
输入端 (本地)              展示端 (云端)
┌──────────────┐          ┌──────────────┐
│   Vim 脚本   │ ───────> │  Fumadocs    │
│  写作 + 提交 │          │   网站       │
└──────────────┘          └──────────────┘
       │                         ▲
       ▼                         │
┌──────────────┐          ┌──────────────┐
│ GitHub Issues│ ───────> │ GitHub Actions│
│  (数据源)    │  关闭时   │  自动同步     │
└──────────────┘          └──────────────┘
```

## 为什么选择这个方案？

1. **输入/展示解耦**：写作和发布完全分离
2. **零配置写作**：本地 Vim 写作，无需打开浏览器
3. **自动发布**：关闭 Issue 即发布
4. **版本控制**：所有内容都在 Git 中

## 快速开始

### 1. 安装 GitHub CLI

```bash
brew install gh  # macOS
gh auth login    # 认证
```

### 2. 初始化项目

```bash
npx create-fumadocs-app@latest my-blog --yes --framework nextjs --app --tailwind --typescript
```

### 3. 开始写作

```bash
./scripts/write.sh
```

### 4. 发布

在 GitHub 上关闭 Issue，网站自动更新。

---

> 📌 本文源自 GitHub Issue #1
> 关闭时间: 2026-05-23
> [查看原始 Issue](https://github.com/example/issueflow-blog/issues/1)