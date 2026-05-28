import type { GitHubIssue, ParsedIssue } from '@/types';

const CONTENT_TYPE_LABELS: Record<string, string> = {
  'content/article': 'article',
  'content/idea': 'idea',
  'content/snippet': 'snippet',
  'content/resource': 'resource',
};

const STATUS_LABELS: Record<string, string> = {
  'status/backlog': 'backlog',
  'status/in-progress': 'in_progress',
  'status/review': 'review',
  'status/published': 'published',
};

const CATEGORY_LABELS: Record<string, string> = {
  'category/tech': 'tech',
  'category/design': 'design',
  'category/life': 'life',
  'category/learning': 'learning',
};

export function extractFrontmatter(body: string): Record<string, unknown> {
  const match = body.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const data: Record<string, unknown> = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value: string | string[] = line.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (value.startsWith('[') && value.endsWith(']')) {
      try { value = JSON.parse(value) as string[]; } catch { /* keep raw */ }
    }
    data[key] = value;
  }
  return data;
}

export function extractContent(body: string): string {
  const match = body.match(/^---\n[\s\S]*?\n---\n([\s\S]*)/);
  return match ? match[1].trim() : body;
}

function pickLabel(labels: string[], map: Record<string, string>, fallback: string): string {
  for (const label of labels) {
    if (map[label]) return map[label];
  }
  return fallback;
}

export function parseIssue(issue: GitHubIssue): ParsedIssue {
  const labels = issue.labels.map((l) => l.name);
  const body = issue.body ?? '';
  const frontmatter = extractFrontmatter(body);
  const content = extractContent(body);

  return {
    id: issue.number,
    url: issue.html_url,
    title: issue.title,
    body,
    frontmatter,
    content,
    type: String(frontmatter.type ?? pickLabel(labels, CONTENT_TYPE_LABELS, 'article')),
    category: String(frontmatter.category ?? pickLabel(labels, CATEGORY_LABELS, 'uncategorized')),
    status: String(frontmatter.status ?? pickLabel(labels, STATUS_LABELS, 'backlog')),
    labels,
    createdAt: issue.created_at,
    updatedAt: issue.updated_at,
    author: issue.user.login,
  };
}

export function toMarkdown(parsed: ParsedIssue): string {
  const lines = ['---'];
  for (const [key, value] of Object.entries(parsed.frontmatter)) {
    if (Array.isArray(value)) lines.push(`${key}: ${JSON.stringify(value)}`);
    else lines.push(`${key}: "${value}"`);
  }
  lines.push('---', '', parsed.content);
  lines.push('', '---', '', `> Issue #${parsed.id} | ${parsed.author} | ${new Date(parsed.createdAt).toLocaleDateString('zh-CN')}`);
  return lines.join('\n');
}

export function generateSlug(title: string, custom?: string): string {
  if (custom) return custom;
  return title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}
