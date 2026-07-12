import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { createUser, getApiErrorMessage, searchCities, type CityDto } from '@/services/api';

const GENDER_MALE = 2;
const GENDER_FEMALE = 1;

export default function AddUserPage() {
  const navigate = useNavigate();
  const [cities, setCities] = useState<CityDto[]>([]);
  const [cityId, setCityId] = useState('');
  const [userName, setUserName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState(String(GENDER_MALE));
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    void searchCities({ Name: 'تهران', Pagination: { PageNumber: 1, PageSize: 20 } })
      .then((result) => {
        setCities(result.Items ?? []);
        const tehran = result.Items?.find((c) => c.Name === 'تهران');
        if (tehran) setCityId(tehran.Id);
      })
      .catch(() => {
        // cities optional for form display
      });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!cityId) {
      setError('لطفاً شهر را انتخاب کنید');
      return;
    }

    setIsSaving(true);
    try {
      const created = await createUser({
        CityId: cityId,
        UserName: userName.trim(),
        FirstName: firstName.trim(),
        LastName: lastName.trim(),
        Email: email.trim() || null,
        PhoneNumber: phoneNumber.trim(),
        Password: password,
        Gender: Number(gender),
      });
      navigate(`/users/${encodeURIComponent(created.Id)}`, { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 p-4 lg:p-6" dir="rtl">
      <div className="mx-auto mb-6 max-w-6xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">افزودن کاربر</h1>
            <p className="text-muted-foreground">ساخت حساب کاربری جدید در سیستم HR</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/users" className="button" data-variant="outline">بازگشت</Link>
          </div>
        </div>
      </div>

      <form className="mx-auto max-w-6xl" onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>اطلاعات کاربر</CardTitle>
            <CardDescription>فیلدهای الزامی را تکمیل کنید</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <p className="text-destructive bg-destructive/10 mb-4 rounded-lg px-3 py-2 text-sm">{error}</p>
            )}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium">نام</label>
                <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium">نام خانوادگی</label>
                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label htmlFor="userName" className="text-sm font-medium">نام کاربری (موبایل)</label>
                <Input id="userName" dir="ltr" value={userName} onChange={(e) => setUserName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label htmlFor="phoneNumber" className="text-sm font-medium">شماره تماس</label>
                <Input id="phoneNumber" dir="ltr" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">ایمیل</label>
                <Input id="email" type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label htmlFor="gender" className="text-sm font-medium">جنسیت</label>
                <Select id="gender" className="w-full" value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value={String(GENDER_MALE)}>مرد</option>
                  <option value={String(GENDER_FEMALE)}>زن</option>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="cityId" className="text-sm font-medium">شهر</label>
                <Select id="cityId" className="w-full" value={cityId} onChange={(e) => setCityId(e.target.value)} required>
                  <option value="">انتخاب شهر</option>
                  {cities.map((city) => (
                    <option key={city.Id} value={city.Id}>
                      {city.Name} ({city.ProvinceName})
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">رمز عبور</label>
                <Input id="password" type="password" dir="ltr" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-2">
              <Link to="/users" className="button" data-variant="outline">انصراف</Link>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'در حال ذخیره...' : 'ذخیره کاربر'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
