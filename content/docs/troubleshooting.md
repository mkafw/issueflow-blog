---
title: "故障排除"
description: "Issueflow-Blog 常见问题与解决方案"
date: 2026-05-23
draft: false
---

# 故障排除

本文介绍 Issueflow-Blog 部署和同步过程中的常见问题及解决方案。

## 目录

- [GitHub Pages 问题](#github-pages-问题)
- [Netlify 问题](#netlify-问题)
- [Issues 同步问题](#issues-同步问题)
- [构建问题](#构建问题)
- [配置问题](#配置问题)

---

## GitHub Pages 问题

### 问题 1：GitHub Pages 未更新

**症状**：
- 推送代码后，GitHub Pages 网站未更新
- 访问页面显示旧内容

**解决方案**：

```bash
# 1. 检查 GitHub Pages 是否启用
# 进入: Settings → Pages
# 确认 Source: Deploy from a branch, Branch: master

# 2. 手动触发部署
gh workflow run pages.yml

# 3. 查看 Actions 运行状态
gh run list --workflow=pages.yml --limit 5

# 4. 查看部署日志
gh run view <run-id> --log
```

### 问题 2：GitHub Pages 返回 404

**症状**：
- 访问 `https://mkafw.github.io/issueflow-blog` 返回 404

**解决方案**：

```bash
# 1. 确认仓库是 public（GitHub Pages 需要公开仓库）
gh repo view --json visibility --jq '.visibility'

# 2. 检查 Pages 部署状态
gh api repos/mkafw/issueflow-blog/pages

# 3. 重新启用 Pages
# Settings → Pages → 保存（触发重新部署）
```

---

## Netlify 问题

### 问题 1：Netlify 部署失败

**症状**：
- Actions 中 `Deploy to Netlify` 步骤失败
- 错误信息：`NETLIFY_AUTH_TOKEN invalid`

**解决方案**：

```bash
# 1. 检查 Secrets 是否配置
gh secret list

# 2. 重新添加 Netlify Token
gh secret set NETLIFY_AUTH_TOKEN --body "your-token-here"
gh secret set NETLIFY_SITE_ID --body "your-site-id-here"

# 3. 获取 Netlify Token
# 访问: https://app.netlify.com/account/applications
# 生成 Personal Access Token

# 4. 重新触发部署
gh workflow run deploy.yml
```

### 问题 2：Netlify 构建失败

**症状**：
- Netlify 显示 `Build failed`
- 错误：`npm run build` 失败

**解决方案**：

```bash
# 1. 本地测试构建
npm ci
npm run build

# 2. 检查 Node.js 版本
node --version  # 需要 18+

# 3. 检查 package.json 的 build 脚本
cat package.json | grep -A5 '"scripts"'

# 4. 查看 Netlify 构建日志
# 访问: https://app.netlify.com/sites/[site-name]/deploys
```

---

## Issues 同步问题

### 问题 1：关闭 Issue 后未同步

**症状**：
- 关闭 GitHub Issue 后，网站内容未更新
- `issues-to-pages.yml` 未触发

**解决方案**：

```bash
# 1. 手动触发同步
gh workflow run issues-to-pages.yml

# 2. 强制同步所有 Issue
gh workflow run issues-to-pages.yml -f force_sync=true

# 3. 同步特定 Issue
gh workflow run issues-to-pages.yml -f issue_number=5

# 4. 检查 workflow 是否启用
gh workflow list

# 5. 查看 workflow 运行历史
gh run list --workflow=issues-to-pages.yml --limit 5
```

### 问题 2：同步内容格式错误

**症状**：
- 同步后的 Markdown 文件格式不正确
- Frontmatter 缺失或错误

**解决方案**：

```bash
# 1. 检查 Issue 内容
gh issue view <issue-number>

# 2. 检查生成的文件
cat content/generated/<filename>.md

# 3. 检查脚本逻辑
cat scripts/sync-issues.js
cat scripts/generate-pages.js

# 4. 手动修正后重新同步
gh workflow run issues-to-pages.yml -f issue_number=<n> -f force_sync=true
```

---

## 构建问题

### 问题 1：npm run build 失败

**症状**：
- `npm run build` 报错
- TypeScript 编译错误

**解决方案**：

```bash
# 1. 清理并重新安装
rm -rf node_modules package-lock.json
npm install

# 2. 检查 TypeScript 配置
cat tsconfig.json

# 3. 运行 TypeScript 检查
npx tsc --noEmit

# 4. 查看完整错误日志
npm run build 2>&1 | tee build.log
```

### 问题 2：Fumadocs 配置错误

**症状**：
- 构建时提示 `fumadocs-core` 相关错误
- 文档路由不工作

**解决方案**：

```bash
# 1. 检查 fumadocs.config.ts
cat fumadocs.config.ts

# 2. 确认依赖已安装
npm list fumadocs-core fumadocs-mdx

# 3. 重新安装 Fumadocs
npm install fumadocs-core@latest fumadocs-mdx@latest

# 4. 验证配置
npx fumadocs --help
```

---

## 配置问题

### 问题 1：Secrets 未生效

**症状**：
- 添加 Secret 后，Actions 仍报错 `Secret not found`

**解决方案**：

```bash
# 1. 验证 Secret 存在
gh secret list

# 2. 检查 Secret 名称（区分大小写）
gh secret list | grep -i netlify

# 3. 重新添加（覆盖）
gh secret set NETLIFY_AUTH_TOKEN --body "new-token"

# 4. 确认 Repository 级别（不是 Environment 级别）
gh secret list --repo mkafw/issueflow-blog
```

### 问题 2：飞书通知未收到

**症状**：
- 部署成功后未收到飞书卡片

**解决方案**：

```bash
# 1. 检查 FEISHU_WEBHOOK_URL 是否配置
gh secret list | grep FEISHU

# 2. 测试 Webhook
curl -X POST "${FEISHU_WEBHOOK_URL}" \
  -H "Content-Type: application/json" \
  -d '{"msg_type":"text","content":{"text":"测试消息"}}'

# 3. 检查 Actions 日志中的飞书调用
gh run view <run-id> --log | grep -i feishu

# 4. 确认飞书机器人已启用
# 访问: 飞书开放平台 → 机器人管理
```

---

## 诊断命令汇总

```bash
# 检查仓库状态
gh repo view --json name,url,visibility

# 检查 Actions workflow
gh workflow list

# 检查最近运行
gh run list --limit 10

# 查看特定运行日志
gh run view <run-id> --log

# 检查 Secrets
gh secret list

# 检查 Issues 状态
gh issue list --state all --limit 10

# 手动触发 workflow
gh workflow run <workflow-name>.yml

# 本地构建测试
npm ci && npm run build
```

---

## 获取帮助

- **GitHub Actions 文档**: https://docs.github.com/actions
- **Netlify 文档**: https://docs.netlify.com
- **Fumadocs 文档**: https://fumadocs.vercel.app
- **Hermes Skill**: `automated-blog-system`
