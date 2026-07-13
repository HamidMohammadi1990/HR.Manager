import { apiRequest } from './client';
import type {
  CreateLeaveRequestRequest,
  GetAllLeaveRequestsRequest,
  LeaveRequestDto,
  PagedResult,
  UpdateLeaveRequestRequest,
} from './types';

export async function getAllLeaveRequests(
  request: GetAllLeaveRequestsRequest,
): Promise<PagedResult<LeaveRequestDto>> {
  const result = await apiRequest<PagedResult<LeaveRequestDto>>(
    '/api/v1/admin/leave-request/get-all',
    { method: 'POST', body: request, auth: true },
  );
  if (!result.Data) throw new Error('پاسخ لیست مرخصی نامعتبر است');
  return result.Data;
}

export async function getLeaveRequest(id: string): Promise<LeaveRequestDto> {
  const result = await apiRequest<LeaveRequestDto>('/api/v1/admin/leave-request/get', {
    method: 'POST',
    body: { Id: id },
    auth: true,
  });
  if (!result.Data) throw new Error('درخواست مرخصی یافت نشد');
  return result.Data;
}

export async function createLeaveRequest(request: CreateLeaveRequestRequest): Promise<{ Id: string }> {
  const result = await apiRequest<{ Id: string }>('/api/v1/admin/leave-request/create', {
    method: 'POST',
    body: request,
    auth: true,
  });
  if (!result.Data) throw new Error('پاسخ ثبت مرخصی نامعتبر است');
  return result.Data;
}

export async function updateLeaveRequest(request: UpdateLeaveRequestRequest): Promise<void> {
  await apiRequest('/api/v1/admin/leave-request/update', {
    method: 'PUT',
    body: request,
    auth: true,
  });
}

export async function approveLeaveRequest(id: string): Promise<void> {
  await apiRequest('/api/v1/admin/leave-request/approve', {
    method: 'PUT',
    body: { Id: id },
    auth: true,
  });
}

export async function rejectLeaveRequest(id: string): Promise<void> {
  await apiRequest('/api/v1/admin/leave-request/reject', {
    method: 'PUT',
    body: { Id: id },
    auth: true,
  });
}

export async function deleteLeaveRequest(id: string): Promise<void> {
  await apiRequest('/api/v1/admin/leave-request/delete', {
    method: 'DELETE',
    body: { Id: id },
    auth: true,
  });
}
