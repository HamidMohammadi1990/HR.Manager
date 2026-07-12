using JavidHrm.Domain.Enums;
using JavidHrm.Domain.Entities;
using JavidHrm.Infrastructure.Persistence.Contracts;
using JavidHrm.Infrastructure.Persistence.Models;
using Microsoft.EntityFrameworkCore;

namespace JavidHrm.Infrastructure.Persistence.SeedData;

public class SeedService(JavidHrmDbContext context) : ISeedService
{
    public async Task SeedDataAsync(List<DynamicPermission> dynamicPermissions)
    {
        if (dynamicPermissions.Count > 0)
            await SeedPermissionsAsync(dynamicPermissions);

        await SeedContentPoliciesAsync();
    }

    private async Task SeedContentPoliciesAsync()
    {
        var adminRoles = await context.Role
            .Where(x => x.Title == "مدیر" || x.Title.Contains("مدیر"))
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
