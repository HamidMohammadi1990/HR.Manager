import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import {
  createDepartment,
  getAllDepartments,
  getAllWorkShifts,
  getApiErrorMessage,
  type DepartmentDto,
  type WorkShiftDto,
} from '@/services/api';

export default function AddDepartmentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [departments, setDepartments] = useState<DepartmentDto[]>([]);
  const [workShifts, setWorkShifts] = useState<WorkShiftDto[]>([]);
  const [parentDepartmentId, setParentDepartmentId] = useState(searchParams.get('parentId') ?? '');
  const [defaultWorkShiftId, setDefaultWorkShiftId] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    void Promise.all([
      getAllDepartments({ Pagination: { PageNumber: 1, PageSize: 200 } }),
      getAllWorkShifts({ IsActive: true, Pagination: { PageNumber: 1, PageSize: 100 } }),
    ])
      .then(([deptResult, shiftResult]) => {
        setDepartments(deptResult.Items ?? []);
        setWorkShifts(shiftResult.Items ?? []);
      })
      .catch(() => {
        setDepartments([]);
        setWorkShifts([]);
      });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);
    try {
      const created = await createDepartment({
        Name: name.trim(),
        Code: code.trim(),
        Description: description.trim() || null,
        ParentDepartmentId: parentDepartmentId || null,
        DefaultWorkShiftId: defaultWorkShiftId || null,
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
            <h1 className="text-2xl font-bold">دپارتمان جدید</h1>
            <p className="text-muted-foreground">ثبت واحد سازمانی در شرکت</p>
          </div>
          <Link to="/departments" className="button" data-variant="outline">بازگشت</Link>
        </div>
        <form onSubmit={(event) => void handleSubmit(event)}>
          <Card>
            <CardHeader>
              <CardTitle>اطلاعات دپارتمان</CardTitle>
              <CardDescription>
                مثال: مهندسی نرم‌افزار، حسابداری، منابع انسانی
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <p className="text-destructive bg-destructive/10 mb-4 rounded-lg px-3 py-2 text-sm">
                  {error}
                </p>
              )}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium">نام دپارتمان *</label>
                  <Input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="مثلاً: مهندسی نرم‌افزار"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">کد دپارتمان *</label>
                  <Input
                    dir="ltr"
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                    placeholder="SW-ENG"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">دپارتمان والد</label>
                  <Select
                    className="w-full"
                    value={parentDepartmentId}
                    onChange={(event) => setParentDepartmentId(event.target.value)}
                  >
                    <option value="">بدون والد (دپارتمان اصلی)</option>
                    {departments.map((department) => (
                      <option key={department.Id} value={department.Id}>
                        {department.Name}
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
                    placeholder="شرح کوتاه درباره وظایف این دپارتمان..."
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
                  {isSaving ? 'در حال ذخیره...' : 'ثبت دپارتمان'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
