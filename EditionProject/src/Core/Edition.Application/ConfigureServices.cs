using FluentValidation;
using System.Reflection;
using JavidHrm.Application.Services;
using JavidHrm.Application.Contracts;
using JavidHrm.Application.Extensions;
using JavidHrm.Application.Common.Behaviors;
using Microsoft.Extensions.DependencyInjection;
using JavidHrm.Application.Services.ContentPolicies;
using JavidHrm.Application.Contracts.ContentPolicies;
using JavidHrm.Application.Common.Utilities.Services;
using JavidHrm.Application.Common.Utilities.Contracts;

namespace JavidHrm.Application;

public static class ConfigureServices
{
    public static IServiceCollection RegisterApplicationServices(this IServiceCollection services)
    {
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ContentPolicyQueryBehavior<,>));
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ContentPolicyResourceBehavior<,>));
        });

        services.AddScoped<IAccountingService, AccountingService>();
        services.AddScoped<IUserSessionService, UserSessionService>();
        services.AddScoped<IUserAuthCache, UserAuthCache>();
        services.AddScoped<ILocalFileService, LocalFileService>();

        services.AddSingleton<ContentPolicyCompiledFilterCache>();
        services.AddScoped<ContentPolicyRuleExpressionFactory>();
        services.AddScoped<ContentPolicyExpressionBuilder>();
        services.AddScoped<ContentPolicyRuleValidator>();
        services.AddScoped<ContentPolicyRecordAccessValidator>();
        services.AddScoped<IContentPolicyFilter, ContentPolicyFilter>();
        services.AddScoped<IContentPolicyFilterContext, ContentPolicyFilterContext>();
        services.AddScoped<IContentPolicyCache, ContentPolicyCache>();
        services.AddScoped<IContentPolicyAccessChecker, ContentPolicyAccessChecker>();
        services.AddScoped<IContentPolicyResourceRequestResolver, ContentPolicyResourceRequestResolver>();
        services.AddScoped<IContentPolicyEntitySchemaExplorer, ContentPolicyEntitySchemaExplorer>();
        services.AddScoped<ContentPolicyScenarioEvaluator>();
        services.AddScoped<IContentPolicyPreviewService, ContentPolicyPreviewService>();

        services.AddMapperServices(Assembly.GetExecutingAssembly());

        return services;
    }
}