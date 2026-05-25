---
title: "写作流程"
description: "使用 Vim 脚本和 GitHub Issues 进行高效写作"
date: 2026-05-23
draft: false
---

# 写作流程

本指南介绍如何使用 Vim 脚本和 GitHub Issues 进行高效写作。

## 核心工作流

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  本地写作   │───>│ GitHub Issue│───>│ 自动发布    │
│  (Vim)      │    │ (Open)      │    │ (Closed)    │
└─────────────┘    └─────────────┘    └─────────────┘
```

## 方法 1：手动创建 Issue

### 步骤 1：在本地创建 Markdown 文件

```bash
# 创建内容目录
mkdir -p content/docs

# 创建新文章
cat > content/docs/my-article.md << 'EOF'
---
title: "我的文章标题"
description: "文章描述"
date: 2026-05-23
draft: false
---

# 文章标题

文章内容...

EOF
```

### 步骤 2：创建 GitHub Issue

```bash
gh issue create \
  --title "我的文章标题" \
  --body "文章内容..." \
  --label "blog"
```

### 步骤 3：关闭 Issue 触发同步

```bash
gh issue close <issue-number>
```

GitHub Actions 会自动：
1. 读取 Issue 内容
2. 生成 Markdown 文件
3. 提交到 `content/docs/`
4. 触发 Next.js 构建
5. Vercel 自动部署

## 方法 2：使用写作脚本

### 创建写作脚本

```bash
# scripts/write.sh
#!/bin/bash

read -p "文章标题: " TITLE
read -p "标签 (blog/tutorial/news): " LABEL

# 创建临时文件
TEMP_FILE=$(mktemp)

# 生成 Frontmatter
cat > "$TEMP_FILE" << EOF
---
title: "$TITLE"
description: ""
date: $(date +%Y-%m-%d)
draft: true
---

# $TITLE

EOF

# 打开 Vim 编辑
vim "$TEMP_FILE"

# 创建 GitHub Issue
gh issue create \
  --title "$TITLE" \
  --body-file "$TEMP_FILE" \
  --label "$LABEL"

# 清理临时文件
rm "$TEMP_FILE"

echo "✓ Issue 已创建，关闭 Issue 即可发布"
```

### 使用脚本

```bash
chmod +x scripts/write.sh
./scripts/write.sh
```

## 标签管理

| 标签 | 用途 |
|------|------|
| `blog` | 普通博客文章 |
| `tutorial` | 教程类文章 |
| `news` | 新闻/公告 |
| `draft` | 草稿（不发布） |

## 文件命名规则

自动同步时，文件名遵循以下规则：

1. **小写**：所有字母转为小写
2. **空格转连字符**：`my article` → `my-article`
3. **移除特殊字符**：`hello! world?` → `hello-world`
4. **日期前缀**：`2026-05-23-my-article.md`

## 预览发布内容

在关闭 Issue 之前，可以预览：

```bash
# 查看 Issue 内容
gh issue view <issue-number>

# 查看即将生成的文件名
gh issue view <issue-number> --json title --jq '.title' | \
  tr '[:upper:]' '[:lower:]' | \
  sed 's/[^a-z0-9 ]//g' | \
  tr ' ' '-'
```

## 批量操作

### 关闭多个 Issue

```bash
# 关闭所有带 blog 标签的 Issue
gh issue list --label blog --state open --json number --jq '.[].number' | \
  while read num; do
    gh issue close $num
  done
```

### 查看同步状态

```bash
# 查看最近的 Actions 运行
gh run list --limit 5

# 查看特定 Issue 的评论（同步状态）
gh issue view <issue-number> --comments
```

---

## 下一步

- [部署指南](./deployment) — 多平台部署选项
- [故障排除](./troubleshooting) — 常见问题解答
