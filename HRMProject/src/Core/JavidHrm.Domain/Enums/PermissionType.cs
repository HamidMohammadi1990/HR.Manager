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

    [Display(Name = "PermissionType_CheckInAttendance", ResourceType = typeof(EnumResources))]
    CheckInAttendance = 807,

    [Display(Name = "PermissionType_CheckOutAttendance", ResourceType = typeof(EnumResources))]
    CheckOutAttendance = 808,

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

    [Display(Name = "PermissionType_ApproveLeave", ResourceType = typeof(EnumResources))]
    ApproveLeave = 907,

    [Display(Name = "PermissionType_RejectLeave", ResourceType = typeof(EnumResources))]
    RejectLeave = 908,

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

    [Display(Name = "PermissionType_DownloadPayslip", ResourceType = typeof(EnumResources))]
    DownloadPayslip = 1007,

    [Display(Name = "PermissionType_ApprovePayroll", ResourceType = typeof(EnumResources))]
    ApprovePayroll = 1008,

    [Display(Name = "PermissionType_MarkPayrollPaid", ResourceType = typeof(EnumResources))]
    MarkPayrollPaid = 1009,

    // Notifications
    [Display(Name = "PermissionType_ManageNotificationGroup", ResourceType = typeof(EnumResources))]
    ManageNotificationGroup = 1100,

    [Display(Name = "PermissionType_ManageNotification", ResourceType = typeof(EnumResources))]
    ManageNotification = 1101,

    [Display(Name = "PermissionType_ListNotification", ResourceType = typeof(EnumResources))]
    ListNotification = 1102,

    [Display(Name = "PermissionType_GetNotificationById", ResourceType = typeof(EnumResources))]
    GetNotificationById = 1103,

    [Display(Name = "PermissionType_CreateNotification", ResourceType = typeof(EnumResources))]
    CreateNotification = 1104,

    [Display(Name = "PermissionType_UpdateNotification", ResourceType = typeof(EnumResources))]
    UpdateNotification = 1105,

    [Display(Name = "PermissionType_DeleteNotification", ResourceType = typeof(EnumResources))]
    DeleteNotification = 1106,

    [Display(Name = "PermissionType_GetUnreadNotificationCount", ResourceType = typeof(EnumResources))]
    GetUnreadNotificationCount = 1107,

    [Display(Name = "PermissionType_MarkNotificationRead", ResourceType = typeof(EnumResources))]
    MarkNotificationRead = 1108,

    [Display(Name = "PermissionType_MarkAllNotificationsRead", ResourceType = typeof(EnumResources))]
    MarkAllNotificationsRead = 1109,

    [Display(Name = "PermissionType_DeleteReadNotifications", ResourceType = typeof(EnumResources))]
    DeleteReadNotifications = 1110,

    // Announcements
    [Display(Name = "PermissionType_ManageAnnouncementGroup", ResourceType = typeof(EnumResources))]
    ManageAnnouncementGroup = 1200,

    [Display(Name = "PermissionType_ManageAnnouncement", ResourceType = typeof(EnumResources))]
    ManageAnnouncement = 1201,

    [Display(Name = "PermissionType_ListAnnouncement", ResourceType = typeof(EnumResources))]
    ListAnnouncement = 1202,

    [Display(Name = "PermissionType_GetAnnouncementById", ResourceType = typeof(EnumResources))]
    GetAnnouncementById = 1203,

    [Display(Name = "PermissionType_CreateAnnouncement", ResourceType = typeof(EnumResources))]
    CreateAnnouncement = 1204,

    [Display(Name = "PermissionType_UpdateAnnouncement", ResourceType = typeof(EnumResources))]
    UpdateAnnouncement = 1205,

    [Display(Name = "PermissionType_DeleteAnnouncement", ResourceType = typeof(EnumResources))]
    DeleteAnnouncement = 1206,

    [Display(Name = "PermissionType_PublishAnnouncement", ResourceType = typeof(EnumResources))]
    PublishAnnouncement = 1207,

    [Display(Name = "PermissionType_ArchiveAnnouncement", ResourceType = typeof(EnumResources))]
    ArchiveAnnouncement = 1208,

    // Calendar events
    [Display(Name = "PermissionType_ManageCalendarEventGroup", ResourceType = typeof(EnumResources))]
    ManageCalendarEventGroup = 1300,

    [Display(Name = "PermissionType_ManageCalendarEvent", ResourceType = typeof(EnumResources))]
    ManageCalendarEvent = 1301,

    [Display(Name = "PermissionType_ListCalendarEvent", ResourceType = typeof(EnumResources))]
    ListCalendarEvent = 1302,

    [Display(Name = "PermissionType_GetCalendarEventById", ResourceType = typeof(EnumResources))]
    GetCalendarEventById = 1303,

    [Display(Name = "PermissionType_CreateCalendarEvent", ResourceType = typeof(EnumResources))]
    CreateCalendarEvent = 1304,

    [Display(Name = "PermissionType_UpdateCalendarEvent", ResourceType = typeof(EnumResources))]
    UpdateCalendarEvent = 1305,

    [Display(Name = "PermissionType_DeleteCalendarEvent", ResourceType = typeof(EnumResources))]
    DeleteCalendarEvent = 1306,

    // Todo items
    [Display(Name = "PermissionType_ManageTodoItemGroup", ResourceType = typeof(EnumResources))]
    ManageTodoItemGroup = 1400,

    [Display(Name = "PermissionType_ManageTodoItem", ResourceType = typeof(EnumResources))]
    ManageTodoItem = 1401,

    [Display(Name = "PermissionType_ListTodoItem", ResourceType = typeof(EnumResources))]
    ListTodoItem = 1402,

    [Display(Name = "PermissionType_GetTodoItemById", ResourceType = typeof(EnumResources))]
    GetTodoItemById = 1403,

    [Display(Name = "PermissionType_CreateTodoItem", ResourceType = typeof(EnumResources))]
    CreateTodoItem = 1404,

    [Display(Name = "PermissionType_UpdateTodoItem", ResourceType = typeof(EnumResources))]
    UpdateTodoItem = 1405,

    [Display(Name = "PermissionType_DeleteTodoItem", ResourceType = typeof(EnumResources))]
    DeleteTodoItem = 1406,

    [Display(Name = "PermissionType_ToggleCompleteTodoItem", ResourceType = typeof(EnumResources))]
    ToggleCompleteTodoItem = 1407,

    // Work shifts
    [Display(Name = "PermissionType_ManageWorkShiftGroup", ResourceType = typeof(EnumResources))]
    ManageWorkShiftGroup = 1500,

    [Display(Name = "PermissionType_ManageWorkShift", ResourceType = typeof(EnumResources))]
    ManageWorkShift = 1501,

    [Display(Name = "PermissionType_ListWorkShift", ResourceType = typeof(EnumResources))]
    ListWorkShift = 1502,

    [Display(Name = "PermissionType_GetWorkShiftById", ResourceType = typeof(EnumResources))]
    GetWorkShiftById = 1503,

    [Display(Name = "PermissionType_CreateWorkShift", ResourceType = typeof(EnumResources))]
    CreateWorkShift = 1504,

    [Display(Name = "PermissionType_UpdateWorkShift", ResourceType = typeof(EnumResources))]
    UpdateWorkShift = 1505,

    [Display(Name = "PermissionType_DeleteWorkShift", ResourceType = typeof(EnumResources))]
    DeleteWorkShift = 1506,

    // Leave balances
    [Display(Name = "PermissionType_ManageLeaveBalanceGroup", ResourceType = typeof(EnumResources))]
    ManageLeaveBalanceGroup = 1600,

    [Display(Name = "PermissionType_ManageLeaveBalance", ResourceType = typeof(EnumResources))]
    ManageLeaveBalance = 1601,

    [Display(Name = "PermissionType_ListLeaveBalance", ResourceType = typeof(EnumResources))]
    ListLeaveBalance = 1602,

    [Display(Name = "PermissionType_GetLeaveBalanceById", ResourceType = typeof(EnumResources))]
    GetLeaveBalanceById = 1603,

    [Display(Name = "PermissionType_CreateLeaveBalance", ResourceType = typeof(EnumResources))]
    CreateLeaveBalance = 1604,

    [Display(Name = "PermissionType_UpdateLeaveBalance", ResourceType = typeof(EnumResources))]
    UpdateLeaveBalance = 1605,

    [Display(Name = "PermissionType_DeleteLeaveBalance", ResourceType = typeof(EnumResources))]
    DeleteLeaveBalance = 1606,

    // Backup jobs
    [Display(Name = "PermissionType_ManageBackupJobGroup", ResourceType = typeof(EnumResources))]
    ManageBackupJobGroup = 1700,

    [Display(Name = "PermissionType_ManageBackupJob", ResourceType = typeof(EnumResources))]
    ManageBackupJob = 1701,

    [Display(Name = "PermissionType_ListBackupJob", ResourceType = typeof(EnumResources))]
    ListBackupJob = 1702,

    [Display(Name = "PermissionType_GetBackupJobById", ResourceType = typeof(EnumResources))]
    GetBackupJobById = 1703,

    [Display(Name = "PermissionType_CreateBackupJob", ResourceType = typeof(EnumResources))]
    CreateBackupJob = 1704,

    [Display(Name = "PermissionType_UpdateBackupJob", ResourceType = typeof(EnumResources))]
    UpdateBackupJob = 1705,

    [Display(Name = "PermissionType_DeleteBackupJob", ResourceType = typeof(EnumResources))]
    DeleteBackupJob = 1706,

    [Display(Name = "PermissionType_RunBackupJob", ResourceType = typeof(EnumResources))]
    RunBackupJob = 1707,

    [Display(Name = "PermissionType_DownloadBackupJob", ResourceType = typeof(EnumResources))]
    DownloadBackupJob = 1708,
}
