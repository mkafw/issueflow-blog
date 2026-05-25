---
title: "Fumadocs 配置"
description: "如何配置 Fumadocs 以集成 Tailwind + Vite/Next.js"
---

# Fumadocs 配置

> 将 Tailwind CSS 和 Vite/Next.js 集成到 Fumadocs 文档系统中

---

## 📋 简介

**Fumadocs** 是基于 Next.js 的现代化文档框架，完美支持 Tailwind CSS 和 MDX。

| 特性 | 说明 |
|------|------|
| 框架 | Next.js 14+ App Router |
| 样式 | Tailwind CSS |
| 内容 | MDX |
| 部署 | Vercel / Netlify / GitHub Pages |

---

## 🚀 快速开始

### 1. 创建 Fumadocs 项目

```bash
# 方式 A：官方脚手架（推荐）
npx create-fumadocs-app@latest my-docs --yes \
  --framework nextjs \
  --app \
  --tailwind \
  --typescript

# 方式 B：手动创建
npx create-next-app@latest my-docs --typescript --tailwind --app
cd my-docs
npm install fumadocs-core fumadocs-ui fumadocs-mdx
```

### 2. 项目结构

```
my-docs/
├── app/
│   ├── layout.tsx
│   └── page.tsx
├── content/
│   └── docs/
│       ├── getting-started.md
│       └── api-reference.md
├── public/
├── tailwind.config.js
├── next.config.js
└── package.json
```

---

## ⚙️ 核心配置

### fumadocs.config.ts

```typescript
import { defineConfig } from 'fumadocs-core/config';

export default defineConfig({
  docs: {
    title: 'My Docs',
    description: '基于 Fumadocs 的文档系统',
  },
  lastUpdate: new Date(),
});
```

### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{md,mdx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#00D4FF',
      },
    },
  },
  plugins: [],
}
```

### next.config.js

```javascript
const { createFumadocsConfig } = require('fumadocs-mdx/config');

/** @type {import('next').NextConfig} */
const nextConfig = createFumadocsConfig({
  mdxOptions: {
    // MDX 配置
  },
});

module.exports = nextConfig;
```

---

## 📝 内容格式

### Markdown 文件

```markdown
---
title: "页面标题"
description: "页面描述"
---

# 页面标题

这是页面内容。

## 子标题

更多内容...
```

### MDX 文件

```mdx
---
title: "交互式页面"
---

import { Card } from '@/components/card';

# 交互式页面

<Card title="示例">
  这是一个 MDX 组件。
</Card>
```

---

## 🎨 Tailwind 集成

### 全局样式

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .glass {
    @apply backdrop-blur-xl bg-white/5 border border-white/10;
  }
  
  .gradient-text {
    @apply bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent;
  }
}
```

### 自定义组件

```tsx
// components/glass-card.tsx
export function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="glass rounded-3xl p-6">
      {children}
    </div>
  );
}
```

---

## 🚀 部署

### Vercel（推荐）

```bash
vercel link
vercel --prod
```

### GitHub Pages

```bash
# 1. 配置 next.config.js
// next.config.js
module.exports = {
  output: 'export',
  images: { unoptimized: true },
}

# 2. 启用 GitHub Pages
# Settings → Pages → Deploy from branch (main)
```

### Netlify

```bash
netlify init
netlify deploy --prod
```

---

## 🔗 相关链接

- **Fumadocs 文档**: https://fumadocs.vercel.app
- **GitHub**: https://github.com/fuma-nama/fumadocs
- **Tailwind 文档**: https://tailwindcss.com
- **Next.js 文档**: https://nextjs.org

---

> 📌 本文档由 Issueflow-Blog 自动生成