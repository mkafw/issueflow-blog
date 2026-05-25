---
title: "Netlify CLI"
description: "Netlify 官方命令行工具，用于部署和管理静态网站"
---

# Netlify CLI

> Netlify 官方命令行工具，用于部署和管理静态网站

## 📋 简介

**Netlify CLI** 让你无需打开浏览器即可部署项目到 Netlify，支持本地预览、表单处理、Edge Functions 等功能。

| 特性 | 说明 |
|------|------|
| 官方 | ✅ Netlify 官方维护 |
| 语言 | Node.js |
| 部署 | 一键部署 |
| 用途 | 静态网站、JAMstack、表单处理 |

## 🚀 快速开始

### 1. 安装

```bash
# 全局安装
npm i -g netlify-cli

# 或使用 npx（无需安装）
npx netlify-cli
```

### 2. 认证

```bash
netlify login

# 支持:
# - Netlify 账号
# - GitHub
# - GitLab
# - Bitbucket
```

### 3. 初始化项目

```bash
# 进入项目目录
cd my-blog

# 初始化 Netlify
netlify init

# 选择:
# ? Choose a session: (已有账号)
# ? Team: (选择团队)
# ? Create & configure a new site: Yes
# ? Name your site: my-blog
# ? Set up your builds: Manual
# ? Build command: npm run build
# ? Publish directory: out
```

### 4. 部署

```bash
# 预览部署（开发）
netlify dev

# 生产部署
netlify deploy --prod
```

## 📝 常用命令

### 部署

```bash
# 预览部署
netlify dev

# 生产部署
netlify deploy --prod

# 草稿部署
netlify deploy --draft
```

### 项目管理

```bash
# 列出站点
netlify sites:list

# 查看站点
netlify open

# 删除站点
netlify sites:delete
```

### 表单处理

```bash
# 本地预览表单
netlify dev

# 查看表单提交
netlify forms:list
netlify forms:open
```

### Edge Functions

```bash
# 创建 Edge Function
netlify functions:create

# 本地测试
netlify dev

# 部署
netlify deploy --prod
```

## 🎯 Issueflow-Blog 中的使用

### 一键部署流程

```bash
# 1. 初始化项目
npx create-fumadocs-app@latest my-blog --yes

# 2. 初始化 Netlify
netlify init

# 3. 首次部署
netlify deploy --prod

# 4. GitHub 集成
netlify link
# 之后每次 git push 自动部署
```

### GitHub 集成

```bash
# 关联 GitHub 仓库
netlify link

# 选择:
# ? How would you like to link? Link to an existing site
# ? Site from GitHub: owner/my-blog

# 自动配置:
# - Webhook（自动部署）
# - 环境变量
# - 预部署钩子
```

### 自定义域名

```bash
# 添加自定义域名
netlify domains:add blog.yourdomain.com

# 查看域名状态
netlify domains:list
```

## ⚙️ 高级配置

### netlify.toml 配置

在项目根目录创建 `netlify.toml`：

```toml
[build]
  command = "npm run build"
  publish = "out"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/old-path"
  to = "/new-path"
  status = 301

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
```

### 表单处理

```html
<!-- 在 HTML 中添加表单 -->
<form name="contact" method="POST" data-netlify="true">
  <input type="text" name="name" required />
  <textarea name="message" required></textarea>
  <button type="submit">发送</button>
</form>
```

### Edge Functions

```typescript
// netlify/edge-functions/hello.ts
export default async (request: Request) => {
  return new Response('Hello from Edge!');
};

export const config = {
  path: '/hello'
};
```

## 📊 部署流程

```
┌─────────────────────────────────────────────────────────────────┐
│                    Netlify 部署流程                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 本地开发                                                     │
│     netlify dev                                                  │
│     ↓                                                           │
│  2. 关联项目                                                     │
│     netlify init                                                 │
│     ↓                                                           │
│  3. 首次部署                                                     │
│     netlify deploy --prod                                        │
│     ↓                                                           │
│  4. GitHub 集成                                                  │
│     netlify link                                                 │
│     ↓                                                           │
│  5. 自动部署                                                     │
│     git push → Netlify 构建 → 部署 ✅                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🔔 通知配置

### GitHub Actions 集成

```yaml
# .github/workflows/sync-netlify.yml
- name: Deploy to Netlify
  uses: nwtgck/actions-netlify@v3
  with:
    publish-dir: './out'
    production-branch: main
    github-token: ${{ secrets.GITHUB_TOKEN }}
    deploy-message: "Deploy from Issue #${{ steps.issue-meta.outputs.issue_number }}"
  env:
    NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
    NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### 需要配置 Secrets

```
NETLIFY_AUTH_TOKEN  # 从 https://app.netlify.com/user/applications
NETLIFY_SITE_ID     # 从项目设置获取
```

## 🐛 故障排除

| 问题 | 解决方案 |
|------|---------|
| 认证失败 | `netlify logout && netlify login` |
| 构建失败 | 检查 `netlify.toml` 配置 |
| 表单未生效 | 确认表单有 `data-netlify="true"` |
| 域名未解析 | 检查 DNS 配置 |

## 🔗 相关链接

- **官方文档**: https://docs.netlify.com/cli/get-started/
- **GitHub**: https://github.com/netlify/cli
- **配置路径**: `~/.netlify/`

---

> 📌 本文档由 Issueflow-Blog 自动生成
> 相关问题请在 GitHub Issues 中提出