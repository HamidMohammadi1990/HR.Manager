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
  ProgressBar,
  StatCard,
} from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Dialog } from '@/components/layout/Dialog';
import { useDisclosure } from '@/hooks';
import {
  approvePayrollEntry,
  createPayrollEntry,
  deletePayrollEntry,
  getAllEmployees,
  getAllPayrollEntries,
  getApiErrorMessage,
  markPayrollEntryPaid,
  updatePayrollEntry,
  type EmployeeDto,
  type PayrollEntryDto,
} from '@/services/api';
import { PAYROLL_STATUS_LABELS, getPersonName } from '@/lib/hrLabels';

const PAYROLL_STATUS = { Draft: 1, Approved: 2, Paid: 3 } as const;
const PAGE_SIZE = 10;

const PERSIAN_MONTHS: Record<number, string> = {
  1: 'فروردین',
  2: 'اردیبهشت',
  3: 'خرداد',
  4: 'تیر',
  5: 'مرداد',
  6: 'شهریور',
  7: 'مهر',
  8: 'آبان',
  9: 'آذر',
  10: 'دی',
  11: 'بهمن',
  12: 'اسفند',
};

function getEntryPersonName(entry: PayrollEntryDto) {
  return getPersonName(entry.UserFirstName, entry.UserLastName, entry.EmployeeCode);
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0]![0]}${parts[1]![0]}`;
  return name.slice(0, 2) || '—';
}

function formatCurrency(amount: number) {
  return amount.toLocaleString('fa-IR');
}

function formatDateFa(iso: string) {
  return new Date(iso).toLocaleDateString('fa-IR');
}

function getPeriodLabel(year: number, month: number) {
  return `${PERSIAN_MONTHS[month] ?? month} ${year}`;
}

function parseAmount(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function computeNet(gross: number, deductions: number) {
  return Math.max(0, gross - deductions);
}

function statusBadgeVariant(status: number) {
  if (status === PAYROLL_STATUS.Paid) return 'success' as const;
  if (status === PAYROLL_STATUS.Approved) return 'info' as const;
  return 'alert' as const;
}

function getEmployeeLabel(employee: EmployeeDto) {
  const name = [employee.UserFirstName, employee.UserLastName].filter(Boolean).join(' ');
  return name ? `${name} (${employee.EmployeeCode})` : employee.EmployeeCode;
}

function currentYear() {
  return new Date().getFullYear();
}

function currentMonth() {
  return new Date().getMonth() + 1;
}

interface PayrollFormState {
  employeeId: string;
  year: string;
  month: string;
  baseSalary: string;
  grossAmount: string;
  deductions: string;
  status: number;
  notes: string;
}

const emptyCreateForm = (): PayrollFormState => ({
  employeeId: '',
  year: String(currentYear()),
  month: String(currentMonth()),
  baseSalary: '',
  grossAmount: '',
  deductions: '',
  status: PAYROLL_STATUS.Draft,
  notes: '',
});

function formToPayload(form: PayrollFormState) {
  const baseSalary = parseAmount(form.baseSalary);
  const grossAmount = parseAmount(form.grossAmount);
  const deductions = parseAmount(form.deductions);
  const netAmount = computeNet(grossAmount, deductions);

  return {
    EmployeeId: form.employeeId,
    Year: Number(form.year),
    Month: Number(form.month),
    BaseSalary: baseSalary,
    GrossAmount: grossAmount,
    Deductions: deductions,
    NetAmount: netAmount,
    Status: form.status,
    Notes: form.notes.trim() || null,
  };
}

export default function PayrollPage() {
  const createDialog = useDisclosure();
  const editDialog = useDisclosure();
  const deleteDialog = useDisclosure();
  const detailDialog = useDisclosure();

  const [entries, setEntries] = useState<PayrollEntryDto[]>([]);
  const [statsItems, setStatsItems] = useState<PayrollEntryDto[]>([]);
  const [employees, setEmployees] = useState<EmployeeDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [yearFilter, setYearFilter] = useState(String(currentYear()));
  const [monthFilter, setMonthFilter] = useState('');
  const [search, setSearch] = useState('');

  const [calcBase, setCalcBase] = useState('');
  const [calcBonus, setCalcBonus] = useState('');
  const [calcDeductions, setCalcDeductions] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  const [createForm, setCreateForm] = useState<PayrollFormState>(emptyCreateForm);
  const [editForm, setEditForm] = useState<PayrollFormState>(emptyCreateForm);
  const [selectedEntry, setSelectedEntry] = useState<PayrollEntryDto | null>(null);

  const calcGross = useMemo(
    () => parseAmount(calcBase) + parseAmount(calcBonus),
    [calcBase, calcBonus],
  );
  const calcNet = useMemo(
    () => computeNet(calcGross, parseAmount(calcDeductions)),
    [calcGross, calcDeductions],
  );

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
      const [listResult, statsResult] = await Promise.all([
        getAllPayrollEntries({
          Year: yearFilter ? Number(yearFilter) : undefined,
          Month: monthFilter ? Number(monthFilter) : undefined,
          Status: statusFilter ? Number(statusFilter) : undefined,
          Pagination: { PageNumber: pageNumber, PageSize: PAGE_SIZE },
        }),
        getAllPayrollEntries({
          Year: yearFilter ? Number(yearFilter) : currentYear(),
          Pagination: { PageNumber: 1, PageSize: 500 },
        }),
      ]);

      let items = listResult.Items ?? [];
      if (search.trim()) {
        const query = search.trim().toLowerCase();
        items = items.filter((item) => {
          const name = getEntryPersonName(item).toLowerCase();
          return (
            name.includes(query)
            || item.EmployeeCode.toLowerCase().includes(query)
            || (item.DepartmentName ?? '').toLowerCase().includes(query)
          );
        });
      }

      setEntries(items);
      setTotalCount(search.trim() ? items.length : (listResult.TotalCount ?? 0));
      setStatsItems(statsResult.Items ?? []);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [monthFilter, pageNumber, search, statusFilter, yearFilter]);

  useEffect(() => {
    void loadEmployees();
  }, [loadEmployees]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const stats = useMemo(() => {
    const draft = statsItems.filter((item) => item.Status === PAYROLL_STATUS.Draft).length;
    const approved = statsItems.filter((item) => item.Status === PAYROLL_STATUS.Approved).length;
    const paid = statsItems.filter((item) => item.Status === PAYROLL_STATUS.Paid).length;
    const totalNet = statsItems.reduce((sum, item) => sum + item.NetAmount, 0);
    const totalGross = statsItems.reduce((sum, item) => sum + item.GrossAmount, 0);
    return { total: statsItems.length, draft, approved, paid, totalNet, totalGross };
  }, [statsItems]);

  const recentPayslips = useMemo(
    () =>
      [...statsItems]
        .sort((a, b) => new Date(b.CreatedOnUtc).getTime() - new Date(a.CreatedOnUtc).getTime())
        .slice(0, 6),
    [statsItems],
  );

  const monthlyTrends = useMemo(() => {
    const grouped = new Map<string, number>();
    for (const item of statsItems) {
      const key = getPeriodLabel(item.Year, item.Month);
      grouped.set(key, (grouped.get(key) ?? 0) + item.NetAmount);
    }
    return [...grouped.entries()]
      .map(([month, amount]) => ({ month, amount: formatCurrency(amount) }))
      .slice(0, 6);
  }, [statsItems]);

  const salaryDistribution = useMemo(() => {
    const buckets = [
      { range: 'زیر ۱۰ میلیون', min: 0, max: 10_000_000, color: 'bg-blue-500' },
      { range: '۱۰ تا ۲۰ میلیون', min: 10_000_000, max: 20_000_000, color: 'bg-emerald-500' },
      { range: '۲۰ تا ۳۰ میلیون', min: 20_000_000, max: 30_000_000, color: 'bg-amber-500' },
      { range: 'بالای ۳۰ میلیون', min: 30_000_000, max: Infinity, color: 'bg-violet-500' },
    ];

    const total = statsItems.length || 1;
    return buckets.map((bucket) => {
      const count = statsItems.filter(
        (item) => item.NetAmount >= bucket.min && item.NetAmount < bucket.max,
      ).length;
      const percent = Math.round((count / total) * 100);
      return { range: bucket.range, percent: `${percent}%`, progress: percent, color: bucket.color };
    });
  }, [statsItems]);

  const complianceStats = useMemo(
    () => [
      {
        label: 'فیش تأیید شده',
        value: stats.total > 0 ? `${Math.round(((stats.approved + stats.paid) / stats.total) * 100)}%` : '—',
        note: `${stats.approved + stats.paid} از ${stats.total}`,
        gradient: 'from-emerald-500 to-emerald-600',
      },
      {
        label: 'پرداخت انجام‌شده',
        value: stats.total > 0 ? `${Math.round((stats.paid / stats.total) * 100)}%` : '—',
        note: `${stats.paid} فیش`,
        gradient: 'from-blue-500 to-blue-600',
      },
      {
        label: 'در انتظار تأیید',
        value: String(stats.draft),
        note: 'پیش‌نویس',
        gradient: 'from-amber-500 to-amber-600',
      },
      {
        label: 'جمع خالص',
        value: formatCurrency(stats.totalNet),
        note: 'ماه/سال فیلتر',
        gradient: 'from-violet-500 to-violet-600',
      },
    ],
    [stats],
  );

  function syncGrossFromBase(form: PayrollFormState, baseSalary: string) {
    const gross = parseAmount(baseSalary);
    return { ...form, baseSalary, grossAmount: gross > 0 ? String(gross) : form.grossAmount };
  }

  function openCreateFromCalculator() {
    setCreateForm({
      ...emptyCreateForm(),
      baseSalary: calcBase,
      grossAmount: String(calcGross),
      deductions: calcDeductions,
    });
    setFormError('');
    createDialog.open();
  }

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setFormError('');
    setIsSubmitting(true);
    try {
      if (!createForm.employeeId) throw new Error('کارمند را انتخاب کنید');
      const payload = formToPayload(createForm);
      if (payload.NetAmount !== payload.GrossAmount - payload.Deductions) {
        throw new Error('مبلغ خالص باید برابر ناخالص منهای کسورات باشد');
      }

      await createPayrollEntry(payload);
      setCreateForm(emptyCreateForm());
      createDialog.close();
      await loadData();
    } catch (err) {
      setFormError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  function openEdit(entry: PayrollEntryDto) {
    setSelectedEntry(entry);
    setEditForm({
      employeeId: entry.EmployeeId,
      year: String(entry.Year),
      month: String(entry.Month),
      baseSalary: String(entry.BaseSalary),
      grossAmount: String(entry.GrossAmount),
      deductions: String(entry.Deductions),
      status: entry.Status,
      notes: entry.Notes ?? '',
    });
    setFormError('');
    editDialog.open();
  }

  function openDetail(entry: PayrollEntryDto) {
    setSelectedEntry(entry);
    detailDialog.open();
  }

  function openDelete(entry: PayrollEntryDto) {
    setSelectedEntry(entry);
    deleteDialog.open();
  }

  async function handleEdit(event: FormEvent) {
    event.preventDefault();
    if (!selectedEntry) return;

    setFormError('');
    setIsSubmitting(true);
    try {
      const payload = formToPayload(editForm);
      await updatePayrollEntry({ Id: selectedEntry.Id, ...payload });
      editDialog.close();
      setSelectedEntry(null);
      await loadData();
    } catch (err) {
      setFormError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!selectedEntry) return;

    setIsSubmitting(true);
    setFormError('');
    try {
      await deletePayrollEntry(selectedEntry.Id);
      deleteDialog.close();
      setSelectedEntry(null);
      await loadData();
    } catch (err) {
      setFormError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleApprove(id: string) {
    setActionId(id);
    setError('');
    try {
      await approvePayrollEntry(id);
      await loadData();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setActionId(null);
    }
  }

  async function handleMarkPaid(id: string) {
    setActionId(id);
    setError('');
    try {
      await markPayrollEntryPaid(id);
      await loadData();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setActionId(null);
    }
  }

  function renderPayrollForm(
    form: PayrollFormState,
    setForm: (updater: (prev: PayrollFormState) => PayrollFormState) => void,
    isPaid = false,
  ) {
    const previewNet = computeNet(parseAmount(form.grossAmount), parseAmount(form.deductions));

    return (
      <div className="space-y-4 px-6 py-4">
        <div className="space-y-2">
          <label className="label">کارمند</label>
          <Select
            required
            disabled={isPaid}
            value={form.employeeId}
            onChange={(event) => setForm((prev) => ({ ...prev, employeeId: event.target.value }))}
          >
            <option value="">انتخاب کارمند...</option>
            {employees.map((employee) => (
              <option key={employee.Id} value={employee.Id}>
                {getEmployeeLabel(employee)}
              </option>
            ))}
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="label">سال</label>
            <Input
              type="number"
              required
              disabled={isPaid}
              value={form.year}
              onChange={(event) => setForm((prev) => ({ ...prev, year: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label className="label">ماه</label>
            <Select
              disabled={isPaid}
              value={form.month}
              onChange={(event) => setForm((prev) => ({ ...prev, month: event.target.value }))}
            >
              {Object.entries(PERSIAN_MONTHS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="label">حقوق پایه</label>
            <Input
              type="number"
              min={0}
              disabled={isPaid}
              value={form.baseSalary}
              onChange={(event) =>
                setForm((prev) => syncGrossFromBase(prev, event.target.value))
              }
            />
          </div>
          <div className="space-y-2">
            <label className="label">ناخالص</label>
            <Input
              type="number"
              min={0}
              required
              disabled={isPaid}
              value={form.grossAmount}
              onChange={(event) => setForm((prev) => ({ ...prev, grossAmount: event.target.value }))}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="label">کسورات</label>
            <Input
              type="number"
              min={0}
              disabled={isPaid}
              value={form.deductions}
              onChange={(event) => setForm((prev) => ({ ...prev, deductions: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label className="label">خالص (محاسبه‌شده)</label>
            <Input type="text" readOnly value={formatCurrency(previewNet)} />
          </div>
        </div>
        <div className="space-y-2">
          <label className="label">وضعیت</label>
          <Select
            disabled={isPaid}
            value={String(form.status)}
            onChange={(event) => setForm((prev) => ({ ...prev, status: Number(event.target.value) }))}
          >
            {Object.entries(PAYROLL_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <label className="label">یادداشت</label>
          <Textarea
            rows={2}
            disabled={isPaid}
            value={form.notes}
            onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 lg:p-6">
      <PageHeader
        title="مدیریت حقوق و دستمزد"
        description="محاسبه حقوق، فیش حقوقی و پرداخت‌های پرسنلی"
        actions={
          <Button variant="default" onClick={createDialog.open}>
            <Icon name="material-symbols:calculate" className="size-4" />
            ثبت فیش حقوقی
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
          icon={<Icon name="material-symbols:receipt-long" className="text-primary size-5" />}
          iconClassName="bg-primary/10"
          label="کل فیش‌ها"
          value={String(stats.total)}
        />
        <MetricCard
          icon={<Icon name="material-symbols:edit-note" className="size-5 text-amber-500" />}
          iconClassName="bg-amber-500/10"
          label="پیش‌نویس"
          value={String(stats.draft)}
        />
        <MetricCard
          icon={<Icon name="material-symbols:check-circle" className="size-5 text-blue-500" />}
          iconClassName="bg-blue-500/10"
          label="تأیید شده"
          value={String(stats.approved)}
        />
        <MetricCard
          icon={<Icon name="material-symbols:payments" className="size-5 text-emerald-500" />}
          iconClassName="bg-emerald-500/10"
          label="جمع خالص"
          value={formatCurrency(stats.totalNet)}
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
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setPageNumber(1);
              }}
            >
              <option value="">همه وضعیت‌ها</option>
              {Object.entries(PAYROLL_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Select>
            <Input
              type="number"
              placeholder="سال"
              value={yearFilter}
              onChange={(event) => {
                setYearFilter(event.target.value);
                setPageNumber(1);
              }}
            />
            <Select
              value={monthFilter}
              onChange={(event) => {
                setMonthFilter(event.target.value);
                setPageNumber(1);
              }}
            >
              <option value="">همه ماه‌ها</option>
              {Object.entries(PERSIAN_MONTHS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>لیست فیش‌های حقوقی</CardTitle>
          <CardDescription>مدیریت کامل فیش‌ها از API</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="table-wrapper">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-head">پرسنل</th>
                  <th className="table-head">بخش</th>
                  <th className="table-head">دوره</th>
                  <th className="table-head">پایه</th>
                  <th className="table-head">ناخالص</th>
                  <th className="table-head">کسورات</th>
                  <th className="table-head">خالص</th>
                  <th className="table-head">وضعیت</th>
                  <th className="table-head w-40">عملیات</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {isLoading ? (
                  <tr className="table-row">
                    <td colSpan={9} className="table-cell text-muted-foreground py-8 text-center text-sm">
                      در حال بارگذاری...
                    </td>
                  </tr>
                ) : entries.length === 0 ? (
                  <tr className="table-row">
                    <td colSpan={9} className="table-cell text-muted-foreground py-8 text-center text-sm">
                      فیشی یافت نشد
                    </td>
                  </tr>
                ) : (
                  entries.map((entry) => {
                    const personName = getEntryPersonName(entry);
                    const isDraft = entry.Status === PAYROLL_STATUS.Draft;
                    const isApproved = entry.Status === PAYROLL_STATUS.Approved;
                    const isPaid = entry.Status === PAYROLL_STATUS.Paid;
                    const isBusy = actionId === entry.Id;

                    return (
                      <tr key={entry.Id} className="table-row">
                        <td className="table-cell">
                          <div className="flex items-center gap-2">
                            <Avatar initials={getInitials(personName)} size="sm" />
                            <span className="text-sm font-medium">{personName}</span>
                          </div>
                        </td>
                        <td className="table-cell text-sm">{entry.DepartmentName}</td>
                        <td className="table-cell text-sm">{getPeriodLabel(entry.Year, entry.Month)}</td>
                        <td className="table-cell text-sm">{formatCurrency(entry.BaseSalary)}</td>
                        <td className="table-cell text-sm">{formatCurrency(entry.GrossAmount)}</td>
                        <td className="table-cell text-sm">{formatCurrency(entry.Deductions)}</td>
                        <td className="table-cell text-sm font-medium">{formatCurrency(entry.NetAmount)}</td>
                        <td className="table-cell">
                          <Badge variant={statusBadgeVariant(entry.Status)}>
                            {PAYROLL_STATUS_LABELS[entry.Status]}
                          </Badge>
                        </td>
                        <td className="table-cell">
                          <div className="flex flex-wrap items-center gap-1">
                            {isDraft && (
                              <Button
                                size="icon-sm"
                                className="bg-blue-500 text-white hover:bg-blue-600"
                                disabled={isBusy}
                                onClick={() => void handleApprove(entry.Id)}
                                title="تأیید"
                              >
                                <Icon name="material-symbols:check" className="size-4" />
                              </Button>
                            )}
                            {isApproved && (
                              <Button
                                size="icon-sm"
                                className="bg-emerald-500 text-white hover:bg-emerald-600"
                                disabled={isBusy}
                                onClick={() => void handleMarkPaid(entry.Id)}
                                title="پرداخت"
                              >
                                <Icon name="material-symbols:payments" className="size-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="icon-sm" onClick={() => openDetail(entry)} title="فیش">
                              <Icon name="material-symbols:receipt-long" className="size-4" />
                            </Button>
                            {!isPaid && (
                              <Button variant="ghost" size="icon-sm" onClick={() => openEdit(entry)} title="ویرایش">
                                <Icon name="material-symbols:edit" className="size-4" />
                              </Button>
                            )}
                            {!isPaid && (
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                className="text-destructive hover:bg-destructive/10"
                                onClick={() => openDelete(entry)}
                                title="حذف"
                              >
                                <Icon name="material-symbols:delete" className="size-4" />
                              </Button>
                            )}
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
              نمایش {entries.length > 0 ? (pageNumber - 1) * PAGE_SIZE + 1 : 0} تا{' '}
              {(pageNumber - 1) * PAGE_SIZE + entries.length} از {totalCount}
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
                <Icon name="material-symbols:calculate" className="size-5 text-blue-500" />
                ماشین‌حساب حقوق
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="label">حقوق پایه</label>
                  <Input type="number" min={0} value={calcBase} onChange={(e) => setCalcBase(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="label">پاداش / مزایا</label>
                  <Input type="number" min={0} value={calcBonus} onChange={(e) => setCalcBonus(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="label">کسورات</label>
                  <Input type="number" min={0} value={calcDeductions} onChange={(e) => setCalcDeductions(e.target.value)} />
                </div>
                <div className="bg-muted/30 space-y-2 rounded-lg p-3 text-sm">
                  <div className="flex justify-between">
                    <span>ناخالص</span>
                    <span className="font-medium">{formatCurrency(calcGross)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">خالص دریافتی</span>
                    <span className="text-lg font-bold text-emerald-600">{formatCurrency(calcNet)}</span>
                  </div>
                </div>
                <Button className="w-full" onClick={openCreateFromCalculator}>
                  <Icon name="material-symbols:receipt" className="size-4" />
                  تولید فیش حقوقی
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="material-symbols:pending-actions" className="size-5 text-amber-500" />
                وضعیت پرداخت
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-lg font-bold text-white">
                    {stats.total > 0 ? `${Math.round((stats.paid / stats.total) * 100)}%` : '—'}
                  </div>
                  <div className="text-sm font-medium">پرداخت‌شده</div>
                  <div className="text-muted-foreground text-xs">{stats.paid} از {stats.total} فیش</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>تأیید شده</span>
                    <span className="font-medium text-blue-600">{stats.approved}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>پیش‌نویس</span>
                    <span className="font-medium text-amber-600">{stats.draft}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>پرداخت شده</span>
                    <span className="font-medium text-emerald-600">{stats.paid}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="material-symbols:analytics" className="size-5 text-cyan-500" />
                خلاصه مالی
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  icon="material-symbols:trending-up"
                  iconColor="text-emerald-500"
                  iconBg="#10b98115"
                  label="جمع ناخالص"
                  value={formatCurrency(stats.totalGross)}
                />
                <StatCard
                  icon="material-symbols:account-balance-wallet"
                  iconColor="text-violet-500"
                  iconBg="#8b5cf615"
                  label="میانگین خالص"
                  value={
                    stats.total > 0
                      ? formatCurrency(Math.round(stats.totalNet / stats.total))
                      : '—'
                  }
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
                  <Icon name="material-symbols:receipt-long" className="size-5 text-indigo-500" />
                  فیش‌های اخیر
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentPayslips.length === 0 ? (
                  <p className="text-muted-foreground text-sm">فیشی ثبت نشده</p>
                ) : (
                  <div className="space-y-4">
                    {recentPayslips.map((entry) => {
                      const personName = getEntryPersonName(entry);
                      return (
                        <div
                          key={entry.Id}
                          className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4"
                        >
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <Avatar initials={getInitials(personName)} />
                              <div>
                                <div className="text-sm font-medium">{personName}</div>
                                <div className="text-muted-foreground text-xs">
                                  {entry.DepartmentName} • {getPeriodLabel(entry.Year, entry.Month)}
                                </div>
                              </div>
                            </div>
                            <div className="text-left">
                              <div className="text-sm font-bold text-emerald-600">
                                {formatCurrency(entry.NetAmount)}
                              </div>
                              <div className="text-muted-foreground text-xs">خالص</div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                            <div>
                              <div className="text-muted-foreground">پایه</div>
                              <div className="font-medium">{formatCurrency(entry.BaseSalary)}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">ناخالص</div>
                              <div className="font-medium">{formatCurrency(entry.GrossAmount)}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">کسورات</div>
                              <div className="font-medium text-red-600">{formatCurrency(entry.Deductions)}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">وضعیت</div>
                              <Badge variant={statusBadgeVariant(entry.Status)}>
                                {PAYROLL_STATUS_LABELS[entry.Status]}
                              </Badge>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" onClick={() => openDetail(entry)}>
                              <Icon name="material-symbols:visibility" className="size-3" />
                              مشاهده
                            </Button>
                            {entry.Status === PAYROLL_STATUS.Draft && (
                              <Button
                                size="sm"
                                className="bg-blue-500 text-white hover:bg-blue-600"
                                disabled={actionId === entry.Id}
                                onClick={() => void handleApprove(entry.Id)}
                              >
                                تأیید
                              </Button>
                            )}
                            {entry.Status === PAYROLL_STATUS.Approved && (
                              <Button
                                size="sm"
                                className="bg-emerald-500 text-white hover:bg-emerald-600"
                                disabled={actionId === entry.Id}
                                onClick={() => void handleMarkPaid(entry.Id)}
                              >
                                پرداخت
                              </Button>
                            )}
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
                  <Icon name="material-symbols:analytics" className="size-5 text-cyan-500" />
                  تحلیل حقوق
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="mb-4 text-sm font-medium">توزیع حقوق (خالص)</h4>
                    <div className="space-y-3">
                      {salaryDistribution.map((item) => (
                        <div key={item.range}>
                          <div className="flex justify-between text-sm">
                            <span>{item.range}</span>
                            <span className="font-medium">{item.percent}</span>
                          </div>
                          <ProgressBar value={item.progress} colorClass={item.color} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-4 text-sm font-medium">روند دوره‌ای</h4>
                    <div className="space-y-3">
                      {monthlyTrends.length === 0 ? (
                        <p className="text-muted-foreground text-sm">داده‌ای موجود نیست</p>
                      ) : (
                        monthlyTrends.map((trend) => (
                          <div key={trend.month} className="flex justify-between">
                            <span className="text-sm">{trend.month}</span>
                            <span className="text-sm font-bold">{trend.amount}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="material-symbols:verified" className="size-5 text-green-500" />
                وضعیت انطباق
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceStats.map((stat) => (
                  <div key={stat.label} className="flex items-center gap-4 rounded-lg border p-3">
                    <div
                      className={`flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white ${stat.gradient}`}
                    >
                      {stat.value.length > 8 ? '…' : stat.value}
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
            <h3 className="dialog-title">ثبت فیش حقوقی</h3>
            <p className="dialog-description">ایجاد فیش جدید برای پرسنل</p>
          </div>
          {formError && <p className="text-destructive px-6 text-sm">{formError}</p>}
          {renderPayrollForm(createForm, (updater) => setCreateForm(updater))}
          <div className="dialog-footer">
            <Button type="button" variant="outline" onClick={createDialog.close}>انصراف</Button>
            <Button type="submit" variant="default" disabled={isSubmitting}>
              {isSubmitting ? 'در حال ثبت...' : 'ثبت فیش'}
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
            <h3 className="dialog-title">ویرایش فیش حقوقی</h3>
          </div>
          {formError && <p className="text-destructive px-6 text-sm">{formError}</p>}
          {renderPayrollForm(
            editForm,
            (updater) => setEditForm(updater),
            selectedEntry?.Status === PAYROLL_STATUS.Paid,
          )}
          <div className="dialog-footer">
            <Button type="button" variant="outline" onClick={editDialog.close}>انصراف</Button>
            <Button
              type="submit"
              variant="default"
              disabled={isSubmitting || selectedEntry?.Status === PAYROLL_STATUS.Paid}
            >
              {isSubmitting ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
            </Button>
          </div>
        </form>
      </Dialog>

      <Dialog open={detailDialog.isOpen} onClose={detailDialog.close} className="max-w-md">
        <button type="button" className="dialog-close" onClick={detailDialog.close}>
          <Icon name="material-symbols:close" className="size-4" />
        </button>
        {selectedEntry && (
          <>
            <div className="dialog-header">
              <h3 className="dialog-title">فیش حقوقی</h3>
              <p className="dialog-description">{getPeriodLabel(selectedEntry.Year, selectedEntry.Month)}</p>
            </div>
            <div className="space-y-3 px-6 py-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">کارمند</span>
                <span className="font-medium">{getEntryPersonName(selectedEntry)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">بخش</span>
                <span>{selectedEntry.DepartmentName}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">حقوق پایه</span>
                <span>{formatCurrency(selectedEntry.BaseSalary)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">ناخالص</span>
                <span>{formatCurrency(selectedEntry.GrossAmount)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">کسورات</span>
                <span className="text-red-600">{formatCurrency(selectedEntry.Deductions)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">خالص</span>
                <span className="font-bold text-emerald-600">{formatCurrency(selectedEntry.NetAmount)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">وضعیت</span>
                <Badge variant={statusBadgeVariant(selectedEntry.Status)}>
                  {PAYROLL_STATUS_LABELS[selectedEntry.Status]}
                </Badge>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">تاریخ ثبت</span>
                <span>{formatDateFa(selectedEntry.CreatedOnUtc)}</span>
              </div>
              {selectedEntry.Notes && (
                <div>
                  <div className="text-muted-foreground mb-1">یادداشت</div>
                  <p>{selectedEntry.Notes}</p>
                </div>
              )}
            </div>
            <div className="dialog-footer flex-wrap gap-2">
              {selectedEntry.Status === PAYROLL_STATUS.Draft && (
                <Button
                  className="bg-blue-500 text-white hover:bg-blue-600"
                  disabled={actionId === selectedEntry.Id}
                  onClick={() => void handleApprove(selectedEntry.Id).then(() => detailDialog.close())}
                >
                  تأیید فیش
                </Button>
              )}
              {selectedEntry.Status === PAYROLL_STATUS.Approved && (
                <Button
                  className="bg-emerald-500 text-white hover:bg-emerald-600"
                  disabled={actionId === selectedEntry.Id}
                  onClick={() => void handleMarkPaid(selectedEntry.Id).then(() => detailDialog.close())}
                >
                  ثبت پرداخت
                </Button>
              )}
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
          <h3 className="dialog-title">حذف فیش حقوقی</h3>
          <p className="dialog-description">
            آیا از حذف فیش{' '}
            <strong>{selectedEntry ? getEntryPersonName(selectedEntry) : ''}</strong> مطمئن هستید؟
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
