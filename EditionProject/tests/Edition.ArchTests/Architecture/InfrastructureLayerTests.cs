using NetArchTest.Rules;
using JavidHrm.Infrastructure;

namespace JavidHrm.Arch.Tests.Architecture;

public class InfrastructureLayerTests
{
    [Fact]
    public void Infrastructure_Should_Not_Depend_On_Application_Or_Presentation()
    {
        var assembly = typeof(InfrastructureAssemblyInfo).Assembly;

        var result = Types
            .InAssembly(assembly)
            .That()
            .ResideInNamespace("JavidHrm.Infrastructure")
            .Should()       
            .NotHaveDependencyOn("JavidHrm.Api")
            .And()
            .NotHaveDependencyOn("JavidHrm.WebFramework")
            .GetResult();

        Assert.True(result.IsSuccessful,
            "Infrastructure layer has invalid dependencies:\n" +
            string.Join("\n", result.FailingTypes ?? []));
    }

    [Fact]
    public void Infrastructure_Can_Depends_On_Allowed_Layers()
    {
        var assembly = typeof(InfrastructureAssemblyInfo).Assembly;

        var result = Types
            .InAssembly(assembly)
            .That()
            .ResideInNamespace("JavidHrm.Infrastructure")
            .Should()
            .OnlyHaveDependenciesOn(
                "System",
                "System.*",
                "Microsoft",
                "Microsoft.*",
                "JavidHrm.Application",
                "JavidHrm.Application.*",
                "JavidHrm.Infrastructure",
                "JavidHrm.Infrastructure.*",
                "JavidHrm.Domain",
                "JavidHrm.Domain.*",
                "JavidHrm.Common",
                "JavidHrm.Common.*",
                "Serilog",
                "StackExchange.Redis",
                "RedLockNet",
                "RedLockNet.*",
                "SixLabors",
                "SixLabors.*",
                "Castle",
                "Castle.*",
                "Newtonsoft",
                "Newtonsoft.*"
            )
            .GetResult();

        Assert.True(result.IsSuccessful,
            "Infrastructure layer depends on unauthorized namespaces:\n" +
            string.Join("\n", result.FailingTypes ?? []));
    }
}