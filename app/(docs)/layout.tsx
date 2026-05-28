import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { docsSource } from './source';
import { LayoutWrapper } from './layout-wrapper';

const tree = docsSource.getPageTree();

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <LayoutWrapper
      tree={tree}
      docsLayout={
        <DocsLayout
          tree={tree}
          nav={{ title: 'Issueflow Blog', url: '/' }}
          githubUrl="https://github.com/mkafw/issueflow-blog"
          sidebar={{
            collapsible: true,
            defaultOpenLevel: 1,
            footer: (
              <div className="px-3 py-2 text-xs text-[var(--text-muted)]">
                Issueflow Blog &copy; 2026
              </div>
            ),
          }}
          themeSwitch={{ enabled: true, mode: 'light-dark' }}
          links={[
            { text: '首页', url: '/', active: 'url' },
            { text: 'GitHub', url: 'https://github.com/mkafw/issueflow-blog', external: true },
          ]}
        >
          {children}
        </DocsLayout>
      }
    >
      {children}
    </LayoutWrapper>
  );
}
