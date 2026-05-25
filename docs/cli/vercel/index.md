---
title: "Vercel CLI"
description: "Vercel 官方命令行工具，用于部署和管理前端项目"
---

# Vercel CLI

> Vercel 官方命令行工具，用于部署和管理前端项目

## 📋 简介

**Vercel CLI** 让你无需打开浏览器即可部署项目到 Vercel，支持自动关联 GitHub 仓库和自动部署。

| 特性 | 说明 |
|------|------|
| 官方 | ✅ Vercel 官方维护 |
| 语言 | Node.js |
| 部署 | 一键部署 |
| 用途 | 前端项目、Next.js、静态网站 |

## 🚀 快速开始

### 1. 安装

```bash
# 全局安装
npm i -g vercel

# 或使用 npx（无需安装）
npx vercel
```

### 2. 认证

```bash
vercel login

# 支持:
# - Vercel 账号
# - GitHub
# - GitLab
# - Bitbucket
```

### 3. 关联项目

```bash
# 进入项目目录
cd my-blog

# 关联 Vercel 项目
vercel link

# 选择:
# ? Set up which directory? ./
# ? In which scope do you want to create the project? (个人/团队)
# ? Link to existing project? No
# ? What should we name your project? my-blog
# ? Which scope should contain your project? (选择 scope)
```

### 4. 部署

```bash
# 开发环境预览
vercel

# 生产环境部署
vercel --prod
```

## 📝 常用命令

### 部署

```bash
# 预览部署（开发）
vercel

# 生产部署
vercel --prod

# 指定分支
vercel --branch=main

# 强制重新部署
vercel --force
```

### 项目管理

```bash
# 列出项目
vercel list

# 查看项目
vercel inspect

# 删除项目
vercel rm my-blog
```

### 域名管理

```bash
# 添加域名
vercel domains add example.com

# 列出域名
vercel domains ls

# 移除域名
vercel domains rm example.com
```

### 环境变量

```bash
# 添加环境变量
vercel env add NODE_ENV

# 列出环境变量
vercel env ls

# 移除环境变量
vercel env rm NODE_ENV
```

### 日志

```bash
# 查看部署日志
vercel logs

# 查看特定部署
vercel logs abc123

# 实时日志
vercel logs --follow
```

## 🎯 Issueflow-Blog 中的使用

### 一键部署流程

```bash
# 1. 初始化项目
npx create-fumadocs-app@latest my-blog --yes

# 2. 关联 Vercel
vercel link

# 3. 首次部署
vercel --prod

# 4. 后续自动部署
# 每次 git push 到 main 分支自动触发
```

### GitHub 集成

```bash
# 关联 GitHub 仓库后，Vercel 会自动:
# - 监听 main 分支推送
# - 自动触发构建
# - 自动部署到生产环境

# 查看集成状态
vercel inspect --deep
```

### 自定义域名

```bash
# 添加自定义域名
vercel domains add blog.yourdomain.com

# Vercel 会自动配置:
# - DNS 记录（如果使用 Vercel DNS）
# - SSL 证书（自动 HTTPS）
```

## ⚙️ 高级配置

### vercel.json 配置

在项目根目录创建 `vercel.json`：

```json
{
  "version": 2,
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": "out",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "regions": ["hnd1"],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 环境变量（生产）

```bash
# 添加生产环境变量
vercel env add API_KEY prod

# 或从文件导入
vercel env pull .env.production
```

### 边缘函数

```bash
# 创建边缘函数
mkdir -p api
cat > api/hello.ts << EOF
export const config = { runtime: 'edge' };
export default async function handler() {
  return new Response('Hello from Edge!');
}
EOF
```

## 📊 部署流程

```
┌─────────────────────────────────────────────────────────────────┐
│                    Vercel 部署流程                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 本地开发                                                     │
│     npm run dev                                                  │
│     ↓                                                           │
│  2. 关联项目                                                     │
│     vercel link                                                  │
│     ↓                                                           │
│  3. 首次部署                                                     │
│     vercel --prod                                                │
│     ↓                                                           │
│  4. GitHub 集成                                                  │
│     自动监听 main 分支                                            │
│     ↓                                                           │
│  5. 自动部署                                                     │
│     git push → Vercel 构建 → 部署 ✅                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🔔 通知配置

### 部署通知

```bash
# 部署完成后获取 URL
vercel --prod --json | jq '.url'

# 发送到飞书
curl -X POST "$LARK_WEBHOOK" \
  -H "Content-Type: application/json" \
  -d "{\"text\": \"部署完成: https://$(vercel --prod --json | jq -r '.url')\"}"
```

## 🐛 故障排除

| 问题 | 解决方案 |
|------|---------|
| 认证失败 | `vercel logout && vercel login` |
| 构建失败 | 检查 `vercel.json` 配置 |
| 环境变量未生效 | `vercel env pull` 重新拉取 |
| 域名未解析 | 检查 DNS 配置，等待生效 |

## 🔗 相关链接

- **官方文档**: https://vercel.com/docs/cli
- **GitHub**: https://github.com/vercel/vercel
- **配置路径**: `~/.config/vercel/`

---

> 📌 本文档由 Issueflow-Blog 自动生成
> 相关问题请在 GitHub Issues 中提出