using NetArchTest.Rules;
using JavidHrm.Application;

namespace JavidHrm.Arch.Tests.Architecture;

public class ApplicationLayerTests
{
    [Fact]
    public void Application_Should_Not_Have_Invalid_Dependencies()
    {
        var assembly = typeof(ApplicationAssemblyInfo).Assembly;

        var result = Types
            .InAssembly(assembly)
            .That()
            .ResideInNamespace("JavidHrm.Application")
            .Should()
            .NotHaveDependencyOn("JavidHrm.Infrastructure")
            .And()
            .NotHaveDependencyOn("JavidHrm.Infrastructure.Persistence")
            .And()
            .NotHaveDependencyOn("JavidHrm.Api")
            .And()
            .NotHaveDependencyOn("JavidHrm.WebFramework")
            .GetResult();

        Assert.True(result.IsSuccessful,
            "Application layer has invalid dependencies:\n" +
            string.Join("\n", result.FailingTypes ?? []));
    }

    [Fact]
    public void Application_Can_Depends_On_Allowed_Layers()
    {
        var assembly = typeof(ApplicationAssemblyInfo).Assembly;

        var result = Types
            .InAssembly(assembly)
            .That()
            .ResideInNamespace("JavidHrm.Application")
            .Should()
            .OnlyHaveDependenciesOn(
                "System",
                "System.*",
                "Microsoft",
                "Microsoft.*",
                "JavidHrm.Application",
                "JavidHrm.Application.*",
                "JavidHrm.Domain",
                "JavidHrm.Domain.*",
                "JavidHrm.Common",
                "JavidHrm.Common.*",
                "MediatR",
                "FluentValidation",
                "Newtonsoft.Json",
                "System.Text",
                "System.Text.*"
            
            )
            .GetResult();

        Assert.True(result.IsSuccessful,
            "Application layer depends on unauthorized namespaces:\n" +
            string.Join("\n", result.FailingTypes ?? []));
    }
}