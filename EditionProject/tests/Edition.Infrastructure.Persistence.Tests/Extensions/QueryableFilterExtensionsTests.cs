using JavidHrm.Domain.Dtos.Banks;
using JavidHrm.Infrastructure.Persistence.Extensions;
using JavidHrm.Infrastructure.Persistence.Tests.Fixtures;
using JavidHrm.Infrastructure.Persistence.Tests.Support;
using Microsoft.EntityFrameworkCore;

namespace JavidHrm.Infrastructure.Persistence.Tests.Extensions;

public sealed class QueryableFilterExtensionsTests(SqlServerContainerFixture fixture)
    : PersistenceIntegrationTestBase(fixture)
{
    [Fact]
    public async Task ApplyQueryFilters_ContainsTitle_TranslatesToSqlLike()
    {
        await using var context = CreateContext();
        await PersistenceTestData.SeedBanksAsync(
            context,
            ("Bank Melli", true),
            ("Bank Sepah", true),
            ("Tejarat", false));

        var request = new GetAllBankRequestDto
        {
            Title = "Melli",
            Pagination = PersistenceTestData.Page()
        };

        var titles = await context.Bank
            .AsNoTracking()
            .ApplyQueryFilters(request)
            .Select(x => x.Title)
            .ToListAsync(TestCancellation);

        titles.Should().ContainSingle().Which.Should().Be("Bank Melli");
    }

    [Fact]
    public async Task ApplyQueryFilters_IsActiveEqual_FiltersOnSqlServer()
    {
        await using var context = CreateContext();
        await PersistenceTestData.SeedBanksAsync(
            context,
            ("Active Bank", true),
            ("Inactive Bank", false));

        var request = new GetAllBankRequestDto
        {
            IsActive = true,
            Pagination = PersistenceTestData.Page()
        };

        var titles = await context.Bank
            .AsNoTracking()
            .ApplyQueryFilters(request)
            .Select(x => x.Title)
            .ToListAsync(TestCancellation);

        titles.Should().ContainSingle().Which.Should().Be("Active Bank");
    }

    [Fact]
    public async Task ApplyQueryFilters_WhenFilterIsNull_ReturnsAllRows()
    {
        await using var context = CreateContext();
        await PersistenceTestData.SeedBanksAsync(
            context,
            ("Bank A", true),
            ("Bank B", false));

        var count = await context.Bank
            .AsNoTracking()
            .ApplyQueryFilters((GetAllBankRequestDto?)null)
            .CountAsync(TestCancellation);

        count.Should().Be(2);
    }

    [Fact]
    public async Task ApplyQueryFilters_WhenTitleIsEmpty_IgnoresTitleFilter()
    {
        await using var context = CreateContext();
        await PersistenceTestData.SeedBanksAsync(
            context,
            ("Bank A", true),
            ("Bank B", true));

        var request = new GetAllBankRequestDto
        {
            Title = "   ",
            Pagination = PersistenceTestData.Page()
        };

        var count = await context.Bank
            .AsNoTracking()
            .ApplyQueryFilters(request)
            .CountAsync(TestCancellation);

        count.Should().Be(2);
    }
}
