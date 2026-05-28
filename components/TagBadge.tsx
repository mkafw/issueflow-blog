export function TagBadge({ tag, href }: { tag: string; href?: string }) {
  const span = <span className="post-tag">{tag}</span>;
  if (href) return <a href={href}>{span}</a>;
  return span;
}

export function TagList({ tags, baseUrl }: { tags: string[]; baseUrl?: string }) {
  if (tags.length === 0) return null;
  return (
    <div className="post-tags">
      {tags.map((tag) => (
        <TagBadge key={tag} tag={tag} href={baseUrl ? `${baseUrl}/${tag}` : undefined} />
      ))}
    </div>
  );
}
