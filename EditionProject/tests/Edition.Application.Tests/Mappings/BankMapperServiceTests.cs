using JavidHrm.Application.Features.Banks.Queries;
using JavidHrm.Application.Mappings;
using JavidHrm.Application.Tests.Helpers;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;

namespace JavidHrm.Application.Tests.Mappings;

public class BankMapperServiceTests
{
    private readonly BankMapperService mapper = new();

    [Fact]
    public void Map_BankEntity_MapsAllFields()
    {
        var bank = new Bank { Title = "Melli", Icon = "icon.png", IsActive = true };
        OrderTestDataReflection.SetEntityId(bank, 7);

        var result = mapper.Map(bank);

        result.Id.Should().Be(7);
        result.Title.Should().Be("Melli");
        result.Icon.Should().Be("icon.png");
        result.IsActive.Should().BeTrue();
    }

    [Fact]
    public void Map_PagedBanks_MapsItemsAndPagination()
    {
        var bank = new Bank { Title = "Sepah", Icon = "icon2.png", IsActive = false };
        OrderTestDataReflection.SetEntityId(bank, 3);

        var source = PagedResult<Bank>.Create([bank], new TestPagedRequest { PageNumber = 2, PageSize = 5 }, 12);

        var result = mapper.Map(source);

        result.Items.Should().ContainSingle();
        result.Items[0].Title.Should().Be("Sepah");
        result.PageNumber.Should().Be(2);
        result.PageSize.Should().Be(5);
        result.TotalPages.Should().Be(3);
    }

    [Fact]
    public void Map_GetAllBankRequest_MapsFilterFields()
    {
        var request = new GetAllBankRequest
        {
            Title = "bank",
            IsActive = true,
            Pagination = new TestPagedRequest { PageNumber = 1, PageSize = 10 }
        };

        var dto = mapper.Map(request);

        dto.Title.Should().Be("bank");
        dto.IsActive.Should().BeTrue();
        dto.Pagination.Should().BeSameAs(request.Pagination);
    }

    private sealed record TestPagedRequest : PagedRequest;
}

internal static class OrderTestDataReflection
{
    public static void SetEntityId<TEntity>(TEntity entity, int id) where TEntity : class
    {
        var type = typeof(TEntity);
        while (type is not null)
        {
            var property = type.GetProperty(
                "Id",
                System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.DeclaredOnly);

            if (property is not null)
            {
                property.SetValue(entity, id);
                return;
            }

            type = type.BaseType;
        }

        throw new InvalidOperationException($"Could not set Id on {typeof(TEntity).Name}.");
    }

    public static void SetNavigationProperty<TEntity>(TEntity entity, string propertyName, object value)
        where TEntity : class
    {
        var property = typeof(TEntity).GetProperty(
            propertyName,
            System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.NonPublic);

        property.Should().NotBeNull($"Property {propertyName} was not found on {typeof(TEntity).Name}.");
        property!.SetValue(entity, value);
    }
}
