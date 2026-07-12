using System.Reflection;
using JavidHrm.Application.Contracts.Mapping;
using JavidHrm.Application.Extensions;
using Microsoft.Extensions.DependencyInjection;

namespace JavidHrm.Application.Tests.Extensions;

public class MapperServiceCollectionExtensionsTests
{
    [Fact]
    public void AddMapperServices_RegistersAllMapperInterfaces()
    {
        var services = new ServiceCollection();

        services.AddMapperServices(typeof(IBankMapperService).Assembly);

        var mapperInterfaces = typeof(IBankMapperService).Assembly
            .GetTypes()
            .Where(t => t.IsInterface && t != typeof(IMapper) && typeof(IMapper).IsAssignableFrom(t))
            .ToList();

        mapperInterfaces.Should().NotBeEmpty();

        using var provider = services.BuildServiceProvider();

        foreach (var mapperInterface in mapperInterfaces)
        {
            provider.GetRequiredService(mapperInterface).Should().NotBeNull();
        }
    }

    [Fact]
    public void AddMapperServices_ThrowsWhenAssemblyHasNoMapperInterfaces()
    {
        var services = new ServiceCollection();

        var action = () => services.AddMapperServices(typeof(object).Assembly);

        action.Should().Throw<InvalidOperationException>()
            .WithMessage("*No mapper interfaces*");
    }
}
