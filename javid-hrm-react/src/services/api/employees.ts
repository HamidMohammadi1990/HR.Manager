import { apiRequest } from './client';
import type {
  CreateEmployeeRequest,
  CreateEmployeeResponse,
  EmployeeDto,
  GetAllEmployeesRequest,
  GetEmployeeRequest,
  PagedResult,
  UpdateEmployeeRequest,
} from './types';

export async function getAllEmployees(
  request: GetAllEmployeesRequest,
): Promise<PagedResult<EmployeeDto>> {
  const result = await apiRequest<PagedResult<EmployeeDto>>('/api/v1/admin/employee/get-all', {
    method: 'POST',
    body: request,
    auth: true,
  });

  if (!result.Data) {
    throw new Error('پاسخ لیست پرسنل نامعتبر است');
  }

  return result.Data;
}

export async function getEmployee(request: GetEmployeeRequest): Promise<EmployeeDto> {
  const result = await apiRequest<EmployeeDto>('/api/v1/admin/employee/get', {
    method: 'POST',
    body: request,
    auth: true,
  });

  if (!result.Data) {
    throw new Error('پرسنل یافت نشد');
  }

  return result.Data;
}

export async function createEmployee(request: CreateEmployeeRequest): Promise<CreateEmployeeResponse> {
  const result = await apiRequest<CreateEmployeeResponse>('/api/v1/admin/employee/create', {
    method: 'POST',
    body: request,
    auth: true,
  });

  if (!result.Data) {
    throw new Error('پاسخ ایجاد پرسنل نامعتبر است');
  }

  return result.Data;
}

export async function updateEmployee(request: UpdateEmployeeRequest): Promise<void> {
  await apiRequest('/api/v1/admin/employee/update', {
    method: 'PUT',
    body: request,
    auth: true,
  });
}

export async function deleteEmployee(id: string): Promise<void> {
  await apiRequest('/api/v1/admin/employee/delete', {
    method: 'DELETE',
    body: { Id: id },
    auth: true,
  });
}
