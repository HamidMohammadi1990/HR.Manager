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
  getAllDepartments,
  getAllWorkShifts,
  getApiErrorMessage,
  getDepartment,
  updateDepartment,
  type DepartmentDto,
  type WorkShiftDto,
} from '@/services/api';

export default function DepartmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const deleteDialog = useDisclosure();
  const [department, setDepartment] = useState<DepartmentDto | null>(null);
  const [departments, setDepartments] = useState<DepartmentDto[]>([]);
  const [workShifts, setWorkShifts] = useState<WorkShiftDto[]>([]);
  const [parentDepartmentId, setParentDepartmentId] = useState('');
  const [defaultWorkShiftId, setDefaultWorkShiftId] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
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
        const [dept, deptList, shiftList] = await Promise.all([
          getDepartment({ Id: decodeURIComponent(id) }),
          getAllDepartments({ Pagination: { PageNumber: 1, PageSize: 200 } }),
          getAllWorkShifts({ IsActive: true, Pagination: { PageNumber: 1, PageSize: 100 } }),
        ]);
        if (cancelled) return;
        setDepartment(dept);
        setDepartments((deptList.Items ?? []).filter((item) => item.Id !== dept.Id));
        setWorkShifts(shiftList.Items ?? []);
        setParentDepartmentId(dept.ParentDepartmentId ?? '');
        setDefaultWorkShiftId(dept.DefaultWorkShiftId ?? '');
        setName(dept.Name);
        setCode(dept.Code);
        setDescription(dept.Description ?? '');
        setIsActive(dept.IsActive);
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
    if (!department) return;
    setFormError('');
    setIsSaving(true);
    try {
      await updateDepartment({
        Id: department.Id,
        Name: name.trim(),
        Code: code.trim(),
        Description: description.trim() || null,
        ParentDepartmentId: parentDepartmentId || null,
        DefaultWorkShiftId: defaultWorkShiftId || null,
        IsActive: isActive,
      });
      const refreshed = await getDepartment({ Id: department.Id });
      setDepartment(refreshed);
      setDepartments((prev) => prev.filter((item) => item.Id !== refreshed.Id));
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

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-12">
        <p className="text-muted-foreground text-sm">در حال بارگذاری...</p>
      </div>
    );
  }

  if (error || !department) {
    return (
      <div className="flex-1 p-6">
        <p className="text-destructive mb-4">{error || 'دپارتمان یافت نشد'}</p>
        <Link to="/departments" className="button" data-variant="outline">بازگشت</Link>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 lg:p-6" dir="rtl">
      <div className="mb-6 flex justify-between gap-4">
        <div>
          <div className="text-muted-foreground mb-2 flex items-center gap-2 text-sm">
            <Link to="/departments" className="hover:underline">دپارتمان‌ها</Link>
            <span>/</span>
            <span>جزئیات</span>
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

      <form onSubmit={(event) => void handleSave(event)}>
        <Card>
          <CardHeader>
            <CardTitle>ویرایش دپارتمان</CardTitle>
            <CardDescription>کد: {department.Code}</CardDescription>
          </CardHeader>
          <CardContent>
            {formError && (
              <p className="text-destructive bg-destructive/10 mb-4 rounded-lg px-3 py-2 text-sm">
                {formError}
              </p>
            )}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium">نام دپارتمان</label>
                <Input value={name} onChange={(event) => setName(event.target.value)} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">کد</label>
                <Input dir="ltr" value={code} onChange={(event) => setCode(event.target.value)} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">دپارتمان والد</label>
                <Select
                  className="w-full"
                  value={parentDepartmentId}
                  onChange={(event) => setParentDepartmentId(event.target.value)}
                >
                  <option value="">بدون والد (دپارتمان اصلی)</option>
                  {departments.map((item) => (
                    <option key={item.Id} value={item.Id}>
                      {item.Name}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">شیفت پیش‌فرض</label>
                <Select
                  className="w-full"
                  value={defaultWorkShiftId}
                  onChange={(event) => setDefaultWorkShiftId(event.target.value)}
                >
                  <option value="">بدون شیفت پیش‌فرض</option>
                  {workShifts.map((shift) => (
                    <option key={shift.Id} value={shift.Id}>{shift.Name}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium">توضیحات</label>
                <Textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={3}
                />
              </div>
              <label className="flex items-center gap-2 text-sm sm:col-span-2">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={isActive}
                  onChange={(event) => setIsActive(event.target.checked)}
                />
                فعال
              </label>
            </div>
            <div className="mt-6 flex justify-end">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'ذخیره...' : 'ذخیره تغییرات'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      <Dialog open={deleteDialog.isOpen} onClose={deleteDialog.close} className="max-w-md">
        <button type="button" className="dialog-close" onClick={deleteDialog.close}>
          <Icon name="material-symbols:close" className="size-4" />
        </button>
        <div className="dialog-header">
          <h3 className="dialog-title">حذف دپارتمان</h3>
          <p className="dialog-description">دپارتمان {department.Name} حذف می‌شود.</p>
        </div>
        <div className="dialog-footer">
          <Button variant="outline" onClick={deleteDialog.close}>انصراف</Button>
          <Button variant="destructive" onClick={() => void handleDelete()}>تأیید</Button>
        </div>
      </Dialog>
    </div>
  );
}
