export const leaveMetrics = [
  {
    icon: 'material-symbols:event-available',
    iconColor: 'text-emerald-500',
    iconBg: '#10b98115',
    label: 'مرخصی‌های تایید شده',
    value: '۴۲',
    subValue: 'ماه جاری',
    subColor: 'text-emerald-600',
  },
  {
    icon: 'material-symbols:schedule',
    iconColor: 'text-amber-500',
    iconBg: '#f59e0b15',
    label: 'در انتظار تایید',
    value: '۸',
    subValue: 'نیاز به بررسی',
    subColor: 'text-amber-600',
  },
  {
    icon: 'material-symbols:event-busy',
    iconColor: 'text-red-500',
    iconBg: '#ef444415',
    label: 'مرخصی‌های رد شده',
    value: '۳',
    subValue: 'ماه جاری',
    subColor: 'text-red-600',
  },
  {
    icon: 'material-symbols:calendar-today',
    iconColor: 'text-violet-500',
    iconBg: '#8b5cf615',
    label: 'مرخصی‌های امروز',
    value: '۵',
    subValue: 'در مرخصی',
    subColor: 'text-violet-600',
  },
] as const;

export const leaveTypes = [
  { title: 'استحقاقی', detail: '۳۰ روز سالانه', icon: 'material-symbols:beach-access', color: 'emerald' },
  { title: 'بیماری', detail: '۱۰ روز سالانه', icon: 'material-symbols:sick', color: 'red' },
  { title: 'شخصی', detail: '۵ روز سالانه', icon: 'material-symbols:person', color: 'blue' },
  { title: 'زایمان', detail: '۹۰ روز', icon: 'material-symbols:pregnant-woman', color: 'amber' },
];

export const leaveBalances = [
  { label: 'مرخصی استحقاقی', used: '۲۲/۳۰ روز', progress: 73, color: 'bg-emerald-500', remaining: '۸ روز باقی مانده' },
  { label: 'مرخصی بیماری', used: '۵/۱۰ روز', progress: 50, color: 'bg-red-500', remaining: '۵ روز باقی مانده' },
  { label: 'مرخصی شخصی', used: '۲/۵ روز', progress: 40, color: 'bg-blue-500', remaining: '۳ روز باقی مانده' },
];

export const leaveTypeOptions = [
  'مرخصی استحقاقی',
  'مرخصی ساعتی',
  'مرخصی بیماری',
  'مرخصی بدون حقوق',
  'مرخصی زایمان',
];

export const pendingApprovals = [
  {
    initials: 'سا',
    name: 'سارا احمدی',
    role: 'توسعه دهنده • فناوری اطلاعات',
    gradient: 'from-blue-500 to-blue-600',
    time: '۲ ساعت پیش',
    type: 'استحقاقی',
    dates: '۱۵-۱۷ دی',
    duration: '۳ روز',
    reason: '"برای شرکت در دوره آموزشی"',
  },
  {
    initials: 'علی',
    name: 'علی محمدی',
    role: 'مدیر فروش • فروش و بازاریابی',
    gradient: 'from-emerald-500 to-emerald-600',
    time: '۴ ساعت پیش',
    type: 'ساعتی',
    dates: '۱۴ دی',
    duration: '۴ ساعت',
    reason: '"برای امور پزشکی"',
  },
];

export const upcomingLeaves = [
  {
    day: '۱۸',
    name: 'مریم رضایی',
    detail: 'مرخصی استحقاقی • ۵ روز',
    dates: '۱۸-۲۲ دی',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  {
    day: '۲۰',
    name: 'حسن کریمی',
    detail: 'مرخصی ساعتی • ۳ ساعت',
    dates: '۲۰ دی',
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    day: '۲۵',
    name: 'نازنین احمدی',
    detail: 'مرخصی بیماری • ۲ روز',
    dates: '۲۵-۲۶ دی',
    gradient: 'from-violet-500 to-violet-600',
  },
];

export const leaveHistory = [
  {
    initials: 'سا',
    name: 'سارا احمدی',
    gradient: 'from-blue-500 to-blue-600',
    type: 'استحقاقی',
    dates: '۱۰-۱۲ آذر',
    duration: '۳ روز',
    status: 'تایید شده',
    statusVariant: 'success' as const,
    approver: 'مدیر منابع انسانی',
  },
  {
    initials: 'علی',
    name: 'علی محمدی',
    gradient: 'from-emerald-500 to-emerald-600',
    type: 'ساعتی',
    dates: '۵ آذر',
    duration: '۴ ساعت',
    status: 'تایید شده',
    statusVariant: 'success' as const,
    approver: 'مدیر فروش',
  },
  {
    initials: 'مری',
    name: 'مریم رضایی',
    gradient: 'from-red-500 to-red-600',
    type: 'بیماری',
    dates: '۱ آذر',
    duration: '۱ روز',
    status: 'رد شده',
    statusVariant: 'destructive' as const,
    approver: 'مدیر منابع انسانی',
  },
];

export const leaveStatsBreakdown = [
  { label: 'استحقاقی', value: '۶۰%' },
  { label: 'بیماری', value: '۱۵%' },
  { label: 'ساعتی', value: '۱۰%' },
];

export const leaveQuickActions = [
  { icon: 'material-symbols:rule', label: 'سیاست‌ها', color: 'blue' },
  { icon: 'material-symbols:description', label: 'گزارش', color: 'emerald' },
  { icon: 'material-symbols:settings', label: 'تنظیمات', color: 'violet' },
  { icon: 'material-symbols:help', label: 'راهنما', color: 'amber' },
] as const;
