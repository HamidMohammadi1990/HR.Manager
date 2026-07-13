using System.Resources;

namespace JavidHrm.Domain.Resources;

/// <summary>Resource type for localized enum display names.</summary>
public class EnumResources
{
    private static ResourceManager? _resourceManager;

    public static ResourceManager ResourceManager =>
        _resourceManager ??= new ResourceManager(
            "JavidHrm.Domain.Resources.EnumResources",
            typeof(EnumResources).Assembly);
}
