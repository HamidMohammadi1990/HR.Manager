import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('bg-muted/70 animate-pulse rounded-md', className)}
      aria-hidden
      {...props}
    />
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="card">
      <div className="card-content flex items-center gap-3">
        <Skeleton className="size-10 shrink-0 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    </div>
  );
}

interface ChartCardSkeletonProps {
  titleWidth?: string;
  descriptionWidth?: string;
  height?: string;
}

export function ChartCardSkeleton({
  titleWidth = 'w-28',
  descriptionWidth = 'w-40',
  height = 'h-[200px]',
}: ChartCardSkeletonProps) {
  return (
    <div className="card">
      <div className="card-header space-y-2">
        <Skeleton className={cn('h-5', titleWidth)} />
        <Skeleton className={cn('h-3', descriptionWidth)} />
      </div>
      <div className="card-content">
        <Skeleton className={cn('w-full rounded-xl', height)} />
      </div>
    </div>
  );
}

export function TableCardSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="card-content space-y-3">
        <div className="flex gap-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-16" />
        </div>
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export function ActivityListSkeleton({ items = 4 }: { items?: number }) {
  return (
    <div className="card">
      <div className="card-header">
        <Skeleton className="h-5 w-32" />
      </div>
      <div className="card-content space-y-4">
        {Array.from({ length: items }).map((_, index) => (
          <div key={index} className="flex gap-3">
            <Skeleton className="size-8 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full max-w-xs" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function QuickActionsSkeleton({ items = 4 }: { items?: number }) {
  return (
    <div className="card">
      <div className="card-header">
        <Skeleton className="h-5 w-28" />
      </div>
      <div className="card-content">
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: items }).map((_, index) => (
            <Skeleton key={index} className="min-h-24 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
