# Issueflow-Blog 飞书集成方案

## 当前状态诊断

### 飞书应用信息
| 项目 | 值 |
|------|-----|
| 应用 ID | `cli_a952e33923399bcf` |
| 应用类型 | **CLI 类型应用** |
| 凭证状态 | ✅ tenant_access_token 可获取 |
| API 权限 | ❌ 受限（只能调用 auth 端点） |

### 限制说明
CLI 类型应用（app_id 以 `cli_` 开头）的 API 权限与普通企业主应用不同：
- ✅ **可用**: `auth/v3/tenant_access_token`
- ❌ **不可用**: `drive/v1/*`, `docs/v1/*`, `contact/v3/*`, `event/v1/*` (返回 404)

---

## 集成方案对比

### 方案 A: 飞书群机器人 Webhook（推荐，立即可用）⭐

**特点**: 最简单，无需改应用类型，只需在飞书群添加机器人

**功能**:
- 新文章发布时自动推送通知到飞书群
- 包含文章标题、摘要、链接
- 支持卡片消息（富文本展示）

**配置步骤**:
1. 在飞书群添加「自定义机器人」
2. 获取 Webhook URL
3. 在 GitHub Secrets 中添加 `FEISHU_WEBHOOK_URL`
4. GitHub Actions 构建完成后自动推送

**优点**: 
- 5 分钟搞定
- 无需管理员权限
- 无需改应用类型

**缺点**:
- 只能推送通知，不能双向交互
- 不能操作飞书文档

---

### 方案 B: 升级为「企业主应用」（功能完整）

**特点**: 获得完整飞书 API 权限，可以操作文档、 Drive、联系人等

**功能**:
- 博客文章自动同步到飞书文档
- 飞书文档作为 CMS（写作入口）
- 双向同步：GitHub Issues ↔ 飞书文档
- 飞书消息交互控制写作流程

**配置步骤**:
1. 联系飞书管理员，将应用类型改为「企业主应用」
2. 重新配置应用凭证（app_id 会变）
3. 在飞书开放平台添加所需 API 权限：
   - 云文档（drive、docs）
   - 通讯录（contact）
   - 消息（im）
4. 更新 `~/.cc-connect/config.toml`

**优点**:
- 功能最完整
- 飞书文档作为 CMS 体验好
- 可以双向同步

**缺点**:
- 需要飞书管理员操作
- 配置较复杂

---

### 方案 C: DigitalMe + 飞书消息远程控制（已有基础）

**特点**: 利用已配置的 DigitalMe，通过飞书消息远程控制 Claude Code

**功能**:
- 飞书消息发送指令 → DigitalMe 接收 → Claude Code 执行
- 可以写文章、修改代码、部署项目
- 结果通过飞书消息返回

**配置步骤**:
1. DigitalMe 已配置飞书凭证（`~/.cc-connect/config.toml`）
2. 需要配置 DigitalMe 的消息路由规则
3. 在飞书群添加 DigitalMe 机器人

**优点**:
- 已有配置基础
- 可以远程控制整个开发流程
- 适合复杂任务

**缺点**:
- 需要配置 DigitalMe 的消息处理逻辑
- 响应速度依赖 Claude Code 执行时间

---

## 推荐方案：A + C 组合

```
┌─────────────────────────────────────────────────────────┐
│                    飞书集成架构                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐    ┌──────────────┐                  │
│  │  飞书群消息   │───▶│ DigitalMe    │                  │
│  │  (写作指令)   │    │ (远程控制)    │                  │
│  └──────────────┘    └──────┬───────┘                  │
│                             │                           │
│                             ▼                           │
│                    ┌──────────────┐                    │
│                    │  Claude Code  │                    │
│                    │  (执行任务)   │                    │
│                    └──────┬───────┘                    │
│                           │                             │
│                           ▼                             │
│  ┌──────────────┐    ┌──────────────┐                  │
│  │  飞书群消息   │◀───│ GitHub       │                  │
│  │  (结果通知)   │    │ Actions      │                  │
│  └──────────────┘    └──────┬───────┘                  │
│                             │                           │
│                             ▼                           │
│                    ┌──────────────┐                    │
│                    │  Netlify     │                    │
│                    │  (自动部署)   │                    │
│                    └──────────────┘                    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 立即实施：方案 A（飞书 Webhook 通知）

### 步骤 1: 创建飞书自定义机器人

1. 打开飞书，进入任意群组
2. 点击群设置 → 添加机器人 → 自定义机器人
3. 命名：`Issueflow Bot`
4. 复制 Webhook URL（格式：`https://open.feishu.cn/open-apis/bot/v2/hook/xxx`）

### 步骤 2: 添加 GitHub Secret

```bash
# 在 GitHub 仓库设置中添加 Secret
# Settings → Secrets and variables → Actions → New repository secret

# 添加 FEISHU_WEBHOOK_URL
# Name: FEISHU_WEBHOOK_URL
# Value: https://open.feishu.cn/open-apis/bot/v2/hook/xxx
```

### 步骤 3: 更新 GitHub Actions

在 `.github/workflows/deploy.yml` 中添加飞书通知步骤。

---

## 后续实施：方案 B（企业主应用 + 飞书文档 CMS）

如需完整的双向同步和飞书文档写作功能，需要：

1. 将应用类型从 CLI 改为「企业主应用」
2. 在飞书开放平台配置 API 权限
3. 实现飞书文档 ↔ GitHub Issues 双向同步
4. 在博客项目中集成飞书文档 API

---

## 文件位置

- 本方案文档: `/home/qiyu/下载/Issueflow-Blog/docs/FEISHU_INTEGRATION.md`
- 当前飞书配置: `~/.cc-connect/config.toml`
- GitHub Actions: `/home/qiyu/下载/Issueflow-Blog/.github/workflows/deploy.yml`
