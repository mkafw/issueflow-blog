import { logger } from '@/lib/logger';
import type { ApiErrorResponse } from '@/types';

const DEFAULT_TIMEOUT = 10_000;

class ApiError extends Error {
  status: number;
  body: string;

  constructor(status: number, body: string) {
    super(`HTTP ${status}`);
    this.status = status;
    this.body = body;
  }
}

async function request<T>(
  url: string,
  init?: RequestInit & { timeout?: number },
): Promise<T> {
  const controller = new AbortController();
  const timeout = init?.timeout ?? DEFAULT_TIMEOUT;
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, {
      ...init,
      signal: controller.signal,
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      logger.error('api request failed', { url, status: res.status, body: body.slice(0, 500) });
      throw new ApiError(res.status, body);
    }

    return res.json() as Promise<T>;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err instanceof DOMException && err.name === 'AbortError') {
      logger.error('api request timeout', { url, timeout });
      throw new Error(`Request timeout after ${timeout}ms: ${url}`);
    }
    logger.error('api request error', { url, error: String(err) });
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export { request, ApiError };
export type { ApiErrorResponse };
