'use client';

export function Pagination({
  page,
  total,
  onChange,
}: {
  page: number;
  total: number;
  onChange: (p: number) => void;
}) {
  if (total <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-2 mt-12" aria-label="Pagination">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="px-3 py-1.5 text-sm rounded-lg border border-[var(--glass-border)] text-[var(--text-secondary)] disabled:opacity-30 hover:border-[var(--glass-border-hover)] transition-colors"
      >
        Previous
      </button>
      {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
            n === page
              ? 'bg-[var(--accent-gold)] text-black border-[var(--accent-gold)]'
              : 'border-[var(--glass-border)] text-[var(--text-secondary)] hover:border-[var(--glass-border-hover)]'
          }`}
        >
          {n}
        </button>
      ))}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= total}
        className="px-3 py-1.5 text-sm rounded-lg border border-[var(--glass-border)] text-[var(--text-secondary)] disabled:opacity-30 hover:border-[var(--glass-border-hover)] transition-colors"
      >
        Next
      </button>
    </nav>
  );
}
