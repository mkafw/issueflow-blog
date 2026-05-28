import { docs } from '../../.source';
import { createMDXSource } from 'fumadocs-mdx';
import { loader } from 'fumadocs-core/source';

const source = createMDXSource(docs);
// Runtime: source.files is () => array, despite types saying array
const files = (source as unknown as { files(): unknown[] }).files();

export const docsSource = loader(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { source: { ...source, files } as any, baseUrl: '/' },
);

export type DocsSource = typeof docsSource;