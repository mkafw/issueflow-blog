export interface PostFrontmatter {
  title: string;
  description?: string;
  date?: string;
  draft?: boolean;
  tags?: string[];
  category?: string;
  author?: string;
  slug?: string;
}

export interface Post {
  slug: string;
  url: string;
  data: PostFrontmatter & {
    readingTime?: number;
  };
}
