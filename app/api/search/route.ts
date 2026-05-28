import { type NextRequest, NextResponse } from 'next/server';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

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

function getContentPosts() {
  const dir = join(process.cwd(), 'content/docs');
  try {
    return readdirSync(dir)
      .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
      .map((f) => {
        const raw = readFileSync(join(dir, f), 'utf-8');
        const fm = parseFrontmatter(raw);
        const slug = f.replace(/\.mdx?$/, '');
        return { slug, title: fm.title ?? slug, description: fm.description ?? '', url: `/${slug}` };
      });
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get('q') ?? '').toLowerCase();
  const posts = getContentPosts();

  if (!q.trim()) return NextResponse.json([]);

  return NextResponse.json(
    posts
      .filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
      .slice(0, 10)
      .map((p) => ({ id: p.slug, title: p.title, content: p.description, url: p.url, type: 'page' })),
  );
}
