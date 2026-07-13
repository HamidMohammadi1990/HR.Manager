import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Drawer } from '@/components/layout/Dialog';
import { useDrawer } from '@/hooks';
import { TODO_PRIORITY_LABELS } from '@/lib/hrLabels';
import {
  createTodoItem,
  deleteTodoItem,
  getAllTodoItems,
  getApiErrorMessage,
  toggleTodoItemComplete,
  updateTodoItem,
  type TodoItemDto,
  TodoPriority,
} from '@/services/api';
import { getAccessToken, getUserIdFromToken } from '@/services/api/tokenStorage';

const PAGE_SIZE = 10;

function priorityBadgeVariant(priority: number) {
  if (priority === TodoPriority.High) return 'alert' as const;
  if (priority === TodoPriority.Low) return 'secondary' as const;
  return 'default' as const;
}

function formatDueDate(value?: string | null) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('fa-IR');
}

interface FormState {
  title: string;
  description: string;
  priority: number;
  dueDate: string;
}

const emptyForm = (): FormState => ({
  title: '',
  description: '',
  priority: TodoPriority.Medium,
  dueDate: '',
});

export default function TodoPage() {
  const addTaskDrawer = useDrawer();
  const [currentUserId, setCurrentUserId] = useState('');
  const [items, setItems] = useState<TodoItemDto[]>([]);
  const [statsItems, setStatsItems] = useState<TodoItemDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [completedFilter, setCompletedFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editing, setEditing] = useState<TodoItemDto | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    if (token) setCurrentUserId(getUserIdFromToken(token) ?? '');
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const isCompleted =
        completedFilter === 'completed' ? true : completedFilter === 'pending' ? false : undefined;
      const [listResult, statsResult] = await Promise.all([
        getAllTodoItems({
          Priority: priorityFilter ? Number(priorityFilter) : undefined,
          IsCompleted: isCompleted,
          Title: search.trim() || undefined,
          Pagination: { PageNumber: page, PageSize: PAGE_SIZE },
        }),
        getAllTodoItems({ Pagination: { PageNumber: 1, PageSize: 500 } }),
      ]);
      setItems(listResult.Items ?? []);
      setTotalCount(listResult.TotalCount ?? 0);
      setStatsItems(statsResult.Items ?? []);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [completedFilter, page, priorityFilter, search]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const stats = useMemo(() => {
    const completed = statsItems.filter((i) => i.IsCompleted).length;
    const pending = statsItems.length - completed;
    const high = statsItems.filter((i) => i.Priority === TodoPriority.High && !i.IsCompleted).length;
    return { total: statsItems.length, completed, pending, high };
  }, [statsItems]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm());
    setFormError('');
    addTaskDrawer.open();
  }

  function openEdit(item: TodoItemDto) {
    setEditing(item);
    setForm({
      title: item.Title,
      description: item.Description ?? '',
      priority: item.Priority,
      dueDate: item.DueDate ? item.DueDate.slice(0, 10) : '',
    });
    setFormError('');
    addTaskDrawer.open();
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!currentUserId) {
      setFormError('شناسه کاربر یافت نشد');
      return;
    }
    setFormError('');
    setIsSubmitting(true);
    try {
      if (!form.title.trim()) throw new Error('عنوان کار الزامی است');
      const dueDate = form.dueDate ? new Date(form.dueDate).toISOString() : null;
      if (editing) {
        await updateTodoItem({
          Id: editing.Id,
          UserId: editing.UserId,
          Title: form.title.trim(),
          Description: form.description.trim() || null,
          DueDate: dueDate,
          Priority: form.priority,
        });
      } else {
        await createTodoItem({
          UserId: currentUserId,
          Title: form.title.trim(),
          Description: form.description.trim() || null,
          DueDate: dueDate,
          Priority: form.priority,
        });
      }
      addTaskDrawer.close();
      await loadData();
    } catch (err) {
      setFormError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleToggle(item: TodoItemDto) {
    setActionId(item.Id);
    try {
      await toggleTodoItemComplete(item.Id);
      await loadData();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setActionId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('آیا از حذف این کار مطمئن هستید؟')) return;
    setActionId(id);
    try {
      await deleteTodoItem(id);
      await loadData();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setActionId(null);
    }
  }

  const metrics = [
    { label: 'کل کارها', value: stats.total, sub: `${stats.pending} در انتظار`, icon: 'material-symbols:checklist', iconColor: 'text-primary' },
    { label: 'تکمیل شده', value: stats.completed, sub: stats.total ? `${Math.round((stats.completed / stats.total) * 100)}%` : '۰%', icon: 'material-symbols:check-circle', iconColor: 'text-emerald-500' },
    { label: 'در انتظار', value: stats.pending, sub: 'نیاز به انجام', icon: 'material-symbols:schedule', iconColor: 'text-amber-500' },
    { label: 'اولویت بالا', value: stats.high, sub: 'نیاز به توجه', icon: 'material-symbols:priority-high', iconColor: 'text-red-500' },
  ];

  return (
    <div className="flex-1 p-4 lg:p-6" dir="rtl">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">لیست کارها</h1>
            <p className="text-muted-foreground">مدیریت وظایف و چک‌لیست روزانه تیم</p>
          </div>
          <Button variant="default" onClick={openCreate}>
            <Icon name="material-symbols:add" className="size-4" />
            کار جدید
          </Button>
        </div>

        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
        )}

        <div className="bg-card rounded-2xl border p-4">
          <div className="flex items-center gap-3 max-md:flex-wrap">
            <div className="relative min-w-80 flex-1">
              <Icon name="material-symbols:search" className="text-muted-foreground absolute start-3 top-1/2 size-5 -translate-y-1/2" />
              <Input className="w-full ps-10" placeholder="جستجو کارها..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
            </div>
            <Select value={priorityFilter} onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }}>
              <option value="">همه اولویت‌ها</option>
              {Object.entries(TODO_PRIORITY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Select>
            <Select value={completedFilter} onChange={(e) => { setCompletedFilter(e.target.value); setPage(1); }}>
              <option value="">همه وضعیت‌ها</option>
              <option value="pending">در انتظار</option>
              <option value="completed">تکمیل شده</option>
            </Select>
            <div className="flex items-center gap-2">
              <Badge variant="success">{stats.completed.toLocaleString('fa-IR')} تکمیل شده</Badge>
              <Badge variant="alert">{stats.pending.toLocaleString('fa-IR')} در انتظار</Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {metrics.map((m) => (
            <Card key={m.label}>
              <CardContent>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">{m.label}</span>
                  <Icon name={m.icon} className={`size-5 ${m.iconColor}`} />
                </div>
                <p className="text-2xl font-bold">{m.value.toLocaleString('fa-IR')}</p>
                <p className="text-muted-foreground mt-1 text-xs">{m.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>لیست کارها</CardTitle>
            <CardDescription>مدیریت و پیگیری وظایف روزانه</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="table-wrapper">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-head">کار</th>
                    <th className="table-head">اولویت</th>
                    <th className="table-head">وضعیت</th>
                    <th className="table-head">موعد</th>
                    <th className="table-head">عملیات</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {loading ? (
                    <tr className="table-row"><td colSpan={5} className="table-cell text-muted-foreground py-8 text-center text-sm">در حال بارگذاری...</td></tr>
                  ) : items.length === 0 ? (
                    <tr className="table-row"><td colSpan={5} className="table-cell text-muted-foreground py-8 text-center text-sm">کاری یافت نشد</td></tr>
                  ) : (
                    items.map((task) => {
                      const isBusy = actionId === task.Id;
                      return (
                        <tr key={task.Id} className="table-row">
                          <td className="table-cell font-medium">
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                className="size-4"
                                checked={task.IsCompleted}
                                disabled={isBusy}
                                onChange={() => void handleToggle(task)}
                              />
                              <span className={task.IsCompleted ? 'text-muted-foreground line-through' : ''}>{task.Title}</span>
                            </div>
                          </td>
                          <td className="table-cell">
                            <Badge variant={priorityBadgeVariant(task.Priority)}>{TODO_PRIORITY_LABELS[task.Priority]}</Badge>
                          </td>
                          <td className="table-cell">
                            <Badge variant={task.IsCompleted ? 'success' : 'secondary'}>
                              {task.IsCompleted ? 'تکمیل شده' : 'در انتظار'}
                            </Badge>
                          </td>
                          <td className="text-muted-foreground table-cell text-sm">{formatDueDate(task.DueDate)}</td>
                          <td className="table-cell">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon-sm" onClick={() => openEdit(task)} disabled={isBusy}>
                                <Icon name="material-symbols:edit" className="size-4" />
                              </Button>
                              <Button variant="ghost" size="icon-sm" className="text-destructive" onClick={() => void handleDelete(task.Id)} disabled={isBusy}>
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
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <p className="text-muted-foreground text-sm">
                نمایش {items.length > 0 ? (page - 1) * PAGE_SIZE + 1 : 0} تا {(page - 1) * PAGE_SIZE + items.length} از {totalCount}
              </p>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon-sm" disabled={page <= 1 || loading} onClick={() => setPage((p) => p - 1)}>
                  <Icon name="material-symbols:chevron-right" className="size-4" />
                </Button>
                <Button variant="default" size="sm">{page.toLocaleString('fa-IR')}</Button>
                <Button variant="outline" size="icon-sm" disabled={page >= totalPages || loading} onClick={() => setPage((p) => p + 1)}>
                  <Icon name="material-symbols:chevron-left" className="size-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Drawer open={addTaskDrawer.isOpen} onClose={addTaskDrawer.close} id="add-task-drawer">
        <form className="flex h-full flex-col" onSubmit={(e) => void handleSubmit(e)}>
          <div className="drawer-header">
            <div>
              <p className="font-semibold">{editing ? 'ویرایش کار' : 'افزودن کار جدید'}</p>
              <p className="text-muted-foreground text-xs">جزئیات کار را وارد کنید</p>
            </div>
            <Button type="button" variant="ghost" size="icon-sm" onClick={addTaskDrawer.close}>
              <Icon name="material-symbols:close" className="size-5" />
            </Button>
          </div>
          <div className="drawer-content flex-1 space-y-4">
            {formError && <p className="text-destructive text-sm">{formError}</p>}
            <div className="space-y-2">
              <label className="label">عنوان کار</label>
              <Input placeholder="مثلاً: بررسی ایمیل‌ها" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <label className="label">توضیحات</label>
              <Textarea rows={3} placeholder="جزئیات کار..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="label">اولویت</label>
                <Select value={String(form.priority)} onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })}>
                  {Object.entries(TODO_PRIORITY_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <label className="label">موعد</label>
                <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
              </div>
            </div>
          </div>
          <div className="drawer-footer">
            <Button type="button" variant="outline" className="flex-1" onClick={addTaskDrawer.close}>انصراف</Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>{isSubmitting ? 'در حال ذخیره...' : editing ? 'ذخیره' : 'افزودن کار'}</Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
