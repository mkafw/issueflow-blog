# 部署平台对比：GitHub Pages vs Netlify

> 为 Issueflow-Blog 选择最佳部署方案

---

## 📊 快速对比表

| 特性 | GitHub Pages | Netlify |
|------|-------------|---------|
| **免费套餐** | ✅ 完全免费 | ✅ generous |
| **构建速度** | 🐌 较慢 | ⚡ 快 |
| **自定义域名** | ✅ 免费 | ✅ 免费 |
| **自动 HTTPS** | ✅ 自动 | ✅ 自动 |
| **预览部署** | ❌ 无 | ✅ PR 预览 |
| **Serverless** | ❌ 静态 | ✅ 内置 |
| **表单处理** | ❌ 无 | ✅ 内置 |
| **GitHub 集成** | ⭐ 原生 | ✅ 优秀 |
| **配置复杂度** | 🟡 中等 | 🟢 简单 |
| **适合场景** | 简单静态站 | 中等复杂度 |

---

## 🎯 推荐选择

### 方案 A：Netlify ⭐（推荐）

**适合**：
- 需要快速构建和部署
- 需要 PR 预览部署
- 需要 Serverless 功能
- 需要内置表单处理
- 喜欢简洁的配置

**配置步骤**：

```bash
# 1. 安装 Netlify CLI
npm i -g netlify-cli

# 2. 登录
netlify login

# 3. 初始化（关联现有站点或创建新站点）
netlify init

# 4. 关联 GitHub 仓库
netlify link

# 5. 部署生产版本
netlify deploy --prod
```

**GitHub Actions 工作流**：`sync-netlify.yml`（已包含）

**需要配置 Secrets**：
```
NETLIFY_AUTH_TOKEN  # 从 https://app.netlify.com/user/applications
NETLIFY_SITE_ID     # 从项目设置获取
```

---

### 方案 B：GitHub Pages

**适合**：
- 完全免费，无服务限制
- 希望所有内容都在 GitHub 生态内
- 不需要 Serverless 功能
- 简单静态博客

**配置步骤**：

```bash
# 1. 启用 GitHub Pages
# 访问: https://github.com/用户名/仓库/settings/pages
# 选择: Deploy from a branch → main → / (root)

# 2. 确保 package.json 有 build 脚本
# "build": "next build"

# 3. 确保 next.config.js 配置了输出目录
# output: 'export'
```

**GitHub Actions 工作流**：`sync-github-pages.yml`（已包含）

**注意事项**：
- 需要配置 `next.config.js` 使用 `output: 'export'`
- 构建速度较慢（GitHub 服务器）
- 自定义域名需要 DNS 配置

---

## 🔧 配置文件示例

### next.config.ts（适配所有平台）

```typescript
import { createMDX } from 'fumadocs-mdx/next';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
};

export default createMDX({
  configPath: 'fumadocs.config.ts',
})(nextConfig);
```

**说明**：
- `output: 'export'` — 静态导出，适用于 GitHub Pages 和 Netlify
- `trailingSlash: true` — 添加斜杠，符合静态站点规范

---

## 📋 工作流选择指南

| 你的需求 | 推荐工作流 |
|----------|-----------|
| 最佳性能 + 简单配置 | `sync-netlify.yml` |
| 完全免费 + 原生集成 | `sync-github-pages.yml` |
| 不确定/想尝试 | 先选 Netlify，随时可切换 |

---

## 🔄 切换部署平台

### 从 Netlify 切换到 GitHub Pages

1. 在 GitHub 仓库设置中启用 Pages
2. 将工作流改为 `sync-github-pages.yml`
3. 推送代码

### 从 GitHub Pages 切换到 Netlify

1. 在 Netlify 创建新站点，关联 GitHub 仓库
2. 将工作流改为 `sync-netlify.yml`
3. 配置 Netlify Secrets
4. 推送代码

---

## 💡 最佳实践

### 1. 使用 Netlify 作为主部署

```
GitHub → Netlify (主站)
       → GitHub Pages (备份)
```

### 2. 多环境部署

```bash
# 开发环境
netlify dev

# 预览环境（PR）
netlify deploy --branch=main

# 生产环境
netlify deploy --prod
```

### 3. 自定义域名

| 平台 | 配置位置 |
|------|---------|
| Netlify | Domain management → Add domain |
| GitHub Pages | Settings → Pages → Custom domain |

---

## 🎉 推荐方案

对于 **Issueflow-Blog**，我推荐：

```
首选：Netlify
理由：
  ✅ 构建速度更快
  ✅ 配置简单
  ✅ 免费套餐足够用
  ✅ 与 GitHub 集成优秀
  ✅ 内置表单处理
  ✅ PR 预览部署

备选：GitHub Pages
理由：
  ✅ 完全免费
  ✅ 原生 GitHub 集成
  ✅ 无需额外配置
```

---

## 📚 相关文档

- [Netlify 文档](https://docs.netlify.com)
- [GitHub Pages 文档](https://docs.github.com/pages)
- [Next.js 静态导出](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
