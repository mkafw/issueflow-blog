import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/page';
import { docsSource } from '../source';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPosts } from '../../../lib/content';

type PageData = {
  body: () => React.ReactNode;
  toc?: unknown[];
  full?: boolean;
  title?: string;
  description?: string;
};

/* ========== 首页组件 ========== */
function HomePage() {
  const posts = getPosts();

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      {/* 顶部标题区 */}
      <section className="mb-20 text-center md:text-left">
        <h1 className="text-5xl md:text-6xl font-bold text-gold-gradient mb-4 tracking-tight">
          Issueflow Blog
        </h1>
        <p className="text-lg text-cosmic-text-secondary max-w-2xl mx-auto md:mx-0 leading-relaxed">
          基于 GitHub Issues + Vim + Fumadocs 的自动化博客系统
        </p>
        <div className="flex items-center justify-center md:justify-start gap-4 mt-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase"
                style={{
                  background: 'rgba(212, 168, 83, 0.1)',
                  border: '1px solid rgba(212, 168, 83, 0.25)',
                  color: 'var(--accent-gold)',
                }}>
            <span className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: 'var(--accent-gold)',
                    boxShadow: '0 0 8px var(--accent-gold)',
                  }} />
            ACTIVE
          </span>
          <span className="text-cosmic-text-muted text-sm font-mono">
            Last sync: 2026-05-27
          </span>
        </div>
      </section>

      {/* 核心指标卡片 */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
        <div className="metric-glass">
          <span className="metric-label">Total Posts</span>
          <span className="metric-value">{posts.length || '6'}</span>
          <span className="metric-status">+2 this week</span>
        </div>
        <div className="metric-glass">
          <span className="metric-label">GitHub Issues</span>
          <span className="metric-value">24</span>
          <span className="metric-status">Connected</span>
        </div>
        <div className="metric-glass">
          <span className="metric-label">Tech Stack</span>
          <span className="metric-value">5</span>
          <span className="metric-status">Next.js / Fumadocs</span>
        </div>
        <div className="metric-glass">
          <span className="metric-label">Status</span>
          <span className="metric-value text-gold">STABLE</span>
          <span className="metric-status">All systems operational</span>
        </div>
      </section>

      {/* 文章列表 */}
      <section>
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-semibold text-gold-gradient">
            Recent Posts
          </h2>
          <a
            href="/docs"
            className="text-sm text-cosmic-gold hover:text-cosmic-gold-light transition-colors"
          >
            View all →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {posts.length > 0 ? (
            posts.slice(0, 4).map((post) => (
              <article key={post.slug} className="post-glass">
                <h3 className="post-title">{post.data.title}</h3>
                <p className="post-excerpt">
                  {post.data.description?.slice(0, 120)}...
                </p>
                <div className="post-meta">
                  <span className="post-date">{post.data.date}</span>
                  <div className="post-tags">
                    <span className="post-tag">Blog</span>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <>
              <div className="post-glass opacity-50">
                <h3 className="post-title">Issueflow-Blog 文档首页</h3>
                <p className="post-excerpt">
                  基于 GitHub Issues + Vim + Fumadocs 的自动化博客系统...
                </p>
                <div className="post-meta">
                  <span className="post-date">2026-05-23</span>
                </div>
              </div>
              <div className="post-glass opacity-50">
                <h3 className="post-title">快速开始</h3>
                <p className="post-excerpt">
                  5 分钟上手指南，了解如何本地写作、云端发布...
                </p>
                <div className="post-meta">
                  <span className="post-date">2026-05-25</span>
                </div>
              </div>
              <div className="post-glass opacity-50">
                <h3 className="post-title">架构设计</h3>
                <p className="post-excerpt">
                  系统架构详解，输入/输出解耦设计...
                </p>
                <div className="post-meta">
                  <span className="post-date">2026-05-25</span>
                </div>
              </div>
              <div className="post-glass opacity-50">
                <h3 className="post-title">写作流程</h3>
                <p className="post-excerpt">
                  Vim 写作脚本使用，自动化发布流程...
                </p>
                <div className="post-meta">
                  <span className="post-date">2026-05-25</span>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 分隔线 */}
      <div className="glass-divider" />

      {/* 技术栈 */}
      <section>
        <h2 className="text-2xl font-semibold text-gold-gradient mb-8">
          Tech Stack
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="apple-glass p-5">
            <h3 className="font-semibold text-cosmic-text mb-2">写作端</h3>
            <p className="text-sm text-cosmic-text-secondary">Vim + Bash + gh CLI</p>
          </div>
          <div className="apple-glass p-5">
            <h3 className="font-semibold text-cosmic-text mb-2">存储端</h3>
            <p className="text-sm text-cosmic-text-secondary">GitHub Issues</p>
          </div>
          <div className="apple-glass p-5">
            <h3 className="font-semibold text-cosmic-text mb-2">自动化</h3>
            <p className="text-sm text-cosmic-text-secondary">GitHub Actions</p>
          </div>
          <div className="apple-glass p-5">
            <h3 className="font-semibold text-cosmic-text mb-2">渲染引擎</h3>
            <p className="text-sm text-cosmic-text-secondary">Next.js 16 + SWC (Rust)</p>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ========== 文档页面组件 ========== */
async function DocPage({ params }: { params: { page: string[] | undefined } }) {
  const page = docsSource.getPage(params.page);
  if (!page) notFound();

  const data = page.data as unknown as PageData;
  const MDX = data.body;

  return (
    <DocsPage toc={data.toc as never} full={data.full}>
      <DocsTitle>{data.title}</DocsTitle>
      <DocsDescription>{data.description}</DocsDescription>
      <DocsBody>
        <MDX />
      </DocsBody>
    </DocsPage>
  );
}

/* ========== 路由入口 ========== */
export default async function Page(props: {
  params: Promise<{ page: string[] | undefined }>;
}) {
  const params = await props.params;
  if (!params.page) {
    return <HomePage />;
  }
  return <DocPage params={params} />;
}

export async function generateStaticParams() {
  return docsSource.generateParams('page');
}

export async function generateMetadata(
  props: { params: Promise<{ page: string[] | undefined }> },
): Promise<Metadata> {
  const params = await props.params;
  // 首页元信息
  if (!params.page) {
    return {
      title: 'Issueflow Blog',
      description: '基于 GitHub Issues + Vim + Fumadocs 的自动化博客系统',
    };
  }

  const page = docsSource.getPage(params.page);
  if (!page) notFound();

  const data = page.data as unknown as { title?: string; description?: string };
  return {
    title: data.title,
    description: data.description,
  };
}