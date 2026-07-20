import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { PersianDateTimeField } from '@/components/ui/PersianDateTimeField';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Drawer } from '@/components/layout/Dialog';
import { useDrawer } from '@/hooks';
import { cn } from '@/lib/utils';
import { CALENDAR_EVENT_TYPE_LABELS } from '@/lib/hrLabels';
import {
  addPersianMonths,
  buildPersianMonthGrid,
  endOfPersianMonth,
  formatPersianMonthLabel,
  getPersianParts,
  persianToDate,
  startOfPersianMonth,
  todayPersian,
} from '@/lib/persianCalendar';
import {
  combineGregorianDateAndTimeToIso,
  isoToGregorianDateString,
  isoToTimeString,
  persianToGregorianDateString,
} from '@/lib/persianDateTime';
import {
  createCalendarEvent,
  deleteCalendarEvent,
  getAllCalendarEvents,
  getApiErrorMessage,
  updateCalendarEvent,
  type CalendarEventDto,
  CalendarEventType,
} from '@/services/api';

const weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
}

interface FormState {
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  isAllDay: boolean;
  eventType: number;
}

const emptyForm = (): FormState => ({
  title: '',
  description: '',
  startDate: '',
  startTime: '09:00',
  endDate: '',
  endTime: '10:00',
  isAllDay: false,
  eventType: CalendarEventType.Meeting,
});

function eventTypeColor(type: number) {
  if (type === CalendarEventType.Meeting) return 'bg-sky-500';
  if (type === CalendarEventType.Holiday) return 'bg-amber-500';
  if (type === CalendarEventType.Leave) return 'bg-emerald-500';
  if (type === CalendarEventType.Personal) return 'bg-primary';
  return 'bg-violet-500';
}

function eventTypeBadge(type: number) {
  if (type === CalendarEventType.Meeting) return 'info' as const;
  if (type === CalendarEventType.Holiday) return 'alert' as const;
  if (type === CalendarEventType.Leave) return 'success' as const;
  return 'default' as const;
}

export default function CalendarPage() {
  const eventDrawer = useDrawer();
  const initialToday = todayPersian();
  const [viewYear, setViewYear] = useState(initialToday.year);
  const [viewMonth, setViewMonth] = useState(initialToday.month);
  const [selectedDay, setSelectedDay] = useState(initialToday.day);
  const [events, setEvents] = useState<CalendarEventDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editing, setEditing] = useState<CalendarEventDto | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const monthLabel = useMemo(
    () => formatPersianMonthLabel(viewYear, viewMonth),
    [viewYear, viewMonth],
  );
  const calendarDays = useMemo(
    () => buildPersianMonthGrid(viewYear, viewMonth),
    [viewYear, viewMonth],
  );
  const today = todayPersian();

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getAllCalendarEvents({
        StartFromUtc: startOfPersianMonth(viewYear, viewMonth).toISOString(),
        EndToUtc: endOfPersianMonth(viewYear, viewMonth).toISOString(),
        Pagination: { PageNumber: 1, PageSize: 500 },
      });
      setEvents(result.Items ?? []);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [viewMonth, viewYear]);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  const eventsByDay = useMemo(() => {
    const map = new Map<number, CalendarEventDto[]>();
    for (const event of events) {
      const parts = getPersianParts(new Date(event.StartAtUtc));
      if (parts.year !== viewYear || parts.month !== viewMonth) continue;
      const list = map.get(parts.day) ?? [];
      list.push(event);
      map.set(parts.day, list);
    }
    return map;
  }, [events, viewMonth, viewYear]);

  const selectedDateEvents = useMemo(() => {
    return events
      .filter((event) => {
        const parts = getPersianParts(new Date(event.StartAtUtc));
        return parts.year === viewYear && parts.month === viewMonth && parts.day === selectedDay;
      })
      .sort((a, b) => new Date(a.StartAtUtc).getTime() - new Date(b.StartAtUtc).getTime());
  }, [events, selectedDay, viewMonth, viewYear]);

  const todayEvents = useMemo(() => {
    const now = todayPersian();
    if (now.year !== viewYear || now.month !== viewMonth) return [];
    return eventsByDay.get(now.day) ?? [];
  }, [eventsByDay, viewMonth, viewYear]);

  function goPrevMonth() {
    const next = addPersianMonths(viewYear, viewMonth, -1);
    setViewYear(next.year);
    setViewMonth(next.month);
    setSelectedDay(1);
  }

  function goNextMonth() {
    const next = addPersianMonths(viewYear, viewMonth, 1);
    setViewYear(next.year);
    setViewMonth(next.month);
    setSelectedDay(1);
  }

  function goToday() {
    const now = todayPersian();
    setViewYear(now.year);
    setViewMonth(now.month);
    setSelectedDay(now.day);
  }

  function openCreate() {
    setEditing(null);
    const dateValue = persianToGregorianDateString({ year: viewYear, month: viewMonth, day: selectedDay });
    setForm({
      ...emptyForm(),
      startDate: dateValue,
      endDate: dateValue,
      startTime: '09:00',
      endTime: '10:00',
    });
    setFormError('');
    eventDrawer.open();
  }

  function openEdit(event: CalendarEventDto) {
    setEditing(event);
    setForm({
      title: event.Title,
      description: event.Description ?? '',
      startDate: isoToGregorianDateString(event.StartAtUtc),
      startTime: isoToTimeString(event.StartAtUtc) || '09:00',
      endDate: isoToGregorianDateString(event.EndAtUtc),
      endTime: isoToTimeString(event.EndAtUtc) || '10:00',
      isAllDay: event.IsAllDay,
      eventType: event.EventType,
    });
    setFormError('');
    eventDrawer.open();
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError('');
    setIsSubmitting(true);
    try {
      if (!form.title.trim()) throw new Error('عنوان الزامی است');
      if (!form.startDate || !form.endDate) throw new Error('تاریخ شروع و پایان الزامی است');
      const payload = {
        Title: form.title.trim(),
        Description: form.description.trim() || null,
        StartAtUtc: combineGregorianDateAndTimeToIso(
          form.startDate,
          form.isAllDay ? '00:00' : form.startTime,
        ),
        EndAtUtc: combineGregorianDateAndTimeToIso(
          form.endDate,
          form.isAllDay ? '23:59' : form.endTime,
        ),
        IsAllDay: form.isAllDay,
        EventType: form.eventType,
      };
      if (editing) {
        await updateCalendarEvent({ Id: editing.Id, ...payload });
      } else {
        await createCalendarEvent(payload);
      }
      eventDrawer.close();
      await loadEvents();
    } catch (err) {
      setFormError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!editing) return;
    if (!window.confirm('آیا از حذف این رویداد مطمئن هستید؟')) return;
    setIsSubmitting(true);
    try {
      await deleteCalendarEvent(editing.Id);
      eventDrawer.close();
      await loadEvents();
    } catch (err) {
      setFormError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex-1 p-4 lg:p-6" dir="rtl">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">تقویم</h1>
            <p className="text-muted-foreground">ترکیب نمای ماهانه + برنامه روز برای مدیریت رویدادها</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={goToday}>
              <Icon name="material-symbols:today" className="size-4" />
              امروز
            </Button>
            <Button variant="secondary" onClick={openCreate}>
              <Icon name="material-symbols:add" className="size-4" />
              رویداد جدید
            </Button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="space-y-6 lg:col-span-4">
            <div className="bg-card overflow-hidden rounded-2xl border">
              <div className="border-b p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{monthLabel}</p>
                    <p className="text-muted-foreground text-xs">نمای فشرده ماه</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon-sm" onClick={goPrevMonth}>
                      <Icon name="material-symbols:chevron-right" className="size-5" />
                    </Button>
                    <Button variant="outline" size="icon-sm" onClick={goNextMonth}>
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
                      <button key={`empty-${i}`} type="button" className="bg-muted/20 text-muted-foreground aspect-square rounded-xl border text-sm" disabled />
                    ) : (
                      <button
                        key={`${viewYear}-${viewMonth}-${day}`}
                        type="button"
                        onClick={() => setSelectedDay(day)}
                        className={cn(
                          'relative aspect-square rounded-xl border text-sm',
                          day === selectedDay ? 'bg-primary/10 border-primary/30 font-semibold' : 'bg-card hover:bg-muted/30',
                          day === today.day && viewYear === today.year && viewMonth === today.month
                            ? 'ring-primary/40 ring-2'
                            : '',
                        )}
                      >
                        {day.toLocaleString('fa-IR')}
                        {(eventsByDay.get(day) ?? []).slice(0, 1).map((ev) => (
                          <span key={ev.Id} className={cn('absolute bottom-2 left-2 size-1.5 rounded-full', eventTypeColor(ev.EventType))} />
                        ))}
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
                <Badge>{todayEvents.length.toLocaleString('fa-IR')} رویداد</Badge>
              </div>
              <div className="mt-4 space-y-3">
                {todayEvents.length === 0 ? (
                  <p className="text-muted-foreground text-sm">رویدادی برای امروز ثبت نشده</p>
                ) : (
                  todayEvents.map((event) => (
                    <button key={event.Id} type="button" className="bg-muted/20 w-full rounded-xl border p-3 text-start" onClick={() => openEdit(event)}>
                      <p className="text-sm font-medium">{event.Title}</p>
                      <p className="text-muted-foreground mt-1 text-xs">
                        {event.IsAllDay ? 'تمام روز' : `${formatTime(event.StartAtUtc)} – ${formatTime(event.EndAtUtc)}`}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </div>
          </section>

          <section className="lg:col-span-8">
            <div className="bg-card overflow-hidden rounded-2xl border">
              <div className="border-b p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">
                      برنامه روز: {selectedDay.toLocaleString('fa-IR')} {monthLabel}
                    </p>
                    <p className="text-muted-foreground text-sm">نمای زمان‌بندی شده (Agenda)</p>
                  </div>
                  <Button variant="default" size="sm" onClick={openCreate}>
                    <Icon name="material-symbols:add" className="size-4" />
                    افزودن
                  </Button>
                </div>
              </div>
              <div className="p-4">
                {loading ? (
                  <p className="text-muted-foreground py-8 text-center text-sm">در حال بارگذاری...</p>
                ) : selectedDateEvents.length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center text-sm">رویدادی برای این روز ثبت نشده</p>
                ) : (
                  <div className="space-y-3">
                    {selectedDateEvents.map((item) => (
                      <button
                        key={item.Id}
                        type="button"
                        onClick={() => openEdit(item)}
                        className="bg-primary/10 hover:bg-primary/15 w-full rounded-2xl border p-4 text-start transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold">{item.Title}</p>
                            <p className="text-muted-foreground mt-1 text-xs">
                              {item.IsAllDay
                                ? 'تمام روز'
                                : `${formatTime(item.StartAtUtc)} – ${formatTime(item.EndAtUtc)}`}
                              {item.Description ? ` • ${item.Description}` : ''}
                            </p>
                          </div>
                          <Badge variant={eventTypeBadge(item.EventType)}>
                            {CALENDAR_EVENT_TYPE_LABELS[item.EventType]}
                          </Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      <Drawer open={eventDrawer.isOpen} onClose={eventDrawer.close} id="calendar-event-drawer">
        <form className="flex h-full flex-col" onSubmit={(e) => void handleSubmit(e)}>
          <div className="drawer-header">
            <div>
              <p className="font-semibold">{editing ? 'ویرایش رویداد' : 'رویداد جدید'}</p>
              <p className="text-muted-foreground text-xs">ایجاد/ویرایش رویداد</p>
            </div>
            <Button type="button" variant="ghost" size="icon-sm" onClick={eventDrawer.close}>
              <Icon name="material-symbols:close" className="size-5" />
            </Button>
          </div>
          <div className="drawer-content flex-1 space-y-4">
            {formError && <p className="text-destructive text-sm">{formError}</p>}
            <div className="space-y-2">
              <label className="label">عنوان</label>
              <Input placeholder="مثلاً: جلسه تیم" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <PersianDateTimeField
                dateLabel="تاریخ شروع"
                timeLabel="ساعت شروع"
                dateValue={form.startDate}
                timeValue={form.startTime}
                onDateChange={(value) => setForm({ ...form, startDate: value })}
                onTimeChange={(value) => setForm({ ...form, startTime: value })}
                showTime={!form.isAllDay}
                required
              />
              <PersianDateTimeField
                dateLabel="تاریخ پایان"
                timeLabel="ساعت پایان"
                dateValue={form.endDate}
                timeValue={form.endTime}
                onDateChange={(value) => setForm({ ...form, endDate: value })}
                onTimeChange={(value) => setForm({ ...form, endTime: value })}
                showTime={!form.isAllDay}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="label">نوع رویداد</label>
              <Select value={String(form.eventType)} onChange={(e) => setForm({ ...form, eventType: Number(e.target.value) })}>
                {Object.entries(CALENDAR_EVENT_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="all-day" checked={form.isAllDay} onChange={(e) => setForm({ ...form, isAllDay: e.target.checked })} />
              <label htmlFor="all-day" className="text-sm">تمام روز</label>
            </div>
            <div className="space-y-2">
              <label className="label">یادداشت</label>
              <Textarea placeholder="در صورت نیاز..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
          <div className="drawer-footer">
            {editing && (
              <Button type="button" variant="destructive" className="flex-1" disabled={isSubmitting} onClick={() => void handleDelete()}>
                حذف
              </Button>
            )}
            <Button type="button" variant="outline" className="flex-1" onClick={eventDrawer.close}>انصراف</Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>{isSubmitting ? 'در حال ذخیره...' : 'ذخیره'}</Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
