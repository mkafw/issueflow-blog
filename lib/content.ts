import { docs } from '../.source';
import { createMDXSource } from 'fumadocs-mdx';
import type { Post } from '@/types';

interface SourceFile {
  type: string;
  path: string;
  data: {
    title?: string;
    description?: string;
    date?: string | Date;
    draft?: boolean;
    tags?: string[];
    category?: string;
    [key: string]: unknown;
  };
}

function getFiles(): SourceFile[] {
  const source = createMDXSource(docs);
  return (source as unknown as { files(): SourceFile[] }).files();
}

export function getPosts(): Post[] {
  return getFiles()
    .filter((f) => f.type === 'page')
    .map((f) => ({
      slug: f.path.replace(/\.mdx?$/, ''),
      url: `/${f.path.replace(/\.mdx?$/, '')}`,
      data: {
        title: f.data.title ?? f.path,
        description: f.data.description,
        date: f.data.date ? String(f.data.date) : undefined,
        draft: f.data.draft,
        tags: f.data.tags,
        category: f.data.category,
      },
    }));
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}
