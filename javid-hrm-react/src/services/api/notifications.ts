import { apiRequest } from './client';
import type {
  CreateNotificationRequest,
  GetAllNotificationsRequest,
  NotificationDto,
  PagedResult,
  UpdateNotificationRequest,
} from './types';

export async function getAllNotifications(
  request: GetAllNotificationsRequest,
): Promise<PagedResult<NotificationDto>> {
  const result = await apiRequest<PagedResult<NotificationDto>>(
    '/api/v1/admin/notification/get-all',
    { method: 'POST', body: request, auth: true },
  );
  if (!result.Data) throw new Error('پاسخ لیست اعلان‌ها نامعتبر است');
  return result.Data;
}

export async function getNotification(id: string): Promise<NotificationDto> {
  const result = await apiRequest<NotificationDto>('/api/v1/admin/notification/get', {
    method: 'POST',
    body: { Id: id },
    auth: true,
  });
  if (!result.Data) throw new Error('اعلان یافت نشد');
  return result.Data;
}

export async function getUnreadNotificationCount(userId?: string): Promise<number> {
  const result = await apiRequest<{ UnreadCount: number }>(
    '/api/v1/admin/notification/get-unread-count',
    { method: 'POST', body: userId ? { UserId: userId } : {}, auth: true },
  );
  return result.Data?.UnreadCount ?? 0;
}

export async function createNotification(request: CreateNotificationRequest): Promise<{ Id: string }> {
  const result = await apiRequest<{ Id: string }>('/api/v1/admin/notification/create', {
    method: 'POST',
    body: request,
    auth: true,
  });
  if (!result.Data) throw new Error('پاسخ ثبت اعلان نامعتبر است');
  return result.Data;
}

export async function updateNotification(request: UpdateNotificationRequest): Promise<void> {
  await apiRequest('/api/v1/admin/notification/update', {
    method: 'PUT',
    body: request,
    auth: true,
  });
}

export async function markNotificationRead(id: string, isRead = true): Promise<void> {
  await apiRequest('/api/v1/admin/notification/mark-read', {
    method: 'PUT',
    body: { Id: id, IsRead: isRead },
    auth: true,
  });
}

export async function markAllNotificationsRead(userId?: string): Promise<void> {
  await apiRequest('/api/v1/admin/notification/mark-all-read', {
    method: 'PUT',
    body: userId ? { UserId: userId } : {},
    auth: true,
  });
}

export async function deleteNotification(id: string): Promise<void> {
  await apiRequest('/api/v1/admin/notification/delete', {
    method: 'DELETE',
    body: { Id: id },
    auth: true,
  });
}

export async function deleteReadNotifications(userId?: string): Promise<void> {
  await apiRequest('/api/v1/admin/notification/delete-read', {
    method: 'DELETE',
    body: userId ? { UserId: userId } : {},
    auth: true,
  });
}
