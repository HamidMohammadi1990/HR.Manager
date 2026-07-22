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
  ActivityListSkeleton,
  ChartCardSkeleton,
  MetricCardSkeleton,
  QuickActionsSkeleton,
  TableCardSkeleton,
} from '@/components/ui/Skeleton';
import {
  getAllAttendanceRecords,
  getAllDepartments,
  getAllEmployees,
  getAllLeaveRequests,
  getAllPayrollEntries,
  type AttendanceRecordDto,
  type DepartmentDto,
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
import { shortEntityId } from '@/lib/entityId';
import {
  hasSectionAccess,
  isSectionLoading,
  loadingSection,
  runSectionLoad,
  areAllSectionsSettled,
  type SectionState,
} from '@/lib/sectionState';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardNoAccessState } from './DashboardNoAccessState';

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

type DashboardAccessKey = 'employees' | 'leaves' | 'attendance' | 'payroll';

const quickActions: {
  icon: string;
  label: string;
  path: string;
  iconBg: string;
  iconColor: string;
  accessKey: DashboardAccessKey;
}[] = [
  {
    icon: 'material-symbols:person-add',
    label: 'استخدام جدید',
    path: '/employees/new',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    accessKey: 'employees',
  },
  {
    icon: 'material-symbols:event-note',
    label: 'درخواست مرخصی',
    path: '/leaves',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-500',
    accessKey: 'leaves',
  },
  {
    icon: 'material-symbols:schedule',
    label: 'ثبت حضور',
    path: '/attendance',
    iconBg: 'bg-sky-500/10',
    iconColor: 'text-sky-500',
    accessKey: 'attendance',
  },
  {
    icon: 'material-symbols:calculate',
    label: 'محاسبه حقوق',
    path: '/payroll',
    iconBg: 'bg-violet-500/10',
    iconColor: 'text-violet-500',
    accessKey: 'payroll',
  },
];

type EmployeesData = { items: EmployeeDto[]; total: number };
type DepartmentsData = { items: DepartmentDto[] };
type AttendanceData = { items: AttendanceRecordDto[] };
type LeavesData = { items: LeaveRequestDto[] };
type PayrollData = { items: PayrollEntryDto[] };

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

function buildDepartmentChart(
  employeesState: SectionState<EmployeesData>,
  departmentsState: SectionState<DepartmentsData>,
) {
  const deptCounts = new Map<string, number>();

  if (employeesState.status === 'success') {
    for (const emp of employeesState.data.items) {
      const name = emp.DepartmentName || 'بدون بخش';
      deptCounts.set(name, (deptCounts.get(name) ?? 0) + 1);
    }
  }

  if (deptCounts.size === 0 && departmentsState.status === 'success') {
    for (const dept of departmentsState.data.items) {
      deptCounts.set(dept.Name, 0);
    }
  }

  if (deptCounts.size === 0) {
    return { labels: ['بدون داده'], data: [1] };
  }

  const departments = [...deptCounts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const top = departments.slice(0, 4);
  const otherCount = departments.slice(4).reduce((sum, item) => sum + item.count, 0);
  const labels = top.map((item) => item.name);
  const values = top.map((item) => item.count);
  if (otherCount > 0) {
    labels.push('سایر');
    values.push(otherCount);
  }

  return { labels, data: values };
}

export default function DashboardPage() {
  const { displayName } = useAuth();
  const [employeesState, setEmployeesState] = useState<SectionState<EmployeesData>>(loadingSection);
  const [departmentsState, setDepartmentsState] = useState<SectionState<DepartmentsData>>(loadingSection);
  const [attendanceState, setAttendanceState] = useState<SectionState<AttendanceData>>(loadingSection);
  const [leavesState, setLeavesState] = useState<SectionState<LeavesData>>(loadingSection);
  const [payrollState, setPayrollState] = useState<SectionState<PayrollData>>(loadingSection);

  useEffect(() => {
    let cancelled = false;

    const attendanceFrom = new Date();
    attendanceFrom.setMonth(attendanceFrom.getMonth() - 5, 1);

    const apply = <T,>(setter: (value: SectionState<T>) => void) =>
      (result: SectionState<T>) => {
        if (!cancelled) setter(result);
      };

    void runSectionLoad(async () => {
      const result = await getAllEmployees({ Pagination: { PageNumber: 1, PageSize: 500 } });
      return {
        items: result.Items ?? [],
        total: result.TotalCount ?? result.Items?.length ?? 0,
      };
    }).then(apply(setEmployeesState));

    void runSectionLoad(async () => {
      const result = await getAllDepartments({ Pagination: { PageNumber: 1, PageSize: 100 } });
      return { items: result.Items ?? [] };
    }).then(apply(setDepartmentsState));

    void runSectionLoad(async () => {
      const result = await getAllAttendanceRecords({
        WorkDateFrom: attendanceFrom.toISOString().slice(0, 10),
        Pagination: { PageNumber: 1, PageSize: 500 },
      });
      return { items: result.Items ?? [] };
    }).then(apply(setAttendanceState));

    void runSectionLoad(async () => {
      const result = await getAllLeaveRequests({ Pagination: { PageNumber: 1, PageSize: 200 } });
      return { items: result.Items ?? [] };
    }).then(apply(setLeavesState));

    void runSectionLoad(async () => {
      const result = await getAllPayrollEntries({
        Year: new Date().getFullYear(),
        Pagination: { PageNumber: 1, PageSize: 500 },
      });
      return { items: result.Items ?? [] };
    }).then(apply(setPayrollState));

    return () => {
      cancelled = true;
    };
  }, []);

  const today = useMemo(() => {
    const value = new Date();
    value.setHours(0, 0, 0, 0);
    return value;
  }, []);

  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();
  const last6Months = useMemo(() => getLast6Months(), []);

  const employees = employeesState.status === 'success' ? employeesState.data.items : [];
  const attendance = attendanceState.status === 'success' ? attendanceState.data.items : [];
  const leaves = leavesState.status === 'success' ? leavesState.data.items : [];
  const payroll = payrollState.status === 'success' ? payrollState.data.items : [];

  const employeeMetricValue = employeesState.status === 'success'
    ? employeesState.data.total.toLocaleString('fa-IR')
    : '—';

  const attendanceMetricValue = attendanceState.status === 'success'
    ? attendance
      .filter(
        (record) =>
          isSameCalendarDay(today, record.WorkDate)
          && (record.Status === ATTENDANCE_PRESENT || record.Status === ATTENDANCE_LATE),
      )
      .length
      .toLocaleString('fa-IR')
    : '—';

  const leavesMetricValue = leavesState.status === 'success'
    ? leaves
      .filter(
        (leave) =>
          leave.Status === LEAVE_PENDING
          || (leave.Status === LEAVE_APPROVED && new Date(leave.EndDate) >= today),
      )
      .length
      .toLocaleString('fa-IR')
    : '—';

  const payrollMetricValue = payrollState.status === 'success'
    ? formatCurrencyCompact(
      payroll
        .filter((entry) => entry.Year === currentYear && entry.Month === currentMonth)
        .reduce((sum, entry) => sum + entry.NetAmount, 0),
    )
    : '—';

  const attendanceTrend = useMemo(() => {
    if (attendanceState.status !== 'success') return last6Months.map(() => 0);
    return last6Months.map(({ year, month }) =>
      attendance.filter((record) => {
        const workDate = new Date(record.WorkDate);
        return (
          workDate.getFullYear() === year
          && workDate.getMonth() + 1 === month
          && (record.Status === ATTENDANCE_PRESENT || record.Status === ATTENDANCE_LATE)
        );
      }).length,
    );
  }, [attendance, attendanceState.status, last6Months]);

  const payrollTrend = useMemo(() => {
    if (payrollState.status !== 'success') return last6Months.map(() => 0);
    return last6Months.map(({ year, month }) => {
      const total = payroll
        .filter((entry) => entry.Year === year && entry.Month === month)
        .reduce((sum, entry) => sum + entry.NetAmount, 0);
      return Math.round(total / 1_000_000);
    });
  }, [last6Months, payroll, payrollState.status]);

  const departmentChart = useMemo(
    () => buildDepartmentChart(employeesState, departmentsState),
    [departmentsState, employeesState],
  );

  const hrActivities = useMemo(() => {
    const leaveRows = hasSectionAccess(leavesState)
      ? leaves.map((leave) => ({
        id: shortEntityId(leave.Id),
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
      }))
      : [];

    const attendanceRows = hasSectionAccess(attendanceState)
      ? attendance.map((record) => ({
        id: shortEntityId(record.Id),
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
      }))
      : [];

    const payrollRows = hasSectionAccess(payrollState)
      ? payroll.map((entry) => ({
        id: shortEntityId(entry.Id),
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
      }))
      : [];

    const employeeRows = hasSectionAccess(employeesState)
      ? employees.slice(0, 20).map((emp) => ({
        id: shortEntityId(emp.Id),
        employee: personFromEmployee(emp),
        type: emp.IsActive ? 'پرسنل فعال' : 'پرسنل غیرفعال',
        status: emp.IsActive ? 'فعال' : 'غیرفعال',
        statusVariant: emp.IsActive ? ('success' as const) : ('secondary' as const),
        createdAt: emp.CreatedOnUtc,
      }))
      : [];

    return [...leaveRows, ...attendanceRows, ...payrollRows, ...employeeRows]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8);
  }, [attendance, attendanceState, employees, employeesState, leaves, leavesState, payroll, payrollState]);

  const recentActivities = useMemo(() => {
    const items: {
      icon: string;
      iconBg: string;
      iconColor: string;
      text: string;
      time: string;
      sortKey: string;
    }[] = [];

    if (hasSectionAccess(leavesState)) {
      for (const leave of leaves.slice(0, 5)) {
        items.push({
          icon: 'material-symbols:event-note',
          iconBg: 'bg-emerald-500/10',
          iconColor: 'text-emerald-500',
          text: `مرخصی ${getPersonName(leave.UserFirstName, leave.UserLastName, leave.EmployeeCode)} — ${LEAVE_STATUS_LABELS[leave.Status]}`,
          time: formatRelativeTime(leave.CreatedOnUtc),
          sortKey: leave.CreatedOnUtc,
        });
      }
    }

    if (hasSectionAccess(attendanceState)) {
      for (const record of attendance.slice(0, 5)) {
        items.push({
          icon: 'material-symbols:schedule',
          iconBg: 'bg-sky-500/10',
          iconColor: 'text-sky-500',
          text: `حضور ${getPersonName(record.UserFirstName, record.UserLastName, record.EmployeeCode)}`,
          time: formatRelativeTime(record.CreatedOnUtc),
          sortKey: record.CreatedOnUtc,
        });
      }
    }

    if (hasSectionAccess(payrollState)) {
      for (const entry of payroll.slice(0, 5)) {
        items.push({
          icon: 'material-symbols:payments',
          iconBg: 'bg-amber-500/10',
          iconColor: 'text-amber-500',
          text: `فیش حقوق ${getPersonName(entry.UserFirstName, entry.UserLastName, entry.EmployeeCode)}`,
          time: formatRelativeTime(entry.CreatedOnUtc),
          sortKey: entry.CreatedOnUtc,
        });
      }
    }

    return items
      .sort((a, b) => new Date(b.sortKey).getTime() - new Date(a.sortKey).getTime())
      .slice(0, 5);
  }, [attendance, attendanceState, leaves, leavesState, payroll, payrollState]);

  const metricCards = [
    {
      key: 'employees',
      state: employeesState,
      icon: 'material-symbols:group',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      label: 'کل کارکنان',
      value: employeeMetricValue,
    },
    {
      key: 'attendance',
      state: attendanceState,
      icon: 'material-symbols:check-circle',
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-500',
      label: 'حضور امروز',
      value: attendanceMetricValue,
    },
    {
      key: 'leaves',
      state: leavesState,
      icon: 'material-symbols:schedule',
      iconBg: 'bg-sky-500/10',
      iconColor: 'text-sky-500',
      label: 'مرخصی‌های فعال',
      value: leavesMetricValue,
    },
    {
      key: 'payroll',
      state: payrollState,
      icon: 'material-symbols:attach-money',
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-500',
      label: 'حقوق ماه جاری',
      value: payrollMetricValue,
    },
  ] as const;

  const visibleMetrics = metricCards.filter((metric) => hasSectionAccess(metric.state));
  const showAttendanceChart = hasSectionAccess(attendanceState);
  const showPayrollChart = hasSectionAccess(payrollState);
  const showDepartmentChart = hasSectionAccess(employeesState) || hasSectionAccess(departmentsState);
  const showActivitiesTable =
    hasSectionAccess(employeesState)
    || hasSectionAccess(leavesState)
    || hasSectionAccess(attendanceState)
    || hasSectionAccess(payrollState);
  const showRecentActivities =
    hasSectionAccess(leavesState)
    || hasSectionAccess(attendanceState)
    || hasSectionAccess(payrollState);

  const activitiesLoading =
    showActivitiesTable
    && (
      (hasSectionAccess(employeesState) && isSectionLoading(employeesState))
      || (hasSectionAccess(leavesState) && isSectionLoading(leavesState))
      || (hasSectionAccess(attendanceState) && isSectionLoading(attendanceState))
      || (hasSectionAccess(payrollState) && isSectionLoading(payrollState))
    );

  const departmentChartLoading =
    showDepartmentChart
    && (
      (hasSectionAccess(employeesState) && isSectionLoading(employeesState))
      || (hasSectionAccess(departmentsState) && isSectionLoading(departmentsState))
    );

  const recentActivitiesLoading =
    showRecentActivities
    && (
      (hasSectionAccess(leavesState) && isSectionLoading(leavesState))
      || (hasSectionAccess(attendanceState) && isSectionLoading(attendanceState))
      || (hasSectionAccess(payrollState) && isSectionLoading(payrollState))
    );

  const accessStateByKey: Record<DashboardAccessKey, SectionState<unknown>> = {
    employees: employeesState,
    leaves: leavesState,
    attendance: attendanceState,
    payroll: payrollState,
  };

  const visibleQuickActions = quickActions.filter((action) =>
    hasSectionAccess(accessStateByKey[action.accessKey]),
  );

  const quickActionsLoading = quickActions.some((action) =>
    isSectionLoading(accessStateByKey[action.accessKey]),
  );

  const chartColumns = [
    showAttendanceChart || isSectionLoading(attendanceState),
    showPayrollChart || isSectionLoading(payrollState),
  ].filter(Boolean).length;

  const allSectionStates = [
    employeesState,
    departmentsState,
    attendanceState,
    leavesState,
    payrollState,
  ] as const;

  const isDashboardLoading = !areAllSectionsSettled(allSectionStates);

  const hasVisibleDashboardContent =
    visibleMetrics.length > 0
    || showAttendanceChart
    || showPayrollChart
    || showDepartmentChart
    || showActivitiesTable
    || visibleQuickActions.length > 0
    || showRecentActivities;

  const showNoAccessState = !isDashboardLoading && !hasVisibleDashboardContent;

  return (
    <div className="flex-1 p-4 lg:p-6">
      <PageHeader
        title="داشبورد"
        description={
          showNoAccessState
            ? 'خوش آمدید — دسترسی‌های شما در حال بررسی است'
            : 'نمای کلی منابع انسانی از داده‌های واقعی سیستم'
        }
      />

      {showNoAccessState ? (
        <DashboardNoAccessState displayName={displayName} />
      ) : (
        <>
      {(visibleMetrics.length > 0 || metricCards.some((metric) => isSectionLoading(metric.state))) && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metricCards.map((metric) => {
            if (!hasSectionAccess(metric.state)) return null;
            if (isSectionLoading(metric.state)) {
              return <MetricCardSkeleton key={metric.key} />;
            }
            return (
              <MetricCard
                key={metric.key}
                label={metric.label}
                value={metric.value}
                iconClassName={metric.iconBg}
                icon={<Icon name={metric.icon} className={`size-6 ${metric.iconColor}`} />}
              />
            );
          })}
        </div>
      )}

      {(showAttendanceChart || showPayrollChart
        || isSectionLoading(attendanceState)
        || isSectionLoading(payrollState)) && (
        <div
          className={
            chartColumns > 1
              ? 'mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2'
              : 'mb-6 grid grid-cols-1 gap-6'
          }
        >
          {(showAttendanceChart || isSectionLoading(attendanceState)) && (
            isSectionLoading(attendanceState) ? (
              <ChartCardSkeleton titleWidth="w-24" descriptionWidth="w-48" />
            ) : showAttendanceChart ? (
              <Card>
                <CardHeader>
                  <CardTitle>روند حضور</CardTitle>
                  <CardDescription>تعداد حضور موفق در ۶ ماه اخیر</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
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
                  </div>
                </CardContent>
              </Card>
            ) : null
          )}

          {(showPayrollChart || isSectionLoading(payrollState)) && (
            isSectionLoading(payrollState) ? (
              <ChartCardSkeleton titleWidth="w-32" descriptionWidth="w-56" />
            ) : showPayrollChart ? (
              <Card>
                <CardHeader>
                  <CardTitle>حقوق و دستمزد</CardTitle>
                  <CardDescription>جمع خالص پرداختی ماهانه (میلیون تومان)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
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
                  </div>
                </CardContent>
              </Card>
            ) : null
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {(showActivitiesTable || activitiesLoading) && (
          <div className="lg:col-span-2">
            {activitiesLoading ? (
              <TableCardSkeleton />
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>فعالیت‌های اخیر منابع انسانی</CardTitle>
                    {hasSectionAccess(employeesState) && (
                      <Link to="/employees" className="text-primary text-sm hover:underline">
                        مشاهده پرسنل
                      </Link>
                    )}
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
                        {hrActivities.length === 0 ? (
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
            )}
          </div>
        )}

        <div className="space-y-6">
          {(showDepartmentChart || departmentChartLoading) && (
            departmentChartLoading ? (
              <ChartCardSkeleton titleWidth="w-28" descriptionWidth="w-36" />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>توزیع بخش‌ها</CardTitle>
                  <CardDescription>بر اساس تعداد پرسنل</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
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
                  </div>
                </CardContent>
              </Card>
            )
          )}

          {(quickActionsLoading || visibleQuickActions.length > 0) && (
            quickActionsLoading ? (
              <QuickActionsSkeleton items={quickActions.length} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>اقدامات سریع</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {visibleQuickActions.map((action) => (
                      <Link
                        key={action.label}
                        to={action.path}
                        className="bg-background hover:bg-muted/50 flex min-h-24 flex-col items-center justify-center gap-2.5 rounded-xl border border-dashed p-3 text-center transition-colors"
                      >
                        <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${action.iconBg}`}>
                          <Icon name={action.icon} className={`size-5 ${action.iconColor}`} />
                        </div>
                        <span className="text-xs leading-5 font-medium">{action.label}</span>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          )}

          {(showRecentActivities || recentActivitiesLoading) && (
            recentActivitiesLoading ? (
              <ActivityListSkeleton />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>فعالیت‌های اخیر</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentActivities.length === 0 ? (
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
            )
          )}
        </div>
      </div>
        </>
      )}
    </div>
  );
}
