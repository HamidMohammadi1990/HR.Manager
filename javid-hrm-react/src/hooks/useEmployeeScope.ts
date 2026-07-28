import { useEffect, useState } from 'react';
import { usePermissions } from '@/contexts/PermissionContext';
import { getPersonName } from '@/lib/hrLabels';
import { PermissionType } from '@/lib/permissionTypes';
import { getCurrentEmployee } from '@/services/api';

function formatEmployeeLabel(employee: {
  EmployeeCode: string;
  UserFirstName?: string | null;
  UserLastName?: string | null;
}) {
  const name = getPersonName(employee.UserFirstName, employee.UserLastName, employee.EmployeeCode);
  return name === employee.EmployeeCode ? employee.EmployeeCode : `${name} (${employee.EmployeeCode})`;
}

export function useEmployeeScope() {
  const { hasPermission, isLoading: permissionsLoading } = usePermissions();
  const canSelectEmployee = hasPermission(PermissionType.ListEmployee);
  const [selfEmployeeId, setSelfEmployeeId] = useState('');
  const [selfEmployeeLabel, setSelfEmployeeLabel] = useState('');
  const [selfEmployeeError, setSelfEmployeeError] = useState('');
  const [selfLoading, setSelfLoading] = useState(!canSelectEmployee);

  useEffect(() => {
    if (permissionsLoading || canSelectEmployee) {
      setSelfLoading(false);
      setSelfEmployeeError('');
      return;
    }

    let cancelled = false;
    setSelfLoading(true);
    setSelfEmployeeError('');

    void getCurrentEmployee()
      .then((employee) => {
        if (cancelled) return;
        setSelfEmployeeId(employee.Id);
        setSelfEmployeeLabel(formatEmployeeLabel(employee));
      })
      .catch(() => {
        if (cancelled) return;
        setSelfEmployeeId('');
        setSelfEmployeeLabel('');
        setSelfEmployeeError('پروفایل پرسنلی برای حساب شما یافت نشد.');
      })
      .finally(() => {
        if (!cancelled) setSelfLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [permissionsLoading, canSelectEmployee]);

  return {
    canSelectEmployee,
    selfEmployeeId,
    selfEmployeeLabel,
    selfEmployeeError,
    isScopeReady: canSelectEmployee || (!permissionsLoading && !selfLoading),
  };
}
