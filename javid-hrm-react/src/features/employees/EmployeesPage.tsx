import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, MetricCard } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { getAllEmployees, getApiErrorMessage, type EmployeeDto } from '@/services/api';

function getEmployeeName(emp: EmployeeDto) {
  const name = [emp.UserFirstName, emp.UserLastName].filter(Boolean).join(' ');
  return name || emp.UserName || emp.EmployeeCode;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<EmployeeDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const pageSize = 10;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError('');
      try {
        const result = await getAllEmployees({
          FirstName: search || undefined,
          Pagination: { PageNumber: pageNumber, PageSize: pageSize },
        });
        if (!cancelled) {
          setEmployees(result.Items ?? []);
          setTotalCount(result.TotalCount ?? 0);
        }
      } catch (err) {
        if (!cancelled) setError(getApiErrorMessage(err));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void load();
    return () => { cancelled = true; };
  }, [pageNumber, search]);

  const activeCount = employees.filter((e) => e.IsActive).length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="flex-1 p-4 lg:p-6" dir="rtl">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">مدیریت پرسنل</h1>
          <p className="text-muted-foreground">پروفایل و سازماندهی کارکنان</p>
        </div>
        <Link to="/employees/new" className="button" data-variant="default">
          <Icon name="material-symbols:person-add" className="size-4" />
          استخدام جدید
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard
          icon={<Icon name="material-symbols:group" className="text-primary size-5" />}
          iconClassName="bg-primary/10"
          label="کل پرسنل"
          value={String(totalCount)}
        />
        <MetricCard
          icon={<Icon name="material-symbols:verified" className="size-5 text-emerald-500" />}
          iconClassName="bg-emerald-500/10"
          label="فعال (صفحه جاری)"
          value={String(activeCount)}
        />
        <MetricCard
          icon={<Icon name="material-symbols:apartment" className="size-5 text-violet-500" />}
          iconClassName="bg-violet-500/10"
          label="بخش‌های منحصر"
          value={String(new Set(employees.map((e) => e.DepartmentId)).size)}
        />
        <MetricCard
          icon={<Icon name="material-symbols:pages" className="size-5 text-sky-500" />}
          iconClassName="bg-sky-500/10"
          label="صفحه"
          value={`${pageNumber} / ${totalPages}`}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="flex flex-wrap items-center gap-3 border-b p-4">
            <div className="relative min-w-[200px] flex-1">
              <Icon name="material-symbols:search" className="text-muted-foreground absolute start-3 top-1/2 size-4 -translate-y-1/2" />
              <Input
                className="ps-9"
                placeholder="جستجو بر اساس نام..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPageNumber(1); }}
              />
            </div>
          </div>

          {error && <p className="text-destructive px-4 py-3 text-sm">{error}</p>}

          <div className="table-wrapper">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-head">نام</th>
                  <th className="table-head">کد پرسنلی</th>
                  <th className="table-head">سمت</th>
                  <th className="table-head">بخش</th>
                  <th className="table-head">تاریخ استخدام</th>
                  <th className="table-head">وضعیت</th>
                  <th className="table-head">عملیات</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {isLoading ? (
                  <tr className="table-row">
                    <td colSpan={7} className="table-cell text-muted-foreground py-8 text-center text-sm">در حال بارگذاری...</td>
                  </tr>
                ) : employees.length === 0 ? (
                  <tr className="table-row">
                    <td colSpan={7} className="table-cell text-muted-foreground py-8 text-center text-sm">پرسنلی ثبت نشده است</td>
                  </tr>
                ) : (
                  employees.map((emp) => (
                    <tr key={emp.Id} className="table-row">
                      <td className="table-cell font-medium">{getEmployeeName(emp)}</td>
                      <td className="table-cell text-sm" dir="ltr">{emp.EmployeeCode}</td>
                      <td className="table-cell text-sm">{emp.JobTitle}</td>
                      <td className="table-cell text-sm">{emp.DepartmentName}</td>
                      <td className="table-cell text-sm">{new Date(emp.HireDate).toLocaleDateString('fa-IR')}</td>
                      <td className="table-cell">
                        <Badge variant={emp.IsActive ? 'success' : 'secondary'}>
                          {emp.IsActive ? 'فعال' : 'غیرفعال'}
                        </Badge>
                      </td>
                      <td className="table-cell">
                        <Link to={`/employees/${encodeURIComponent(emp.Id)}`} className="button" data-variant="outline" data-size="sm">
                          <Icon name="material-symbols:visibility" className="size-4" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 border-t p-4">
              <Button variant="outline" size="sm" disabled={pageNumber <= 1} onClick={() => setPageNumber((p) => p - 1)}>قبلی</Button>
              <span className="text-muted-foreground text-sm">{pageNumber} از {totalPages}</span>
              <Button variant="outline" size="sm" disabled={pageNumber >= totalPages} onClick={() => setPageNumber((p) => p + 1)}>بعدی</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
