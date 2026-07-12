import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/Icon';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('card', className)} {...props} />;
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('card-header', className)} {...props} />;
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('card-title', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('card-description', className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('card-content', className)} {...props} />;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: string;
  iconColor?: string;
  iconBg?: string;
  label: string;
  value: string;
  subValue?: string;
  subColor?: string;
}

export function StatCard({
  icon,
  iconColor = 'text-blue-500',
  iconBg = '#3b82f615',
  label,
  value,
  subValue,
  subColor = 'text-blue-600',
}: StatCardProps) {
  return (
    <div className="bg-card hover:bg-accent/50 group cursor-pointer rounded-xl border p-4 transition-colors">
      <div
        className="mb-3 flex size-10 items-center justify-center rounded-lg"
        style={{ backgroundColor: iconBg }}
      >
        <Icon name={icon} className={cn('size-5', iconColor)} />
      </div>
      <p className="mb-0.5 text-sm font-medium">{label}</p>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold">{value}</span>
        {subValue && <span className={cn('text-xs', subColor)}>{subValue}</span>}
      </div>
    </div>
  );
}

interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  iconClassName?: string;
}

export function MetricCard({ icon, label, value, iconClassName }: MetricCardProps) {
  return (
    <div className="card">
      <div className="card-content flex items-center gap-3">
        <div
          className={cn(
            'flex size-10 items-center justify-center rounded-lg',
            iconClassName,
          )}
        >
          {icon}
        </div>
        <div>
          <p className="text-muted-foreground text-xs">{label}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}

interface ProgressBarProps {
  value: number;
  colorClass?: string;
  height?: 'sm' | 'md';
}

export function ProgressBar({ value, colorClass = 'bg-blue-500', height = 'sm' }: ProgressBarProps) {
  return (
    <div className={cn('bg-muted w-full rounded-full', height === 'sm' ? 'h-2' : 'h-3')}>
      <div
        className={cn('rounded-full', colorClass, height === 'sm' ? 'h-2' : 'h-3')}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

interface AvatarProps {
  initials: string;
  gradient?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Avatar({ initials, gradient = 'from-blue-500 to-blue-600', size = 'md' }: AvatarProps) {
  const sizeClass =
    size === 'sm' ? 'size-8 text-xs' : size === 'lg' ? 'size-12 text-sm' : 'size-10 text-sm';
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-gradient-to-br font-bold text-white',
        gradient,
        sizeClass,
      )}
    >
      {initials}
    </div>
  );
}
