import { apiRequest } from './client';
import type {
  CreateUserRequest,
  CreateUserResponse,
  GetAllUsersRequest,
  GetUserRequest,
  PagedResult,
  UpdateUserRequest,
  UserDto,
} from './types';

export async function getAllUsers(
  request: GetAllUsersRequest,
): Promise<PagedResult<UserDto>> {
  const result = await apiRequest<PagedResult<UserDto>>('/api/v1/admin/account/get-all', {
    method: 'POST',
    body: request,
    auth: true,
  });

  if (!result.Data) {
    throw new Error('پاسخ لیست کاربران نامعتبر است');
  }

  return result.Data;
}

export async function getUser(request: GetUserRequest): Promise<UserDto> {
  const result = await apiRequest<UserDto>('/api/v1/admin/account/get', {
    method: 'POST',
    body: request,
    auth: true,
  });

  if (!result.Data) {
    throw new Error('کاربر یافت نشد');
  }

  return result.Data;
}

export async function createUser(request: CreateUserRequest): Promise<CreateUserResponse> {
  const result = await apiRequest<CreateUserResponse>('/api/v1/admin/account/create', {
    method: 'POST',
    body: request,
    auth: true,
  });

  if (!result.Data) {
    throw new Error('پاسخ ایجاد کاربر نامعتبر است');
  }

  return result.Data;
}

export async function updateUser(request: UpdateUserRequest): Promise<void> {
  await apiRequest('/api/v1/admin/account/update', {
    method: 'PUT',
    body: request,
    auth: true,
  });
}

export async function deleteUser(id: string): Promise<void> {
  await apiRequest('/api/v1/admin/account/delete', {
    method: 'DELETE',
    body: { Id: id },
    auth: true,
  });
}
