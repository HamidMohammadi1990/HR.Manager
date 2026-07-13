import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Drawer } from '@/components/layout/Dialog';
import { useDrawer } from '@/hooks';
import { cn } from '@/lib/utils';
import { CALENDAR_EVENT_TYPE_LABELS } from '@/lib/hrLabels';
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

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

function buildMonthGrid(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0).getDate();
  const startWeekday = (firstDay.getDay() + 1) % 7;
  const cells: (number | null)[] = [];
  for (let i = 0; i < startWeekday; i += 1) cells.push(null);
  for (let d = 1; d <= lastDate; d += 1) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
}

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

interface FormState {
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  isAllDay: boolean;
  eventType: number;
}

const emptyForm = (): FormState => ({
  title: '',
  description: '',
  startAt: '',
  endAt: '',
  isAllDay: false,
  eventType: CalendarEventType.Meeting,
});

export default function CalendarPage() {
  const eventDrawer = useDrawer();
  const today = new Date();
  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [events, setEvents] = useState<CalendarEventDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editing, setEditing] = useState<CalendarEventDto | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthLabel = viewDate.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long' });
  const calendarDays = useMemo(() => buildMonthGrid(year, month), [year, month]);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getAllCalendarEvents({
        StartFromUtc: startOfMonth(viewDate).toISOString(),
        EndToUtc: endOfMonth(viewDate).toISOString(),
        Pagination: { PageNumber: 1, PageSize: 500 },
      });
      setEvents(result.Items ?? []);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [viewDate]);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  const eventsByDay = useMemo(() => {
    const map = new Map<number, CalendarEventDto[]>();
    for (const event of events) {
      const day = new Date(event.StartAtUtc).getDate();
      if (new Date(event.StartAtUtc).getMonth() !== month || new Date(event.StartAtUtc).getFullYear() !== year) continue;
      const list = map.get(day) ?? [];
      list.push(event);
      map.set(day, list);
    }
    return map;
  }, [events, month, year]);

  const selectedDateEvents = useMemo(() => {
    const selected = new Date(year, month, selectedDay);
    return events
      .filter((e) => {
        const d = new Date(e.StartAtUtc);
        return d.getFullYear() === selected.getFullYear() && d.getMonth() === selected.getMonth() && d.getDate() === selected.getDate();
      })
      .sort((a, b) => new Date(a.StartAtUtc).getTime() - new Date(b.StartAtUtc).getTime());
  }, [events, month, selectedDay, year]);

  const todayEvents = useMemo(() => {
    const now = new Date();
    if (now.getMonth() !== month || now.getFullYear() !== year) return [];
    return eventsByDay.get(now.getDate()) ?? [];
  }, [eventsByDay, month, year]);

  function goPrevMonth() {
    setViewDate(new Date(year, month - 1, 1));
    setSelectedDay(1);
  }

  function goNextMonth() {
    setViewDate(new Date(year, month + 1, 1));
    setSelectedDay(1);
  }

  function goToday() {
    const now = new Date();
    setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDay(now.getDate());
  }

  function openCreate() {
    setEditing(null);
    const base = new Date(year, month, selectedDay, 9, 0);
    const end = new Date(year, month, selectedDay, 10, 0);
    setForm({
      ...emptyForm(),
      startAt: base.toISOString().slice(0, 16),
      endAt: end.toISOString().slice(0, 16),
    });
    setFormError('');
    eventDrawer.open();
  }

  function openEdit(event: CalendarEventDto) {
    setEditing(event);
    setForm({
      title: event.Title,
      description: event.Description ?? '',
      startAt: event.StartAtUtc.slice(0, 16),
      endAt: event.EndAtUtc.slice(0, 16),
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
      if (!form.startAt || !form.endAt) throw new Error('زمان شروع و پایان الزامی است');
      const payload = {
        Title: form.title.trim(),
        Description: form.description.trim() || null,
        StartAtUtc: new Date(form.startAt).toISOString(),
        EndAtUtc: new Date(form.endAt).toISOString(),
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
                        key={`${month}-${day}`}
                        type="button"
                        onClick={() => setSelectedDay(day)}
                        className={cn(
                          'relative aspect-square rounded-xl border text-sm',
                          day === selectedDay ? 'bg-primary/10 border-primary/30 font-semibold' : 'bg-card hover:bg-muted/30',
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="label">شروع</label>
                <Input type="datetime-local" value={form.startAt} onChange={(e) => setForm({ ...form, startAt: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <label className="label">پایان</label>
                <Input type="datetime-local" value={form.endAt} onChange={(e) => setForm({ ...form, endAt: e.target.value })} required />
              </div>
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
