import { apiRequest } from './client';
import type {
  CreateLeaveBalanceRequest,
  EmployeeLeaveBalanceDto,
  GetAllLeaveBalancesRequest,
  GetEmployeeLeaveBalanceRequest,
  LeaveBalanceDto,
  PagedResult,
  UpdateLeaveBalanceRequest,
} from './types';

export async function getAllLeaveBalances(
  request: GetAllLeaveBalancesRequest,
): Promise<PagedResult<LeaveBalanceDto>> {
  const result = await apiRequest<PagedResult<LeaveBalanceDto>>(
    '/api/v1/admin/leave-balance/get-all',
    { method: 'POST', body: request, auth: true },
  );
  if (!result.Data) throw new Error('پاسخ لیست موجودی مرخصی نامعتبر است');
  return result.Data;
}

export async function getLeaveBalance(id: string): Promise<LeaveBalanceDto> {
  const result = await apiRequest<LeaveBalanceDto>('/api/v1/admin/leave-balance/get', {
    method: 'POST',
    body: { Id: id },
    auth: true,
  });
  if (!result.Data) throw new Error('موجودی مرخصی یافت نشد');
  return result.Data;
}

export async function createLeaveBalance(
  request: CreateLeaveBalanceRequest,
): Promise<{ Id: string }> {
  const result = await apiRequest<{ Id: string }>('/api/v1/admin/leave-balance/create', {
    method: 'POST',
    body: request,
    auth: true,
  });
  if (!result.Data) throw new Error('پاسخ ثبت موجودی مرخصی نامعتبر است');
  return result.Data;
}

export async function updateLeaveBalance(request: UpdateLeaveBalanceRequest): Promise<void> {
  await apiRequest('/api/v1/admin/leave-balance/update', {
    method: 'PUT',
    body: request,
    auth: true,
  });
}

export async function deleteLeaveBalance(id: string): Promise<void> {
  await apiRequest('/api/v1/admin/leave-balance/delete', {
    method: 'DELETE',
    body: { Id: id },
    auth: true,
  });
}

export async function getEmployeeLeaveBalance(
  request: GetEmployeeLeaveBalanceRequest,
): Promise<EmployeeLeaveBalanceDto> {
  const result = await apiRequest<EmployeeLeaveBalanceDto>(
    '/api/v1/admin/leave-balance/get-for-employee',
    { method: 'POST', body: request, auth: true },
  );
  if (!result.Data) throw new Error('مانده مرخصی یافت نشد');
  return result.Data;
}
