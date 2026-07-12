export const departmentMetrics = [
  {
    icon: 'lucide:building-2',
    iconColor: 'text-blue-500',
    iconBg: '#3b82f615',
    label: 'کل بخش‌ها',
    value: '۸',
    subValue: 'فعال',
    subColor: 'text-blue-600',
  },
  {
    icon: 'material-symbols:group',
    iconColor: 'text-emerald-500',
    iconBg: '#10b98115',
    label: 'کل کارکنان',
    value: '۲۴۷',
    subValue: '+۵',
    subColor: 'text-emerald-600',
  },
  {
    icon: 'material-symbols:trending-up',
    iconColor: 'text-amber-500',
    iconBg: '#f59e0b15',
    label: 'میانگین عملکرد',
    value: '۸۴%',
    subValue: '+۳%',
    subColor: 'text-amber-600',
  },
  {
    icon: 'material-symbols:account-balance-wallet',
    iconColor: 'text-red-500',
    iconBg: '#ef444415',
    label: 'کل بودجه',
    value: '۴۲۰M',
    subValue: '۹۲%',
    subColor: 'text-red-600',
  },
] as const;

export const orgChart = {
  ceo: { name: 'احمد رضایی', title: 'مدیرعامل' },
  departments: [
    { abbr: 'فن', name: 'فناوری اطلاعات', count: '۲۴ نفر', manager: 'سارا احمدی', gradient: 'from-blue-500 to-blue-600' },
    { abbr: 'فروش', name: 'فروش و بازاریابی', count: '۱۸ نفر', manager: 'علی محمدی', gradient: 'from-emerald-500 to-emerald-600' },
    { abbr: 'مالی', name: 'مالی و حسابداری', count: '۱۲ نفر', manager: 'مریم رضایی', gradient: 'from-amber-500 to-amber-600' },
  ],
  subDepartments: [
    { abbr: 'توس', name: 'توسعه', count: '۸ نفر', gradient: 'from-cyan-500 to-cyan-600' },
    { abbr: 'طر', name: 'طراحی', count: '۶ نفر', gradient: 'from-teal-500 to-teal-600' },
    { abbr: 'پشتی', name: 'پشتیبانی', count: '۴ نفر', gradient: 'from-green-500 to-green-600' },
    { abbr: 'مارک', name: 'بازاریابی', count: '۵ نفر', gradient: 'from-lime-500 to-lime-600' },
    { abbr: 'حس', name: 'حسابداری', count: '۷ نفر', gradient: 'from-yellow-500 to-yellow-600' },
    { abbr: 'من', name: 'منابع انسانی', count: '۸ نفر', gradient: 'from-orange-500 to-orange-600' },
  ],
};

export const departmentPerformance = [
  { name: 'فناوری اطلاعات', icon: 'material-symbols:computer', color: 'blue', percent: '۹۲%', progress: 92 },
  { name: 'فروش و بازاریابی', icon: 'material-symbols:shopping-cart', color: 'emerald', percent: '۸۸%', progress: 88 },
  { name: 'مالی و حسابداری', icon: 'material-symbols:account-balance', color: 'amber', percent: '۹۵%', progress: 95 },
  { name: 'منابع انسانی', icon: 'material-symbols:group', color: 'violet', percent: '۸۵%', progress: 85 },
  { name: 'لجستیک و انبار', icon: 'material-symbols:local-shipping', color: 'red', percent: '۷۸%', progress: 78 },
];

export const budgetAllocation = [
  { name: 'فناوری اطلاعات', percent: '۳۵%', progress: 35, color: 'bg-blue-500' },
  { name: 'فروش و بازاریابی', percent: '۲۵%', progress: 25, color: 'bg-emerald-500' },
  { name: 'مالی و حسابداری', percent: '۲۰%', progress: 20, color: 'bg-amber-500' },
  { name: 'سایر بخش‌ها', percent: '۲۰%', progress: 20, color: 'bg-gray-500' },
];

export const headcountDistribution = [
  { name: 'فناوری اطلاعات', count: '۲۴ نفر', progress: 32, color: 'bg-blue-500' },
  { name: 'فروش و بازاریابی', count: '۱۸ نفر', progress: 24, color: 'bg-emerald-500' },
  { name: 'مالی و حسابداری', count: '۱۲ نفر', progress: 16, color: 'bg-amber-500' },
  { name: 'سایر بخش‌ها', count: '۲۵ نفر', progress: 28, color: 'bg-gray-500' },
];

export const departmentGoals = [
  { title: 'رشد فروش', target: 'هدف: ۲ میلیارد تومان', percent: '۸۵%', badgeVariant: 'info' as const, borderColor: 'border-blue-500/20', bgColor: 'bg-blue-500/5' },
  { title: 'رضایت مشتری', target: 'هدف: بالای ۹۰%', percent: '۹۲%', badgeVariant: 'success' as const, borderColor: 'border-emerald-500/20', bgColor: 'bg-emerald-500/5' },
  { title: 'بهبود فرایندها', target: 'هدف: کاهش ۲۰% زمان', percent: '۷۸%', badgeVariant: 'alert' as const, borderColor: 'border-amber-500/20', bgColor: 'bg-amber-500/5' },
];

export const departmentCommunications = [
  { title: 'چت تیمی', detail: '۵ پیام جدید', icon: 'material-symbols:chat', color: 'blue' },
  { title: 'جلسات هفتگی', detail: 'فردا ساعت ۱۰', icon: 'material-symbols:event', color: 'emerald' },
  { title: 'گزارش‌ها', detail: '۳ گزارش جدید', icon: 'material-symbols:description', color: 'violet' },
];

export const crossDepartmentProjects = [
  {
    title: 'پلتفرم دیجیتال',
    description: 'پروژه توسعه فروشگاه آنلاین',
    icon: 'material-symbols:rocket-launch',
    badges: [
      { label: 'فناوری', variant: 'info' as const },
      { label: 'فروش', variant: 'success' as const },
      { label: 'مالی', variant: 'alert' as const },
    ],
  },
  {
    title: 'کمپین بازاریابی',
    description: 'طرح جامع بازاریابی دیجیتال',
    icon: 'material-symbols:campaign',
    badges: [
      { label: 'فروش', variant: 'success' as const },
      { label: 'منابع انسانی', variant: 'violet' as const },
    ],
  },
  {
    title: 'امنیت اطلاعات',
    description: 'بهبود امنیت سیستم‌ها',
    icon: 'material-symbols:security',
    badges: [
      { label: 'فناوری', variant: 'info' as const },
      { label: 'مالی', variant: 'alert' as const },
    ],
  },
];

export const departmentQuickActions = [
  { icon: 'material-symbols:group-add', label: 'افزودن عضو', color: 'blue' },
  { icon: 'material-symbols:flag', label: 'اهداف', color: 'emerald' },
  { icon: 'material-symbols:analytics', label: 'گزارش', color: 'violet' },
  { icon: 'material-symbols:settings', label: 'تنظیمات', color: 'amber' },
] as const;
