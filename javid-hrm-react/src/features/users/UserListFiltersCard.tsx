import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { GENDER_FEMALE, GENDER_MALE } from '@/lib/userDisplay';
import { cn } from '@/lib/utils';
import {
  countActiveUserFilters,
  EMPTY_USER_FILTERS,
  type UserListFilters,
} from '@/features/users/userFilters';

interface UserListFiltersCardProps {
  filters: UserListFilters;
  expanded: boolean;
  onToggleExpanded: () => void;
  onChange: (filters: UserListFilters) => void;
  onReset: () => void;
}

function FilterField({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}

function TriStateSelect({
  value,
  onChange,
  yesLabel,
  noLabel,
}: {
  value: UserListFilters['emailConfirmed'];
  onChange: (value: UserListFilters['emailConfirmed']) => void;
  yesLabel: string;
  noLabel: string;
}) {
  return (
    <Select className="w-full" value={value} onChange={(e) => onChange(e.target.value as UserListFilters['emailConfirmed'])}>
      <option value="">همه</option>
      <option value="yes">{yesLabel}</option>
      <option value="no">{noLabel}</option>
    </Select>
  );
}

export function UserListFiltersCard({
  filters,
  expanded,
  onToggleExpanded,
  onChange,
  onReset,
}: UserListFiltersCardProps) {
  const activeCount = countActiveUserFilters(filters);

  const update = (patch: Partial<UserListFilters>) => {
    onChange({ ...filters, ...patch });
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Icon name="material-symbols:filter-list" className="text-primary size-5" />
            جستجو و فیلتر
            {activeCount > 0 && (
              <Badge variant="info">{activeCount} فیلتر فعال</Badge>
            )}
          </CardTitle>
          <CardDescription>کاربران را بر اساس مشخصات حساب جستجو کنید</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <Button type="button" variant="outline" size="sm" onClick={onReset}>
              <Icon name="material-symbols:filter-alt-off" className="size-4" />
              پاک کردن فیلترها
            </Button>
          )}
          <Button type="button" variant="outline" size="sm" onClick={onToggleExpanded}>
            <Icon
              name={expanded ? 'material-symbols:expand-less' : 'material-symbols:expand-more'}
              className="size-4"
            />
            {expanded ? 'بستن فیلترهای پیشرفته' : 'فیلترهای پیشرفته'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FilterField label="جستجوی سریع" className="sm:col-span-2">
            <div className="relative">
              <Icon
                name="material-symbols:search"
                className="text-muted-foreground pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2"
              />
              <Input
                type="text"
                placeholder="نام، ایمیل یا شماره تماس..."
                className="w-full pe-10"
                value={filters.search}
                onChange={(e) => update({ search: e.target.value })}
              />
            </div>
          </FilterField>

          <FilterField label="وضعیت حساب">
            <Select
              className="w-full"
              value={filters.isActive}
              onChange={(e) => update({ isActive: e.target.value as UserListFilters['isActive'] })}
            >
              <option value="">همه وضعیت‌ها</option>
              <option value="active">فعال</option>
              <option value="inactive">غیرفعال</option>
            </Select>
          </FilterField>

          <FilterField label="جنسیت">
            <Select
              className="w-full"
              value={filters.gender}
              onChange={(e) => update({ gender: e.target.value as UserListFilters['gender'] })}
            >
              <option value="">همه</option>
              <option value={String(GENDER_MALE)}>مرد</option>
              <option value={String(GENDER_FEMALE)}>زن</option>
            </Select>
          </FilterField>
        </div>

        {expanded && (
          <div className="border-border space-y-4 border-t pt-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <FilterField label="نام کاربری (موبایل)">
                <Input
                  type="text"
                  placeholder="مثلاً 09121234567"
                  value={filters.userName}
                  onChange={(e) => update({ userName: e.target.value })}
                />
              </FilterField>

              <FilterField label="نام">
                <Input
                  type="text"
                  placeholder="نام"
                  value={filters.firstName}
                  onChange={(e) => update({ firstName: e.target.value })}
                />
              </FilterField>

              <FilterField label="نام خانوادگی">
                <Input
                  type="text"
                  placeholder="نام خانوادگی"
                  value={filters.lastName}
                  onChange={(e) => update({ lastName: e.target.value })}
                />
              </FilterField>

              <FilterField label="ایمیل">
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={filters.email}
                  onChange={(e) => update({ email: e.target.value })}
                />
              </FilterField>

              <FilterField label="شماره تماس">
                <Input
                  type="tel"
                  placeholder="09121234567"
                  value={filters.phoneNumber}
                  onChange={(e) => update({ phoneNumber: e.target.value })}
                />
              </FilterField>

              <FilterField label="مجوز ورود به سیستم">
                <TriStateSelect
                  value={filters.loginPermission}
                  onChange={(value) => update({ loginPermission: value })}
                  yesLabel="دارای مجوز"
                  noLabel="بدون مجوز"
                />
              </FilterField>

              <FilterField label="تأیید ایمیل">
                <TriStateSelect
                  value={filters.emailConfirmed}
                  onChange={(value) => update({ emailConfirmed: value })}
                  yesLabel="تأیید شده"
                  noLabel="تأیید نشده"
                />
              </FilterField>

              <FilterField label="تأیید شماره موبایل">
                <TriStateSelect
                  value={filters.phoneNumberConfirmed}
                  onChange={(value) => update({ phoneNumberConfirmed: value })}
                  yesLabel="تأیید شده"
                  noLabel="تأیید نشده"
                />
              </FilterField>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { EMPTY_USER_FILTERS };
