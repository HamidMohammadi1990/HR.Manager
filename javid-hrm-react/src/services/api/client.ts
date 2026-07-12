import type { ApiResult } from './types';
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from './tokenStorage';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly messages: { Code: string; Message: string }[] = [],
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  auth?: boolean;
  skipRefresh?: boolean;
};

let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  if (!accessToken || !refreshToken) return false;

  const response = await fetch(`${API_BASE}/api/v1/account/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ Token: accessToken, RefreshToken: refreshToken }),
  });

  if (!response.ok) {
    clearTokens();
    return false;
  }

  const result = (await response.json()) as ApiResult<{
    AccessToken: string;
    RefreshToken: string;
  }>;

  if (!result.IsSuccess || !result.Data) {
    clearTokens();
    return false;
  }

  setTokens(result.Data.AccessToken, result.Data.RefreshToken);
  return true;
}

async function ensureRefreshed(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiResult<T>> {
  const { body, auth = false, skipRefresh = false, headers, ...init } = options;

  const requestHeaders = new Headers(headers);
  requestHeaders.set('Accept', 'application/json');
  if (body !== undefined) {
    requestHeaders.set('Content-Type', 'application/json');
  }
  if (auth) {
    const token = getAccessToken();
    if (token) requestHeaders.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401 && auth && !skipRefresh) {
    const refreshed = await ensureRefreshed();
    if (refreshed) {
      return apiRequest<T>(path, { ...options, skipRefresh: true });
    }
  }

  const result = (await response.json()) as ApiResult<T>;

  if (!result.IsSuccess) {
    const message = result.Messages?.[0]?.Message ?? 'درخواست با خطا مواجه شد';
    throw new ApiError(message, result.StatusCode, result.Messages ?? []);
  }

  return result;
}

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return 'خطای ناشناخته';
}
