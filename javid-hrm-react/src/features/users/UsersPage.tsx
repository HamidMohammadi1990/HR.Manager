import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, MetricCard } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { Dialog } from '@/components/layout/Dialog';
import { useDisclosure } from '@/hooks';
import { getAllUsers, getApiErrorMessage, type UserDto } from '@/services/api';
import { formatDateTime, getUserDisplayName, getUserInitials } from '@/lib/userDisplay';
import { UserListFiltersCard } from '@/features/users/UserListFiltersCard';
import {
  buildGetAllUsersRequest,
  EMPTY_USER_FILTERS,
  type UserListFilters,
} from '@/features/users/userFilters';

export default function UsersPage() {
  const addUserDialog = useDisclosure();
  const deleteDialog = useDisclosure();
  const advancedFilters = useDisclosure();
  const [users, setUsers] = useState<UserDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [filters, setFilters] = useState<UserListFilters>(EMPTY_USER_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<UserListFilters>(EMPTY_USER_FILTERS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const pageSize = 10;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAppliedFilters(filters);
      setPageNumber(1);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [filters]);

  useEffect(() => {
    let cancelled = false;

    async function loadUsers() {
      setIsLoading(true);
      setError('');
      try {
        const result = await getAllUsers(buildGetAllUsersRequest(appliedFilters, pageNumber, pageSize));
        if (!cancelled) {
          setUsers(result.Items ?? []);
          setTotalCount(result.TotalCount ?? result.Items?.length ?? 0);
        }
      } catch (err) {
        if (!cancelled) {
          setError(getApiErrorMessage(err));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadUsers();
    return () => {
      cancelled = true;
    };
  }, [pageNumber, appliedFilters]);

  const activeCount = users.filter((u) => u.IsActive).length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

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
          <Link to="/users/new" className="button" data-variant="default">
            <Icon name="material-symbols:person-add" className="size-4" />
            <span>افزودن کاربر</span>
          </Link>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard
          icon={<Icon name="material-symbols:group" className="text-primary size-5" />}
          iconClassName="bg-primary/10"
          label="کل کاربران"
          value={String(totalCount)}
        />
        <MetricCard
          icon={<Icon name="material-symbols:verified" className="size-5 text-emerald-500" />}
          iconClassName="bg-emerald-500/10"
          label="کاربران فعال (صفحه جاری)"
          value={String(activeCount)}
        />
        <MetricCard
          icon={<Icon name="material-symbols:admin-panel-settings" className="size-5 text-violet-500" />}
          iconClassName="bg-violet-500/10"
          label="صفحه"
          value={`${pageNumber} / ${totalPages}`}
        />
        <MetricCard
          icon={<Icon name="material-symbols:person-add" className="size-5 text-sky-500" />}
          iconClassName="bg-sky-500/10"
          label="تعداد در صفحه"
          value={String(users.length)}
        />
      </div>

      {error && (
        <div className="text-destructive bg-destructive/10 mb-6 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <UserListFiltersCard
        filters={filters}
        expanded={advancedFilters.isOpen}
        onToggleExpanded={advancedFilters.toggle}
        onChange={setFilters}
        onReset={() => {
          setFilters(EMPTY_USER_FILTERS);
          setPageNumber(1);
        }}
      />

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
                  <th className="table-head">شماره تماس</th>
                  <th className="table-head">شهر</th>
                  <th className="table-head">آخرین ورود</th>
                  <th className="table-head">وضعیت</th>
                  <th className="table-head w-24">عملیات</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {isLoading ? (
                  <tr className="table-row">
                    <td className="table-cell text-muted-foreground py-8 text-center" colSpan={7}>
                      در حال بارگذاری کاربران...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr className="table-row">
                    <td className="table-cell text-muted-foreground py-8 text-center" colSpan={7}>
                      کاربری یافت نشد
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.Id} className="table-row">
                      <td className="table-cell">
                        <input type="checkbox" className="checkbox" />
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <div className="avatar size-10">
                            <div className="avatar-fallback from-primary to-primary/70 text-primary-foreground bg-linear-to-br text-sm">
                              {getUserInitials(user)}
                            </div>
                          </div>
                          <div>
                            <Link to={`/users/${encodeURIComponent(user.Id)}`} className="font-medium hover:underline">
                              {getUserDisplayName(user)}
                            </Link>
                            <p className="text-muted-foreground text-xs">{user.Email ?? user.UserName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell text-sm">{user.PhoneNumber ?? '—'}</td>
                      <td className="table-cell text-sm">{user.CityName ?? '—'}</td>
                      <td className="table-cell text-muted-foreground text-sm">
                        {formatDateTime(user.LastLoginDateOnUtc)}
                      </td>
                      <td className="table-cell">
                        <Badge variant={user.IsActive ? 'success' : 'secondary'}>
                          {user.IsActive ? 'فعال' : 'غیرفعال'}
                        </Badge>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center gap-1">
                          <Link
                            to={`/users/${encodeURIComponent(user.Id)}`}
                            className="button ghost icon-sm inline-flex items-center justify-center"
                          >
                            <Icon name="material-symbols:edit" className="size-4" />
                          </Link>
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
        <div className="card-footer flex flex-wrap items-center justify-between border-t">
          <p className="text-muted-foreground text-sm">
            نمایش {users.length > 0 ? (pageNumber - 1) * pageSize + 1 : 0} تا{' '}
            {(pageNumber - 1) * pageSize + users.length} از {totalCount} کاربر
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              disabled={pageNumber <= 1 || isLoading}
              onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            >
              <Icon name="material-symbols:chevron-right" className="size-4" />
            </Button>
            <Button variant="default" size="sm">{pageNumber}</Button>
            <Button
              variant="outline"
              size="icon-sm"
              disabled={pageNumber >= totalPages || isLoading}
              onClick={() => setPageNumber((p) => p + 1)}
            >
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
          <p className="dialog-description">به زودی از طریق API متصل می‌شود</p>
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
            <label className="label">رمز عبور</label>
            <Input type="password" placeholder="رمز عبور" />
          </div>
        </div>
        <div className="dialog-footer">
          <Button variant="outline" onClick={addUserDialog.close}>انصراف</Button>
          <Button variant="default" disabled>ذخیره کاربر</Button>
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
            حذف کاربر از طریق API در مرحله بعدی پیاده‌سازی می‌شود.
          </p>
        </div>
        <div className="dialog-footer">
          <Button variant="outline" onClick={deleteDialog.close}>انصراف</Button>
          <Button variant="destructive" onClick={deleteDialog.close}>بستن</Button>
        </div>
      </Dialog>
    </div>
  );
}
