using JavidHrm.Domain;
using NetArchTest.Rules;

namespace JavidHrm.Arch.Tests.Architecture;

public class DomainLayerTests
{
    [Fact]
    public void Domain_Should_Not_Have_Invalid_Dependencies()
    {        
        var assembly = typeof(DomainAssemblyInfo).Assembly;

        var result = Types
            .InAssembly(assembly)
            .That()
            .ResideInNamespace("JavidHrm.Domain")
            .Should()
            .NotHaveDependencyOn("JavidHrm.Application")
            .And()
            .NotHaveDependencyOn("JavidHrm.Infrastructure")
            .And()
            .NotHaveDependencyOn("JavidHrm.Infrastructure.Persistence")
            .And()
            .NotHaveDependencyOn("JavidHrm.Api")
            .And()
            .NotHaveDependencyOn("JavidHrm.WebFramework")
            .GetResult();

        Assert.True(result.IsSuccessful,
            "Domain layer has invalid dependencies:\n" +
            string.Join("\n", result.FailingTypes ?? []));
    }
}