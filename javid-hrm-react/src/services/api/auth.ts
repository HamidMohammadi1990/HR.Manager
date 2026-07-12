import { apiRequest } from './client';
import type { SignInRequest, SignInResponse } from './types';
import { clearTokens, setTokens } from './tokenStorage';

export async function signIn(request: SignInRequest): Promise<SignInResponse> {
  const result = await apiRequest<SignInResponse>('/api/v1/account/sign-in', {
    method: 'POST',
    body: request,
  });

  if (!result.Data) {
    throw new Error('پاسخ ورود نامعتبر است');
  }

  setTokens(result.Data.AccessToken, result.Data.RefreshToken);
  return result.Data;
}

export async function signOut(): Promise<void> {
  const token = localStorage.getItem('javid_hrm_access_token');
  if (token) {
    try {
      await apiRequest<boolean>('/api/v1/account/sign-out', {
        method: 'GET',
        auth: true,
      });
    } catch {
      // ignore sign-out errors locally
    }
  }
  clearTokens();
}
