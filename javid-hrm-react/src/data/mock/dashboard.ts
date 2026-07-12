export const dashboardStats = [
  {
    icon: 'material-symbols:group',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    label: 'کل کارکنان',
    value: '۲۴۷',
  },
  {
    icon: 'material-symbols:check-circle',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-500',
    label: 'حضور امروز',
    value: '۲۳۴',
  },
  {
    icon: 'material-symbols:schedule',
    iconBg: 'bg-sky-500/10',
    iconColor: 'text-sky-500',
    label: 'مرخصی‌های فعال',
    value: '۱۲',
  },
  {
    icon: 'material-symbols:attach-money',
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-500',
    label: 'حقوق ماهانه',
    value: '۴۲۰M',
  },
] as const;

export const monthLabels = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور'];

export const attendanceTrendData = [220, 228, 231, 235, 234, 247];

export const payrollBarData = [380, 395, 410, 420, 435, 420];

export const departmentDistribution = {
  labels: ['فناوری اطلاعات', 'فروش و بازاریابی', 'منابع انسانی', 'مالی'],
  data: [35, 25, 22, 18],
};

export const recentHrActivities = [
  {
    id: '#HR-1234',
    employee: 'سارا احمدی',
    type: 'درخواست مرخصی',
    status: 'تایید شده',
    statusVariant: 'default' as const,
  },
  {
    id: '#HR-1233',
    employee: 'علی محمدی',
    type: 'ثبت حضور',
    status: 'در حال بررسی',
    statusVariant: 'alert' as const,
  },
  {
    id: '#HR-1232',
    employee: 'مریم رضایی',
    type: 'فیش حقوقی',
    status: 'در انتظار پرداخت',
    statusVariant: 'secondary' as const,
  },
  {
    id: '#HR-1231',
    employee: 'رضا کریمی',
    type: 'استخدام جدید',
    status: 'تکمیل شده',
    statusVariant: 'default' as const,
  },
];

export const recentActivities = [
  {
    icon: 'material-symbols:person-add',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    text: 'کارمند جدید استخدام شد',
    time: '۵ دقیقه پیش',
  },
  {
    icon: 'material-symbols:event-note',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-500',
    text: 'درخواست مرخصی تایید شد',
    time: '۱۰ دقیقه پیش',
  },
  {
    icon: 'material-symbols:schedule',
    iconBg: 'bg-sky-500/10',
    iconColor: 'text-sky-500',
    text: 'گزارش حضور روزانه ثبت شد',
    time: '۳۰ دقیقه پیش',
  },
];

export const quickActions = [
  {
    icon: 'material-symbols:person-add',
    label: 'استخدام جدید',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
  },
  {
    icon: 'material-symbols:event-note',
    label: 'درخواست مرخصی',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-500',
  },
  {
    icon: 'material-symbols:schedule',
    label: 'ثبت حضور',
    iconBg: 'bg-sky-500/10',
    iconColor: 'text-sky-500',
  },
  {
    icon: 'material-symbols:calculate',
    label: 'محاسبه حقوق',
    iconBg: 'bg-violet-500/10',
    iconColor: 'text-violet-500',
  },
];
