using Newtonsoft.Json;
using JavidHrm.Api.Filters;
using Newtonsoft.Json.Converters;
using Microsoft.AspNetCore.Identity;
using JavidHrm.Application.Configurations.SMS;
using JavidHrm.Application.Configurations.Email;
using JavidHrm.Application.Configurations.ContentPolicies;

namespace JavidHrm.Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static void AddMinimalMvc(this IServiceCollection services)
    {
        services.AddControllers(options =>
        {
            options.Filters.Add<PermissionAuthorizeAttribute>();
            options.Filters.Add<LocalizationResultFilter>();
        }).AddNewtonsoftJson(option =>
        {
            option.SerializerSettings.Converters.Add(new StringEnumConverter());
            option.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
        });
        services.AddSwaggerGenNewtonsoftSupport();
    }

    public static void AddEmailTokenProviderConfiguration(this IServiceCollection services, IConfiguration configuration)
    {
        var emailConfig =
             configuration
             .GetSection(nameof(EmailTokenProviderConfiguration))
             .Get<EmailTokenProviderConfiguration>()
             ?? throw new NullReferenceException("EmailTokenProviderConfiguration is null ...");

        services.AddSingleton<IEmailTokenProviderConfiguration>(emailConfig!);
    }

    public static void AddPhoneNumberTokenProviderConfiguration(this IServiceCollection services, IConfiguration configuration)
    {
        var phoneNumberConfig =
             configuration
             .GetSection(nameof(PhoneNumberTokenProviderConfiguration))
             .Get<PhoneNumberTokenProviderConfiguration>()
             ?? throw new NullReferenceException("PhoneNumberTokenProviderConfiguration is null ..."); ;

        services.AddSingleton<IPhoneNumberTokenProviderConfiguration>(phoneNumberConfig!);
    }

    public static void AddContentPolicyCacheConfiguration(this IServiceCollection services, IConfiguration configuration)
    {
        var contentPolicyCacheConfig =
            configuration
                .GetSection(nameof(ContentPolicyCacheConfiguration))
                .Get<ContentPolicyCacheConfiguration>()
            ?? throw new NullReferenceException("ContentPolicyCacheConfiguration is null ...");

        services.AddSingleton<IContentPolicyCacheConfiguration>(contentPolicyCacheConfig);
    }
}