---
title: "CLI 工具总览"
description: "所有 CLI 工具的快速参考和链接"
---

# CLI 工具总览

> Issueflow-Blog 生态系统中的所有 CLI 工具快速参考

---

## 📋 工具清单

| 工具 | 用途 | 安装命令 | 文档 |
|------|------|---------|------|
| **DigitalMe** | 手机/飞书远程控制 Claude Code | `go build` | [docs/cli/digitalme](/docs/cli/digitalme) |
| **Ralph** | 自主循环执行 Shell 脚本 | `npm i -g ralph` | [docs/cli/ralph](/docs/cli/ralph) |
| **gh** | GitHub 仓库/Issue/PR 管理 | `brew install gh` | [docs/cli/gh](/docs/cli/gh) |
| **vercel** | Vercel 部署和管理 | `npm i -g vercel` | [docs/cli/vercel](/docs/cli/vercel) |
| **netlify** | Netlify 部署和管理 | `npm i -g netlify-cli` | [docs/cli/netlify](/docs/cli/netlify) |

---

## 🚀 快速命令参考

### DigitalMe

```bash
# 启动服务器
digitalme serve

# 查看状态
digitalme status

# 测试连接
digitalme test --command "claude --version"
```

### Ralph

```bash
# 一次性执行
ralph run ./scripts/task.sh

# 循环执行（每 5 分钟）
ralph loop --interval 5m ./scripts/monitor.sh

# 后台守护进程
ralph daemon start ./scripts/worker.sh
```

### GitHub CLI

```bash
# 认证
gh auth login

# 创建 Issue
gh issue create --title "标题" --body "内容"

# 关闭 Issue
gh issue close 1

# 创建仓库
gh repo create my-blog --public --source=. --push
```

### Vercel CLI

```bash
# 认证
vercel login

# 关联项目
vercel link

# 部署
vercel --prod
```

### Netlify CLI

```bash
# 认证
netlify login

# 初始化
netlify init

# 部署
netlify deploy --prod
```

---

## 🔗 完整文档

| 文档 | 说明 |
|------|------|
| [DigitalMe](/docs/cli/digitalme) | 远程控制 Claude Code |
| [Ralph](/docs/cli/ralph) | 自主循环执行 |
| [GitHub CLI](/docs/cli/gh) | GitHub 操作 |
| [Vercel CLI](/docs/cli/vercel) | Vercel 部署 |
| [Netlify CLI](/docs/cli/netlify) | Netlify 部署 |

---

## 📊 工具关系图

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLI 工具生态系统                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   输入层                                                        │
│   ┌──────────────┐                                              │
│   │  DigitalMe   │ ← 手机/飞书远程控制                           │
│   └──────┬───────┘                                              │
│          │                                                      │
│          ▼                                                      │
│   执行层                                                        │
│   ┌──────────────┐     ┌──────────────┐                        │
│   │    Ralph     │ ←─→ │ Claude Code  │                        │
│   │  (自动化)    │     │   (AI 编程)   │                        │
│   └──────┬───────┘     └──────────────┘                        │
│          │                                                      │
│          ▼                                                      │
│   版本控制                                                      │
│   ┌──────────────┐                                              │
│   │    gh CLI    │ ← GitHub 操作                                │
│   └──────┬───────┘                                              │
│          │                                                      │
│          ▼                                                      │
│   部署层                                                        │
│   ┌──────────────┐     ┌──────────────┐                        │
│   │  Vercel CLI  │ ←─→ │ Netlify CLI  │                        │
│   └──────────────┘     └──────────────┘                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 💡 使用场景

### 场景 1：远程编程

```bash
# 手机访问 DigitalMe 服务器
# 发送命令到 Claude Code
# 查看执行结果
```

### 场景 2：自动化任务

```bash
# Ralph 循环执行脚本
ralph loop --interval 30m ./scripts/sync.sh

# 定时备份
ralph loop --interval 1h ./scripts/backup.sh
```

### 场景 3：博客发布

```bash
# 1. 写作
./scripts/write.sh

# 2. 创建 GitHub Issue
# (自动由 write.sh 完成)

# 3. 关闭 Issue 触发部署
gh issue close 1

# 4. GitHub Actions 自动同步到网站
# 5. Vercel/Netlify 自动部署
```

---

## 🔧 配置路径

| 工具 | 配置路径 |
|------|---------|
| DigitalMe | `~/.cc-connect/config.toml` |
| Ralph | `~/.config/ralph/config.yaml` |
| GitHub CLI | `~/.config/gh/` |
| Vercel CLI | `~/.config/vercel/` |
| Netlify CLI | `~/.netlify/` |

---

## 📚 相关文档

- [部署平台对比](/docs/deployment-platforms)
- [GitHub Actions 工作流](/.github/workflows/)
- [写作脚本](/scripts/write.sh)

---

> 📌 本文档由 Issueflow-Blog 自动生成
> 相关问题请在 GitHub Issues 中提出