import { apiRequest } from './client';
import type {
  AttendanceRecordDto,
  CreateAttendanceRecordRequest,
  GetAllAttendanceRecordsRequest,
  PagedResult,
  UpdateAttendanceRecordRequest,
} from './types';

export async function getAllAttendanceRecords(
  request: GetAllAttendanceRecordsRequest,
): Promise<PagedResult<AttendanceRecordDto>> {
  const result = await apiRequest<PagedResult<AttendanceRecordDto>>(
    '/api/v1/admin/attendance-record/get-all',
    { method: 'POST', body: request, auth: true },
  );
  if (!result.Data) throw new Error('پاسخ لیست حضور نامعتبر است');
  return result.Data;
}

export async function createAttendanceRecord(request: CreateAttendanceRecordRequest): Promise<{ Id: string }> {
  const result = await apiRequest<{ Id: string }>('/api/v1/admin/attendance-record/create', {
    method: 'POST',
    body: request,
    auth: true,
  });
  if (!result.Data) throw new Error('پاسخ ثبت حضور نامعتبر است');
  return result.Data;
}

export async function updateAttendanceRecord(request: UpdateAttendanceRecordRequest): Promise<void> {
  await apiRequest('/api/v1/admin/attendance-record/update', {
    method: 'PUT',
    body: request,
    auth: true,
  });
}

export async function deleteAttendanceRecord(id: string): Promise<void> {
  await apiRequest('/api/v1/admin/attendance-record/delete', {
    method: 'DELETE',
    body: { Id: id },
    auth: true,
  });
}
