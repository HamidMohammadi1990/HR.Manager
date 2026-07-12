import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

export default function AddUserPage() {
  return (
    <div className="flex-1 p-4 lg:p-6" dir="rtl">
      <div className="mx-auto mb-6 max-w-6xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">افزودن کاربر</h1>
            <p className="text-muted-foreground">ساخت حساب کاربری و تخصیص نقش</p>
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
              <CardTitle>فرم</CardTitle>
              <CardDescription>فیلدهای اصلی را تکمیل کنید</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="f-title" className="text-sm font-medium">عنوان</label>
                  <Input id="f-title" placeholder="عنوان" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="f-code" className="text-sm font-medium">کد</label>
                  <Input id="f-code" placeholder="کد/شناسه" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="f-status" className="text-sm font-medium">وضعیت</label>
                  <Input id="f-status" placeholder="فعال" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="f-notes" className="text-sm font-medium">توضیحات</label>
                  <Textarea id="f-notes" className="min-h-28" placeholder="توضیحات" />
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end gap-2">
                <Button variant="outline" type="button">انصراف</Button>
                <Button variant="default" type="button">ذخیره</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
