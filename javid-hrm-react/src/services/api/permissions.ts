import { apiRequest } from './client';
import type { GetAllPermissionsRequest, PagedResult, PermissionDto } from './types';

export async function getAllPermissions(
  request: GetAllPermissionsRequest,
): Promise<PagedResult<PermissionDto>> {
  const result = await apiRequest<PagedResult<PermissionDto>>('/api/v1/admin/permission/get-all', {
    method: 'POST',
    body: request,
    auth: true,
  });

  if (!result.Data) {
    throw new Error('پاسخ لیست دسترسی‌ها نامعتبر است');
  }

  return result.Data;
}
