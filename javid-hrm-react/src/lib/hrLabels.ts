export function getPersonName(first?: string | null, last?: string | null, fallback?: string | null) {
  const name = [first, last].filter(Boolean).join(' ');
  return name || fallback || '—';
}

export const ATTENDANCE_STATUS_LABELS: Record<number, string> = {
  1: 'حاضر',
  2: 'غایب',
  3: 'تأخیر',
  4: 'مرخصی',
};

export const LEAVE_TYPE_LABELS: Record<number, string> = {
  1: 'استحقاقی',
  2: 'استعلاجی',
  3: 'بدون حقوق',
  4: 'سایر',
};

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
