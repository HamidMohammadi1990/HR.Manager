import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Dialog } from '@/components/layout/Dialog';
import { useDisclosure } from '@/hooks';
import {
  LEAVE_TYPE_CATEGORY_LABELS,
  LEAVE_TYPE_CATEGORY_LEAVE,
  LEAVE_TYPE_CATEGORY_MISSION,
  LEAVE_TYPE_UNIT_DAY,
  LEAVE_TYPE_UNIT_HOUR,
  LEAVE_TYPE_UNIT_LABELS,
} from '@/lib/hrLabels';
import {
  createLeaveTypeDefinition,
  deleteLeaveTypeDefinition,
  getAllLeaveTypeDefinitions,
  getApiErrorMessage,
  updateLeaveTypeDefinition,
  type LeaveTypeDefinitionDto,
} from '@/services/api';

const PAGE_SIZE = 10;

const COLOR_PRESETS = [
  { label: 'سبز', value: '#10b981' },
  { label: 'آبی', value: '#0ea5e9' },
  { label: 'بنفش', value: '#8b5cf6' },
  { label: 'نارنجی', value: '#f59e0b' },
  { label: 'قرمز', value: '#f43f5e' },
  { label: 'خاکستری', value: '#64748b' },
];

interface FormState {
  code: string;
  name: string;
  description: string;
  category: number;
  unit: number;
  isPaid: boolean;
  isActive: boolean;
  affectsLeaveBalance: boolean;
  requiresApproval: boolean;
  defaultAnnualAllowance: string;
  maxPerYear: string;
  maxPerRequest: string;
  minNoticeDays: string;
  allowNegativeBalance: boolean;
  carryForwardEnabled: boolean;
  maxCarryForwardDays: string;
  includeWeekends: boolean;
  includeHolidays: boolean;
  sortOrder: string;
  color: string;
}

const emptyForm = (): FormState => ({
  code: '',
  name: '',
  description: '',
  category: LEAVE_TYPE_CATEGORY_LEAVE,
  unit: LEAVE_TYPE_UNIT_DAY,
  isPaid: true,
  isActive: true,
  affectsLeaveBalance: true,
  requiresApproval: true,
  defaultAnnualAllowance: '',
  maxPerYear: '',
  maxPerRequest: '',
  minNoticeDays: '',
  allowNegativeBalance: false,
  carryForwardEnabled: false,
  maxCarryForwardDays: '',
  includeWeekends: false,
  includeHolidays: false,
  sortOrder: '0',
  color: '',
});

function parseOptionalNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : null;
}

function dtoToForm(item: LeaveTypeDefinitionDto): FormState {
  return {
    code: item.Code,
    name: item.Name,
    description: item.Description ?? '',
    category: item.Category,
    unit: item.Unit,
    isPaid: item.IsPaid,
    isActive: item.IsActive,
    affectsLeaveBalance: item.AffectsLeaveBalance,
    requiresApproval: item.RequiresApproval,
    defaultAnnualAllowance: item.DefaultAnnualAllowance != null ? String(item.DefaultAnnualAllowance) : '',
    maxPerYear: item.MaxPerYear != null ? String(item.MaxPerYear) : '',
    maxPerRequest: item.MaxPerRequest != null ? String(item.MaxPerRequest) : '',
    minNoticeDays: item.MinNoticeDays != null ? String(item.MinNoticeDays) : '',
    allowNegativeBalance: item.AllowNegativeBalance,
    carryForwardEnabled: item.CarryForwardEnabled,
    maxCarryForwardDays: item.MaxCarryForwardDays != null ? String(item.MaxCarryForwardDays) : '',
    includeWeekends: item.IncludeWeekends,
    includeHolidays: item.IncludeHolidays,
    sortOrder: String(item.SortOrder),
    color: item.Color ?? '',
  };
}

function formToPayload(form: FormState, includeActive: boolean) {
  const maxPerYear = parseOptionalNumber(form.maxPerYear);
  const maxPerRequest = parseOptionalNumber(form.maxPerRequest);
  if (maxPerYear != null && maxPerRequest != null && maxPerRequest > maxPerYear) {
    throw new Error('حداکثر هر درخواست نمی‌تواند بیشتر از سقف سالانه باشد');
  }
  if (form.carryForwardEnabled && !form.maxCarryForwardDays.trim()) {
    throw new Error('در صورت فعال بودن انتقال به سال بعد، حداکثر روز انتقال الزامی است');
  }

  const base = {
    Code: form.code.trim().toUpperCase(),
    Name: form.name.trim(),
    Description: form.description.trim() || null,
    Category: form.category,
    Unit: form.unit,
    IsPaid: form.isPaid,
    AffectsLeaveBalance: form.affectsLeaveBalance,
    RequiresApproval: form.requiresApproval,
    DefaultAnnualAllowance: form.affectsLeaveBalance ? parseOptionalNumber(form.defaultAnnualAllowance) : null,
    MaxPerYear: parseOptionalNumber(form.maxPerYear),
    MaxPerRequest: parseOptionalNumber(form.maxPerRequest),
    MinNoticeDays: parseOptionalNumber(form.minNoticeDays) != null
      ? Math.trunc(parseOptionalNumber(form.minNoticeDays)!)
      : null,
    AllowNegativeBalance: form.allowNegativeBalance,
    CarryForwardEnabled: form.carryForwardEnabled,
    MaxCarryForwardDays: form.carryForwardEnabled ? parseOptionalNumber(form.maxCarryForwardDays) : null,
    IncludeWeekends: form.includeWeekends,
    IncludeHolidays: form.includeHolidays,
    SortOrder: Math.trunc(Number(form.sortOrder) || 0),
    Color: form.color.trim() || null,
  };

  return includeActive ? { ...base, IsActive: form.isActive } : base;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h4 className="text-sm font-semibold text-foreground">{children}</h4>;
}

function CheckboxField({
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className={`flex items-start gap-2 text-sm ${disabled ? 'opacity-50' : ''}`}>
      <input
        type="checkbox"
        className="mt-0.5"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>
        <span className="font-medium">{label}</span>
        {description && <span className="text-muted-foreground mt-0.5 block text-xs">{description}</span>}
      </span>
    </label>
  );
}

function LeaveTypeFormFields({
  form,
  setForm,
  isEdit,
}: {
  form: FormState;
  setForm: (form: FormState) => void;
  isEdit?: boolean;
}) {
  const allowanceLabel = form.unit === LEAVE_TYPE_UNIT_HOUR ? 'سقف سالانه پیش‌فرض (ساعت)' : 'سقف سالانه پیش‌فرض (روز)';

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <SectionTitle>اطلاعات پایه</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            placeholder="کد (مثلاً ANNUAL)"
            value={form.code}
            disabled={isEdit}
            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            required
          />
          <Input
            placeholder="نام نمایشی"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <Textarea
          placeholder="توضیحات"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1">
            <label className="text-muted-foreground text-xs">دسته‌بندی</label>
            <Select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: Number(e.target.value) })}
            >
              {Object.entries(LEAVE_TYPE_CATEGORY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-muted-foreground text-xs">واحد</label>
            <Select
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: Number(e.target.value) })}
            >
              {Object.entries(LEAVE_TYPE_UNIT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-muted-foreground text-xs">ترتیب نمایش</label>
            <Input
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-muted-foreground text-xs">رنگ نمایشی</label>
          <div className="flex flex-wrap items-center gap-2">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                title={preset.label}
                className={`size-7 rounded-full border-2 ${form.color === preset.value ? 'border-primary' : 'border-transparent'}`}
                style={{ backgroundColor: preset.value }}
                onClick={() => setForm({ ...form, color: preset.value })}
              />
            ))}
            <Input
              className="max-w-[140px]"
              placeholder="#hex"
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <SectionTitle>سیاست و رفتار</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          <CheckboxField
            label="با حقوق"
            description="آیا این مرخصی حقوق ماهانه را تحت تأثیر قرار می‌دهد؟"
            checked={form.isPaid}
            onChange={(isPaid) => setForm({ ...form, isPaid })}
          />
          <CheckboxField
            label="نیاز به تأیید مدیر"
            checked={form.requiresApproval}
            onChange={(requiresApproval) => setForm({ ...form, requiresApproval })}
          />
          <CheckboxField
            label="کسر از مانده مرخصی"
            description="برای محاسبه مانده سالانه فعال شود"
            checked={form.affectsLeaveBalance}
            onChange={(affectsLeaveBalance) => setForm({ ...form, affectsLeaveBalance })}
          />
          <CheckboxField
            label="اجازه مانده منفی"
            checked={form.allowNegativeBalance}
            disabled={!form.affectsLeaveBalance}
            onChange={(allowNegativeBalance) => setForm({ ...form, allowNegativeBalance })}
          />
          {isEdit && (
            <CheckboxField
              label="فعال"
              checked={form.isActive}
              onChange={(isActive) => setForm({ ...form, isActive })}
            />
          )}
        </div>
      </div>

      <div className="space-y-3">
        <SectionTitle>سقف‌ها و محدودیت‌ها</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            type="number"
            min="0"
            step="0.5"
            placeholder={allowanceLabel}
            value={form.defaultAnnualAllowance}
            disabled={!form.affectsLeaveBalance}
            onChange={(e) => setForm({ ...form, defaultAnnualAllowance: e.target.value })}
          />
          <Input
            type="number"
            min="0"
            step="0.5"
            placeholder="حداکثر در سال"
            value={form.maxPerYear}
            onChange={(e) => setForm({ ...form, maxPerYear: e.target.value })}
          />
          <Input
            type="number"
            min="0"
            step="0.5"
            placeholder="حداکثر هر درخواست"
            value={form.maxPerRequest}
            onChange={(e) => setForm({ ...form, maxPerRequest: e.target.value })}
          />
          <Input
            type="number"
            min="0"
            placeholder="حداقل اعلام قبلی (روز)"
            value={form.minNoticeDays}
            onChange={(e) => setForm({ ...form, minNoticeDays: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-3">
        <SectionTitle>انتقال به سال بعد</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          <CheckboxField
            label="امکان انتقال مانده"
            checked={form.carryForwardEnabled}
            disabled={!form.affectsLeaveBalance}
            onChange={(carryForwardEnabled) => setForm({ ...form, carryForwardEnabled })}
          />
          <Input
            type="number"
            min="0"
            step="0.5"
            placeholder="حداکثر روز انتقال"
            value={form.maxCarryForwardDays}
            disabled={!form.carryForwardEnabled || !form.affectsLeaveBalance}
            onChange={(e) => setForm({ ...form, maxCarryForwardDays: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-3">
        <SectionTitle>محاسبه مدت</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          <CheckboxField
            label="شمارش آخر هفته"
            description="جمعه و شنبه در مدت مرخصی لحاظ شود"
            checked={form.includeWeekends}
            onChange={(includeWeekends) => setForm({ ...form, includeWeekends })}
          />
          <CheckboxField
            label="شمارش تعطیلات رسمی"
            checked={form.includeHolidays}
            onChange={(includeHolidays) => setForm({ ...form, includeHolidays })}
          />
        </div>
      </div>
    </div>
  );
}

export default function LeaveTypeDefinitionsPage() {
  const createDialog = useDisclosure();
  const editDialog = useDisclosure();
  const deleteDialog = useDisclosure();

  const [items, setItems] = useState<LeaveTypeDefinitionDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selected, setSelected] = useState<LeaveTypeDefinitionDto | null>(null);
  const [createForm, setCreateForm] = useState<FormState>(emptyForm);
  const [editForm, setEditForm] = useState<FormState>(emptyForm);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getAllLeaveTypeDefinitions({
        Name: search.trim() || undefined,
        Category: categoryFilter ? Number(categoryFilter) : undefined,
        IsActive: activeFilter === '' ? undefined : activeFilter === 'true',
        Pagination: { PageNumber: page, PageSize: PAGE_SIZE },
      });
      setItems(result.Items ?? []);
      setTotalCount(result.TotalCount ?? 0);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, search, categoryFilter, activeFilter]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const stats = useMemo(() => ({
    active: items.filter((i) => i.IsActive).length,
    withBalance: items.filter((i) => i.AffectsLeaveBalance).length,
    mission: items.filter((i) => i.Category === LEAVE_TYPE_CATEGORY_MISSION).length,
  }), [items]);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setFormError('');
    setIsSubmitting(true);
    try {
      if (!createForm.code.trim()) throw new Error('کد الزامی است');
      if (!createForm.name.trim()) throw new Error('نام الزامی است');
      await createLeaveTypeDefinition(formToPayload(createForm, false));
      setCreateForm(emptyForm());
      createDialog.close();
      await loadData();
    } catch (err) {
      setFormError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  function openEdit(item: LeaveTypeDefinitionDto) {
    setSelected(item);
    setEditForm(dtoToForm(item));
    setFormError('');
    editDialog.open();
  }

  async function handleEdit(event: FormEvent) {
    event.preventDefault();
    if (!selected) return;
    setFormError('');
    setIsSubmitting(true);
    try {
      await updateLeaveTypeDefinition({
        Id: selected.Id,
        ...formToPayload(editForm, true),
      });
      editDialog.close();
      await loadData();
    } catch (err) {
      setFormError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!selected) return;
    setIsSubmitting(true);
    try {
      await deleteLeaveTypeDefinition(selected.Id);
      deleteDialog.close();
      await loadData();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  function formatAllowance(item: LeaveTypeDefinitionDto) {
    if (!item.AffectsLeaveBalance) return '—';
    if (item.DefaultAnnualAllowance == null) return 'نامحدود';
    const unit = LEAVE_TYPE_UNIT_LABELS[item.Unit] ?? '';
    return `${item.DefaultAnnualAllowance.toLocaleString('fa-IR')} ${unit}`;
  }

  return (
    <div className="flex-1 p-4 lg:p-6" dir="rtl">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">انواع مرخصی</h1>
            <p className="text-muted-foreground">تعریف سیاست‌ها، سقف‌ها و قوانین هر نوع مرخصی و ماموریت</p>
          </div>
          <Button onClick={() => { setCreateForm(emptyForm()); setFormError(''); createDialog.open(); }}>
            <Icon name="material-symbols:add" className="size-4" />
            نوع جدید
          </Button>
        </div>

        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
        )}

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Card>
            <CardContent>
              <p className="text-muted-foreground text-sm">کل انواع</p>
              <p className="text-2xl font-bold">{totalCount.toLocaleString('fa-IR')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <p className="text-muted-foreground text-sm">فعال (صفحه جاری)</p>
              <p className="text-2xl font-bold">{stats.active.toLocaleString('fa-IR')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <p className="text-muted-foreground text-sm">دارای مانده</p>
              <p className="text-2xl font-bold">{stats.withBalance.toLocaleString('fa-IR')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <p className="text-muted-foreground text-sm">ماموریت (صفحه جاری)</p>
              <p className="text-2xl font-bold">{stats.mission.toLocaleString('fa-IR')}</p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-card rounded-2xl border p-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative min-w-[200px] flex-1">
              <Icon name="material-symbols:search" className="text-muted-foreground absolute start-3 top-1/2 size-5 -translate-y-1/2" />
              <Input
                className="ps-10"
                placeholder="جستجو نام یا کد..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <Select
              className="w-40"
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            >
              <option value="">همه دسته‌ها</option>
              {Object.entries(LEAVE_TYPE_CATEGORY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Select>
            <Select
              className="w-36"
              value={activeFilter}
              onChange={(e) => { setActiveFilter(e.target.value); setPage(1); }}
            >
              <option value="">همه وضعیت‌ها</option>
              <option value="true">فعال</option>
              <option value="false">غیرفعال</option>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>لیست انواع مرخصی</CardTitle>
            <CardDescription>مدیریت کامل تعاریف مرخصی و ماموریت</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="table-wrapper">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-head">ترتیب</th>
                    <th className="table-head">کد</th>
                    <th className="table-head">نام</th>
                    <th className="table-head">دسته</th>
                    <th className="table-head">واحد</th>
                    <th className="table-head">سقف سالانه</th>
                    <th className="table-head">مانده</th>
                    <th className="table-head">وضعیت</th>
                    <th className="table-head">عملیات</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {loading ? (
                    <tr className="table-row"><td colSpan={9} className="table-cell text-muted-foreground py-8 text-center text-sm">در حال بارگذاری...</td></tr>
                  ) : items.length === 0 ? (
                    <tr className="table-row"><td colSpan={9} className="table-cell text-muted-foreground py-8 text-center text-sm">نوعی یافت نشد</td></tr>
                  ) : (
                    items.map((item) => (
                      <tr key={item.Id} className="table-row">
                        <td className="table-cell">{item.SortOrder.toLocaleString('fa-IR')}</td>
                        <td className="table-cell font-mono text-xs">{item.Code}</td>
                        <td className="table-cell">
                          <div className="flex items-center gap-2">
                            {item.Color && (
                              <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.Color }} />
                            )}
                            <span className="font-medium">{item.Name}</span>
                          </div>
                        </td>
                        <td className="table-cell">{LEAVE_TYPE_CATEGORY_LABELS[item.Category] ?? '—'}</td>
                        <td className="table-cell">{LEAVE_TYPE_UNIT_LABELS[item.Unit] ?? '—'}</td>
                        <td className="table-cell">{formatAllowance(item)}</td>
                        <td className="table-cell">
                          <Badge variant={item.AffectsLeaveBalance ? 'default' : 'secondary'}>
                            {item.AffectsLeaveBalance ? 'دارد' : 'ندارد'}
                          </Badge>
                        </td>
                        <td className="table-cell">
                          <Badge variant={item.IsActive ? 'success' : 'secondary'}>
                            {item.IsActive ? 'فعال' : 'غیرفعال'}
                          </Badge>
                        </td>
                        <td className="table-cell">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon-sm" onClick={() => openEdit(item)}>
                              <Icon name="material-symbols:edit" className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="text-destructive"
                              onClick={() => { setSelected(item); deleteDialog.open(); }}
                            >
                              <Icon name="material-symbols:delete" className="size-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-muted-foreground text-sm">صفحه {page.toLocaleString('fa-IR')} از {totalPages.toLocaleString('fa-IR')}</p>
              <div className="flex gap-1">
                <Button variant="outline" size="icon-sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  <Icon name="material-symbols:chevron-right" className="size-4" />
                </Button>
                <Button variant="outline" size="icon-sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                  <Icon name="material-symbols:chevron-left" className="size-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={createDialog.isOpen} onClose={createDialog.close} className="max-w-2xl">
        <form onSubmit={(e) => void handleCreate(e)}>
          <div className="dialog-header">
            <h3 className="dialog-title">نوع مرخصی جدید</h3>
            <p className="dialog-description">تعریف سیاست کامل برای یک نوع مرخصی یا ماموریت</p>
          </div>
          <div className="dialog-body max-h-[70vh] overflow-y-auto">
            {formError && <p className="text-destructive mb-4 text-sm">{formError}</p>}
            <LeaveTypeFormFields form={createForm} setForm={setCreateForm} />
          </div>
          <div className="dialog-footer">
            <Button type="button" variant="outline" onClick={createDialog.close}>انصراف</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'در حال ذخیره...' : 'ثبت'}</Button>
          </div>
        </form>
      </Dialog>

      <Dialog open={editDialog.isOpen} onClose={editDialog.close} className="max-w-2xl">
        <form onSubmit={(e) => void handleEdit(e)}>
          <div className="dialog-header">
            <h3 className="dialog-title">ویرایش نوع مرخصی</h3>
            <p className="dialog-description">{selected?.Name}</p>
          </div>
          <div className="dialog-body max-h-[70vh] overflow-y-auto">
            {formError && <p className="text-destructive mb-4 text-sm">{formError}</p>}
            <LeaveTypeFormFields form={editForm} setForm={setEditForm} isEdit />
          </div>
          <div className="dialog-footer">
            <Button type="button" variant="outline" onClick={editDialog.close}>انصراف</Button>
            <Button type="submit" disabled={isSubmitting}>ذخیره</Button>
          </div>
        </form>
      </Dialog>

      <Dialog open={deleteDialog.isOpen} onClose={deleteDialog.close}>
        <div className="dialog-header">
          <h3 className="dialog-title">حذف نوع مرخصی</h3>
          <p className="dialog-description">
            آیا از حذف «{selected?.Name}» مطمئن هستید؟
            <span className="text-destructive mt-2 block text-xs">
              اگر درخواست یا مانده‌ای با این نوع ثبت شده باشد، حذف امکان‌پذیر نیست.
            </span>
          </p>
        </div>
        <div className="dialog-footer">
          <Button variant="outline" onClick={deleteDialog.close}>انصراف</Button>
          <Button variant="destructive" disabled={isSubmitting} onClick={() => void handleDelete()}>حذف</Button>
        </div>
      </Dialog>
    </div>
  );
}
