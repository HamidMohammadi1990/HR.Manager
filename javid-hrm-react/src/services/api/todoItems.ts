import { apiRequest } from './client';
import type {
  CreateTodoItemRequest,
  GetAllTodoItemsRequest,
  PagedResult,
  TodoItemDto,
  UpdateTodoItemRequest,
} from './types';

export async function getAllTodoItems(
  request: GetAllTodoItemsRequest,
): Promise<PagedResult<TodoItemDto>> {
  const result = await apiRequest<PagedResult<TodoItemDto>>(
    '/api/v1/admin/todo-item/get-all',
    { method: 'POST', body: request, auth: true },
  );
  if (!result.Data) throw new Error('پاسخ لیست کارها نامعتبر است');
  return result.Data;
}

export async function getTodoItem(id: string): Promise<TodoItemDto> {
  const result = await apiRequest<TodoItemDto>('/api/v1/admin/todo-item/get', {
    method: 'POST',
    body: { Id: id },
    auth: true,
  });
  if (!result.Data) throw new Error('کار یافت نشد');
  return result.Data;
}

export async function createTodoItem(request: CreateTodoItemRequest): Promise<{ Id: string }> {
  const result = await apiRequest<{ Id: string }>('/api/v1/admin/todo-item/create', {
    method: 'POST',
    body: request,
    auth: true,
  });
  if (!result.Data) throw new Error('پاسخ ثبت کار نامعتبر است');
  return result.Data;
}

export async function updateTodoItem(request: UpdateTodoItemRequest): Promise<void> {
  await apiRequest('/api/v1/admin/todo-item/update', {
    method: 'PUT',
    body: request,
    auth: true,
  });
}

export async function toggleTodoItemComplete(id: string): Promise<void> {
  await apiRequest('/api/v1/admin/todo-item/toggle-complete', {
    method: 'PUT',
    body: { Id: id },
    auth: true,
  });
}

export async function deleteTodoItem(id: string): Promise<void> {
  await apiRequest('/api/v1/admin/todo-item/delete', {
    method: 'DELETE',
    body: { Id: id },
    auth: true,
  });
}
