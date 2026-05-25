/**
 * Issueflow - Issue 解析器
 * 
 * 将 GitHub Issue 解析为结构化数据
 * 支持 Frontmatter 和标签系统
 */

const CATEGORY_MAP = {
  'content/article': 'article',
  'content/idea': 'idea',
  'content/snippet': 'snippet',
  'content/resource': 'resource',
  'content/draft': 'draft'
};

const STATUS_MAP = {
  'status/backlog': 'backlog',
  'status/in-progress': 'in_progress',
  'status/review': 'review',
  'status/published': 'published',
  'status/archived': 'archived'
};

const CATEGORY_LABELS = {
  'category/tech': 'tech',
  'category/design': 'design',
  'category/life': 'life',
  'category/work': 'work',
  'category/learning': 'learning'
};

/**
 * 解析 Issue 为结构化数据
 * @param {Object} issue - GitHub Issue 对象
 * @returns {Object} 结构化数据
 */
function parseIssue(issue) {
  const labels = issue.labels.map(l => l.name);
  const body = issue.body || '';
  
  // 提取 Frontmatter
  const frontmatter = extractFrontmatter(body);
  
  // 提取正文内容
  const content = extractContent(body);
  
  // 从标签和 Frontmatter 提取元数据
  const type = extractType(labels, frontmatter);
  const category = extractCategory(labels, frontmatter);
  const status = extractStatus(labels, frontmatter);
  
  return {
    id: issue.number,
    url: issue.html_url,
    title: issue.title,
    body: body,
    frontmatter: frontmatter,
    content: content,
    type: type,
    category: category,
    status: status,
    labels: labels,
    createdAt: issue.created_at,
    updatedAt: issue.updated_at,
    author: issue.user.login
  };
}

/**
 * 提取 Frontmatter (YAML 格式)
 * @param {string} body - Issue body
 * @returns {Object} Frontmatter 数据
 */
function extractFrontmatter(body) {
  const match = body.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  
  const lines = match[1].split('\n');
  const data = {};
  
  for (const line of lines) {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length) {
      let value = valueParts.join(':').trim();
      // 处理引号
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
      }
      // 处理数组
      if (value.startsWith('[') && value.endsWith(']')) {
        try {
          value = JSON.parse(value);
        } catch {
          // 保持原样
        }
      }
      data[key.trim()] = value;
    }
  }
  
  return data;
}

/**
 * 提取正文内容（Frontmatter 之后的部分）
 * @param {string} body - Issue body
 * @returns {string} 正文内容
 */
function extractContent(body) {
  const match = body.match(/^---\n[\s\S]*?\n---\n([\s\S]*)/);
  return match ? match[1].trim() : body;
}

/**
 * 提取内容类型
 * @param {string[]} labels - Issue 标签
 * @param {Object} frontmatter - Frontmatter 数据
 * @returns {string} 内容类型
 */
function extractType(labels, frontmatter) {
  // 优先从 Frontmatter 获取
  if (frontmatter.type) return frontmatter.type;
  
  // 从标签推断
  for (const [label, type] of Object.entries(CATEGORY_MAP)) {
    if (labels.includes(label)) return type;
  }
  
  return 'article'; // 默认
}

/**
 * 提取分类
 * @param {string[]} labels - Issue 标签
 * @param {Object} frontmatter - Frontmatter 数据
 * @returns {string} 分类
 */
function extractCategory(labels, frontmatter) {
  // 优先从 Frontmatter 获取
  if (frontmatter.category) return frontmatter.category;
  
  // 从标签推断
  for (const [label, category] of Object.entries(CATEGORY_LABELS)) {
    if (labels.includes(label)) return category;
  }
  
  return 'uncategorized';
}

/**
 * 提取状态
 * @param {string[]} labels - Issue 标签
 * @param {Object} frontmatter - Frontmatter 数据
 * @returns {string} 状态
 */
function extractStatus(labels, frontmatter) {
  // 优先从 Frontmatter 获取
  if (frontmatter.status) return frontmatter.status;
  
  // 从标签推断
  for (const [label, status] of Object.entries(STATUS_MAP)) {
    if (labels.includes(label)) return status;
  }
  
  // 根据 Issue 状态推断
  if (labels.some(l => l.startsWith('status/'))) {
    return 'backlog';
  }
  
  return 'backlog';
}

/**
 * 将解析结果转换为 Markdown 页面
 * @param {Object} parsed - 解析后的数据
 * @returns {string} Markdown 内容
 */
function toMarkdown(parsed) {
  const fm = parsed.frontmatter;
  
  let markdown = '---\n';
  for (const [key, value] of Object.entries(fm)) {
    if (Array.isArray(value)) {
      markdown += `${key}: ${JSON.stringify(value)}\n`;
    } else {
      markdown += `${key}: "${value}"\n`;
    }
  }
  markdown += '---\n\n';
  
  markdown += parsed.content;
  
  // 添加元数据
  markdown += `\n\n---\n\n`;
  markdown += `> 📌 Issue #${parsed.id} | 作者: ${parsed.author} | 创建于: ${new Date(parsed.createdAt).toLocaleDateString('zh-CN')}\n`;
  
  return markdown;
}

/**
 * 生成页面 slug
 * @param {string} title - 标题
 * @param {string} slug - 自定义 slug（可选）
 * @returns {string} 页面路径
 */
function generateSlug(title, slug) {
  if (slug) return slug;
  
  // 从标题生成 slug
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

module.exports = {
  parseIssue,
  extractFrontmatter,
  extractContent,
  extractType,
  extractCategory,
  extractStatus,
  toMarkdown,
  generateSlug
};
