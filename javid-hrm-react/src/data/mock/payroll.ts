export const payrollMetrics = [
  {
    icon: 'lucide:credit-card',
    iconColor: 'text-emerald-500',
    iconBg: '#10b98115',
    label: 'کل پرداخت‌ها',
    value: '۴۲۰M',
    subValue: 'دی ۱۴۰۳',
    subColor: 'text-emerald-600',
  },
  {
    icon: 'material-symbols:account-balance',
    iconColor: 'text-red-500',
    iconBg: '#ef444415',
    label: 'کسورات',
    value: '۶۲M',
    subValue: '۱۴.۸%',
    subColor: 'text-red-600',
  },
  {
    icon: 'material-symbols:trending-up',
    iconColor: 'text-amber-500',
    iconBg: '#f59e0b15',
    label: 'میانگین حقوق',
    value: '۱۲.۵M',
    subValue: '+۸%',
    subColor: 'text-amber-600',
  },
  {
    icon: 'material-symbols:schedule',
    iconColor: 'text-violet-500',
    iconBg: '#8b5cf615',
    label: 'پرداخت‌های امروز',
    value: '۱۸۷',
    subValue: 'انجام شده',
    subColor: 'text-violet-600',
  },
] as const;

export const salaryGrades = [
  { grade: 'الف', range: '۲۰-۲۵ میلیون', gradient: 'from-emerald-500 to-emerald-600' },
  { grade: 'ب', range: '۱۵-۲۰ میلیون', gradient: 'from-blue-500 to-blue-600' },
  { grade: 'ج', range: '۱۰-۱۵ میلیون', gradient: 'from-amber-500 to-amber-600' },
  { grade: 'د', range: '۸-۱۰ میلیون', gradient: 'from-violet-500 to-violet-600' },
];

export const payrollStatus = {
  percent: '۶۵%',
  processed: '۱۸۷ از ۲۹۰ پرسنل',
  approved: '۱۸۷',
  pending: '۵۶',
  rejected: '۴۷',
};

export const recentPayslips = [
  {
    initials: 'سا',
    name: 'سارا احمدی',
    role: 'توسعه دهنده • فناوری اطلاعات',
    gradient: 'from-emerald-500 to-emerald-600',
    net: '۱۸,۵۰۰,۰۰۰ تومان',
    netColor: 'text-emerald-600',
    base: '۱۵,۰۰۰,۰۰۰',
    extra: '۲,۵۰۰,۰۰۰',
    extraLabel: 'اضافه کاری',
    deductions: '۱,۲۰۰,۰۰۰',
    status: 'پرداخت شده',
    statusVariant: 'success' as const,
    borderColor: 'border-emerald-500/20',
    bgColor: 'bg-emerald-500/5',
    actions: ['view', 'download', 'send'] as const,
  },
  {
    initials: 'علی',
    name: 'علی محمدی',
    role: 'مدیر فروش • فروش و بازاریابی',
    gradient: 'from-amber-500 to-amber-600',
    net: '۲۲,۸۰۰,۰۰۰ تومان',
    netColor: 'text-amber-600',
    base: '۲۰,۰۰۰,۰۰۰',
    extra: '۴,۰۰۰,۰۰۰',
    extraLabel: 'پاداش فروش',
    deductions: '۱,۲۰۰,۰۰۰',
    status: 'در انتظار',
    statusVariant: 'destructive' as const,
    borderColor: 'border-amber-500/20',
    bgColor: 'bg-amber-500/5',
    actions: ['view', 'edit', 'approve'] as const,
  },
];

export const salaryDistribution = [
  { range: 'زیر ۱۰ میلیون', percent: '۲۳%', color: 'bg-blue-500' },
  { range: '۱۰-۱۵ میلیون', percent: '۳۵%', color: 'bg-emerald-500' },
  { range: '۱۵-۲۰ میلیون', percent: '۲۸%', color: 'bg-amber-500' },
  { range: 'بالای ۲۰ میلیون', percent: '۱۴%', color: 'bg-violet-500' },
];

export const monthlyTrends = [
  { month: 'دی ۱۴۰۳', amount: '۴۲۰M' },
  { month: 'بهمن ۱۴۰۳', amount: '۳۹۵M' },
  { month: 'اسفند ۱۴۰۳', amount: '۴۱۰M' },
  { month: 'فروردین ۱۴۰۴', amount: '۴۳۵M' },
];

export const benefits = [
  { title: 'بیمه درمانی', detail: '۷% حقوق پایه', icon: 'material-symbols:local-hospital', color: 'blue' },
  { title: 'کمک هزینه تحصیلی', detail: 'تا ۵ میلیون تومان', icon: 'material-symbols:school', color: 'emerald' },
  { title: 'ایاب و ذهاب', detail: '۵۰۰ هزار تومان', icon: 'material-symbols:commute', color: 'amber' },
  { title: 'کمک هزینه غذا', detail: '۴۵۰ هزار تومان', icon: 'material-symbols:restaurant', color: 'violet' },
];

export const paymentMethods = [
  { title: 'انتقال بانکی', detail: '۸۵% پرسنل', icon: 'material-symbols:account-balance', color: 'emerald' },
  { title: 'کارت بانکی', detail: '۱۲% پرسنل', icon: 'lucide:credit-card', color: 'blue' },
  { title: 'نقدی', detail: '۳% پرسنل', icon: 'lucide:credit-card', color: 'amber' },
];

export const complianceStats = [
  { value: '۱۰۰%', label: 'پوشش بیمه', note: 'همه پرسنل بیمه شده', gradient: 'from-green-500 to-green-600' },
  { value: '۹۸%', label: 'رعایت مالیات', note: 'مالیات‌های پرداخت شده', gradient: 'from-blue-500 to-blue-600' },
  { value: '۱۰۰%', label: 'حداقل حقوق', note: 'بالای حداقل قانونی', gradient: 'from-emerald-500 to-emerald-600' },
  { value: '۹۵%', label: 'پرداخت اضافه کاری', note: 'طبق قوانین کار', gradient: 'from-amber-500 to-amber-600' },
];

export const payrollQuickActions = [
  { icon: 'material-symbols:description', label: 'گزارش', color: 'blue' },
  { icon: 'material-symbols:settings', label: 'تنظیمات', color: 'emerald' },
  { icon: 'material-symbols:backup', label: 'پشتیبان', color: 'violet' },
  { icon: 'material-symbols:help', label: 'راهنما', color: 'amber' },
] as const;
