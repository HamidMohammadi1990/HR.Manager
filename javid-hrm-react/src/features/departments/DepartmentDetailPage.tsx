import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Dialog } from '@/components/layout/Dialog';
import { useDisclosure } from '@/hooks';
import {
  deleteDepartment,
  getApiErrorMessage,
  getDepartment,
  searchCities,
  updateDepartment,
  type CityDto,
  type DepartmentDto,
} from '@/services/api';

export default function DepartmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const deleteDialog = useDisclosure();
  const [department, setDepartment] = useState<DepartmentDto | null>(null);
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const [dept, cityRes] = await Promise.all([
          getDepartment({ Id: decodeURIComponent(id) }),
          searchCities({ Pagination: { PageNumber: 1, PageSize: 100 } }),
        ]);
        if (cancelled) return;
        setDepartment(dept);
        setCities(cityRes.Items ?? []);
        setCityId(dept.CityId);
        setName(dept.Name);
        setCode(dept.Code);
        setPhoneNumber(dept.PhoneNumber ?? '');
        setEmail(dept.Email ?? '');
        setPostalCode(dept.PostalCode ?? '');
        setAddress(dept.Address);
        setDescription(dept.Description ?? '');
        setIsActive(dept.IsActive);
      } catch (err) {
        if (!cancelled) setError(getApiErrorMessage(err));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void load();
    return () => { cancelled = true; };
  }, [id]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!department) return;
    setFormError('');
    setIsSaving(true);
    try {
      await updateDepartment({
        Id: department.Id,
        CityId: cityId,
        Name: name.trim(),
        Code: code.trim(),
        PhoneNumber: phoneNumber.trim(),
        Email: email.trim(),
        PostalCode: postalCode.trim(),
        Address: address.trim(),
        Description: description.trim(),
        IsActive: isActive,
      });
      const refreshed = await getDepartment({ Id: department.Id });
      setDepartment(refreshed);
    } catch (err) {
      setFormError(getApiErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!department) return;
    try {
      await deleteDepartment(department.Id);
      deleteDialog.close();
      navigate('/departments', { replace: true });
    } catch (err) {
      setFormError(getApiErrorMessage(err));
      deleteDialog.close();
    }
  };

  if (isLoading) return <div className="flex flex-1 items-center justify-center p-12"><p className="text-muted-foreground text-sm">در حال بارگذاری...</p></div>;
  if (error || !department) return <div className="flex-1 p-6"><p className="text-destructive mb-4">{error || 'بخش یافت نشد'}</p><Link to="/departments" className="button" data-variant="outline">بازگشت</Link></div>;

  return (
    <div className="flex-1 p-4 lg:p-6" dir="rtl">
      <div className="mb-6 flex justify-between gap-4">
        <div>
          <div className="text-muted-foreground mb-2 flex items-center gap-2 text-sm">
            <Link to="/departments" className="hover:underline">بخش‌ها</Link><span>/</span><span>جزئیات</span>
          </div>
          <h1 className="text-2xl font-bold">{department.Name}</h1>
          <Badge variant={department.IsActive ? 'success' : 'secondary'} className="mt-2">
            {department.IsActive ? 'فعال' : 'غیرفعال'}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Link to="/departments" className="button" data-variant="outline">بستن</Link>
          <Button variant="destructive" onClick={deleteDialog.open}>حذف</Button>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <Card>
          <CardHeader><CardTitle>ویرایش بخش</CardTitle><CardDescription>کد: {department.Code}</CardDescription></CardHeader>
          <CardContent>
            {formError && <p className="text-destructive bg-destructive/10 mb-4 rounded-lg px-3 py-2 text-sm">{formError}</p>}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2"><label className="text-sm font-medium">نام</label><Input value={name} onChange={(e) => setName(e.target.value)} required /></div>
              <div className="space-y-2"><label className="text-sm font-medium">کد</label><Input dir="ltr" value={code} onChange={(e) => setCode(e.target.value)} required /></div>
              <div className="space-y-2">
                <label className="text-sm font-medium">شهر</label>
                <Select className="w-full" value={cityId} onChange={(e) => setCityId(e.target.value)} required>
                  {cities.map((c) => <option key={c.Id} value={c.Id}>{c.Name}</option>)}
                </Select>
              </div>
              <div className="space-y-2"><label className="text-sm font-medium">تلفن</label><Input dir="ltr" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} /></div>
              <div className="space-y-2"><label className="text-sm font-medium">ایمیل</label><Input dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
              <div className="space-y-2"><label className="text-sm font-medium">کد پستی</label><Input dir="ltr" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} /></div>
              <div className="space-y-2 sm:col-span-2"><label className="text-sm font-medium">آدرس</label><Input value={address} onChange={(e) => setAddress(e.target.value)} required /></div>
              <div className="space-y-2 sm:col-span-2"><label className="text-sm font-medium">توضیحات</label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} /></div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />فعال
              </label>
            </div>
            <div className="mt-6 flex justify-end"><Button type="submit" disabled={isSaving}>{isSaving ? 'ذخیره...' : 'ذخیره'}</Button></div>
          </CardContent>
        </Card>
      </form>

      <Dialog open={deleteDialog.isOpen} onClose={deleteDialog.close} className="max-w-md">
        <button type="button" className="dialog-close" onClick={deleteDialog.close}><Icon name="material-symbols:close" className="size-4" /></button>
        <div className="dialog-header"><h3 className="dialog-title">حذف بخش</h3><p className="dialog-description">بخش {department.Name} حذف می‌شود.</p></div>
        <div className="dialog-footer">
          <Button variant="outline" onClick={deleteDialog.close}>انصراف</Button>
          <Button variant="destructive" onClick={() => void handleDelete()}>تأیید</Button>
        </div>
      </Dialog>
    </div>
  );
}
