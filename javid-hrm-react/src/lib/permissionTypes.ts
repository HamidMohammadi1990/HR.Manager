/**
 * Permission ids aligned with backend PermissionType enum.
 * Only values used for navigation filtering are listed here.
 */
export const PermissionType = {
  CreateUser: 4,
  ListUser: 6,
  GetUserById: 8,
  ListRole: 27,
  ListPermission: 57,
  GetDepartmentById: 346,
  CreateDepartment: 347,
  ListDepartment: 345,
  ListEmployee: 702,
  GetEmployeeById: 703,
  CreateEmployee: 704,
  ListAttendance: 802,
  ListLeave: 902,
  GetLeaveApprovalInbox: 909,
  ListPayroll: 1002,
  ListNotification: 1102,
  ListAnnouncement: 1202,
  ListCalendarEvent: 1302,
  ListTodoItem: 1402,
  ListWorkShift: 1502,
  ManageWorkShift: 1501,
  ListLeaveTypeDefinition: 1552,
  ManageLeaveTypeDefinition: 1551,
  ListLeaveBalance: 1602,
  ListBackupJob: 1702,
} as const;

export type PermissionId = (typeof PermissionType)[keyof typeof PermissionType];
