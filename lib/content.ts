// 内容类型定义
export interface Post {
  slug: string;
  data: {
    title: string;
    description?: string;
    date?: string;
    draft?: boolean;
  };
}

// 获取所有文档帖子
// 在服务端组件中通过 Fumadocs loader 获取
export function getPosts(): Post[] {
  // 运行时返回空数组，实际数据由 Fumadocs MDX 在构建时注入
  return [];
}

// 获取单个帖子
export function getPost(slug: string) {
  return null;
}