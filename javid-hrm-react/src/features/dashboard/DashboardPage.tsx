import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Legend,
  Tooltip,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Badge } from '@/components/ui/Badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  MetricCard,
  PageHeader,
} from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import {
  getAllAttendanceRecords,
  getAllDepartments,
  getAllEmployees,
  getAllLeaveRequests,
  getAllPayrollEntries,
  getApiErrorMessage,
  type AttendanceRecordDto,
  type EmployeeDto,
  type LeaveRequestDto,
  type PayrollEntryDto,
} from '@/services/api';
import {
  ATTENDANCE_STATUS_LABELS,
  LEAVE_STATUS_LABELS,
  PAYROLL_STATUS_LABELS,
  getPersonName,
} from '@/lib/hrLabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Legend,
  Tooltip,
);

const primaryColor = 'oklch(0.6 0.25 275)';
const primaryColorLight = 'oklch(0.6 0.25 275 / 0.2)';
const CHART_COLORS = [
  primaryColor,
  'oklch(0.7 0.15 160)',
  'oklch(0.65 0.2 220)',
  'oklch(0.75 0.18 80)',
  'oklch(0.6 0.2 30)',
];

const PERSIAN_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند',
];

const ATTENDANCE_PRESENT = 1;
const ATTENDANCE_LATE = 3;
const LEAVE_PENDING = 1;
const LEAVE_APPROVED = 2;

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true } },
};

const quickActions = [
  { icon: 'material-symbols:person-add', label: 'استخدام جدید', path: '/employees/new', iconBg: 'bg-primary/10', iconColor: 'text-primary' },
  { icon: 'material-symbols:event-note', label: 'درخواست مرخصی', path: '/leaves', iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-500' },
  { icon: 'material-symbols:schedule', label: 'ثبت حضور', path: '/attendance', iconBg: 'bg-sky-500/10', iconColor: 'text-sky-500' },
  { icon: 'material-symbols:calculate', label: 'محاسبه حقوق', path: '/payroll', iconBg: 'bg-violet-500/10', iconColor: 'text-violet-500' },
] as const;

interface DashboardData {
  employeeTotal: number;
  employees: EmployeeDto[];
  departments: { name: string; count: number }[];
  attendance: AttendanceRecordDto[];
  leaves: LeaveRequestDto[];
  payroll: PayrollEntryDto[];
}

function formatRelativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'همین الان';
  if (minutes < 60) return `${minutes.toLocaleString('fa-IR')} دقیقه پیش`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours.toLocaleString('fa-IR')} ساعت پیش`;
  const days = Math.floor(hours / 24);
  return `${days.toLocaleString('fa-IR')} روز پیش`;
}

function formatCurrencyCompact(amount: number) {
  if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 1 })}B`;
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 0 })}M`;
  if (amount >= 1_000) return `${(amount / 1_000).toLocaleString('fa-IR', { maximumFractionDigits: 0 })}K`;
  return amount.toLocaleString('fa-IR');
}

function isSameCalendarDay(left: Date, rightIso: string) {
  const right = new Date(rightIso);
  return (
    left.getFullYear() === right.getFullYear()
    && left.getMonth() === right.getMonth()
    && left.getDate() === right.getDate()
  );
}

function getLast6Months() {
  const months: { year: number; month: number; label: string }[] = [];
  for (let offset = 5; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - offset);
    months.push({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      label: PERSIAN_MONTHS[date.getMonth()] ?? String(date.getMonth() + 1),
    });
  }
  return months;
}

function personFromEmployee(emp: EmployeeDto) {
  return getPersonName(emp.UserFirstName, emp.UserLastName, emp.EmployeeCode);
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError('');
      try {
        const yearStart = new Date();
        yearStart.setMonth(0, 1);
        const attendanceFrom = new Date();
        attendanceFrom.setMonth(attendanceFrom.getMonth() - 5, 1);

        const [
          employeesResult,
          departmentsResult,
          attendanceResult,
          leavesResult,
          payrollResult,
        ] = await Promise.all([
          getAllEmployees({ Pagination: { PageNumber: 1, PageSize: 500 } }),
          getAllDepartments({ Pagination: { PageNumber: 1, PageSize: 100 } }),
          getAllAttendanceRecords({
            WorkDateFrom: attendanceFrom.toISOString().slice(0, 10),
            Pagination: { PageNumber: 1, PageSize: 500 },
          }),
          getAllLeaveRequests({ Pagination: { PageNumber: 1, PageSize: 200 } }),
          getAllPayrollEntries({
            Year: new Date().getFullYear(),
            Pagination: { PageNumber: 1, PageSize: 500 },
          }),
        ]);

        const employees = employeesResult.Items ?? [];
        const deptNames = departmentsResult.Items ?? [];

        const deptCounts = new Map<string, number>();
        for (const emp of employees) {
          const name = emp.DepartmentName || 'بدون بخش';
          deptCounts.set(name, (deptCounts.get(name) ?? 0) + 1);
        }

        if (deptCounts.size === 0) {
          for (const dept of deptNames) {
            deptCounts.set(dept.Name, 0);
          }
        }

        const departments = [...deptCounts.entries()]
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);

        if (!cancelled) {
          setData({
            employeeTotal: employeesResult.TotalCount ?? employees.length,
            employees,
            departments,
            attendance: attendanceResult.Items ?? [],
            leaves: leavesResult.Items ?? [],
            payroll: payrollResult.Items ?? [],
          });
        }
      } catch (err) {
        if (!cancelled) setError(getApiErrorMessage(err));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void load();
    return () => { cancelled = true; };
  }, []);

  const today = useMemo(() => {
    const value = new Date();
    value.setHours(0, 0, 0, 0);
    return value;
  }, []);

  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const stats = useMemo(() => {
    if (!data) {
      return {
        employees: '—',
        todayAttendance: '—',
        activeLeaves: '—',
        monthlyPayroll: '—',
      };
    }

    const todayAttendance = data.attendance.filter(
      (record) =>
        isSameCalendarDay(today, record.WorkDate)
        && (record.Status === ATTENDANCE_PRESENT || record.Status === ATTENDANCE_LATE),
    ).length;

    const activeLeaves = data.leaves.filter(
      (leave) =>
        leave.Status === LEAVE_PENDING
        || (leave.Status === LEAVE_APPROVED && new Date(leave.EndDate) >= today),
    ).length;

    const monthlyPayroll = data.payroll
      .filter((entry) => entry.Year === currentYear && entry.Month === currentMonth)
      .reduce((sum, entry) => sum + entry.NetAmount, 0);

    return {
      employees: data.employeeTotal.toLocaleString('fa-IR'),
      todayAttendance: todayAttendance.toLocaleString('fa-IR'),
      activeLeaves: activeLeaves.toLocaleString('fa-IR'),
      monthlyPayroll: formatCurrencyCompact(monthlyPayroll),
    };
  }, [currentMonth, currentYear, data, today]);

  const last6Months = useMemo(() => getLast6Months(), []);

  const attendanceTrend = useMemo(() => {
    if (!data) return last6Months.map(() => 0);
    return last6Months.map(({ year, month }) =>
      data.attendance.filter(
        (record) => {
          const workDate = new Date(record.WorkDate);
          return (
            workDate.getFullYear() === year
            && workDate.getMonth() + 1 === month
            && (record.Status === ATTENDANCE_PRESENT || record.Status === ATTENDANCE_LATE)
          );
        },
      ).length,
    );
  }, [data, last6Months]);

  const payrollTrend = useMemo(() => {
    if (!data) return last6Months.map(() => 0);
    return last6Months.map(({ year, month }) => {
      const total = data.payroll
        .filter((entry) => entry.Year === year && entry.Month === month)
        .reduce((sum, entry) => sum + entry.NetAmount, 0);
      return Math.round(total / 1_000_000);
    });
  }, [data, last6Months]);

  const departmentChart = useMemo(() => {
    if (!data || data.departments.length === 0) {
      return { labels: ['بدون داده'], data: [1] };
    }
    const top = data.departments.slice(0, 4);
    const otherCount = data.departments.slice(4).reduce((sum, item) => sum + item.count, 0);
    const labels = top.map((item) => item.name);
    const values = top.map((item) => item.count);
    if (otherCount > 0) {
      labels.push('سایر');
      values.push(otherCount);
    }
    return { labels, data: values };
  }, [data]);

  const hrActivities = useMemo(() => {
    if (!data) return [];

    const leaveRows = data.leaves.map((leave) => ({
      id: leave.Id.slice(0, 8),
      employee: getPersonName(leave.UserFirstName, leave.UserLastName, leave.EmployeeCode),
      type: 'درخواست مرخصی',
      status: LEAVE_STATUS_LABELS[leave.Status] ?? String(leave.Status),
      statusVariant:
        leave.Status === LEAVE_APPROVED
          ? ('success' as const)
          : leave.Status === LEAVE_PENDING
            ? ('alert' as const)
            : ('secondary' as const),
      createdAt: leave.CreatedOnUtc,
    }));

    const attendanceRows = data.attendance.map((record) => ({
      id: record.Id.slice(0, 8),
      employee: getPersonName(record.UserFirstName, record.UserLastName, record.EmployeeCode),
      type: 'ثبت حضور',
      status: ATTENDANCE_STATUS_LABELS[record.Status] ?? String(record.Status),
      statusVariant:
        record.Status === ATTENDANCE_PRESENT
          ? ('success' as const)
          : record.Status === ATTENDANCE_LATE
            ? ('alert' as const)
            : ('secondary' as const),
      createdAt: record.CreatedOnUtc,
    }));

    const payrollRows = data.payroll.map((entry) => ({
      id: entry.Id.slice(0, 8),
      employee: getPersonName(entry.UserFirstName, entry.UserLastName, entry.EmployeeCode),
      type: 'فیش حقوقی',
      status: PAYROLL_STATUS_LABELS[entry.Status] ?? String(entry.Status),
      statusVariant:
        entry.Status === 3
          ? ('success' as const)
          : entry.Status === 2
            ? ('info' as const)
            : ('alert' as const),
      createdAt: entry.CreatedOnUtc,
    }));

    const employeeRows = data.employees.slice(0, 20).map((emp) => ({
      id: emp.Id.slice(0, 8),
      employee: personFromEmployee(emp),
      type: emp.IsActive ? 'پرسنل فعال' : 'پرسنل غیرفعال',
      status: emp.IsActive ? 'فعال' : 'غیرفعال',
      statusVariant: emp.IsActive ? ('success' as const) : ('secondary' as const),
      createdAt: emp.CreatedOnUtc,
    }));

    return [...leaveRows, ...attendanceRows, ...payrollRows, ...employeeRows]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8);
  }, [data]);

  const recentActivities = useMemo(() => {
    if (!data) return [];

    const items: { icon: string; iconBg: string; iconColor: string; text: string; time: string; sortKey: string }[] = [];

    for (const leave of data.leaves.slice(0, 5)) {
      items.push({
        icon: 'material-symbols:event-note',
        iconBg: 'bg-emerald-500/10',
        iconColor: 'text-emerald-500',
        text: `مرخصی ${getPersonName(leave.UserFirstName, leave.UserLastName, leave.EmployeeCode)} — ${LEAVE_STATUS_LABELS[leave.Status]}`,
        time: formatRelativeTime(leave.CreatedOnUtc),
        sortKey: leave.CreatedOnUtc,
      });
    }

    for (const record of data.attendance.slice(0, 5)) {
      items.push({
        icon: 'material-symbols:schedule',
        iconBg: 'bg-sky-500/10',
        iconColor: 'text-sky-500',
        text: `حضور ${getPersonName(record.UserFirstName, record.UserLastName, record.EmployeeCode)}`,
        time: formatRelativeTime(record.CreatedOnUtc),
        sortKey: record.CreatedOnUtc,
      });
    }

    for (const entry of data.payroll.slice(0, 5)) {
      items.push({
        icon: 'material-symbols:payments',
        iconBg: 'bg-amber-500/10',
        iconColor: 'text-amber-500',
        text: `فیش حقوق ${getPersonName(entry.UserFirstName, entry.UserLastName, entry.EmployeeCode)}`,
        time: formatRelativeTime(entry.CreatedOnUtc),
        sortKey: entry.CreatedOnUtc,
      });
    }

    return items
      .sort((a, b) => new Date(b.sortKey).getTime() - new Date(a.sortKey).getTime())
      .slice(0, 5);
  }, [data]);

  const dashboardStats = [
    { icon: 'material-symbols:group', iconBg: 'bg-primary/10', iconColor: 'text-primary', label: 'کل کارکنان', value: stats.employees },
    { icon: 'material-symbols:check-circle', iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-500', label: 'حضور امروز', value: stats.todayAttendance },
    { icon: 'material-symbols:schedule', iconBg: 'bg-sky-500/10', iconColor: 'text-sky-500', label: 'مرخصی‌های فعال', value: stats.activeLeaves },
    { icon: 'material-symbols:attach-money', iconBg: 'bg-amber-500/10', iconColor: 'text-amber-500', label: 'حقوق ماه جاری', value: stats.monthlyPayroll },
  ];

  return (
    <div className="flex-1 p-4 lg:p-6">
      <PageHeader title="داشبورد" description="نمای کلی منابع انسانی از داده‌های واقعی سیستم" />

      {error && (
        <div className="text-destructive bg-destructive/10 mb-6 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat) => (
          <MetricCard
            key={stat.label}
            label={stat.label}
            value={isLoading ? '...' : stat.value}
            iconClassName={stat.iconBg}
            icon={<Icon name={stat.icon} className={`size-6 ${stat.iconColor}`} />}
          />
        ))}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>روند حضور</CardTitle>
            <CardDescription>تعداد حضور موفق در ۶ ماه اخیر</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              {isLoading ? (
                <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
                  در حال بارگذاری...
                </div>
              ) : (
                <Line
                  data={{
                    labels: last6Months.map((month) => month.label),
                    datasets: [
                      {
                        label: 'حضور',
                        data: attendanceTrend,
                        borderColor: primaryColor,
                        backgroundColor: primaryColorLight,
                        tension: 0.4,
                        fill: true,
                      },
                    ],
                  }}
                  options={chartOptions}
                />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>حقوق و دستمزد</CardTitle>
            <CardDescription>جمع خالص پرداختی ماهانه (میلیون تومان)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              {isLoading ? (
                <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
                  در حال بارگذاری...
                </div>
              ) : (
                <Bar
                  data={{
                    labels: last6Months.map((month) => month.label),
                    datasets: [
                      {
                        label: 'حقوق (میلیون)',
                        data: payrollTrend,
                        backgroundColor: primaryColor,
                        borderRadius: 8,
                      },
                    ],
                  }}
                  options={chartOptions}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>فعالیت‌های اخیر منابع انسانی</CardTitle>
                <Link to="/employees" className="text-primary text-sm hover:underline">
                  مشاهده پرسنل
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="table-wrapper">
                <table className="table">
                  <thead className="table-header">
                    <tr>
                      <th className="table-head">شناسه</th>
                      <th className="table-head">کارمند</th>
                      <th className="table-head">نوع فعالیت</th>
                      <th className="table-head">وضعیت</th>
                    </tr>
                  </thead>
                  <tbody className="table-body">
                    {isLoading ? (
                      <tr className="table-row">
                        <td colSpan={4} className="table-cell text-muted-foreground py-8 text-center text-sm">
                          در حال بارگذاری...
                        </td>
                      </tr>
                    ) : hrActivities.length === 0 ? (
                      <tr className="table-row">
                        <td colSpan={4} className="table-cell text-muted-foreground py-8 text-center text-sm">
                          فعالیتی ثبت نشده
                        </td>
                      </tr>
                    ) : (
                      hrActivities.map((activity) => (
                        <tr key={`${activity.type}-${activity.id}`} className="table-row">
                          <td className="table-cell font-medium" dir="ltr">#{activity.id}</td>
                          <td className="table-cell">{activity.employee}</td>
                          <td className="table-cell">{activity.type}</td>
                          <td className="table-cell">
                            <Badge variant={activity.statusVariant}>{activity.status}</Badge>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>توزیع بخش‌ها</CardTitle>
              <CardDescription>بر اساس تعداد پرسنل</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                {isLoading ? (
                  <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
                    در حال بارگذاری...
                  </div>
                ) : (
                  <Doughnut
                    data={{
                      labels: departmentChart.labels,
                      datasets: [
                        {
                          data: departmentChart.data,
                          backgroundColor: CHART_COLORS.slice(0, departmentChart.labels.length),
                          borderWidth: 0,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'bottom', rtl: true },
                      },
                    }}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>اقدامات سریع</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => (
                  <Link
                    key={action.label}
                    to={action.path}
                    className="button flex h-auto flex-col items-center gap-2 border border-dashed p-3"
                    data-variant="outline"
                  >
                    <div className={`flex size-8 items-center justify-center rounded-lg ${action.iconBg}`}>
                      <Icon name={action.icon} className={`size-4 ${action.iconColor}`} />
                    </div>
                    <span className="text-xs font-medium">{action.label}</span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>فعالیت‌های اخیر</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-muted-foreground text-sm">در حال بارگذاری...</p>
              ) : recentActivities.length === 0 ? (
                <p className="text-muted-foreground text-sm">فعالیتی ثبت نشده</p>
              ) : (
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={`${activity.text}-${activity.sortKey}`} className="flex gap-3">
                      <div
                        className={`flex size-8 shrink-0 items-center justify-center rounded-full ${activity.iconBg}`}
                      >
                        <Icon name={activity.icon} className={`size-4 ${activity.iconColor}`} />
                      </div>
                      <div>
                        <p className="text-sm">{activity.text}</p>
                        <p className="text-muted-foreground text-xs">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
