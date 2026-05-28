import { request } from '@/lib/api/client';
import type { GitHubIssue } from '@/types';

const GITHUB_API = 'https://api.github.com';

function headers(): Record<string, string> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN is not set');
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'Issueflow-Blog',
  };
}

export async function listIssues(repo: string): Promise<GitHubIssue[]> {
  const [owner, repoName] = repo.split('/');
  const all: GitHubIssue[] = [];
  let page = 1;

  while (true) {
    const issues = await request<GitHubIssue[]>(
      `${GITHUB_API}/repos/${owner}/${repoName}/issues?state=all&per_page=100&page=${page}`,
      { headers: headers() },
    );
    if (issues.length === 0) break;
    all.push(...issues.filter((i) => !i.pull_request));
    if (issues.length < 100) break;
    page++;
  }

  return all;
}

export async function getIssue(repo: string, issueNumber: number): Promise<GitHubIssue> {
  const [owner, repoName] = repo.split('/');
  return request<GitHubIssue>(
    `${GITHUB_API}/repos/${owner}/${repoName}/issues/${issueNumber}`,
    { headers: headers() },
  );
}
