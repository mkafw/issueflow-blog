import { getPosts } from '@/lib/content';

export interface TagInfo {
  name: string;
  count: number;
}

export function getAllTags(): TagInfo[] {
  const posts = getPosts();
  const tagMap = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.data.tags ?? []) {
      tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function getPostsByTag(tag: string) {
  return getPosts().filter((p) => (p.data.tags ?? []).includes(tag));
}
