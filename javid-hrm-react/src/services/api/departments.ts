import { apiRequest } from './client';
import type {
  CreateDepartmentRequest,
  CreateDepartmentResponse,
  DepartmentDto,
  GetAllDepartmentsRequest,
  GetDepartmentRequest,
  PagedResult,
  UpdateDepartmentRequest,
} from './types';

export async function getAllDepartments(
  request: GetAllDepartmentsRequest,
): Promise<PagedResult<DepartmentDto>> {
  const result = await apiRequest<PagedResult<DepartmentDto>>('/api/v1/admin/department/get-all', {
    method: 'POST',
    body: request,
    auth: true,
  });

  if (!result.Data) {
    throw new Error('پاسخ لیست بخش‌ها نامعتبر است');
  }

  return result.Data;
}

export async function getDepartment(request: GetDepartmentRequest): Promise<DepartmentDto> {
  const result = await apiRequest<DepartmentDto>('/api/v1/admin/department/get', {
    method: 'POST',
    body: request,
    auth: true,
  });

  if (!result.Data) {
    throw new Error('بخش یافت نشد');
  }

  return result.Data;
}

export async function createDepartment(request: CreateDepartmentRequest): Promise<CreateDepartmentResponse> {
  const result = await apiRequest<CreateDepartmentResponse>('/api/v1/admin/department/create', {
    method: 'POST',
    body: request,
    auth: true,
  });

  if (!result.Data) {
    throw new Error('پاسخ ایجاد بخش نامعتبر است');
  }

  return result.Data;
}

export async function updateDepartment(request: UpdateDepartmentRequest): Promise<void> {
  await apiRequest('/api/v1/admin/department/update', {
    method: 'PUT',
    body: request,
    auth: true,
  });
}

export async function deleteDepartment(id: string): Promise<void> {
  await apiRequest('/api/v1/admin/department/delete', {
    method: 'DELETE',
    body: { Id: id },
    auth: true,
  });
}
