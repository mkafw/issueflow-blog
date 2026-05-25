---
title: "GitHub CLI (gh)"
description: "GitHub 官方命令行工具，用于仓库、Issue、PR 管理"
---

# GitHub CLI (gh)

> GitHub 官方命令行工具，用于仓库、Issue、PR 管理

## 📋 简介

**gh** 是 GitHub 官方提供的命令行工具，让你无需打开浏览器即可完成大部分 GitHub 操作。

| 特性 | 说明 |
|------|------|
| 官方 | ✅ GitHub 官方维护 |
| 语言 | Go |
| 认证 | OAuth / PAT |
| 用途 | 仓库、Issue、PR、Actions |

## 🚀 快速开始

### 1. 安装

```bash
# macOS
brew install gh

# Ubuntu/Debian
sudo apt install gh

# Windows
winget install GitHub.cli
```

### 2. 认证

```bash
# 交互式认证
gh auth login

# 选择:
# ? What account do you want to log into? GitHub.com
# ? What is your preferred protocol for Git operations? HTTPS
# ? Authenticate Git with your GitHub credentials? Yes
# ? How would you like to authenticate GitHub CLI? Login with a web browser
```

### 3. 验证

```bash
gh auth status
```

## 📝 常用命令

### 仓库管理

```bash
# 创建仓库
gh repo create my-blog --public --source=. --push

# 克隆仓库
gh repo clone owner/repo

# 查看仓库
gh repo view

# 列出仓库
gh repo list --limit 20
```

### Issue 管理

```bash
# 创建 Issue
gh issue create --title "标题" --body "内容"

# 创建 Issue（从文件）
gh issue create --title "标题" --body-file draft.md

# 列出 Issue
gh issue list --state open

# 关闭 Issue
gh issue close 1

# 查看 Issue
gh issue view 1

# 添加标签
gh issue edit 1 --add-label "bug,help wanted"
```

### PR 管理

```bash
# 创建 PR
gh pr create --title "标题" --body "内容"

# 列出 PR
gh pr list

# 查看 PR
gh pr view 1

# 合并 PR
gh pr merge 1 --squash
```

### Actions

```bash
# 列出工作流
gh action list

# 查看运行
gh run list

# 查看日志
gh run view 12345 --log
```

## 🎯 Issueflow-Blog 中的使用

### 写作脚本中的使用

```bash
# scripts/write.sh 中的关键命令

# 检查认证
gh auth status

# 创建 Issue
gh issue create \
  --title "$TITLE" \
  --body-file "$TEMP_FILE" \
  -l "react,tailwind" \
  --json url \
  --jq '.url'
```

### 批量操作

```bash
# 获取所有已关闭的 Issue
gh issue list --state closed --limit 100 \
  --json number,title,body,url \
  --jq '.[] | "\(.number)\t\(.title)"'

# 批量关闭 Issue
for id in 1 2 3; do
  gh issue close $id
done
```

## ⚙️ 高级配置

### 设置默认编辑器

```bash
gh config set editor vim
gh config set git_protocol https
```

### 自定义别名

```bash
# ~/.config/gh/aliases.yml
aliases:
  co: pr checkout
  my: pr create --fill
  ll: issue list
```

### 使用 PAT（个人访问令牌）

```bash
# 创建 PAT
gh auth login --with-token < token.txt

# 或使用环境变量
export GH_TOKEN=your-pat-token
gh repo list
```

## 🔐 安全最佳实践

| 建议 | 说明 |
|------|------|
| 使用 PAT | 为 CLI 创建专用 PAT，限制权限 |
| 定期轮换 | 每 90 天更换一次 PAT |
| 最小权限 | 只授予必要的 scope |
| 检查权限 | `gh auth refresh -s repo,workflow` |

## 🐛 故障排除

| 问题 | 解决方案 |
|------|---------|
| 认证失败 | `gh auth logout && gh auth login` |
| Token 过期 | `gh auth refresh` |
| 权限不足 | 检查 PAT 的 scope |
| Git 协议错误 | `gh config set git_protocol https` |

## 🔗 相关链接

- **官方文档**: https://cli.github.com/manual
- **GitHub**: https://github.com/cli/cli
- **配置路径**: `~/.config/gh/`

---

> 📌 本文档由 Issueflow-Blog 自动生成
> 相关问题请在 GitHub Issues 中提出