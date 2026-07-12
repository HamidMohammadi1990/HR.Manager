using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Infrastructure.Persistence;

namespace JavidHrm.Infrastructure.Persistence.Tests.Support;

internal static class PersistenceTestData
{
    internal sealed record TestPagedRequest : PagedRequest;

    public static Bank CreateBank(string title, string icon = "bank.svg", bool isActive = true)
        => new()
        {
            Title = title,
            Icon = icon,
            IsActive = isActive
        };

    public static TestPagedRequest Page(int pageNumber = 1, int pageSize = 10)
        => new() { PageNumber = pageNumber, PageSize = pageSize };

    public static async Task<List<Bank>> SeedBanksAsync(
        JavidHrmDbContext context,
        params (string Title, bool IsActive)[] banks)
    {
        var entities = banks
            .Select((bank, index) => CreateBank(bank.Title, $"icon-{index}.svg", bank.IsActive))
            .ToList();

        context.Bank.AddRange(entities);
        await context.SaveChangesAsync(TestContext.Current.CancellationToken);
        return entities;
    }
}
