# Issueflow-Blog 项目规范

## 技术栈

- **Next.js 15** — App Router, 静态导出 (`output: 'export'`)
- **React 19** — 由 Next.js 自动管理 peer dependencies
- **Fumadocs 15** — MDX 文档框架
- **Tailwind CSS v4** — 样式框架
- **TypeScript 5** — 类型系统

## 代码规范

### TypeScript

```typescript
// 使用严格模式
// 优先使用 interface 定义组件 props
// 避免 any 类型
```

### 组件结构

```typescript
// app/ 目录使用 Next.js App Router
// 每个页面文件: page.tsx
// 布局文件: layout.tsx
// 组件放在 components/ 目录
```

### 样式

```css
/* 使用 Tailwind CSS 工具类 */
/* 自定义样式放在 globals.css */
```

## 项目结构

```
Issueflow-Blog/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── content/docs/           # 博客文章（MDX）
├── .github/workflows/      # GitHub Actions
├── scripts/                # CLI 脚本
├── docs/                   # 项目文档
├── .ralph/                 # Ralph 配置
│   ├── PROMPT.md           # 任务指令
│   ├── AGENT.md            # Agent 配置
│   └── .ralphrc            # Ralph 配置
├── next.config.ts          # Next.js 配置
├── fumadocs.config.ts      # Fumadocs 配置
└── package.json            # 依赖
```

## 构建验证

每次修改后运行：
```bash
npm run build
```

## 部署

- **Netlify** — 主部署平台
- **GitHub Pages** — 备选方案

GitHub Secrets 需要配置：
- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_SITE_ID`
