import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

const historyRows = [
  { user: 'مدیر سیستم', change: 'ویرایش مقدار', time: '۲ ساعت پیش' },
  { user: 'مدیر سیستم', change: 'فعال‌سازی', time: 'دیروز' },
];

export default function AccountSettingsPage() {
  return (
    <div className="flex-1 p-4 lg:p-6" dir="rtl">
      <div className="mx-auto mb-6 max-w-6xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">تنظیمات حساب</h1>
            <p className="text-muted-foreground">مدیریت امنیت و تنظیمات حساب کاربری</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">بازگشت</Button>
            <Button variant="default">ذخیره</Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>اطلاعات اصلی</CardTitle>
              <CardDescription>تنظیمات عمومی را به‌روزرسانی کنید</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="f-name" className="text-sm font-medium">عنوان</label>
                  <Input id="f-name" placeholder="عنوان تنظیمات" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="f-value" className="text-sm font-medium">مقدار</label>
                  <Input id="f-value" placeholder="مقدار" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="f-desc" className="text-sm font-medium">توضیحات</label>
                  <Textarea id="f-desc" className="min-h-28" placeholder="توضیح کوتاه" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="f-status" className="text-sm font-medium">وضعیت</label>
                  <Input id="f-status" placeholder="فعال" />
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end gap-2">
                <Button variant="outline" type="button">انصراف</Button>
                <Button variant="default" type="button">ذخیره</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>تاریخچه تغییرات</CardTitle>
              <CardDescription>آخرین تغییرات انجام‌شده روی تنظیمات</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="relative">
                  <Icon
                    name="material-symbols:search"
                    className="text-muted-foreground absolute start-3 top-1/2 size-5 -translate-y-1/2"
                  />
                  <Input className="w-72 ps-10" placeholder="جستجو..." />
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline">فیلتر</Button>
                  <Button variant="default">افزودن</Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-muted-foreground p-3 text-start text-xs font-medium">کاربر</th>
                      <th className="text-muted-foreground p-3 text-start text-xs font-medium">تغییر</th>
                      <th className="text-muted-foreground p-3 text-start text-xs font-medium">زمان</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyRows.map((row) => (
                      <tr key={row.time} className="hover:bg-muted/30 border-b transition-colors last:border-b-0">
                        <td className="p-3 text-sm">{row.user}</td>
                        <td className="p-3 text-sm">
                          <span className="text-muted-foreground">{row.change}</span>
                        </td>
                        <td className="p-3 text-sm">
                          <span className="text-muted-foreground">{row.time}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
