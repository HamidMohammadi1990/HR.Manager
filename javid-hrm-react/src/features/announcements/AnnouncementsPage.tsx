import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Drawer } from '@/components/layout/Dialog';
import { useDrawer } from '@/hooks';

const announcements = [
  { title: 'یادآوری تمدید اشتراک', status: 'زمانبندیشده', variant: 'destructive' as const, audience: 'کاربران فعال', channel: 'ایمیل + پوش', time: 'فردا ۱۰:۰۰' },
  { title: 'بهروزرسانی نسخه داشبورد', status: 'ارسالشده', variant: 'success' as const, audience: 'همه کاربران', channel: 'پوش', time: 'امروز ۱۴:۳۰' },
  { title: 'تخفیف ویژه نوروز', status: 'پیش‌نویس', variant: 'default' as const, audience: 'VIP', channel: 'ایمیل', time: '-' },
  { title: 'مشکل فنی موقت', status: 'خطا', variant: 'destructive' as const, audience: 'همه کاربران', channel: 'پوش', time: '۲ روز پیش' },
];

const metrics = [
  { label: 'کل اطلاعیه‌ها', value: '۲۵', sub: '+۳ این ماه', icon: 'material-symbols:campaign', iconColor: 'text-primary', subColor: 'text-emerald-600', subIcon: 'material-symbols:arrow-upward' },
  { label: 'ارسالشده', value: '۱۸', sub: '۷ روز اخیر', icon: 'material-symbols:send', iconColor: 'text-emerald-500' },
  { label: 'زمانبندیشده', value: '۴', sub: 'در صف ارسال', icon: 'material-symbols:schedule', iconColor: 'text-amber-500' },
  { label: 'نرخ باز شدن', value: '۷۲%', sub: '+۵% نسبت به ماه قبل', icon: 'material-symbols:visibility', iconColor: 'text-sky-500', subColor: 'text-emerald-600' },
];

export default function AnnouncementsPage() {
  const composeDrawer = useDrawer();
  const previewDrawer = useDrawer();

  return (
    <div className="flex-1 p-4 lg:p-6" dir="rtl">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">اطلاعیه‌ها</h1>
            <p className="text-muted-foreground">مدیریت اطلاعیه‌ها و پیام‌های عمومی</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Icon name="material-symbols:history" className="size-4" />
              آرشیو
            </Button>
            <Button variant="default" onClick={composeDrawer.open}>
              <Icon name="material-symbols:campaign" className="size-4" />
              اطلاعیه جدید
            </Button>
          </div>
        </div>

        <div className="bg-card rounded-2xl border p-4">
          <div className="flex items-center gap-3 max-md:flex-wrap">
            <div className="relative min-w-80 flex-1">
              <Icon name="material-symbols:search" className="text-muted-foreground absolute start-3 top-1/2 size-5 -translate-y-1/2" />
              <Input className="w-full ps-10" placeholder="جستجو اطلاعیه‌ها..." />
            </div>
            <Select>
              <option value="">همه وضعیت‌ها</option>
              <option value="scheduled">زمانبندیشده</option>
              <option value="sent">ارسالشده</option>
              <option value="draft">پیش‌نویس</option>
              <option value="error">خطا</option>
            </Select>
            <div className="flex items-center gap-2">
              <Badge variant="success">۱۸ ارسالشده</Badge>
              <Badge variant="destructive">۴ زمانبندیشده</Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {metrics.map((m) => (
            <Card key={m.label}>
              <CardContent>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">{m.label}</span>
                  <Icon name={m.icon} className={`size-5 ${m.iconColor}`} />
                </div>
                <p className="text-2xl font-bold">{m.value}</p>
                <p className={`mt-1 flex items-center gap-1 text-xs ${m.subColor ?? 'text-muted-foreground'}`}>
                  {m.subIcon && <Icon name={m.subIcon} className="size-3" />}
                  {m.sub}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>لیست اطلاعیه‌ها</CardTitle>
            <CardDescription>مدیریت و ویرایش اطلاعیه‌های ارسال شده و زمانبندیشده</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="table-wrapper">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-head">عنوان</th>
                    <th className="table-head">وضعیت</th>
                    <th className="table-head">مخاطب</th>
                    <th className="table-head">کانال</th>
                    <th className="table-head">زمان ارسال</th>
                    <th className="table-head">عملیات</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {announcements.map((a) => (
                    <tr key={a.title} className="table-row">
                      <td className="table-cell font-medium">{a.title}</td>
                      <td className="table-cell">
                        <Badge variant={a.variant}>{a.status}</Badge>
                      </td>
                      <td className="table-cell">{a.audience}</td>
                      <td className="table-cell">{a.channel}</td>
                      <td className="text-muted-foreground table-cell text-sm">{a.time}</td>
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon-sm" onClick={previewDrawer.open}>
                            <Icon name="material-symbols:visibility" className="size-4" />
                          </Button>
                          <Button variant="ghost" size="icon-sm">
                            <Icon name="material-symbols:edit" className="size-4" />
                          </Button>
                          <Button variant="ghost" size="icon-sm">
                            <Icon name="material-symbols:delete" className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Drawer open={composeDrawer.isOpen} onClose={composeDrawer.close} id="announcement-compose-drawer">
        <div className="flex h-full flex-col">
          <div className="drawer-header">
            <div>
              <p className="font-semibold">ساخت اطلاعیه</p>
              <p className="text-muted-foreground text-xs">متن، مخاطب، زمانبندی</p>
            </div>
            <Button variant="ghost" size="icon-sm" onClick={composeDrawer.close}>
              <Icon name="material-symbols:close" className="size-5" />
            </Button>
          </div>
          <div className="drawer-content flex-1 space-y-4">
            <div className="space-y-2">
              <label className="label">عنوان</label>
              <Input placeholder="مثلاً: بروزرسانی مهم" />
            </div>
            <div className="space-y-2">
              <label className="label">پیام</label>
              <Textarea rows={6} placeholder="متن اطلاعیه..." />
            </div>
            <div className="space-y-2">
              <label className="label">مخاطب</label>
              <Select className="w-full">
                <option>همه کاربران</option>
                <option>کاربران فعال</option>
                <option>VIP</option>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="label">زمان</label>
                <Input placeholder="اکنون / ۱۴۰۴/۰۲/۱۰" />
              </div>
              <div className="space-y-2">
                <label className="label">کانال</label>
                <Input placeholder="پوش / ایمیل" />
              </div>
            </div>
          </div>
          <div className="drawer-footer">
            <Button variant="outline" className="flex-1" onClick={composeDrawer.close}>انصراف</Button>
            <Button className="flex-1">ثبت</Button>
          </div>
        </div>
      </Drawer>

      <Drawer open={previewDrawer.isOpen} onClose={previewDrawer.close} id="announcement-preview-drawer">
        <div className="flex h-full flex-col">
          <div className="drawer-header">
            <div>
              <p className="font-semibold">پیشنمایش اطلاعیه</p>
              <p className="text-muted-foreground text-xs">نمایش نمونه پیام</p>
            </div>
            <Button variant="ghost" size="icon-sm" onClick={previewDrawer.close}>
              <Icon name="material-symbols:close" className="size-5" />
            </Button>
          </div>
          <div className="drawer-content flex-1 space-y-4">
            <div className="bg-muted/15 rounded-2xl border p-4">
              <p className="font-semibold">بهروزرسانی نسخه داشبورد</p>
              <p className="text-muted-foreground mt-2 text-sm leading-6">ویژگی‌های جدید گزارش فروش فعال شد.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card rounded-xl border p-3">
                <p className="text-muted-foreground text-xs">کانال</p>
                <p className="mt-1 font-semibold">Push</p>
              </div>
              <div className="bg-card rounded-xl border p-3">
                <p className="text-muted-foreground text-xs">مخاطب</p>
                <p className="mt-1 font-semibold">کاربران فعال</p>
              </div>
            </div>
          </div>
          <div className="drawer-footer">
            <Button variant="outline" className="flex-1" onClick={previewDrawer.close}>بستن</Button>
            <Button className="flex-1">ارسال</Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
