# Issueflow-Blog 部署指南

> 基于 GitHub Issues + Vim + Fumadocs 的自动化博客系统

---

## 🚀 快速开始（5 分钟）

### 第 1 步：安装 GitHub CLI

```bash
# macOS
brew install gh

# Ubuntu/Debian
sudo apt install gh

# 认证登录
gh auth login
```

**认证流程：**
1. 选择 `GitHub.com`
2. 选择 `HTTPS`
3. 选择 `Login with a web browser`
4. 复制代码，在浏览器中完成认证

---

### 第 2 步：初始化 Fumadocs 项目

```bash
# 方式 A：使用初始化脚本（推荐）
cd /path/to/your/workspace
git clone https://github.com/mdx-js/fumadocs.git issueflow-blog
cd issueflow-blog
chmod +x scripts/*.sh
./scripts/init-fumadocs.sh my-blog

# 方式 B：手动创建
npx create-fumadocs-app@latest my-blog --yes --framework nextjs --app --tailwind --typescript
cd my-blog
mkdir -p content/docs .github/workflows
```

---

### 第 3 步：创建 GitHub 仓库

```bash
# 在项目目录执行
gh repo create my-blog --public --source=. --push --description "Issueflow-Blog: 基于 GitHub Issues 的自动化博客"
```

---

### 第 4 步：添加 GitHub Actions 工作流

确保 `.github/workflows/sync.yml` 文件已存在（项目已包含）。

---

### 第 5 步：配置 Netlify 部署

**Netlify 工作流文件**：`sync-netlify.yml`（已包含）

```bash
# 1. 安装 Netlify CLI
npm i -g netlify-cli

# 2. 登录 Netlify
netlify login

# 3. 初始化项目（关联现有站点或创建新站点）
netlify init

# 4. 关联 GitHub 仓库
netlify link

# 5. 部署生产版本
netlify deploy --prod
```

#### 配置 GitHub Secrets

在 GitHub 仓库中添加以下 Secrets（Settings → Secrets and variables → Actions）：

| Secret 名称 | 获取方式 |
|------------|---------|
| `NETLIFY_AUTH_TOKEN` | https://app.netlify.com/user/applications |
| `NETLIFY_SITE_ID` | Netlify 站点设置页面 |

详见 [docs/DEPLOYMENT_PLATFORMS.md](./DEPLOYMENT_PLATFORMS.md)

---

## 📝 写作流程

### 1. 运行写作脚本

```bash
chmod +x scripts/write.sh
./scripts/write.sh
```

### 2. 交互式流程

```
╔══════════════════════════════════════════════════════════╗
║              Issueflow-Blog 写作助手                      ║
╚══════════════════════════════════════════════════════════╝

请输入文章标题:
> 如何使用 React Hooks 构建现代 UI

选择标签 (多选，用空格分隔):
  [1] react
  [2] tailwind
  [3] nextjs
  [4] github
  [5] automation
  ...

标签编号: 1 3

✓ 草稿已创建: /tmp/issueflow-draft/draft.md

📝 正在打开 Vim 编辑器...
提示: 写完保存退出 (:wq) 后，脚本会自动提交到 GitHub Issues

# 在 Vim 中写作...
# :wq 保存退出

📤 正在创建 GitHub Issue...

✓ Issue 创建成功!
   链接: https://github.com/用户名/my-blog/issues/1

💡 提示: 在 GitHub 上关闭此 Issue 后，它会自动同步到博客网站
```

### 3. 发布文章

在 GitHub 上关闭 Issue：

```bash
# 方式 A：通过网页
# 访问 Issue 页面 → 点击 "Close issue"

# 方式 B：通过 CLI
gh issue close 1
```

**自动触发：**
1. GitHub Actions 检测到 Issue 关闭
2. 读取 Issue 标题和正文
3. 生成 Markdown 文件到 `content/docs/`
4. Commit & Push 到 `main` 分支
5. Vercel 自动构建并部署

---

## 🔧 配置说明

### GitHub Actions 权限

确保仓库有以下权限：

```yaml
# .github/workflows/sync.yml 需要的权限
permissions:
  contents: write    # 写入内容
  issues: read       # 读取 Issue
```

### 自定义标签

编辑 `scripts/write.sh` 修改可用标签：

```bash
LABELS=("react" "tailwind" "nextjs" "github" "automation" "devops" "ai" "tutorial" "guide" "other")
```

### Fumadocs 配置

编辑 `fumadocs.config.ts`：

```typescript
import { defineConfig } from 'fumadocs-core/config';

export default defineConfig({
  docs: {
    title: 'My Blog',
    description: '基于 GitHub Issues 的自动化博客',
  },
});
```

---

## 🐛 常见问题

### Q1: `gh auth login` 失败

```bash
# 清除旧认证
gh auth logout

# 重新认证
gh auth login
```

### Q2: GitHub Actions 不触发

1. 确认 Issue 是 **Closed** 状态
2. 检查 `.github/workflows/sync.yml` 是否存在
3. 查看 Actions 日志：`https://github.com/用户名/仓库/actions`

### Q3: 文件已存在，无法覆盖

GitHub Actions 脚本会检测文件是否已存在。如果需要重新发布：

```bash
# 手动删除旧文件
rm content/docs/2026-05-23-xxx.md

# 重新关闭 Issue 触发同步
gh issue close 1
```

### Q4: Netlify 构建失败

1. 检查 `package.json` 的 `build` 脚本
2. 确认 `content/docs/` 目录结构正确
3. 查看 Netlify 部署日志：https://app.netlify.com/sites/你的站点名/deploys
4. 确认 GitHub Secrets 已正确配置（`NETLIFY_AUTH_TOKEN` 和 `NETLIFY_SITE_ID`）

---

## 📊 项目结构

```
issueflow-blog/
├── .github/
│   └── workflows/
│       └── sync.yml          # GitHub Actions 工作流
├── scripts/
│   ├── write.sh              # Vim 写作脚本
│   └── init-fumadocs.sh      # 项目初始化脚本
├── content/
│   └── docs/                 # 博客文章（自动同步）
│       ├── getting-started.md
│       └── 2026-05-23-xxx.md # 自动生成的文章
├── app/                      # Next.js App Router
├── public/
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

## 🔗 相关链接

- **Fumadocs 文档**: https://fumadocs.vercel.app
- **GitHub CLI**: https://cli.github.com
- **Next.js**: https://nextjs.org
- **Netlify**: https://netlify.com

---

## 💡 进阶技巧

### 批量同步历史 Issue

```bash
# 获取所有已关闭的 Issue
gh issue list --state closed --limit 100 --json number,title,body,url \
  --jq '.[] | "\(.number)\t\(.title)\t\(.url)"'
```

### 自定义 Frontmatter

编辑 `.github/workflows/sync.yml` 修改生成的元数据：

```yaml
- name: Create Markdown file with Frontmatter
  run: |
    cat > "$CONTENT_PATH" << EOF
    ---
    title: "${{ steps.issue-meta.outputs.issue_title }}"
    description: "..."
    tags: ["react", "tutorial"]  # 自定义标签
    ---
    EOF
```

### 添加评论模板

在 Issue 中添加特定格式的评论来触发特殊操作：

```markdown
<!-- issueflow: publish-as-draft -->
```

---

**享受你的自动化博客系统！🎉**