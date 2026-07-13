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
import {
  ANNOUNCEMENT_AUDIENCE_LABELS,
  ANNOUNCEMENT_CHANNEL_LABELS,
  ANNOUNCEMENT_STATUS_LABELS,
} from '@/lib/hrLabels';
import {
  archiveAnnouncement,
  createAnnouncement,
  deleteAnnouncement,
  getAllAnnouncements,
  getAllDepartments,
  getAllRoles,
  getApiErrorMessage,
  publishAnnouncement,
  updateAnnouncement,
  type AnnouncementDto,
  AnnouncementAudience,
  AnnouncementChannel,
  AnnouncementStatus,
} from '@/services/api';

const PAGE_SIZE = 10;

function statusBadgeVariant(status: number) {
  if (status === AnnouncementStatus.Sent) return 'success' as const;
  if (status === AnnouncementStatus.Scheduled) return 'alert' as const;
  if (status === AnnouncementStatus.Failed) return 'destructive' as const;
  if (status === AnnouncementStatus.Archived) return 'secondary' as const;
  return 'default' as const;
}

function formatDateTime(value?: string | null) {
  if (!value) return '—';
  return new Date(value).toLocaleString('fa-IR');
}

function audienceLabel(item: AnnouncementDto) {
  if (item.Audience === AnnouncementAudience.Department) {
    return item.DepartmentName ?? ANNOUNCEMENT_AUDIENCE_LABELS[item.Audience];
  }
  if (item.Audience === AnnouncementAudience.Role) {
    return item.RoleName ?? ANNOUNCEMENT_AUDIENCE_LABELS[item.Audience];
  }
  return ANNOUNCEMENT_AUDIENCE_LABELS[item.Audience];
}

interface FormState {
  title: string;
  content: string;
  audience: number;
  channel: number;
  departmentId: string;
  roleId: string;
  scheduledAt: string;
}

const emptyForm = (): FormState => ({
  title: '',
  content: '',
  audience: AnnouncementAudience.AllUsers,
  channel: AnnouncementChannel.InApp,
  departmentId: '',
  roleId: '',
  scheduledAt: '',
});

export default function AnnouncementsPage() {
  const composeDrawer = useDrawer();
  const previewDrawer = useDrawer();

  const [items, setItems] = useState<AnnouncementDto[]>([]);
  const [statsItems, setStatsItems] = useState<AnnouncementDto[]>([]);
  const [departments, setDepartments] = useState<{ Id: string; Name: string }[]>([]);
  const [roles, setRoles] = useState<{ Id: string; Title: string }[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [selected, setSelected] = useState<AnnouncementDto | null>(null);
  const [editMode, setEditMode] = useState(false);

  const loadLookups = useCallback(async () => {
    try {
      const [deptResult, roleResult] = await Promise.all([
        getAllDepartments({ IsActive: true, Pagination: { PageNumber: 1, PageSize: 200 } }),
        getAllRoles({ IsActive: true, Pagination: { PageNumber: 1, PageSize: 200 } }),
      ]);
      setDepartments(deptResult.Items ?? []);
      setRoles(roleResult.Items ?? []);
    } catch {
      /* optional lookups */
    }
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [listResult, statsResult] = await Promise.all([
        getAllAnnouncements({
          Status: statusFilter ? Number(statusFilter) : undefined,
          Title: search.trim() || undefined,
          Pagination: { PageNumber: page, PageSize: PAGE_SIZE },
        }),
        getAllAnnouncements({ Pagination: { PageNumber: 1, PageSize: 500 } }),
      ]);
      setItems(listResult.Items ?? []);
      setTotalCount(listResult.TotalCount ?? 0);
      setStatsItems(statsResult.Items ?? []);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    void loadLookups();
  }, [loadLookups]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const stats = useMemo(() => {
    const sent = statsItems.filter((i) => i.Status === AnnouncementStatus.Sent).length;
    const scheduled = statsItems.filter((i) => i.Status === AnnouncementStatus.Scheduled).length;
    const draft = statsItems.filter((i) => i.Status === AnnouncementStatus.Draft).length;
    const archived = statsItems.filter((i) => i.Status === AnnouncementStatus.Archived).length;
    return { total: statsItems.length, sent, scheduled, draft, archived };
  }, [statsItems]);

  function openCreate() {
    setEditMode(false);
    setForm(emptyForm());
    setFormError('');
    composeDrawer.open();
  }

  function openEdit(item: AnnouncementDto) {
    setEditMode(true);
    setSelected(item);
    setForm({
      title: item.Title,
      content: item.Content,
      audience: item.Audience,
      channel: item.Channel,
      departmentId: item.DepartmentId ?? '',
      roleId: item.RoleId ?? '',
      scheduledAt: item.ScheduledAtUtc ? item.ScheduledAtUtc.slice(0, 16) : '',
    });
    setFormError('');
    composeDrawer.open();
  }

  function openPreview(item: AnnouncementDto) {
    setSelected(item);
    previewDrawer.open();
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError('');
    setIsSubmitting(true);
    try {
      if (!form.title.trim()) throw new Error('عنوان الزامی است');
      if (!form.content.trim()) throw new Error('متن اطلاعیه الزامی است');
      if (form.audience === AnnouncementAudience.Department && !form.departmentId) {
        throw new Error('بخش را انتخاب کنید');
      }
      if (form.audience === AnnouncementAudience.Role && !form.roleId) {
        throw new Error('نقش را انتخاب کنید');
      }

      const scheduledAtUtc = form.scheduledAt
        ? new Date(form.scheduledAt).toISOString()
        : null;
      const status = scheduledAtUtc ? AnnouncementStatus.Scheduled : AnnouncementStatus.Draft;

      if (editMode && selected) {
        await updateAnnouncement({
          Id: selected.Id,
          Title: form.title.trim(),
          Content: form.content.trim(),
          Status: selected.Status,
          Audience: form.audience,
          Channel: form.channel,
          DepartmentId: form.audience === AnnouncementAudience.Department ? form.departmentId : null,
          RoleId: form.audience === AnnouncementAudience.Role ? form.roleId : null,
          ScheduledAtUtc: scheduledAtUtc,
        });
      } else {
        await createAnnouncement({
          Title: form.title.trim(),
          Content: form.content.trim(),
          Status: status,
          Audience: form.audience,
          Channel: form.channel,
          DepartmentId: form.audience === AnnouncementAudience.Department ? form.departmentId : null,
          RoleId: form.audience === AnnouncementAudience.Role ? form.roleId : null,
          ScheduledAtUtc: scheduledAtUtc,
        });
      }

      composeDrawer.close();
      await loadData();
    } catch (err) {
      setFormError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePublish(id: string) {
    setActionId(id);
    try {
      await publishAnnouncement(id);
      previewDrawer.close();
      await loadData();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setActionId(null);
    }
  }

  async function handleArchive(id: string) {
    setActionId(id);
    try {
      await archiveAnnouncement(id);
      await loadData();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setActionId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('آیا از حذف این اطلاعیه مطمئن هستید؟')) return;
    setActionId(id);
    try {
      await deleteAnnouncement(id);
      await loadData();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setActionId(null);
    }
  }

  const metrics = [
    { label: 'کل اطلاعیه‌ها', value: stats.total, sub: `${stats.draft} پیش‌نویس`, icon: 'material-symbols:campaign', iconColor: 'text-primary' },
    { label: 'ارسال‌شده', value: stats.sent, sub: 'منتشر شده', icon: 'material-symbols:send', iconColor: 'text-emerald-500' },
    { label: 'زمان‌بندی‌شده', value: stats.scheduled, sub: 'در صف ارسال', icon: 'material-symbols:schedule', iconColor: 'text-amber-500' },
    { label: 'آرشیو', value: stats.archived, sub: 'بایگانی شده', icon: 'material-symbols:inventory-2', iconColor: 'text-sky-500' },
  ];

  return (
    <div className="flex-1 p-4 lg:p-6" dir="rtl">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">اطلاعیه‌ها</h1>
            <p className="text-muted-foreground">مدیریت اطلاعیه‌ها و پیام‌های عمومی</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => { setStatusFilter(String(AnnouncementStatus.Archived)); setPage(1); }}>
              <Icon name="material-symbols:history" className="size-4" />
              آرشیو
            </Button>
            <Button variant="default" onClick={openCreate}>
              <Icon name="material-symbols:campaign" className="size-4" />
              اطلاعیه جدید
            </Button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="bg-card rounded-2xl border p-4">
          <div className="flex items-center gap-3 max-md:flex-wrap">
            <div className="relative min-w-80 flex-1">
              <Icon name="material-symbols:search" className="text-muted-foreground absolute start-3 top-1/2 size-5 -translate-y-1/2" />
              <Input
                className="w-full ps-10"
                placeholder="جستجو اطلاعیه‌ها..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <Select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
              <option value="">همه وضعیت‌ها</option>
              {Object.entries(ANNOUNCEMENT_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Select>
            <div className="flex items-center gap-2">
              <Badge variant="success">{stats.sent.toLocaleString('fa-IR')} ارسال‌شده</Badge>
              <Badge variant="alert">{stats.scheduled.toLocaleString('fa-IR')} زمان‌بندی‌شده</Badge>
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
            <CardTitle>لیست اطلاعیه‌ها</CardTitle>
            <CardDescription>مدیریت و ویرایش اطلاعیه‌های ارسال شده و زمان‌بندی‌شده</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="table-wrapper">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-head">عنوان</th>
                    <th className="table-head">وضعیت</th>
                    <th className="table-head">مخاطب</th>
                    <th className="table-head">کانال</th>
                    <th className="table-head">زمان ارسال</th>
                    <th className="table-head">عملیات</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {loading ? (
                    <tr className="table-row">
                      <td colSpan={6} className="table-cell text-muted-foreground py-8 text-center text-sm">در حال بارگذاری...</td>
                    </tr>
                  ) : items.length === 0 ? (
                    <tr className="table-row">
                      <td colSpan={6} className="table-cell text-muted-foreground py-8 text-center text-sm">اطلاعیه‌ای یافت نشد</td>
                    </tr>
                  ) : (
                    items.map((a) => {
                      const isBusy = actionId === a.Id;
                      const canPublish = a.Status === AnnouncementStatus.Draft || a.Status === AnnouncementStatus.Scheduled;
                      const canArchive = a.Status === AnnouncementStatus.Sent;
                      return (
                        <tr key={a.Id} className="table-row">
                          <td className="table-cell font-medium">{a.Title}</td>
                          <td className="table-cell">
                            <Badge variant={statusBadgeVariant(a.Status)}>{ANNOUNCEMENT_STATUS_LABELS[a.Status]}</Badge>
                          </td>
                          <td className="table-cell">{audienceLabel(a)}</td>
                          <td className="table-cell">{ANNOUNCEMENT_CHANNEL_LABELS[a.Channel]}</td>
                          <td className="text-muted-foreground table-cell text-sm">
                            {formatDateTime(a.PublishedAtUtc ?? a.ScheduledAtUtc)}
                          </td>
                          <td className="table-cell">
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon-sm" onClick={() => openPreview(a)} title="مشاهده">
                                <Icon name="material-symbols:visibility" className="size-4" />
                              </Button>
                              <Button variant="ghost" size="icon-sm" onClick={() => openEdit(a)} title="ویرایش" disabled={isBusy}>
                                <Icon name="material-symbols:edit" className="size-4" />
                              </Button>
                              {canPublish && (
                                <Button variant="ghost" size="icon-sm" disabled={isBusy} onClick={() => void handlePublish(a.Id)} title="انتشار">
                                  <Icon name="material-symbols:send" className="size-4" />
                                </Button>
                              )}
                              {canArchive && (
                                <Button variant="ghost" size="icon-sm" disabled={isBusy} onClick={() => void handleArchive(a.Id)} title="آرشیو">
                                  <Icon name="material-symbols:inventory-2" className="size-4" />
                                </Button>
                              )}
                              <Button variant="ghost" size="icon-sm" className="text-destructive" disabled={isBusy} onClick={() => void handleDelete(a.Id)} title="حذف">
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

      <Drawer open={composeDrawer.isOpen} onClose={composeDrawer.close} id="announcement-compose-drawer">
        <form className="flex h-full flex-col" onSubmit={(e) => void handleSubmit(e)}>
          <div className="drawer-header">
            <div>
              <p className="font-semibold">{editMode ? 'ویرایش اطلاعیه' : 'ساخت اطلاعیه'}</p>
              <p className="text-muted-foreground text-xs">متن، مخاطب، زمان‌بندی</p>
            </div>
            <Button type="button" variant="ghost" size="icon-sm" onClick={composeDrawer.close}>
              <Icon name="material-symbols:close" className="size-5" />
            </Button>
          </div>
          <div className="drawer-content flex-1 space-y-4">
            {formError && <p className="text-destructive text-sm">{formError}</p>}
            <div className="space-y-2">
              <label className="label">عنوان</label>
              <Input placeholder="مثلاً: بروزرسانی مهم" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <label className="label">پیام</label>
              <Textarea rows={6} placeholder="متن اطلاعیه..." value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <label className="label">مخاطب</label>
              <Select value={String(form.audience)} onChange={(e) => setForm({ ...form, audience: Number(e.target.value) })}>
                {Object.entries(ANNOUNCEMENT_AUDIENCE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Select>
            </div>
            {form.audience === AnnouncementAudience.Department && (
              <div className="space-y-2">
                <label className="label">بخش</label>
                <Select value={form.departmentId} onChange={(e) => setForm({ ...form, departmentId: e.target.value })}>
                  <option value="">انتخاب بخش</option>
                  {departments.map((d) => <option key={d.Id} value={d.Id}>{d.Name}</option>)}
                </Select>
              </div>
            )}
            {form.audience === AnnouncementAudience.Role && (
              <div className="space-y-2">
                <label className="label">نقش</label>
                <Select value={form.roleId} onChange={(e) => setForm({ ...form, roleId: e.target.value })}>
                  <option value="">انتخاب نقش</option>
                  {roles.map((r) => <option key={r.Id} value={r.Id}>{r.Title}</option>)}
                </Select>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="label">زمان‌بندی (اختیاری)</label>
                <Input type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="label">کانال</label>
                <Select value={String(form.channel)} onChange={(e) => setForm({ ...form, channel: Number(e.target.value) })}>
                  {Object.entries(ANNOUNCEMENT_CHANNEL_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
          <div className="drawer-footer">
            <Button type="button" variant="outline" className="flex-1" onClick={composeDrawer.close}>انصراف</Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>{isSubmitting ? 'در حال ذخیره...' : 'ثبت'}</Button>
          </div>
        </form>
      </Drawer>

      <Drawer open={previewDrawer.isOpen} onClose={previewDrawer.close} id="announcement-preview-drawer">
        <div className="flex h-full flex-col">
          <div className="drawer-header">
            <div>
              <p className="font-semibold">پیش‌نمایش اطلاعیه</p>
              <p className="text-muted-foreground text-xs">{selected?.Title}</p>
            </div>
            <Button variant="ghost" size="icon-sm" onClick={previewDrawer.close}>
              <Icon name="material-symbols:close" className="size-5" />
            </Button>
          </div>
          <div className="drawer-content flex-1 space-y-4">
            {selected && (
              <>
                <div className="bg-muted/15 rounded-2xl border p-4">
                  <p className="font-semibold">{selected.Title}</p>
                  <p className="text-muted-foreground mt-2 text-sm leading-6 whitespace-pre-wrap">{selected.Content}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-card rounded-xl border p-3">
                    <p className="text-muted-foreground text-xs">کانال</p>
                    <p className="mt-1 font-semibold">{ANNOUNCEMENT_CHANNEL_LABELS[selected.Channel]}</p>
                  </div>
                  <div className="bg-card rounded-xl border p-3">
                    <p className="text-muted-foreground text-xs">مخاطب</p>
                    <p className="mt-1 font-semibold">{audienceLabel(selected)}</p>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="drawer-footer">
            <Button variant="outline" className="flex-1" onClick={previewDrawer.close}>بستن</Button>
            {selected && (selected.Status === AnnouncementStatus.Draft || selected.Status === AnnouncementStatus.Scheduled) && (
              <Button className="flex-1" disabled={actionId === selected.Id} onClick={() => void handlePublish(selected.Id)}>
                ارسال
              </Button>
            )}
          </div>
        </div>
      </Drawer>
    </div>
  );
}
