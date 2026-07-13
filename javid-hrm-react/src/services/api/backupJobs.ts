import { apiDownloadBinary, apiRequest } from './client';
import type {
  BackupJobDto,
  CreateBackupRequest,
  GetAllBackupJobsRequest,
  PagedResult,
} from './types';

export async function getAllBackupJobs(
  request: GetAllBackupJobsRequest,
): Promise<PagedResult<BackupJobDto>> {
  const result = await apiRequest<PagedResult<BackupJobDto>>(
    '/api/v1/admin/backup-job/get-all',
    { method: 'POST', body: request, auth: true },
  );
  if (!result.Data) throw new Error('پاسخ لیست پشتیبان‌ها نامعتبر است');
  return result.Data;
}

export async function getBackupJob(id: string): Promise<BackupJobDto> {
  const result = await apiRequest<BackupJobDto>('/api/v1/admin/backup-job/get', {
    method: 'POST',
    body: { Id: id },
    auth: true,
  });
  if (!result.Data) throw new Error('پشتیبان یافت نشد');
  return result.Data;
}

export async function createBackup(request: CreateBackupRequest = {}): Promise<{ Id: string }> {
  const result = await apiRequest<{ Id: string }>('/api/v1/admin/backup-job/create-backup', {
    method: 'POST',
    body: request,
    auth: true,
  });
  if (!result.Data) throw new Error('پاسخ ایجاد پشتیبان نامعتبر است');
  return result.Data;
}

export async function downloadBackupJob(id: string) {
  return apiDownloadBinary('/api/v1/admin/backup-job/download', { Id: id });
}

export async function deleteBackupJob(id: string): Promise<void> {
  await apiRequest('/api/v1/admin/backup-job/delete', {
    method: 'DELETE',
    body: { Id: id },
    auth: true,
  });
}
