import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Dialog } from '@/components/layout/Dialog';
import { useDisclosure } from '@/hooks';
import { cn } from '@/lib/utils';

type TabId = 'p1' | 'p2' | 'p3';

const tabs: { id: TabId; label: string }[] = [
  { id: 'p1', label: 'نمای کلی' },
  { id: 'p2', label: 'امنیت' },
  { id: 'p3', label: 'ترجیحات' },
];

const activityLog = [
  { icon: 'material-symbols:login', color: 'text-primary', bg: 'bg-primary/10', title: 'ورود موفق', detail: 'IP: 192.168.1.10 • امروز، ۱۰:۴۵' },
  { icon: 'material-symbols:settings', color: 'text-emerald-700', bg: 'bg-emerald-500/10', title: 'بهروزرسانی تنظیمات', detail: 'تغییرات در اعلانها • دیروز' },
  { icon: 'material-symbols:warning', color: 'text-amber-700', bg: 'bg-amber-500/10', title: 'تلاش ورود ناموفق', detail: '۳ بار • ۳ روز پیش' },
];

function Switch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button type="button" className="switch" data-state={checked ? 'checked' : 'unchecked'} onClick={onChange}>
      <span className="switch-thumb" />
    </button>
  );
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabId>('p1');
  const editDialog = useDisclosure();
  const [twoFa, setTwoFa] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [showHelp, setShowHelp] = useState(true);

  return (
    <div className="flex-1 p-4 lg:p-6" dir="rtl">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">پروفایل</h1>
            <p className="text-muted-foreground">مرکز کنترل هویت، امنیت و تنظیمات شخصی</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Icon name="material-symbols:arrow-back" className="size-4" />
              بازگشت
            </Button>
            <Button variant="secondary" onClick={editDialog.open}>
              <Icon name="material-symbols:edit" className="size-4" />
              ویرایش
            </Button>
            <Button variant="default">
              <Icon name="material-symbols:save" className="size-4" />
              ذخیره
            </Button>
          </div>
        </div>

        <section className="bg-card overflow-hidden rounded-2xl border">
          <div className="relative">
            <div className="from-primary/15 via-background h-28 bg-linear-to-br to-emerald-500/15 sm:h-32" />
            <div className="pointer-events-none absolute inset-0">
              <div className="bg-primary/10 absolute -end-8 -top-8 size-40 rounded-full blur-2xl" />
              <div className="absolute -start-10 -bottom-10 size-40 rounded-full bg-emerald-500/10 blur-2xl" />
            </div>
            <div className="-mt-10 p-4 sm:-mt-12 sm:p-5">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex items-end gap-4">
                  <div className="bg-card ring-background flex size-20 items-center justify-center rounded-2xl border shadow-xs ring-4 sm:size-24">
                    <Icon name="material-symbols:person" className="text-primary size-10" />
                  </div>
                  <div className="pb-1">
                    <p className="text-xl font-bold">مدیر سیستم</p>
                    <p className="text-muted-foreground text-sm">admin@example.com</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="success">فعال</Badge>
                      <Badge variant="secondary">سطح: ادمین</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pb-2">
                  <Button variant="outline" size="sm">
                    <Icon name="material-symbols:public" className="size-4" />
                    نمایش عمومی
                  </Button>
                  <Button variant="default" size="sm" onClick={editDialog.open}>
                    <Icon name="material-symbols:tune" className="size-4" />
                    تنظیمات سریع
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-card rounded-2xl border p-4 sm:p-5">
          <div className="tabs-list mb-5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className="tab-trigger"
                data-state={activeTab === tab.id ? 'active' : 'inactive'}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'p1' && (
            <div className="tab-content">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-5">
                  <div className="bg-muted/20 rounded-2xl border p-4">
                    <p className="font-semibold">اطلاعات سریع</p>
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">شماره تماس</span>
                        <span className="text-sm font-medium">۰۹۱۲۰۰۰۰۰۰۰</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">واحد</span>
                        <span className="text-sm font-medium">مدیریت</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">آخرین ورود</span>
                        <span className="text-sm font-medium">امروز، ۱۰:۴۵</span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <Button variant="secondary" size="sm" onClick={editDialog.open}>ویرایش اطلاعات</Button>
                      <Button variant="outline" size="sm">گزارش فعالیت</Button>
                    </div>
                  </div>
                  <div className="bg-card rounded-2xl border p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">نوار وضعیت</p>
                      <Badge variant="destructive">۲ هشدار</Badge>
                    </div>
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <Icon name="material-symbols:vpn-key" className="text-primary size-5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">کلیدهای API</p>
                          <p className="text-muted-foreground text-xs">آخرین استفاده: ۲ روز پیش</p>
                        </div>
                        <Button variant="outline" size="sm">مشاهده</Button>
                      </div>
                      <div className="flex items-center gap-3">
                        <Icon name="material-symbols:lock" className="size-5 text-emerald-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">ورود دومرحلهای</p>
                          <p className="text-muted-foreground text-xs">فعال</p>
                        </div>
                        <Link to="/two-factor" className="button" data-variant="outline" data-size="sm">مدیریت</Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-7">
                  <div className="bg-card rounded-2xl border p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">رد فعالیت</p>
                      <span className="text-muted-foreground text-xs">آخرین ۷ روز</span>
                    </div>
                    <div className="mt-4 space-y-3">
                      {activityLog.map((item) => (
                        <div key={item.title} className="flex items-start gap-3">
                          <div className={cn('flex size-9 items-center justify-center rounded-xl', item.bg)}>
                            <Icon name={item.icon} className={cn('size-5', item.color)} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{item.title}</p>
                            <p className="text-muted-foreground mt-1 text-xs">{item.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'p2' && (
            <div className="tab-content">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-7">
                  <div className="bg-card rounded-2xl border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">رمز عبور</p>
                        <p className="text-muted-foreground text-xs">بهتر است هر چند وقت یکبار تغییر کند</p>
                      </div>
                      <Link to="/reset-password" className="button" data-variant="outline" data-size="sm">تغییر</Link>
                    </div>
                    <div className="bg-muted/20 mt-4 rounded-xl border p-3">
                      <p className="text-sm">آخرین تغییر: ۲ ماه پیش</p>
                    </div>
                  </div>
                  <div className="bg-card rounded-2xl border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">ورود دومرحلهای</p>
                        <p className="text-muted-foreground text-xs">پیشنهاد میشود فعال بماند</p>
                      </div>
                      <Switch checked={twoFa} onChange={() => setTwoFa(!twoFa)} />
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <Link to="/two-factor" className="button" data-variant="secondary" data-size="sm">مدیریت ۲FA</Link>
                      <Button variant="outline" size="sm">پشتیبانگیری کدها</Button>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-5">
                  <div className="bg-muted/20 rounded-2xl border p-4">
                    <div className="flex items-center gap-2">
                      <Icon name="material-symbols:shield" className="size-5 text-emerald-700" />
                      <p className="font-semibold">وضعیت امنیت</p>
                    </div>
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">۲FA</span>
                        <span className="text-sm font-medium text-emerald-700">فعال</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">جلسات فعال</span>
                        <span className="text-sm font-medium">۲</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">ریسک</span>
                        <span className="text-sm font-medium text-amber-700">متوسط</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button variant="destructive" className="w-full">خروج از همه دستگاهها</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'p3' && (
            <div className="tab-content">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-6">
                  <div className="bg-card rounded-2xl border p-4">
                    <p className="font-semibold">اعلانها</p>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">اعلان ایمیل</p>
                          <p className="text-muted-foreground text-xs">دریافت گزارشها</p>
                        </div>
                        <Switch checked={emailNotif} onChange={() => setEmailNotif(!emailNotif)} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">اعلان پوش</p>
                          <p className="text-muted-foreground text-xs">هشدارهای فوری</p>
                        </div>
                        <Switch checked={pushNotif} onChange={() => setPushNotif(!pushNotif)} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-6">
                  <div className="bg-muted/20 rounded-2xl border p-4">
                    <div className="flex items-center gap-2">
                      <Icon name="material-symbols:palette" className="text-primary size-5" />
                      <p className="font-semibold">نمایش</p>
                    </div>
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">حالت فشرده</span>
                        <Switch checked={compactMode} onChange={() => setCompactMode(!compactMode)} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">نمایش راهنما</span>
                        <Switch checked={showHelp} onChange={() => setShowHelp(!showHelp)} />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Link to="/settings" className="button w-full" data-variant="outline">تنظیمات کامل</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        <Dialog open={editDialog.isOpen} onClose={editDialog.close}>
          <button type="button" className="dialog-close" onClick={editDialog.close}>
            <Icon name="material-symbols:close" className="size-4" />
          </button>
          <div className="dialog-header">
            <h3 className="dialog-title">ویرایش پروفایل</h3>
            <p className="dialog-description">فقط فیلدهای ضروری را تغییر دهید.</p>
          </div>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="label">نام نمایشی</label>
                <Input defaultValue="مدیر سیستم" />
              </div>
              <div className="space-y-2">
                <label className="label">ایمیل</label>
                <Input defaultValue="admin@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="label">بیو</label>
              <Textarea placeholder="یک توضیح کوتاه..." />
            </div>
          </div>
          <div className="dialog-footer">
            <Button variant="outline" onClick={editDialog.close}>انصراف</Button>
            <Button>ذخیره تغییرات</Button>
          </div>
        </Dialog>
      </div>
    </div>
  );
}
