import { useCallback, useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, StatCard } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/contexts/ToastContext';
import { PermissionTreeView } from '@/features/users/PermissionTreeView';
import {
  buildPermissionTree,
  collectDescendantPermissionIds,
  filterPermissionTree,
  permissionIdKey,
  type PermissionTreeNode,
} from '@/lib/permissionTree';
import { getUserDisplayName } from '@/lib/userDisplay';
import {
  createRolePermission,
  createUserRole,
  deleteRolePermission,
  getAllPermissions,
  getAllRolePermissions,
  getAllRoles,
  getAllUsers,
  getAllUserRoles,
  getApiErrorMessage,
  type PermissionDto,
  type RoleDto,
  type RolePermissionDto,
  type UserDto,
  type UserRoleDto,
} from '@/services/api';

export default function PermissionsPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserDto[]>([]);
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [permissions, setPermissions] = useState<PermissionDto[]>([]);
  const [userRoles, setUserRoles] = useState<UserRoleDto[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermissionDto[]>([]);

  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [assignRoleId, setAssignRoleId] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [permissionSearch, setPermissionSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingAccess, setLoadingAccess] = useState(false);
  const [assigningRole, setAssigningRole] = useState(false);
  const [savingPermissionIds, setSavingPermissionIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');

  const permissionTree = useMemo(() => buildPermissionTree(permissions), [permissions]);
  const filteredTree = useMemo(
    () => filterPermissionTree(permissionTree, permissionSearch),
    [permissionTree, permissionSearch],
  );

  const selectedUser = useMemo(
    () => users.find((user) => user.Id === selectedUserId) ?? null,
    [users, selectedUserId],
  );

  const userRoleOptions = useMemo(
    () => roles.filter((role) => userRoles.some((userRole) => userRole.RoleId === role.Id)),
    [roles, userRoles],
  );

  const assignedPermissionIds = useMemo(
    () => new Set(rolePermissions.map((item) => permissionIdKey(item.PermissionId)).filter(Boolean) as string[]),
    [rolePermissions],
  );

  const rolePermissionIdByPermissionId = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of rolePermissions) {
      const permissionId = permissionIdKey(item.PermissionId);
      if (permissionId) map.set(permissionId, item.Id);
    }
    return map;
  }, [rolePermissions]);

  const loadBaseData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [usersResult, rolesResult, permissionsResult] = await Promise.all([
        getAllUsers({ IsActive: true, Pagination: { PageNumber: 1, PageSize: 200 } }),
        getAllRoles({ IsActive: true, Pagination: { PageNumber: 1, PageSize: 100 } }),
        getAllPermissions({ IsActive: true, Pagination: { PageNumber: 1, PageSize: 1000 } }),
      ]);
      setUsers(usersResult.Items ?? []);
      setRoles(rolesResult.Items ?? []);
      setPermissions(permissionsResult.Items ?? []);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const loadUserRoles = useCallback(async (userId: string) => {
    const result = await getAllUserRoles({ UserId: userId, Pagination: { PageNumber: 1, PageSize: 100 } });
    const items = result.Items ?? [];
    setUserRoles(items);
    return items;
  }, []);

  const loadRolePermissions = useCallback(async (roleId: string) => {
    setLoadingAccess(true);
    try {
      const result = await getAllRolePermissions({ RoleId: roleId, Pagination: { PageNumber: 1, PageSize: 2000 } });
      setRolePermissions(result.Items ?? []);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
      setRolePermissions([]);
    } finally {
      setLoadingAccess(false);
    }
  }, [toast]);

  useEffect(() => {
    void loadBaseData();
  }, [loadBaseData]);

  useEffect(() => {
    if (!selectedUserId) {
      setUserRoles([]);
      setSelectedRoleId('');
      setRolePermissions([]);
      return;
    }

    let cancelled = false;
    void (async () => {
      try {
        const items = await loadUserRoles(selectedUserId);
        if (cancelled) return;
        const firstRoleId = items[0]?.RoleId ?? '';
        setSelectedRoleId(firstRoleId);
      } catch (err) {
        if (!cancelled) toast.error(getApiErrorMessage(err));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedUserId, loadUserRoles, toast]);

  useEffect(() => {
    if (!selectedRoleId) {
      setRolePermissions([]);
      return;
    }
    void loadRolePermissions(selectedRoleId);
  }, [selectedRoleId, loadRolePermissions]);

  const filteredUsers = useMemo(() => {
    const query = userSearch.trim().toLowerCase();
    if (!query) return users;
    return users.filter((user) => {
      const name = getUserDisplayName(user).toLowerCase();
      return name.includes(query)
        || user.UserName.toLowerCase().includes(query)
        || (user.Email ?? '').toLowerCase().includes(query);
    });
  }, [users, userSearch]);

  const handleAssignRole = async () => {
    if (!selectedUserId || !assignRoleId) return;
    setAssigningRole(true);
    try {
      await createUserRole({ UserId: selectedUserId, RoleId: assignRoleId });
      setAssignRoleId('');
      const items = await loadUserRoles(selectedUserId);
      if (!selectedRoleId && items[0]) {
        setSelectedRoleId(items[0].RoleId);
      }
      toast.success('نقش با موفقیت به کاربر اختصاص داده شد');
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setAssigningRole(false);
    }
  };

  const markSaving = (ids: string[], saving: boolean) => {
    setSavingPermissionIds((current) => {
      const next = new Set(current);
      ids.forEach((id) => {
        if (saving) next.add(id);
        else next.delete(id);
      });
      return next;
    });
  };

  const handleTogglePermission = async (node: PermissionTreeNode, nextChecked: boolean) => {
    if (!selectedRoleId) return;

    const targetIds = collectDescendantPermissionIds(node);
    markSaving(targetIds, true);

    try {
      if (nextChecked) {
        const missingIds = targetIds.filter((id) => !assignedPermissionIds.has(id));
        await Promise.all(
          missingIds.map((permissionId) => {
            const permission = permissions.find((item) => permissionIdKey(item.Id) === permissionId);
            if (!permission) return Promise.resolve();
            return createRolePermission({ RoleId: selectedRoleId, PermissionId: permission.Id });
          }),
        );
        toast.success('دسترسی‌ها اضافه شدند');
      } else {
        const removableIds = targetIds.filter((id) => assignedPermissionIds.has(id));
        await Promise.all(
          removableIds.map((permissionId) => {
            const rolePermissionId = rolePermissionIdByPermissionId.get(permissionId);
            return rolePermissionId ? deleteRolePermission(rolePermissionId) : Promise.resolve();
          }),
        );
        toast.success('دسترسی‌ها حذف شدند');
      }

      await loadRolePermissions(selectedRoleId);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      markSaving(targetIds, false);
    }
  };

  const effectivePermissionCount = assignedPermissionIds.size;
  const selectedRole = roles.find((role) => role.Id === selectedRoleId) ?? null;

  return (
    <div className="flex-1 p-4 lg:p-6" dir="rtl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">مدیریت دسترسی‌ها</h1>
        <p className="text-muted-foreground">انتخاب کاربر، مدیریت نقش و تنظیم دسترسی‌ها به صورت درختی</p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon="material-symbols:group" iconColor="text-blue-500" label="کاربران فعال" value={loading ? '...' : String(users.length)} />
        <StatCard icon="material-symbols:shield-person" iconColor="text-violet-500" label="نقش‌های سیستم" value={loading ? '...' : String(roles.length)} />
        <StatCard icon="material-symbols:security" iconColor="text-emerald-500" iconBg="#10b98115" label="کل دسترسی‌ها" value={loading ? '...' : String(permissions.length)} />
        <StatCard icon="material-symbols:verified-user" iconColor="text-amber-500" label="دسترسی‌های نقش انتخابی" value={selectedRoleId ? String(effectivePermissionCount) : '—'} />
      </div>

      {error && (
        <p className="text-destructive bg-destructive/10 mb-4 rounded-lg px-3 py-2 text-sm">{error}</p>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Icon name="material-symbols:person-search" className="text-primary size-5" />
              انتخاب کاربر
            </CardTitle>
            <CardDescription>کاربر و نقش موردنظر را برای ویرایش دسترسی‌ها انتخاب کنید</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">جستجوی کاربر</label>
              <Input
                placeholder="نام، موبایل یا ایمیل..."
                value={userSearch}
                onChange={(event) => setUserSearch(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">کاربر</label>
              <Select className="w-full" value={selectedUserId} onChange={(event) => setSelectedUserId(event.target.value)}>
                <option value="">انتخاب کاربر...</option>
                {filteredUsers.map((user) => (
                  <option key={user.Id} value={user.Id}>
                    {getUserDisplayName(user)} ({user.UserName})
                  </option>
                ))}
              </Select>
            </div>

            {selectedUser && (
              <div className="bg-muted/40 rounded-xl border p-3 text-sm">
                <p className="font-medium">{getUserDisplayName(selectedUser)}</p>
                <p className="text-muted-foreground mt-1">{selectedUser.Email ?? selectedUser.UserName}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">نقش برای ویرایش دسترسی</label>
              <Select
                className="w-full"
                value={selectedRoleId}
                onChange={(event) => setSelectedRoleId(event.target.value)}
                disabled={!selectedUserId || userRoleOptions.length === 0}
              >
                <option value="">انتخاب نقش...</option>
                {userRoleOptions.map((role) => (
                  <option key={role.Id} value={role.Id}>{role.Title}</option>
                ))}
              </Select>
            </div>

            {selectedUserId && userRoleOptions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {userRoleOptions.map((role) => (
                  <Badge key={role.Id} variant={role.Id === selectedRoleId ? 'info' : 'secondary'}>
                    {role.Title}
                  </Badge>
                ))}
              </div>
            )}

            {selectedUserId && userRoleOptions.length === 0 && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-800">
                این کاربر هنوز نقشی ندارد. ابتدا یک نقش به او اختصاص دهید.
              </div>
            )}

            <div className="border-t pt-4">
              <label className="mb-2 block text-sm font-medium">افزودن نقش به کاربر</label>
              <div className="flex flex-col gap-2">
                <Select
                  className="w-full"
                  value={assignRoleId}
                  onChange={(event) => setAssignRoleId(event.target.value)}
                  disabled={!selectedUserId}
                >
                  <option value="">انتخاب نقش جدید...</option>
                  {roles
                    .filter((role) => !userRoles.some((userRole) => userRole.RoleId === role.Id))
                    .map((role) => (
                      <option key={role.Id} value={role.Id}>{role.Title}</option>
                    ))}
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  disabled={!selectedUserId || !assignRoleId || assigningRole}
                  onClick={() => void handleAssignRole()}
                >
                  {assigningRole ? 'در حال تخصیص...' : 'تخصیص نقش'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Icon name="material-symbols:account-tree" className="text-primary size-5" />
              درخت دسترسی‌ها
            </CardTitle>
            <CardDescription>
              {selectedRole
                ? `در حال ویرایش دسترسی‌های نقش «${selectedRole.Title}»`
                : 'ابتدا کاربر و نقش را انتخاب کنید'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Icon
                name="material-symbols:search"
                className="text-muted-foreground pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2"
              />
              <Input
                className="pe-10"
                placeholder="جستجو در دسترسی‌ها..."
                value={permissionSearch}
                onChange={(event) => setPermissionSearch(event.target.value)}
                disabled={!selectedRoleId}
              />
            </div>

            {loading ? (
              <p className="text-muted-foreground py-10 text-center text-sm">در حال بارگذاری...</p>
            ) : !selectedUserId ? (
              <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 py-16 text-sm">
                <Icon name="material-symbols:person-outline" className="size-12 opacity-40" />
                برای شروع یک کاربر انتخاب کنید
              </div>
            ) : !selectedRoleId ? (
              <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 py-16 text-sm">
                <Icon name="material-symbols:shield-lock-outline" className="size-12 opacity-40" />
                برای این کاربر ابتدا یک نقش انتخاب یا اختصاص دهید
              </div>
            ) : loadingAccess ? (
              <p className="text-muted-foreground py-10 text-center text-sm">در حال بارگذاری دسترسی‌های نقش...</p>
            ) : (
              <PermissionTreeView
                nodes={filteredTree}
                assignedPermissionIds={assignedPermissionIds}
                disabled={!selectedRoleId}
                savingPermissionIds={savingPermissionIds}
                onToggle={(node, nextChecked) => void handleTogglePermission(node, nextChecked)}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
