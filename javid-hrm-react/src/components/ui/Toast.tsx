import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';
import styles from './Toast.module.css';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  title?: string;
  variant: ToastVariant;
}

const VARIANT_CONFIG: Record<
  ToastVariant,
  { icon: string; defaultTitle: string }
> = {
  success: {
    icon: 'material-symbols:check-circle-rounded',
    defaultTitle: 'موفق',
  },
  error: {
    icon: 'material-symbols:error-rounded',
    defaultTitle: 'خطا',
  },
  warning: {
    icon: 'material-symbols:warning-rounded',
    defaultTitle: 'هشدار',
  },
  info: {
    icon: 'material-symbols:info-rounded',
    defaultTitle: 'اطلاع',
  },
};

interface ToastProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

function Toast({ toast, onDismiss }: ToastProps) {
  const [isLeaving, setIsLeaving] = useState(false);
  const config = VARIANT_CONFIG[toast.variant];

  const handleDismiss = () => {
    setIsLeaving(true);
    window.setTimeout(() => onDismiss(toast.id), 220);
  };

  return (
    <div
      className={cn(styles.toast, styles[toast.variant], isLeaving && styles.toastLeaving)}
      role="status"
      aria-live="polite"
    >
      <div className={styles.iconWrap}>
        <Icon name={config.icon} className="size-5" />
      </div>
      <div className={styles.content}>
        <div className={styles.title}>{toast.title ?? config.defaultTitle}</div>
        <div className={styles.message}>{toast.message}</div>
      </div>
      <button type="button" className={styles.close} onClick={handleDismiss} aria-label="بستن">
        <Icon name="material-symbols:close" className="size-4" />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  useEffect(() => {
    if (toasts.length === 0) return;
    const latest = toasts[toasts.length - 1];
    if (!latest) return;
    // Keep screen readers focused on the newest toast.
    document.getElementById(`toast-${latest.id}`)?.focus();
  }, [toasts]);

  if (toasts.length === 0) return null;

  return (
    <div className={styles.container} dir="rtl">
      {toasts.map((toast) => (
        <div key={toast.id} id={`toast-${toast.id}`} tabIndex={-1}>
          <Toast toast={toast} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
}
