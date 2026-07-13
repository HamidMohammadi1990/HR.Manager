import { useCallback, useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';
import {
  deleteReadNotifications,
  getAllNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
} from '@/services/api/notifications';
import type { NotificationDto } from '@/services/api/types';
import { formatRelativeTime, getNotificationStyle, startOfLocalDay, startOfLocalWeek } from '@/lib/notifications';

type Filter = 'all' | 'unread' | 'today' | 'week';

const PAGE_SIZE = 10;

const filters: { id: Filter; label: string; icon?: string }[] = [
  { id: 'all', label: 'همه' },
  { id: 'unread', label: 'خوانده نشده', icon: 'material-symbols:notifications' },
  { id: 'today', label: 'امروز' },
  { id: 'week', label: 'این هفته' },
];

function buildDateFilters(filter: Filter) {
  if (filter === 'today') {
    return { CreatedFromUtc: startOfLocalDay().toISOString() };
  }
  if (filter === 'week') {
    return { CreatedFromUtc: startOfLocalWeek().toISOString() };
  }
  return {};
}

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>('all');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<NotificationDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUnreadCount = useCallback(async () => {
    try {
      const count = await getUnreadNotificationCount();
      setUnreadCount(count);
    } catch {
      /* ignore badge errors */
    }
  }, []);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const dateFilters = buildDateFilters(activeFilter);
      const result = await getAllNotifications({
        ...dateFilters,
        IsRead: activeFilter === 'unread' ? false : undefined,
        Pagination: { PageNumber: page, PageSize: PAGE_SIZE },
      });
      setItems(result.Items);
      setTotalCount(result.TotalCount);
      setTotalPages(Math.max(1, result.TotalPages));
      await loadUnreadCount();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در بارگذاری اعلان‌ها');
    } finally {
      setLoading(false);
    }
  }, [activeFilter, loadUnreadCount, page]);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  const handleFilterChange = (filter: Filter) => {
    setActiveFilter(filter);
    setPage(1);
  };

  const handleMarkAllRead = async () => {
    setActionLoading(true);
    try {
      await markAllNotificationsRead();
      await loadNotifications();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در علامت‌گذاری اعلان‌ها');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRead = async () => {
    setActionLoading(true);
    try {
      await deleteReadNotifications();
      await loadNotifications();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در حذف اعلان‌ها');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleRead = async (notification: NotificationDto) => {
    try {
      await markNotificationRead(notification.Id, !notification.IsRead);
      await loadNotifications();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در به‌روزرسانی اعلان');
    }
  };

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + maxVisible - 1);
    start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i += 1) pages.push(i);
    return pages;
  }, [page, totalPages]);

  const rangeStart = totalCount === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, totalCount);

  return (
    <div className="flex-1 p-4 lg:p-6" dir="rtl">
      <div className="mb-6 flex flex-wrap items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">اعلان‌ها</h1>
          <p className="text-muted-foreground">مدیریت اعلان‌های سیستم</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{unreadCount.toLocaleString('fa-IR')} خوانده نشده</Badge>
          <Button variant="outline" disabled={actionLoading || unreadCount === 0} onClick={() => void handleMarkAllRead()}>
            <Icon name="material-symbols:done-all" className="size-4" />
            خواندن همه
          </Button>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        {filters.map((f) => (
          <Button
            key={f.id}
            variant={activeFilter === f.id ? 'default' : 'outline'}
            onClick={() => handleFilterChange(f.id)}
          >
            {f.icon && <Icon name={f.icon} className="size-4" />}
            {f.label}
          </Button>
        ))}
        <div className="bg-border mx-2 h-6 w-px" />
        <Button
          variant="ghost"
          className="text-destructive hover:bg-destructive/10"
          disabled={actionLoading}
          onClick={() => void handleDeleteRead()}
        >
          <Icon name="material-symbols:delete-sweep" className="size-4" />
          پاک کردن خوانده شده‌ها
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive mb-4 rounded-lg border border-destructive/20 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-muted-foreground flex items-center justify-center py-16">
          <Icon name="material-symbols:progress-activity" className="size-6 animate-spin" />
          <span className="me-2">در حال بارگذاری...</span>
        </div>
      ) : items.length === 0 ? (
        <div className="text-muted-foreground py-16 text-center">
          <Icon name="material-symbols:notifications-off" className="mx-auto mb-3 size-12 opacity-50" />
          <p>اعلانی یافت نشد</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((n) => {
            const style = getNotificationStyle(n.Type, n.IconName);
            return (
              <Card
                key={n.Id}
                className={cn(n.IsRead ? 'opacity-75' : style.border)}
              >
                <CardContent className="flex gap-4">
                  <div className={cn('flex size-12 shrink-0 items-center justify-center rounded-full', style.bg)}>
                    <Icon name={style.icon} className={cn('size-6', style.iconColor)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className={cn('text-sm font-semibold', n.IsRead && 'text-muted-foreground')}>{n.Title}</h3>
                        <p className="text-muted-foreground mt-1 text-sm">{n.Message}</p>
                        <p className="text-muted-foreground mt-2 text-xs">{formatRelativeTime(n.CreatedOnUtc)}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {!n.IsRead && <div className={cn('size-2 rounded-full', style.dot)} />}
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="p-1"
                          onClick={() => void handleToggleRead(n)}
                          aria-label={n.IsRead ? 'علامت به عنوان خوانده نشده' : 'علامت به عنوان خوانده شده'}
                        >
                          <Icon
                            name={n.IsRead ? 'material-symbols:undo' : 'material-symbols:done'}
                            className="size-4"
                          />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between">
        <p className="text-muted-foreground text-sm">
          نمایش {rangeStart.toLocaleString('fa-IR')} تا {rangeEnd.toLocaleString('fa-IR')} از{' '}
          {totalCount.toLocaleString('fa-IR')} اعلان
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1 || loading} onClick={() => setPage((p) => p - 1)}>
            <Icon name="material-symbols:chevron-left" className="size-4 rtl:rotate-180" />
            قبلی
          </Button>
          <div className="flex items-center gap-1">
            {pageNumbers.map((p) => (
              <Button
                key={p}
                variant={page === p ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPage(p)}
                disabled={loading}
              >
                {p.toLocaleString('fa-IR')}
              </Button>
            ))}
            {totalPages > pageNumbers[pageNumbers.length - 1]! && (
              <>
                <span className="px-2">...</span>
                <Button variant="outline" size="sm" onClick={() => setPage(totalPages)} disabled={loading}>
                  {totalPages.toLocaleString('fa-IR')}
                </Button>
              </>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages || loading}
            onClick={() => setPage((p) => p + 1)}
          >
            بعدی
            <Icon name="material-symbols:chevron-right" className="size-4 rtl:rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
}
