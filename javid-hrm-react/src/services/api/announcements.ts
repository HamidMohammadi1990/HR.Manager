import { apiRequest } from './client';
import type {
  AnnouncementDto,
  CreateAnnouncementRequest,
  GetAllAnnouncementsRequest,
  PagedResult,
  UpdateAnnouncementRequest,
} from './types';

export async function getAllAnnouncements(
  request: GetAllAnnouncementsRequest,
): Promise<PagedResult<AnnouncementDto>> {
  const result = await apiRequest<PagedResult<AnnouncementDto>>(
    '/api/v1/admin/announcement/get-all',
    { method: 'POST', body: request, auth: true },
  );
  if (!result.Data) throw new Error('پاسخ لیست اطلاعیه‌ها نامعتبر است');
  return result.Data;
}

export async function getAnnouncement(id: string): Promise<AnnouncementDto> {
  const result = await apiRequest<AnnouncementDto>('/api/v1/admin/announcement/get', {
    method: 'POST',
    body: { Id: id },
    auth: true,
  });
  if (!result.Data) throw new Error('اطلاعیه یافت نشد');
  return result.Data;
}

export async function createAnnouncement(
  request: CreateAnnouncementRequest,
): Promise<{ Id: string }> {
  const result = await apiRequest<{ Id: string }>('/api/v1/admin/announcement/create', {
    method: 'POST',
    body: request,
    auth: true,
  });
  if (!result.Data) throw new Error('پاسخ ثبت اطلاعیه نامعتبر است');
  return result.Data;
}

export async function updateAnnouncement(request: UpdateAnnouncementRequest): Promise<void> {
  await apiRequest('/api/v1/admin/announcement/update', {
    method: 'PUT',
    body: request,
    auth: true,
  });
}

export async function publishAnnouncement(id: string): Promise<void> {
  await apiRequest('/api/v1/admin/announcement/publish', {
    method: 'PUT',
    body: { Id: id },
    auth: true,
  });
}

export async function archiveAnnouncement(id: string): Promise<void> {
  await apiRequest('/api/v1/admin/announcement/archive', {
    method: 'PUT',
    body: { Id: id },
    auth: true,
  });
}

export async function deleteAnnouncement(id: string): Promise<void> {
  await apiRequest('/api/v1/admin/announcement/delete', {
    method: 'DELETE',
    body: { Id: id },
    auth: true,
  });
}
