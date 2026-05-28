export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="apple-glass p-12 text-center">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
      {description && <p className="text-sm text-[var(--text-secondary)]">{description}</p>}
    </div>
  );
}
