export interface PersianDateParts {
  year: number;
  month: number;
  day: number;
}

const PERSIAN_EPOCH = 1948320.5;

function mod(a: number, b: number): number {
  return a - b * Math.floor(a / b);
}

function persianToJulianDay(year: number, month: number, day: number): number {
  const epBase = year - (year >= 0 ? 474 : 473);
  const epYear = 474 + mod(epBase, 2820);

  return (
    day +
    (month <= 7 ? (month - 1) * 31 : (month - 7) * 30 + 186) +
    Math.floor((epYear * 682 - 110) / 2816) +
    (epYear - 1) * 365 +
    Math.floor(epBase / 2820) * 1029983 +
    (PERSIAN_EPOCH - 1)
  );
}

function julianDayToGregorian(jdn: number): { year: number; month: number; day: number } {
  const z = Math.floor(jdn + 0.5);
  const a = Math.floor((z - 1867216.25) / 36524.25);
  const b = z + 1 + a - Math.floor(a / 4);
  const c = b + 1524;
  const d = Math.floor((c - 122.1) / 365.25);
  const e = Math.floor(365.25 * d);
  const f = Math.floor((c - e) / 30.6001);
  const day = c - e - Math.floor(30.6001 * f);
  const month = f < 14 ? f - 1 : f - 13;
  const year = month > 2 ? d - 4716 : d - 4715;

  return { year, month, day };
}

function julianDayToPersian(jdn: number): PersianDateParts {
  const depoch = jdn - persianToJulianDay(475, 1, 1);
  const cycle = Math.floor(depoch / 1029983);
  const cyear = mod(depoch, 1029983);
  let ycycle = 2820;

  if (cyear !== 1029982) {
    const aux1 = Math.floor(cyear / 366);
    const aux2 = mod(cyear, 366);
    ycycle =
      Math.floor((2134 * aux1 + 2816 * aux2 + 2815) / 1028522) + aux1 + 1;
  }

  const year = ycycle + 2820 * cycle + 474;
  const yday = jdn - persianToJulianDay(year, 1, 1) + 1;
  const month = yday <= 186 ? Math.ceil(yday / 31) : Math.ceil((yday - 6) / 30);
  const day = jdn - persianToJulianDay(year, month, 1) + 1;

  return { year, month, day };
}

function dateToJulianDay(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;

  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

export function getPersianParts(date: Date): PersianDateParts {
  const formatter = new Intl.DateTimeFormat('en-u-ca-persian', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  const parts = formatter.formatToParts(date);
  const year = Number(parts.find((part) => part.type === 'year')?.value);
  const month = Number(parts.find((part) => part.type === 'month')?.value);
  const day = Number(parts.find((part) => part.type === 'day')?.value);

  if (Number.isFinite(year) && Number.isFinite(month) && Number.isFinite(day)) {
    return { year, month, day };
  }

  return julianDayToPersian(dateToJulianDay(date));
}

export function persianMonthLength(year: number, month: number): number {
  if (month >= 1 && month <= 6) return 31;
  if (month >= 7 && month <= 11) return 30;
  return persianToJulianDay(year + 1, 1, 1) - persianToJulianDay(year, 12, 1);
}

export function persianToDate(year: number, month: number, day: number): Date {
  const jdn = persianToJulianDay(year, month, day);
  const { year: gy, month: gm, day: gd } = julianDayToGregorian(jdn);
  return new Date(gy, gm - 1, gd, 12, 0, 0, 0);
}

export function startOfPersianMonth(year: number, month: number): Date {
  return persianToDate(year, month, 1);
}

export function endOfPersianMonth(year: number, month: number): Date {
  const lastDay = persianMonthLength(year, month);
  const date = persianToDate(year, month, lastDay);
  date.setHours(23, 59, 59, 999);
  return date;
}

export function formatPersianMonthLabel(year: number, month: number): string {
  return persianToDate(year, month, 1).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    calendar: 'persian',
  });
}

export function buildPersianMonthGrid(year: number, month: number): (number | null)[] {
  const firstDay = persianToDate(year, month, 1);
  const startWeekday = (firstDay.getDay() + 1) % 7;
  const lastDate = persianMonthLength(year, month);
  const cells: (number | null)[] = [];

  for (let i = 0; i < startWeekday; i += 1) cells.push(null);
  for (let d = 1; d <= lastDate; d += 1) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return cells;
}

export function isSamePersianDay(date: Date, year: number, month: number, day: number): boolean {
  const parts = getPersianParts(date);
  return parts.year === year && parts.month === month && parts.day === day;
}

export function todayPersian(): PersianDateParts {
  return getPersianParts(new Date());
}

export function addPersianMonths(year: number, month: number, delta: number): PersianDateParts {
  let totalMonths = year * 12 + (month - 1) + delta;
  const nextYear = Math.floor(totalMonths / 12);
  const nextMonth = mod(totalMonths, 12) + 1;
  return { year: nextYear, month: nextMonth, day: 1 };
}
