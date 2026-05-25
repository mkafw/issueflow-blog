# Issueflow-Blog 架构设计 v2.0

## 核心理念

**分离、聚合、抽象、复用**

| 层级 | 职责 | 技术 |
|------|------|------|
| **收集层** | 统一入口，收集所有信息 | GitHub Issues |
| **工具层** | 范畴化、结构化、抽象封装 | 脚本 + 模板 + API |
| **展示层** | 静态网站展示 | GitHub Pages |

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

🔧 优先级
├── priority/p0         # 紧急重要
├── priority/p1         # 重要
└── priority/p2         # 一般
```

### Issue 模板

#### 1. 文章模板 (content/article)
```markdown
---
title: "{{title}}"
slug: "{{slug}}"
category: "{{category}}"
tags: []
status: draft
published_at: null
---

## 摘要
<!-- 一句话描述文章核心内容 -->

## 正文
<!-- 文章内容 -->

## 参考资料
<!-- 相关链接、引用 -->
```

#### 2. 灵感模板 (content/idea)
```markdown
## 灵感描述
<!-- 记录灵感内容 -->

## 关联项目
<!-- 关联到哪些项目/文章 -->

## 下一步
<!-- 如何把这个灵感落地 -->
```

#### 3. 资源模板 (content/resource)
```markdown
## 资源名称
<!-- 资源标题 -->

## 资源链接
<!-- URL -->

## 推荐理由
<!-- 为什么值得推荐 -->

## 分类标签
<!-- 技术/设计/工具/其他 -->
```

---

## 二、工具层 (抽象封装)

### 设计原则
- **范畴化**: 将非结构化信息转化为结构化数据
- **可复用**: 工具封装为可重复调用的模块
- **自动化**: CI/CD 自动触发处理流程

### 工具模块

#### 1. Issue Parser (`lib/issue-parser.js`)
```javascript
// 解析 Issue 为结构化数据
parseIssue(issue) {
  return {
    id: issue.number,
    title: issue.title,
    body: issue.body,
    labels: issue.labels,
    category: extractCategory(issue.labels),
    type: extractType(issue.labels),
    status: extractStatus(issue.labels),
    metadata: extractFrontmatter(issue.body),
    content: extractContent(issue.body)
  };
}
```

#### 2. Content Transformer (`lib/transformer.js`)
```javascript
// 将 Issue 数据转换为网站内容
transform(issue) {
  switch (issue.type) {
    case 'article':
      return generateArticlePage(issue);
    case 'idea':
      return generateIdeaCard(issue);
    case 'resource':
      return generateResourceCard(issue);
    default:
      return null;
  }
}
```

#### 3. Issue Manager (`lib/issue-manager.js`)
```javascript
// Issues 操作封装
class IssueManager {
  async createIssue(template, data) { /* ... */ }
  async updateIssue(number, updates) { /* ... */ }
  async listIssues(labels) { /* ... */ }
  async closeIssue(number, reason) { /* ... */ }
}
```

#### 4. Category System (`lib/category.js`)
```javascript
// 范畴管理系统
const categories = {
  tech: {
    icon: '💻',
    color: 'blue',
    subcategories: ['frontend', 'backend', 'devops', 'ai']
  },
  design: {
    icon: '🎨',
    color: 'purple',
    subcategories: ['ui', 'ux', 'branding']
  },
  // ...
};
```

### 自动化流程

```
Issue 创建/更新
    │
    ▼
┌─────────────────────────────────────┐
│         GitHub Actions              │
│  ┌───────────────────────────────┐  │
│  │ 1. 监听 Issues 事件            │  │
│  │ 2. 解析 Issue 内容             │  │
│  │ 3. 转换为结构化数据            │  │
│  │ 4. 生成静态页面                │  │
│  │ 5. 提交到 Pages 分支           │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
    │
    ▼
GitHub Pages 自动部署
```

---

## 三、展示层 (GitHub Pages)

### 页面结构

```
/                          # 首页（聚合所有类型）
/articles                  # 文章列表
/articles/:slug            # 文章详情
/ideas                     # 灵感墙
/resources                 # 资源库
/categories/:name          # 分类页
/tags/:name                # 标签页
```

### 聚合展示

```
┌────────────────────────────────────────┐
│              首页 (聚合)                 │
├────────────────────────────────────────┤
│  ┌──────────────────────────────────┐  │
│  │  📝 最新文章 (3 篇)               │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │  💡 最新灵感 (5 条)               │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │  📦 精选资源 (10 个)              │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │  📊 按分类浏览                    │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

---

## 四、可复用工具封装

### CLI 工具 (`bin/issueflow.js`)

```bash
# 创建文章
issueflow new article "文章标题" --category tech

# 创建灵感
issueflow new idea "灵感描述"

# 发布文章
issueflow publish 123  # Issue #123

# 同步内容
issueflow sync --from issues --to pages

# 统计
issueflow stats
```

### API 封装

```javascript
// 可重复调用的 API
import { Issueflow } from '@issueflow/core';

const client = new Issueflow({
  repo: 'mkafw/issueflow-blog',
  token: process.env.GITHUB_TOKEN
});

// 创建内容
await client.content.create({
  type: 'article',
  title: '我的文章',
  category: 'tech'
});

// 查询内容
const articles = await client.content.list({
  category: 'tech',
  status: 'published'
});

// 更新状态
await client.content.updateStatus(123, 'published');
```

---

## 五、实施计划

### Phase 1: 基础架构 (本周)
- [ ] 创建 Issue 模板
- [ ] 配置 Labels 体系
- [ ] 实现 Issue Parser
- [ ] 实现基础 Transformer

### Phase 2: 自动化流程 (下周)
- [ ] GitHub Actions 监听 Issues
- [ ] 自动生成静态页面
- [ ] GitHub Pages 部署

### Phase 3: CLI 工具 (下下周)
- [ ] 开发 `issueflow` CLI
- [ ] 封装常用操作
- [ ] 文档完善

### Phase 4: 飞书集成 (后续)
- [ ] 飞书消息 → Issue 创建
- [ ] 飞书文档 → Issue 同步
- [ ] 双向同步

---

## 六、文件结构

```
issueflow-blog/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── article.md        # 文章模板
│   │   ├── idea.md           # 灵感模板
│   │   └── resource.md       # 资源模板
│   └── workflows/
│       └── issues-to-pages.yml  # Issues → Pages 自动化
│
├── lib/
│   ├── issue-parser.js       # Issue 解析器
│   ├── transformer.js        # 内容转换器
│   ├── issue-manager.js      # Issues 管理器
│   └── category.js           # 范畴系统
│
├── bin/
│   └── issueflow.js          # CLI 工具
│
├── scripts/
│   ├── sync-issues.js        # 同步脚本
│   └── generate-pages.js     # 页面生成
│
├── app/
│   ├── page.tsx              # 首页（聚合）
│   ├── articles/             # 文章页
│   ├── ideas/                # 灵感页
│   └── resources/            # 资源页
│
└── content/
    └── generated/            # 自动生成的内容
```
