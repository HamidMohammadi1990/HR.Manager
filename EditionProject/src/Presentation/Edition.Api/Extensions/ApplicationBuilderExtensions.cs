using System.Net;
using JavidHrm.Api.Middlewares;
using JavidHrm.Common.Models;
using Microsoft.AspNetCore.HttpOverrides;

namespace JavidHrm.Api.Extensions;

public static class ApplicationBuilderExtensions
{
    public static void UserCustomeForwardedHeaders(this IApplicationBuilder app)
    {
        var settings = app.ApplicationServices.GetRequiredService<ForwardedHeadersSettings>();
        var options = new ForwardedHeadersOptions
        {
            ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
        };

        foreach (var proxy in settings.KnownProxies)
        {
            if (IPAddress.TryParse(proxy, out var ipAddress))
                options.KnownProxies.Add(ipAddress);
        }

        app.UseForwardedHeaders(options);
    }

    public static IApplicationBuilder UseCustomExceptionHandler(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<CustomExceptionHandlerMiddleware>();
    }
}