import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  MetricCard,
  PageHeader,
  ProgressBar,
} from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import {
  getAllDepartments,
  getAllEmployees,
  getApiErrorMessage,
  type DepartmentDto,
  type EmployeeDto,
} from '@/services/api';

function getManagerName(dept: DepartmentDto) {
  return [dept.UserFirstName, dept.UserLastName].filter(Boolean).join(' ') || '—';
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<DepartmentDto[]>([]);
  const [employees, setEmployees] = useState<EmployeeDto[]>([]);
  const [search, setSearch] = useState('');
  const [deptError, setDeptError] = useState('');
  const [deptLoading, setDeptLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setDeptLoading(true);
      setDeptError('');
      try {
        const [deptResult, empResult] = await Promise.all([
          getAllDepartments({ Pagination: { PageNumber: 1, PageSize: 100 } }),
          getAllEmployees({ Pagination: { PageNumber: 1, PageSize: 500 } }),
        ]);
        if (!cancelled) {
          setDepartments(deptResult.Items ?? []);
          setEmployees(empResult.Items ?? []);
        }
      } catch (err) {
        if (!cancelled) setDeptError(getApiErrorMessage(err));
      } finally {
        if (!cancelled) setDeptLoading(false);
      }
    }

    void load();
    return () => { cancelled = true; };
  }, []);

  const filteredDepartments = useMemo(() => {
    if (!search.trim()) return departments;
    const query = search.trim().toLowerCase();
    return departments.filter(
      (dept) =>
        dept.Name.toLowerCase().includes(query)
        || dept.Code.toLowerCase().includes(query)
        || (dept.CityName ?? '').toLowerCase().includes(query),
    );
  }, [departments, search]);

  const headcountByDepartment = useMemo(() => {
    const counts = new Map<string, number>();
    for (const emp of employees) {
      const key = emp.DepartmentName || 'بدون بخش';
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return departments
      .map((dept) => ({
        id: dept.Id,
        name: dept.Name,
        count: counts.get(dept.Name) ?? 0,
        isActive: dept.IsActive,
      }))
      .sort((a, b) => b.count - a.count);
  }, [departments, employees]);

  const stats = useMemo(() => {
    const active = departments.filter((dept) => dept.IsActive).length;
    const withManager = departments.filter(
      (dept) => dept.UserFirstName || dept.UserLastName,
    ).length;
    const cities = new Set(departments.map((dept) => dept.CityName).filter(Boolean)).size;
    return {
      total: departments.length,
      active,
      withManager,
      cities,
      totalEmployees: employees.length,
    };
  }, [departments, employees]);

  const maxHeadcount = Math.max(1, ...headcountByDepartment.map((item) => item.count));

  return (
    <div className="flex-1 p-4 lg:p-6">
      <PageHeader
        title="مدیریت بخش‌ها"
        description="ساختار سازمانی و تخصیص پرسنل"
        actions={
          <Link to="/departments/new" className="button" data-variant="default">
            <Icon name="material-symbols:add" className="size-4" />
            بخش جدید
          </Link>
        }
      />

      {deptError && (
        <div className="text-destructive bg-destructive/10 mb-6 rounded-lg px-4 py-3 text-sm">
          {deptError}
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={<Icon name="material-symbols:corporate-fare" className="text-primary size-5" />}
          iconClassName="bg-primary/10"
          label="کل بخش‌ها"
          value={deptLoading ? '...' : String(stats.total)}
        />
        <MetricCard
          icon={<Icon name="material-symbols:verified" className="size-5 text-emerald-500" />}
          iconClassName="bg-emerald-500/10"
          label="بخش‌های فعال"
          value={deptLoading ? '...' : String(stats.active)}
        />
        <MetricCard
          icon={<Icon name="material-symbols:groups" className="size-5 text-sky-500" />}
          iconClassName="bg-sky-500/10"
          label="کل پرسنل"
          value={deptLoading ? '...' : String(stats.totalEmployees)}
        />
        <MetricCard
          icon={<Icon name="material-symbols:location-city" className="size-5 text-violet-500" />}
          iconClassName="bg-violet-500/10"
          label="شهرها"
          value={deptLoading ? '...' : String(stats.cities)}
        />
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Icon
              name="material-symbols:search"
              className="text-muted-foreground absolute end-3 top-1/2 size-4 -translate-y-1/2"
            />
            <Input
              type="text"
              placeholder="جستجوی نام، کد یا شهر..."
              className="w-full pe-10"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>لیست بخش‌ها</CardTitle>
          <CardDescription>مدیریت بخش‌های سازمان از API</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="table-wrapper">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-head">نام</th>
                  <th className="table-head">کد</th>
                  <th className="table-head">شهر</th>
                  <th className="table-head">مدیر</th>
                  <th className="table-head">پرسنل</th>
                  <th className="table-head">وضعیت</th>
                  <th className="table-head">عملیات</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {deptLoading ? (
                  <tr className="table-row">
                    <td colSpan={7} className="table-cell text-muted-foreground py-6 text-center text-sm">
                      در حال بارگذاری...
                    </td>
                  </tr>
                ) : filteredDepartments.length === 0 ? (
                  <tr className="table-row">
                    <td colSpan={7} className="table-cell text-muted-foreground py-6 text-center text-sm">
                      بخشی یافت نشد
                    </td>
                  </tr>
                ) : (
                  filteredDepartments.map((dept) => {
                    const headcount = headcountByDepartment.find((item) => item.id === dept.Id)?.count ?? 0;
                    return (
                      <tr key={dept.Id} className="table-row">
                        <td className="table-cell font-medium">{dept.Name}</td>
                        <td className="table-cell text-sm">{dept.Code}</td>
                        <td className="table-cell text-sm">{dept.CityName ?? '—'}</td>
                        <td className="table-cell text-sm">{getManagerName(dept)}</td>
                        <td className="table-cell text-sm">{headcount.toLocaleString('fa-IR')}</td>
                        <td className="table-cell">
                          <Badge variant={dept.IsActive ? 'success' : 'secondary'}>
                            {dept.IsActive ? 'فعال' : 'غیرفعال'}
                          </Badge>
                        </td>
                        <td className="table-cell">
                          <Link
                            to={`/departments/${encodeURIComponent(dept.Id)}`}
                            className="button"
                            data-variant="outline"
                            data-size="sm"
                          >
                            <Icon name="material-symbols:edit" className="size-4" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="material-symbols:groups" className="size-5 text-indigo-500" />
              توزیع نیروی انسانی
            </CardTitle>
            <CardDescription>تعداد پرسنل در هر بخش</CardDescription>
          </CardHeader>
          <CardContent>
            {deptLoading ? (
              <p className="text-muted-foreground text-sm">در حال بارگذاری...</p>
            ) : headcountByDepartment.length === 0 ? (
              <p className="text-muted-foreground text-sm">بخشی ثبت نشده</p>
            ) : (
              <div className="space-y-3">
                {headcountByDepartment.map((item) => (
                  <div key={item.id}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium">{item.name}</span>
                      <span>{item.count.toLocaleString('fa-IR')} نفر</span>
                    </div>
                    <ProgressBar
                      value={Math.round((item.count / maxHeadcount) * 100)}
                      colorClass={item.isActive ? 'bg-indigo-500' : 'bg-gray-400'}
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="material-symbols:account-tree" className="size-5 text-emerald-500" />
              خلاصه سازمانی
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>بخش‌های دارای مدیر</span>
                <span className="font-medium">{stats.withManager.toLocaleString('fa-IR')}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>بخش‌های بدون پرسنل</span>
                <span className="font-medium">
                  {headcountByDepartment.filter((item) => item.count === 0).length.toLocaleString('fa-IR')}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>میانگین پرسنل هر بخش</span>
                <span className="font-medium">
                  {stats.total > 0
                    ? Math.round(stats.totalEmployees / stats.total).toLocaleString('fa-IR')
                    : '—'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>بیشترین ظرفیت</span>
                <span className="font-medium">
                  {headcountByDepartment[0]
                    ? `${headcountByDepartment[0].name} (${headcountByDepartment[0].count.toLocaleString('fa-IR')})`
                    : '—'}
                </span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link to="/employees" className="button" data-variant="outline">
                <Icon name="material-symbols:badge" className="size-4" />
                پرسنل
              </Link>
              <Link to="/departments/new" className="button" data-variant="default">
                <Icon name="material-symbols:add" className="size-4" />
                بخش جدید
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
