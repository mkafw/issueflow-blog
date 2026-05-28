'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export function LayoutWrapper({
  children,
  docsLayout,
}: {
  children: ReactNode;
  tree: unknown;
  docsLayout: ReactNode;
}) {
  const pathname = usePathname();

  // 首页不套 DocsLayout
  if (pathname === '/') {
    return <>{children}</>;
  }

  return <>{docsLayout}</>;
}
