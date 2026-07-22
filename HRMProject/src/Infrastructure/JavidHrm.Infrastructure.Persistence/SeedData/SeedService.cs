using JavidHrm.Domain.Enums;
using JavidHrm.Domain.Entities;
using JavidHrm.Common.Security;
using JavidHrm.Domain.Dtos.Others;
using JavidHrm.Infrastructure.Persistence.Contracts;
using JavidHrm.Infrastructure.Persistence.Configurations;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace JavidHrm.Infrastructure.Persistence.SeedData;

public class SeedService(
    JavidHrmDbContext context,
    IPasswordHasher passwordHasher,
    IOptions<SeedSettings> seedSettings)
    : ISeedService
{
    private readonly SeedSettings settings = seedSettings.Value;

    public async Task SeedDataAsync(List<DynamicPermission> dynamicPermissions)
    {
        if (!settings.Enabled)
            return;

        await SeedDefaultRolesAsync();

        if (dynamicPermissions.Count > 0)
            await SeedPermissionsAsync(dynamicPermissions);

        await SeedRolePermissionAssignmentsAsync();

        await SeedAdminUserAsync();
        await SeedContentPoliciesAsync();
        await SeedWorkShiftsAsync();
        await SeedLeaveTypeDefinitionsAsync();

        if (settings.SeedDemoUsers)
            await SeedDemoUsersAsync();
    }

    private async Task SeedDefaultRolesAsync()
    {
        await EnsureRoleAsync(HrSeedDefaults.SystemAdminRole, bypassContentPolicy: true);
        await EnsureRoleAsync(HrSeedDefaults.HrManagerRole);
        await EnsureRoleAsync(HrSeedDefaults.EmployeeRole);
    }

    private async Task SeedRolePermissionAssignmentsAsync()
    {
        var systemAdminRole = await context.Role
            .FirstOrDefaultAsync(x => x.Title == HrSeedDefaults.SystemAdminRole);
        var hrManagerRole = await context.Role
            .FirstOrDefaultAsync(x => x.Title == HrSeedDefaults.HrManagerRole);
        var employeeRole = await context.Role
            .FirstOrDefaultAsync(x => x.Title == HrSeedDefaults.EmployeeRole);

        if (systemAdminRole is not null)
            await EnsureRoleHasAllPermissionsAsync(systemAdminRole);

        if (hrManagerRole is not null)
            await EnsureRolePermissionsAsync(hrManagerRole, HrRolePermissionDefinitions.HrManager, exactMatch: true);

        if (employeeRole is not null)
            await EnsureRolePermissionsAsync(employeeRole, HrRolePermissionDefinitions.Employee, exactMatch: true);
    }

    private async Task EnsureRoleHasAllPermissionsAsync(Role role)
    {
        var permissionIds = await context.Permission.Select(x => x.Id).ToListAsync();
        var assignedPermissionIds = await context.RolePermission
            .Where(x => x.RoleId == role.Id)
            .Select(x => x.PermissionId)
            .ToListAsync();

        foreach (var permissionId in permissionIds.Except(assignedPermissionIds))
            context.RolePermission.Add(RolePermission.Create(role.Id, permissionId));

        await context.SaveChangesAsync();
    }

    private async Task EnsureRolePermissionsAsync(
        Role role,
        IReadOnlyCollection<PermissionType> permissionTypes,
        bool exactMatch = false)
    {
        var desiredPermissionIds = permissionTypes
            .Select(x => (PermissionType)x)
            .Distinct()
            .ToHashSet();

        var availablePermissionIds = await context.Permission
            .Select(x => x.Id)
            .ToListAsync();

        var existingAssignments = await context.RolePermission
            .Where(x => x.RoleId == role.Id)
            .ToListAsync();

        if (exactMatch)
        {
            var staleAssignments = existingAssignments
                .Where(x => !desiredPermissionIds.Contains(x.PermissionId))
                .ToList();

            if (staleAssignments.Count > 0)
            {
                context.RolePermission.RemoveRange(staleAssignments);
                existingAssignments = existingAssignments
                    .Except(staleAssignments)
                    .ToList();
            }
        }

        var existingPermissionIds = existingAssignments
            .Select(x => x.PermissionId)
            .ToHashSet();

        foreach (var permissionType in desiredPermissionIds)
        {
            if (!availablePermissionIds.Contains(permissionType))
                continue;

            if (existingPermissionIds.Contains(permissionType))
                continue;

            context.RolePermission.Add(RolePermission.Create(role.Id, permissionType));
        }

        await context.SaveChangesAsync();
    }

    private async Task<Role> EnsureRoleAsync(string title, bool bypassContentPolicy = false)
    {
        var role = await context.Role.FirstOrDefaultAsync(x => x.Title == title);
        if (role is not null)
            return role;

        role = Role.Create(title);
        if (bypassContentPolicy)
            role.SetBypassContentPolicy(true);

        context.Role.Add(role);
        await context.SaveChangesAsync();
        return role;
    }

    private async Task SeedAdminUserAsync()
    {
        var systemAdminRole = await context.Role
            .FirstOrDefaultAsync(x => x.Title == HrSeedDefaults.SystemAdminRole);

        if (systemAdminRole is null)
            return;

        await EnsureSeedUserAsync(
            settings.AdminUserName,
            settings.AdminPassword,
            settings.AdminEmail,
            settings.AdminFirstName,
            settings.AdminLastName,
            systemAdminRole);
    }

    private async Task SeedDemoUsersAsync()
    {
        var hrManagerRole = await context.Role
            .FirstOrDefaultAsync(x => x.Title == HrSeedDefaults.HrManagerRole);
        var employeeRole = await context.Role
            .FirstOrDefaultAsync(x => x.Title == HrSeedDefaults.EmployeeRole);

        if (hrManagerRole is not null)
        {
            var hrManagerUser = await EnsureSeedUserAsync(
                settings.HrManagerUserName,
                settings.HrManagerPassword,
                settings.HrManagerEmail,
                settings.HrManagerFirstName,
                settings.HrManagerLastName,
                hrManagerRole);

            if (hrManagerUser is not null)
            {
                await EnsureDemoEmployeeRecordForUserAsync(
                    hrManagerUser.Id,
                    "HR-001",
                    "مدیر منابع انسانی");
            }
        }

        if (employeeRole is null)
            return;

        var employeeUser = await EnsureSeedUserAsync(
            settings.EmployeeUserName,
            settings.EmployeePassword,
            settings.EmployeeEmail,
            settings.EmployeeFirstName,
            settings.EmployeeLastName,
            employeeRole);

        if (employeeUser is null)
            return;

        await EnsureDemoEmployeeRecordAsync(employeeUser.Id);
    }

    private async Task<User?> EnsureSeedUserAsync(
        string userName,
        string password,
        string email,
        string firstName,
        string lastName,
        Role role)
    {
        var existingUser = await context.User.FirstOrDefaultAsync(x => x.UserName == userName);
        if (existingUser is not null)
        {
            var hasRole = await context.UserRole
                .AnyAsync(x => x.UserId == existingUser.Id && x.RoleId == role.Id);

            if (!hasRole)
            {
                context.UserRole.Add(UserRole.Create(existingUser.Id, role.Id));
                await context.SaveChangesAsync();
            }

            return existingUser;
        }

        var passwordHash = passwordHasher.HashPassword(password);
        var user = User.Create(
            email,
            GenderType.Male,
            userName,
            firstName,
            lastName,
            userName,
            passwordHash,
            Guid.NewGuid().ToString("N"));

        user.GrantLoginPermission();
        context.User.Add(user);
        await context.SaveChangesAsync();

        context.UserRole.Add(UserRole.Create(user.Id, role.Id));
        await context.SaveChangesAsync();

        return user;
    }

    private async Task EnsureDemoEmployeeRecordAsync(int userId)
        => await EnsureDemoEmployeeRecordForUserAsync(
            userId,
            settings.EmployeeCode,
            settings.EmployeeJobTitle);

    private async Task EnsureDemoEmployeeRecordForUserAsync(
        int userId,
        string employeeCode,
        string jobTitle)
    {
        if (await context.Employee.AnyAsync(x => x.UserId == userId))
            return;

        var department = await EnsureDefaultDepartmentAsync();
        if (department is null)
            return;

        var defaultShift = await context.WorkShift
            .OrderBy(x => x.Id)
            .FirstOrDefaultAsync();

        var employee = Employee.Create(
            userId,
            department.Id,
            managerId: null,
            defaultShift?.Id,
            employeeCode,
            jobTitle,
            DateTime.UtcNow.Date);

        context.Employee.Add(employee);
        await context.SaveChangesAsync();
    }

    private async Task<Department?> EnsureDefaultDepartmentAsync()
    {
        var existingDepartment = await context.Department.FirstOrDefaultAsync();
        if (existingDepartment is not null)
            return existingDepartment;

        var owner = await context.User
            .OrderBy(x => x.Id)
            .FirstOrDefaultAsync();

        if (owner is null)
            return null;

        var defaultShift = await context.WorkShift
            .OrderBy(x => x.Id)
            .FirstOrDefaultAsync();

        var department = Department.Create(
            owner.Id,
            "منابع انسانی",
            "HR",
            "دپارتمان پیش‌فرض سیستم",
            parentDepartmentId: null,
            defaultWorkShiftId: defaultShift?.Id);
        department.Active();

        context.Department.Add(department);
        await context.SaveChangesAsync();
        return department;
    }

    private async Task SeedContentPoliciesAsync()
    {
        await EnsureContentPolicyBypassForSystemAdminOnlyAsync();
        await EnsureEmployeeDepartmentScopePoliciesAsync();
    }

    private async Task EnsureContentPolicyBypassForSystemAdminOnlyAsync()
    {
        var roles = await context.Role.ToListAsync();

        foreach (var role in roles)
        {
            var shouldBypass = role.Title == HrSeedDefaults.SystemAdminRole;
            if (role.BypassContentPolicy == shouldBypass)
                continue;

            role.SetBypassContentPolicy(shouldBypass);
        }

        await context.SaveChangesAsync();
    }

    private async Task EnsureEmployeeDepartmentScopePoliciesAsync()
    {
        var scopedRoles = await context.Role
            .Where(x => !x.BypassContentPolicy)
            .ToListAsync();

        foreach (var role in scopedRoles)
            await EnsureEmployeeDepartmentScopePolicyForRoleAsync(role);
    }

    private async Task EnsureEmployeeDepartmentScopePolicyForRoleAsync(Role role)
    {
        var policy = await context.ContentPolicy
            .Include(x => x.Rules)
            .FirstOrDefaultAsync(x =>
                x.RoleId == role.Id
                && x.UserId == null
                && x.EntityType == HrContentPolicyDefinitions.EmployeeEntityType
                && x.Name == HrContentPolicyDefinitions.EmployeeDepartmentScopePolicyName);

        if (policy is null)
        {
            policy = ContentPolicy.Create(
                role.Id,
                userId: null,
                HrContentPolicyDefinitions.EmployeeEntityType,
                HrContentPolicyDefinitions.EmployeeDepartmentScopePolicyName,
                priority: 100);

            policy.AddRules(CreateEmployeeDepartmentScopeRule());
            context.ContentPolicy.Add(policy);
            await context.SaveChangesAsync();
            return;
        }

        if (!policy.IsActive)
        {
            policy.Update(
                policy.Name,
                policy.Effect,
                isActive: true,
                policy.Priority,
                policy.QueryAction);
        }

        var expectedRule = CreateEmployeeDepartmentScopeRule();
        var hasExpectedRule = policy.Rules.Any(x =>
            x.FieldPath == expectedRule.FieldPath
            && x.Operator == expectedRule.Operator
            && x.ValueType == expectedRule.ValueType
            && x.Value == expectedRule.Value);

        if (!hasExpectedRule)
            policy.ReplaceRules([expectedRule]);

        await context.SaveChangesAsync();
    }

    private static ContentPolicyRule CreateEmployeeDepartmentScopeRule()
        => ContentPolicyRule.Create(
            HrContentPolicyDefinitions.EmployeeDepartmentFieldPath,
            ContentPolicyOperator.In,
            ContentPolicyValueType.Context,
            HrContentPolicyDefinitions.DepartmentIdsContextValue);

    private async Task SeedPermissionsAsync(List<DynamicPermission> dynamicPermissions)
    {
        var priority = 1;
        foreach (var dynamicPermission in dynamicPermissions)
        {
            var groupType = dynamicPermission.Controllers[0].GroupType;

            var tabPermission = await context.Permission
                .Include(x => x.Children)
                .FirstOrDefaultAsync(x => x.Id == groupType);

            var isNewTab = tabPermission is null;

            if (isNewTab)
            {
                var tabParentId = groupType == PermissionType.ManageUsersGroup
                    ? (PermissionType?)null
                    : PermissionType.ManageUsersGroup;

                tabPermission = Permission.Create(
                    groupType,
                    "",
                    dynamicPermission.Name,
                    "",
                    priority,
                    PermissionLevelType.Tab,
                    tabParentId);
            }

            if (isNewTab)
                tabPermission!.SetParents([]);

            var versionOfControllers = dynamicPermission.Controllers.GroupBy(x => GetControllerName(x.FullName)).ToList();
            foreach (var controller in versionOfControllers)
            {
                var actions = controller.ToList().SelectMany(x => x.Actions).DistinctBy(x => new { x.Name, x.Type }).ToList();
                var firstController = controller.First();
                var existsPagePermission = await context.Permission
                    .Include(x => x.Children)
                    .SingleOrDefaultAsync(x => x.Id == firstController.Type);

                var isNewPage = existsPagePermission is null;

                var pagePermission = existsPagePermission ??
                    Permission.Create(
                        firstController.Type,
                        firstController.Url,
                        firstController.Name,
                        firstController.FullName,
                        ++priority,
                        PermissionLevelType.Page,
                        tabPermission.Id);

                if (isNewPage)
                    pagePermission.SetParents([]);

                foreach (var action in actions)
                {
                    if (action.Type == pagePermission.Id)
                        continue;

                    var isExistsAction = await context.Permission.AnyAsync(x => x.Id == action.Type);

                    if (isExistsAction)
                        continue;

                    var pagePermissionAction = Permission.Create(
                        action.Type,
                        action.Url,
                        action.Name,
                        action.FullNames.FirstOrDefault() ?? "",
                        ++priority,
                        PermissionLevelType.Action,
                        pagePermission.Id);

                    if (!pagePermission.Children.Any(x =>
                            x.Title == pagePermissionAction.Title && x.NameSpace == pagePermissionAction.NameSpace))
                        pagePermission.Children.Add(pagePermissionAction);
                }

                if (!tabPermission.Children.Any(x =>
                        x.Title == pagePermission.Title && x.NameSpace == pagePermission.NameSpace))
                    tabPermission.Children.Add(pagePermission);
            }

            if (isNewTab)
                context.Permission.Add(tabPermission);
            else
                context.Permission.Update(tabPermission);

            priority++;
        }        

        await context.SaveChangesAsync();
    }

    private async Task SeedLeaveTypeDefinitionsAsync()
    {
        if (await context.LeaveTypeDefinition.AnyAsync())
            return;

        var leaveTypeDefinitions = new[]
        {
            LeaveTypeDefinition.Create(
                "ANNUAL",
                "مرخصی استحقاقی",
                null,
                LeaveTypeCategory.Leave,
                LeaveTypeUnit.Day,
                isPaid: true,
                affectsLeaveBalance: true,
                requiresApproval: true,
                defaultAnnualAllowance: 20,
                maxPerYear: null,
                maxPerRequest: null,
                minNoticeDays: null,
                allowNegativeBalance: false,
                carryForwardEnabled: false,
                maxCarryForwardDays: null,
                includeWeekends: false,
                includeHolidays: false,
                sortOrder: 1,
                color: null),
            LeaveTypeDefinition.Create(
                "SICK",
                "مرخصی استعلاجی",
                null,
                LeaveTypeCategory.Leave,
                LeaveTypeUnit.Day,
                isPaid: true,
                affectsLeaveBalance: true,
                requiresApproval: true,
                defaultAnnualAllowance: 10,
                maxPerYear: null,
                maxPerRequest: null,
                minNoticeDays: null,
                allowNegativeBalance: false,
                carryForwardEnabled: false,
                maxCarryForwardDays: null,
                includeWeekends: false,
                includeHolidays: false,
                sortOrder: 2,
                color: null),
            LeaveTypeDefinition.Create(
                "UNPAID",
                "مرخصی بدون حقوق",
                null,
                LeaveTypeCategory.Leave,
                LeaveTypeUnit.Day,
                isPaid: false,
                affectsLeaveBalance: false,
                requiresApproval: true,
                defaultAnnualAllowance: 0,
                maxPerYear: null,
                maxPerRequest: null,
                minNoticeDays: null,
                allowNegativeBalance: false,
                carryForwardEnabled: false,
                maxCarryForwardDays: null,
                includeWeekends: false,
                includeHolidays: false,
                sortOrder: 3,
                color: null),
            LeaveTypeDefinition.Create(
                "HOURLY",
                "مرخصی ساعتی",
                null,
                LeaveTypeCategory.Leave,
                LeaveTypeUnit.Hour,
                isPaid: true,
                affectsLeaveBalance: true,
                requiresApproval: true,
                defaultAnnualAllowance: null,
                maxPerYear: null,
                maxPerRequest: null,
                minNoticeDays: null,
                allowNegativeBalance: false,
                carryForwardEnabled: false,
                maxCarryForwardDays: null,
                includeWeekends: false,
                includeHolidays: false,
                sortOrder: 5,
                color: null),
            LeaveTypeDefinition.Create(
                "MISSION",
                "ماموریت",
                null,
                LeaveTypeCategory.Mission,
                LeaveTypeUnit.Day,
                isPaid: true,
                affectsLeaveBalance: false,
                requiresApproval: true,
                defaultAnnualAllowance: null,
                maxPerYear: null,
                maxPerRequest: null,
                minNoticeDays: null,
                allowNegativeBalance: false,
                carryForwardEnabled: false,
                maxCarryForwardDays: null,
                includeWeekends: false,
                includeHolidays: false,
                sortOrder: 4,
                color: null),
            LeaveTypeDefinition.Create(
                "OTHER",
                "سایر",
                null,
                LeaveTypeCategory.Leave,
                LeaveTypeUnit.Day,
                isPaid: true,
                affectsLeaveBalance: true,
                requiresApproval: true,
                defaultAnnualAllowance: null,
                maxPerYear: null,
                maxPerRequest: null,
                minNoticeDays: null,
                allowNegativeBalance: false,
                carryForwardEnabled: false,
                maxCarryForwardDays: null,
                includeWeekends: false,
                includeHolidays: false,
                sortOrder: 6,
                color: null)
        };

        context.LeaveTypeDefinition.AddRange(leaveTypeDefinitions);
        await context.SaveChangesAsync();
    }

    private async Task SeedWorkShiftsAsync()
    {
        if (await context.WorkShift.AnyAsync())
            return;

        var shifts = new[]
        {
            WorkShift.Create(
                "شیفت اداری",
                new TimeOnly(8, 0),
                new TimeOnly(17, 0),
                breakMinutes: 60,
                graceMinutes: 15,
                earlyLeaveGraceMinutes: 10,
                isOvernight: false,
                isActive: true,
                description: "شیفت پیش‌فرض اداری",
                color: "#3B82F6"),
            WorkShift.Create(
                "شیفت صبح",
                new TimeOnly(6, 0),
                new TimeOnly(14, 0),
                breakMinutes: 30,
                graceMinutes: 10,
                earlyLeaveGraceMinutes: 5,
                isOvernight: false,
                isActive: true,
                description: "شیفت صبح",
                color: "#10B981"),
            WorkShift.Create(
                "شیفت عصر",
                new TimeOnly(14, 0),
                new TimeOnly(22, 0),
                breakMinutes: 30,
                graceMinutes: 10,
                earlyLeaveGraceMinutes: 5,
                isOvernight: false,
                isActive: true,
                description: "شیفت عصر",
                color: "#F59E0B"),
            WorkShift.Create(
                "شیفت شب",
                new TimeOnly(22, 0),
                new TimeOnly(6, 0),
                breakMinutes: 30,
                graceMinutes: 10,
                earlyLeaveGraceMinutes: 5,
                isOvernight: true,
                isActive: true,
                description: "شیفت شبانه",
                color: "#6366F1")
        };

        context.WorkShift.AddRange(shifts);
        await context.SaveChangesAsync();
    }

    private static string GetControllerName(string fullName)
        => fullName.Split('.').Last();
}
