import { matchPath } from 'react-router-dom';
import { PermissionType } from '@/lib/permissionTypes';

export interface RoutePermissionRule {
  path: string;
  permissions: number[];
}

/**
 * Most specific paths first. Routes omitted here are available to any authenticated user.
 */
export const routePermissionRules: RoutePermissionRule[] = [
  { path: '/calendar', permissions: [PermissionType.ListCalendarEvent] },
  { path: '/users/new', permissions: [PermissionType.CreateUser] },
  { path: '/users/:id', permissions: [PermissionType.GetUserById, PermissionType.ListUser] },
  { path: '/users', permissions: [PermissionType.ListUser] },
  { path: '/roles', permissions: [PermissionType.ListRole] },
  { path: '/permissions', permissions: [PermissionType.ListPermission] },
  { path: '/employees/new', permissions: [PermissionType.CreateEmployee] },
  { path: '/employees/:id', permissions: [PermissionType.GetEmployeeById, PermissionType.ListEmployee] },
  { path: '/employees', permissions: [PermissionType.ListEmployee] },
  { path: '/departments/tree', permissions: [PermissionType.ListDepartment] },
  { path: '/departments/new', permissions: [PermissionType.CreateDepartment] },
  { path: '/departments/:id', permissions: [PermissionType.GetDepartmentById, PermissionType.ListDepartment] },
  { path: '/departments', permissions: [PermissionType.ListDepartment] },
  { path: '/attendance', permissions: [PermissionType.ListAttendance] },
  { path: '/leaves/inbox', permissions: [PermissionType.GetLeaveApprovalInbox] },
  { path: '/leaves', permissions: [PermissionType.ListLeave] },
  { path: '/leave-types', permissions: [PermissionType.ManageLeaveTypeDefinition] },
  { path: '/leave-balances', permissions: [PermissionType.ListLeaveBalance] },
  { path: '/payroll', permissions: [PermissionType.ListPayroll] },
  { path: '/work-shifts', permissions: [PermissionType.ManageWorkShift] },
  { path: '/notifications', permissions: [PermissionType.ListNotification] },
  { path: '/announcements', permissions: [PermissionType.ListAnnouncement] },
  { path: '/todo', permissions: [PermissionType.ListTodoItem] },
  { path: '/backup', permissions: [PermissionType.ListBackupJob] },
];

export function getRoutePermissions(pathname: string): number[] | null {
  for (const rule of routePermissionRules) {
    if (matchPath({ path: rule.path, end: true }, pathname)) {
      return rule.permissions;
    }
  }
  return null;
}
