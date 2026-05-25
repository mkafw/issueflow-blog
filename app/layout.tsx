import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Issueflow Blog',
  description: '基于 GitHub Issues 的自动化博客系统',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
