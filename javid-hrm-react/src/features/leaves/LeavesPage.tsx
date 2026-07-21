import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
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
import { PersianDateRangeField } from '@/components/ui/PersianDateRangeField';
import { PersianHourlyLeaveField } from '@/components/ui/PersianHourlyLeaveField';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Dialog } from '@/components/layout/Dialog';
import { useDisclosure } from '@/hooks';
import {
  approveLeaveRequest,
  createLeaveRequest,
  deleteLeaveRequest,
  getAllEmployees,
  getAllLeaveRequests,
  getApiErrorMessage,
  getEmployeeLeaveBalance,
  getLeaveRequest,
  rejectLeaveRequest,
  searchLeaveTypeDefinitions,
  updateLeaveRequest,
  type EmployeeDto,
  type EmployeeLeaveBalanceDto,
  type LeaveRequestDto,
  type LeaveTypeDefinitionDto,
} from '@/services/api';
import { LEAVE_STATUS_LABELS, LEAVE_TYPE_UNIT_HOUR, getPersonName } from '@/lib/hrLabels';
import { formatApprovalProgress, LeaveApprovalTimeline } from '@/features/leaves/LeaveApprovalTimeline';
import {
  combineGregorianDateAndTimeToIso,
  isoToGregorianDateString,
  isoToTimeString,
} from '@/lib/persianDateTime';

const LEAVE_STATUS = { Pending: 1, Approved: 2, Rejected: 3 } as const;
const PAGE_SIZE = 10;

function getLeavePersonName(request: LeaveRequestDto) {
  return getPersonName(request.UserFirstName, request.UserLastName, request.EmployeeCode);
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0]![0]}${parts[1]![0]}`;
  return name.slice(0, 2) || '—';
}

function isHourlyLeaveUnit(unit: number) {
  return unit === LEAVE_TYPE_UNIT_HOUR;
}

function leaveDurationDays(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return Math.floor((endDate.getTime() - startDate.getTime()) / 86_400_000) + 1;
}

function leaveDurationHours(start: string, end: string) {
  const diffMs = new Date(end).getTime() - new Date(start).getTime();
  if (diffMs <= 0) return 0;
  const totalMinutes = Math.round(diffMs / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (minutes === 0) return `${hours} ساعت`;
  return `${hours} ساعت و ${minutes} دقیقه`;
}

function formatLeaveDuration(request: Pick<LeaveRequestDto, 'LeaveTypeUnit' | 'StartDate' | 'EndDate'>) {
  if (isHourlyLeaveUnit(request.LeaveTypeUnit)) {
    return leaveDurationHours(request.StartDate, request.EndDate);
  }
  return `${leaveDurationDays(request.StartDate, request.EndDate)} روز`;
}

function formatDateFa(iso: string) {
  return new Date(iso).toLocaleDateString('fa-IR');
}

function formatTimeFa(iso: string) {
  return new Date(iso).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
}

function formatDateRange(start: string, end: string, leaveTypeUnit?: number) {
  if (leaveTypeUnit !== undefined && isHourlyLeaveUnit(leaveTypeUnit)) {
    return `${formatDateFa(start)} • ${formatTimeFa(start)} – ${formatTimeFa(end)}`;
  }
  return `${formatDateFa(start)} – ${formatDateFa(end)}`;
}

function toDateInputValue(iso: string) {
  return isoToGregorianDateString(iso);
}

function statusBadgeVariant(status: number) {
  if (status === LEAVE_STATUS.Approved) return 'success' as const;
  if (status === LEAVE_STATUS.Rejected) return 'secondary' as const;
  return 'alert' as const;
}

function getEmployeeLabel(employee: EmployeeDto) {
  const name = [employee.UserFirstName, employee.UserLastName].filter(Boolean).join(' ');
  return name ? `${name} (${employee.EmployeeCode})` : employee.EmployeeCode;
}

interface LeaveFormState {
  employeeId: string;
  leaveTypeDefinitionId: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  status: number;
  reason: string;
}

const emptyCreateForm = (): LeaveFormState => ({
  employeeId: '',
  leaveTypeDefinitionId: '',
  startDate: '',
  endDate: '',
  startTime: '09:00',
  endTime: '10:00',
  status: LEAVE_STATUS.Pending,
  reason: '',
});

function buildLeavePayloadDates(form: LeaveFormState, leaveTypes: LeaveTypeDefinitionDto[]) {
  const selectedType = leaveTypes.find((item) => item.Id === form.leaveTypeDefinitionId);
  if (selectedType && isHourlyLeaveUnit(selectedType.Unit)) {
    if (!form.startDate) throw new Error('تاریخ الزامی است');
    if (!form.startTime || !form.endTime) throw new Error('ساعت شروع و پایان الزامی است');

    const startDate = combineGregorianDateAndTimeToIso(form.startDate, form.startTime);
    const endDate = combineGregorianDateAndTimeToIso(form.startDate, form.endTime);
    if (new Date(endDate) <= new Date(startDate)) {
      throw new Error('ساعت پایان باید بعد از ساعت شروع باشد');
    }
    return { startDate, endDate };
  }

  if (!form.startDate || !form.endDate) throw new Error('تاریخ شروع و پایان الزامی است');
  return { startDate: form.startDate, endDate: form.endDate };
}

function handleLeaveTypeChange(
  prev: LeaveFormState,
  leaveTypeDefinitionId: string,
  leaveTypes: LeaveTypeDefinitionDto[],
): LeaveFormState {
  const selectedType = leaveTypes.find((item) => item.Id === leaveTypeDefinitionId);
  if (selectedType && isHourlyLeaveUnit(selectedType.Unit)) {
    return {
      ...prev,
      leaveTypeDefinitionId,
      endDate: prev.startDate,
      startTime: prev.startTime || '09:00',
      endTime: prev.endTime || '10:00',
    };
  }
  return { ...prev, leaveTypeDefinitionId };
}

export default function LeavesPage() {
  const createDialog = useDisclosure();
  const editDialog = useDisclosure();
  const deleteDialog = useDisclosure();
  const detailDialog = useDisclosure();
  const actionDialog = useDisclosure();

  const [requests, setRequests] = useState<LeaveRequestDto[]>([]);
  const [statsItems, setStatsItems] = useState<LeaveRequestDto[]>([]);
  const [employees, setEmployees] = useState<EmployeeDto[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveTypeDefinitionDto[]>([]);
  const [createBalance, setCreateBalance] = useState<EmployeeLeaveBalanceDto | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [search, setSearch] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  const [createForm, setCreateForm] = useState<LeaveFormState>(emptyCreateForm);
  const [editForm, setEditForm] = useState<LeaveFormState>(emptyCreateForm);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequestDto | null>(null);
  const [detailLeave, setDetailLeave] = useState<LeaveRequestDto | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [actionComment, setActionComment] = useState('');

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

  const loadLeaveTypes = useCallback(async () => {
    try {
      const result = await searchLeaveTypeDefinitions({
        IsActive: true,
        Pagination: { PageNumber: 1, PageSize: 100 },
      });
      setLeaveTypes(result.Items ?? []);
    } catch {
      setLeaveTypes([]);
    }
  }, []);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const [listResult, statsResult] = await Promise.all([
        getAllLeaveRequests({
          Status: statusFilter ? Number(statusFilter) : undefined,
          LeaveTypeDefinitionId: typeFilter || undefined,
          Pagination: { PageNumber: pageNumber, PageSize: PAGE_SIZE },
        }),
        getAllLeaveRequests({
          Pagination: { PageNumber: 1, PageSize: 500 },
        }),
      ]);

      let items = listResult.Items ?? [];
      if (search.trim()) {
        const query = search.trim().toLowerCase();
        items = items.filter((item) => {
          const name = getLeavePersonName(item).toLowerCase();
          return (
            name.includes(query) ||
            item.EmployeeCode.toLowerCase().includes(query) ||
            (item.DepartmentName ?? '').toLowerCase().includes(query)
          );
        });
      }

      setRequests(items);
      setTotalCount(search.trim() ? items.length : (listResult.TotalCount ?? 0));
      setStatsItems(statsResult.Items ?? []);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [pageNumber, search, statusFilter, typeFilter]);

  useEffect(() => {
    void loadEmployees();
    void loadLeaveTypes();
  }, [loadEmployees, loadLeaveTypes]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const stats = useMemo(() => {
    const pending = statsItems.filter((item) => item.Status === LEAVE_STATUS.Pending).length;
    const approved = statsItems.filter((item) => item.Status === LEAVE_STATUS.Approved).length;
    const rejected = statsItems.filter((item) => item.Status === LEAVE_STATUS.Rejected).length;
    const byType = leaveTypes.map((type) => ({
      id: type.Id,
      label: type.Name,
      count: statsItems.filter((item) => item.LeaveTypeDefinitionId === type.Id).length,
    }));
    return { total: statsItems.length, pending, approved, rejected, byType };
  }, [statsItems, leaveTypes]);

  useEffect(() => {
    if (!createDialog.isOpen || !createForm.employeeId || !createForm.leaveTypeDefinitionId) {
      setCreateBalance(null);
      return;
    }

    let cancelled = false;
    setBalanceLoading(true);
    void getEmployeeLeaveBalance({
      EmployeeId: createForm.employeeId,
      LeaveTypeDefinitionId: createForm.leaveTypeDefinitionId,
    })
      .then((balance) => {
        if (!cancelled) setCreateBalance(balance);
      })
      .catch(() => {
        if (!cancelled) setCreateBalance(null);
      })
      .finally(() => {
        if (!cancelled) setBalanceLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [createDialog.isOpen, createForm.employeeId, createForm.leaveTypeDefinitionId]);

  const pendingItems = useMemo(
    () => statsItems.filter((item) => item.Status === LEAVE_STATUS.Pending).slice(0, 8),
    [statsItems],
  );

  const upcomingItems = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return statsItems
      .filter(
        (item) =>
          item.Status === LEAVE_STATUS.Approved && new Date(item.EndDate) >= today,
      )
      .sort((a, b) => new Date(a.StartDate).getTime() - new Date(b.StartDate).getTime())
      .slice(0, 8);
  }, [statsItems]);

  const historyItems = useMemo(
    () =>
      statsItems
        .filter(
          (item) =>
            item.Status === LEAVE_STATUS.Approved || item.Status === LEAVE_STATUS.Rejected,
        )
        .sort(
          (a, b) =>
            new Date(b.CreatedOnUtc).getTime() - new Date(a.CreatedOnUtc).getTime(),
        )
        .slice(0, 10),
    [statsItems],
  );

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setFormError('');
    setIsSubmitting(true);
    try {
      if (!createForm.employeeId) throw new Error('کارمند را انتخاب کنید');
      if (!createForm.reason.trim()) throw new Error('دلیل مرخصی الزامی است');

      if (!createForm.leaveTypeDefinitionId) throw new Error('نوع مرخصی را انتخاب کنید');

      const { startDate, endDate } = buildLeavePayloadDates(createForm, leaveTypes);

      await createLeaveRequest({
        EmployeeId: createForm.employeeId,
        LeaveTypeDefinitionId: createForm.leaveTypeDefinitionId,
        StartDate: startDate,
        EndDate: endDate,
        Reason: createForm.reason.trim(),
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

  function openEdit(request: LeaveRequestDto) {
    setSelectedLeave(request);
    setEditForm({
      employeeId: request.EmployeeId,
      leaveTypeDefinitionId: request.LeaveTypeDefinitionId,
      startDate: toDateInputValue(request.StartDate),
      endDate: toDateInputValue(request.EndDate),
      startTime: isoToTimeString(request.StartDate) || '09:00',
      endTime: isoToTimeString(request.EndDate) || '10:00',
      status: request.Status,
      reason: request.Reason ?? '',
    });
    setFormError('');
    editDialog.open();
  }

  function openDetail(request: LeaveRequestDto) {
    setSelectedLeave(request);
    setDetailLeave(null);
    setDetailLoading(true);
    detailDialog.open();
    void getLeaveRequest(request.Id)
      .then(setDetailLeave)
      .catch((err) => setFormError(getApiErrorMessage(err)))
      .finally(() => setDetailLoading(false));
  }

  function openAction(request: LeaveRequestDto, type: 'approve' | 'reject') {
    setSelectedLeave(request);
    setActionType(type);
    setActionComment('');
    setFormError('');
    actionDialog.open();
  }

  function openDelete(request: LeaveRequestDto) {
    setSelectedLeave(request);
    deleteDialog.open();
  }

  async function handleEdit(event: FormEvent) {
    event.preventDefault();
    if (!selectedLeave) return;

    setFormError('');
    setIsSubmitting(true);
    try {
      if (!editForm.reason.trim()) throw new Error('دلیل مرخصی الزامی است');

      const { startDate, endDate } = buildLeavePayloadDates(editForm, leaveTypes);

      await updateLeaveRequest({
        Id: selectedLeave.Id,
        EmployeeId: editForm.employeeId,
        LeaveTypeDefinitionId: editForm.leaveTypeDefinitionId,
        StartDate: startDate,
        EndDate: endDate,
        Status: editForm.status,
        Reason: editForm.reason.trim(),
      });

      editDialog.close();
      setSelectedLeave(null);
      await loadData();
    } catch (err) {
      setFormError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!selectedLeave) return;

    setIsSubmitting(true);
    setFormError('');
    try {
      await deleteLeaveRequest(selectedLeave.Id);
      deleteDialog.close();
      setSelectedLeave(null);
      await loadData();
    } catch (err) {
      setFormError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleActionSubmit(event: FormEvent) {
    event.preventDefault();
    if (!selectedLeave) return;

    setIsSubmitting(true);
    setFormError('');
    try {
      if (actionType === 'approve') {
        await approveLeaveRequest(selectedLeave.Id, actionComment.trim() || undefined);
      } else {
        await rejectLeaveRequest(selectedLeave.Id, actionComment.trim() || undefined);
      }
      actionDialog.close();
      detailDialog.close();
      setSelectedLeave(null);
      setDetailLeave(null);
      await loadData();
    } catch (err) {
      setFormError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex-1 p-4 lg:p-6">
      <PageHeader
        title="مدیریت مرخصی‌ها"
        description="درخواست، تأیید و پیگیری مرخصی‌های پرسنل"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/leaves/inbox"
              className="border-input bg-background hover:bg-muted inline-flex h-9 items-center gap-2 rounded-md border px-4 text-sm font-medium"
            >
              <Icon name="material-symbols:inbox" className="size-4" />
              کارتابل تأیید
            </Link>
            <Button variant="default" onClick={createDialog.open}>
              <Icon name="material-symbols:add" className="size-4" />
              درخواست مرخصی
            </Button>
          </div>
        }
      />

      {error && (
        <div className="text-destructive bg-destructive/10 mb-6 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={<Icon name="material-symbols:event-note" className="text-primary size-5" />}
          iconClassName="bg-primary/10"
          label="کل درخواست‌ها"
          value={String(stats.total)}
        />
        <MetricCard
          icon={<Icon name="material-symbols:pending" className="size-5 text-amber-500" />}
          iconClassName="bg-amber-500/10"
          label="در انتظار تأیید"
          value={String(stats.pending)}
        />
        <MetricCard
          icon={<Icon name="material-symbols:check-circle" className="size-5 text-emerald-500" />}
          iconClassName="bg-emerald-500/10"
          label="تأیید شده"
          value={String(stats.approved)}
        />
        <MetricCard
          icon={<Icon name="material-symbols:cancel" className="size-5 text-red-500" />}
          iconClassName="bg-red-500/10"
          label="رد شده"
          value={String(stats.rejected)}
        />
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
              {Object.entries(LEAVE_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
            <Select
              className="w-full"
              value={typeFilter}
              onChange={(event) => {
                setTypeFilter(event.target.value);
                setPageNumber(1);
              }}
            >
              <option value="">همه انواع</option>
              {leaveTypes.map((type) => (
                <option key={type.Id} value={type.Id}>
                  {type.Name}
                </option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>لیست درخواست‌های مرخصی</CardTitle>
          <CardDescription>مدیریت کامل درخواست‌ها از API</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="table-wrapper">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-head">پرسنل</th>
                  <th className="table-head">بخش</th>
                  <th className="table-head">نوع</th>
                  <th className="table-head">بازه</th>
                  <th className="table-head">مدت</th>
                  <th className="table-head">وضعیت</th>
                  <th className="table-head w-40">عملیات</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {isLoading ? (
                  <tr className="table-row">
                    <td colSpan={7} className="table-cell text-muted-foreground py-8 text-center text-sm">
                      در حال بارگذاری...
                    </td>
                  </tr>
                ) : requests.length === 0 ? (
                  <tr className="table-row">
                    <td colSpan={7} className="table-cell text-muted-foreground py-8 text-center text-sm">
                      درخواستی یافت نشد
                    </td>
                  </tr>
                ) : (
                  requests.map((request) => {
                    const personName = getLeavePersonName(request);

                    return (
                      <tr key={request.Id} className="table-row">
                        <td className="table-cell">
                          <div className="flex items-center gap-2">
                            <Avatar initials={getInitials(personName)} size="sm" />
                            <span className="text-sm font-medium">{personName}</span>
                          </div>
                        </td>
                        <td className="table-cell text-sm">{request.DepartmentName}</td>
                        <td className="table-cell text-sm">
                          {request.LeaveTypeName}
                        </td>
                        <td className="table-cell text-sm">
                          {formatDateRange(request.StartDate, request.EndDate, request.LeaveTypeUnit)}
                        </td>
                        <td className="table-cell text-sm">
                          {formatLeaveDuration(request)}
                        </td>
                        <td className="table-cell">
                          <div className="flex flex-col gap-1">
                            <Badge variant={statusBadgeVariant(request.Status)}>
                              {LEAVE_STATUS_LABELS[request.Status] ?? request.Status}
                            </Badge>
                            {request.Status === LEAVE_STATUS.Pending &&
                              formatApprovalProgress(
                                request.CurrentApprovalStepOrder,
                                request.TotalApprovalSteps,
                              ) && (
                                <span className="text-muted-foreground text-xs">
                                  {formatApprovalProgress(
                                    request.CurrentApprovalStepOrder,
                                    request.TotalApprovalSteps,
                                  )}
                                </span>
                              )}
                          </div>
                        </td>
                        <td className="table-cell">
                          <div className="flex flex-wrap items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => openDetail(request)}
                              title="جزئیات"
                            >
                              <Icon name="material-symbols:visibility" className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => openEdit(request)}
                              title="ویرایش"
                            >
                              <Icon name="material-symbols:edit" className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => openDelete(request)}
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
              نمایش {requests.length > 0 ? (pageNumber - 1) * PAGE_SIZE + 1 : 0} تا{' '}
              {(pageNumber - 1) * PAGE_SIZE + requests.length} از {totalCount}
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
              <Button variant="default" size="sm">
                {pageNumber}
              </Button>
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

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="material-symbols:pending" className="size-5 text-amber-500" />
                درخواست‌های در انتظار تأیید
              </CardTitle>
              <CardDescription>مرخصی‌هایی که نیاز به بررسی دارند</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingItems.length === 0 ? (
                <p className="text-muted-foreground text-sm">درخواست در انتظاری وجود ندارد</p>
              ) : (
                <div className="space-y-4">
                  {pendingItems.map((request) => {
                    const personName = getLeavePersonName(request);
                    const isBusy = actionId === request.Id;

                    return (
                      <div
                        key={request.Id}
                        className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4"
                      >
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <Avatar initials={getInitials(personName)} />
                            <div>
                              <div className="text-sm font-medium">{personName}</div>
                              <div className="text-muted-foreground text-xs">
                                {request.DepartmentName}
                              </div>
                            </div>
                          </div>
                          <Badge variant="alert">در انتظار</Badge>
                        </div>
                        <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                          <div>
                            <div className="text-muted-foreground text-xs">نوع</div>
                            <div className="text-sm font-medium">
                              {request.LeaveTypeName}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground text-xs">تاریخ</div>
                            <div className="text-sm font-medium">
                              {formatDateRange(request.StartDate, request.EndDate, request.LeaveTypeUnit)}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground text-xs">مدت</div>
                            <div className="text-sm font-medium">
                              {formatLeaveDuration(request)}
                            </div>
                          </div>
                        </div>
                        {request.Reason && (
                          <div className="text-muted-foreground mb-3 text-sm">{request.Reason}</div>
                        )}
                        <div className="flex flex-wrap items-center gap-2">
                          <Button
                            size="sm"
                            className="bg-emerald-500 text-white hover:bg-emerald-600"
                            disabled={isBusy}
                            onClick={() => openAction(request, 'approve')}
                          >
                            <Icon name="material-symbols:check" className="size-3" />
                            تأیید
                          </Button>
                          <Button
                            size="sm"
                            className="bg-red-500 text-white hover:bg-red-600"
                            disabled={isBusy}
                            onClick={() => openAction(request, 'reject')}
                          >
                            <Icon name="material-symbols:close" className="size-3" />
                            رد
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => openDetail(request)}>
                            جزئیات
                          </Button>
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
                <Icon name="material-symbols:event-upcoming" className="size-5 text-blue-500" />
                مرخصی‌های آینده
              </CardTitle>
              <CardDescription>مرخصی‌های تأییدشده با تاریخ شروع از امروز</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingItems.length === 0 ? (
                <p className="text-muted-foreground text-sm">مرخصی آینده‌ای ثبت نشده</p>
              ) : (
                <div className="space-y-3">
                  {upcomingItems.map((request) => {
                    const personName = getLeavePersonName(request);
                    const day = new Date(request.StartDate).toLocaleDateString('fa-IR', {
                      day: 'numeric',
                    });

                    return (
                      <div
                        key={request.Id}
                        className="hover:bg-muted/30 flex items-center gap-4 rounded-lg p-3 transition-colors"
                      >
                        <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-bold text-white">
                          {day}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{personName}</div>
                          <div className="text-muted-foreground text-sm">
                            {request.LeaveTypeName} • {request.DepartmentName}
                          </div>
                        </div>
                        <div className="text-muted-foreground text-sm">
                          {formatDateRange(request.StartDate, request.EndDate, request.LeaveTypeUnit)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="material-symbols:analytics" className="size-5 text-cyan-500" />
              آمار بر اساس نوع
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.byType.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span>{item.label}</span>
                  <span className="font-medium">{item.count}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <StatCard
                icon="material-symbols:percent"
                iconColor="text-cyan-500"
                iconBg="#06b6d415"
                label="نرخ تأیید"
                value={
                  stats.total > 0
                    ? `${Math.round((stats.approved / stats.total) * 100)}%`
                    : '—'
                }
              />
              <StatCard
                icon="material-symbols:schedule"
                iconColor="text-amber-500"
                iconBg="#f59e0b15"
                label="میانگین مدت"
                value={
                  statsItems.length > 0
                    ? (() => {
                        const dailyItems = statsItems.filter(
                          (item) => !isHourlyLeaveUnit(item.LeaveTypeUnit),
                        );
                        if (dailyItems.length === 0) return '—';
                        return `${Math.round(
                          dailyItems.reduce(
                            (sum, item) =>
                              sum + leaveDurationDays(item.StartDate, item.EndDate),
                            0,
                          ) / dailyItems.length,
                        )} روز`;
                      })()
                    : '—'
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="material-symbols:history" className="size-5 text-gray-500" />
            تاریخچه مرخصی‌ها
          </CardTitle>
          <CardDescription>مرخصی‌های تأیید شده و رد شده اخیر</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="table-wrapper">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-head">کارمند</th>
                  <th className="table-head">نوع</th>
                  <th className="table-head">تاریخ</th>
                  <th className="table-head">مدت</th>
                  <th className="table-head">وضعیت</th>
                  <th className="table-head">ثبت</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {historyItems.length === 0 ? (
                  <tr className="table-row">
                    <td colSpan={6} className="table-cell text-muted-foreground py-6 text-center text-sm">
                      تاریخچه‌ای موجود نیست
                    </td>
                  </tr>
                ) : (
                  historyItems.map((request) => {
                    const personName = getLeavePersonName(request);
                    return (
                      <tr key={request.Id} className="table-row">
                        <td className="table-cell">
                          <div className="flex items-center gap-2">
                            <Avatar initials={getInitials(personName)} size="sm" />
                            <span className="text-sm">{personName}</span>
                          </div>
                        </td>
                        <td className="table-cell text-sm">
                          {request.LeaveTypeName}
                        </td>
                        <td className="table-cell text-sm">
                          {formatDateRange(request.StartDate, request.EndDate, request.LeaveTypeUnit)}
                        </td>
                        <td className="table-cell text-sm">
                          {formatLeaveDuration(request)}
                        </td>
                        <td className="table-cell">
                          <Badge variant={statusBadgeVariant(request.Status)}>
                            {LEAVE_STATUS_LABELS[request.Status]}
                          </Badge>
                        </td>
                        <td className="table-cell text-muted-foreground text-sm">
                          {formatDateFa(request.CreatedOnUtc)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={createDialog.isOpen} onClose={createDialog.close} className="max-w-lg">
        <button type="button" className="dialog-close" onClick={createDialog.close}>
          <Icon name="material-symbols:close" className="size-4" />
        </button>
        <form onSubmit={(event) => void handleCreate(event)}>
          <div className="dialog-header">
            <h3 className="dialog-title">درخواست مرخصی جدید</h3>
            <p className="dialog-description">ثبت درخواست برای پرسنل</p>
          </div>
          {formError && (
            <p className="text-destructive px-6 text-sm">{formError}</p>
          )}
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
              <label className="label">نوع مرخصی</label>
              <Select
                required
                value={createForm.leaveTypeDefinitionId}
                onChange={(event) =>
                  setCreateForm((prev) =>
                    handleLeaveTypeChange(prev, event.target.value, leaveTypes),
                  )
                }
              >
                <option value="">انتخاب نوع مرخصی...</option>
                {leaveTypes.map((type) => (
                  <option key={type.Id} value={type.Id}>
                    {type.Name}
                  </option>
                ))}
              </Select>
            </div>
            {createBalance?.AffectsLeaveBalance && (
              <div className="rounded-lg border bg-muted/30 px-3 py-2 text-sm">
                {balanceLoading ? (
                  <span className="text-muted-foreground">در حال بارگذاری مانده...</span>
                ) : (
                  <span>
                    مانده سال جاری:{' '}
                    <strong>{createBalance.RemainingDays.toLocaleString('fa-IR')}</strong>
                    {' '}از {createBalance.TotalDays.toLocaleString('fa-IR')}
                  </span>
                )}
              </div>
            )}
            {(() => {
              const selectedType = leaveTypes.find((item) => item.Id === createForm.leaveTypeDefinitionId);
              return selectedType && isHourlyLeaveUnit(selectedType.Unit);
            })() ? (
              <PersianHourlyLeaveField
                date={createForm.startDate}
                startTime={createForm.startTime}
                endTime={createForm.endTime}
                onDateChange={(value) =>
                  setCreateForm((prev) => ({ ...prev, startDate: value, endDate: value }))
                }
                onStartTimeChange={(value) =>
                  setCreateForm((prev) => ({ ...prev, startTime: value }))
                }
                onEndTimeChange={(value) =>
                  setCreateForm((prev) => ({ ...prev, endTime: value }))
                }
                required
              />
            ) : (
              <PersianDateRangeField
                startDate={createForm.startDate}
                endDate={createForm.endDate}
                onChange={(startDate, endDate) =>
                  setCreateForm((prev) => ({ ...prev, startDate, endDate }))
                }
                label="بازه مرخصی"
                required
              />
            )}
            <div className="space-y-2">
              <label className="label">دلیل</label>
              <Textarea
                rows={3}
                required
                placeholder="دلیل مرخصی..."
                value={createForm.reason}
                onChange={(event) =>
                  setCreateForm((prev) => ({ ...prev, reason: event.target.value }))
                }
              />
            </div>
          </div>
          <div className="dialog-footer">
            <Button type="button" variant="outline" onClick={createDialog.close}>
              انصراف
            </Button>
            <Button type="submit" variant="default" disabled={isSubmitting}>
              {isSubmitting ? 'در حال ثبت...' : 'ثبت درخواست'}
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
            <h3 className="dialog-title">ویرایش درخواست مرخصی</h3>
          </div>
          {formError && (
            <p className="text-destructive px-6 text-sm">{formError}</p>
          )}
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
              <label className="label">نوع مرخصی</label>
              <Select
                value={editForm.leaveTypeDefinitionId}
                onChange={(event) =>
                  setEditForm((prev) =>
                    handleLeaveTypeChange(prev, event.target.value, leaveTypes),
                  )
                }
              >
                {leaveTypes.map((type) => (
                  <option key={type.Id} value={type.Id}>
                    {type.Name}
                  </option>
                ))}
              </Select>
            </div>
            {(() => {
              const selectedType = leaveTypes.find((item) => item.Id === editForm.leaveTypeDefinitionId);
              return selectedType && isHourlyLeaveUnit(selectedType.Unit);
            })() ? (
              <PersianHourlyLeaveField
                date={editForm.startDate}
                startTime={editForm.startTime}
                endTime={editForm.endTime}
                onDateChange={(value) =>
                  setEditForm((prev) => ({ ...prev, startDate: value, endDate: value }))
                }
                onStartTimeChange={(value) =>
                  setEditForm((prev) => ({ ...prev, startTime: value }))
                }
                onEndTimeChange={(value) =>
                  setEditForm((prev) => ({ ...prev, endTime: value }))
                }
                required
              />
            ) : (
              <PersianDateRangeField
                startDate={editForm.startDate}
                endDate={editForm.endDate}
                onChange={(startDate, endDate) =>
                  setEditForm((prev) => ({ ...prev, startDate, endDate }))
                }
                label="بازه مرخصی"
                required
              />
            )}
            <div className="space-y-2">
              <label className="label">وضعیت</label>
              <Select
                value={String(editForm.status)}
                onChange={(event) =>
                  setEditForm((prev) => ({ ...prev, status: Number(event.target.value) }))
                }
              >
                {Object.entries(LEAVE_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <label className="label">دلیل</label>
              <Textarea
                rows={3}
                required
                value={editForm.reason}
                onChange={(event) =>
                  setEditForm((prev) => ({ ...prev, reason: event.target.value }))
                }
              />
            </div>
          </div>
          <div className="dialog-footer">
            <Button type="button" variant="outline" onClick={editDialog.close}>
              انصراف
            </Button>
            <Button type="submit" variant="default" disabled={isSubmitting}>
              {isSubmitting ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
            </Button>
          </div>
        </form>
      </Dialog>

      <Dialog open={detailDialog.isOpen} onClose={detailDialog.close} className="max-w-lg">
        <button type="button" className="dialog-close" onClick={detailDialog.close}>
          <Icon name="material-symbols:close" className="size-4" />
        </button>
        {selectedLeave && (
          <>
            <div className="dialog-header">
              <h3 className="dialog-title">جزئیات درخواست مرخصی</h3>
            </div>
            <div className="space-y-4 px-6 py-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">کارمند</span>
                <span className="font-medium">{getLeavePersonName(selectedLeave)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">بخش</span>
                <span>{selectedLeave.DepartmentName}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">نوع</span>
                <span>{selectedLeave.LeaveTypeName}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">بازه</span>
                <span>
                  {formatDateRange(
                    selectedLeave.StartDate,
                    selectedLeave.EndDate,
                    selectedLeave.LeaveTypeUnit,
                  )}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">مدت</span>
                <span>{formatLeaveDuration(selectedLeave)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">وضعیت</span>
                <Badge variant={statusBadgeVariant(selectedLeave.Status)}>
                  {LEAVE_STATUS_LABELS[selectedLeave.Status]}
                </Badge>
              </div>
              {formatApprovalProgress(
                detailLeave?.CurrentApprovalStepOrder ?? selectedLeave.CurrentApprovalStepOrder,
                detailLeave?.TotalApprovalSteps ?? selectedLeave.TotalApprovalSteps,
              ) && (
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">پیشرفت تأیید</span>
                  <span>
                    {formatApprovalProgress(
                      detailLeave?.CurrentApprovalStepOrder ?? selectedLeave.CurrentApprovalStepOrder,
                      detailLeave?.TotalApprovalSteps ?? selectedLeave.TotalApprovalSteps,
                    )}
                  </span>
                </div>
              )}
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">تاریخ ثبت</span>
                <span>{formatDateFa(selectedLeave.CreatedOnUtc)}</span>
              </div>
              {selectedLeave.Reason && (
                <div>
                  <div className="text-muted-foreground mb-1">دلیل</div>
                  <p>{selectedLeave.Reason}</p>
                </div>
              )}
              <div>
                <div className="mb-3 font-medium">زنجیره تأیید</div>
                {detailLoading ? (
                  <p className="text-muted-foreground text-sm">در حال بارگذاری...</p>
                ) : (
                  <LeaveApprovalTimeline steps={detailLeave?.ApprovalSteps ?? []} />
                )}
              </div>
            </div>
            <div className="dialog-footer">
              <Button variant="outline" onClick={detailDialog.close}>
                بستن
              </Button>
              {detailLeave?.CanCurrentUserAct && selectedLeave.Status === LEAVE_STATUS.Pending && (
                <>
                  <Button
                    className="bg-emerald-500 text-white hover:bg-emerald-600"
                    onClick={() => {
                      detailDialog.close();
                      openAction(selectedLeave, 'approve');
                    }}
                  >
                    تأیید
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      detailDialog.close();
                      openAction(selectedLeave, 'reject');
                    }}
                  >
                    رد
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </Dialog>

      <Dialog open={actionDialog.isOpen} onClose={actionDialog.close} className="max-w-md">
        <button type="button" className="dialog-close" onClick={actionDialog.close}>
          <Icon name="material-symbols:close" className="size-4" />
        </button>
        <form onSubmit={(event) => void handleActionSubmit(event)}>
          <div className="dialog-header">
            <h3 className="dialog-title">
              {actionType === 'approve' ? 'تأیید درخواست مرخصی' : 'رد درخواست مرخصی'}
            </h3>
          </div>
          {formError && <p className="text-destructive px-6 text-sm">{formError}</p>}
          <div className="space-y-4 px-6 py-4">
            <div className="space-y-2">
              <label className="label">توضیحات (اختیاری)</label>
              <Textarea
                rows={3}
                placeholder="یادداشت برای ثبت در گردش تأیید..."
                value={actionComment}
                onChange={(event) => setActionComment(event.target.value)}
              />
            </div>
          </div>
          <div className="dialog-footer">
            <Button type="button" variant="outline" onClick={actionDialog.close}>
              انصراف
            </Button>
            <Button
              type="submit"
              variant={actionType === 'approve' ? 'default' : 'destructive'}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'در حال پردازش...'
                : actionType === 'approve'
                  ? 'تأیید'
                  : 'رد درخواست'}
            </Button>
          </div>
        </form>
      </Dialog>

      <Dialog open={deleteDialog.isOpen} onClose={deleteDialog.close} className="max-w-md">
        <button type="button" className="dialog-close" onClick={deleteDialog.close}>
          <Icon name="material-symbols:close" className="size-4" />
        </button>
        <div className="dialog-header">
          <div className="bg-destructive/10 mx-auto mb-4 flex size-12 items-center justify-center rounded-full sm:mx-0">
            <Icon name="material-symbols:warning" className="text-destructive size-6" />
          </div>
          <h3 className="dialog-title">حذف درخواست مرخصی</h3>
          <p className="dialog-description">
            آیا از حذف درخواست{' '}
            <strong>{selectedLeave ? getLeavePersonName(selectedLeave) : ''}</strong> مطمئن هستید؟
          </p>
        </div>
        {formError && (
          <p className="text-destructive px-6 text-sm">{formError}</p>
        )}
        <div className="dialog-footer">
          <Button variant="outline" onClick={deleteDialog.close}>
            انصراف
          </Button>
          <Button variant="destructive" disabled={isSubmitting} onClick={() => void handleDelete()}>
            {isSubmitting ? 'در حال حذف...' : 'حذف'}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
