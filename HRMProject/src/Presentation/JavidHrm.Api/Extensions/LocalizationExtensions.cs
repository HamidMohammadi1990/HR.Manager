using System.Globalization;
using JavidHrm.Common.Localization;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Localization;

namespace JavidHrm.Api.Extensions;

public static class LocalizationExtensions
{
    public static IServiceCollection AddEditionLocalization(this IServiceCollection services, IConfiguration configuration)
    {
        var settings = configuration
            .GetSection(nameof(LocalizationSettings))
            .Get<LocalizationSettings>() ?? new LocalizationSettings();

        services.AddSingleton(settings);
        services.AddSingleton<IResourceManager, EditionResourceManager>();

        var supportedCultures = settings.SupportedCultures
            .Select(NormalizeCulture)
            .Distinct()
            .Select(c => new CultureInfo(c))
            .ToList();

        var supportedUiCultures = settings.SupportedUICultures
            .Select(NormalizeCulture)
            .Distinct()
            .Select(c => new CultureInfo(c))
            .ToList();

        services.Configure<RequestLocalizationOptions>(options =>
        {
            var defaultCulture = NormalizeCulture(settings.DefaultCulture);
            var defaultUiCulture = NormalizeCulture(settings.DefaultUICulture);

            options.DefaultRequestCulture = new RequestCulture(defaultCulture, defaultUiCulture);
            options.SupportedCultures = supportedCultures;
            options.SupportedUICultures = supportedUiCultures;
            options.RequestCultureProviders =
            [
                new AcceptLanguageHeaderRequestCultureProvider(),
                new QueryStringRequestCultureProvider(),
                new CookieRequestCultureProvider()
            ];

            options.ApplyCurrentCultureToResponseHeaders = true;
        });

        return services;
    }

    public static IApplicationBuilder UseEditionLocalization(this IApplicationBuilder app)
    {
        var options = app.ApplicationServices.GetRequiredService<IOptions<RequestLocalizationOptions>>().Value;
        options.RequestCultureProviders.Insert(0, new EditionAcceptLanguageCultureProvider(options));

        return app.UseRequestLocalization(options);
    }

    private static string NormalizeCulture(string culture)
    {
        if (string.IsNullOrWhiteSpace(culture))
            return "fa-IR";

        var normalized = culture.Trim().ToLowerInvariant();
        return normalized switch
        {
            "fa" or "fa-ir" => "fa-IR",
            "en" or "en-us" => "en-US",
            _ when normalized.StartsWith("fa", StringComparison.Ordinal) => "fa-IR",
            _ when normalized.StartsWith("en", StringComparison.Ordinal) => "en-US",
            _ => culture
        };
    }
}

internal sealed class EditionAcceptLanguageCultureProvider(RequestLocalizationOptions options) : IRequestCultureProvider
{
    public Task<ProviderCultureResult?> DetermineProviderCultureResult(HttpContext httpContext)
    {
        var acceptLanguage = httpContext.Request.Headers.AcceptLanguage.ToString();
        if (string.IsNullOrWhiteSpace(acceptLanguage))
            return Task.FromResult<ProviderCultureResult?>(null);

        foreach (var segment in acceptLanguage.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries))
        {
            var language = segment.Split(';')[0].Trim();
            var culture = MapToSupportedCulture(language);
            if (culture is null)
                continue;

            if (IsSupported(culture))
                return Task.FromResult<ProviderCultureResult?>(new ProviderCultureResult(culture, culture));
        }

        return Task.FromResult<ProviderCultureResult?>(null);
    }

    private static string? MapToSupportedCulture(string language)
    {
        var normalized = language.ToLowerInvariant();
        if (normalized.StartsWith("fa", StringComparison.Ordinal))
            return "fa-IR";
        if (normalized.StartsWith("en", StringComparison.Ordinal))
            return "en-US";
        return null;
    }

    private bool IsSupported(string culture)
        => options.SupportedCultures.Any(x => string.Equals(x.Name, culture, StringComparison.OrdinalIgnoreCase))
           || options.SupportedUICultures.Any(x => string.Equals(x.Name, culture, StringComparison.OrdinalIgnoreCase));
}