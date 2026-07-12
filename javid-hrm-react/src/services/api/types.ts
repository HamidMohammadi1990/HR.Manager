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
  BaseSalary: number;
  GrossAmount: number;
  Deductions: number;
  NetAmount: number;
  Status: number;
  Notes?: string | null;
}
