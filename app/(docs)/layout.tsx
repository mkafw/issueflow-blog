import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { docsSource } from './source';

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={docsSource.getPageTree()}
      nav={{
        title: 'Issueflow Blog',
        url: '/docs',
      }}
      links={[
        {
          text: '文档',
          url: '/docs',
          active: 'nested-url',
        },
        {
          text: 'GitHub',
          url: 'https://github.com/mkafw/issueflow-blog',
          external: true,
        },
      ]}
    >
      {children}
    </DocsLayout>
  );
}