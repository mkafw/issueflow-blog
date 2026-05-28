export interface ApiErrorResponse {
  status: number;
  message: string;
  body: string;
}

export interface SearchResult {
  id: string;
  title: string;
  url: string;
  description?: string;
  type: 'page' | 'post';
}

export interface FeedItem {
  title: string;
  url: string;
  description: string;
  date: string;
}
