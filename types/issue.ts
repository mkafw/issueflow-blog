export interface GitHubLabel {
  id: number;
  name: string;
  color: string;
  description?: string;
}

export interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface GitHubIssue {
  number: number;
  title: string;
  body: string | null;
  state: 'open' | 'closed';
  labels: GitHubLabel[];
  user: GitHubUser;
  created_at: string;
  updated_at: string;
  html_url: string;
  pull_request?: unknown;
}

export interface ParsedIssue {
  id: number;
  url: string;
  title: string;
  body: string;
  frontmatter: Record<string, unknown>;
  content: string;
  type: string;
  category: string;
  status: string;
  labels: string[];
  createdAt: string;
  updatedAt: string;
  author: string;
}
