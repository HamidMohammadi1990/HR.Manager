import { apiRequest } from './client';

export async function getMyPermissions(): Promise<number[]> {
  const result = await apiRequest<{ Permissions: number[] }>('/api/v1/account/my-permissions', {
    method: 'POST',
    auth: true,
  });

  return result.Data?.Permissions ?? [];
}
