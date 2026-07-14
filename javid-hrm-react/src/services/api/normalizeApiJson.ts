import type { ApiResult } from './types';

function toPascalCaseKey(key: string): string {
  if (!key) return key;
  return key.charAt(0).toUpperCase() + key.slice(1);
}

export function normalizeApiJson<T>(value: unknown): T {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeApiJson(item)) as T;
  }

  if (value !== null && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const normalized: Record<string, unknown> = {};

    for (const [key, nestedValue] of Object.entries(record)) {
      normalized[toPascalCaseKey(key)] = normalizeApiJson(nestedValue);
    }

    return normalized as T;
  }

  return value as T;
}

export async function parseApiResult<T>(response: Response): Promise<ApiResult<T>> {
  const raw = (await response.json()) as unknown;
  return normalizeApiJson<ApiResult<T>>(raw);
}
