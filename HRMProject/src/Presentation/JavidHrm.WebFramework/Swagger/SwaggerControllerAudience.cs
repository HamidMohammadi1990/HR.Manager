using JavidHrm.WebFramework.Api;
using Microsoft.AspNetCore.Mvc.Controllers;

namespace JavidHrm.WebFramework.Swagger;

internal static class SwaggerControllerAudience
{
    public static string Resolve(ControllerActionDescriptor descriptor)
    {
        if (string.Equals(descriptor.ControllerName, "account", StringComparison.OrdinalIgnoreCase))
            return "Auth";

        return IsAdmin(descriptor) ? "Admin" : "Public";
    }

    public static bool IsAdmin(ControllerActionDescriptor descriptor)
        => typeof(BaseApiAdminController).IsAssignableFrom(descriptor.ControllerTypeInfo.AsType());
}
