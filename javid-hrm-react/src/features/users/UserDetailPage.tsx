import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Textarea } from '@/components/ui/Textarea';
import { Dialog } from '@/components/layout/Dialog';
import { useDisclosure } from '@/hooks';

const userName = 'علی محمدی';

const orders = [
  { id: '#ORD-1256', date: '1404/10/15', amount: '2,500,000', status: 'تحویل شده', variant: 'success' as const },
  { id: '#ORD-1255', date: '1404/10/14', amount: '1,800,000', status: 'در حال ارسال', variant: 'info' as const },
];

export default function UserDetailPage() {
  const deleteDialog = useDisclosure();

  return (
    <div className="flex-1 p-4 lg:p-6" dir="rtl">
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <div className="text-muted-foreground mb-2 flex items-center gap-2 text-sm">
            <Link to="/users" className="hover:underline">کاربران</Link>
            <span>/</span>
            <span>جزئیات کاربر</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="avatar ring-primary/20 size-12 ring-2">
              <div className="avatar-fallback bg-primary/10 text-primary text-sm">ع‌م</div>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{userName}</h1>
              <p className="text-muted-foreground">ali.m@email.com</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant="success">فعال</Badge>
            <Badge variant="info">مدیر فروشگاه</Badge>
            <span className="text-muted-foreground text-sm">آخرین ورود: 2 ساعت پیش</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/users" className="button" data-variant="outline">
            <Icon name="material-symbols:close" className="size-5" />
            بستن
          </Link>
          <Button variant="outline">
            <Icon name="material-symbols:edit" className="size-5" />
            ویرایش
          </Button>
          <Button variant="destructive" onClick={deleteDialog.open}>
            <Icon name="material-symbols:delete" className="size-5" />
            حذف
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>اطلاعات تماس</CardTitle>
              <CardDescription>شماره تماس و آدرس‌ها</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border p-4">
                  <p className="text-muted-foreground text-xs">شماره تماس</p>
                  <p className="mt-1 font-medium">09198765432</p>
                </div>
                <div className="rounded-xl border p-4">
                  <p className="text-muted-foreground text-xs">تاریخ عضویت</p>
                  <p className="mt-1 font-medium">1403/05/15</p>
                </div>
                <div className="rounded-xl border p-4 sm:col-span-2">
                  <p className="text-muted-foreground text-xs">آدرس پیش‌فرض</p>
                  <p className="mt-1 text-sm leading-7">تهران، خیابان مثال، پلاک 12، واحد 3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>سفارشات اخیر</CardTitle>
              <CardDescription>آخرین سفارش‌های ثبت شده توسط کاربر</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="table-wrapper">
                <table className="table">
                  <thead className="table-header">
                    <tr>
                      <th className="table-head">شماره سفارش</th>
                      <th className="table-head">تاریخ</th>
                      <th className="table-head">مبلغ</th>
                      <th className="table-head">وضعیت</th>
                      <th className="table-head w-20">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="table-body">
                    {orders.map((order) => (
                      <tr key={order.id} className="table-row">
                        <td className="text-primary table-cell font-medium">{order.id}</td>
                        <td className="table-cell text-sm">{order.date}</td>
                        <td className="table-cell font-medium">{order.amount}</td>
                        <td className="table-cell">
                          <Badge variant={order.variant}>{order.status}</Badge>
                        </td>
                        <td className="table-cell">
                          <Button variant="ghost" size="icon-sm">
                            <Icon name="material-symbols:visibility" className="size-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>پیام</CardTitle>
              <CardDescription>ارسال پیام به کاربر</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea rows={4} placeholder="پیام شما..." />
              <div className="mt-3 flex items-center justify-between gap-2">
                <Button variant="outline" size="sm">
                  <Icon name="material-symbols:attach-file" className="size-5" />
                  پیوست
                </Button>
                <Button size="sm">
                  <Icon name="material-symbols:send" className="size-5" />
                  ارسال
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>یادداشت داخلی</CardTitle>
              <CardDescription>فقط برای تیم شما</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea rows={4} placeholder="یادداشت..." />
              <div className="mt-3 flex items-center justify-end">
                <Button variant="outline" size="sm">
                  <Icon name="material-symbols:save" className="size-5" />
                  ذخیره
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={deleteDialog.isOpen} onClose={deleteDialog.close} className="max-w-md">
        <button type="button" className="dialog-close" onClick={deleteDialog.close}>
          <Icon name="material-symbols:close" className="size-4" />
        </button>
        <div className="dialog-header">
          <div className="bg-destructive/10 mx-auto mb-4 flex size-12 items-center justify-center rounded-full sm:mx-0">
            <Icon name="material-symbols:warning" className="text-destructive size-6" />
          </div>
          <h3 className="dialog-title">آیا مطمئن هستید؟</h3>
          <p className="dialog-description">
            این عملیات قابل بازگشت نیست. آیتم مورد نظر به طور کامل حذف خواهد شد.
          </p>
        </div>
        <div className="dialog-footer">
          <Button variant="outline" onClick={deleteDialog.close}>انصراف</Button>
          <Button variant="destructive" onClick={deleteDialog.close}>بله، حذف شود</Button>
        </div>
      </Dialog>
    </div>
  );
}
