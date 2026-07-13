import { apiRequest } from './client';
import type {
  CreatePayrollEntryRequest,
  GetAllPayrollEntriesRequest,
  PagedResult,
  PayrollEntryDto,
  UpdatePayrollEntryRequest,
} from './types';

export async function getAllPayrollEntries(
  request: GetAllPayrollEntriesRequest,
): Promise<PagedResult<PayrollEntryDto>> {
  const result = await apiRequest<PagedResult<PayrollEntryDto>>(
    '/api/v1/admin/payroll-entry/get-all',
    { method: 'POST', body: request, auth: true },
  );
  if (!result.Data) throw new Error('پاسخ لیست حقوق نامعتبر است');
  return result.Data;
}

export async function getPayrollEntry(id: string): Promise<PayrollEntryDto> {
  const result = await apiRequest<PayrollEntryDto>('/api/v1/admin/payroll-entry/get', {
    method: 'POST',
    body: { Id: id },
    auth: true,
  });
  if (!result.Data) throw new Error('فیش حقوقی یافت نشد');
  return result.Data;
}

export async function createPayrollEntry(request: CreatePayrollEntryRequest): Promise<{ Id: string }> {
  const result = await apiRequest<{ Id: string }>('/api/v1/admin/payroll-entry/create', {
    method: 'POST',
    body: request,
    auth: true,
  });
  if (!result.Data) throw new Error('پاسخ ثبت حقوق نامعتبر است');
  return result.Data;
}

export async function updatePayrollEntry(request: UpdatePayrollEntryRequest): Promise<void> {
  await apiRequest('/api/v1/admin/payroll-entry/update', {
    method: 'PUT',
    body: request,
    auth: true,
  });
}

export async function approvePayrollEntry(id: string): Promise<void> {
  await apiRequest('/api/v1/admin/payroll-entry/approve', {
    method: 'PUT',
    body: { Id: id },
    auth: true,
  });
}

export async function markPayrollEntryPaid(id: string): Promise<void> {
  await apiRequest('/api/v1/admin/payroll-entry/mark-paid', {
    method: 'PUT',
    body: { Id: id },
    auth: true,
  });
}

export async function deletePayrollEntry(id: string): Promise<void> {
  await apiRequest('/api/v1/admin/payroll-entry/delete', {
    method: 'DELETE',
    body: { Id: id },
    auth: true,
  });
}
