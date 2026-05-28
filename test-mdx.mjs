import { createMDXSource } from "fumadocs-mdx";
import { loader } from "fumadocs-core/source";

// Create a mock docs array similar to what .source/index.ts produces
const mockDocs = [{
  info: { path: "test.md", absolutePath: "/tmp/test.md" },
  data: { 
    default: () => "<div>test</div>",
    frontmatter: { title: "Test", description: "Test page" },
    toc: [],
    structuredData: { contents: [], headings: [] }
  }
}];

try {
  const source = createMDXSource(mockDocs);
  const docsSource = loader({ source, baseUrl: "/" });
  const params = docsSource.generateParams();
  console.log("SUCCESS:", JSON.stringify(params));
} catch(e) {
  console.error("ERROR:", e.message);
  console.error(e.stack?.split('\n').slice(0, 10).join('\n'));
}