using JavidHrm.Domain.Dtos.Banks;
using JavidHrm.Infrastructure.Persistence.Repositories;
using JavidHrm.Infrastructure.Persistence.Tests.Fixtures;
using JavidHrm.Infrastructure.Persistence.Tests.Support;

namespace JavidHrm.Infrastructure.Persistence.Tests.Repositories;

public sealed class BankRepositoryTests(SqlServerContainerFixture fixture)
    : PersistenceIntegrationTestBase(fixture)
{
    [Fact]
    public async Task Add_FindAsync_GetAsNoTrackingAsync_WorkAgainstSqlServer()
    {
        await using var context = CreateContext();
        var repository = new BankRepository(context);
        var bank = PersistenceTestData.CreateBank("Melli");

        repository.Add(bank);
        await SaveAsync(context);

        var tracked = await repository.FindAsync(bank.Id, TestCancellation);
        var noTracking = await repository.GetAsNoTrackingAsync(bank.Id, TestCancellation);

        tracked.Should().NotBeNull();
        tracked!.Title.Should().Be("Melli");
        noTracking.Should().NotBeNull();
        noTracking!.Title.Should().Be("Melli");
    }

    [Fact]
    public async Task Remove_DeletesEntityFromDatabase()
    {
        await using var context = CreateContext();
        var repository = new BankRepository(context);
        var bank = PersistenceTestData.CreateBank("To Remove");

        repository.Add(bank);
        await SaveAsync(context);

        repository.Remove(bank);
        await SaveAsync(context);

        (await repository.AnyAsync(x => x.Id == bank.Id, TestCancellation)).Should().BeFalse();
    }

    [Fact]
    public async Task GetAllAsync_FiltersByTitleAndIsActive()
    {
        await using var context = CreateContext();
        var repository = new BankRepository(context);

        await PersistenceTestData.SeedBanksAsync(
            context,
            ("Melli Active", true),
            ("Melli Inactive", false),
            ("Sepah Active", true));

        var request = new GetAllBankRequestDto
        {
            Title = "Melli",
            IsActive = true,
            Pagination = PersistenceTestData.Page()
        };

        var result = await repository.GetAllAsync(request);

        result.Items.Should().ContainSingle();
        result.Items[0].Title.Should().Be("Melli Active");
    }

    [Fact]
    public async Task SearchAsync_ReturnsOnlyActiveBanks()
    {
        await using var context = CreateContext();
        var repository = new BankRepository(context);

        await PersistenceTestData.SeedBanksAsync(
            context,
            ("Melli Active", true),
            ("Melli Inactive", false));

        var request = new SearchBankRequestDto
        {
            Title = "Melli",
            Pagination = PersistenceTestData.Page()
        };

        var result = await repository.SearchAsync(request);

        result.Items.Should().ContainSingle();
        result.Items[0].IsActive.Should().BeTrue();
    }

    [Fact]
    public async Task GetAllAsync_WithContentPolicyFilter_AppliesExpressionOnSqlServer()
    {
        await using var context = CreateContext();
        var repository = new BankRepository(context);

        var banks = await PersistenceTestData.SeedBanksAsync(
            context,
            ("Allowed", true),
            ("Denied", true));

        var allowedId = banks[0].Id;

        var request = new GetAllBankRequestDto
        {
            Pagination = PersistenceTestData.Page(pageSize: 10)
        };

        var result = await repository.GetAllAsync(request, x => x.Id == allowedId);

        result.Items.Should().ContainSingle();
        result.Items[0].Title.Should().Be("Allowed");
    }

    [Fact]
    public async Task GetAllAsync_PaginatesOnSqlServer()
    {
        await using var context = CreateContext();
        var repository = new BankRepository(context);

        await PersistenceTestData.SeedBanksAsync(
            context,
            Enumerable.Range(1, 7).Select(i => ($"Bank {i:D2}", true)).ToArray());

        var request = new GetAllBankRequestDto
        {
            Pagination = PersistenceTestData.Page(pageNumber: 2, pageSize: 3)
        };

        var result = await repository.GetAllAsync(request);

        result.Items.Should().HaveCount(3);
        result.PageNumber.Should().Be(2);
        result.TotalPages.Should().Be(3);
    }
}
