import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Dialog } from '@/components/layout/Dialog';
import { useDisclosure } from '@/hooks';
import { useToast } from '@/contexts/ToastContext';
import {
  formatDateTime,
  GENDER_FEMALE,
  GENDER_MALE,
  genderSelectValue,
  getUserDisplayName,
  getUserInitials,
  normalizeGender,
} from '@/lib/userDisplay';
import { useAuth } from '@/contexts/AuthContext';
import {
  getApiErrorMessage,
  getCurrentUser,
  updateUser,
  type UserDto,
} from '@/services/api';

export default function ProfilePage() {
  const editDialog = useDisclosure();
  const { toast } = useToast();
  const { refreshCurrentUser } = useAuth();
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState(String(GENDER_MALE));

  const loadUser = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const userData = await getCurrentUser();
      setUser(userData);
      setFirstName(userData.FirstName ?? '');
      setLastName(userData.LastName ?? '');
      setUserName(userData.UserName);
      setEmail(userData.Email ?? '');
      setPhoneNumber(userData.PhoneNumber ?? '');
      setGender(genderSelectValue(userData.Gender));
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUser();
  }, [loadUser]);

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    if (!user) return;
    setFormError('');
    setIsSaving(true);
    try {
      await updateUser({
        Id: user.Id,
        UserName: userName.trim(),
        FirstName: firstName.trim(),
        LastName: lastName.trim(),
        Email: email.trim() || null,
        PhoneNumber: phoneNumber.trim(),
        Gender: normalizeGender(gender),
        IsActive: user.IsActive,
        LoginPermission: user.LoginPermission,
      });
      editDialog.close();
      await loadUser();
      await refreshCurrentUser();
      toast.success('پروفایل با موفقیت به‌روزرسانی شد');
    } catch (err) {
      const message = getApiErrorMessage(err);
      setFormError(message);
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-12" dir="rtl">
        <p className="text-muted-foreground text-sm">در حال بارگذاری پروفایل...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-1 items-center justify-center p-12" dir="rtl">
        <p className="text-destructive text-sm">{error || 'پروفایل یافت نشد'}</p>
      </div>
    );
  }

  const displayName = getUserDisplayName(user);
  const initials = getUserInitials(user);

  return (
    <div className="flex-1 p-4 lg:p-6" dir="rtl">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">پروفایل</h1>
            <p className="text-muted-foreground">مرکز کنترل هویت و اطلاعات شخصی</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/account-settings" className="button" data-variant="outline">
              <Icon name="material-symbols:settings" className="size-4" />
              تنظیمات حساب
            </Link>
            <Button variant="secondary" onClick={editDialog.open}>
              <Icon name="material-symbols:edit" className="size-4" />
              ویرایش
            </Button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
        )}

        <section className="bg-card overflow-hidden rounded-2xl border">
          <div className="relative">
            <div className="from-primary/15 via-background h-28 bg-linear-to-br to-emerald-500/15 sm:h-32" />
            <div className="-mt-10 p-4 sm:-mt-12 sm:p-5">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex items-end gap-4">
                  <div className="bg-card ring-background flex size-20 items-center justify-center rounded-2xl border shadow-xs ring-4 sm:size-24">
                    <span className="text-primary text-2xl font-bold">{initials}</span>
                  </div>
                  <div className="pb-1">
                    <p className="text-xl font-bold">{displayName}</p>
                    <p className="text-muted-foreground text-sm">{user.Email || user.UserName}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant={user.IsActive ? 'success' : 'secondary'}>
                        {user.IsActive ? 'فعال' : 'غیرفعال'}
                      </Badge>
                      {user.CityName && <Badge variant="secondary">{user.CityName}</Badge>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-card rounded-2xl border p-4 sm:p-5">
          <p className="mb-4 font-semibold">اطلاعات حساب</p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="bg-muted/20 rounded-xl border p-4">
              <p className="text-muted-foreground text-xs">نام کاربری</p>
              <p className="mt-1 font-medium">{user.UserName}</p>
            </div>
            <div className="bg-muted/20 rounded-xl border p-4">
              <p className="text-muted-foreground text-xs">شماره تماس</p>
              <p className="mt-1 font-medium">{user.PhoneNumber || '—'}</p>
            </div>
            <div className="bg-muted/20 rounded-xl border p-4">
              <p className="text-muted-foreground text-xs">ایمیل</p>
              <p className="mt-1 font-medium">{user.Email || '—'}</p>
            </div>
            <div className="bg-muted/20 rounded-xl border p-4">
              <p className="text-muted-foreground text-xs">آخرین ورود</p>
              <p className="mt-1 font-medium">{formatDateTime(user.LastLoginDateOnUtc)}</p>
            </div>
            <div className="bg-muted/20 rounded-xl border p-4">
              <p className="text-muted-foreground text-xs">تأیید ایمیل</p>
              <p className="mt-1 font-medium">{user.EmailConfirmed ? 'بله' : 'خیر'}</p>
            </div>
            <div className="bg-muted/20 rounded-xl border p-4">
              <p className="text-muted-foreground text-xs">تأیید موبایل</p>
              <p className="mt-1 font-medium">{user.PhoneNumberConfirmed ? 'بله' : 'خیر'}</p>
            </div>
          </div>
        </section>
      </div>

      <Dialog open={editDialog.isOpen} onClose={editDialog.close}>
        <form onSubmit={(e) => void handleSave(e)}>
          <button type="button" className="dialog-close" onClick={editDialog.close}>
            <Icon name="material-symbols:close" className="size-4" />
          </button>
          <div className="dialog-header">
            <h3 className="dialog-title">ویرایش پروفایل</h3>
            <p className="dialog-description">فقط فیلدهای ضروری را تغییر دهید.</p>
          </div>
          <div className="space-y-4 py-4">
            {formError && <p className="text-destructive text-sm">{formError}</p>}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="label">نام</label>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label className="label">نام خانوادگی</label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="label">نام کاربری</label>
                <Input value={userName} onChange={(e) => setUserName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label className="label">ایمیل</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="label">شماره تماس</label>
                <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="label">جنسیت</label>
              <Select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value={String(GENDER_FEMALE)}>زن</option>
                <option value={String(GENDER_MALE)}>مرد</option>
              </Select>
            </div>
          </div>
          <div className="dialog-footer">
            <Button type="button" variant="outline" onClick={editDialog.close}>انصراف</Button>
            <Button type="submit" disabled={isSaving}>{isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
