const ACCESS_TOKEN_KEY = 'javid_hrm_access_token';
const REFRESH_TOKEN_KEY = 'javid_hrm_refresh_token';

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function hasStoredSession(): boolean {
  return Boolean(getAccessToken() && getRefreshToken());
}

export interface JwtPayload {
  nameid?: string;
  unique_name?: string;
  name?: string;
  sub?: string;
}

export function parseJwtPayload(token: string): JwtPayload {
  try {
    const segment = token.split('.')[1];
    if (!segment) return {};
    const json = atob(segment.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json) as JwtPayload;
  } catch {
    return {};
  }
}

export function getUserNameFromToken(token: string): string | undefined {
  const payload = parseJwtPayload(token);
  return payload.unique_name ?? payload.name ?? payload.sub;
}

export function getUserIdFromToken(token: string): string | undefined {
  const payload = parseJwtPayload(token);
  return payload.nameid;
}
