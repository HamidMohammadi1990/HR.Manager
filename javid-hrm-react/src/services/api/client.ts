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

export interface BinaryDownloadResult {
  blob: Blob;
  fileName: string;
  contentType: string;
}

function base64ToBlob(base64: string, contentType: string): Blob {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: contentType });
}

function getFileNameFromDisposition(header: string | null): string | undefined {
  if (!header) return undefined;
  const match = /filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/i.exec(header);
  return match?.[1] ? decodeURIComponent(match[1]) : undefined;
}

export function saveBinaryDownload(result: BinaryDownloadResult): void {
  const url = URL.createObjectURL(result.blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = result.fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function apiDownloadBinary(
  path: string,
  body?: unknown,
): Promise<BinaryDownloadResult> {
  const makeRequest = async () => {
    const requestHeaders = new Headers();
    requestHeaders.set(
      'Accept',
      'application/json, application/octet-stream, application/pdf, */*',
    );
    if (body !== undefined) {
      requestHeaders.set('Content-Type', 'application/json');
    }
    const token = getAccessToken();
    if (token) requestHeaders.set('Authorization', `Bearer ${token}`);

    return fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: requestHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  };

  let response = await makeRequest();
  if (response.status === 401) {
    const refreshed = await ensureRefreshed();
    if (refreshed) response = await makeRequest();
  }

  const contentType = response.headers.get('Content-Type') ?? '';

  if (contentType.includes('application/json')) {
    const result = (await response.json()) as ApiResult<{
      PdfBytes?: string;
      FileBytes?: string;
      FileName: string;
      ContentType: string;
    }>;
    if (!result.IsSuccess || !result.Data) {
      const message = result.Messages?.[0]?.Message ?? 'درخواست با خطا مواجه شد';
      throw new ApiError(message, result.StatusCode, result.Messages ?? []);
    }
    const data = result.Data;
    const base64 = data.PdfBytes ?? data.FileBytes;
    if (!base64) throw new ApiError('فایل یافت نشد', response.status);
    return {
      blob: base64ToBlob(base64, data.ContentType || 'application/octet-stream'),
      fileName: data.FileName,
      contentType: data.ContentType,
    };
  }

  if (!response.ok) {
    try {
      const err = (await response.json()) as ApiResult;
      const message = err.Messages?.[0]?.Message ?? 'درخواست با خطا مواجه شد';
      throw new ApiError(message, response.status, err.Messages ?? []);
    } catch (e) {
      if (e instanceof ApiError) throw e;
      throw new ApiError('درخواست با خطا مواجه شد', response.status);
    }
  }

  const blob = await response.blob();
  const fileName =
    getFileNameFromDisposition(response.headers.get('Content-Disposition')) ?? 'download';
  return {
    blob,
    fileName,
    contentType: contentType || blob.type || 'application/octet-stream',
  };
}
