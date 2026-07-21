import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { PersianDateInput } from '@/components/ui/PersianDateInput';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Dialog } from '@/components/layout/Dialog';
import { useDisclosure } from '@/hooks';
import {
  createEmployeeShiftSchedule,
  deleteEmployee,
  deleteEmployeeShiftSchedule,
  getAllDepartments,
  getAllEmployees,
  getAllWorkShifts,
  getApiErrorMessage,
  getEmployee,
  getEmployeeShiftSchedules,
  updateEmployee,
  type DepartmentDto,
  type EmployeeDto,
  type EmployeeShiftScheduleDto,
  type WorkShiftDto,
} from '@/services/api';
import { isoToGregorianDateString, todayGregorianDateString } from '@/lib/persianDateTime';

function getName(emp: EmployeeDto) {
  return [emp.UserFirstName, emp.UserLastName].filter(Boolean).join(' ') || emp.UserName || emp.EmployeeCode;
}

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const deleteDialog = useDisclosure();
  const scheduleDialog = useDisclosure();
  const [employee, setEmployee] = useState<EmployeeDto | null>(null);
  const [departments, setDepartments] = useState<DepartmentDto[]>([]);
  const [managers, setManagers] = useState<EmployeeDto[]>([]);
  const [workShifts, setWorkShifts] = useState<WorkShiftDto[]>([]);
  const [shiftSchedules, setShiftSchedules] = useState<EmployeeShiftScheduleDto[]>([]);
  const [departmentId, setDepartmentId] = useState('');
  const [managerId, setManagerId] = useState('');
  const [workShiftId, setWorkShiftId] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [hireDate, setHireDate] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [scheduleError, setScheduleError] = useState('');
  const [scheduleWorkShiftId, setScheduleWorkShiftId] = useState('');
  const [scheduleEffectiveFrom, setScheduleEffectiveFrom] = useState(todayGregorianDateString());
  const [scheduleEffectiveTo, setScheduleEffectiveTo] = useState('');
  const [scheduleNote, setScheduleNote] = useState('');
  const [isScheduleSubmitting, setIsScheduleSubmitting] = useState(false);

  const loadShiftSchedules = async (employeeId: string) => {
    const schedules = await getEmployeeShiftSchedules({ EmployeeId: employeeId });
    setShiftSchedules(schedules);
  };

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError('');
      try {
        const [emp, deptRes, empRes, shiftRes] = await Promise.all([
          getEmployee({ Id: decodeURIComponent(id) }),
          getAllDepartments({ Pagination: { PageNumber: 1, PageSize: 100 } }),
          getAllEmployees({ IsActive: true, Pagination: { PageNumber: 1, PageSize: 100 } }),
          getAllWorkShifts({ IsActive: true, Pagination: { PageNumber: 1, PageSize: 100 } }),
        ]);
        if (cancelled) return;
        setEmployee(emp);
        setDepartments(deptRes.Items ?? []);
        setManagers((empRes.Items ?? []).filter((m) => m.Id !== emp.Id));
        setWorkShifts(shiftRes.Items ?? []);
        setDepartmentId(emp.DepartmentId);
        setManagerId(emp.ManagerId ?? '');
        setWorkShiftId(emp.WorkShiftId ?? '');
        setEmployeeCode(emp.EmployeeCode);
        setJobTitle(emp.JobTitle);
        setHireDate(isoToGregorianDateString(emp.HireDate));
        setIsActive(emp.IsActive);
        await loadShiftSchedules(emp.Id);
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
    if (!employee) return;
    setFormError('');
    setIsSaving(true);
    try {
      await updateEmployee({
        Id: employee.Id,
        DepartmentId: departmentId,
        ManagerId: managerId || null,
        WorkShiftId: workShiftId || null,
        EmployeeCode: employeeCode.trim(),
        JobTitle: jobTitle.trim(),
        HireDate: hireDate,
        IsActive: isActive,
      });
      const refreshed = await getEmployee({ Id: employee.Id });
      setEmployee(refreshed);
    } catch (err) {
      setFormError(getApiErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!employee) return;
    try {
      await deleteEmployee(employee.Id);
      deleteDialog.close();
      navigate('/employees', { replace: true });
    } catch (err) {
      setFormError(getApiErrorMessage(err));
      deleteDialog.close();
    }
  };

  const handleCreateSchedule = async (e: FormEvent) => {
    e.preventDefault();
    if (!employee || !scheduleWorkShiftId) {
      setScheduleError('شیفت و تاریخ شروع الزامی است');
      return;
    }
    setScheduleError('');
    setIsScheduleSubmitting(true);
    try {
      await createEmployeeShiftSchedule({
        EmployeeId: employee.Id,
        WorkShiftId: scheduleWorkShiftId,
        EffectiveFrom: scheduleEffectiveFrom,
        EffectiveTo: scheduleEffectiveTo || null,
        Note: scheduleNote.trim() || null,
      });
      setScheduleWorkShiftId('');
      setScheduleEffectiveTo('');
      setScheduleNote('');
      scheduleDialog.close();
      await loadShiftSchedules(employee.Id);
    } catch (err) {
      setScheduleError(getApiErrorMessage(err));
    } finally {
      setIsScheduleSubmitting(false);
    }
  };

  const handleDeleteSchedule = async (scheduleId: number) => {
    if (!employee) return;
    try {
      await deleteEmployeeShiftSchedule({ Id: scheduleId });
      await loadShiftSchedules(employee.Id);
    } catch (err) {
      setFormError(getApiErrorMessage(err));
    }
  };

  function formatShiftTime(value: string) {
    return value?.slice(0, 5) ?? '—';
  }

  if (isLoading) {
    return <div className="flex flex-1 items-center justify-center p-12"><p className="text-muted-foreground text-sm">در حال بارگذاری...</p></div>;
  }

  if (error || !employee) {
    return (
      <div className="flex-1 p-6">
        <p className="text-destructive mb-4">{error || 'پرسنل یافت نشد'}</p>
        <Link to="/employees" className="button" data-variant="outline">بازگشت</Link>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 lg:p-6" dir="rtl">
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <div className="text-muted-foreground mb-2 flex items-center gap-2 text-sm">
            <Link to="/employees" className="hover:underline">پرسنل</Link>
            <span>/</span>
            <span>جزئیات</span>
          </div>
          <h1 className="text-2xl font-bold">{getName(employee)}</h1>
          <p className="text-muted-foreground">{employee.JobTitle} — {employee.DepartmentName}</p>
          <div className="mt-2">
            <Badge variant={employee.IsActive ? 'success' : 'secondary'}>
              {employee.IsActive ? 'فعال' : 'غیرفعال'}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to="/employees" className="button" data-variant="outline">بستن</Link>
          <Button variant="destructive" onClick={deleteDialog.open}>حذف</Button>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <Card>
          <CardHeader>
            <CardTitle>ویرایش پرسنل</CardTitle>
            <CardDescription>کد پرسنلی: {employee.EmployeeCode}</CardDescription>
          </CardHeader>
          <CardContent>
            {formError && <p className="text-destructive bg-destructive/10 mb-4 rounded-lg px-3 py-2 text-sm">{formError}</p>}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                  {departments.map((d) => <option key={d.Id} value={d.Id}>{d.Name}</option>)}
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">مدیر مستقیم</label>
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
                <label className="text-sm font-medium">شیفت کاری</label>
                <Select className="w-full" value={workShiftId} onChange={(e) => setWorkShiftId(e.target.value)}>
                  <option value="">پیش‌فرض بخش / برنامه زمانی</option>
                  {workShifts.map((shift) => (
                    <option key={shift.Id} value={shift.Id}>{shift.Name}</option>
                  ))}
                </Select>
                {employee.WorkShiftName && (
                  <p className="text-muted-foreground text-xs">شیفت فعلی: {employee.WorkShiftName}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">تاریخ استخدام</label>
                <PersianDateInput value={hireDate} onChange={setHireDate} required />
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                  فعال
                </label>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button type="submit" disabled={isSaving}>{isSaving ? 'در حال ذخیره...' : 'ذخیره'}</Button>
            </div>
          </CardContent>
        </Card>
      </form>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>برنامه زمانی شیفت</CardTitle>
            <CardDescription>اولویت بالاتر از شیفت ثابت پرسنل — برای دوره‌های خاص</CardDescription>
          </div>
          <Button type="button" variant="outline" onClick={scheduleDialog.open}>
            <Icon name="material-symbols:add" className="size-4" />
            برنامه جدید
          </Button>
        </CardHeader>
        <CardContent>
          {shiftSchedules.length === 0 ? (
            <p className="text-muted-foreground text-sm">برنامه زمانی ثبت نشده است.</p>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-head">شیفت</th>
                    <th className="table-head">از تاریخ</th>
                    <th className="table-head">تا تاریخ</th>
                    <th className="table-head">یادداشت</th>
                    <th className="table-head">عملیات</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {shiftSchedules.map((schedule) => (
                    <tr key={schedule.Id} className="table-row">
                      <td className="table-cell">
                        {schedule.WorkShiftName}
                        <span className="text-muted-foreground block text-xs" dir="ltr">
                          {formatShiftTime(schedule.WorkShiftStartTime)} - {formatShiftTime(schedule.WorkShiftEndTime)}
                          {schedule.WorkShiftIsOvernight ? ' (شبانه)' : ''}
                        </span>
                      </td>
                      <td className="table-cell">{new Date(schedule.EffectiveFrom).toLocaleDateString('fa-IR')}</td>
                      <td className="table-cell">
                        {schedule.EffectiveTo ? new Date(schedule.EffectiveTo).toLocaleDateString('fa-IR') : 'نامحدود'}
                      </td>
                      <td className="table-cell">{schedule.Note || '—'}</td>
                      <td className="table-cell">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive"
                          onClick={() => void handleDeleteSchedule(schedule.Id)}
                        >
                          <Icon name="material-symbols:delete" className="size-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={scheduleDialog.isOpen} onClose={scheduleDialog.close} className="max-w-lg">
        <form onSubmit={(e) => void handleCreateSchedule(e)}>
          <div className="dialog-header">
            <h3 className="dialog-title">برنامه شیفت جدید</h3>
          </div>
          <div className="dialog-body space-y-4">
            {scheduleError && <p className="text-destructive text-sm">{scheduleError}</p>}
            <div className="space-y-2">
              <label className="text-sm font-medium">شیفت</label>
              <Select className="w-full" value={scheduleWorkShiftId} onChange={(e) => setScheduleWorkShiftId(e.target.value)} required>
                <option value="">انتخاب شیفت</option>
                {workShifts.map((shift) => (
                  <option key={shift.Id} value={shift.Id}>{shift.Name}</option>
                ))}
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">از تاریخ</label>
                <PersianDateInput value={scheduleEffectiveFrom} onChange={setScheduleEffectiveFrom} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">تا تاریخ (اختیاری)</label>
                <PersianDateInput value={scheduleEffectiveTo} onChange={setScheduleEffectiveTo} />
              </div>
            </div>
            <Input placeholder="یادداشت" value={scheduleNote} onChange={(e) => setScheduleNote(e.target.value)} />
          </div>
          <div className="dialog-footer">
            <Button type="button" variant="outline" onClick={scheduleDialog.close}>انصراف</Button>
            <Button type="submit" disabled={isScheduleSubmitting}>
              {isScheduleSubmitting ? 'در حال ذخیره...' : 'ثبت'}
            </Button>
          </div>
        </form>
      </Dialog>

      <Dialog open={deleteDialog.isOpen} onClose={deleteDialog.close} className="max-w-md">
        <button type="button" className="dialog-close" onClick={deleteDialog.close}>
          <Icon name="material-symbols:close" className="size-4" />
        </button>
        <div className="dialog-header">
          <h3 className="dialog-title">حذف پرسنل</h3>
          <p className="dialog-description">پروفایل پرسنلی {getName(employee)} حذف می‌شود.</p>
        </div>
        <div className="dialog-footer">
          <Button variant="outline" onClick={deleteDialog.close}>انصراف</Button>
          <Button variant="destructive" onClick={() => void handleDelete()}>تأیید</Button>
        </div>
      </Dialog>
    </div>
  );
}
