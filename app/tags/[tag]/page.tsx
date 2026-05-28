import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllTags, getPostsByTag } from '@/lib/tags';
import { PostCardList } from '@/components/PostCard';
import { EmptyState } from '@/components/EmptyState';
import { BackToTop } from '@/components/BackToTop';

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  return getAllTags().map((t) => ({ tag: t.name }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `${tag} | Issueflow Blog`,
    description: `浏览标签 "${tag}" 下的所有文章`,
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);

  if (posts.length === 0) notFound();

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <BackToTop />
      <h1 className="text-4xl font-bold text-gold-gradient mb-2">#{tag}</h1>
      <p className="text-cosmic-text-secondary mb-10">{posts.length} 篇文章</p>
      {posts.length > 0 ? <PostCardList posts={posts} /> : <EmptyState title="暂无文章" />}
      <div className="mt-10">
        <a href="/tags" className="text-sm text-cosmic-gold hover:text-cosmic-gold-light transition-colors">
          ← 所有标签
        </a>
      </div>
    </main>
  );
}
