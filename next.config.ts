import { createMDX } from 'fumadocs-mdx/next';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 去掉 static export，使用 SSR 模式
  // Fumadocs UI 需要客户端 JS 来设置 CSS 变量（--fd-sidebar-width 等）
  // 纯静态导出会导致这些变量为 0px，布局崩坏
  // Netlify 原生支持 Next.js SSR，不需要 static export
  images: {
    unoptimized: true,
  },
};

export default createMDX({
  configPath: 'source.config.ts',
})(nextConfig);
