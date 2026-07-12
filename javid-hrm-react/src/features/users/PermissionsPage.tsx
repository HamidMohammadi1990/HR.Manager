import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, StatCard } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { getAllPermissions, getApiErrorMessage, type PermissionDto } from '@/services/api';

const LEVEL_TAB = 2;
const LEVEL_PAGE = 3;
const LEVEL_ACTION = 4;

function groupByLevel(permissions: PermissionDto[]) {
  return {
    tabs: permissions.filter((p) => p.LevelTypeId === LEVEL_TAB),
    pages: permissions.filter((p) => p.LevelTypeId === LEVEL_PAGE),
    actions: permissions.filter((p) => p.LevelTypeId === LEVEL_ACTION),
    other: permissions.filter(
      (p) => p.LevelTypeId !== LEVEL_TAB && p.LevelTypeId !== LEVEL_PAGE && p.LevelTypeId !== LEVEL_ACTION,
    ),
  };
}

function PermissionTable({ items, title }: { items: PermissionDto[]; title: string }) {
  if (items.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{items.length} مورد</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="table-wrapper">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-head">عنوان</th>
                <th className="table-head">سطح</th>
                <th className="table-head">URL</th>
                <th className="table-head">وضعیت</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {items.map((item) => (
                <tr key={`${item.Id}-${item.Title}`} className="table-row">
                  <td className="table-cell font-medium">{item.Title}</td>
                  <td className="table-cell text-sm">{item.LevelTypeTitle}</td>
                  <td className="table-cell text-muted-foreground text-xs" dir="ltr">{item.Url || '—'}</td>
                  <td className="table-cell">
                    <Badge variant={item.IsActive ? 'success' : 'secondary'}>
                      {item.IsActive ? 'فعال' : 'غیرفعال'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<PermissionDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    void getAllPermissions({ Pagination: { PageNumber: 1, PageSize: 500 } })
      .then((result) => setPermissions(result.Items ?? []))
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setIsLoading(false));
  }, []);

  const grouped = useMemo(() => groupByLevel(permissions), [permissions]);
  const activeCount = permissions.filter((p) => p.IsActive).length;

  return (
    <div className="flex-1 p-4 lg:p-6" dir="rtl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">مدیریت دسترسی‌ها</h1>
        <p className="text-muted-foreground">لیست دسترسی‌های ثبت‌شده در سیستم (از API)</p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon="material-symbols:security" iconColor="text-blue-500" label="کل دسترسی‌ها" value={String(permissions.length)} />
        <StatCard icon="material-symbols:verified" iconColor="text-emerald-500" iconBg="#10b98115" label="فعال" value={String(activeCount)} />
        <StatCard icon="material-symbols:folder" iconColor="text-violet-500" label="گروه‌ها (Tab)" value={String(grouped.tabs.length)} />
        <StatCard icon="material-symbols:touch-app" iconColor="text-amber-500" label="عملیات (Action)" value={String(grouped.actions.length)} />
      </div>

      {error && (
        <p className="text-destructive bg-destructive/10 mb-4 rounded-lg px-3 py-2 text-sm">{error}</p>
      )}

      {isLoading ? (
        <p className="text-muted-foreground text-sm">در حال بارگذاری دسترسی‌ها...</p>
      ) : (
        <div className="space-y-6">
          <PermissionTable items={grouped.tabs} title="گروه‌های دسترسی (Tab)" />
          <PermissionTable items={grouped.pages} title="صفحات (Page)" />
          <PermissionTable items={grouped.actions} title="عملیات (Action)" />
          <PermissionTable items={grouped.other} title="سایر" />
        </div>
      )}
    </div>
  );
}
