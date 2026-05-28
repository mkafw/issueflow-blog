import type { Metadata } from 'next';
import { getAllTags } from '@/lib/tags';
import { BackToTop } from '@/components/BackToTop';

export const metadata: Metadata = {
  title: '标签 | Issueflow Blog',
  description: '浏览所有文章标签',
};

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <BackToTop />
      <h1 className="text-4xl font-bold text-gold-gradient mb-4">标签</h1>
      <p className="text-cosmic-text-secondary mb-10">共 {tags.length} 个标签</p>

      {tags.length === 0 ? (
        <div className="apple-glass p-12 text-center">
          <p className="text-cosmic-text-secondary">暂无标签，同步文章后显示</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <a
              key={tag.name}
              href={`/tags/${encodeURIComponent(tag.name)}`}
              className="apple-glass px-5 py-3 hover:scale-105 transition-transform"
            >
              <span className="text-cosmic-gold font-medium">{tag.name}</span>
              <span className="ml-2 text-xs text-cosmic-text-muted">({tag.count})</span>
            </a>
          ))}
        </div>
      )}
    </main>
  );
}
