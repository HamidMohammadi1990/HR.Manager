import {
  getPersianParts,
  persianMonthLength,
  persianToDate,
  todayPersian,
  type PersianDateParts,
} from '@/lib/persianCalendar';
import { formatPersianNumber } from '@/lib/utils';

export type { PersianDateParts };

export const PERSIAN_MONTH_NAMES = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
] as const;

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME_PATTERN = /^(\d{1,2}):(\d{2})$/;

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

function dateToGregorianString(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function todayGregorianDateString(): string {
  return dateToGregorianString(new Date());
}

export function gregorianDateStringToPersian(dateStr: string): PersianDateParts | null {
  if (!dateStr) return null;
  const match = DATE_PATTERN.exec(dateStr);
  if (!match) {
    const parsed = new Date(dateStr);
    if (Number.isNaN(parsed.getTime())) return null;
    return getPersianParts(parsed);
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day, 12, 0, 0, 0);
  if (Number.isNaN(date.getTime())) return null;
  return getPersianParts(date);
}

export function persianToGregorianDateString(parts: PersianDateParts): string {
  return dateToGregorianString(persianToDate(parts.year, parts.month, parts.day));
}

export function clampPersianDay(parts: PersianDateParts): PersianDateParts {
  const maxDay = persianMonthLength(parts.year, parts.month);
  return { ...parts, day: Math.min(Math.max(parts.day, 1), maxDay) };
}

export function isoToGregorianDateString(iso?: string | null): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return dateToGregorianString(date);
}

export function isoToTimeString(iso?: string | null): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

export function parseTimeString(time: string): { hour: number; minute: number } | null {
  if (!time) return null;
  const match = TIME_PATTERN.exec(time.trim());
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return { hour, minute };
}

export function formatTimeString(hour: number, minute: number): string {
  return `${pad2(hour)}:${pad2(minute)}`;
}

export function combineGregorianDateAndTimeToIso(dateStr: string, timeStr: string): string {
  if (!dateStr) throw new Error('تاریخ نامعتبر است');
  const time = parseTimeString(timeStr) ?? { hour: 0, minute: 0 };
  const match = DATE_PATTERN.exec(dateStr);
  if (!match) throw new Error('تاریخ نامعتبر است');
  const date = new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
    time.hour,
    time.minute,
    0,
    0,
  );
  if (Number.isNaN(date.getTime())) throw new Error('تاریخ یا ساعت نامعتبر است');
  return date.toISOString();
}

export function splitLocalDateTimeValue(value: string): { date: string; time: string } {
  if (!value) return { date: '', time: '' };
  if (value.includes('T')) {
    const [datePart, timePart] = value.split('T');
    return {
      date: datePart ?? '',
      time: (timePart ?? '').slice(0, 5),
    };
  }
  return { date: isoToGregorianDateString(value), time: isoToTimeString(value) };
}

export function formatPersianDateLabel(dateStr: string): string {
  const parts = gregorianDateStringToPersian(dateStr);
  if (!parts) return '—';
  return `${formatPersianNumber(parts.year)}/${formatPersianNumber(parts.month)}/${formatPersianNumber(parts.day)}`;
}

export function formatPersianDateTimeLabel(dateStr: string, timeStr: string): string {
  if (!dateStr) return '—';
  const dateLabel = formatPersianDateLabel(dateStr);
  if (!timeStr) return dateLabel;
  const time = parseTimeString(timeStr);
  if (!time) return dateLabel;
  return `${dateLabel} • ${formatPersianNumber(time.hour)}:${formatPersianNumber(time.minute)}`;
}

export function defaultPersianDateParts(): PersianDateParts {
  return todayPersian();
}

export function persianYearOptions(rangeBefore = 80, rangeAfter = 10): number[] {
  const current = todayPersian().year;
  const years: number[] = [];
  for (let year = current - rangeBefore; year <= current + rangeAfter; year += 1) {
    years.push(year);
  }
  return years.reverse();
}

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

export function toLatinDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (char) => String(PERSIAN_DIGITS.indexOf(char)))
    .replace(/[٠-٩]/g, (char) => String(ARABIC_DIGITS.indexOf(char)));
}

function isValidPersianParts(parts: PersianDateParts): boolean {
  if (!Number.isFinite(parts.year) || parts.month < 1 || parts.month > 12 || parts.day < 1) {
    return false;
  }
  return parts.day <= persianMonthLength(parts.year, parts.month);
}

export function formatPersianSlashDate(parts: PersianDateParts): string {
  return `${parts.year}/${pad2(parts.month)}/${pad2(parts.day)}`;
}

export function parsePersianSlashDate(text: string): PersianDateParts | null {
  const normalized = toLatinDigits(text).trim();
  if (!normalized) return null;

  const slashParts = normalized.split('/').map((part) => part.replace(/\D/g, '')).filter(Boolean);
  if (slashParts.length === 3) {
    const parts = {
      year: Number(slashParts[0]),
      month: Number(slashParts[1]),
      day: Number(slashParts[2]),
    };
    return isValidPersianParts(parts) ? parts : null;
  }

  const digits = normalized.replace(/\D/g, '');
  if (digits.length === 8) {
    const parts = {
      year: Number(digits.slice(0, 4)),
      month: Number(digits.slice(4, 6)),
      day: Number(digits.slice(6, 8)),
    };
    return isValidPersianParts(parts) ? parts : null;
  }

  return null;
}

export function formatTimeInputValue(raw: string): string {
  const digits = toLatinDigits(raw).replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

export function normalizeTimeInput(raw: string): string | null {
  const trimmed = toLatinDigits(raw).trim();
  if (!trimmed) return null;

  const colonMatch = TIME_PATTERN.exec(trimmed);
  if (colonMatch) {
    const parsed = parseTimeString(trimmed);
    return parsed ? formatTimeString(parsed.hour, parsed.minute) : null;
  }

  const digits = trimmed.replace(/\D/g, '');
  if (digits.length === 3 || digits.length === 4) {
    const hour = Number(digits.slice(0, digits.length - 2));
    const minute = Number(digits.slice(-2));
    if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
      return formatTimeString(hour, minute);
    }
  }

  return null;
}

export function formatPersianDateHeading(dateStr: string): string {
  const parts = gregorianDateStringToPersian(dateStr);
  if (!parts) return 'انتخاب تاریخ';
  const date = persianToDate(parts.year, parts.month, parts.day);
  return date.toLocaleDateString('fa-IR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    calendar: 'persian',
  });
}

export function compareGregorianDates(a: string, b: string): number {
  if (!a || !b) return 0;
  return a.localeCompare(b);
}
