# Issueflow-Blog 架构设计 v2.1

## 核心理念

**分离、聚合、抽象、复用**

| 层级 | 职责 | 技术 |
|------|------|------|
| **收集层** | 统一入口，收集所有信息 | GitHub Issues |
| **工具层** | 范畴化、结构化、抽象封装 | Node.js 脚本 + 模板 + API |
| **展示层** | 静态网站展示 | Next.js 15 + TypeScript + Tailwind |

---

## 一、收集层 (GitHub Issues)

### 设计原则
- **统一入口**: 所有信息都通过 Issues 收集
- **标签分类**: 用 Labels 实现范畴化
- **模板规范**: 用 Issue Templates 实现结构化

### 标签体系 (Labels)

```
📝 内容类型
├── content/article     # 文章
├── content/idea        # 灵感
├── content/snippet     # 代码片段
├── content/resource    # 资源推荐
└── content/draft       # 草稿

🏷️ 范畴分类
├── category/tech       # 技术
├── category/design     # 设计
├── category/life       # 生活
├── category/work       # 工作
└── category/learning   # 学习

📊 状态管理
├── status/backlog      # 待处理
├── status/in-progress  # 进行中
├── status/review       # 待审核
├── status/published    # 已发布
└── status/archived     # 已归档
```

---

## 二、工具层 (抽象封装)

### 技术栈

| 组件 | 技术 | 说明 |
|------|------|------|
| **脚本语言** | Node.js (v22) | 跨平台，可重复调用 |
| **HTTP 客户端** | https 模块 | 原生 Node.js，无依赖 |
| **数据格式** | JSON + Markdown | 结构化 + 可读 |
| **模板系统** | Issue Templates | GitHub 原生支持 |

### 核心脚本

| 脚本 | 职责 | 可重复调用 |
|------|------|-----------|
| `scripts/sync-issues.js` | 从 GitHub API 获取 Issues，解析为结构化数据 | ✅ |
| `scripts/generate-pages.js` | 将结构化数据转换为 Next.js `.tsx` 页面 | ✅ |
| `lib/issue-parser.js` | Issue 解析器（Frontmatter + 标签提取） | ✅ |

### 使用方式

```bash
# 手动同步（可重复调用）
node scripts/sync-issues.js --repo mkafw/issueflow-blog --output ./content/generated

# 生成页面（可重复调用）
node scripts/generate-pages.js --input ./content/generated --output ./app

# 自动化（GitHub Actions 触发）
# .github/workflows/pages.yml
```

---

## 三、展示层 (GitHub Pages)

### 技术栈（完整）

| 层级 | 技术 | 版本 | 说明 |
|------|------|------|------|
| **框架** | Next.js | 15.x | App Router，静态生成 |
| **语言** | TypeScript | 5.x | 类型安全 |
| **UI 组件** | React | 19.x | 函数组件，Hooks |
| **样式** | Tailwind CSS | 4.x | 原子化 CSS |
| **图标** | Lucide React | - | 轻量图标库 |
| **文档** | Fumadocs | 15.x | MDX 文档系统 |
| **构建** | npm | - | 包管理 + 构建 |
| **托管** | GitHub Pages | - | 免费静态托管 |

### 项目结构

```
issueflow-blog/
├── .github/
│   ├── ISSUE_TEMPLATE/        # Issue 模板
│   │   ├── article.md         # 文章模板
│   │   ├── idea.md            # 灵感模板
│   │   └── resource.md        # 资源模板
│   └── workflows/
│       ├── pages.yml          # GitHub Pages 部署
│       └── deploy.yml         # Netlify 部署（可选）
│
├── lib/
│   └── issue-parser.js        # Issue 解析器
│
├── scripts/
│   ├── sync-issues.js         # Issues 同步脚本
│   ├── generate-pages.js      # 页面生成脚本
│   ├── feishu-notify.js       # 飞书通知脚本
│   └── feishu-writer.js       # 飞书写作助手
│
├── app/                       # Next.js App Router
│   ├── layout.tsx             # 根布局
│   ├── page.tsx               # 首页（聚合）
│   ├── articles/              # 文章模块
│   ├── ideas/                 # 灵感模块
│   └── resources/             # 资源模块
│
├── content/                   # 内容源
│   └── generated/             # 自动生成的内容
│
├── styles/                    # 样式
│   └── globals.css            # 全局样式
│
├── public/                    # 静态资源
│   └── favicon.ico
│
├── next.config.js             # Next.js 配置
├── tailwind.config.ts         # Tailwind 配置
├── tsconfig.json              # TypeScript 配置
├── package.json               # 依赖管理
└── README.md                  # 项目说明
```

### 页面路由

```
/                          # 首页（聚合所有类型）
/articles                  # 文章列表
/articles/:slug            # 文章详情
/ideas                     # 灵感列表
/ideas/:slug               # 灵感详情
/resources                 # 资源列表
/resources/:slug           # 资源详情
```

### 部署流程

```
GitHub Actions (pages.yml)
    │
    ├── 1. 监听 push 到 master
    │
    ├── 2. 运行 sync-issues.js
    │       → content/generated/*.md
    │
    ├── 3. 运行 generate-pages.js
    │       → app/**/*.tsx
    │
    ├── 4. npm run build
    │       → out/ (静态文件)
    │
    └── 5. 部署到 GitHub Pages
            → https://mkafw.github.io/issueflow-blog
```

---

## 四、Netlify（可选替代展示层）

### 为什么需要 Netlify？

| 功能 | GitHub Pages | Netlify |
|------|-------------|---------|
| 自定义域名 | ✅ | ✅ |
| 自动部署 | ✅ | ✅ |
| 预览部署（PR） | ❌ | ✅ |
| 表单处理 | ❌ | ✅ |
| Serverless Functions | ❌ | ✅ |
| 分片加载 | ❌ | ✅ |
| 重定向规则 | 基础 | 高级 |
| 构建缓存 | 无 | 有 |

### 配置方式

1. 在 Netlify 导入 GitHub 仓库
2. 配置构建命令：`npm run build`
3. 配置发布目录：`out/`
4. 添加环境变量：`GITHUB_TOKEN`

### 与 GitHub Pages 的关系

**二选一即可**，或者同时使用：
- **GitHub Pages**: 免费、原生集成、简单
- **Netlify**: 功能更强、预览部署、Serverless

---

## 五、飞书集成（消息通知）

### 当前状态

| 项目 | 值 |
|------|-----|
| 应用 ID | `cli_a952e33923399bcf` |
| 应用类型 | CLI 类型应用 |
| 凭证状态 | ✅ tenant_access_token 可获取 |
| API 权限 | ❌ 受限（只能调用 auth 端点） |

### 集成方案

**方案 A: 飞书 Webhook 机器人**（推荐，立即可用）
- 在飞书群添加自定义机器人
- 获取 Webhook URL
- GitHub Actions 部署成功后推送通知

**方案 B: 升级为「企业主应用」**（功能完整）
- 需要飞书管理员操作
- 获得完整 API 权限
- 可以操作飞书文档、Drive 等

---

## 六、完整数据流

```
┌─────────────────────────────────────────────────────────────────┐
│                        完整数据流                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  用户写作                                                          │
│     │                                                            │
│     ▼                                                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    收集层 (GitHub Issues)                 │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │   │
│  │  │ 文章     │  │ 灵感     │  │ 资源     │ ...           │   │
│  │  │ Issue #1 │  │ Issue #2 │  │ Issue #3 │              │   │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘              │   │
│  └───────┼─────────────┼─────────────┼────────────────────┘   │
│          │             │             │                          │
│          └─────────────┼─────────────┘                          │
│                        ▼                                        │
│          ┌──────────────────────────────────────────────┐      │
│          │              GitHub Actions                   │      │
│          │  ┌────────────────────────────────────────┐  │      │
│          │  │ 1. 触发: push to master                │  │      │
│          │  │ 2. 执行: sync-issues.js                │  │      │
│          │  │ 3. 输出: content/generated/*.md        │  │      │
│          │  │ 4. 执行: generate-pages.js             │  │      │
│          │  │ 5. 输出: app/**/*.tsx                  │  │      │
│          │  │ 6. 构建: npm run build                 │  │      │
│          │  │ 7. 部署: GitHub Pages / Netlify        │  │      │
│          │  └────────────────────────────────────────┘  │      │
│          └──────────────────────────────────────────────┘      │
│                        │                                        │
│                        ▼                                        │
│          ┌──────────────────────────────────────────────┐      │
│          │              展示层 (GitHub Pages)            │      │
│          │  ┌────────────────────────────────────────┐  │      │
│          │  │ /              - 首页（聚合）           │  │      │
│          │  │ /articles       - 文章列表             │  │      │
│          │  │ /articles/:slug - 文章详情             │  │      │
│          │  │ /ideas          - 灵感列表             │  │      │
│          │  │ /resources      - 资源列表             │  │      │
│          │  └────────────────────────────────────────┘  │      │
│          └──────────────────────────────────────────────┘      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 七、可复用工具封装

### CLI 工具（未来）

```bash
# 创建文章 Issue
issueflow new article "文章标题" --category tech

# 同步所有内容
issueflow sync

# 生成页面
issueflow generate

# 部署
issueflow deploy
```

### API 封装（未来）

```javascript
import { Issueflow } from '@issueflow/core';

const client = new Issueflow({ repo: 'mkafw/issueflow-blog' });

// 创建内容
await client.content.create({ type: 'article', title: '...' });

// 查询内容
const articles = await client.content.list({ category: 'tech' });
```

---

## 八、实施状态

### 已完成 ✅
- [x] Issue 模板（article, idea, resource）
- [x] `sync-issues.js` - Issues 同步脚本
- [x] `generate-pages.js` - 页面生成脚本
- [x] `issue-parser.js` - 解析器库
- [x] GitHub Actions 工作流（pages.yml）
- [x] 飞书 Webhook 通知脚本
- [x] 架构文档

### 待完成 🔄
- [ ] GitHub Pages 部署配置（需在 Settings 中启用）
- [ ] Netlify 配置（可选）
- [ ] CLI 工具封装
- [ ] API 封装
