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
