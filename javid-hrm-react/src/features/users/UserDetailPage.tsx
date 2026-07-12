import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Dialog } from '@/components/layout/Dialog';
import { useDisclosure } from '@/hooks';
import {
  deleteUser,
  getApiErrorMessage,
  getUser,
  searchCities,
  updateUser,
  getAllUserRoles,
  getAllRoles,
  createUserRole,
  deleteUserRole,
  type CityDto,
  type UserDto,
  type UserRoleDto,
  type RoleDto,
} from '@/services/api';
import { formatDateTime, getUserDisplayName, getUserInitials } from '@/lib/userDisplay';

const GENDER_MALE = 2;
const GENDER_FEMALE = 1;

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const deleteDialog = useDisclosure();
  const [user, setUser] = useState<UserDto | null>(null);
  const [cities, setCities] = useState<CityDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cityId, setCityId] = useState('');
  const [gender, setGender] = useState(String(GENDER_MALE));
  const [isActive, setIsActive] = useState(true);
  const [loginPermission, setLoginPermission] = useState(true);
  const [password, setPassword] = useState('');
  const [userRoles, setUserRoles] = useState<UserRoleDto[]>([]);
  const [allRoles, setAllRoles] = useState<RoleDto[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [rolesError, setRolesError] = useState('');
  const [isAssigningRole, setIsAssigningRole] = useState(false);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError('');
      try {
        const [userData, cityData, rolesData, allRolesData] = await Promise.all([
          getUser({ Id: decodeURIComponent(id) }),
          searchCities({ Pagination: { PageNumber: 1, PageSize: 100 } }),
          getAllUserRoles({ UserId: decodeURIComponent(id), Pagination: { PageNumber: 1, PageSize: 50 } }),
          getAllRoles({ IsActive: true, Pagination: { PageNumber: 1, PageSize: 100 } }),
        ]);
        if (cancelled) return;

        setUser(userData);
        setCities(cityData.Items ?? []);
        setUserRoles(rolesData.Items ?? []);
        setAllRoles(allRolesData.Items ?? []);
        setFirstName(userData.FirstName ?? '');
        setLastName(userData.LastName ?? '');
        setUserName(userData.UserName);
        setEmail(userData.Email ?? '');
        setPhoneNumber(userData.PhoneNumber ?? '');
        setCityId(userData.CityId ?? '');
        setGender(String(userData.Gender ?? GENDER_MALE));
        setIsActive(userData.IsActive);
        setLoginPermission(userData.LoginPermission);
      } catch (err) {
        if (!cancelled) setError(getApiErrorMessage(err));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setFormError('');
    setIsSaving(true);
    try {
      await updateUser({
        Id: user.Id,
        CityId: cityId,
        UserName: userName.trim(),
        FirstName: firstName.trim(),
        LastName: lastName.trim(),
        Email: email.trim() || null,
        PhoneNumber: phoneNumber.trim(),
        Gender: Number(gender),
        IsActive: isActive,
        LoginPermission: loginPermission,
        Password: password.trim() || null,
      });
      setPassword('');
      const refreshed = await getUser({ Id: user.Id });
      setUser(refreshed);
    } catch (err) {
      setFormError(getApiErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleAssignRole = async () => {
    if (!user || !selectedRoleId) return;
    setRolesError('');
    setIsAssigningRole(true);
    try {
      await createUserRole({ UserId: user.Id, RoleId: selectedRoleId });
      setSelectedRoleId('');
      const refreshed = await getAllUserRoles({ UserId: user.Id, Pagination: { PageNumber: 1, PageSize: 50 } });
      setUserRoles(refreshed.Items ?? []);
    } catch (err) {
      setRolesError(getApiErrorMessage(err));
    } finally {
      setIsAssigningRole(false);
    }
  };

  const handleRemoveRole = async (userRoleId: string) => {
    if (!user) return;
    setRolesError('');
    try {
      await deleteUserRole(userRoleId);
      const refreshed = await getAllUserRoles({ UserId: user.Id, Pagination: { PageNumber: 1, PageSize: 50 } });
      setUserRoles(refreshed.Items ?? []);
    } catch (err) {
      setRolesError(getApiErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    try {
      await deleteUser(user.Id);
      deleteDialog.close();
      navigate('/users', { replace: true });
    } catch (err) {
      setFormError(getApiErrorMessage(err));
      deleteDialog.close();
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-12">
        <p className="text-muted-foreground text-sm">در حال بارگذاری...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex-1 p-6">
        <p className="text-destructive mb-4">{error || 'کاربر یافت نشد'}</p>
        <Link to="/users" className="button" data-variant="outline">بازگشت به لیست</Link>
      </div>
    );
  }

  const displayName = getUserDisplayName(user);

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
              <div className="avatar-fallback bg-primary/10 text-primary text-sm">{getUserInitials(user)}</div>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{displayName}</h1>
              <p className="text-muted-foreground">{user.Email ?? user.UserName}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant={user.IsActive ? 'success' : 'secondary'}>
              {user.IsActive ? 'فعال' : 'غیرفعال'}
            </Badge>
            <span className="text-muted-foreground text-sm">
              آخرین ورود: {formatDateTime(user.LastLoginDateOnUtc)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/users" className="button" data-variant="outline">
            <Icon name="material-symbols:close" className="size-5" />
            بستن
          </Link>
          <Button variant="destructive" onClick={deleteDialog.open}>
            <Icon name="material-symbols:delete" className="size-5" />
            حذف
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <Card>
          <CardHeader>
            <CardTitle>ویرایش کاربر</CardTitle>
            <CardDescription>اطلاعات حساب کاربری را به‌روزرسانی کنید</CardDescription>
          </CardHeader>
          <CardContent>
            {formError && (
              <p className="text-destructive bg-destructive/10 mb-4 rounded-lg px-3 py-2 text-sm">{formError}</p>
            )}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">نام</label>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">نام خانوادگی</label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">نام کاربری</label>
                <Input dir="ltr" value={userName} onChange={(e) => setUserName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">شماره تماس</label>
                <Input dir="ltr" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">ایمیل</label>
                <Input type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">شهر</label>
                <Select className="w-full" value={cityId} onChange={(e) => setCityId(e.target.value)} required>
                  <option value="">انتخاب شهر</option>
                  {cities.map((city) => (
                    <option key={city.Id} value={city.Id}>
                      {city.Name} ({city.ProvinceName})
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">جنسیت</label>
                <Select className="w-full" value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value={String(GENDER_MALE)}>مرد</option>
                  <option value={String(GENDER_FEMALE)}>زن</option>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">رمز عبور جدید (اختیاری)</label>
                <Input type="password" dir="ltr" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="flex items-center gap-6 sm:col-span-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                  فعال
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="checkbox" checked={loginPermission} onChange={(e) => setLoginPermission(e.target.checked)} />
                  مجوز ورود
                </label>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>نقش‌های کاربر</CardTitle>
          <CardDescription>تخصیص و حذف نقش‌های دسترسی</CardDescription>
        </CardHeader>
        <CardContent>
          {rolesError && <p className="text-destructive bg-destructive/10 mb-4 rounded-lg px-3 py-2 text-sm">{rolesError}</p>}
          <div className="mb-4 flex flex-wrap gap-2">
            {userRoles.length === 0 ? (
              <p className="text-muted-foreground text-sm">نقشی تخصیص داده نشده</p>
            ) : (
              userRoles.map((ur) => (
                <div key={ur.Id} className="flex items-center gap-2 rounded-lg border px-3 py-1.5">
                  <Badge variant="secondary">{ur.RoleTitle}</Badge>
                  <button type="button" className="text-destructive hover:underline text-xs" onClick={() => void handleRemoveRole(ur.Id)}>
                    حذف
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[200px] flex-1 space-y-2">
              <label className="text-sm font-medium">افزودن نقش</label>
              <Select className="w-full" value={selectedRoleId} onChange={(e) => setSelectedRoleId(e.target.value)}>
                <option value="">انتخاب نقش</option>
                {allRoles
                  .filter((r) => !userRoles.some((ur) => ur.RoleId === r.Id))
                  .map((r) => (
                    <option key={r.Id} value={r.Id}>{r.Title}</option>
                  ))}
              </Select>
            </div>
            <Button type="button" disabled={!selectedRoleId || isAssigningRole} onClick={() => void handleAssignRole()}>
              {isAssigningRole ? 'در حال تخصیص...' : 'تخصیص نقش'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={deleteDialog.isOpen} onClose={deleteDialog.close} className="max-w-md">
        <button type="button" className="dialog-close" onClick={deleteDialog.close}>
          <Icon name="material-symbols:close" className="size-4" />
        </button>
        <div className="dialog-header">
          <h3 className="dialog-title">غیرفعال‌سازی کاربر</h3>
          <p className="dialog-description">
            کاربر {displayName} غیرفعال می‌شود. این عمل قابل بازگشت است.
          </p>
        </div>
        <div className="dialog-footer">
          <Button variant="outline" onClick={deleteDialog.close}>انصراف</Button>
          <Button variant="destructive" onClick={() => void handleDelete()}>تأیید</Button>
        </div>
      </Dialog>
    </div>
  );
}
