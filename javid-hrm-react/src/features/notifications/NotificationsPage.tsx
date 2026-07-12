import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';

type Filter = 'all' | 'unread' | 'today' | 'week';

const notifications = [
  { title: 'سفارش جدید #1256', desc: 'علی محمدی - 2,500,000 تومان', time: '5 دقیقه پیش', icon: 'material-symbols:shopping-cart', iconColor: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20 bg-primary/5', dot: 'bg-primary', unread: true },
  { title: 'کاربر جدید ثبت نام کرد', desc: 'سارا احمدی', time: '10 دقیقه پیش', icon: 'material-symbols:person-add', iconColor: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20 bg-emerald-500/5', dot: 'bg-emerald-500', unread: true },
  { title: 'موجودی کم', desc: '5 محصول نیاز به تأمین دارند', time: '30 دقیقه پیش', icon: 'material-symbols:inventory-2', iconColor: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20 bg-amber-500/5', dot: 'bg-amber-500', unread: true },
  { title: 'سفارش #1255 ارسال شد', desc: 'محمود رضایی - ارسال توسط پست', time: '2 ساعت پیش', icon: 'material-symbols:local-shipping', iconColor: 'text-muted-foreground', bg: 'bg-muted', border: '', dot: '', unread: false },
  { title: 'پرداخت موفق', desc: 'سفارش #1254 - 1,800,000 تومان', time: '4 ساعت پیش', icon: 'fluent:payment-48-regular', iconColor: 'text-muted-foreground', bg: 'bg-muted', border: '', dot: '', unread: false },
  { title: 'نظر جدید', desc: 'محصول لپ تاپ ایسوس - امتیاز 5 ستاره', time: '6 ساعت پیش', icon: 'material-symbols:reviews', iconColor: 'text-muted-foreground', bg: 'bg-muted', border: '', dot: '', unread: false },
  { title: 'هشدار امنیتی', desc: 'تلاش ناموفق برای ورود به حساب', time: '1 روز پیش', icon: 'material-symbols:warning', iconColor: 'text-muted-foreground', bg: 'bg-muted', border: '', dot: '', unread: false },
  { title: 'کمپین تبلیغاتی', desc: 'کمپین تابستانه با 20% تخفیف فعال شد', time: '2 روز پیش', icon: 'material-symbols:campaign', iconColor: 'text-muted-foreground', bg: 'bg-muted', border: '', dot: '', unread: false },
];

const filters: { id: Filter; label: string; icon?: string }[] = [
  { id: 'all', label: 'همه' },
  { id: 'unread', label: 'خوانده نشده', icon: 'material-symbols:notifications' },
  { id: 'today', label: 'امروز' },
  { id: 'week', label: 'این هفته' },
];

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>('all');

  return (
    <div className="flex-1 p-4 lg:p-6" dir="rtl">
      <div className="mb-6 flex flex-wrap items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">اعلان‌ها</h1>
          <p className="text-muted-foreground">مدیریت اعلان‌های سیستم</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">12 خوانده نشده</Badge>
          <Button variant="outline">
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
            onClick={() => setActiveFilter(f.id)}
          >
            {f.icon && <Icon name={f.icon} className="size-4" />}
            {f.label}
          </Button>
        ))}
        <div className="bg-border mx-2 h-6 w-px" />
        <Button variant="ghost" className="text-destructive hover:bg-destructive/10">
          <Icon name="material-symbols:delete-sweep" className="size-4" />
          پاک کردن خوانده شده‌ها
        </Button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <Card
            key={n.title}
            className={cn(n.unread && n.border, !n.unread && 'opacity-75')}
          >
            <CardContent className="flex gap-4">
              <div className={cn('flex size-12 shrink-0 items-center justify-center rounded-full', n.bg)}>
                <Icon name={n.icon} className={cn('size-6', n.iconColor)} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className={cn('text-sm font-semibold', !n.unread && 'text-muted-foreground')}>{n.title}</h3>
                    <p className="text-muted-foreground mt-1 text-sm">{n.desc}</p>
                    <p className="text-muted-foreground mt-2 text-xs">{n.time}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {n.unread && n.dot && <div className={cn('size-2 rounded-full', n.dot)} />}
                    <Button variant="ghost" size="icon-sm" className="p-1">
                      <Icon name={n.unread ? 'material-symbols:done' : 'material-symbols:undo'} className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between">
        <p className="text-muted-foreground text-sm">نمایش 1 تا 10 از 42 اعلان</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            <Icon name="material-symbols:chevron-left" className="size-4 rtl:rotate-180" />
            قبلی
          </Button>
          <div className="flex items-center gap-1">
            <Button variant="default" size="sm">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <span className="px-2">...</span>
            <Button variant="outline" size="sm">5</Button>
          </div>
          <Button variant="outline" size="sm">
            بعدی
            <Icon name="material-symbols:chevron-right" className="size-4 rtl:rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
}
