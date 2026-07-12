using NetArchTest.Rules;
using JavidHrm.Infrastructure.Persistence;

namespace JavidHrm.Arch.Tests.Architecture;

public class PersistenceLayerTests
{
    [Fact]
    public void Persistence_Should_Not_Depend_On_Presentation()
    {
        var assembly = typeof(PersistenceAssemblyInfo).Assembly;

        var result = Types
            .InAssembly(assembly)
            .That()
            .ResideInNamespace("JavidHrm.Infrastructure.Persistence")
            .Should()
            .NotHaveDependencyOn("JavidHrm.Api")
            .And()
            .NotHaveDependencyOn("JavidHrm.WebFramework")
            .GetResult();

        Assert.True(result.IsSuccessful,
            "Persistence layer has invalid dependencies:\n" +
            string.Join("\n", result.FailingTypes ?? []));
    }
}