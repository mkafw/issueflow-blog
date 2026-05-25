# Issueflow-Blog 项目总览

> 基于 GitHub Issues + Vim + Fumadocs 的自动化博客系统

---

## 📁 已创建的文件

```
/home/qiyu/下载/Issueflow-Blog/
├── README.md                          # 项目说明
├── package.json                       # Node.js 依赖配置
├── fumadocs.config.ts                 # Fumadocs 配置
├── .github/
│   └── workflows/
│       └── sync.yml                   # GitHub Actions 工作流
├── scripts/
│   ├── write.sh                       # Vim 写作脚本 ⭐
│   └── init-fumadocs.sh               # 项目初始化脚本
├── content/
│   └── docs/
│       └── 2026-05-23-example-article.md  # 示例文章
└── docs/
    └── DEPLOYMENT.md                  # 部署指南
```

---

## 🎯 任务完成情况

### 任务 A：本地 Vim 写作脚本 ✅

**文件**: `scripts/write.sh`

**功能**：
1. ✅ 交互式输入文章标题
2. ✅ 标签选择（支持单选、多选、范围选择）
3. ✅ 创建本地临时 Markdown 文件
4. ✅ 自动唤起 Vim 编辑器
5. ✅ 检查草稿是否为空
6. ✅ 使用 `gh issue create` 推送到 GitHub Issues
7. ✅ 自动清理临时文件

**使用示例**：
```bash
chmod +x scripts/write.sh
./scripts/write.sh
```

---

### 任务 B：GitHub Actions 自动化工作流 ✅

**文件**: `.github/workflows/`

| 工作流 | 部署平台 | 说明 |
|--------|---------|------|
| `sync.yml` | **Vercel** ⭐ | 推荐，最快最简单 |
| `sync-github-pages.yml` | **GitHub Pages** | 完全免费，原生集成 |
| `sync-netlify.yml` | **Netlify** | 表单处理，Edge Functions |

**功能**（所有工作流通用）：
1. ✅ 监听 `issues.closed` 事件
2. ✅ 读取 Issue 标题、正文、编号
3. ✅ 自动生成合规文件名（小写 + 连字符 + 日期前缀）
4. ✅ 注入 Fumadocs Frontmatter 元数据
5. ✅ 自动 Commit & Push 到 main 分支
6. ✅ 在 Issue 上添加评论通知

**Frontmatter 示例**：
```yaml
---
title: "Issue 的原始标题"
description: "Synced from GitHub Issue #1"
date: 2026-05-23
source: "https://github.com/.../issues/1"
draft: false
---
```

---

### 任务 C：避坑指南 ✅

**文件**: `docs/DEPLOYMENT.md`

**核心要点**：

#### 1. 安装并认证 gh CLI

```bash
# 安装
brew install gh          # macOS
sudo apt install gh      # Ubuntu

# 认证
gh auth login
# 选择: GitHub.com → HTTPS → Login with web browser
```

#### 2. 初始化 Fumadocs 项目

```bash
# 方式 A：官方脚手架（推荐）
npx create-fumadocs-app@latest my-blog --yes --framework nextjs --app --tailwind --typescript

# 方式 B：使用项目初始化脚本
./scripts/init-fumadocs.sh my-blog
```

#### 3. 创建 GitHub 仓库

```bash
gh repo create my-blog --public --source=. --push
```

#### 4. 连接 Vercel

```bash
npm i -g vercel
vercel login
vercel link
vercel --prod
```

---

## 🔄 完整工作流

```
┌─────────────────────────────────────────────────────────────────┐
│                    Issueflow-Blog 工作流                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 本地写作                                                     │
│     ./scripts/write.sh                                          │
│     ↓                                                           │
│     Vim 编辑器写作                                               │
│     ↓                                                           │
│     :wq 保存退出                                                 │
│                                                                 │
│  2. 创建 GitHub Issue                                            │
│     gh issue create --title "..." --body-file draft.md          │
│     ↓                                                           │
│     Issue 状态: OPEN                                            │
│                                                                 │
│  3. 发布文章                                                     │
│     在 GitHub 上关闭 Issue                                       │
│     或: gh issue close 1                                        │
│     ↓                                                           │
│                                                                 │
│  4. GitHub Actions 自动同步                                      │
│     触发: issues.closed                                         │
│     ↓                                                           │
│     读取 Issue 内容                                               │
│     ↓                                                           │
│     生成 content/docs/2026-05-23-xxx.md                          │
│     ↓                                                           │
│     git commit & push                                           │
│                                                                 │
│  5. Vercel 自动部署                                              │
│     检测到 main 分支更新                                         │
│     ↓                                                           │
│     自动构建 & 部署                                              │
│     ↓                                                           │
│     网站上线 ✅                                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎨 技术架构

| 层级 | 技术 | 说明 |
|------|------|------|
| **输入端** | Vim + Bash | 本地终端写作 |
| **传输层** | GitHub CLI | `gh issue create/close` |
| **存储层** | GitHub Issues | 数据源 + 看板 |
| **自动化** | GitHub Actions | 监听 + 同步 |
| **渲染层** | Fumadocs | Next.js + Tailwind + MDX |
| **托管层** | Vercel | 自动部署 |

---

## ⚠️ 注意事项

### GitHub Actions 权限

确保仓库有以下权限：

```yaml
permissions:
  contents: write    # 写入内容到仓库
  issues: read       # 读取 Issue 内容
```

### 文件命名规则

- 全小写
- 空格转连字符 `-`
- 移除特殊字符
- 添加日期前缀确保排序

### Frontmatter 要求

Fumadocs 需要以下字段：

```yaml
---
title: "文章标题"
description: "文章描述"
---
```

---

## 🔗 相关链接

- **Fumadocs 文档**: https://fumadocs.vercel.app
- **GitHub CLI**: https://cli.github.com
- **Next.js**: https://nextjs.org
- **Vercel**: https://vercel.com
- **GitHub Actions**: https://docs.github.com/actions

---

## 📝 下一步

1. **测试工作流**：
   ```bash
   # 在本地测试写作脚本
   ./scripts/write.sh
   
   # 手动关闭 Issue 测试同步
   gh issue close 1
   ```

2. **自定义配置**：
   - 编辑 `scripts/write.sh` 修改标签
   - 编辑 `.github/workflows/sync.yml` 修改同步逻辑
   - 编辑 `fumadocs.config.ts` 修改网站配置

3. **部署到生产**：
   ```bash
   gh repo create my-blog --public --source=. --push
   vercel --prod
   ```

---

**享受你的自动化博客系统！🎉**