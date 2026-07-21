import { apiRequest } from './client';
import type {
  CreateEmployeeShiftScheduleRequest,
  CreateEmployeeShiftScheduleResponse,
  DeleteEmployeeShiftScheduleRequest,
  EmployeeShiftScheduleDto,
  GetEmployeeShiftSchedulesRequest,
} from './types';

export async function getEmployeeShiftSchedules(
  request: GetEmployeeShiftSchedulesRequest,
): Promise<EmployeeShiftScheduleDto[]> {
  const result = await apiRequest<EmployeeShiftScheduleDto[]>(
    '/api/v1/admin/employee-shift-schedule/get-by-employee',
    { method: 'POST', body: request, auth: true },
  );
  return result.Data ?? [];
}

export async function createEmployeeShiftSchedule(
  request: CreateEmployeeShiftScheduleRequest,
): Promise<CreateEmployeeShiftScheduleResponse> {
  const result = await apiRequest<CreateEmployeeShiftScheduleResponse>(
    '/api/v1/admin/employee-shift-schedule/create',
    { method: 'POST', body: request, auth: true },
  );
  if (!result.Data) throw new Error('پاسخ ثبت برنامه شیفت نامعتبر است');
  return result.Data;
}

export async function deleteEmployeeShiftSchedule(
  request: DeleteEmployeeShiftScheduleRequest,
): Promise<void> {
  await apiRequest('/api/v1/admin/employee-shift-schedule/delete', {
    method: 'DELETE',
    body: request,
    auth: true,
  });
}
