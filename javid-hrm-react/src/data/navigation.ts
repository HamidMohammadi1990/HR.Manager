import { ReactNode } from 'react';

export interface NavItem {
  label: string;
  path?: string;
  icon?: string;
  children?: NavItem[];
}

export const mainNavItems: NavItem[] = [
  { label: 'داشبورد', path: '/', icon: 'material-symbols:space-dashboard' },
  { label: 'تقویم', path: '/calendar', icon: 'material-symbols:calendar-month' },
];

export const usersNavItems: NavItem[] = [
  { label: 'لیست کاربران', path: '/users', icon: 'material-symbols:groups' },
  { label: 'کاربر جدید', path: '/users/new', icon: 'material-symbols:person-add' },
  { label: 'نقش‌ها', path: '/roles', icon: 'material-symbols:shield-person' },
  { label: 'دسترسی‌ها', path: '/permissions', icon: 'material-symbols:lock-person' },
];

export const hrNavItems: NavItem[] = [
  { label: 'کارمندان', path: '/employees', icon: 'material-symbols:badge' },
  { label: 'بخش‌ها', path: '/departments', icon: 'material-symbols:corporate-fare' },
  { label: 'حضور و غیاب', path: '/attendance', icon: 'material-symbols:fingerprint' },
  { label: 'مرخصی‌ها', path: '/leaves', icon: 'material-symbols:beach-access' },
  { label: 'موجودی مرخصی', path: '/leave-balances', icon: 'material-symbols:hourglass-top' },
  { label: 'حقوق و دستمزد', path: '/payroll', icon: 'material-symbols:payments' },
  { label: 'شیفت کاری', path: '/work-shifts', icon: 'material-symbols:work-history' },
];

export const toolsNavItems: NavItem[] = [
  { label: 'لیست کارها', path: '/todo', icon: 'material-symbols:checklist' },
  { label: 'اطلاعیه‌ها', path: '/announcements', icon: 'material-symbols:campaign' },
  { label: 'اعلان‌ها', path: '/notifications', icon: 'material-symbols:notifications' },
  { label: 'پشتیبان‌گیری', path: '/backup', icon: 'material-symbols:cloud-upload' },
];

export const accountNavItems: NavItem[] = [
  { label: 'پروفایل کاربری', path: '/profile', icon: 'material-symbols:account-circle' },
  { label: 'تنظیمات', path: '/settings', icon: 'material-symbols:settings' },
  { label: 'راهنما و پشتیبانی', path: '/help', icon: 'material-symbols:support-agent' },
];

export const quickAccessActions = [
  {
    label: 'افزودن کاربر',
    description: 'ایجاد کاربر جدید در سیستم',
    path: '/users/new',
    icon: 'material-symbols:person-add',
    color: 'text-primary',
    bg: 'bg-primary/10',
    shortcut: ['Alt', 'N'],
  },
  {
    label: 'درخواست مرخصی',
    description: 'ثبت مرخصی جدید',
    path: '/leaves',
    icon: 'material-symbols:event-note',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    shortcut: ['Alt', 'L'],
  },
  {
    label: 'کاربران',
    description: 'مدیریت کاربران سیستم',
    path: '/users',
    icon: 'material-symbols:group',
    color: 'text-sky-500',
    bg: 'bg-sky-500/10',
    shortcut: ['Alt', 'U'],
  },
  {
    label: 'گزارش حضور',
    description: 'آمار حضور و غیاب',
    path: '/attendance',
    icon: 'material-symbols:analytics',
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
    shortcut: ['Alt', 'A'],
  },
];

export const quickAccessPages = [
  { label: 'داشبورد', path: '/', icon: 'material-symbols:space-dashboard' },
  { label: 'کارمندان', path: '/employees', icon: 'material-symbols:badge' },
  { label: 'حضور و غیاب', path: '/attendance', icon: 'material-symbols:fingerprint' },
  { label: 'مرخصی‌ها', path: '/leaves', icon: 'material-symbols:beach-access' },
  { label: 'حقوق و دستمزد', path: '/payroll', icon: 'material-symbols:payments' },
  { label: 'کاربران', path: '/users', icon: 'material-symbols:groups' },
  { label: 'تنظیمات', path: '/settings', icon: 'material-symbols:settings' },
  { label: 'راهنما', path: '/help', icon: 'material-symbols:support-agent' },
];

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  unread?: boolean;
}

export const headerNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'درخواست مرخصی جدید',
    description: 'سارا احمدی • ۳ روز استحقاقی',
    time: '۵ دقیقه پیش',
    icon: 'material-symbols:event-note',
    iconColor: 'text-primary',
    iconBg: 'bg-primary/10',
    unread: true,
  },
  {
    id: '2',
    title: 'کارمند جدید استخدام شد',
    description: 'رضا کریمی • فروش',
    time: '۱۰ دقیقه پیش',
    icon: 'material-symbols:person-add',
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-500/10',
    unread: true,
  },
  {
    id: '3',
    title: 'تاخیر در حضور',
    description: '۸ نفر امروز با تاخیر وارد شدند',
    time: '۳۰ دقیقه پیش',
    icon: 'material-symbols:schedule',
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-500/10',
    unread: true,
  },
];

export const currentUser = {
  name: 'مدیر سیستم',
  email: 'admin@example.com',
  initials: 'م',
};

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export function buildBreadcrumbs(path: string): BreadcrumbItem[] {
  const map: Record<string, string> = {
    '/': 'داشبورد',
    '/calendar': 'تقویم',
    '/users': 'کاربران',
    '/users/new': 'کاربر جدید',
    '/roles': 'نقش‌ها',
    '/permissions': 'دسترسی‌ها',
    '/employees': 'کارمندان',
    '/departments': 'بخش‌ها',
    '/attendance': 'حضور و غیاب',
    '/leaves': 'مرخصی‌ها',
    '/leave-balances': 'موجودی مرخصی',
    '/payroll': 'حقوق و دستمزد',
    '/work-shifts': 'شیفت کاری',
    '/settings': 'تنظیمات',
    '/notifications': 'اعلان‌ها',
    '/announcements': 'اطلاعیه‌ها',
    '/todo': 'لیست کارها',
    '/backup': 'پشتیبان‌گیری',
    '/profile': 'پروفایل',
    '/account-settings': 'تنظیمات حساب',
    '/help': 'راهنما و پشتیبانی',
  };
  const label = map[path];
  return label ? [{ label }] : [];
}

export type PageMeta = {
  title: string;
  description?: string;
};

export const pageMeta: Record<string, PageMeta> = {
  '/': { title: 'داشبورد', description: 'خوش آمدید به پنل مدیریت منابع انسانی' },
  '/employees': { title: 'مدیریت پرسنل', description: 'پروفایل، عملکرد و سازماندهی کارکنان' },
  '/attendance': { title: 'مدیریت حضور و غیاب', description: 'ثبت تردد، مرخصی‌ها و گزارش‌های زمانی' },
  '/leaves': { title: 'مدیریت مرخصی‌ها', description: 'درخواست، تایید و پیگیری مرخصی‌های پرسنل' },
  '/payroll': { title: 'مدیریت حقوق و دستمزد', description: 'محاسبه حقوق، فیش حقوقی و پرداخت‌های پرسنلی' },
};
