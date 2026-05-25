# Issueflow-Blog

基于 GitHub Issues + Vim + Fumadocs 的自动化博客系统。

## 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| **写作端** | Vim + Bash + gh CLI | 本地 Markdown 写作，gh 上传 GitHub |
| **存储端** | GitHub Issues | Open/Closed 管理生命周期 |
| **自动化** | GitHub Actions + MDX (Rust) + SWC (Rust) | CI/CD 自动化，Rust 闪电转译 |
| **展示端** | Next.js 15 + React 19 + Fumadocs + Tailwind v4 + Vercel | 静态生成，玻璃质感暗系设计 |

## 快速开始

```bash
# 克隆仓库
git clone https://github.com/mkafw/issueflow-blog.git
cd issueflow-blog

# 安装依赖
npm install

# 本地开发
npm run dev

# 构建生产版本
npm run build
```

## 项目结构

```
issueflow-blog/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 首页
│   ├── blog/               # 博客列表页
│   └── posts/              # 文章详情页
├── content/                # MDX 内容源
├── lib/                    # 工具函数
├── styles/                 # Tailwind 样式
└── scripts/                # 自动化脚本
```

## 自动化流程

```
Vim 写作 → gh CLI 上传 → GitHub Issues 管理 → 
GitHub Actions 构建 → Netlify 部署 → 网站发布
```

## 部署

### Netlify

1. 在 Netlify 创建新站点，关联 GitHub 仓库
2. 配置环境变量：
   - `GITHUB_TOKEN`: GitHub Personal Access Token
   - `NETLIFY_AUTH_TOKEN`: Netlify API Token
3. 自动部署：推送 `master` 分支自动触发

### Vercel

1. 在 Vercel 导入 GitHub 仓库
2. 自动检测 Next.js 并配置构建命令
3. 推送即部署

## License

MIT
