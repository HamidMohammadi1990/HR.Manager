import type { UserDto } from '@/services/api';

export function getUserDisplayName(user: Pick<UserDto, 'FirstName' | 'LastName' | 'UserName'>): string {
  const fullName = [user.FirstName, user.LastName].filter(Boolean).join(' ').trim();
  return fullName || user.UserName;
}

export function getUserInitials(user: Pick<UserDto, 'FirstName' | 'LastName' | 'UserName'>): string {
  const name = getUserDisplayName(user);
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0]}‌${parts[1]![0]}`;
  }
  return name.slice(0, 2);
}

export function formatDateTime(value?: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('fa-IR');
}
