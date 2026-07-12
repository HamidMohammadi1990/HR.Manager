import { apiRequest } from './client';
import type {
  CreateUserRoleRequest,
  CreateUserRoleResponse,
  GetAllUserRolesRequest,
  PagedResult,
  UserRoleDto,
} from './types';

export async function getAllUserRoles(
  request: GetAllUserRolesRequest,
): Promise<PagedResult<UserRoleDto>> {
  const result = await apiRequest<PagedResult<UserRoleDto>>('/api/v1/admin/user-role/get-all', {
    method: 'POST',
    body: request,
    auth: true,
  });

  if (!result.Data) {
    throw new Error('پاسخ لیست نقش‌های کاربر نامعتبر است');
  }

  return result.Data;
}

export async function createUserRole(request: CreateUserRoleRequest): Promise<CreateUserRoleResponse> {
  const result = await apiRequest<CreateUserRoleResponse>('/api/v1/admin/user-role/create', {
    method: 'POST',
    body: request,
    auth: true,
  });

  if (!result.Data) {
    throw new Error('پاسخ تخصیص نقش نامعتبر است');
  }

  return result.Data;
}

export async function deleteUserRole(id: string): Promise<void> {
  await apiRequest('/api/v1/admin/user-role/delete', {
    method: 'DELETE',
    body: { Id: id },
    auth: true,
  });
}
