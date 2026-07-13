import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Dialog } from '@/components/layout/Dialog';
import { useDisclosure } from '@/hooks';
import {
  createWorkShift,
  deleteWorkShift,
  getAllWorkShifts,
  getApiErrorMessage,
  updateWorkShift,
  type WorkShiftDto,
} from '@/services/api';

const PAGE_SIZE = 10;

interface FormState {
  name: string;
  startTime: string;
  endTime: string;
  breakMinutes: string;
  isActive: boolean;
  description: string;
}

const emptyForm = (): FormState => ({
  name: '',
  startTime: '08:00',
  endTime: '17:00',
  breakMinutes: '60',
  isActive: true,
  description: '',
});

function formatTime(value: string) {
  return value?.slice(0, 5) ?? '—';
}

export default function WorkShiftsPage() {
  const createDialog = useDisclosure();
  const editDialog = useDisclosure();
  const deleteDialog = useDisclosure();

  const [items, setItems] = useState<WorkShiftDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selected, setSelected] = useState<WorkShiftDto | null>(null);
  const [createForm, setCreateForm] = useState<FormState>(emptyForm);
  const [editForm, setEditForm] = useState<FormState>(emptyForm);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getAllWorkShifts({
        Name: search.trim() || undefined,
        Pagination: { PageNumber: page, PageSize: PAGE_SIZE },
      });
      setItems(result.Items ?? []);
      setTotalCount(result.TotalCount ?? 0);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const stats = useMemo(() => ({
    total: items.length,
    active: items.filter((i) => i.IsActive).length,
  }), [items]);

  function toPayload(form: FormState) {
    return {
      Name: form.name.trim(),
      StartTime: form.startTime.length === 5 ? `${form.startTime}:00` : form.startTime,
      EndTime: form.endTime.length === 5 ? `${form.endTime}:00` : form.endTime,
      BreakMinutes: Number(form.breakMinutes) || 0,
      IsActive: form.isActive,
      Description: form.description.trim() || null,
    };
  }

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setFormError('');
    setIsSubmitting(true);
    try {
      if (!createForm.name.trim()) throw new Error('نام شیفت الزامی است');
      await createWorkShift(toPayload(createForm));
      setCreateForm(emptyForm());
      createDialog.close();
      await loadData();
    } catch (err) {
      setFormError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  function openEdit(item: WorkShiftDto) {
    setSelected(item);
    setEditForm({
      name: item.Name,
      startTime: formatTime(item.StartTime),
      endTime: formatTime(item.EndTime),
      breakMinutes: String(item.BreakMinutes),
      isActive: item.IsActive,
      description: item.Description ?? '',
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
      await updateWorkShift({ Id: selected.Id, ...toPayload(editForm) });
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
      await deleteWorkShift(selected.Id);
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
            <h1 className="text-2xl font-bold">شیفت‌های کاری</h1>
            <p className="text-muted-foreground">مدیریت شیفت‌ها و ساعات کاری</p>
          </div>
          <Button onClick={() => { setCreateForm(emptyForm()); createDialog.open(); }}>
            <Icon name="material-symbols:add" className="size-4" />
            شیفت جدید
          </Button>
        </div>

        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
        )}

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Card>
            <CardContent>
              <p className="text-muted-foreground text-sm">کل شیفت‌ها</p>
              <p className="text-2xl font-bold">{totalCount.toLocaleString('fa-IR')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <p className="text-muted-foreground text-sm">فعال (صفحه جاری)</p>
              <p className="text-2xl font-bold">{stats.active.toLocaleString('fa-IR')}</p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-card rounded-2xl border p-4">
          <div className="relative max-w-md">
            <Icon name="material-symbols:search" className="text-muted-foreground absolute start-3 top-1/2 size-5 -translate-y-1/2" />
            <Input className="ps-10" placeholder="جستجو شیفت..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>لیست شیفت‌ها</CardTitle>
            <CardDescription>تعریف و ویرایش شیفت‌های کاری</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="table-wrapper">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-head">نام</th>
                    <th className="table-head">شروع</th>
                    <th className="table-head">پایان</th>
                    <th className="table-head">استراحت (دقیقه)</th>
                    <th className="table-head">وضعیت</th>
                    <th className="table-head">عملیات</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {loading ? (
                    <tr className="table-row"><td colSpan={6} className="table-cell text-muted-foreground py-8 text-center text-sm">در حال بارگذاری...</td></tr>
                  ) : items.length === 0 ? (
                    <tr className="table-row"><td colSpan={6} className="table-cell text-muted-foreground py-8 text-center text-sm">شیفتی یافت نشد</td></tr>
                  ) : (
                    items.map((item) => (
                      <tr key={item.Id} className="table-row">
                        <td className="table-cell font-medium">{item.Name}</td>
                        <td className="table-cell">{formatTime(item.StartTime)}</td>
                        <td className="table-cell">{formatTime(item.EndTime)}</td>
                        <td className="table-cell">{item.BreakMinutes.toLocaleString('fa-IR')}</td>
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
          <div className="dialog-header">
            <h3 className="dialog-title">شیفت جدید</h3>
          </div>
          <div className="dialog-body space-y-4">
            {formError && <p className="text-destructive text-sm">{formError}</p>}
            <Input placeholder="نام شیفت" value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} required />
            <div className="grid grid-cols-2 gap-4">
              <Input type="time" value={createForm.startTime} onChange={(e) => setCreateForm({ ...createForm, startTime: e.target.value })} required />
              <Input type="time" value={createForm.endTime} onChange={(e) => setCreateForm({ ...createForm, endTime: e.target.value })} required />
            </div>
            <Input type="number" placeholder="دقیقه استراحت" value={createForm.breakMinutes} onChange={(e) => setCreateForm({ ...createForm, breakMinutes: e.target.value })} />
            <Textarea placeholder="توضیحات" value={createForm.description} onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })} />
          </div>
          <div className="dialog-footer">
            <Button type="button" variant="outline" onClick={createDialog.close}>انصراف</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'در حال ذخیره...' : 'ثبت'}</Button>
          </div>
        </form>
      </Dialog>

      <Dialog open={editDialog.isOpen} onClose={editDialog.close}>
        <form onSubmit={(e) => void handleEdit(e)}>
          <div className="dialog-header">
            <h3 className="dialog-title">ویرایش شیفت</h3>
          </div>
          <div className="dialog-body space-y-4">
            {formError && <p className="text-destructive text-sm">{formError}</p>}
            <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required />
            <div className="grid grid-cols-2 gap-4">
              <Input type="time" value={editForm.startTime} onChange={(e) => setEditForm({ ...editForm, startTime: e.target.value })} required />
              <Input type="time" value={editForm.endTime} onChange={(e) => setEditForm({ ...editForm, endTime: e.target.value })} required />
            </div>
            <Input type="number" value={editForm.breakMinutes} onChange={(e) => setEditForm({ ...editForm, breakMinutes: e.target.value })} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={editForm.isActive} onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })} />
              فعال
            </label>
            <Textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
          </div>
          <div className="dialog-footer">
            <Button type="button" variant="outline" onClick={editDialog.close}>انصراف</Button>
            <Button type="submit" disabled={isSubmitting}>ذخیره</Button>
          </div>
        </form>
      </Dialog>

      <Dialog open={deleteDialog.isOpen} onClose={deleteDialog.close}>
        <div className="dialog-header">
          <h3 className="dialog-title">حذف شیفت</h3>
          <p className="dialog-description">آیا از حذف «{selected?.Name}» مطمئن هستید؟</p>
        </div>
        <div className="dialog-footer">
          <Button variant="outline" onClick={deleteDialog.close}>انصراف</Button>
          <Button variant="destructive" disabled={isSubmitting} onClick={() => void handleDelete()}>حذف</Button>
        </div>
      </Dialog>
    </div>
  );
}
