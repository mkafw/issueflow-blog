---
title: "Vite (React CLI)"
description: "Vite 下一代前端构建工具，React 项目首选脚手架"
---

# Vite (React CLI)

> Vite 是下一代前端构建工具，提供极速的开发服务器和优化的生产构建

---

## 📋 简介

**Vite** 是由 Vue 作者 Evan You 开发的下一代前端构建工具，常被用作 React 项目的 CLI 脚手架。

| 特性 | 说明 |
|------|------|
| 作者 | Evan You (Vue 作者) |
| 核心 | 基于 ESM 的原生模块 |
| 速度 | ⚡ 极快（冷启动 < 100ms） |
| 用途 | React/Vue/Svelte 项目脚手架 |

---

## 🚀 快速开始

### 1. 创建项目

```bash
# 使用官方脚手架
npm create vite@latest

# 或使用 npx（无需全局安装）
npx create-vite@latest my-app --template react-ts
```

### 2. 选择模板

```
? Select a framework: » React
? Select a variant: » TypeScript + SWC
```

### 3. 安装依赖

```bash
cd my-app
npm install
```

### 4. 启动开发服务器

```bash
npm run dev

# 输出:
#   ➜  Local:   http://localhost:5173/
#   ➜  Network: use --host to expose
```

### 5. 生产构建

```bash
npm run build
npm run preview    # 预览生产构建
```

---

## 📝 命令参考

### 项目生命周期

```bash
# 创建新项目
npm create vite@latest <project-name> -- --template <template>

# 启动开发服务器
npm run dev

# 生产构建
npm run build

# 预览生产构建
npm run preview

# 类型检查
npm run type-check
```

### 可用模板

| 模板 | 命令 |
|------|------|
| React + JS | `--template react` |
| React + TS | `--template react-ts` |
| React + SWC | `--template react-swc` |
| Vue + JS | `--template vue` |
| Vue + TS | `--template vue-ts` |
| Vanilla JS | `--template vanilla` |
| Vanilla TS | `--template vanilla-ts` |

---

## 🎯 Issueflow-Blog 中的使用

### 创建 Fumadocs 项目

```bash
# 方式 A：使用 Fumadocs 官方脚手架
npx create-fumadocs-app@latest my-blog --yes --framework nextjs --app --tailwind --typescript

# 方式 B：使用 Vite + React
npx create-vite@latest my-blog --template react-ts
cd my-blog
npm install
```

### 与 Tailwind 集成

```bash
# 1. 创建 Vite 项目
npx create-vite@latest my-app --template react-ts
cd my-app

# 2. 安装 Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 3. 配置 tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: { extend: {} },
  plugins: [],
}

# 4. 添加 Tailwind 指令到 src/index.css
@tailwind base;
@tailwind components;
@tailwind utilities;

# 5. 启动
npm run dev
```

---

## ⚙️ 配置文件

### vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  // 服务器配置
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
  
  // 构建配置
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
  },
  
  // 别名
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## 📊 工作流程

```
┌─────────────────────────────────────────────────────────────────┐
│                    Vite 开发流程                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 启动开发服务器                                               │
│     npm run dev                                                  │
│     ↓                                                           │
│  2. HMR (热模块替换)                                              │
│     文件变化 → 只更新变化的模块                                    │
│     ↓                                                           │
│  3. 浏览器刷新/更新                                               │
│     保持状态，无需全量刷新                                         │
│     ↓                                                           │
│  4. 生产构建                                                     │
│     npm run build                                                │
│     ↓                                                           │
│  5. 代码分割 + 优化                                               │
│     按需加载，Tree Shaking                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 高级配置

### 环境变量

```typescript
// .env
VITE_API_URL=https://api.example.com

// .env.production
VITE_API_URL=https://api.example.com

// 访问
console.log(import.meta.env.VITE_API_URL)
```

### 插件系统

```bash
# 常用插件
npm i -D @vitejs/plugin-react
npm i -D @vitejs/plugin-react-swc    # 更快的 SWC 版本
npm i -D vite-plugin-pwa             # PWA 支持
npm i -D vite-plugin-compression     # Gzip 压缩
```

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
    }),
  ],
})
```

### 代理配置

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/ws': {
        target: 'ws://localhost:8080',
        ws: true,
      },
    },
  },
})
```

---

## 📈 性能对比

| 工具 | 冷启动 | HMR | 生产构建 |
|------|--------|-----|---------|
| **Vite** | ⚡ < 100ms | ⚡ 即时 | 🐢 中等 |
| Webpack | 🐌 1-5s | 🐢 500ms+ | 🐢 慢 |
| Create React App | 🐌 5-10s | 🐌 1s+ | 🐌 很慢 |

---

## 🐛 故障排除

| 问题 | 解决方案 |
|------|---------|
| 端口被占用 | `npm run dev -- --port 3001` |
| 模块未找到 | 检查 `tsconfig.json` 的 `paths` |
| HMR 不生效 | 确保使用 `react-jsx` |
| 构建失败 | 检查 `vite.config.ts` 配置 |

---

## 🔗 相关链接

- **官方文档**: https://vitejs.dev
- **GitHub**: https://github.com/vitejs/vite
- **模板列表**: https://github.com/vitejs/vite/tree/main/packages/create-vite

---

> 📌 本文档由 Issueflow-Blog 自动生成
> 相关问题请在 GitHub Issues 中提出