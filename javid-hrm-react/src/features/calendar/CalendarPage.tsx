import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Drawer } from '@/components/layout/Dialog';
import { useDrawer } from '@/hooks';
import { cn } from '@/lib/utils';

const weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

const calendarDays: (number | null)[] = [
  null, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, null, null, null,
];

const todayEvents = [
  { title: 'جلسه هماهنگی', time: '۱۰:۰۰ – ۱۰:۳۰' },
  { title: 'بررسی گزارش فروش', time: '۱۳:۳۰ – ۱۴:۱۵' },
  { title: 'زمان تمرکز', time: '۱۶:۰۰ – ۱۷:۳۰' },
];

const agendaItems = [
  { time: '۰۸:۰۰', type: 'free' as const },
  { time: '۱۰:۰۰', type: 'meeting' as const, title: 'جلسه هماهنگی', detail: '۳۰ دقیقه • اتاق A', badge: 'جلسه', badgeVariant: 'info' as const, bg: 'bg-sky-500/10 hover:bg-sky-500/15' },
  { time: '۱۳:۳۰', type: 'analysis' as const, title: 'بررسی گزارش فروش', detail: '۴۵ دقیقه • داشبورد', badge: 'تحلیل', badgeVariant: 'success' as const, bg: 'bg-emerald-500/10 hover:bg-emerald-500/15' },
  { time: '۱۶:۰۰', type: 'focus' as const, title: 'زمان تمرکز', detail: '۹۰ دقیقه • بدون مزاحمت', badge: 'Focus', badgeVariant: 'default' as const, bg: 'bg-primary/10 hover:bg-primary/15' },
];

const eventMarkers: Record<number, string> = { 5: 'bg-sky-500', 10: 'bg-primary', 18: 'bg-emerald-500' };

export default function CalendarPage() {
  const eventDrawer = useDrawer();
  const [selectedDay, setSelectedDay] = useState(10);

  return (
    <div className="flex-1 p-4 lg:p-6" dir="rtl">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">تقویم</h1>
            <p className="text-muted-foreground">ترکیب نمای ماهانه + برنامهی روز برای مدیریت رویدادها</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Icon name="material-symbols:arrow-back" className="size-4" />
              بازگشت
            </Button>
            <Button variant="secondary" onClick={eventDrawer.open}>
              <Icon name="material-symbols:add" className="size-4" />
              رویداد جدید
            </Button>
            <Button variant="default">
              <Icon name="material-symbols:done-all" className="size-4" />
              ذخیره
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="space-y-6 lg:col-span-4">
            <div className="bg-card overflow-hidden rounded-2xl border">
              <div className="border-b p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">دی ۱۴۰۴</p>
                    <p className="text-muted-foreground text-xs">نمای فشرده ماه</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon-sm">
                      <Icon name="material-symbols:chevron-right" className="size-5" />
                    </Button>
                    <Button variant="outline" size="icon-sm">
                      <Icon name="material-symbols:chevron-left" className="size-5" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="mb-3 grid grid-cols-7 gap-2">
                  {weekDays.map((day) => (
                    <div key={day} className="text-muted-foreground text-center text-[11px] font-medium">{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((day, i) =>
                    day === null ? (
                      <button key={`empty-${i}`} type="button" className="bg-muted/20 text-muted-foreground aspect-square rounded-xl border text-sm" />
                    ) : (
                      <button
                        key={day}
                        type="button"
                        onClick={() => setSelectedDay(day)}
                        className={cn(
                          'relative aspect-square rounded-xl border text-sm',
                          day === selectedDay
                            ? 'bg-primary/10 border-primary/30 font-semibold'
                            : 'bg-card hover:bg-muted/30',
                        )}
                      >
                        {day}
                        {eventMarkers[day] && (
                          <span className={cn('absolute bottom-2 left-2 size-1.5 rounded-full', eventMarkers[day])} />
                        )}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="material-symbols:event" className="text-primary size-5" />
                  <p className="font-semibold">خلاصه امروز</p>
                </div>
                <Badge>۳ رویداد</Badge>
              </div>
              <div className="mt-4 space-y-3">
                {todayEvents.map((event) => (
                  <div key={event.title} className="bg-muted/20 rounded-xl border p-3">
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="text-muted-foreground mt-1 text-xs">{event.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="lg:col-span-8">
            <div className="bg-card overflow-hidden rounded-2xl border">
              <div className="border-b p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">برنامه روز: امروز</p>
                    <p className="text-muted-foreground text-sm">نمای زمانبندی شده (Agenda)</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Icon name="material-symbols:today" className="size-4" />
                      امروز
                    </Button>
                    <Button variant="default" size="sm" onClick={eventDrawer.open}>
                      <Icon name="material-symbols:add" className="size-4" />
                      افزودن
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {agendaItems.map((item) => (
                    <div key={item.time} className="grid grid-cols-12 items-stretch gap-3">
                      <div className="text-muted-foreground col-span-12 pt-1 text-xs sm:col-span-2">{item.time}</div>
                      {item.type === 'free' ? (
                        <div className="bg-muted/20 col-span-12 rounded-2xl border p-4 sm:col-span-10">
                          <p className="text-muted-foreground text-sm">زمان آزاد</p>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={eventDrawer.open}
                          className={cn('col-span-12 rounded-2xl border p-4 text-start transition-colors sm:col-span-10', item.bg)}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold">{item.title}</p>
                              <p className="text-muted-foreground mt-1 text-xs">{item.detail}</p>
                            </div>
                            <Badge variant={item.badgeVariant}>{item.badge}</Badge>
                          </div>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Drawer open={eventDrawer.isOpen} onClose={eventDrawer.close} id="calendar-event-drawer">
        <div className="flex h-full flex-col">
          <div className="drawer-header">
            <div>
              <p className="font-semibold">جزئیات رویداد</p>
              <p className="text-muted-foreground text-xs">ایجاد/ویرایش رویداد با کمترین فیلد</p>
            </div>
            <Button variant="ghost" size="icon-sm" onClick={eventDrawer.close}>
              <Icon name="material-symbols:close" className="size-5" />
            </Button>
          </div>
          <div className="drawer-content flex-1 space-y-4">
            <div className="space-y-2">
              <label className="label">عنوان</label>
              <Input placeholder="مثلاً: جلسه تیم" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="label">شروع</label>
                <Input placeholder="۱۰:۰۰" />
              </div>
              <div className="space-y-2">
                <label className="label">پایان</label>
                <Input placeholder="۱۰:۳۰" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="label">یادداشت</label>
              <Textarea placeholder="در صورت نیاز..." />
            </div>
            <div className="bg-muted/20 rounded-xl border p-3">
              <p className="text-sm font-medium">یادآوری</p>
              <p className="text-muted-foreground mt-1 text-xs">۵ دقیقه قبل از شروع</p>
            </div>
          </div>
          <div className="drawer-footer">
            <Button variant="outline" className="flex-1" onClick={eventDrawer.close}>انصراف</Button>
            <Button className="flex-1">ذخیره</Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
