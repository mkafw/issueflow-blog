import { createMDX } from 'fumadocs-mdx/next';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
};

export default createMDX({
  configPath: 'fumadocs.config.ts',
})(nextConfig);
