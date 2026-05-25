---
title: "Tailwind CLI"
description: "Tailwind CSS 命令行工具，用于编译和优化 CSS"
---

# Tailwind CLI

> Tailwind CSS 的官方命令行工具，用于编译、优化和生成生产级 CSS

---

## 📋 简介

**Tailwind CLI** 是 Tailwind CSS 的核心工具，让你无需配置 Webpack/Vite 即可快速编译 Tailwind CSS。

| 特性 | 说明 |
|------|------|
| 官方 | ✅ Tailwind Labs 官方维护 |
| 用途 | 编译 CSS、生成生产级样式 |
| 依赖 | `tailwindcss` npm 包 |
| 输出 | 优化后的 CSS 文件 |

---

## 🚀 快速开始

### 1. 安装

```bash
# 安装 Tailwind CSS
npm install -D tailwindcss postcss autoprefixer

# 初始化配置
npx tailwindcss init
```

### 2. 配置

编辑 `tailwind.config.js`：

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 3. 添加指令

在 CSS 文件中添加：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4. 编译

```bash
# 开发模式（监听文件变化）
npx tailwindcss -i ./src/input.css -o ./src/output.css --watch

# 生产模式（最小化）
npx tailwindcss -i ./src/input.css -o ./dist/output.css --minify
```

---

## 📝 命令参考

### 基本用法

```bash
npx tailwindcss [options]

# 必需参数
-i, --input    输入 CSS 文件
-o, --output   输出 CSS 文件

# 常用选项
--watch        监听文件变化
--minify       最小化输出
--verbose      详细输出
--help         显示帮助
```

### 开发模式

```bash
# 监听单个文件
npx tailwindcss -i ./src/input.css -o ./src/output.css --watch

# 监听整个目录
npx tailwindcss -i ./src/input.css -o ./src/output.css --watch --content './src/**/*.{html,js}'
```

### 生产模式

```bash
# 最小化输出
npx tailwindcss -i ./src/input.css -o ./dist/output.css --minify

# 带源映射（调试用）
npx tailwindcss -i ./src/input.css -o ./dist/output.css --minify --map
```

---

## 🎯 Issueflow-Blog 中的使用

### 与 Vite 集成

```bash
# 1. 创建 Vite + React 项目
npm create vite@latest my-app -- --template react-ts

# 2. 安装 Tailwind
cd my-app
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 3. 配置 tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

# 4. 添加 Tailwind 指令到 src/index.css
@tailwind base;
@tailwind components;
@tailwind utilities;

# 5. 运行开发服务器
npm run dev
```

### 自定义配置

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
      backdropBlur: {
        '2xl': '40px',
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

## ⚙️ 高级配置

### PostCSS 配置

创建 `postcss.config.js`：

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 自定义插件

```javascript
// tailwind.config.js
module.exports = {
  plugins: [
    function({ addUtilities, theme }) {
      const newUtilities = {
        '.text-gradient': {
          background: 'linear-gradient(135deg, #00D4FF, #7B2FF7)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        },
      }
      addUtilities(newUtilities, ['responsive', 'hover'])
    },
  ],
}
```

### JIT 模式（默认启用）

```javascript
// Tailwind CSS v3+ 默认启用 JIT
// 无需额外配置
```

---

## 📊 工作流程

```
┌─────────────────────────────────────────────────────────────────┐
│                    Tailwind 编译流程                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 编写 HTML/JSX                                               │
│     <div class="bg-glass text-accent">...</div>                 │
│     ↓                                                           │
│  2. Tailwind CLI 扫描 content 路径                               │
│     提取所有类名                                                 │
│     ↓                                                           │
│  3. 生成 CSS                                                     │
│     只生成实际使用的类                                           │
│     ↓                                                           │
│  4. 输出优化后的 CSS                                             │
│     开发: 未最小化（便于调试）                                    │
│     生产: 最小化（体积小）                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 与构建工具集成

### Vite

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
})
```

### Next.js

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig
```

Next.js 自动检测 `tailwind.config.js`，无需额外配置。

### Webpack

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
}
```

---

## 🐛 故障排除

| 问题 | 解决方案 |
|------|---------|
| 类名未生效 | 检查 `tailwind.config.js` 的 `content` 路径 |
| 样式未更新 | 确保 `--watch` 模式运行 |
| 生产构建失败 | 检查 `postcss.config.js` 配置 |
| 类名冲突 | 使用 `@apply` 或自定义前缀 |

---

## 🔗 相关链接

- **官方文档**: https://tailwindcss.com/docs/installation
- **GitHub**: https://github.com/tailwindlabs/tailwindcss
- **配置示例**: [tailwind.config.js](/tailwind.config.js)

---

> 📌 本文档由 Issueflow-Blog 自动生成
> 相关问题请在 GitHub Issues 中提出