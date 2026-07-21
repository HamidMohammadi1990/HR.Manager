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

        await SeedAdminUserAsync();
        await SeedContentPoliciesAsync();
        await SeedWorkShiftsAsync();
        await SeedLeaveTypeDefinitionsAsync();
    }

    private async Task SeedDefaultRolesAsync()
    {
        var systemAdminRole = await EnsureRoleAsync(HrSeedDefaults.SystemAdminRole, bypassContentPolicy: true);
        await EnsureRoleAsync(HrSeedDefaults.HrManagerRole);
        await EnsureRoleAsync(HrSeedDefaults.EmployeeRole);

        var permissionIds = await context.Permission.Select(x => x.Id).ToListAsync();
        var assignedPermissionIds = await context.RolePermission
            .Where(x => x.RoleId == systemAdminRole.Id)
            .Select(x => x.PermissionId)
            .ToListAsync();

        foreach (var permissionId in permissionIds.Except(assignedPermissionIds))
            context.RolePermission.Add(RolePermission.Create(systemAdminRole.Id, permissionId));

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
        if (await context.User.AnyAsync(x => x.UserName == settings.AdminUserName))
            return;

        var systemAdminRole = await context.Role
            .FirstOrDefaultAsync(x => x.Title == HrSeedDefaults.SystemAdminRole);

        if (systemAdminRole is null)
            return;

        var passwordHash = passwordHasher.HashPassword(settings.AdminPassword);
        var user = User.Create(
            settings.AdminEmail,
            GenderType.Male,
            settings.AdminUserName,
            settings.AdminFirstName,
            settings.AdminLastName,
            settings.AdminUserName,
            passwordHash,
            Guid.NewGuid().ToString("N"));

        user.GrantLoginPermission();
        context.User.Add(user);
        await context.SaveChangesAsync();

        context.UserRole.Add(UserRole.Create(user.Id, systemAdminRole.Id));
        await context.SaveChangesAsync();
    }

    private async Task SeedContentPoliciesAsync()
    {
        var adminRoles = await context.Role
            .Where(x => x.Title == HrSeedDefaults.SystemAdminRole || x.Title.Contains("مدیر"))
            .ToListAsync();

        foreach (var adminRole in adminRoles)
            adminRole.SetBypassContentPolicy(true);

        await context.SaveChangesAsync();
    }

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
