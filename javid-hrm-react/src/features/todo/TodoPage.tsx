import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Drawer } from '@/components/layout/Dialog';
import { useDrawer } from '@/hooks';

const tasks = [
  { title: 'بررسی سفارشات جدید', priority: 'بالا', priorityVariant: 'alert' as const, status: 'تکمیل شده', statusVariant: 'success' as const, due: 'امروز', checked: true },
  { title: 'پاسخ به تیکت‌ها', priority: 'پایین', priorityVariant: 'destructive' as const, status: 'در انتظار', statusVariant: 'secondary' as const, due: 'فردا', checked: false },
  { title: 'آپدیت موجودی', priority: 'بالا', priorityVariant: 'alert' as const, status: 'در انتظار', statusVariant: 'secondary' as const, due: 'امروز', checked: false },
  { title: 'تهیه گزارش روزانه', priority: 'پایین', priorityVariant: 'destructive' as const, status: 'در انتظار', statusVariant: 'secondary' as const, due: '۳ روز دیگر', checked: false },
];

const metrics = [
  { label: 'کل کارها', value: '۴', sub: '+۱ امروز', icon: 'material-symbols:checklist', iconColor: 'text-primary', subColor: 'text-emerald-600' },
  { label: 'تکمیل شده', value: '۲', sub: '۵۰% از کل', icon: 'material-symbols:check-circle', iconColor: 'text-emerald-500' },
  { label: 'در انتظار', value: '۲', sub: '۵۰% از کل', icon: 'material-symbols:schedule', iconColor: 'text-amber-500' },
  { label: 'اولویت بالا', value: '۲', sub: 'نیاز به توجه', icon: 'material-symbols:priority-high', iconColor: 'text-red-500' },
];

export default function TodoPage() {
  const addTaskDrawer = useDrawer();

  return (
    <div className="flex-1 p-4 lg:p-6" dir="rtl">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">لیست کارها</h1>
            <p className="text-muted-foreground">مدیریت وظایف و چک‌لیست روزانه تیم</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Icon name="material-symbols:arrow-back" className="size-4" />
              بازگشت
            </Button>
            <Button variant="default" onClick={addTaskDrawer.open}>
              <Icon name="material-symbols:add" className="size-4" />
              کار جدید
            </Button>
          </div>
        </div>

        <div className="bg-card rounded-2xl border p-4">
          <div className="flex items-center gap-3 max-md:flex-wrap">
            <div className="relative min-w-80 flex-1">
              <Icon name="material-symbols:search" className="text-muted-foreground absolute start-3 top-1/2 size-5 -translate-y-1/2" />
              <Input className="w-full ps-10" placeholder="جستجو کارها..." />
            </div>
            <Select>
              <option value="">همه اولویت‌ها</option>
              <option value="high">بالا</option>
              <option value="medium">متوسط</option>
              <option value="low">پایین</option>
            </Select>
            <Select>
              <option value="">همه وضعیت‌ها</option>
              <option value="pending">در انتظار</option>
              <option value="completed">تکمیل شده</option>
            </Select>
            <div className="flex items-center gap-2">
              <Badge variant="success">۲ تکمیل شده</Badge>
              <Badge variant="destructive">۲ در انتظار</Badge>
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
                <p className={`mt-1 text-xs ${m.subColor ?? 'text-muted-foreground'}`}>{m.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>لیست کارها</CardTitle>
            <CardDescription>مدیریت و پیگیری وظایف روزانه</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="table-wrapper">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-head">کار</th>
                    <th className="table-head">اولویت</th>
                    <th className="table-head">وضعیت</th>
                    <th className="table-head">موعد</th>
                    <th className="table-head">عملیات</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {tasks.map((task) => (
                    <tr key={task.title} className="table-row">
                      <td className="table-cell font-medium">
                        <div className="flex items-center gap-3">
                          <input type="checkbox" className="size-4" defaultChecked={task.checked} />
                          {task.title}
                        </div>
                      </td>
                      <td className="table-cell">
                        <Badge variant={task.priorityVariant}>{task.priority}</Badge>
                      </td>
                      <td className="table-cell">
                        <Badge variant={task.statusVariant}>{task.status}</Badge>
                      </td>
                      <td className="text-muted-foreground table-cell text-sm">{task.due}</td>
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
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

      <Drawer open={addTaskDrawer.isOpen} onClose={addTaskDrawer.close} id="add-task-drawer">
        <div className="flex h-full flex-col">
          <div className="drawer-header">
            <div>
              <p className="font-semibold">افزودن کار جدید</p>
              <p className="text-muted-foreground text-xs">جزئیات کار را وارد کنید</p>
            </div>
            <Button variant="ghost" size="icon-sm" onClick={addTaskDrawer.close}>
              <Icon name="material-symbols:close" className="size-5" />
            </Button>
          </div>
          <div className="drawer-content flex-1 space-y-4">
            <div className="space-y-2">
              <label className="label">عنوان کار</label>
              <Input placeholder="مثلاً: بررسی ایمیل‌ها" />
            </div>
            <div className="space-y-2">
              <label className="label">توضیحات</label>
              <Textarea rows={3} placeholder="جزئیات کار..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="label">اولویت</label>
                <Select>
                  <option value="low">پایین</option>
                  <option value="medium">متوسط</option>
                  <option value="high">بالا</option>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="label">موعد</label>
                <Input type="date" />
              </div>
            </div>
          </div>
          <div className="drawer-footer">
            <Button variant="outline" className="flex-1" onClick={addTaskDrawer.close}>انصراف</Button>
            <Button className="flex-1">افزودن کار</Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
