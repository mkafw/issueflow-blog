import Link from 'next/link';
import type { Post } from '@/types';

export function PostCard({ post }: { post: Post }) {
  const { slug, data } = post;
  return (
    <article className="post-glass group">
      <Link href={`/${slug}`}>
        <h3 className="post-title group-hover:text-[var(--accent-gold-light)] transition-colors">
          {data.title}
        </h3>
        {data.description && (
          <p className="post-excerpt">{data.description.slice(0, 120)}{data.description.length > 120 ? '...' : ''}</p>
        )}
        <div className="post-meta">
          {data.date && <span className="post-date">{data.date}</span>}
          {data.tags && data.tags.length > 0 && (
            <div className="post-tags">
              {data.tags.map((tag) => (
                <a key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="post-tag" onClick={(e) => e.stopPropagation()}>{tag}</a>
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}

export function PostCardList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
