import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Avatar,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  MetricCard,
  PageHeader,
  StatCard,
} from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { PersianDateInput } from '@/components/ui/PersianDateInput';
import { TimeRangeField } from '@/components/ui/TimeInput';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Dialog } from '@/components/layout/Dialog';
import { useClock, useDisclosure } from '@/hooks';
import {
  checkInAttendanceRecord,
  checkOutAttendanceRecord,
  createAttendanceRecord,
  deleteAttendanceRecord,
  getAllAttendanceRecords,
  getAllEmployees,
  getApiErrorMessage,
  updateAttendanceRecord,
  type AttendanceRecordDto,
  type EmployeeDto,
} from '@/services/api';
import { ATTENDANCE_STATUS_LABELS, getPersonName } from '@/lib/hrLabels';
import {
  combineGregorianDateAndTimeToIso,
  isoToGregorianDateString,
  isoToTimeString,
  todayGregorianDateString,
} from '@/lib/persianDateTime';

const ATTENDANCE_STATUS = {
  Present: 1,
  Absent: 2,
  Late: 3,
  OnLeave: 4,
  EarlyLeave: 5,
} as const;

const PAGE_SIZE = 10;
const WEEKDAY_LABELS = ['یک', 'دو', 'سه', 'چه', 'پن', 'جم', 'شن'];

function getRecordPersonName(record: AttendanceRecordDto) {
  return getPersonName(record.UserFirstName, record.UserLastName, record.EmployeeCode);
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0]![0]}${parts[1]![0]}`;
  return name.slice(0, 2) || '—';
}

function formatDateFa(iso: string) {
  return new Date(iso).toLocaleDateString('fa-IR');
}

function formatTimeFa(iso?: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
}

function toDateInputValue(iso: string) {
  return isoToGregorianDateString(iso);
}

function toTimeInputValue(iso?: string | null) {
  return isoToTimeString(iso);
}

function todayInputValue() {
  return todayGregorianDateString();
}

function combineDateTimeToUtcIso(date: string, time: string): string | null {
  if (!date || !time) return null;
  try {
    return combineGregorianDateAndTimeToIso(date, time);
  } catch {
    return null;
  }
}

function isSameCalendarDay(left: Date, rightIso: string) {
  const right = new Date(rightIso);
  return (
    left.getFullYear() === right.getFullYear()
    && left.getMonth() === right.getMonth()
    && left.getDate() === right.getDate()
  );
}

function workDurationLabel(checkIn?: string | null, checkOut?: string | null) {
  if (!checkIn || !checkOut) return '—';
  const diffMs = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  if (diffMs <= 0) return '—';
  const hours = Math.floor(diffMs / 3_600_000);
  const minutes = Math.floor((diffMs % 3_600_000) / 60_000);
  return `${hours}س ${minutes}د`;
}

function statusBadgeVariant(status: number) {
  if (status === ATTENDANCE_STATUS.Present) return 'success' as const;
  if (status === ATTENDANCE_STATUS.Late) return 'alert' as const;
  if (status === ATTENDANCE_STATUS.EarlyLeave) return 'warning' as const;
  if (status === ATTENDANCE_STATUS.OnLeave) return 'info' as const;
  if (status === ATTENDANCE_STATUS.Absent) return 'destructive' as const;
  return 'secondary' as const;
}

function formatMinutes(value?: number) {
  if (!value) return '—';
  return `${value.toLocaleString('fa-IR')} د`;
}

function getEmployeeLabel(employee: EmployeeDto) {
  const name = [employee.UserFirstName, employee.UserLastName].filter(Boolean).join(' ');
  return name ? `${name} (${employee.EmployeeCode})` : employee.EmployeeCode;
}

function getLast7Days() {
  const days: Date[] = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    const day = new Date();
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - offset);
    days.push(day);
  }
  return days;
}

interface AttendanceFormState {
  employeeId: string;
  workDate: string;
  status: number;
  checkInTime: string;
  checkOutTime: string;
}

const emptyCreateForm = (): AttendanceFormState => ({
  employeeId: '',
  workDate: todayInputValue(),
  status: ATTENDANCE_STATUS.Present,
  checkInTime: '',
  checkOutTime: '',
});

export default function AttendancePage() {
  const { time, date } = useClock();
  const createDialog = useDisclosure();
  const editDialog = useDisclosure();
  const deleteDialog = useDisclosure();
  const detailDialog = useDisclosure();

  const [records, setRecords] = useState<AttendanceRecordDto[]>([]);
  const [statsItems, setStatsItems] = useState<AttendanceRecordDto[]>([]);
  const [employees, setEmployees] = useState<EmployeeDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [search, setSearch] = useState('');
  const [clockEmployeeId, setClockEmployeeId] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clockBusy, setClockBusy] = useState(false);

  const [createForm, setCreateForm] = useState<AttendanceFormState>(emptyCreateForm);
  const [editForm, setEditForm] = useState<AttendanceFormState>(emptyCreateForm);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecordDto | null>(null);

  const loadEmployees = useCallback(async () => {
    try {
      const result = await getAllEmployees({
        Pagination: { PageNumber: 1, PageSize: 200 },
      });
      setEmployees(result.Items ?? []);
    } catch {
      setEmployees([]);
    }
  }, []);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      const [listResult, statsResult] = await Promise.all([
        getAllAttendanceRecords({
          Status: statusFilter ? Number(statusFilter) : undefined,
          WorkDateFrom: dateFrom || undefined,
          WorkDateTo: dateTo || undefined,
          Pagination: { PageNumber: pageNumber, PageSize: PAGE_SIZE },
        }),
        getAllAttendanceRecords({
          WorkDateFrom: monthStart.toISOString().slice(0, 10),
          Pagination: { PageNumber: 1, PageSize: 500 },
        }),
      ]);

      let items = listResult.Items ?? [];
      if (search.trim()) {
        const query = search.trim().toLowerCase();
        items = items.filter((item) => {
          const name = getRecordPersonName(item).toLowerCase();
          return (
            name.includes(query)
            || item.EmployeeCode.toLowerCase().includes(query)
            || (item.DepartmentName ?? '').toLowerCase().includes(query)
          );
        });
      }

      setRecords(items);
      setTotalCount(search.trim() ? items.length : (listResult.TotalCount ?? 0));
      setStatsItems(statsResult.Items ?? []);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [dateFrom, dateTo, pageNumber, search, statusFilter]);

  useEffect(() => {
    void loadEmployees();
  }, [loadEmployees]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const today = useMemo(() => {
    const value = new Date();
    value.setHours(0, 0, 0, 0);
    return value;
  }, []);

  const stats = useMemo(() => ({
    total: statsItems.length,
    present: statsItems.filter((item) => item.Status === ATTENDANCE_STATUS.Present).length,
    absent: statsItems.filter((item) => item.Status === ATTENDANCE_STATUS.Absent).length,
    late: statsItems.filter((item) => item.Status === ATTENDANCE_STATUS.Late).length,
    onLeave: statsItems.filter((item) => item.Status === ATTENDANCE_STATUS.OnLeave).length,
  }), [statsItems]);

  const todayRecords = useMemo(
    () => statsItems.filter((item) => isSameCalendarDay(today, item.WorkDate)),
    [statsItems, today],
  );

  const todaySummary = useMemo(
    () => [
      { label: 'حاضر', value: String(todayRecords.filter((r) => r.Status === ATTENDANCE_STATUS.Present).length), color: 'text-emerald-600' },
      { label: 'غایب', value: String(todayRecords.filter((r) => r.Status === ATTENDANCE_STATUS.Absent).length), color: 'text-red-600' },
      { label: 'تأخیر', value: String(todayRecords.filter((r) => r.Status === ATTENDANCE_STATUS.Late).length), color: 'text-amber-600' },
      { label: 'مرخصی', value: String(todayRecords.filter((r) => r.Status === ATTENDANCE_STATUS.OnLeave).length), color: 'text-blue-600' },
    ],
    [todayRecords],
  );

  const clockEmployeeRecord = useMemo(() => {
    if (!clockEmployeeId) return null;
    return todayRecords.find((record) => record.EmployeeId === clockEmployeeId) ?? null;
  }, [clockEmployeeId, todayRecords]);

  const liveFeedItems = useMemo(
    () =>
      [...statsItems]
        .sort((a, b) => new Date(b.CreatedOnUtc).getTime() - new Date(a.CreatedOnUtc).getTime())
        .slice(0, 8),
    [statsItems],
  );

  const weeklyAttendance = useMemo(() => {
    const days = getLast7Days();
    const maxCount = Math.max(
      1,
      ...days.map((day) =>
        statsItems.filter(
          (item) =>
            isSameCalendarDay(day, item.WorkDate)
            && (item.Status === ATTENDANCE_STATUS.Present || item.Status === ATTENDANCE_STATUS.Late),
        ).length,
      ),
    );

    return days.map((day, index) => {
      const count = statsItems.filter(
        (item) =>
          isSameCalendarDay(day, item.WorkDate)
          && (item.Status === ATTENDANCE_STATUS.Present || item.Status === ATTENDANCE_STATUS.Late),
      ).length;
      const isToday = isSameCalendarDay(day, today.toISOString());

      return {
        day: WEEKDAY_LABELS[index] ?? '',
        count,
        height: Math.max(24, Math.round((count / maxCount) * 96)),
        isToday,
      };
    });
  }, [statsItems, today]);

  const monthlyReportStats = useMemo(
    () => [
      {
        label: 'حضور موفق',
        value: String(stats.present + stats.late),
        note: 'ماه جاری',
        gradient: 'from-emerald-500 to-emerald-600',
      },
      {
        label: 'غیبت',
        value: String(stats.absent),
        note: 'ماه جاری',
        gradient: 'from-red-500 to-red-600',
      },
      {
        label: 'تأخیر',
        value: String(stats.late),
        note: 'ماه جاری',
        gradient: 'from-amber-500 to-amber-600',
      },
      {
        label: 'مرخصی',
        value: String(stats.onLeave),
        note: 'ماه جاری',
        gradient: 'from-blue-500 to-blue-600',
      },
    ],
    [stats],
  );

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setFormError('');
    setIsSubmitting(true);
    try {
      if (!createForm.employeeId) throw new Error('کارمند را انتخاب کنید');
      if (!createForm.workDate) throw new Error('تاریخ کاری الزامی است');

      await createAttendanceRecord({
        EmployeeId: createForm.employeeId,
        WorkDate: createForm.workDate,
        Status: createForm.status,
        CheckInUtc: combineDateTimeToUtcIso(createForm.workDate, createForm.checkInTime),
        CheckOutUtc: combineDateTimeToUtcIso(createForm.workDate, createForm.checkOutTime),
      });

      setCreateForm(emptyCreateForm());
      createDialog.close();
      await loadData();
    } catch (err) {
      setFormError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  function openEdit(record: AttendanceRecordDto) {
    setSelectedRecord(record);
    setEditForm({
      employeeId: record.EmployeeId,
      workDate: toDateInputValue(record.WorkDate),
      status: record.Status,
      checkInTime: toTimeInputValue(record.CheckInUtc),
      checkOutTime: toTimeInputValue(record.CheckOutUtc),
    });
    setFormError('');
    editDialog.open();
  }

  function openDetail(record: AttendanceRecordDto) {
    setSelectedRecord(record);
    detailDialog.open();
  }

  function openDelete(record: AttendanceRecordDto) {
    setSelectedRecord(record);
    deleteDialog.open();
  }

  async function handleEdit(event: FormEvent) {
    event.preventDefault();
    if (!selectedRecord) return;

    setFormError('');
    setIsSubmitting(true);
    try {
      await updateAttendanceRecord({
        Id: selectedRecord.Id,
        EmployeeId: editForm.employeeId,
        WorkDate: editForm.workDate,
        Status: editForm.status,
        CheckInUtc: combineDateTimeToUtcIso(editForm.workDate, editForm.checkInTime),
        CheckOutUtc: combineDateTimeToUtcIso(editForm.workDate, editForm.checkOutTime),
      });

      editDialog.close();
      setSelectedRecord(null);
      await loadData();
    } catch (err) {
      setFormError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!selectedRecord) return;

    setIsSubmitting(true);
    setFormError('');
    try {
      await deleteAttendanceRecord(selectedRecord.Id);
      deleteDialog.close();
      setSelectedRecord(null);
      await loadData();
    } catch (err) {
      setFormError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCheckIn() {
    if (!clockEmployeeId) {
      setError('ابتدا کارمند را برای ثبت تردد انتخاب کنید');
      return;
    }

    setClockBusy(true);
    setError('');
    try {
      await checkInAttendanceRecord(clockEmployeeId, todayInputValue());
      await loadData();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setClockBusy(false);
    }
  }

  async function handleCheckOut() {
    if (!clockEmployeeId) {
      setError('ابتدا کارمند را برای ثبت تردد انتخاب کنید');
      return;
    }

    setClockBusy(true);
    setError('');
    try {
      await checkOutAttendanceRecord(clockEmployeeId, todayInputValue());
      await loadData();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setClockBusy(false);
    }
  }

  const feedStyles: Record<number, { borderColor: string; bgColor: string; timeColor: string }> = {
    [ATTENDANCE_STATUS.Present]: {
      borderColor: 'border-emerald-500/20',
      bgColor: 'bg-emerald-500/5',
      timeColor: 'text-emerald-600',
    },
    [ATTENDANCE_STATUS.Late]: {
      borderColor: 'border-amber-500/20',
      bgColor: 'bg-amber-500/5',
      timeColor: 'text-amber-600',
    },
    [ATTENDANCE_STATUS.Absent]: {
      borderColor: 'border-red-500/20',
      bgColor: 'bg-red-500/5',
      timeColor: 'text-red-600',
    },
    [ATTENDANCE_STATUS.OnLeave]: {
      borderColor: 'border-blue-500/20',
      bgColor: 'bg-blue-500/5',
      timeColor: 'text-blue-600',
    },
  };

  return (
    <div className="flex-1 p-4 lg:p-6">
      <PageHeader
        title="مدیریت حضور و غیاب"
        description="ثبت تردد، گزارش‌گیری و پیگیری وضعیت پرسنل"
        actions={
          <Button variant="default" onClick={createDialog.open}>
            <Icon name="material-symbols:add" className="size-4" />
            ثبت تردد
          </Button>
        }
      />

      {error && (
        <div className="text-destructive bg-destructive/10 mb-6 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={<Icon name="material-symbols:groups" className="text-primary size-5" />}
          iconClassName="bg-primary/10"
          label="کل رکوردها (ماه جاری)"
          value={String(stats.total)}
        />
        <MetricCard
          icon={<Icon name="material-symbols:check-circle" className="size-5 text-emerald-500" />}
          iconClassName="bg-emerald-500/10"
          label="حاضر"
          value={String(stats.present)}
        />
        <MetricCard
          icon={<Icon name="material-symbols:schedule" className="size-5 text-amber-500" />}
          iconClassName="bg-amber-500/10"
          label="تأخیر"
          value={String(stats.late)}
        />
        <MetricCard
          icon={<Icon name="material-symbols:event-busy" className="size-5 text-red-500" />}
          iconClassName="bg-red-500/10"
          label="غایب"
          value={String(stats.absent)}
        />
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="relative lg:col-span-2">
              <Icon
                name="material-symbols:search"
                className="text-muted-foreground absolute end-3 top-1/2 size-4 -translate-y-1/2"
              />
              <Input
                type="text"
                placeholder="جستجوی نام، کد پرسنلی یا بخش..."
                className="w-full pe-10"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPageNumber(1);
                }}
              />
            </div>
            <Select
              className="w-full"
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setPageNumber(1);
              }}
            >
              <option value="">همه وضعیت‌ها</option>
              {Object.entries(ATTENDANCE_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
            <PersianDateInput
              value={dateFrom}
              onChange={(value) => {
                setDateFrom(value);
                setPageNumber(1);
              }}
              showTodayButton={false}
            />
            <PersianDateInput
              value={dateTo}
              onChange={(value) => {
                setDateTo(value);
                setPageNumber(1);
              }}
              showTodayButton={false}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>لیست رکوردهای حضور</CardTitle>
          <CardDescription>مدیریت کامل ترددها از API</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="table-wrapper">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-head">پرسنل</th>
                  <th className="table-head">بخش</th>
                  <th className="table-head">شیفت</th>
                  <th className="table-head">تاریخ</th>
                  <th className="table-head">ورود</th>
                  <th className="table-head">خروج</th>
                  <th className="table-head">تأخیر</th>
                  <th className="table-head">اضافه‌کار</th>
                  <th className="table-head">وضعیت</th>
                  <th className="table-head w-32">عملیات</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {isLoading ? (
                  <tr className="table-row">
                    <td colSpan={10} className="table-cell text-muted-foreground py-8 text-center text-sm">
                      در حال بارگذاری...
                    </td>
                  </tr>
                ) : records.length === 0 ? (
                  <tr className="table-row">
                    <td colSpan={10} className="table-cell text-muted-foreground py-8 text-center text-sm">
                      رکوردی یافت نشد
                    </td>
                  </tr>
                ) : (
                  records.map((record) => {
                    const personName = getRecordPersonName(record);
                    return (
                      <tr key={record.Id} className="table-row">
                        <td className="table-cell">
                          <div className="flex items-center gap-2">
                            <Avatar initials={getInitials(personName)} size="sm" />
                            <span className="text-sm font-medium">{personName}</span>
                          </div>
                        </td>
                        <td className="table-cell text-sm">{record.DepartmentName}</td>
                        <td className="table-cell text-sm">{record.WorkShiftName || '—'}</td>
                        <td className="table-cell text-sm">{formatDateFa(record.WorkDate)}</td>
                        <td className="table-cell text-sm" dir="ltr">{formatTimeFa(record.CheckInUtc)}</td>
                        <td className="table-cell text-sm" dir="ltr">{formatTimeFa(record.CheckOutUtc)}</td>
                        <td className="table-cell text-sm">{formatMinutes(record.LateMinutes)}</td>
                        <td className="table-cell text-sm">{formatMinutes(record.OvertimeMinutes)}</td>
                        <td className="table-cell">
                          <Badge variant={statusBadgeVariant(record.Status)}>
                            {ATTENDANCE_STATUS_LABELS[record.Status] ?? record.Status}
                          </Badge>
                        </td>
                        <td className="table-cell">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => openDetail(record)}
                              title="جزئیات"
                            >
                              <Icon name="material-symbols:visibility" className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => openEdit(record)}
                              title="ویرایش"
                            >
                              <Icon name="material-symbols:edit" className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => openDelete(record)}
                              title="حذف"
                            >
                              <Icon name="material-symbols:delete" className="size-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="card-footer flex flex-wrap items-center justify-between border-t px-4 py-3">
            <p className="text-muted-foreground text-sm">
              نمایش {records.length > 0 ? (pageNumber - 1) * PAGE_SIZE + 1 : 0} تا{' '}
              {(pageNumber - 1) * PAGE_SIZE + records.length} از {totalCount}
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon-sm"
                disabled={pageNumber <= 1 || isLoading}
                onClick={() => setPageNumber((page) => Math.max(1, page - 1))}
              >
                <Icon name="material-symbols:chevron-right" className="size-4" />
              </Button>
              <Button variant="default" size="sm">{pageNumber}</Button>
              <Button
                variant="outline"
                size="icon-sm"
                disabled={pageNumber >= totalPages || isLoading}
                onClick={() => setPageNumber((page) => page + 1)}
              >
                <Icon name="material-symbols:chevron-left" className="size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="material-symbols:schedule" className="size-5 text-blue-500" />
                ثبت تردد سریع
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold text-blue-600">{time}</div>
                <div className="text-muted-foreground mb-4 text-sm">{date}</div>
                <div className="mb-4 space-y-2 text-start">
                  <label className="label">کارمند</label>
                  <Select
                    value={clockEmployeeId}
                    onChange={(event) => setClockEmployeeId(event.target.value)}
                  >
                    <option value="">انتخاب کارمند...</option>
                    {employees.map((employee) => (
                      <option key={employee.Id} value={employee.Id}>
                        {getEmployeeLabel(employee)}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    className="bg-emerald-500 text-white hover:bg-emerald-600"
                    disabled={clockBusy || !clockEmployeeId || !!clockEmployeeRecord?.CheckInUtc}
                    onClick={() => void handleCheckIn()}
                  >
                    <Icon name="material-symbols:login" className="size-4" />
                    ورود
                  </Button>
                  <Button
                    className="bg-red-500 text-white hover:bg-red-600"
                    disabled={
                      clockBusy
                      || !clockEmployeeId
                      || !clockEmployeeRecord?.CheckInUtc
                      || !!clockEmployeeRecord?.CheckOutUtc
                    }
                    onClick={() => void handleCheckOut()}
                  >
                    <Icon name="material-symbols:logout" className="size-4" />
                    خروج
                  </Button>
                </div>
                <div className="bg-muted/30 mt-4 rounded-lg p-3 text-start">
                  <div className="mb-1 text-sm font-medium">وضعیت امروز</div>
                  {clockEmployeeRecord ? (
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant={statusBadgeVariant(clockEmployeeRecord.Status)}>
                          {ATTENDANCE_STATUS_LABELS[clockEmployeeRecord.Status]}
                        </Badge>
                      </div>
                      <div>ورود: {formatTimeFa(clockEmployeeRecord.CheckInUtc)}</div>
                      <div>خروج: {formatTimeFa(clockEmployeeRecord.CheckOutUtc)}</div>
                      <div>
                        مدت: {workDurationLabel(
                          clockEmployeeRecord.CheckInUtc,
                          clockEmployeeRecord.CheckOutUtc,
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-sm">
                      {clockEmployeeId ? 'هنوز ترددی برای امروز ثبت نشده' : 'کارمند را انتخاب کنید'}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="material-symbols:today" className="size-5 text-indigo-500" />
                خلاصه امروز
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todaySummary.map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-sm">{item.label}</span>
                    <span className={`font-medium ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="material-symbols:analytics" className="size-5 text-cyan-500" />
                آمار ماه جاری
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  icon="material-symbols:percent"
                  iconColor="text-cyan-500"
                  iconBg="#06b6d415"
                  label="نرخ حضور"
                  value={
                    stats.total > 0
                      ? `${Math.round(((stats.present + stats.late) / stats.total) * 100)}%`
                      : '—'
                  }
                />
                <StatCard
                  icon="material-symbols:more-time"
                  iconColor="text-violet-500"
                  iconBg="#8b5cf615"
                  label="مرخصی"
                  value={String(stats.onLeave)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="material-symbols:live-tv" className="size-5 text-emerald-500" />
                  آخرین ترددها
                </CardTitle>
                <CardDescription>فعالیت‌های اخیر حضور و غیاب</CardDescription>
              </CardHeader>
              <CardContent>
                {liveFeedItems.length === 0 ? (
                  <p className="text-muted-foreground text-sm">فعالیتی ثبت نشده</p>
                ) : (
                  <div className="space-y-3">
                    {liveFeedItems.map((item) => {
                      const personName = getRecordPersonName(item);
                      const style = feedStyles[item.Status] ?? feedStyles[ATTENDANCE_STATUS.Present];
                      return (
                        <div
                          key={item.Id}
                          className={`flex items-center gap-3 rounded-lg border p-3 ${style.borderColor} ${style.bgColor}`}
                        >
                          <Avatar initials={getInitials(personName)} />
                          <div className="flex-1">
                            <div className="text-sm font-medium">{personName}</div>
                            <div className="text-muted-foreground text-xs">
                              {ATTENDANCE_STATUS_LABELS[item.Status]} • {formatDateFa(item.WorkDate)}
                              {item.CheckInUtc ? ` • ورود ${formatTimeFa(item.CheckInUtc)}` : ''}
                            </div>
                          </div>
                          <div className={`text-xs font-medium ${style.timeColor}`}>
                            {formatTimeFa(item.CheckInUtc ?? item.CreatedOnUtc)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="material-symbols:bar-chart" className="size-5 text-indigo-500" />
                  نمودار هفتگی
                </CardTitle>
                <CardDescription>تعداد حضور موفق در ۷ روز اخیر</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-4">
                  {weeklyAttendance.map((day) => (
                    <div key={day.day} className="text-center">
                      <div className="text-muted-foreground mb-2 text-xs">{day.day}</div>
                      <div
                        className={`mx-auto w-full max-w-8 rounded-t ${day.isToday ? 'bg-blue-500' : 'bg-emerald-500'}`}
                        style={{ height: `${day.height}px` }}
                      />
                      <div className="mt-1 text-xs font-medium">{day.count}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="material-symbols:calendar-view-month" className="size-5 text-rose-500" />
                گزارش ماهانه
              </CardTitle>
              <CardDescription>آمار حضور و غیاب ماه جاری</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {monthlyReportStats.map((stat) => (
                  <div key={stat.label} className="flex items-center gap-4 rounded-lg border p-3">
                    <div
                      className={`flex size-12 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white ${stat.gradient}`}
                    >
                      {stat.value}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{stat.label}</div>
                      <div className="text-muted-foreground text-xs">{stat.note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={createDialog.isOpen} onClose={createDialog.close} className="max-w-lg">
        <button type="button" className="dialog-close" onClick={createDialog.close}>
          <Icon name="material-symbols:close" className="size-4" />
        </button>
        <form onSubmit={(event) => void handleCreate(event)}>
          <div className="dialog-header">
            <h3 className="dialog-title">ثبت تردد جدید</h3>
            <p className="dialog-description">ثبت دستی رکورد حضور برای پرسنل</p>
          </div>
          {formError && <p className="text-destructive px-6 text-sm">{formError}</p>}
          <div className="space-y-4 px-6 py-4">
            <div className="space-y-2">
              <label className="label">کارمند</label>
              <Select
                required
                value={createForm.employeeId}
                onChange={(event) =>
                  setCreateForm((prev) => ({ ...prev, employeeId: event.target.value }))
                }
              >
                <option value="">انتخاب کارمند...</option>
                {employees.map((employee) => (
                  <option key={employee.Id} value={employee.Id}>
                    {getEmployeeLabel(employee)}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <label className="label">تاریخ کاری</label>
              <PersianDateInput
                required
                value={createForm.workDate}
                onChange={(value) =>
                  setCreateForm((prev) => ({ ...prev, workDate: value }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="label">وضعیت</label>
              <Select
                value={String(createForm.status)}
                onChange={(event) =>
                  setCreateForm((prev) => ({ ...prev, status: Number(event.target.value) }))
                }
              >
                {Object.entries(ATTENDANCE_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <TimeRangeField
                startValue={createForm.checkInTime}
                endValue={createForm.checkOutTime}
                onStartChange={(value) =>
                  setCreateForm((prev) => ({ ...prev, checkInTime: value }))
                }
                onEndChange={(value) =>
                  setCreateForm((prev) => ({ ...prev, checkOutTime: value }))
                }
                startLabel="ورود"
                endLabel="خروج"
              />
            </div>
          </div>
          <div className="dialog-footer">
            <Button type="button" variant="outline" onClick={createDialog.close}>انصراف</Button>
            <Button type="submit" variant="default" disabled={isSubmitting}>
              {isSubmitting ? 'در حال ثبت...' : 'ثبت تردد'}
            </Button>
          </div>
        </form>
      </Dialog>

      <Dialog open={editDialog.isOpen} onClose={editDialog.close} className="max-w-lg">
        <button type="button" className="dialog-close" onClick={editDialog.close}>
          <Icon name="material-symbols:close" className="size-4" />
        </button>
        <form onSubmit={(event) => void handleEdit(event)}>
          <div className="dialog-header">
            <h3 className="dialog-title">ویرایش رکورد حضور</h3>
          </div>
          {formError && <p className="text-destructive px-6 text-sm">{formError}</p>}
          <div className="space-y-4 px-6 py-4">
            <div className="space-y-2">
              <label className="label">کارمند</label>
              <Select
                value={editForm.employeeId}
                onChange={(event) =>
                  setEditForm((prev) => ({ ...prev, employeeId: event.target.value }))
                }
              >
                {employees.map((employee) => (
                  <option key={employee.Id} value={employee.Id}>
                    {getEmployeeLabel(employee)}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <label className="label">تاریخ کاری</label>
              <PersianDateInput
                required
                value={editForm.workDate}
                onChange={(value) =>
                  setEditForm((prev) => ({ ...prev, workDate: value }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="label">وضعیت</label>
              <Select
                value={String(editForm.status)}
                onChange={(event) =>
                  setEditForm((prev) => ({ ...prev, status: Number(event.target.value) }))
                }
              >
                {Object.entries(ATTENDANCE_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <TimeRangeField
                startValue={editForm.checkInTime}
                endValue={editForm.checkOutTime}
                onStartChange={(value) =>
                  setEditForm((prev) => ({ ...prev, checkInTime: value }))
                }
                onEndChange={(value) =>
                  setEditForm((prev) => ({ ...prev, checkOutTime: value }))
                }
                startLabel="ورود"
                endLabel="خروج"
              />
            </div>
          </div>
          <div className="dialog-footer">
            <Button type="button" variant="outline" onClick={editDialog.close}>انصراف</Button>
            <Button type="submit" variant="default" disabled={isSubmitting}>
              {isSubmitting ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
            </Button>
          </div>
        </form>
      </Dialog>

      <Dialog open={detailDialog.isOpen} onClose={detailDialog.close} className="max-w-md">
        <button type="button" className="dialog-close" onClick={detailDialog.close}>
          <Icon name="material-symbols:close" className="size-4" />
        </button>
        {selectedRecord && (
          <>
            <div className="dialog-header">
              <h3 className="dialog-title">جزئیات رکورد حضور</h3>
            </div>
            <div className="space-y-3 px-6 py-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">کارمند</span>
                <span className="font-medium">{getRecordPersonName(selectedRecord)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">بخش</span>
                <span>{selectedRecord.DepartmentName}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">شیفت</span>
                <span>{selectedRecord.WorkShiftName || '—'}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">تاریخ</span>
                <span>{formatDateFa(selectedRecord.WorkDate)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">ورود</span>
                <span dir="ltr">{formatTimeFa(selectedRecord.CheckInUtc)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">خروج</span>
                <span dir="ltr">{formatTimeFa(selectedRecord.CheckOutUtc)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">مدت کار</span>
                <span>
                  {selectedRecord.WorkedMinutes > 0
                    ? formatMinutes(selectedRecord.WorkedMinutes)
                    : workDurationLabel(selectedRecord.CheckInUtc, selectedRecord.CheckOutUtc)}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">تأخیر</span>
                <span>{formatMinutes(selectedRecord.LateMinutes)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">خروج زودهنگام</span>
                <span>{formatMinutes(selectedRecord.EarlyLeaveMinutes)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">اضافه‌کار</span>
                <span>{formatMinutes(selectedRecord.OvertimeMinutes)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">وضعیت</span>
                <Badge variant={statusBadgeVariant(selectedRecord.Status)}>
                  {ATTENDANCE_STATUS_LABELS[selectedRecord.Status]}
                </Badge>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">تاریخ ثبت</span>
                <span>{formatDateFa(selectedRecord.CreatedOnUtc)}</span>
              </div>
            </div>
            <div className="dialog-footer">
              <Button variant="outline" onClick={detailDialog.close}>بستن</Button>
            </div>
          </>
        )}
      </Dialog>

      <Dialog open={deleteDialog.isOpen} onClose={deleteDialog.close} className="max-w-md">
        <button type="button" className="dialog-close" onClick={deleteDialog.close}>
          <Icon name="material-symbols:close" className="size-4" />
        </button>
        <div className="dialog-header">
          <div className="bg-destructive/10 mx-auto mb-4 flex size-12 items-center justify-center rounded-full sm:mx-0">
            <Icon name="material-symbols:warning" className="text-destructive size-6" />
          </div>
          <h3 className="dialog-title">حذف رکورد حضور</h3>
          <p className="dialog-description">
            آیا از حذف رکورد{' '}
            <strong>{selectedRecord ? getRecordPersonName(selectedRecord) : ''}</strong> مطمئن هستید؟
          </p>
        </div>
        {formError && <p className="text-destructive px-6 text-sm">{formError}</p>}
        <div className="dialog-footer">
          <Button variant="outline" onClick={deleteDialog.close}>انصراف</Button>
          <Button variant="destructive" disabled={isSubmitting} onClick={() => void handleDelete()}>
            {isSubmitting ? 'در حال حذف...' : 'حذف'}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
