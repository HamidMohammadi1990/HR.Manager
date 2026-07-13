using JavidHrm.Api.Modules;
using JavidHrm.Infrastructure.Persistence;
using JavidHrm.Infrastructure.Persistence.Contracts;
using Microsoft.EntityFrameworkCore;

namespace JavidHrm.Api.Extensions;

public static class DevelopmentBootstrapExtensions
{
    public static async Task ApplyDevelopmentBootstrapAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<JavidHrmDbContext>();

        await dbContext.Database.MigrateAsync();

        var seedService = scope.ServiceProvider.GetRequiredService<ISeedService>();
        var permissions = PermissionModule.GetPermissions();
        await seedService.SeedDataAsync(permissions);
    }
}
