import { Link, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { Icon } from '@/components/ui/Icon';
import { useTheme } from '@/hooks';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  getAllNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
} from '@/services/api/notifications';
import type { NotificationDto } from '@/services/api/types';
import { formatRelativeTime, getNotificationStyle } from '@/lib/notifications';

interface AppHeaderProps {
  onOpenQuickAccess: () => void;
  onOpenMobileSidebar: () => void;
  showSidebarExpand?: boolean;
  onExpandSidebar?: () => void;
}

export function AppHeader({
  onOpenQuickAccess,
  onOpenMobileSidebar,
  showSidebarExpand,
  onExpandSidebar,
}: AppHeaderProps) {
  const navigate = useNavigate();
  const { toggleTheme } = useTheme();
  const { userName, signOut } = useAuth();
  const [openMenu, setOpenMenu] = useState<'user' | 'notifications' | null>(null);
  const [headerItems, setHeaderItems] = useState<NotificationDto[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadHeaderNotifications = useCallback(async () => {
    try {
      const [count, list] = await Promise.all([
        getUnreadNotificationCount(),
        getAllNotifications({
          Pagination: { PageNumber: 1, PageSize: 5 },
        }),
      ]);
      setUnreadCount(count);
      setHeaderItems(list.Items);
    } catch {
      /* silent for header */
    }
  }, []);

  useEffect(() => {
    void loadHeaderNotifications();
  }, [loadHeaderNotifications]);

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      await loadHeaderNotifications();
    } catch {
      /* silent */
    }
  };

  const handleLogout = async () => {
    setOpenMenu(null);
    await signOut();
    navigate('/login', { replace: true });
  };

  const displayName = userName ?? 'کاربر';
  const displayInitials = displayName.slice(0, 2);

  const handleMenuChange = (menu: 'user' | 'notifications') => (open: boolean) => {
    setOpenMenu(open ? menu : null);
  };

  return (
    <header className="app-header">
      <div className="app-header-content">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onOpenMobileSidebar}
            aria-label="منو"
          >
            <Icon name="material-symbols:menu" className="size-6" />
          </Button>

          {showSidebarExpand && (
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:block"
              onClick={onExpandSidebar}
              aria-label="نمایش نوار کناری"
            >
              <Icon name="material-symbols:right-panel-open" className="size-5" />
            </Button>
          )}

          <button
            type="button"
            onClick={onOpenQuickAccess}
            className="bg-muted/50 hover:bg-muted border-border text-muted-foreground hidden h-9 w-64 items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors sm:flex lg:w-80"
          >
            <Icon name="material-symbols:search" className="size-4" />
            <span className="flex-1 text-start">جستجو یا دسترسی سریع...</span>
            <span className="kbd-group hidden lg:inline-flex">
              <kbd className="kbd">Ctrl</kbd>
              <span className="text-[10px]">+</span>
              <kbd className="kbd">K</kbd>
            </span>
          </button>

          <Button variant="ghost" size="icon" className="sm:hidden" onClick={onOpenQuickAccess}>
            <Icon name="material-symbols:search" className="size-5" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Dropdown
            open={openMenu === 'user'}
            onOpenChange={handleMenuChange('user')}
            contentClassName="w-56"
            trigger={
              <button
                type="button"
                className="hover:bg-accent flex w-full items-center gap-2 rounded-lg p-1.5 transition-colors"
              >
                <div className="avatar ring-primary/20 size-8 ring-2">
                  <div className="avatar-fallback from-primary to-primary/70 text-primary-foreground bg-linear-to-br text-sm font-semibold">
                    {displayInitials}
                  </div>
                </div>
                <div className="hidden text-start sm:block">
                  <p className="text-sm leading-none font-medium">{displayName}</p>
                  <p className="text-muted-foreground text-xs">{userName ?? ''}</p>
                </div>
                <Icon
                  name="material-symbols:keyboard-arrow-down"
                  className="text-muted-foreground hidden size-4 sm:block"
                />
              </button>
            }
          >
            <div className="bg-muted/30 border-b px-3 py-3">
              <p className="text-sm font-semibold">{displayName}</p>
              <p className="text-muted-foreground text-xs">{userName ?? ''}</p>
            </div>
            <div className="p-1">
              <Link
                to="/profile"
                className="dropdown-item py-2"
                onClick={() => setOpenMenu(null)}
              >
                <Icon name="material-symbols:person" className="size-4" />
                <span>پروفایل کاربری</span>
              </Link>
              <Link
                to="/settings"
                className="dropdown-item py-2"
                onClick={() => setOpenMenu(null)}
              >
                <Icon name="material-symbols:settings" className="size-4" />
                <span>تنظیمات</span>
              </Link>
              <a href="#support" className="dropdown-item py-2">
                <Icon name="material-symbols:help" className="size-4" />
                <span>راهنما و پشتیبانی</span>
              </a>
            </div>
            <div className="border-t p-1">
              <button
                type="button"
                className="dropdown-item text-destructive hover:bg-destructive/10 w-full py-2"
                onClick={() => void handleLogout()}
              >
                <Icon name="material-symbols:logout" className="size-4" />
                <span>خروج از حساب</span>
              </button>
            </div>
          </Dropdown>

          <div className="bg-border mx-1 hidden h-6 w-px sm:block" />

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            data-tooltip="تغییر تم"
            data-tooltip-position="bottom"
          >
            <Icon name="material-symbols:light-mode" className="size-5 dark:hidden" />
            <Icon name="material-symbols:dark-mode" className="hidden size-5 dark:block" />
          </Button>

          <Dropdown
            open={openMenu === 'notifications'}
            onOpenChange={(open) => {
              handleMenuChange('notifications')(open);
              if (open) void loadHeaderNotifications();
            }}
            contentClassName="w-80"
            trigger={
              <Button variant="ghost" size="icon" className="relative" type="button">
                <Icon name="material-symbols:notifications" className="size-5" />
                {unreadCount > 0 && (
                  <span className="bg-destructive absolute -start-0.5 -top-0.5 flex size-4.5 animate-pulse items-center justify-center rounded-full text-[10px] font-medium text-white">
                    {unreadCount > 9 ? '۹+' : unreadCount.toLocaleString('fa-IR')}
                  </span>
                )}
              </Button>
            }
          >
            <div className="bg-muted/30 flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-2">
                <Icon name="material-symbols:notifications" className="text-primary size-4" />
                <p className="text-sm font-semibold">اعلان‌ها</p>
              </div>
              <button
                type="button"
                className="text-primary text-xs hover:underline disabled:opacity-50"
                disabled={unreadCount === 0}
                onClick={() => void handleMarkAllRead()}
              >
                خواندن همه
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {headerItems.length === 0 ? (
                <p className="text-muted-foreground px-4 py-6 text-center text-sm">اعلانی وجود ندارد</p>
              ) : (
                headerItems.map((n) => {
                  const style = getNotificationStyle(n.Type, n.IconName);
                  return (
                    <Link
                      key={n.Id}
                      to={n.LinkPath ?? '/notifications'}
                      className="hover:bg-muted/50 border-border/50 flex gap-3 border-b p-3 transition-colors"
                      onClick={() => setOpenMenu(null)}
                    >
                      <div className={cn('flex size-10 shrink-0 items-center justify-center rounded-full', style.bg)}>
                        <Icon name={style.icon} className={cn('size-5', style.iconColor)} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{n.Title}</p>
                        <p className="text-muted-foreground truncate text-xs">{n.Message}</p>
                        <p className="text-muted-foreground mt-1 text-xs">{formatRelativeTime(n.CreatedOnUtc)}</p>
                      </div>
                      {!n.IsRead && <div className="bg-primary mt-2 size-2 shrink-0 rounded-full" />}
                    </Link>
                  );
                })
              )}
            </div>
            <div className="bg-muted/30 border-t px-4 py-3">
              <Link
                to="/notifications"
                className="text-primary flex items-center justify-center gap-1 text-sm hover:underline"
                onClick={() => setOpenMenu(null)}
              >
                <span>مشاهده همه اعلان‌ها</span>
                <Icon name="material-symbols:arrow-forward" className="size-4 rtl:rotate-180" />
              </Link>
            </div>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}
