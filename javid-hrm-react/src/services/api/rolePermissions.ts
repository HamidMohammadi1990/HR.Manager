import { apiRequest } from './client';
import type {
  CreateRolePermissionRequest,
  CreateRolePermissionResponse,
  GetAllRolePermissionsRequest,
  PagedResult,
  RolePermissionDto,
} from './types';

export async function getAllRolePermissions(
  request: GetAllRolePermissionsRequest,
): Promise<PagedResult<RolePermissionDto>> {
  const result = await apiRequest<PagedResult<RolePermissionDto>>('/api/v1/admin/role-permission/get-all', {
    method: 'POST',
    body: request,
    auth: true,
  });

  if (!result.Data) {
    throw new Error('پاسخ لیست دسترسی‌های نقش نامعتبر است');
  }

  return result.Data;
}

export async function createRolePermission(
  request: CreateRolePermissionRequest,
): Promise<CreateRolePermissionResponse> {
  const result = await apiRequest<CreateRolePermissionResponse>('/api/v1/admin/role-permission/create', {
    method: 'POST',
    body: request,
    auth: true,
  });

  if (!result.Data) {
    throw new Error('پاسخ تخصیص دسترسی نامعتبر است');
  }

  return result.Data;
}

export async function deleteRolePermission(id: string): Promise<void> {
  await apiRequest('/api/v1/admin/role-permission/delete', {
    method: 'DELETE',
    body: { Id: id },
    auth: true,
  });
}
