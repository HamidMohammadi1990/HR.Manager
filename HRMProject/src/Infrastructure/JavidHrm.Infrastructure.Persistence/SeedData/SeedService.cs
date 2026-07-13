using JavidHrm.Domain.Enums;
using JavidHrm.Domain.Entities;
using JavidHrm.Common.Security;
using JavidHrm.Domain.Dtos.Others;
using JavidHrm.Infrastructure.Persistence.Models;
using JavidHrm.Infrastructure.Persistence.Contracts;
using JavidHrm.Infrastructure.Persistence.Configurations;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

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

        await SeedLocationsAsync();
        await SeedDefaultRolesAsync();

        if (dynamicPermissions.Count > 0)
            await SeedPermissionsAsync(dynamicPermissions);

        await SeedAdminUserAsync();
        await SeedContentPoliciesAsync();
    }

    private async Task SeedLocationsAsync()
    {
        if (!await context.Province.AnyAsync())
            await SeedProvincesAsync();

        if (!await context.City.AnyAsync())
            await SeedCitiesAsync();
    }

    private async Task SeedProvincesAsync()
    {
        var filePath = Path.Combine(AppContext.BaseDirectory, "SeedData", "Data", "provinces.json");
        if (!File.Exists(filePath))
            return;

        var json = await File.ReadAllTextAsync(filePath);
        var provinces = JsonConvert.DeserializeObject<List<ProvinceSeedDataDto>>(json) ?? [];
        if (provinces.Count == 0)
            return;

        await using var transaction = await context.Database.BeginTransactionAsync();
        await context.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT [Province] ON");

        foreach (var item in provinces)
        {
            var province = SeedEntityHelper.WithId(
                Province.Create(item.Name, item.Slug, item.TelPrefix, null, 0, null, null),
                item.Id);
            context.Province.Add(province);
        }

        await context.SaveChangesAsync();
        await context.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT [Province] OFF");
        await transaction.CommitAsync();
    }

    private async Task SeedCitiesAsync()
    {
        var filePath = Path.Combine(AppContext.BaseDirectory, "SeedData", "Data", "cities.json");
        if (!File.Exists(filePath))
            return;

        var json = await File.ReadAllTextAsync(filePath);
        var cities = JsonConvert.DeserializeObject<List<CitySeedDataDto>>(json) ?? [];
        if (cities.Count == 0)
            return;

        await using var transaction = await context.Database.BeginTransactionAsync();
        await context.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT [City] ON");

        foreach (var item in cities)
        {
            var city = SeedEntityHelper.WithId(
                City.Create(item.ProvinceId, item.Name, item.Slug, null, 0, null, null),
                item.Id);
            context.City.Add(city);
        }

        await context.SaveChangesAsync();
        await context.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT [City] OFF");
        await transaction.CommitAsync();
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
            settings.AdminCityId,
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
            var existsTabPermission = await context.Permission
                .FirstOrDefaultAsync(x => x.Title == dynamicPermission.Name && x.ParentId == PermissionType.ManageUsersGroup);

            var tabPermission = existsTabPermission ??
                Permission.Create(
                    dynamicPermission.Controllers[0].GroupType,
                    "",
                    dynamicPermission.Name,
                    "",
                    priority,
                    PermissionLevelType.Tab,
                    PermissionType.ManageUsersGroup);

            tabPermission.SetParents([]);

            var versionOfControllers = dynamicPermission.Controllers.GroupBy(x => GetControllerName(x.FullName)).ToList();
            foreach (var controller in versionOfControllers)
            {
                var actions = controller.ToList().SelectMany(x => x.Actions).DistinctBy(x => new { x.Name, x.Type }).ToList();
                var firstController = controller.First();
                var existsPagePermission = await context.Permission
                    .SingleOrDefaultAsync(x => x.Title == firstController.Name && x.NameSpace == firstController.FullName);

                var pagePermission = existsPagePermission ??
                    Permission.Create(
                        firstController.Type,
                        firstController.Url,
                        firstController.Name,
                        firstController.FullName,
                        ++priority,
                        PermissionLevelType.Page,
                        tabPermission.Id);

                pagePermission.SetParents([]);

                foreach (var action in actions)
                {
                    if (action.Type == pagePermission.Id)
                        continue;

                    var isExistsAction = await context.Permission.AnyAsync(x =>
                        x.Title == action.Name && x.NameSpace == action.FullNames.FirstOrDefault());

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

            if (existsTabPermission is null)
                context.Permission.Add(tabPermission);
            else
                context.Permission.Update(tabPermission);

            priority++;
        }

        await context.SaveChangesAsync();
    }

    private static string GetControllerName(string fullName)
        => fullName.Split('.').Last();
}
