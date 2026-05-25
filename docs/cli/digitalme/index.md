---
title: "DigitalMe CLI"
description: "手机/飞书远程控制 Claude Code 的 Go 工具"
---

# DigitalMe CLI

> 手机/飞书远程控制 Claude Code 的 Go 工具

## 📋 简介

**DigitalMe** 是一个用 Go 编写的 CLI 工具，允许你通过手机或飞书远程控制 Claude Code，实现异地编程和自动化任务。

| 特性 | 说明 |
|------|------|
| 语言 | Go 1.22+ |
| 安装 | 全局安装 |
| 控制端 | 手机浏览器 / 飞书机器人 |
| 目标 | Claude Code CLI |

## 🚀 快速开始

### 1. 安装

```bash
# 克隆仓库
git clone https://github.com/yourusername/digitalme.git
cd digitalme

# 构建
go build -o digitalme

# 全局安装（可选）
sudo mv digitalme /usr/local/bin/
```

### 2. 配置

创建配置文件 `~/.cc-connect/config.toml`：

```toml
[server]
host = "0.0.0.0"
port = 8080

[claude]
path = "/usr/local/bin/claude"
workdir = "/home/qiyu/下载/"

[lark]
# 飞书凭证（从飞书开放平台获取）
app_id = "cli_a952e33923399bcf"
app_secret = "your-app-secret"
```

### 3. 启动

```bash
# 启动服务器
digitalme serve

# 输出:
# 🚀 DigitalMe 服务器已启动
# 📱 手机访问: http://服务器IP:8080
# 🤖 飞书机器人: 玄辉
```

## 📱 使用方式

### 方式 A：手机浏览器

1. 手机访问 `http://服务器IP:8080`
2. 输入 Claude Code 命令
3. 查看执行结果

### 方式 B：飞书机器人

1. 在飞书中 @玄辉
2. 发送命令，如：`claude 帮我分析这个文件`
3. 机器人返回执行结果

## 🔧 常用命令

```bash
# 启动服务器
digitalme serve

# 查看状态
digitalme status

# 测试连接
digitalme test --command "claude --version"

# 停止服务器
digitalme stop
```

## ⚙️ 高级配置

### 多工作目录

```toml
[[workspaces]]
name = "project-a"
path = "/home/qiyu/projects/project-a"

[[workspaces]]
name = "project-b"
path = "/home/qiyu/projects/project-b"
```

### 命令白名单

```toml
[security]
allowed_commands = [
  "claude",
  "git status",
  "git log",
  "npm run dev",
]
```

## 🐛 故障排除

| 问题 | 解决方案 |
|------|---------|
| 飞书凭证无效 | 检查 `config.toml` 中的 `app_id` 和 `app_secret` |
| Claude 未找到 | 确认 `claude` 在 PATH 中：`which claude` |
| 手机无法访问 | 检查防火墙：`sudo ufw allow 8080` |

## 🔗 相关链接

- **GitHub**: https://github.com/yourusername/digitalme
- **配置路径**: `~/.cc-connect/config.toml`
- **日志路径**: `~/.cc-connect/logs/`

---

> 📌 本文档由 Issueflow-Blog 自动生成
> 相关问题请在 GitHub Issues 中提出