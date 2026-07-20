import type { GetAllUsersRequest } from '@/services/api';
import { GENDER_FEMALE, GENDER_MALE } from '@/lib/userDisplay';

export type StatusFilter = '' | 'active' | 'inactive';
export type TriStateFilter = '' | 'yes' | 'no';
export type GenderFilter = '' | `${typeof GENDER_FEMALE}` | `${typeof GENDER_MALE}`;

export interface UserListFilters {
  search: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isActive: StatusFilter;
  gender: GenderFilter;
  emailConfirmed: TriStateFilter;
  phoneNumberConfirmed: TriStateFilter;
  loginPermission: TriStateFilter;
}

export const EMPTY_USER_FILTERS: UserListFilters = {
  search: '',
  userName: '',
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  isActive: '',
  gender: '',
  emailConfirmed: '',
  phoneNumberConfirmed: '',
  loginPermission: '',
};

function triStateToBool(value: TriStateFilter): boolean | undefined {
  if (value === 'yes') return true;
  if (value === 'no') return false;
  return undefined;
}

export function buildGetAllUsersRequest(
  filters: UserListFilters,
  pageNumber: number,
  pageSize: number,
): GetAllUsersRequest {
  return {
    Search: filters.search.trim() || undefined,
    UserName: filters.userName.trim() || undefined,
    FirstName: filters.firstName.trim() || undefined,
    LastName: filters.lastName.trim() || undefined,
    Email: filters.email.trim() || undefined,
    PhoneNumber: filters.phoneNumber.trim() || undefined,
    Gender: filters.gender ? Number(filters.gender) : undefined,
    IsActive: filters.isActive === 'active' ? true : filters.isActive === 'inactive' ? false : undefined,
    EmailConfirmed: triStateToBool(filters.emailConfirmed),
    PhoneNumberConfirmed: triStateToBool(filters.phoneNumberConfirmed),
    LoginPermission: triStateToBool(filters.loginPermission),
    Pagination: { PageNumber: pageNumber, PageSize: pageSize },
  };
}

export function countActiveUserFilters(filters: UserListFilters): number {
  return [
    filters.search,
    filters.userName,
    filters.firstName,
    filters.lastName,
    filters.email,
    filters.phoneNumber,
    filters.isActive,
    filters.gender,
    filters.emailConfirmed,
    filters.phoneNumberConfirmed,
    filters.loginPermission,
  ].filter(Boolean).length;
}
