export const attendanceMetrics = [
  {
    icon: 'material-symbols:check-circle',
    iconColor: 'text-emerald-500',
    iconBg: '#10b98115',
    label: 'حاضرین امروز',
    value: '۱۸۷',
    subValue: '۹۴%',
    subColor: 'text-emerald-600',
  },
  {
    icon: 'material-symbols:cancel',
    iconColor: 'text-red-500',
    iconBg: '#ef444415',
    label: 'غایبین',
    value: '۱۳',
    subValue: '۶%',
    subColor: 'text-red-600',
  },
  {
    icon: 'material-symbols:schedule',
    iconColor: 'text-amber-500',
    iconBg: '#f59e0b15',
    label: 'دیرکرد',
    value: '۸',
    subValue: '۴%',
    subColor: 'text-amber-600',
  },
  {
    icon: 'material-symbols:work',
    iconColor: 'text-violet-500',
    iconBg: '#8b5cf615',
    label: 'اضافه کاری',
    value: '۲۴h',
    subValue: '+۱۲%',
    subColor: 'text-violet-600',
  },
] as const;

export const liveFeedItems = [
  {
    initials: 'سا',
    name: 'سارا احمدی',
    action: 'ورود • فناوری اطلاعات',
    time: '۱۴:۳۰',
    gradient: 'from-emerald-500 to-emerald-600',
    borderColor: 'border-emerald-500/20',
    bgColor: 'bg-emerald-500/5',
    timeColor: 'text-emerald-600',
  },
  {
    initials: 'علی',
    name: 'علی محمدی',
    action: 'خروج • فروش و بازاریابی',
    time: '۱۴:۲۵',
    gradient: 'from-red-500 to-red-600',
    borderColor: 'border-red-500/20',
    bgColor: 'bg-red-500/5',
    timeColor: 'text-red-600',
  },
  {
    initials: 'مری',
    name: 'مریم رضایی',
    action: 'ورود • مالی و حسابداری',
    time: '۱۴:۲۰',
    gradient: 'from-blue-500 to-blue-600',
    borderColor: 'border-blue-500/20',
    bgColor: 'bg-blue-500/5',
    timeColor: 'text-blue-600',
  },
  {
    initials: 'حس',
    name: 'حسن کریمی',
    action: 'ورود با تاخیر • منابع انسانی',
    time: '۱۴:۱۵',
    gradient: 'from-amber-500 to-amber-600',
    borderColor: 'border-amber-500/20',
    bgColor: 'bg-amber-500/5',
    timeColor: 'text-amber-600',
  },
  {
    initials: 'ناز',
    name: 'نازنین احمدی',
    action: 'خروج • فناوری اطلاعات',
    time: '۱۴:۱۰',
    gradient: 'from-violet-500 to-violet-600',
    borderColor: 'border-violet-500/20',
    bgColor: 'bg-violet-500/5',
    timeColor: 'text-violet-600',
  },
];

export const weeklyAttendance = [
  { day: 'شنبه', count: '۱۹۰', height: 60 },
  { day: 'یکشنبه', count: '۱۸۸', height: 58 },
  { day: 'دوشنبه', count: '۱۹۲', height: 62 },
  { day: 'سه‌شنبه', count: '۱۸۵', height: 55 },
  { day: 'چهارشنبه', count: '۱۸۹', height: 59 },
  { day: 'پنج‌شنبه', count: '۱۸۷', height: 57 },
  { day: 'جمعه', count: '۱۸۷', height: 48, isToday: true },
];

export const attendanceLeaveRequests = [
  {
    name: 'علی محمدی',
    detail: 'مرخصی استحقاقی • ۲ روز',
    status: 'در انتظار',
    statusVariant: 'alert' as const,
    borderColor: 'border-amber-500/20',
    bgColor: 'bg-amber-500/5',
  },
  {
    name: 'سارا احمدی',
    detail: 'مرخصی ساعتی • ۴ ساعت',
    status: 'تایید شده',
    statusVariant: 'success' as const,
    borderColor: 'border-emerald-500/20',
    bgColor: 'bg-emerald-500/5',
  },
  {
    name: 'حسن کریمی',
    detail: 'مرخصی بدون حقوق • ۱ روز',
    status: 'رد شده',
    statusVariant: 'destructive' as const,
    borderColor: 'border-red-500/20',
    bgColor: 'bg-red-500/5',
  },
];

export const overtimeSummary = [
  { label: 'کل اضافه کاری', value: '۱۴۶ ساعت' },
  { label: 'میانگین روزانه', value: '۴.۹ ساعت' },
  { label: 'بیشترین اضافه کاری', value: '۱۲ ساعت', highlight: true },
];

export const attendancePolicies = [
  { title: 'ساعت کاری', detail: '۸:۰۰ - ۱۷:۰۰', icon: 'material-symbols:schedule', color: 'blue' },
  { title: 'تاخیر مجاز', detail: '۱۵ دقیقه', icon: 'material-symbols:timer', color: 'emerald' },
  { title: 'مرخصی سالانه', detail: '۳۰ روز', icon: 'material-symbols:beach-access', color: 'amber' },
];

export const todaySummary = [
  { label: 'کل پرسنل', value: '۲۰۰' },
  { label: 'حاضرین', value: '۱۸۷', color: 'text-emerald-600' },
  { label: 'غایبین', value: '۱۳', color: 'text-red-600' },
  { label: 'دیرکرد', value: '۸', color: 'text-amber-600' },
  { label: 'مرخصی', value: '۲', color: 'text-blue-600' },
];

export const monthlyReportStats = [
  { value: '۹۴%', label: 'نرخ حضور', note: '+۲% نسبت به ماه قبل', gradient: 'from-emerald-500 to-emerald-600' },
  { value: '۸.۵', label: 'میانگین ساعات کاری', note: 'ساعت در روز', gradient: 'from-blue-500 to-blue-600' },
  { value: '۴۲', label: 'روز مرخصی', note: 'استفاده شده', gradient: 'from-amber-500 to-amber-600' },
  { value: '۱۴۶', label: 'ساعت اضافه کاری', note: 'جمع کل', gradient: 'from-violet-500 to-violet-600' },
];

export const attendanceQuickActions = [
  { icon: 'material-symbols:beach-access', label: 'مرخصی', color: 'blue' },
  { icon: 'material-symbols:sick', label: 'بیماری', color: 'emerald' },
  { icon: 'material-symbols:work', label: 'مأموریت', color: 'violet' },
  { icon: 'material-symbols:analytics', label: 'گزارش', color: 'amber' },
] as const;
