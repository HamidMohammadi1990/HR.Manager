import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { createDepartment, getApiErrorMessage, searchCities, type CityDto } from '@/services/api';

export default function AddDepartmentPage() {
  const navigate = useNavigate();
  const [cities, setCities] = useState<CityDto[]>([]);
  const [cityId, setCityId] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    void searchCities({ Pagination: { PageNumber: 1, PageSize: 100 } })
      .then((r) => {
        setCities(r.Items ?? []);
        const tehran = r.Items?.find((c) => c.Name === 'تهران');
        if (tehran) setCityId(tehran.Id);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!cityId) { setError('شهر الزامی است'); return; }
    setError('');
    setIsSaving(true);
    try {
      const created = await createDepartment({
        CityId: cityId,
        Name: name.trim(),
        Code: code.trim(),
        PhoneNumber: phoneNumber.trim(),
        Email: email.trim() || null,
        PostalCode: postalCode.trim(),
        Address: address.trim(),
        Description: description.trim() || null,
        IsActive: isActive,
      });
      navigate(`/departments/${encodeURIComponent(created.Id)}`, { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 p-4 lg:p-6" dir="rtl">
      <div className="mx-auto mb-6 max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">بخش جدید</h1>
            <p className="text-muted-foreground">ثبت واحد سازمانی</p>
          </div>
          <Link to="/departments" className="button" data-variant="outline">بازگشت</Link>
        </div>
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>اطلاعات بخش</CardTitle>
              <CardDescription>فیلدهای ستاره‌دار الزامی هستند</CardDescription>
            </CardHeader>
            <CardContent>
              {error && <p className="text-destructive bg-destructive/10 mb-4 rounded-lg px-3 py-2 text-sm">{error}</p>}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">نام بخش</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">کد</label>
                  <Input dir="ltr" value={code} onChange={(e) => setCode(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">شهر</label>
                  <Select className="w-full" value={cityId} onChange={(e) => setCityId(e.target.value)} required>
                    <option value="">انتخاب شهر</option>
                    {cities.map((c) => <option key={c.Id} value={c.Id}>{c.Name} ({c.ProvinceName})</option>)}
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">تلفن</label>
                  <Input dir="ltr" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">ایمیل</label>
                  <Input type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">کد پستی</label>
                  <Input dir="ltr" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium">آدرس</label>
                  <Input value={address} onChange={(e) => setAddress(e.target.value)} required />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium">توضیحات</label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                  فعال
                </label>
              </div>
              <div className="mt-6 flex justify-end">
                <Button type="submit" disabled={isSaving}>{isSaving ? 'در حال ذخیره...' : 'ثبت بخش'}</Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
