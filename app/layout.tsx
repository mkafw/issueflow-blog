import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { RootProvider } from 'fumadocs-ui/provider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: {
    default: 'Issueflow Blog',
    template: '%s | Issueflow Blog',
  },
  description: '基于 GitHub Issues + Vim + Fumadocs 的自动化博客系统',
  keywords: ['blog', 'github issues', 'automation', 'nextjs', 'fumadocs'],
  authors: [{ name: 'qiyu' }],
  creator: 'qiyu',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    title: 'Issueflow Blog',
    description: '基于 GitHub Issues 的自动化博客系统',
    siteName: 'Issueflow Blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Issueflow Blog',
    description: '基于 GitHub Issues 的自动化博客系统',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-cosmic text-cosmic-text`}>
        <RootProvider>
          {/* 宇宙光晕氛围 */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="glow-orb glow-orb-blue" />
            <div className="glow-orb glow-orb-purple" />
          </div>

          {/* 内容层 */}
          <div className="relative z-10 min-h-screen">
            {children}
          </div>
        </RootProvider>
      </body>
    </html>
  );
}
