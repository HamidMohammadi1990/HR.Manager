import { apiRequest } from './client';
import type {
  CalendarEventDto,
  CreateCalendarEventRequest,
  GetAllCalendarEventsRequest,
  PagedResult,
  UpdateCalendarEventRequest,
} from './types';

export async function getAllCalendarEvents(
  request: GetAllCalendarEventsRequest,
): Promise<PagedResult<CalendarEventDto>> {
  const result = await apiRequest<PagedResult<CalendarEventDto>>(
    '/api/v1/admin/calendar-event/get-all',
    { method: 'POST', body: request, auth: true },
  );
  if (!result.Data) throw new Error('پاسخ لیست رویدادها نامعتبر است');
  return result.Data;
}

export async function getCalendarEvent(id: string): Promise<CalendarEventDto> {
  const result = await apiRequest<CalendarEventDto>('/api/v1/admin/calendar-event/get', {
    method: 'POST',
    body: { Id: id },
    auth: true,
  });
  if (!result.Data) throw new Error('رویداد یافت نشد');
  return result.Data;
}

export async function createCalendarEvent(
  request: CreateCalendarEventRequest,
): Promise<{ Id: string }> {
  const result = await apiRequest<{ Id: string }>('/api/v1/admin/calendar-event/create', {
    method: 'POST',
    body: request,
    auth: true,
  });
  if (!result.Data) throw new Error('پاسخ ثبت رویداد نامعتبر است');
  return result.Data;
}

export async function updateCalendarEvent(request: UpdateCalendarEventRequest): Promise<void> {
  await apiRequest('/api/v1/admin/calendar-event/update', {
    method: 'PUT',
    body: request,
    auth: true,
  });
}

export async function deleteCalendarEvent(id: string): Promise<void> {
  await apiRequest('/api/v1/admin/calendar-event/delete', {
    method: 'DELETE',
    body: { Id: id },
    auth: true,
  });
}
