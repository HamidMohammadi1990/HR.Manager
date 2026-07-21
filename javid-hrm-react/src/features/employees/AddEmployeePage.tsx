import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { PersianDateInput } from '@/components/ui/PersianDateInput';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import {
  createEmployee,
  getAllDepartments,
  getAllEmployees,
  getAllUsers,
  getAllWorkShifts,
  getApiErrorMessage,
  type DepartmentDto,
  type EmployeeDto,
  type UserDto,
  type WorkShiftDto,
} from '@/services/api';
import { todayGregorianDateString } from '@/lib/persianDateTime';

export default function AddEmployeePage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserDto[]>([]);
  const [departments, setDepartments] = useState<DepartmentDto[]>([]);
  const [managers, setManagers] = useState<EmployeeDto[]>([]);
  const [workShifts, setWorkShifts] = useState<WorkShiftDto[]>([]);
  const [userId, setUserId] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [managerId, setManagerId] = useState('');
  const [workShiftId, setWorkShiftId] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [hireDate, setHireDate] = useState(todayGregorianDateString());
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    void Promise.all([
      getAllUsers({ Pagination: { PageNumber: 1, PageSize: 100 } }),
      getAllDepartments({ IsActive: true, Pagination: { PageNumber: 1, PageSize: 100 } }),
      getAllEmployees({ IsActive: true, Pagination: { PageNumber: 1, PageSize: 100 } }),
      getAllWorkShifts({ IsActive: true, Pagination: { PageNumber: 1, PageSize: 100 } }),
    ])
      .then(([usersRes, deptRes, empRes, shiftRes]) => {
        setUsers(usersRes.Items ?? []);
        setDepartments(deptRes.Items ?? []);
        setManagers(empRes.Items ?? []);
        setWorkShifts(shiftRes.Items ?? []);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!userId || !departmentId) {
      setError('کاربر و بخش الزامی است');
      return;
    }
    setError('');
    setIsSaving(true);
    try {
      const created = await createEmployee({
        UserId: userId,
        DepartmentId: departmentId,
        ManagerId: managerId || null,
        WorkShiftId: workShiftId || null,
        EmployeeCode: employeeCode.trim(),
        JobTitle: jobTitle.trim(),
        HireDate: hireDate,
        IsActive: true,
      });
      navigate(`/employees/${encodeURIComponent(created.Id)}`, { replace: true });
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
            <h1 className="text-2xl font-bold">استخدام پرسنل جدید</h1>
            <p className="text-muted-foreground">اتصال کاربر سیستم به پروفایل پرسنلی</p>
          </div>
          <Link to="/employees" className="button" data-variant="outline">بازگشت</Link>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>اطلاعات پرسنلی</CardTitle>
              <CardDescription>هر کاربر فقط یک پروفایل پرسنلی می‌تواند داشته باشد</CardDescription>
            </CardHeader>
            <CardContent>
              {error && <p className="text-destructive bg-destructive/10 mb-4 rounded-lg px-3 py-2 text-sm">{error}</p>}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium">کاربر سیستم</label>
                  <Select className="w-full" value={userId} onChange={(e) => setUserId(e.target.value)} required>
                    <option value="">انتخاب کاربر</option>
                    {users.map((u) => (
                      <option key={u.Id} value={u.Id}>
                        {[u.FirstName, u.LastName].filter(Boolean).join(' ') || u.UserName} ({u.UserName})
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">کد پرسنلی</label>
                  <Input dir="ltr" value={employeeCode} onChange={(e) => setEmployeeCode(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">سمت</label>
                  <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">بخش</label>
                  <Select className="w-full" value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} required>
                    <option value="">انتخاب بخش</option>
                    {departments.map((d) => (
                      <option key={d.Id} value={d.Id}>{d.Name}</option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">مدیر مستقیم (اختیاری)</label>
                  <Select className="w-full" value={managerId} onChange={(e) => setManagerId(e.target.value)}>
                    <option value="">بدون مدیر</option>
                    {managers.map((m) => (
                      <option key={m.Id} value={m.Id}>
                        {[m.UserFirstName, m.UserLastName].filter(Boolean).join(' ') || m.EmployeeCode}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">شیفت کاری (اختیاری)</label>
                  <Select className="w-full" value={workShiftId} onChange={(e) => setWorkShiftId(e.target.value)}>
                    <option value="">پیش‌فرض بخش / برنامه زمانی</option>
                    {workShifts.map((shift) => (
                      <option key={shift.Id} value={shift.Id}>{shift.Name}</option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">تاریخ استخدام</label>
                  <PersianDateInput value={hireDate} onChange={setHireDate} required />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button type="submit" disabled={isSaving}>{isSaving ? 'در حال ذخیره...' : 'ثبت پرسنل'}</Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
