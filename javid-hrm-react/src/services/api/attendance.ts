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

export async function getAttendanceRecord(id: string): Promise<AttendanceRecordDto> {
  const result = await apiRequest<AttendanceRecordDto>('/api/v1/admin/attendance-record/get', {
    method: 'POST',
    body: { Id: id },
    auth: true,
  });
  if (!result.Data) throw new Error('رکورد حضور یافت نشد');
  return result.Data;
}

export async function createAttendanceRecord(
  request: CreateAttendanceRecordRequest,
): Promise<{ Id: string }> {
  const result = await apiRequest<{ Id: string }>('/api/v1/admin/attendance-record/create', {
    method: 'POST',
    body: request,
    auth: true,
  });
  if (!result.Data) throw new Error('پاسخ ثبت حضور نامعتبر است');
  return result.Data;
}

export async function checkInAttendanceRecord(
  employeeId: string,
  workDate?: string,
): Promise<{ Id: string }> {
  const result = await apiRequest<{ Id: string }>('/api/v1/admin/attendance-record/check-in', {
    method: 'PUT',
    body: { EmployeeId: employeeId, WorkDate: workDate },
    auth: true,
  });
  if (!result.Data) throw new Error('پاسخ ثبت ورود نامعتبر است');
  return result.Data;
}

export async function checkOutAttendanceRecord(
  employeeId: string,
  workDate?: string,
): Promise<{ Id: string }> {
  const result = await apiRequest<{ Id: string }>('/api/v1/admin/attendance-record/check-out', {
    method: 'PUT',
    body: { EmployeeId: employeeId, WorkDate: workDate },
    auth: true,
  });
  if (!result.Data) throw new Error('پاسخ ثبت خروج نامعتبر است');
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
