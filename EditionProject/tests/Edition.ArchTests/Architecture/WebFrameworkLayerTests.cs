using NetArchTest.Rules;
using JavidHrm.WebFramework;

namespace JavidHrm.Arch.Tests.Architecture;

public class WebFrameworkLayerTests
{
    [Fact]
    public void WebFramework_Should_Only_Depends_On_Allowed_Layers()
    {        
        var assembly = typeof(WebFrameworkAssemplyInfo).Assembly;

        var result = Types
            .InAssembly(assembly)
            .Should()
            .OnlyHaveDependenciesOn(
                "System",
                "System.*",
                "Microsoft",
                "Microsoft.*",
                "Pluralize",
                "Pluralize.*",
                "Swashbuckle",
                "Swashbuckle.*",
                "Asp.Versioning",
                "Asp.Versioning.*",
                "Newtonsoft",
                "Newtonsoft.*",
                "JavidHrm.Common",
                "JavidHrm.Common.*",
                "JavidHrm.WebFramework",
                "JavidHrm.WebFramework.*"
            )
            .GetResult();

        Assert.True(result.IsSuccessful,
            "WebFramework layer depends on unauthorized namespaces:\n" +
            string.Join("\n", result.FailingTypes ?? []));
    }

    [Fact]
    public void WebFramework_Should_Not_Depend_On_Other_Layers()
    {
        var assembly = typeof(WebFrameworkAssemplyInfo).Assembly;

        var result = Types
            .InAssembly(assembly)
            .Should()
            .NotHaveDependencyOn("JavidHrm.Api")
            .And()
            .NotHaveDependencyOn("JavidHrm.Application")
            .And()
            .NotHaveDependencyOn("JavidHrm.Domain")
            .And()
            .NotHaveDependencyOn("JavidHrm.Infrastructure")
            .And()
            .NotHaveDependencyOn("JavidHrm.Infrastructure.Persistence")
            .GetResult();

        Assert.True(result.IsSuccessful,
            "WebFramework layer has invalid dependencies:\n" +
            string.Join("\n", result.FailingTypes ?? []));
    }
}