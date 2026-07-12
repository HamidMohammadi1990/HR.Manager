import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Dialog } from '@/components/layout/Dialog';
import { useDisclosure } from '@/hooks';
import { cn } from '@/lib/utils';

interface PermissionItem {
  label: string;
  granted: boolean;
}

interface RoleCard {
  title: string;
  icon: string;
  iconColor: string;
  description: string;
  userCount: string;
  permissions: PermissionItem[];
  systemRole?: boolean;
  borderPrimary?: boolean;
}

const roles: RoleCard[] = [
  {
    title: 'مدیر ارشد',
    icon: 'material-symbols:shield-person-outline',
    iconColor: 'text-primary',
    description: 'دسترسی کامل به تمام بخش‌ها',
    userCount: '2 کاربر',
    permissions: [
      { label: 'مدیریت محصولات', granted: true },
      { label: 'مدیریت سفارشات', granted: true },
      { label: 'مدیریت کاربران', granted: true },
      { label: 'تنظیمات سیستم', granted: true },
      { label: 'گزارشات مالی', granted: true },
    ],
    systemRole: true,
    borderPrimary: true,
  },
  {
    title: 'مدیر فروش',
    icon: 'material-symbols:manage-accounts-outline',
    iconColor: 'text-sky-500',
    description: 'مدیریت سفارشات و مشتریان',
    userCount: '5 کاربر',
    permissions: [
      { label: 'مشاهده محصولات', granted: true },
      { label: 'مدیریت سفارشات', granted: true },
      { label: 'مشاهده کاربران', granted: true },
      { label: 'تنظیمات سیستم', granted: false },
      { label: 'گزارش فروش', granted: true },
    ],
  },
  {
    title: 'مدیر محتوا',
    icon: 'material-symbols:edit-note',
    iconColor: 'text-violet-500',
    description: 'مدیریت محصولات و محتوای سایت',
    userCount: '3 کاربر',
    permissions: [
      { label: 'مدیریت محصولات', granted: true },
      { label: 'مدیریت دسته‌بندی‌ها', granted: true },
      { label: 'مدیریت بلاگ', granted: true },
      { label: 'مدیریت سفارشات', granted: false },
      { label: 'گزارشات مالی', granted: false },
    ],
  },
  {
    title: 'پشتیبانی',
    icon: 'material-symbols:support-agent',
    iconColor: 'text-emerald-500',
    description: 'پاسخگویی به مشتریان',
    userCount: '8 کاربر',
    permissions: [
      { label: 'مشاهده سفارشات', granted: true },
      { label: 'مدیریت تیکت‌ها', granted: true },
      { label: 'مدیریت نظرات', granted: true },
      { label: 'مدیریت محصولات', granted: false },
      { label: 'گزارشات مالی', granted: false },
    ],
  },
  {
    title: 'انباردار',
    icon: 'material-symbols:warehouse-outline',
    iconColor: 'text-amber-500',
    description: 'مدیریت موجودی و ارسال',
    userCount: '4 کاربر',
    permissions: [
      { label: 'مشاهده محصولات', granted: true },
      { label: 'مدیریت موجودی', granted: true },
      { label: 'مشاهده سفارشات', granted: true },
      { label: 'بروزرسانی وضعیت ارسال', granted: true },
      { label: 'ویرایش قیمت', granted: false },
    ],
  },
  {
    title: 'حسابدار',
    icon: 'material-symbols:account-balance-outline',
    iconColor: 'text-pink-500',
    description: 'مدیریت امور مالی',
    userCount: '2 کاربر',
    permissions: [
      { label: 'مشاهده سفارشات', granted: true },
      { label: 'مدیریت تراکنش‌ها', granted: true },
      { label: 'صدور فاکتور', granted: true },
      { label: 'گزارشات مالی', granted: true },
      { label: 'مدیریت کاربران', granted: false },
    ],
  },
];

function PermissionRow({ label, granted }: PermissionItem) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon
        name={granted ? 'material-symbols:check-circle' : 'material-symbols:cancel'}
        className={cn('size-4', granted ? 'text-emerald-500' : 'text-muted-foreground')}
      />
      <span className={granted ? '' : 'text-muted-foreground'}>{label}</span>
    </div>
  );
}

const permissionGroups = [
  {
    title: 'محصولات',
    icon: 'material-symbols:inventory-2-outline',
    items: ['مشاهده محصولات', 'ایجاد محصول', 'ویرایش محصول', 'حذف محصول'],
  },
  {
    title: 'سفارشات',
    icon: 'material-symbols:shopping-cart-outline',
    items: ['مشاهده سفارشات', 'تغییر وضعیت سفارش', 'لغو سفارش', 'مدیریت مرجوعی‌ها'],
  },
  {
    title: 'کاربران',
    icon: 'material-symbols:group-outline',
    items: ['مشاهده کاربران', 'ایجاد کاربر', 'ویرایش کاربر', 'مدیریت نقش‌ها'],
  },
  {
    title: 'مالی',
    icon: 'fluent:payment-48-regular',
    items: ['مشاهده تراکنش‌ها', 'بازپرداخت', 'گزارشات مالی', 'تنظیمات درگاه'],
  },
];

export default function RolesPage() {
  const addRoleDialog = useDisclosure();
  const deleteDialog = useDisclosure();

  return (
    <div className="flex-1 p-4 lg:p-6" dir="rtl">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">نقش‌ها و دسترسی‌ها</h1>
          <p className="text-muted-foreground">مدیریت نقش‌ها و سطوح دسترسی کاربران</p>
        </div>
        <Button onClick={addRoleDialog.open}>
          <Icon name="material-symbols:add" className="size-5" />
          ایجاد نقش جدید
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => (
          <Card key={role.title} className={role.borderPrimary ? 'border-primary' : undefined}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name={role.icon} className={cn('size-5', role.iconColor)} />
                    {role.title}
                  </CardTitle>
                  <p className="text-muted-foreground mt-1 text-sm">{role.description}</p>
                </div>
                <Badge variant={role.systemRole ? 'default' : 'secondary'}>{role.userCount}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {role.permissions.map((p) => (
                  <PermissionRow key={p.label} {...p} />
                ))}
              </div>
            </CardContent>
            <div
              className={cn(
                'card-footer flex items-center border-t',
                role.systemRole ? 'justify-between' : 'justify-end gap-2',
              )}
            >
              {role.systemRole && <span className="text-muted-foreground text-xs">نقش سیستمی</span>}
              {role.systemRole ? (
                <Button variant="ghost" size="sm">
                  <Icon name="material-symbols:visibility-outline" className="size-4" />
                  مشاهده
                </Button>
              ) : (
                <>
                  <Button variant="ghost" size="sm">
                    <Icon name="material-symbols:edit-outline" className="size-4" />
                    ویرایش
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={deleteDialog.open}
                  >
                    <Icon name="material-symbols:delete-outline" className="size-4" />
                    حذف
                  </Button>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={addRoleDialog.isOpen} onClose={addRoleDialog.close} className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <button type="button" className="dialog-close" onClick={addRoleDialog.close}>
          <Icon name="material-symbols:close" className="size-4" />
        </button>
        <div className="dialog-header">
          <h3 className="dialog-title">ایجاد نقش جدید</h3>
          <p className="dialog-description">نقش و دسترسی‌های آن را تعریف کنید</p>
        </div>
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">نام نقش</label>
              <Input className="w-full" placeholder="مثال: مدیر فروش" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">نام انگلیسی</label>
              <Input className="w-full" placeholder="sales_manager" dir="ltr" />
            </div>
            <div className="col-span-2">
              <label className="mb-1.5 block text-sm font-medium">توضیحات</label>
              <Textarea className="w-full" rows={2} placeholder="توضیحات نقش..." />
            </div>
          </div>
          <div>
            <h4 className="mb-3 font-medium">دسترسی‌ها</h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {permissionGroups.map((group) => (
                <div key={group.title} className="rounded-lg border p-4">
                  <h5 className="mb-3 flex items-center gap-2 font-medium">
                    <Icon name={group.icon} className="size-4" />
                    {group.title}
                  </h5>
                  <div className="space-y-2">
                    {group.items.map((item) => (
                      <label key={item} className="flex cursor-pointer items-center gap-2">
                        <input type="checkbox" className="checkbox" />
                        <span className="text-sm">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="dialog-footer">
          <Button variant="outline" onClick={addRoleDialog.close}>انصراف</Button>
          <Button>ایجاد نقش</Button>
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
