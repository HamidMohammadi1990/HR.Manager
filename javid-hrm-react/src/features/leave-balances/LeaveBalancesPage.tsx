import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Dialog } from '@/components/layout/Dialog';
import { useDisclosure } from '@/hooks';
import { getPersonName } from '@/lib/hrLabels';
import {
  createLeaveBalance,
  deleteLeaveBalance,
  getAllEmployees,
  getAllLeaveBalances,
  getApiErrorMessage,
  searchLeaveTypeDefinitions,
  updateLeaveBalance,
  type EmployeeDto,
  type LeaveBalanceDto,
  type LeaveTypeDefinitionDto,
} from '@/services/api';

const PAGE_SIZE = 10;

interface FormState {
  employeeId: string;
  leaveTypeDefinitionId: string;
  year: string;
  totalDays: string;
  usedDays: string;
}

const emptyForm = (): FormState => ({
  employeeId: '',
  leaveTypeDefinitionId: '',
  year: String(new Date().getFullYear()),
  totalDays: '0',
  usedDays: '0',
});

function getEmployeeLabel(employee: EmployeeDto) {
  const name = [employee.UserFirstName, employee.UserLastName].filter(Boolean).join(' ');
  return name ? `${name} (${employee.EmployeeCode})` : employee.EmployeeCode;
}

export default function LeaveBalancesPage() {
  const createDialog = useDisclosure();
  const editDialog = useDisclosure();
  const deleteDialog = useDisclosure();

  const [items, setItems] = useState<LeaveBalanceDto[]>([]);
  const [employees, setEmployees] = useState<EmployeeDto[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveTypeDefinitionDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [yearFilter, setYearFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selected, setSelected] = useState<LeaveBalanceDto | null>(null);
  const [createForm, setCreateForm] = useState<FormState>(emptyForm);
  const [editForm, setEditForm] = useState<FormState>(emptyForm);

  const loadEmployees = useCallback(async () => {
    try {
      const result = await getAllEmployees({ Pagination: { PageNumber: 1, PageSize: 200 } });
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
    setLoading(true);
    setError('');
    try {
      const result = await getAllLeaveBalances({
        Year: yearFilter ? Number(yearFilter) : undefined,
        LeaveTypeDefinitionId: typeFilter || undefined,
        Pagination: { PageNumber: page, PageSize: PAGE_SIZE },
      });
      setItems(result.Items ?? []);
      setTotalCount(result.TotalCount ?? 0);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, typeFilter, yearFilter]);

  useEffect(() => {
    void loadEmployees();
    void loadLeaveTypes();
  }, [loadEmployees, loadLeaveTypes]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const stats = useMemo(() => {
    const totalRemaining = items.reduce((sum, i) => sum + i.RemainingDays, 0);
    return { count: items.length, totalRemaining };
  }, [items]);

  function toPayload(form: FormState) {
    return {
      EmployeeId: form.employeeId,
      LeaveTypeDefinitionId: form.leaveTypeDefinitionId,
      Year: Number(form.year),
      TotalDays: Number(form.totalDays),
      UsedDays: Number(form.usedDays),
    };
  }

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setFormError('');
    setIsSubmitting(true);
    try {
      if (!createForm.employeeId) throw new Error('کارمند را انتخاب کنید');
      await createLeaveBalance(toPayload(createForm));
      setCreateForm(emptyForm());
      createDialog.close();
      await loadData();
    } catch (err) {
      setFormError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  function openEdit(item: LeaveBalanceDto) {
    setSelected(item);
    setEditForm({
      employeeId: item.EmployeeId,
      leaveTypeDefinitionId: item.LeaveTypeDefinitionId,
      year: String(item.Year),
      totalDays: String(item.TotalDays),
      usedDays: String(item.UsedDays),
    });
    setFormError('');
    editDialog.open();
  }

  async function handleEdit(event: FormEvent) {
    event.preventDefault();
    if (!selected) return;
    setFormError('');
    setIsSubmitting(true);
    try {
      await updateLeaveBalance({ Id: selected.Id, ...toPayload(editForm) });
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
      await deleteLeaveBalance(selected.Id);
      deleteDialog.close();
      await loadData();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex-1 p-4 lg:p-6" dir="rtl">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">موجودی مرخصی</h1>
            <p className="text-muted-foreground">مدیریت سهمیه و مصرف مرخصی کارکنان</p>
          </div>
          <Button onClick={() => { setCreateForm(emptyForm()); createDialog.open(); }}>
            <Icon name="material-symbols:add" className="size-4" />
            ثبت موجودی
          </Button>
        </div>

        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
        )}

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Card>
            <CardContent>
              <p className="text-muted-foreground text-sm">رکوردهای صفحه</p>
              <p className="text-2xl font-bold">{stats.count.toLocaleString('fa-IR')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <p className="text-muted-foreground text-sm">مانده (صفحه جاری)</p>
              <p className="text-2xl font-bold">{stats.totalRemaining.toLocaleString('fa-IR')} روز</p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-card flex flex-wrap items-center gap-3 rounded-2xl border p-4">
          <Select value={yearFilter} onChange={(e) => { setYearFilter(e.target.value); setPage(1); }}>
            <option value="">همه سال‌ها</option>
            {[0, 1, 2].map((offset) => {
              const y = new Date().getFullYear() - offset;
              return <option key={y} value={String(y)}>{y.toLocaleString('fa-IR')}</option>;
            })}
          </Select>
          <Select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}>
            <option value="">همه انواع</option>
            {leaveTypes.map((type) => (
              <option key={type.Id} value={type.Id}>{type.Name}</option>
            ))}
          </Select>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>لیست موجودی مرخصی</CardTitle>
            <CardDescription>سهمیه، مصرف و مانده مرخصی</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="table-wrapper">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-head">کارمند</th>
                    <th className="table-head">بخش</th>
                    <th className="table-head">نوع</th>
                    <th className="table-head">سال</th>
                    <th className="table-head">کل</th>
                    <th className="table-head">مصرف</th>
                    <th className="table-head">مانده</th>
                    <th className="table-head">عملیات</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {loading ? (
                    <tr className="table-row"><td colSpan={8} className="table-cell text-muted-foreground py-8 text-center text-sm">در حال بارگذاری...</td></tr>
                  ) : items.length === 0 ? (
                    <tr className="table-row"><td colSpan={8} className="table-cell text-muted-foreground py-8 text-center text-sm">رکوردی یافت نشد</td></tr>
                  ) : (
                    items.map((item) => (
                      <tr key={item.Id} className="table-row">
                        <td className="table-cell font-medium">
                          {getPersonName(item.UserFirstName, item.UserLastName, item.EmployeeCode)}
                        </td>
                        <td className="table-cell">{item.DepartmentName}</td>
                        <td className="table-cell">{item.LeaveTypeName}</td>
                        <td className="table-cell">{item.Year.toLocaleString('fa-IR')}</td>
                        <td className="table-cell">{item.TotalDays.toLocaleString('fa-IR')}</td>
                        <td className="table-cell">{item.UsedDays.toLocaleString('fa-IR')}</td>
                        <td className="table-cell">
                          <Badge variant={item.RemainingDays > 0 ? 'success' : 'destructive'}>
                            {item.RemainingDays.toLocaleString('fa-IR')}
                          </Badge>
                        </td>
                        <td className="table-cell">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon-sm" onClick={() => openEdit(item)}>
                              <Icon name="material-symbols:edit" className="size-4" />
                            </Button>
                            <Button variant="ghost" size="icon-sm" className="text-destructive" onClick={() => { setSelected(item); deleteDialog.open(); }}>
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

      <Dialog open={createDialog.isOpen} onClose={createDialog.close}>
        <form onSubmit={(e) => void handleCreate(e)}>
          <div className="dialog-header"><h3 className="dialog-title">ثبت موجودی مرخصی</h3></div>
          <div className="dialog-body space-y-4">
            {formError && <p className="text-destructive text-sm">{formError}</p>}
            <Select value={createForm.employeeId} onChange={(e) => setCreateForm({ ...createForm, employeeId: e.target.value })} required>
              <option value="">انتخاب کارمند</option>
              {employees.map((emp) => <option key={emp.Id} value={emp.Id}>{getEmployeeLabel(emp)}</option>)}
            </Select>
            <Select value={createForm.leaveTypeDefinitionId} onChange={(e) => setCreateForm({ ...createForm, leaveTypeDefinitionId: e.target.value })}>
              <option value="">انتخاب نوع...</option>
              {leaveTypes.map((type) => (
                <option key={type.Id} value={type.Id}>{type.Name}</option>
              ))}
            </Select>
            <Input type="number" placeholder="سال" value={createForm.year} onChange={(e) => setCreateForm({ ...createForm, year: e.target.value })} required />
            <div className="grid grid-cols-2 gap-4">
              <Input type="number" step="0.5" placeholder="کل روز" value={createForm.totalDays} onChange={(e) => setCreateForm({ ...createForm, totalDays: e.target.value })} required />
              <Input type="number" step="0.5" placeholder="مصرف شده" value={createForm.usedDays} onChange={(e) => setCreateForm({ ...createForm, usedDays: e.target.value })} required />
            </div>
          </div>
          <div className="dialog-footer">
            <Button type="button" variant="outline" onClick={createDialog.close}>انصراف</Button>
            <Button type="submit" disabled={isSubmitting}>ثبت</Button>
          </div>
        </form>
      </Dialog>

      <Dialog open={editDialog.isOpen} onClose={editDialog.close}>
        <form onSubmit={(e) => void handleEdit(e)}>
          <div className="dialog-header"><h3 className="dialog-title">ویرایش موجودی</h3></div>
          <div className="dialog-body space-y-4">
            {formError && <p className="text-destructive text-sm">{formError}</p>}
            <Select value={editForm.employeeId} onChange={(e) => setEditForm({ ...editForm, employeeId: e.target.value })} required>
              {employees.map((emp) => <option key={emp.Id} value={emp.Id}>{getEmployeeLabel(emp)}</option>)}
            </Select>
            <Select value={editForm.leaveTypeDefinitionId} onChange={(e) => setEditForm({ ...editForm, leaveTypeDefinitionId: e.target.value })}>
              {leaveTypes.map((type) => (
                <option key={type.Id} value={type.Id}>{type.Name}</option>
              ))}
            </Select>
            <Input type="number" value={editForm.year} onChange={(e) => setEditForm({ ...editForm, year: e.target.value })} required />
            <div className="grid grid-cols-2 gap-4">
              <Input type="number" step="0.5" value={editForm.totalDays} onChange={(e) => setEditForm({ ...editForm, totalDays: e.target.value })} required />
              <Input type="number" step="0.5" value={editForm.usedDays} onChange={(e) => setEditForm({ ...editForm, usedDays: e.target.value })} required />
            </div>
          </div>
          <div className="dialog-footer">
            <Button type="button" variant="outline" onClick={editDialog.close}>انصراف</Button>
            <Button type="submit" disabled={isSubmitting}>ذخیره</Button>
          </div>
        </form>
      </Dialog>

      <Dialog open={deleteDialog.isOpen} onClose={deleteDialog.close}>
        <div className="dialog-header">
          <h3 className="dialog-title">حذف موجودی</h3>
          <p className="dialog-description">آیا از حذف این رکورد مطمئن هستید؟</p>
        </div>
        <div className="dialog-footer">
          <Button variant="outline" onClick={deleteDialog.close}>انصراف</Button>
          <Button variant="destructive" disabled={isSubmitting} onClick={() => void handleDelete()}>حذف</Button>
        </div>
      </Dialog>
    </div>
  );
}
