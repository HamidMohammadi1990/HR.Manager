import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';

interface DashboardNoAccessStateProps {
  displayName: string;
}

const helpfulLinks = [
  {
    label: 'پروفایل کاربری',
    description: 'مشاهده و ویرایش اطلاعات حساب',
    path: '/profile',
    icon: 'material-symbols:account-circle',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
  },
  {
    label: 'تنظیمات',
    description: 'تنظیمات حساب و اعلان‌ها',
    path: '/settings',
    icon: 'material-symbols:settings',
    iconBg: 'bg-sky-500/10',
    iconColor: 'text-sky-500',
  },
  {
    label: 'راهنما و پشتیبانی',
    description: 'سوالات متداول و تماس با پشتیبانی',
    path: '/help',
    icon: 'material-symbols:support-agent',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-500',
  },
] as const;

export function DashboardNoAccessState({ displayName }: DashboardNoAccessStateProps) {
  return (
    <div className="space-y-6">
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center px-6 py-12 text-center sm:py-16">
          <div className="bg-muted mb-5 flex size-16 items-center justify-center rounded-2xl">
            <Icon name="material-symbols:lock-person" className="text-muted-foreground size-8" />
          </div>
          <h2 className="mb-2 text-xl font-bold">سلام {displayName}</h2>
          <p className="text-muted-foreground mb-1 max-w-md text-sm leading-7">
            ورود شما موفق بود، اما در حال حاضر به بخش‌های داشبورد منابع انسانی دسترسی ندارید.
          </p>
          <p className="text-muted-foreground mb-6 max-w-md text-sm leading-7">
            برای مشاهده آمار، گزارش‌ها و اقدامات سریع، از مدیر سیستم درخواست تخصیص نقش یا دسترسی کنید.
          </p>
          <Link
            to="/help"
            className={cn('button inline-flex items-center gap-2')}
            {...({ variant: 'outline' } as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          >
            <Icon name="material-symbols:help-outline" className="size-4" />
            راهنمای دریافت دسترسی
          </Link>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">بخش‌های در دسترس شما</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {helpfulLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="card hover:bg-muted/40 flex items-start gap-3 p-4 transition-colors"
            >
              <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${link.iconBg}`}>
                <Icon name={link.icon} className={`size-5 ${link.iconColor}`} />
              </div>
              <div className="text-start">
                <p className="text-sm font-medium">{link.label}</p>
                <p className="text-muted-foreground mt-0.5 text-xs leading-5">{link.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
