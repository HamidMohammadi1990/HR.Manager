import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, StatCard } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';

function AccessDots({ count, color }: { count: number; color: string }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={cn('size-2 rounded-full', i < count ? color : 'bg-muted')}
        />
      ))}
    </div>
  );
}

function MatrixDots({ count, color }: { count: number; color: string }) {
  return (
    <div className="flex items-center justify-center gap-1">
      {Array.from({ length: 4 }).map((_, i) => (
        <span
          key={i}
          className={cn('size-3 rounded-full', i < count ? color : 'bg-muted')}
        />
      ))}
    </div>
  );
}

const managementRoles = [
  { name: 'مدیر کل', users: '۱ کاربر', desc: 'دسترسی کامل به تمام بخش‌ها', border: 'border-red-500/20 bg-red-500/5', dotColor: 'bg-red-500', dots: 5, badge: 'destructive' as const },
  { name: 'مدیر مالی', users: '۳ کاربر', desc: 'مدیریت امور مالی و حسابداری', border: 'border-orange-500/20 bg-orange-500/5', dotColor: 'bg-orange-500', dots: 3, badge: 'destructive' as const },
  { name: 'مدیر محتوا', users: '۵ کاربر', desc: 'مدیریت محتوا و انتشارات', border: 'border-blue-500/20 bg-blue-500/5', dotColor: 'bg-blue-500', dots: 2, badge: 'info' as const },
];

const operationalRoles = [
  { name: 'اپراتور', users: '۱۲ کاربر', desc: 'عملیات روزانه و پشتیبانی', border: 'border-emerald-500/20 bg-emerald-500/5', dotColor: 'bg-emerald-500', dots: 1, badge: 'success' as const },
  { name: 'بازرس', users: '۴ کاربر', desc: 'بررسی و نظارت کیفیت', border: 'border-violet-500/20 bg-violet-500/5', dotColor: 'bg-violet-500', dots: 2, badge: 'violet' as const },
  { name: 'ناظر', users: '۸ کاربر', desc: 'دسترسی فقط خواندنی', border: 'border-gray-500/20 bg-gray-500/5', dotColor: 'bg-gray-500', dots: 1, badge: 'secondary' as const },
];

const matrixRows = [
  { section: 'داشبورد مدیریت', levels: [4, 3, 2, 1, 1] },
  { section: 'مدیریت مالی', levels: [4, 4, 0, 0, 1] },
  { section: 'مدیریت محتوا', levels: [4, 0, 4, 2, 1] },
  { section: 'مدیریت کاربران', levels: [4, 2, 0, 1, 1] },
];

const matrixColors = ['bg-red-500', 'bg-orange-500', 'bg-blue-500', 'bg-emerald-500', 'bg-gray-500'];
const matrixColumns = ['مدیر کل', 'مدیر مالی', 'مدیر محتوا', 'اپراتور', 'ناظر'];

const auditLog = [
  { icon: 'material-symbols:add', color: 'text-emerald-500', bg: 'bg-emerald-500/10', title: 'دسترسی مدیر محتوا به علی محمدی', time: '۲ ساعت پیش توسط مدیر کل' },
  { icon: 'material-symbols:remove', color: 'text-red-500', bg: 'bg-red-500/10', title: 'حذف دسترسی ناظر از سارا احمدی', time: '۴ ساعت پیش توسط مدیر مالی' },
  { icon: 'material-symbols:edit', color: 'text-blue-500', bg: 'bg-blue-500/10', title: 'تغییر نقش به اپراتور برای رضا کریمی', time: '۱ روز پیش توسط مدیر محتوا' },
];

const advancedSettings = [
  { icon: 'material-symbols:timer', title: 'زمان‌بندی دسترسی', desc: 'دسترسی محدود به ساعات کاری' },
  { icon: 'material-symbols:location-on', title: 'محدودیت مکانی', desc: 'دسترسی فقط از شبکه داخلی' },
  { icon: 'material-symbols:devices', title: 'دسترسی دستگاهی', desc: 'محدودیت به دستگاه‌های ثبت شده' },
  { icon: 'material-symbols:approval', title: 'تایید دو مرحله‌ای', desc: 'تایید عملیات حساس' },
];

export default function PermissionsPage() {
  return (
    <div className="flex-1 p-4 lg:p-6" dir="rtl">
      <div className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">مدیریت دسترسی‌ها</h1>
            <p className="text-muted-foreground">کنترل سطوح دسترسی و نقش‌های کاربری</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Icon name="material-symbols:history" className="size-4" />
              گزارش تغییرات
            </Button>
            <Button variant="default">
              <Icon name="material-symbols:add" className="size-4" />
              نقش جدید
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard icon="material-symbols:group" iconColor="text-blue-500" label="کل نقش‌ها" value="۱۲" subValue="+۲" />
          <StatCard icon="material-symbols:person" iconColor="text-emerald-500" iconBg="#10b98115" label="کاربران فعال" value="۲۴۷" subValue="۹۵%" subColor="text-emerald-600" />
          <StatCard icon="material-symbols:security" iconColor="text-amber-500" iconBg="#f59e0b15" label="دسترسی‌های محدود" value="۸" subValue="۳۲%" subColor="text-amber-600" />
          <StatCard icon="material-symbols:block" iconColor="text-red-500" iconBg="#ef444415" label="دسترسی‌های مسدود" value="۳" subValue="-۵۰%" subColor="text-red-600" />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-4 xl:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="material-symbols:admin-panel-settings" className="size-5 text-red-500" />
                  نقش‌های مدیریتی
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {managementRoles.map((role) => (
                    <div key={role.name} className={cn('rounded-lg border p-3', role.border)}>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium">{role.name}</span>
                        <Badge variant={role.badge} className="text-xs">{role.users}</Badge>
                      </div>
                      <p className="text-muted-foreground text-xs">{role.desc}</p>
                      <div className="mt-2">
                        <AccessDots count={role.dots} color={role.dotColor} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="material-symbols:work" className="size-5 text-emerald-500" />
                  نقش‌های عملیاتی
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {operationalRoles.map((role) => (
                    <div key={role.name} className={cn('rounded-lg border p-3', role.border)}>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium">{role.name}</span>
                        <Badge variant={role.badge} className="text-xs">{role.users}</Badge>
                      </div>
                      <p className="text-muted-foreground text-xs">{role.desc}</p>
                      <div className="mt-2">
                        <AccessDots count={role.dots} color={role.dotColor} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="xl:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="material-symbols:grid-view" className="size-5 text-indigo-500" />
                  ماتریس دسترسی‌ها
                </CardTitle>
                <CardDescription>کنترل دسترسی‌های هر نقش به بخش‌های مختلف سیستم</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-muted-foreground p-3 text-start text-xs font-medium">بخش سیستم</th>
                        {matrixColumns.map((col) => (
                          <th key={col} className="text-muted-foreground p-3 text-center text-xs font-medium">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {matrixRows.map((row) => (
                        <tr key={row.section} className="hover:bg-muted/30 border-b transition-colors">
                          <td className="p-3 font-medium">{row.section}</td>
                          {row.levels.map((level, i) => (
                            <td key={i} className="p-3 text-center">
                              <MatrixDots count={level} color={matrixColors[i]} />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="text-muted-foreground mt-4 flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="size-3 rounded-full bg-red-500" />
                    <span>ایجاد/ویرایش/حذف</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="bg-muted size-3 rounded-full" />
                    <span>بدون دسترسی</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="material-symbols:batch-prediction" className="size-5 text-violet-500" />
                عملیات گروهی
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="checkbox" />
                  <span className="text-sm">انتخاب همه کاربران</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">
                    <Icon name="material-symbols:person-add" className="size-4" />
                    افزودن به نقش
                  </Button>
                  <Button variant="outline" size="sm">
                    <Icon name="material-symbols:person-remove" className="size-4" />
                    حذف از نقش
                  </Button>
                  <Button variant="outline" size="sm">
                    <Icon name="material-symbols:lock" className="size-4" />
                    قفل دسترسی
                  </Button>
                  <Button variant="outline" size="sm">
                    <Icon name="material-symbols:lock-open" className="size-4" />
                    باز کردن دسترسی
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="material-symbols:visibility" className="size-5 text-amber-500" />
                گزارش تغییرات دسترسی
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditLog.map((item) => (
                  <div key={item.title} className="hover:bg-muted/30 flex items-center gap-3 rounded-lg p-2 transition-colors">
                    <div className={cn('flex size-8 items-center justify-center rounded-full', item.bg)}>
                      <Icon name={item.icon} className={cn('size-4', item.color)} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-muted-foreground text-xs">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="material-symbols:tune" className="size-5 text-indigo-500" />
              تنظیمات پیشرفته دسترسی
            </CardTitle>
            <CardDescription>کنترل‌های پیشرفته برای امنیت و انطباق</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {advancedSettings.map((item) => (
                <div
                  key={item.title}
                  className="cursor-pointer rounded-lg border border-dashed p-4 transition-colors hover:border-indigo-500/50"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <Icon name={item.icon} className="size-5 text-indigo-500" />
                    <span className="text-sm font-medium">{item.title}</span>
                  </div>
                  <p className="text-muted-foreground text-xs">{item.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
