import { apiRequest } from './client';
import type { GetAllRolesRequest, PagedResult, RoleDto } from './types';

export async function getAllRoles(request: GetAllRolesRequest): Promise<PagedResult<RoleDto>> {
  const result = await apiRequest<PagedResult<RoleDto>>('/api/v1/admin/role/get-all', {
    method: 'POST',
    body: request,
    auth: true,
  });

  if (!result.Data) {
    throw new Error('پاسخ لیست نقش‌ها نامعتبر است');
  }

  return result.Data;
}

export async function createRole(title: string): Promise<{ Id: string }> {
  const result = await apiRequest<{ Id: string }>('/api/v1/admin/role/create', {
    method: 'POST',
    body: { Title: title },
    auth: true,
  });

  if (!result.Data) {
    throw new Error('پاسخ ایجاد نقش نامعتبر است');
  }

  return result.Data;
}

export async function deleteRole(id: string): Promise<void> {
  await apiRequest('/api/v1/admin/role/delete', {
    method: 'DELETE',
    body: { Id: id },
    auth: true,
  });
}
