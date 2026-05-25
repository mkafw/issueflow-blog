---
title: "前端工具总览"
description: "Tailwind CLI + Vite + Next.js 快速参考"
---

# 前端工具总览

> Tailwind CSS、Vite、Next.js 的完整参考和最佳实践

---

## 📋 工具清单

| 工具 | 用途 | 命令 | 文档 |
|------|------|------|------|
| **Vite** | React/Vue 项目脚手架 | `npm create vite@latest` | [docs/frontend/vite](/docs/frontend/vite) |
| **Tailwind CLI** | CSS 编译和优化 | `npx tailwindcss` | [docs/frontend/tailwind](/docs/frontend/tailwind) |
| **Next.js** | 全功能 React 框架 | `npx create-next-app@latest` | [docs/frontend/nextjs](/docs/frontend/nextjs) |

---

## 🚀 快速命令参考

### Vite (React CLI)

```bash
# 创建项目
npm create vite@latest my-app -- --template react-ts

# 启动开发服务器
npm run dev

# 生产构建
npm run build

# 预览构建
npm run preview
```

### Tailwind CLI

```bash
# 初始化
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 开发模式（监听）
npx tailwindcss -i ./src/input.css -o ./src/output.css --watch

# 生产模式（最小化）
npx tailwindcss -i ./src/input.css -o ./dist/output.css --minify
```

### Next.js

```bash
# 创建项目
npx create-next-app@latest my-app --typescript --tailwind --app

# 启动开发服务器
npm run dev

# 生产构建
npm run build

# 启动生产服务器
npm run start
```

---

## 📊 工具对比

| 特性 | Vite | Next.js |
|------|------|---------|
| **类型** | 构建工具 | 全功能框架 |
| **渲染** | 客户端渲染 (CSR) | 服务端渲染 (SSR/SSG) |
| **路由** | 需手动配置 (React Router) | 内置 App Router |
| **SEO** | 一般 | ⭐ 优秀 |
| **适合场景** | SPA、组件库 | 博客、电商、SSR 应用 |
| **构建速度** | ⚡ 极快 | 🐢 中等 |
| **学习曲线** | 🟢 简单 | 🟡 中等 |

---

## 🔗 完整文档

| 文档 | 说明 |
|------|------|
| [Vite 文档](/docs/frontend/vite) | Vite 项目脚手架、配置、插件 |
| [Tailwind 文档](/docs/frontend/tailwind) | Tailwind CLI 编译、配置、集成 |
| [Next.js 文档](/docs/frontend/nextjs) | Next.js App Router、SSG、部署 |

---

## 📝 使用场景

### 场景 1：创建 React + Tailwind 项目

```bash
# 方式 A：Vite + Tailwind
npx create-vite@latest my-app --template react-ts
cd my-app
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 方式 B：Next.js + Tailwind（推荐用于博客）
npx create-next-app@latest my-blog --typescript --tailwind --app
```

### 场景 2：Issueflow-Blog 项目

```bash
# 使用 Fumadocs（基于 Next.js）
npx create-fumadocs-app@latest my-blog \
  --yes \
  --framework nextjs \
  --app \
  --tailwind \
  --typescript

# 或手动创建
npx create-next-app@latest my-blog --typescript --tailwind --app
cd my-blog
npm install fumadocs-core fumadocs-ui fumadocs-mdx
```

### 场景 3：自定义 Tailwind 配置

```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{html,js,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'glass': 'rgba(255, 255, 255, 0.05)',
        'accent': '#00D4FF',
      },
      boxShadow: {
        'glass': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
}
```

---

## 📚 配置示例

### vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 3000 },
  build: { outDir: 'dist' },
  resolve: { alias: { '@': '/src' } },
})
```

### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // 静态导出（适用于 GitHub Pages）
  images: { unoptimized: true },
}

module.exports = nextConfig
```

### tailwind.config.js

```javascript
module.exports = {
  content: ["./src/**/*.{html,js,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
}
```

---

## 🎯 推荐组合

| 项目类型 | 推荐组合 |
|----------|---------|
| **博客/文档** | Next.js + Tailwind + Fumadocs |
| **SPA 应用** | Vite + React + Tailwind |
| **组件库** | Vite + React + TypeScript |
| **全栈应用** | Next.js + Tailwind + API Routes |

---

## 🔧 集成流程

```
┌─────────────────────────────────────────────────────────────────┐
│                    前端工具集成流程                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 选择框架                                                     │
│     Vite (SPA) 或 Next.js (SSR/SSG)                             │
│     ↓                                                           │
│  2. 创建项目                                                     │
│     npm create vite@latest 或 npx create-next-app@latest        │
│     ↓                                                           │
│  3. 安装 Tailwind                                                │
│     npm install -D tailwindcss postcss autoprefixer             │
│     ↓                                                           │
│  4. 配置                                                         │
│     tailwind.config.js + postcss.config.js                      │
│     ↓                                                           │
│  5. 开发                                                         │
│     npm run dev                                                  │
│     ↓                                                           │
│  6. 部署                                                         │
│     Vercel / Netlify / GitHub Pages                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🐛 常见问题

| 问题 | 解决方案 |
|------|---------|
| Tailwind 类名未生效 | 检查 `tailwind.config.js` 的 `content` 路径 |
| Vite 端口被占用 | `npm run dev -- --port 3001` |
| Next.js 构建失败 | 检查 `next.config.js` 配置 |
| HMR 不生效 | 确保使用正确的 JSX 配置 |

---

## 🔗 相关链接

- [Vite 官方文档](https://vitejs.dev)
- [Tailwind CSS 文档](https://tailwindcss.com)
- [Next.js 文档](https://nextjs.org)
- [Fumadocs 文档](https://fumadocs.vercel.app)

---

> 📌 本文档由 Issueflow-Blog 自动生成
> 相关问题请在 GitHub Issues 中提出