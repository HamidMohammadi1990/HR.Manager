import type { AnchorHTMLAttributes } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent, PageHeader } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';

export default function AccessDeniedPage() {
  const location = useLocation();
  const fromPath = (location.state as { from?: string } | null)?.from;

  return (
    <div className="flex-1 p-4 lg:p-6">
      <PageHeader title="دسترسی مجاز نیست" description="شما اجازه مشاهده این صفحه را ندارید" />

      <Card className="max-w-xl border-dashed">
        <CardContent className="flex flex-col items-center px-6 py-12 text-center">
          <div className="bg-destructive/10 mb-5 flex size-16 items-center justify-center rounded-2xl">
            <Icon name="material-symbols:block" className="text-destructive size-8" />
          </div>
          <h2 className="mb-2 text-lg font-bold">دسترسی به این بخش محدود است</h2>
          <p className="text-muted-foreground mb-2 text-sm leading-7">
            نقش فعلی شما اجازه ورود به این صفحه را ندارد.
          </p>
          {fromPath && (
            <p className="text-muted-foreground mb-6 text-xs" dir="ltr">
              {fromPath}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className={cn('button inline-flex items-center gap-2')}
            >
              <Icon name="material-symbols:space-dashboard" className="size-4" />
              بازگشت به داشبورد
            </Link>
            <Link
              to="/help"
              className={cn('button inline-flex items-center gap-2')}
              {...({ variant: 'outline' } as AnchorHTMLAttributes<HTMLAnchorElement>)}
            >
              <Icon name="material-symbols:help-outline" className="size-4" />
              راهنما
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
