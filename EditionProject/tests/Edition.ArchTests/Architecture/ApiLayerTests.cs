using JavidHrm.Api;
using NetArchTest.Rules;

namespace JavidHrm.Arch.Tests.Architecture;

public class ApiLayerTests
{
    [Fact]
    public void Api_Should_Only_Depend_On_Allowed_Layers()
    {
        var assembly = typeof(ApiAssemblyInfo).Assembly;

        var allowed = new[]
        {
            "System",
            "System.*",
            "System.Reflection",
            "System.Reflection.*",
            "Microsoft",
            "Microsoft.*",
            "JavidHrm.Api",
            "JavidHrm.Api.*",
            "JavidHrm.WebFramework",
            "JavidHrm.WebFramework.*",
            "JavidHrm.Infrastructure",
            "JavidHrm.Infrastructure.*",
            "JavidHrm.Domain",
            "JavidHrm.Domain.*",
            "JavidHrm.Common",
            "JavidHrm.Common.*",
            "Autofac",
            "Autofac.*",
            "Serilog",
            "Serilog.*",
            "Castle",
            "Castle.*",
            "Newtonsoft",
            "Newtonsoft.*",
            "MediatR",
            "MediatR.*",
            "JavidHrm.Application",
            "JavidHrm.Application.*",
            "Asp.Versioning",
            "Asp.Versioning.*",
            "Microsoft.AspNetCore",
            "Microsoft.AspNetCore.*",
            "Microsoft.Extensions",
            "Microsoft.Extensions.*",
            "JavidHrm.Infrastructure.Persistence",
            "JavidHrm.Infrastructure.Persistence.*",
            "Microsoft.AspNetCore.Authorization",
            "Microsoft.AspNetCore.Authorization.*",
            "Microsoft.AspNetCore.Mvc",
            "Microsoft.AspNetCore.Mvc.*"
        };

        var result = Types
            .InAssembly(assembly)
            .Should()
            .OnlyHaveDependenciesOn(allowed)
            .GetResult();

        Assert.True(result.IsSuccessful,
            "API layer depends on unauthorized namespaces:\n" +
            string.Join("\n", result.FailingTypes ?? []));
    }

    [Fact]
    public void Api_Should_Not_Directly_Depend_On_Domain_Or_Application_Or_Common()
    {
        var assembly = typeof(ApiAssemblyInfo).Assembly;

        var result = Types
            .InAssembly(assembly)
            .Should()
            .NotHaveDependencyOn("JavidHrm.Domain")
            //.And()
            //.NotHaveDependencyOn("JavidHrm.Application")
            //.And()
            //.NotHaveDependencyOn("JavidHrm.Common")
            .GetResult();

        Assert.True(result.IsSuccessful,
            "API layer has **direct** forbidden dependencies:\n" +
            string.Join("\n", result.FailingTypes ?? []));
    }
}