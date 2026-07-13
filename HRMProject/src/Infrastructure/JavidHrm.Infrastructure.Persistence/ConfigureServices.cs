using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using JavidHrm.Infrastructure.Persistence.SeedData;
using JavidHrm.Infrastructure.Persistence.Contracts;
using JavidHrm.Infrastructure.Persistence.Configurations;
using JavidHrm.Application.Contracts.Persistence;
using JavidHrm.Domain.Repositories;

namespace JavidHrm.Infrastructure.Persistence;

public static class ConfigureServices
{
    public static IServiceCollection RegisterPersistenceServices(
        this IServiceCollection services,
        IConfiguration configuration,
        bool includeDetailedSaveErrors = false)
    {
        services.AddSingleton<ISaveChangesExceptionReporting>(
            new SaveChangesExceptionReporting(includeDetailedSaveErrors));

        services
            .AddDbContext<JavidHrmDbContext>(
            options => options.UseSqlServer(configuration
            .GetConnectionString("JavidHrmDbContext")));

        services.AddScoped<IUnitOfWork, UnitOfWork>();

        services.AddScoped<JavidHrm.Application.Contracts.ContentPolicies.IContentPolicyEntityAccessQuery,
            ContentPolicies.ContentPolicyEntityAccessQuery>();
        services.AddScoped<JavidHrm.Application.Contracts.ContentPolicies.IContentPolicyEntityPreviewQuery,
            ContentPolicies.ContentPolicyEntityPreviewQuery>();

        services.AddSingleton<JavidHrm.Domain.ContentPolicies.IContentEntityTypeRegistry,
            ContentPolicies.DbContextContentEntityTypeRegistry>();

        services.AddScoped<IContentPolicyMetadataRepository, Repositories.ContentPolicyMetadataRepository>();

        services.AddScoped<ISeedService, SeedService>();

        services.Configure<SeedSettings>(configuration.GetSection(nameof(SeedSettings)));

        return services;
    }
}