import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import {
  formatDateTime,
  GENDER_FEMALE,
  GENDER_MALE,
  genderSelectValue,
  getUserDisplayName,
  normalizeGender,
} from '@/lib/userDisplay';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  getApiErrorMessage,
  getCurrentUser,
  updateUser,
  type UserDto,
} from '@/services/api';

export default function AccountSettingsPage() {
  const { toast } = useToast();
  const { refreshCurrentUser } = useAuth();
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState(String(GENDER_MALE));
  const [password, setPassword] = useState('');

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
    setError('');
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
        Password: password.trim() || null,
      });
      setPassword('');
      toast.success('تغییرات با موفقیت ذخیره شد');
      await loadUser();
      await refreshCurrentUser();
    } catch (err) {
      const message = getApiErrorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex-1 p-4 lg:p-6" dir="rtl">
      <div className="mx-auto mb-6 max-w-6xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">تنظیمات حساب</h1>
            <p className="text-muted-foreground">مدیریت امنیت و تنظیمات حساب کاربری</p>
          </div>
          <Link to="/profile" className="button" data-variant="outline">مشاهده پروفایل</Link>
        </div>
      </div>

      <div className="mx-auto max-w-6xl">
        {loading ? (
          <p className="text-muted-foreground py-12 text-center text-sm">در حال بارگذاری...</p>
        ) : (
          <form className="space-y-6" onSubmit={(e) => void handleSave(e)}>
            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
            )}

            <Card>
              <CardHeader>
                <CardTitle>اطلاعات اصلی</CardTitle>
                <CardDescription>تنظیمات عمومی حساب کاربری</CardDescription>
              </CardHeader>
              <CardContent>
                {user && (
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <Badge variant={user.IsActive ? 'success' : 'secondary'}>
                      {user.IsActive ? 'فعال' : 'غیرفعال'}
                    </Badge>
                    <span className="text-muted-foreground text-sm">{getUserDisplayName(user)}</span>
                    <span className="text-muted-foreground text-sm">• آخرین ورود: {formatDateTime(user.LastLoginDateOnUtc)}</span>
                  </div>
                )}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="f-first" className="text-sm font-medium">نام</label>
                    <Input id="f-first" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="f-last" className="text-sm font-medium">نام خانوادگی</label>
                    <Input id="f-last" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="f-username" className="text-sm font-medium">نام کاربری</label>
                    <Input id="f-username" value={userName} onChange={(e) => setUserName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="f-email" className="text-sm font-medium">ایمیل</label>
                    <Input id="f-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="f-phone" className="text-sm font-medium">شماره تماس</label>
                    <Input id="f-phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="f-gender" className="text-sm font-medium">جنسیت</label>
                    <Select id="f-gender" value={gender} onChange={(e) => setGender(e.target.value)}>
                      <option value={String(GENDER_FEMALE)}>زن</option>
                      <option value={String(GENDER_MALE)}>مرد</option>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>امنیت</CardTitle>
                <CardDescription>تغییر رمز عبور (اختیاری)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <label htmlFor="f-password" className="text-sm font-medium">رمز عبور جدید</label>
                  <Input
                    id="f-password"
                    type="password"
                    placeholder="در صورت عدم تغییر خالی بگذارید"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-end gap-2">
              <Link to="/reset-password" className="button" data-variant="outline">بازیابی رمز عبور</Link>
              <Button variant="default" type="submit" disabled={isSaving}>
                {isSaving ? 'در حال ذخیره...' : 'ذخیره'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
