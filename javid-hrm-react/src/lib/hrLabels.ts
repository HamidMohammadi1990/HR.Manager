export function getPersonName(first?: string | null, last?: string | null, fallback?: string | null) {
  const name = [first, last].filter(Boolean).join(' ');
  return name || fallback || '—';
}

export const ATTENDANCE_STATUS_LABELS: Record<number, string> = {
  1: 'حاضر',
  2: 'غایب',
  3: 'تأخیر',
  4: 'مرخصی',
  5: 'خروج زودهنگام',
};

export const LEAVE_TYPE_HOURLY = 5;

export const LEAVE_TYPE_LABELS: Record<number, string> = {
  1: 'استحقاقی',
  2: 'استعلاجی',
  3: 'بدون حقوق',
  4: 'سایر',
  5: 'ساعتی',
};

export const LEAVE_TYPE_CATEGORY_LABELS: Record<number, string> = {
  1: 'مرخصی',
  2: 'ماموریت',
};

export const LEAVE_TYPE_UNIT_LABELS: Record<number, string> = {
  1: 'روز',
  2: 'ساعت',
};

export const LEAVE_TYPE_CATEGORY_LEAVE = 1;
export const LEAVE_TYPE_CATEGORY_MISSION = 2;
export const LEAVE_TYPE_UNIT_DAY = 1;
export const LEAVE_TYPE_UNIT_HOUR = 2;

export const LEAVE_STATUS_LABELS: Record<number, string> = {
  1: 'در انتظار',
  2: 'تأیید شده',
  3: 'رد شده',
};

export const PAYROLL_STATUS_LABELS: Record<number, string> = {
  1: 'پیش‌نویس',
  2: 'تأیید شده',
  3: 'پرداخت شده',
};

export const ANNOUNCEMENT_STATUS_LABELS: Record<number, string> = {
  1: 'پیش‌نویس',
  2: 'زمان‌بندی‌شده',
  3: 'ارسال‌شده',
  4: 'آرشیو',
  5: 'خطا',
};

const ANNOUNCEMENT_STATUS_BY_NAME: Record<string, number> = {
  Draft: 1,
  Scheduled: 2,
  Sent: 3,
  Archived: 4,
  Failed: 5,
};

const ANNOUNCEMENT_AUDIENCE_BY_NAME: Record<string, number> = {
  AllUsers: 1,
  Department: 2,
  Role: 3,
};

const ANNOUNCEMENT_CHANNEL_BY_NAME: Record<string, number> = {
  InApp: 1,
  Email: 2,
  Push: 3,
  EmailAndPush: 4,
};

export function normalizeApiEnum(
  value: number | string | undefined | null,
  nameMap: Record<string, number>,
): number | null {
  if (value == null || value === '') return null;
  if (typeof value === 'number') return value;
  return nameMap[value] ?? null;
}

export function getAnnouncementStatusLabel(status: number | string): string {
  const normalized = normalizeApiEnum(status, ANNOUNCEMENT_STATUS_BY_NAME);
  return normalized != null ? (ANNOUNCEMENT_STATUS_LABELS[normalized] ?? String(status)) : String(status);
}

export function getAnnouncementStatusVariant(status: number | string) {
  const normalized = normalizeApiEnum(status, ANNOUNCEMENT_STATUS_BY_NAME);
  if (normalized === 3) return 'success' as const;
  if (normalized === 2) return 'alert' as const;
  if (normalized === 5) return 'destructive' as const;
  if (normalized === 4) return 'secondary' as const;
  return 'default' as const;
}

export function normalizeAnnouncementStatus(status: number | string): number | null {
  return normalizeApiEnum(status, ANNOUNCEMENT_STATUS_BY_NAME);
}

export function normalizeAnnouncementAudience(audience: number | string): number | null {
  return normalizeApiEnum(audience, ANNOUNCEMENT_AUDIENCE_BY_NAME);
}

export function normalizeAnnouncementChannel(channel: number | string): number | null {
  return normalizeApiEnum(channel, ANNOUNCEMENT_CHANNEL_BY_NAME);
}

export const ANNOUNCEMENT_AUDIENCE_LABELS: Record<number, string> = {
  1: 'همه کاربران',
  2: 'بخش',
  3: 'نقش',
};

export const ANNOUNCEMENT_CHANNEL_LABELS: Record<number, string> = {
  1: 'درون‌برنامه',
  2: 'ایمیل',
  3: 'پوش',
  4: 'ایمیل + پوش',
};

export const CALENDAR_EVENT_TYPE_LABELS: Record<number, string> = {
  1: 'جلسه',
  2: 'تعطیل',
  3: 'مرخصی',
  4: 'شخصی',
  5: 'سایر',
};

export const TODO_PRIORITY_LABELS: Record<number, string> = {
  1: 'پایین',
  2: 'متوسط',
  3: 'بالا',
};

export const BACKUP_STATUS_LABELS: Record<number, string> = {
  1: 'در انتظار',
  2: 'در حال انجام',
  3: 'موفق',
  4: 'ناموفق',
};

export const BACKUP_TYPE_LABELS: Record<number, string> = {
  1: 'دستی',
  2: 'خودکار',
};
