using JavidHrm.Domain.Resources;
using System.ComponentModel.DataAnnotations;

namespace JavidHrm.Domain.Enums;

/// <summary>
/// HR platform permissions aligned with active admin API controllers.
/// </summary>
public enum PermissionType : int
{
    // Users & authentication
    [Display(Name = "PermissionType_ManageUsersGroup", ResourceType = typeof(EnumResources))]
    ManageUsersGroup = 2,

    [Display(Name = "PermissionType_ManageUsers", ResourceType = typeof(EnumResources))]
    ManageUsers = 3,

    [Display(Name = "PermissionType_CreateUser", ResourceType = typeof(EnumResources))]
    CreateUser = 4,

    [Display(Name = "PermissionType_UpdateUser", ResourceType = typeof(EnumResources))]
    UpdateUser = 5,

    [Display(Name = "PermissionType_ListUser", ResourceType = typeof(EnumResources))]
    ListUser = 6,

    [Display(Name = "PermissionType_DeleteUser", ResourceType = typeof(EnumResources))]
    DeleteUser = 7,

    [Display(Name = "PermissionType_GetUserById", ResourceType = typeof(EnumResources))]
    GetUserById = 8,

    [Display(Name = "PermissionType_ChangeUserPassword", ResourceType = typeof(EnumResources))]
    ChangeUserPassword = 36,

    // Roles
    [Display(Name = "PermissionType_ManageRoleGroup", ResourceType = typeof(EnumResources))]
    ManageRoleGroup = 24,

    [Display(Name = "PermissionType_ManageRole", ResourceType = typeof(EnumResources))]
    ManageRole = 25,

    [Display(Name = "PermissionType_CreateRole", ResourceType = typeof(EnumResources))]
    CreateRole = 26,

    [Display(Name = "PermissionType_ListRole", ResourceType = typeof(EnumResources))]
    ListRole = 27,

    [Display(Name = "PermissionType_GetRoleById", ResourceType = typeof(EnumResources))]
    GetRoleById = 28,

    [Display(Name = "PermissionType_UpdateRole", ResourceType = typeof(EnumResources))]
    UpdateRole = 37,

    [Display(Name = "PermissionType_DeleteRole", ResourceType = typeof(EnumResources))]
    DeleteRole = 38,

    // Permissions
    [Display(Name = "PermissionType_ManagePermissionGroup", ResourceType = typeof(EnumResources))]
    ManagePermissionGroup = 51,

    [Display(Name = "PermissionType_ManagePermission", ResourceType = typeof(EnumResources))]
    ManagePermission = 52,

    [Display(Name = "PermissionType_ListPermission", ResourceType = typeof(EnumResources))]
    ListPermission = 57,

    [Display(Name = "PermissionType_GetPermissionById", ResourceType = typeof(EnumResources))]
    GetPermissionById = 58,

    [Display(Name = "PermissionType_CheckPermission", ResourceType = typeof(EnumResources))]
    CheckPermission = 59,

    [Display(Name = "PermissionType_CreateManagedPermission", ResourceType = typeof(EnumResources))]
    CreateManagedPermission = 60,

    [Display(Name = "PermissionType_UpdatePermission", ResourceType = typeof(EnumResources))]
    UpdatePermission = 61,

    [Display(Name = "PermissionType_DeletePermission", ResourceType = typeof(EnumResources))]
    DeletePermission = 62,

    // User roles
    [Display(Name = "PermissionType_ManageUserRoleGroup", ResourceType = typeof(EnumResources))]
    ManageUserRoleGroup = 53,

    [Display(Name = "PermissionType_ManageUserRole", ResourceType = typeof(EnumResources))]
    ManageUserRole = 54,

    [Display(Name = "PermissionType_ListUserRole", ResourceType = typeof(EnumResources))]
    ListUserRole = 63,

    [Display(Name = "PermissionType_GetUserRoleById", ResourceType = typeof(EnumResources))]
    GetUserRoleById = 64,

    [Display(Name = "PermissionType_AssignUserRole", ResourceType = typeof(EnumResources))]
    AssignUserRole = 65,

    [Display(Name = "PermissionType_DeleteUserRole", ResourceType = typeof(EnumResources))]
    DeleteUserRole = 66,

    // Role permissions
    [Display(Name = "PermissionType_ManageRolePermissionGroup", ResourceType = typeof(EnumResources))]
    ManageRolePermissionGroup = 55,

    [Display(Name = "PermissionType_ManageRolePermission", ResourceType = typeof(EnumResources))]
    ManageRolePermission = 56,

    [Display(Name = "PermissionType_ListRolePermission", ResourceType = typeof(EnumResources))]
    ListRolePermission = 67,

    [Display(Name = "PermissionType_GetRolePermissionById", ResourceType = typeof(EnumResources))]
    GetRolePermissionById = 68,

    [Display(Name = "PermissionType_AssignRolePermission", ResourceType = typeof(EnumResources))]
    AssignRolePermission = 69,

    [Display(Name = "PermissionType_DeleteRolePermission", ResourceType = typeof(EnumResources))]
    DeleteRolePermission = 70,

    // User addresses
    [Display(Name = "PermissionType_ManageUserAddressGroup", ResourceType = typeof(EnumResources))]
    ManageUserAddressGroup = 33,

    [Display(Name = "PermissionType_ManageUserAddress", ResourceType = typeof(EnumResources))]
    ManageUserAddress = 34,

    [Display(Name = "PermissionType_CreateUserAddress", ResourceType = typeof(EnumResources))]
    CreateUserAddress = 35,

    [Display(Name = "PermissionType_ListUserAddress", ResourceType = typeof(EnumResources))]
    ListUserAddress = 39,

    [Display(Name = "PermissionType_GetUserAddressById", ResourceType = typeof(EnumResources))]
    GetUserAddressById = 40,

    // Location
    [Display(Name = "PermissionType_ManageLocationGroup", ResourceType = typeof(EnumResources))]
    ManageLocationGroup = 100,

    [Display(Name = "PermissionType_ManageProvince", ResourceType = typeof(EnumResources))]
    ManageProvince = 101,

    [Display(Name = "PermissionType_CreateProvince", ResourceType = typeof(EnumResources))]
    CreateProvince = 102,

    [Display(Name = "PermissionType_UpdateProvince", ResourceType = typeof(EnumResources))]
    UpdateProvince = 103,

    [Display(Name = "PermissionType_DeleteProvince", ResourceType = typeof(EnumResources))]
    DeleteProvince = 104,

    [Display(Name = "PermissionType_ListProvince", ResourceType = typeof(EnumResources))]
    ListProvince = 109,

    [Display(Name = "PermissionType_GetProvinceById", ResourceType = typeof(EnumResources))]
    GetProvinceById = 110,

    [Display(Name = "PermissionType_ManageCity", ResourceType = typeof(EnumResources))]
    ManageCity = 105,

    [Display(Name = "PermissionType_CreateCity", ResourceType = typeof(EnumResources))]
    CreateCity = 106,

    [Display(Name = "PermissionType_UpdateCity", ResourceType = typeof(EnumResources))]
    UpdateCity = 107,

    [Display(Name = "PermissionType_DeleteCity", ResourceType = typeof(EnumResources))]
    DeleteCity = 108,

    [Display(Name = "PermissionType_ListCity", ResourceType = typeof(EnumResources))]
    ListCity = 111,

    [Display(Name = "PermissionType_GetCityById", ResourceType = typeof(EnumResources))]
    GetCityById = 112,

    // Departments
    [Display(Name = "PermissionType_ManageDepartmentGroup", ResourceType = typeof(EnumResources))]
    ManageDepartmentGroup = 200,

    [Display(Name = "PermissionType_ManageDepartment", ResourceType = typeof(EnumResources))]
    ManageDepartment = 201,

    [Display(Name = "PermissionType_ListDepartment", ResourceType = typeof(EnumResources))]
    ListDepartment = 345,

    [Display(Name = "PermissionType_GetDepartmentById", ResourceType = typeof(EnumResources))]
    GetDepartmentById = 346,

    [Display(Name = "PermissionType_CreateDepartment", ResourceType = typeof(EnumResources))]
    CreateDepartment = 347,

    [Display(Name = "PermissionType_UpdateDepartment", ResourceType = typeof(EnumResources))]
    UpdateDepartment = 348,

    [Display(Name = "PermissionType_DeleteDepartment", ResourceType = typeof(EnumResources))]
    DeleteDepartment = 349,

    // Website / CMS settings
    [Display(Name = "PermissionType_ManageCmsGroup", ResourceType = typeof(EnumResources))]
    ManageCmsGroup = 399,

    [Display(Name = "PermissionType_ManageWebSiteSettingGroup", ResourceType = typeof(EnumResources))]
    ManageWebSiteSettingGroup = 400,

    [Display(Name = "PermissionType_ManageWebSiteSetting", ResourceType = typeof(EnumResources))]
    ManageWebSiteSetting = 401,

    [Display(Name = "PermissionType_GetWebSiteSettingById", ResourceType = typeof(EnumResources))]
    GetWebSiteSettingById = 402,

    [Display(Name = "PermissionType_UpdateWebSiteSetting", ResourceType = typeof(EnumResources))]
    UpdateWebSiteSetting = 403,

    // Content policy
    [Display(Name = "PermissionType_ManageContentPolicyGroup", ResourceType = typeof(EnumResources))]
    ManageContentPolicyGroup = 500,

    [Display(Name = "PermissionType_ManageContentPolicy", ResourceType = typeof(EnumResources))]
    ManageContentPolicy = 501,

    [Display(Name = "PermissionType_ListContentPolicy", ResourceType = typeof(EnumResources))]
    ListContentPolicy = 502,

    [Display(Name = "PermissionType_GetContentPolicyById", ResourceType = typeof(EnumResources))]
    GetContentPolicyById = 503,

    [Display(Name = "PermissionType_CreateContentPolicy", ResourceType = typeof(EnumResources))]
    CreateContentPolicy = 504,

    [Display(Name = "PermissionType_UpdateContentPolicy", ResourceType = typeof(EnumResources))]
    UpdateContentPolicy = 505,

    [Display(Name = "PermissionType_DeleteContentPolicy", ResourceType = typeof(EnumResources))]
    DeleteContentPolicy = 506,

    // Content policy metadata
    [Display(Name = "PermissionType_ManageContentPolicyMetadataGroup", ResourceType = typeof(EnumResources))]
    ManageContentPolicyMetadataGroup = 520,

    [Display(Name = "PermissionType_ManageContentPolicyMetadata", ResourceType = typeof(EnumResources))]
    ManageContentPolicyMetadata = 521,

    [Display(Name = "PermissionType_ContentPolicy_GetEntityTypes", ResourceType = typeof(EnumResources))]
    ContentPolicy_GetEntityTypes = 522,

    [Display(Name = "PermissionType_ContentPolicy_GetEntitySchema", ResourceType = typeof(EnumResources))]
    ContentPolicy_GetEntitySchema = 523,

    [Display(Name = "PermissionType_ContentPolicy_GetRuleOptions", ResourceType = typeof(EnumResources))]
    ContentPolicy_GetRuleOptions = 524,

    [Display(Name = "PermissionType_ContentPolicy_GetPropertyOperators", ResourceType = typeof(EnumResources))]
    ContentPolicy_GetPropertyOperators = 525,

    [Display(Name = "PermissionType_ContentPolicy_ValidateRules", ResourceType = typeof(EnumResources))]
    ContentPolicy_ValidateRules = 526,

    [Display(Name = "PermissionType_ContentPolicy_Preview", ResourceType = typeof(EnumResources))]
    ContentPolicy_Preview = 527,

    [Display(Name = "PermissionType_ContentPolicy_CompareMerge", ResourceType = typeof(EnumResources))]
    ContentPolicy_CompareMerge = 528,

    // Content policy rules
    [Display(Name = "PermissionType_ManageContentPolicyRuleGroup", ResourceType = typeof(EnumResources))]
    ManageContentPolicyRuleGroup = 530,

    [Display(Name = "PermissionType_ManageContentPolicyRule", ResourceType = typeof(EnumResources))]
    ManageContentPolicyRule = 531,

    [Display(Name = "PermissionType_ListContentPolicyRule", ResourceType = typeof(EnumResources))]
    ListContentPolicyRule = 532,

    [Display(Name = "PermissionType_GetContentPolicyRuleById", ResourceType = typeof(EnumResources))]
    GetContentPolicyRuleById = 533,

    [Display(Name = "PermissionType_CreateContentPolicyRule", ResourceType = typeof(EnumResources))]
    CreateContentPolicyRule = 534,

    [Display(Name = "PermissionType_UpdateContentPolicyRule", ResourceType = typeof(EnumResources))]
    UpdateContentPolicyRule = 535,

    [Display(Name = "PermissionType_DeleteContentPolicyRule", ResourceType = typeof(EnumResources))]
    DeleteContentPolicyRule = 536,

    // Content policy record access
    [Display(Name = "PermissionType_ManageContentPolicyRecordAccessGroup", ResourceType = typeof(EnumResources))]
    ManageContentPolicyRecordAccessGroup = 540,

    [Display(Name = "PermissionType_ManageContentPolicyRecordAccess", ResourceType = typeof(EnumResources))]
    ManageContentPolicyRecordAccess = 541,

    [Display(Name = "PermissionType_ListContentPolicyRecordAccess", ResourceType = typeof(EnumResources))]
    ListContentPolicyRecordAccess = 542,

    [Display(Name = "PermissionType_GetContentPolicyRecordAccessById", ResourceType = typeof(EnumResources))]
    GetContentPolicyRecordAccessById = 543,

    [Display(Name = "PermissionType_CreateContentPolicyRecordAccess", ResourceType = typeof(EnumResources))]
    CreateContentPolicyRecordAccess = 544,

    [Display(Name = "PermissionType_SetContentPolicyRecordAccess", ResourceType = typeof(EnumResources))]
    SetContentPolicyRecordAccess = 545,

    [Display(Name = "PermissionType_DeleteContentPolicyRecordAccess", ResourceType = typeof(EnumResources))]
    DeleteContentPolicyRecordAccess = 546,

    // Financial
    [Display(Name = "PermissionType_ManageFinancialGroup", ResourceType = typeof(EnumResources))]
    ManageFinancialGroup = 602,

    [Display(Name = "PermissionType_ManageBankGroup", ResourceType = typeof(EnumResources))]
    ManageBankGroup = 600,

    [Display(Name = "PermissionType_ManageBank", ResourceType = typeof(EnumResources))]
    ManageBank = 601,

    [Display(Name = "PermissionType_ListBank", ResourceType = typeof(EnumResources))]
    ListBank = 603,

    [Display(Name = "PermissionType_GetBankById", ResourceType = typeof(EnumResources))]
    GetBankById = 604,

    [Display(Name = "PermissionType_CreateBank", ResourceType = typeof(EnumResources))]
    CreateBank = 605,

    [Display(Name = "PermissionType_UpdateBank", ResourceType = typeof(EnumResources))]
    UpdateBank = 606,

    [Display(Name = "PermissionType_DeleteBank", ResourceType = typeof(EnumResources))]
    DeleteBank = 607,

    [Display(Name = "PermissionType_ManageFinancialYearGroup", ResourceType = typeof(EnumResources))]
    ManageFinancialYearGroup = 610,

    [Display(Name = "PermissionType_ManageFinancialYear", ResourceType = typeof(EnumResources))]
    ManageFinancialYear = 611,

    [Display(Name = "PermissionType_ListFinancialYear", ResourceType = typeof(EnumResources))]
    ListFinancialYear = 612,

    [Display(Name = "PermissionType_GetFinancialYearById", ResourceType = typeof(EnumResources))]
    GetFinancialYearById = 613,

    [Display(Name = "PermissionType_CreateFinancialYear", ResourceType = typeof(EnumResources))]
    CreateFinancialYear = 614,

    [Display(Name = "PermissionType_UpdateFinancialYear", ResourceType = typeof(EnumResources))]
    UpdateFinancialYear = 615,

    [Display(Name = "PermissionType_DeleteFinancialYear", ResourceType = typeof(EnumResources))]
    DeleteFinancialYear = 616,

    [Display(Name = "PermissionType_ManageChartOfAccountGroup", ResourceType = typeof(EnumResources))]
    ManageChartOfAccountGroup = 620,

    [Display(Name = "PermissionType_ManageChartOfAccount", ResourceType = typeof(EnumResources))]
    ManageChartOfAccount = 621,

    [Display(Name = "PermissionType_ListChartOfAccount", ResourceType = typeof(EnumResources))]
    ListChartOfAccount = 622,

    [Display(Name = "PermissionType_GetChartOfAccountById", ResourceType = typeof(EnumResources))]
    GetChartOfAccountById = 623,

    [Display(Name = "PermissionType_CreateChartOfAccount", ResourceType = typeof(EnumResources))]
    CreateChartOfAccount = 624,

    [Display(Name = "PermissionType_UpdateChartOfAccount", ResourceType = typeof(EnumResources))]
    UpdateChartOfAccount = 625,

    [Display(Name = "PermissionType_DeleteChartOfAccount", ResourceType = typeof(EnumResources))]
    DeleteChartOfAccount = 626,

    // Employees
    [Display(Name = "PermissionType_ManageEmployeeGroup", ResourceType = typeof(EnumResources))]
    ManageEmployeeGroup = 700,

    [Display(Name = "PermissionType_ManageEmployee", ResourceType = typeof(EnumResources))]
    ManageEmployee = 701,

    [Display(Name = "PermissionType_ListEmployee", ResourceType = typeof(EnumResources))]
    ListEmployee = 702,

    [Display(Name = "PermissionType_GetEmployeeById", ResourceType = typeof(EnumResources))]
    GetEmployeeById = 703,

    [Display(Name = "PermissionType_CreateEmployee", ResourceType = typeof(EnumResources))]
    CreateEmployee = 704,

    [Display(Name = "PermissionType_UpdateEmployee", ResourceType = typeof(EnumResources))]
    UpdateEmployee = 705,

    [Display(Name = "PermissionType_DeleteEmployee", ResourceType = typeof(EnumResources))]
    DeleteEmployee = 706,

    // Attendance
    [Display(Name = "PermissionType_ManageAttendanceGroup", ResourceType = typeof(EnumResources))]
    ManageAttendanceGroup = 800,

    [Display(Name = "PermissionType_ManageAttendance", ResourceType = typeof(EnumResources))]
    ManageAttendance = 801,

    [Display(Name = "PermissionType_ListAttendance", ResourceType = typeof(EnumResources))]
    ListAttendance = 802,

    [Display(Name = "PermissionType_GetAttendanceById", ResourceType = typeof(EnumResources))]
    GetAttendanceById = 803,

    [Display(Name = "PermissionType_CreateAttendance", ResourceType = typeof(EnumResources))]
    CreateAttendance = 804,

    [Display(Name = "PermissionType_UpdateAttendance", ResourceType = typeof(EnumResources))]
    UpdateAttendance = 805,

    [Display(Name = "PermissionType_DeleteAttendance", ResourceType = typeof(EnumResources))]
    DeleteAttendance = 806,

    // Leaves
    [Display(Name = "PermissionType_ManageLeaveGroup", ResourceType = typeof(EnumResources))]
    ManageLeaveGroup = 900,

    [Display(Name = "PermissionType_ManageLeave", ResourceType = typeof(EnumResources))]
    ManageLeave = 901,

    [Display(Name = "PermissionType_ListLeave", ResourceType = typeof(EnumResources))]
    ListLeave = 902,

    [Display(Name = "PermissionType_GetLeaveById", ResourceType = typeof(EnumResources))]
    GetLeaveById = 903,

    [Display(Name = "PermissionType_CreateLeave", ResourceType = typeof(EnumResources))]
    CreateLeave = 904,

    [Display(Name = "PermissionType_UpdateLeave", ResourceType = typeof(EnumResources))]
    UpdateLeave = 905,

    [Display(Name = "PermissionType_DeleteLeave", ResourceType = typeof(EnumResources))]
    DeleteLeave = 906,

    // Payroll
    [Display(Name = "PermissionType_ManagePayrollGroup", ResourceType = typeof(EnumResources))]
    ManagePayrollGroup = 1000,

    [Display(Name = "PermissionType_ManagePayroll", ResourceType = typeof(EnumResources))]
    ManagePayroll = 1001,

    [Display(Name = "PermissionType_ListPayroll", ResourceType = typeof(EnumResources))]
    ListPayroll = 1002,

    [Display(Name = "PermissionType_GetPayrollById", ResourceType = typeof(EnumResources))]
    GetPayrollById = 1003,

    [Display(Name = "PermissionType_CreatePayroll", ResourceType = typeof(EnumResources))]
    CreatePayroll = 1004,

    [Display(Name = "PermissionType_UpdatePayroll", ResourceType = typeof(EnumResources))]
    UpdatePayroll = 1005,

    [Display(Name = "PermissionType_DeletePayroll", ResourceType = typeof(EnumResources))]
    DeletePayroll = 1006,
}
