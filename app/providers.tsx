'use client';

import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <div className={inter.className}>{children}</div>
  );
}
