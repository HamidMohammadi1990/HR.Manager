using JavidHrm.Infrastructure.Persistence.Extensions;
using JavidHrm.Infrastructure.Persistence.Tests.Fixtures;
using JavidHrm.Infrastructure.Persistence.Tests.Support;
using Microsoft.EntityFrameworkCore;

namespace JavidHrm.Infrastructure.Persistence.Tests.Extensions;

public sealed class IQueryableExtensionsTests(SqlServerContainerFixture fixture)
    : PersistenceIntegrationTestBase(fixture)
{
    [Fact]
    public async Task ToPagedAsync_ReturnsRequestedPageAndTotalPages()
    {
        await using var context = CreateContext();

        var banks = Enumerable.Range(1, 12)
            .Select(i => PersistenceTestData.CreateBank($"Bank {i:D2}"))
            .ToList();

        context.Bank.AddRange(banks);
        await SaveAsync(context);

        var pagination = PersistenceTestData.Page(pageNumber: 2, pageSize: 5);

        var result = await context.Bank
            .AsNoTracking()
            .OrderBy(x => x.Title)
            .ToPagedAsync(pagination, TestCancellation);

        result.Items.Should().HaveCount(5);
        result.PageNumber.Should().Be(2);
        result.PageSize.Should().Be(5);
        result.TotalPages.Should().Be(3);
        result.Items[0].Title.Should().Be("Bank 06");
    }

    [Fact]
    public async Task Pagination_SkipTake_ExecutesOnSqlServer()
    {
        await using var context = CreateContext();
        await PersistenceTestData.SeedBanksAsync(
            context,
            ("Bank A", true),
            ("Bank B", true),
            ("Bank C", true));

        var pagination = PersistenceTestData.Page(pageNumber: 2, pageSize: 1);

        var titles = await context.Bank
            .AsNoTracking()
            .OrderBy(x => x.Title)
            .Pagination(pagination)
            .Select(x => x.Title)
            .ToListAsync(TestCancellation);

        titles.Should().ContainSingle().Which.Should().Be("Bank B");
    }
}
