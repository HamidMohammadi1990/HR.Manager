using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApplicationModels;

namespace JavidHrm.WebFramework.Routing;

/// <summary>
/// Replaces the [controller] route token with <see cref="ControllerNameAttribute"/> when present.
/// </summary>
public sealed class ControllerNameRouteConvention : IApplicationModelConvention
{
    public void Apply(ApplicationModel application)
    {
        foreach (var controller in application.Controllers)
        {
            var routeName = controller.Attributes
                .OfType<ControllerNameAttribute>()
                .Select(attribute => attribute.Name)
                .FirstOrDefault(name => !string.IsNullOrWhiteSpace(name));

            if (routeName is null)
                continue;

            foreach (var selector in controller.Selectors)
            {
                var template = selector.AttributeRouteModel?.Template;
                if (template is null || !template.Contains("[controller]", StringComparison.Ordinal))
                    continue;

                selector.AttributeRouteModel!.Template = template.Replace(
                    "[controller]",
                    routeName,
                    StringComparison.Ordinal);
            }
        }
    }
}
