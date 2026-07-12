import { ReactNode, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { useTheme } from '@/hooks';
import { quickAccessActions, quickAccessPages } from '@/data/navigation';
import { cn } from '@/lib/utils';
import styles from './Dialog.module.css';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  id?: string;
}

export function Dialog({ open, onClose, children, className, id }: DialogProps) {
  if (!open) return null;

  return (
    <div id={id} data-dialog data-state="open" className={cn('dialog', styles.dialogOpen)}>
      <div data-dialog-overlay className="dialog-overlay" onClick={onClose} role="presentation" />
      <div className={cn('dialog-content', className)}>{children}</div>
    </div>
  );
}

interface QuickAccessDialogProps {
  open: boolean;
  onClose: () => void;
}

export function QuickAccessDialog({ open, onClose }: QuickAccessDialogProps) {
  const [query, setQuery] = useState('');
  const { toggleTheme } = useTheme();

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const filterText = (text: string) =>
    !query || text.toLowerCase().includes(query.toLowerCase());

  const filteredActions = useMemo(
    () => quickAccessActions.filter((a) => filterText(a.label) || filterText(a.description)),
    [query],
  );

  const filteredPages = useMemo(
    () => quickAccessPages.filter((p) => filterText(p.label)),
    [query],
  );

  return (
    <Dialog
      id="quick-access-dialog"
      open={open}
      onClose={onClose}
      className="top-[20%]! max-w-xl translate-y-0! overflow-hidden p-0"
    >
      <div className="flex items-center gap-3 border-b px-4 py-3">
        <Icon name="material-symbols:search" className="text-muted-foreground size-5" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجو در منوها، صفحات و دستورات..."
          className="placeholder:text-muted-foreground flex-1 border-0 bg-transparent text-sm shadow-none outline-none"
          autoComplete="off"
          autoFocus
        />
        <Button variant="ghost" size="icon-sm" className="p-1" onClick={onClose}>
          <Icon name="material-symbols:close" className="size-4" />
        </Button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        <div className="border-b p-2">
          <p className="text-muted-foreground px-2 py-1.5 text-xs font-medium">دسترسی سریع</p>
          <div className="space-y-0.5">
            {filteredActions.map((action) => (
              <Link
                key={action.path}
                to={action.path}
                className="quick-access-item hover:bg-accent flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-colors"
                onClick={onClose}
              >
                <div className={cn('flex size-8 items-center justify-center rounded-lg', action.bg)}>
                  <Icon name={action.icon} className={cn('size-4', action.color)} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{action.label}</p>
                  <p className="text-muted-foreground text-xs">{action.description}</p>
                </div>
                <span className="kbd-group">
                  {action.shortcut.map((k, i) => (
                    <span key={k}>
                      {i > 0 && <span className="text-[10px]">+</span>}
                      <kbd className="kbd">{k}</kbd>
                    </span>
                  ))}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="border-b p-2">
          <p className="text-muted-foreground px-2 py-1.5 text-xs font-medium">صفحات</p>
          <div className="space-y-0.5">
            {filteredPages.map((page) => (
              <Link
                key={page.path}
                to={page.path}
                className="quick-access-item hover:bg-accent flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors"
                onClick={onClose}
              >
                <Icon name={page.icon} className="text-muted-foreground size-4" />
                <span className="text-sm">{page.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="p-2">
          <p className="text-muted-foreground px-2 py-1.5 text-xs font-medium">دستورات</p>
          <div className="space-y-0.5">
            <button
              type="button"
              className="quick-access-item hover:bg-accent flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-start transition-colors"
              onClick={() => {
                toggleTheme();
                onClose();
              }}
            >
              <Icon name="material-symbols:dark-mode" className="text-muted-foreground size-4" />
              <span className="text-sm">تغییر تم (روشن/تاریک)</span>
              <span className="kbd-group mr-auto">
                <kbd className="kbd">Alt</kbd>
                <span className="text-[10px]">+</span>
                <kbd className="kbd">T</kbd>
              </span>
            </button>
            <Link
              to="/login"
              className="quick-access-item hover:bg-accent text-destructive flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors"
              onClick={onClose}
            >
              <Icon name="material-symbols:logout" className="size-4" />
              <span className="text-sm">خروج از حساب</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-muted/30 text-muted-foreground flex items-center justify-between border-t px-4 py-2.5 text-xs">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="kbd-group">
              <kbd className="kbd">↑</kbd>
              <kbd className="kbd">↓</kbd>
            </span>
            <span>پیمایش</span>
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="kbd">Enter</kbd>
            <span>انتخاب</span>
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="kbd">Esc</kbd>
            <span>بستن</span>
          </span>
        </div>
      </div>
    </Dialog>
  );
}

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  id: string;
}

export function Drawer({ open, onClose, children, id }: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div
        className="drawer-backdrop fixed inset-0 z-40 bg-black/50 opacity-100"
        onClick={onClose}
        role="presentation"
      />
      <aside id={id} data-state="open" className="sidebar drawer-right z-50 translate-x-0">
        {children}
      </aside>
    </>
  );
}
