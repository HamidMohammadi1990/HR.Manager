import type { UserDto } from '@/services/api';

export const GENDER_FEMALE = 1;
export const GENDER_MALE = 2;

/** API may return Gender as enum name ("Male") or numeric value (2). */
export function normalizeGender(value: unknown, fallback = GENDER_MALE): number {
  if (value === GENDER_MALE || value === GENDER_FEMALE) return value;

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === 'Male') return GENDER_MALE;
    if (trimmed === 'Female') return GENDER_FEMALE;
    const parsed = Number(trimmed);
    if (parsed === GENDER_MALE || parsed === GENDER_FEMALE) return parsed;
  }

  if (typeof value === 'number' && !Number.isNaN(value)) {
    if (value === GENDER_MALE || value === GENDER_FEMALE) return value;
  }

  return fallback;
}

export function genderSelectValue(value: unknown, fallback = GENDER_MALE): string {
  return String(normalizeGender(value, fallback));
}

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
