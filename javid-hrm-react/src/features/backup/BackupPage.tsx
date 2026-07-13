import { useCallback, useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Dialog, Drawer } from '@/components/layout/Dialog';
import { useDisclosure, useDrawer } from '@/hooks';
import { BACKUP_STATUS_LABELS, BACKUP_TYPE_LABELS } from '@/lib/hrLabels';
import {
  BackupStatus,
  BackupType,
  createBackup,
  deleteBackupJob,
  downloadBackupJob,
  getAllBackupJobs,
  getApiErrorMessage,
  saveBinaryDownload,
  type BackupJobDto,
} from '@/services/api';

const PAGE_SIZE = 10;

function formatBytes(bytes: number) {
  if (bytes <= 0) return '—';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(1)} ${units[unit]}`;
}

function formatDateTime(value?: string | null) {
  if (!value) return '—';
  return new Date(value).toLocaleString('fa-IR');
}

function statusBadgeVariant(status: number) {
  if (status === BackupStatus.Completed) return 'success' as const;
  if (status === BackupStatus.InProgress) return 'alert' as const;
  if (status === BackupStatus.Failed) return 'destructive' as const;
  return 'secondary' as const;
}

export default function BackupPage() {
  const backupDrawer = useDrawer();
  const createDialog = useDisclosure();
  const deleteDialog = useDisclosure();

  const [items, setItems] = useState<BackupJobDto[]>([]);
  const [statsItems, setStatsItems] = useState<BackupJobDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);
  const [selected, setSelected] = useState<BackupJobDto | null>(null);
  const [backupType, setBackupType] = useState(String(BackupType.Manual));
  const [isCreating, setIsCreating] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [listResult, statsResult] = await Promise.all([
        getAllBackupJobs({
          Status: statusFilter ? Number(statusFilter) : undefined,
          Pagination: { PageNumber: page, PageSize: PAGE_SIZE },
        }),
        getAllBackupJobs({ Pagination: { PageNumber: 1, PageSize: 500 } }),
      ]);
      let list = listResult.Items ?? [];
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        list = list.filter((item) => item.FileName.toLowerCase().includes(q));
      }
      setItems(list);
      setTotalCount(search.trim() ? list.length : (listResult.TotalCount ?? 0));
      setStatsItems(statsResult.Items ?? []);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const stats = useMemo(() => ({
    total: statsItems.length,
    completed: statsItems.filter((i) => i.Status === BackupStatus.Completed).length,
    inProgress: statsItems.filter((i) => i.Status === BackupStatus.InProgress || i.Status === BackupStatus.Pending).length,
    failed: statsItems.filter((i) => i.Status === BackupStatus.Failed).length,
  }), [statsItems]);

  const statCards = [
    { label: 'کل پشتیبان‌ها', value: stats.total, icon: 'material-symbols:backup', bg: 'bg-primary/10', color: 'text-primary' },
    { label: 'موفق', value: stats.completed, icon: 'material-symbols:check-circle', bg: 'bg-emerald-500/10', color: 'text-emerald-500' },
    { label: 'در حال انجام', value: stats.inProgress, icon: 'material-symbols:schedule', bg: 'bg-amber-500/10', color: 'text-amber-500' },
    { label: 'ناموفق', value: stats.failed, icon: 'material-symbols:error', bg: 'bg-destructive/10', color: 'text-destructive' },
  ];

  async function handleCreateBackup() {
    setIsCreating(true);
    setError('');
    try {
      await createBackup({ Type: Number(backupType) });
      createDialog.close();
      await loadData();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDownload(item: BackupJobDto) {
    if (item.Status !== BackupStatus.Completed) return;
    setActionId(item.Id);
    try {
      const result = await downloadBackupJob(item.Id);
      saveBinaryDownload(result);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setActionId(null);
    }
  }

  async function handleDelete() {
    if (!selected) return;
    setActionId(selected.Id);
    try {
      await deleteBackupJob(selected.Id);
      deleteDialog.close();
      backupDrawer.close();
      await loadData();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setActionId(null);
    }
  }

  function openDetails(item: BackupJobDto) {
    setSelected(item);
    backupDrawer.open();
  }

  return (
    <div className="flex-1 p-4 lg:p-6" dir="rtl">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">پشتیبان‌گیری</h1>
            <p className="text-muted-foreground">نسخه‌های پشتیبان و بازیابی داده‌ها</p>
          </div>
          <Button variant="default" onClick={createDialog.open}>
            <Icon name="material-symbols:backup" className="size-4" />
            پشتیبان‌گیری جدید
          </Button>
        </div>

        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((s) => (
            <Card key={s.label}>
              <CardContent className="flex items-center gap-4">
                <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${s.bg}`}>
                  <Icon name={s.icon} className={`size-6 ${s.color}`} />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">{s.label}</p>
                  <p className="text-2xl font-bold">{s.value.toLocaleString('fa-IR')}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-card rounded-2xl border p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-64 flex-1">
              <Icon name="material-symbols:search" className="text-muted-foreground absolute start-3 top-1/2 size-5 -translate-y-1/2" />
              <Input className="w-full ps-10" placeholder="جستجو پشتیبان‌ها..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
            </div>
            <Select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
              <option value="">همه وضعیت‌ها</option>
              {Object.entries(BACKUP_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Select>
          </div>
        </div>

        <section className="space-y-4">
          {loading ? (
            <p className="text-muted-foreground py-8 text-center text-sm">در حال بارگذاری...</p>
          ) : items.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center text-sm">پشتیبانی یافت نشد</p>
          ) : (
            items.map((item) => {
              const isBusy = actionId === item.Id;
              const canDownload = item.Status === BackupStatus.Completed;
              return (
                <article key={item.Id} className="via-background to-background rounded-2xl border bg-linear-to-br from-emerald-500/10 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{item.FileName}</p>
                      <p className="text-muted-foreground mt-1 text-xs">
                        {BACKUP_TYPE_LABELS[item.Type]} • {formatDateTime(item.CreatedOnUtc)}
                      </p>
                    </div>
                    <Badge variant={statusBadgeVariant(item.Status)}>{BACKUP_STATUS_LABELS[item.Status]}</Badge>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-muted-foreground text-xs">
                      اندازه: {formatBytes(item.FileSizeBytes)}
                      {item.ErrorMessage ? ` • خطا: ${item.ErrorMessage}` : ''}
                    </span>
                    <div className="flex gap-2">
                      {canDownload && (
                        <Button variant="outline" size="sm" disabled={isBusy} onClick={() => void handleDownload(item)}>
                          دانلود
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => openDetails(item)}>جزئیات</Button>
                      <Button variant="ghost" size="sm" className="text-destructive" disabled={isBusy} onClick={() => { setSelected(item); deleteDialog.open(); }}>
                        حذف
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </section>

        <div className="flex flex-wrap items-center justify-between gap-2">
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
      </div>

      <Drawer open={backupDrawer.isOpen} onClose={backupDrawer.close} id="backup-drawer">
        <div className="flex h-full flex-col">
          <div className="drawer-header">
            <div>
              <p className="font-semibold">جزئیات پشتیبان</p>
              <p className="text-muted-foreground text-xs">{selected?.FileName}</p>
            </div>
            <Button variant="ghost" size="icon-sm" onClick={backupDrawer.close}>
              <Icon name="material-symbols:close" className="size-5" />
            </Button>
          </div>
          <div className="drawer-content flex-1 space-y-4">
            {selected && (
              <>
                <div className="space-y-2">
                  <label className="label">نام پشتیبان</label>
                  <Input value={selected.FileName} readOnly />
                </div>
                <div className="space-y-2">
                  <label className="label">اندازه</label>
                  <Input value={formatBytes(selected.FileSizeBytes)} readOnly />
                </div>
                <div className="space-y-2">
                  <label className="label">وضعیت</label>
                  <Input value={BACKUP_STATUS_LABELS[selected.Status]} readOnly />
                </div>
                <div className="space-y-2">
                  <label className="label">تاریخ ایجاد</label>
                  <Input value={formatDateTime(selected.CreatedOnUtc)} readOnly />
                </div>
              </>
            )}
          </div>
          <div className="drawer-footer">
            <Button variant="outline" className="flex-1" onClick={backupDrawer.close}>بستن</Button>
            {selected?.Status === BackupStatus.Completed && (
              <Button className="flex-1" disabled={actionId === selected.Id} onClick={() => void handleDownload(selected)}>
                دانلود
              </Button>
            )}
          </div>
        </div>
      </Drawer>

      <Dialog open={deleteDialog.isOpen} onClose={deleteDialog.close} className="sm:max-w-lg">
        <div className="dialog-header">
          <div>
            <p className="dialog-title">حذف پشتیبان</p>
            <p className="dialog-description">آیا مطمئن هستید که می‌خواهید این پشتیبان را حذف کنید؟</p>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={deleteDialog.close}>
            <Icon name="material-symbols:close" className="size-5" />
          </Button>
        </div>
        <div className="dialog-body">
          {selected && (
            <div className="bg-muted/10 rounded-xl border p-3">
              <p className="text-sm font-semibold">{selected.FileName}</p>
              <p className="text-muted-foreground text-xs">{formatDateTime(selected.CreatedOnUtc)}</p>
            </div>
          )}
        </div>
        <div className="dialog-footer">
          <Button variant="outline" onClick={deleteDialog.close}>انصراف</Button>
          <Button variant="destructive" disabled={actionId === selected?.Id} onClick={() => void handleDelete()}>حذف</Button>
        </div>
      </Dialog>

      <Dialog open={createDialog.isOpen} onClose={createDialog.close} className="sm:max-w-lg">
        <div className="dialog-header">
          <div>
            <p className="dialog-title">ایجاد پشتیبان جدید</p>
            <p className="dialog-description">پشتیبان‌گیری از داده‌ها</p>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={createDialog.close}>
            <Icon name="material-symbols:close" className="size-5" />
          </Button>
        </div>
        <div className="dialog-body space-y-4">
          <div className="space-y-2">
            <label className="label">نوع پشتیبان</label>
            <Select value={backupType} onChange={(e) => setBackupType(e.target.value)}>
              {Object.entries(BACKUP_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Select>
          </div>
        </div>
        <div className="dialog-footer">
          <Button variant="outline" onClick={createDialog.close}>انصراف</Button>
          <Button variant="default" disabled={isCreating} onClick={() => void handleCreateBackup()}>
            {isCreating ? 'در حال ایجاد...' : 'شروع پشتیبان‌گیری'}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
