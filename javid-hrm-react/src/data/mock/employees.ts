export type EmployeeStatus = 'success' | 'info' | 'alert';

export interface Employee {
  id: string;
  name: string;
  initials: string;
  role: string;
  department: string;
  experience: string;
  status: string;
  statusVariant: EmployeeStatus;
  gradient: string;
}

export interface DepartmentOverview {
  name: string;
  count: string;
  badgeVariant: 'info' | 'success' | 'violet' | 'alert';
  progress: number;
  progressColor: string;
  borderColor: string;
  bgColor: string;
  note: string;
}

export interface TrainingCourse {
  title: string;
  detail: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  badge: string;
  badgeVariant: 'violet' | 'success' | 'alert';
}

export interface LeaveRequestItem {
  type: string;
  employee: string;
  detail: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  action?: 'review';
  badge?: string;
  badgeVariant?: 'success';
}

export interface LifecycleItem {
  title: string;
  detail: string;
  icon: string;
  iconColor: string;
  iconBg: string;
}

export interface RecruitmentStage {
  count: string;
  label: string;
  color: string;
  progress: number;
  textColor: string;
}

export interface PerformanceMetric {
  label: string;
  value: string;
  progress: number;
  color: string;
}

export const hrMetrics = [
  {
    icon: 'material-symbols:group',
    iconColor: 'text-blue-500',
    iconBg: '#3b82f615',
    label: 'کل کارکنان',
    value: '۲۴۷',
    subValue: '+۵',
    subColor: 'text-blue-600',
  },
  {
    icon: 'material-symbols:work',
    iconColor: 'text-emerald-500',
    iconBg: '#10b98115',
    label: 'حضور امروز',
    value: '۲۳۴',
    subValue: '۹۵%',
    subColor: 'text-emerald-600',
  },
  {
    icon: 'material-symbols:schedule',
    iconColor: 'text-amber-500',
    iconBg: '#f59e0b15',
    label: 'مرخصی‌های فعال',
    value: '۱۲',
    subValue: '۴۸',
    subColor: 'text-amber-600',
  },
  {
    icon: 'material-symbols:trending-up',
    iconColor: 'text-red-500',
    iconBg: '#ef444415',
    label: 'رضایت کارکنان',
    value: '۸۶%',
    subValue: '+۲%',
    subColor: 'text-red-600',
  },
] as const;

export const departmentOverviews: DepartmentOverview[] = [
  {
    name: 'فناوری اطلاعات',
    count: '۲۴ نفر',
    badgeVariant: 'info',
    progress: 100,
    progressColor: 'bg-blue-500',
    borderColor: 'border-blue-500/20',
    bgColor: 'bg-blue-500/5',
    note: 'ظرفیت کامل',
  },
  {
    name: 'فروش و بازاریابی',
    count: '۱۸ نفر',
    badgeVariant: 'success',
    progress: 75,
    progressColor: 'bg-emerald-500',
    borderColor: 'border-emerald-500/20',
    bgColor: 'bg-emerald-500/5',
    note: '۶ نفر خالی',
  },
  {
    name: 'منابع انسانی',
    count: '۸ نفر',
    badgeVariant: 'violet',
    progress: 50,
    progressColor: 'bg-violet-500',
    borderColor: 'border-violet-500/20',
    bgColor: 'bg-violet-500/5',
    note: '۴ نفر خالی',
  },
  {
    name: 'مالی و حسابداری',
    count: '۱۲ نفر',
    badgeVariant: 'alert',
    progress: 85,
    progressColor: 'bg-amber-500',
    borderColor: 'border-amber-500/20',
    bgColor: 'bg-amber-500/5',
    note: '۲ نفر خالی',
  },
];

export const employees: Employee[] = [
  {
    id: '1',
    name: 'سارا احمدی',
    initials: 'سا',
    role: 'مدیر منابع انسانی',
    department: 'فناوری اطلاعات',
    experience: '۵ سال سابقه',
    status: 'فعال',
    statusVariant: 'success',
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    id: '2',
    name: 'علی محمدی',
    initials: 'علی',
    role: 'توسعه‌دهنده ارشد',
    department: 'فناوری اطلاعات',
    experience: '۳ سال سابقه',
    status: 'در مرخصی',
    statusVariant: 'info',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  {
    id: '3',
    name: 'مریم رضایی',
    initials: 'مریم',
    role: 'طراح رابط کاربری',
    department: 'فناوری اطلاعات',
    experience: '۲ سال سابقه',
    status: 'فعال',
    statusVariant: 'success',
    gradient: 'from-violet-500 to-violet-600',
  },
  {
    id: '4',
    name: 'رضا کریمی',
    initials: 'رضا',
    role: 'کارشناس فروش',
    department: 'فروش و بازاریابی',
    experience: '۱ سال سابقه',
    status: 'آموزش',
    statusVariant: 'alert',
    gradient: 'from-amber-500 to-amber-600',
  },
];

export const performanceMetrics: PerformanceMetric[] = [
  { label: 'میانگین امتیاز عملکرد', value: '۸.۲ از ۱۰', progress: 82, color: 'bg-indigo-500' },
  { label: 'رضایت از محیط کار', value: '۸۶%', progress: 86, color: 'bg-emerald-500' },
  { label: 'میزان حضور به موقع', value: '۹۲%', progress: 92, color: 'bg-blue-500' },
  { label: 'تکمیل اهداف', value: '۷۸%', progress: 78, color: 'bg-amber-500' },
];

export const trainingCourses: TrainingCourse[] = [
  {
    title: 'آموزش React پیشرفته',
    detail: '۱۲ شرکت‌کننده • ۲ هفته مانده',
    icon: 'material-symbols:code',
    iconColor: 'text-violet-500',
    iconBg: 'bg-violet-500/10',
    badge: 'فعال',
    badgeVariant: 'violet',
  },
  {
    title: 'مدیریت پروژه اسکرام',
    detail: '۸ شرکت‌کننده • تکمیل شده',
    icon: 'lucide:building-2',
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-500/10',
    badge: 'تمام',
    badgeVariant: 'success',
  },
  {
    title: 'آموزش زبان انگلیسی',
    detail: '۱۵ شرکت‌کننده • در حال برگزاری',
    icon: 'material-symbols:language',
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-500/10',
    badge: 'برگزار',
    badgeVariant: 'alert',
  },
];

export const todayAttendanceSummary = [
  { label: 'حاضر', value: '۲۳۴ نفر', color: 'text-emerald-600', bg: 'bg-emerald-500/5' },
  { label: 'تاخیر', value: '۸ نفر', color: 'text-amber-600', bg: 'bg-amber-500/5' },
  { label: 'غایب', value: '۵ نفر', color: 'text-red-600', bg: 'bg-red-500/5' },
  { label: 'مرخصی', value: '۳ نفر', color: 'text-blue-600', bg: 'bg-blue-500/5' },
];

export const employeeLeaveRequests: LeaveRequestItem[] = [
  {
    type: 'مرخصی استحقاقی',
    employee: 'سارا احمدی • ۳ روز',
    icon: 'material-symbols:pending',
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-500/10',
    action: 'review',
  },
  {
    type: 'مرخصی پزشکی',
    employee: 'علی محمدی • ۱ روز',
    icon: 'material-symbols:medical-services',
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-500/10',
    action: 'review',
  },
  {
    type: 'مرخصی ساعتی',
    employee: 'مریم رضایی • تایید شده',
    icon: 'material-symbols:check-circle',
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-500/10',
    badge: 'تایید',
    badgeVariant: 'success',
  },
];

export const lifecycleItems: LifecycleItem[] = [
  {
    title: 'استخدام جدید',
    detail: '۵ نفر در ماه جاری',
    icon: 'material-symbols:person-add',
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-500/10',
  },
  {
    title: 'آموزش‌های تکمیلی',
    detail: '۱۲ دوره فعال',
    icon: 'material-symbols:school',
    iconColor: 'text-violet-500',
    iconBg: 'bg-violet-500/10',
  },
  {
    title: 'ارزیابی عملکرد',
    detail: '۸۰% تکمیل شده',
    icon: 'material-symbols:trending-up',
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-500/10',
  },
  {
    title: 'خروج از سازمان',
    detail: '۲ نفر در سال جاری',
    icon: 'material-symbols:person-remove',
    iconColor: 'text-red-500',
    iconBg: 'bg-red-500/10',
  },
];

export const recruitmentStages: RecruitmentStage[] = [
  { count: '۴۷', label: 'درخواست استخدام', color: 'bg-blue-500', progress: 100, textColor: 'text-blue-600' },
  { count: '۳۲', label: 'در حال بررسی', color: 'bg-violet-500', progress: 68, textColor: 'text-violet-600' },
  { count: '۱۸', label: 'مصاحبه', color: 'bg-amber-500', progress: 38, textColor: 'text-amber-600' },
  { count: '۸', label: 'پیشنهاد شغلی', color: 'bg-emerald-500', progress: 17, textColor: 'text-emerald-600' },
  { count: '۵', label: 'استخدام شده', color: 'bg-green-500', progress: 11, textColor: 'text-green-600' },
];

export const employeeQuickActions = [
  { icon: 'material-symbols:person-add', label: 'استخدام', color: 'blue' },
  { icon: 'material-symbols:event-note', label: 'مرخصی', color: 'emerald' },
  { icon: 'material-symbols:school', label: 'آموزش', color: 'violet' },
  { icon: 'material-symbols:analytics', label: 'ارزیابی', color: 'amber' },
] as const;
