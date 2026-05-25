---
title: "Ralph CLI"
description: "自主循环执行 Shell 脚本的自动化 CLI 工具"
---

# Ralph CLI

> 自主循环执行 Shell 脚本的自动化 CLI 工具

## 📋 简介

**Ralph** 是一个用 Shell 编写的 CLI 工具，用于自主循环执行任务，减少 Claude 每次执行完都要请示确认的繁琐流程。

| 特性 | 说明 |
|------|------|
| 语言 | Bash Shell |
| 安装 | `~/.local/bin/ralph` |
| 模式 | 循环执行 / 一次性执行 |
| 用途 | 自动化脚本、定时任务、监控 |

## 🚀 快速开始

### 1. 安装

```bash
# 全局安装
curl -sSL https://github.com/yourusername/ralph/releases/latest/download/ralph.sh \
  | sudo bash -s -- --install

# 或使用脚本
git clone https://github.com/yourusername/ralph.git ~/.local/share/ralph
ln -s ~/.local/share/ralph/ralph.sh ~/.local/bin/ralph
```

### 2. 基本用法

```bash
# 一次性执行
ralph run ./scripts/my-task.sh

# 循环执行（每 5 分钟）
ralph loop --interval 5m ./scripts/monitor.sh

# 后台运行
ralph daemon ./scripts/worker.sh
```

## 📝 命令参考

### `run` - 一次性执行

```bash
ralph run <script> [args]

# 示例
ralph run ./scripts/build.sh --prod
```

### `loop` - 循环执行

```bash
ralph loop --interval <duration> <script>

# 示例（每 10 分钟执行一次）
ralph loop --interval 10m ./scripts/sync.sh
```

### `daemon` - 后台守护进程

```bash
ralph daemon start <script>
ralph daemon stop
ralph daemon status
```

### `watch` - 文件变更触发

```bash
ralph watch <directory> --on-change <script>

# 示例
ralph watch ./src --on-change ./scripts/build.sh
```

## ⚙️ 配置文件

创建 `~/.config/ralph/config.yaml`：

```yaml
# 默认配置
default:
  interval: 5m
  retries: 3
  timeout: 300s

# 任务定义
tasks:
  sync:
    script: ./scripts/sync.sh
    interval: 10m
    notify: true
  
  build:
    script: ./scripts/build.sh
    on_watch: ./src
    notify: on-error
```

## 🔔 通知配置

### 飞书通知

```yaml
notifications:
  lark:
    enabled: true
    webhook: "https://open.feishu.cn/open-apis/bot/v2/hook/xxx"
    on_success: false
    on_error: true
```

### 邮件通知

```yaml
notifications:
  email:
    enabled: true
    smtp_server: "smtp.example.com"
    smtp_port: 587
    recipient: "your@email.com"
```

## 📊 使用场景

| 场景 | 命令示例 |
|------|---------|
| 定时同步数据 | `ralph loop --interval 30m ./scripts/sync.sh` |
| 监控文件变更 | `ralph watch ./src --on-change ./scripts/build.sh` |
| 后台工作队列 | `ralph daemon start ./scripts/worker.sh` |
| 定时备份 | `ralph loop --interval 1h ./scripts/backup.sh` |

## 🐛 故障排除

| 问题 | 解决方案 |
|------|---------|
| 权限不足 | `chmod +x ~/.local/bin/ralph` |
| 脚本未找到 | 使用绝对路径：`ralph run /path/to/script.sh` |
| 循环未启动 | 检查日志：`ralph daemon logs` |

## 🔗 相关链接

- **GitHub**: https://github.com/yourusername/ralph
- **配置路径**: `~/.config/ralph/config.yaml`
- **日志路径**: `~/.local/share/ralph/logs/`

---

> 📌 本文档由 Issueflow-Blog 自动生成
> 相关问题请在 GitHub Issues 中提出