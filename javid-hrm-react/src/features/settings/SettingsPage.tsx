import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { Dialog } from '@/components/layout/Dialog';
import { useDisclosure, useSidebar, useTheme } from '@/hooks';
import { cn } from '@/lib/utils';

const colorThemes = [
  'default', 'violet', 'indigo', 'fuchsia', 'pink', 'sky', 'cyan',
  'emerald', 'orange', 'red', 'yellow', 'lime', 'amber',
];

const colorLabels: Record<string, string> = {
  default: 'پیش‌فرض', violet: 'بنفش', indigo: 'نیلی', fuchsia: 'سرخابی',
  pink: 'صورتی', sky: 'آسمانی', cyan: 'فیروزه‌ای', emerald: 'زمردی',
  orange: 'نارنجی', red: 'قرمز', yellow: 'زرد', lime: 'لیمویی', amber: 'کهربایی',
};

const themeLabels: Record<string, string> = {
  system: 'سیستم', dark: 'تاریک', light: 'روشن',
};

function Switch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      className="switch"
      data-state={checked ? 'checked' : 'unchecked'}
      onClick={onChange}
    >
      <span className="switch-thumb" />
    </button>
  );
}

export default function SettingsPage() {
  const { theme, colorTheme, setTheme, setColorTheme } = useTheme();
  const { hideSidebar, expandSidebar } = useSidebar();
  const deleteDialog = useDisclosure();
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [smsNotif, setSmsNotif] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <div className="flex-1 p-4 lg:p-6" dir="rtl">
      <div className="mx-auto mb-8 max-w-5xl">
        <h1 className="text-2xl font-bold">تنظیمات</h1>
        <p className="text-muted-foreground">شخصی‌سازی پنل مدیریت</p>
      </div>

      <div className="mx-auto max-w-5xl space-y-6">
        <Card>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="p-6 lg:p-8">
              <div className="space-y-1">
                <p className="flex items-center gap-2 text-lg font-semibold">
                  <Icon name="material-symbols:palette" className="text-primary size-5" />
                  رنگ
                </p>
                <p className="text-muted-foreground text-sm">شخصی‌سازی رنگ‌های وبسایت</p>
              </div>
            </div>
            <div className="border-t p-6 lg:col-span-2 lg:border-s lg:border-t-0 lg:p-8">
              <div className="mb-8">
                <div className="mb-4 space-y-1">
                  <p className="font-medium">پس‌زمینه</p>
                  <p className="text-muted-foreground text-sm">{themeLabels[theme]}</p>
                </div>
                <div className="flex gap-1">
                  {(['system', 'dark', 'light'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTheme(t)}
                      className={cn(
                        'hover:bg-accent flex size-10 cursor-pointer items-center justify-center rounded-lg transition-all duration-200 ease-in-out',
                        theme === t && 'bg-accent',
                      )}
                    >
                      <Icon
                        name={
                          t === 'system'
                            ? 'material-symbols:computer'
                            : t === 'dark'
                              ? 'material-symbols:dark-mode'
                              : 'material-symbols:light-mode'
                        }
                        className="size-5"
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-4 space-y-1">
                  <p className="font-medium">رنگ سایت</p>
                  <p className="text-muted-foreground text-sm">{colorLabels[colorTheme]}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {colorThemes.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColorTheme(c)}
                      className={cn(`theme-${c} hover:bg-primary/10 flex size-10 items-center justify-center rounded-lg transition-all duration-300`)}
                    >
                      <div className="border-primary flex size-5 items-center justify-center rounded-full border-2">
                        {colorTheme === c && <span className="bg-primary size-2 rounded-full" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="max-lg:hidden">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="p-6 lg:p-8">
              <div className="space-y-1">
                <p className="flex items-center gap-2 text-lg font-semibold">
                  <Icon name="material-symbols:view-sidebar" className="text-primary size-5" />
                  نوار کناری
                </p>
                <p className="text-muted-foreground text-sm">تنظیمات نوار کناری</p>
              </div>
            </div>
            <div className="border-t p-6 lg:col-span-2 lg:border-s lg:border-t-0 lg:p-8">
              <div className="mb-4 space-y-1">
                <p className="font-medium">حالت نمایش</p>
                <p className="text-muted-foreground text-sm">انتخاب حالت نمایش نوار کناری</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={expandSidebar}>
                  <Icon name="flowbite:close-sidebar-solid" className="size-5" />
                  باز
                </Button>
                <Button variant="outline" onClick={hideSidebar}>
                  <Icon name="flowbite:open-sidebar-solid" className="size-5" />
                  مخفی
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card id="account">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="p-6 lg:p-8">
              <div className="space-y-1">
                <p className="flex items-center gap-2 text-lg font-semibold">
                  <Icon name="material-symbols:person" className="text-primary size-5" />
                  حساب کاربری
                </p>
                <p className="text-muted-foreground text-sm">مدیریت اطلاعات حساب</p>
              </div>
            </div>
            <div className="border-t p-6 lg:col-span-2 lg:border-s lg:border-t-0 lg:p-8">
              <div className="mb-6 flex flex-wrap items-center gap-4">
                <div className="avatar size-16">
                  <div className="avatar-fallback bg-primary text-primary-foreground text-xl">م</div>
                </div>
                <div>
                  <p className="font-medium">مدیر سیستم</p>
                  <p className="text-muted-foreground text-sm">admin@example.com</p>
                </div>
                <Button variant="outline" size="sm" className="ms-auto">
                  <Icon name="material-symbols:edit" className="size-4" />
                  تغییر تصویر
                </Button>
              </div>
              <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="label">نام</label>
                  <Input type="text" defaultValue="مدیر" />
                </div>
                <div className="space-y-2">
                  <label className="label">نام خانوادگی</label>
                  <Input type="text" defaultValue="سیستم" />
                </div>
                <div className="space-y-2">
                  <label className="label">ایمیل</label>
                  <Input type="email" defaultValue="admin@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="label">شماره تماس</label>
                  <Input type="tel" defaultValue="09121234567" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button>ذخیره تغییرات</Button>
                <Button variant="outline">انصراف</Button>
              </div>
            </div>
          </div>
        </Card>

        <Card id="notifications">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="p-6 lg:p-8">
              <div className="space-y-1">
                <p className="flex items-center gap-2 text-lg font-semibold">
                  <Icon name="material-symbols:notifications" className="text-primary size-5" />
                  اعلان‌ها
                </p>
                <p className="text-muted-foreground text-sm">تنظیمات اعلان‌رسانی</p>
              </div>
            </div>
            <div className="space-y-4 border-t p-6 lg:col-span-2 lg:border-s lg:border-t-0 lg:p-8">
              {[
                { label: 'اعلان ایمیل', desc: 'دریافت اعلان‌ها از طریق ایمیل', checked: emailNotif, set: setEmailNotif },
                { label: 'اعلان پوش', desc: 'دریافت اعلان‌های پوش در مرورگر', checked: pushNotif, set: setPushNotif },
                { label: 'اعلان پیامک', desc: 'دریافت پیامک برای اعلان‌های مهم', checked: smsNotif, set: setSmsNotif },
              ].map((item, i) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-muted-foreground text-sm">{item.desc}</p>
                    </div>
                    <Switch checked={item.checked} onChange={() => item.set(!item.checked)} />
                  </div>
                  {i < 2 && <div className="separator-horizontal" />}
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card id="security">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="p-6 lg:p-8">
              <div className="space-y-1">
                <p className="flex items-center gap-2 text-lg font-semibold">
                  <Icon name="material-symbols:security" className="text-primary size-5" />
                  امنیت
                </p>
                <p className="text-muted-foreground text-sm">تنظیمات امنیتی حساب</p>
              </div>
            </div>
            <div className="space-y-6 border-t p-6 lg:col-span-2 lg:border-s lg:border-t-0 lg:p-8">
              <div className="space-y-4">
                <h3 className="font-medium">تغییر رمز عبور</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="label">رمز عبور فعلی</label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div />
                  <div className="space-y-2">
                    <label className="label">رمز عبور جدید</label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <label className="label">تکرار رمز عبور جدید</label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                </div>
                <Button>تغییر رمز عبور</Button>
              </div>
              <div className="separator-horizontal" />
              <div className="space-y-4">
                <h3 className="font-medium">احراز هویت دو مرحله‌ای</h3>
                <p className="text-muted-foreground text-sm">
                  با فعال کردن این گزینه، امنیت حساب کاربری شما افزایش می‌یابد.
                </p>
                <div className="flex items-center gap-4">
                  <Switch checked={twoFactor} onChange={() => setTwoFactor(!twoFactor)} />
                  <span className="text-sm">فعال‌سازی احراز هویت دو مرحله‌ای</span>
                </div>
              </div>
              <div className="separator-horizontal" />
              <div className="space-y-4">
                <h3 className="text-destructive font-medium">حذف حساب کاربری</h3>
                <p className="text-muted-foreground text-sm">
                  با حذف حساب کاربری، تمام اطلاعات شما به صورت دائمی پاک خواهد شد.
                </p>
                <Button variant="destructive" onClick={deleteDialog.open}>
                  <Icon name="material-symbols:delete-forever" className="size-5" />
                  حذف حساب کاربری
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Dialog open={deleteDialog.isOpen} onClose={deleteDialog.close} className="max-w-md">
        <button type="button" className="dialog-close" onClick={deleteDialog.close}>
          <Icon name="material-symbols:close" className="size-4" />
        </button>
        <div className="dialog-header">
          <div className="bg-destructive/10 mx-auto mb-4 flex size-12 items-center justify-center rounded-full sm:mx-0">
            <Icon name="material-symbols:warning" className="text-destructive size-6" />
          </div>
          <h3 className="dialog-title">حذف حساب کاربری</h3>
          <p className="dialog-description">
            آیا مطمئن هستید که می‌خواهید حساب کاربری خود را حذف کنید؟ این عملیات قابل بازگشت نیست.
          </p>
        </div>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="label">برای تأیید، رمز عبور خود را وارد کنید</label>
            <Input type="password" placeholder="رمز عبور" />
          </div>
        </div>
        <div className="dialog-footer">
          <Button variant="outline" onClick={deleteDialog.close}>انصراف</Button>
          <Button variant="destructive">بله، حساب را حذف کن</Button>
        </div>
      </Dialog>
    </div>
  );
}
