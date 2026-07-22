import { PermissionType } from '@/lib/permissionTypes';

export interface NavItem {
  label: string;
  path?: string;
  icon?: string;
  children?: NavItem[];
  /** User must have at least one of these permissions. Omit for all authenticated users. */
  permissions?: number[];
}

export const mainNavItems: NavItem[] = [
  { label: 'داشبورد', path: '/', icon: 'material-symbols:space-dashboard' },
  {
    label: 'تقویم',
    path: '/calendar',
    icon: 'material-symbols:calendar-month',
    permissions: [PermissionType.ListCalendarEvent],
  },
];

export const usersNavItems: NavItem[] = [
  {
    label: 'لیست کاربران',
    path: '/users',
    icon: 'material-symbols:groups',
    permissions: [PermissionType.ListUser],
  },
  {
    label: 'کاربر جدید',
    path: '/users/new',
    icon: 'material-symbols:person-add',
    permissions: [PermissionType.CreateUser],
  },
  {
    label: 'نقش‌ها',
    path: '/roles',
    icon: 'material-symbols:shield-person',
    permissions: [PermissionType.ListRole],
  },
  {
    label: 'دسترسی‌ها',
    path: '/permissions',
    icon: 'material-symbols:lock-person',
    permissions: [PermissionType.ListPermission],
  },
];

export const hrNavItems: NavItem[] = [
  {
    label: 'کارمندان',
    path: '/employees',
    icon: 'material-symbols:badge',
    permissions: [PermissionType.ListEmployee],
  },
  {
    label: 'دپارتمان‌ها',
    path: '/departments',
    icon: 'material-symbols:corporate-fare',
    permissions: [PermissionType.ListDepartment],
  },
  {
    label: 'چارت سازمانی',
    path: '/departments/tree',
    icon: 'material-symbols:account-tree',
    permissions: [PermissionType.ListDepartment],
  },
  {
    label: 'حضور و غیاب',
    path: '/attendance',
    icon: 'material-symbols:fingerprint',
    permissions: [PermissionType.ListAttendance],
  },
  {
    label: 'مرخصی‌ها',
    path: '/leaves',
    icon: 'material-symbols:beach-access',
    permissions: [PermissionType.ListLeave],
  },
  {
    label: 'کارتابل تأیید',
    path: '/leaves/inbox',
    icon: 'material-symbols:inbox',
    permissions: [PermissionType.GetLeaveApprovalInbox],
  },
  {
    label: 'انواع مرخصی',
    path: '/leave-types',
    icon: 'material-symbols:category',
    permissions: [PermissionType.ManageLeaveTypeDefinition],
  },
  {
    label: 'موجودی مرخصی',
    path: '/leave-balances',
    icon: 'material-symbols:hourglass-top',
    permissions: [PermissionType.ListLeaveBalance],
  },
  {
    label: 'حقوق و دستمزد',
    path: '/payroll',
    icon: 'material-symbols:payments',
    permissions: [PermissionType.ListPayroll],
  },
  {
    label: 'شیفت کاری',
    path: '/work-shifts',
    icon: 'material-symbols:work-history',
    permissions: [PermissionType.ManageWorkShift],
  },
];

export const toolsNavItems: NavItem[] = [
  {
    label: 'لیست کارها',
    path: '/todo',
    icon: 'material-symbols:checklist',
    permissions: [PermissionType.ListTodoItem],
  },
  {
    label: 'اطلاعیه‌ها',
    path: '/announcements',
    icon: 'material-symbols:campaign',
    permissions: [PermissionType.ListAnnouncement],
  },
  {
    label: 'اعلان‌ها',
    path: '/notifications',
    icon: 'material-symbols:notifications',
    permissions: [PermissionType.ListNotification],
  },
  {
    label: 'پشتیبان‌گیری',
    path: '/backup',
    icon: 'material-symbols:cloud-upload',
    permissions: [PermissionType.ListBackupJob],
  },
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
    permissions: [PermissionType.CreateUser],
  },
  {
    label: 'درخواست مرخصی',
    description: 'ثبت مرخصی جدید',
    path: '/leaves',
    icon: 'material-symbols:event-note',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    shortcut: ['Alt', 'L'],
    permissions: [PermissionType.ListLeave],
  },
  {
    label: 'کاربران',
    description: 'مدیریت کاربران سیستم',
    path: '/users',
    icon: 'material-symbols:group',
    color: 'text-sky-500',
    bg: 'bg-sky-500/10',
    shortcut: ['Alt', 'U'],
    permissions: [PermissionType.ListUser],
  },
  {
    label: 'گزارش حضور',
    description: 'آمار حضور و غیاب',
    path: '/attendance',
    icon: 'material-symbols:analytics',
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
    shortcut: ['Alt', 'A'],
    permissions: [PermissionType.ListAttendance],
  },
];

export const quickAccessPages = [
  { label: 'داشبورد', path: '/', icon: 'material-symbols:space-dashboard' },
  {
    label: 'کارمندان',
    path: '/employees',
    icon: 'material-symbols:badge',
    permissions: [PermissionType.ListEmployee],
  },
  {
    label: 'حضور و غیاب',
    path: '/attendance',
    icon: 'material-symbols:fingerprint',
    permissions: [PermissionType.ListAttendance],
  },
  {
    label: 'مرخصی‌ها',
    path: '/leaves',
    icon: 'material-symbols:beach-access',
    permissions: [PermissionType.ListLeave],
  },
  {
    label: 'حقوق و دستمزد',
    path: '/payroll',
    icon: 'material-symbols:payments',
    permissions: [PermissionType.ListPayroll],
  },
  {
    label: 'کاربران',
    path: '/users',
    icon: 'material-symbols:groups',
    permissions: [PermissionType.ListUser],
  },
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
    '/departments': 'دپارتمان‌ها',
    '/departments/tree': 'چارت سازمانی',
    '/attendance': 'حضور و غیاب',
    '/leaves': 'مرخصی‌ها',
    '/leaves/inbox': 'کارتابل تأیید مرخصی',
    '/leave-types': 'انواع مرخصی',
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
    '/access-denied': 'دسترسی مجاز نیست',
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
  '/leaves/inbox': { title: 'کارتابل تأیید مرخصی', description: 'درخواست‌های در انتظار تأیید شما' },
  '/payroll': { title: 'مدیریت حقوق و دستمزد', description: 'محاسبه حقوق، فیش حقوقی و پرداخت‌های پرسنلی' },
};
