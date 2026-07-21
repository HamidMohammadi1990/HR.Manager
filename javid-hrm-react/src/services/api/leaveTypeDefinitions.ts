import { apiRequest } from './client';
import type {
  CreateLeaveTypeDefinitionRequest,
  GetAllLeaveTypeDefinitionsRequest,
  LeaveTypeDefinitionDto,
  PagedResult,
  UpdateLeaveTypeDefinitionRequest,
} from './types';

export async function getAllLeaveTypeDefinitions(
  request: GetAllLeaveTypeDefinitionsRequest,
): Promise<PagedResult<LeaveTypeDefinitionDto>> {
  const result = await apiRequest<PagedResult<LeaveTypeDefinitionDto>>(
    '/api/v1/admin/leave-type-definition/get-all',
    { method: 'POST', body: request, auth: true },
  );
  if (!result.Data) throw new Error('پاسخ لیست انواع مرخصی نامعتبر است');
  return result.Data;
}

export async function getLeaveTypeDefinition(id: string): Promise<LeaveTypeDefinitionDto> {
  const result = await apiRequest<LeaveTypeDefinitionDto>('/api/v1/admin/leave-type-definition/get', {
    method: 'POST',
    body: { Id: id },
    auth: true,
  });
  if (!result.Data) throw new Error('نوع مرخصی یافت نشد');
  return result.Data;
}

export async function createLeaveTypeDefinition(
  request: CreateLeaveTypeDefinitionRequest,
): Promise<{ Id: string }> {
  const result = await apiRequest<{ Id: string }>('/api/v1/admin/leave-type-definition/create', {
    method: 'POST',
    body: request,
    auth: true,
  });
  if (!result.Data) throw new Error('پاسخ ثبت نوع مرخصی نامعتبر است');
  return result.Data;
}

export async function updateLeaveTypeDefinition(
  request: UpdateLeaveTypeDefinitionRequest,
): Promise<void> {
  await apiRequest('/api/v1/admin/leave-type-definition/update', {
    method: 'PUT',
    body: request,
    auth: true,
  });
}

export async function deleteLeaveTypeDefinition(id: string): Promise<void> {
  await apiRequest('/api/v1/admin/leave-type-definition/delete', {
    method: 'DELETE',
    body: { Id: id },
    auth: true,
  });
}

export async function searchLeaveTypeDefinitions(
  request: GetAllLeaveTypeDefinitionsRequest,
): Promise<PagedResult<LeaveTypeDefinitionDto>> {
  const result = await apiRequest<PagedResult<LeaveTypeDefinitionDto>>(
    '/api/v1/leave-type-definition/search',
    { method: 'POST', body: request, auth: true },
  );
  if (!result.Data) throw new Error('پاسخ جستجوی انواع مرخصی نامعتبر است');
  return result.Data;
}
