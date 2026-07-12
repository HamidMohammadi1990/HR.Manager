import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, MetricCard } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Dialog } from '@/components/layout/Dialog';
import { Textarea } from '@/components/ui/Textarea';
import { useDisclosure } from '@/hooks';

const users = [
  {
    initials: 'م‌س',
    name: 'مدیر سیستم',
    email: 'admin@example.com',
    avatarClass: 'avatar ring-primary/20 size-10 ring-2',
    fallbackClass: 'avatar-fallback from-primary to-primary/70 text-primary-foreground bg-linear-to-br text-sm',
    role: { label: 'مدیر سیستم', variant: 'violet' as const, icon: 'material-symbols:admin-panel-settings' },
    phone: '09121234567',
    joined: '1403/01/01',
    lastLogin: 'آنلاین',
    lastLoginClass: 'text-emerald-600',
    status: { label: 'فعال', variant: 'success' as const },
  },
  {
    initials: 'ع‌م',
    name: 'علی محمدی',
    email: 'ali.m@email.com',
    avatarClass: 'avatar size-10',
    fallbackClass: 'avatar-fallback bg-sky-500/10 text-sm text-sky-500',
    role: { label: 'مدیر فروشگاه', variant: 'info' as const, icon: 'material-symbols:storefront' },
    phone: '09198765432',
    joined: '1403/05/15',
    lastLogin: '2 ساعت پیش',
    lastLoginClass: 'text-muted-foreground',
    status: { label: 'فعال', variant: 'success' as const },
  },
  {
    initials: 'س‌ا',
    name: 'سارا احمدی',
    email: 'sara.a@email.com',
    avatarClass: 'avatar size-10',
    fallbackClass: 'avatar-fallback bg-pink-500/10 text-sm text-pink-500',
    role: { label: 'اپراتور', variant: 'destructive' as const, icon: 'material-symbols:headset-mic' },
    phone: '09351234567',
    joined: '1403/08/20',
    lastLogin: 'دیروز',
    lastLoginClass: 'text-muted-foreground',
    status: { label: 'فعال', variant: 'success' as const },
  },
  {
    initials: 'م‌ر',
    name: 'محمد رضایی',
    email: 'm.rezaei@email.com',
    avatarClass: 'avatar size-10',
    fallbackClass: 'avatar-fallback bg-amber-500/10 text-sm text-amber-500',
    role: { label: 'مشتری', variant: 'secondary' as const, icon: 'material-symbols:person' },
    phone: '09125554433',
    joined: '1404/02/10',
    lastLogin: '3 روز پیش',
    lastLoginClass: 'text-muted-foreground',
    status: { label: 'معلق', variant: 'alert' as const },
  },
  {
    initials: 'ز‌ک',
    name: 'زهرا کریمی',
    email: 'z.karimi@email.com',
    avatarClass: 'avatar size-10',
    fallbackClass: 'avatar-fallback bg-emerald-500/10 text-sm text-emerald-500',
    role: { label: 'مشتری', variant: 'secondary' as const, icon: 'material-symbols:person' },
    phone: '09371112223',
    joined: '1404/06/01',
    lastLogin: '1 هفته پیش',
    lastLoginClass: 'text-muted-foreground',
    status: { label: 'غیرفعال', variant: 'secondary' as const },
  },
];

export default function UsersPage() {
  const addUserDialog = useDisclosure();
  const deleteDialog = useDisclosure();

  return (
    <div className="flex-1 p-4 lg:p-6" dir="rtl">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">کاربران</h1>
          <p className="text-muted-foreground">مدیریت کاربران و نقش‌ها</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Icon name="material-symbols:download" className="size-4" />
            <span>خروجی</span>
          </Button>
          <Button variant="default" onClick={addUserDialog.open}>
            <Icon name="material-symbols:person-add" className="size-4" />
            <span>افزودن کاربر</span>
          </Button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard
          icon={<Icon name="material-symbols:group" className="text-primary size-5" />}
          iconClassName="bg-primary/10"
          label="کل کاربران"
          value="894"
        />
        <MetricCard
          icon={<Icon name="material-symbols:verified" className="size-5 text-emerald-500" />}
          iconClassName="bg-emerald-500/10"
          label="کاربران فعال"
          value="782"
        />
        <MetricCard
          icon={<Icon name="material-symbols:admin-panel-settings" className="size-5 text-violet-500" />}
          iconClassName="bg-violet-500/10"
          label="مدیران"
          value="12"
        />
        <MetricCard
          icon={<Icon name="material-symbols:person-add" className="size-5 text-sky-500" />}
          iconClassName="bg-sky-500/10"
          label="کاربران جدید (هفته)"
          value="23"
        />
      </div>

      <Card className="mb-6">
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative lg:col-span-2">
              <Icon
                name="material-symbols:search"
                className="text-muted-foreground absolute end-3 top-1/2 size-4 -translate-y-1/2"
              />
              <Input type="text" placeholder="جستجوی نام، ایمیل یا شماره تماس..." className="w-full pe-10" />
            </div>
            <Select className="w-full">
              <option value="">همه نقش‌ها</option>
              <option value="admin">مدیر سیستم</option>
              <option value="manager">مدیر فروشگاه</option>
              <option value="operator">اپراتور</option>
              <option value="customer">مشتری</option>
            </Select>
            <Select className="w-full">
              <option value="">همه وضعیت‌ها</option>
              <option value="active">فعال</option>
              <option value="inactive">غیرفعال</option>
              <option value="suspended">معلق</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="table-wrapper">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-head w-12">
                    <input type="checkbox" className="checkbox" />
                  </th>
                  <th className="table-head">کاربر</th>
                  <th className="table-head">نقش</th>
                  <th className="table-head">شماره تماس</th>
                  <th className="table-head">تاریخ عضویت</th>
                  <th className="table-head">آخرین ورود</th>
                  <th className="table-head">وضعیت</th>
                  <th className="table-head w-24">عملیات</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {users.map((user) => (
                  <tr key={user.email} className="table-row">
                    <td className="table-cell">
                      <input type="checkbox" className="checkbox" />
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className={user.avatarClass}>
                          <div className={user.fallbackClass}>{user.initials}</div>
                        </div>
                        <div>
                          <Link to="/users/ali-mohammadi" className="font-medium hover:underline">
                            {user.name}
                          </Link>
                          <p className="text-muted-foreground text-xs">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <Badge variant={user.role.variant}>
                        <Icon name={user.role.icon} className="size-3" />
                        {user.role.label}
                      </Badge>
                    </td>
                    <td className="table-cell text-sm">{user.phone}</td>
                    <td className="table-cell text-sm">{user.joined}</td>
                    <td className={`table-cell text-sm ${user.lastLoginClass}`}>{user.lastLogin}</td>
                    <td className="table-cell">
                      <Badge variant={user.status.variant}>{user.status.label}</Badge>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon-sm">
                          <Icon name="material-symbols:edit" className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={deleteDialog.open}
                        >
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
        <div className="card-footer flex flex-wrap items-center justify-between border-t">
          <p className="text-muted-foreground text-sm">نمایش 1 تا 5 از 894 کاربر</p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon-sm" disabled>
              <Icon name="material-symbols:chevron-right" className="size-4" />
            </Button>
            <Button variant="default" size="sm">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <span className="text-muted-foreground px-2">...</span>
            <Button variant="outline" size="sm">179</Button>
            <Button variant="outline" size="icon-sm">
              <Icon name="material-symbols:chevron-left" className="size-4" />
            </Button>
          </div>
        </div>
      </Card>

      <Dialog open={addUserDialog.isOpen} onClose={addUserDialog.close} className="max-w-lg">
        <button type="button" className="dialog-close" onClick={addUserDialog.close}>
          <Icon name="material-symbols:close" className="size-4" />
        </button>
        <div className="dialog-header">
          <h3 className="dialog-title">افزودن کاربر جدید</h3>
          <p className="dialog-description">اطلاعات کاربر جدید را وارد کنید</p>
        </div>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="label">نام</label>
              <Input placeholder="نام" />
            </div>
            <div className="space-y-2">
              <label className="label">نام خانوادگی</label>
              <Input placeholder="نام خانوادگی" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="label">ایمیل</label>
            <Input type="email" placeholder="email@example.com" />
          </div>
          <div className="space-y-2">
            <label className="label">شماره تماس</label>
            <Input type="tel" placeholder="09121234567" />
          </div>
          <div className="space-y-2">
            <label className="label">نقش</label>
            <Select className="w-full">
              <option value="customer">مشتری</option>
              <option value="operator">اپراتور</option>
              <option value="manager">مدیر فروشگاه</option>
              <option value="admin">مدیر سیستم</option>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="label">رمز عبور</label>
            <Input type="password" placeholder="رمز عبور" />
          </div>
        </div>
        <div className="dialog-footer">
          <Button variant="outline" onClick={addUserDialog.close}>انصراف</Button>
          <Button variant="default">ذخیره کاربر</Button>
        </div>
      </Dialog>

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
