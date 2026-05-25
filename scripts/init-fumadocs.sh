#!/bin/bash
# =============================================================================
# Issueflow-Blog: 一键初始化 Fumadocs 项目
# 用法: ./scripts/init-fumadocs.sh [项目名称]
# =============================================================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

PROJECT_NAME="${1:-issueflow-blog}"

echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║         Issueflow-Blog: Fumadocs 初始化助手               ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# 检查 Node.js
if ! command -v node &>/dev/null; then
    echo -e "${RED}❌ Node.js 未安装${NC}"
    echo "请先安装 Node.js 18+: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [[ "$NODE_VERSION" -lt 18 ]]; then
    echo -e "${RED}❌ Node.js 版本过低 (当前: $(node -v), 需要: 18+)${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js 版本: $(node -v)${NC}"

# 创建项目
echo ""
echo -e "${BLUE}📦 正在创建 Fumadocs 项目...${NC}"
echo "项目名称: ${PROJECT_NAME}"
echo ""

# 使用 Fumadocs 官方脚手架
npx create-fumadocs-app@latest "${PROJECT_NAME}" \
    --yes \
    --framework nextjs \
    --app \
    --tailwind \
    --typescript \
    --import-alias "@/*"

cd "${PROJECT_NAME}"

echo ""
echo -e "${GREEN}✓ Fumadocs 项目已创建${NC}"

# 创建 content 目录结构
echo ""
echo -e "${BLUE}📁 创建 content 目录结构...${NC}"
mkdir -p content/docs

# 创建示例文档
cat > content/docs/getting-started.md << 'EOF'
---
title: "Getting Started"
description: "Issueflow-Blog 快速入门指南"
---

# Getting Started

欢迎使用 **Issueflow-Blog**！

## 工作原理

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   本地 Vim   │ ──> │ GitHub Issue │ ──> │  Fumadocs    │
│  写作脚本    │     │  (Open)      │     │   网站       │
└──────────────┘     └──────────────┘     └──────────────┘
                            │
                            │ 关闭 Issue
                            ▼
                     ┌──────────────┐
                     │ GitHub Actions│
                     │ 自动同步内容  │
                     └──────────────┘
```

## 快速开始

### 1. 写作

```bash
./scripts/write.sh
```

### 2. 发布

在 GitHub 上关闭 Issue，网站将自动更新。

### 3. 预览

```bash
npm run dev
```

## 配置

详见 [docs/configuration.md](/docs/configuration.md)

EOF

echo "✓ 已创建 content/docs/getting-started.md"

# 初始化 Git
echo ""
echo -e "${BLUE}🔧 初始化 Git 仓库...${NC}"
git init
git add .
git commit -m "feat: initialize Issueflow-Blog with Fumadocs

- Fumadocs + Next.js App Router
- Tailwind CSS styling
- GitHub Actions workflow for issue sync
- Content directory structure"

echo "✓ Git 仓库已初始化"

# 提示下一步
echo ""
echo -e "${GREEN}══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  初始化完成！接下来:${NC}"
echo -e "${GREEN}══════════════════════════════════════════════════════════${NC}"
echo ""
echo "1. 创建 GitHub 仓库:"
echo "   ${YELLOW}gh repo create ${PROJECT_NAME} --public --source=. --push${NC}"
echo ""
echo "2. 连接 Vercel (可选):"
echo "   ${YELLOW}vercel link${NC}"
echo "   ${YELLOW}vercel --prod${NC}"
echo ""
echo "3. 开始写作:"
echo "   ${YELLOW}./scripts/write.sh${NC}"
echo ""
echo -e "${CYAN}📚 文档: https://fumadocs.vercel.app${NC}"
echo ""