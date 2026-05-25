# Issueflow-Blog

> **GitHub Issues + Vim + Fumadocs** 的自动化博客系统

## 🎯 设计理念

```
┌─────────────────────────────────────────────────────────────────┐
│                    输入/展示端完全解耦                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   输入端 (本地)              展示端 (云端)                        │
│   ┌──────────────┐          ┌──────────────┐                   │
│   │   Vim 脚本   │ ───────> │  Fumadocs    │                   │
│   │  写作 + 提交 │          │   网站       │                   │
│   └──────────────┘          └──────────────┘                   │
│          │                         ▲                            │
│          ▼                         │                            │
│   ┌──────────────┐          ┌──────────────┐                   │
│   │ GitHub Issues│ ───────> │ GitHub Actions│                  │
│   │  (数据源)    │  关闭时   │  自动同步     │                   │
│   └──────────────┘          └──────────────┘                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## ✨ 特性

| 特性 | 说明 |
|------|------|
| 📝 **Vim 写作** | 本地终端写作，熟悉 Vim 的用户零学习成本 |
| 🏷️ **标签管理** | 交互式标签选择，自动分类 |
| 🔄 **自动同步** | 关闭 Issue 自动发布到网站 |
| 🎨 **Fumadocs** | 现代化文档框架，支持 MDX、搜索、暗黑模式 |
| 🚀 **Vercel 部署** | 一键部署，自动增量构建 |

## 🚀 快速开始

### 1. 安装依赖

```bash
# GitHub CLI
brew install gh  # macOS
sudo apt install gh  # Ubuntu

# 认证
gh auth login
```

### 2. 初始化项目

```bash
# 方式 A：使用脚手架（推荐）
npx create-fumadocs-app@latest my-blog --yes --framework nextjs --app --tailwind --typescript

# 方式 B：克隆本仓库
git clone https://github.com/yourusername/Issueflow-Blog.git
cd Issueflow-Blog
```

### 4. 添加 GitHub Actions

确保 `.github/workflows/` 中有工作流文件：

| 平台 | 文件 | 选择建议 |
|------|------|---------|
| Vercel | `sync.yml` | ⭐ 推荐 |
| GitHub Pages | `sync-github-pages.yml` | 完全免费 |
| Netlify | `sync-netlify.yml` | 需要表单处理 |

### 5. 部署到平台

#### Vercel（推荐）
```bash
npm i -g vercel
vercel login
vercel link
vercel --prod
```

#### GitHub Pages
1. Settings → Pages → Deploy from branch (main)
2. 配置 `next.config.js`: `output: 'export'`

#### Netlify
```bash
npm i -g netlify-cli
netlify login
netlify init
```

详见 [docs/DEPLOYMENT_PLATFORMS.md](./docs/DEPLOYMENT_PLATFORMS.md)

## 📝 写作流程

```bash
# 1. 运行写作脚本
chmod +x scripts/write.sh
./scripts/write.sh

# 2. 在 Vim 中写作
# :wq 保存退出

# 3. 脚本自动创建 GitHub Issue

# 4. 在 GitHub 上关闭 Issue
gh issue close 1

# 5. 自动发布到网站 ✅
```

## 📁 项目结构

```
Issueflow-Blog/
├── README.md                    # 项目说明
├── .github/
│   └── workflows/
│       ├── sync.yml             # Vercel 工作流 ⭐
│       ├── sync-github-pages.yml # GitHub Pages 工作流
│       └── sync-netlify.yml     # Netlify 工作流
├── scripts/
│   ├── write.sh                 # Vim 写作脚本
│   └── init-fumadocs.sh         # 初始化脚本
├── content/
│   └── docs/                    # 博客文章
├── docs/
│   ├── DEPLOYMENT.md            # 部署指南
│   └── DEPLOYMENT_PLATFORMS.md  # 平台对比
├── app/                         # Next.js App Router
├── public/
├── package.json
└── tsconfig.json
```

## 🔧 技术栈

| 组件 | 技术 |
|------|------|
| 本地端 | Bash Shell, Vim, GitHub CLI |
| 云端存储 | GitHub Issues |
| 自动化 | GitHub Actions |
| 前端框架 | Fumadocs (Next.js 14+ App Router) |
| 样式 | Tailwind CSS |
| 托管 | Vercel |

## 📚 文档

- [部署指南](./docs/DEPLOYMENT.md)
- [Fumadocs 文档](https://fumadocs.vercel.app)
- [GitHub CLI 文档](https://cli.github.com/manual)

## 📄 许可证

MIT