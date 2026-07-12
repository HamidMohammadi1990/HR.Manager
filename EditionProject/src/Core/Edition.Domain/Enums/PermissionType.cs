using JavidHrm.Domain.Resources;
using System.ComponentModel.DataAnnotations;

namespace JavidHrm.Domain.Enums;

/// <summary>
/// HR platform permissions — commerce/print permissions removed in Phase 1.
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

    // Roles & access control
    [Display(Name = "PermissionType_ManageRoleGroup", ResourceType = typeof(EnumResources))]
    ManageRoleGroup = 24,

    [Display(Name = "PermissionType_ManageRole", ResourceType = typeof(EnumResources))]
    ManageRole = 25,

    [Display(Name = "PermissionType_CreateRole", ResourceType = typeof(EnumResources))]
    CreateRole = 26,

    [Display(Name = "PermissionType_UpdateRole", ResourceType = typeof(EnumResources))]
    UpdateRole = 37,

    [Display(Name = "PermissionType_DeleteRole", ResourceType = typeof(EnumResources))]
    DeleteRole = 38,

    [Display(Name = "PermissionType_ManagePermissionGroup", ResourceType = typeof(EnumResources))]
    ManagePermissionGroup = 51,

    [Display(Name = "PermissionType_ManagePermission", ResourceType = typeof(EnumResources))]
    ManagePermission = 52,

    [Display(Name = "PermissionType_ManageUserRoleGroup", ResourceType = typeof(EnumResources))]
    ManageUserRoleGroup = 53,

    [Display(Name = "PermissionType_ManageUserRole", ResourceType = typeof(EnumResources))]
    ManageUserRole = 54,

    [Display(Name = "PermissionType_ManageRolePermissionGroup", ResourceType = typeof(EnumResources))]
    ManageRolePermissionGroup = 55,

    [Display(Name = "PermissionType_ManageRolePermission", ResourceType = typeof(EnumResources))]
    ManageRolePermission = 56,

    // User addresses
    [Display(Name = "PermissionType_ManageUserAddressGroup", ResourceType = typeof(EnumResources))]
    ManageUserAddressGroup = 33,

    [Display(Name = "PermissionType_ManageUserAddress", ResourceType = typeof(EnumResources))]
    ManageUserAddress = 34,

    [Display(Name = "PermissionType_CreateUserAddress", ResourceType = typeof(EnumResources))]
    CreateUserAddress = 35,

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

    [Display(Name = "PermissionType_ManageCity", ResourceType = typeof(EnumResources))]
    ManageCity = 105,

    [Display(Name = "PermissionType_CreateCity", ResourceType = typeof(EnumResources))]
    CreateCity = 106,

    [Display(Name = "PermissionType_UpdateCity", ResourceType = typeof(EnumResources))]
    UpdateCity = 107,

    [Display(Name = "PermissionType_DeleteCity", ResourceType = typeof(EnumResources))]
    DeleteCity = 108,

    // Departments (formerly companies)
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

    // Website settings
    [Display(Name = "PermissionType_ManageWebSiteSettingGroup", ResourceType = typeof(EnumResources))]
    ManageWebSiteSettingGroup = 400,

    [Display(Name = "PermissionType_ManageWebSiteSetting", ResourceType = typeof(EnumResources))]
    ManageWebSiteSetting = 401,

    // Content policy
    [Display(Name = "PermissionType_ManageContentPolicyGroup", ResourceType = typeof(EnumResources))]
    ManageContentPolicyGroup = 500,

    [Display(Name = "PermissionType_ManageContentPolicy", ResourceType = typeof(EnumResources))]
    ManageContentPolicy = 501,

    // Financial (payroll foundation)
    [Display(Name = "PermissionType_ManageBankGroup", ResourceType = typeof(EnumResources))]
    ManageBankGroup = 600,

    [Display(Name = "PermissionType_ManageBank", ResourceType = typeof(EnumResources))]
    ManageBank = 601,

    [Display(Name = "PermissionType_ManageFinancialYearGroup", ResourceType = typeof(EnumResources))]
    ManageFinancialYearGroup = 610,

    [Display(Name = "PermissionType_ManageFinancialYear", ResourceType = typeof(EnumResources))]
    ManageFinancialYear = 611,

    [Display(Name = "PermissionType_ManageChartOfAccountGroup", ResourceType = typeof(EnumResources))]
    ManageChartOfAccountGroup = 620,

    [Display(Name = "PermissionType_ManageChartOfAccount", ResourceType = typeof(EnumResources))]
    ManageChartOfAccount = 621,
}
