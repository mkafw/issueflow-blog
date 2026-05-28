import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const SITE_URL = process.env.SITE_URL ?? 'https://issueflow-blog.netlify.app';

function parseFrontmatter(content: string) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const data: Record<string, string> = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  }
  return data;
}

export async function GET() {
  const dir = join(process.cwd(), 'content/docs');
  const posts = readdirSync(dir)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map((f) => {
      const raw = readFileSync(join(dir, f), 'utf-8');
      const fm = parseFrontmatter(raw);
      const slug = f.replace(/\.mdx?$/, '');
      return { slug, title: fm.title ?? slug, description: fm.description ?? '', date: fm.date ?? '' };
    });

  const items = posts.map((p) =>
    `<item>
      <title><![CDATA[${p.title}]]></title>
      <link>${SITE_URL}/${p.slug}</link>
      <description><![CDATA[${p.description}]]></description>
      ${p.date ? `<pubDate>${new Date(p.date).toUTCString()}</pubDate>` : ''}
      <guid>${SITE_URL}/${p.slug}</guid>
    </item>`
  ).join('\n');

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Issueflow Blog</title>
    <link>${SITE_URL}</link>
    <description>基于 GitHub Issues + Vim + Fumadocs 的自动化博客系统</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/api/rss" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
