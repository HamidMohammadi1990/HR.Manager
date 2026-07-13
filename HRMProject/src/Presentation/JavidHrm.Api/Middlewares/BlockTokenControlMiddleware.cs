using System.Net;
using System.Text.Json;
using JavidHrm.Common.Models;
using JavidHrm.Common.Localization;
using JavidHrm.Application.Contracts;
using JavidHrm.Application.Models.Services;

namespace JavidHrm.Api.Middlewares;

/// <summary>
/// Check Is Blocked Token.
/// </summary>
/// <param name="accountingService"></param>
/// <param name="next"></param>
public class BlockTokenControlMiddleware
    (IAccountingService accountingService, RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context)
    {
        var auth = context.Request?.Headers.Authorization.ToString();
        var token = auth?.Replace("Bearer ", string.Empty, StringComparison.CurrentCultureIgnoreCase);
        if (string.IsNullOrEmpty(token))
        {
            await next(context);
            return;
        }

        var isBlocked = await accountingService.IsTokenBlockedAsync(new CheckTokenRequestDto(token));
        if (isBlocked.IsSuccess && isBlocked.Result is true)
        {
            var resourceManager = context.RequestServices.GetRequiredService<IResourceManager>();
            var error = ErrorModel.Create("InvalidToken").Localize(resourceManager);
            context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync(JsonSerializer.Serialize(error));
            return;
        }

        await next(context);
    }
}