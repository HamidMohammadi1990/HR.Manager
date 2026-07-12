using JavidHrm.Infrastructure.Persistence.Tests.Fixtures;
using JavidHrm.Infrastructure.Persistence.Tests.Support;
using Microsoft.EntityFrameworkCore;

namespace JavidHrm.Infrastructure.Persistence.Tests.Infrastructure;

public sealed class JavidHrmDbContextTests(SqlServerContainerFixture fixture)
    : PersistenceIntegrationTestBase(fixture)
{
    [Fact]
    public async Task Migrate_ShouldApplyAllMigrations()
    {
        await using var context = CreateContext();

        (await context.Database.GetPendingMigrationsAsync(TestCancellation)).Should().BeEmpty();
        (await context.Database.GetAppliedMigrationsAsync(TestCancellation)).Should().NotBeEmpty();
    }

    [Fact]
    public async Task BankTable_ShouldBeQueryableOnSqlServer()
    {
        await using var context = CreateContext();

        var act = async () => await context.Bank.CountAsync(TestCancellation);

        await act.Should().NotThrowAsync();
    }

    [Fact]
    public async Task SaveChanges_ShouldApplyCleanStringInterceptor()
    {
        await using var context = CreateContext();

        var bank = PersistenceTestData.CreateBank("  ملی  ", " icon.svg ");
        context.Bank.Add(bank);
        await SaveAsync(context);

        var persisted = await context.Bank.AsNoTracking().SingleAsync(TestCancellation);
        persisted.Title.Should().NotBe("  ملی  ");
        persisted.Title.Should().NotContain("  ");
        persisted.Icon.Trim().Should().Be(persisted.Icon);
    }

    [Fact]
    public async Task Bank_ShouldEnforceRequiredColumns()
    {
        await using var context = CreateContext();
        context.Bank.Add(new Domain.Entities.Bank { Title = null!, Icon = "icon.svg", IsActive = true });

        var act = () => SaveAsync(context);

        await act.Should().ThrowAsync<DbUpdateException>();
    }
}
