import { NotificationType, type NotificationTypeValue } from '@/services/api/types';

export function formatRelativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'همین الان';
  if (minutes < 60) return `${minutes.toLocaleString('fa-IR')} دقیقه پیش`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours.toLocaleString('fa-IR')} ساعت پیش`;
  const days = Math.floor(hours / 24);
  return `${days.toLocaleString('fa-IR')} روز پیش`;
}

export function startOfLocalDay(date = new Date()) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function startOfLocalWeek(date = new Date()) {
  const copy = startOfLocalDay(date);
  const day = copy.getDay();
  const diff = day === 6 ? 0 : day + 1;
  copy.setDate(copy.getDate() - diff);
  return copy;
}

const NOTIFICATION_STYLES: Record<
  NotificationTypeValue,
  { icon: string; iconColor: string; bg: string; border: string; dot: string }
> = {
  [NotificationType.Info]: {
    icon: 'material-symbols:info',
    iconColor: 'text-sky-500',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20 bg-sky-500/5',
    dot: 'bg-sky-500',
  },
  [NotificationType.Success]: {
    icon: 'material-symbols:check-circle',
    iconColor: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20 bg-emerald-500/5',
    dot: 'bg-emerald-500',
  },
  [NotificationType.Warning]: {
    icon: 'material-symbols:warning',
    iconColor: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20 bg-amber-500/5',
    dot: 'bg-amber-500',
  },
  [NotificationType.Error]: {
    icon: 'material-symbols:error',
    iconColor: 'text-destructive',
    bg: 'bg-destructive/10',
    border: 'border-destructive/20 bg-destructive/5',
    dot: 'bg-destructive',
  },
  [NotificationType.Leave]: {
    icon: 'material-symbols:beach-access',
    iconColor: 'text-violet-500',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20 bg-violet-500/5',
    dot: 'bg-violet-500',
  },
  [NotificationType.Payroll]: {
    icon: 'fluent:payment-48-regular',
    iconColor: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20 bg-primary/5',
    dot: 'bg-primary',
  },
  [NotificationType.Attendance]: {
    icon: 'material-symbols:schedule',
    iconColor: 'text-orange-500',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20 bg-orange-500/5',
    dot: 'bg-orange-500',
  },
  [NotificationType.System]: {
    icon: 'material-symbols:settings',
    iconColor: 'text-muted-foreground',
    bg: 'bg-muted',
    border: 'border-border bg-muted/50',
    dot: 'bg-muted-foreground',
  },
};

export function getNotificationStyle(type: NotificationTypeValue, iconName?: string | null) {
  const style = NOTIFICATION_STYLES[type] ?? NOTIFICATION_STYLES[NotificationType.Info];
  return iconName ? { ...style, icon: iconName } : style;
}
