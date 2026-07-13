import { apiRequest } from './client';
import type {
  CreateWorkShiftRequest,
  GetAllWorkShiftsRequest,
  PagedResult,
  UpdateWorkShiftRequest,
  WorkShiftDto,
} from './types';

export async function getAllWorkShifts(
  request: GetAllWorkShiftsRequest,
): Promise<PagedResult<WorkShiftDto>> {
  const result = await apiRequest<PagedResult<WorkShiftDto>>(
    '/api/v1/admin/work-shift/get-all',
    { method: 'POST', body: request, auth: true },
  );
  if (!result.Data) throw new Error('پاسخ لیست شیفت‌ها نامعتبر است');
  return result.Data;
}

export async function getWorkShift(id: string): Promise<WorkShiftDto> {
  const result = await apiRequest<WorkShiftDto>('/api/v1/admin/work-shift/get', {
    method: 'POST',
    body: { Id: id },
    auth: true,
  });
  if (!result.Data) throw new Error('شیفت یافت نشد');
  return result.Data;
}

export async function createWorkShift(request: CreateWorkShiftRequest): Promise<{ Id: string }> {
  const result = await apiRequest<{ Id: string }>('/api/v1/admin/work-shift/create', {
    method: 'POST',
    body: request,
    auth: true,
  });
  if (!result.Data) throw new Error('پاسخ ثبت شیفت نامعتبر است');
  return result.Data;
}

export async function updateWorkShift(request: UpdateWorkShiftRequest): Promise<void> {
  await apiRequest('/api/v1/admin/work-shift/update', {
    method: 'PUT',
    body: request,
    auth: true,
  });
}

export async function deleteWorkShift(id: string): Promise<void> {
  await apiRequest('/api/v1/admin/work-shift/delete', {
    method: 'DELETE',
    body: { Id: id },
    auth: true,
  });
}
