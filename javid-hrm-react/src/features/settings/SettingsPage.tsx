import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useDisclosure, useSidebar, useTheme } from '@/hooks';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import {
  GENDER_FEMALE,
  GENDER_MALE,
  genderSelectValue,
  getUserDisplayName,
  getUserInitials,
  normalizeGender,
} from '@/lib/userDisplay';
import {
  loadNotificationPreferences,
  saveNotificationPreferences,
  type NotificationPreferences,
} from '@/lib/notificationPreferences';
import { cn } from '@/lib/utils';
import {
  changePassword,
  getApiErrorMessage,
  getCurrentUser,
  searchCities,
  updateCurrentUserProfile,
  type CityDto,
  type UserDto,
} from '@/services/api';

const colorThemes = [
  'default', 'violet', 'indigo', 'fuchsia', 'pink', 'sky', 'cyan',
  'emerald', 'orange', 'red', 'yellow', 'lime', 'amber',
];

const colorLabels: Record<string, string> = {
  default: 'پیش‌فرض', violet: 'بنفش', indigo: 'نیلی', fuchsia: 'سرخابی',
  pink: 'صورتی', sky: 'آسمانی', cyan: 'فیروزه‌ای', emerald: 'زمردی',
  orange: 'نارنجی', red: 'قرمز', yellow: 'زرد', lime: 'لیمویی', amber: 'کهربایی',
};

const themeLabels: Record<string, string> = {
  system: 'سیستم', dark: 'تاریک', light: 'روشن',
};

function Switch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      className="switch"
      data-state={checked ? 'checked' : 'unchecked'}
      onClick={onChange}
    >
      <span className="switch-thumb" />
    </button>
  );
}

export default function SettingsPage() {
  const { theme, colorTheme, setTheme, setColorTheme } = useTheme();
  const { toggleSidebar, isHidden } = useSidebar();
  const { refreshCurrentUser } = useAuth();
  const { toast } = useToast();

  const [user, setUser] = useState<UserDto | null>(null);
  const [cities, setCities] = useState<CityDto[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cityId, setCityId] = useState('');
  const [gender, setGender] = useState(String(GENDER_MALE));

  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>(
    loadNotificationPreferences,
  );

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const loadProfile = useCallback(async () => {
    setLoadingProfile(true);
    setProfileError('');
    try {
      const [userData, cityData] = await Promise.all([
        getCurrentUser(),
        searchCities({ Pagination: { PageNumber: 1, PageSize: 100 } }),
      ]);
      setUser(userData);
      setCities(cityData.Items ?? []);
      setFirstName(userData.FirstName ?? '');
      setLastName(userData.LastName ?? '');
      setPhoneNumber(userData.PhoneNumber ?? '');
      setCityId(userData.CityId ?? '');
      setGender(genderSelectValue(userData.Gender));
    } catch (err) {
      setProfileError(getApiErrorMessage(err));
    } finally {
      setLoadingProfile(false);
    }
  }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  function updateNotificationPrefs(patch: Partial<NotificationPreferences>) {
    setNotificationPrefs((current) => {
      const next = { ...current, ...patch };
      saveNotificationPreferences(next);
      return next;
    });
    toast.success('تنظیمات اعلان ذخیره شد');
  }

  async function handleSaveProfile(event: FormEvent) {
    event.preventDefault();
    if (!user) return;
    setProfileError('');
    setIsSavingProfile(true);
    try {
      await updateCurrentUserProfile({
        FirstName: firstName.trim(),
        LastName: lastName.trim(),
        PhoneNumber: phoneNumber.trim(),
        CityId: cityId,
        Gender: normalizeGender(gender),
      });
      await loadProfile();
      await refreshCurrentUser();
      toast.success('اطلاعات کاربری با موفقیت ذخیره شد');
    } catch (err) {
      const message = getApiErrorMessage(err);
      setProfileError(message);
      toast.error(message);
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handleChangePassword(event: FormEvent) {
    event.preventDefault();
    setPasswordError('');
    if (!oldPassword.trim() || !newPassword.trim()) {
      setPasswordError('رمز عبور فعلی و جدید الزامی است');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('تکرار رمز عبور جدید مطابقت ندارد');
      return;
    }
    setIsChangingPassword(true);
    try {
      await changePassword({
        OldPassword: oldPassword,
        NewPassword: newPassword,
      });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      await refreshCurrentUser();
      toast.success('رمز عبور با موفقیت تغییر کرد');
    } catch (err) {
      const message = getApiErrorMessage(err);
      setPasswordError(message);
      toast.error(message);
    } finally {
      setIsChangingPassword(false);
    }
  }

  const displayName = user ? getUserDisplayName(user) : 'کاربر';
  const initials = user ? getUserInitials(user) : '—';

  return (
    <div className="flex-1 p-4 lg:p-6" dir="rtl">
      <div className="mx-auto mb-8 max-w-5xl">
        <h1 className="text-2xl font-bold">تنظیمات</h1>
        <p className="text-muted-foreground">شخصی‌سازی پنل و مدیریت حساب کاربری</p>
      </div>

      <div className="mx-auto max-w-5xl space-y-6">
        <Card>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="p-6 lg:p-8">
              <div className="space-y-1">
                <p className="flex items-center gap-2 text-lg font-semibold">
                  <Icon name="material-symbols:palette" className="text-primary size-5" />
                  رنگ
                </p>
                <p className="text-muted-foreground text-sm">شخصی‌سازی رنگ‌های وبسایت</p>
              </div>
            </div>
            <div className="border-t p-6 lg:col-span-2 lg:border-s lg:border-t-0 lg:p-8">
              <div className="mb-8">
                <div className="mb-4 space-y-1">
                  <p className="font-medium">پس‌زمینه</p>
                  <p className="text-muted-foreground text-sm">{themeLabels[theme]}</p>
                </div>
                <div className="flex gap-1">
                  {(['system', 'dark', 'light'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTheme(t)}
                      className={cn(
                        'hover:bg-accent flex size-10 cursor-pointer items-center justify-center rounded-lg transition-all duration-200 ease-in-out',
                        theme === t && 'bg-accent',
                      )}
                    >
                      <Icon
                        name={
                          t === 'system'
                            ? 'material-symbols:computer'
                            : t === 'dark'
                              ? 'material-symbols:dark-mode'
                              : 'material-symbols:light-mode'
                        }
                        className="size-5"
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-4 space-y-1">
                  <p className="font-medium">رنگ سایت</p>
                  <p className="text-muted-foreground text-sm">{colorLabels[colorTheme]}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {colorThemes.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColorTheme(c)}
                      className={cn(`theme-${c} hover:bg-primary/10 flex size-10 items-center justify-center rounded-lg transition-all duration-300`)}
                    >
                      <div className="border-primary flex size-5 items-center justify-center rounded-full border-2">
                        {colorTheme === c && <span className="bg-primary size-2 rounded-full" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="max-lg:hidden">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="p-6 lg:p-8">
              <div className="space-y-1">
                <p className="flex items-center gap-2 text-lg font-semibold">
                  <Icon name="material-symbols:view-sidebar" className="text-primary size-5" />
                  نوار کناری
                </p>
                <p className="text-muted-foreground text-sm">تنظیمات نوار کناری</p>
              </div>
            </div>
            <div className="border-t p-6 lg:col-span-2 lg:border-s lg:border-t-0 lg:p-8">
              <div className="mb-4 space-y-1">
                <p className="font-medium">حالت نمایش</p>
                <p className="text-muted-foreground text-sm">انتخاب حالت نمایش نوار کناری</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="button"
                  data-variant="outline"
                  onClick={toggleSidebar}
                >
                  <Icon
                    name={isHidden ? 'material-symbols:chevron-left' : 'material-symbols:chevron-right'}
                    className="size-5"
                  />
                  {isHidden ? 'باز کردن نوار کناری' : 'بستن نوار کناری'}
                </button>
              </div>
            </div>
          </div>
        </Card>

        <Card id="account">
          <form onSubmit={(e) => void handleSaveProfile(e)}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="p-6 lg:p-8">
                <div className="space-y-1">
                  <p className="flex items-center gap-2 text-lg font-semibold">
                    <Icon name="material-symbols:person" className="text-primary size-5" />
                    حساب کاربری
                  </p>
                  <p className="text-muted-foreground text-sm">ویرایش اطلاعات شخصی شما</p>
                </div>
              </div>
              <div className="border-t p-6 lg:col-span-2 lg:border-s lg:border-t-0 lg:p-8">
                {loadingProfile ? (
                  <p className="text-muted-foreground text-sm">در حال بارگذاری اطلاعات...</p>
                ) : (
                  <>
                    {profileError && (
                      <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                        {profileError}
                      </div>
                    )}
                    <div className="mb-6 flex flex-wrap items-center gap-4">
                      <div className="avatar size-16">
                        <div className="avatar-fallback bg-primary text-primary-foreground text-xl">{initials}</div>
                      </div>
                      <div>
                        <p className="font-medium">{displayName}</p>
                        <p className="text-muted-foreground text-sm">{user?.Email || user?.UserName}</p>
                      </div>
                      <Link to="/profile" className="button ms-auto" data-variant="outline" data-size="sm">
                        مشاهده پروفایل کامل
                      </Link>
                    </div>
                    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="label">نام</label>
                        <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <label className="label">نام خانوادگی</label>
                        <Input value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <label className="label">ایمیل</label>
                        <Input type="email" value={user?.Email ?? ''} disabled />
                        <p className="text-muted-foreground text-xs">تغییر ایمیل از بخش امنیت حساب انجام می‌شود.</p>
                      </div>
                      <div className="space-y-2">
                        <label className="label">شماره تماس</label>
                        <Input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <label className="label">شهر</label>
                        <Select value={cityId} onChange={(e) => setCityId(e.target.value)} required>
                          <option value="">انتخاب شهر</option>
                          {cities.map((city) => (
                            <option key={city.Id} value={city.Id}>{city.Name}</option>
                          ))}
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="label">جنسیت</label>
                        <Select value={gender} onChange={(e) => setGender(e.target.value)}>
                          <option value={String(GENDER_FEMALE)}>زن</option>
                          <option value={String(GENDER_MALE)}>مرد</option>
                        </Select>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" disabled={isSavingProfile}>
                        {isSavingProfile ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => void loadProfile()}>
                        انصراف
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </form>
        </Card>

        <Card id="notifications">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="p-6 lg:p-8">
              <div className="space-y-1">
                <p className="flex items-center gap-2 text-lg font-semibold">
                  <Icon name="material-symbols:notifications" className="text-primary size-5" />
                  اعلان‌ها
                </p>
                <p className="text-muted-foreground text-sm">ترجیحات اعلان‌رسانی در این مرورگر</p>
              </div>
            </div>
            <div className="space-y-4 border-t p-6 lg:col-span-2 lg:border-s lg:border-t-0 lg:p-8">
              <p className="text-muted-foreground text-xs">
                این تنظیمات روی دستگاه فعلی ذخیره می‌شود تا تجربه شما شخصی‌سازی شود.
              </p>
              {[
                {
                  key: 'email' as const,
                  label: 'اعلان ایمیل',
                  desc: 'دریافت اعلان‌ها از طریق ایمیل',
                  checked: notificationPrefs.email,
                },
                {
                  key: 'push' as const,
                  label: 'اعلان پوش',
                  desc: 'دریافت اعلان‌های پوش در مرورگر',
                  checked: notificationPrefs.push,
                },
                {
                  key: 'sms' as const,
                  label: 'اعلان پیامک',
                  desc: 'دریافت پیامک برای اعلان‌های مهم',
                  checked: notificationPrefs.sms,
                },
              ].map((item, i) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-muted-foreground text-sm">{item.desc}</p>
                    </div>
                    <Switch
                      checked={item.checked}
                      onChange={() => updateNotificationPrefs({ [item.key]: !item.checked })}
                    />
                  </div>
                  {i < 2 && <div className="separator-horizontal" />}
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card id="security">
          <form onSubmit={(e) => void handleChangePassword(e)}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="p-6 lg:p-8">
                <div className="space-y-1">
                  <p className="flex items-center gap-2 text-lg font-semibold">
                    <Icon name="material-symbols:security" className="text-primary size-5" />
                    امنیت
                  </p>
                  <p className="text-muted-foreground text-sm">تغییر رمز عبور حساب</p>
                </div>
              </div>
              <div className="space-y-6 border-t p-6 lg:col-span-2 lg:border-s lg:border-t-0 lg:p-8">
                {passwordError && (
                  <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {passwordError}
                  </div>
                )}
                <div className="space-y-4">
                  <h3 className="font-medium">تغییر رمز عبور</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                      <label className="label">رمز عبور فعلی</label>
                      <Input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="label">رمز عبور جدید</label>
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="label">تکرار رمز عبور جدید</label>
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={isChangingPassword}>
                    {isChangingPassword ? 'در حال تغییر...' : 'تغییر رمز عبور'}
                  </Button>
                </div>
                <div className="separator-horizontal" />
                <div className="space-y-2">
                  <h3 className="font-medium">بازیابی رمز عبور</h3>
                  <p className="text-muted-foreground text-sm">
                    اگر رمز عبور را فراموش کرده‌اید، از صفحه بازیابی استفاده کنید.
                  </p>
                  <Link to="/forgot-password" className="button" data-variant="outline">
                    رفتن به بازیابی رمز
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
