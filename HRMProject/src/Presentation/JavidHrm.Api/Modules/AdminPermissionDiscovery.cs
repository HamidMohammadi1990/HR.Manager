using System.Reflection;
using JavidHrm.Api.Attributes;
using JavidHrm.Common.Extensions;

namespace JavidHrm.Api.Modules;

public static class AdminPermissionDiscovery
{
    public static IEnumerable<Type> GetAdminControllers(Assembly assembly)
        => assembly.GetExportedTypes()
            .Where(type => type.IsClass
                           && !type.IsAbstract
                           && typeof(WebFramework.Api.BaseApiAdminController).IsAssignableFrom(type)
                           && type.GetCustomAttribute<ControllerInfoAttribute>() is not null);

    public static bool TryGetMetadata(Type controllerType, out AdminControllerPermissionMetadata metadata)
    {
        metadata = default!;
        var controllerInfo = controllerType.GetCustomAttribute<ControllerInfoAttribute>();
        if (controllerInfo is null)
            return false;

        metadata = new AdminControllerPermissionMetadata(
            controllerInfo.PermissionType,
            controllerInfo.GroupType);

        return true;
    }

    public static string GetDisplayName(AdminControllerPermissionMetadata metadata)
        => metadata.PageType.ToDisplay();
}