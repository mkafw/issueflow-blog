'use client';

import { useEffect, useState } from 'react';

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full flex items-center justify-center text-sm border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md text-[var(--text-secondary)] hover:text-[var(--accent-gold)] hover:border-[var(--glass-border-hover)] transition-all"
      aria-label="Back to top"
    >
      ↑
    </button>
  );
}
