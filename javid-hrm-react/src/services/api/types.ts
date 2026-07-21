export interface OperationError {
  Code: string;
  Message: string;
}

export interface ApiResult<T = void> {
  IsSuccess: boolean;
  StatusCode: number;
  Messages?: OperationError[];
  Data?: T;
}

export interface PagedRequest {
  PageNumber: number;
  PageSize: number;
}

export interface PagedResult<T> {
  PageNumber: number;
  PageSize: number;
  TotalCount: number;
  TotalPages: number;
  Items: T[];
}

export interface SignInRequest {
  UserName: string;
  Password: string;
}

export interface SignInResponse {
  AccessToken: string;
  RefreshToken: string;
  TokenType: string;
  ExpiresIn: number;
  SessionId: string;
}

export interface RefreshTokenRequest {
  Token: string;
  RefreshToken: string;
}

export interface UserDto {
  Id: string;
  UserName: string;
  FirstName?: string | null;
  LastName?: string | null;
  Email?: string | null;
  EmailConfirmed: boolean;
  PhoneNumber?: string | null;
  PhoneNumberConfirmed: boolean;
  LoginPermission: boolean;
  Gender?: number | string | null;
  IsActive: boolean;
  LastLoginDateOnUtc?: string | null;
  AccessFailedCount: number;
}

export interface GetAllUsersRequest {
  UserName?: string;
  FirstName?: string;
  LastName?: string;
  Email?: string;
  EmailConfirmed?: boolean;
  PhoneNumber?: string;
  PhoneNumberConfirmed?: boolean;
  LoginPermission?: boolean;
  Gender?: number;
  Search?: string;
  IsActive?: boolean;
  Pagination: PagedRequest;
}

export interface DepartmentDto {
  Id: string;
  Name: string;
  Code: string;
  ParentDepartmentId?: string | null;
  ParentDepartmentName?: string | null;
  DefaultWorkShiftId?: string | null;
  DefaultWorkShiftName?: string | null;
  IsActive: boolean;
  Description?: string | null;
  CreatedOnUtc: string;
}

export interface GetAllDepartmentsRequest {
  Name?: string;
  Code?: string;
  IsActive?: boolean;
  Pagination: PagedRequest;
}

export interface RoleDto {
  Id: string;
  Title: string;
  IsActive: boolean;
}

export interface GetAllRolesRequest {
  Title?: string;
  IsActive?: boolean;
  Pagination: PagedRequest;
}

export interface PermissionDto {
  Id: number | string;
  Title: string;
  Url: string;
  NameSpace?: string | null;
  ParentId?: number | string | null;
  LevelTypeId: number;
  LevelTypeTitle: string;
  Priority: number;
  IsActive: boolean;
}

export interface GetAllPermissionsRequest {
  Title?: string;
  IsActive?: boolean;
  Pagination: PagedRequest;
}

export interface CreateUserRequest {
  UserName: string;
  FirstName: string;
  LastName: string;
  Email?: string | null;
  PhoneNumber: string;
  Password: string;
  Gender: number;
}

export interface CreateUserResponse {
  Id: string;
}

export interface UpdateUserRequest {
  Id: string;
  UserName: string;
  FirstName: string;
  LastName: string;
  Email?: string | null;
  PhoneNumber: string;
  Gender: number;
  IsActive: boolean;
  LoginPermission: boolean;
  Password?: string | null;
}

export interface UpdateCurrentUserProfileRequest {
  FirstName: string;
  LastName: string;
  PhoneNumber: string;
  Gender: number;
}

export interface ChangePasswordRequest {
  OldPassword: string;
  NewPassword: string;
}

export interface GetUserRequest {
  Id: string;
}

export interface EmployeeDto {
  Id: string;
  UserId: string;
  UserFirstName?: string | null;
  UserLastName?: string | null;
  UserName?: string | null;
  DepartmentId: string;
  DepartmentName: string;
  ManagerId?: string | null;
  ManagerFirstName?: string | null;
  ManagerLastName?: string | null;
  WorkShiftId?: string | null;
  WorkShiftName?: string | null;
  EmployeeCode: string;
  JobTitle: string;
  HireDate: string;
  IsActive: boolean;
  CreatedOnUtc: string;
}

export interface GetAllEmployeesRequest {
  DepartmentId?: string;
  UserId?: string;
  ManagerId?: string;
  EmployeeCode?: string;
  JobTitle?: string;
  FirstName?: string;
  LastName?: string;
  IsActive?: boolean;
  Pagination: PagedRequest;
}

export interface CreateEmployeeRequest {
  UserId: string;
  DepartmentId: string;
  ManagerId?: string | null;
  WorkShiftId?: string | null;
  EmployeeCode: string;
  JobTitle: string;
  HireDate: string;
  IsActive?: boolean;
}

export interface CreateEmployeeResponse {
  Id: string;
}

export interface UpdateEmployeeRequest {
  Id: string;
  DepartmentId: string;
  ManagerId?: string | null;
  WorkShiftId?: string | null;
  EmployeeCode: string;
  JobTitle: string;
  HireDate: string;
  IsActive: boolean;
}

export interface GetEmployeeRequest {
  Id: string;
}

export interface CreateDepartmentRequest {
  Name: string;
  Code: string;
  Description?: string | null;
  ParentDepartmentId?: string | null;
  DefaultWorkShiftId?: string | null;
  IsActive?: boolean;
}

export interface CreateDepartmentResponse {
  Id: string;
}

export interface UpdateDepartmentRequest {
  Id: string;
  Name: string;
  Code: string;
  Description?: string | null;
  ParentDepartmentId?: string | null;
  DefaultWorkShiftId?: string | null;
  IsActive: boolean;
}

export interface GetDepartmentRequest {
  Id: string;
}

export interface UserRoleDto {
  Id: string;
  UserId: string;
  UserName: string;
  RoleId: string;
  RoleTitle: string;
}

export interface GetAllUserRolesRequest {
  UserId?: string;
  RoleId?: string;
  Pagination: PagedRequest;
}

export interface CreateUserRoleRequest {
  UserId: string;
  RoleId: string;
}

export interface CreateUserRoleResponse {
  Id: string;
}

export interface RolePermissionDto {
  Id: string;
  RoleId: string;
  RoleTitle: string;
  PermissionId: number | string;
  PermissionTitle: string;
}

export interface GetAllRolePermissionsRequest {
  RoleId?: string;
  PermissionId?: number | string;
  Pagination: PagedRequest;
}

export interface CreateRolePermissionRequest {
  RoleId: string;
  PermissionId: number | string;
}

export interface CreateRolePermissionResponse {
  Id: string;
}

export interface AttendanceRecordDto {
  Id: string;
  EmployeeId: string;
  EmployeeCode: string;
  UserFirstName?: string | null;
  UserLastName?: string | null;
  UserName?: string | null;
  DepartmentId: string;
  DepartmentName: string;
  WorkDate: string;
  CheckInUtc?: string | null;
  CheckOutUtc?: string | null;
  Status: number;
  WorkShiftId?: string | null;
  WorkShiftName?: string | null;
  LateMinutes: number;
  EarlyLeaveMinutes: number;
  OvertimeMinutes: number;
  WorkedMinutes: number;
  CreatedOnUtc: string;
}

export interface GetAllAttendanceRecordsRequest {
  EmployeeId?: string;
  DepartmentId?: string;
  Status?: number;
  WorkDateFrom?: string;
  WorkDateTo?: string;
  Pagination: PagedRequest;
}

export interface CreateAttendanceRecordRequest {
  EmployeeId: string;
  WorkDate: string;
  CheckInUtc?: string | null;
  CheckOutUtc?: string | null;
  Status: number;
}

export interface UpdateAttendanceRecordRequest {
  Id: string;
  EmployeeId: string;
  WorkDate: string;
  CheckInUtc?: string | null;
  CheckOutUtc?: string | null;
  Status: number;
}

export interface LeaveRequestDto {
  Id: string;
  EmployeeId: string;
  EmployeeCode: string;
  UserFirstName?: string | null;
  UserLastName?: string | null;
  UserName?: string | null;
  DepartmentId: string;
  DepartmentName: string;
  LeaveTypeDefinitionId: string;
  LeaveTypeName: string;
  LeaveTypeUnit: number;
  LeaveTypeCode: string;
  StartDate: string;
  EndDate: string;
  Status: number;
  Reason?: string | null;
  CreatedOnUtc: string;
  CurrentApprovalStepOrder?: number | null;
  TotalApprovalSteps?: number | null;
  CanCurrentUserAct?: boolean;
  ApprovalSteps?: LeaveRequestApprovalStepDto[];
}

export interface LeaveRequestApprovalStepDto {
  StepOrder: number;
  ApproverEmployeeId?: string | null;
  ApproverFirstName?: string | null;
  ApproverLastName?: string | null;
  ApproverJobTitle?: string | null;
  IsHrPool: boolean;
  Status: number;
  Comment?: string | null;
  ActionedAtUtc?: string | null;
  IsCurrent: boolean;
}

export interface LeaveApprovalInboxItemDto {
  LeaveRequestId: string;
  StepOrder: number;
  EmployeeId: string;
  EmployeeCode: string;
  UserFirstName?: string | null;
  UserLastName?: string | null;
  DepartmentId: string;
  DepartmentName: string;
  LeaveTypeDefinitionId: string;
  LeaveTypeName: string;
  LeaveTypeUnit: number;
  StartDate: string;
  EndDate: string;
  Reason: string;
  CreatedOnUtc: string;
  CurrentApprovalStepOrder?: number | null;
  TotalApprovalSteps?: number | null;
  IsHrPoolStep: boolean;
}

export interface GetLeaveApprovalInboxRequest {
  Pagination: PagedRequest;
}

export interface GetAllLeaveRequestsRequest {
  EmployeeId?: string;
  DepartmentId?: string;
  LeaveTypeDefinitionId?: string;
  Status?: number;
  Pagination: PagedRequest;
}

export interface CreateLeaveRequestRequest {
  EmployeeId: string;
  LeaveTypeDefinitionId: string;
  StartDate: string;
  EndDate: string;
  Reason?: string | null;
}

export interface UpdateLeaveRequestRequest {
  Id: string;
  EmployeeId: string;
  LeaveTypeDefinitionId: string;
  StartDate: string;
  EndDate: string;
  Status: number;
  Reason?: string | null;
}

export interface PayrollEntryDto {
  Id: string;
  EmployeeId: string;
  EmployeeCode: string;
  UserFirstName?: string | null;
  UserLastName?: string | null;
  UserName?: string | null;
  DepartmentId: string;
  DepartmentName: string;
  Year: number;
  Month: number;
  BaseSalary: number;
  GrossAmount: number;
  Deductions: number;
  NetAmount: number;
  Status: number;
  Notes?: string | null;
  CreatedOnUtc: string;
}

export interface GetAllPayrollEntriesRequest {
  EmployeeId?: string;
  DepartmentId?: string;
  Year?: number;
  Month?: number;
  Status?: number;
  Pagination: PagedRequest;
}

export interface CreatePayrollEntryRequest {
  EmployeeId: string;
  Year: number;
  Month: number;
  BaseSalary: number;
  GrossAmount: number;
  Deductions: number;
  NetAmount: number;
  Status?: number;
  Notes?: string | null;
}

export interface UpdatePayrollEntryRequest {
  Id: string;
  EmployeeId: string;
  Year: number;
  Month: number;
  BaseSalary: number;
  GrossAmount: number;
  Deductions: number;
  NetAmount: number;
  Status: number;
  Notes?: string | null;
}

export const NotificationType = {
  Info: 1,
  Success: 2,
  Warning: 3,
  Error: 4,
  Leave: 5,
  Payroll: 6,
  Attendance: 7,
  System: 8,
} as const;

export type NotificationTypeValue = (typeof NotificationType)[keyof typeof NotificationType];

export interface NotificationDto {
  Id: string;
  UserId: string;
  UserFirstName?: string | null;
  UserLastName?: string | null;
  UserName?: string | null;
  Title: string;
  Message: string;
  Type: NotificationTypeValue;
  IsRead: boolean;
  ReadAtUtc?: string | null;
  LinkPath?: string | null;
  IconName?: string | null;
  CreatedOnUtc: string;
}

export interface GetAllNotificationsRequest {
  UserId?: string;
  IsRead?: boolean;
  Type?: NotificationTypeValue;
  Title?: string;
  CreatedFromUtc?: string;
  CreatedToUtc?: string;
  Pagination: PagedRequest;
}

export interface CreateNotificationRequest {
  UserId: string;
  Title: string;
  Message: string;
  Type?: NotificationTypeValue;
  LinkPath?: string | null;
  IconName?: string | null;
}

export interface UpdateNotificationRequest {
  Id: string;
  UserId: string;
  Title: string;
  Message: string;
  Type: NotificationTypeValue;
  LinkPath?: string | null;
  IconName?: string | null;
}

export const AnnouncementStatus = {
  Draft: 1,
  Scheduled: 2,
  Sent: 3,
  Archived: 4,
  Failed: 5,
} as const;

export type AnnouncementStatusValue = (typeof AnnouncementStatus)[keyof typeof AnnouncementStatus];

export const AnnouncementAudience = {
  AllUsers: 1,
  Department: 2,
  Role: 3,
} as const;

export type AnnouncementAudienceValue = (typeof AnnouncementAudience)[keyof typeof AnnouncementAudience];

export const AnnouncementChannel = {
  InApp: 1,
  Email: 2,
  Push: 3,
  EmailAndPush: 4,
} as const;

export type AnnouncementChannelValue = (typeof AnnouncementChannel)[keyof typeof AnnouncementChannel];

export interface AnnouncementDto {
  Id: string;
  Title: string;
  Content: string;
  Status: AnnouncementStatusValue;
  Audience: AnnouncementAudienceValue;
  Channel: AnnouncementChannelValue;
  DepartmentId?: string | null;
  DepartmentName?: string | null;
  RoleId?: string | null;
  RoleName?: string | null;
  ScheduledAtUtc?: string | null;
  PublishedAtUtc?: string | null;
  CreatedByUserId: string;
  CreatorFirstName?: string | null;
  CreatorLastName?: string | null;
  CreatorUserName?: string | null;
  CreatedOnUtc: string;
}

export interface GetAllAnnouncementsRequest {
  Status?: AnnouncementStatusValue;
  Audience?: AnnouncementAudienceValue;
  Channel?: AnnouncementChannelValue;
  DepartmentId?: string;
  RoleId?: string;
  Title?: string;
  CreatedFromUtc?: string;
  CreatedToUtc?: string;
  Pagination: PagedRequest;
}

export interface CreateAnnouncementRequest {
  Title: string;
  Content: string;
  Status?: AnnouncementStatusValue;
  Audience: AnnouncementAudienceValue;
  Channel: AnnouncementChannelValue;
  DepartmentId?: string | null;
  RoleId?: string | null;
  ScheduledAtUtc?: string | null;
}

export interface UpdateAnnouncementRequest {
  Id: string;
  Title: string;
  Content: string;
  Status: AnnouncementStatusValue;
  Audience: AnnouncementAudienceValue;
  Channel: AnnouncementChannelValue;
  DepartmentId?: string | null;
  RoleId?: string | null;
  ScheduledAtUtc?: string | null;
}

export const CalendarEventType = {
  Meeting: 1,
  Holiday: 2,
  Leave: 3,
  Personal: 4,
  Other: 5,
} as const;

export type CalendarEventTypeValue = (typeof CalendarEventType)[keyof typeof CalendarEventType];

export interface CalendarEventDto {
  Id: string;
  Title: string;
  Description?: string | null;
  StartAtUtc: string;
  EndAtUtc: string;
  IsAllDay: boolean;
  EventType: CalendarEventTypeValue;
  UserId?: string | null;
  UserFirstName?: string | null;
  UserLastName?: string | null;
  UserName?: string | null;
  DepartmentId?: string | null;
  DepartmentName?: string | null;
  Color?: string | null;
}

export interface GetAllCalendarEventsRequest {
  EventType?: CalendarEventTypeValue;
  UserId?: string;
  DepartmentId?: string;
  Title?: string;
  StartFromUtc?: string;
  EndToUtc?: string;
  Pagination: PagedRequest;
}

export interface CreateCalendarEventRequest {
  Title: string;
  Description?: string | null;
  StartAtUtc: string;
  EndAtUtc: string;
  IsAllDay: boolean;
  EventType: CalendarEventTypeValue;
  UserId?: string | null;
  DepartmentId?: string | null;
  Color?: string | null;
}

export interface UpdateCalendarEventRequest {
  Id: string;
  Title: string;
  Description?: string | null;
  StartAtUtc: string;
  EndAtUtc: string;
  IsAllDay: boolean;
  EventType: CalendarEventTypeValue;
  UserId?: string | null;
  DepartmentId?: string | null;
  Color?: string | null;
}

export const TodoPriority = {
  Low: 1,
  Medium: 2,
  High: 3,
} as const;

export type TodoPriorityValue = (typeof TodoPriority)[keyof typeof TodoPriority];

export interface TodoItemDto {
  Id: string;
  UserId: string;
  UserFirstName?: string | null;
  UserLastName?: string | null;
  UserName?: string | null;
  Title: string;
  Description?: string | null;
  DueDate?: string | null;
  Priority: TodoPriorityValue;
  IsCompleted: boolean;
  CompletedAtUtc?: string | null;
  CreatedOnUtc: string;
}

export interface GetAllTodoItemsRequest {
  UserId?: string;
  Priority?: TodoPriorityValue;
  IsCompleted?: boolean;
  Title?: string;
  DueDateFrom?: string;
  DueDateTo?: string;
  Pagination: PagedRequest;
}

export interface CreateTodoItemRequest {
  UserId: string;
  Title: string;
  Description?: string | null;
  DueDate?: string | null;
  Priority?: TodoPriorityValue;
}

export interface UpdateTodoItemRequest {
  Id: string;
  UserId: string;
  Title: string;
  Description?: string | null;
  DueDate?: string | null;
  Priority: TodoPriorityValue;
}

export const BackupStatus = {
  Pending: 1,
  InProgress: 2,
  Completed: 3,
  Failed: 4,
} as const;

export type BackupStatusValue = (typeof BackupStatus)[keyof typeof BackupStatus];

export const BackupType = {
  Manual: 1,
  Automatic: 2,
} as const;

export type BackupTypeValue = (typeof BackupType)[keyof typeof BackupType];

export interface BackupJobDto {
  Id: string;
  FileName: string;
  FileSizeBytes: number;
  Status: BackupStatusValue;
  Type: BackupTypeValue;
  StoragePath: string;
  ErrorMessage?: string | null;
  CreatedByUserId: string;
  CreatorFirstName?: string | null;
  CreatorLastName?: string | null;
  CreatorUserName?: string | null;
  CompletedAtUtc?: string | null;
  CreatedOnUtc: string;
}

export interface GetAllBackupJobsRequest {
  Status?: BackupStatusValue;
  Type?: BackupTypeValue;
  CreatedFromUtc?: string;
  CreatedToUtc?: string;
  Pagination: PagedRequest;
}

export interface CreateBackupRequest {
  Type?: BackupTypeValue;
}

export interface WorkShiftDto {
  Id: string;
  Name: string;
  StartTime: string;
  EndTime: string;
  BreakMinutes: number;
  GraceMinutes: number;
  EarlyLeaveGraceMinutes: number;
  IsOvernight: boolean;
  IsActive: boolean;
  Description?: string | null;
  Color?: string | null;
}

export interface GetAllWorkShiftsRequest {
  Name?: string;
  IsActive?: boolean;
  Pagination: PagedRequest;
}

export interface CreateWorkShiftRequest {
  Name: string;
  StartTime: string;
  EndTime: string;
  BreakMinutes: number;
  GraceMinutes?: number;
  EarlyLeaveGraceMinutes?: number;
  IsOvernight?: boolean;
  IsActive?: boolean;
  Description?: string | null;
  Color?: string | null;
}

export interface UpdateWorkShiftRequest {
  Id: string;
  Name: string;
  StartTime: string;
  EndTime: string;
  BreakMinutes: number;
  GraceMinutes: number;
  EarlyLeaveGraceMinutes: number;
  IsOvernight: boolean;
  IsActive: boolean;
  Description?: string | null;
  Color?: string | null;
}

export interface EmployeeShiftScheduleDto {
  Id: number;
  EmployeeId: string;
  WorkShiftId: string;
  WorkShiftName: string;
  WorkShiftStartTime: string;
  WorkShiftEndTime: string;
  WorkShiftIsOvernight: boolean;
  EffectiveFrom: string;
  EffectiveTo?: string | null;
  Note?: string | null;
  CreatedOnUtc: string;
}

export interface GetEmployeeShiftSchedulesRequest {
  EmployeeId: string;
}

export interface CreateEmployeeShiftScheduleRequest {
  EmployeeId: string;
  WorkShiftId: string;
  EffectiveFrom: string;
  EffectiveTo?: string | null;
  Note?: string | null;
}

export interface CreateEmployeeShiftScheduleResponse {
  Id: number;
}

export interface DeleteEmployeeShiftScheduleRequest {
  Id: number;
}

export interface LeaveBalanceDto {
  Id: string;
  EmployeeId: string;
  UserFirstName?: string | null;
  UserLastName?: string | null;
  UserName?: string | null;
  DepartmentId: string;
  DepartmentName: string;
  EmployeeCode: string;
  LeaveTypeDefinitionId: string;
  LeaveTypeName: string;
  LeaveTypeCode: string;
  Year: number;
  TotalDays: number;
  UsedDays: number;
  RemainingDays: number;
}

export interface GetAllLeaveBalancesRequest {
  EmployeeId?: string;
  DepartmentId?: string;
  LeaveTypeDefinitionId?: string;
  Year?: number;
  Pagination: PagedRequest;
}

export interface CreateLeaveBalanceRequest {
  EmployeeId: string;
  LeaveTypeDefinitionId: string;
  Year: number;
  TotalDays: number;
  UsedDays: number;
}

export interface UpdateLeaveBalanceRequest {
  Id: string;
  EmployeeId: string;
  LeaveTypeDefinitionId: string;
  Year: number;
  TotalDays: number;
  UsedDays: number;
}

export interface EmployeeLeaveBalanceDto {
  Id?: string | null;
  EmployeeId: string;
  LeaveTypeDefinitionId: string;
  LeaveTypeName: string;
  AffectsLeaveBalance: boolean;
  Year: number;
  TotalDays: number;
  UsedDays: number;
  RemainingDays: number;
}

export interface GetEmployeeLeaveBalanceRequest {
  EmployeeId: string;
  LeaveTypeDefinitionId: string;
  Year?: number;
}

export interface LeaveTypeDefinitionDto {
  Id: string;
  Code: string;
  Name: string;
  Description?: string | null;
  Category: number;
  Unit: number;
  IsPaid: boolean;
  IsActive: boolean;
  AffectsLeaveBalance: boolean;
  RequiresApproval: boolean;
  DefaultAnnualAllowance?: number | null;
  MaxPerYear?: number | null;
  MaxPerRequest?: number | null;
  MinNoticeDays?: number | null;
  AllowNegativeBalance: boolean;
  CarryForwardEnabled: boolean;
  MaxCarryForwardDays?: number | null;
  IncludeWeekends: boolean;
  IncludeHolidays: boolean;
  SortOrder: number;
  Color?: string | null;
  CreatedOnUtc: string;
}

export interface GetAllLeaveTypeDefinitionsRequest {
  Code?: string;
  Name?: string;
  Category?: number;
  Unit?: number;
  IsPaid?: boolean;
  IsActive?: boolean;
  Pagination: PagedRequest;
}

export interface CreateLeaveTypeDefinitionRequest {
  Code: string;
  Name: string;
  Description?: string | null;
  Category: number;
  Unit: number;
  IsPaid: boolean;
  AffectsLeaveBalance: boolean;
  RequiresApproval: boolean;
  DefaultAnnualAllowance?: number | null;
  MaxPerYear?: number | null;
  MaxPerRequest?: number | null;
  MinNoticeDays?: number | null;
  AllowNegativeBalance: boolean;
  CarryForwardEnabled: boolean;
  MaxCarryForwardDays?: number | null;
  IncludeWeekends: boolean;
  IncludeHolidays: boolean;
  SortOrder: number;
  Color?: string | null;
}

export interface UpdateLeaveTypeDefinitionRequest extends CreateLeaveTypeDefinitionRequest {
  Id: string;
  IsActive: boolean;
}

export interface PayslipPdfResponse {
  PdfBytes: string;
  FileName: string;
  ContentType: string;
}
