using System.Resources;

namespace JavidHrm.Common.Resources;

public class ControllerCategoryResources
{
    private static ResourceManager? _resourceManager;

    public static ResourceManager ResourceManager =>
        _resourceManager ??= new ResourceManager(
            "JavidHrm.Common.Resources.ControllerCategoryResources",
            typeof(ControllerCategoryResources).Assembly);
}
