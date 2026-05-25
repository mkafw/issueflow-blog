#!/usr/bin/env node
/**
 * Issueflow - Issues 同步脚本
 * 
 * 从 GitHub API 获取 Issues，解析并生成结构化内容
 * 
 * 用法:
 *   node scripts/sync-issues.js --repo owner/repo --output ./content/generated
 *   node scripts/sync-issues.js --issue 123 --output ./content/generated
 *   node scripts/sync-issues.js --force --output ./content/generated
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// 解析命令行参数
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    repo: '',
    output: './content/generated',
    token: process.env.GITHUB_TOKEN || '',
    issue: null,
    force: false
  };
  
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--repo':
        options.repo = args[++i];
        break;
      case '--output':
        options.output = args[++i];
        break;
      case '--token':
        options.token = args[++i];
        break;
      case '--issue':
        options.issue = parseInt(args[++i], 10);
        break;
      case '--force':
        options.force = true;
        break;
      case '--help':
      case '-h':
        console.log(`
Usage: node scripts/sync-issues.js [options]

Options:
  --repo <owner/repo>     GitHub 仓库（必填）
  --output <path>         输出目录（默认: ./content/generated）
  --token <token>         GitHub Token（或设置 GITHUB_TOKEN 环境变量）
  --issue <number>        同步指定 Issue（默认: 同步所有开放 Issue）
  --force                 强制同步所有 Issue（包括已关闭）
  --help, -h              显示帮助

Environment:
  GITHUB_TOKEN            GitHub Personal Access Token
`);
        process.exit(0);
    }
  }
  
  return options;
}

// GitHub API 调用
async function githubRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(`https://api.github.com${path}`);
    
    const req = https.request({
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: {
        'Authorization': `Bearer ${options.token}`,
        'User-Agent': 'Issueflow-Bot',
        'Accept': 'application/vnd.github.v3+json',
        ...options.headers
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch {
            resolve(data);
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });
    
    req.on('error', reject);
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

// 获取 Issues 列表
async function listIssues(repo, token, options = {}) {
  const [owner, repoName] = repo.split('/');
  const perPage = 100;
  let page = 1;
  const allIssues = [];
  
  const state = options.force ? 'all' : 'open';
  
  while (true) {
    const issues = await githubRequest(
      `/repos/${owner}/${repoName}/issues?state=${state}&per_page=${perPage}&page=${page}`,
      { token }
    );
    
    if (issues.length === 0) break;
    
    // 过滤掉 PR（GitHub API 返回的 issues 包含 PR）
    const filtered = issues.filter(i => !i.pull_request);
    allIssues.push(...filtered);
    
    if (issues.length < perPage) break;
    page++;
  }
  
  return allIssues;
}

// 获取单个 Issue
async function getIssue(repo, issueNumber, token) {
  const [owner, repoName] = repo.split('/');
  return await githubRequest(
    `/repos/${owner}/${repoName}/issues/${issueNumber}`,
    { token }
  );
}

// 解析 Frontmatter
function extractFrontmatter(body) {
  const match = body.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  
  const lines = match[1].split('\n');
  const data = {};
  
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;
    
    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();
    
    // 处理引号
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
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
    
    data[key] = value;
  }
  
  return data;
}

// 提取内容（Frontmatter 之后）
function extractContent(body) {
  const match = body.match(/^---\n[\s\S]*?\n---\n([\s\S]*)/);
  return match ? match[1].trim() : body;
}

// 生成 slug
function generateSlug(title, customSlug) {
  if (customSlug) return customSlug;
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// 生成 Markdown 文件
function generateMarkdown(issue) {
  const body = issue.body || '';
  const frontmatter = extractFrontmatter(body);
  const content = extractContent(body);
  const labels = issue.labels.map(l => l.name);
  
  // 从标签推断类型和分类
  let type = 'article';
  let category = 'uncategorized';
  let status = 'backlog';
  
  for (const label of labels) {
    if (label.startsWith('content/')) {
      type = label.replace('content/', '');
    }
    if (label.startsWith('category/')) {
      category = label.replace('category/', '');
    }
    if (label.startsWith('status/')) {
      status = label.replace('status/', '');
    }
  }
  
  // 优先使用 Frontmatter 的值
  const fm = {
    title: frontmatter.title || issue.title,
    slug: frontmatter.slug || generateSlug(issue.title),
    category: frontmatter.category || category,
    tags: frontmatter.tags || [],
    status: frontmatter.status || status,
    published_at: frontmatter.published_at || null,
    type: frontmatter.type || type
  };
  
  let markdown = '---\n';
  for (const [key, value] of Object.entries(fm)) {
    if (Array.isArray(value)) {
      markdown += `${key}: ${JSON.stringify(value)}\n`;
    } else if (value === null) {
      markdown += `${key}: null\n`;
    } else {
      markdown += `${key}: "${value}"\n`;
    }
  }
  markdown += '---\n\n';
  
  markdown += content;
  
  // 添加元数据
  markdown += `\n\n---\n\n`;
  markdown += `> 📌 Issue #${issue.number} | 作者: ${issue.user.login} | 创建于: ${new Date(issue.created_at).toLocaleDateString('zh-CN')}\n`;
  
  return markdown;
}

// 主函数
async function main() {
  const options = parseArgs();
  
  if (!options.repo) {
    console.error('错误: 必须指定 --repo 参数');
    process.exit(1);
  }
  
  // 创建输出目录
  const outputDir = path.resolve(options.output);
  fs.mkdirSync(outputDir, { recursive: true });
  
  console.log(`📥 正在同步 Issues...`);
  console.log(`   仓库: ${options.repo}`);
  console.log(`   输出: ${outputDir}`);
  
  let issues = [];
  
  if (options.issue) {
    // 同步指定 Issue
    console.log(`   Issue: #${options.issue}`);
    const issue = await getIssue(options.repo, options.issue, options.token);
    issues = [issue];
  } else {
    // 同步所有 Issues
    console.log(`   模式: ${options.force ? '强制同步所有' : '同步开放 Issues'}`);
    issues = await listIssues(options.repo, options.token, { force: options.force });
  }
  
  console.log(`   找到 ${issues.length} 个 Issue\n`);
  
  // 按类型分组
  const byType = {};
  
  for (const issue of issues) {
    const body = issue.body || '';
    const frontmatter = extractFrontmatter(body);
    
    let type = 'article';
    for (const label of issue.labels.map(l => l.name)) {
      if (label.startsWith('content/')) {
        type = label.replace('content/', '');
      }
    }
    if (frontmatter.type) type = frontmatter.type;
    
    if (!byType[type]) {
      byType[type] = [];
    }
    byType[type].push(issue);
  }
  
  // 生成文件
  for (const [type, typeIssues] of Object.entries(byType)) {
    const typeDir = path.join(outputDir, type);
    fs.mkdirSync(typeDir, { recursive: true });
    
    console.log(`📝 ${type} (${typeIssues.length} 个):`);
    
    for (const issue of typeIssues) {
      const markdown = generateMarkdown(issue);
      const slug = generateSlug(issue.title);
      const filename = `${slug}.md`;
      const filepath = path.join(typeDir, filename);
      
      fs.writeFileSync(filepath, markdown, 'utf-8');
      console.log(`   ✓ ${filename} (Issue #${issue.number})`);
    }
  }
  
  // 生成索引文件
  const indexData = {
    generated_at: new Date().toISOString(),
    total: issues.length,
    by_type: {}
  };
  
  for (const [type, typeIssues] of Object.entries(byType)) {
    indexData.by_type[type] = typeIssues.map(i => ({
      number: i.number,
      title: i.title,
      slug: generateSlug(i.title),
      url: i.html_url,
      status: i.state,
      labels: i.labels.map(l => l.name)
    }));
  }
  
  fs.writeFileSync(
    path.join(outputDir, 'index.json'),
    JSON.stringify(indexData, null, 2),
    'utf-8'
  );
  
  console.log(`\n✅ 同步完成！共生成 ${issues.length} 个文件`);
  console.log(`   索引文件: ${path.join(outputDir, 'index.json')}`);
}

main().catch(err => {
  console.error('错误:', err.message);
  process.exit(1);
});
