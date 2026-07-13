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
  Gender?: number | null;
  IsActive: boolean;
  LastLoginDateOnUtc?: string | null;
  AccessFailedCount: number;
  CityId?: string | null;
  CityName?: string | null;
}

export interface GetAllUsersRequest {
  UserName?: string;
  FirstName?: string;
  LastName?: string;
  Email?: string;
  PhoneNumber?: string;
  IsActive?: boolean;
  Pagination: PagedRequest;
}

export interface DepartmentDto {
  Id: string;
  Name: string;
  Code: string;
  CityId: string;
  CityName: string;
  IsActive: boolean;
  Address: string;
  Email?: string | null;
  PhoneNumber: string;
  PostalCode: string;
  ProvinceId: string;
  ProvinceName: string;
  UserId: string;
  UserFirstName?: string | null;
  UserLastName?: string | null;
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

export interface CityDto {
  Id: string;
  ProvinceId: string;
  ProvinceName: string;
  Name: string;
  Slug: string;
}

export interface SearchCitiesRequest {
  Name?: string;
  Pagination: PagedRequest;
}

export interface CreateUserRequest {
  CityId: string;
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
  CityId: string;
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
  EmployeeCode: string;
  JobTitle: string;
  HireDate: string;
  IsActive: boolean;
}

export interface GetEmployeeRequest {
  Id: string;
}

export interface CreateDepartmentRequest {
  CityId: string;
  Name: string;
  Code: string;
  PhoneNumber: string;
  Email?: string | null;
  PostalCode: string;
  Address: string;
  Description?: string | null;
  Latitude?: number;
  Longitude?: number;
  IsActive?: boolean;
}

export interface CreateDepartmentResponse {
  Id: string;
}

export interface UpdateDepartmentRequest {
  Id: string;
  CityId: string;
  Name: string;
  Code: string;
  PhoneNumber: string;
  Email: string;
  PostalCode: string;
  Address: string;
  Description: string;
  Latitude?: number;
  Longitude?: number;
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
  LeaveType: number;
  StartDate: string;
  EndDate: string;
  Status: number;
  Reason?: string | null;
  CreatedOnUtc: string;
}

export interface GetAllLeaveRequestsRequest {
  EmployeeId?: string;
  DepartmentId?: string;
  LeaveType?: number;
  Status?: number;
  Pagination: PagedRequest;
}

export interface CreateLeaveRequestRequest {
  EmployeeId: string;
  LeaveType: number;
  StartDate: string;
  EndDate: string;
  Reason?: string | null;
}

export interface UpdateLeaveRequestRequest {
  Id: string;
  EmployeeId: string;
  LeaveType: number;
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
  IsActive: boolean;
  Description?: string | null;
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
  IsActive?: boolean;
  Description?: string | null;
}

export interface UpdateWorkShiftRequest {
  Id: string;
  Name: string;
  StartTime: string;
  EndTime: string;
  BreakMinutes: number;
  IsActive: boolean;
  Description?: string | null;
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
  LeaveType: number;
  Year: number;
  TotalDays: number;
  UsedDays: number;
  RemainingDays: number;
}

export interface GetAllLeaveBalancesRequest {
  EmployeeId?: string;
  DepartmentId?: string;
  LeaveType?: number;
  Year?: number;
  Pagination: PagedRequest;
}

export interface CreateLeaveBalanceRequest {
  EmployeeId: string;
  LeaveType: number;
  Year: number;
  TotalDays: number;
  UsedDays: number;
}

export interface UpdateLeaveBalanceRequest {
  Id: string;
  EmployeeId: string;
  LeaveType: number;
  Year: number;
  TotalDays: number;
  UsedDays: number;
}

export interface PayslipPdfResponse {
  PdfBytes: string;
  FileName: string;
  ContentType: string;
}
