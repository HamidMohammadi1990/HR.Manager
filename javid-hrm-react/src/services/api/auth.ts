import { apiRequest } from './client';
import type {
  ChangePasswordRequest,
  SignInRequest,
  SignInResponse,
  UpdateCurrentUserProfileRequest,
  UserDto,
} from './types';
import { clearTokens, setTokens } from './tokenStorage';

export async function getCurrentUser(): Promise<UserDto> {
  const result = await apiRequest<UserDto>('/api/v1/account/current-user', {
    method: 'POST',
    auth: true,
  });

  if (!result.Data) {
    throw new Error('اطلاعات کاربر یافت نشد');
  }

  return result.Data;
}

export async function updateCurrentUserProfile(
  request: UpdateCurrentUserProfileRequest,
): Promise<void> {
  await apiRequest('/api/v1/account/update-profile', {
    method: 'PUT',
    body: request,
    auth: true,
  });
}

export async function changePassword(request: ChangePasswordRequest): Promise<void> {
  const result = await apiRequest<SignInResponse>('/api/v1/account/change-password', {
    method: 'POST',
    body: request,
    auth: true,
  });

  if (!result.Data) {
    throw new Error('تغییر رمز عبور ناموفق بود');
  }

  setTokens(result.Data.AccessToken, result.Data.RefreshToken);
}

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
