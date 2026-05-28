import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/page';
import { docsSource } from '../source';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPosts } from '@/lib/content';
import { PostCardList } from '@/components/PostCard';
import { MetricCard } from '@/components/MetricCard';
import { EmptyState } from '@/components/EmptyState';
import { ReadingProgress } from '@/components/ReadingProgress';
import { BackToTop } from '@/components/BackToTop';

function HomePage() {
  const posts = getPosts();
  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <ReadingProgress />
      <BackToTop />

      <section className="mb-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gold-gradient mb-4 tracking-tight">
          Issueflow Blog
        </h1>
        <p className="text-lg text-cosmic-text-secondary max-w-2xl mx-auto leading-relaxed">
          基于 GitHub Issues + Vim + Fumadocs 的自动化博客系统
        </p>
        <div className="flex items-center justify-center gap-4 mt-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase"
            style={{ background: 'rgba(212,168,83,0.1)', border: '1px solid rgba(212,168,83,0.25)', color: 'var(--accent-gold)' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent-gold)', boxShadow: '0 0 8px var(--accent-gold)' }} />
            ACTIVE
          </span>
          <span className="text-cosmic-text-muted text-sm font-mono">Last sync: 2026-05-27</span>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
        <MetricCard label="Total Posts" value={posts.length || 6} status="+2 this week" />
        <MetricCard label="GitHub Issues" value={24} status="Connected" />
        <MetricCard label="Tech Stack" value={5} status="Next.js / Fumadocs" />
        <MetricCard label="Status" value="STABLE" status="All systems operational" />
      </section>

      <section>
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-semibold text-gold-gradient">Recent Posts</h2>
          <a href="/architecture" className="text-sm text-cosmic-gold hover:text-cosmic-gold-light transition-colors">View all →</a>
        </div>
        {posts.length > 0 ? <PostCardList posts={posts.slice(0, 6)} /> : <EmptyState title="暂无文章" description="同步 GitHub Issues 后文章将显示在此处" />}
      </section>

      <div className="glass-divider" />

      <section>
        <h2 className="text-2xl font-semibold text-gold-gradient mb-8">Tech Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[['写作端', 'Vim + Bash + gh CLI'], ['存储端', 'GitHub Issues'], ['自动化', 'GitHub Actions'], ['渲染引擎', 'Next.js + SWC']].map(([t, d]) => (
            <div key={t} className="apple-glass p-5">
              <h3 className="font-semibold text-cosmic-text mb-2">{t}</h3>
              <p className="text-sm text-cosmic-text-secondary">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

async function DocPage({ params }: { params: { page: string[] | undefined } }) {
  const page = docsSource.getPage(params.page);
  if (!page) notFound();
  const data = page.data as unknown as { body: () => React.ReactNode; toc?: unknown[]; full?: boolean; title?: string; description?: string };
  const MDX = data.body;
  return (
    <DocsPage toc={data.toc as never} full={data.full}>
      <ReadingProgress />
      <DocsTitle>{data.title}</DocsTitle>
      <DocsDescription>{data.description}</DocsDescription>
      <DocsBody><MDX /></DocsBody>
      <BackToTop />
    </DocsPage>
  );
}

export default async function Page(props: { params: Promise<{ page: string[] | undefined }> }) {
  const params = await props.params;
  if (!params.page) return <HomePage />;
  return <DocPage params={params} />;
}

export async function generateStaticParams() {
  return docsSource.generateParams('page');
}

export async function generateMetadata(props: { params: Promise<{ page: string[] | undefined }> }): Promise<Metadata> {
  const params = await props.params;
  if (!params.page) return { title: 'Issueflow Blog', description: '基于 GitHub Issues + Vim + Fumadocs 的自动化博客系统' };
  const page = docsSource.getPage(params.page);
  if (!page) notFound();
  const data = page.data as unknown as { title?: string; description?: string };
  return { title: data.title, description: data.description };
}
